# SONALZA V5 - Latin music, families and 15 ideas

## Safe scope
Work is isolated on feature/conversion-redesign-oct-2026 / PR2. Main remains unchanged. V4 backup: backup/home-v4-before-latin-carousel at 59843d28e45d975f89555af36d58fa88f4146e0f. Prices, app.js, shared styles.css, Stripe, Supabase and order API code unchanged. create.html only adds isolated presentation JS/CSS before its existing controller. The extension passes selected creative directions into empty editable draft fields, never overwriting existing customer story text.

## User-facing changes
- 15 bilingual ideas: mom, corrido, partner, daughter/princess, dad, cumbia, family, birthday, quince, wedding, grandparents, friendship, hip-hop request, mariachi, graduation/milestone.
- Photo variants selected by site language, not inferred ethnicity or browser profiling. ES emphasizes family, Mexican music/dance settings and dedications; EN retains those musical roots with additional international photo options.
- Native horizontal swipe/scroll, previous/next, automatic rotation only in view, pause/resume, keyboard controls, filters and expanded gallery.
- Auto rotation pauses on hover, focus, manual interaction, audio playback and reduced-motion preference. No autoplay music.
- Actual audio examples placed before the idea gallery, with visible play/pause text.
- Ivory background, navy contrast, terracotta primary actions; color is a design hypothesis, not a sales guarantee.
- Form selected-idea banner, clear button states, readable inputs, mobile action bar; no reduction of required order validations.

## Honest product boundaries
Hip-hop is not in the existing standard genre list. Its card is explicitly a special style request, carried as an editable message with the supported 'Surprendeme' fallback. No fake hip-hop sample or automatic production capability is claimed. Illustrative stock photography is never presented as customer reviews or SONALZA musicians.

## Photos
Pexels public license https://www.pexels.com/license/ and source pages govern use. Public optimized CDN dependency remains. Photo IDs: 8573556 family (Luis Quintero); 16880087 mother/daughters; 6532607 couple (Budgeron Bach); 5789949 princess; 7139797 princess alternate; 26536269 guitar/hat (Eli Villarreal); 12775208 father/children; 14100621 dancers; 10165858 birthday; 29402196 quince (Eduardo Gonzalez); 33510700 wedding; 5764903 grandmother; 5738213 friends; 6567249 friends alternate; 12847349 microphone performance; 8639397 mariachi; 19566177 graduation; 17192509 graduation alternate. Existing 7951784 and 4651050 retained as English options.
Source URLs follow https://www.pexels.com/photo/<ID>/ . No ethnicity is inferred from an image; culturally relevant selection uses source descriptions and visible scene/context. Public labels describe occasion, not race. Images are decorative and marked illustrative, no endorsement.

## Validation
Run tests/home_v5_qa.py in GitHub Actions. Read the actual result report; no test is assumed passed in this document. QA covers 20 language/region/width combinations, actual photo decode and catalog audio, controls, selected-idea handoff, basic form validation and all song steps to contact. API geo/public-config are fixtures. No live order or payment. These tests are not proof of conversion uplift or a comprehensive accessibility certification.

## Review before release
Review decoded image crops and children imagery, both languages and mobile. Confirm special-style handling with operations. Keep PR draft until owner accepts. Public production and backups are untouched.
