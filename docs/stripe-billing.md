# Stripe billing — flujo y pruebas en local

## Índice

1. [Flujo en producción](#1-flujo-en-producción)
2. [Piezas del sistema](#2-piezas-del-sistema)
3. [Probar en local](#3-probar-en-local)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Solución de problemas](#5-solución-de-problemas)
6. [Webhooks en Stripe Dashboard](#6-webhooks-en-stripe-dashboard)

---

## 1. Flujo en producción

Alta de un **owner** (propietario de clínica):

```
/register
  → create-clinic (edge function)
  → /subscription (bloqueado)
  → Stripe Checkout
  → /subscription?checkout=success (espera webhook)
  → /invite-team o /dashboard
```

### Paso a paso

1. **Registro** (`/register`): el usuario crea cuenta (email/contraseña o Google) y datos de la clínica.
2. **Creación de clínica**: la edge function `create-clinic` crea clínica, empleado owner y membership. Un trigger inserta `clinic_billing` con estado `not_started`.
3. **Paywall** (`/subscription`): sin suscripción activa o en prueba, la app redirige aquí desde `(app)` y desde el router post-auth.
4. **Checkout**: el owner pulsa «Empezar prueba gratuita». `createCheckoutSessionAction` crea un customer en Stripe (si no existe) y abre **Stripe Checkout** (suscripción, 30 días de prueba, IVA automático).
5. **Vuelta del usuario**: Stripe redirige a `{NEXT_PUBLIC_SITE_URL}/subscription?checkout=success`. La pantalla hace polling (refresh cada 1,5 s, máx. 30 s) hasta ver estado `trialing` o `active`.
6. **Webhook (asíncrono)**: Stripe envía eventos a `POST /api/stripe/webhook`. Vercel verifica la firma, procesa el evento y actualiza `clinic_billing` en Supabase.
7. **Acceso**: con `trialing` o `active`, el usuario entra en `/invite-team` (si tiene invitaciones pendientes) o `/dashboard`.

### Empleados

Los empleados **no pasan por Stripe**. Entran por invitación. Si el owner no ha activado la suscripción, los empleados internos también quedan en `/subscription` hasta que la clínica tenga acceso.

### Acceso permitido

En `src/lib/billing.ts`, una clínica tiene acceso si:

- `subscription_status` es `trialing` o `active`, o
- `billing_exempt` es `true`, o
- el usuario es `external` (freelance).

---

## 2. Piezas del sistema

| Pieza | Ubicación |
|-------|-----------|
| Checkout / portal | `src/components/billing/actions.ts` |
| Webhook HTTP | `app/api/stripe/webhook/route.ts` |
| Procesado de eventos | `src/lib/stripe/webhook.ts` |
| Cliente Stripe | `src/lib/stripe/server.ts` |
| Persistencia | `src/dal/billing.server.dal.ts` → RPC `apply_stripe_billing_event` |
| UI onboarding billing | `app/(onboarding)/subscription/` |
| Bloqueo en app | `src/components/providers/app-layout-client.tsx` |
| RLS en BD | `supabase/migrations/20260915151612_enforce_stripe_billing_entitlements.sql` |

### Eventos de webhook que procesa la app

- `checkout.session.completed`
- `customer.subscription.created` / `updated` / `paused` / `resumed` / `deleted` / `trial_will_end`
- `invoice.paid` / `invoice.payment_failed`

---

## 3. Probar en local

La forma recomendada es **`stripe listen`**: reenvía webhooks de test a `localhost` sin depender de Vercel.

### Requisitos

- Supabase remoto (misma BD que producción) o local con migraciones de billing aplicadas.
- Claves Stripe de **test** de una sola cuenta (`sk_test_`, `price_`, listener).
- Stripe CLI instalada (`stripe --version`).

### Pasos

**1. Crear `.env.local`**

Ver [variables de entorno](#4-variables-de-entorno). `NEXT_PUBLIC_SITE_URL` debe ser `http://localhost:3000`.

**2. Arrancar la app**

```bash
pnpm dev
```

**3. Arrancar el listener (otra terminal)**

Usa la misma cuenta test que tu `sk_test_`:

```bash
stripe listen --api-key sk_test_TU_CLAVE --forward-to localhost:3000/api/stripe/webhook
```

Al arrancar imprime un signing secret (`whsec_...`). Cópialo a `STRIPE_WEBHOOK_SECRET` en `.env.local` y **reinicia** `pnpm dev`.

Deja `stripe listen` corriendo mientras pruebas billing.

**4. Recorrer el flujo**

1. Abrir `http://localhost:3000/register`
2. Usar un **email nuevo** (los datos persisten en Supabase remoto)
3. Completar registro y clínica → llegar a `/subscription`
4. Pulsar «Empezar prueba gratuita»
5. En Stripe Checkout (modo test): tarjeta `4242 4242 4242 4242`, fecha futura, CVC cualquiera
6. Tras confirmar, vuelta a `http://localhost:3000/subscription?checkout=success`
7. Esperar «Confirmando tu suscripción»; debería redirigir a `/invite-team` o `/dashboard`

**5. Verificar**

| Señal | Significado |
|-------|-------------|
| Eventos en la terminal de `stripe listen` | Stripe envió el webhook |
| Respuesta 200 en el listener | Firma y handler OK |
| Estado `trialing` en `/subscription` | Supabase actualizado |
| Entrada al dashboard | Flujo completo |

### Diagrama local

```
localhost/register → /subscription
        ↓
  Stripe Checkout (test)
        ↓
localhost/subscription?checkout=success
        ↓ (polling)
stripe listen → localhost:3000/api/stripe/webhook → Supabase
        ↓
   /dashboard
```

### Por qué no basta el webhook del Dashboard en local

El webhook de test en Stripe apunta a `https://www.thalia-app.es/api/stripe/webhook`. Ese endpoint corre en **Vercel** con el secret de **producción (live)**. Los eventos de test llevan firma distinta y no actualizan tu servidor local.

Para desarrollo local hace falta `stripe listen` o un túnel (ngrok/cloudflared) registrado en Stripe apuntando a tu máquina.

---

## 4. Variables de entorno

Referencia en `.env.local.example`.

| Variable | Local | Producción (Vercel) |
|----------|-------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://www.thalia-app.es` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` del `stripe listen` | `whsec_...` del webhook live en Dashboard |
| `STRIPE_PRICE_THALIA_NORMAL` | `price_...` de test | `price_...` de live |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (si se usa en cliente) | `pk_live_...` |

`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` y `STRIPE_PRICE_THALIA_NORMAL` deben pertenecer a la **misma cuenta y modo** (test o live).

Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) puede vivir en `.env` compartido.

---

## 5. Solución de problemas

### Se queda en «Confirmando tu suscripción»

- Comprobar que `stripe listen` sigue en ejecución.
- Comprobar que `STRIPE_WEBHOOK_SECRET` en `.env.local` coincide con el secret que imprimió el listener (y reiniciar `pnpm dev` tras cambiarlo).
- Revisar errores en la terminal del listener o en logs del servidor Next.

### Webhooks fallan con HTTP 308

- Vercel redirige `thalia-app.es` → `www.thalia-app.es`. Stripe **no sigue redirects**.
- La URL del webhook en Stripe Dashboard debe ser `https://www.thalia-app.es/api/stripe/webhook` (con `www`).
- `NEXT_PUBLIC_SITE_URL` en Vercel debe usar el mismo dominio canónico.

### «Firma no válida» (400)

- El `whsec_` no corresponde al listener activo. Cada `stripe listen` puede generar un secret distinto al del Dashboard.

### Error al abrir checkout

- Falta `STRIPE_PRICE_THALIA_NORMAL` o el price no existe en la cuenta del `sk_test_`.
- Falta `NEXT_PUBLIC_SITE_URL`.

### «Gestiona la suscripción existente desde el Portal»

- La clínica ya tiene una suscripción Stripe distinta de `not_started` / `canceled` / `incomplete_expired`. Usar otra clínica de prueba o limpiar `clinic_billing` y el customer en Stripe Dashboard (test).

### Datos basura en Supabase remoto

- Cada prueba crea usuarios y clínicas reales. Usar emails desechables y borrar filas de prueba cuando convenga.

---

## 6. Webhooks en Stripe Dashboard

Configuración de referencia (cuenta Thalia):

| Modo | URL |
|------|-----|
| Test | `https://www.thalia-app.es/api/stripe/webhook` |
| Live | `https://www.thalia-app.es/api/stripe/webhook` |

API version: `2026-08-26.dahlia`.

En **local**, el secret del Dashboard **no** sustituye al de `stripe listen`. En **producción**, el secret live va en Vercel como `STRIPE_WEBHOOK_SECRET`.
