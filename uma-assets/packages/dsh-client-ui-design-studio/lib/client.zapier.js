
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.zapier.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var zapier_default={"contract":`## 1. Visual Theme & Atmosphere

Zapier's website radiates warm, approachable professionalism. It rejects the cold monochrome minimalism of developer tools in favor of a cream-tinted canvas (\`#fffefb\`) that feels like unbleached paper -- the digital equivalent of a well-organized notebook. The near-black (\`#201515\`) text has a faint reddish-brown warmth, creating an atmosphere more human than mechanical. This is automation designed to feel effortless, not technical.

The typographic system is a deliberate interplay of two distinct personalities. **Degular Display** -- a geometric, wide-set display face -- handles hero-scale headlines at 56-80px with medium weight (500) and extraordinarily tight line-heights (0.90), creating headlines that compress vertically like stacked blocks. **Inter** serves as the workhorse for everything else, from section headings to body text and navigation, with fallbacks to Helvetica and Arial. **GT Alpina**, an elegant thin-weight serif with aggressive negative letter-spacing (-1.6px to -1.92px), makes occasional appearances for softer editorial moments. This three-font system gives Zapier the ability to shift register -- from bold and punchy (Degular) to clean and functional (Inter) to refined and literary (GT Alpina).

The brand's signature orange (\`#ff4f00\`) is unmistakable -- a vivid, saturated red-orange that sits precisely between traffic-cone urgency and sunset warmth. It's used sparingly but decisively: primary CTA buttons, active state underlines, and accent borders. Against the warm cream background, this orange creates a color relationship that feels energetic without being aggressive.

**Key Characteristics:**
- Warm cream canvas (\`#fffefb\`) instead of pure white -- organic, paper-like warmth
- Near-black with reddish undertone (\`#201515\`) -- text that breathes rather than dominates
- Degular Display for hero headlines at 0.90 line-height -- compressed, impactful, modern
- Inter as the universal UI font across all functional typography
- GT Alpina for editorial accents -- thin-weight serif with extreme negative tracking
- Zapier Orange (\`#ff4f00\`) as the single accent -- vivid, warm, sparingly applied
- Warm neutral palette: borders (\`#c5c0b1\`), muted text (\`#939084\`), surface tints (\`#eceae3\`)
- 8px base spacing system with generous padding on CTAs (20px 24px)
- Border-forward design: \`1px solid\` borders in warm grays define structure over shadows

## 4. Component Stylings

### Buttons

**Primary Orange**
- Background: \`#ff4f00\`
- Text: \`#fffefb\`
- Padding: 8px 16px
- Radius: 4px
- Border: \`1px solid #ff4f00\`
- Use: Primary CTA ("Start free with email", "Sign up free")

**Primary Dark**
- Background: \`#201515\`
- Text: \`#fffefb\`
- Padding: 20px 24px
- Radius: 8px
- Border: \`1px solid #201515\`
- Hover: background shifts to \`#c5c0b1\`, text to \`#201515\`
- Use: Large secondary CTA buttons

**Light / Ghost**
- Background: \`#eceae3\`
- Text: \`#36342e\`
- Padding: 20px 24px
- Radius: 8px
- Border: \`1px solid #c5c0b1\`
- Hover: background shifts to \`#c5c0b1\`, text to \`#201515\`
- Use: Tertiary actions, filter buttons

**Pill Button**
- Background: \`#fffefb\`
- Text: \`#36342e\`
- Padding: 0px 16px
- Radius: 20px
- Border: \`1px solid #c5c0b1\`
- Use: Tag-like selections, filter pills

**Overlay Semi-transparent**
- Background: \`rgba(45, 45, 46, 0.5)\`
- Text: \`#fffefb\`
- Radius: 20px
- Hover: background becomes fully opaque \`#2d2d2e\`
- Use: Video play buttons, floating actions

**Tab / Navigation (Inset Shadow)**
- Background: transparent
- Text: \`#201515\`
- Padding: 12px 16px
- Shadow: \`rgb(255, 79, 0) 0px -4px 0px 0px inset\` (active orange underline)
- Hover shadow: \`rgb(197, 192, 177) 0px -4px 0px 0px inset\` (sand underline)
- Use: Horizontal tab navigation

### Cards & Containers
- Background: \`#fffefb\`
- Border: \`1px solid #c5c0b1\` (warm sand border)
- Radius: 5px (standard), 8px (featured)
- No shadow elevation by default -- borders define containment
- Hover: subtle border color intensification

### Inputs & Forms
- Background: \`#fffefb\`
- Text: \`#201515\`
- Border: \`1px solid #c5c0b1\`
- Radius: 5px
- Focus: border color shifts to \`#ff4f00\` (orange)
- Placeholder: \`#939084\`

### Navigation
- Clean horizontal nav on cream background
- Zapier logotype left-aligned, 104x28px
- Links: Inter 16px weight 500, \`#201515\` text
- CTA: Orange button ("Start free with email")
- Tab navigation uses inset box-shadow underline technique
- Mobile: hamburger collapse

### Image Treatment
- Product screenshots with \`1px solid #c5c0b1\` border
- Rounded corners: 5-8px
- Dashboard/workflow screenshots prominent in feature sections
- Light gradient backgrounds behind hero content

### Distinctive Components

**Workflow Integration Cards**
- Display connected app icons in pairs
- Arrow or connection indicator between apps
- Sand border containment
- Inter weight 500 for app names

**Stat Counter**
- Large display number using Inter 48px weight 500
- Muted description below in \`#36342e\`
- Used for social proof metrics

**Social Proof Icons**
- Circular icon buttons: 14px radius
- Sand border: \`1px solid #c5c0b1\`
- Used for social media follow links in footer

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 72px
- CTA buttons use generous padding: 20px 24px for large, 8px 16px for standard
- Section padding: 64px-80px vertical

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with large top padding
- Feature sections: 2-3 column grids for integration cards
- Full-width sand-bordered dividers between sections
- Footer: multi-column dark background (\`#201515\`)

### Whitespace Philosophy
- **Warm breathing room**: Generous vertical spacing between sections (64px-80px), but content areas are relatively dense -- Zapier packs information efficiently within its cream canvas.
- **Architectural compression**: Degular Display headlines at 0.90 line-height compress vertically, contrasting with the open spacing around them.
- **Section rhythm**: Cream background throughout, with sections separated by sand-colored borders rather than background color changes.

### Border Radius Scale
- Tight (3px): Small inline spans
- Standard (4px): Buttons (orange CTA), tags, small elements
- Content (5px): Cards, links, general containers
- Comfortable (8px): Featured cards, large buttons, tabs
- Social (14px): Social icon buttons, pill-like elements
- Pill (20px): Play buttons, large pill buttons, floating actions

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Bordered (Level 1) | \`1px solid #c5c0b1\` | Standard cards, containers, inputs |
| Strong Border (Level 1b) | \`1px solid #36342e\` | Dark dividers, emphasized sections |
| Active Tab (Level 2) | \`rgb(255, 79, 0) 0px -4px 0px 0px inset\` | Active tab underline (orange) |
| Hover Tab (Level 2b) | \`rgb(197, 192, 177) 0px -4px 0px 0px inset\` | Hover tab underline (sand) |
| Focus (Accessibility) | \`1px solid #ff4f00\` outline | Focus ring on interactive elements |

**Shadow Philosophy**: Zapier deliberately avoids traditional shadow-based elevation. Structure is defined almost entirely through borders -- warm sand (\`#c5c0b1\`) borders for standard containment, dark charcoal (\`#36342e\`) borders for emphasis. The only shadow-like technique is the inset box-shadow used for tab underlines, where a \`0px -4px 0px 0px inset\` shadow creates a bottom-bar indicator. This border-first approach keeps the design grounded and tangible rather than floating.

### Decorative Depth
- Orange inset underline on active tabs creates visual "weight" at the bottom of elements
- Sand hover underlines provide preview states without layout shifts
- No background gradients in main content -- the cream canvas is consistent
- Footer uses full dark background (\`#201515\`) for contrast reversal

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <450px | Tight single column, reduced hero text |
| Mobile | 450-600px | Standard mobile, stacked layout |
| Mobile Large | 600-640px | Slight horizontal breathing room |
| Tablet Small | 640-680px | 2-column grids begin |
| Tablet | 680-768px | Card grids expand |
| Tablet Large | 768-991px | Full card grids, expanded padding |
| Desktop Small | 991-1024px | Desktop layout initiates |
| Desktop | 1024-1280px | Full layout, maximum content width |
| Large Desktop | >1280px | Centered with generous margins |

### Touch Targets
- Large CTA buttons: 20px 24px padding (comfortable 60px+ height)
- Standard buttons: 8px 16px padding
- Navigation links: 16px weight 500 with adequate spacing
- Social icons: 14px radius circular buttons
- Tab items: 12px 16px padding

### Collapsing Strategy
- Hero: Degular 80px display scales to 40-56px on smaller screens
- Navigation: horizontal links + CTA collapse to hamburger menu
- Feature cards: 3-column grid to 2-column to single-column stacked
- Integration workflow illustrations: maintain aspect ratio, may simplify
- Footer: multi-column dark section collapses to stacked
- Section spacing: 64-80px reduces to 40-48px on mobile

### Image Behavior
- Product screenshots maintain sand border treatment at all sizes
- Integration app icons maintain fixed sizes within responsive containers
- Hero illustrations scale proportionally
- Full-width sections maintain edge-to-edge treatment`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Zapier - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/zapier: warm automation workspace with off-white canvas, orange connectors, and approachable cards."
    />
    <style>
      :root {
        --bg: #fff7ed;
        --surface: #ffffff;
        --surface-warm: #ffedd5;
        --fg: #2d2a26;
        --fg-2: #574f45;
        --muted: #7c6f64;
        --meta: #ff4f00;
        --border: #eadfd3;
        --border-soft: #f4eadf;
        --accent: #ff4f00;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #15803d;
        --warn: #d97706;
        --danger: #dc2626;
        --font-display: "Degular", Inter, system-ui, sans-serif;
        --font-body: "Inter", system-ui, sans-serif;
        --font-mono: "Roboto Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 52px;
        --text-4xl: 72px;
        --leading-body: 1.5;
        --leading-tight: 1.02;
        --tracking-display: -0.025em;
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
        --radius-md: 12px;
        --radius-lg: 20px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 18px 44px rgba(45, 42, 38, 0.12);
        --focus-ring: 0 0 0 4px rgba(255, 79, 0, 0.24);
        --motion-fast: 140ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1160px;
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
        background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 58%, #ffffff 100%);
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
            <p class="eyebrow">Zapier design system</p>
            <h1>Automation builder</h1>
            <p class="lead">Friendly workflow blocks, orange actions, and practical productivity rhythm.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary orange automation button</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Zapier component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>workflow step card</h3>
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
                <p>warm automation workspace with off-white canvas, orange connectors, and approachable cards.</p>
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
                  <label for="zapier-input">Reference input</label>
                  <input id="zapier-input" value="Zapier system token" />
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
`};exports.default=zapier_default;return module.exports}});
//# sourceMappingURL=client.zapier.js.map