# Probar Stripe en local

## Requisitos

- Node.js y `pnpm`.
- Stripe CLI actualizada y autenticada.
- Un sandbox de Stripe separado de producción.
- Una clave restringida de test (`rk_test_...`) con los permisos que usa billing.
- Un precio recurrente de test (`price_...`) y Stripe Tax configurado en el sandbox.
- Supabase con las migraciones de billing aplicadas.

Instala o actualiza la CLI y comprueba la sesión:

```powershell
pnpm add -g @stripe/cli@latest
stripe version
stripe login
stripe whoami --format json
```

## Configuración

Crea el archivo local:

```powershell
Copy-Item .env.local.example .env.local
```

Configura estas variables sin guardar secretos en Git:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_SECRET_KEY=rk_test_...
STRIPE_PRICE_THALIA_NORMAL=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

La clave, el precio y el listener deben pertenecer al mismo sandbox. El valor
`whsec_...` lo genera el siguiente comando; no uses el secret de un webhook del
Dashboard.

## Ejecución

Terminal 1, webhooks:

```powershell
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copia el `whsec_...` mostrado a `.env.local`. Después, en otra terminal:

```powershell
pnpm dev
```

## Prueba manual

1. Abre `http://localhost:3000/register` y crea un owner y una clínica de prueba.
2. En `/subscription`, inicia Stripe Checkout.
3. Usa `4242 4242 4242 4242`, una fecha futura y cualquier CVC.
4. Comprueba que Checkout vuelve a `subscription?checkout=success`.
5. Verifica un `200` en `stripe listen` y que la app pasa de `trialing` o
   `active` al dashboard.
6. Abre el portal de facturación y prueba la cancelación o actualización de la
   suscripción.

No uses tarjetas reales ni claves `live` en local. Actualmente no hay una prueba
automatizada específica de Stripe; `pnpm test:run` no sustituye este recorrido
manual con Checkout y webhooks.

## Diagnóstico rápido

- `400 Firma no válida`: actualiza `STRIPE_WEBHOOK_SECRET` con el valor del
  listener activo y reinicia `pnpm dev`.
- Checkout no abre: revisa que `STRIPE_PRICE_THALIA_NORMAL` exista en el mismo
  sandbox que `STRIPE_SECRET_KEY`.
- La pantalla queda confirmando: mantén `stripe listen` abierto y revisa la
  respuesta del endpoint local.

Más detalle: [flujo completo de Stripe Billing](./stripe-billing.md). Referencias
oficiales: [pruebas de Stripe](https://docs.stripe.com/testing) y
[webhooks locales](https://docs.stripe.com/webhooks).
