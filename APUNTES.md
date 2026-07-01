## Thalia — Estructura Global

### BACKEND (Supabase — BaaS, sin servidor propio)

```
Supabase
├── Auth          — sesiones, OAuth (Google), tokens JWT
├── Database      — PostgreSQL con RLS por clínica
│   ├── employees / profiles
│   ├── clinics / memberships
│   ├── appointments
│   ├── patients
│   ├── inventory
│   ├── finances
│   └── treatment_types
└── Storage       — avatares, archivos
```

No hay API Routes propias en Next.js salvo para el proxy OAuth. Toda la lógica de datos va directamente cliente → Supabase via `@supabase/ssr`.

---

### FRONTEND (Next.js 15, App Router)

```
app/
├── (auth)/           — login, registro de empleado (público)
├── (onboarding)/     — crear clínica, invitar equipo
└── (app)/            — shell autenticado
    ├── dashboard
    ├── calendar
    ├── appointments
    ├── patients
    ├── employees
    ├── inventory
    ├── finances
    └── settings
```

Capas por módulo (siempre las mismas 3):

```
app/(app)/[modulo]/page.tsx                       ← Server Component (thin)
    └── components/[modulo]/page.client.tsx        ← compone hook + UI
            ├── src/lib/hooks/use-[modulo].ts      ← todo el estado y lógica
            └── components/                        ← subcomponentes puros (solo props)
```

Estado global (Zustand — src/stores/):

```
auth-store          — sesión + perfil de empleado
clinic-store        — clínica activa (persistida en localStorage)
appointments-store
patients-store
employees-store
inventory-store
finances-store
calendar-store
dashboard-store
treatment-types-store
shell-store / topbar-search-store / *-ui-store   ← estado UI puro
```

Providers en el root:

```
app/layout.tsx
└── AuthProvider     — inicializa sesión, suscribe a cambios de auth
    └── AppLayoutClient  — guard de auth/clínica, redirige si falta
```

---

### Almacenamiento de sesión y estado local

**Cookies (gestionadas por Supabase `@supabase/ssr`):**

La cookie se llama `sb-<project-ref>-auth-token` (se parte en `.0`, `.1`… si es muy larga).
Contiene un JSON con:

| Campo | Para qué sirve |
|---|---|
| `access_token` | JWT que se envía en cada request (`Authorization: Bearer …`). Expira en 1h |
| `refresh_token` | Token de larga duración para renovar el `access_token` cuando expira |
| `expires_at` | Unix timestamp de expiración. `getSession()` lo lee y hace refresh automático si hace falta |
| `token_type` | Siempre `"bearer"` |
| `user` | Snapshot del User en el momento del login. Lo devuelve `getSession()` sin red (rápido pero puede estar desactualizado) |

`getUser()` ignora el snapshot de la cookie y llama al servidor con el `access_token` para obtener datos frescos. Por eso se usa `getUser()` (no `getSession().user`) cuando hay que tomar decisiones críticas como el routing post-auth.

**LocalStorage (stores Zustand persistidos):**

| Clave | Store | Qué guarda |
|---|---|---|
| `thalia-clinic` | `clinic-store` | `activeClinicId` — clínica seleccionada actualmente |
| `thalia-onboarding-intent` | `onboarding-intent-store` | `intent`: `"owner"` o `"employee"` — flujo de registro elegido |

El resto de stores (auth, patients, appointments, etc.) no se persisten — viven en memoria y se recargan desde Supabase en cada sesión.

---

### Flujo de datos resumido

```
Usuario → Componente → Hook → Store → Supabase (DB/Auth/Storage)
                                ↑
                     (sin API intermediaria propia)
```

### Casos de uso de /register-employee 

1. Botón "Registrarse" en login — el caso que describes:

use-login.ts:63 → router.push("/register-employee")

2. Paso 1 del onboarding de propietario — después de registrarse como owner, /register-employee es donde completas tu perfil (nombre, especialidad…) antes de crear la clínica. El botón "Atrás" en /create-clinic vuelve aquí:

create-clinic-page-client.tsx:148 → <Link href="/register-employee">

3. Guard en /create-clinic — si llegas a /create-clinic con sesión pero sin perfil completado, te redirige aquí:
create-clinic-page-client.tsx:39 → router.replace("/register-employee")

4. resolvePostAuthRoute — el router de post-auth te manda aquí automáticamente en dos casos:

Usuario con intent = "employee" sin perfil completado
Usuario con intent = "owner" (o registro de owner) sin perfil completado

resolve-post-auth-route.ts:99 y 107
