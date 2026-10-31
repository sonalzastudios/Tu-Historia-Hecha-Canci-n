/* Visual polish only. No changes to prices, stories, checkout or catalog audio. */
(() => {
  'use strict';
  function decorate() {
    const root=document.documentElement;
    if(root.dataset.motionPolishReady==='true')return;
    const stage=document.querySelector('.hero-slideshow-v6');
    const previews=stage?.querySelector('.hero-previews');
    const bar=stage?.querySelector('.hero-motion-bar');
    if(!stage||!previews||!bar)return;
    const status=document.getElementById('hero-motion-status');
    if(status){status.hidden=true;status.setAttribute('aria-hidden','true');}
    previews.classList.add('hero-dots');
    previews.querySelectorAll('.hero-preview').forEach(button=>{
      // Retain the original button and listeners, including localized accessible names.
      const dot=document.createElement('span');dot.className='hero-dot';dot.setAttribute('aria-hidden','true');
      button.replaceChildren(dot);
    });
    bar.prepend(previews);
    const shell=document.querySelector('.record-sleeve');
    const vinyl=shell?.querySelector('.dedication-vinyl');
    if(shell&&vinyl){
      const notes=document.createElement('div');notes.className='vinyl-notes';notes.setAttribute('aria-hidden','true');
      ['\u266a','\u266b','\u2669','\u266a'].forEach((symbol,i)=>{
        const note=document.createElement('span');note.className='vinyl-note';note.textContent=symbol;
        note.style.setProperty('--note-delay',`${-i*1.4}s`);note.style.setProperty('--note-drift',`${[9,-12,17,-7][i]}px`);
        notes.append(note);
      });
      shell.append(notes);
      function place(){
        notes.style.left=vinyl.offsetLeft+'px';notes.style.top=vinyl.offsetTop+'px';
        notes.style.width=vinyl.offsetWidth+'px';notes.style.height=vinyl.offsetHeight+'px';
      }
      function motion(){shell.dataset.decorationMotion=vinyl.dataset.motionState==='running'?'running':'paused';}
      new MutationObserver(motion).observe(vinyl,{attributes:true,attributeFilter:['data-motion-state']});
      if('ResizeObserver' in window)new ResizeObserver(place).observe(vinyl);
      window.addEventListener('resize',place,{passive:true});
      place();motion();
    }
    root.dataset.motionPolishReady='true';
  }
  window.addEventListener('sonalza:core-ready',()=>queueMicrotask(decorate));
  if(document.documentElement.dataset.v6Ready==='true')decorate();
})();
