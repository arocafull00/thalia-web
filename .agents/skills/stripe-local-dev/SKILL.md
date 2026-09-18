---
name: stripe-local-dev
description: >
  Prepara y arranca el entorno local de Stripe para Thalia: valida CLI y env,
  sincroniza webhooks con stripe listen, levanta pnpm dev. Usar cuando el usuario
  pida probar billing, checkout, webhooks o Stripe en local.
disable-model-invocation: true
---

# Stripe Local Dev

Prepara y levanta el entorno local de billing de Thalia. Documentación completa en [docs/stripe-local-testing.md](../../../docs/stripe-local-testing.md) y [docs/stripe-billing.md](../../../docs/stripe-billing.md).

## Cuándo usar

- Probar Stripe, billing, checkout o webhooks en local
- Arrancar `stripe listen` y sincronizar `STRIPE_WEBHOOK_SECRET`
- Diagnosticar `400 Firma no válida` o suscripción atascada en «Confirmando…»

## Prerequisitos

- Node.js y `pnpm`
- Stripe CLI instalada y autenticada (`stripe login`)
- `.env.local` creado desde `.env.local.example` con claves **test** del mismo sandbox
- Supabase accesible según `.env` / `.env.local` (local o remoto), con migraciones de billing
- Precio recurrente de test (`STRIPE_PRICE_THALIA_NORMAL`) y Stripe Tax en el sandbox

Instalar o actualizar la CLI:

```bash
pnpm add -g @stripe/cli@latest
stripe version
stripe login
stripe whoami --format json
```

## Flujo del agente

Ejecutar desde la raíz del repo (`thalia-web`).

### 1. Verificar prerequisitos (opcional tras el primer arranque)

```bash
node .agents/skills/stripe-local-dev/scripts/check.mjs
```

Si falla, parar y reportar qué falta: login de Stripe, placeholders en `.env.local`, Supabase caído, claves live, etc. `STRIPE_WEBHOOK_SECRET` puede seguir en placeholder antes del primer `start`; el listener lo rellena.

### 2. Arrancar entorno

```bash
node .agents/skills/stripe-local-dev/scripts/start.mjs
```

El script:

1. Valida de nuevo CLI, env y Supabase
2. Arranca `stripe listen --forward-to http://localhost:3000/api/stripe/webhook` en background
3. Extrae `whsec_…` y lo escribe en `.env.local` (`STRIPE_WEBHOOK_SECRET`)
4. Arranca `pnpm dev` si `:3000` no responde ya

Confirmar en terminales que el listener sigue activo y la app responde en `http://localhost:3000`.

Si `STRIPE_WEBHOOK_SECRET` cambió respecto a la sesión anterior, **reiniciar `pnpm dev`** para que Next cargue el nuevo valor.

### 3. Reportar al usuario

- URLs: `http://localhost:3000`, webhook en `/api/stripe/webhook`
- Máscara secretos al mostrarlos (`whsec_abc12345…`, nunca el valor completo)
- Pasar el checklist de prueba manual (abajo)

## Reglas

- No commitear `.env.local` ni imprimir secretos completos
- No usar claves `live` ni tarjetas reales en local
- El `whsec_…` del Dashboard **no** sirve en local; solo el del `stripe listen` activo
- Usar `pnpm`, no npm ni yarn
- No arrancar Supabase: solo verificar que responde según el env configurado
- Si `stripe listen` ya corre (`.stripe-listen.pid`), reutilizar ese listener o pararlo antes de volver a arrancar

## Prueba manual

1. Abre `http://localhost:3000/register` y crea un owner y clínica de prueba
2. En `/subscription`, inicia Stripe Checkout
3. Tarjeta `4242 4242 4242 4242`, fecha futura, CVC cualquiera
4. Comprueba vuelta a `subscription?checkout=success`
5. Verifica `200` en `stripe listen` y que la app pasa a `trialing` o `active` → dashboard
6. Prueba el portal de facturación (cancelar o actualizar suscripción)

`pnpm test:run` no sustituye este recorrido con Checkout y webhooks.

## Diagnóstico

| Síntoma | Acción |
|---------|--------|
| `400 Firma no válida` | Actualizar `STRIPE_WEBHOOK_SECRET` con el del listener activo; reiniciar `pnpm dev` |
| Checkout no abre | `STRIPE_PRICE_THALIA_NORMAL` debe existir en el mismo sandbox que `STRIPE_SECRET_KEY` |
| Pantalla «Confirmando…» | Mantener `stripe listen` abierto; revisar respuesta del webhook local |
| Listener duplicado | Parar el PID en `.stripe-listen.pid` o borrar el archivo tras matar el proceso |

## Piezas del sistema

| Pieza | Ubicación |
|-------|-----------|
| Webhook HTTP | `app/api/stripe/webhook/route.ts` |
| Procesado eventos | `src/lib/stripe/webhook.ts` |
| Cliente Stripe | `src/lib/stripe/server.ts` |
| Checkout / portal | `src/components/billing/actions.ts` |
| UI onboarding | `app/(onboarding)/subscription/` |

## Referencias

- [docs/stripe-local-testing.md](../../../docs/stripe-local-testing.md)
- [docs/stripe-billing.md](../../../docs/stripe-billing.md)
- [Stripe testing](https://docs.stripe.com/testing)
- [Webhooks locales](https://docs.stripe.com/webhooks)
