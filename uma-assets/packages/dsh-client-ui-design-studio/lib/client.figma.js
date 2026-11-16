
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.figma.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var figma_default={"contract":`## 1. Visual Theme & Atmosphere

Figma's interface is the design tool that designed itself — a masterclass in typographic sophistication where a custom variable font (figmaSans) modulates between razor-thin (weight 320) and bold (weight 700) with stops at unusual intermediates (330, 340, 450, 480, 540) that most type systems never explore. This granular weight control gives every text element a precisely calibrated visual weight, creating hierarchy through micro-differences rather than the blunt instrument of "regular vs bold."

The page presents a fascinating duality: the interface chrome is strictly black-and-white (literally only \`#000000\` and \`#ffffff\` detected as colors), while the hero section and product showcases explode with vibrant multi-color gradients — electric greens, bright yellows, deep purples, hot pinks. This separation means the design system itself is colorless, treating the product's colorful output as the hero content. Figma's marketing page is essentially a white gallery wall displaying colorful art.

What makes Figma distinctive beyond the variable font is its circle-and-pill geometry. Buttons use 50px radius (pill) or 50% (perfect circle for icon buttons), creating an organic, tool-palette-like feel. The dashed-outline focus indicator (\`dashed 2px\`) is a deliberate design choice that echoes selection handles in the Figma editor itself — the website's UI language references the product's UI language.

**Key Characteristics:**
- Custom variable font (figmaSans) with unusual weight stops: 320, 330, 340, 450, 480, 540, 700
- Strictly black-and-white interface chrome — color exists only in product content
- figmaMono for uppercase technical labels with wide letter-spacing
- Pill (50px) and circular (50%) button geometry
- Dashed focus outlines echoing Figma's editor selection handles
- Vibrant multi-color hero gradients (green, yellow, purple, pink)
- OpenType \`"kern"\` feature enabled globally
- Negative letter-spacing throughout — even body text at -0.14px to -0.26px

## 4. Component Stylings

### Buttons

**Black Solid (Pill)**
- Background: Pure Black (\`#000000\`)
- Text: Pure White (\`#ffffff\`)
- Radius: circle (50%) for icon buttons
- Focus: dashed 2px outline
- Maximum emphasis

**White Pill**
- Background: Pure White (\`#ffffff\`)
- Text: Pure Black (\`#000000\`)
- Padding: 8px 18px 10px (asymmetric vertical)
- Radius: pill (50px)
- Focus: dashed 2px outline
- Standard CTA on dark/colored surfaces

**Glass Dark**
- Background: \`rgba(0, 0, 0, 0.08)\` (subtle dark overlay)
- Text: Pure Black
- Radius: circle (50%)
- Focus: dashed 2px outline
- Secondary action on light surfaces

**Glass Light**
- Background: \`rgba(255, 255, 255, 0.16)\` (frosted glass)
- Text: Pure White
- Radius: circle (50%)
- Focus: dashed 2px outline
- Secondary action on dark/colored surfaces

### Cards & Containers
- Background: Pure White
- Border: none or minimal
- Radius: 6px (small containers), 8px (images, cards, dialogs)
- Shadow: subtle to medium elevation effects
- Product screenshots as card content

### Navigation
- Clean horizontal nav on white
- Logo: Figma wordmark in black
- Product tabs: pill-shaped (50px) tab navigation
- Links: black text, underline 1px decoration
- CTA: Black pill button
- Hover: text color via CSS variable

### Distinctive Components

**Product Tab Bar**
- Horizontal pill-shaped tabs (50px radius)
- Each tab represents a Figma product area (Design, Dev Mode, Prototyping, etc.)
- Active tab highlighted

**Hero Gradient Section**
- Full-width vibrant multi-color gradient background
- White text overlay with 86px display heading
- Product screenshots floating within the gradient

**Dashed Focus Indicators**
- All interactive elements use \`dashed 2px\` outline on focus
- References the selection handles in the Figma editor
- A meta-design choice connecting website and product

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 4.5px, 8px, 10px, 12px, 16px, 18px, 24px, 32px, 40px, 46px, 48px, 50px

### Grid & Container
- Max container width: up to 1920px
- Hero: full-width gradient with centered content
- Product sections: alternating showcases
- Footer: dark full-width section
- Responsive from 559px to 1920px

### Whitespace Philosophy
- **Gallery-like pacing**: Generous spacing lets each product section breathe as its own exhibit.
- **Color sections as visual breathing**: The gradient hero and product showcases provide chromatic relief between the monochrome interface sections.

### Border Radius Scale
- Minimal (2px): Small link elements
- Subtle (6px): Small containers, dividers
- Comfortable (8px): Cards, images, dialogs
- Pill (50px): Tab buttons, CTAs
- Circle (50%): Icon buttons, circular elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, most text |
| Surface (Level 1) | White card on gradient/dark section | Cards, product showcases |
| Elevated (Level 2) | Subtle shadow | Floating cards, hover states |

**Shadow Philosophy**: Figma uses shadows sparingly. The primary depth mechanisms are **background contrast** (white content on colorful/dark sections) and the inherent dimensionality of the product screenshots themselves.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <560px | Compact layout, stacked |
| Tablet | 560–768px | Minor adjustments |
| Small Desktop | 768–960px | 2-column layouts |
| Desktop | 960–1280px | Standard layout |
| Large Desktop | 1280–1440px | Expanded |
| Ultra-wide | 1440–1920px | Maximum width |

### Collapsing Strategy
- Hero text: 86px → 64px → 48px
- Product tabs: horizontal scroll on mobile
- Feature sections: stacked single column
- Footer: multi-column → stacked`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Figma — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/figma. Every visible
        value comes from tokens.css. Figma's signature moves: strictly
        black-and-white interface, figmaSans variable weights (320–700),
        pill (50px) and circular (50%) geometry, dashed focus outlines,
        figmaMono uppercase labels with positive letter-spacing."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #ffffff;
        --surface-warm: var(--surface);

        --fg:   #000000;
        --fg-2: #000000;
        --muted: rgba(0, 0, 0, 0.55);
        --meta:  rgba(0, 0, 0, 0.40);

        --border:      rgba(0, 0, 0, 0.12);
        --border-soft: rgba(0, 0, 0, 0.06);

        --accent:        #000000;
        --accent-on:     #ffffff;
        --accent-hover:  rgba(0, 0, 0, 0.85);
        --accent-active: rgba(0, 0, 0, 0.08);

        --success: #16a34a;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "figmaSans", "figmaSans Fallback", "SF Pro Display", system-ui, Helvetica, sans-serif;
        --font-body:    "figmaSans", "figmaSans Fallback", "SF Pro Display", system-ui, Helvetica, sans-serif;
        --font-mono:    "figmaMono", "figmaMono Fallback", "SF Mono", Menlo, ui-monospace, monospace;

        --text-xs:   12px;
        --text-sm:   16px;
        --text-base: 16px;
        --text-lg:   20px;
        --text-xl:   26px;
        --text-2xl:  26px;
        --text-3xl:  64px;
        --text-4xl:  86px;

        --leading-body:     1.40;
        --leading-tight:    1.00;
        --tracking-display: -0.02em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 96px;
        --section-y-tablet:  64px;
        --section-y-phone:   40px;

        --radius-sm:   50px;
        --radius-md:   8px;
        --radius-lg:   8px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 4px 16px rgba(0, 0, 0, 0.08);

        --focus-ring: 0 0 0 2px rgba(0, 0, 0, 0.8);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1920px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet:  24px;
        --container-gutter-phone:   16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        /* OpenType kern on all text — structural, not decorative. */
        font-feature-settings: "kern";
        -webkit-font-smoothing: antialiased;
      }

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

      /* ─── Typography ─────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 400;              /* figmaSans light — base display weight */
        margin: 0;
        line-height: var(--leading-tight);
        font-feature-settings: "kern";
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        /* 64px section: line-height 1.10, tracking -0.96px (-0.015em). */
        line-height: 1.10;
        letter-spacing: -0.015em;
      }
      h3 {
        font-size: var(--text-xl);
        /* 26px sub-heading: line-height 1.35, tracking -0.26px (-0.01em).
           Overrides the shared 1.00 set above. */
        line-height: 1.35;
        letter-spacing: -0.01em;
        font-weight: 540;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.40;
        color: var(--muted);
        font-weight: 330;
        letter-spacing: -0.007em;
      }
      /* figmaMono uppercase label — section signpost. */
      .mono-label {
        font-family: var(--font-mono);
        font-size: 18px;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.54px;
        color: var(--fg);
        line-height: 1.30;
      }
      .body-muted { color: var(--muted); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ─────────────────────────────── */
      /* All buttons use pill (50px) or circle (50%) — non-negotiable. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 20px;
        border-radius: var(--radius-sm);   /* 50px pill */
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 400;
        font-feature-settings: "kern";
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      /* Figma focus: dashed 2px outline — the editor selection handle echo. */
      .btn:focus-visible { outline: 2px dashed var(--fg); outline-offset: 2px; }
      .btn-black {
        background: var(--fg);
        color: var(--accent-on);
      }
      .btn-black:hover { background: rgba(0, 0, 0, 0.85); }
      .btn-white {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid rgba(0, 0, 0, 0.15);
      }
      .btn-white:hover { background: rgba(0, 0, 0, 0.04); }

      /* ─── Product tab bar ─────────────────────── */
      .tab-bar {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .tab {
        padding: 8px 18px;
        border-radius: var(--radius-sm);  /* 50px pill */
        font-size: var(--text-base);
        font-weight: 480;
        cursor: pointer;
        border: none;
        background: transparent;
        color: var(--fg);
        font-feature-settings: "kern";
        transition: background-color var(--motion-fast) var(--ease-standard);
      }
      .tab:hover { background: rgba(0, 0, 0, 0.06); }
      .tab.active { background: var(--fg); color: var(--accent-on); }
      .tab:focus-visible { outline: 2px dashed var(--fg); outline-offset: 2px; }

      /* ─── Cards ──────────────────────────────── */
      .card {
        background: var(--bg);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-raised);
      }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  <style data-uma-form-layout>.uma-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .uma-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="mono-label">Reference fixture · figma</p>
            <h1>Nothing great is made alone.</h1>
            <p class="lead" style="max-width:48ch">
              Figma brings teams together to design, prototype, and build.
              A strictly black-and-white interface where product content is the
              hero. Every value below from tokens.css.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside>
            <div class="card">
              <p class="mono-label" style="margin-bottom:var(--space-4)">Product areas</p>
              <div class="tab-bar">
                <button class="tab active">Design</button>
                <button class="tab">Dev Mode</button>
                <button class="tab">Prototype</button>
                <button class="tab">Slides</button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <p class="mono-label" style="margin-bottom:var(--space-6)">What this fixture exercises</p>

        <div class="features-grid">
          <article class="card stack-3">
            <h3>Variable precision</h3>
            <p class="body-muted" style="font-size:var(--text-base);font-weight:330;letter-spacing:-0.007em">
              Weight stops 320, 330, 340, 450, 480, 540, 700 — the granular
              control IS the design. Hierarchy through micro-differences.
            </p>
          </article>
          <article class="card stack-3">
            <h3 style="font-weight:340">Monochrome chrome</h3>
            <p class="body-muted" style="font-size:var(--text-base);font-weight:330;letter-spacing:-0.007em">
              #000000 and #ffffff only. Color lives in product content —
              gradients, screenshots, and embedded designs — never the shell.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Dashed focus</h3>
            <p class="body-muted" style="font-size:var(--text-base);font-weight:330;letter-spacing:-0.007em">
              2px dashed outline on all interactive elements — echoes selection
              handles in the Figma editor. The website speaks the product's UI.
            </p>
          </article>
        </div>
      </section>

      <!-- FORM / ACTIONS -->
      <section data-od-id="actions">
        <div class="uma-form-layout">
          <div class="stack-4">
            <p class="mono-label">Actions</p>
            <h2 style="font-size:var(--text-xl);line-height:1.35;letter-spacing:-0.01em;font-weight:540">All buttons use pill (50px) radius.</h2>
            <p class="lead" style="max-width:44ch">
              No sharp corners on interactive elements. Black solid for primary;
              bordered white for secondary. Focus is dashed, never solid.
            </p>
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-4)">
            <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
              <button class="btn btn-black">Primary action</button>
              <button class="btn btn-white">Secondary</button>
            </div>
            <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
              <button class="tab active">Active tab</button>
              <button class="tab">Inactive tab</button>
              <button class="tab">Another</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=figma_default;return module.exports}});
//# sourceMappingURL=client.figma.js.map