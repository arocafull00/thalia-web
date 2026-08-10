# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # dev server on localhost:3000
pnpm build          # production build
pnpm lint           # ESLint
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest, watch mode
pnpm test:run       # Vitest, single run
pnpm test:e2e       # Playwright; boots a local Supabase first
pnpm validate:push  # typecheck + unit tests (what pre-push runs)
```

There **is** a test suite: 16 Vitest files under `src/tests/` and 10 Playwright specs in `src/tests/e2e/`. E2E needs a local Supabase (`pnpm exec supabase start`, which needs Docker); `run-with-local-supabase.mjs` refuses to run without it.

Git hooks: `pre-commit` runs `lint-staged`, `pre-push` runs `validate:push`. Type errors used to surface only at push time, which is why the pre-push hook exists — run `pnpm lint` and `pnpm typecheck` before calling anything done.

Always use `pnpm` (not npm or yarn).

## Environment variables

Copy `.env.local.example` if present, or create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Architecture overview

**Thalia** is a clinic management PWA for aesthetic and dental clinics in Spain. Primary language of all UI copy is Spanish.

### Route groups

- `app/(auth)/` — public login / employee registration
- `app/(onboarding)/` — clinic creation, team invite
- `app/(app)/` — authenticated app shell: dashboard, calendar, appointments, patients, treatments, employees, inventory, finances, marketing, files, settings

The `(app)` layout delegates to `AppLayoutClient`, which checks auth and active clinic, then redirects unauthenticated users to `/login` and users without a clinic to `/create-clinic`.

### Component layering

Every feature follows a strict three-layer split:

1. **Custom hook** (`src/lib/hooks/use-[feature].ts`) — all state, derivations, handlers, and data effects
2. **Subcomponents** (`src/components/[domain]/components/`) — pure JSX, props only, no store access
3. **Page client** (`src/components/[domain]/[domain]-page-client.tsx`) — composes hook + subcomponents, minimal JSX

Page files in `app/` are thin Server Components that import the page client.

Naming is inconsistent for historical reasons: app screens use `[domain]-page-client.tsx`, while auth and onboarding still use `page.client.tsx`. Follow the hyphenated form for anything new.

Rules:
- One React component per file; extract any JSX with its own logic to a separate file.
- No barrel `index.ts` re-exports.
- Copy/strings live in typed constant objects (e.g. `[feature]-copy.ts`), never inline.
- Subcomponents must not access Zustand stores directly; receive everything via props.
- Navigation side effects go in `useEffect` in the container, never mid-render.
- If a component exceeds ~80 lines it likely needs splitting.

### State management (Zustand)

All shared state is in `src/stores/`. Avoid prop drilling — if an intermediate component doesn't consume a prop, it shouldn't receive it; the consuming component reads the store directly.

Key stores:
- `auth-store` — session, profile (Employee), sign in/out/up actions
- `clinic-store` — memberships, `activeClinicId` (persisted to localStorage as `thalia-clinic`)
- Domain stores per module: `appointments-store`, `patients-store`, `employees-store`, `inventory-store`, `finances-store`, `calendar-store`, etc.

Use `useShallow` from `zustand/react/shallow` when selecting multiple fields to prevent unnecessary re-renders.

### Auth flow

`AuthProvider` (`src/components/providers/auth-provider.tsx`) initializes on mount: calls `supabase.auth.getSession()`, then hydrates `useClinicStore` (memberships) and `useAuthStore` (profile). It subscribes to `onAuthStateChange` for the session lifetime. Stores are accessed via `getState()` (not hooks) inside the provider to avoid hook call constraints.

### Supabase access

- Browser client: `src/lib/supabase.ts` — `createBrowserClient` from `@supabase/ssr`
- Server client: `src/lib/supabase/server.ts` — for Server Components / Route Handlers
- Types: `src/types/database.types.ts` — generated Supabase DB schema
- Helper: `unwrapSupabase` / `unwrapSupabaseList` in `src/lib/supabase-query.ts` — throws on Supabase error or null data

**Queries live in `src/dal/`, not in stores or components.** Every domain has a `[domain].dal.ts` with the browser client, and those that seed a Server Component also have `[domain].server.dal.ts` using the server client. Stores and hooks call the DAL; they never build a query themselves.

Server pagination, where it exists (`patient-files.dal.ts`, `patient-images.dal.ts`), uses `.range()` plus `count: "exact"` and returns `{ rows, total }`. Copy that shape rather than inventing another.

### Server seeding

Several screens fetch their first page in the Server Component and hand it to the client as `initialX`, which `useServerSeed` injects into the store so the list paints without a client round-trip. The seed is keyed: if the filters in the URL do not match the ones the server used, it is discarded and the client refetches. Eight screens do this — keep the key in sync when adding filters.

### Edge functions

`supabase/functions/`: `send-campaign` and `send-reminders` (WhatsApp via Twilio, sharing `_shared/whatsapp.ts`), plus `create-clinic`, `invite-employee` and `accept-invitation`.

`WHATSAPP_MODE` controls the adapter: `mock` (default, sends nothing), `sandbox` (real, free text) and `production` (requires a Meta-approved template). Defaulting to `mock` means a deploy without configuration sends nothing rather than messaging real patients by accident.

WhatsApp only accepts **JPEG and PNG** as image attachments. Campaign images are compressed to JPEG for that reason, unlike avatars and treatment images which use WebP — sending WebP returns Twilio `63021 Channel invalid content error`.

Deploy with `pnpm exec supabase functions deploy <name>`; the project is linked to `pbbjmwldvkjxntcqlwdz`.

### Design system

Design tokens are CSS variables defined in `app/globals.css` under `:root`, exposed to Tailwind v4 via `@theme inline`.

**Always use semantic Tailwind classes — never hardcode hex/rgb values in components:**

| Role | Classes |
|------|---------|
| App background | `bg-canvas` |
| Panels / inputs | `bg-surface` |
| Primary actions | `bg-primary`, `hover:bg-primary-hover`, `text-on-primary` |
| Text | `text-ink`, `text-ink-secondary`, `text-ink-muted` |
| Borders | `border-border`, `border-border-subtle` |
| Focus | `ring-primary` |
| Status | `text-danger`, `text-warning`, `text-success` |
| Soft accent | `bg-primary-subtle` |

The one exception: dynamic colors persisted in the database (e.g. employee color) may use `style` with the data value; the absent fallback must be a theme class, not a hex.

Radii are contained: buttons and inputs `rounded-button` (8px), cards `rounded-card` (10px), panels and dialogs `rounded-dialog` (14px).

Brand gradients and glows come from tokens derived from `--primary` with `color-mix` (`--gradient-primary`, `--gradient-avatar`, `shadow-glow`, `shadow-nav-active`). Never write the teal by hand — change `--primary` and everything recalibrates.

#### Aurora layout

White opaque cards floating on a beige canvas, separated by a 14px gutter that is the only place the background shows through:

```
z-0   AppBackdrop    --backdrop-tint with a conic sweep, opacity .2
z-10  Sidebar        floating card
z-20  SidebarInset   navbar card + content card
z-30  AppBottomNav   mobile bar
```

Every screen inside the shell puts its content in a card:

- `PageCard` for lists — owns the scroll, the sticky filter bar and an optional footer
- `PageSurface` for full-screen states that are not a list — loading, error, no permission
- `.surface-card rounded-dialog` directly only when the screen manages its own scrolling, as the calendar does with schedule-x

No glassmorphism and no `backdrop-filter`: surfaces are opaque, and blurring behind something opaque is cost with no effect.

Three constraints that are easy to get wrong, each of which cost real debugging time:

- `backdrop-filter` creates a containing block for `fixed` children. Keep `MobileFab` **outside** the card or `overflow-hidden` clips it.
- A `sticky` element with a background inside a rounded container is promoted to its own layer and its square corners escape the radius. `PageStickyFiltersSection` carries its own `rounded-t-dialog` for that reason.
- Two `box-shadow`s with zero offset accumulate at the corners and draw grey wedges outside the radius. Use one shadow with an offset.

Typography is Geist. Outfit and Inter were trialled to match the Aurora prototype and rejected: Outfit is geometric, has less x-height and read worse in dense form and dialog text. Numbers in columns or totals use `font-numeric tabular-nums`.

Icons: Lucide React only. No emojis.

### User notifications

Use `react-toastify` exclusively (`toast.success(...)` / `toast.error(...)`). No `alert`, `confirm`, or other mechanisms.

### TypeScript conventions

- Prefer early returns over nested `else` blocks.
- Don't mark parameters optional (`?`) if the function throws when they're absent.
- Don't centralize types in helpers just to satisfy imports — keep types in their domain or move them to a shared module.
- Derived values belong in computed variables, not `useState`. Never `setState` in a `useEffect` where the state being set is in the dependency array.

### Next.js

Default to Server Components. Add `"use client"` only for interactivity, state hooks, or browser-only APIs. Consult `node_modules/next/dist/docs/` for version-specific API details before writing Next.js code.
