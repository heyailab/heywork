
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.wired.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var wired_default={"contract":`## 1. Visual Theme & Atmosphere

WIRED's homepage feels like a printed broadsheet that someone has plugged into a wall socket. The grid is dense, the rules are thin, the type is loud, and almost every surface is paper-white or pure black with no rounded corners and no decoration that doesn't earn its place. Image rectangles butt directly against headlines, hairline dividers separate stories the way pica rules separate columns in a real magazine, and the only colors that aren't grayscale come from the photography itself. There is no "card with shadow" anywhere — the entire layout is held together by typographic weight and the discipline of rules and whitespace, the same way a Condé Nast print page would be assembled in a paste-up room.

The signature move is the **typographic stack**: a brutally large custom serif (WiredDisplay) for the main headline, a humanist serif (BreveText) for body and decks, a geometric sans (Apercu) for UI affordances, and a hard mono uppercase (WiredMono) for the kickers, eyebrows, and timestamps that mark every story. That mono kicker — usually black caps with letter-spacing wide enough to read as a Geiger-counter tick — is what makes a WIRED page instantly recognizable from across the room.

There is exactly one accent color that matters: a saturated link blue (\`#057dbc\`) that lights up underlined hover states like a CRT scanline. Everything else is black, paper white, and two grays — the design's confidence comes from refusing to invent more.

**Key Characteristics:**
- Newsstand-density editorial grid: rules and whitespace, never cards or shadows
- Custom serif display + technical mono kickers — the Condé-Nast-meets-engineering-lab voice
- Strictly square corners on every image, container, and ribbon (only icon buttons are circular)
- 2px hard black borders on buttons and links — printerly, not webby
- Mono ALL-CAPS eyebrows on every story with wide tracking (0.9–1.2px)
- Single ink-blue accent for links; everything else lives in pure grayscale
- Dark theme = the *footer*, not the page; the page itself is committed paper-white

## 4. Component Stylings

### Buttons

**Primary CTA — Black Outline ("Subscribe")**
- Background: \`#ffffff\` (Paper White)
- Text: \`#000000\` (WIRED Black), Apercu 16px / 700 / 0.3px tracking
- Border: \`2px solid #000000\` — the printerly hard rule, not a 1px UI border
- Border radius: \`0\` (square corners)
- Padding: vertical ≈ 12–14px, horizontal ≈ 24px
- Hover: background flips to \`#000000\`, text flips to \`#ffffff\` — pure inversion, no easing on the rule
- Transition: ~150ms color/background only

**Secondary — Inverted ("Sign In", in dark zones)**
- Background: \`#000000\`
- Text: \`#ffffff\`
- Border: \`2px solid #ffffff\`
- Same square corners, same inversion-on-hover behavior

**Tertiary — Underlined Inline Link**
- Treated as a button when wrapped in nav: text \`#1a1a1a\`, underline always present, hover swaps color to \`#057dbc\` while keeping the underline
- No padding, no border, no background — this is editorial linking, not UI

**Pill / Round Icon Button**
- Border radius: \`50%\` (the only circular shape on the site)
- Used exclusively for icon controls (search, account, social) in the header
- Border: 1px solid \`#757575\` or no border depending on placement
- Size: ~32–40px square footprint

**Tag / Span Pill**
- Border radius: \`1920px\` (effectively a full pill — only used inside text spans like "BREAKING")
- Background: solid black or red accent depending on context
- Text: white, mono 11–12px caps

### Cards & Containers
- **Cards do not exist.** WIRED's homepage has no rounded boxes, no shadows, no surface elevation.
- A "story tile" is just an image rectangle stacked above a kicker + headline + deck, separated from neighbors by **1px hairline rules** (\`#000000\` or \`#4a5568\`) or by raw whitespace.
- The closest thing to a "container" is the black ribbon section header (e.g., "MOST POPULAR") — a full-bleed black bar with white WiredMono caps, no padding refinement, no rounded ends.
- Hover behavior on a story tile: the headline link text shifts from \`#1a1a1a\` to \`#057dbc\` and the underline appears. The image itself does not zoom, lift, or shadow.

### Inputs & Forms
- **Newsletter input**: rectangular, \`2px solid #000000\` border, \`0\` radius, white background, Apercu 16px placeholder.
- **Focus**: border stays 2px black, no glow ring, no color change — focus is signaled by the blinking caret only. (Add a 2px outset for accessibility if you ship this — WIRED's own implementation under-serves keyboard users here.)
- **Error**: text label below in \`#e53e3e\` (Fides cookie overlay borrows this red — use sparingly).
- **Disabled**: text drops to \`#a0aec0\`, border softens to \`#757575\`.

### Navigation
- **Top utility bar**: black (\`#000000\`) full-bleed strip, ~32–40px tall, mono caps links separated by hairline dividers, \`#ffffff\` text, hover → \`#057dbc\`.
- **Main nav**: paper-white (\`#ffffff\`) row beneath the bug logo, Apercu 14–16px / regular, hover → \`#057dbc\` underline.
- **Logo**: WIRED bug, ~209×42px, centered or left-aligned, never recolored, always pure black on white.
- **Mobile**: nav collapses to a hamburger left of the bug logo. Section nav becomes a slide-down drawer of mono caps links.
- **Transition**: hover color swaps are instant or ~120ms; no bouncy easing — editorial restraint.

### Image Treatment
- **Aspect ratios**: predominantly 16:9 for hero images, 4:3 for grid story tiles, 1:1 for smaller "Most Popular" thumbnails.
- **Corners**: ALWAYS 0 radius. Square. The only rounded image is a circular author avatar (50%).
- **Full-bleed**: hero photographs run edge-to-edge of the column they occupy; no inset, no border.
- **Captions**: BreveText 12.73px / 700 with relaxed 2.20 line-height — placed directly under the image, italicized in some templates.
- **Hover**: no zoom, no opacity dip — only the headline below the image responds.
- **Lazy loading**: standard \`loading="lazy"\` on all below-the-fold imagery.

### Editorial Ribbons & Section Markers
- Black bar (\`#000000\`) full-bleed with white WiredMono uppercase label inside (e.g., "MOST POPULAR", "BACKCHANNEL", "GEAR").
- Height ~32–40px, no padding refinement, no rounded ends.
- Sometimes a thin 2px black rule sits directly above or below to double-frame the bar.

### Numbered Lists ("Most Popular")
- A vertical list of stories prefixed with WiredDisplay numerals (01, 02, 03…) at ~40–48px, sitting tight against the headline they label.
- Hairline rule between each item, no other decoration.

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale**: 1px (hairline), 4px, 8px, 12px, 14.11px, 15px, 16px, 24px, 25.46px, 29.66px, 32px, 40px, 48px, 64px.
- **Section padding**: typically 32–48px vertical between major editorial blocks.
- **Card padding**: there are no cards; the gutter between story tiles is 24–32px horizontally and 16–24px vertically.
- **Inline spacing**: kickers sit ~4–8px above headlines; decks sit ~8–12px below headlines; bylines/timestamps another 8–12px below the deck.

### Grid & Container
- **Max width**: ~1280–1600px on desktop (the dembrandt sweep detected breakpoints up to 1600px), centered with generous outer margins.
- **Column patterns**: 12-column grid that resolves into 2/3/4 column story arrangements depending on module — feature blocks often run a "1 large + 2 small" pattern with hairline rules between each.
- **Column gutters**: ~24–32px, separated by hairline \`#000000\` or \`#4a5568\` 1px rules where the editorial logic demands a "page-fold" feel.

### Whitespace Philosophy
WIRED treats whitespace the way a magazine art director treats margin: it's the silence around the type, not a styling choice. The page never breathes excessively (this is not Stripe or Apple); it breathes *editorially* — enough room to keep adjacent stories from arguing, never enough to suggest there's nothing on the page. If an empty area looks like it could fit another headline, that empty area is doing its job.

### Border Radius Scale
- \`0\` — every container, every image, every button, every input. The default.
- \`1920px\` — only inside text spans that need to look like a full pill ("BREAKING", "LIVE").
- \`50%\` — only on round icon buttons and circular author avatars.

There are exactly three radii on the entire site, and two of them are reserved for non-rectangular shapes. This is the **strictest** corner discipline of any major editorial property.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow, no border | Default editorial surface — text on paper |
| 1 | 1px solid \`#e2e8f0\` hairline \`<hr>\` | Quiet section divider, almost invisible |
| 2 | 1px solid \`#000000\` hairline rule | Editorial column divider — printerly, structural |
| 3 | 2px solid \`#000000\` border | Buttons, inputs, ribbons — interactive emphasis |
| 4 | Black ribbon bar (\`#000000\` fill) | Section labels — the most "elevated" surface on the page |
| 5 | Inverted footer block | Dark \`#1a1a1a\` zone with white type — the only inversion |

WIRED's depth philosophy is **flat by religion**. There is exactly one shadow token in the entire site (a default \`0 0 0 transparent\` placeholder) and no \`box-shadow\` is applied to story tiles, headers, modals, or cards. Depth is communicated by **rule weight** (1px hairline → 2px hard rule → solid black ribbon), not by simulated lighting.

### Decorative Depth
None. No gradients, no glow, no halos, no scrim overlays beyond the standard photo caption gradient. WIRED earns its visual interest from photography and typographic contrast, not from chrome.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <375px | Single column, hamburger nav, all hero modules collapse to stacked image-headline-deck |
| Mobile | 375–767px | Single column, story grid becomes vertical scroll, "Most Popular" numbers shrink to 32px |
| Tablet | 768–1023px | 2-column story grid, sidebar collapses below main feed, nav becomes condensed |
| Desktop | 1024–1599px | Full editorial 3–4 column grid, sidebar restored, max headline scale active |
| Large Desktop | ≥1600px | Page caps at ~1600px container, whitespace expands at the margins, no further scaling |

The dembrandt sweep detected an unusual range of intermediate breakpoints (1280, 1025, 1024, 1023, 768, 767, 667, 599, 570, 569, 480, 425, 375, 320, 319) — Wired's grid micro-tunes at almost every common viewport, especially around the iPad portrait/landscape boundary.

### Touch Targets
- Primary button: ~44x44px minimum (16px text + 12–14px vertical padding satisfies WCAG AAA).
- Mono caps links in the utility bar are smaller (~32px tall) — WIRED's own implementation undershoots WCAG here. **For derivative work, pad mono nav links to 44px.**
- Round icon buttons in the header are ~40px circles, comfortably touch-friendly.

### Collapsing Strategy
- **Nav**: utility bar drops below 768px; main nav collapses into hamburger drawer. Bug logo recenters on mobile.
- **Grid**: 4-col → 3-col → 2-col → 1-col as viewport tightens. Hairline rules persist between every column count, so the printerly feel survives the collapse.
- **Spacing**: vertical rhythm tightens from 48px → 32px → 24px between modules on mobile. Horizontal page padding shrinks from 64px → 24px → 16px.
- **Type**: WiredDisplay hero scales from 64px to ~36–42px on mobile, headlines from 26px to ~22px, kickers stay locked at 12–13px (mono caps don't scale down further or they become unreadable).

### Image Behavior
- All images are responsive raster (\`srcset\`-driven), aspect ratios preserved: 16:9 hero, 4:3 mid, 1:1 thumbnails.
- No art-direction swaps — the same crop scales across breakpoints.
- \`loading="lazy"\` on all below-the-fold imagery, \`eager\` on the hero only.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>WIRED - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/wired: authoritative technology journalism with monochrome discipline and sharp red alerts."
    />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f2f2f2;
        --surface-warm: #fff0f0;
        --fg: #000000;
        --fg-2: #333333;
        --muted: #666666;
        --meta: #e10600;
        --border: #d0d0d0;
        --border-soft: #e8e8e8;
        --accent: #e10600;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #0f8a3b;
        --warn: #f5a400;
        --danger: #c40000;
        --font-display: "Druk Wide", "Arial Black", Impact, sans-serif;
        --font-body: "Exchange", Georgia, serif;
        --font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 17px;
        --text-lg: 20px;
        --text-xl: 28px;
        --text-2xl: 44px;
        --text-3xl: 68px;
        --text-4xl: 96px;
        --leading-body: 1.55;
        --leading-tight: 0.92;
        --tracking-display: -0.02em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 88px;
        --section-y-tablet: 64px;
        --section-y-phone: 44px;
        --radius-sm: 0px;
        --radius-md: 0px;
        --radius-lg: 0px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 16px 40px rgba(0, 0, 0, 0.14);
        --focus-ring: 0 0 0 4px rgba(225, 6, 0, 0.24);
        --motion-fast: 120ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 34px;
        --container-gutter-tablet: 26px;
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
        background: linear-gradient(135deg, #ffffff 0%, #f2f2f2 70%, #fff0f0 100%);
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
            <p class="eyebrow">WIRED design system</p>
            <h1>Future-culture dossier</h1>
            <p class="lead">Black-and-white editorial grid, red urgency, and dense story modules.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary red editorial block</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="WIRED component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>monochrome story cell</h3>
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
                <p>authoritative technology journalism with monochrome discipline and sharp red alerts.</p>
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
                  <label for="wired-input">Reference input</label>
                  <input id="wired-input" value="WIRED system token" />
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
`};exports.default=wired_default;return module.exports}});
//# sourceMappingURL=client.wired.js.map