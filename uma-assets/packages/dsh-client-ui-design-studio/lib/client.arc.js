
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.arc.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var arc_default={"contract":`## 1. Visual Theme & Atmosphere

Arc Browser dissolves the boundary between the chrome and the page. Where Chrome and Safari treat the browser frame as a container, Arc treats it as scenery — the toolbar fades into the system wallpaper, the sidebar carries gradient warmth from the user's chosen "theme color", and translucency is everywhere. The visual signature is **frosted glass plus a single saturated gradient** — most often a peach-to-coral or violet-to-fuchsia bloom — that sets the emotional temperature of the entire window.

Typography uses **Inter** for chrome and a custom display serif (\`Argent CF\` or similar) for marketing — when Arc speaks publicly it speaks editorially, in a serif voice unusual for tech. The product itself is sans-only, with tight tracking and generous line-height.

Shapes are squircle-soft: 12–16px radii on cards, 8px on tabs, 9999px pills for tags. Borders are rare — Arc prefers tinted background washes (\`rgba(255, 255, 255, 0.5)\` over the gradient) to delineate panes.

**Key Characteristics:**
- Translucent frosted-glass surfaces over a saturated gradient background
- Theme-color gradients (peach-coral, violet-fuchsia, mint-cyan) as the primary mood
- Inter for product chrome, Argent CF (serif) for marketing display
- Squircle-soft 12–16px radii everywhere
- Sidebar-first layout: tabs, spaces, and bookmarks live on the left, not the top
- Color picker is a brand surface — themes are user-driven, not fixed
- Subtle shadows (\`0 8px 32px rgba(0,0,0,0.08)\`) over the gradient backdrop

## 4. Component Stylings

### Buttons

**Primary (Filled)**
- Background: linear-gradient on theme color (e.g., \`linear-gradient(135deg, #ff7e5f, #feb47b)\`)
- Text: \`#ffffff\`
- Padding: 10px 20px
- Radius: 12px
- Shadow: \`0 4px 16px rgba(255, 127, 95, 0.3)\`
- Hover: shadow grows to \`0 8px 24px rgba(255, 127, 95, 0.4)\`

**Glass (Secondary)**
- Background: \`rgba(255, 255, 255, 0.7)\`
- Backdrop: \`blur(20px)\`
- Text: \`#1a1a1f\`
- Border: 1px solid \`rgba(255, 255, 255, 0.4)\`
- Padding: 10px 20px
- Radius: 12px

**Subtle**
- Background: transparent
- Text: theme color
- Hover: background \`rgba(255, 127, 95, 0.1)\`

### Tabs (Sidebar)
- Background at rest: transparent
- Background on hover: \`rgba(255, 255, 255, 0.5)\`
- Background active: \`rgba(255, 255, 255, 0.85)\` + soft shadow
- Padding: 8px 12px
- Radius: 8px
- Favicon: 16px square at left, 8px gap to title.

### Cards / Panes
- Background: \`rgba(255, 255, 255, 0.7)\`
- Backdrop: \`blur(24px)\` saturate 180%
- Border: 1px solid \`rgba(255, 255, 255, 0.4)\`
- Radius: 16px
- Shadow: \`0 8px 32px rgba(0, 0, 0, 0.08)\`
- Padding: 24px

### Inputs (Command Bar)
- Background: \`rgba(255, 255, 255, 0.85)\`
- Backdrop: \`blur(40px)\`
- Text: \`#1a1a1f\`
- Border: 1px solid \`rgba(255, 255, 255, 0.4)\`
- Radius: 14px
- Padding: 14px 18px
- Focus: shadow \`0 0 0 4px rgba(255, 127, 95, 0.2)\`

### Pills (Spaces / Bookmarks Folder)
- Background: theme color at 16% alpha
- Text: theme color (full)
- Padding: 4px 10px
- Radius: 9999px
- Font: 12px / 600

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64.
- **Sidebar**: 240px wide; collapsible to 56px.
- **Window radius**: 12px on the OS window itself (macOS-only flourish).
- **Padding inside panes**: 24px.

## 6. Motion

- **Duration**: 200ms for hover; 320ms for tab create/close; 480ms for "Little Arc" window expand.
- **Easing**: \`cubic-bezier(0.32, 0.72, 0, 1)\` for window expand (Apple's spring-style).
- **Tab swap**: 1px translate + opacity blend, no scale change.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Arc — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/arc. Frosted glass over a peach-coral
        Sunset gradient, squircle-soft radii, editorial Argent CF serif for the hero,
        Inter for product chrome."
    />

    <style>
      :root {
        --bg: #fdf3ec;
        --surface: #ffffff;
        --surface-warm: #fff4ea;

        --fg: #1a1a1f;
        --fg-2: #54545a;
        --muted: #8c8c93;
        --meta: var(--muted);

        --border: #ece5db;
        --border-soft: #f6f0e8;

        --accent: #ff5f5f;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #48bb78;
        --warn: #f6ad55;
        --danger: #f56565;

        --font-display: "Argent CF", "Source Serif Pro", Georgia, serif;
        --font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        --font-mono: "Berkeley Mono", ui-monospace, Menlo, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 15px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 40px;
        --text-4xl: 72px;

        --leading-body: 1.55;
        --leading-tight: 1.05;
        --tracking-display: -0.03em;

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
        --elev-raised: 0 8px 32px rgba(0, 0, 0, 0.08);

        --focus-ring: 0 0 0 4px color-mix(in oklab, var(--accent), transparent 80%);

        --motion-fast: 200ms;
        --motion-base: 320ms;
        --ease-standard: cubic-bezier(0.32, 0.72, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      /* ─── Reset ─────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        background-image:
          radial-gradient(circle at 0% 0%, rgba(255, 126, 95, 0.22), transparent 55%),
          radial-gradient(circle at 100% 5%, rgba(255, 95, 95, 0.16), transparent 50%),
          radial-gradient(circle at 50% 100%, rgba(254, 180, 123, 0.20), transparent 60%);
        background-attachment: fixed;
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — editorial serif hero, sans-only product ─ */
      h1, h2, h3 { margin: 0; line-height: var(--leading-tight); }
      h1 {
        font-family: var(--font-display);   /* Argent CF — marketing only */
        font-weight: 400;                    /* Editorial serif: weight stays calm */
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-family: var(--font-display);   /* Section titles also Argent CF */
        font-weight: 400;
        font-size: var(--text-3xl);
        letter-spacing: -0.02em;
      }
      h3 {
        font-family: var(--font-body);      /* Inter for in-product hierarchy */
        font-weight: 600;
        font-size: var(--text-xl);
        letter-spacing: -0.01em;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg-2);
        line-height: var(--leading-body);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .body-fg2 { color: var(--fg-2); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — Sunset gradient on primary, glass on secondary ─ */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 20px;
        border-radius: var(--radius-md);   /* 12px — squircle-soft */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        text-decoration: none;
        transition:
          box-shadow var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          background-color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { transform: translateY(0); }

      /* Primary: the Sunset gradient — peach (#ff7e5f) to soft coral (#feb47b) */
      .btn-primary {
        background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(255, 127, 95, 0.30);
      }
      .btn-primary:hover {
        box-shadow: 0 8px 24px rgba(255, 127, 95, 0.40);
        transform: translateY(-1px);
      }

      /* Secondary: frosted glass — translucent white over the gradient backdrop */
      .btn-secondary {
        background: rgba(255, 255, 255, 0.72);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        backdrop-filter: blur(20px) saturate(180%);
        color: var(--fg);
        box-shadow: var(--elev-ring);
      }
      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.88);
      }

      /* Subtle: theme-tinted ghost (DESIGN.md §4) */
      .btn-subtle {
        background: transparent;
        color: var(--accent);
        padding-inline: var(--space-3);
      }
      .btn-subtle:hover { background: color-mix(in oklab, var(--accent), transparent 90%); }

      /* ─── Inputs — command-bar feel ──────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--fg-2); }
      .field input {
        padding: 14px 18px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.85);
        -webkit-backdrop-filter: blur(40px);
        backdrop-filter: blur(40px);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: color-mix(in oklab, var(--accent), white 30%);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — frosted panes, long-throw soft shadow ─────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg);   /* 16px — squircle-soft pane */
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
        transition:
          transform var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.10);
      }

      /* ─── Pills — theme color at 16% alpha ──────────────────── */
      .pill {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 600;
        line-height: 1.4;
        background: color-mix(in oklab, var(--accent), transparent 84%);
        color: var(--accent);
      }
      .pill-success {
        background: color-mix(in oklab, var(--success), transparent 86%);
        color: var(--success);
      }
      .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Hero meta panel — warm-inset frosted aside ─────────── */
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-4);
        padding: var(--space-6);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-lg);
        background: rgba(255, 255, 255, 0.70);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        backdrop-filter: blur(24px) saturate(180%);
        box-shadow: var(--elev-raised);
      }
      .hero-meta-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* ─── Links & kbd ─────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; transition: color var(--motion-fast) var(--ease-standard); }
      a:hover { color: var(--accent-hover); text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface-warm);
        color: var(--fg-2);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); align-items: stretch; }
      }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 440px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · arc</p>
            <h1>Let the internet flow through you.</h1>
            <p class="lead" style="max-width: 48ch">
              A calmer browser for a loud web. Sidebar-first, gradient-warm, frosted at every
              edge — Arc treats the chrome as scenery, so the page feels like home, not a tab.
            </p>
            <div class="hero-actions">
              
              
              <a href="#form" class="btn btn-subtle">Reserve an invite →</a>
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="hero-meta-row">
              <span class="body-sm body-fg2">Today's space</span>
              <span class="pill">
                <span class="pill-dot" aria-hidden="true"></span>
                Sunset
              </span>
            </div>
            <div class="hero-meta-row">
              <span class="body-sm body-fg2">Tabs open</span>
              <span class="body-sm" style="font-variant-numeric: tabular-nums">37 across 3 spaces</span>
            </div>
            <div class="hero-meta-row">
              <span class="body-sm body-fg2">Status</span>
              <span class="pill pill-success">
                <span class="pill-dot" aria-hidden="true"></span>
                Synced
              </span>
            </div>
            <p class="body-sm body-muted">
              Press <kbd>⌘</kbd> <kbd>T</kbd> for the command bar — or just start typing where you are.
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Warmth, on purpose. Geometry, with kindness.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <span class="pill" aria-hidden="true">Atmosphere</span>
            <h3>Frosted glass over a Sunset gradient</h3>
            <p class="body-muted body-sm">
              The canvas is peach cream, never pure white. Cards float as translucent
              white panes — a single soft shadow does the lifting.
            </p>
            
          </article>
          <article class="card">
            <span class="pill" aria-hidden="true">Geometry</span>
            <h3>Squircle-soft, every edge</h3>
            <p class="body-muted body-sm">
              8px on tabs, 12px on buttons, 16px on cards, 9999px on space pills.
              No sharp corners anywhere — the browser gets out of your way.
            </p>
            
          </article>
          <article class="card">
            <span class="pill" aria-hidden="true">Voice</span>
            <h3>Editorial when it matters</h3>
            <p class="body-muted body-sm">
              Argent CF serif speaks publicly; Inter handles the chrome. A 72px hero
              with -0.03em tracking is the only place the marketing gets loud.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form" id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Reserve an invite.</h2>
            <p class="body-muted" style="max-width: 48ch">
              The command bar treatment — frosted background, 12px squircle, 4px coral
              halo on focus — extends straight into the form layer. One language, one mood.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Where should we send your invite?</label>
              <input id="email" type="email" placeholder="you@thebrowser.company" autocomplete="email" required />
              <p class="field-help">We'll only send your invite, not a newsletter — promise.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get my invite</button>
              <button type="button" class="btn btn-secondary">Watch the demo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=arc_default;return module.exports}});
//# sourceMappingURL=client.arc.js.map