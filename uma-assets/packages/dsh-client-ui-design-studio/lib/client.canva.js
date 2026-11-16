
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.canva.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var canva_default={"contract":`## 1. Visual Theme & Atmosphere

Canva is the friendly face of design tools — the brand makes a point of looking inviting where Adobe looks intimidating. The page is built on a clean white canvas (\`#ffffff\`) with a signature **purple-to-blue gradient** (\`#7d2ae8\` → \`#00c4cc\`) used in the brand mark, hero buttons, and Pro/Magic moments. Surfaces are generously padded, edges are gently rounded (8–16px), and shadows are soft and cool-toned.

Typography uses **Canva Sans** (a custom geometric sans) for chrome and prose, with rounded letterforms that share DNA with brands like Airbnb and Asana. Weight contrast does the heavy lifting — 800 for hero display, 700 for section heads, 400 for body — while size hierarchy is more compressed than typical product brands so cards and templates read at a glance.

The shape system is ultra-soft: 12px on most cards, 16–20px on larger panels, 9999px on chips. Buttons are rectangles with a subtle elevation shadow (\`0 2px 8px rgba(0,0,0,0.06)\`) that grows on hover. Iconography is filled and rounded, never line-only — Canva's icons speak the same shape language as its UI.

**Key Characteristics:**
- White canvas with a violet-to-cyan gradient (\`#7d2ae8\` → \`#00c4cc\`)
- Canva Sans (rounded geometric) for everything; weight contrast over color
- 12–20px radii everywhere; 9999px pills for chips and tags
- Soft cool-toned shadows that grow on hover
- Filled rounded iconography — never outlined
- Vibrant secondary palette (coral, mint, tangerine) for category tags
- Pro/Magic moments lit by a static gradient — no animation

## 4. Component Stylings

### Buttons

**Primary (Gradient)**
- Background: \`linear-gradient(135deg, #7d2ae8, #00c4cc)\`
- Text: \`#ffffff\`
- Padding: 12px 20px
- Radius: 8px
- Shadow: \`0 2px 8px rgba(125, 42, 232, 0.2)\`
- Hover: shadow grows to \`0 4px 14px rgba(125, 42, 232, 0.3)\`
- Use: hero CTAs, "Try Canva Pro"

**Primary (Solid Purple)**
- Background: \`#7d2ae8\`
- Text: \`#ffffff\`
- Padding: 12px 20px
- Radius: 8px
- Hover: \`#6815d4\`

**Secondary**
- Background: \`#ffffff\`
- Text: \`#0e1318\`
- Border: 1px solid \`#e1e3e6\`
- Radius: 8px
- Hover: background \`#f4f5f7\`, border \`#c7cdd3\`

**Subtle / Tertiary**
- Background: \`rgba(125, 42, 232, 0.08)\`
- Text: \`#7d2ae8\`
- Hover: background \`rgba(125, 42, 232, 0.14)\`

### Cards / Template Tiles
- Background: \`#ffffff\`
- Border: 1px solid \`#e1e3e6\`
- Radius: 12px
- Shadow at rest: \`0 1px 3px rgba(0,0,0,0.04)\`
- Shadow on hover: \`0 8px 24px rgba(0,0,0,0.08)\`, lift 2px
- Aspect ratio: thumbnail respects template (1:1, 4:3, 9:16)

### Inputs
- Background: \`#ffffff\`
- Border: 1px solid \`#e1e3e6\`
- Radius: 8px
- Padding: 10px 14px
- Focus: border \`#7d2ae8\`, ring \`0 0 0 3px rgba(125, 42, 232, 0.16)\`

### Chips / Tags
- Background: category-tinted soft.
- Text: matching strong category color.
- Padding: 4px 10px
- Radius: 9999px
- Font: 11px / 600 / uppercase

### Pro Badge
- Background: \`linear-gradient(135deg, #7d2ae8, #ff5757)\`
- Text: \`#ffffff\`
- Padding: 2px 8px
- Radius: 9999px
- Font: 10px / 700 / uppercase

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Container**: max 1320px, 32px gutter.
- **Sidebar (editor)**: 320px wide; collapses to 56px icons.
- **Card grid gap**: 16px on mobile, 24px on desktop.

## 6. Motion

- **Duration**: 180ms for hover; 280ms for menu open; 420ms for editor sidebar collapse.
- **Easing**: \`cubic-bezier(0.4, 0, 0.2, 1)\` (Material-style).
- **Card lift**: translateY(-2px) + shadow grow on hover, single transition.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Canva — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/canva. White canvas, vivid
        purple→cyan gradient on hero CTAs, 12px card radii, soft cool shadows."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f4f5f7;
        --surface-warm: var(--surface);

        --fg: #0e1318;
        --fg-2: #3c4043;
        --muted: #5f6368;
        --meta: #9aa0a6;

        --border: #e1e3e6;
        --border-soft: var(--border);

        --accent: #7d2ae8;
        --accent-on: #ffffff;
        --accent-hover: #6815d4;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #00b894;
        --warn: #ffb020;
        --danger: #ff5757;

        --font-display: "Canva Sans", "YS Text", system-ui, -apple-system, sans-serif;
        --font-body: "Canva Sans", "YS Text", system-ui, -apple-system, sans-serif;
        --font-mono: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;

        --text-xs: 11px;
        --text-sm: 12px;
        --text-base: 14px;
        --text-lg: 16px;
        --text-xl: 18px;
        --text-2xl: 24px;
        --text-3xl: 36px;
        --text-4xl: 64px;

        --leading-body: 1.5;
        --leading-tight: 1.15;
        --tracking-display: -0.02em;

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
        --elev-raised: 0 2px 8px rgba(0, 0, 0, 0.06);

        --focus-ring: 0 0 0 3px rgba(125, 42, 232, 0.16);

        --motion-fast: 180ms;
        --motion-base: 280ms;
        --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);

        --container-max: 1320px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      /* ─── Reset ─────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
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

      /* ─── Typography — weight contrast carries hierarchy ─────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        color: var(--fg);
        line-height: var(--leading-tight);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 800;
        letter-spacing: var(--tracking-display);
        line-height: 1.05;
      }
      h2 {
        font-size: var(--text-2xl);
        font-weight: 700;
        letter-spacing: -0.005em;
        line-height: 1.2;
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 600;
        line-height: 1.3;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: var(--leading-body);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — soft rectangles, single gradient moment ─── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 20px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;
        line-height: 1.2;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { transform: translateY(0); }
      /* Primary: the brand gradient — purple origin → cyan terminus.
         The single visible gradient on the page; do not repeat. */
      .btn-primary {
        background: linear-gradient(135deg, #7d2ae8, #00c4cc);
        color: var(--accent-on);
        box-shadow: 0 2px 8px rgba(125, 42, 232, 0.2);
      }
      .btn-primary:hover {
        box-shadow: 0 4px 14px rgba(125, 42, 232, 0.3);
        transform: translateY(-1px);
      }
      /* Secondary: white card with cool hairline border. */
      .btn-secondary {
        background: var(--bg);
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-secondary:hover {
        background: var(--surface);
        border-color: #c7cdd3;
      }
      /* Subtle / tertiary: purple-tinted ghost. */
      .btn-subtle {
        background: rgba(125, 42, 232, 0.08);
        color: var(--accent);
      }
      .btn-subtle:hover { background: rgba(125, 42, 232, 0.14); }

      /* ─── Inputs — soft, purple focus ring ──────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--fg);
      }
      .field input {
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — 12px radius, soft cool shadow that grows ──── */
      .card {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        transition:
          box-shadow var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard);
      }
      .card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }
      .card-thumb {
        aspect-ratio: 4 / 3;
        border-radius: var(--radius-sm);
        margin-block-end: var(--space-2);
      }
      .card-thumb-coral { background: linear-gradient(135deg, #ff7059, #ff9633); }
      .card-thumb-mint { background: linear-gradient(135deg, #48c997, #3ea6ff); }
      .card-thumb-lavender { background: linear-gradient(135deg, #9b87f5, #7d2ae8); }

      /* ─── Chips / category tags — pill, uppercase ───────────── */
      .chip {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 600;
        line-height: 1.2;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .chip-coral { background: rgba(255, 112, 89, 0.14); color: #c2412c; }
      .chip-mint { background: rgba(72, 201, 151, 0.16); color: #1d8a5d; }
      .chip-lavender { background: rgba(155, 135, 245, 0.18); color: #5b3fcf; }

      /* ─── Pro badge — gradient pill, purple → pink ──────────── */
      .pro-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px var(--space-2);
        border-radius: var(--radius-pill);
        background: linear-gradient(135deg, #7d2ae8, #ff5757);
        color: var(--accent-on);
        font-size: 10px;
        font-weight: 700;
        line-height: 1.4;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; font-weight: 600; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-4);
        padding: var(--space-6);
        border-radius: var(--radius-lg);
        background: var(--surface);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; gap: var(--space-4); } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex; flex-direction: column;
        gap: var(--space-4);
        max-width: 420px;
        padding: var(--space-6);
        background: var(--surface);
        border-radius: var(--radius-lg);
      }
      .form-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-2);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex; align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
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
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · canva</p>
            <h1>Design anything.<br />Publish anywhere.</h1>
            <p class="lead" style="max-width: 52ch">
              From social posts to slide decks, posters to videos — drag, drop, done.
              Canva makes great design accessible to every team, every brief, every brand.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Workspace status">
            <div class="row-between">
              <span style="font-weight: 600; color: var(--fg)">Magic Studio</span>
              <span class="pro-badge">Pro</span>
            </div>
            <p class="body-sm body-muted">
              Generate images, copy, and full layouts from a single prompt.
              Active across <strong style="color: var(--fg)">12 brand kits</strong>.
            </p>
            <div class="row-between body-sm">
              <span class="body-muted">Last edited</span>
              <span><time datetime="2026-05-18">2 minutes ago</time></span>
            </div>
            <p class="body-sm body-muted">
              Tip: press <kbd>⌘</kbd> <kbd>K</kbd> to jump to any template.
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">A template for every brief</p>
          <h2 style="max-width: 24ch">Start from anything. Make it your own.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <div class="card-thumb card-thumb-coral" aria-hidden="true"></div>
            <span class="chip chip-coral">Social</span>
            <h3>Instagram Story</h3>
            <p class="body-muted body-sm">
              1080 × 1920 vertical templates, ready for Reels and Stories.
              Drop in your logo, swap fonts, publish straight to your handle.
            </p>
            
          </article>
          <article class="card">
            <div class="card-thumb card-thumb-mint" aria-hidden="true"></div>
            <span class="chip chip-mint">Education</span>
            <h3>Lesson plans &amp; worksheets</h3>
            <p class="body-muted body-sm">
              Printable A4 and US Letter formats for teachers. Subject-tagged
              and tested against grade-level readability scores.
            </p>
            
          </article>
          <article class="card">
            <div class="card-thumb card-thumb-lavender" aria-hidden="true"></div>
            <span class="chip chip-lavender">Personal</span>
            <h3>Invitations &amp; cards</h3>
            <p class="body-muted body-sm">
              Birthday, wedding, save-the-date — print at home or order
              through Canva Print with two-day shipping to most countries.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Get started</p>
            <h2>Bring your team into Canva.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Drop your work email and we'll set up your free Canva workspace —
              brand kit, folders, and approvals included. No credit card needed.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@yourcompany.com" autocomplete="email" required />
              <p class="field-help">We'll use this to create your team workspace.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create workspace</button>
              <button type="button" class="btn btn-subtle">See a demo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=canva_default;return module.exports}});
//# sourceMappingURL=client.canva.js.map