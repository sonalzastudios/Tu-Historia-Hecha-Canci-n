/* Load the continuous-strip enhancement before the existing homepage. */
(() => {
  const base=new URL('.',document.currentScript.src);
  const styles=new Promise(resolve=>{const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('home-continuous.css',base).href;css.onload=resolve;css.onerror=resolve;document.head.append(css);});
  const module=new Promise(resolve=>{const script=document.createElement('script');script.src=new URL('home-continuous.js',base).href;script.onload=resolve;script.onerror=resolve;document.head.append(script);});
  Promise.all([styles,module]).then(()=>{const script=document.createElement('script');script.src=new URL('home-v6.js',base).href;script.onerror=()=>{document.documentElement.dataset.homeLoadError='true';};document.head.append(script);});
})();
