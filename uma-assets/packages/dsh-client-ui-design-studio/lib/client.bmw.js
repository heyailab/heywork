
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.bmw.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var bmw_default={"contract":`## 1. Visual Theme & Atmosphere

BMW's website is automotive engineering made visual — a design system that communicates precision, performance, and German industrial confidence. The page alternates between deep dark hero sections (featuring full-bleed automotive photography) and clean white content areas, creating a cinematic rhythm reminiscent of a luxury car showroom where vehicles are lit against darkness. The BMW CI2020 design language (their corporate identity refresh) defines every element.

The typography is built on BMWTypeNextLatin — a proprietary typeface in two variants: BMWTypeNextLatin Light (weight 300) for massive uppercase display headings, and BMWTypeNextLatin Regular for body and UI text. The 60px uppercase headline at weight 300 is the defining typographic gesture — light-weight type that whispers authority rather than shouting it. The fallback stack includes Helvetica and Japanese fonts (Hiragino, Meiryo), reflecting BMW's global presence.

What makes BMW distinctive is its CSS variable-driven theming system. Context-aware variables (\`--site-context-highlight-color: #1c69d4\`, \`--site-context-focus-color: #0653b6\`, \`--site-context-metainfo-color: #757575\`) suggest a design system built for multi-brand, multi-context deployment where colors can be swapped globally. The blue highlight color (\`#1c69d4\`) is BMW's signature blue — used sparingly for interactive elements and focus states, never decoratively. Zero border-radius was detected — BMW's design is angular, sharp-cornered, and uncompromisingly geometric.

**Key Characteristics:**
- BMWTypeNextLatin Light (weight 300) uppercase for display — whispered authority
- BMW Blue (\`#1c69d4\`) as singular accent — used only for interactive elements
- Zero border-radius detected — angular, sharp-cornered, industrial geometry
- Dark hero photography + white content sections — showroom lighting rhythm
- CSS variable-driven theming: \`--site-context-*\` tokens for brand flexibility
- Weight 900 for navigation emphasis — extreme contrast with 300 display
- Tight line-heights (1.15–1.30) throughout — compressed, efficient, German engineering
- Full-bleed automotive photography as primary visual content

## 4. Component Stylings

### Buttons
- Text: 16px BMWTypeNextLatin, weight 700 for primary, 400 for secondary
- Line-height: 1.15–2.88 (large variation suggests padding-driven sizing)
- Border: white bottom-border on dark surfaces (\`1px solid #ffffff\`)
- No border-radius — sharp rectangular buttons

### Cards & Containers
- No border-radius — all containers are sharp-cornered rectangles
- White backgrounds on light sections
- Dark backgrounds for hero/feature sections
- No visible borders on most elements

### Navigation
- BMWTypeNextLatin 18px weight 900 for primary nav links
- White text on dark header
- BMW logo 54x54px
- Hover: remains white, text-decoration none
- "Home" text link in header

### Image Treatment
- Full-bleed automotive photography
- Dark cinematic lighting
- Edge-to-edge hero images
- Car photography as primary visual content

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 5px, 8px, 10px, 12px, 15px, 16px, 20px, 24px, 30px, 32px, 40px, 45px, 56px, 60px

### Grid & Container
- Full-width hero photography
- Centered content sections
- Footer: multi-column link grid

### Whitespace Philosophy
- **Showroom pacing**: Dark hero sections with generous padding create the feeling of walking through a showroom where each vehicle is spotlit in its own space.
- **Compressed content**: Body text areas use tight line-heights and compact spacing — information-dense, no waste.

### Border Radius Scale
- **None detected.** BMW uses sharp corners exclusively — every element is a precise rectangle. This is the most angular design system analyzed.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Photography (Level 0) | Full-bleed dark imagery | Hero backgrounds |
| Flat (Level 1) | White surface, no shadow | Content sections |
| Focus (Accessibility) | BMW Focus Blue (\`#0653b6\`) | Focus states |

**Shadow Philosophy**: BMW uses virtually no shadows. Depth is created entirely through the contrast between dark photographic sections and white content sections — the automotive lighting does the elevation work.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <375px | Minimum supported |
| Mobile | 375–480px | Single column |
| Mobile Large | 480–640px | Slight adjustments |
| Tablet Small | 640–768px | 2-column begins |
| Tablet | 768–920px | Standard tablet |
| Desktop Small | 920–1024px | Desktop layout begins |
| Desktop | 1024–1280px | Standard desktop |
| Large Desktop | 1280–1440px | Expanded |
| Ultra-wide | 1440–1600px | Maximum layout |

### Collapsing Strategy
- Hero: 60px → scales down, maintains uppercase
- Navigation: horizontal → hamburger
- Photography: full-bleed maintained at all sizes
- Content sections: stack vertically
- Footer: multi-column → stacked`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BMW — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/bmw. White-and-dark showroom rhythm,
        BMW Blue (#1c69d4) as singular accent, zero border-radius, 60px uppercase display
        in BMWTypeNextLatin Light (weight 300)."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f5f5f5;
        --surface-warm: var(--surface);

        --fg: #262626;
        --fg-2: var(--fg);
        --muted: #757575;
        --meta: #bbbbbb;

        --border: #e0e0e0;
        --border-soft: var(--border);

        --accent: #1c69d4;
        --accent-on: #ffffff;
        --accent-hover: #0653b6;
        --accent-active: color-mix(in oklab, var(--accent), black 18%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "BMWTypeNextLatin Light", Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
        --font-body: BMWTypeNextLatin, Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 44px;
        --text-4xl: 60px;

        --leading-body: 1.15;
        --leading-tight: 1.30;
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
        --section-y-tablet: 64px;
        --section-y-phone: 40px;

        --radius-sm: 0;
        --radius-md: 0;
        --radius-lg: 0;
        --radius-pill: 0;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: none;

        --focus-ring: 0 0 0 2px var(--accent-hover);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1440px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      /* ─── Reset ─────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
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

      /* ─── Typography — weight extremes only (300 / 400 / 700 / 900) ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
      }
      /* Display Hero — BMWTypeNextLatin Light, weight 300, uppercase */
      h1 {
        font-size: var(--text-4xl);
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: var(--tracking-display);
      }
      /* Section Heading — weight 400, sentence case */
      h2 {
        font-size: var(--text-2xl);
        font-weight: 400;
        font-family: var(--font-body);
      }
      /* Card title — weight 400 */
      h3 {
        font-size: var(--text-lg);
        font-weight: 400;
        font-family: var(--font-body);
      }
      p { margin: 0; line-height: var(--leading-body); }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: var(--leading-tight);
        font-weight: 300;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* Eyebrow — weight 900 uppercase, the BMW nav-emphasis weight */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 900;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Hero — full-bleed dark showroom band ──────────────── */
      /* Lit-from-above radial: suggests automotive photography lighting
         without shipping a binary image asset. */
      .hero {
        background:
          radial-gradient(120% 80% at 50% 0%, #1a1a1a 0%, #0a0a0a 55%, #000000 100%);
        color: #ffffff;
        position: relative;
        overflow: hidden;
      }
      .hero::after {
        content: "";
        position: absolute;
        inset: auto 0 0 0;
        height: 1px;
        background: var(--accent);
      }
      .hero .container { position: relative; }
      .hero-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero h1 { color: #ffffff; }
      .hero .lead { color: rgba(255, 255, 255, 0.72); }
      .hero .eyebrow { color: var(--accent); }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-5);
        border-top: 1px solid rgba(255, 255, 255, 0.18);
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.85);
      }
      .hero-meta-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .hero-meta-row dt {
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 900;
        color: rgba(255, 255, 255, 0.6);
      }
      .hero-meta-row dd {
        margin: 0;
        font-size: var(--text-lg);
        font-weight: 300;
        font-variant-numeric: tabular-nums;
      }

      /* ─── Buttons — sharp rectangles, weight 700 ──────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 14px 24px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 700;
        line-height: 1.2;
        cursor: pointer;
        border: 1px solid transparent;
        text-transform: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: BMW Blue solid */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-primary:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
      }
      .btn-primary:active {
        background: var(--accent-active);
        border-color: var(--accent-active);
      }
      /* Secondary on dark surface: ghost with white hairline that solidifies on hover */
      .btn-ghost {
        background: transparent;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.6);
      }
      .btn-ghost:hover {
        background: #ffffff;
        color: var(--fg);
        border-color: #ffffff;
      }
      /* Secondary on light surface: outline dark */
      .btn-outline {
        background: transparent;
        color: var(--fg);
        border-color: var(--fg);
      }
      .btn-outline:hover {
        background: var(--fg);
        color: #ffffff;
      }

      /* ─── Features — 3 cards on white ─────────────────────────── */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        position: relative;
      }
      .card-index {
        font-family: var(--font-display);
        font-weight: 300;
        font-size: var(--text-2xl);
        color: var(--accent);
        line-height: 1;
        letter-spacing: 0;
      }
      .card-link {
        color: var(--accent);
        font-weight: 700;
        font-size: var(--text-sm);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .card-link:hover { color: var(--accent-hover); }
      .card-link:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* ─── Inputs — sharp corners, dark hairline border ───────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-xs);
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--fg);
      }
      .field input {
        padding: 14px 16px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Status pill (uses border-radius: 50% inline; no pill token) ─ */
      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--success);
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        display: inline-block;
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; gap: var(--space-6); }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
        max-width: 480px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        flex-wrap: wrap;
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .divider {
        height: 1px;
        background: var(--border);
        border: 0;
        margin: 0;
      }
      section + section { border-top: 1px solid var(--border); }
      .hero + section { border-top: 0; }
    </style>
  </head>
  <body>
    <!-- ─── Hero — dark showroom band ───────────────────────────── -->
    <section class="hero" data-od-id="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · bmw</p>
            <h1>Sheer driving pleasure.</h1>
            <p class="lead" style="max-width: 56ch">
              The Ultimate Driving Machine, rendered as a design system.
              White-and-dark showroom rhythm, BMW Blue for the moments that
              matter, and every corner cut sharp at exactly ninety degrees.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Vehicle telemetry">
            <div class="hero-meta-row">
              <dt>0 — 100 km/h</dt>
              <dd>3.9 s</dd>
            </div>
            <div class="hero-meta-row">
              <dt>Top speed</dt>
              <dd>250 km/h</dd>
            </div>
            <div class="hero-meta-row">
              <dt>Output</dt>
              <dd>460 kW</dd>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- ─── Features — three cards on white ─────────────────────── -->
    <section data-od-id="features">
      <div class="container">
        <div class="stack-4" style="max-width: 64ch">
          <p class="eyebrow" style="color: var(--accent)">Engineering principles</p>
          <h2>Precision is a discipline, not a finish.</h2>
          <p class="body-muted">
            Every token below maps to a deliberate BMW decision — sharp
            corners, weight extremes, and a single chromatic move.
          </p>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <span class="card-index">01</span>
            <h3>Zero radius, everywhere.</h3>
            <p class="body-muted body-sm">
              --radius-sm, --radius-md, --radius-lg and --radius-pill all
              resolve to 0. Sharp rectangles are the BMW identity; rounded
              corners would soften the engineering posture.
            </p>
            
          </article>
          <article class="card">
            <span class="card-index">02</span>
            <h3>Weight 300 meets weight 900.</h3>
            <p class="body-muted body-sm">
              BMWTypeNextLatin Light whispers at 60px display; weight 900
              shouts in uppercase navigation. The 300↔900 tension is the
              signature typographic gesture — nothing lives in between.
            </p>
            
          </article>
          <article class="card">
            <span class="card-index">03</span>
            <h3>BMW Blue, sparingly applied.</h3>
            <p class="body-muted body-sm">
              #1c69d4 lights up only what is interactive — buttons, links,
              focus rings. The rest of the page stays in pure white, near
              black, and the cinematic dark of the hero band.
            </p>
            
          </article>
        </div>
      </div>
    </section>

    <!-- ─── Form — request a test drive ─────────────────────────── -->
    <section data-od-id="form">
      <div class="container">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Configurator</p>
            <h2>Book a test drive.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs in the BMW system carry the same rules as everything
              else — sharp 0-radius corners, hairline borders, and a focus
              ring drawn in BMW Focus Blue (#0653b6).
            </p>
            <span class="status" aria-live="polite">
              <span class="status-dot" aria-hidden="true"></span>
              Dealer network online
            </span>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" type="text" placeholder="Driver" autocomplete="name" required />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" autocomplete="email" required />
              <p class="field-help">Your local dealer will reply within one business day.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Reserve a slot</button>
              <button type="button" class="btn btn-outline">Browse the range</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
</html>
`};exports.default=bmw_default;return module.exports}});
//# sourceMappingURL=client.bmw.js.map