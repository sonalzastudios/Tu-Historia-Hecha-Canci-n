# SONALZA Website V8

V8 refina la experiencia con un enfoque **latino premium, didáctico y mobile-first**. Mantiene la identidad azul marino + naranja de SONALZA, pero evita clichés visuales y hace que el sitio se sienta diseñado a propósito.

## Cambios principales de V8
- Hero desktop en dos columnas para mostrar el estudio completo y centrado, sin recortes incómodos.
- Navegación móvil con menú real y destinos funcionales.
- Nueva sección “Empieza por la emoción” con accesos guiados para amor, familia, Corrido de Tu Vida y negocios.
- Más identidad latina en copy, géneros y narrativa, sin caer en decoración genérica.
- Brief de 8 pasos más didáctico: tips dinámicos, ejemplos, explicaciones de por qué se pregunta cada dato y contadores de caracteres.
- En móvil, controles grandes, tipografía legible, navegación estable y acciones inferiores visibles.
- Seleccionar una opción ya no hace saltar la página hacia arriba; el usuario conserva su posición.
- Parámetros `relation`, `occasion`, `genre` y `product` pueden prellenar el brief desde la home.
- Orden final más clara con “qué pasa después” y confirmación explícita de que el checkout aún no cobra.
- El CTA final dice “Enviar pedido” mientras el procesador de pago no está conectado; no promete una función inexistente.

## Qué funciona
- Home, formulario de 8 pasos, resumen de pedido, USD/MXN y precios promocionales.
- Géneros y rutas rápidas abren el brief con selecciones precargadas.
- Corrido de Tu Vida usa el flujo premium y su precio correspondiente.
- Jingles y Música para Marcas abre `business.html`.
- CTA móvil, selector de moneda y menú móvil funcionan con JavaScript.
- El botón final hace POST a `/api/submit-order`.
- El brief comercial hace POST a `/api/submit-lead`.
- Exit feedback puede guardarse mediante `/api/feedback`.

## Dónde llega la información
Arquitectura preparada:

`Navegador -> Vercel Serverless API -> Supabase (registro) + Resend (notificación por email)`

Email administrativo previsto: `sonalzastudios@gmail.com`.

## Variables de entorno en Vercel
Configurar en Project > Settings > Environment Variables:

- `RESEND_API_KEY`
- `SONALZA_ORDERS_EMAIL=sonalzastudios@gmail.com`
- `SONALZA_FROM_EMAIL=SONALZA Orders <orders@sonalza.com>`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase
Ejecutar `supabase-schema.sql` en el SQL Editor del proyecto Supabase. Las tablas tienen RLS habilitado y la service-role key nunca se expone al navegador.

## Pago
V8 **todavía no cobra**. Registra la orden como `pending_payment`. El siguiente paso de producción es conectar el checkout y confirmar el pago por webhook antes de marcar una orden como pagada.

## V9 — Genre artwork
The genre showcase now includes custom lightweight SVG artwork for Corrido, Banda, Norteño, Cumbia, Mariachi and Más estilos. The art is decorative, responsive and integrated into each clickable genre card without reducing text readability.

V10: upgraded genre cards with richer editorial vector artwork and stronger visual differentiation.


## V11
Genre cards now use editorial photo artwork derived from the approved SONALZA visual concept, with live HTML text and responsive masking.
