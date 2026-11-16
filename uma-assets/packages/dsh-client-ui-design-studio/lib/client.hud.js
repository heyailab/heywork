
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.hud.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var hud_default={"contract":`## 1. Visual Theme & Atmosphere

A **combat pilot's glass cockpit** — everything readable in a split second, in any light condition, under any G-load. The HUD projects critical flight data directly into the pilot's line of sight so they never have to look down. Translucency and glow replace depth and shadow. Every element is functional or it doesn't exist.

| Element | Hex | Role |
|---------|-----|------|
| Background | \`#0A0A0A\` | Near-black, primary canvas |
| Surface | \`#111316\` | Elevated panels, card backgrounds |
| Border | \`#1E2328\` | Subtle panel separation |
| Primary | \`#00FF41\` | Active readouts, all data values |
| Secondary | \`#7FFF00\` | Standby/dimmed values, inactive fields |
| Tertiary | \`#5A9A5A\` | Grid lines, tick marks, reference arcs |
| Warning | \`#FFB800\` | Caution, system advisories |
| Alert | \`#FF3B3B\` | Critical warnings, fault indicators |

*Readings must be unambiguous at 200 knots in Instrument Meteorological Conditions.*

### Use Cases

HUD is purpose-built for:
- **Flight simulation UIs** — combat sims, civil aviation trainers, helicopter hoist operations
- **Telemetry dashboards** — real-time velocity, altitude, heading overlays
- **Command-and-control displays** — drone operator screens, ISR stations
- **Any high-speed, zero-ambiguity data overlay**

### Prior Art

F-16 Fighting Falcon HUD, Apache AH-64 attack helicopter integrated display, F-35 helmet-mounted display system, Garmin G1000 flight deck. All share: phosphor green primary, decluttered minimalism, and information hierarchy driven by operational urgency.

## 4. Component Stylings

### Data Readout

Displays a single data value with label. Always uses \`--data-primary\` color.



### Status Indicator

Dot or bar that reflects system state. Colors map to operational states.



### Grid Lines

Reference marks for spatial orientation. Thin lines in \`--data-tertiary\`.

## 5. Layout Principles

HUDs are overlay systems — they display over a visual field. The layout is absolute-positioned overlays on a transparent or dark background. Information density is high; whitespace is used to separate data clusters, not for aesthetics.

Key structural patterns:
- Grid lines reference the center of the display (crosshair)
- Data readouts cluster by update frequency (altitude updates slower than airspeed)
- Warning states override all other information layers

## 6. Depth & Elevation

HUD overlays use opacity and glow rather than elevation shadows. Panels are distinguished by border color and subtle surface shifts, not drop shadows. The HUD exists in a single visual plane.

## 8. Responsive Behavior

HUD overlays are viewport-relative. On smaller viewports, data clusters compress proportionally. Critical readouts (speed, altitude, heading) remain visible at all sizes; secondary indicators hide or minimize. The layout uses a 12-column grid with absolute-positioned data panels anchored to screen edges.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HUD - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/hud: HUD interface language with dark transparent panels, cyan telemetry, and compact status readouts." />
    <style>
      :root {
        --bg: #090b12;
        --surface: #121722;
        --surface-warm: #1b2233;
        --fg: #f8fafc;
        --fg-2: #cbd5e1;
        --muted: #94a3b8;
        --meta: #60a5fa;
        --border: #2a3447;
        --border-soft: #1d2636;
        --accent: #60a5fa;
        --accent-on: #06101d;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #22c55e;
        --warn: #fbbf24;
        --danger: #fb7185;
        --font-display: "IBM Plex Mono", ui-monospace, monospace;
        --font-body: "IBM Plex Mono", ui-monospace, monospace;
        --font-mono: "IBM Plex Mono", ui-monospace, monospace;
        --text-xs: 11px;
        --text-sm: 12px;
        --text-base: 14px;
        --text-lg: 16px;
        --text-xl: 20px;
        --text-2xl: 28px;
        --text-3xl: 40px;
        --text-4xl: 56px;
        --leading-body: 1.45;
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
        --section-y-desktop: 80px;
        --section-y-tablet: 60px;
        --section-y-phone: 42px;
        --radius-sm: 10px;
        --radius-md: 16px;
        --radius-lg: 24px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 24px 72px rgba(0, 0, 0, 0.42);
        --focus-ring: 0 0 0 4px rgba(96, 165, 250, 0.28);
        --motion-fast: 100ms;
        --motion-base: 180ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1280px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { min-height: 100vh; background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: var(--text-base); line-height: var(--leading-body); -webkit-font-smoothing: antialiased; }
      .page { min-height: 100vh; background: radial-gradient(circle at 80% 8%, rgba(96, 165, 250, 0.24), transparent 34%), #090b12; }
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
  </head>
  <body>
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">HUD design system</p>
            <h1>Heads-up display overlay</h1>
            <p class="lead">Transparent tactical panels, scanning metrics, and high-contrast status overlays.</p>
            <div class="actions" aria-label="Reference actions"><a class="btn btn-primary" href="#">Primary action</a><a class="btn btn-secondary" href="#">Secondary action</a></div>
          </div>
          <article class="panel" aria-label="HUD component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row"><div class="mini-card"><h3>Palette</h3><p>HUD interface language with dark transparent panels, cyan telemetry, and compact status readouts.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div><div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same system signal.</p><div class="field"><label for="hud-input">Reference input</label><input id="hud-input" value="HUD system token" /></div></div></div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use system-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=hud_default;return module.exports}});
//# sourceMappingURL=client.hud.js.map