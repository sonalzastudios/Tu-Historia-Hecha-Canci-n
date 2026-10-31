/* V6 loader: the public homepage keeps its original fallback markup. */
(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='home-v6-polish.css';document.head.append(css);
  const script=document.createElement('script');script.src='home-v6.js';
  script.onerror=()=>{document.documentElement.dataset.homeLoadError='true';};
  document.head.append(script);
})();
