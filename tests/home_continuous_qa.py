"""Continuous strip regression: local repository, fixture APIs, no order/payment writes."""
import functools, http.server, json, os, pathlib, threading, traceback
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-output';OUT.mkdir(exist_ok=True)
RESULTS=[];OFFLINE=os.environ.get('CONTINUOUS_OFFLINE')=='1'
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_address[1]}'
def check(name,ok,detail=None):
    RESULTS.append({'test':name,'passed':bool(ok),'details':detail});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
def context(browser,lang='en',region='US',width=1440,**kw):
    c=browser.new_context(viewport={'width':width,'height':960 if width>650 else 844},**kw)
    c.add_init_script('if(location.origin==='+json.dumps(BASE)+"&&!sessionStorage.getItem('__seed')){localStorage.setItem('sonalzaLanguageV1',"+json.dumps(lang)+");localStorage.setItem('sonalzaRegionV1',"+json.dumps(region)+");localStorage.setItem('sonalzaLocalePreferenceV1','1');sessionStorage.setItem('__seed','1');}")
    c.route('**/api/geo',lambda r:r.fulfill(json={'country':region,'currency':'USD' if region=='US' else 'MXN','supported':True}))
    c.route('**/api/public-config',lambda r:r.fulfill(json={'stripeCheckoutEnabled':False,'turnstileRequired':False,'turnstileSiteKey':''}))
    if OFFLINE:
        c.route('https://**/*',lambda r:r.fulfill(content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="720"><rect width="600" height="720" fill="#eadfcd"/></svg>'))
    return c

def load(c,lang='en'):
    p=c.new_page();p.set_default_timeout(15000);p.goto(BASE+'/?lang='+lang+'&utm_source=qa',wait_until='domcontentloaded');p.wait_for_function("document.documentElement.dataset.v6Ready==='true'");p.wait_for_timeout(100);return p

def gallery(p):
    p.locator('#ideas-track').scroll_into_view_if_needed();p.mouse.move(1,1);p.wait_for_function("document.querySelector('#idea-carousel').dataset.motionState==='running'")

def hover_card(p):
    box=p.locator('.idea-card[data-idea]').nth(1).bounding_box();p.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)

def x(p):return p.locator('#ideas-track').evaluate('(e)=>e.scrollLeft')

def progression(p,label,seconds=1.2):
    start=x(p);p.wait_for_timeout(seconds*1000);change=x(p)-start;check(label,change>seconds*10 and change<seconds*32,{'pixels':change,'seconds':seconds});return change
try:
    with sync_playwright() as pw:
        options={'executable_path':os.environ['CHROMIUM_PATH']} if os.environ.get('CHROMIUM_PATH') else {}
        browser=pw.chromium.launch(**options)
        for width in [1440,1024,768,390,320]:
            for lang,region in [('es','US'),('en','US'),('es','MX'),('en','MX')]:
                c=context(browser,lang,region,width);p=load(c,lang);prefix=f'{width} {region}/{lang}'
                check(prefix+' language',p.locator('html').get_attribute('lang')==lang)
                check(prefix+' paired translations',p.evaluate("lang=>[...document.querySelectorAll('[data-es][data-en]')].every(e=>e.textContent===e.dataset[lang])",lang))
                check(prefix+' prices preserved',all(v==('MX$599' if region=='MX' else 'US$49') for v in p.locator('[data-price=song]').all_text_contents()))
                check(prefix+' original 15 ideas',p.locator('.idea-card[data-idea]').count()==15)
                check(prefix+' no page overflow',p.evaluate('Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)<=innerWidth+1'))
                check(prefix+' no pause/resume UI',not p.locator('#ideas-pause').is_visible() and not p.locator('#ideas-motion-status').is_visible())
                check(prefix+' duplicate copies inaccessible',p.locator('[data-loop-copy]').evaluate_all("xs=>xs.length>0&&xs.every(e=>e.getAttribute('aria-hidden')==='true'&&e.querySelector('a').tabIndex===-1)"))
                gallery(p);progression(p,prefix+' uninterrupted motion',.55)
                if width in [1440,390] and region=='US':p.screenshot(path=str(OUT/f'continuous-{lang}-{width}.png'),full_page=False)
                c.close()
        c=context(browser);p=load(c);gallery(p)
        samples=p.evaluate("""()=>new Promise(resolve=>{const values=[];let n=0;const id=setInterval(()=>{values.push(document.querySelector('#ideas-track').scrollLeft);if(++n===20){clearInterval(id);resolve(values)}},100)})""")
        diffs=[samples[i+1]-samples[i] for i in range(len(samples)-1)]
        check('constant gentle speed without dwell intervals',all(0<d<6 for d in diffs),diffs)
        hover_card(p);progression(p,'hover does not pause')
        p.locator('#ideas-title').click();progression(p,'unrelated click does not pause')
        p.locator('#ideas-track').dispatch_event('wheel',{'deltaY':60,'deltaX':0});progression(p,'vertical wheel does not pause')
        p.evaluate("document.querySelector('#sample-audio').src='assets/audio/banda-mujer-de-las-que-quedan.mp3';document.querySelector('#sample-audio').play()")
        p.wait_for_function("!document.querySelector('#sample-audio').paused");progression(p,'actual catalog audio does not pause')
        p.evaluate("document.querySelector('#sample-audio').pause()")
        span=p.locator('#idea-carousel').evaluate('e=>Number(e.dataset.loopSpan)')
        p.evaluate("span=>{document.querySelector('#ideas-track').scrollLeft=span-8;document.dispatchEvent(new Event('visibilitychange'))}",span)
        p.wait_for_timeout(1000);check('automatic seam wraps without returning across all cards',0<x(p)<35,{'span':span,'x':x(p)})
        p.locator('#ideas-next').click();p.wait_for_timeout(800);before=x(p);p.wait_for_timeout(900)
        check('arrow takes manual control and holds',abs(x(p)-before)<2 and p.locator('#idea-carousel').get_attribute('data-motion-state')=='manual')
        p.locator('#ideas-prev').click();p.wait_for_timeout(800);check('previous arrow works',x(p)<before)
        p.locator('#ideas-next').click();p.wait_for_timeout(800);check('next arrow still works',x(p)>10)
        p.reload(wait_until='domcontentloaded');p.wait_for_function("document.documentElement.dataset.v6Ready==='true'");gallery(p)
        for key,n in [('family',5),('love',2),('celebrate',4),('styles',4),('all',15)]:
            p.locator(f'[data-filter={key}]').click();check('filter '+key,p.locator('.idea-card[data-idea]:not([hidden])').count()==n)
        progression(p,'filters do not permanently stop automatic movement')
        p.locator('#ideas-all').click();check('all ideas is a static accessible gallery',p.locator('[data-loop-copy]').count()==0 and p.locator('.idea-card[data-idea]:visible').count()==15)
        p.locator('#ideas-all').click();gallery(p);progression(p,'return from all ideas resumes')
        p.locator('#locale-open').click();p.locator('#language-select').select_option('es');p.locator('#locale-form button[type=submit]').click();gallery(p)
        check('copies update language and links',p.locator('[data-loop-copy] a').evaluate_all("xs=>xs.every(a=>a.href.includes('lang=es'))"))
        progression(p,'locale change does not stop movement')
        p.locator('#ideas-next').click();p.wait_for_timeout(750)
        p.locator('#ideas-track').evaluate("e=>{e.scrollLeft=Number(document.querySelector('#idea-carousel').dataset.loopSpan)}")
        p.locator('[data-loop-copy="0"] a').click();p.wait_for_url('**/create.html**');p.wait_for_selector('.chosen-idea')
        check('loop-copy CTA opens the original form',p.locator('.chosen-idea strong').inner_text()=='Para mam\u00e1' and 'utm_source=qa' in p.url)
        check('form keeps selected language',p.locator('html').get_attribute('lang')=='es');c.close()
        c=context(browser,width=390,reduced_motion='reduce');p=load(c);p.locator('#ideas-track').scroll_into_view_if_needed();a=x(p);p.wait_for_timeout(1000)
        check('reduced-motion preference retained',abs(x(p)-a)<2)
        p.locator('#ideas-next').click();p.wait_for_timeout(200);check('arrows work with reduced motion',x(p)>50);c.close()
        c=context(browser,width=390);p=load(c);gallery(p)
        p.locator('#ideas-track').dispatch_event('pointerdown',{'pointerType':'touch','clientX':200,'clientY':400});p.locator('#ideas-track').dispatch_event('pointermove',{'pointerType':'touch','clientX':120,'clientY':402});p.locator('#ideas-track').dispatch_event('pointerup',{'pointerType':'touch','clientX':120,'clientY':402})
        check('deliberate swipe gives touch control',p.locator('#idea-carousel').get_attribute('data-motion-state')=='manual');c.close()
        c=context(browser);p=load(c);gallery(p);p.keyboard.press('Tab');p.locator('.idea-card[data-idea] a').first.focus();p.wait_for_timeout(150)
        check('keyboard browsing stays accessible',p.locator('#idea-carousel').get_attribute('data-motion-state')=='manual');c.close()
        if not OFFLINE:
            c=context(browser,record_video_dir=str(OUT/'video'),record_video_size={'width':1280,'height':850},width=1280);p=load(c)
            p.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
            p.evaluate("async()=>Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>null))),new Promise(r=>setTimeout(r,15000))])")
            gallery(p);hover_card(p);p.wait_for_timeout(6500)
            p.evaluate("document.querySelector('#sample-audio').src='assets/audio/banda-mujer-de-las-que-quedan.mp3';document.querySelector('#sample-audio').play()")
            p.wait_for_timeout(4000);p.locator('#ideas-next').click();p.wait_for_timeout(1200)
            video=p.video;c.close();video.save_as(str(OUT/'continuous-proof.webm'))
        browser.close()
except Exception:check('continuous QA completed',False,traceback.format_exc())
finally:
    server.shutdown();report={'passed':sum(x['passed'] for x in RESULTS),'failed':sum(not x['passed'] for x in RESULTS),'scope':'Local repository Chromium. Fixture API configuration. No live purchase. '+('Offline image placeholders.' if OFFLINE else 'Public photo CDN and catalog MP3s.'),'results':RESULTS}
    (OUT/'continuous-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print({k:v for k,v in report.items() if k!='results'},flush=True)
    if report['failed']:raise SystemExit(1)
