
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.renault.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var renault_default={"contract":`## 1. Visual Theme & Atmosphere

Renault's website is a vibrant digital showroom that balances French automotive elegance with bold, forward-leaning energy — a departure from the monochromatic austerity of German or Italian luxury brands. The page opens with a full-screen hero that washes the viewport in a sweeping aurora gradient — ribbons of magenta, violet, and teal bleeding across the frame behind a dramatically lit vehicle. This chromatic expressiveness is the site's signature: while the interface structure is disciplined (NouvelR typography, black-and-white CTA framework, zero-radius buttons), the content is alive with color — gradient washes on hero slides, saturated vehicle photography, and splashes of Renault Yellow (\`#EFDF00\`) on accent CTAs. The effect is a showroom that feels energized rather than hushed.

The layout follows a card-based editorial rhythm. Below the hero carousel, content is organized into a grid of PromoCards — each a full-bleed photographic panel with a dark gradient overlay at top (fading from \`rgba(0,0,0,0.6)\` to transparent) to ensure white heading text remains legible over vivid imagery. These cards alternate between light and dark modes: white editorial panels with black text sit beside black \`is-alternative-mode\` sections with white text, creating a chessboard-like visual cadence. The grid is generous — large card formats dominate, giving each vehicle or campaign its own visual territory. The lower sections shift to a fully dark canvas (Absolute Black backgrounds) for the E-Tech electric and technology showcases, establishing a deliberate mood shift: electrification lives in darkness, tradition in light.

Typography is unified under NouvelR — a proprietary geometric sans-serif designed by Black[Foundry] exclusively for Renault's rebrand. The typeface features a distinctive "radical r" with a terminal cut at 28 degrees to echo the Renault diamond logo's angles. Available in 6 weights from Light to Extrabold, the site primarily uses Bold (700) for headings and Regular (400) for body. Display headlines run large — 56px/0.95 line-height for hero titles, creating dense, impactful text blocks that sit tight against each other. The font supports Latin, Greek, Cyrillic, Hebrew, Arabic, and Korean, reflecting Renault's global market reach. All text rendering feels precise and engineered, with the geometric proportions lending a sense of modernity that aligns with Renault's electric-first brand positioning.

**Key Characteristics:**
- Full-screen hero carousel with vivid aurora gradient backgrounds (magenta/violet/teal) behind vehicle imagery
- NouvelR proprietary typeface with 28-degree "radical r" cut matching the diamond logo geometry
- Renault Yellow (\`#EFDF00\`) as the super-primary accent — used sparingly for highest-priority CTAs
- Zero border-radius on all buttons — sharp rectangular forms expressing precision engineering
- Card-based editorial grid with full-bleed photography and dark gradient overlays
- Binary black/white CTA system: primary (black bg/white text) and ghost (transparent/white border)
- PromoCard dark-mode alternation creating a chessboard rhythm between light and dark sections
- PrimeReact (21 components) + Element Plus (19 components) powering interactive elements
- Link hover state in Renault Blue (\`#1883FD\`) — the sole chromatic interaction color

## 4. Component Stylings

### Buttons
Renault's buttons are sharp-edged rectangles with zero border-radius — the industrial precision of a pressed metal body panel.

**Super Primary (Yellow)** — The highest-emphasis CTA:
- Default: bg \`#EFDF00\` (Renault Yellow), text \`#000000\`, borderRadius 0px, padding 10px 15px, border 1px solid \`#EFDF00\`
- Inverted: bg \`#EFDF00\`, text \`#000000\` — same yellow on dark backgrounds
- fontSize 16px (NouvelR), fontWeight 700, minHeight 46px, minWidth 46px
- Used for: Primary conversion actions (configure, buy now)

**Primary (Black)** — The default action button:
- Default: bg \`#000000\`, text \`#FFFFFF\`, borderRadius 0px, padding 10px 15px, border 1px solid \`#000000\`
- Inverted: bg \`#FFFFFF\`, text \`#000000\`, border 1px solid \`#FFFFFF\` — white fill on dark backgrounds
- fontSize 16px (NouvelR), fontWeight 700
- Used for: "keşfedin" (explore), secondary conversion actions

**Ghost** — Transparent outline button:
- Default (on dark): bg transparent, text \`#FFFFFF\`, border 1px solid \`#FFFFFF\`, borderRadius 0px, padding 10px 15px
- Default (on light): bg transparent, text \`#000000\`, border 1px solid \`#000000\`
- fontSize 16px (NouvelR), fontWeight 700
- Used for: "ilk sen öğren" (be the first to know), "satın alın" (buy), secondary actions

**Text Link** — Inline navigation:
- Default (light): text \`#000000\`, no border, no background
- Default (dark): text \`#FFFFFF\`
- Hover: color shifts to \`#1883FD\` (Renault Blue), text-decoration none
- All link variants hover to the same blue — consistent interactive feedback

### Cards & Containers

**PromoCard (Light)** — Editorial content card:
- Background: white or transparent
- Full-bleed photography with dark gradient overlay at top: \`linear-gradient(rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)\`
- Heading: NouvelR 40px/700, white text positioned over gradient
- Border-radius: 0px — sharp rectangular containers
- No shadow, no visible border

**PromoCard (Dark / \`is-alternative-mode\`)** — Cinematic card:
- Background: \`#000000\` (Absolute Black)
- Same gradient overlay treatment
- Heading: white NouvelR text
- CTA buttons: inverted primary (white bg) or ghost (white border)

**VehicleRangeCard** — Vehicle showcase:
- Background: transparent
- Vehicle image above, model name and price/spec below
- No shadow, no border, clean flat treatment
- Spacing between cards via grid gap

### Inputs & Forms

**Search/Text Input:**
- Background: \`#FFFFFF\`
- Text: \`#000000\`
- Border: 1px solid \`#D1D1D1\` (Border Gray)
- Border-radius: 50px (pill-shaped — unusual deviation from the zero-radius button system)
- Padding: 6px 35px 6px 15px (extra right padding for search icon)
- Font: NouvelR, 12.8px
- Focus: standard browser focus ring

### Navigation
- **Desktop**: Renault diamond logo centered/left, horizontal nav links, sticky positioning
- **Background**: white, no shadow at rest
- **Links**: NouvelR, 13px, weight 700, black text
- **Hover**: color shifts to \`#1883FD\` (Renault Blue)
- **Mobile**: Hamburger collapse to full-screen navigation drawer
- **CTA in nav**: Primary black button for main conversion action

### Image Treatment
- **Hero**: Full-viewport carousel with dramatic aurora-gradient backgrounds and art-directed vehicle photography — edge-to-edge, no padding
- **PromoCards**: Full-bleed photography within card bounds, dark gradient overlay at top for text legibility
- **Vehicle images**: Transparent-background renders on neutral/gradient backgrounds
- **Aspect ratios**: Mixed — hero at roughly 16:9 viewport, promo cards at various ratios from square to wide panoramic
- **Lazy loading**: Below-fold sections use lazy loading (framework-handled)

### Carousel Component
- Full-screen hero carousel with auto-advancing slides
- Each slide: background gradient/photo + vehicle image + headline + CTA buttons
- Dot indicators for slide position
- Navigation arrows at edges

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px (detected system base)
- **Scale**: 1px, 4px, 5px, 6px, 6.25px, 8px, 10px, 12px, 13px, 15px, 16px, 20px, 24px, 32px, 40px
- **Button padding**: 10px 15px — consistent across all button variants
- **Section padding**: Generous vertical spacing (40–80px) between major content blocks
- **Card gaps**: 16–24px between grid items
- **Minimum interactive size**: 46px (minWidth and minHeight on all buttons)

### Grid & Container
- **Max width**: 1440px (largest defined breakpoint)
- **Hero**: Full-bleed, edge-to-edge, viewport-height
- **PromoCard grid**: 2-up and 3-up layouts with mixed card sizes
- **Vehicle range**: Horizontal scrollable card row or grid
- **Footer**: Multi-column layout on white background

### Whitespace Philosophy
Renault uses whitespace moderately — more generously than Ferrari but less extremely than Tesla. The card-based layout means content is organized into defined containers rather than floating in void. The visual breathing room comes primarily from the large card formats and the full-bleed hero carousel, which gives each vehicle its own cinematic moment. Between sections, spacing is consistent (32–40px) creating a rhythmic scroll experience. The alternation between light and dark sections also creates perceived whitespace — the mode switch itself acts as a visual separator.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 0px | All buttons, PromoCards, most containers — the zero-radius default |
| 2px | Small UI elements (region controls) |
| 3px | Content panels (div, tabpanel) |
| 4px | Labels and tag elements |
| 46px | Pill-shaped elements (search input, filter chips) |
| 50px | Full pill for search/input fields |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow | Default for PromoCards, buttons, most containers |
| Level 1 (Soft) | \`rgba(0,0,0,0.2) 0px 4px 8px\` | Card hover states, subtle lift effect |
| Level 2 (Medium) | \`rgba(0,0,0,0.2) 0px 0px 18px\` | Floating UI elements, dropdown menus |
| Level 3 (Layered) | \`rgba(0,0,0,0) 0px 2px 4px, rgba(50,50,93,0.1) 0px 7px 14px\` | Compound shadow for elevated cards and modals |
| Level 4 (Deep) | \`rgba(0,0,0,0.15) 0px 40px 80px\` | Large floating panels, configurator overlays |
| Level 5 (Directional) | \`rgba(0,0,0,0.2) 5px 5px 8px\` | Offset directional shadow for specific components |
| Level 6 (Ambient) | \`rgb(199,197,199) 0px 0px 12px 2px\` | Ambient glow effect for highlighted elements |

### Shadow Philosophy
Renault uses a richer shadow system than Ferrari or Tesla — seven distinct shadow tokens reflecting a more layered, dimensional interface. The shadows progress from subtle 4px hover lifts to dramatic 80px deep panels. The compound shadow (Level 3) with its dual-layer approach (a tight dark shadow plus a wider purple-tinted one from \`rgba(50,50,93,0.1)\`) is particularly refined — it creates a photorealistic floating effect. The ambient glow (Level 6) in warm gray adds a unique touch that connects to Renault's warmer color personality.

### Decorative Depth
- **Hero aurora gradients**: The primary decorative depth element — vivid color gradients create atmospheric depth behind vehicle imagery
- **PromoCard overlays**: \`linear-gradient(rgba(0,0,0,0.6) → transparent)\` creates depth within cards through transparency
- **No blur effects** on UI elements — depth is communicated through shadow and color contrast

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | ≤425px | Single-column, full-width cards, hero text scales to ~32px, stacked CTAs, hamburger nav |
| Mobile | 426–640px | Single-column, slightly larger cards, hero text at 32–40px |
| Tablet Small | 641–768px | 2-column PromoCard grid begins, hero maintains full-width |
| Tablet | 769–896px | Full 2-column layout, vehicle range shows 2–3 cards |
| Desktop Small | 897–1024px | Navigation fully expanded, hero at 56px, 2-up card grid |
| Desktop | 1025–1280px | Full layout, 3-up card grid, generous whitespace |
| Large Desktop | 1281–1440px | Maximum content width, centered container, hero at full cinematic scale |

### Touch Targets
- All buttons: minimum 46×46px (\`minWidth: 46px, minHeight: 46px\`) — exceeds WCAG AAA 44×44px requirement
- Search input pill: adequate touch target with 50px border-radius creating a large tappable area
- Navigation links: NouvelR 13px with adequate spacing between items
- Carousel navigation: large arrow targets at viewport edges

### Collapsing Strategy
- **Navigation**: Full horizontal nav collapses to Renault diamond logo + hamburger menu on mobile
- **Hero carousel**: Full-width at all breakpoints, headline scales from 56px (desktop) to ~32px (mobile)
- **PromoCard grid**: 3-up → 2-up → single-column as viewport narrows
- **Vehicle range**: Horizontal scroll maintained at all sizes, visible cards reduce
- **CTA pairs**: Side-by-side buttons stack vertically on mobile
- **Footer**: Multi-column collapses to single-column accordion on mobile

### Image Behavior
- Hero images: full-bleed at all breakpoints with \`object-fit: cover\`
- PromoCard images: responsive within card containers, gradient overlay scales proportionally
- Vehicle images: transparent-background renders scale proportionally within grid cells
- Art direction: mobile may crop to tighter vehicle views, reducing environmental context`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Renault - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/renault: electric automotive showroom, warm yellow accents, black engineering text, and modern gallery surfaces." />
    <style>
      :root {
        --bg: #f7f4ef;
        --surface: #ffffff;
        --surface-warm: #fff4bf;
        --fg: #111111;
        --fg-2: #3f3f3f;
        --muted: #6f6b63;
        --meta: #ffcc33;
        --border: #dfd8ca;
        --border-soft: #ece6db;
        --accent: #ffcc33;
        --accent-on: #111111;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #198754;
        --warn: #f59e0b;
        --danger: #d92d20;
        --font-display: "Renault Group", "Helvetica Neue", Arial, sans-serif;
        --font-body: "Renault Group", "Helvetica Neue", Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 26px;
        --text-2xl: 38px;
        --text-3xl: 58px;
        --text-4xl: 82px;
        --leading-body: 1.5;
        --leading-tight: 1.02;
        --tracking-display: -0.03em;
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
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 14px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 22px 58px rgba(17, 17, 17, 0.14);
        --focus-ring: 0 0 0 4px rgba(255, 204, 51, 0.36);
        --motion-fast: 140ms;
        --motion-base: 230ms;
        --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
        --container-max: 1220px;
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
      .page { min-height: 100vh; background: linear-gradient(135deg, #f7f4ef 0%, #ffffff 62%, #fff4bf 100%); }
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) { .container { padding-inline: var(--container-gutter-tablet); } section { padding-block: var(--section-y-tablet); } }
      @media (max-width: 639px) { .container { padding-inline: var(--container-gutter-phone); } section { padding-block: var(--section-y-phone); } }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-display); }
      h1 { max-width: 820px; font-size: var(--text-4xl); font-weight: 760; }
      h2 { font-size: var(--text-3xl); font-weight: 700; }
      h3 { font-size: var(--text-xl); font-weight: 700; }
      .eyebrow { color: var(--meta); font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      .lead { max-width: 640px; color: var(--fg-2); font-size: var(--text-lg); }
      .hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr); gap: var(--space-8); align-items: center; }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-block-start: var(--space-6); }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 var(--space-5);
        border: 1px solid transparent; border-radius: var(--radius-md); font: 700 var(--text-sm) / 1 var(--font-body);
        color: inherit; text-decoration: none; cursor: pointer; transition: background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface); color: var(--fg); border-color: var(--border); box-shadow: var(--elev-ring); }
      .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
      .panel { background: color-mix(in oklab, var(--surface), transparent 4%); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--elev-raised); overflow: hidden; }
      .panel-head { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); padding: var(--space-5); border-bottom: 1px solid var(--border-soft); }
      .status { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--meta); font: 700 var(--text-xs) / 1 var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; }
      .status::before { width: 8px; height: 8px; border-radius: var(--radius-pill); background: var(--success); content: ""; }
      .metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--border-soft); }
      .metric { padding: var(--space-5); border-right: 1px solid var(--border-soft); }
      .metric:last-child { border-right: 0; }
      .metric strong { display: block; font-family: var(--font-display); font-size: var(--text-2xl); line-height: var(--leading-tight); }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); padding: var(--space-5); }
      .mini-card { min-height: 148px; padding: var(--space-5); border: 1px solid var(--border-soft); border-radius: var(--radius-md); background: var(--surface-warm); }
      .mini-card p, .tile p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      .swatches { display: flex; gap: var(--space-2); margin-block-start: var(--space-4); }
      .swatch { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); }
      .swatch.accent { background: var(--accent); } .swatch.surface { background: var(--surface); } .swatch.warm { background: var(--surface-warm); } .swatch.fg { background: var(--fg); }
      .field { display: grid; gap: var(--space-2); margin-block-start: var(--space-5); }
      label { color: var(--fg-2); font-size: var(--text-sm); font-weight: 700; }
      input { width: 100%; min-height: 46px; padding: 0 var(--space-4); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--fg); font: inherit; }
      input:focus { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }
      .lower { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
      .tile { padding: var(--space-5); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
      @media (max-width: 860px) { .hero, .lower { grid-template-columns: 1fr; } .metric-grid, .card-row { grid-template-columns: 1fr; } .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); } .metric:last-child { border-bottom: 0; } }
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
            <p class="eyebrow">Renault design system</p>
            <h1>Electric mobility showroom</h1>
            <p class="lead">French automotive confidence with yellow signal, black type, and clean vehicle cards.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Renault component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row">
              <div class="mini-card"><h3>Palette</h3><p>electric automotive showroom, warm yellow accents, black engineering text, and modern gallery surfaces.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div>
              <div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same brand signal.</p><div class="field"><label for="renault-input">Reference input</label><input id="renault-input" value="Renault system token" /></div></div>
            </div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use brand-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=renault_default;return module.exports}});
//# sourceMappingURL=client.renault.js.map