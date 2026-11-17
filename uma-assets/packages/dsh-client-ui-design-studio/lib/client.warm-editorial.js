
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.warm-editorial.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var warm_editorial_default={"contract":`## Visual Theme & Atmosphere
Warm, unhurried, magazine-like. Think "a New Yorker interview column online." Generous whitespace, long-form readability, restrained chrome. Playful but never novelty.

## Component Stylings
- **Buttons:** flat fill, 12px radius, 14px padding-block, 20px padding-inline. Primary = terracotta fill, off-white label. Secondary = outlined 1px foreground, transparent fill.
- **Cards:** off-white background, 1px forest-at-8%-opacity border, 16px radius, 24–32px internal padding. No shadow except hover (y+2px, blur 16, foreground-at-6%).
- **Inputs:** underline only (no box), 1px muted baseline, terracotta baseline on focus, 16px vertical padding.
- **Links:** terracotta, 1px terracotta-at-40% underline, no underline on hover (swap for terracotta-at-8% background).

## Layout Principles
- 12-column grid, 1200px max-width, 24px gutters.
- Hero sections: 72vh minimum, 120vh maximum. Content top-biased, never centered vertically.
- Body sections: 80px top+bottom spacing at desktop; 48px at tablet; 32px at phone.
- One accent color per screen. If a page has a terracotta hero, secondary CTAs are foreground-only, not forest.

## Depth & Elevation
Minimal. Only two elevation levels:
- **Flat (0):** everything by default.
- **Raised (1):** cards on hover, dropdown menus, floating CTAs. 2px y-offset, 16px blur, foreground at 6% opacity.
No shadows on inputs. No shadows on the hero. No neumorphism, no glassmorphism.

## Responsive Behavior
- **Desktop ≥ 1024px:** 12-col grid, full hero heights, side-by-side columns.
- **Tablet 640–1023px:** 8-col grid; hero drops to 60vh; columns stack at 3+.
- **Phone < 640px:** 4-col grid; single-column layout; hero drops to 50vh; all padding -33%.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Warm Editorial - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/warm-editorial: warm editorial system with cream canvas, serif display, and calm publication rhythm." />
    <style>
      :root {
        --bg: #fbf6ee;
        --surface: #fffdf8;
        --surface-warm: #f1e3cf;
        --fg: #201914;
        --fg-2: #4c4037;
        --muted: #7a6d63;
        --meta: #9b5b32;
        --border: #ded2c3;
        --border-soft: #eee4d7;
        --accent: #9b5b32;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #4f8a4f;
        --warn: #c9822f;
        --danger: #b33a3a;
        --font-display: Georgia, "Times New Roman", serif;
        --font-body: Inter, system-ui, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 17px;
        --text-lg: 20px;
        --text-xl: 28px;
        --text-2xl: 42px;
        --text-3xl: 64px;
        --text-4xl: 88px;
        --leading-body: 1.62;
        --leading-tight: 1;
        --tracking-display: -0.025em;
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
        --radius-sm: 10px;
        --radius-md: 16px;
        --radius-lg: 24px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 20px 52px rgba(32, 25, 20, 0.12);
        --focus-ring: 0 0 0 4px rgba(155, 91, 50, 0.24);
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
      .page { min-height: 100vh; background: linear-gradient(135deg, #fbf6ee 0%, #fffdf8 58%, #f1e3cf 100%); }
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
            <p class="eyebrow">Warm Editorial design system</p>
            <h1>Warm editorial publication</h1>
            <p class="lead">Soft magazine pages, warm ink, and generous long-form reading components.</p>
            <div class="actions" aria-label="Reference actions"><a class="btn btn-primary" href="#">Primary action</a><a class="btn btn-secondary" href="#">Secondary action</a></div>
          </div>
          <article class="panel" aria-label="Warm Editorial component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row"><div class="mini-card"><h3>Palette</h3><p>warm editorial system with cream canvas, serif display, and calm publication rhythm.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div><div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same system signal.</p><div class="field"><label for="warm-editorial-input">Reference input</label><input id="warm-editorial-input" value="Warm Editorial system token" /></div></div></div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use system-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=warm_editorial_default;return module.exports}});
//# sourceMappingURL=client.warm-editorial.js.map