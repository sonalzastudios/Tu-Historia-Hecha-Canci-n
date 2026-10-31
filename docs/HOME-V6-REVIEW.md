# SONALZA V6 - implemented changes, not a generated mockup

## Safety boundary
Only the Preview branch changes. Main, Stripe, Supabase, order APIs, app.js, form validation and prices are untouched by V6. V5 is preserved at backup/home-v5-before-motion-fixes (5ccad024dd2d055535f907aa35818da9a9187eaf).

## Configuration
home-v6.config.json is fetched and used by the real homepage JavaScript. It defines 15 illustrative ideas, six hero scenes, ES/EN text, photo IDs/crops, navigation typography and motion intervals. Editing JSON alone does not implement animations: home-v6.js and home-v6.css apply the configuration.

## Requested changes
- Keep the Spanish mom composition (Pexels 16880087) in BOTH languages.
- Replace the distant quince photo 29402196 with Luis Becerra's portrait 5818398. Object-fit cover preserves aspect ratio; image is not stretched or AI face-edited.
- Explicitly describe the cards as starting points with endless possibilities, plus a generic custom-idea CTA.
- Navigation 16px on full desktop / 17px mobile; touch-friendly controls.
- Automatic and manual hero scenes: family, mom, partner, quince, corrido, grandparents. The catalog sample stays accurately named.
- Actual CSS-spinning vinyl behind the dedication card, with a pause button.
- Fix the carousel's permanent stop on ordinary vertical wheel events. Honest state indicators explain intentional pauses. Automatic motion pauses outside view, on hover/focus, during audio and for reduced-motion preferences. Resume is explicit after keyboard interaction; manual arrows remain usable.

## QA
The current run of tests/home_v6_qa.py is authoritative. It measures scrollLeft and active-slide changes over real intervals and compares vinyl transforms; merely finding a CSS class is not considered proof of motion. Tests cover all four language/region combinations at five widths. Public image CDN and catalog audio are real; geo/public-config are fixtures. No live payment is created. Review screenshots and motion-proof.webm before release.

## Image provenance
Quince portrait: https://www.pexels.com/photo/woman-in-pink-dress-wearing-a-tiara-5818398/
Photo license: https://www.pexels.com/license/
Existing mom source: https://www.pexels.com/photo/16880087/
Photography remains illustrative, not customer testimonials or endorsements. No ethnicity is inferred from a visitor or an image.

## Accessibility reference
https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
https://www.w3.org/WAI/ARIA/apg/patterns/carousel/examples/carousel-2-tablist/
