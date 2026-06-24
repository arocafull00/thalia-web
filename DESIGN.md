---
name: Thalia Management System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e604d'
  on-secondary: '#ffffff'
  secondary-container: '#e1e1c9'
  on-secondary-container: '#636451'
  tertiary: '#60603e'
  on-tertiary: '#ffffff'
  tertiary-container: '#aead85'
  on-tertiary-container: '#414122'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e4e4cc'
  secondary-fixed-dim: '#c8c8b0'
  on-secondary-fixed: '#1b1d0e'
  on-secondary-fixed-variant: '#474836'
  tertiary-fixed: '#e6e5b9'
  tertiary-fixed-dim: '#cac99f'
  on-tertiary-fixed: '#1d1d03'
  on-tertiary-fixed-variant: '#484828'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is anchored in a philosophy of "Quiet Luxury"—a premium, minimalist aesthetic tailored for high-end aesthetic clinics. It prioritizes clarity, calm, and professional precision. 

The style blends **Minimalism** with **Glassmorphism** and **Corporate Modern** influences. It utilizes heavy whitespace to reduce cognitive load for practitioners, while employing sophisticated layer transparency to evoke a sense of lightness and cleanliness. The emotional response should be one of immediate trust and understated elegance, moving away from traditional clinical coldness toward a boutique, hospitality-inspired digital environment.

## Colors
The palette is strictly desaturated to maintain a high-end, editorial feel. 

- **Primary (#1A1A1A):** A Soft Black used for typography and high-emphasis interactive elements. It provides the necessary grounding for the lighter palette.
- **Secondary (#F5F5DC):** Light Beige, used for subtle surface differentiation and "active" states in navigation.
- **Tertiary (#FFFDD0):** Cream, utilized for soft highlights or specialized notification backgrounds.
- **Neutral (#FAFAFA):** The core background color. This off-white ensures the UI feels breathable and less harsh than pure white.
- **Warm Grey (#F0F0F0):** Used for borders, dividers, and secondary button backgrounds to provide structure without adding visual noise.

## Typography
The system utilizes **DM Sans** across all levels to maintain a clean, geometric, and modern appearance. 

The hierarchy is built on subtle weight shifts rather than dramatic size changes. Headlines use a slight negative letter-spacing to appear tighter and more "designed," similar to high-end editorial layouts. Labels utilize an uppercase treatment with increased tracking for a sophisticated, systematic feel in table headers and small tags. All body text maintains a generous line height to ensure maximum readability for patient notes and schedules.

## Layout & Spacing
This design system employs a **Fixed Grid** model for desktop and a **Fluid** model for mobile devices. 

- **Desktop:** A 12-column grid with a maximum content width of 1440px. Gutters are fixed at 24px to provide a structured, architectural feel.
- **Mobile:** A 4-column fluid grid with 16px side margins. 
- **Spacing Philosophy:** We follow an 8pt spatial rhythm. Generous padding (at least 24px) within cards and containers is mandatory to maintain the premium, "airy" aesthetic. Components should never feel cramped; when in doubt, increase the whitespace.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Glassmorphism**, avoiding heavy, dark shadows.

1.  **Base Layer:** Neutral (#FAFAFA).
2.  **Floating Layer:** Cards use a high-radius white background with a very soft, diffused ambient shadow (Color: #1A1A1A at 4% opacity, Blur: 20px, Y: 10px).
3.  **Glassmorphism:** Navigation sidebars and modal overlays utilize a backdrop blur (20px) with a semi-transparent white tint (80% opacity). This maintains the context of the content underneath while creating a "frosted glass" premium effect.
4.  **Outlines:** Interactive elements use 1px solid borders in Warm Grey (#F0F0F0) to define boundaries without the visual weight of shadows.

## Shapes
The shape language is defined by large, inviting radii. 

- **Standard Elements:** Buttons, input fields, and small UI components use a 0.5rem (8px) radius.
- **Containers:** Dashboard cards and modals use `rounded-xl` (1.5rem / 24px) to create a soft, friendly, and modern silhouette. 
- **Selection Indicators:** Pill-shaped (fully rounded) containers are reserved for tags, chips, and active state indicators within navigation bars.

## Components

- **Buttons:** Primary buttons are Soft Black (#1A1A1A) with white text. Secondary buttons are Warm Grey (#F0F0F0) with Soft Black text. Use 16px horizontal and 12px vertical padding.
- **Input Fields:** Use a subtle Warm Grey border. On focus, the border transitions to Soft Black. Use a 14px font size for input text.
- **Cards:** Floating cards are the primary container. They must feature a 24px border radius and the diffused ambient shadow described in the Elevation section.
- **Chips/Status:** Use the Light Beige (#F5F5DC) for "pending" or "neutral" states. Use Soft Black for "confirmed" or "active" states. Text should always be DM Sans 12px Medium.
- **Lists:** Table rows and lists should have a minimum height of 64px to allow for vertical breathing room. Use 1px Warm Grey dividers.
- **Specialty Components:** 
    - *Calendar View:* Use Cream (#FFFDD0) for the current day highlight.
    - *Floating Action Buttons:* High-radius, Soft Black background, centered icon, positioned at the bottom right with significant margin.