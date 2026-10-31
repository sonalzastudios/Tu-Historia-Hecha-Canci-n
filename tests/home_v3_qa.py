"""Browser QA for the homepage only. No live service credentials or orders.
Run: pip install playwright==1.56.0; playwright install chromium;
     python tests/home_v3_qa.py
"""
import functools
import http.server
import json
import pathlib
import threading
import traceback
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-output'
OUT.mkdir(exist_ok=True)
RESULTS = []
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass
server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_address[1]}'

def check(label, condition, details=None):
    RESULTS.append({'test': label, 'passed': bool(condition), 'details': details})
    print(('PASS ' if condition else 'FAIL ') + label, flush=True)

def seed(ctx, lang='en', region='US'):
    values = json.dumps({'sonalzaLanguageV1':lang, 'sonalzaRegionV1':region, 'sonalzaLocalePreferenceV1':'1'})
    # Do not touch about:blank storage; do not overwrite a visitor's changes on navigation.
    ctx.add_init_script(f"if(location.origin === {json.dumps(BASE)} && !sessionStorage.getItem('__qaSeeded')) {{ for (const [k,v] of Object.entries({values})) localStorage.setItem(k,v); sessionStorage.setItem('__qaSeeded','1'); }}")
    ctx.route('**/api/geo', lambda r: r.fulfill(json={'country':region, 'currency':'MXN' if region=='MX' else 'USD', 'supported':True}))
    ctx.route('**/api/public-config', lambda r: r.fulfill(json={'stripeCheckoutEnabled':False, 'turnstileRequired':False, 'turnstileSiteKey':''}))

def load(ctx, lang='en', extra=''):
    page = ctx.new_page()
    page.goto(BASE + '/index.html?lang=' + lang + extra, wait_until='networkidle')
    page.wait_for_function("document.querySelector('#locale-summary').textContent.includes(document.documentElement.lang.toUpperCase())")
    return page

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in [1440, 1024, 768, 390, 320]:
            for lang, region in [('en','US'),('es','US'),('es','MX'),('en','MX')]:
                ctx = browser.new_context(viewport={'width':width,'height':960})
                seed(ctx,lang,region)
                errors=[]
                ctx.on('page', lambda pg: pg.on('pageerror', lambda error: errors.append(str(error))))
                page=load(ctx,lang,'&utm_source=qa&utm_campaign=language-check&utm_content=hero')
                prefix=f'{width}px {region}/{lang}'
                check(prefix+' document language', page.locator('html').get_attribute('lang')==lang)
                mismatches=page.evaluate("""lang=>Array.from(document.querySelectorAll('[data-es][data-en]')).filter(el=>el.textContent!==el.dataset[lang]).map(el=>({text:el.textContent,expected:el.dataset[lang]}))""",lang)
                check(prefix+' all copy pairs match',not mismatches,mismatches)
                aria=page.evaluate("""lang=>Array.from(document.querySelectorAll('[data-aria-es][data-aria-en]')).filter(el=>el.getAttribute('aria-label')!==el.dataset[lang==='en'?'ariaEn':'ariaEs']).map(el=>el.outerHTML)""",lang)
                check(prefix+' accessible labels',not aria,aria)
                prices=page.locator('[data-price=song]').all_text_contents()
                expected='MX$599' if region=='MX' else 'US$49'
                check(prefix+' song pricing',bool(prices) and all(x==expected for x in prices),prices)
                width_info=page.evaluate('({viewport:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth})')
                check(prefix+' no page overflow',max(width_info['html'],width_info['body'])<=width+1,width_info)
                link=page.locator('a[data-cta=hero]').get_attribute('href')
                check(prefix+' order and attribution link',all(x in link for x in ['product=song','lang='+lang,'utm_source=qa','utm_campaign=language-check']),link)
                check(prefix+' no JS exceptions',not errors,errors)
                if width in (1440,390) and region=='US':
                    page.screenshot(path=str(OUT/f'home-{lang}-{width}.png'),full_page=True)
                    page.screenshot(path=str(OUT/f'hero-{lang}-{width}.png'),full_page=False)
                ctx.close()
        ctx=browser.new_context(viewport={'width':1440,'height':960})
        seed(ctx,'en','US');page=load(ctx,'en','&utm_source=qa')
        page.locator('#locale-open').click()
        page.locator('#region-select').select_option('MX')
        page.locator('#language-select').select_option('en')
        page.locator('#locale-form button[type=submit]').click()
        check('MX region preserves English choice',page.locator('html').get_attribute('lang')=='en' and page.locator('[data-price=song]').first.inner_text()=='MX$599')
        page.locator('#locale-open').click()
        page.locator('#language-select').select_option('es')
        page.locator('#locale-form button[type=submit]').click()
        check('switch EN to ES updates title and copy','Regala' in page.title() and page.locator('h1').inner_text().startswith('Hay regalos'))
        page.locator('#tab-love').click()
        check('dedication content changes with tab','PAREJA' in page.locator('#story-label').inner_text())
        page.locator('#tab-love').press('ArrowRight')
        check('dedication keyboard navigation',page.locator('#tab-birthday').get_attribute('aria-selected')=='true')
        page.locator('#locale-open').click();page.keyboard.press('Escape')
        check('locale closes with Escape',not page.locator('#locale-dialog').is_visible())
        page.locator('#locale-open').click();page.locator('#language-select').select_option('en');page.locator('#locale-form button[type=submit]').click()
        assets=page.locator('img[src]').evaluate_all('(els)=>els.map(x=>x.getAttribute("src"))')
        check('referenced images exist in repository',all((ROOT/a).is_file() for a in assets),assets)
        samples=['banda-mujer-de-las-que-quedan.mp3','corrido-los-anos-que-no-vieron.mp3','cumbia-la-limpiadera.mp3','huapango-pasito-de-amor-20-50.mp3']
        check('four audio assets exist',all((ROOT/'assets/audio'/s).is_file() for s in samples))
        for n in range(4):
            page.locator(f'.track button[data-play="{n}"]').click()
            try:
                page.wait_for_function('() => {const a=document.querySelector("#sample-audio");return Number.isFinite(a.duration)&&a.duration>0&&!a.paused;}',timeout=15000)
                check(f'local catalog sample {n} plays',True)
                page.locator(f'.track button[data-play="{n}"]').click()
            except Exception as error:
                check(f'local catalog sample {n} plays',False,str(error))
        page.screenshot(path=str(OUT/'player-en.png'),full_page=True)
        page.locator('[data-cta=hero]').click()
        page.wait_for_url('**/create.html**')
        page.wait_for_timeout(600)
        check('checkout product preselection',page.locator('#songFlow').is_visible())
        check('checkout keeps language',page.locator('html').get_attribute('lang')=='en')
        check('checkout keeps regional preference',page.evaluate('localStorage.getItem("sonalzaRegionV1")')=='MX')
        ctx.close()
        ctx=browser.new_context(viewport={'width':390,'height':844});seed(ctx,'en','US');page=load(ctx)
        page.locator('#menu-toggle').click()
        check('mobile menu opens',page.locator('#mobile-nav').is_visible())
        page.locator('#mobile-nav a[href="#precios"]').click()
        check('mobile menu closes after navigation',not page.locator('#mobile-nav').is_visible())
        check('mobile fixed CTA visible',page.locator('.mobile-buy').is_visible())
        ctx.close()
        ctx=browser.new_context(viewport={'width':390,'height':844})
        ctx.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}});Object.defineProperty(window,'sessionStorage',{get(){throw new DOMException('Blocked','SecurityError')}});")
        ctx.route('**/api/geo',lambda r:r.fulfill(json={'country':None,'supported':False}))
        page=load(ctx,'en');check('homepage survives blocked storage',page.locator('h1').inner_text().startswith('Some gifts'))
        ctx.close();browser.close()
except Exception:
    check('QA harness completed',False,traceback.format_exc())
finally:
    server.shutdown()
    report={'passed':sum(x['passed'] for x in RESULTS),'failed':sum(not x['passed'] for x in RESULTS),'results':RESULTS,'scope':'Local repository Chromium checks. Geo/public-config fixtures. No live order or payment.'}
    (OUT/'report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    print(json.dumps({k:v for k,v in report.items() if k!='results'},ensure_ascii=False),flush=True)
    if report['failed']:
        raise SystemExit(1)
