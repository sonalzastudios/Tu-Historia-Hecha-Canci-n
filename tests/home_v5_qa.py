"""V5 browser regression: real repository assets/CDN images; API fixtures, no orders."""
import functools, http.server, json, pathlib, threading, traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-output';OUT.mkdir(exist_ok=True)
RESULTS=[]
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_address[1]}'
def check(name,ok,details=None):
    RESULTS.append(dict(test=name,passed=bool(ok),details=details));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def context(browser,lang='es',region='US',width=1440,**opts):
    ctx=browser.new_context(viewport=dict(width=width,height=960 if width>650 else 844),**opts)
    values=json.dumps(dict(sonalzaLanguageV1=lang,sonalzaRegionV1=region,sonalzaLocalePreferenceV1='1'))
    ctx.add_init_script(f"if(location.origin==={json.dumps(BASE)}&&!sessionStorage.getItem('__seeded')){{Object.entries({values}).forEach(([k,v])=>localStorage.setItem(k,v));sessionStorage.setItem('__seeded','1');}}")
    ctx.route('**/api/geo',lambda r:r.fulfill(json={'country':region,'currency':'MXN' if region=='MX' else 'USD','supported':True}))
    ctx.route('**/api/public-config',lambda r:r.fulfill(json={'stripeCheckoutEnabled':False,'turnstileRequired':False,'turnstileSiteKey':''}))
    return ctx
def load(ctx,lang='es'):
    pg=ctx.new_page();pg.goto(BASE+'/index.html?lang='+lang+'&utm_source=qa&utm_campaign=v5',wait_until='domcontentloaded')
    pg.wait_for_function("document.documentElement.dataset.v5Ready==='true'&&document.querySelector('#locale-summary').textContent.includes(document.documentElement.lang.toUpperCase())")
    pg.wait_for_timeout(300);return pg
def overflow(pg):
    return pg.evaluate('Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)<=innerWidth+1')
def photos(pg):
    pg.evaluate("document.querySelectorAll('img').forEach(x=>x.loading='eager')")
    pg.evaluate("async()=>{await Promise.all([...document.images].map(x=>x.decode().catch(()=>null)))}")
    return pg.locator('img').evaluate_all('els=>els.map(x=>({src:x.src,ok:x.complete&&x.naturalWidth>0}))')
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  for width in [1440,1024,768,390,320]:
   for lang,region in [('es','US'),('en','US'),('es','MX'),('en','MX')]:
    ctx=context(browser,lang,region,width);errors=[];ctx.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))))
    pg=load(ctx,lang);prefix=f'{width} {region}/{lang}'
    check(prefix+' language',pg.locator('html').get_attribute('lang')==lang)
    bad=pg.evaluate("l=>[...document.querySelectorAll('[data-es][data-en]')].filter(e=>e.textContent!==e.dataset[l]).map(e=>e.textContent)",lang)
    check(prefix+' bilingual pairs',not bad,bad)
    check(prefix+' price',all(x==('US$49' if region=='US' else 'MX$599') for x in pg.locator('[data-price=song]').all_text_contents()))
    check(prefix+' 15 ideas',pg.locator('.idea-card').count()==15)
    check(prefix+' overflow',overflow(pg))
    check(prefix+' no JS exceptions',not errors,errors)
    check(prefix+' attribution',all(x in pg.locator('[data-cta=hero]').get_attribute('href') for x in ['product=song','lang='+lang,'utm_source=qa']))
    check(prefix+' samples before ideas',pg.locator('#escuchar').bounding_box()['y']<pg.locator('#dedicar').bounding_box()['y'])
    check(prefix+' hero CTA visible',pg.locator('[data-cta=hero]').bounding_box()['y']<(960 if width>650 else 844))
    check(prefix+' photo locale',str(4651050 if lang=='en' else 8573556) in pg.locator('.hero-photo img').get_attribute('src'))
    if width in [1440,390] and region=='US':
     info=photos(pg);check(prefix+' real photos decoded',all(x['ok'] for x in info),info)
     pg.evaluate('window.scrollTo(0,0)');pg.wait_for_timeout(300)
     pg.screenshot(path=str(OUT/f'hero-v5-{lang}-{width}.png'))
     pg.locator('#dedicar').screenshot(path=str(OUT/f'carousel-v5-{lang}-{width}.png'))
     pg.locator('#ideas-all').click();pg.wait_for_timeout(200)
     check(prefix+' expanded overflow',overflow(pg));pg.locator('#dedicar').screenshot(path=str(OUT/f'ideas-all-{lang}-{width}.png'))
     pg.locator('#ideas-all').click();pg.screenshot(path=str(OUT/f'home-v5-{lang}-{width}.png'),full_page=True)
    ctx.close()
  ctx=context(browser,'es');pg=load(ctx);pg.locator('#dedicar').scroll_into_view_if_needed();pg.mouse.move(1,1)
  x0=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');pg.wait_for_timeout(7400)
  check('automatic advance',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>x0+20)
  pg.locator('#ideas-pause').click();x0=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');pg.mouse.move(1,1);pg.wait_for_timeout(7200)
  check('pause stays stopped',abs(pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')-x0)<4)
  pg.locator('#ideas-next').click();pg.wait_for_timeout(800);x1=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');check('manual next',x1>x0)
  pg.locator('#ideas-prev').click();pg.wait_for_timeout(800);check('manual previous',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')<x1)
  for key,n in [('family',5),('love',2),('celebrate',4),('styles',4),('all',15)]:
   pg.locator(f'[data-filter={key}]').click();check('filter '+key,pg.locator('.idea-card:not([hidden])').count()==n)
  pg.locator('#ideas-track').focus();pg.locator('#ideas-track').press('ArrowRight');pg.wait_for_timeout(800);check('keyboard advances',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>20)
  pg.locator('#locale-open').click();pg.locator('#region-select').select_option('MX');pg.locator('#language-select').select_option('en');pg.locator('#locale-form button[type=submit]').click();pg.wait_for_timeout(200)
  check('language independent from currency',pg.locator('html').get_attribute('lang')=='en' and pg.locator('[data-price=song]').first.inner_text()=='MX$599')
  check('carousel translated after switch',pg.locator('.idea-card').first.locator('h3').inner_text()=='For mom')
  check('photo changed after switch','7951784' in pg.locator('.idea-card').first.locator('img').get_attribute('src'))
  for n in range(4):
   pg.locator(f'.track button[data-play="{n}"]').click()
   try:pg.wait_for_function("()=>{let a=document.querySelector('#sample-audio');return !a.paused&&Number.isFinite(a.duration)&&a.duration>0}",timeout=15000);check('audio '+str(n),True)
   except Exception as e:check('audio '+str(n),False,str(e))
   pg.wait_for_timeout(100);check('visible pause label '+str(n),pg.locator(f'.track button[data-play="{n}"] .play-caption').inner_text()=='Pause');pg.locator(f'.track button[data-play="{n}"]').click()
  pg.locator('[data-filter=all]').click();pg.locator('[data-idea=hija] a').click();pg.wait_for_url('**/create.html**');pg.wait_for_selector('.chosen-idea');pg.wait_for_timeout(500)
  check('chosen idea passed',pg.locator('.chosen-idea strong').inner_text()=='For my little princess')
  check('form retains language',pg.locator('html').get_attribute('lang')=='en')
  check('form region retained',pg.evaluate('localStorage.getItem("sonalzaRegionV1")')=='MX')
  check('form selected relation',pg.locator('[data-key=paraQuien].selected').get_attribute('data-value')=='Hija')
  check('editable idea survives in brief','fairytale' in pg.evaluate('JSON.parse(localStorage.getItem("sonalzaSongDraftV2")).emocion'))
  pg.locator('#nextBtn').click();pg.wait_for_selector('#nombre');pg.locator('#nextBtn').click();check('empty name validation preserved',pg.locator('#nombre').is_visible())
  pg.locator('#nombre').fill('QA Demo');pg.locator('#nextBtn').click();pg.wait_for_selector('[data-key=ocasion]');pg.locator('#nextBtn').click();pg.wait_for_selector('[data-key=genero]');pg.locator('[data-voice-choice=ALTUNO]').click();pg.locator('#nextBtn').click();pg.wait_for_selector('#cualidades');pg.locator('#cualidades').fill('She is kind, curious and always helps her family.');pg.locator('#nextBtn').click();pg.wait_for_selector('#recuerdo');pg.locator('#recuerdo').fill('We sing together every Sunday in the garden with the family.');pg.locator('#nextBtn').click();pg.wait_for_selector('#emocion');check('selected brief reaches message step','fairytale' in pg.locator('#emocion').input_value());pg.locator('#nextBtn').click();pg.wait_for_selector('#email');check('all form steps reach contact',pg.locator('#email').is_visible());pg.screenshot(path=str(OUT/'form-en-contact.png'),full_page=True);ctx.close()
  for width in [1440,390,320]:
   for lang in ['es','en']:
    ctx=context(browser,lang,'US',width);pg=ctx.new_page();pg.goto(BASE+f'/create.html?product=song&idea=mama&relation=Mam%C3%A1&occasion=Gracias&genre=Banda&lang={lang}');pg.wait_for_selector('.chosen-idea');pg.wait_for_timeout(500)
    check(f'form {lang} {width} overflow',overflow(pg));check(f'form {lang} {width} bilingual banner',pg.locator('.chosen-idea strong').inner_text()==('For mom' if lang=='en' else 'Para mam\u00e1'))
    if width in [1440,390]:pg.screenshot(path=str(OUT/f'form-{lang}-{width}.png'),full_page=True)
    ctx.close()
  ctx=context(browser,'es','US',390,reduced_motion='reduce');pg=load(ctx);pg.locator('#dedicar').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(7000);check('reduced motion no autoplay',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')<4);pg.locator('#ideas-next').click();check('reduced motion manual still works',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>20);ctx.close()
  ctx=context(browser,'en','US',390);pg=load(ctx,'en');pg.locator('#menu-toggle').click();check('mobile menu',pg.locator('#mobile-nav').is_visible());pg.locator('#mobile-nav a[href="#precios"]').click();check('menu closes',not pg.locator('#mobile-nav').is_visible());check('fixed mobile buy',pg.locator('.mobile-buy').is_visible());ctx.close()
  browser.close()
except Exception:check('V5 harness completed',False,traceback.format_exc())
finally:
 server.shutdown();report=dict(passed=sum(x['passed'] for x in RESULTS),failed=sum(not x['passed'] for x in RESULTS),results=RESULTS,scope='GitHub Chromium on repository files. Live public CDN images and real MP3 assets. Mock geo and public-config. No live orders/payment.');(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
 if report['failed']:raise SystemExit(1)
