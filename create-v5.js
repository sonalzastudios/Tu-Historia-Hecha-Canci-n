/* Presentation and chosen-idea handoff only. The existing form owns validation/payment. */
(() => {
  'use strict';
  const q=new URLSearchParams(location.search), lang=q.get('lang');
  if(lang==='en'||lang==='es'){try{localStorage.setItem('sonalzaLanguageV1',lang);localStorage.setItem('sonalzaLocalePreferenceV1','1');}catch(_){}}
  const choices={mama:['Para mam\u00e1','For mom'],corrido:['Tu propio corrido','Your own corrido'],pareja:['Para mi persona','For my person'],hija:['Para mi princesa','For my little princess'],papa:['Para pap\u00e1','For dad'],cumbia:['Una cumbia con su nombre','A cumbia with their name'],familia:['Nuestra familia','Our family'],cumple:['Feliz cumple, a tu manera','A birthday, their way'],quince:['Sus quince, su canci\u00f3n','Her quince, her song'],boda:['El s\u00ed m\u00e1s importante','The yes that changed it all'],abuelos:['Para los abuelos','For the grandparents'],amistad:['Para mi gente','For my favorite people'],hiphop:['Hip-hop / rap: solicitud especial','Hip-hop / rap: special request'],mariachi:['Una serenata inolvidable','An unforgettable serenade'],logro:['Mira hasta d\u00f3nde llegaste','Look how far you have come']};
  const key=q.get('idea');
  // Do not overwrite a saved customer's story. Only carry the selected creative direction.
  if(['hiphop','hija','quince'].includes(key))try{
    const storage='sonalzaSongDraftV2',draft=JSON.parse(localStorage.getItem(storage)||'{}');
    const expired=draft._savedAt&&Date.now()-Number(draft._savedAt)>30*86400000;
    const safe=expired?{}:draft;
    if(!safe.emocion){const en=lang==='en';safe.emocion=key==='hiphop'?(en?'Requested style: hip-hop / rap. Please confirm availability before production.':'Estilo solicitado: hip-hop / rap. Confirmar disponibilidad antes de producir.'):key==='hija'?(en?'A gentle fairytale-inspired dedication for my daughter.':'Una dedicatoria tierna inspirada en un cuento para mi hija.'):(en?'A dedication to celebrate her quinceanera.':'Una dedicatoria para celebrar sus quince a\u00f1os.');safe._savedAt=Date.now();localStorage.setItem(storage,JSON.stringify(safe));}
  }catch(_){}
  function init(){
    document.body.classList.add('create-v5');
    const flow=document.getElementById('songFlow'),question=document.getElementById('question');if(!flow||!question)return;
    const banner=document.createElement('div');banner.className='chosen-idea';banner.id='chosen-idea';banner.hidden=!choices[key];
    const label=document.createElement('span');label.className='chosen-label';const title=document.createElement('strong');const note=document.createElement('small');banner.append(label,title,note);flow.prepend(banner);
    const actions=document.querySelector('.flow-actions');const hint=document.createElement('p');hint.className='flow-payment-hint';actions?.after(hint);
    const currentLang=()=>document.documentElement.lang==='en';
    function copy(){const en=currentLang();label.textContent=en?'YOUR STARTING POINT':'TU PUNTO DE PARTIDA';title.textContent=choices[key]?.[en?1:0]||'';note.textContent=key==='hiphop'?(en?'Special style request; no hip-hop audio demo is advertised. Describe what you want in your message.':'Solicitud especial de estilo; no se anuncia una muestra de hip-hop. Describe lo que buscas en tu mensaje.'):(en?'We preselected the available details. You can change them as you go.':'Preseleccionamos los detalles disponibles. Puedes cambiarlos al avanzar.');hint.textContent=en?'No charge at this step. Review the total before paying.':'Este paso no genera un cargo. Revisas el total antes de pagar.';}
    function accessible(){question.querySelectorAll('input,textarea').forEach(input=>{if(input.id==='nombre'){input.autocomplete='off';input.setAttribute('autocapitalize','words');}if(input.tagName==='TEXTAREA')input.setAttribute('spellcheck','true');});question.querySelectorAll('.option').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))));copy();}
    new MutationObserver(accessible).observe(question,{childList:true,subtree:true});
    question.addEventListener('click',e=>{if(e.target.closest('.option'))requestAnimationFrame(()=>question.querySelectorAll('.option').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected')))));});
    window.addEventListener('sonalza:regionready',copy);new MutationObserver(copy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    accessible();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
