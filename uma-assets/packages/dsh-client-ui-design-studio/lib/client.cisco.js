
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.cisco.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var cisco_default={"contract":`## 1. Visual Theme & Atmosphere

Cisco's current public web presence is enterprise infrastructure rendered with cinematic restraint. The canvas is dark but not pure black: layered navy-charcoal surfaces create depth without resorting to glossy startup gradients. Bright Cisco Blue is used as a precise signal color rather than a wash across the page. The overall impression is "serious global platform" rather than "friendly SaaS app" — large high-confidence headlines, quiet chrome, and product imagery that emphasizes scale, networking, observability, and resilience.

Typography is disciplined and corporate. Cisco's internal and presentation ecosystem points to \`CiscoSansTT\` as the preferred brand face, while the web experience remains compatible with modern grotesk fallbacks. Headings should feel concise and engineered. Body copy should read clearly and directly, not editorially. Geometrically, the system prefers soft pills for calls to action, rounded-but-not-playful cards, and glass-dark navigation shells floating over large atmospheric sections.

What makes Cisco distinct is the combination of **deep infrastructure darkness** with a **single electric trust signal**. Use blue for the moment that matters: primary action, focus, active tab, chart highlight, or key data edge. Let the rest of the interface stay disciplined.

**Key Characteristics:**
- Dark navy-charcoal surfaces instead of flat black
- Cisco Blue (\`#049fd9\`) as the primary signal color
- Restrained neutral system built from grays and pale technical whites
- Enterprise-scale headlines with compact, factual body copy
- Pill CTAs and rounded control shells, but never toy-like UI
- Product and platform imagery should suggest networks, telemetry, and systems at scale
- Motion should feel controlled and infrastructural, not playful

## 4. Component Stylings

### Buttons

**Primary Action Pill**
- Background: Cisco Indigo (\`#005073\`)
- Text: White (\`#ffffff\`)
- Radius: full pill
- Padding: generous horizontal padding, medium vertical height
- Hover: Dark Blue (\`#2b5592\`)
- Active: a darker indigo tone around \`#00364d\`
- Focus ring: 2px outer halo in Status Blue (\`#64bbe3\`) with a 1px white inner keyline on dark surfaces
- Use case: high-priority submit, deploy, or "learn more" action on dark Cisco surfaces

**Signal Outline Pill**
- Background: transparent
- Text: Cisco Blue (\`#049fd9\`) on dark surfaces, Cisco Indigo (\`#005073\`) on light surfaces
- Border: 1.5px Cisco Blue (\`#049fd9\`)
- Radius: full pill
- Hover: blue-tinted surface fill with the text color preserved
- Focus ring: same visible halo pairing as the primary button
- Use case: brand-forward secondary action that keeps Cisco Blue prominent without sacrificing contrast

**Secondary Dark Pill**
- Background: transparent or dark surface
- Text: White or Pale Gray 1
- Border: Dark Gray 2 (\`#58585b\`)
- Radius: full pill
- Purpose: low-noise secondary CTA

### Cards & Containers
- Background: layered dark surface based on \`#39393b\` or a cooler navy-charcoal adaptation
- Border: 1px subtle border using \`#58585b\`
- Radius: 16px to 20px
- Shadow: minimal; depth should come mostly from surface contrast and spacing

### Navigation
- Dark glass-like masthead or shell over a dark hero
- Text: White / Pale Gray 1
- Active state: Cisco Blue underline, chip, or glow
- Navigation should feel like product chrome, not marketing candy

### Data / Product Modules
- Charts and diagrams should use Cisco Blue as primary highlight and keep supporting colors minimal
- Use green/yellow/red only for actual operational meaning
- Dense technical blocks should still preserve breathing room and hierarchy

### Brand-Specific Recipes

**Network Telemetry Card**
- Anatomy: eyebrow label, large metric, delta chip, 12-24h sparkline, quiet footer metadata
- Density: compact but not cramped; 16px-24px padding with clear alignment to chart axes
- States: normal, selected, degraded, critical, loading skeleton
- Brand behavior: use Cisco Blue for the selected edge or sparkline, and semantic colors only for health state

**Topology / Product Diagram Module**
- Anatomy: title, system canvas, node chips, connection lines, side legend
- Visual rule: dark field first, blue path highlight second, all other nodes muted until active
- States: idle overview, hovered path, selected node, degraded route

**Dense Control Panel**
- Anatomy: left nav rail, filter bar, split metric region, log/event table, contextual right rail
- Control sizing: compact 36px inputs are acceptable on desktop, but action buttons remain 44px minimum height
- States: quiet default, blue active filter, clear warning/error escalation

## 5. Layout Principles

### Spacing & Grid
- Base rhythm: 8px
- Common scale: 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
- Prefer wide desktop containers and large sectional spacing
- 12-column desktop layout with generous gutters works well for the brand
- Breakpoints: mobile up to 767px, tablet 768px-1199px, desktop 1200px and above

### Composition
- Alternate expansive hero/outcome sections with denser information bands
- Use asymmetry where it serves product imagery or system diagrams
- Large dark fields with one blue focal point are more on-brand than many small colorful fragments
- On tablet, reduce wide split layouts to 2-column modules and keep telemetry cards in pairs
- On mobile, collapse hero side-by-sides to a single column, stack data panels vertically, and convert dense control rows into progressive disclosure panels
- Navigation should collapse from a full masthead to a compact menu button plus one primary CTA on tablet/mobile

### Accessibility & Responsiveness
- Minimum touch target: 44px by 44px for any tappable control
- Keyboard focus must remain visible on every interactive element via the blue outer halo plus white inner keyline pairing
- Do not rely on hover-only disclosure; show essential state and actions on focus and touch
- Preserve readable line lengths on desktop and avoid more than 3 cards per row on tablet or 1 card per row on small phones

## 6. Motion & Interaction

- Motion should be controlled, smooth, and systems-like
- Use fade, rise, subtle slide, and restrained glow
- Interaction timing: roughly 160ms–260ms for control response, 320ms–500ms for larger section reveals
- Avoid bouncy springs, elastic easing, or playful overshoot
- Respect \`prefers-reduced-motion\`: remove parallax and staged reveals, keep only instant state swaps or short opacity transitions under 120ms`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cisco - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/cisco: navy-charcoal infrastructure surfaces with one electric Cisco Blue signal."
    />
    <style>
      :root {
        --bg: #0f1720;
        --surface: #1b2530;
        --surface-warm: #243447;
        --fg: #ffffff;
        --fg-2: #e8ebf1;
        --muted: #9e9ea2;
        --meta: #64bbe3;
        --border: #58585b;
        --border-soft: rgba(232, 235, 241, 0.14);
        --accent: #049fd9;
        --accent-on: #001923;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #6cc04a;
        --warn: #ffcc00;
        --danger: #cf2030;
        --font-display: "CiscoSansTT", Inter, Arial, sans-serif;
        --font-body: "CiscoSansTT", Inter, Arial, sans-serif;
        --font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 56px;
        --text-4xl: 72px;
        --leading-body: 1.55;
        --leading-tight: 1.05;
        --tracking-display: -0.02em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 104px;
        --section-y-tablet: 76px;
        --section-y-phone: 52px;
        --radius-sm: 12px;
        --radius-md: 20px;
        --radius-lg: 28px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 24px 80px rgba(0, 0, 0, 0.32);
        --focus-ring: 0 0 0 4px rgba(100, 187, 227, 0.32);
        --motion-fast: 160ms;
        --motion-base: 240ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1240px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet: 28px;
        --container-gutter-phone: 20px;
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
        background: radial-gradient(circle at 80% 15%, rgba(4, 159, 217, 0.28), transparent 34%), linear-gradient(135deg, #0f1720 0%, #1b2530 100%);
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
            <p class="eyebrow">Cisco design system</p>
            <h1>Infrastructure operations</h1>
            <p class="lead">Network telemetry, trust signals, and calm enterprise scale.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary rounded trust pill</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Cisco component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>dark telemetry panel</h3>
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
                <p>navy-charcoal infrastructure surfaces with one electric Cisco Blue signal.</p>
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
                  <label for="cisco-input">Reference input</label>
                  <input id="cisco-input" value="Cisco system token" />
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
`};exports.default=cisco_default;return module.exports}});
//# sourceMappingURL=client.cisco.js.map