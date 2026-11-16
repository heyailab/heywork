
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.cloudflare-kumo.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var cloudflare_kumo_default={"contract":"## Visual principles and atmosphere\n\nKumo interfaces are quiet, compact, and operational. Start with a near-white canvas (`--bg: oklch(98.75% 0 0)`) and white component surfaces (`--surface: #ffffff`). Use the recessed neutral (`--surface-warm: oklch(96% 0 0)`) for segmented controls, table tints, or nested regions; despite the OpenDesign slot name, this surface is neutral rather than warm.\n\nBuild depth with surface hierarchy, rings, and restrained shadows instead of decorative gradients. Kumo's official order is canvas → base component → elevated layer → recessed/tinted region. A `LayerCard`-style surface uses an `8px` radius, a semantic ring, and a small shadow. Keep related labels, descriptions, and actions tightly grouped; allow larger gaps only between separate tasks or sections.\n\nPrefer sentence-case headings, short action-oriented labels, and content-first composition. Avoid uppercase headings, altered tracking, bold-heavy typography, oversized marketing treatments, and stacked cards inside cards. Inline icons should align with the first line of adjacent text, especially when labels can wrap.\n\n## Semantic color system and themes\n\nChoose tokens by role, never by the hue you happen to want. The light-mode bindings are:\n\n| OpenDesign token | Kumo role | Value |\n| --- | --- | --- |\n| `--bg` | canvas | `oklch(98.75% 0 0)` |\n| `--surface` | base component | `#ffffff` |\n| `--surface-warm` | recessed compatibility tier | `oklch(96% 0 0)` |\n| `--fg` | default text | `oklch(21% 0.006 285.885)` |\n| `--muted` | subtle text | `oklch(55.6% 0 0)` |\n| `--border` | line beside elevation | `oklch(14.5% 0 0 / 0.1)` |\n| `--border-soft` | hairline between flat surfaces | `oklch(93.5% 0 0)` |\n| `--accent` | brand background | `oklch(0.5772 0.2324 260)` |\n| `--accent-hover` | brand-background hover | `oklch(48.8% 0.243 264.376)` |\n| `--success` | success indicator | `oklch(59.6% 0.145 163.225)` |\n| `--warn` | warning indicator | `oklch(73.9% 0.177 58.2)` |\n| `--danger` | error/destructive indicator | `oklch(63.7% 0.237 25.331)` |\n\nSet `data-mode=\"dark\"` to follow Kumo's native mode hook. In generated OpenDesign artifacts, `data-theme=\"dark\"` resolves the same override. Dark mode changes semantic values rather than adding `dark:` utility variants: the canvas becomes `oklch(10% 0 0)`, component surfaces become `oklch(17% 0 0)`, primary text becomes `oklch(97% 0 0)`, and the line/hairline pair becomes `oklch(32% 0 0)` / `oklch(26.9% 0 0)`.\n\nDo not substitute Cloudflare orange (`#f6821f`) for every primary control. Kumo distinguishes its orange brand text role from the blue semantic brand background used by primary actions. Use semantic status colors only when meaning is present, and use tints or neutral surfaces behind longer status copy rather than flooding an interface with solid status color.\n\n## Typography and hierarchy\n\nUse Inter for display and body text, with system sans-serif fallbacks. Use the system monospace stack for code, identifiers, configuration keys, and tabular technical data. Inline monospace should be optically smaller than surrounding prose, following Kumo's guidance of roughly `0.9em`.\n\nThe base Kumo text scale is deliberately compact:\n\n| Token | Size | Typical role |\n| --- | --- | --- |\n| `--text-xs` | `12px` | captions, compact labels |\n| `--text-sm` | `13px` | dense secondary controls |\n| `--text-base` | `14px` | body, buttons, data, interactables |\n| `--text-lg` | `16px` | small heading or emphasized content |\n| `--text-xl` | `20px` | dialog or card title |\n| `--text-2xl` | `24px` | section heading |\n| `--text-3xl` | `30px` | page heading |\n| `--text-4xl` | `36px` | OpenDesign compatibility ceiling |\n\nBody leading is `1.5`; display leading is `1.2`. Keep `--tracking-display: 0`: the official Kumo design skill explicitly avoids manual tracking. Use weight `600` for headings, `500` for emphasized inline text and control labels, and `400` for ordinary copy. Do not use `700` as the default emphasis mechanism.\n\n## Spacing, density, radius, and layout\n\nKumo components use compact Tailwind utility spacing on a `4px` rhythm. The shared bindings are `4`, `8`, `12`, `16`, `20`, `24`, `32`, and `48px`. Related text commonly uses `4–8px`; control clusters use `8–12px`; card interiors use `16px`; distinct task groups use `24–32px`. Apply slightly less vertical than horizontal padding when that produces better optical alignment, such as `20px` horizontal with `16px` vertical.\n\nControl radii map to Kumo's `rounded-sm`, `rounded-md`, and `rounded-lg` patterns: `4px`, `6px`, and `8px`; reserve `9999px` for pills, circular icon actions, and status shapes. Nested shapes within `8px` of each other must use concentric radii: outer radius equals inner radius plus the intervening padding.\n\nKumo does not publish global section or container tokens, so the following are explicitly OpenDesign compatibility bindings rather than upstream claims: section spacing is `64px` desktop, `48px` tablet, and `32px` phone; the container cap is `1200px` with `24px`, `16px`, and `12px` gutters. Treat these as starting values for product dashboards, not as Cloudflare layout specifications.\n\n## Components and composition patterns\n\n- **Buttons:** Default to the secondary style for ordinary actions. Reserve the primary blue treatment for the highest-emphasis action and use destructive styling only for consequential actions. Base controls are `36px` high with `8px` radii; Kumo also supports compact `20px` and `26px` sizes and a `40px` large size. Icon-only buttons require an accessible label.\n- **Fields and inputs:** Pair controls with visible labels when possible. Inputs and buttons of the same size should align. Error content must be associated with its field, and placeholder text must not replace an accessible name.\n- **Layered cards:** Use a base surface with a line ring and small shadow, or compose a restrained elevated header with a base content layer. Never nest `LayerCard` treatments inside one another.\n- **Dialogs:** Keep dialogs mounted and drive visibility through open state so entry and exit motion can complete. Use `role=\"alertdialog\"` for destructive confirmations and critical acknowledgements; use an ordinary dialog for forms and general content. Kumo's documented widths range from `288px` to `768px`.\n- **Navigation and disclosure:** Keep active, hover, and focus states distinct. Preserve component-native keyboard behavior for menus, tabs, selects, command palettes, and collapsibles.\n- **Loading:** Disable a loading action, retain its label when useful, and show a labeled spinner. Use skeleton lines for content-shaped loading, with stable dimensions to prevent layout shift.\n\nUse semantic HTML before visual styling. A button performs an in-place action; a link navigates. Heading appearance must not determine heading level: choose `h1`–`h6` according to the document outline.\n\n## Interaction, focus, disabled, and loading states\n\nEvery interactive element needs separate default, hover, active, focus-visible, disabled, and loading behavior. For a primary action, use `--accent`, switch immediately to `--accent-hover` on hover, and use the same value for active because Kumo does not publish a separate brand-active token. White (`--accent-on`) remains the label color on the saturated action surface.\n\nUse `--focus-ring` as a visible `2px` ring. Its light value is Kumo focus near-black (`oklch(15% 0 0)`); its dark value is the light neutral `oklch(93.5% 0 0)`. Do not rely on a color-only hover change as the keyboard indicator. Disabled controls retain their form, remove interaction, use an appropriate inactive/subtle foreground, and must not be communicated by opacity alone when the state would become ambiguous.\n\nHover color changes are immediate in Kumo's design guidance; do not attach the motion tokens to simple color swaps. Use `150ms` for short opacity or transform state changes and `250ms` with `cubic-bezier(0.77, 0, 0.175, 1)` for larger disclosure or sidebar movement. Loading spinners need an accessible status label, and skeletons should preserve the eventual content footprint.\n\n## Data visualization and chart color use\n\nSelect a chart palette by the data task:\n\n- **Semantic:** use attention `#FC574A`, warning `#F8A054`, success `#00A63E`, neutral `#B9D6FF`, disabled `#CBCBCB`, and skeleton `#DDDDDD` when data has status, severity, or health meaning.\n- **Categorical:** for nominal series, use the ordered light palette `#4290F0`, `#F5B647`, `#E8649D`, `#8D58EE`, `#50C3B6`, and `#D37536`. Cycle by modulo only when more series are unavoidable; prefer showing a small number of important categories.\n- **Sequential:** for one magnitude, use `#E1EAF4`, `#8EBCF6`, `#4290F0`, `#0E58B4`, and `#03254F` from low to high in light mode. Dark mode reverses prominence so higher values remain visually strongest.\n\nDo not use categorical color for ordered magnitude or semantic color for unrelated series. Color alone must not encode a distinction: pair line series with dashes or markers, provide labels and legends, and ensure patterns remain legible when colors are perceived similarly.\n\n## Motion and reduced motion\n\nMotion should explain a state change, not decorate the interface. Kumo uses `150ms` transitions for dialogs, switches, popovers, and small state changes, while its sidebar defaults to `250ms` with the easing stored in `--ease-standard`. Keep collapsing content at a stable intrinsic width or height so text does not reflow during the exit.\n\nRespect `prefers-reduced-motion: reduce`. This package sets `--motion-fast` and `--motion-base` to `0ms` in reduced-motion mode. Generated components must also stop continuous decorative motion, replace smooth scrolling with immediate movement, and preserve all information when an animation is removed. A necessary progress indicator may remain functional, but it still needs a textual status that does not depend on motion.","components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cloudflare Kumo UI - reference components</title>
    <meta name="description" content="Reference fixture for the OpenDesign Cloudflare Kumo UI integration: compact semantic surfaces, precise controls, visible states, and operational data density." />
    <style>
      :root {
        --bg: oklch(98.75% 0 0);
        --surface: #ffffff;
        --surface-warm: oklch(96% 0 0);
        --fg: oklch(21% 0.006 285.885);
        --fg-2: var(--fg);
        --muted: oklch(55.6% 0 0);
        --meta: var(--muted);
        --border: oklch(14.5% 0 0 / 0.1);
        --border-soft: oklch(93.5% 0 0);
        --accent: oklch(0.5772 0.2324 260);
        --accent-on: #ffffff;
        --accent-hover: oklch(48.8% 0.243 264.376);
        --accent-active: var(--accent-hover);
        --success: oklch(59.6% 0.145 163.225);
        --warn: oklch(73.9% 0.177 58.2);
        --danger: oklch(63.7% 0.237 25.331);
        --font-display: "Inter", ui-sans-serif, system-ui, sans-serif;
        --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
        --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 14px;
        --text-lg: 16px;
        --text-xl: 20px;
        --text-2xl: 24px;
        --text-3xl: 30px;
        --text-4xl: 36px;
        --leading-body: 1.5;
        --leading-tight: 1.2;
        --tracking-display: 0;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 64px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;
        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 1px 2px 0 oklch(0% 0 0 / 0.08);
        --focus-ring: 0 0 0 2px oklch(15% 0 0);
        --motion-fast: 150ms;
        --motion-base: 250ms;
        --ease-standard: cubic-bezier(0.77, 0, 0.175, 1);
        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      [data-theme="dark"],
      [data-mode="dark"] {
        --bg: oklch(10% 0 0);
        --surface: oklch(17% 0 0);
        --surface-warm: oklch(15% 0 0);
        --fg: oklch(97% 0 0);
        --fg-2: var(--fg);
        --muted: oklch(70.8% 0 0);
        --meta: var(--muted);
        --border: oklch(32% 0 0);
        --border-soft: oklch(26.9% 0 0);
        --accent: color-mix(in oklch, oklch(0.5772 0.2324 260), black 10%);
        --accent-on: #ffffff;
        --accent-hover: oklch(48.8% 0.243 264.376);
        --accent-active: var(--accent-hover);
        --success: oklch(76.5% 0.177 163.223);
        --warn: oklch(64.5% 0.168 50);
        --danger: oklch(57.7% 0.245 27.325);
        --elev-raised: 0 1px 2px 0 oklch(0% 0 0 / 0.3);
        --focus-ring: 0 0 0 2px oklch(93.5% 0 0);
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; min-height: 100%; }
      body { background: var(--bg); color: var(--fg); font: 400 var(--text-base) / var(--leading-body) var(--font-body); }
      button, input { font: inherit; }
      button { cursor: pointer; }
      button:disabled { cursor: not-allowed; }
      .page { min-height: 100vh; padding-block: var(--section-y-desktop); }
      .container { width: min(100% - (2 * var(--container-gutter-desktop)), var(--container-max)); margin-inline: auto; }
      .stack-2 { display: grid; gap: var(--space-2); }
      .stack-4 { display: grid; gap: var(--space-4); }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-display); }
      h1 { font-size: var(--text-3xl); font-weight: 600; }
      h2 { font-size: var(--text-lg); font-weight: 600; }
      h3 { font-size: var(--text-base); font-weight: 600; }
      .eyebrow { color: var(--muted); font-size: var(--text-sm); }
      .lead { max-width: 68ch; color: var(--fg-2); font-size: var(--text-lg); }
      .layout-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.7fr); gap: var(--space-6); margin-top: var(--space-8); }
      .panel { overflow: hidden; border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--elev-ring), var(--elev-raised); }
      .panel-header { padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--border-soft); }
      .panel-body { padding: var(--space-5); }
      .status-badge { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-1) var(--space-2); border-radius: var(--radius-pill); background: var(--surface-warm); color: var(--fg-2); font-size: var(--text-xs); font-weight: 500; }
      .status-badge::before { width: 7px; height: 7px; border-radius: var(--radius-pill); background: var(--success); content: ""; }
      .btn { display: inline-flex; min-height: 36px; align-items: center; justify-content: center; gap: var(--space-2); padding-inline: var(--space-3); border: 1px solid transparent; border-radius: var(--radius-lg); font-weight: 500; }
      .btn:focus-visible, input:focus-visible, a:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover, .btn-primary:active { background: var(--accent-hover); }
      .btn-secondary { border-color: var(--border); background: var(--surface); color: var(--fg); }
      .btn-secondary:hover { background: var(--surface-warm); }
      .btn-danger { background: var(--danger); color: var(--accent-on); }
      .btn:disabled { border-color: var(--border-soft); background: var(--surface-warm); color: var(--muted); }
      .btn-loading::before { width: 12px; height: 12px; border: 2px solid currentcolor; border-right-color: transparent; border-radius: var(--radius-pill); animation: spin var(--motion-base) linear infinite; content: ""; }
      .actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
      .field { display: grid; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; }
      .field input { width: 100%; min-height: 36px; padding-inline: var(--space-3); border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); color: var(--fg); }
      .field input:hover { border-color: var(--muted); }
      .field input[aria-invalid="true"] { border-color: var(--danger); }
      .field-error { color: var(--danger); font-size: var(--text-xs); }
      .metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--border-soft); }
      .metric { padding: var(--space-4); border-right: 1px solid var(--border-soft); }
      .metric:last-child { border-right: 0; }
      .metric strong { display: block; font-size: var(--text-xl); font-weight: 600; }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .activity-list { display: grid; margin: 0; padding: 0; list-style: none; }
      .activity-item { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--border-soft); }
      .activity-item:last-child { border-bottom: 0; }
      .activity-icon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: var(--radius-md); background: var(--surface-warm); color: var(--accent); font-family: var(--font-mono); font-size: var(--text-xs); }
      .activity-meta { color: var(--muted); font-size: var(--text-xs); }
      .text-link { color: var(--accent); font-weight: 500; text-decoration: none; }
      .text-link:hover { text-decoration: underline; }
      kbd { padding: 2px var(--space-1); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-warm); box-shadow: 0 1px 0 var(--border); font: 500 var(--text-xs) / 1.4 var(--font-mono); }
      @keyframes spin { to { transform: rotate(360deg); } }
      @media (max-width: 800px) { .layout-grid { grid-template-columns: 1fr; } .metric-grid { grid-template-columns: 1fr; } .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); } .metric:last-child { border-bottom: 0; } }
      @media (max-width: 639px) { .page { padding-block: var(--section-y-phone); } .container { width: min(100% - (2 * var(--container-gutter-phone)), var(--container-max)); } .row-between { align-items: flex-start; flex-direction: column; } }
      @media (prefers-reduced-motion: reduce) { .btn-loading::before { animation: none; border-right-color: currentcolor; } }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="container">
        <header class="stack-2">
          <p class="eyebrow">Cloudflare Kumo UI</p>
          <h1>Network operations</h1>
          <p class="lead">A compact reference surface using semantic layers, clear states, and task-focused controls.</p>
        </header>
        <section class="layout-grid" aria-label="Reference components">
          <article class="panel">
            <header class="panel-header row-between">
              <div class="stack-2"><h2>Service overview</h2><p class="activity-meta">Updated moments ago</p></div>
              <span class="status-badge">Operational</span>
            </header>
            <div class="metric-grid">
              <div class="metric"><strong>99.99%</strong><span>Availability</span></div>
              <div class="metric"><strong>18 ms</strong><span>Edge latency</span></div>
              <div class="metric"><strong>42</strong><span>Active zones</span></div>
            </div>
            <ul class="activity-list">
              <li class="activity-item"><span class="activity-icon" aria-hidden="true">A</span><div><h3>API gateway</h3><p class="activity-meta">Healthy in every region</p></div><a class="text-link" href="#api">Inspect</a></li>
              <li class="activity-item"><span class="activity-icon" aria-hidden="true">W</span><div><h3>Workers deployment</h3><p class="activity-meta">Version 24 is serving traffic</p></div><kbd>G</kbd></li>
              <li class="activity-item"><span class="activity-icon" aria-hidden="true">D</span><div><h3>DNS analytics</h3><p class="activity-meta">No anomalies detected</p></div><a class="text-link" href="#dns">Open</a></li>
            </ul>
          </article>
          <aside class="panel">
            <header class="panel-header"><h2>Configure alert</h2></header>
            <div class="panel-body stack-4">
              <div class="field">
                <label for="alert-name">Alert name</label>
                <input id="alert-name" value="Latency threshold" />
              </div>
              <div class="field">
                <label for="threshold">Threshold</label>
                <input id="threshold" aria-invalid="true" aria-describedby="threshold-error" value="" placeholder="Milliseconds" />
                <p id="threshold-error" class="field-error">Enter a threshold.</p>
              </div>
              <div class="actions">
                <button class="btn btn-primary" type="button">Save alert</button>
                <button class="btn btn-secondary" type="button">Cancel</button>
                <button class="btn btn-danger" type="button">Delete</button>
                <button class="btn btn-loading" type="button" disabled aria-busy="true">Saving</button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  </body>
</html>
`};exports.default=cloudflare_kumo_default;return module.exports}});
//# sourceMappingURL=client.cloudflare-kumo.js.map