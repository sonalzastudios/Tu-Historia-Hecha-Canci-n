/* Load motion modules before the existing bilingual homepage initializes. */
(() => {
  const base=new URL('.',document.currentScript.src);
  const styles=new Promise(resolve=>{const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('home-motion-polish.css',base).href;css.onload=resolve;css.onerror=resolve;document.head.append(css);});
  function load(name){return new Promise(resolve=>{const script=document.createElement('script');script.src=new URL(name,base).href;script.onload=resolve;script.onerror=resolve;document.head.append(script);});}
  Promise.all([styles,load('home-continuous.js'),load('home-motion-polish.js')]).then(()=>load('home-v6.js'));
})();
