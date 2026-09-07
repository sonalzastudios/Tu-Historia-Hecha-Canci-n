# SONALZA Website V22

V22 is the conversion/UX pass. It keeps the premium SONALZA visual system and focuses on product clarity, mobile completion rate, regional pricing, real file handling, bilingual behavior, and launch readiness.

## Product architecture

### Canción Personalizada
- US: US$49
- MX: MX$599
- Focus: one person, occasion, message, or moment.
- Any supported genre, including corrido.
- Short guided form: about 3–5 minutes.

### Corrido de una Vida
- US: US$249
- MX: MX$1,999
- Can be the buyer's life or someone else's life.
- Premium biographical flow: roots, life journey, important people, challenges, achievements, personality, legacy, and corrido direction.
- About 8–12 minutes.

### Música para Negocios
- US: from US$499
- MX: from MX$4,999
- Separate business inquiry flow.

The difference between US$49 and US$249 is now the depth of the creative process—not merely choosing "Corrido" as a genre.

## V22 UX changes
- Specific product CTAs skip the product chooser automatically.
- Generic "Crear mi canción" still opens the product chooser.
- Product chooser is compact on mobile and includes a "¿Cuál es la diferencia?" explanation.
- Mobile hides the desktop support rail and the extra top helper row; the form becomes the primary interface.
- Regional phone formatting: US `(714) 555-1234`, MX `614 123 4567`.
- Email typo suggestions remain enabled, including common Gmail/Hotmail/Outlook mistakes.
- Home navigation prioritizes Escucha, Estilos, Precios, Cómo funciona and Negocios.
- Added an "Escucha el universo SONALZA" gateway linking to the real SONALZA YouTube channel; no fabricated reviews or ratings.
- Reduced discount repetition. Pricing shows the launch reference price and final regional price without infomercial-style repetition.
- Removed the repetitive "El enfoque SONALZA" section.

## Language and regional pricing
- US => USD; default language English.
- MX => MXN; default language Spanish.
- Language can be changed independently of country.
- Regional pricing remains validated server-side.
- UI prices stay hidden briefly while region resolution runs, avoiding the visual flash from USD to MXN.

## Checkout / order review
- Spanish UI no longer uses customer-facing "brief" or "checkout" terminology.
- Corrido de una Vida orders include an expandable life-story review section.
- Custom Cover is now "Portada personalizada" in Spanish.
- The cover-photo flow now prepares a real private Storage upload when Supabase Storage is configured.
- Selected images are resized client-side to reduce upload size before being sent to the server.

## Private cover photo storage
Create the bucket by running the final block in `supabase-schema.sql` or create a private bucket named:

`sonalza-covers`

Then add this Vercel environment variable:

`SUPABASE_COVER_BUCKET=sonalza-covers`

The upload API also requires:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The bucket should remain private. The order stores the private object path inside the order brief.

## Order / email infrastructure
Configure in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_COVER_BUCKET=sonalza-covers`
- `RESEND_API_KEY`
- `SONALZA_ORDERS_EMAIL=sonalzastudios@gmail.com`
- `SONALZA_FROM_EMAIL=SONALZA Orders <orders@sonalza.com>`

Run `supabase-schema.sql` in Supabase SQL Editor.

## Payment status
V22 still does not charge real money. Orders are registered as `pending_payment` once Supabase and/or Resend are configured.

Recommended payment integration next:
1. Stripe Checkout in test mode.
2. Server-side product and regional price calculation.
3. Billing-country validation for US/MX regional pricing.
4. Stripe webhook (`checkout.session.completed`) to change the order to paid.
5. Confirmation email only after payment confirmation.

## Files added / changed in V22
- `index.html` — simplified home funnel + listen section.
- `create.html` — compact product chooser and direct-product routing.
- `order.html` — cleaner Spanish checkout language and life-story review.
- `business.html` — better contact validation and privacy note.
- `faq.html`, `privacy.html`, `terms.html` — more polished support/legal pages.
- `app.js` — separate product flows, regional phone formatting, no-price-flash behavior, better locale re-rendering.
- `api/upload-cover.js` — private cover photo upload endpoint.
- `api/submit-order.js` — stores the expanded life-story fields and private cover path.
- `styles.css` — mobile-first V22 overrides and listening/product UX.
