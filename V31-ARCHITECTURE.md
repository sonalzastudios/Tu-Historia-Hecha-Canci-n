# SONALZA V31 - Order architecture

## Customer flow

```text
Create form
   |
   v
Order review + legal clickwrap
   |
   v
POST /api/submit-order
   |  server validates product, region, coupon, price, consent
   |  creates idempotent pending_payment order
   v
Short-lived signed order token
   |
   +--> optional POST /api/upload-cover
   |       private Supabase Storage
   |       order_files + order event
   |
   v
POST /api/finalize-order
   |
   +--> Stripe disabled: pre-launch receipt page
   |
   +--> Stripe enabled
             |
             v
        POST /api/create-checkout-session
             |
             v
        Stripe-hosted Checkout
             |
             v
        /api/stripe-webhook
             |
             +--> verified payment -> paid
             +--> mismatch -> payment_review/on_hold
```

## Data ownership

The browser does not write directly to Supabase.

The browser does not receive the Supabase service-role key.

Customer cover photos are stored in a private bucket and are associated with a specific server-created SONALZA order.

## Legal evidence

The server, not browser JavaScript, sets:

- Terms version
- Privacy version
- acceptance timestamp
- selected region
- detected country when available
- optional hashed IP evidence
- user agent / Accept-Language

## Payment authority

`thanks.html` is never the authority for whether an order was paid.

The Stripe webhook is the payment authority.
