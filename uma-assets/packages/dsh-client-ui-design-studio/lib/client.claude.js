
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.claude.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var claude_default={"contract":`## 1. Visual Theme & Atmosphere

Claude's interface is a literary salon reimagined as a product page — warm, unhurried, and quietly intellectual. The entire experience is built on a parchment-toned canvas (\`#f5f4ed\`) that deliberately evokes the feeling of high-quality paper rather than a digital surface. Where most AI product pages lean into cold, futuristic aesthetics, Claude's design radiates human warmth, as if the AI itself has good taste in interior design.

The signature move is the custom Anthropic Serif typeface — a medium-weight serif with generous proportions that gives every headline the gravitas of a book title. Combined with organic, hand-drawn-feeling illustrations in terracotta (\`#c96442\`), black, and muted green, the visual language says "thoughtful companion" rather than "powerful tool." The serif headlines breathe at tight-but-comfortable line-heights (1.10–1.30), creating a cadence that feels more like reading an essay than scanning a product page.

What makes Claude's design truly distinctive is its warm neutral palette. Every gray has a yellow-brown undertone (\`#5e5d59\`, \`#87867f\`, \`#4d4c48\`) — there are no cool blue-grays anywhere. Borders are cream-tinted (\`#f0eee6\`, \`#e8e6dc\`), shadows use warm transparent blacks, and even the darkest surfaces (\`#141413\`, \`#30302e\`) carry a barely perceptible olive warmth. This chromatic consistency creates a space that feels lived-in and trustworthy.

**Key Characteristics:**
- Warm parchment canvas (\`#f5f4ed\`) evoking premium paper, not screens
- Custom Anthropic type family: Serif for headlines, Sans for UI, Mono for code
- Terracotta brand accent (\`#c96442\`) — warm, earthy, deliberately un-tech
- Exclusively warm-toned neutrals — every gray has a yellow-brown undertone
- Organic, editorial illustrations replacing typical tech iconography
- Ring-based shadow system (\`0px 0px 0px 1px\`) creating border-like depth without visible borders
- Magazine-like pacing with generous section spacing and serif-driven hierarchy

## 4. Component Stylings

### Buttons

**Warm Sand (Secondary)**
- Background: Warm Sand (\`#e8e6dc\`)
- Text: Charcoal Warm (\`#4d4c48\`)
- Padding: 0px 12px 0px 8px (asymmetric — icon-first layout)
- Radius: comfortably rounded (8px)
- Shadow: ring-based (\`#e8e6dc 0px 0px 0px 0px, #d1cfc5 0px 0px 0px 1px\`)
- The workhorse button — warm, unassuming, clearly interactive

**White Surface**
- Background: Pure White (\`#ffffff\`)
- Text: Anthropic Near Black (\`#141413\`)
- Padding: 8px 16px 8px 12px
- Radius: generously rounded (12px)
- Hover: shifts to secondary background color
- Clean, elevated button for light surfaces

**Dark Charcoal**
- Background: Dark Surface (\`#30302e\`)
- Text: Ivory (\`#faf9f5\`)
- Padding: 0px 12px 0px 8px
- Radius: comfortably rounded (8px)
- Shadow: ring-based (\`#30302e 0px 0px 0px 0px, ring 0px 0px 0px 1px\`)
- The inverted variant for dark-on-light emphasis

**Brand Terracotta**
- Background: Terracotta Brand (\`#c96442\`)
- Text: Ivory (\`#faf9f5\`)
- Radius: 8–12px
- Shadow: ring-based (\`#c96442 0px 0px 0px 0px, #c96442 0px 0px 0px 1px\`)
- The primary CTA — the only button with chromatic color

**Dark Primary**
- Background: Anthropic Near Black (\`#141413\`)
- Text: Warm Silver (\`#b0aea5\`)
- Padding: 9.6px 16.8px
- Radius: generously rounded (12px)
- Border: thin solid Dark Surface (\`1px solid #30302e\`)
- Used on dark theme surfaces

### Cards & Containers
- Background: Ivory (\`#faf9f5\`) or Pure White (\`#ffffff\`) on light surfaces; Dark Surface (\`#30302e\`) on dark
- Border: thin solid Border Cream (\`1px solid #f0eee6\`) on light; \`1px solid #30302e\` on dark
- Radius: comfortably rounded (8px) for standard cards; generously rounded (16px) for featured; very rounded (32px) for hero containers and embedded media
- Shadow: whisper-soft (\`rgba(0,0,0,0.05) 0px 4px 24px\`) for elevated content
- Ring shadow: \`0px 0px 0px 1px\` patterns for interactive card states
- Section borders: \`1px 0px 0px\` (top-only) for list item separators

### Inputs & Forms
- Text: Anthropic Near Black (\`#141413\`)
- Padding: 1.6px 12px (very compact vertical)
- Border: standard warm borders
- Focus: ring with Focus Blue (\`#3898ec\`) border-color — the only cool color moment
- Radius: generously rounded (12px)

### Navigation
- Sticky top nav with warm background
- Logo: Claude wordmark in Anthropic Near Black
- Links: mix of Near Black (\`#141413\`), Olive Gray (\`#5e5d59\`), and Dark Warm (\`#3d3d3a\`)
- Nav border: \`1px solid #30302e\` (dark) or \`1px solid #f0eee6\` (light)
- CTA: Terracotta Brand button or White Surface button
- Hover: text shifts to foreground-primary, no decoration

### Image Treatment
- Product screenshots showing the Claude chat interface
- Generous border-radius on media (16–32px)
- Embedded video players with rounded corners
- Dark UI screenshots provide contrast against warm light canvas
- Organic, hand-drawn illustrations for conceptual sections

### Distinctive Components

**Model Comparison Cards**
- Opus 4.5, Sonnet 4.5, Haiku 4.5 presented in a clean card grid
- Each model gets a bordered card with name, description, and capability badges
- Border Warm (\`#e8e6dc\`) separation between items

**Organic Illustrations**
- Hand-drawn-feeling vector illustrations in terracotta, black, and muted green
- Abstract, conceptual rather than literal product diagrams
- The primary visual personality — no other AI company uses this style

**Dark/Light Section Alternation**
- The page alternates between Parchment light and Near Black dark sections
- Creates a reading rhythm like chapters in a book
- Each section feels like a distinct environment

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 3px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 30px
- Button padding: asymmetric (0px 12px 0px 8px) or balanced (8px 16px)
- Card internal padding: approximately 24–32px
- Section vertical spacing: generous (estimated 80–120px between major sections)

### Grid & Container
- Max container width: approximately 1200px, centered
- Hero: centered with editorial layout
- Feature sections: single-column or 2–3 column card grids
- Model comparison: clean 3-column grid
- Full-width dark sections breaking the container for emphasis

### Whitespace Philosophy
- **Editorial pacing**: Each section breathes like a magazine spread — generous top/bottom margins create natural reading pauses.
- **Serif-driven rhythm**: The serif headings establish a literary cadence that demands more whitespace than sans-serif designs.
- **Content island approach**: Sections alternate between light and dark environments, creating distinct "rooms" for each message.

### Border Radius Scale
- Sharp (4px): Minimal inline elements
- Subtly rounded (6–7.5px): Small buttons, secondary interactive elements
- Comfortably rounded (8–8.5px): Standard buttons, cards, containers
- Generously rounded (12px): Primary buttons, input fields, nav elements
- Very rounded (16px): Featured containers, video players, tab lists
- Highly rounded (24px): Tag-like elements, highlighted containers
- Maximum rounded (32px): Hero containers, embedded media, large cards

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Parchment background, inline text |
| Contained (Level 1) | \`1px solid #f0eee6\` (light) or \`1px solid #30302e\` (dark) | Standard cards, sections |
| Ring (Level 2) | \`0px 0px 0px 1px\` ring shadows using warm grays | Interactive cards, buttons, hover states |
| Whisper (Level 3) | \`rgba(0,0,0,0.05) 0px 4px 24px\` | Elevated feature cards, product screenshots |
| Inset (Level 4) | \`inset 0px 0px 0px 1px\` at 15% opacity | Active/pressed button states |

**Shadow Philosophy**: Claude communicates depth through **warm-toned ring shadows** rather than traditional drop shadows. The signature \`0px 0px 0px 1px\` pattern creates a border-like halo that's softer than an actual border — it's a shadow pretending to be a border, or a border that's technically a shadow. When drop shadows do appear, they're extremely soft (0.05 opacity, 24px blur) — barely visible lifts that suggest floating rather than casting.

### Decorative Depth
- **Light/Dark alternation**: The most dramatic depth effect comes from alternating between Parchment (\`#f5f4ed\`) and Near Black (\`#141413\`) sections — entire sections shift elevation by changing the ambient light level.
- **Warm ring halos**: Button and card interactions use ring shadows that match the warm palette — never cool-toned or generic gray.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <479px | Minimum layout, stacked everything, compact typography |
| Mobile | 479–640px | Single column, hamburger nav, reduced heading sizes |
| Large Mobile | 640–767px | Slightly wider content area |
| Tablet | 768–991px | 2-column grids begin, condensed nav |
| Desktop | 992px+ | Full multi-column layout, expanded nav, maximum hero typography (64px) |

### Touch Targets
- Buttons use generous padding (8–16px vertical minimum)
- Navigation links adequately spaced for thumb navigation
- Card surfaces serve as large touch targets
- Minimum recommended: 44x44px

### Collapsing Strategy
- **Navigation**: Full horizontal nav collapses to hamburger on mobile
- **Feature sections**: Multi-column → stacked single column
- **Hero text**: 64px → 36px → ~25px progressive scaling
- **Model cards**: 3-column → stacked vertical
- **Section padding**: Reduces proportionally but maintains editorial rhythm
- **Illustrations**: Scale proportionally, maintain aspect ratios

### Image Behavior
- Product screenshots scale proportionally within rounded containers
- Illustrations maintain quality at all sizes
- Video embeds maintain 16:9 aspect ratio with rounded corners
- No art direction changes between breakpoints`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Claude (Anthropic) — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/claude. Literary salon aesthetic:
        warm parchment canvas, terracotta accent, Anthropic Serif headings.
        Every visible value comes from tokens.css via var(--*)."
    />

    <style>
      /* :root paste — sourced verbatim from
         design-systems/claude/tokens.css. Keep in sync when tokens change. */
      :root {
        --bg: #f5f4ed;
        --surface: #faf9f5;
        --surface-warm: #e8e6dc;

        --fg: #141413;
        --fg-2: #3d3d3a;
        --muted: #5e5d59;
        --meta: #87867f;

        --border: #f0eee6;
        --border-soft: #e8e6dc;

        --accent: #c96442;
        --accent-on: #faf9f5;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #17a34a;
        --warn: #eab308;
        --danger: #b53333;

        --font-display: "Anthropic Serif", Georgia, "Times New Roman", serif;
        --font-body: "Anthropic Sans", "Arial", system-ui, -apple-system, sans-serif;
        --font-mono: "Anthropic Mono", ui-monospace, "JetBrains Mono", Menlo, monospace;

        --text-xs: 10px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 25px;
        --text-2xl: 32px;
        --text-3xl: 52px;
        --text-4xl: 64px;

        --leading-body: 1.6;
        --leading-tight: 1.1;
        --tracking-display: 0em;

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
        --section-y-phone: 48px;

        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: rgba(0, 0, 0, 0.05) 0px 4px 24px;

        --focus-ring: 0 0 0 3px rgba(56, 152, 236, 0.3);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset (minimal) ───────────────────────────────────── */
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

      /* ─── Layout primitives ─────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — Anthropic Serif for all headings ─────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 500; /* Claude uses weight 500 for all serif headings */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: var(--tracking-display);
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-xl); }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: var(--leading-body);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        color: var(--meta);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 9px 16px 9px 12px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition:
          box-shadow var(--motion-fast) var(--ease-standard),
          background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: Terracotta Brand — the only button with chromatic color */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        box-shadow: var(--accent) 0px 0px 0px 0px, var(--accent) 0px 0px 0px 1px;
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }
      /* Secondary: Warm Sand — workhorse button */
      .btn-secondary {
        background: var(--surface-warm);
        color: var(--fg-2);
        box-shadow: var(--surface-warm) 0px 0px 0px 0px, #d1cfc5 0px 0px 0px 1px;
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, var(--surface-warm), black 4%);
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg-2);
      }
      .field input {
        padding: 10px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-soft);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: #3898ec; /* Focus Blue — the only cool color in Claude */
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help {
        font-size: var(--text-xs);
        color: var(--meta);
      }

      /* ─── Cards — ivory surface, whisper shadow ─────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 3px var(--space-3);
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.6;
        text-transform: uppercase;
        letter-spacing: 0.12px;
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), transparent 90%);
      }
      .badge-muted {
        color: var(--muted);
        background: color-mix(in oklab, var(--muted), transparent 88%);
      }
      .badge-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────── */
      a {
        color: var(--fg-2);
        text-decoration: none;
      }
      a:hover {
        color: var(--accent);
        text-decoration: none;
      }

      /* ─── Kbd ───────────────────────────────────────────────── */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border-soft);
        background: var(--surface-warm);
        color: var(--muted);
      }

      /* ─── Section layouts ───────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--surface);
        box-shadow: var(--elev-raised);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .form-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 420px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
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
    <main class="container">
      <!-- ════════════════════════════════════════════════════════
           HERO — exercises: h1 (Anthropic Serif 500), .lead,
           .eyebrow, .btn-primary (terracotta), .btn-secondary
           (warm sand), kbd, .badge-success, hero-grid.
      ════════════════════════════════════════════════════════════ -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · claude</p>
            <h1>Thoughtful conversations, made tangible.</h1>
            <p class="lead" style="max-width: 52ch">
              A warm, literary design system built on parchment — where
              every interaction carries the weight of a considered reply.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--muted)">Model status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Available
              </span>
            </div>
            <p class="body-sm body-muted">
              Last reviewed
              <time datetime="2026-05-15">2026-05-15</time> · v1.0
            </p>
            <p class="body-sm body-muted">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens.
            </p>
          </aside>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════
           FEATURES — exercises: h2, h3, .card (ivory + whisper
           shadow), .body-muted, link, .features-grid.
      ════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 30ch">
            Warm parchment, terracotta, and the gentlest possible containment.
          </h2>
        </div>

        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Parchment surface tokens</h3>
            <p class="body-muted body-sm">
              --bg (#f5f4ed) → --surface (#faf9f5) → --surface-warm (#e8e6dc).
              Three warm tiers with yellow-brown undertones — no cool grays anywhere.
            </p>
            
          </article>

          <article class="card">
            <h3>Terracotta discipline</h3>
            <p class="body-muted body-sm">
              --accent (#c96442) appears only on the primary CTA and brand
              moments. The warm sand secondary button keeps the screen
              from feeling mono-terracotta.
            </p>
            
          </article>

          <article class="card">
            <h3>Serif/sans hierarchy</h3>
            <p class="body-muted body-sm">
              Anthropic Serif weight 500 for all headings — the single weight
              gives every title the gravitas of a published title. Anthropic
              Sans handles UI text with quiet efficiency.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════
           FORM — exercises: .field, input :focus-visible (Focus
           Blue), .btn-primary, .btn-secondary, .field-help.
      ════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs in the same warm context.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Focus rings use Focus Blue (#3898ec) — the ONLY cool color in
              the entire Claude system. It exists purely for accessibility.
              Everything else stays warm.
            </p>
          </div>

          <div role="group" class="hey-preview-form form">
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
                We'll send a copy of the spec and nothing else.
              </p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Send the spec
              </button>
              <button type="button" class="btn btn-secondary">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=claude_default;return module.exports}});
//# sourceMappingURL=client.claude.js.map