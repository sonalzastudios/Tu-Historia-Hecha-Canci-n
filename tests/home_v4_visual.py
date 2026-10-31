"""Visual QA after decoded photography and a full-page scroll. No customer data or payments."""
import functools
import http.server
import json
import pathlib
import threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'qa-output'
OUT.mkdir(exist_ok=True)
checks=[]
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_address[1]}'
def check(name,value,detail=None):
    checks.append({'test':name,'passed':bool(value),'detail':detail})
    print(('PASS ' if value else 'FAIL ')+name,flush=True)
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width in [1440,390]:
            for lang in ['es','en']:
                height=960 if width==1440 else 844
                context=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
                context.route('**/api/geo',lambda r:r.fulfill(json={'country':'US','currency':'USD','supported':True}))
                page=context.new_page()
                page.goto(base+f'/index.html?lang={lang}',wait_until='networkidle',timeout=60000)
                page.locator('img').evaluate_all("els=>els.forEach(x=>{x.loading='eager';x.decoding='sync'})")
                decoded=page.evaluate("async()=>Promise.all([...document.images].map(async image=>{try{await image.decode();return {src:image.getAttribute('src'),ok:image.naturalWidth>0}}catch{return {src:image.getAttribute('src'),ok:false}}}))")
                check(f'{width}/{lang} photo decode',all(i['ok'] for i in decoded),decoded)
                page.locator('.closing-art').scroll_into_view_if_needed()
                page.wait_for_timeout(200)
                check(f'{width}/{lang} closing photo visible',page.locator('.closing-art img').is_visible())
                page.locator('.final-cta').screenshot(path=str(OUT/f'closing-v4-{lang}-{width}.png'))
                check(f'{width}/{lang} process heading separated',page.locator('.centered h2 em').evaluate("el=>getComputedStyle(el).display")=='block')
                # Scroll the page before the full screenshot to paint offscreen/lazy media layers.
                page.evaluate('window.scrollTo(0,0)')
                total=page.evaluate('document.documentElement.scrollHeight')
                for y in range(0,total,height):
                    page.evaluate('(y)=>window.scrollTo(0,y)',y)
                    page.wait_for_timeout(45)
                page.evaluate('window.scrollTo(0,0)')
                page.wait_for_timeout(150)
                page.screenshot(path=str(OUT/f'home-v4-{lang}-{width}.png'),full_page=True)
                page.screenshot(path=str(OUT/f'hero-v4-{lang}-{width}.png'),full_page=False)
                page.locator('.occasions').screenshot(path=str(OUT/f'occasions-v4-{lang}-{width}.png'))
                page.locator('.pricing').screenshot(path=str(OUT/f'pricing-v4-{lang}-{width}.png'))
                context.close()
        browser.close()
finally:
    server.shutdown()
    result={'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks}
    (OUT/'visual-review.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
    if result['failed']:raise SystemExit(1)
