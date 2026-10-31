# SONALZA Home V3: review and release notes

## Scope and rollback
The homepage is rebuilt in index.html, home-v3.css and home-v3.js. The shared styles.css is restored to its production version. Checkout, prices, APIs, payments, existing customer records and production main are not modified. Original backup: backup/pre-conversion-redesign-2026-10-30 at 4dcac71f2fea31fa37bf29673cb04f114a075e68.

## Language correction
The prior homepage introduced Spanish phrases without updating the exact-string English dictionary in app.js. V3 uses explicit ES/EN content pairs and bilingual dynamic messages instead of that translator on the homepage. Region and language are independent. Song titles retain their original language, with lang=es and translate=no. Checkout preferences use the existing storage keys.

## Commercial design
Navy, warm ivory and orange; existing SONALZA logo; custom typographic record-sleeve illustration; four actual catalog samples; interactive dedication prompts; clear Custom Song vs Life Story Corrido offers; FAQs; mobile purchase button. Delivery remains digital, not a physical record. No invented reviews, ratings, scarcity or delivery deadlines.

## Verification status
The executable browser checks are in tests/home_v3_qa.py. Results are reported by the SONALZA homepage QA GitHub Actions job, not inferred from commits. This document does not claim that an unrun test has passed. The job tests local repository files in Chromium and saves screenshots plus a JSON report. Geolocation responses are test fixtures. No order is submitted and no payment is made.

## Coverage
- Explicit ES/EN copy, dynamic messages, accessible labels and document language.
- US/EN, US/ES, MX/ES, MX/EN at five viewport widths.
- Regional price consistency, locale persistence and checkout handoff.
- Attribution link forwarding, mobile menu, keyboard tabs and modal behavior.
- Actual catalog file presence and local sample playback where supported by Chromium.
- Console errors and visible overflow.

## Measurement limits
The homepage forwards UTMs and fbclid and emits local CustomEvents. This is NOT an installed analytics pipeline, Meta Pixel or verified Purchase tracking. No sales uplift is promised.

## Before production
Inspect the latest Vercel Preview, compare desktop/mobile ES and EN, play the real samples on a phone and verify the existing order/payment flow with authorized test settings. Confirm current delivery policy and feedback publication consent before adding claims. Keep this PR as a draft until the owner approves the design. Do not use an old deployment-specific preview URL.
