
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.composio.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var composio_default={"contract":`## 1. Visual Theme & Atmosphere

Composio's interface is a nocturnal command center — a dense, developer-focused darkness punctuated by electric cyan and deep cobalt signals. The entire experience is built on an almost-pure-black canvas (\`#0f0f0f\`) where content floats within barely-visible containment borders, creating the feeling of a high-tech control panel rather than a traditional marketing page. It's a site that whispers authority to developers who live in dark terminals.

The visual language leans heavily into the aesthetic of code editors and terminal windows. JetBrains Mono appears alongside the geometric precision of abcDiatype, reinforcing the message that this is a tool built *by* developers *for* developers. Decorative elements are restrained but impactful — subtle cyan-blue gradient glows emanate from cards and sections like bioluminescent organisms in deep water, while hard-offset shadows (\`4px 4px\`) on select elements add a raw, brutalist edge that prevents the design from feeling sterile.

What makes Composio distinctive is its tension between extreme minimalism and strategic bursts of luminous color. The site never shouts — headings use tight line-heights (0.87) that compress text into dense, authoritative blocks. Color is rationed like a rare resource: white text for primary content, semi-transparent white (\`rgba(255,255,255,0.5-0.6)\`) for secondary, and brand blue (\`#0007cd\`) or electric cyan (\`#00ffff\`) reserved exclusively for interactive moments and accent glows.

**Key Characteristics:**
- Pitch-black canvas with near-invisible white-border containment (4-12% opacity)
- Dual-font identity: geometric sans-serif (abcDiatype) for content, monospace (JetBrains Mono) for technical credibility
- Ultra-tight heading line-heights (0.87-1.0) creating compressed, impactful text blocks
- Bioluminescent accent strategy — cyan and blue glows that feel like they're emitting light from within
- Hard-offset brutalist shadows (\`4px 4px\`) on select interactive elements
- Monochrome hierarchy with color used only at the highest-signal moments
- Developer-terminal aesthetic that bridges marketing and documentation

## 4. Component Stylings

### Buttons

**Primary CTA (White Fill)**
- Background: Pure White (\`#ffffff\`)
- Text: Near Black (\`oklch(0.145 0 0)\`)
- Padding: comfortable (8px 24px)
- Border: none
- Radius: subtly rounded (likely 4px based on token scale)
- Hover: likely subtle opacity reduction or slight gray shift

**Cyan Accent CTA**
- Background: Electric Cyan at 12% opacity (\`rgba(0,255,255,0.12)\`)
- Text: Near Black (\`oklch(0.145 0 0)\`)
- Padding: comfortable (8px 24px)
- Border: thin solid Ocean Blue (\`1px solid rgb(0,150,255)\`)
- Radius: subtly rounded (4px)
- Creates a "glowing from within" effect on dark backgrounds

**Ghost / Outline (Signal Blue)**
- Background: transparent
- Text: Near Black (\`oklch(0.145 0 0)\`)
- Padding: balanced (10px)
- Border: thin solid Signal Blue (\`1px solid rgb(0,137,255)\`)
- Hover: likely fill or border color shift

**Ghost / Outline (Charcoal)**
- Background: transparent
- Text: Near Black (\`oklch(0.145 0 0)\`)
- Padding: balanced (10px)
- Border: thin solid Charcoal (\`1px solid rgb(44,44,44)\`)
- For secondary/tertiary actions on dark surfaces

**Phantom Button**
- Background: Phantom White (\`rgba(255,255,255,0.2)\`)
- Text: Whisper White (\`rgba(255,255,255,0.5)\`)
- No visible border
- Used for deeply de-emphasized actions

### Cards & Containers
- Background: Pure Black (\`#000000\`) or transparent
- Border: white at very low opacity, ranging from Border Mist 04 (\`rgba(255,255,255,0.04)\`) to Border Mist 12 (\`rgba(255,255,255,0.12)\`) depending on prominence
- Radius: barely rounded corners (2px for inline elements, 4px for content cards)
- Shadow: select cards use the hard-offset brutalist shadow (\`rgba(0,0,0,0.15) 4px 4px 0px 0px\`) — a distinctive design choice that adds raw depth
- Elevation shadow: deeper containers use soft diffuse shadow (\`rgba(0,0,0,0.5) 0px 8px 32px\`)
- Hover behavior: likely subtle border opacity increase or faint glow effect

### Inputs & Forms
- No explicit input token data extracted — inputs likely follow the dark-surface pattern with:
  - Background: transparent or Pure Black
  - Border: Border Mist 10 (\`rgba(255,255,255,0.10)\`)
  - Focus: border shifts to Signal Blue (\`#0089ff\`) or Electric Cyan
  - Text: Pure White with Ghost White placeholder

### Navigation
- Sticky top nav bar on dark/black background
- Logo (white SVG): Composio wordmark on the left
- Nav links: Pure White (\`#ffffff\`) at standard body size (16px, abcDiatype)
- CTA button in the nav: White Fill Primary style
- Mobile: collapses to hamburger menu, single-column layout
- Subtle bottom border on nav (Border Mist 06-08)

### Image Treatment
- Dark-themed product screenshots and UI mockups dominate
- Images sit within bordered containers matching the card system
- Blue/cyan gradient glows behind or beneath feature images
- No visible border-radius on images beyond container rounding (4px)
- Full-bleed within their card containers

### Distinctive Components

**Stats/Metrics Display**
- Large monospace numbers (JetBrains Mono) — "10k+" style
- Tight layout with subtle label text beneath

**Code Blocks / Terminal Previews**
- Dark containers with JetBrains Mono
- Syntax-highlighted content
- Subtle bordered containers (Border Mist 10)

**Integration/Partner Logos Grid**
- Grid layout of tool logos on dark surface
- Contained within bordered card
- Demonstrates ecosystem breadth

**"COMPOSIO" Brand Display**
- Oversized brand typography — likely the largest text on the page
- Used as a section divider/brand statement
- Stark white on black

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px, 30px, 32px, 40px
- Component padding: typically 10px (buttons) to 24px (CTA buttons horizontal)
- Section padding: generous vertical spacing (estimated 80-120px between major sections)
- Card internal padding: approximately 24-32px

### Grid & Container
- Max container width: approximately 1200px, centered
- Content sections use single-column or 2-3 column grids for feature cards
- Hero: centered single-column with maximum impact
- Feature sections: asymmetric layouts mixing text blocks with product screenshots

### Whitespace Philosophy
- **Breathing room between sections**: Large vertical gaps create distinct "chapters" in the page scroll.
- **Dense within components**: Cards and text blocks are internally compact (tight line-heights, minimal internal padding), creating focused information nodes.
- **Contrast-driven separation**: Rather than relying solely on whitespace, Composio uses border opacity differences and subtle background shifts to delineate content zones.

### Border Radius Scale
- Nearly squared (2px): Inline code spans, small tags, pre blocks — the sharpest treatment, conveying technical precision
- Subtly rounded (4px): Content cards, images, standard containers — the workhorse radius
- Pill-shaped (37px): Select buttons and badges — creates a softer, more approachable feel for key CTAs
- Full round (9999px+): Circular elements, avatar-like containers, decorative dots

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, inline text |
| Contained (Level 1) | Border Mist 04-08, no shadow | Background groupings, subtle sections |
| Card (Level 2) | Border Mist 10-12, no shadow | Standard content cards, code blocks |
| Brutalist (Level 3) | Hard offset shadow (\`4px 4px\`, 15% black) | Select interactive cards, distinctive feature highlights |
| Floating (Level 4) | Soft diffuse shadow (\`0px 8px 32px\`, 50% black) | Modals, overlays, deeply elevated content |

**Shadow Philosophy**: Composio uses shadows sparingly and with deliberate contrast. The hard-offset brutalist shadow is the signature — it breaks the sleek darkness with a raw, almost retro-computing feel. The soft diffuse shadow is reserved for truly floating elements. Most depth is communicated through border opacity gradations rather than shadows.

### Decorative Depth
- **Cyan Glow Halos**: Radial gradient halos using Electric Cyan at low opacity behind feature cards and images. Creates a "screen glow" effect as if the UI elements are emitting light.
- **Blue-Black Gradient Washes**: Linear gradients from Composio Cobalt to Void Black used as section backgrounds, adding subtle color temperature shifts.
- **White Fog Horizon**: A gradient from dark to diffused white/gray at the bottom of the page, creating an atmospheric "dawn" effect before the footer.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hamburger nav, full-width cards, reduced section padding, hero text scales down to ~28-40px |
| Tablet | 768-1024px | 2-column grid for cards, condensed nav, slightly reduced hero text |
| Desktop | 1024-1440px | Full multi-column layout, expanded nav with all links visible, large hero typography (64px) |
| Large Desktop | >1440px | Max-width container centered, generous horizontal margins |

### Touch Targets
- Minimum touch target: 44x44px for all interactive elements
- Buttons use comfortable padding (8px 24px minimum) ensuring adequate touch area
- Nav links spaced with sufficient gap for thumb navigation

### Collapsing Strategy
- **Navigation**: Full horizontal nav on desktop collapses to hamburger on mobile
- **Feature grids**: 3-column → 2-column → single-column stacking
- **Hero text**: 64px → 40px → 28px progressive scaling
- **Section padding**: Reduces proportionally but maintains generous vertical rhythm
- **Cards**: Stack vertically on mobile with full-width treatment
- **Code blocks**: Horizontal scroll on smaller viewports rather than wrapping

### Image Behavior
- Product screenshots scale proportionally within their containers
- Dark-themed images maintain contrast on the dark background at all sizes
- Gradient glow effects scale with container size
- No visible art direction changes between breakpoints — same crops, proportional scaling`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Composio - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/composio: dark agent-integration workspace with violet-blue signals and dense connector cards."
    />
    <style>
      :root {
        --bg: #090b14;
        --surface: #121626;
        --surface-warm: #1b2140;
        --fg: #f8fafc;
        --fg-2: #cbd5e1;
        --muted: #94a3b8;
        --meta: #8b5cf6;
        --border: #27324a;
        --border-soft: #1d2638;
        --accent: #6d5dfc;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #22c55e;
        --warn: #fbbf24;
        --danger: #fb7185;
        --font-display: "Inter", system-ui, sans-serif;
        --font-body: "Inter", system-ui, sans-serif;
        --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 15px;
        --text-lg: 17px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 48px;
        --text-4xl: 64px;
        --leading-body: 1.55;
        --leading-tight: 1.06;
        --tracking-display: -0.02em;
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
        --radius-sm: 10px;
        --radius-md: 14px;
        --radius-lg: 22px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 22px 60px rgba(0, 0, 0, 0.36);
        --focus-ring: 0 0 0 4px rgba(109, 93, 252, 0.30);
        --motion-fast: 140ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
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
        background: radial-gradient(circle at 75% 10%, rgba(109, 93, 252, 0.28), transparent 34%), #090b14;
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
  <style data-uma-responsive-repair>
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
            <p class="eyebrow">Composio design system</p>
            <h1>Agent integration grid</h1>
            <p class="lead">Connector cards, AI tool calls, and compact developer surfaces.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary agent connector action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Composio component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>integration node card</h3>
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
                <p>dark agent-integration workspace with violet-blue signals and dense connector cards.</p>
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
                  <label for="composio-input">Reference input</label>
                  <input id="composio-input" value="Composio system token" />
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
`};exports.default=composio_default;return module.exports}});
//# sourceMappingURL=client.composio.js.map