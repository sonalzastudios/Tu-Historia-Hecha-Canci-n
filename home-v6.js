/* SONALZA V6: JSON-driven art direction and actual browser motion. */
(() => {
  'use strict';
  const root=document.documentElement;
  const scriptBase=new URL('.',document.currentScript.src);
  function loadCore(){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('home-core-v4.js',scriptBase).href;s.onload=resolve;s.onerror=()=>reject(new Error('Core unavailable'));document.head.append(s);});}
  async function start(){
    const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),6000);
    try{
      const response=await fetch(new URL('home-v6.config.json',scriptBase),{credentials:'same-origin',cache:'no-cache',signal:abort.signal});
      if(!response.ok)throw new Error('Config unavailable');
      const config=await response.json();
      if(config.version!==6||!Array.isArray(config.ideas)||config.ideas.length!==15||!Array.isArray(config.hero))throw new Error('Invalid config');
      initialize(config);
    }catch(_){root.dataset.homeEnhancementError='true';console.error('SONALZA homepage enhancements unavailable');}
    finally{clearTimeout(timeout);}
    try{await loadCore();window.dispatchEvent(new Event('sonalza:core-ready'));}catch(_){root.dataset.homeLoadError='true';}
  }
  function initialize(config){
    root.dataset.homeVersion='6';
    for(const [name,key] of [['--menu-desktop','desktopMenuPx'],['--menu-mobile','mobileMenuPx'],['--control-size','controlPx']]){const n=Number(config.typography[key]);if(Number.isFinite(n))root.style.setProperty(name,Math.min(22,Math.max(12,n))+'px');}
    const ideas=config.ideas;
    const photo=(id,width=700)=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&q=82`;
    const lang=()=>root.lang==='en'?'en':'es';
    const t=(es,en)=>lang()==='en'?en:es;
    const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
    function pair(tag,cls,es,en){const n=el(tag,cls);n.dataset.es=es;n.dataset.en=en;n.textContent=t(es,en);return n;}
    const section=document.getElementById('dedicar');if(!section)return;
    section.setAttribute('aria-labelledby','ideas-title');section.querySelector('h2').id='ideas-title';
    section.querySelector('.section-intro').replaceChildren(pair('span','',config.copy.ideasIntro.es,config.copy.ideasIntro.en));
    const gallery=el('div','idea-carousel');gallery.id='idea-carousel';gallery.setAttribute('role','region');gallery.setAttribute('aria-labelledby','ideas-title');gallery.setAttribute('aria-roledescription','carousel');
    const toolbar=el('div','idea-toolbar'),filters=el('div','idea-filters');filters.setAttribute('role','group');
    [['all','Todas las ideas','All ideas'],['family','Mi familia','My family'],['love','Mi amor','My love'],['celebrate','Celebrar','Celebrate'],['styles','Mi ritmo','My rhythm']].forEach(([id,es,en])=>{const b=pair('button','idea-filter',es,en);b.type='button';b.dataset.filter=id;b.setAttribute('aria-pressed',String(id==='all'));filters.append(b);});
    const controls=el('div','idea-controls');
    const ideaStatus=el('span','motion-status');ideaStatus.id='ideas-motion-status';
    const pause=el('button','idea-pause');pause.id='ideas-pause';pause.type='button';pause.setAttribute('aria-controls','ideas-track');
    const prev=el('button','idea-arrow','\u2190');prev.type='button';prev.id='ideas-prev';prev.setAttribute('aria-controls','ideas-track');
    const next=el('button','idea-arrow','\u2192');next.type='button';next.id='ideas-next';next.setAttribute('aria-controls','ideas-track');
    controls.append(ideaStatus,pause,prev,next);toolbar.append(controls,filters);
    const track=el('div','idea-track');track.id='ideas-track';track.tabIndex=0;
    const cards=[];
    ideas.forEach((idea,i)=>{
      const card=el('article','idea-card');card.dataset.idea=idea.id;card.dataset.group=idea.group;card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
      const a=el('a','idea-link');a.dataset.cta='idea-'+idea.id;
      const pic=el('div','idea-photo');pic.style.setProperty('--photo-position',idea.pos);
      const img=el('img','editorial-photo');img.alt='';img.loading=i<4?'eager':'lazy';img.decoding='async';img.width=600;img.height=720;img.referrerPolicy='no-referrer';img.dataset.esPhoto=idea.img;img.dataset.enPhoto=idea.enImg||idea.img;
      pic.append(img,el('span','idea-number',String(i+1).padStart(2,'0')),pair('span','idea-tag',idea.tagEs,idea.tagEn));
      const copy=el('div','idea-copy');copy.append(pair('h3','',idea.es,idea.en),pair('p','',idea.descEs,idea.descEn),pair('span','idea-action',idea.id==='hiphop'?'Pedir este estilo':'Crear esta canci\u00f3n',idea.id==='hiphop'?'Request this style':'Create this song'));
      a.append(pic,copy);card.append(a);track.append(card);cards.push(card);
    });
    const foot=el('div','idea-foot'),count=el('span','idea-count');count.id='ideas-count';count.setAttribute('role','status');count.setAttribute('aria-live','off');
    const all=pair('button','idea-all','Ver todas las ideas','See all ideas');all.type='button';all.id='ideas-all';all.setAttribute('aria-expanded','false');all.setAttribute('aria-controls','ideas-track');
    const custom=pair('a','idea-custom-link',config.copy.customIdea.es,config.copy.customIdea.en);custom.dataset.cta='custom-idea';custom.href='create.html?product=song';
    foot.append(count,all,custom);gallery.append(toolbar,track,foot);section.querySelector('.occasion-grid').replaceWith(gallery);
    const listening=document.getElementById('escuchar');section.before(listening);
    const listenIntro=listening.querySelector('.section-intro');
    if(listenIntro)listenIntro.replaceChildren(pair('span','','Dale play. Estas cuatro muestras son de SONALZA; tu canci\u00f3n llevar\u00e1 tu propia historia.','Press play. These four samples are by SONALZA; your song will tell your own story.'));
    listening.querySelectorAll('.play').forEach(b=>{
      b.classList.add('sample-play-v5');b.append(pair('span','play-caption','Escuchar','Listen'));
      new MutationObserver(()=>{const playing=b.getAttribute('aria-pressed')==='true',caption=b.querySelector('.play-caption');caption.dataset.es=playing?'Pausar':'Escuchar';caption.dataset.en=playing?'Pause':'Listen';caption.textContent=t(caption.dataset.es,caption.dataset.en);}).observe(b,{attributes:true,attributeFilter:['aria-pressed']});
    });
    const badges=el('div','heritage-chips');['Corrido','Cumbia','Banda','Mariachi'].forEach(x=>badges.append(el('span','',x)));
    document.querySelector('.hero-copy .hero-description').after(badges);
    document.querySelector('.hero-description').replaceChildren(pair('span','','Una cumbia con su nombre. Un corrido con tu historia. Una canci\u00f3n para decir lo que llevas en el coraz\u00f3n.','A cumbia with their name. A corrido with your story. A personal song for the words that matter.'));
    const closing=document.querySelector('.final-cta img');if(closing){closing.dataset.esPhoto='6532607';closing.dataset.enPhoto='7951784';closing.dataset.photoWidth='1000';}
    const credit=document.querySelector('.photo-note');if(credit)credit.replaceChildren(pair('span','',config.copy.photoNotice.es,config.copy.photoNotice.en));
    const audio=document.getElementById('sample-audio'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),controllers=[];
    let expanded=false;
    function makeController({region,hoverTarget,button,status,interval,advance,enabled=()=>true}){
      let userPaused=false,focusPaused=false,hovering=false,inView=false,timer=0,forced=false;
      function reason(){
        if(!enabled())return 'all';if(reduced.matches)return 'reduced';if(userPaused||focusPaused)return 'paused';
        if(document.hidden||!inView)return 'waiting';if(!audio.paused)return 'audio';if(hovering&&!forced)return 'hover';return 'running';
      }
      const labels={all:['Todas a la vista','All in view'],reduced:['Movimiento reducido','Reduced motion'],paused:['Pausado','Paused'],waiting:['En espera','Waiting'],audio:['Escuchando muestra','Playing sample'],hover:['Pausa al explorar','Paused while browsing'],running:['Avance autom\u00e1tico','Auto-playing']};
      function sync(){
        clearTimeout(timer);const state=reason();region.dataset.motionState=state;const running=state==='running';
        status.textContent=t(...labels[state]);button.textContent=running?t('\u275a\u275a Pausar','\u275a\u275a Pause'):t('\u25b6 Reanudar','\u25b6 Resume');
        button.setAttribute('aria-label',running?t('Pausar avance autom\u00e1tico','Pause automatic rotation'):t('Reanudar avance autom\u00e1tico','Resume automatic rotation'));
        button.disabled=state==='reduced'||state==='all';
        if(running)timer=setTimeout(()=>{advance();sync();},interval);
      }
      function pause(){userPaused=true;forced=false;sync();}
      button.addEventListener('click',()=>{if(reason()==='running')userPaused=true;else{userPaused=false;focusPaused=false;forced=true;}sync();});
      hoverTarget.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;forced=false;sync();}});
      hoverTarget.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovering=false;forced=false;sync();}});
      region.addEventListener('focusin',e=>{if(e.target!==button){focusPaused=true;forced=false;sync();}});
      document.addEventListener('visibilitychange',sync);audio.addEventListener('play',sync);audio.addEventListener('pause',sync);audio.addEventListener('ended',sync);reduced.addEventListener('change',sync);
      if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:.12});observer.observe(hoverTarget);}else{inView=true;sync();}
      const result={sync,pause,state:reason};controllers.push(result);return result;
    }
    let continuousMotion=null;
    function visible(){return cards.filter(c=>!c.hidden);}
    function position(){const a=visible(),left=track.getBoundingClientRect().left;let nearest=0,distance=Infinity;a.forEach((c,i)=>{const d=Math.abs(c.getBoundingClientRect().left-left);if(d<distance){nearest=i;distance=d;}});return nearest;}
    function countRender(){
      if(continuousMotion){continuousMotion.renderCount();return;}
      const a=visible(),rect=track.getBoundingClientRect();const fullyVisible=a.filter(c=>{const r=c.getBoundingClientRect();return r.left>=rect.left-4&&r.right<=rect.right+4;});
      const current=position()+1,last=Math.min(a.length,current+Math.max(fullyVisible.length,1)-1);
      count.textContent=expanded?`${a.length} ${t('ideas para inspirarte','ideas for inspiration')}`:`${String(current).padStart(2,'0')}\u2013${String(last).padStart(2,'0')} / ${a.length}`;
      prev.disabled=next.disabled=expanded||track.scrollWidth<=track.clientWidth+4;count.setAttribute('aria-live',gallery.dataset.motionState==='running'?'off':'polite');
    }
    function move(delta,automatic=false){
      if(continuousMotion){continuousMotion.move(delta);return;}
      const a=visible();if(a.length<2||expanded)return;const max=track.scrollWidth-track.clientWidth,current=position();let target;
      if(delta>0&&track.scrollLeft>=max-4)target=0;else if(delta<0&&track.scrollLeft<=4)target=max;else{const i=Math.max(0,Math.min(a.length-1,current+delta));target=track.scrollLeft+a[i].getBoundingClientRect().left-track.getBoundingClientRect().left;}
      track.scrollTo({left:Math.min(max,Math.max(0,target)),behavior:reduced.matches?'instant':'smooth'});if(!automatic)ideaMotion.pause();setTimeout(countRender,550);
    }
    if(typeof window.createSonalzaContinuousCarousel==='function'){
      continuousMotion=window.createSonalzaContinuousCarousel({gallery,track,cards,prev,next,count,t,isExpanded:()=>expanded,speed:config.motion.ideasPixelsPerSecond});
      pause.hidden=true;ideaStatus.hidden=true;controllers.push(continuousMotion);
    }
    const ideaMotion=continuousMotion||makeController({region:gallery,hoverTarget:track,button:pause,status:ideaStatus,interval:config.motion.ideasIntervalMs,advance:()=>move(1,true),enabled:()=>!expanded&&track.scrollWidth>track.clientWidth+4});
    filters.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const filter=b.dataset.filter;if(!continuousMotion)ideaMotion.pause();filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cards.forEach(c=>c.hidden=filter!=='all'&&c.dataset.group!==filter);track.scrollTo({left:0,behavior:'instant'});if(continuousMotion)continuousMotion.reset();countRender();ideaMotion.sync();}));
    prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    all.addEventListener('click',()=>{if(!continuousMotion)ideaMotion.pause();expanded=!expanded;gallery.classList.toggle('expanded',expanded);all.setAttribute('aria-expanded',String(expanded));track.scrollTo({left:0,behavior:'instant'});if(continuousMotion)continuousMotion.reset();localized();ideaMotion.sync();});
    // Legacy interactions are only retained if the continuous enhancement fails to load.
    if(!continuousMotion){
    track.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY))ideaMotion.pause();},{passive:true});
    let pointerStart=null;
    track.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};},{passive:true});
    track.addEventListener('pointerup',e=>{if(pointerStart&&Math.abs(e.clientX-pointerStart.x)>20&&Math.abs(e.clientX-pointerStart.x)>Math.abs(e.clientY-pointerStart.y))ideaMotion.pause();pointerStart=null;},{passive:true});
    }
    track.addEventListener('scroll',countRender,{passive:true});track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
    // Hero photos rotate separately. The catalog sample remains accurately labeled.
    const stage=document.querySelector('.hero-stage');stage.classList.add('hero-slideshow-v6');stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');
    const photoWrap=stage.querySelector('.hero-photo');photoWrap.querySelector('img').remove();stage.querySelector('.hero-tag').hidden=true;stage.querySelector('.hero-caption').hidden=true;
    const heroSlides=[],heroTabs=[];
    config.hero.forEach((slide,i)=>{
      const idea=ideas.find(x=>x.id===slide.idea);if(!idea)throw new Error('Unknown hero idea');
      const frame=el('div','hero-slide'+(i===0?' is-active':''));frame.dataset.heroIdea=idea.id;frame.setAttribute('aria-hidden',String(i!==0));
      const img=el('img','editorial-photo');img.alt='';img.width=1200;img.height=1000;img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';img.style.objectPosition=slide.position;img.fetchPriority=i===0?'high':'low';
      img.dataset.esPhoto=idea.img;img.dataset.enPhoto=idea.enImg||idea.img;img.dataset.photoWidth='1100';frame.append(img);photoWrap.prepend(frame);heroSlides.push(frame);
    });
    const slideCaption=el('div','hero-slide-caption'),slideLabel=pair('small','',config.hero[0].label.es,config.hero[0].label.en),slideLine=pair('strong','',config.hero[0].line.es,config.hero[0].line.en);
    const slideLink=pair('a','hero-slide-link','Crear esta canci\u00f3n \u2197','Create this song \u2197');slideLink.dataset.cta='hero-idea';slideCaption.append(slideLabel,slideLine,slideLink);photoWrap.append(slideCaption);
    const heroToolbar=el('div','hero-motion-bar'),heroControls=el('div','hero-motion-controls');
    const heroPause=el('button','hero-motion-pause');heroPause.id='hero-pause';heroPause.type='button';
    const heroStatus=el('span','motion-status');heroStatus.id='hero-motion-status';
    const heroPrev=el('button','hero-motion-arrow','\u2190');heroPrev.id='hero-prev';heroPrev.type='button';
    const heroNext=el('button','hero-motion-arrow','\u2192');heroNext.id='hero-next';heroNext.type='button';heroControls.append(heroPause,heroPrev,heroNext);heroToolbar.append(heroStatus,heroControls);stage.append(heroToolbar);
    const previews=el('div','hero-previews');previews.setAttribute('role','group');stage.append(previews);
    config.hero.forEach((slide,i)=>{
      const idea=ideas.find(x=>x.id===slide.idea),b=el('button','hero-preview');b.type='button';b.dataset.heroIndex=String(i);b.setAttribute('aria-pressed',String(i===0));
      const img=el('img');img.alt='';img.width=68;img.height=68;img.loading='eager';img.referrerPolicy='no-referrer';img.dataset.esPhoto=idea.img;img.dataset.enPhoto=idea.enImg||idea.img;img.dataset.photoWidth='180';img.style.objectPosition=slide.position;
      b.append(img,pair('span','',slide.label.es,slide.label.en));previews.append(b);heroTabs.push(b);
    });
    let heroIndex=0;
    function heroRender(){
      const slide=config.hero[heroIndex];heroSlides.forEach((frame,i)=>{frame.classList.toggle('is-active',i===heroIndex);frame.setAttribute('aria-hidden',String(i!==heroIndex));});
      heroTabs.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===heroIndex));b.setAttribute('aria-label',t('Ver: ','Show: ')+config.hero[i].label[lang()]);});
      slideLabel.dataset.es=slide.label.es;slideLabel.dataset.en=slide.label.en;slideLabel.textContent=slide.label[lang()];slideLine.dataset.es=slide.line.es;slideLine.dataset.en=slide.line.en;slideLine.textContent=slide.line[lang()];
      slideLink.href=ideaURL(ideas.find(x=>x.id===slide.idea));stage.dataset.activeSlide=String(heroIndex);stage.dataset.activeIdea=slide.idea;
    }
    function heroMove(delta,manual=false){heroIndex=(heroIndex+delta+config.hero.length)%config.hero.length;heroRender();if(manual)heroMotion.pause();}
    const heroMotion=makeController({region:stage,hoverTarget:photoWrap,button:heroPause,status:heroStatus,interval:config.motion.heroIntervalMs,advance:()=>heroMove(1)});
    heroPrev.addEventListener('click',()=>heroMove(-1,true));heroNext.addEventListener('click',()=>heroMove(1,true));
    heroTabs.forEach((b,i)=>b.addEventListener('click',()=>{heroIndex=i;heroRender();heroMotion.pause();}));
    heroTabs.forEach((b,i)=>b.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const nextIndex=(i+(e.key==='ArrowRight'?1:-1)+heroTabs.length)%heroTabs.length;heroTabs[nextIndex].focus();heroTabs[nextIndex].click();}}));
    // Decorative real CSS rotation. Motion is optional and never plays audio.
    const shell=document.querySelector('.story-shell');shell.classList.add('record-sleeve');
    const vinyl=el('div','dedication-vinyl');vinyl.setAttribute('aria-hidden','true');const center=el('div','vinyl-center');center.append(el('span','','S'),el('i','vinyl-spindle'));vinyl.append(center);shell.prepend(vinyl);vinyl.style.animationDuration=config.motion.vinylPeriodSeconds+'s';
    const vinylPause=el('button','vinyl-pause');vinylPause.id='vinyl-pause';vinylPause.type='button';shell.append(vinylPause);
    let vinylStopped=false,vinylInView=false;
    function vinylSync(){
      const running=!vinylStopped&&!reduced.matches&&!document.hidden&&vinylInView;vinyl.style.animationPlayState=running?'running':'paused';vinyl.dataset.motionState=running?'running':'paused';
      vinylPause.textContent=running?t('\u275a\u275a Pausar vinilo','\u275a\u275a Pause record'):t('\u25b6 Girar vinilo','\u25b6 Spin record');vinylPause.disabled=reduced.matches;
      if(reduced.matches)vinylPause.textContent=t('Movimiento reducido','Reduced motion');
    }
    vinylPause.addEventListener('click',()=>{vinylStopped=!vinylStopped;vinylSync();});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{vinylInView=entries[0].isIntersecting;vinylSync();},{threshold:.1}).observe(shell);else vinylInView=true;
    reduced.addEventListener('change',vinylSync);document.addEventListener('visibilitychange',vinylSync);
    function ideaURL(idea){
      const q=new URLSearchParams({product:'song',...(idea?.query||{}),...(idea?{idea:idea.id}:{}),lang:lang()});
      const params=new URLSearchParams(location.search);let saved={};try{saved=JSON.parse(sessionStorage.getItem('sonalzaHomeAttributionV1')||'{}').values||{};}catch(_){}
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(k=>{const value=params.get(k)||saved[k];if(typeof value==='string')q.set(k,value.slice(0,256));});return 'create.html?'+q;
    }
    function localized(){
      document.querySelectorAll('[data-es][data-en]').forEach(n=>n.textContent=n.dataset[lang()]);filters.setAttribute('aria-label',t('Filtrar ideas','Filter ideas'));track.setAttribute('aria-label',t('Ideas de canci\u00f3n; usa las flechas o desliza','Song ideas; use the arrows or swipe'));
      prev.setAttribute('aria-label',t('Ideas anteriores','Previous ideas'));next.setAttribute('aria-label',t('Ideas siguientes','Next ideas'));heroPrev.setAttribute('aria-label',t('Idea anterior de portada','Previous featured idea'));heroNext.setAttribute('aria-label',t('Idea siguiente de portada','Next featured idea'));
      stage.setAttribute('aria-label',t('Ideas para tu canci\u00f3n','Ideas for your song'));previews.setAttribute('aria-label',t('Elegir imagen de portada','Choose featured image'));
      ideas.forEach((idea,i)=>{cards[i].querySelector('a').href=ideaURL(idea);cards[i].setAttribute('aria-label',`${i+1} ${t('de','of')} ${ideas.length}: ${lang()==='en'?idea.en:idea.es}`);});custom.href=ideaURL(null);
      document.querySelectorAll('[data-es-photo]').forEach(img=>{const id=lang()==='en'?img.dataset.enPhoto:img.dataset.esPhoto;const width=Number(img.dataset.photoWidth)||650;const src=photo(id,width);if(img.getAttribute('src')!==src)img.src=src;});
      all.textContent=expanded?t('Volver al carrusel','Back to carousel'):t('Ver todas las ideas','See all ideas');all.dataset.es=expanded?'Volver al carrusel':'Ver todas las ideas';all.dataset.en=expanded?'Back to carousel':'See all ideas';
      heroRender();countRender();controllers.forEach(c=>c.sync());vinylSync();
    }
    new MutationObserver(localized).observe(root,{attributes:true,attributeFilter:['lang']});window.addEventListener('resize',()=>{countRender();controllers.forEach(c=>c.sync());},{passive:true});
    const resizeObserver=new ResizeObserver(()=>{countRender();ideaMotion.sync();});resizeObserver.observe(track);
    localized();window.addEventListener('sonalza:core-ready',()=>{localized();root.dataset.v5Ready='true';root.dataset.v6Ready='true';});
  }
  start();
})();
