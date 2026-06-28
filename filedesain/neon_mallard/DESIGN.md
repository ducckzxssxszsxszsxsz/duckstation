---
name: Neon Mallard
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#303033'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffffff'
  on-tertiary: '#313030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#121315'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: -0.01em
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
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system embodies a "Hyper-Minimalist Web3" aesthetic. It balances the serious nature of high-stakes trading with a vibrant, community-focused energy. The personality is precise, technical, yet approachable—leveraging the "Duck" mascot not as a cartoon, but as a stylized, high-tech icon (think geometric lines or 3D chrome textures).

The visual direction combines **Minimalism** with **Glassmorphism**. It utilizes a deep, "Digital Shadow" background to allow data visualizations and neon accents to pop with maximum luminosity. The interface feels lightweight and atmospheric, focusing on high signal-to-noise ratios essential for trading mentorship.

## Colors
The palette is centered on high-contrast neon against a void-like background.

- **Primary (Electric Lime):** Used for primary actions, success states, and key trend indicators. It represents growth and "go" signals.
- **Secondary (Cyber Cyan):** Used for secondary highlights, Web3 wallet interactions, and technical links.
- **Surface Tiers:**
    - **Background:** `#0B0C0E` (Deep Charcoal)
    - **Card/Surface:** `#16171B` with 60% opacity for glassmorphic effects.
    - **Border:** `#26282D` (Subtle definition).
- **Accents:** Use gradients transitioning from `Electric Lime` to `Cyber Cyan` for data network lines and decorative mascot glows.

## Typography
The system uses **Geist** for its technical, developer-centric precision in headlines and UI labels, while **Inter** provides high readability for community discussions and educational content.

- **Headlines:** Use tight letter spacing and high weight to create a "command center" feel.
- **Numerical Data:** Always use Geist (or its mono variant) to ensure tabular figures align perfectly in trading grids.
- **Emphasis:** Use the Primary Electric Lime color for specific keywords within headlines to draw the eye to core value propositions.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high density for trading dashboards and generous "breathing room" for mentorship landing pages.

- **Grid:** 12-column layout for desktop (1440px+), 8-column for tablet, and 4-column for mobile.
- **D3.js Visualization Areas:** These sections should break the grid or live within "Full-Bleed" glassmorphic containers to allow network graphs to expand dynamically.
- **Rhythm:** Use an 8px base unit. Component padding should lean towards `16px` (sm) or `24px` (md) to maintain the "lightweight" feel.

## Elevation & Depth
Depth is achieved through **Backdrop Blurs** and **Radial Glows** rather than traditional shadows.

- **Base Layer:** The deepest dark charcoal `#0B0C0E`.
- **Card Layer:** 60% opacity with a `20px` backdrop blur. A `1px` inner stroke of `#FFFFFF10` provides a "glass edge."
- **Interactive Layer:** Elements like buttons or active wallet cards emit a soft `0px 0px 20px` outer glow in the Primary or Secondary color.
- **Mascot Integration:** The Duck mascot should appear to sit "behind" the glass layers or as a translucent watermark in the background, subtly illuminated by the Primary Electric Lime color.

## Shapes
The shape language is "Modern Rounded"—avoiding the playfulness of pill shapes but rejecting the harshness of sharp corners. 

- **Primary Corners:** `0.5rem` (8px) for standard cards and buttons.
- **Icon Containers:** Circular or subtly rounded squares.
- **Interactive States:** Use a transition to a slightly larger radius or a glowing border-bottom to indicate focus.

## Components
- **Web3 Wallet Button:** A glassmorphic button with a "Cyber Cyan" left-hand border. On hover, the background fill increases in opacity, and the Cyan glow intensifies.
- **Glassmorphic Cards:** High transparency (40-60%) with a subtle grid pattern background texture. Headers within cards should use the `label-sm` Geist style.
- **Network Graphs (D3.js):** Nodes should be small circles in Primary Lime. Edges should be thin 0.5px lines in Secondary Cyan with 30% opacity. Active paths glow at 100% opacity.
- **Mascot Elements:** Use "Duck" motifs as status indicators (e.g., a "Bullish Duck" in Lime for profit alerts, or a "Neutral Duck" in Cyan for community pings).
- **Inputs:** Darker than the background (`#000000`), with a 1px border that turns Electric Lime on focus. No shadows—only a sharp neon outline.
- **Chips/Badges:** Small, high-contrast pills with Electric Lime text on a dark `#CCFF0015` (15% opacity) background.