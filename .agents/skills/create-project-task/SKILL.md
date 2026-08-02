---
name: create-project-task
description: >-
  Create GitHub Issues on the Thalia Web project board with the standard Spanish
  task template (Descripción, Contexto, Tareas, Archivos relevantes). Use when
  the user asks to create a task, issue, ticket, or card for the Thalia board
  (github.com/users/arocafull00/projects/2), or to add work items to the backlog.
---

# Create Thalia project task

Create a GitHub Issue in `arocafull00/thalia-web`, add it to project **Thalia Web** (#2), and set board fields.

Board: https://github.com/users/arocafull00/projects/2/views/1

## Before creating

1. Confirm title, scope, and optional **Status** / **Priority** / **Size** with the user if unclear.
2. Defaults when not specified:
   - Status: `Backlog`
   - Priority: omit (leave unset)
   - Size: omit (leave unset)
3. Search for duplicates first:

```bash
gh issue list --repo arocafull00/thalia-web --state open --search "<keywords>" --limit 10
```

4. If the task touches code, locate relevant paths with `graphify query` before writing **Archivos relevantes**. Do not invent file paths.

## Issue body template

Write the body in **Spanish**. Use this structure (omit optional sections only when they add nothing):

```markdown
## Descripción

<1–3 sentences: what to change and where>

## Contexto

<Why it matters, current behavior, related issues as #N. Optional: use ## Objetivo instead when the section is a goal, not background.>

## Tareas

1. <Concrete step>
2. <Concrete step>
3. <…>
4. Verificar desktop y móvil

## Archivos relevantes

- `path/to/file-or-dir`
- `another/path`
```

### Section rules

| Section | Required | Notes |
|---------|----------|--------|
| Descripción | Yes | Outcome-focused, not a novel |
| Contexto or Objetivo | Preferred | One of the two; skip only for trivial tasks |
| Tareas | Yes | Numbered checklist of implementable steps |
| Archivos relevantes | Preferred | Real paths; skip only if unknown |

### Title rules

- Spanish, imperative / descriptive, ~50–80 chars
- Prefer domain prefix when useful: `Ajustes: …`, `Citas: …`, `Pacientes: …`
- No issue number in the title

### Good example (reference #63)

**Title:** `Ajustes: sustituir tabs Usuario/Clínica por un submenú`

**Body:**

```markdown
## Descripción

En Ajustes, sustituir las tabs horizontales (Usuario / Clínica) por un submenú de navegación dentro de Ajustes.

## Contexto

Ahora Ajustes usa tabs en la parte superior del contenido (`Usuario`, `Clínica`, y también `Aplicación` — ver #60). Queda más claro y escalable usar un submenú (sidebar o lista de secciones) para entrar a Usuario, Clínica, etc., en lugar de tabs planas.

## Tareas

1. Quitar las tabs Usuario / Clínica del layout actual de Ajustes
2. Añadir un submenú en Ajustes con las secciones (Usuario, Clínica, y las que correspondan)
3. Navegar entre secciones desde el submenú (rutas o estado de sección, coherente con el patrón de la app)
4. Coordinar con #60 (quitar Aplicación de Ajustes / CTA en topbar)
5. Mantener el contenido actual de cada sección (perfil, cuenta, clínica, horarios, etc.)
6. Verificar desktop y móvil

## Archivos relevantes

- `src/components/settings/`
- Página de ajustes en `app/(app)/settings/`
```

## Create workflow

Run these steps in order. Do **not** open a browser unless the user asks.

### 1. Create the issue

```bash
gh issue create \
  --repo arocafull00/thalia-web \
  --title "<title>" \
  --body "$(cat <<'EOF'
## Descripción

...

## Contexto

...

## Tareas

1. ...

## Archivos relevantes

- `...`
EOF
)"
```

Capture the issue URL from the command output.

### 2. Add to the project board

```bash
gh project item-add 2 --owner arocafull00 --url "<issue-url>" --format json
```

Capture `id` from the JSON (project item id, starts with `PVTI_`).

Project id (stable): `PVT_kwHOBLKqTc4Bbicu`

### 3. Set Status / Priority / Size

Use `gh project item-edit` once per field.

**Status** field id: `PVTSSF_lAHOBLKqTc4BbicuzhWSSqQ`

| Name | Option id |
|------|-----------|
| Backlog | `f75ad846` |
| Ready | `61e4505c` |
| In progress | `47fc9ee4` |
| Revisada con comentarios | `ec0387e8` |
| In review | `df73e18b` |
| Done | `98236657` |

**Priority** field id: `PVTSSF_lAHOBLKqTc4BbicuzhWSSxA`

| Name | Option id |
|------|-----------|
| P0 | `79628723` |
| P1 | `0a877460` |
| P2 | `da944a9c` |
| Post-MVP | `f30a9151` |

**Size** field id: `PVTSSF_lAHOBLKqTc4BbicuzhWSSxE`

| Name | Option id |
|------|-----------|
| XS | `6c6483d2` |
| S | `f784b110` |
| M | `7515a9f1` |
| L | `817d0097` |
| XL | `db339eb2` |

Example (Status → Backlog):

```bash
gh project item-edit \
  --id "<project-item-id>" \
  --project-id PVT_kwHOBLKqTc4Bbicu \
  --field-id PVTSSF_lAHOBLKqTc4BbicuzhWSSqQ \
  --single-select-option-id f75ad846
```

### 4. Confirm to the user

Return:

- Issue URL
- Title
- Status / Priority / Size set
- Board link: https://github.com/users/arocafull00/projects/2/views/1

## Batch creation

When the user asks for several tasks:

1. Draft all titles + bodies first; show a short list for confirmation if scope is ambiguous.
2. Create issues one by one (no parallel creates that race on numbering).
3. Add each to the project and set fields.
4. Summarize with a bullet list of URLs.

## Auth note

If project commands fail with a scope error:

```bash
gh auth refresh -s project
```

Ask the user to complete the auth flow, then retry.

## Do not

- Create draft project items when a repo issue is appropriate (prefer real issues)
- Put implementation code or long design docs in the issue body
- Skip adding the issue to project #2
- Use English for title/body unless the user explicitly asks
- Create tests, docs, or start implementing the task unless asked
