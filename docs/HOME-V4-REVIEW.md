# SONALZA Home V4 - people-led gifting, safe Preview

## Rollback and boundaries
Original production: main at 4dcac71f2fea31fa37bf29673cb04f114a075e68. Original backup: backup/pre-conversion-redesign-2026-10-30. V3 backup: backup/home-v3-before-photo-redesign at 2693794e6a2b8d02dbf92bb59ce3b0d7202e8339.

This revision replaces the homepage markup and adds an isolated home-v4.css. It retains the tested home-v3.js bilingual/region/player behavior. It does not change checkout, order APIs, payment code, product pricing, customer data, or shared styles.css. No automatic production merge.

## Commercial intent
- Replace the decorative vinyl hero with human, explicitly illustrative photography.
- Light warm neutrals, dark navy brand typography, restrained terracotta purchase actions.
- Show the custom-song offer and price immediately, alongside sample playback.
- Three dedicated occasion purchase paths: family, partner, celebration.
- Actual SONALZA catalog samples, explicit song lengths, revision scope and optional extras.
- No fabricated reviews, stars, endorsements, deadlines, discounts or urgency.
- No subscription claim grounded in Stripe Checkout mode=payment in api/create-checkout-session.js.
- Language/currency remain independent; current pricing and checkout storage keys are preserved.

## Photo provenance and constraints
Pexels License: https://www.pexels.com/license/
License permits website/promotion uses but prohibits implying endorsement by depicted people. Every photo is presented as illustrative, not a customer reaction or testimonial. This preview references optimized images on the public Pexels CDN; source availability is included in browser QA. No rights are asserted beyond the published license.

- RDNE Stock project, Mother Hugging Her Daughter: https://www.pexels.com/photo/mother-hugging-her-daughter-7951784/
- Ketut Subiyanto, Photo of Couple Sitting Next to Each Other While Listening to Music: https://www.pexels.com/photo/photo-of-couple-sitting-next-to-each-other-while-listening-to-music-4651050/
- On Shot, People Celebrating Birthday: https://www.pexels.com/photo/people-celebrating-birthday-10165858/

## Tests
The current workflow checks ES/EN and US/MX at 320/390/768/1024/1440px, copy pairs, accessible labels, overflow, CTA visibility, URL attribution, dialogs, tabs, real catalog audio and checkout preference continuity. Screenshots and the actual JSON report are the evidence; do not assume approval until the run succeeds. Geo/public-config endpoints are fixtures; there is no live payment test. V3 test counts are historical and do not describe V4.

## Not solved by a redesign
Real customer proof requires permission and genuine delivered orders. A reliable turnaround promise must come from operations. Purchase tracking must be validated separately; custom DOM events are not a configured Meta Pixel or Conversions API. A visual redesign cannot promise a sales increase without qualified traffic and measured outcomes.
