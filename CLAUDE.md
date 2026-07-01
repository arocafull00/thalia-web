# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # start dev server on localhost:3000
pnpm build     # production build
pnpm lint      # run ESLint
```

No test suite is currently configured.

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
- `app/(app)/` — authenticated app shell (dashboard, calendar, appointments, patients, employees, inventory, finances, settings)

The `(app)` layout delegates to `AppLayoutClient`, which checks auth and active clinic, then redirects unauthenticated users to `/login` and users without a clinic to `/create-clinic`.

### Component layering

Every feature follows a strict three-layer split:

1. **Custom hook** (`src/lib/hooks/use-[feature].ts`) — all state, derivations, handlers, and data effects
2. **Subcomponents** (`src/components/[domain]/[feature]/components/`) — pure JSX, props only, no store access
3. **Page client** (`src/components/[domain]/[feature]/page.client.tsx`) — composes hook + subcomponents, minimal JSX

Page files in `app/` are thin Server Components that import the `*.page.client.tsx` wrapper.

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

All Supabase queries live in stores or hooks, never directly in components.

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

Button shapes are full pill (`rounded-full`). Inputs and cards use `rounded-xl` / `rounded-2xl`. No glassmorphism, heavy gradients, or drop shadows on standard app surfaces.

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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
