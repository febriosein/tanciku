---
name: Financial Clarity Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5b598c'
  on-secondary: '#ffffff'
  secondary-container: '#c7c3fe'
  on-secondary-container: '#514f81'
  tertiary: '#46494a'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6061'
  on-tertiary-container: '#dadbdc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c1fb'
  on-secondary-fixed: '#181445'
  on-secondary-fixed-variant: '#444173'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  stat-value:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 240px
  container-padding: 32px
  grid-gutter: 24px
  card-padding: 24px
  stack-gap: 12px
---

## Brand & Style

This design system is built for precision, trust, and ease of use in the fintech and SaaS sectors. The brand personality is **Professional, Modern, and Methodical**, balancing high-density data visualization with generous white space to prevent cognitive overload.

The visual style is **Corporate Modern with Tonal Layering**. It utilizes a deep, authoritative sidebar as a structural anchor, while the content area relies on a "soft-card" architecture. Elements are defined by subtle elevation and refined typography rather than aggressive borders, creating a calm environment for financial management.

The system targets professional users and everyday consumers who require a clear, unambiguous view of their financial health, evoking feelings of security and control.

## Colors

The palette is anchored by **Deep Navy (#1E1B4B)** for structural navigation, providing a high-contrast backdrop for the application's primary brand identity. 

- **Primary Accent:** A vibrant **Indigo/Purple (#4F46E5)** is reserved for active states, call-to-action buttons, and primary interactive indicators.
- **Functional Colors:** Financial status is communicated through a strict semantic pairing: **Emerald Green (#22C55E)** for income/positive trends and **Rose Red (#EF4444)** for expenses/negative trends.
- **Neutral Palette:** The background utilizes a very soft off-white/lilac tint (#F9FAFB) to reduce glare, while surface cards remain pure white (#FFFFFF) to pop against the canvas.

## Typography

This design system uses **Plus Jakarta Sans** across all levels to maintain a contemporary and approachable feel. The typeface’s large x-height ensures excellent legibility for financial figures and data labels.

- **Weight Strategy:** Use Bold (700) for primary monetary values and section headings. Use Semi-Bold (600) for sub-headers and active navigation labels. Regular (400) is reserved for secondary metadata and body descriptions.
- **Hierarchy:** Clear distinction between "Label" (uppercase or small-caps for metadata) and "Value" (large, bold text) is essential for rapid data scanning.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. A fixed-width sidebar (240px) resides on the left, while the main content area occupies a fluid container with a maximum width to ensure readability on ultra-wide monitors.

- **Grid:** A 12-column grid is used for the main dashboard area. Summary cards typically span 4 columns on desktop and 12 columns on mobile.
- **Rhythm:** The system uses an 8px base unit. Internal card padding is set to 24px (3 units) to provide a premium, airy feel.
- **Breakpoints:** 
  - **Mobile (<768px):** Sidebar collapses into a hamburger menu; all cards stack vertically with 16px margins.
  - **Tablet (768px - 1024px):** 2-column grid for summary stats.
  - **Desktop (>1024px):** Full 3-column or 4-column layouts.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers and Soft Ambient Shadows**.

1. **Level 0 (Canvas):** The base background layer (#F9FAFB).
2. **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (`0px 4px 20px rgba(0, 0, 0, 0.03)`). This creates a sense of "floating" without feeling heavy.
3. **Level 2 (Interactive):** Dropdowns and tooltips use a slightly more pronounced shadow (`0px 10px 30px rgba(0, 0, 0, 0.08)`) to indicate they are temporary overlays.
4. **Active States:** No shadow increase; instead, use a 2px solid border in the Primary color or a subtle background tint.

## Shapes

The design system uses a **Rounded** shape language to soften the analytical nature of financial data.

- **Standard Radius (8px):** Used for all input fields, standard buttons, and small UI elements.
- **Large Radius (16px):** Used for primary content cards and the "Active State" indicators in the sidebar navigation.
- **Pill (Full):** Used for status tags (e.g., "Paid," "Pending") and the primary "Add" buttons to make them more inviting and tactile.

## Components

### Buttons & Interaction
- **Primary Button:** Pill-shaped, Primary color background with white text. Includes a leading "+" icon for creation tasks.
- **Ghost Button:** Used for secondary actions (e.g., "View All"). Transparent background with Primary color text and an trailing chevron.

### Sidebar Navigation
- **Active State:** A high-contrast pill-shaped background using the Primary color.
- **Inactive State:** Low-opacity white text on the Deep Navy background. Includes 24px icons with consistent line weights.

### Financial Cards
- **Stat Cards:** Must contain an icon in a rounded square container, a secondary label, and a bold primary value.
- **Transaction Rows:** Features a circular avatar/icon on the left, two lines of text (Title and Date), and right-aligned currency values color-coded by semantic meaning (Income vs. Expense).

### Inputs
- **Search & Filters:** White backgrounds with light-grey borders (#E5E7EB). Active focus state should use a 1px Primary color ring. Icons are placed inside the search field on the left.