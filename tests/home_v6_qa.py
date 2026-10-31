"""V6 browser regression tests. Runs against the checked-out site, never a live order."""
import functools
import http.server
import json
import pathlib
import threading
import traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-output';OUT.mkdir(exist_ok=True)
RESULTS=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_address[1]}'
def check(name,condition,details=None):
    RESULTS.append({'test':name,'passed':bool(condition),'details':details});print(('PASS ' if condition else 'FAIL ')+name,flush=True)
def context(browser,lang='es',region='US',width=1440,**options):
    c=browser.new_context(viewport={'width':width,'height':960 if width>650 else 844},**options)
    c.add_init_script('if(location.origin==='+json.dumps(BASE)+"&&!sessionStorage.getItem('__seed')){localStorage.setItem('sonalzaLanguageV1',"+json.dumps(lang)+");localStorage.setItem('sonalzaRegionV1',"+json.dumps(region)+");localStorage.setItem('sonalzaLocalePreferenceV1','1');sessionStorage.setItem('__seed','1');}")
    c.route('**/api/geo',lambda r:r.fulfill(json={'country':region,'currency':'USD' if region=='US' else 'MXN','supported':True}))
    c.route('**/api/public-config',lambda r:r.fulfill(json={'stripeCheckoutEnabled':False,'turnstileRequired':False,'turnstileSiteKey':''}))
    return c
def load(c,lang='es'):
    pg=c.new_page();pg.set_default_timeout(20000)
    pg.goto(BASE+'/?lang='+lang+'&utm_source=qa',wait_until='domcontentloaded')
    pg.wait_for_function("document.documentElement.dataset.v6Ready==='true'");pg.wait_for_timeout(250)
    return pg
def overflow(pg):return pg.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)<=innerWidth+1')
def decode_images(pg):
    pg.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
    pg.evaluate("async()=>{await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>null))),new Promise(r=>setTimeout(r,20000))])}")
    return pg.locator('img').evaluate_all('xs=>xs.map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0}))')
try:
    config=json.loads((ROOT/'home-v6.config.json').read_text())
    check('JSON version and content',config['version']==6 and len(config['ideas'])==15 and len(config['hero'])==6)
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width in [1440,1024,768,390,320]:
            for lang,region in [('es','US'),('en','US'),('es','MX'),('en','MX')]:
                c=context(browser,lang,region,width);errors=[]
                c.on('page',lambda pg:pg.on('pageerror',lambda e:errors.append(str(e))))
                pg=load(c,lang);prefix=f'{width}px {region}/{lang}'
                check(prefix+' ready',pg.locator('html').get_attribute('data-home-version')=='6')
                check(prefix+' language',pg.locator('html').get_attribute('lang')==lang)
                mismatches=pg.evaluate("l=>[...document.querySelectorAll('[data-es][data-en]')].filter(n=>n.textContent!==n.dataset[l]).map(n=>n.textContent)",lang)
                check(prefix+' translation pairs',not mismatches,mismatches)
                check(prefix+' prices',all(x==('US$49' if region=='US' else 'MX$599') for x in pg.locator('[data-price=song]').all_text_contents()))
                check(prefix+' 15 inspiration ideas',pg.locator('.idea-card').count()==15)
                check(prefix+' no document overflow',overflow(pg))
                check(prefix+' no runtime errors',not errors,errors)
                check(prefix+' same mom photo','16880087' in pg.locator('[data-idea=mama] img').get_attribute('src'))
                check(prefix+' replaced quince photo','5818398' in pg.locator('[data-idea=quince] img').get_attribute('src'))
                check(prefix+' six hero scenes',pg.locator('.hero-slide').count()==6)
                check(prefix+' unlimited idea copy',('infinitas' if lang=='es' else 'endless') in pg.locator('#dedicar .section-intro').inner_text())
                check(prefix+' custom idea CTA','product=song' in pg.locator('.idea-custom-link').get_attribute('href'))
                if width==1440:check(prefix+' desktop menu >=16px',pg.locator('.desktop-nav').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=16)
                if width<=650:check(prefix+' mobile menu >=17px',pg.locator('#mobile-nav a').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=17)
                if width in [1440,390] and region=='US':
                    images=decode_images(pg);check(prefix+' real images loaded',all(x['ok'] for x in images),[x for x in images if not x['ok']])
                    pg.locator('[data-hero-index="0"]').click();pg.evaluate('window.scrollTo(0,0)');pg.wait_for_timeout(400)
                    pg.screenshot(path=str(OUT/f'hero-v6-{lang}-{width}.png'))
                    pg.locator('#dedicar').screenshot(path=str(OUT/f'carousel-v6-{lang}-{width}.png'))
                    pg.locator('#ideas-all').click();check(prefix+' expanded no overflow',overflow(pg))
                    pg.locator('#dedicar').screenshot(path=str(OUT/f'ideas-all-v6-{lang}-{width}.png'))
                    pg.locator('[data-idea=quince]').screenshot(path=str(OUT/f'quince-{lang}-{width}.png'))
                    pg.locator('[data-idea=mama]').screenshot(path=str(OUT/f'mom-{lang}-{width}.png'))
                    pg.locator('#ideas-all').click();pg.locator('.dedication').screenshot(path=str(OUT/f'vinyl-v6-{lang}-{width}.png'))
                    pg.screenshot(path=str(OUT/f'home-v6-{lang}-{width}.png'),full_page=True)
                c.close()
        # Assert actual movement over time, not just that CSS contains an animation name.
        c=context(browser);pg=load(c);pg.mouse.move(1,1)
        before=pg.locator('.hero-stage').get_attribute('data-active-slide');pg.wait_for_timeout(6500)
        check('hero automatically changes image',pg.locator('.hero-stage').get_attribute('data-active-slide')!=before)
        pg.locator('#hero-pause').click();pg.mouse.move(1,1);before=pg.locator('.hero-stage').get_attribute('data-active-slide');pg.wait_for_timeout(6200)
        check('hero pause remains paused',pg.locator('.hero-stage').get_attribute('data-active-slide')==before)
        pg.locator('#hero-next').click();check('hero next works',pg.locator('.hero-stage').get_attribute('data-active-slide')!=before)
        pg.locator('#hero-prev').click();check('hero previous works',pg.locator('.hero-stage').get_attribute('data-active-slide')==before)
        pg.locator('[data-hero-index="3"]').click();check('hero selection linked to quince','idea=quince' in pg.locator('.hero-slide-link').get_attribute('href'))
        pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(500)
        before=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');pg.wait_for_timeout(5500)
        check('ideas actually move automatically',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>before+20)
        pg.locator('#ideas-track').dispatch_event('wheel',{'deltaY':100,'deltaX':0});pg.mouse.move(1,1)
        before=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');pg.wait_for_timeout(5500)
        check('vertical wheel no longer permanently stops motion',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>before+20)
        pg.locator('#ideas-pause').click();pg.mouse.move(1,1);pg.wait_for_timeout(500);before=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft');pg.wait_for_timeout(5300)
        check('ideas pause remains paused',abs(pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')-before)<3)
        pg.locator('#ideas-pause').click();pg.mouse.move(1,1);pg.wait_for_timeout(5500)
        check('ideas resume works with control focus',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>before+20)
        pg.locator('#ideas-next').click();pg.wait_for_timeout(600);before=pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')
        pg.locator('#ideas-prev').click();pg.wait_for_timeout(600);check('manual previous changes position',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')<before)
        for key,n in [('family',5),('love',2),('celebrate',4),('styles',4),('all',15)]:
            pg.locator(f'[data-filter={key}]').click();check('filter '+key,pg.locator('.idea-card:not([hidden])').count()==n)
        pg.locator('#ideas-track').focus();pg.locator('#ideas-track').press('ArrowRight');pg.wait_for_timeout(650)
        check('keyboard moves ideas',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>20)
        pg.locator('.record-sleeve').scroll_into_view_if_needed();pg.wait_for_timeout(400)
        before=pg.locator('.dedication-vinyl').evaluate('e=>getComputedStyle(e).transform');pg.wait_for_timeout(1000)
        check('vinyl transform actually rotates',pg.locator('.dedication-vinyl').evaluate('e=>getComputedStyle(e).transform')!=before)
        pg.locator('#vinyl-pause').click();before=pg.locator('.dedication-vinyl').evaluate('e=>getComputedStyle(e).transform');pg.wait_for_timeout(900)
        check('vinyl pause works',pg.locator('.dedication-vinyl').evaluate('e=>getComputedStyle(e).transform')==before)
        pg.locator('#locale-open').click();pg.locator('#language-select').select_option('en');pg.locator('#region-select').select_option('MX');pg.locator('#locale-form button[type=submit]').click();pg.wait_for_timeout(200)
        check('switch language keeps independent currency',pg.locator('html').get_attribute('lang')=='en' and pg.locator('[data-price=song]').first.inner_text()=='MX$599')
        check('mom unchanged after EN switch','16880087' in pg.locator('[data-idea=mama] img').get_attribute('src'))
        check('runtime labels translated','Next' in pg.locator('#hero-next').get_attribute('aria-label'))
        for n in range(4):
            pg.locator(f'.track button[data-play="{n}"]').click()
            try:pg.wait_for_function('()=>{const a=document.querySelector("#sample-audio");return !a.paused&&Number.isFinite(a.duration)&&a.duration>0}',timeout=15000);check('real audio '+str(n),True)
            except Exception as e:check('real audio '+str(n),False,str(e))
            pg.locator(f'.track button[data-play="{n}"]').click()
        pg.locator('[data-idea=mama] a').click();pg.wait_for_url('**/create.html**');pg.wait_for_selector('.chosen-idea');pg.wait_for_timeout(300)
        check('existing form opens with selected idea',pg.locator('.chosen-idea strong').inner_text()=='For mom')
        check('existing form language and region persist',pg.locator('html').get_attribute('lang')=='en' and pg.evaluate('localStorage.getItem("sonalzaRegionV1")')=='MX');c.close()
        c=context(browser,'en','US',390,reduced_motion='reduce');pg=load(c,'en');pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(5500)
        check('reduced motion disables automatic ideas',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')<3)
        pg.locator('#ideas-next').click();pg.wait_for_timeout(150);check('manual still works in reduced motion',pg.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')>20)
        pg.locator('.record-sleeve').scroll_into_view_if_needed();check('reduced motion disables vinyl',pg.locator('.dedication-vinyl').evaluate('e=>getComputedStyle(e).animationName')=='none')
        pg.locator('#menu-toggle').click();check('mobile menu opens',pg.locator('#mobile-nav').is_visible());pg.locator('#mobile-nav a[href="#precios"]').click();check('mobile menu closes',not pg.locator('#mobile-nav').is_visible());c.close()
        # Short recording of the real rendered UI; this is not generated artwork.
        c=context(browser,record_video_dir=str(OUT/'video'),record_video_size={'width':1280,'height':854});pg=load(c);decode_images(pg)
        pg.mouse.move(1,1);pg.wait_for_timeout(6500)
        pg.locator('#ideas-track').scroll_into_view_if_needed();pg.mouse.move(1,1);pg.wait_for_timeout(6000)
        pg.locator('.record-sleeve').scroll_into_view_if_needed();pg.wait_for_timeout(2200)
        video=pg.video;c.close();video.save_as(str(OUT/'motion-proof.webm'));browser.close()
except Exception:check('V6 harness completed',False,traceback.format_exc())
finally:
    server.shutdown();report={'passed':sum(x['passed'] for x in RESULTS),'failed':sum(not x['passed'] for x in RESULTS),'results':RESULTS,'scope':'Chromium on checked-out repository; public photo CDN and real catalog audio. Geo/public-config fixtures. No live payment or order.'}
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
    if report['failed']:raise SystemExit(1)
