
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.vodafone.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var vodafone_default={"contract":`## 1. Visual Theme & Atmosphere

Vodafone's corporate web system carries the confident, broadcast-scale presence of a global telecom brand — built around a single, fiercely-owned brand red and a restrained, editorial layout that lets imagery and type carry the emotional weight. Every page opens the same way: a cinematic dark hero image behind a towering, tight-tracked uppercase display headline ("EVERYONE. CONNECTED.", "INVESTORS", "OUR BUSINESS") followed by a deep red full-width band that acts as a chapter break, then a crisp white editorial grid or a near-black section reserved for institutional content (share ticker, global map, ESG data). The voice is institutional but human: warm documentary photography — cable-laying crews, coral reefs, pine forests, urban twilight — photographed with color-graded realism and set against clean neutral surfaces that never compete with the content.

The typography system is the signature. A custom Vodafone display face runs all the way up to 144px in heavy 800-weight uppercase with negative tracking, and it holds that voice consistently across every page template. Body copy sits in a calm 16-18px mid-weight rhythm. This dual scale — monumental at the top, almost quiet at the bottom — creates the "corporate newsroom" feeling: every page reads like the front of a national paper whose masthead happens to be red.

Surface treatment is disciplined and predictable: a three-surface pass of white (editorial canvas) → Vodafone red (band dividers, CTA buttons, the famous speech-mark logo) → near-black charcoal (footer, share-ticker panel, global-impact map). There is almost no decorative shadow, almost no gradient, and almost no rounded-corner softness. Edges are small and clinical (2px and 6px), buttons operate as a two-tier system — tight 2px rectangles for utility/form actions, and fully-rounded 60px pills for primary content CTAs. This is a design system that trusts the brand color to do the heavy lifting and gets out of its way everywhere else.

**Key Characteristics:**
- Vodafone Red (\`#e60000\`) is the single dominant accent — used for CTAs, dividers, band sections, the speech-mark logo, and the rotated "IMPACT" brand-mark type on the sustainability map
- Monumental uppercase display type (up to 144px, weight 800, negative letter-spacing) paired with calm 16-18px body copy
- A universal page rhythm: dark atmospheric hero → monumental uppercase headline → full-width red band → white editorial canvas → dark charcoal institutional panel → charcoal footer
- Two-tier button system: tight 2px-radius rectangles for utility actions, fully-pill 60px buttons for primary content CTAs (both equally primary, selected by context)
- Documentary photography (people, infrastructure, cities, nature) dominates over illustration; no stock-icon noise
- Near-absence of shadows and gradients — hierarchy comes from type weight, color blocks, and spacing rather than elevation
- Deep charcoal surface (\`#25282b\`) is reused as the footer AND the institutional data panel (share ticker, world map) — a single material for anything formal and numeric

## 4. Component Stylings

### Buttons

Vodafone operates a genuine two-tier primary button system. Both tiers are used as primary calls to action — the difference is context (form/chrome vs editorial/content), not hierarchy.

**Primary Red Rectangle** (utility / form CTA — "Accept All Cookies", "Subscribe")
- Background: Vodafone Red (\`#e60000\`)
- Text: Pure White (\`#ffffff\`), 14.4px, weight 700, letter-spacing 0.144px
- Padding: 12px vertical, 10px horizontal
- Border: 1px solid Vodafone Red (\`#e60000\`)
- Border radius: 2px — deliberately sharp-cornered
- Default state: solid red fill with crisp 2px corners
- Active state: brief opacity drop to \`0.9\` on press

**Primary Red Pill** (editorial / content CTA — "Link to Our approach to ESG", "EXPLORE CONNECTING PEOPLE")
- Background: Vodafone Red (\`#e60000\`)
- Text: Pure White (\`#ffffff\`), 14.4px, weight 700, letter-spacing 0.144px
- Padding: 16px uniform
- Border radius: 60px — fully pill-shaped
- Default state: solid red fill with rounded ends
- Active state: brief opacity drop to \`0.9\` on press

**Ghost White Rectangle** (secondary form action)
- Background: Pure White (\`#ffffff\`)
- Text: Form Text Grey (\`#333333\`), 14.4px, weight 700
- Padding: 12px vertical, 10px horizontal
- Border: 1px solid Form Text Grey (\`#333333\`)
- Border radius: 2px
- Default state: white fill with charcoal outline
- Active state: opacity \`0.9\` on press

**Glass Pill** (sits on dark hero imagery — secondary content CTA)
- Background: Pure White at 10% opacity (\`rgba(255,255,255,0.1)\`)
- Text: Pure White (\`#ffffff\`), weight 700
- Padding: 8px vertical, 16px horizontal
- Border radius: 24px — fully pill-shaped
- Default state: soft translucent pill lets the photo breathe through

**Content Ghost Pill** (inline within editorial cards — low-emphasis content CTA)
- Background: Black at 5% opacity (\`rgba(0,0,0,0.05)\`)
- Text: Vodafone Red (\`#e60000\`), 14.4px, weight 700
- Padding: 15px uniform
- Border radius: 60px — fully pill-shaped
- Default state: nearly transparent pill with red text

**Icon Control Button** (video play/pause, carousel arrows, close)
- Background: Pure White (\`#ffffff\`)
- Icon color: Charcoal Headline (\`#25282b\`)
- Border radius: 50% — perfect circle
- Outline: 1px solid white, used for focus indication
- Size: typically 32-40px diameter

### Cards & Containers

**News / Editorial Card** (homepage article tile)
- Background: Pure White (\`#ffffff\`)
- Border radius: 6px (applied to image corners and card container)
- Shadow: none — cards rely on spacing and the image aspect ratio for separation
- Internal layout: 16:9 image on top → 12px gap → eyebrow row (date + tag pill) → 8px gap → H4 Bold title → 16px card padding on sides and bottom
- The card image uses \`object-fit: cover\` and rounded top corners (6px top-left/top-right)

**Asymmetric Corner Card** (featured homepage cards)
- Background: Pure White (\`#ffffff\`)
- Border radius: \`0px 6px 0px 0px\` — a deliberate single-corner-rounded shape that echoes the Vodafone speech-mark logo's curved geometry
- No shadow, no border — the asymmetric radius itself is the visual signature

**Circular Portrait / Pictogram Container** (sustainability page)
- Background: Pure White (\`#ffffff\`)
- Border radius: 100% — perfect circle
- Used for ESG pictograms and executive portraits inside the institutional content area

### Inputs & Forms

Vodafone's corporate site does not expose many inline form controls on the homepage, but button-style inputs follow these rules:

- Background: Pure White (\`#ffffff\`)
- Text: Form Text Grey (\`#333333\`), 16px, weight 400
- Border: 1px solid Form Text Grey (\`#333333\`)
- Border radius: 2px
- Padding: 12px 10px
- Error state (when shown): the 1px border shifts to Vodafone Red (\`#e60000\`) and error message text inherits the same red at 12px weight 600

### Navigation

**Top bar**
- Background: transparent over hero imagery; solid white (\`#ffffff\`) on scroll or interior pages
- Height: approximately 64px desktop, 56px mobile
- Logo: Vodafone speech-mark, 40×40px red circle with a white "speech-mark" cut-out, left-aligned
- Nav links: 16px weight 400 Charcoal Headline (\`#25282b\`) on white; reversed to white when sitting on dark hero imagery
- Right-side utility: small icon links (search, locale, menu) rendered as 24px icomoon glyphs
- On interior pages (Investors, Sustainable Business), the top bar shows additional secondary-nav row: "Vodafone Business / Vodafone Foundation / Our site" labels, aligned right

**Mobile collapse**
- At approximately 768px the horizontal nav collapses into a hamburger
- Mobile menu opens as a full-width overlay with white surface, 18px weight 400 link rows, 16px vertical padding per row

### Image Treatment

- **Hero images**: full-bleed, dark atmospheric photography (coral reefs, pine forests, cable crews, urban twilight) with a natural vignette or cool-tone color grade — no CSS overlay is needed because the imagery itself is pre-graded
- **Card thumbnails**: 16:9 aspect ratio, 6px top corner radius matching the card
- **Square editorial images**: 1:1 ratio used in feature modules, always 6px corner radius
- **Round portraits**: 100% (perfect circle) for executive headshots and ESG pictograms
- **Loading**: lazy-loading triggers on scroll; images stabilize within ~200ms of entering the viewport
- **No decorative borders on images** — the card radius does all the framing work

### Tag Pills / Badges

Two distinct pill styles appear:

**Outlined Red Pill** (used inline on article card metadata, e.g., "EMPOWERING PEOPLE")
- Background: Pure White at 80% opacity (\`rgba(255,255,255,0.8)\`)
- Text: Near-black at 80% opacity (\`rgba(0,0,0,0.8)\`), 12px, weight 600, uppercase
- Border: 1px solid Vodafone Red (\`#e60000\`)
- Padding: 6px
- Border radius: small-rounded (roughly 2px)

**Filled Neutral Pill** (quieter tags)
- Background: Light Neutral (\`#f2f2f2\`)
- Text: Charcoal Headline (\`#25282b\`), 14px, weight 700
- Padding: 4px 12px
- Border radius: 32px — fully pill-shaped

### Red Divider Band

A signature reusable component that appears on every page template: a full-width band of Vodafone Red (\`#e60000\`) that runs horizontally across the page to separate the monumental hero from the editorial body beneath it. It carries no text and no controls — it simply is the brand's way of saying "new chapter." Typical height: 40-80px.

### Share Ticker Panel (Investor pages)

A distinctive institutional component that anchors the investor template:
- Background: Charcoal Institutional Panel (\`#25282b\`)
- Large numeric display: share price set in 48px weight 800 white type with negative letter-spacing (e.g., "116.05 GBX")
- Metadata row: delay notice (e.g., "15-min delayed") and timestamp in 14px weight 400 secondary grey text
- Layout: sits as a horizontal strip above the footer, spans the full content width
- Hairline dividers (\`rgba(255,255,255,0.25)\`) separate the ticker from the footer columns

### Global Impact Map Panel (Sustainability pages)

A signature reusable component that anchors the sustainability template:
- Background: Charcoal Institutional Panel (\`#25282b\`)
- A dark minimal world-map illustration in slightly lighter grey
- Red circular markers (\`#e60000\`) plotted on geographic locations where the brand operates
- Vertically-rotated brand word "IMPACT" set in Vodafone Red at large display size (weight 800, uppercase, 90° rotated) running along one edge of the panel — this is the template's signature typographic move
- Small legend with red markers and white uppercase labels at the top-left

### Footer

A universal component across all page templates:
- Background: Charcoal Institutional Panel (\`#25282b\`)
- Layout: 4-column link grid (Our company / Investors / Vodafone websites / Share price) followed by a "Connect with us" social row and legal/privacy line
- Logo: red speech-mark repeats bottom-right at 32-40px
- Column header type: 16px weight 800 uppercase white
- Column link type: 14px weight 400 white, stacked vertically with 12px row spacing
- Divider hairlines: \`rgba(255,255,255,0.25)\` between column group and legal row

## 5. Layout Principles

### Spacing System

Base unit: **8px**. The scale accommodates both tight UI (1px, 2px, 4px) and generous editorial rhythm (16px, 20px, 24px, 32px). Two values (\`32px\` and \`38px\`) appear across every page in the analysis, making them the template's universal rhythm constants.

| Token | Value | Typical Use |
|-------|-------|-------------|
| 2xs | 2px | Hairline separators |
| xs | 4px | Icon-to-text gap in tight controls |
| sm | 8px | Base rhythm unit |
| md | 12px | Card internal padding, eyebrow-to-title gap |
| base | 16px | Paragraph rhythm, card padding, pill button padding |
| lg | 20px | Section-internal spacing |
| xl | 24px | Card-to-card spacing, column gutters |
| 2xl | 32px | Section intro-to-content breaks — universal constant |
| 3xl | 38px | Band-to-next-section vertical push — universal constant |
| section | 64-96px | Vertical rhythm between major editorial modules |

### Grid & Container

- **Max content width**: approximately 1440px on very large screens; articles and hero modules typically sit at 1200px
- **Column pattern on cards**: 3-up or 4-up card grid at desktop (1200-1440px), 2-up at tablet (768-1024px), stacked 1-up at mobile (<768px)
- **Horizontal padding**: 32px at desktop edge, 20px at tablet, 16px at mobile
- **Gutters between cards**: 24px desktop, 16px mobile
- **Institutional panel (share ticker, world map, footer)**: always full-bleed edge-to-edge at every breakpoint

### Whitespace Philosophy

Vodafone's editorial canvas leans generous — whitespace is used as a visual palette cleanser between a monumental headline and the card grid or data panel that follows. Sections are separated by tall vertical rhythm (64-96px) plus the occasional red band that acts as both a separator and a brand signal. Within cards, spacing is tight and efficient (12-16px) so the photography can take the stage.

### Border Radius Scale

| Token | Value | Typical Use |
|-------|-------|-------------|
| hairline | 1px | Inline text wraps, small badges |
| button-tight | 2px | Primary and secondary rectangle button corners — the brand's utility-form look |
| card | 6px | News cards, images, input fields |
| asymmetric | \`0px 6px 0px 0px\` | Featured cards (top-right corner only) |
| glass-pill | 24px | Translucent white pills sitting on dark hero imagery |
| badge-pill | 32px | Filled neutral pill badges |
| cta-pill | 60px | Primary red content CTAs — the brand's editorial button look |
| circle | 50% | Icon buttons, carousel arrows, close controls |
| portrait | 100% | Circular portraits and ESG pictograms |

## 6. Depth & Elevation

Vodafone's system is deliberately flat. There is almost no conventional box-shadow in the UI. Hierarchy is carried by color (red bands, charcoal institutional panels), typography weight (800 vs 400), and spacing.

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 — Surface | No shadow, no border | Default card, default section |
| 1 — Outline | 1px solid border at low-opacity | Ghost buttons, outlined pills |
| 2 — Inset Highlight | \`inset 0 0 0 1px\` on focus | Pressed / focused controls |
| 3 — Photographic depth | The photography itself carries the depth | Hero imagery |
| 4 — Surface shift | Charcoal institutional panel below a white editorial canvas | Share ticker / world map / footer |

Shadow philosophy: Vodafone treats drop shadows as a distraction from brand clarity. The few extracted shadow tokens are reserved for inset focus rings. The dominant "elevation" in the system is a **color surface shift** — switching from the white editorial canvas to the charcoal institutional panel — rather than a lift-off drop shadow.

### Decorative Depth

The only decorative depth cues are:
- Atmospheric dark hero photography that carries its own cinematic tonal depth (no CSS overlay needed)
- The rotated vertical "IMPACT" wordmark on the sustainability map, which creates the illusion of a fourth wall alongside the map panel

## 8. Responsive Behavior

### Breakpoints

The practical tiers observed across all three templates:

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | ≤ 600px | Nav collapses to hamburger; hero display drops to ~56-72px; cards stack 1-up |
| Mobile Large | 601-767px | Hero display ~72-90px; cards still stack 1-up |
| Tablet | 768-1023px | Nav re-expands; cards grid 2-up; hero display ~90-120px |
| Laptop | 1024-1199px | Full nav; cards 3-up; hero display ~120-144px |
| Desktop | 1200-1439px | Standard editorial layout; cards 3-up or 4-up |
| Wide | ≥ 1440px | Content caps at 1440px; outer canvas padding grows |

### Touch Targets

All interactive controls meet a 44×44px minimum on mobile. Icon buttons use 40×40px circular hit areas which expand with 4px invisible padding on touch devices. Primary CTA buttons land at approximately 48×48px on mobile (16px top/bottom + text line for pills; 12px + text line for rectangles).

### Collapsing Strategy

- **Nav**: horizontal links collapse into a hamburger at 768px; the logo stays left-aligned at all widths
- **Card grid**: 4-up → 3-up at 1200px → 2-up at 768px → 1-up at 600px, with gutters shrinking from 24px to 16px
- **Hero display type**: step-reduces through 144 → 126 → 90 → 72 → 56px as viewports shrink
- **Section padding**: 96px vertical at desktop, 64px at tablet, 48px at mobile
- **Red divider bands**: remain full-width at every breakpoint; their vertical height compresses from ~80px at desktop to ~40px at mobile
- **Institutional panels (share ticker / world map)**: on mobile, multi-column content restacks into a single vertical stream but the charcoal surface stays edge-to-edge
- **Vertically-rotated "IMPACT" wordmark**: becomes a horizontal label or is dropped entirely on mobile where vertical space is limited

### Image Behavior

- Hero imagery: art-directed variant at mobile (tighter crop) versus desktop (wide atmospheric frame)
- Card thumbnails: always 16:9 regardless of viewport; \`loading="lazy"\` is standard
- Circular portraits: fixed at 80-120px diameter on desktop, shrinking to 64-80px on mobile
- Logo: fixed at 40×40px across breakpoints (consistent brand mark size)`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vodafone - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/vodafone: bright red telecom clarity balanced by white service surfaces and practical controls."
    />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f4f4f4;
        --surface-warm: #fff1f1;
        --fg: #1f1f1f;
        --fg-2: #4a4d4e;
        --muted: #6f7375;
        --meta: #a61218;
        --border: #d8d8d8;
        --border-soft: #eeeeee;
        --accent: #e60000;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #008a00;
        --warn: #f5b400;
        --danger: #bd0000;
        --font-display: "Vodafone", "Vodafone Rg", Arial, sans-serif;
        --font-body: "Vodafone", "Vodafone Rg", Arial, sans-serif;
        --font-mono: ui-monospace, "SF Mono", Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 48px;
        --text-4xl: 68px;
        --leading-body: 1.48;
        --leading-tight: 1.08;
        --tracking-display: -0.015em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 96px;
        --section-y-tablet: 68px;
        --section-y-phone: 48px;
        --radius-sm: 8px;
        --radius-md: 16px;
        --radius-lg: 24px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 18px 44px rgba(0, 0, 0, 0.12);
        --focus-ring: 0 0 0 4px rgba(230, 0, 0, 0.22);
        --motion-fast: 150ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1200px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        min-height: 100vh;
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }
      .page {
        min-height: 100vh;
        background: linear-gradient(135deg, #e60000 0%, #a61218 100%);
      }
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h1 { max-width: 820px; font-size: var(--text-4xl); font-weight: 700; }
      h2 { font-size: var(--text-3xl); font-weight: 650; }
      h3 { font-size: var(--text-xl); font-weight: 650; }
      .eyebrow {
        color: var(--meta);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .lead {
        max-width: 620px;
        color: var(--fg-2);
        font-size: var(--text-lg);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: var(--space-8);
        align-items: center;
      }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 var(--space-5);
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        font: 700 var(--text-sm) / 1 var(--font-body);
        text-decoration: none;
        cursor: pointer;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface); color: var(--fg); border-color: var(--border); box-shadow: var(--elev-ring); }
      .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
      .panel {
        background: color-mix(in oklab, var(--surface), transparent 4%);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised);
        overflow: hidden;
      }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-5);
        border-bottom: 1px solid var(--border-soft);
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--meta);
        font: 700 var(--text-xs) / 1 var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .status::before {
        width: 8px;
        height: 8px;
        border-radius: var(--radius-pill);
        background: var(--success);
        content: "";
      }
      .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-bottom: 1px solid var(--border-soft);
      }
      .metric {
        padding: var(--space-5);
        border-right: 1px solid var(--border-soft);
      }
      .metric:last-child { border-right: 0; }
      .metric strong {
        display: block;
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        line-height: var(--leading-tight);
      }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .card-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        padding: var(--space-5);
      }
      .mini-card {
        min-height: 148px;
        padding: var(--space-5);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        background: var(--surface-warm);
      }
      .mini-card p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      .swatches {
        display: flex;
        gap: var(--space-2);
        margin-block-start: var(--space-4);
      }
      .swatch {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
      }
      .swatch.accent { background: var(--accent); }
      .swatch.surface { background: var(--surface); }
      .swatch.warm { background: var(--surface-warm); }
      .swatch.fg { background: var(--fg); }
      .field {
        display: grid;
        gap: var(--space-2);
        margin-block-start: var(--space-5);
      }
      label { color: var(--fg-2); font-size: var(--text-sm); font-weight: 700; }
      input {
        width: 100%;
        min-height: 46px;
        padding: 0 var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--surface);
        color: var(--fg);
        font: inherit;
      }
      input:focus { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }
      .lower {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .tile {
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .tile p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      @media (max-width: 860px) {
        .hero, .lower { grid-template-columns: 1fr; }
        .metric-grid, .card-row { grid-template-columns: 1fr; }
        .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); }
        .metric:last-child { border-bottom: 0; }
      }
    </style>
  <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">Vodafone design system</p>
            <h1>Connected service hub</h1>
            <p class="lead">High-contrast red, direct consumer utility, and rounded service cards.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary red service CTA</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Vodafone component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>rounded utility card</h3>
              </div>
              <span class="status">online</span>
            </div>
            <div class="metric-grid">
              <div class="metric"><strong>98%</strong><span>Signal quality</span></div>
              <div class="metric"><strong>24</strong><span>Active flows</span></div>
              <div class="metric"><strong>3.2s</strong><span>Response time</span></div>
            </div>
            <div class="card-row">
              <div class="mini-card">
                <h3>Palette</h3>
                <p>bright red telecom clarity balanced by white service surfaces and practical controls.</p>
                <div class="swatches" aria-label="Token swatches">
                  <span class="swatch accent"></span>
                  <span class="swatch surface"></span>
                  <span class="swatch warm"></span>
                  <span class="swatch fg"></span>
                </div>
              </div>
              <div class="mini-card">
                <h3>Control</h3>
                <p>Focus, hover, and status states share the same brand signal.</p>
                <div class="field">
                  <label for="vodafone-input">Reference input</label>
                  <input id="vodafone-input" value="Vodafone system token" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section>
        <div class="container lower">
          <article class="tile">
            <p class="eyebrow">Typography</p>
            <h2>Display rhythm</h2>
            <p>Headlines use the brand display stack with the declared scale and leading.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Surface</p>
            <h2>Layer system</h2>
            <p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Interaction</p>
            <h2>Motion states</h2>
            <p>Buttons, inputs, and panels use brand-specific focus rings and easing.</p>
          </article>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=vodafone_default;return module.exports}});
//# sourceMappingURL=client.vodafone.js.map