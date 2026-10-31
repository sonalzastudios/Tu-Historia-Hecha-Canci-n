/* Initialize the bilingual inspiration layer before existing homepage bindings. */
(() => {
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
  load('home-v5.js').then(()=>load('home-core-v4.js')).then(()=>window.dispatchEvent(new Event('sonalza:core-ready'))).catch(()=>{document.documentElement.dataset.homeLoadError='true';});
})();
