/* SONALZA HOME V3 - explicit bilingual copy, isolated from order/payment code. */
(() => {
  'use strict';
  const REGION_KEY = 'sonalzaRegionV1';
  const LANGUAGE_KEY = 'sonalzaLanguageV1';
  const PREF_KEY = 'sonalzaLocalePreferenceV1';
  const DETECTED_KEY = 'sonalzaDetectedRegionV1';
  const OVERRIDE_KEY = 'sonalzaRegionOverrideV1';
  const PRICES = {US: {song:49, corrido:249, business:499}, MX: {song:599, corrido:1999, business:4999}};
  const TRACKS = [
    {title:'Mujer de las que quedan', file:'assets/audio/banda-mujer-de-las-que-quedan.mp3'},
    {title:'Los A\u00f1os Que No Vieron', file:'assets/audio/corrido-los-anos-que-no-vieron.mp3'},
    {title:'La Cumbia de la Limpiadera', file:'assets/audio/cumbia-la-limpiadera.mp3'},
    {title:'Pasito de Amor', file:'assets/audio/huapango-pasito-de-amor-20-50.mp3'}
  ];
  const STORIES = {
    family:{
      es:['UNA CANCI\u00d3N PARA MAM\u00c1','Que hable de sus abrazos, de su manera de cuidarnos y de todas las veces que dijo: \u00abTodo va a estar bien\u00bb.','Su nombre + un recuerdo + lo que quieres agradecerle.'],
      en:['A SONG FOR MOM','Let it tell her about her hugs, the way she cares for us, and every time she said, \u201cEverything will be okay.\u201d','Her name + a memory + what you want to thank her for.'],
      query:'relation=Mam%C3%A1'
    },
    love:{
      es:['UNA CANCI\u00d3N PARA MI PAREJA','Que empiece donde nos conocimos. Que recuerde nuestra primera aventura y todo lo que todav\u00eda queremos vivir juntos.','Sus nombres + c\u00f3mo se conocieron + un momento de ustedes.'],
      en:['A SONG FOR MY PARTNER','Start where we first met. Remember our first adventure and everything we still want to experience together.','Your names + how you met + a moment that belongs to you.'],
      query:'occasion=Te%20amo'
    },
    birthday:{
      es:['UNA CANCI\u00d3N PARA CELEBRAR','Que diga su nombre, que recuerde lo lejos que ha llegado y que celebre todas las cosas que lo hacen \u00fanico.','Su nombre + un logro + lo que lo hace especial.'],
      en:['A SONG TO CELEBRATE','Say their name, remember how far they have come, and celebrate all the things that make them one of a kind.','Their name + an achievement + what makes them special.'],
      query:'occasion=Cumplea%C3%B1os'
    }
  };
  function get(store,key) { try { return window[store].getItem(key); } catch (_) { return null; } }
  function put(store,key,value) { try { if(value === null) window[store].removeItem(key); else window[store].setItem(key,value); } catch (_) { /* Navigation remains usable without storage. */ } }
  const params = new URLSearchParams(location.search);
  const explicitLanguage = /^(es|en)$/.test(params.get('lang') || '') ? params.get('lang') : null;
  const savedRegion = get('localStorage',REGION_KEY);
  const savedLanguage = get('localStorage',LANGUAGE_KEY);
  let region = savedRegion === 'MX' ? 'MX' : 'US';
  let language = explicitLanguage || (/^(es|en)$/.test(savedLanguage || '') ? savedLanguage : region === 'MX' ? 'es' : 'en');
  let occasion = 'family';
  let preferencesChanged = false;
  let activeTrack = -1;
  let playerRequest = 0;
  let playerMessage = '';
  const audio = document.getElementById('sample-audio');
  const localeDialog = document.getElementById('locale-dialog');
  const messages = {
    es:{title:'SONALZA STUDIOS \u2014 Regala su historia en una canci\u00f3n', description:'Crea una canci\u00f3n personalizada con nombres, recuerdos y una historia real. Escucha muestras y conoce lo que incluye SONALZA antes de ordenar.', play:'Escuchar', pause:'Pausar', loading:'Cargando muestra\u2026', error:'No se pudo reproducir esta muestra. Intenta nuevamente o elige otra.', elapsed:'Reproducci\u00f3n'},
    en:{title:'SONALZA STUDIOS \u2014 Give their story a song', description:'Create a personalized song with names, memories, and a real story. Listen to samples and explore what SONALZA includes before ordering.', play:'Listen to', pause:'Pause', loading:'Loading sample\u2026', error:'This sample could not play. Please try again or choose another.', elapsed:'Playback'}
  };
  const trackingKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'];
  const attribution = {};
  try {
    const saved = JSON.parse(get('sessionStorage','sonalzaHomeAttributionV1') || '{}');
    if (saved.at && Date.now() - saved.at < 30 * 60 * 1000) trackingKeys.forEach(k => { if (typeof saved.values?.[k] === 'string') attribution[k] = saved.values[k].slice(0,256); });
  } catch (_) {}
  trackingKeys.forEach(k => { if(params.get(k)) attribution[k] = params.get(k).slice(0,256); });
  if (Object.keys(attribution).length) put('sessionStorage','sonalzaHomeAttributionV1',JSON.stringify({at:Date.now(),values:attribution}));
  // Events stay in the page. No personal data, no ad SDK, no unverified Purchase events.
  function emit(name, detail={}) { window.dispatchEvent(new CustomEvent('sonalza:home-event',{detail:{name,...detail,language,region}})); }
  function preserveLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      const target = new URL(href,location.href);
      if (target.origin !== location.origin || !/^https?:$/.test(target.protocol)) return;
      Object.entries(attribution).forEach(([k,v]) => target.searchParams.set(k,v));
      target.searchParams.set('lang',language);
      a.href = target.pathname + target.search + target.hash;
    });
  }
  function persist() {
    put('localStorage',REGION_KEY,region); put('localStorage',LANGUAGE_KEY,language); put('localStorage',PREF_KEY,'1');
    const detected = get('sessionStorage',DETECTED_KEY);
    if(detected) put('localStorage',OVERRIDE_KEY,detected === region ? null : '1');
  }
  function money(product) { return (region === 'MX' ? 'MX$' : 'US$') + new Intl.NumberFormat(region === 'MX' ? 'es-MX':'en-US',{maximumFractionDigits:0}).format(PRICES[region][product]); }
  function updateStory() {
    const story = STORIES[occasion][language];
    ['story-label','story-text','story-detail'].forEach((id,i) => { document.getElementById(id).textContent=story[i]; });
    document.querySelectorAll('[data-occasion]').forEach(b => { const chosen=b.dataset.occasion===occasion; b.setAttribute('aria-selected',String(chosen)); b.tabIndex=chosen?0:-1; });
    document.getElementById('story-panel').setAttribute('aria-labelledby','tab-'+occasion);
    document.getElementById('occasion-cta').setAttribute('href','create.html?product=song&'+STORIES[occasion].query);
  }
  function time(s) { if(!Number.isFinite(s)||s<0) return '\u2014:\u2014'; const n=Math.floor(s);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0'); }
  function updatePlayer() {
    const playing = !audio.paused && !audio.ended;
    document.querySelectorAll('[data-play]').forEach(b => {
      const id=Number(b.dataset.play); const isPlaying=activeTrack===id&&playing;
      b.classList.toggle('is-playing',isPlaying); b.setAttribute('aria-label',(isPlaying?messages[language].pause:messages[language].play)+' '+TRACKS[id].title);
      b.setAttribute('aria-pressed',String(isPlaying)); b.querySelector('.play-glyph').textContent=isPlaying?'\u275a\u275a':'\u25b6';
    });
    document.querySelectorAll('[data-track-card]').forEach(card => {
      const selected=Number(card.dataset.trackCard)===activeTrack;
      const duration=audio.duration;const known=selected&&Number.isFinite(duration)&&duration>0;
      card.classList.toggle('is-active',selected); card.querySelector('.track-meter').hidden=!selected;
      const seek=card.querySelector('[data-seek]'); seek.disabled=!known;
      card.querySelector('[data-elapsed]').textContent=selected?time(audio.currentTime):'0:00';
      card.querySelector('[data-total]').textContent=known?time(duration):'\u2014:\u2014';
      seek.value=known?String(Math.min(100,audio.currentTime/duration*100)):'0';
      seek.setAttribute('aria-valuetext',known?time(audio.currentTime)+' / '+time(duration):messages[language].loading);
    });
    document.getElementById('audio-status').textContent=playerMessage?messages[language][playerMessage]:'';
  }
  function render() {
    document.documentElement.lang=language;
    document.documentElement.dataset.region=region;
    document.documentElement.dataset.currency=region==='MX'?'MXN':'USD';
    document.title=messages[language].title;
    document.querySelector('meta[name="description"]').content=messages[language].description;
    // Copy is declared with explicit keys, not inferred from a previously rendered phrase.
    document.querySelectorAll('[data-es][data-en]').forEach(el=> { el.textContent=el.dataset[language]; });
    document.querySelectorAll('[data-aria-es][data-aria-en]').forEach(el=> {el.setAttribute('aria-label',language==='es'?el.dataset.ariaEs:el.dataset.ariaEn);});
    document.querySelectorAll('[data-price]').forEach(el=> {el.textContent=money(el.dataset.price);});
    document.getElementById('locale-summary').textContent=region+' \u00b7 '+language.toUpperCase();
    document.getElementById('region-select').value=region;
    document.getElementById('language-select').value=language;
    updateStory();preserveLinks();updatePlayer();
  }
  document.getElementById('locale-open').addEventListener('click',()=>localeDialog.showModal());
  document.getElementById('locale-close').addEventListener('click',()=>localeDialog.close());
  localeDialog.addEventListener('click',e=>{if(e.target===localeDialog){const r=localeDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)localeDialog.close();}});
  document.getElementById('locale-form').addEventListener('submit',e=>{
    e.preventDefault();region=document.getElementById('region-select').value==='MX'?'MX':'US';language=document.getElementById('language-select').value==='es'?'es':'en';preferencesChanged=true;
    persist();render();localeDialog.close();
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url.pathname+url.search+url.hash);
    emit('preferences_changed');
  });
  document.querySelectorAll('[data-occasion]').forEach((b,i)=>{
    b.addEventListener('click',()=>{occasion=b.dataset.occasion;updateStory();preserveLinks();emit('occasion_selected',{occasion});});
    b.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-occasion]')];let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();tabs[n].click();tabs[n].focus();});
  });
  document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',async()=>{
    const id=Number(button.dataset.play);const request=++playerRequest;
    if(activeTrack===id&&!audio.paused){audio.pause();playerMessage='';updatePlayer();return;}
    if(activeTrack!==id){audio.pause();activeTrack=id;audio.src=TRACKS[id].file;audio.load();}
    playerMessage='loading';updatePlayer();
    try{await audio.play();if(request!==playerRequest)return;playerMessage='';updatePlayer();emit('audio_play',{sample:id});}
    catch(error){if(request!==playerRequest)return;playerMessage=error.name==='AbortError'?'':'error';updatePlayer();}
  }));
  ['loadedmetadata','durationchange','timeupdate','play','pause','ended'].forEach(name=>audio.addEventListener(name,updatePlayer));
  audio.addEventListener('error',()=>{playerMessage='error';updatePlayer();});
  document.querySelectorAll('[data-seek]').forEach(input=>input.addEventListener('input',()=>{if(Number(input.dataset.seek)===activeTrack&&Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(input.value)/100*audio.duration;}));
  const menu=document.getElementById('mobile-nav'),menuButton=document.getElementById('menu-toggle');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
  menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',()=>{
    if(a.origin===location.origin)persist();
    if(a.hasAttribute('data-cta'))emit('order_click',{placement:a.dataset.cta,product:new URL(a.href).searchParams.get('product')||'song'});
  }));
  document.querySelectorAll('.faq-list details').forEach((d,i)=>d.addEventListener('toggle',()=>{if(d.open)emit('faq_open',{question:i});}));
  document.querySelectorAll('.track-art img').forEach(img=>{img.addEventListener('error',()=>{img.hidden=true;});if(img.complete&&!img.naturalWidth)img.hidden=true;});
  if(explicitLanguage) { put('localStorage',LANGUAGE_KEY,language); }
  render();emit('home_view');
  // Respect existing preferences; country detection never overrides a user's chosen language.
  (async()=>{
    if(get('sessionStorage',DETECTED_KEY))return;
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),2500);
    try{const response=await fetch('/api/geo',{signal:controller.signal,credentials:'same-origin'});if(!response.ok)return;const data=await response.json();if(!['US','MX'].includes(data.country))return;put('sessionStorage',DETECTED_KEY,data.country);if(!savedRegion&&!preferencesChanged){region=data.country;if(!explicitLanguage&&!/^(es|en)$/.test(savedLanguage||''))language=region==='MX'?'es':'en';render();}}
    catch(_){/* Regional fallback remains selectable, not a checkout failure. */}finally{clearTimeout(timer);}
  })();
})();
