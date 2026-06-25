---
name: Thalia Management System
description: Calm clinic operations UI for aesthetic and dental practices
colors:
  canvas: "#FBFCFC"
  surface: "#ffffff"
  surface-muted: "#A1EAE0"
  ink: "#181A1F"
  ink-secondary: "#5C5F64"
  ink-muted: "#9AA1A3"
  border: "#DDE1E2"
  border-subtle: "#EBEDEE"
  primary: "#16B49B"
  primary-hover: "#62A99B"
  primary-light: "#6CDBCB"
  primary-subtle: "#A1EAE0"
  on-primary: "#ffffff"
  focus-ring: "#16B49B"
  danger: "#dc2626"
  warning: "#d97706"
  success: "#059669"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.25
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.33
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.05em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  page: "2rem"
  sidebar: "280px"
  topbar: "72px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "#62A99B"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "#5C5F64"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0.625rem 0.75rem"
  card-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "2rem"
---

# Design System: Thalia Management System

## 1. Overview

**Creative North Star: "The Quiet Clinic Desk"**

Thalia is a product UI for staff who move between reception, treatment rooms, and back-office tasks. The visual system stays calm: a cool off-white canvas, white content panels, and turquoise for actions, selection, and active states. Typography reads quickly at arm's length on a desktop monitor or tablet.

Density is moderate. Lists and tables carry real clinic data without decorative chrome. Surfaces are flat at rest; depth comes from white panels on a light canvas and 1px borders, not glass effects or heavy shadows.

**Key Characteristics:**

- Geist sans for all UI text; Geist Mono only where code or IDs appear
- `#FBFCFC` canvas with white content panels and soft gray borders
- Turquoise primary (`#16B49B`) for buttons, active nav, chips, and progress bars
- Pill-shaped primary actions; rounded-xl inputs and nav items
- Radix UI for accessible primitives (callouts, popovers, theme)
- Spanish-first copy; labels often uppercase with wide tracking
- Motion limited to hover backgrounds and focus rings (150–250ms)

## 2. Colors

The palette is restrained: soft black ink on a cool neutral canvas, turquoise for primary actions and selection, with semantic reds, ambers, and greens reserved for inventory and status.

### Primary

- **Clinic Turquoise** (#16B49B): Primary buttons, active sidebar items, focus rings, progress bars, highlighted metrics.
- **Primary Hover** (#62A99B): Hover state for primary buttons and chips.
- **Primary Light** (#6CDBCB): Decorative accents, soft highlights.
- **Primary Subtle** (#A1EAE0): Row hovers, skeleton tints, soft badges.

### Neutral

- **Canvas** (#FBFCFC): App background (`bg-canvas`), sidebar, topbar.
- **Surface** (#ffffff): Cards, inputs, popovers, table containers.
- **Border** (#DDE1E2): Standard 1px dividers, input outlines, panel edges.
- **Border Subtle** (#EBEDEE): Internal table dividers.
- **Ink** (#181A1F): Headings, primary table cell text.
- **Ink Secondary** (#5C5F64): Body copy, list items, idle nav text.
- **Ink Muted** (#9AA1A3): Labels, placeholders, metadata, table headers.

### Semantic

- **Danger** (#dc2626): Errors, critical inventory.
- **Warning** (#d97706): Warnings, low stock.
- **Success** (#059669): Optimal stock, positive states.

### Named Rules

**The One Accent Rule.** Clinic Turquoise carries primary actions, active navigation, and focus. Semantic colors appear only where status is the message. No decorative color blocks.

**The Flat Canvas Rule.** Backgrounds stay canvas or surface. Do not stack tinted neutrals for decoration.

## 3. Typography

**Display Font:** Geist (with system-ui fallback)
**Body Font:** Geist (with system-ui fallback)
**Mono Font:** Geist Mono (with ui-monospace fallback)

**Character:** Geometric, neutral, and legible at 14px. Hierarchy comes from size and weight, not display typefaces in data screens.

### Hierarchy

- **Display** (500, 3rem, 1.1): Login hero, rare marketing moments inside the app shell.
- **Headline** (500, 1.5rem, 1.25): Page titles inside panels ("Bienvenido de nuevo").
- **Title** (500, 1.125rem, 1.33): Section headers, sidebar wordmark scale.
- **Body** (400, 0.875rem, 1.43): Default UI copy, table cells, inputs. Keep prose under 65–75ch where it runs long.
- **Label** (500, 0.75rem, uppercase, 0.05em tracking): Field labels, table column headers, tab filters.

### Named Rules

**The Product Sans Rule.** Do not introduce a second sans for UI chrome. One family from login through settings.

**The Label Case Rule.** Uppercase labels are for form fields and column headers only, not sentences or button verbs.

## 4. Elevation

Depth is tonal, not shadow-driven. White panels sit on canvas; borders define edges. A light `shadow-sm` is acceptable on auth and onboarding cards only.

### Shadow Vocabulary

- **Panel lift** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): Login card, onboarding wizard. Sparingly.
- **Popover** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1)`): Dropdowns and calendar filters.

### Named Rules

**The Flat-By-Default Rule.** Dashboard tables, sidebar, and lists have no drop shadow. If it needs depth, use a white surface and a border first.

**The No Glass Rule.** No backdrop blur on navigation or modals. PRODUCT.md explicitly rejects decorative glassmorphism.

## 5. Components

### Buttons

- **Shape:** Full pill (`rounded-full`, 9999px radius).
- **Primary:** Turquoise background, white 12px uppercase label, px-4 py-2. Hover to `#62A99B`.
- **Ghost:** White background, border token, ink-secondary text. Hover to primary-subtle tint.
- **Disabled:** 50% opacity; no alternate color.

### Chips / Tabs

- **Filter chip active:** Primary fill, on-primary text, pill shape.
- **Filter chip idle:** Surface or primary-subtle fill, ink-secondary text, ring-1 border optional.

### Cards / Containers

- **Corner Style:** `rounded-2xl` (1rem) for data tables and stat tiles; `rounded-3xl` (1.5rem) for auth and wizard panels.
- **Background:** Surface on canvas.
- **Border:** 1px border token; dashed border for empty states.
- **Internal Padding:** p-5 for stat cards, p-8 for auth panels, p-8 page gutters.

### Inputs / Fields

- **Style:** Surface fill, border token, rounded-xl, 14px text.
- **Focus:** 2px ring in primary; no glow or gradient.
- **Labels:** 12px uppercase, ink-muted, tracking-wide above the field.

### Navigation

- **Sidebar:** Fixed 280px, canvas background, border-r. Items: rounded-xl, 14px. Active item: primary fill, on-primary text. Idle: ink-secondary, hover primary-subtle.
- **Topbar:** 72px min-height, canvas background, border-b. Search input matches field style with left icon inset.
- **Profile chip:** Surface bordered pill in sidebar footer and topbar link.

### Notices

- **Radix Callout:** size 1, color red / amber / gray by tone. Used for auth errors and config warnings.

### Skeleton

- **List skeleton:** primary-subtle rounded-lg bars, pulse animation.

## 6. Do's and Don'ts

### Do:

- **Do** keep the canvas + surface panel rhythm on every app screen.
- **Do** use pill buttons with verb + object labels in Spanish ("Entrar", "Continuar con Google").
- **Do** show focus rings on all interactive controls for keyboard users.
- **Do** use skeleton loaders for list and block loading states.
- **Do** respect `prefers-reduced-motion` by keeping transitions to color and opacity only.

### Don't:

- **Don't** use glassmorphism used purely for decoration.
- **Don't** use excessive gradients or gradient text.
- **Don't** use oversized rounded cards beyond the xl/2xl scale already in code.
- **Don't** use generic illustration packs or marketing metric hero blocks inside the app shell.
- **Don't** use unnecessary animations or orchestrated page-load sequences.
- **Don't** use marketing buzzwords that could describe any software.
- **Don't** pair a 1px border with a wide soft shadow on the same element.
- **Don't** introduce DM Sans or other display faces; Geist is the committed stack.
