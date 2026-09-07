# SONALZA V31 - Supabase setup

V31 changes the order pipeline from a loose form submission into a database-backed order record with an audit trail and private file ownership.

## 1. Create or open the SONALZA Supabase project

In Supabase, open the project that will hold production/test SONALZA data.

Do not expose the service-role key in browser JavaScript, HTML, GitHub, or public environment variables.

## 2. Run the schema

Open Supabase -> SQL Editor and run the complete file:

`supabase-schema.sql`

The script is migration-safe and can be run on the existing SONALZA database. It adds:

- expanded `orders`
- `order_events`
- `order_files`
- `stripe_events`
- private `sonalza-covers` Storage bucket
- indexes and updated-at trigger
- RLS on customer/order tables

The browser receives no direct table or Storage permissions. Server-side Vercel functions use the service-role key.

## 3. Add Vercel environment variables

Required for the V31 order pipeline:

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_SECRET
SUPABASE_COVER_BUCKET=sonalza-covers
```

Strongly recommended:

```text
ORDER_TOKEN_SECRET=LONG_RANDOM_SECRET
EVIDENCE_HASH_SALT=DIFFERENT_LONG_RANDOM_SECRET
```

Generate independent secrets locally, for example:

```bash
openssl rand -hex 32
```

Use a different generated value for each variable.

`ORDER_TOKEN_SECRET` signs short-lived order authorization tokens used by private uploads and checkout preparation. If omitted, V31 can derive the short-lived token signature from the Supabase service-role key, but a dedicated secret is cleaner and easier to rotate.

`EVIDENCE_HASH_SALT` lets the server store a one-way hash of the IP as part of acceptance evidence without storing the raw IP in the order record.

## 4. Keep Stripe disabled for the first database test

Initially set:

```text
ENABLE_STRIPE_CHECKOUT=false
```

Deploy V31 only after the Supabase variables and schema are in place.

## 5. Test one US order without payment

Create a test Custom Song and finish the order form.

Expected database result:

- one row in `orders`
- `status = pending_payment`
- `payment_status = unpaid`
- server-generated Terms/Privacy versions and acceptance timestamp
- one `order_created` event
- one `order_submitted` event
- no duplicate order when retrying the same browser checkout attempt

If Portada personalizada is selected and a photo is uploaded, also expect:

- private object under `sonalza-covers/orders/<ORDER_ID>/cover/...`
- `orders.cover_path` populated
- one row in `order_files`
- one `cover_uploaded` event

## 6. Verify RLS/privacy

In Supabase, confirm RLS is enabled for:

- `orders`
- `order_events`
- `order_files`
- `stripe_events`
- `business_leads`
- `exit_feedback`

No anonymous SELECT/INSERT policies are required for the V31 architecture because writes go through Vercel server functions using the service-role key.

## 7. Only after the database test passes

Proceed to `STRIPE-TEST-SETUP-V31.md`.
