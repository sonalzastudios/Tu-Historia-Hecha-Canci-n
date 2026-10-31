# SONALZA Home V3 - safe preview and QA

## Scope
- Replaces the homepage only: index.html, home-v3.css, home-v3.js.
- Existing checkout, create.html, app.js, payments, APIs, legal pages and audio files are not changed.
- Restores shared styles.css to the production version so marketing changes cannot affect checkout styles.
- Main and backup/pre-conversion-redesign-2026-10-30 are not moved.

## Language fix
The previous homepage changed Spanish sentences without adding exact-string translations to app.js TEXT_EN. V3 does not load the legacy homepage translator. It renders 128 explicitly paired ES/EN content nodes plus bilingual runtime messages, stories, metadata and accessible labels.
- Region/currency and website language are independent.
- US: USD 49 / 249 / 499; MX: MXN 599 / 1999 / 4999.
- Uses the existing storage keys sonalzaRegionV1, sonalzaLanguageV1, sonalzaLocalePreferenceV1, sonalzaDetectedRegionV1 and sonalzaRegionOverrideV1 to pass preferences into the current order flow.
- Song titles remain in their original language, marked lang=es and translate=no. The language menu uses native language names.

## Design
Navy, warm ivory and orange; original SONALZA logo; typographic record-sleeve hero; single sample player; interactive dedication examples; clear base vs life-story products; localized FAQs; fixed mobile purchase action. Delivery is digital, not a physical record. Illustration examples are explicitly not customer reviews. No fabricated reviews, ratings, scarcity or guaranteed delivery dates.

## Local validation completed
Chromium offline DOM harness: 157/157 assertions passed. Widths 1440, 1024, 768, 390 and 320; US/EN, US/ES, MX/ES and MX/EN at each width. Checked explicit translation pairs, html language, currency, no horizontal overflow, product-preselected links, UTM retention, locale switching, checkout storage keys, keyboard tabs, modal Escape, mobile menu and graceful blocked-storage behavior. Player controls and localized errors were tested with simulated media events. The exact tested file bytes match GitHub blobs.

## Limits of validation
The test browser had no external site access. Geo responses and audio playback were fixtures, not live Vercel/MP3 tests. Existing media paths were grounded in repository content. Full live payment, native mobile audio, actual API latency and checkout language on every subsequent page remain release checks. This report is not proof of sales lift or an end-to-end payment test.

## Analytics
UTM parameters and fbclid are carried to same-origin links. Page emits sonalza:home-event CustomEvents only, with no personal story/customer data. This is not an installed Meta Pixel, a Purchase event, or a verified conversion analytics pipeline.

## Before merge
1. Open latest Vercel Preview for this branch (not an old deployment-specific URL).
2. Check English and Spanish, US and MX, then follow a song order link.
3. Play real catalog audio on mobile and desktop; check URLs and form preselection.
4. Confirm actual delivery expectations and public feedback permissions before adding claims.
5. Approve visual design before merging. Original remains available on the backup branch.
