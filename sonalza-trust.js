(()=>{'use strict';
const panel=document.getElementById('verifiedReviews');if(!panel)return;
const locale=()=>{const q=new URLSearchParams(location.search).get('lang');return q==='en'||(q!=='es'&&document.documentElement.lang==='en')};
const t=(es,en)=>locale()?en:es;
const impactNumber=document.getElementById('sonalzaImpactNumber');
if(impactNumber){
  const examples=new Set(Array.from(document.querySelectorAll('[data-play]')).map(el=>el.getAttribute('data-play')).filter(Boolean)).size;
  impactNumber.textContent=String(examples);
  fetch('/api/geo?action=impact',{headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():Promise.reject(Error('No count'))).then(data=>{
    const n=data.deliveredSongs;
    if(data.verified!==true||data.metric!=='paid_delivered_orders'||!Number.isSafeInteger(n)||n<=0)return;
    impactNumber.textContent=new Intl.NumberFormat(locale()?'en-US':'es-MX').format(n);
    const title=document.getElementById('sonalzaImpactTitle'),details=document.getElementById('sonalzaImpactDetails'),link=document.getElementById('sonalzaImpactLink');
    if(title)title.textContent=t('Pedidos musicales entregados','Music orders delivered');
    if(details)details.textContent=t('Pedidos pagados y marcados como entregados en nuestro sistema. No incluye versiones de prueba.','Paid orders marked as delivered in our system. Does not include test versions.');
    if(link){link.href='#escuchar';link.querySelector('span').textContent=t('Escuchar nuestras canciones','Listen to our songs');}
  }).catch(()=>{});
}
function node(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;}
function placeholder(){panel.hidden=true;panel.replaceChildren();const heading=document.getElementById('sonalzaVerifiedHeading');if(heading)heading.hidden=true;}
function cardFor(review){const rating=Number(review.rating);if(!Number.isInteger(rating)||rating<1||rating>5||String(review.message||'').trim().length<10)return null;
const card=node('article','sonalza-review-card');card.setAttribute('aria-label',t('Opinión de cliente','Customer review'));
const head=node('div','sonalza-review-head');
const avatar=node('span','sonalza-review-avatar',String(review.name||'C').trim().split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase().slice(0,2));
const about=node('div','sonalza-review-about');about.append(node('strong','sonalza-review-author',String(review.name||t('Cliente SONALZA','SONALZA customer')).slice(0,40)),node('span','sonalza-review-source',t('Compra SONALZA verificada','Verified SONALZA purchase')));
head.append(avatar,about);
const stars=node('div','sonalza-review-stars','★'.repeat(rating)+'☆'.repeat(5-rating));stars.setAttribute('aria-label',rating+'/5');
card.append(head,stars,node('p','sonalza-review-message',String(review.message).slice(0,600)));
return card;
}
fetch('/api/geo?action=reviews-public',{headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():Promise.reject(Error('Unavailable'))).then(d=>{
if(!Array.isArray(d.reviews)||!d.reviews.length){placeholder();return;}
const cards=d.reviews.slice(0,8).map(cardFor).filter(Boolean);if(!cards.length){placeholder();return;}
panel.replaceChildren();panel.hidden=false;const heading=document.getElementById('sonalzaVerifiedHeading');if(heading)heading.hidden=false;panel.classList.add('sonalza-reviews-ready');
const track=node('div','sonalza-reviews-track');track.id='sonalzaReviewsTrack';track.tabIndex=0;track.setAttribute('aria-label',t('Comentarios de clientes verificados','Verified customer reviews'));
for(const card of cards)track.append(card);panel.append(track);
if(cards.length>2){const controls=node('div','sonalza-reviews-controls');const prev=node('button','sonalza-reviews-arrow','←'),next=node('button','sonalza-reviews-arrow','→');prev.type=next.type='button';prev.setAttribute('aria-label',t('Comentarios anteriores','Previous reviews'));next.setAttribute('aria-label',t('Más comentarios','Next reviews'));prev.addEventListener('click',()=>track.scrollBy({left:-Math.max(track.clientWidth*.72,280),behavior:'smooth'}));next.addEventListener('click',()=>track.scrollBy({left:Math.max(track.clientWidth*.72,280),behavior:'smooth'}));controls.append(prev,next);panel.append(controls);}
const note=node('p','sonalza-reviews-note',t('Opiniones de clientes con pedidos pagados y autorización para publicar. Selección de reseñas aprobadas por SONALZA.','Reviews from customers with paid orders who consented to publication. Selection approved by SONALZA.'));panel.append(note);
}).catch(placeholder);
})();