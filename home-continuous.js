/* Linear compositor animation for the idea strip; no per-frame scroll writes. */
(() => {
  'use strict';
  window.createSonalzaContinuousCarousel = function ({gallery, track, cards, prev, next, count, t, isExpanded, speed = 20}) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const rate = Math.max(8, Math.min(36, Number(speed) || 20));
    const rail = document.createElement('div');
    rail.className = 'idea-motion-rail';
    cards.forEach(card => rail.append(card));
    track.append(rail);
    gallery.classList.add('continuous-ideas', 'compositor-ideas');
    const help = document.createElement('p');
    help.id = 'ideas-continuous-help'; help.className = 'continuous-sr-only';
    track.before(help); track.setAttribute('aria-describedby', help.id);
    let copies = [], selected = [], span = 0, step = 0, phase = 0;
    let manual = false, inView = false, animation = null, signature = '';
    let countTimer = 0, manualTimer = 0, pointer = null;
    const normalize = x => span ? ((x % span) + span) % span : 0;
    const autoMode = () => !manual && !reduced.matches && !isExpanded() && span > 0;
    function currentPhase() {
      return animation ? normalize((Number(animation.currentTime) || 0) * rate / 1000) : normalize(track.scrollLeft);
    }
    function state() {
      if (isExpanded()) return 'all';
      if (reduced.matches) return 'reduced';
      if (manual) return 'manual';
      if (!span) return 'static';
      return document.hidden || !inView ? 'waiting' : 'running';
    }
    function renderCount() {
      const total = selected.length;
      const start = total && step ? Math.min(total - 1, Math.floor((currentPhase() + .01) / step)) : 0;
      const amount = Math.min(total, Math.max(1, Math.floor((track.clientWidth + 2) / (step || track.clientWidth || 1))));
      const end = total ? (start + amount - 1) % total : 0;
      const text = isExpanded() ? `${total} ${t('ideas para inspirarte', 'ideas for inspiration')}` : `${String(start + 1).padStart(2,'0')}\u2013${String(end + 1).padStart(2,'0')} / ${total}`;
      if (count.textContent !== text) count.textContent = text;
      prev.disabled = next.disabled = isExpanded() || !span;
      count.setAttribute('aria-live', manual || isExpanded() ? 'polite' : 'off');
    }
    function stopAnimation() {
      if (!animation) return;
      phase = currentPhase();
      animation.cancel(); animation = null;
      rail.style.transform = 'none';
    }
    function copyContent() {
      copies.forEach((copy, i) => {
        const original = selected[i];
        copy.querySelector('a').href = original.querySelector('a').href;
        copy.querySelectorAll('[data-es][data-en]').forEach(n => { n.textContent = n.dataset[document.documentElement.lang === 'en' ? 'en' : 'es']; });
        const image = copy.querySelector('img'), source = original.querySelector('img');
        if (image && source && image.getAttribute('src') !== source.getAttribute('src')) image.src = source.src;
      });
    }
    function rebuild(reset = false) {
      const active = cards.filter(c => !c.hidden);
      const key = `${isExpanded()}|${track.clientWidth}|${active.map(c => c.dataset.idea).join(',')}`;
      if (!reset && key === signature) { copyContent(); return; }
      const oldSpan = span, oldPhase = currentPhase();
      stopAnimation(); clearTimeout(manualTimer);
      signature = key;
      copies.forEach(c => c.remove()); copies = []; selected = active;
      track.classList.remove('is-compositor-driven');
      track.scrollLeft = 0; span = 0; step = 0;
      if (!isExpanded() && selected.length > 1) {
        const first = selected[0].getBoundingClientRect();
        const last = selected[selected.length - 1].getBoundingClientRect();
        step = selected[1].getBoundingClientRect().left - first.left;
        if (last.right - first.left > track.clientWidth + 2 && step > 0) {
          selected.forEach((original, i) => {
            const copy = original.cloneNode(true);
            copy.dataset.loopCopy = String(i); copy.dataset.loopIdea = original.dataset.idea;
            copy.removeAttribute('data-idea'); copy.removeAttribute('aria-label');
            copy.removeAttribute('role'); copy.removeAttribute('aria-roledescription');
            copy.setAttribute('aria-hidden', 'true');
            copy.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
            copy.querySelectorAll('a,button,input,select,[tabindex]').forEach(n => { n.tabIndex = -1; });
            const image = copy.querySelector('img');
            if (image) { image.loading = 'eager'; image.style.objectPosition = getComputedStyle(original.querySelector('img')).objectPosition; }
            copy.querySelector('a').addEventListener('click', event => {
              if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault(); original.querySelector('a').click();
              }
            });
            rail.append(copy); copies.push(copy);
          });
          span = copies[0].getBoundingClientRect().left - selected[0].getBoundingClientRect().left;
        }
      }
      phase = reset ? 0 : oldSpan && span ? oldPhase / oldSpan * span : 0;
      track.scrollLeft = phase;
      gallery.dataset.loopSpan = String(span);
    }
    function sync() {
      rebuild();
      const status = state();
      gallery.dataset.motionState = status;
      gallery.dataset.motionMode = 'continuous';
      gallery.dataset.motionEngine = 'compositor-transform';
      gallery.dataset.pixelsPerSecond = String(rate);
      help.textContent = t('Las ideas se deslizan suavemente. Las flechas detienen el avance para explorar a tu ritmo. Tambi\u00e9n puedes ver todas las ideas.', 'Ideas scroll gently. The arrows stop automatic movement so you can explore at your own pace. You can also view all ideas.');
      prev.setAttribute('aria-label', t('Ideas anteriores; detener avance y explorar','Previous ideas; stop automatic movement and explore'));
      next.setAttribute('aria-label', t('Ideas siguientes; detener avance y explorar','Next ideas; stop automatic movement and explore'));
      clearInterval(countTimer); countTimer = 0;
      if (autoMode()) {
        track.classList.add('is-compositor-driven');
        if (!animation) {
          track.scrollLeft = 0;
          rail.style.transform = 'none';
          animation = rail.animate([
            {transform: 'translate3d(0,0,0)'},
            {transform: `translate3d(${-span}px,0,0)`}
          ], {duration: span / rate * 1000, iterations: Infinity, easing: 'linear', fill: 'both'});
          animation.pause(); animation.currentTime = phase / rate * 1000;
        }
        if (status === 'running') { animation.play(); countTimer = setInterval(renderCount, 250); }
        else animation.pause();
      } else {
        if (animation) { stopAnimation(); track.scrollLeft = phase; }
        track.classList.remove('is-compositor-driven');
      }
      renderCount();
    }
    function pause() {
      if (manual) return;
      manual = true;
      sync();
    }
    function reset() { rebuild(true); sync(); }
    function move(delta) {
      if (!span || isExpanded()) return;
      pause(); clearTimeout(manualTimer);
      let x = normalize(track.scrollLeft);
      let index = delta > 0 ? Math.floor(x / step + .01) + 1 : Math.ceil(x / step - .01) - 1;
      if (index < 0) { x += span; track.scrollLeft = x; index = selected.length - 1; }
      const target = Math.min(span, Math.max(0, index * step));
      track.scrollTo({left: target, behavior: reduced.matches ? 'instant' : 'smooth'});
      manualTimer = setTimeout(() => { phase = normalize(track.scrollLeft); track.scrollLeft = phase; renderCount(); }, reduced.matches ? 0 : 650);
    }
    track.addEventListener('scroll', () => { if (!animation) renderCount(); }, {passive:true});
    track.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) pause(); }, {passive:true});
    track.addEventListener('pointerdown', e => { pointer = {x:e.clientX,y:e.clientY}; }, {passive:true});
    track.addEventListener('pointermove', e => {
      if (pointer && Math.abs(e.clientX-pointer.x)>12 && Math.abs(e.clientX-pointer.x)>Math.abs(e.clientY-pointer.y)) pause();
    }, {passive:true});
    const release = () => { pointer = null; };
    track.addEventListener('pointerup',release,{passive:true});track.addEventListener('pointercancel',release,{passive:true});
    track.addEventListener('focusin', e => {
      if (!e.target.matches(':focus-visible')) return;
      pause();
      const card = e.target.closest('.idea-card');
      if (card) {
        const a = card.getBoundingClientRect(), b = track.getBoundingClientRect();
        if (a.left < b.left || a.right > b.right) track.scrollLeft += a.left - b.left;
      }
    });
    // Hover, audio playback, vertical wheel and unrelated clicks do not alter motion.
    document.addEventListener('visibilitychange',sync); reduced.addEventListener('change',sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView=entries[0].isIntersecting;sync(); }, {threshold:0}).observe(track);
    else inView = true;
    return {sync,pause,move,reset,renderCount,state};
  };
})();
