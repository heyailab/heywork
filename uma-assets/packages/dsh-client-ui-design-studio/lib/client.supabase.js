
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.supabase.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var supabase_default={"contract":`## 1. Visual Theme & Atmosphere

Supabase's website is a dark-mode-native developer platform that channels the aesthetic of a premium code editor — deep black backgrounds (\`#0f0f0f\`, \`#171717\`) with emerald green accents (\`#3ecf8e\`, \`#00c573\`) that reference the brand's open-source, PostgreSQL-green identity. The design system feels like it was born in a terminal window and evolved into a sophisticated marketing surface without losing its developer soul.

The typography is built on "Circular" — a geometric sans-serif with rounded terminals that softens the technical edge. At 72px with a 1.00 line-height, the hero text is compressed to its absolute minimum vertical space, creating dense, impactful statements that waste nothing. The monospace companion (Source Code Pro) appears sparingly for uppercase technical labels with 1.2px letter-spacing, creating the "developer console" markers that connect the marketing site to the product experience.

What makes Supabase distinctive is its sophisticated HSL-based color token system. Rather than flat hex values, Supabase uses HSL with alpha channels for nearly every color (\`--colors-crimson4\`, \`--colors-purple5\`, \`--colors-slateA12\`), enabling a nuanced layering system where colors interact through transparency. This creates depth through translucency — borders at \`rgba(46, 46, 46)\`, surfaces at \`rgba(41, 41, 41, 0.84)\`, and accents at partial opacity all blend with the dark background to create a rich, dimensional palette from minimal color ingredients.

The green accent (\`#3ecf8e\`) appears selectively — in the Supabase logo, in link colors (\`#00c573\`), and in border highlights (\`rgba(62, 207, 142, 0.3)\`) — always as a signal of "this is Supabase" rather than as a decorative element. Pill-shaped buttons (9999px radius) for primary CTAs contrast with standard 6px radius for secondary elements, creating a clear visual hierarchy of importance.

**Key Characteristics:**
- Dark-mode-native: near-black backgrounds (\`#0f0f0f\`, \`#171717\`) — never pure black
- Emerald green brand accent (\`#3ecf8e\`, \`#00c573\`) used sparingly as identity marker
- Circular font — geometric sans-serif with rounded terminals
- Source Code Pro for uppercase technical labels (1.2px letter-spacing)
- HSL-based color token system with alpha channels for translucent layering
- Pill buttons (9999px) for primary CTAs, 6px radius for secondary
- Neutral gray scale from \`#171717\` through \`#898989\` to \`#fafafa\`
- Border system using dark grays (\`#2e2e2e\`, \`#363636\`, \`#393939\`)
- Minimal shadows — depth through border contrast and transparency
- Radix color primitives (crimson, purple, violet, indigo, yellow, tomato, orange, slate)

## 4. Component Stylings

### Buttons

**Primary Pill (Dark)**
- Background: \`#0f0f0f\`
- Text: \`#fafafa\`
- Padding: 8px 32px
- Radius: 9999px (full pill)
- Border: \`1px solid #fafafa\` (white border on dark)
- Focus shadow: \`rgba(0, 0, 0, 0.1) 0px 4px 12px\`
- Use: Primary CTA ("Start your project")

**Secondary Pill (Dark, Muted)**
- Background: \`#0f0f0f\`
- Text: \`#fafafa\`
- Padding: 8px 32px
- Radius: 9999px
- Border: \`1px solid #2e2e2e\` (dark border)
- Opacity: 0.8
- Use: Secondary CTA alongside primary

**Ghost Button**
- Background: transparent
- Text: \`#fafafa\`
- Padding: 8px
- Radius: 6px
- Border: \`1px solid transparent\`
- Use: Tertiary actions, icon buttons

### Cards & Containers
- Background: dark surfaces (\`#171717\` or slightly lighter)
- Border: \`1px solid #2e2e2e\` or \`#363636\`
- Radius: 8px–16px
- No visible shadows — borders define edges
- Internal padding: 16px–24px

### Tabs
- Border: \`1px solid #2e2e2e\`
- Radius: 9999px (pill tabs)
- Active: green accent or lighter surface
- Inactive: dark, muted

### Links
- **Green**: \`#00c573\` — Supabase-branded links
- **Primary Light**: \`#fafafa\` — standard links on dark
- **Secondary**: \`#b4b4b4\` — muted links
- **Muted**: \`#898989\` — tertiary links, footer

### Navigation
- Dark background matching page (\`#171717\`)
- Supabase logo with green icon
- Circular 14px weight 500 for nav links
- Clean horizontal layout with product dropdown
- Green "Start your project" CTA pill button
- Sticky header behavior

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 90px, 96px, 128px
- Notable large jumps: 48px → 90px → 96px → 128px for major section spacing

### Grid & Container
- Centered content with generous max-width
- Full-width dark sections with constrained inner content
- Feature grids: icon-based grids with consistent card sizes
- Logo grids for "Trusted by" sections
- Footer: multi-column on dark background

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Single column, stacked layout |
| Desktop | >600px | Multi-column grids, expanded layout |

*Note: Supabase uses a notably minimal breakpoint system — primarily a single 600px breakpoint, suggesting a mobile-first approach with progressive enhancement.*

### Whitespace Philosophy
- **Dramatic section spacing**: 90px–128px between major sections creates a cinematic pacing — each section is its own scene in the dark void.
- **Dense content blocks**: Within sections, spacing is tight (16px–24px), creating concentrated information clusters.
- **Border-defined space**: Instead of whitespace + shadows for separation, Supabase uses thin borders on dark backgrounds — separation through line, not gap.

### Border Radius Scale
- Standard (6px): Ghost buttons, small elements
- Comfortable (8px): Cards, containers
- Medium (11px–12px): Mid-size panels
- Large (16px): Feature cards, major containers
- Pill (9999px): Primary buttons, tab indicators

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, border \`#2e2e2e\` | Default state, most surfaces |
| Subtle Border (Level 1) | Border \`#363636\` or \`#393939\` | Interactive elements, hover |
| Focus (Level 2) | \`rgba(0, 0, 0, 0.1) 0px 4px 12px\` | Focus states only |
| Green Accent (Level 3) | Border \`rgba(62, 207, 142, 0.3)\` | Brand-highlighted elements |

**Shadow Philosophy**: Supabase deliberately avoids shadows. In a dark-mode-native design, shadows are nearly invisible and serve no purpose. Instead, depth is communicated through a sophisticated border hierarchy — from \`#242424\` (barely visible) through \`#2e2e2e\` (standard) to \`#393939\` (prominent). The green accent border (\`rgba(62, 207, 142, 0.3)\`) at 30% opacity is the "elevated" state — the brand color itself becomes the depth signal.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Single column, stacked features, condensed nav |
| Desktop | >600px | Multi-column grids, full nav, expanded sections |

### Collapsing Strategy
- Hero: 72px → scales down proportionally
- Feature grids: multi-column → single column stacked
- Logo row: horizontal → wrapped grid
- Navigation: full → hamburger
- Section spacing: 90–128px → 48–64px
- Buttons: inline → full-width stacked`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Supabase — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/supabase. Every visible
        value comes from tokens.css. Supabase's signature moves: near-black
        canvas, Postgres-emerald reserved as identity marker, Circular geometric
        sans with weight restraint, Source Code Pro uppercase for the developer-
        console voice, depth carried by a tight border hierarchy."
    />

    <style>
      /* :root paste — sourced verbatim from design-systems/supabase/tokens.css. */
      :root {
        --bg: #171717;
        --surface: #1c1c1c;
        --surface-warm: var(--surface);

        --fg: #fafafa;
        --fg-2: #b4b4b4;
        --muted: #898989;
        --meta: #4d4d4d;

        --border: #2e2e2e;
        --border-soft: #242424;

        --accent: #3ecf8e;
        --accent-on: #0f0f0f;
        --accent-hover: #00c573;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Circular", "custom-font", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body: "Circular", "custom-font", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono: "Source Code Pro", "Office Code Pro", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 36px;
        --text-4xl: 72px;

        --leading-body: 1.5;
        --leading-tight: 1.00;
        --tracking-display: normal;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 128px;
        --section-y-tablet: 80px;
        --section-y-phone: 48px;

        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0 1px var(--border), 0 4px 12px rgba(0, 0, 0, 0.4);

        --focus-ring: 0 0 0 2px color-mix(in oklab, var(--accent), transparent 50%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 16px;
      }

      /* ─── Reset (minimal) ─────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section {
        padding-block: var(--section-y-desktop);
      }
      section + section {
        /* DESIGN.md §6: depth comes from borders, not shadows. Section
           dividers use the standard border tier — a hairline against
           the dark canvas, the brand's "edges define" promise. */
        border-top: 1px solid var(--border);
      }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ────────────────────────────────────────────
       * Weight restraint: 400 for prose, 500 for interactive elements.
       * DESIGN.md §3 Principles: "There is no bold (700) in the
       * detected system — hierarchy is created through size, not
       * weight." Display sizes hold at leading 1.00 (the defining
       * gesture) and tracking \`normal\`; smaller scales relax leading
       * upward as the table in DESIGN.md §3 prescribes. */
      h1, h2, h3, h4 {
        font-family: var(--font-display);
        font-weight: 400;
        margin: 0;
        color: var(--fg);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h1 {
        font-size: var(--text-4xl);
        /* DESIGN.md §3 Display Hero: 72px / 1.00 leading / normal
           tracking — the terminal-density typographic signature. */
      }
      h2 {
        font-size: var(--text-3xl);
        /* DESIGN.md §3 Section Heading: 36px / 1.25 leading.
           Overrides the shared 1.00 set above. */
        line-height: 1.25;
      }
      h3 {
        font-size: var(--text-xl);
        /* DESIGN.md §3 Card Title: 24px / 1.33 leading / -0.16px
           tracking ≈ -0.0067em. The subtle negative tracking is the
           card-title differentiation from body text. */
        line-height: 1.33;
        letter-spacing: -0.0067em;
      }
      h4 {
        font-size: var(--text-lg);
        line-height: 1.56;
      }
      p { margin: 0; }

      .lede {
        font-size: var(--text-base);
        line-height: var(--leading-body);
        color: var(--fg-2);
        max-width: 56ch;
      }
      .body-muted { color: var(--muted); }
      .body-meta { color: var(--meta); font-size: var(--text-sm); }
      .body-sm { font-size: var(--text-sm); }

      /* Eyebrow uses Source Code Pro uppercase — DESIGN.md §3:
         "Source Code Pro in uppercase with 1.2px letter-spacing is
         the 'developer console' voice — used sparingly for technical
         labels that connect to the product experience." 1.2px at
         12px ≈ 0.1em. */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 400;
        line-height: 1.33;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────
       * DESIGN.md §4 + §7: primary CTAs are pills (9999px radius),
       * ghost buttons take the 6px standard radius. The brand
       * deliberately FORBIDS in-between radii on buttons. The
       * primary pill is \`#0f0f0f\` background with \`#fafafa\` text and
       * a white border — the brand's "pill on dark" pattern, NOT
       * \`background: var(--accent)\`. Emerald stays reserved for the
       * brand-pill variant below and for links + focus. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-8);
        border: 1px solid transparent;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1.14;
        cursor: pointer;
        text-decoration: none;
        background: transparent;
        color: inherit;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
      }
      .btn-primary {
        background: #0f0f0f;
        color: var(--fg);
        border-color: var(--fg);
      }
      .btn-primary:hover {
        background: color-mix(in oklab, #0f0f0f, var(--fg) 6%);
      }
      .btn-secondary {
        background: #0f0f0f;
        color: var(--fg);
        border-color: var(--border);
        opacity: 0.92;
      }
      .btn-secondary:hover {
        border-color: color-mix(in oklab, var(--border), var(--fg) 16%);
        opacity: 1;
      }
      /* Brand pill — the one place emerald appears as a button surface.
         Reserved for the single highest-intent CTA per screen so the
         ≤2 accent-uses budget stays honest. */
      .btn-brand {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-brand:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
      }
      .btn-brand:active { background: var(--accent-active); }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-radius: var(--radius-sm);
        padding: var(--space-2) var(--space-3);
        border-color: transparent;
      }
      .btn-ghost:hover {
        background: var(--surface);
      }

      /* ─── Inputs ────────────────────────────────────────────────
       * Border-defined edges (DESIGN.md §6 — no shadows on dark).
       * On focus the border resolves to the brand accent at full
       * saturation, layered with the green focus halo. */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--bg);
        color: var(--fg);
        font-family: inherit;
        font-size: var(--text-sm);
        line-height: 1.43;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { border-color: #393939; }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
      }

      /* ─── Cards ─────────────────────────────────────────────────
       * Border defines the edge (DESIGN.md §4): #2e2e2e at 8px or
       * 16px radius depending on hierarchy. No shadows by default —
       * the hover state introduces the green-accent border for the
       * "brand-highlighted" elevation (DESIGN.md §6 Level 3). */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        transition:
          border-color var(--motion-base) var(--ease-standard),
          background-color var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        border-color: color-mix(in oklab, var(--accent), transparent 70%);
      }

      /* ─── Badges ────────────────────────────────────────────────
       * Pill badges with hairline borders — Supabase uses these for
       * status markers and stage labels. The accent badge tints the
       * brand emerald against the dark surface; the muted badge
       * sits on the standard border tier. */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.33;
        border: 1px solid transparent;
      }
      .badge-accent {
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), var(--bg) 88%);
        border-color: color-mix(in oklab, var(--accent), transparent 70%);
      }
      .badge-muted {
        color: var(--fg-2);
        background: var(--surface);
        border-color: var(--border);
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), var(--bg) 88%);
        border-color: color-mix(in oklab, var(--success), transparent 75%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-pill);
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────────
       * DESIGN.md §4: "Green: #00c573 — Supabase-branded links." We
       * bind link color to the interactive-green variant (which is
       * \`--accent-hover\` in this brand's mapping — see tokens.css §4)
       * because that's the documented interactive .hey-preview-form of the accent. */
      a {
        color: var(--accent-hover);
        text-decoration: none;
        border-bottom: 1px solid color-mix(in oklab, var(--accent-hover), transparent 70%);
        transition:
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard);
      }
      a:hover {
        color: var(--accent);
        border-bottom-color: var(--accent);
      }
      a:focus-visible {
        outline: none;
        border-radius: 2px;
        box-shadow: var(--focus-ring);
      }

      /* ─── Kbd ───────────────────────────────────────────────────
       * Source Code Pro, hairline border edge. Supabase uses kbd
       * marks throughout docs with the same border-defined restraint. */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px var(--space-2);
        border-radius: 4px;
        background: var(--surface);
        color: var(--fg);
        border: 1px solid var(--border);
      }

      /* ─── Code chip (inline) ────────────────────────────────────
       * Source Code Pro at body-adjacent size for inline product
       * references — table names, env vars, function signatures. */
      code.chip {
        font-family: var(--font-mono);
        font-size: 0.92em;
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), var(--bg) 92%);
        padding: 2px var(--space-2);
        border-radius: 4px;
      }

      /* ─── Section-specific layout ─────────────────────────────── */
      .hero {
        position: relative;
        overflow: hidden;
      }
      /* Atmospheric green wash — the single chromatic moment behind
         the hero headline. A radial of \`var(--accent)\` at low opacity
         echoes Supabase's logo-as-canvas treatment without violating
         the ≤2 accent uses budget (the wash is decorative atmosphere,
         not a labeled accent surface). */
      .hero::before {
        content: "";
        position: absolute;
        inset: -20% -10% auto -10%;
        height: 70%;
        background:
          radial-gradient(
            55% 60% at 18% 30%,
            color-mix(in oklab, var(--accent), var(--bg) 70%) 0%,
            var(--bg) 60%
          );
        opacity: 0.55;
        filter: blur(60px);
        z-index: 0;
        pointer-events: none;
      }
      .hero > * { position: relative; z-index: 1; }
      .hero .eyebrow { margin-block-end: var(--space-5); }
      .hero h1 { max-width: 16ch; }
      .hero .lede {
        max-width: 56ch;
        margin-block-start: var(--space-6);
        font-size: var(--text-lg);
        line-height: 1.56;
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-8);
        align-items: center;
        flex-wrap: wrap;
      }
      .hero-meta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        color: var(--muted);
        font-size: var(--text-sm);
        flex-wrap: wrap;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .feature-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--bg);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--accent);
      }
      .feature-icon svg { width: 18px; height: 18px; }

      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 440px;
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        align-items: center;
        flex-wrap: wrap;
      }

      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <main class="container">
      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: radial green wash (the one chromatic
           moment per screen), h1 at 72px Circular weight 400 with
           leading 1.00 (the terminal-density signature), .lede in
           --fg-2, .btn-brand (the emerald pill), .btn-secondary
           (dark pill with hairline border), Source Code Pro eyebrow.
           Hero copy reflects Supabase's "build in a weekend, scale
           to millions" voice — confident, technical, terse.
      ═══════════════════════════════════════════════════════════════ -->
      <section class="hero" data-od-id="hero">
        <p class="eyebrow">// open source · postgres-native</p>
        <h1>Build in a weekend. Scale to millions.</h1>
        <p class="lede">
          Every Supabase project ships with a Postgres database,
          authentication, instant APIs, edge functions, realtime
          subscriptions, and object storage. Start with a
          <code class="chip">create table</code>, deploy with a
          <code class="chip">git push</code>, and let the platform
          carry the load when traffic finds you.
        </p>
        <div class="hero-actions">
          
          
        </div>
        <p class="hero-meta">
          <span class="badge badge-muted">
            <span class="badge-dot" aria-hidden="true" style="color: var(--success)"></span>
            All systems normal
          </span>
          <span>Press <kbd>⌘</kbd> <kbd>K</kbd> to search the docs.</span>
        </p>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURE CARDS — three cards exercising: .card (border-as-
           depth, no shadow), h3 with -0.0067em tracking and 1.33
           leading (DESIGN.md card-title row), .feature-icon (hairline
           bordered square with emerald glyph), .badge-accent (the
           tinted brand-status pill), link bottom-border underline.
           Three cards per row at desktop, collapse to two then one.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <p class="eyebrow">// the stack</p>
        <h2 style="max-width: 26ch; margin-block-start: var(--space-4)">
          The open source backend that grew up.
        </h2>
        <p class="body-muted" style="margin-block-start: var(--space-4); max-width: 56ch">
          One project, six services, all standing on Postgres. Bring
          your own SQL — the rest of the platform speaks your schema.
        </p>

        <div class="features-grid">
          <article class="card">
            <div class="row-between">
              <span class="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="6" rx="8" ry="3" />
                  <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                  <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                </svg>
              </span>
              <span class="badge badge-accent">Postgres 16</span>
            </div>
            <h3>A dedicated database, on day one.</h3>
            <p class="body-muted body-sm">
              Every project gets a fully-managed Postgres instance with
              extensions, point-in-time recovery, and read replicas. The
              <code class="chip">supabase</code> CLI streams migrations
              from <code class="chip">/supabase/migrations</code> straight
              to production.
            </p>
            
          </article>

          <article class="card">
            <div class="row-between">
              <span class="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <span class="badge badge-accent">Row-level</span>
            </div>
            <h3>Auth that respects your schema.</h3>
            <p class="body-muted body-sm">
              Email, OAuth, magic links, and SAML — all writing to a
              <code class="chip">auth.users</code> table you can join
              against. Row-level security policies enforce access in
              the database, not in middleware.
            </p>
            
          </article>

          <article class="card">
            <div class="row-between">
              <span class="feature-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M2 12h20" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Realtime
              </span>
            </div>
            <h3>Subscriptions over your data.</h3>
            <p class="body-muted body-sm">
              Listen to row inserts, updates, and deletes from the
              browser — no extra service, no manual fan-out. Realtime
              streams Postgres' write-ahead log to authorized clients
              over a single WebSocket.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — exercises: .field with border-defined input edges,
           focus-visible swap to the emerald border + green focus
           halo, .btn-brand and .btn-secondary reuse. Form sits in
           its own bordered card with the brand's minimal elev-raised
           shadow so the inputs read as recessed beneath the card.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <p class="eyebrow">// get the launch kit</p>
        <h2 style="margin-block-start: var(--space-4); max-width: 28ch">
          Ship the schema. We'll handle the rest.
        </h2>

        <div class="form-row">
          <div class="stack-4">
            <p class="body-muted" style="max-width: 48ch">
              Inputs, focus rings, and edges all derive from
              <code class="chip">--border</code> and
              <code class="chip">--accent</code>. The primary CTA reuses
              <code class="chip">.btn-brand</code> unchanged — emerald
              fill, near-black label, pill radius. No raw hex anywhere
              in the component CSS.
            </p>
            <p class="body-muted body-sm">
              Press <kbd>Enter</kbd> on the email field to submit. The
              focus halo lands at the documented brand-highlight tint
              (<code class="chip">rgba(62, 207, 142, 0.5)</code>) —
              visible against the canvas without dominating the page.
            </p>
            <p class="body-meta">
              Full reference at  ·
              spec at .
            </p>
          </div>

          <div role="group" class="hey-preview-form form">
            <div class="row-between">
              <p class="eyebrow">// launch kit</p>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Open
              </span>
            </div>
            <div class="field">
              <label for="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="you@team.dev"
                autocomplete="email"
                required
              />
              <p class="field-help">
                We'll send the starter repo and a Postgres schema you
                can <code class="chip">supabase db push</code> on day one.
              </p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-brand">
                Send the kit
              </button>
              <button type="button" class="btn btn-ghost">
                Browse the docs
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=supabase_default;return module.exports}});
//# sourceMappingURL=client.supabase.js.map