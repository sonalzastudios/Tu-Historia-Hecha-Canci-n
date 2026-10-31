/* SONALZA V5: bilingual inspiration carousel. No payment or API mutations. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.dataset.homeVersion = '5';
  const photo = (id, width=700) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&q=82`;
  const ideas = [
    {id:'mama',group:'family',es:'Para mam\u00e1',en:'For mom',descEs:'Por todo lo que hizo. Y lo que sigue haciendo.',descEn:'For everything she did. And everything she still does.',tagEs:'Banda \u00b7 balada',tagEn:'Banda \u00b7 ballad',img:16880087,enImg:7951784,query:{relation:'Mam\u00e1',occasion:'Gracias',genre:'Banda'},pos:'50% 40%'},
    {id:'corrido',group:'styles',es:'Tu propio corrido',en:'Your own corrido',descEs:'Tu nombre, tu camino y lo que te hace ser t\u00fa.',descEn:'Your name, your journey, and what makes you you.',tagEs:'Corrido personalizado',tagEn:'Personalized corrido',img:26536269,query:{relation:'Para m\u00ed',genre:'Corrido'},pos:'50% 32%'},
    {id:'pareja',group:'love',es:'Para mi persona',en:'For my person',descEs:'Desde aquel primer encuentro hasta hoy.',descEn:'From that first hello to everything since.',tagEs:'Amor \u00b7 aniversario',tagEn:'Love \u00b7 anniversary',img:6532607,enImg:4651050,query:{relation:'Pareja',occasion:'Te amo',genre:'Balada'},pos:'50% 45%'},
    {id:'hija',group:'family',es:'Para mi princesa',en:'For my little princess',descEs:'Su nombre dentro de una canci\u00f3n de cuento.',descEn:'Her name in her very own fairytale song.',tagEs:'Para mi hija',tagEn:'For my daughter',img:5789949,enImg:7139797,query:{relation:'Hija',occasion:'Porque s\u00ed',genre:'Balada'},pos:'50% 34%'},
    {id:'papa',group:'family',es:'Para pap\u00e1',en:'For dad',descEs:'Ese hombre que te ense\u00f1\u00f3 a no rendirte.',descEn:'For the man who taught you to keep going.',tagEs:'Norte\u00f1o \u00b7 corrido',tagEn:'Norte\u00f1o \u00b7 corrido',img:12775208,query:{relation:'Pap\u00e1',occasion:'Gracias',genre:'Norte\u00f1o'},pos:'50% 30%'},
    {id:'cumbia',group:'styles',es:'Una cumbia con su nombre',en:'A cumbia with their name',descEs:'Para poner a bailar a toda la familia.',descEn:'For getting the whole family on their feet.',tagEs:'Fiesta \u00b7 cumbia',tagEn:'Party \u00b7 cumbia',img:14100621,query:{genre:'Cumbia',occasion:'Cumplea\u00f1os'},pos:'50% 35%'},
    {id:'familia',group:'family',es:'Nuestra familia',en:'Our family',descEs:'Las ra\u00edces, los abrazos y todo lo compartido.',descEn:'The roots, the hugs, and everything you share.',tagEs:'Uni\u00f3n \u00b7 recuerdos',tagEn:'Togetherness \u00b7 memories',img:8573556,query:{relation:'Otro',occasion:'Gracias'},pos:'50% 38%'},
    {id:'cumple',group:'celebrate',es:'Feliz cumple, a tu manera',en:'A birthday, their way',descEs:'Un regalo que no tiene nadie m\u00e1s.',descEn:'A gift nobody else has.',tagEs:'Cumplea\u00f1os',tagEn:'Birthday',img:10165858,query:{occasion:'Cumplea\u00f1os',genre:'Cumbia'},pos:'50% 40%'},
    {id:'quince',group:'celebrate',es:'Sus quince, su canci\u00f3n',en:'Her quince, her song',descEs:'Una dedicatoria para un nuevo cap\u00edtulo.',descEn:'A dedication for a beautiful new chapter.',tagEs:'Quincea\u00f1era',tagEn:'Quincea\u00f1era',img:29402196,query:{relation:'Hija',occasion:'Cumplea\u00f1os',genre:'Balada'},pos:'50% 28%'},
    {id:'boda',group:'love',es:'El s\u00ed m\u00e1s importante',en:'The yes that changed it all',descEs:'Sus votos, su historia, una promesa hecha m\u00fasica.',descEn:'Your vows, your story, a promise set to music.',tagEs:'Boda \u00b7 aniversario',tagEn:'Wedding \u00b7 anniversary',img:33510700,query:{relation:'Pareja',occasion:'Boda',genre:'Balada'},pos:'50% 35%'},
    {id:'abuelos',group:'family',es:'Para los abuelos',en:'For the grandparents',descEs:'Gracias por las historias que siguen con nosotros.',descEn:'For the stories that stay with us.',tagEs:'Ra\u00edces \u00b7 homenaje',tagEn:'Roots \u00b7 tribute',img:5764903,query:{relation:'Abuelo/a',occasion:'Gracias',genre:'Mariachi'},pos:'50% 40%'},
    {id:'amistad',group:'celebrate',es:'Para mi gente',en:'For my favorite people',descEs:'Las risas, las locuras y el estar siempre ah\u00ed.',descEn:'The laughs, the adventures, and showing up.',tagEs:'Amistad \u00b7 recuerdos',tagEn:'Friendship \u00b7 memories',img:5738213,enImg:6567249,query:{relation:'Amigo/a',occasion:'Amistad',genre:'Pop Latino'},pos:'50% 38%'},
    {id:'hiphop',group:'styles',es:'Tu historia en hip-hop',en:'Your story in hip-hop',descEs:'Tus palabras. Tu actitud. Un estilo para consultar.',descEn:'Your words. Your attitude. Ask us about this style.',tagEs:'Rap \u00b7 solicitud especial',tagEn:'Rap \u00b7 special request',img:12847349,query:{genre:'Sorpr\u00e9ndeme',relation:'Para m\u00ed'},pos:'50% 32%'},
    {id:'mariachi',group:'styles',es:'Una serenata inolvidable',en:'An unforgettable serenade',descEs:'Un te quiero con toda la fuerza del mariachi.',descEn:'An I love you with the soul of mariachi.',tagEs:'Mariachi \u00b7 dedicatoria',tagEn:'Mariachi \u00b7 dedication',img:8639397,query:{occasion:'Te amo',genre:'Mariachi'},pos:'50% 30%'},
    {id:'logro',group:'celebrate',es:'Mira hasta d\u00f3nde llegaste',en:'Look how far you have come',descEs:'Su esfuerzo merece algo m\u00e1s que felicidades.',descEn:'Their hard work deserves more than congratulations.',tagEs:'Graduaci\u00f3n \u00b7 logros',tagEn:'Graduation \u00b7 milestones',img:19566177,enImg:17192509,query:{occasion:'Logro especial',genre:'Pop Latino'},pos:'50% 28%'}
  ];
  const t = (es,en) => root.lang === 'en' ? en : es;
  const el = (tag,cls,text) => {const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function pair(tag,cls,es,en){const n=el(tag,cls);n.dataset.es=es;n.dataset.en=en;n.textContent=t(es,en);return n;}
  const section=document.getElementById('dedicar');
  if(!section)return;
  section.setAttribute('aria-labelledby','ideas-title');
  section.querySelector('h2').id='ideas-title';
  const intro=section.querySelector('.section-intro');
  intro.replaceChildren(pair('span','', 'Una persona. Un estilo. Una idea que se vuelve canci\u00f3n. Explora 15 formas de empezar.', 'A person. A style. An idea that becomes a song. Explore 15 ways to begin.'));
  const oldGrid=section.querySelector('.occasion-grid');
  const gallery=el('div','idea-carousel');gallery.id='idea-carousel';gallery.setAttribute('role','region');gallery.setAttribute('aria-labelledby','ideas-title');gallery.setAttribute('aria-roledescription','carousel');
  const toolbar=el('div','idea-toolbar');
  const filters=el('div','idea-filters');filters.setAttribute('role','group');
  [['all','Todas las ideas','All ideas'],['family','Mi familia','My family'],['love','Mi amor','My love'],['celebrate','Celebrar','Celebrate'],['styles','Mi ritmo','My rhythm']].forEach(([id,es,en])=>{const b=pair('button','idea-filter',es,en);b.type='button';b.dataset.filter=id;b.setAttribute('aria-pressed',String(id==='all'));filters.append(b);});
  const controls=el('div','idea-controls');
  const pause=el('button','idea-pause');pause.id='ideas-pause';pause.type='button';pause.setAttribute('aria-controls','ideas-track');
  const prev=el('button','idea-arrow','\u2190');prev.type='button';prev.id='ideas-prev';prev.setAttribute('aria-controls','ideas-track');
  const next=el('button','idea-arrow','\u2192');next.type='button';next.id='ideas-next';next.setAttribute('aria-controls','ideas-track');
  controls.append(pause,prev,next);toolbar.append(filters,controls);
  const track=el('div','idea-track');track.id='ideas-track';track.tabIndex=0;
  const cards=[];
  ideas.forEach((idea,i)=>{
    const card=el('article','idea-card');card.dataset.idea=idea.id;card.dataset.group=idea.group;card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
    const a=el('a','idea-link');a.dataset.cta='idea-'+idea.id;
    const pic=el('div','idea-photo');pic.style.setProperty('--photo-position',idea.pos);
    const img=el('img','editorial-photo');img.alt='';img.loading=i<4?'eager':'lazy';img.decoding='async';img.width=600;img.height=720;img.referrerPolicy='no-referrer';img.dataset.esPhoto=idea.img;img.dataset.enPhoto=idea.enImg||idea.img;
    const number=el('span','idea-number',String(i+1).padStart(2,'0'));
    const tag=pair('span','idea-tag',idea.tagEs,idea.tagEn);
    pic.append(img,number,tag);
    const copy=el('div','idea-copy');const title=pair('h3','',idea.es,idea.en);const desc=pair('p','',idea.descEs,idea.descEn);const action=pair('span','idea-action',idea.id==='hiphop'?'Pedir este estilo':'Crear esta canci\u00f3n',idea.id==='hiphop'?'Request this style':'Create this song');
    copy.append(title,desc,action);a.append(pic,copy);card.append(a);track.append(card);cards.push(card);
  });
  const foot=el('div','idea-foot');const count=el('span','idea-count');count.id='ideas-count';count.setAttribute('role','status');count.setAttribute('aria-live','off');
  const all=pair('button','idea-all','Ver las 15 ideas','See all 15 ideas');all.type='button';all.id='ideas-all';all.setAttribute('aria-expanded','false');all.setAttribute('aria-controls','ideas-track');
  foot.append(count,all);gallery.append(toolbar,track,foot);oldGrid.replaceWith(gallery);
  const listening=document.getElementById('escuchar');
  section.before(listening);
  const listenIntro=listening.querySelector('.section-intro');
  if(listenIntro)listenIntro.replaceChildren(pair('span','', 'Dale play. Estas cuatro muestras son de SONALZA; tu canci\u00f3n llevar\u00e1 tu propia historia.', 'Press play. These four samples are by SONALZA; your song will tell your own story.'));
  listening.querySelectorAll('.play').forEach(b=>{b.classList.add('sample-play-v5');b.append(pair('span','play-caption','Escuchar','Listen'));new MutationObserver(()=>{const playing=b.getAttribute('aria-pressed')==='true',caption=b.querySelector('.play-caption');caption.dataset.es=playing?'Pausar':'Escuchar';caption.dataset.en=playing?'Pause':'Listen';caption.textContent=t(caption.dataset.es,caption.dataset.en);}).observe(b,{attributes:true,attributeFilter:['aria-pressed']});});
  const badges=el('div','heritage-chips');badges.innerHTML='<span>Corrido</span><span>Cumbia</span><span>Banda</span><span>Mariachi</span>';
  document.querySelector('.hero-copy .hero-description').after(badges);
  document.querySelector('.hero-description').replaceChildren(pair('span','', 'Una cumbia con su nombre. Un corrido con tu historia. Una canci\u00f3n para decir lo que llevas en el coraz\u00f3n.', 'A cumbia with their name. A corrido with your story. A personal song for the words that matter.'));
  const hero=document.querySelector('.hero-photo img');hero.dataset.esPhoto='8573556';hero.dataset.enPhoto='4651050';hero.width=1400;hero.height=1120;
  const closing=document.querySelector('.final-cta img');if(closing){closing.dataset.esPhoto='6532607';closing.dataset.enPhoto='7951784';}
  const credit=document.querySelector('.photo-note');if(credit)credit.replaceChildren(pair('span','', 'Fotograf\u00edas ilustrativas de Pexels. No son clientes, artistas de SONALZA ni testimonios.', 'Illustrative Pexels photography. Not SONALZA customers, artists, or testimonials.'));
  let activeFilter='all', expanded=false, stopped=false, hovering=false, inView=false, timer=null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');stopped=reduced.matches;
  function visible(){return cards.filter(c=>!c.hidden);}
  function position(){const a=visible();if(!a.length)return 0;let nearest=0,distance=Infinity;const left=track.getBoundingClientRect().left;a.forEach((c,i)=>{const d=Math.abs(c.getBoundingClientRect().left-left);if(d<distance){nearest=i;distance=d;}});return nearest;}
  function countRender(){const n=visible().length;const i=position()+1;count.textContent=expanded?`${n} ${t('ideas','ideas')}`:`${i.toString().padStart(2,'0')} / ${n.toString().padStart(2,'0')} ${t('ideas','ideas')}`;prev.disabled=next.disabled=expanded||n<=1;}
  function stop(){stopped=true;clearTimeout(timer);updateControls();}
  function updateControls(){pause.textContent=stopped?t('\u25b6 Reanudar','\u25b6 Resume'):t('\u275a\u275a Pausar','\u275a\u275a Pause');pause.setAttribute('aria-label',stopped?t('Reanudar avance autom\u00e1tico','Resume automatic rotation'):t('Pausar avance autom\u00e1tico','Pause automatic rotation'));pause.disabled=expanded;count.setAttribute('aria-live',stopped?'polite':'off');}
  function move(delta,automatic=false){const a=visible();if(a.length<2)return;const current=position();const atEnd=track.scrollLeft>=track.scrollWidth-track.clientWidth-3;const idx=delta>0&&atEnd?0:(current+delta+a.length)%a.length;const x=a[idx].offsetLeft-a[0].offsetLeft;track.scrollTo({left:x,behavior:reduced.matches?'instant':'smooth'});if(!automatic)stop();setTimeout(countRender,650);}
  function schedule(){clearTimeout(timer);if(stopped||expanded||hovering||!inView||document.hidden||reduced.matches||!document.querySelector('#sample-audio').paused||gallery.contains(document.activeElement))return;timer=setTimeout(()=>{move(1,true);schedule();},6500);}
  function localized(){
    const lang=root.lang==='en'?'en':'es';
    gallery.querySelectorAll('[data-es][data-en]').forEach(n=>n.textContent=n.dataset[lang]);
    filters.setAttribute('aria-label',t('Filtrar ideas','Filter ideas'));track.setAttribute('aria-label',t('Ideas de canci\u00f3n; usa las flechas o desliza','Song ideas; use the arrows or swipe'));
    prev.setAttribute('aria-label',t('Ideas anteriores','Previous ideas'));next.setAttribute('aria-label',t('Ideas siguientes','Next ideas'));
    const params=new URLSearchParams(location.search);let saved={};try{saved=JSON.parse(sessionStorage.getItem('sonalzaHomeAttributionV1')||'{}').values||{};}catch(_){}
    ideas.forEach((idea,i)=>{const a=cards[i].querySelector('a');const q=new URLSearchParams({product:'song',...idea.query,idea:idea.id,lang});['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(k=>{const value=params.get(k)||saved[k];if(typeof value==='string')q.set(k,value.slice(0,256));});a.href='create.html?'+q.toString();cards[i].setAttribute('aria-label',`${i+1} ${t('de','of')} 15: ${lang==='en'?idea.en:idea.es}`);});
    document.querySelectorAll('[data-es-photo]').forEach(img=>{const id=lang==='en'?img.dataset.enPhoto:img.dataset.esPhoto;const width=img===hero?1400:img===closing?1000:650;const url=photo(id,width);if(img.getAttribute('src')!==url)img.src=url;});
    all.textContent=expanded?t('Volver al carrusel','Back to carousel'):t('Ver las 15 ideas','See all 15 ideas');
    updateControls();countRender();
  }
  filters.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{stop();activeFilter=b.dataset.filter;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));cards.forEach(c=>c.hidden=activeFilter!=='all'&&c.dataset.group!==activeFilter);track.scrollTo({left:0,behavior:'instant'});countRender();}));
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  pause.addEventListener('click',()=>{stopped=!stopped;updateControls();if(!stopped){pause.blur();schedule();}});
  all.addEventListener('click',()=>{stop();expanded=!expanded;gallery.classList.toggle('expanded',expanded);all.setAttribute('aria-expanded',String(expanded));track.scrollTo({left:0,behavior:'instant'});localized();});
  gallery.addEventListener('mouseenter',()=>{hovering=true;clearTimeout(timer);});gallery.addEventListener('mouseleave',()=>{hovering=false;schedule();});
  gallery.addEventListener('focusin',e=>{if(e.target!==pause)stop();});
  track.addEventListener('pointerdown',stop,{passive:true});track.addEventListener('wheel',stop,{passive:true});
  track.addEventListener('scroll',countRender,{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.2}).observe(gallery);
  document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{if(reduced.matches)stop();schedule();});window.addEventListener('resize',countRender);
  const audio=document.querySelector('#sample-audio');audio.addEventListener('play',()=>clearTimeout(timer));audio.addEventListener('pause',schedule);
  new MutationObserver(()=>{localized();schedule();}).observe(root,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('sonalza:core-ready',()=>{localized();schedule();root.dataset.v5Ready='true';});
  localized();
})();
