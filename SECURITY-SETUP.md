# SONALZA V30 · Security setup in Vercel

The code is ready to use these controls, but they only become durable/mandatory after the corresponding environment variables are configured.

## Cloudflare Turnstile
Set in Vercel → Project → Settings → Environment Variables:

- `TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `REQUIRE_TURNSTILE=true`

Recommended rollout:
1. Add site + secret keys.
2. Deploy with `REQUIRE_TURNSTILE=false` and verify the widget appears and orders/leads still work.
3. Switch to `REQUIRE_TURNSTILE=true` only after testing on desktop + iPhone/Android.

## Durable rate limiting (recommended)
The code has a memory fallback, but serverless instances can reset. For real protection configure an Upstash Redis database and add:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Current limits:
- submit order: 6 / 10 min / IP
- submit business lead: 5 / 10 min / IP
- cover upload: 6 / 10 min / IP
- coupon validation: 20 / min / IP
- exit feedback: 15 / min / IP

## Acceptance evidence
Set:
- `EVIDENCE_HASH_SALT` = a long random secret (32+ random bytes recommended)

The server will then store a one-way hash of the client IP rather than the raw IP, plus user-agent and Accept-Language, alongside the server-generated acceptance timestamp/version.

## Supabase migration
Run the V30 additions at the bottom of `supabase-schema.sql` before using the V30 APIs against an existing database.
