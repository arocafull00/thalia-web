# Landora — Guía para agentes

App de gestión inmobiliaria. **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Clerk · Neon Postgres · Drizzle ORM · Tailwind CSS v4 · shadcn/ui · Zustand · Zod · react-toastify.

Arquitectura, rutas y fases de desarrollo: `docs/plan.md`.

## Documentación

Next.js cambia entre versiones. Antes de escribir o modificar código de Next.js, consulta la documentación **exacta** de esta versión en `node_modules/next/dist/docs/`.

No asumas APIs de versiones anteriores ni de la documentación sin versionar.

## TypeScript

**Contrato de parámetros:** No marques parámetros como opcionales (`?`) si en la práctica son obligatorios (por ejemplo, si se lanza un error cuando faltan). La firma debe reflejar el comportamiento real (`param: string`) para que el contrato sea claro en compile time.

**Validaciones:** No dupliques comprobaciones (`null`/`undefined`, `Array.isArray`, etc.) en varias capas si ya están cubiertas en funciones internas. Centraliza la responsabilidad en un solo lugar.

**Nombres:** No renombres propiedades intermedias sin aportar valor. Eso dificulta seguir el flujo de datos.

**Tipos:** No exportes tipos desde un módulo solo para satisfacer dependencias de helpers. Mantén los tipos en su dominio o muévelos a un módulo compartido para evitar acoplamiento y dependencias circulares.

**Control de flujo:** Usa early returns en condicionales en lugar de anidar bloques `else`.

## React y Next.js

**Un componente por archivo:** Nunca declares más de un componente React en el mismo archivo. Extrae subcomponentes a archivos propios.

**Listas:** Si dentro de un `map` hay JSX con lógica o estructura propia, extrae ese elemento a un componente reutilizable en otro archivo.

**Barrel files:** No crees `index.ts` que reexporten módulos.

**UI:** No uses emojis. Usa iconos de la librería del proyecto (shadcn/ui o Lucide React).

**Server vs Client Components:** Por defecto usa Server Components. Añade `"use client"` solo cuando sea estrictamente necesario (interactividad, hooks de estado, efectos).

**Server Actions:** Usa Server Actions para mutaciones. Valida la entrada con Zod en el servidor.

**Detección de móvil (lógica):** Para decidir comportamiento en JavaScript (render condicional, qué componente montar, handlers distintos, etc.), usa `useIsMobile()` de `@/hooks/use-mobile`. No uses `window.matchMedia`, `window.innerWidth` ni breakpoints de Tailwind (`md:`, `lg:`, `hidden lg:block`, etc.) para lógica de programación. Tailwind sigue siendo válido para estilos responsivos (layout, espaciado, tipografía); la regla aplica solo cuando el código necesita saber si es móvil en runtime.

## Formularios

Todo formulario con 2 o más campos usa **react-hook-form** (`useForm`) con **zodResolver** sobre un schema de `src/lib/schemas/`. Nunca uses `useState` individual por campo ni un `reset` manual que limpie cada setter.

- El **hook** del formulario (`hooks/use-[feature].ts` o `src/lib/hooks/use-*-dialog.ts`) configura `useForm`, define `defaultValues`, expone `register`, `control`, `handleSubmit`, `formState.errors`, `reset` e `isPending`. Los campos que el usuario no rellena (p. ej. `clinic_id`) se omiten del schema de formulario con `.omit()` y se inyectan en el submit.
- El **subcomponente de formulario** recibe `register`, `control` y `errors` por props; muestra errores de campo con `text-danger`. No recibe `value`/`onChange` por campo.
- Inputs nativos (`input`, `textarea`, `select` simple) → `{...register("campo")}`.
- Componentes custom (date pickers, combobox, multi-select) → `Controller` de react-hook-form.
- Estado auxiliar de UI que no es un campo persistido (p. ej. texto de búsqueda en un picker) puede quedarse en `useState` aparte del formulario.
- Errores de validación globales o de submit siguen usando `toast.error(...)` además de los mensajes inline por campo.
- Referencia: `src/lib/hooks/use-patient-create-dialog.ts` + `src/components/patients/components/patient-create-form.tsx`.

## Arquitectura de componentes: separación por capas

Todo componente que mezcle lógica de negocio con JSX debe dividirse en tres capas:

**1. Custom hook** (`hooks/use-[feature].ts`) — toda la lógica: estado, derivaciones, handlers, efectos de datos.
**2. Subcomponentes** (`components/`) — JSX puro, solo props, sin lógica de negocio ni acceso directo a stores.
**3. Page/contenedor** (`page.client.tsx`) — orquesta hook + subcomponentes, JSX mínimo, side effects de navegación en `useEffect`.

### Reglas concretas

- Si un componente supera ~80 líneas, es señal de que necesita separarse.
- Las derivaciones van en el hook como variables computadas, nunca como estado (`const x = a ?? b`, no `useState`).
- El copy/strings van en objetos constantes tipados fuera del JSX, nunca inline.
- Los subcomponentes reciben solo lo que necesitan por props; no acceden a stores directamente.
- El redirect y otros side effects van en `useEffect` explícito en el contenedor, nunca como `if` en medio del render.

### Estructura de carpetas

```
components/[dominio]/[feature]/
├── page.client.tsx
├── hooks/
│   └── use-[feature].ts
├── components/
│   ├── [feature]-form.tsx
│   └── [feature]-sidebar.tsx
└── [feature]-copy.ts
```

### Señales de que un componente necesita refactor

- Hay un `useEffect` que setea estado (ver regla de dependencias circulares).
- El JSX tiene lógica ternaria compleja o strings largos inline.
- El componente accede a más de 2 stores de Zustand directamente.
- Los handlers (`handleSubmit`, etc.) tienen más de 10 líneas.

## Notificaciones al usuario

Para **todos** los mensajes de error o éxito mostrados al usuario, usa **siempre** `react-toastify`. No uses `alert`, `confirm`, ni ningún otro mecanismo nativo o custom. Llama a `toast.error(...)` para errores y `toast.success(...)` para operaciones exitosas.

## Alcance del trabajo

- Cambios mínimos y enfocados: no toques código no relacionado con la tarea.
- Sigue convenciones del código circundante (nombres, imports, estructura de carpetas).
- No añadas comentarios al código.
- No crees tests, documentación nueva ni archivos de ejemplo salvo petición explícita.
- No ejecutes el proyecto (`next dev`, etc.) salvo petición explícita.
- No uses git salvo petición explícita del usuario.

## Capa de acceso a datos (DAL)

Todas las queries a la base de datos viven en `data/`, nunca directamente en componentes, layouts, pages ni route handlers.

- Las funciones de **lectura** usan `cache()` de React para deduplicar queries en el mismo render pass.
- Las funciones de **escritura** no usan `cache()`.
- Cada función envuelve su query en `try/catch` y relanza con un mensaje descriptivo. `null` significa "registro no encontrado"; un error lanzado significa fallo de DB o red.
- Los **Server Components** dejan que los errores del DAL suban hasta el `error.tsx` más cercano (patrón RSC estándar).
- Los **Route Handlers** capturan errores del DAL y devuelven `500`.
- `getCurrentUser()` es la función canónica para obtener el usuario autenticado en Server Components y Route Handlers. Internamente llama a `auth()` de Clerk.
- Nunca importes `@/db` fuera de `data/`. Los componentes, layouts y route handlers importan exclusivamente desde `@/data/*`.

## Estructura prevista

- `app/` — rutas Next.js App Router
- `components/` — UI por dominio (`ui/`, `auth/`, `dashboard/`, …)
- `data/` — capa DAL: queries y mutaciones de base de datos
- `db/` — schema y cliente Drizzle ORM
- `lib/` — utilidades, helpers, cliente Clerk
- `stores/` — stores Zustand
- `scripts/` — scripts de mantenimiento

## Nunca setState en useEffect con dependencia circular

Si el estado que seteas está en las `deps` del efecto, es un bug.

**❌**

```tsx
useEffect(() => {
  setFullName(user.name);
}, [user, fullName]);
```

**✅ Lazy initializer**

```tsx
const [fullName, setFullName] = useState(() => user?.name ?? "");
```

**✅ Valor derivado**

```tsx
const fullName = user?.name ?? "";
```

**✅ Zustand: inicializar en el listener de auth, no en efectos de componentes hijos**

> Si un `useEffect` setea estado que está en sus propias `deps`, rediseña: el valor es derivado, no independiente.

Utiliza siempre pnpm.
Utiliza siempre tailwind.
Utiliza siempre lucide icons, nunca emojis.
Los estados deben ser globales en muchas ocasiones. Evita el prop drilling. Si un componente no usa una prop, no deberia pasarlo a su hijo. Deberia accederse desde un estado de zustand.
Coloca código nuevo en la carpeta que corresponda al dominio, no en rutas genéricas.

## Colores y tema

Los colores viven en `app/globals.css` como variables CSS en `:root` y se exponen a Tailwind v4 vía `@theme inline`. **Nunca uses colores hardcodeados** en componentes, layouts ni estilos inline salvo datos dinámicos de usuario (p. ej. color de empleado desde la base de datos).

**Usa siempre clases del tema semántico:**

| Rol                   | Clases Tailwind                                                 |
| --------------------- | --------------------------------------------------------------- |
| Fondo app             | `bg-canvas`                                                     |
| Paneles / inputs      | `bg-surface`                                                    |
| Acciones / nav activa | `bg-primary`, `hover:bg-primary-hover`, `text-on-primary`       |
| Texto                 | `text-ink`, `text-ink-secondary`, `text-ink-muted`              |
| Bordes                | `border-border`, `border-border-subtle`, `divide-border-subtle` |
| Focus                 | `ring-primary`                                                  |
| Estado error          | `text-danger`, `bg-danger`                                      |
| Estado aviso          | `text-warning`, `bg-warning`                                    |
| Estado éxito          | `text-success`, `bg-success`                                    |
| Acentos suaves        | `bg-primary-subtle`, `text-primary-light`                       |

**Prohibido en UI:** valores hex/rgb/oklch literales, paletas de Tailwind no definidas en el tema (`zinc-*`, `red-500`, `emerald-600`, etc.) y `style={{ color: '...' }}` / `backgroundColor` con valores fijos.

**Si falta un token:** añádelo primero en `:root` y `@theme inline` de `globals.css`, luego úsalo en el componente. No introduzcas el color directamente en el JSX.

**Excepción:** colores dinámicos persistidos (color de empleado, marca de clínica). Usa `style` solo con el valor de datos; el fallback cuando falte debe ser una clase del tema (`bg-border`), no un hex.

## Estilo integrado (vistas de detalle)

En pantallas de **detalle de entidad** (empleado, paciente, etc.) el contenido debe sentirse parte del layout de la app, no como bloques flotantes. Este es el patrón de referencia; no uses cards para estructurar estas vistas.

**Referencia:** `src/components/employees/employee-detail-page-client.tsx`, `src/components/patients/patient-detail-page-client.tsx`, `src/components/ui/profile/profile-timeline.tsx` (`variant="integrated"`).

### Qué evitar

- Envolver secciones en cards: `rounded-2xl border border-border bg-surface` como contenedor de página.
- Banners horizontales tipo `ProfileHeader` en vistas de detalle con sidebar (reservar `ProfileHeader` para otros contextos si aplica).
- Empty states en caja punteada (`border-dashed`) dentro de vistas integradas.
- Apilar perfil + historial verticalmente cuando caben dos columnas.

### Layout de página

- Contenedor: `flex min-h-0 flex-1 flex-col` para ocupar todo el alto del `main`.
- Enlace “volver” arriba, fuera del grid (`shrink-0 px-8 pt-6 pb-4`).
- Grid principal: `grid min-h-0 flex-1 lg:grid-cols-[20%_1fr]`.
- Columna izquierda (~20%): sidebar de perfil a altura completa.
- Columna derecha (~80%): contenido secundario (p. ej. historial) con scroll propio: `flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-8`.

### Sidebar de perfil

- Sin card: solo `flex h-full min-h-0 flex-col border-r border-border-subtle`.
- Secciones separadas con `border-t border-border-subtle`, no con cajas independientes.
- **Identidad** arriba: avatar, nombre y contacto centrados en vertical (`px-6 py-8 text-center`).
- **Datos / stats** en zona central con scroll: `min-h-0 flex-1 overflow-y-auto`, filas con `divide-y divide-border-subtle` o grid compacto, padding `px-6 py-6`.
- **Acciones rápidas** abajo fijas: `mt-auto shrink-0 border-t border-border-subtle`, botones apilados a ancho completo (`flex flex-col gap-2`, `[&>button]:w-full`), con icono Lucide en `ActionButton`.

### Historial / listas secundarias

- Usar `ProfileTimeline` con `variant="integrated"`.
- Título de sección con `border-b border-border-subtle pb-4`, sin card alrededor del listado.
- Items como filas o links directos sobre `bg-canvas`; hover sutil (`hover:bg-canvas`) en filas clicables.
- Empty state: texto simple (`text-sm text-ink-secondary`), sin caja.

### Cuándo sí usar `bg-surface` y bordes redondeados

- Diálogos, sheets, dropdowns, inputs y controles puntuales.
- Filas interactivas puntuales en listados del dashboard u otras vistas no integradas.
- **No** como contenedor principal de una vista de detalle con sidebar.
