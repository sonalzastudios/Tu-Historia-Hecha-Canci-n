/* Continuous inspiration strip. Hero, audio, checkout and record are independent. */
(() => {
  'use strict';
  window.createSonalzaContinuousCarousel = function ({gallery, track, cards, prev, next, count, t, isExpanded, speed = 20}) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const rate = Math.max(8, Math.min(36, Number(speed) || 20));
    let copies = [], selected = [], span = 0, step = 0, phase = 0;
    let manual = false, inView = false, frame = 0, lastTime = 0, signature = '', lastCount = 0;
    let transitionTimer = 0, dragging = null, rebuilding = false;
    gallery.classList.add('continuous-ideas');
    const instructions = document.createElement('p');
    instructions.id = 'ideas-continuous-help';
    instructions.className = 'continuous-sr-only';
    track.before(instructions);
    track.setAttribute('aria-describedby', instructions.id);
    function state() {
      if (isExpanded()) return 'all';
      if (reduced.matches) return 'reduced';
      if (manual) return 'manual';
      if (!span) return 'static';
      if (document.hidden || !inView) return 'waiting';
      return 'running';
    }
    function normalize(value) { return span ? ((value % span) + span) % span : 0; }
    function renderCount(force = false) {
      const now = performance.now();
      if (!force && now - lastCount < 100) return;
      lastCount = now;
      const total = selected.length;
      const start = step ? Math.min(total - 1, Math.floor((normalize(track.scrollLeft) + 1) / step)) : 0;
      const amount = Math.min(total, Math.max(1, Math.floor((track.clientWidth + 2) / (step || track.clientWidth))));
      const end = total ? ((start + amount - 1) % total) : 0;
      const text = isExpanded() ? `${total} ${t('ideas para inspirarte', 'ideas for inspiration')}` : `${String(start + 1).padStart(2, '0')}\u2013${String(end + 1).padStart(2, '0')} / ${total}`;
      if (count.textContent !== text) count.textContent = text;
      prev.disabled = next.disabled = isExpanded() || !span;
      count.setAttribute('aria-live', manual || isExpanded() ? 'polite' : 'off');
    }
    function copyLinksAndText() {
      copies.forEach((copy, i) => {
        const source = selected[i];
        const a = copy.querySelector('a');
        a.href = source.querySelector('a').href;
        copy.querySelectorAll('[data-es][data-en]').forEach(n => { n.textContent = n.dataset[document.documentElement.lang === 'en' ? 'en' : 'es']; });
        const img = copy.querySelector('img'), original = source.querySelector('img');
        if (img && original && img.getAttribute('src') !== original.getAttribute('src')) img.src = original.src;
      });
    }
    function rebuild(reset = false) {
      const active = cards.filter(c => !c.hidden);
      const key = `${isExpanded()}|${track.clientWidth}|${active.map(c => c.dataset.idea).join(',')}`;
      if (!reset && key === signature) { copyLinksAndText(); return; }
      signature = key; rebuilding = true;
      const oldSpan = span, oldPhase = normalize(track.scrollLeft);
      copies.forEach(c => c.remove()); copies = [];
      selected = active; span = 0; step = 0;
      if (!isExpanded() && selected.length > 1) {
        const first = selected[0].getBoundingClientRect(), last = selected.at(-1).getBoundingClientRect();
        const naturalWidth = last.right - first.left;
        step = selected[1].getBoundingClientRect().left - first.left;
        if (naturalWidth > track.clientWidth + 2 && step > 0) {
          selected.forEach((original, i) => {
            const copy = original.cloneNode(true);
            copy.dataset.loopCopy = String(i);
            copy.dataset.loopIdea = original.dataset.idea;
            copy.removeAttribute('data-idea');
            copy.removeAttribute('aria-label');
            copy.setAttribute('aria-hidden', 'true');
            copy.removeAttribute('role');
            copy.removeAttribute('aria-roledescription');
            copy.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
            copy.querySelectorAll('a,button,input,select,[tabindex]').forEach(n => n.tabIndex = -1);
            const img = copy.querySelector('img');
            if (img) { img.loading = 'eager'; img.style.objectPosition = getComputedStyle(original.querySelector('img')).objectPosition; }
            // Mouse/touch copies use the original link so existing locale/attribution handlers still run.
            copy.querySelector('a').addEventListener('click', event => {
              if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                event.preventDefault(); original.querySelector('a').click();
              }
            });
            track.append(copy); copies.push(copy);
          });
          span = copies[0].getBoundingClientRect().left - selected[0].getBoundingClientRect().left;
        }
      }
      phase = reset ? 0 : (oldSpan && span ? oldPhase / oldSpan * span : 0);
      track.scrollLeft = phase;
      gallery.dataset.loopSpan = String(span);
      rebuilding = false;
      renderCount(true);
    }
    function tick(time) {
      frame = 0;
      if (state() !== 'running') { lastTime = 0; return; }
      if (lastTime) {
        // Keep a fractional position instead of accumulating rounded scrollLeft values.
        phase = normalize(phase + rate * Math.min(time - lastTime, 80) / 1000);
        track.scrollLeft = phase;
      }
      lastTime = time;
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      rebuild();
      const current = state();
      gallery.dataset.motionState = current;
      gallery.dataset.motionMode = 'continuous';
      gallery.dataset.pixelsPerSecond = String(rate);
      instructions.textContent = t('Las ideas se deslizan suavemente. Usa las flechas para detener el avance y explorar a tu ritmo, o abre todas las ideas.', 'Ideas scroll gently. Use the arrows to stop automatic movement and explore at your own pace, or view all ideas.');
      prev.setAttribute('aria-label', t('Ideas anteriores; detener avance y explorar', 'Previous ideas; stop automatic movement and explore'));
      next.setAttribute('aria-label', t('Ideas siguientes; detener avance y explorar', 'Next ideas; stop automatic movement and explore'));
      if (current === 'running') { phase = normalize(track.scrollLeft); if (!frame) { lastTime = 0; frame = requestAnimationFrame(tick); } }
      else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      renderCount(true);
    }
    function pause() { manual = true; sync(); }
    function reset() { clearTimeout(transitionTimer); rebuild(true); sync(); }
    function move(delta) {
      if (!span || isExpanded()) return;
      pause(); clearTimeout(transitionTimer);
      let x = normalize(track.scrollLeft);
      let index = delta > 0 ? Math.floor(x / step + .01) + 1 : Math.ceil(x / step - .01) - 1;
      if (index < 0) { x += span; track.scrollLeft = x; index = selected.length - 1; }
      const target = Math.min(span, Math.max(0, index * step));
      track.scrollTo({left: target, behavior: reduced.matches ? 'instant' : 'smooth'});
      transitionTimer = setTimeout(() => { phase = normalize(track.scrollLeft); track.scrollLeft = phase; renderCount(true); }, reduced.matches ? 0 : 650);
    }
    track.addEventListener('scroll', () => { if (!rebuilding) renderCount(); }, {passive: true});
    // No hover, audio, vertical-wheel, general-click or pointer-focus pause handlers.
    track.addEventListener('wheel', event => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) > 2) pause(); }, {passive: true});
    track.addEventListener('pointerdown', event => { dragging = {x:event.clientX,y:event.clientY}; }, {passive:true});
    track.addEventListener('pointermove', event => {
      if (dragging && Math.abs(event.clientX-dragging.x)>12 && Math.abs(event.clientX-dragging.x)>Math.abs(event.clientY-dragging.y)) pause();
    }, {passive:true});
    const release = () => { dragging = null; };
    track.addEventListener('pointerup', release, {passive:true});track.addEventListener('pointercancel', release, {passive:true});
    // Keyboard users and reduced-motion users are never forced to chase a moving link.
    track.addEventListener('focusin', event => { if (event.target.matches(':focus-visible')) pause(); });
    document.addEventListener('visibilitychange', sync);reduced.addEventListener('change', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, {threshold:0}).observe(track);
    else inView = true;
    return {sync, pause, move, reset, renderCount, state};
  };
})();
