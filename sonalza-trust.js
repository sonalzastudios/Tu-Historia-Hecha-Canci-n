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
    if(data.verified!==true||data.metric!=='paid_delivered_orders'||!Number.isSafeInteger(n)||n<25)return;
    impactNumber.textContent=new Intl.NumberFormat(locale()?'en-US':'es-MX').format(n);
    const title=document.getElementById('sonalzaImpactTitle'),details=document.getElementById('sonalzaImpactDetails'),link=document.getElementById('sonalzaImpactLink');
    if(title)title.textContent=t('Pedidos musicales entregados','Music orders delivered');
    if(details)details.textContent=t('Pedidos pagados y marcados como entregados en nuestro sistema. No incluye versiones de prueba.','Paid orders marked as delivered in our system. Does not include test versions.');
    if(link){link.href='#escuchar';link.querySelector('span').textContent=t('Escuchar nuestras canciones','Listen to our songs');}
  }).catch(()=>{});
}
function node(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;}
function bilingual(el,es,en){el.dataset.es=es;el.dataset.en=en;el.textContent=t(es,en);return el;}
const stories=[
{symbol:'♥',label:['Para mamá','For Mom'],
 quote:['El día que mi mamá escuchó la canción que le dediqué, se quedó sin palabras. Lloró de emoción y alegría. Ver su reacción me hizo muy feliz y me demostró el impacto que puede tener transmitir un mensaje por medio de una canción.',
 'The day my mom heard the song I dedicated to her, she was speechless. She cried tears of joy. Seeing her reaction made me so happy and showed me the impact a message delivered through a song can have.']},
{symbol:'♫',label:['Un corrido para mi abuelo','A corrido for my grandfather'],
 quote:['Le hice un corrido a mi abuelo sin decirle que era para él. Puse la canción y se identificó de inmediato. Nunca lo había visto llorar hasta ese día. Me dijo: “Me gustaría que el día que yo ya no esté pongan esta canción para recordarme”. Ahí comprendí lo importante que es crear canciones para expresar lo que no sabemos cantar.',
 'I had a corrido made for my grandfather without telling him it was about him. I played it and he recognized himself immediately. I had never seen him cry until that day. He told me: “When I’m no longer here, I’d like you to play this song to remember me.” That’s when I understood how meaningful it is to create songs for feelings we cannot sing ourselves.']},
{symbol:'♡',label:['Una propuesta de matrimonio','A marriage proposal'],
 quote:['Le hice una canción a mi novia para pedirle matrimonio. Conté cómo nos conocimos, cuánto me importa y lo feliz que me haría compartir una vida juntos. Lloró de emoción, me abrazó fuertemente y, sin dudarlo, me dijo que sí. Gracias a SONALZA por crear un momento tan único; aunque tenía mis dudas, creo que no hubiera hecho un mejor trabajo por mi cuenta.',
 'I had a song made for my girlfriend to propose. It told the story of how we met, how much she means to me, and how happy I would be to share a life together. She cried, hugged me tightly, and said yes without hesitation. Thank you, SONALZA, for creating such a unique moment. I had my doubts at first, but I don’t think I could have done a better job myself.']}
];
function storyCard(item){const card=node('article','sonalza-review-card sonalza-editorial-review');
card.setAttribute('aria-label',t('Testimonio compartido por un cliente','Testimonial shared by a customer'));
const head=node('div','sonalza-review-head');
const avatar=node('span','sonalza-review-avatar',item.symbol);avatar.setAttribute('aria-hidden','true');
const about=node('div','sonalza-review-about');
about.append(bilingual(node('strong','sonalza-review-author'),item.label[0],item.label[1]),bilingual(node('span','sonalza-review-source'),'Cliente SONALZA · testimonio autorizado','SONALZA customer · shared with permission'));
head.append(avatar,about);card.append(head,bilingual(node('p','sonalza-review-message'),item.quote[0],item.quote[1]));
return card;}
function verifiedCard(review){const rating=Number(review.rating);if(!Number.isInteger(rating)||rating<1||rating>5||String(review.message||'').trim().length<10)return null;
const card=node('article','sonalza-review-card');card.setAttribute('aria-label',t('Opinión de cliente','Customer review'));
const head=node('div','sonalza-review-head');
const initials=String(review.name||'C').trim().split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase().slice(0,2);
const about=node('div','sonalza-review-about');
about.append(node('strong','sonalza-review-author',String(review.name||t('Cliente SONALZA','SONALZA customer')).slice(0,40)),bilingual(node('span','sonalza-review-source'),'Compra registrada · reseña autorizada','Recorded purchase · review shared with permission'));
head.append(node('span','sonalza-review-avatar',initials),about);
const stars=node('div','sonalza-review-stars','★'.repeat(rating)+'☆'.repeat(5-rating));stars.setAttribute('aria-label',rating+'/5');
card.append(head,stars,node('p','sonalza-review-message',String(review.message).slice(0,600)));return card;}
function displayReviews(approved=[]){
const cards=[...stories.map(storyCard),...approved.slice(0,5).map(verifiedCard).filter(Boolean)];
const heading=document.getElementById('sonalzaVerifiedHeading');
const pillars=document.querySelector('.sonalza-trust-pillars');
if(pillars&&heading&&panel&&pillars.parentElement===heading.parentElement){
pillars.parentElement.insertBefore(heading,pillars);pillars.parentElement.insertBefore(panel,pillars);}
panel.replaceChildren();panel.hidden=false;if(heading)heading.hidden=false;
panel.classList.add('sonalza-reviews-ready');
const track=node('div','sonalza-reviews-track');track.id='sonalzaReviewsTrack';track.tabIndex=0;
track.setAttribute('aria-label',t('Testimonios de clientes SONALZA','SONALZA customer testimonials'));
for(const card of cards)track.append(card);
panel.append(track);
if(cards.length>2){const controls=node('div','sonalza-reviews-controls');
for(const [direction,es,en,glyph] of [[-1,'Comentarios anteriores','Previous testimonials','←'],[1,'Más comentarios','More testimonials','→']]){
const button=node('button','sonalza-reviews-arrow',glyph);button.type='button';button.setAttribute('aria-label',t(es,en));
button.addEventListener('click',()=>track.scrollBy({left:direction*Math.max(track.clientWidth*.72,280),behavior:'smooth'}));controls.append(button);}
panel.append(controls);}
const note=bilingual(node('p','sonalza-reviews-note'),
'Testimonios de clientes compartidos con autorización. Textos editados por claridad y traducidos al inglés; sin calificaciones atribuidas.',
'Customer testimonials shared with permission. Edited for clarity and translated into English; no ratings attributed.');
panel.append(note);}
displayReviews();
fetch('/api/geo?action=reviews-public',{headers:{Accept:'application/json'}})
.then(r=>r.ok?r.json():Promise.reject(Error('unavailable')))
.then(data=>{if(Array.isArray(data.reviews)&&data.reviews.length)displayReviews(data.reviews);}).catch(()=>{});
})();