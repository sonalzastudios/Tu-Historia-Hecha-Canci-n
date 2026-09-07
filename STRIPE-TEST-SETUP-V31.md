# SONALZA V31 - Stripe TEST setup

Do not use live Stripe keys yet. First verify the complete flow in Stripe test mode.

## Required Vercel environment variables

```text
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ENABLE_STRIPE_CHECKOUT=true
SONALZA_BASE_URL=https://YOUR_DEPLOYMENT_OR_DOMAIN
ALLOW_REGION_OVERRIDE_CHECKOUT=false
```

Keep `ALLOW_REGION_OVERRIDE_CHECKOUT=false` during initial testing. If the site detects a country that conflicts with the selected US/MX region, V31 blocks checkout rather than knowingly charging the wrong regional price.

## Stripe webhook endpoint

Create a Stripe test webhook endpoint pointing to:

```text
https://YOUR_DOMAIN/api/stripe-webhook
```

Listen at minimum for:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

Copy the endpoint signing secret into `STRIPE_WEBHOOK_SECRET`.

Stripe requires the raw request body for signature verification. V31's webhook is configured to disable body parsing and performs HMAC verification before processing an event. Do not enable live payments until a Stripe Dashboard test event reaches this endpoint and returns HTTP 200.

## What V31 does before redirecting to Stripe

1. Recalculates the SONALZA price server-side.
2. Creates/reuses an idempotent SONALZA order.
3. Saves legal acceptance evidence server-side.
4. Uploads any cover reference photo using a short-lived order token.
5. Finalizes the order record.
6. Creates a Stripe Checkout Session from the amount stored by the server.
7. Redirects the customer to Stripe-hosted checkout.

The browser never supplies the amount that Stripe charges.

## What the webhook does

The Stripe webhook is the authority for payment state. Reaching `thanks.html` does not mark an order paid.

For a successful payment it compares:

- Stripe amount vs. SONALZA order amount
- Stripe currency vs. SONALZA order currency
- billing country vs. selected SONALZA region

If all match:

```text
status = paid
payment_status = paid
fulfillment_status = not_started
```

If the payment is received but region/amount/currency does not match:

```text
status = payment_review
payment_status = paid_review
fulfillment_status = on_hold
```

That prevents the production workflow from automatically treating a suspicious regional payment as ready.

## Idempotency

V31 uses:

- browser `client_request_id` -> prevents duplicate SONALZA orders on retries
- Stripe `Idempotency-Key` -> prevents duplicate Checkout Sessions for one order
- `stripe_events.stripe_event_id` -> prevents duplicate webhook processing

## Test sequence before LIVE

Test at least:

1. US Custom Song, no add-ons.
2. US Corrido de una Vida.
3. MX Custom Song.
4. MX Corrido de una Vida.
5. Valid coupon.
6. Invalid coupon.
7. Cover photo upload.
8. Cancel Stripe and return to the order page.
9. Successful Stripe payment.
10. Duplicate click/retry.
11. Stripe webhook resend.
12. Deliberate US/MX region mismatch.

Do not turn on live keys until the database and webhook states match the expected results above.
