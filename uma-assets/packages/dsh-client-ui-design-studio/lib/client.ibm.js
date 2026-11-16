
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.ibm.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var ibm_default={"contract":`## 1. Visual Theme & Atmosphere

IBM's website is the digital embodiment of enterprise authority built on the Carbon Design System — a design language so methodically structured it reads like an engineering specification rendered as a webpage. The page operates on a stark duality: a bright white (\`#ffffff\`) canvas with near-black (\`#161616\`) text, punctuated by a single, unwavering accent — IBM Blue 60 (\`#0f62fe\`). This isn't playful tech-startup minimalism; it's corporate precision distilled into pixels. Every element exists within Carbon's rigid 2x grid, every color maps to a semantic token, every spacing value snaps to the 8px base unit.

The IBM Plex type family is the system's backbone. IBM Plex Sans at light weight (300) for display headlines creates an unexpectedly airy, almost delicate quality at large sizes — a deliberate counterpoint to IBM's corporate gravity. At body sizes, regular weight (400) with 0.16px letter-spacing on 14px captions introduces the meticulous micro-tracking that makes Carbon text feel engineered rather than designed. IBM Plex Mono serves code, data, and technical labels, completing the family trinity alongside the rarely-surfaced IBM Plex Serif.

What defines IBM's visual identity beyond monochrome-plus-blue is the reliance on Carbon's component token system. Every interactive state maps to a CSS custom property prefixed with \`--cds-\` (Carbon Design System). Buttons don't have hardcoded colors; they reference \`--cds-button-primary\`, \`--cds-button-primary-hover\`, \`--cds-button-primary-active\`. This tokenized architecture means the entire visual layer is a thin skin over a deeply systematic foundation — the design equivalent of a well-typed API.

**Key Characteristics:**
- IBM Plex Sans at weight 300 (Light) for display — corporate gravitas through typographic restraint
- IBM Plex Mono for code and technical content with consistent 0.16px letter-spacing at small sizes
- Single accent color: IBM Blue 60 (\`#0f62fe\`) — every interactive element, every CTA, every link
- Carbon token system (\`--cds-*\`) driving all semantic colors, enabling theme-switching at the variable level
- 8px spacing grid with strict adherence — no arbitrary values, everything aligns
- Flat, borderless cards on \`#f4f4f4\` Gray 10 surface — depth through background-color layering, not shadows
- Bottom-border inputs (not boxed) — the signature Carbon form pattern
- 0px border-radius on primary buttons — unapologetically rectangular, no softening

## 4. Component Stylings

### Buttons

**Primary Button (Blue)**
- Background: \`#0f62fe\` (Blue 60) → \`--cds-button-primary\`
- Text: \`#ffffff\` (White)
- Padding: 14px 63px 14px 15px (asymmetric — room for trailing icon)
- Border: 1px solid transparent
- Border-radius: 0px (sharp rectangle — the Carbon signature)
- Height: 48px (default), 40px (compact), 64px (expressive)
- Hover: \`#0353e9\` (Blue 60 Hover) → \`--cds-button-primary-hover\`
- Active: \`#002d9c\` (Blue 80) → \`--cds-button-primary-active\`
- Focus: \`2px solid #0f62fe\` inset + \`1px solid #ffffff\` inner

**Secondary Button (Gray)**
- Background: \`#393939\` (Gray 80)
- Text: \`#ffffff\`
- Hover: \`#4c4c4c\` (Gray 70)
- Active: \`#6f6f6f\` (Gray 60)
- Same padding/radius as primary

**Tertiary Button (Ghost Blue)**
- Background: transparent
- Text: \`#0f62fe\` (Blue 60)
- Border: 1px solid \`#0f62fe\`
- Hover: \`#0353e9\` text + Blue 10 background tint
- Border-radius: 0px

**Ghost Button**
- Background: transparent
- Text: \`#0f62fe\` (Blue 60)
- Padding: 14px 16px
- Border: none
- Hover: \`#e8e8e8\` background tint

**Danger Button**
- Background: \`#da1e28\` (Red 60)
- Text: \`#ffffff\`
- Hover: \`#b81921\` (Red 70)

### Cards & Containers
- Background: \`#ffffff\` on white theme, \`#f4f4f4\` (Gray 10) for elevated cards
- Border: none (flat design — no border or shadow on most cards)
- Border-radius: 0px (matching the rectangular button aesthetic)
- Hover: background shifts to \`#e8e8e8\` (Gray 10 Hover) for clickable cards
- Content padding: 16px
- Separation: background-color layering (white → gray 10 → white) rather than shadows

### Inputs & Forms
- Background: \`#f4f4f4\` (Gray 10) — \`--cds-field\`
- Text: \`#161616\` (Gray 100)
- Padding: 0px 16px (horizontal only)
- Height: 40px (default), 48px (large)
- Border: none on sides/top — \`2px solid transparent\` bottom
- Bottom-border active: \`2px solid #161616\` (Gray 100)
- Focus: \`2px solid #0f62fe\` (Blue 60) bottom-border — \`--cds-focus\`
- Error: \`2px solid #da1e28\` (Red 60) bottom-border
- Label: 12px IBM Plex Sans, 0.32px letter-spacing, Gray 70
- Helper text: 12px, Gray 60
- Placeholder: Gray 60 (\`#6f6f6f\`)
- Border-radius: 0px (top) — inputs are sharp-cornered

### Navigation
- Background: \`#161616\` (Gray 100) — full-width dark masthead
- Height: 48px
- Logo: IBM 8-bar logo, white on dark, left-aligned
- Links: 14px IBM Plex Sans, weight 400, \`#c6c6c6\` (Gray 30) default
- Link hover: \`#ffffff\` text
- Active link: \`#ffffff\` with bottom-border indicator
- Platform switcher: left-aligned horizontal tabs
- Search: icon-triggered slide-out search field
- Mobile: hamburger with left-sliding panel

### Links
- Default: \`#0f62fe\` (Blue 60) with no underline
- Hover: \`#0043ce\` (Blue 70) with underline
- Visited: remains Blue 60 (no visited state change)
- Inline links: underlined by default in body copy

### Distinctive Components

**Content Block (Hero/Feature)**
- Full-width alternating white/gray-10 background bands
- Headline left-aligned with 60px or 48px display type
- CTA as blue primary button with arrow icon
- Image/illustration right-aligned or below on mobile

**Tile (Clickable Card)**
- Background: \`#f4f4f4\` or \`#ffffff\`
- Full-width bottom-border or background-shift hover
- Arrow icon bottom-right on hover
- No shadow — flatness is the identity

**Tag / Label**
- Background: contextual color at 10% opacity (e.g., Blue 10, Red 10)
- Text: corresponding 60-grade color
- Padding: 4px 8px
- Border-radius: 24px (pill — exception to the 0px rule)
- Font: 12px weight 400

**Notification Banner**
- Full-width bar, typically Blue 60 or Gray 100 background
- White text, 14px
- Close/dismiss icon right-aligned

## 5. Layout Principles

### Spacing System
- Base unit: 8px (Carbon 2x grid)
- Component spacing scale: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px
- Layout spacing scale: 16px, 24px, 32px, 48px, 64px, 80px, 96px, 160px
- Mini unit: 8px (smallest usable spacing)
- Padding within components: typically 16px
- Gap between cards/tiles: 1px (hairline) or 16px (standard)

### Grid & Container
- 16-column grid (Carbon's 2x grid system)
- Max content width: 1584px (max breakpoint)
- Column gutters: 32px (16px on mobile)
- Margin: 16px (mobile), 32px (tablet+)
- Content typically spans 8-12 columns for readable line lengths
- Full-bleed sections alternate with contained content

### Whitespace Philosophy
- **Functional density**: Carbon favors productive density over expansive whitespace. Sections are tightly packed compared to consumer design systems — this reflects IBM's enterprise DNA.
- **Background-color zoning**: Instead of massive padding between sections, IBM uses alternating background colors (white → gray 10 → white) to create visual separation with minimal vertical space.
- **Consistent 48px rhythm**: Major section transitions use 48px vertical spacing. Hero sections may use 80px–96px.

### Border Radius Scale
- **0px**: Primary buttons, inputs, tiles, cards — the dominant treatment. Carbon is fundamentally rectangular.
- **2px**: Occasionally on small interactive elements (tags)
- **24px**: Tags/labels (pill shape — the sole rounded exception)
- **50%**: Avatar circles, icon containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, \`#ffffff\` background | Default page surface |
| Layer 01 | No shadow, \`#f4f4f4\` background | Cards, tiles, alternating sections |
| Layer 02 | No shadow, \`#e0e0e0\` background | Elevated panels within Layer 01 |
| Raised | \`0 2px 6px rgba(0,0,0,0.3)\` | Dropdowns, tooltips, overflow menus |
| Overlay | \`0 2px 6px rgba(0,0,0,0.3)\` + dark scrim | Modal dialogs, side panels |
| Focus | \`2px solid #0f62fe\` inset + \`1px solid #ffffff\` | Keyboard focus ring |
| Bottom-border | \`2px solid #161616\` on bottom edge | Active input, active tab indicator |

**Shadow Philosophy**: Carbon is deliberately shadow-averse. IBM achieves depth primarily through background-color layering — stacking surfaces of progressively darker grays rather than adding box-shadows. This creates a flat, print-inspired aesthetic where hierarchy is communicated through color value, not simulated light. Shadows are reserved exclusively for floating elements (dropdowns, tooltips, modals) where the element genuinely overlaps content. This restraint gives the rare shadow meaningful impact — when something floats in Carbon, it matters.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small (sm) | 320px | Single column, hamburger nav, 16px margins |
| Medium (md) | 672px | 2-column grids begin, expanded content |
| Large (lg) | 1056px | Full navigation visible, 3-4 column grids |
| X-Large (xlg) | 1312px | Maximum content density, wide layouts |
| Max | 1584px | Maximum content width, centered with margins |

### Touch Targets
- Button height: 48px default, minimum 40px (compact)
- Navigation links: 48px row height for touch
- Input height: 40px default, 48px large
- Icon buttons: 48px square touch target
- Mobile menu items: full-width 48px rows

### Collapsing Strategy
- Hero: 60px display → 42px → 32px heading as viewport narrows
- Navigation: full horizontal masthead → hamburger with slide-out panel
- Grid: 4-column → 2-column → single column
- Tiles/cards: horizontal grid → vertical stack
- Images: maintain aspect ratio, max-width 100%
- Footer: multi-column link groups → stacked single column
- Section padding: 48px → 32px → 16px

### Image Behavior
- Responsive images with \`max-width: 100%\`
- Product illustrations scale proportionally
- Hero images may shift from side-by-side to stacked below
- Data visualizations maintain aspect ratio with horizontal scroll on mobile`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>IBM - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/ibm: white Carbon surfaces, square geometry, IBM Plex typography, and a single engineered blue signal."
    />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f4f4f4;
        --surface-warm: #edf5ff;
        --fg: #161616;
        --fg-2: #525252;
        --muted: #6f6f6f;
        --meta: #8d8d8d;
        --border: #c6c6c6;
        --border-soft: #e0e0e0;
        --accent: #0f62fe;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #24a148;
        --warn: #f1c21b;
        --danger: #da1e28;
        --font-display: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
        --font-body: "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif;
        --font-mono: "IBM Plex Mono", "SF Mono", Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 20px;
        --text-2xl: 32px;
        --text-3xl: 42px;
        --text-4xl: 60px;
        --leading-body: 1.5;
        --leading-tight: 1.17;
        --tracking-display: 0;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 96px;
        --section-y-tablet: 72px;
        --section-y-phone: 48px;
        --radius-sm: 0px;
        --radius-md: 0px;
        --radius-lg: 0px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 2px 6px rgba(0, 0, 0, 0.12);
        --focus-ring: 0 0 0 2px #ffffff, 0 0 0 4px #0f62fe;
        --motion-fast: 110ms;
        --motion-base: 180ms;
        --ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
        --container-max: 1312px;
        --container-gutter-desktop: 32px;
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
        background: linear-gradient(135deg, #ffffff 0%, #f4f4f4 52%, #edf5ff 100%);
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
  </head>
  <body>
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">IBM design system</p>
            <h1>Carbon command center</h1>
            <p class="lead">Enterprise products, data modules, and precise blue actions.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary rectangular Carbon action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="IBM component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>grid-aligned module</h3>
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
                <p>white Carbon surfaces, square geometry, IBM Plex typography, and a single engineered blue signal.</p>
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
                  <label for="ibm-input">Reference input</label>
                  <input id="ibm-input" value="IBM system token" />
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
`};exports.default=ibm_default;return module.exports}});
//# sourceMappingURL=client.ibm.js.map