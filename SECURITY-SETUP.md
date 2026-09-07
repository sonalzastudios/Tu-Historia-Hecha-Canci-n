# SONALZA V31 - Security setup in Vercel

## Cloudflare Turnstile

Set:

```text
TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
REQUIRE_TURNSTILE=true
```

Recommended rollout:

1. Add keys.
2. Deploy with `REQUIRE_TURNSTILE=false` and verify the widget on desktop/mobile.
3. Change to `REQUIRE_TURNSTILE=true` after successful tests.

## Durable rate limiting

The code has an in-memory fallback, but durable production limiting should use Upstash:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## Order-scoped upload authorization

V31 no longer permits an anonymous cover upload merely because the endpoint URL is known.

`submit-order` creates a short-lived signed token tied to one SONALZA order. `upload-cover` verifies that token, checks that the order actually includes the cover add-on, checks payment state, verifies image magic bytes, and stores the file under the order ID.

Recommended:

```text
ORDER_TOKEN_SECRET=<32+ random bytes>
```

## Acceptance evidence

Recommended:

```text
EVIDENCE_HASH_SALT=<different 32+ byte random secret>
```

The server can store a one-way IP hash instead of the raw IP along with server-generated legal version/timestamp evidence.

## Upload limits

The browser resizes the image before upload. The Vercel endpoint limits the processed image to 2.5 MB so the base64 JSON request remains below Vercel's function payload ceiling.

Accepted real file signatures:

- JPEG
- PNG
- WebP

The declared MIME type alone is not trusted.

## Stripe

Stripe remains off unless both are true:

```text
ENABLE_STRIPE_CHECKOUT=true
STRIPE_SECRET_KEY=<configured>
```

Webhook processing additionally requires:

```text
STRIPE_WEBHOOK_SECRET
```

The payment webhook must pass signature verification before any order is marked paid.
