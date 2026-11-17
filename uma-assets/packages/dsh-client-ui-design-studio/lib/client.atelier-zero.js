
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.atelier-zero.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var atelier_zero_default={"contract":`## 1. Visual Theme & Atmosphere

A small, high-craft studio's annual report rendered as a webpage. The
canvas is warm handmade paper. Every surface earns its lines. Type does
the heavy lifting; collage imagery does the storytelling. Coral provides
the only spark of warmth; mustard, olive, and bone are quiet
companions. The page feels printed, slightly aged, and intentionally
restrained — never noisy, never neon.

- **Visual style:** editorial, collage, museum-catalog calm.
- **Posture:** asymmetric, generous, top-biased.
- **Reading rhythm:** Roman numerals (I, II, III…) walk the reader
  through the page like chapters in a printed essay.
- **Mood:** intelligent, tactile, slightly poetic, unmistakably
  international.

### Print production references

The three magazines are not interchangeable inspiration — each owns a
specific dimension of the system. When a brief asks "shift it closer to
X", consult this map before changing tokens:

- **Monocle:** warm paper stock (\`#efe7d2\`), tight body leading (~1.55),
  monospace coordinates and SHA stamps, the international metadata
  strip ("Filed under …"), the small ★ in the nav.
- **Apartamento:** surreal collage composition (plaster + architecture
  + small human figure), torn-edge textures inside the imagery, the
  rotated side notes, and the willingness to leave generous negative
  space around an image.
- **IDEA:** Roman-numeral section walks (I → VIII), oversized
  italic-serif words mixed inline with bold sans (Playfair Italic 500
  inside Inter Tight 800), hairline rules threading through method
  steps, the closing mega-word footer.

## 4. Spacing & Grid

- **Container:** max-width \`1360px\`, side padding \`64px\` desktop,
  \`44px\` at ≤1280, \`32px\` at ≤1080, \`24px\` at ≤880.
- **Section padding:** \`130px\` top+bottom desktop, \`90px\` for
  tight sections, \`80px\` ≤560.
- **Grid:** 12-column conceptual, executed as CSS Grid with
  task-specific column ratios. Hero is \`0.78fr 1.22fr\`.
- **Vertical rhythm:** 8px baseline. Allow 32–48px between
  paragraph blocks.
- **Side rails:** Two 36px-wide fixed vertical strips on the left and
  right edges of the viewport, each containing a single rotated
  text label in 10px Inter Tight 600 letter-spaced 0.42em.

## 5. Layout & Composition

- **Top metadata strip** is mandatory: a single horizontal bar above
  the nav containing the volume/issue, a "Filed under …" badge, and a
  live-status pulse with version + locale. Inter Tight 10.5px,
  ink-faint, 1px ink-line border-bottom.
- **Section rule** is mandatory at the top of every section:
  \`[Roman.] · [meta middle] · [page-of-008]\`.
- **Image annotations**: every featured image carries 4 corner
  brackets (1px hairlines, 22×22), at least 1 plate number
  ("Plate Nº 08"), and a coordinate or SHA.
- **Hero must extend above the fold** at 1440×900 minimum. The image
  fills the viewport vertically (\`calc(100vh - 160px)\`), aligned to
  the right edge.
- **Method sections** must use a 4-step layout with a horizontal
  hairline running through the step heads at the same Y, with
  \`→\` separators between titles.

## 6. Components

### Buttons

- **Primary:** coral fill \`#ed6f5c\`, white label, \`999px\` radius,
  \`14px 22px\` padding, with a white arrow \`↗\` SVG at 14px and a
  coral 0,14,26,-16 rgba shadow.
- **Ghost:** transparent, \`1px solid rgba(21,20,15,0.2)\` border,
  ink label, same radius and padding.

### Cards

- **Bone-fill cards** (\`#f7f1de\`), 18px radius, 28×26 padding,
  inset 1px ink-at-6% ring + 30/60/-30/15 ambient shadow.
- Each card has a \`01–04\` italic serif num plus a tag eyebrow on
  the same row.
- A bottom-right 28px circular arrow mark turns coral on hover.

### Pill filters

- 10×18 padding, 999px, \`1px solid line\` border, transparent.
- Active state: coral fill, white label, count separator opacity 0.7.

### Stat rings

- 32–34px circular dashed rings carrying a 2-digit number; one ring
  per row may be coral-stroked to denote the highlighted stat.

### Page numbers / index card

- Hero artwork carries a small bordered card on the right edge with
  \`01–04\` index entries. The current entry uses bold ink; the rest
  ink-faint. Each item prefixes the digit with a coral \`01\` token.

### Side rails

- Fixed 36px vertical strips at left + right edges, hidden below
  1280px. Each contains rotated 10px Inter Tight uppercase text
  letter-spaced 0.42em, never wraps.

### Roman section rules

Every section opens with a \`.sec-rule\`: top hairline 1px, then a
flex row containing \`[Roman]\`, a centered metadata cluster, and
the page-of-008 counter on the right.

## 7. Motion & Interaction

- **Pulse dot:** 6×6 coral circle at top metadata bar and footer,
  \`pulse 2.4s ease-in-out infinite\` between 1.0 and 0.35 opacity.
- **Card hover:** translateY(-3px), arrow mark fills coral.
- **Button hover:** translateY(-1px), darker coral fill.
- **Pill hover:** ink-at-4% wash.
- **Transitions:** \`0.18s ease\` everywhere; never longer than \`0.25s\`.
- **No parallax, no scroll-jacking, no auto-rotators.** Editorial
  pages do not animate themselves at the user.

## 10. Responsive Behavior

- **Desktop ≥ 1280px:** full container, two side rails visible,
  metadata strip shows all three columns.
- **Laptop 1080–1279px:** side rails hidden, container 32–44px
  padding, metadata strip's middle column collapses.
- **Tablet 880–1079px:** hero / about / capabilities / testimonial
  / cta grids collapse to 1 column at 50px gap. Method becomes 2×2,
  the connecting hairline is removed. Nav links + brand-meta hide;
  brand-mark + CTA remain.
- **Phone < 560px:** all multi-column grids become 1 col;
  section padding drops to 80px.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Atelier Zero - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/atelier-zero: independent studio identity with off-white canvas, sharp black type, and gallery restraint." />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f7f7f7;
        --surface-warm: #eeeeee;
        --fg: #111111;
        --fg-2: #3a3a3a;
        --muted: #707070;
        --meta: #111111;
        --border: #d9d9d9;
        --border-soft: #eeeeee;
        --accent: #111111;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #168a46;
        --warn: #b7791f;
        --danger: #c53030;
        --font-display: "Helvetica Neue", Arial, sans-serif;
        --font-body: "Helvetica Neue", Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 54px;
        --text-4xl: 76px;
        --leading-body: 1.52;
        --leading-tight: 1.06;
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
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 16px 40px rgba(0, 0, 0, 0.10);
        --focus-ring: 0 0 0 3px rgba(17, 17, 17, 0.18);
        --motion-fast: 150ms;
        --motion-base: 240ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { min-height: 100vh; background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: var(--text-base); line-height: var(--leading-body); -webkit-font-smoothing: antialiased; }
      .page { min-height: 100vh; background: linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%); }
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) { .container { padding-inline: var(--container-gutter-tablet); } section { padding-block: var(--section-y-tablet); } }
      @media (max-width: 639px) { .container { padding-inline: var(--container-gutter-phone); } section { padding-block: var(--section-y-phone); } }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-display); }
      h1 { max-width: 840px; font-size: var(--text-4xl); font-weight: 760; }
      h2 { font-size: var(--text-3xl); font-weight: 700; }
      h3 { font-size: var(--text-xl); font-weight: 700; }
      .eyebrow { color: var(--meta); font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      .lead { max-width: 640px; color: var(--fg-2); font-size: var(--text-lg); }
      .hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr); gap: var(--space-8); align-items: center; }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-block-start: var(--space-6); }
      .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 var(--space-5); border: 1px solid transparent; border-radius: var(--radius-md); font: 700 var(--text-sm) / 1 var(--font-body); color: inherit; text-decoration: none; cursor: pointer; transition: background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard); }
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
            <p class="eyebrow">Atelier Zero design system</p>
            <h1>Independent studio atelier</h1>
            <p class="lead">Minimal creative studio pages with quiet type, object cards, and restrained editorial space.</p>
            <div class="actions" aria-label="Reference actions"><a class="btn btn-primary" href="#">Primary action</a><a class="btn btn-secondary" href="#">Secondary action</a></div>
          </div>
          <article class="panel" aria-label="Atelier Zero component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row"><div class="mini-card"><h3>Palette</h3><p>independent studio identity with off-white canvas, sharp black type, and gallery restraint.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div><div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same system signal.</p><div class="field"><label for="atelier-zero-input">Reference input</label><input id="atelier-zero-input" value="Atelier Zero system token" /></div></div></div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use system-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=atelier_zero_default;return module.exports}});
//# sourceMappingURL=client.atelier-zero.js.map