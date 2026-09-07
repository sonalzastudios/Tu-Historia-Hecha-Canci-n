# SONALZA Website V32

## Mobile CTA hotfix
- Restores the launch CTA as a true fixed bottom dock on phones.
- Removes the translate animation that could cause iOS/Safari compositing drift during scroll.
- Uses safe-area spacing for iPhones with the home indicator.
- Keeps the CTA linked to `create.html`, so the customer first sees the service chooser.

# SONALZA Website V31

V31 is the first production-order architecture release. The visual design remains essentially V30; the work is concentrated behind the order button.

## V31 changes

- Supabase is now the required source of truth for customer orders.
- Added idempotent `client_request_id` so retries do not create duplicate orders.
- Added structured order lifecycle fields: status, payment status, fulfillment status, submitted/paid timestamps.
- Added `order_events` audit trail.
- Added `order_files` metadata for private customer files.
- Added `stripe_events` idempotency/audit table.
- Cover uploads now require a short-lived signed token tied to a real SONALZA order.
- Cover paths are namespaced under `orders/<ORDER_ID>/...` in the private bucket.
- Customer-supplied `coverImagePath` is no longer trusted as the authoritative file path.
- Added `finalize-order` step after optional private upload.
- Added Stripe Checkout TEST-ready endpoint behind `ENABLE_STRIPE_CHECKOUT`.
- Added Stripe webhook scaffold with signature verification and amount/currency/billing-country checks.
- Payment is never inferred from visiting the thank-you page.
- Added server/payment idempotency layers to reduce duplicate orders/sessions/events.
- Added payment-return messaging on `thanks.html` without claiming payment solely from the URL.

## Important deployment order

Do not deploy V31 over the current production site until Supabase is configured.

1. Follow `SUPABASE-SETUP-V31.md`.
2. Run `supabase-schema.sql`.
3. Add Supabase variables in Vercel.
4. Deploy with `ENABLE_STRIPE_CHECKOUT=false`.
5. Run a full no-payment test order.
6. Only then follow `STRIPE-TEST-SETUP-V31.md`.

## Core environment variables

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_COVER_BUCKET=sonalza-covers
ORDER_TOKEN_SECRET
EVIDENCE_HASH_SALT
```

Security services remain recommended:

```text
TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
REQUIRE_TURNSTILE
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Stripe test variables are documented separately and should remain disabled until the Supabase flow passes.
