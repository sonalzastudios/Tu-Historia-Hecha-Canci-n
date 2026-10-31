"""Read-only browser regression: real visual motion, no live orders/payments."""
import functools, http.server, json, pathlib, threading, traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-output';OUT.mkdir(exist_ok=True)
RESULTS=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_address[1]}'
def check(name,ok,detail=None):
    RESULTS.append({'test':name,'passed':bool(ok),'details':detail}); print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def context(browser,lang='es',region='US',width=1440,**options):
    c=browser.new_context(viewport={'width':width,'height':900 if width>650 else 844},**options)
    c.add_init_script('if(location.origin==='+json.dumps(BASE)+"&&!sessionStorage.getItem('__seed')){localStorage.setItem('sonalzaLanguageV1',"+json.dumps(lang)+");localStorage.setItem('sonalzaRegionV1',"+json.dumps(region)+");localStorage.setItem('sonalzaLocalePreferenceV1','1');sessionStorage.setItem('__seed','1');}")
    c.route('**/api/geo',lambda r:r.fulfill(json={'country':region,'supported':True}))
    c.route('**/api/public-config',lambda r:r.fulfill(json={'stripeCheckoutEnabled':False,'turnstileRequired':False,'turnstileSiteKey':''}))
    return c
def load(c,lang='es'):
    pg=c.new_page();pg.set_default_timeout(20000)
    pg.goto(BASE+'/?lang='+lang+'&utm_source=qa',wait_until='domcontentloaded')
    pg.wait_for_function("document.documentElement.dataset.motionPolishReady==='true'")
    pg.wait_for_timeout(200);return pg
def overflow(pg):return pg.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)<=innerWidth+1')
def decode(pg):
    pg.evaluate("document.images&&[...document.images].forEach(i=>i.loading='eager')")
    return pg.evaluate("async()=>{await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>null))),new Promise(r=>setTimeout(r,18000))]);return [...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}")
def phase(pg):return pg.locator('.idea-motion-rail').evaluate('e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m41')
def settle(pg):pg.wait_for_timeout(220)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width in [1440,1024,768,390,320]:
            for lang,region in [('es','US'),('en','US'),('es','MX'),('en','MX')]:
                c=context(browser,lang,region,width);errors=[]
                c.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))))
                pg=load(c,lang);label=f'{width}px {region}/{lang}'
                check(label+' no JS exceptions',not errors,errors)
                check(label+' language',pg.locator('html').get_attribute('lang')==lang)
                mismatches=pg.evaluate("l=>[...document.querySelectorAll('[data-es][data-en]')].filter(n=>n.textContent!==n.dataset[l]).map(n=>n.textContent)",lang)
                check(label+' localized text',not mismatches,mismatches)
                expected='US$49' if region=='US' else 'MX$599'
                check(label+' price unchanged',all(x==expected for x in pg.locator('[data-price=song]').all_text_contents()))
                check(label+' six selectable dots',pg.locator('.hero-dots .hero-preview').count()==6)
                check(label+' no thumbnails in controls',pg.locator('.hero-dots img').count()==0)
                check(label+' no automatic status text',not pg.locator('#hero-motion-status').is_visible())
                check(label+' dots have accessible names',all(pg.locator('.hero-dots button').nth(i).get_attribute('aria-label') for i in range(6)))
                check(label+' 15 original cards',pg.locator('.idea-card[data-idea]').count()==15)
                check(label+' no horizontal page overflow',overflow(pg))
                heart=pg.locator('.record-sleeve .letter-head>svg').evaluate("e=>({w:getComputedStyle(e).width,h:getComputedStyle(e).height,color:getComputedStyle(e).color,fill:e.getAttribute('fill'),stroke:e.getAttribute('stroke-width')})")
                check(label+' heart red same 19px outline',heart['w']=='19px' and heart['h']=='19px' and heart['color']=='rgb(198, 40, 61)' and heart['fill']=='none' and heart['stroke']=='1.5',heart)
                check(label+' four decorative notes',pg.locator('.vinyl-note').count()==4 and pg.locator('.vinyl-notes').get_attribute('aria-hidden')=='true')
                pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);settle(pg)
                check(label+' compositor engine',pg.locator('.idea-carousel').get_attribute('data-motion-engine')=='compositor-transform')
                a=phase(pg);pg.wait_for_timeout(200);b=phase(pg)
                check(label+' actual continuous motion',b<a-1,{'before':a,'after':b})
                if width in (1440,390) and region=='US':
                    missing=decode(pg);check(label+' photographs decode',not missing,missing)
                    pg.locator('[data-hero-index="0"]').click();pg.evaluate('window.scrollTo(0,0)');pg.wait_for_timeout(700)
                    pg.screenshot(path=str(OUT/f'hero-polish-{lang}-{width}.png'))
                    pg.locator('#dedicar').screenshot(path=str(OUT/f'carousel-polish-{lang}-{width}.png'))
                    pg.locator('.dedication').screenshot(path=str(OUT/f'vinyl-polish-{lang}-{width}.png'))
                pg.locator('#ideas-all').click();check(label+' expanded gallery all original ideas',pg.locator('.idea-card:not([hidden])').count()==15 and overflow(pg))
                pg.locator('#ideas-all').click();pg.wait_for_timeout(200);check(label+' return to carousel',pg.locator('.idea-motion-rail').evaluate('e=>e.getAnimations().length')==1)
                c.close()
        for dpr in [1,2]:
            c=context(browser,device_scale_factor=dpr);pg=load(c)
            pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(400)
            samples=pg.locator('.idea-motion-rail').evaluate("""async el=>{
                await Promise.all(el.getAnimations().map(a=>a.ready));
                const samples=[];
                await new Promise(resolve=>{function tick(t){samples.push({t,x:new DOMMatrixReadOnly(getComputedStyle(el).transform).m41});if(samples.length<50)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});
                return samples;
            }""")
            dx=[samples[i]['x']-samples[i-1]['x'] for i in range(1,len(samples))]
            elapsed=(samples[-1]['t']-samples[0]['t'])/1000;rate=(samples[0]['x']-samples[-1]['x'])/elapsed
            check(f'DPR {dpr} smooth linear measured speed',17<rate<23,{'pixels_per_second':rate,'samples':samples})
            check(f'DPR {dpr} fractional pixel frames',sum(abs(s['x']-round(s['x']))>.01 for s in samples)>30)
            check(f'DPR {dpr} no backwards frame',all(x<=.02 for x in dx),dx)
            check(f'DPR {dpr} moves on most rendered frames',sum(x<-.01 for x in dx)>=len(dx)*.85)
            check(f'DPR {dpr} no scrollLeft animation',pg.locator('#ideas-track').evaluate('e=>e.scrollLeft')==0)
            pg.locator('.idea-card[data-idea=mama]').hover(force=True);a=phase(pg);pg.wait_for_timeout(600);check(f'DPR {dpr} hover does not stop',phase(pg)<a-5)
            pg.evaluate("document.querySelector('#dedicar h2').click()");a=phase(pg);pg.wait_for_timeout(400);check(f'DPR {dpr} unrelated click does not stop',phase(pg)<a-3)
            pg.locator('.track button[data-play="0"]').evaluate('b=>b.click()')
            pg.wait_for_function('()=>{const a=document.querySelector("#sample-audio");return !a.paused&&Number.isFinite(a.duration)&&a.duration>0}')
            a=phase(pg);pg.wait_for_timeout(400);check(f'DPR {dpr} real sample does not stop',phase(pg)<a-3)
            pg.evaluate('document.querySelector("#sample-audio").pause()')
            seam=pg.locator('.idea-motion-rail').evaluate("""async rail=>{
                const a=rail.getAnimations()[0],span=+document.querySelector('.idea-carousel').dataset.loopSpan;
                a.pause();await a.ready;
                const render=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
                a.currentTime=(span-.3)/20*1000;await render();const before=rail.querySelector('[data-loop-copy="0"]').getBoundingClientRect().left;
                a.currentTime=(span+.3)/20*1000;await render();const after=rail.querySelector('[data-idea]').getBoundingClientRect().left;a.play();
                return {before,after,delta:after-before};
            }""")
            check(f'DPR {dpr} continuous loop seam',abs(seam['delta']+.6)<.15,seam)
            pg.locator('#ideas-next').click();pg.wait_for_timeout(800)
            check(f'DPR {dpr} arrow switches manual',pg.locator('.idea-carousel').get_attribute('data-motion-state')=='manual' and pg.locator('.idea-motion-rail').evaluate('e=>e.getAnimations().length')==0)
            x=pg.locator('#ideas-track').evaluate('e=>e.scrollLeft');pg.wait_for_timeout(500)
            check(f'DPR {dpr} manual remains stopped',abs(pg.locator('#ideas-track').evaluate('e=>e.scrollLeft')-x)<1)
            pg.locator('#ideas-prev').click();pg.wait_for_timeout(800);check(f'DPR {dpr} previous navigates',pg.locator('#ideas-track').evaluate('e=>e.scrollLeft')!=x)
            for key,n in [('family',5),('love',2),('celebrate',4),('styles',4),('all',15)]:
                pg.locator(f'[data-filter={key}]').click();check(f'DPR {dpr} filter {key}',pg.locator('.idea-card[data-idea]:not([hidden])').count()==n)
            pg.locator('.record-sleeve').scroll_into_view_if_needed();pg.wait_for_timeout(250)
            notes=pg.locator('.vinyl-note').evaluate_all('es=>es.map(e=>({transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity}))')
            pg.wait_for_timeout(800);notes2=pg.locator('.vinyl-note').evaluate_all('es=>es.map(e=>({transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity}))')
            check(f'DPR {dpr} notes float and fade',notes!=notes2 and any(0<float(n['opacity'])<1 for n in notes2))
            pg.locator('#vinyl-pause').click();pg.wait_for_timeout(250)
            check(f'DPR {dpr} record pauses decorative effects',pg.locator('.vinyl-note').first.evaluate('e=>getComputedStyle(e).animationPlayState')=='paused' and pg.locator('.letter-head>svg path').evaluate('e=>getComputedStyle(e).animationPlayState')=='paused')
            pg.locator('[data-hero-index="3"]').click();check(f'DPR {dpr} dot changes hero',pg.locator('.hero-stage').get_attribute('data-active-slide')=='3')
            pg.locator('#hero-next').click();check(f'DPR {dpr} hero next retained',pg.locator('.hero-stage').get_attribute('data-active-slide')=='4')
            pg.locator('#locale-open').click();pg.locator('#language-select').select_option('en');pg.locator('#locale-form button[type=submit]').click()
            check(f'DPR {dpr} dots localized after language switch',pg.locator('[data-hero-index="0"]').get_attribute('aria-label').startswith('Show:'))
            pg.locator('[data-idea=mama] a').evaluate('a=>a.click()');pg.wait_for_url('**/create.html**');pg.wait_for_selector('.chosen-idea')
            check(f'DPR {dpr} original form and locale retained',pg.locator('html').get_attribute('lang')=='en' and pg.locator('.chosen-idea strong').inner_text()=='For mom')
            c.close()
        c=context(browser,width=390,reduced_motion='reduce');pg=load(c)
        pg.locator('#ideas-track').scroll_into_view_if_needed();settle(pg)
        check('reduced motion disables rail animation',pg.locator('.idea-motion-rail').evaluate('e=>e.getAnimations().length')==0)
        pg.locator('#ideas-next').click();check('reduced motion manual arrows work',pg.locator('#ideas-track').evaluate('e=>e.scrollLeft')>10)
        check('reduced motion hides notes',not pg.locator('.vinyl-notes').is_visible())
        check('reduced motion disables heart pulse',pg.locator('.letter-head>svg path').evaluate('e=>getComputedStyle(e).animationName')=='none')
        c.close()
        c=context(browser,record_video_dir=str(OUT/'video'),record_video_size={'width':1280,'height':900});pg=load(c);decode(pg)
        pg.mouse.move(1,1);pg.wait_for_timeout(6300)
        pg.locator('.dedication').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(5600)
        pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(6800)
        video=pg.video;c.close();video.save_as(str(OUT/'motion-polish.webm'));browser.close()
except Exception:check('test harness completed',False,traceback.format_exc())
finally:
    server.shutdown()
    report={'passed':sum(r['passed'] for r in RESULTS),'failed':sum(not r['passed'] for r in RESULTS),'scope':'Chromium against repository checkout; ES/EN and US/MX, five widths, DPR 1 and 2. Public photo CDN and real catalog sample. Geo and public-config fixtures; no live payment/order.','results':RESULTS}
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
    if report['failed']:raise SystemExit(1)
