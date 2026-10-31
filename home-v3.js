/* Initialize inspiration before existing homepage bindings. */
(() => {
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
  load('home-v5.js').then(()=>{
    // Reviewed art direction: this composition keeps both partners in the card crop.
    const partner=document.querySelector('[data-idea="pareja"] img');
    if(partner)partner.dataset.esPhoto='6533186';
    return load('home-core-v4.js');
  }).then(()=>window.dispatchEvent(new Event('sonalza:core-ready'))).catch(()=>{document.documentElement.dataset.homeLoadError='true';});
})();
