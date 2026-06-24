# Gestión de usuarios y onboarding — Arquitectura e implementación

## Índice

1. [Modelo de datos](#1-modelo-de-datos)
2. [Roles y permisos](#2-roles-y-permisos)
3. [Flujos de onboarding](#3-flujos-de-onboarding)
4. [Sistema de invitaciones](#4-sistema-de-invitaciones)
5. [Selector de clínica (contexto activo)](#5-selector-de-clínica-contexto-activo)
6. [Consideraciones para freelances](#6-consideraciones-para-freelances)
7. [Pantallas necesarias](#7-pantallas-necesarias)
8. [Estado actual del código](#8-estado-actual-del-código)
9. [Máquina de estados y routing](#9-máquina-de-estados-y-routing)
10. [Migración de base de datos](#10-migración-de-base-de-datos)
11. [Plan de implementación por fases](#11-plan-de-implementación-por-fases)
12. [Contratos de estado y hooks](#12-contratos-de-estado-y-hooks)
13. [Checklist de aceptación por flujo](#13-checklist-de-aceptación-por-flujo)

---

## 1. Modelo de datos

El principio clave es **separar la identidad del usuario de su pertenencia a una clínica**. Un usuario es una persona real; su relación con una clínica es una entidad aparte.

```
User
├── id
├── email
├── name
├── avatar_url
├── created_at
└── auth_provider (email | google)

Clinic
├── id
├── name
├── logo_url
├── owner_id → User.id
└── created_at

ClinicMembership            ← la relación entre persona y clínica
├── id
├── user_id     → User.id
├── clinic_id   → Clinic.id
├── role        (owner | admin | employee | external)
├── status      (pending | active | suspended)
├── invited_by  → User.id
└── joined_at

InvitationToken
├── id
├── token       (UUID único, de un solo uso)
├── clinic_id   → Clinic.id
├── role        (rol que tendrá al unirse)
├── email       (opcional, para pre-rellenar)
├── created_by  → User.id
├── expires_at
└── used_at
```

> **Identidad:** no hay tabla `User` propia; la identidad vive en `auth.users`. `employees` es el perfil operativo por clínica (v1: una fila por usuario).

> **Multi-membresía:** solo usuarios con rol `external` (autónomo) pueden tener más de una `ClinicMembership` activa. `owner`, `admin` y `employee` están limitados a **una sola clínica**.

---

## 2. Roles y permisos

| Rol        | Descripción                                                          | Puede invitar | Multi-clínica | Clínicas máx. |
| ---------- | -------------------------------------------------------------------- | :-----------: | :-----------: | :-----------: |
| `owner`    | Creó la clínica. Permisos totales, no se puede eliminar.             |      ✅       |      ❌       |       1       |
| `admin`    | Gestiona equipo y configuración. Delegado por el owner.              |      ✅       |      ❌       |       1       |
| `employee` | Empleado fijo. Solo ve su clínica.                                   |      ❌       |      ❌       |       1       |
| `external` | Autónomo / colaborador externo.                                      |      ❌       |      ✅       |       N       |

### Reglas de membresía

- Un usuario solo puede ser `owner` de **una** clínica en toda su vida de cuenta.
- `employee` y `admin` no pueden aceptar una segunda membresía; el backend rechaza la invitación.
- Solo `external` puede acumular clínicas y usar el selector de contexto.

### Matriz de permisos recomendada

| Acción                       | owner | admin | employee |    external    |
| ---------------------------- | :---: | :---: | :------: | :------------: |
| Ver agenda completa          |  ✅   |  ✅   |    ✅    |       ✅       |
| Ver datos de otros empleados |  ✅   |  ✅   |    ❌    |       ❌       |
| Crear/editar citas           |  ✅   |  ✅   |    ✅    | Solo las suyas |
| Invitar empleados            |  ✅   |  ✅   |    ❌    |       ❌       |
| Editar configuración clínica |  ✅   |  ✅   |    ❌    |       ❌       |
| Eliminar clínica             |  ✅   |  ❌   |    ❌    |       ❌       |

---

## 3. Flujos de onboarding

Hay dos entradas distintas a la app. La pantalla de bienvenida no pregunta por links: el usuario **elige su rol** con dos botones grandes. Los tres caminos convergen en la misma app con distinto contexto activo (`activeClinicId` + `activeRole`).

```
                    Pantalla de bienvenida
                            │
              ┌─────────────┴─────────────┐
              │                           │
    [Dueño de clínica]            [Empleado]
         Flujo A                      Flujo B
              │                           │
    Crear cuenta + clínica         Auth (+ confirmación
              │                   si hay invitación)
              └─────────────┬─────────────┘
                            │
              ¿2+ membresías external?
                    /            \
                  No              Sí
                  │                │
                  ▼                ▼
             Dashboard      Selector de clínica
                  │                │
                  └────────┬───────┘
                           ▼
                    App principal
```

### Cadena de entrada obligatoria

```
index → /intro (obligatorio) → /welcome → login o register → resolvePostAuthRoute
```

**Excepción:** deep link `/invite/{token}` salta `intro` y `welcome` (intención ya definida).

### Pantalla de bienvenida (`/welcome`)

Primera pantalla de **cuenta** tras completar el tour de producto (`/intro` es **obligatorio**). Dos botones grandes:

| Botón | Intención guardada | Destino inmediato |
| ----- | ------------------ | ----------------- |
| **Dueño de clínica** | `onboardingIntent: owner` | Registro o login → crear clínica |
| **Empleado** | `onboardingIntent: employee` | Registro o login → confirmar invitación o espera |

Copy sugerido:

- Título: "¿Cómo vas a usar Thalia?"
- Subtítulo Dueño: "Creo y gestiono mi clínica"
- Subtítulo Empleado: "Me han invitado a unirme a un equipo"

La intención se persiste en `onboarding-intent-store` (AsyncStorage) hasta completar el onboarding de cuenta. Un deep link de invitación (`/invite/{token}`) fuerza `onboardingIntent: employee` automáticamente.

### 3.1 Flujo A — Dueño de clínica

```
Pantalla de bienvenida
        │
        ▼
  [Dueño de clínica]
  (onboardingIntent: owner)
        │
        ▼
Crear cuenta o iniciar sesión
(Google o email/contraseña)
        │
        ▼
Datos de la clínica
(nombre, especialidad, logo)
        │
        ▼
Dashboard principal
(clínica recién creada, equipo vacío)
        │
        ▼
Invitar empleados (desde /settings/team)
```

**Notas de implementación:**

- El botón "Dueño de clínica" setea `onboardingIntent: owner` antes de ir a registro/login.
- Después del registro, crear automáticamente la fila en `Clinic` y en `ClinicMembership` con `role: owner`.
- Solo usuarios con intent `owner` y 0 membresías ven el formulario de crear clínica.
- Un `owner` no puede pertenecer a otra clínica ni aceptar invitaciones como empleado.
- Si alguien entró como empleado pero quiere crear su clínica, puede volver a `/welcome` y elegir "Dueño de clínica" **solo si aún no tiene ninguna membresía**.

**Destino post-auth:** `/onboarding/create-clinic` → dashboard con `activeClinicId` = clínica recién creada.

---

### 3.2 Flujo B — Empleado / Freelance

Hay **dos formas de entrar** en este flujo; ambas setean `onboardingIntent: employee`:

**Entrada 1 — Desde `/welcome`:** el usuario pulsa **[Empleado]** → registro o login.

**Entrada 2 — Desde deep link:** abre `https://tuapp.com/invite/{token}` (email, WhatsApp…) → se guarda el token → registro o login.

```
Pantalla de bienvenida          Link de invitación (email)
        │                              │
        ▼                              ▼
   [Empleado]              Guardar token + intent employee
        │                              │
        └──────────────┬───────────────┘
                       ▼
            Crear cuenta o iniciar sesión
                       │
                       ▼
              ¿Hay token pendiente?
                 /            \
               Sí              No
               │                │
               ▼                ▼
        Confirmación      ¿Tiene membresías?
        "Unirte a            /           \
         [Clínica X]"      Sí            No
               │            │              │
               ▼            ▼              ▼
        Aceptar/Rechazar  Dashboard   Pantalla de espera
               │           o selector  "Revisa tu email"
               ▼                │     (sin acceso a la app)
   ¿2+ external?               │
      /       \                 │
    No        Sí                │
    │          │                │
    ▼          ▼                │
 Dashboard  Selector            │
         │            │         │
         └────────────┴─────────┘
                       ▼
                App principal
```

**Pantalla de confirmación** (solo si hay token pendiente):

"Te han invitado a unirte a [Clínica X] con el rol [Empleado / Externo]"

**Pantalla de espera** (`/onboarding/waiting-invite`) — empleado autenticado sin token y sin membresías:

- Mensaje: "Tu clínica debe invitarte por email. Revisa tu bandeja o contacta con tu administrador."
- Acciones: "Volver" a `/welcome` · "Cerrar sesión"
- No mostrar formulario de crear clínica.

**Notas de implementación:**

- El token se guarda en `pending-invite-store` antes de redirigir al login si el usuario abrió un deep link sin sesión.
- Al aceptar, marcar `InvitationToken.used_at` y crear la fila en `ClinicMembership` con `status: active`.
- Si el usuario ya pertenece a esa clínica, mostrar un mensaje amigable y redirigir al selector o al dashboard según corresponda.
- Tras aceptar, si es la **única** membresía → dashboard directo. Si es `external` con 2+ clínicas → selector.
- **Email obligatorio:** si `invitation_tokens.email` está definido, debe coincidir con `auth.users.email` (case-insensitive). Si no → error antes de confirmar.
- Un usuario con membresía `employee`/`admin`/`owner` existente **no puede** aceptar otra invitación.
- Login: `app/(auth)/login.tsx` con copy según intent. Registro: `app/(auth)/register.tsx` (diseño pendiente; contrato definido, UI en Fase 5).

### 3.3 Flujo C — Selector de clínica (freelance / multi-membresía)

Este camino solo aplica a usuarios **`external`** con 2+ membresías activas. Se activa después del login o de aceptar una invitación.

```
Login o aceptar invitación
        │
        ▼
Cargar memberships del usuario
        │
        ▼
¿Cuántas activas?
   0              1              2+ external
   │              │                   │
   ▼              ▼                   ▼
Según intent   Dashboard         /select-clinic
(owner →                         │
 create-clinic;                   ▼
 employee →                   Dashboard
 waiting-invite)
```

**Reglas:**

- Solo cuentan membresías con `status: active`. Las `pending` o `suspended` no aparecen en el selector.
- Si el usuario acaba de aceptar una invitación, preseleccionar esa clínica en el selector pero **seguir mostrando** la pantalla si tiene más de una.
- Persistir `activeClinicId` en el store global para que sobreviva recargas de la app.

---

## 4. Sistema de invitaciones (v1)

Único mecanismo en v1: **invitar por email con token de un solo uso**.

1. Admin introduce el email (obligatorio) y selecciona el rol (`admin`, `employee`, `external`).
2. Se genera un `InvitationToken` con expiración de 7 días y el email vinculado.
3. Se envía un email con el link `https://tuapp.com/invite/{token}`.
4. El invitado crea su propia cuenta (email debe coincidir) y sigue el Flujo B.

**Fuera de scope v1:** credenciales creadas por admin, links genéricos reutilizables, flujo `set-password` legacy.

---

## 5. Selector de clínica (contexto activo)

Los usuarios con múltiples membresías (especialmente freelances) necesitan un mecanismo para cambiar de contexto.

### Comportamiento recomendado

- Al iniciar sesión, si el usuario tiene **una sola membresía** (cualquier rol) → dashboard directo.
- Si es `external` con **2+ membresías activas** → selector antes del dashboard.
- Cambio de clínica en sesión: solo visible para usuarios `external` con 2+ clínicas.

```
┌─────────────────────────────────┐
│   ¿A qué clínica quieres entrar?│
│                                 │
│  [Logo] Clínica Dental Norte    │
│  [Logo] Centro Fisio Sur        │
│  [Logo] Clínica Estética Mar    │
│                                 │
└─────────────────────────────────┘
```

### Cambio de clínica en medio de la sesión

Incluir en el header/menú lateral un selector persistente que muestre la clínica activa y permita cambiar sin cerrar sesión. Internamente, solo es cambiar el `activeClinicId` en el estado global de la app.

### Estado global sugerido (React / Zustand / Redux)

```typescript
interface AppState {
  user: User;
  memberships: ClinicMembership[]; // todas las clínicas del usuario
  activeClinicId: string; // clínica seleccionada actualmente
  activeRole: Role; // rol en esa clínica
}
```

---

## 6. Consideraciones para freelances

El tipo de cuenta no cambia: un freelance es un `User` normal. Lo que cambia es el `role` en cada `ClinicMembership`.

### Flujo típico de un freelance

1. Trabaja en Clínica A → admin le invita → acepta → `role: external` en Clínica A.
2. Empieza a trabajar en Clínica B → admin le invita → acepta → `role: external` en Clínica B.
3. Al iniciar sesión, ve el selector con ambas clínicas.
4. Cambia de clínica activa desde el header (v1: una clínica activa a la vez; agenda multi-clínica simultánea = futuro).

### Restricciones recomendadas para `external`

- **No ver** el listado de empleados de la clínica ni sus datos personales.
- **No ver** métricas globales de la clínica.
- **Solo ver** sus propias citas y los pacientes que le han sido asignados.
- **No poder** modificar la configuración de la clínica.

---

## 7. Pantallas necesarias

### Distinción: onboarding de producto vs onboarding de cuenta

El proyecto tiene hoy un carrusel de producto en `app/(onboarding)/intro.tsx` (pasos bienvenida, agenda, pacientes…). Ese flujo es **marketing**, no gestión de cuenta. Tras esta refactorización:

| Flujo | Propósito | Ruta actual | Ruta objetivo |
| ----- | --------- | ----------- | ------------- |
| Producto | Mostrar features (obligatorio) | `/intro` | Obligatorio antes de `/welcome` |
| Cuenta A | Dueño crea clínica | — | `/intro` → `/welcome` (Dueño) → login → `/onboarding/create-clinic` |
| Cuenta B | Empleado se une | — | `/intro` → `/welcome` (Empleado) o deep link → login → confirmación o espera |
| Contexto C | Autónomo elige clínica | — | `/select-clinic` (solo `external` 2+) |

### Nuevas pantallas a diseñar

| Pantalla | Ruta Expo Router | Descripción |
| -------- | ---------------- | ----------- |
| Bienvenida | `app/welcome.tsx` | Dos botones grandes: **Dueño de clínica** / **Empleado**. Persiste `onboardingIntent` |
| Crear clínica | `app/(onboarding)/create-clinic.tsx` | Formulario: nombre, especialidad, logo. Solo `intent: owner` + 0 membresías |
| Espera invitación | `app/(onboarding)/waiting-invite.tsx` | Empleado autenticado sin token ni membresías. Sin acceso a la app |
| Invitación | `app/invite/[token].tsx` | Confirmación: clínica, rol, aceptar/rechazar. Requiere sesión |
| Selector | `app/select-clinic.tsx` | Solo `external` con 2+ membresías activas |
| Registro | `app/(auth)/register.tsx` | Pendiente de diseño; contrato definido, UI en Fase 5 |
| Equipo | `app/(app)/settings/team.tsx` | Invitar por email con token |

### Modificaciones a pantallas existentes

| Pantalla | Archivo | Cambio |
| -------- | ------- | ------ |
| Index / router raíz | `app/index.tsx` | Delegar en `resolvePostAuthRoute()` en lugar de redirigir siempre a `/dashboard` |
| Login / registro | `app/(auth)/login.tsx`, `app/(onboarding)/intro.tsx` | Copy según `onboardingIntent`; tras auth, delegar en `resolvePostAuthRoute()` |
| Layout app | `app/(app)/_layout.tsx` | Exigir `activeClinicId`; usar `activeRole` para tabs (no `profile.role` directo) |
| Header / menú | `src/components/ui/app-tab-header.tsx`, dashboard header | Mostrar clínica activa + acceso al selector |
| Dashboard | `app/(app)/dashboard/index.tsx` | Nombre y logo de la clínica activa |
| Empleados | `app/(app)/employees/index.tsx` | Invitar vía `InvitationToken`, no solo `inviteUserByEmail` |

---

## 8. Estado actual del código

Antes de implementar, conviene mapear qué existe y qué falta.

### Lo que ya existe

| Pieza | Ubicación | Limitación actual |
| ----- | --------- | ----------------- |
| Auth (email + Google) | `src/stores/auth-store.ts`, `app/(auth)/login.tsx` | Tras login siempre va a `/dashboard` |
| Perfil de empleado | `employees` en Supabase, `auth-store.refreshProfile()` | Un usuario = una fila = una clínica |
| Invitación admin | `supabase/functions/invite-employee/index.ts` | Crea usuario + fila `employees` directamente; no hay token reutilizable ni pantalla de confirmación |
| Roles en app | `admin`, `reception`, `doctor`, `auxiliary` | No existen `owner` ni `external`; permisos acoplados a `profile.role` |
| RLS multi-tenant | `current_employee_clinic_id()` en `001_base.sql` | Asume una sola clínica por usuario |
| Onboarding producto | `app/(onboarding)/intro.tsx`, `onboarding-store` | Carrusel de features; no crea clínica ni distingue tipo de usuario |
| Router raíz | `app/index.tsx` | `user` → `/dashboard`; no comprueba membresías ni invitaciones pendientes |

### Brechas principales

1. **Sin tabla `clinic_memberships`** — la relación usuario↔clínica está embebida en `employees.clinic_id`.
2. **Sin `invitation_tokens`** — no hay deep link `/invite/{token}` ni flujo de aceptación.
3. **Sin contexto activo** — no hay `activeClinicId` en ningún store; todos los hooks leen `profile.clinic_id`.
4. **Sin pantalla de bifurcación** — no hay `/welcome` con botones Dueño / Empleado ni `onboarding-intent-store`.
5. **Sin selector de clínica** — imposible soportar freelances con una sola cuenta.

### Mapeo de roles (actual → objetivo)

| Rol actual (`employees.role`) | Rol objetivo (`ClinicMembership.role`) | Notas |
| ----------------------------- | ---------------------------------------- | ----- |
| `admin` (creador de clínica) | `owner` | Solo quien crea la clínica en Flujo A |
| `admin` (delegado) | `admin` | Invitado con permisos de gestión |
| `doctor`, `reception`, `auxiliary` | `employee` | Personal fijo de una clínica |
| — (nuevo) | `external` | Freelance; puede tener N membresías |

Durante la migración, mantener `employees.role` como rol **operativo** dentro de la clínica (doctor, recepción…) y usar `ClinicMembership.role` para permisos de **plataforma** (owner, admin, employee, external). Son capas distintas.

---

## 9. Máquina de estados y routing

Centralizar la lógica de redirección post-auth en una función. Todos los puntos de entrada (`index`, `login`, OAuth callback, deep link) deben usar la misma resolución.

### Función `resolvePostAuthRoute()`

Entrada: sesión de Supabase + estado local (`onboardingIntent`, `pendingInviteToken`, `activeClinicId`).

```
1. ¿Hay pendingInviteToken?
   → Sí: /invite/{token}
   → No: continuar

2. ¿Usuario autenticado?
   → No: ¿intro completado?
         → No: /intro
         → Sí: ¿pendingInviteToken? → /login : /welcome
   → Sí: continuar

3. Cargar ClinicMembership[] activas del usuario

4. ¿Cuántas membresías activas?
   → 1: set activeClinicId → /dashboard
   → 2+: ¿todas external?
         → Sí: ¿activeClinicId válido? → /dashboard o /select-clinic
         → No: error (estado inválido; no debería ocurrir)
   → 0: según onboardingIntent
         → owner:  /onboarding/create-clinic
         → employee: /onboarding/waiting-invite
         → (sin intent): /welcome
```

### Deep links

Configurar en `app.json`:

```json
{
  "expo": {
    "scheme": "thalia",
    "web": {
      "bundler": "metro"
    }
  }
}
```

| URL | Comportamiento |
| --- | -------------- |
| `thalia://invite/{token}` | Guardar token + `onboardingIntent: employee` → saltar intro → `/login` o `/invite/{token}` |
| `https://tuapp.com/invite/{token}` | Mismo flujo vía universal link |

### Guardias por layout

| Layout | Condición de acceso |
| ------ | ------------------- |
| `(auth)/*` | Sin sesión |
| `welcome`, `intro` | Sin sesión |
| `(onboarding)/create-clinic` | Sesión + `onboardingIntent: owner` + 0 membresías |
| `(onboarding)/waiting-invite` | Sesión + `onboardingIntent: employee` + 0 membresías + sin token |
| `invite/[token]` | Sesión + token válido no expirado |
| `select-clinic` | Sesión + 2+ membresías `external` activas + sin `activeClinicId` válido |
| `(app)/*` | Sesión + `activeClinicId` definido |

### Stores de onboarding de cuenta

**`onboarding-intent-store`** (AsyncStorage):

```typescript
type OnboardingIntent = "owner" | "employee";

type OnboardingIntentStore = {
  intent: OnboardingIntent | null;
  setIntent: (intent: OnboardingIntent) => void;
  clearIntent: () => void;
};
```

Se setea al pulsar un botón en `/welcome`. Se limpia al completar onboarding (clínica creada, invitación aceptada o primera entrada al dashboard).

**`pending-invite-store`** (AsyncStorage):

```typescript
type PendingInviteStore = {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};
```

Flujo deep link: al abrir `/invite/{token}` sin sesión → `setToken(token)` + `setIntent('employee')` → redirect `/login` → tras auth, `resolvePostAuthRoute` lee el token y vuelve a `/invite/{token}`.

---

## 10. Migración de base de datos

Migración incremental sobre el esquema actual (`001_base.sql`). Orden recomendado:

### 10.1 — Extender `clinics`

```sql
ALTER TABLE clinics
  ADD COLUMN owner_id UUID REFERENCES auth.users(id),
  ADD COLUMN logo_url TEXT,
  ADD COLUMN specialty TEXT;
```

### 10.2 — Crear `clinic_memberships`

```sql
CREATE TABLE clinic_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','employee','external')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','active','suspended')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, clinic_id)
);
```

### 10.3 — Crear `invitation_tokens`

```sql
CREATE TABLE invitation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','employee','external')),
  email TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id)
);
```

### 10.4 — Backfill desde `employees`

Para cada fila existente en `employees`:

1. Insertar `clinic_memberships` con `role: admin` si `employees.role = 'admin'`, si no `employee`.
2. Marcar `status: active`, `joined_at: employees.created_at`.
3. Si es el primer admin de la clínica, setear `clinics.owner_id`.

### 10.5 — RLS (v1: filtrado client-side)

**Decisión v1:** no migrar RLS ni JWT claims. Mantener `employees.id = auth.users.id` para no romper `auth-store.refreshProfile()`.

- `activeClinicId` vive en Zustand (persistido en AsyncStorage).
- Hooks y stores filtran queries por `activeClinicId`.
- RLS actual (`current_employee_clinic_id()`) sin cambios.

**Deuda técnica (Fase 5):** un `external` con varias clínicas podría teóricamente consultar otra clínica manipulando requests. Aceptado en v1; cerrar con JWT claim o RPC `set_active_clinic`.

**Multi-clínica v1:** solo en `clinic_memberships` para rol `external`. Al cambiar clínica activa, la app filtra en cliente.

### 10.6 — Edge functions (v1)

| Función | Acción |
| ------- | ------ |
| `create-clinic` | Crea clínica + membership `owner` + fila `employees`; valida 0 membresías previas |
| `accept-invitation` | Valida token, email match, bloquea segunda membresía no-external, crea membership |
| `invite-employee` | Genera `invitation_tokens` + envía link; **no** crea usuarios ni credenciales |

---

## 11. Plan de implementación por fases

Cada fase es desplegable de forma independiente. No avanzar a la siguiente sin cumplir el checklist de la anterior.

### Fase 1 — Fundamentos (schema + contexto activo)

**Objetivo:** soportar multi-clínica en datos y estado, sin cambiar aún el onboarding visual.

| Tarea | Archivos / artefactos |
| ----- | --------------------- |
| Migración SQL (sección 10) | `supabase/migrations/003_memberships.sql` |
| Store de clínica activa | `src/stores/clinic-store.ts` |
| Hook `useActiveClinic()` | `src/lib/hooks/use-active-clinic.ts` |
| Actualizar hooks de datos | filtrar por `activeClinicId` (client-side) |
| `resolvePostAuthRoute()` | `src/lib/navigation/resolve-post-auth-route.ts` |
| Integrar en `app/index.tsx` y `(app)/_layout.tsx` | guards |

**Criterio de done:** usuario `external` con dos membresías (seed) cambia de clínica y ve datos filtrados distintos.

### Fase 2 — Onboarding cuenta (sin register UI)

**Objetivo:** cadena intro → welcome → auth; dueño crea clínica; empleado sin invitación espera.

| Tarea | Archivos / artefactos |
| ----- | --------------------- |
| Pantalla `/welcome` | `app/welcome.tsx` |
| Stores intent | `src/stores/onboarding-intent-store.ts` |
| Crear clínica / espera | `app/(onboarding)/create-clinic.tsx`, `waiting-invite.tsx` |
| Edge function `create-clinic` | `supabase/functions/create-clinic/` |
| Adaptar `intro.tsx` | último paso → `/welcome` |
| Login con intent | `app/(auth)/login.tsx` |
| Register stub | `app/(auth)/register.tsx` — placeholder hasta diseño |

**Criterio de done:** intro obligatorio → welcome → dueño crea clínica; empleado sin token → waiting-invite.

### Fase 3 — Invitaciones

| Tarea | Archivos |
| ----- | -------- |
| `/invite/[token]` | validar email antes de confirmar |
| `pending-invite-store` | deep links |
| `accept-invitation` | email match + bloqueo multi-membresía |
| Refactor `invite-employee` | solo token, sin `inviteUserByEmail` |
| `settings/team.tsx` | panel invitar |

### Fase 4 — Selector autónomo

| Tarea | Archivos |
| ----- | -------- |
| `/select-clinic` | solo `external` 2+ |
| Permisos tabs | `(app)/_layout.tsx` por `ClinicMembership.role` |

### Fase 5 — Deuda y diseño pendiente

| Tarea | Notas |
| ----- | ----- |
| Pantalla register | según diseño del usuario |
| RLS estricto | JWT claim o RPC |
| Email transaccional | Resend u otro proveedor |
| Eliminar `set-password.tsx` | legacy deprecado |
| Analytics PostHog | eventos de onboarding |

---

## 12. Contratos de estado y hooks

### `clinic-store.ts`

```typescript
type ClinicMembership = {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicLogoUrl: string | null;
  role: "owner" | "admin" | "employee" | "external";
  status: "pending" | "active" | "suspended";
};

type ClinicStore = {
  memberships: ClinicMembership[];
  activeClinicId: string | null;
  activeMembership: ClinicMembership | null;
  loading: boolean;
  fetchMemberships: () => Promise<void>;
  setActiveClinic: (clinicId: string) => Promise<void>;
};
```

### Hooks expuestos a la UI

| Hook | Retorno | Uso |
| ---- | ------- | --- |
| `useActiveClinic()` | `{ clinic, membership, role }` | Headers, permisos de tabs |
| `useClinicMemberships()` | `{ memberships, loading }` | Selector |
| `useOnboardingIntent()` | `{ intent, setIntent, clearIntent }` | `/welcome`, guards |
| `usePendingInvite()` | `{ token, setToken, clearToken }` | Flujo B, deep links |
| `useAuth()` (existente) | `{ user, profile, … }` | Identidad; `profile` pasa a ser el empleado de la clínica activa |

### Cambio en consumidores actuales

Todos los sitios que hoy usan `profile.clinic_id` deben migrar a `useActiveClinic().clinic.id`:

- `app/(app)/appointments/new.tsx`
- `app/(app)/patients/new.tsx`
- `app/(app)/employees/index.tsx`
- `app/(app)/inventory/new.tsx`
- `app/(app)/finances/index.tsx`
- Stores: `appointments-store`, `patients-store`, etc.

---

## 13. Checklist de aceptación por flujo

### Flujo A — Dueño de clínica

- [ ] Tour `/intro` obligatorio antes de `/welcome` en primera apertura
- [ ] Usuario nuevo ve `/welcome` con dos botones grandes: **Dueño de clínica** y **Empleado**
- [ ] Pulsar "Dueño de clínica" setea `onboardingIntent: owner` y lleva a registro/login
- [ ] Tras registro sin membresías e intent `owner`, va a `/onboarding/create-clinic`
- [ ] Al enviar el formulario se crea clínica + membership `owner` + fila `employees`
- [ ] Llega al dashboard con nombre/logo de su clínica
- [ ] Desde settings/equipo puede invitar al primer empleado
- [ ] Intent `employee` nunca muestra el formulario de crear clínica

### Flujo B — Empleado / invitado

- [ ] Pulsar "Empleado" setea `onboardingIntent: employee` y lleva a registro/login
- [ ] Empleado autenticado sin token ni membresías ve `/onboarding/waiting-invite`, no el dashboard
- [ ] Link `thalia://invite/{token}` abre la app, persiste el token y fuerza intent `employee`
- [ ] Sin sesión → login/registro → vuelve a confirmación con datos de la clínica
- [ ] Con sesión → confirmación directa
- [ ] Aceptar crea membership `active` y consume el token
- [ ] Rechazar limpia token y redirige a `/welcome` o dashboard si ya tiene clínica
- [ ] Token expirado o usado muestra error claro
- [ ] Email de sesión debe coincidir con email del token (case-insensitive)
- [ ] Usuario con membresía `employee`/`admin`/`owner` no puede aceptar segunda invitación

- [ ] Usuario ya miembro de esa clínica ve mensaje amigable, no duplica membership

### Flujo C — Autónomo / multi-clínica

- [ ] Solo `external` con 2+ membresías activas ve `/select-clinic` tras login
- [ ] Usuario con 1 membresía entra directo al dashboard
- [ ] Usuario con 0 membresías: `owner` → create-clinic; `employee` → waiting-invite
- [ ] Tras aceptar invitación a segunda clínica, aparece selector
- [ ] Cambiar clínica en header actualiza datos sin logout
- [ ] Rol `external` no ve tab Equipo ni Finanzas globales
- [ ] Rol `external` solo ve sus citas y pacientes asignados

### Transversal

- [ ] `resolvePostAuthRoute()` es la única fuente de verdad para redirects post-auth
- [ ] Ninguna ruta `(app)/*` accesible sin `activeClinicId`
- [ ] RLS estricto cross-clinic: Fase 5 (v1 filtra en cliente)
- [ ] Eventos PostHog registran cada transición de flujo

---

## Resumen de decisiones de arquitectura

| Decisión                                          | Elección                         | Motivo                           |
| ------------------------------------------------- | -------------------------------- | -------------------------------- |
| ¿Un usuario puede pertenecer a varias clínicas?   | Solo `external`                  | Autónomos multi-clínica          |
| ¿Owner multi-clínica?                             | ❌ No                            | Una clínica por owner            |
| ¿Employee multi-clínica?                          | ❌ No                            | Solo autónomo (`external`)       |
| ¿El admin crea credenciales?                      | ❌ No (v1)                       | Usuario se registra solo         |
| ¿Email debe coincidir en invitación?              | ✅ Sí                            | Seguridad                        |
| ¿Tour `/intro` obligatorio?                       | ✅ Sí                            | Antes de `/welcome`              |
| ¿Pantalla register?                               | Pendiente diseño (Fase 5)        | Contrato en `register.tsx`       |
| ¿RLS multi-clínica v1?                            | ❌ Client-side filtering           | Deuda Fase 5                     |
| ¿Hay links de invitación?                         | ✅ Sí (token email, un uso)      | Flujo de unión                   |
| ¿Separar onboarding producto de cuenta?           | ✅ Sí                            | `/intro` ≠ crear clínica         |
| ¿Contexto activo v1?                              | Zustand + filtrado en hooks      | Sin JWT/RPC aún                  |
| ¿Redirección post-auth centralizada?              | ✅ `resolvePostAuthRoute()`      | Una sola fuente de verdad        |
| ¿Elección de camino?                              | Dos botones `/welcome`           | Dueño vs Empleado                |
| ¿Mantener `employees` además de memberships?        | ✅ Sí (v1)                       | Perfil operativo; PK sin cambiar |

owner@test.thalia.local
Test1234!