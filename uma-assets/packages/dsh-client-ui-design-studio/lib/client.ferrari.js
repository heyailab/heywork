
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.ferrari.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var ferrari_default={"contract":`## 1. Visual Theme & Atmosphere

Ferrari's website is a digital editorial — a curated magazine where the Prancing Horse brand is presented with the gravitas of an art institution and the precision of Italian coachwork. The page opens onto an expanse of absolute black, broken only by the iconic Prancing Horse emblem floating alone in its own atmosphere. Below, the content unfolds in dramatic alternations between inky-dark cinematic sections and crisp white editorial panels. This chiaroscuro rhythm — darkness yielding to light, machinery yielding to human story — feels more like paging through a Ferrari yearbook than scrolling a commercial website. Every section is a curated vignette: a concept car dissolving from shadow, two F1 drivers posed with sculptural stillness, a lineup of production models arranged in a jewel-toned parade.

The color language is monastically restrained for a brand built on speed and emotion. Ferrari Red (\`#DA291C\`) appears with almost surgical sparseness — reserved for the Subscribe CTA and accent moments that need to command immediate attention. The vast majority of the interface lives in black, white, and a carefully calibrated gray scale (from \`#303030\` dark surfaces through \`#8F8F8F\` mid-tones to \`#D2D2D2\` light borders). Two yellows — Racing Yellow (\`#FFF200\`) and the deeper Modena Yellow (\`#F6E500\`) — exist in the token system as heritage accents for special contexts, honoring Ferrari's racing provenance. The restraint means that when red does appear, it carries the weight of the entire brand.

Typography relies on FerrariSans — a proprietary sans-serif family with medium-weight headings (500–700) and compact proportions. Display text runs at 24–26px for section titles, while the UI chrome lives at 12–16px in weights ranging from regular to bold. A secondary "Body-Font" custom typeface handles captions and utility text, rendered in uppercase with wide letter-spacing (1px) to create a label-like editorial quality. This two-font system — FerrariSans for narrative authority, Body-Font for structural annotation — gives the site a print-magazine hierarchy. No text decoration is gratuitous. Letter-spacing is tight for headlines and deliberately expanded for labels, creating a visual rhythm that alternates between urgency and composure.

**Key Characteristics:**
- Chiaroscuro layout alternating between deep black sections and clean white editorial panels
- Ferrari Red (\`#DA291C\`) used with extreme sparseness — accent, not atmosphere
- Prancing Horse emblem as isolated hero element on a void-black field
- FerrariSans proprietary typeface with compact proportions and medium weights
- Photo-journalism imagery: concept renders, driver portraits, lineup parades — each section is a story
- Uppercase Body-Font labels with wide letter-spacing (1px) for editorial annotation
- Nearly zero border-radius (2px default) reflecting precision engineering aesthetics
- Dual-framework architecture (PrimeReact + Element Plus) powering 32+ interactive components
- Carousel-driven hero with editorial slides and arrow/dot navigation

## 4. Component Stylings

### Buttons
Ferrari's buttons are minimal white rectangles with near-zero radius — the CTA philosophy is "architecture, not decoration."

**Primary CTA (White)** — The default action button:
- Default: bg \`#FFFFFF\`, text \`#000000\`, fontSize 16px (FerrariSans), letterSpacing 1.28px, padding 12px 10px, borderRadius 2px, border 1px solid \`#000000\`
- Hover: bg \`#1EAEDB\` (Teal), text \`#FFFFFF\`, opacity 0.9
- Focus: bg \`#1EAEDB\`, text \`#FFFFFF\`, border 1px solid \`#FFFFFF\`, outline 2px solid \`#000000\`, opacity 0.9
- Used for: "Configure" actions, secondary calls to action on light backgrounds

**Subscribe CTA (Red)** — The high-emphasis action button:
- Default: bg \`#DA291C\` (Ferrari Red), text \`#FFFFFF\`, borderRadius 2px, padding 12px 10px
- Used for: Newsletter subscribe, primary conversion actions on dark backgrounds
- The only button that uses Ferrari Red — reserved for maximum visual priority

**Ghost Button (White Border)** — For dark backgrounds:
- Default: bg transparent, text \`#FFFFFF\`, border 1px solid \`#FFFFFF\`, borderRadius 2px, padding 12px 10px
- Hover: bg \`#1EAEDB\` (Teal), text \`#FFFFFF\`, opacity 0.9
- Focus: same as Primary CTA focus state
- Used for: Actions overlaid on dark imagery and cinematic sections

**Text Link** — Inline navigation:
- Default: text \`#181818\` (on light surfaces) or \`#FFFFFF\` (on dark), no border, no background
- Hover: color shifts to \`#3860BE\` (Link Hover Blue), decoration removes underline
- White variant on dark surfaces uses underline decoration by default
- FerrariSans or Body-Font depending on context (Body-Font for uppercase label links)

### Cards & Containers

**Editorial Card** (Content sections):
- Background: white
- Border: none
- Shadow: none
- Layout: image above, heading + caption below
- Image treatment: full-width within card, no rounded corners on image
- Text: FerrariSans heading (16–24px) + Body-Font caption (12–13px uppercase)

**Dark Cinematic Card** (Hero/feature sections):
- Background: \`#000000\` (Absolute Black)
- Full-bleed imagery with text overlay
- No border, no shadow — the darkness IS the container
- Text: white, positioned with careful negative space

**Vehicle Lineup** (Model carousel):
- Horizontal scrollable row of vehicle thumbnails
- Each vehicle on a neutral/white background
- Navigation: arrow buttons + dot indicators
- Background shifts to showcase the selected model's color context

### Inputs & Forms

**Newsletter Input** (Footer section):
- Background: transparent on dark surface
- Text: white
- Border: 1px solid \`#CCCCCC\`
- Placeholder: \`#969696\` (Silver Gray)
- Focus: border color transitions (standard browser focus ring)
- Label: Body-Font uppercase, 12px, 1px letter-spacing

**Cookie Consent** (Modal):
- Background: white
- Border radius: 8px (dialog)
- Shadow: \`rgb(153, 153, 153) 1px 1px 1px 0px\`
- Buttons: oversized (45px Arial), white bg with black border
- Uses standard PrimeReact/Element Plus modal framework

### Navigation
- **Desktop**: Prancing Horse logo centered at top of page, primary navigation below — not a traditional horizontal nav bar but a full-width header block on black background
- **Logo**: Centered Prancing Horse emblem (44×42px) on absolute black — the single most prominent UI element
- **Links**: FerrariSans, 13px, weight 600, white text on dark backgrounds
- **Mobile**: Hamburger collapse to vertical navigation drawer
- **Footer**: Multi-column layout on \`#303030\` (Dark Surface) with category links in Body-Font uppercase
- **No sticky nav behavior** observed — the page scrolls naturally with the header moving off-screen

### Image Treatment
- **Hero**: Full-width editorial photography on black backgrounds — concept cars in atmospheric studio lighting, editorial portraits with cinematic composition
- **Aspect ratios**: Mixed — landscape (16:9) for hero sections, near-square for portrait/driver imagery, wide panoramic for vehicle lineups
- **Full-bleed vs padded**: Hero images are full-bleed edge-to-edge; editorial content images are padded within white containers
- **Lazy loading**: Below-fold sections use progressive loading (PrimeReact framework handles this)
- **Image quality**: High-resolution photography with studio lighting — no user-generated or lifestyle imagery. Every image is art-directed

### Carousel Component
- Editorial carousel with multiple slides
- Dot indicators for slide position
- Arrow navigation (left/right) at slide edges
- Auto-advancing with manual override
- Content: mixed editorial — event recaps, model launches, racing highlights

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px (detected system base)
- **Scale**: 1px, 2px, 4px, 5px, 6px, 9px, 10px, 11.2px, 12px, 13px, 15px, 16px, 19px, 20px, 25px
- **Button padding**: 12px vertical, 10px horizontal — compact and precise
- **Section padding**: Generous vertical spacing (40–80px estimated) between major content blocks
- **Card gaps**: 16–20px between grid items
- **Footer padding**: 25px horizontal sections within the dark footer block

### Grid & Container
- **Max width**: 1920px (largest breakpoint) with content constraining at narrower widths
- **Hero**: Full-bleed on black, content centered
- **Editorial sections**: 2-column layouts with image + text, alternating sides
- **Vehicle lineup**: Horizontal scroll/carousel, 5–6 models visible at desktop width
- **Footer**: 4-column grid for link categories

### Whitespace Philosophy
Ferrari treats white space as a gallery wall. Each section — whether a concept car render on black void or a pair of F1 drivers on neutral gray — is given its own "room" of breathing space. The alternating black/white sections create a pacing rhythm: dark = immersive moment, white = editorial content, dark = immersive moment. This cadence makes scrolling feel like turning pages in a luxury publication. White space between editorial cards is moderate (not Tesla-extreme) because Ferrari is telling stories, not exhibiting single objects.

### Border Radius Scale
| Value | Context |
|-------|---------|
| 1px | Subtle softening on small inline elements (spans) |
| 2px | Default for buttons, inputs, and interactive elements — barely perceptible, razor-precision |
| 8px | Modal dialogs and overlay containers — the "softest" structural radius |
| 50% | Circular elements: carousel dots, avatar thumbnails, slider handles |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, no border | Default state for all content sections and cards |
| Level 1 (Subtle) | \`rgb(153, 153, 153) 1px 1px 1px 0px\` | Rare — cookie consent dialogs and dropdown menus |
| Level 2 (Overlay) | \`hsla(0, 0%, 7%, 0.8)\` backdrop | Modal overlays and image caption backgrounds |
| Level 3 (Border) | \`1px solid #CCCCCC\` | Input fields, form containers — depth through delineation not shadow |

### Shadow Philosophy
Ferrari's approach to elevation is nearly as flat as Tesla's, but with a different rationale. Where Tesla avoids shadows for minimalism, Ferrari avoids them because the editorial photography provides all the visual depth needed. The single shadow token (\`rgb(153, 153, 153) 1px 1px 1px 0px\`) is extremely subtle — a 1-pixel whisper used only in utilitarian contexts like consent dialogs. The site communicates hierarchy through three strategies:
1. **Surface color contrast**: Black sections vs. white sections create unmistakable layering
2. **Overlay transparency**: The \`--f-color-overlay-darker\` at 80% opacity creates depth without shadow
3. **Photographic depth**: Studio-lit car imagery with reflections, ground shadows, and atmospheric haze provides all the visual dimensionality

### Decorative Depth
- No UI gradients, no glows, no blur effects on interface elements
- The Prancing Horse logo on black creates a "floating in void" effect through pure contrast — no glow or shadow needed
- Dark-to-light section transitions are hard cuts, not gradient blends — reinforcing the editorial page-turn metaphor

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | ≤375px | Single-column, minimal padding (12px), stacked navigation, hero text scales to ~18px, full-width CTAs |
| Mobile | 376–600px | Single-column, slightly larger padding (16px), hamburger nav, body text at 13px |
| Tablet Small | 601–768px | 2-column editorial grid begins, hero images maintain full-width, footer switches to 2-column |
| Tablet | 769–960px | Full 2-column layout, carousel shows 3 vehicles, padding increases to 20px |
| Desktop | 961–1280px | Full navigation, 2-column editorial with larger imagery, vehicle lineup shows 5 models |
| Large Desktop | 1281–1920px | Maximum content width, generous whitespace, hero photography at full cinematic scale |

### Touch Targets
- Primary CTA buttons: minimum 44px height with 12px vertical padding (meets WCAG AAA 44×44px target)
- Navigation links: 13px text with 1.50 line-height and adequate spacing between items
- Carousel arrows: 44px+ touch targets at viewport edges
- Footer links: grouped with sufficient vertical spacing (16–20px) for touch accuracy

### Collapsing Strategy
- **Navigation**: Full horizontal nav collapses to centered Prancing Horse logo + hamburger menu on mobile
- **Editorial sections**: 2-column image+text layouts collapse to single-column with image stacking above text
- **Vehicle lineup**: Horizontal carousel maintains scroll behavior but reduces visible models from 5 to 2–3
- **Footer**: 4-column link grid collapses to 2-column on tablet, single-column accordion on mobile
- **Hero carousel**: Full-width at all breakpoints, dot indicators and arrows scale proportionally
- **Spacing reduction**: Section padding reduces from 40–80px (desktop) to 20–40px (mobile), maintaining proportional breathing room

### Image Behavior
- Hero images: full-bleed at all breakpoints, using \`object-fit: cover\` to maintain cinematic composition
- Editorial images: responsive within their containers, maintaining aspect ratio
- Vehicle lineup: thumbnail size scales but maintains consistent car-to-frame proportions
- Art direction: mobile crops may tighten on vehicle subjects, reducing environmental context
- Lazy loading: PrimeReact handles progressive image loading for below-fold content`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ferrari - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/ferrari: Italian performance luxury with racing red, carbon black, and premium editorial spacing."
    />
    <style>
      :root {
        --bg: #0b0b0b;
        --surface: #171717;
        --surface-warm: #23130f;
        --fg: #fffaf0;
        --fg-2: #e8dcc8;
        --muted: #a89f91;
        --meta: #ffd200;
        --border: #342a24;
        --border-soft: #241f1b;
        --accent: #dc0000;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #0f9d58;
        --warn: #ffd200;
        --danger: #ff3b30;
        --font-display: "Ferrari Sans", "Helvetica Neue", Arial, sans-serif;
        --font-body: "Ferrari Sans", "Helvetica Neue", Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 26px;
        --text-2xl: 40px;
        --text-3xl: 62px;
        --text-4xl: 88px;
        --leading-body: 1.5;
        --leading-tight: 0.98;
        --tracking-display: -0.03em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 112px;
        --section-y-tablet: 80px;
        --section-y-phone: 56px;
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 14px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 26px 80px rgba(0, 0, 0, 0.48);
        --focus-ring: 0 0 0 4px rgba(220, 0, 0, 0.30);
        --motion-fast: 130ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
        --container-max: 1240px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet: 28px;
        --container-gutter-phone: 18px;
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
        background: linear-gradient(135deg, #0b0b0b 0%, #23130f 52%, #dc0000 100%);
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
            <p class="eyebrow">Ferrari design system</p>
            <h1>Performance atelier</h1>
            <p class="lead">Rosso Corsa drama, black carbon surfaces, and luxury product restraint.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary rosso performance CTA</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Ferrari component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>carbon product plate</h3>
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
                <p>Italian performance luxury with racing red, carbon black, and premium editorial spacing.</p>
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
                  <label for="ferrari-input">Reference input</label>
                  <input id="ferrari-input" value="Ferrari system token" />
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
`};exports.default=ferrari_default;return module.exports}});
//# sourceMappingURL=client.ferrari.js.map