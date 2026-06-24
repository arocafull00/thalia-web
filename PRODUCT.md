# Product

## Register

brand

## Users

Clinic owners and managers at aesthetic and beauty clinics in Spain (primary language: Spanish). They evaluate Thalia before their team adopts it. They are often juggling reception, professionals, inventory, and finances across spreadsheets, paper agendas, or disconnected tools. They browse on phone or laptop between patients or at end of day. They need to understand quickly whether Thalia fits how their clinic actually runs.

## Product Purpose

Thalia is clinic management software for aesthetic clinics: appointments, patient records, team coordination, inventory, finances, and treatment catalog in one place, usable on mobile, tablet, and browser.

This repository (`thalia-landing`) is the public marketing surface for that product. Success for the first version is credibility and a clear value proposition: visitors understand what Thalia does, who it is for, and why it is trustworthy, without a hard conversion push yet. A waitlist or early-access path may appear later; it is not the primary goal of v1.

## Brand Personality

Calm and clinical: trustworthy, orderly, understated luxury. Voice is direct and specific about clinic workflows, never hype-driven. Feels like a tool a serious clinic would trust with patient and business data, not a growth experiment.

## Anti-references

- Generic SaaS landing patterns: purple gradients, hero metric blocks (big number + three stats), identical icon-card feature grids, tiny uppercase eyebrows on every section, gradient text, ghost cards (1px border plus wide soft shadow).
- Marketing buzzwords and aphoristic punch lines that could apply to any product.
- Visual noise that competes with clarity: glassmorphism as decoration, oversized rounded cards, sketchy placeholder illustrations.

Named visual references: not locked yet. Direction is calm clinical restraint, not spa cliché or cold hospital stock imagery.

## Design Principles

1. **Clinic reality first** — Copy and structure reflect real jobs (agenda, fichas, inventario, finanzas), not abstract "platform" language.
2. **Credibility before conversion** — v1 earns trust through clarity and specificity; CTAs stay secondary until the story lands.
3. **Restraint reads as premium** — Hierarchy, typography, and spacing carry calm clinical tone; color accents are deliberate, not decorative.
4. **Show the system, not the template** — Avoid interchangeable SaaS scaffolding; layout and rhythm should feel authored for Thalia.
5. **Accessible by default** — Public marketing meets WCAG 2.2 AA; motion respects `prefers-reduced-motion`.

## Accessibility & Inclusion

- Target: WCAG 2.2 AA for text contrast, focus visibility, keyboard navigation, and semantic structure.
- Spanish as primary content language; `lang` on document root must match shipped copy.
- Respect `prefers-reduced-motion`: no content gated on entrance animations; provide reduced-motion alternatives for any motion beyond opacity or instant state changes.
- Form controls and waitlist flows (when added) need visible labels, error text, and sufficient touch targets on mobile.
