
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.wise.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var wise_default={"contract":`## 1. Visual Theme & Atmosphere

Wise's website is a bold, confident fintech platform that communicates "money without borders" through massive typography and a distinctive lime-green accent. The design operates on a warm off-white canvas with near-black text (\`#0e0f0c\`) and a signature Wise Green (\`#9fe870\`) — a fresh, lime-bright color that feels alive and optimistic, unlike the corporate blues of traditional banking.

The typography uses Wise Sans — a proprietary font used at extreme weight 900 (black) for display headings with a remarkably tight line-height of 0.85 and OpenType \`"calt"\` (contextual alternates). At 126px, the text is so dense it feels like a protest sign — bold, urgent, and impossible to ignore. Inter serves as the body font with weight 600 as the default for emphasis, creating a consistently confident voice.

What distinguishes Wise is its green-on-white-on-black material palette. Lime Green (\`#9fe870\`) appears on buttons with dark green text (\`#163300\`), creating a nature-inspired CTA that feels fresh. Hover states use \`scale(1.05)\` expansion rather than color changes — buttons physically grow on interaction. The border-radius system uses 9999px for buttons (pill), 30px–40px for cards, and the shadow system is minimal — just \`rgba(14,15,12,0.12) 0px 0px 0px 1px\` ring shadows.

**Key Characteristics:**
- Wise Sans at weight 900, 0.85 line-height — billboard-scale bold headlines
- Lime Green (\`#9fe870\`) accent with dark green text (\`#163300\`) — nature-inspired fintech
- Inter body at weight 600 as default — confident, not light
- Near-black (\`#0e0f0c\`) primary with warm green undertone
- Scale(1.05) hover animations — buttons physically grow
- OpenType \`"calt"\` on all text
- Pill buttons (9999px) and large rounded cards (30px–40px)
- Semantic color system with comprehensive state management

## 4. Component Stylings

### Buttons

**Primary Green Pill**
- Background: \`#9fe870\` (Wise Green)
- Text: \`#163300\` (Dark Green)
- Padding: 5px 16px
- Radius: 9999px
- Hover: scale(1.05) — button physically grows
- Active: scale(0.95) — button compresses
- Focus: inset ring + outline

**Secondary Subtle Pill**
- Background: \`rgba(22, 51, 0, 0.08)\` (dark green at 8% opacity)
- Text: \`#0e0f0c\`
- Padding: 8px 12px 8px 16px
- Radius: 9999px
- Same scale hover/active behavior

### Cards & Containers
- Radius: 16px (small), 30px (medium), 40px (large cards/tables)
- Border: \`1px solid rgba(14,15,12,0.12)\` or \`1px solid #9fe870\` (green accent)
- Shadow: \`rgba(14,15,12,0.12) 0px 0px 0px 1px\` (ring shadow)

### Navigation
- Green-tinted navigation hover: \`rgba(211,242,192,0.4)\`
- Clean header with Wise wordmark
- Pill CTAs right-aligned

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 3px, 4px, 5px, 8px, 10px, 11px, 12px, 16px, 18px, 19px, 20px, 22px, 24px

### Border Radius Scale
- Minimal (2px): Links, inputs
- Standard (10px): Comboboxes, inputs
- Card (16px): Small cards, buttons, radio
- Medium (20px): Links, medium cards
- Large (30px): Feature cards
- Section (40px): Tables, large cards
- Mega (1000px): Presentation elements
- Pill (9999px): All buttons, images
- Circle (50%): Icons, badges

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Default |
| Ring (Level 1) | \`rgba(14,15,12,0.12) 0px 0px 0px 1px\` | Card borders |
| Inset (Level 2) | \`rgb(134,134,133) 0px 0px 0px 1px inset\` | Input focus |

**Shadow Philosophy**: Wise uses minimal shadows — ring shadows only. Depth comes from the bold green accent against the neutral canvas.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <576px | Single column |
| Tablet | 576–992px | 2-column |
| Desktop | 992–1440px | Full layout |
| Large | >1440px | Expanded |`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Wise — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/wise. Spring-green CTAs on warm-neutral
        canvas, billboard Wise Sans at 0.85 line-height, pill buttons, ring-only shadows."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #e8ebe6;
        --surface-warm: var(--surface);

        --fg: #0e0f0c;
        --fg-2: var(--fg);
        --muted: #868685;
        --meta: var(--muted);

        --border: rgba(14, 15, 12, 0.12);
        --border-soft: var(--border);

        --accent: #9fe870;
        --accent-on: #163300;
        --accent-hover: #cdffad;
        --accent-active: color-mix(in oklab, var(--accent), black 12%);

        --success: #054d28;
        --warn: #ffd11a;
        --danger: #d03238;

        --font-display: "Wise Sans", Inter, ui-sans-serif, system-ui, sans-serif;
        --font-body: Inter, Helvetica, Arial, ui-sans-serif, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 18px;
        --text-lg: 22px;
        --text-xl: 26px;
        --text-2xl: 40px;
        --text-3xl: 64px;
        --text-4xl: 96px;

        --leading-body: 1.44;
        --leading-tight: 0.85;
        --tracking-display: normal;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 16px;
        --radius-md: 30px;
        --radius-lg: 40px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0 1px var(--border), 0 2px 8px rgba(14, 15, 12, 0.04);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 60%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1280px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset ─────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        font-weight: 600;                       /* Inter 600 as body default — DESIGN.md §3 */
        font-feature-settings: "calt" 1;        /* "calt" on everything */
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

      /* ─── Typography — Wise Sans 900 at 0.85, "calt" everywhere ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 900;                       /* Wise Sans Black — the brand identity */
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        font-feature-settings: "calt" 1;
        margin: 0;
        color: var(--fg);
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-3xl); }
      h3 { font-size: var(--text-xl); letter-spacing: -0.015em; line-height: 1.23; }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg);
        line-height: var(--leading-body);
        font-weight: 600;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-sm);
        color: var(--muted);
        font-weight: 600;
        letter-spacing: -0.006em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — pill, green-on-green, scale(1.05) hover ─── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 22px;
        border-radius: var(--radius-pill);      /* 9999px — all buttons are pills */
        font-family: var(--font-body);
        font-size: var(--text-lg);
        font-weight: 600;                       /* Inter 600 — confident, not light */
        line-height: 1;
        cursor: pointer;
        border: none;
        font-feature-settings: "calt" 1;
        letter-spacing: -0.006em;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    transform var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:hover { transform: scale(1.05); }    /* DESIGN.md §4 — buttons physically grow */
      .btn:active { transform: scale(0.95); }   /* DESIGN.md §4 — compresses on press */
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: Wise Green pill with Dark Green text — the signature CTA */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }
      /* Secondary: subtle dark-green tint pill */
      .btn-secondary {
        background: rgba(22, 51, 0, 0.08);      /* DESIGN.md §4 — dark green at 8% */
        color: var(--fg);
      }
      .btn-secondary:hover { background: rgba(22, 51, 0, 0.14); }

      /* ─── Inputs — pill borders, ring focus ──────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; }
      .field input {
        padding: 14px 18px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent-on);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); font-weight: 400; }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — 30px radius, ring elevation only ──────────── */
      .card {
        background: var(--bg);
        border-radius: var(--radius-md);        /* 30px — Wise's medium feature radius */
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-ring);           /* Ring shadow only — DESIGN.md §6 */
      }
      .card-accent {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.6;
      }
      .badge-success {
        color: var(--success);
        background: #e2f6d5;                    /* Light Mint surface — DESIGN.md §2 */
      }
      .badge-muted { color: var(--muted); background: var(--surface); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 2px; }
      a:hover { color: var(--accent-on); text-decoration-color: var(--accent); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 400;
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-6); border: 1px solid var(--border);
        border-radius: var(--radius-md); background: var(--surface);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 460px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 18px; height: 18px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* Hero headline gets the most extreme Wise treatment */
      .hero-headline { max-width: 14ch; }
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
          <div class="stack-6">
            <p class="eyebrow">Reference fixture · wise</p>
            <h1 class="hero-headline">The international account for everyone.</h1>
            <p class="lead" style="max-width: 50ch">
              Hold 40+ currencies, send money across borders at the real exchange
              rate, and get paid like a local — no hidden fees, no fine print.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Transfer status">
            <div class="row-between">
              <span class="body-sm">Transfer status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                On its way
              </span>
            </div>
            <p class="body-sm body-muted">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm body-muted">Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 18ch">Money without borders, by design.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Green-on-green CTAs</h3>
            <p class="body-muted">
              --accent (#9fe870) paired with --accent-on (#163300) — dark green text
              on lime green is the Wise signature, not white. Pill radius 9999px.
            </p>
            
          </article>
          <article class="card-accent">
            <h3>Billboard Wise Sans 900</h3>
            <p class="body-muted">
              Display headlines run at weight 900 with line-height 0.85 — letters
              overlap vertically, creating dense text blocks that read like signage.
            </p>
            
          </article>
          <article class="card">
            <h3>Ring-only elevation</h3>
            <p class="body-muted">
              --elev-ring (0 0 0 1px rgba(14,15,12,0.12)) is the only depth treatment.
              No drop shadows; the green accent provides all the visual lift needed.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Sign up in seconds.</h2>
            <p class="body-muted" style="max-width: 46ch">
              Inputs sit on the white canvas with hairline ring borders. Focus pulls a
              green-tinted ring (--focus-ring) and snaps the border to dark green —
              the same brand family, never a competing color.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" autocomplete="email" required />
              <p class="field-help">We'll send your account confirmation here.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get started</button>
              <button type="button" class="btn btn-secondary">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=wise_default;return module.exports}});
//# sourceMappingURL=client.wise.js.map