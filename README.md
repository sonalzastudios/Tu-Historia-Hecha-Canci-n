# SONALZA Website V7

V7 corrige alineación visual, elimina botones sin destino real y agrega una arquitectura real para recepción de pedidos.

## Qué funciona
- Home, formulario de 8 pasos, resumen de pedido, USD/MXN y precios promocionales.
- Géneros clicables que abren el brief con el género preseleccionado.
- Corrido de Tu Vida abre el brief como producto premium y usa su precio correspondiente.
- Jingles y Música para Marcas abre un brief comercial separado (`business.html`).
- CTA móvil corregido.
- Imagen del estudio centrada con proporción estable en desktop y móvil.
- El botón final ya no muestra un alert falso: hace POST a `/api/submit-order`.
- El brief comercial hace POST a `/api/submit-lead`.
- Exit feedback puede guardarse en Supabase mediante `/api/feedback`.

## Dónde llega la información
Arquitectura recomendada:

Navegador -> Vercel Serverless API -> Supabase (registro) + Resend (notificación por email)

El email de recepción por defecto es `sonalzastudios@gmail.com`.

## Variables de entorno en Vercel
Configurar en Project > Settings > Environment Variables:

- `RESEND_API_KEY`
- `SONALZA_ORDERS_EMAIL=sonalzastudios@gmail.com`
- `SONALZA_FROM_EMAIL=SONALZA Orders <orders@sonalza.com>`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Puede funcionar solo con Resend o solo con Supabase, pero para producción se recomienda usar ambos: base de datos + notificación.

## Supabase
Ejecutar `supabase-schema.sql` en el SQL Editor del proyecto Supabase. Las tablas tienen RLS habilitado y el navegador nunca recibe la service-role key; la escritura ocurre únicamente desde las funciones serverless de Vercel.

## Resend
Verificar `sonalza.com` en Resend antes de usar `orders@sonalza.com` como remitente. Durante pruebas puede usarse el remitente de sandbox permitido por Resend.

## Pago
V7 registra la orden como `pending_payment`. Todavía no cobra. El siguiente paso es conectar Stripe Checkout u otro procesador y cambiar el estado después de pago confirmado.
