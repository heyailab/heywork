
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.intercom.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var intercom_default={"contract":`## 1. Visual Theme & Atmosphere

Intercom's website is a warm, confident customer service platform that communicates "AI-first helpdesk" through a clean, editorial design language. The page operates on a warm off-white canvas (\`#faf9f6\`) with off-black (\`#111111\`) text, creating an intimate, magazine-like reading experience. The signature Fin Orange (\`#ff5600\`) — named after Intercom's AI agent — serves as the singular vibrant accent against the warm neutral palette.

The typography uses Saans — a custom geometric sans-serif with aggressive negative letter-spacing (-2.4px at 80px, -0.48px at 24px) and a consistent 1.00 line-height across all heading sizes. This creates ultra-compressed, billboard-like headlines that feel engineered and precise. Serrif provides the serif companion for editorial moments, and SaansMono handles code and uppercase technical labels. MediumLL and LLMedium appear for specific UI contexts, creating a rich five-font ecosystem.

What distinguishes Intercom is its remarkably sharp geometry — 4px border-radius on buttons creates near-rectangular interactive elements that feel industrial and precise, contrasting with the warm surface colors. Button hover states use \`scale(1.1)\` expansion, creating a physical "growing" interaction. The border system uses warm oat tones (\`#dedbd6\`) and oklab-based opacity values for sophisticated color management.

**Key Characteristics:**
- Warm off-white canvas (\`#faf9f6\`) with oat-toned borders (\`#dedbd6\`)
- Saans font with extreme negative tracking (-2.4px at 80px) and 1.00 line-height
- Fin Orange (\`#ff5600\`) as singular brand accent
- Sharp 4px border-radius — near-rectangular buttons and elements
- Scale(1.1) hover with scale(0.85) active — physical button interaction
- SaansMono uppercase labels with wide tracking (0.6px–1.2px)
- Rich multi-color report palette (blue, green, red, pink, lime, orange)
- oklab color values for sophisticated opacity management

## 4. Component Stylings

### Buttons

**Primary Dark**
- Background: \`#111111\`
- Text: \`#ffffff\`
- Padding: 0px 14px
- Radius: 4px
- Hover: white background, dark text, scale(1.1)
- Active: green background (\`#2c6415\`), scale(0.85)

**Outlined**
- Background: transparent
- Text: \`#111111\`
- Border: \`1px solid #111111\`
- Radius: 4px
- Same scale hover/active behavior

**Warm Card Button**
- Background: \`#faf9f6\`
- Text: \`#111111\`
- Padding: 16px
- Border: \`1px solid oklab(... / 0.1)\`

### Cards & Containers
- Background: \`#faf9f6\` (warm cream)
- Border: \`1px solid #dedbd6\` (warm oat)
- Radius: 8px
- No visible shadows

### Navigation
- Saans 16px for links
- Off-black text on white
- Small 4px–6px radius buttons
- Orange Fin accent for AI features

## 5. Layout Principles

### Spacing: 8px, 10px, 12px, 14px, 16px, 20px, 24px, 32px, 40px, 48px, 60px, 64px, 80px, 96px
### Border Radius: 4px (buttons), 6px (nav items), 8px (cards, containers)

## 6. Depth & Elevation
Minimal shadows. Depth through warm border colors and surface tints.

## 8. Responsive Behavior
Breakpoints: 425px, 530px, 600px, 640px, 768px, 896px`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Intercom — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/intercom. Warm cream canvas,
        80px Saans display with -2.4px tracking, Fin Orange (#ff5600) accent,
        sharp 4px radius, scale(1.1) hover."
    />

    <style>
      :root {
        --bg: #faf9f6;
        --surface: #ffffff;
        --surface-warm: #faf9f6;

        --fg: #111111;
        --fg-2: var(--fg);
        --muted: #7b7b78;
        --meta: #9c9fa5;

        --border: #dedbd6;
        --border-soft: #ebe9e4;

        --accent: #ff5600;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #00da00;
        --warn: #eab308;
        --danger: #c41c1c;

        --font-display: "Saans", "Saans Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
        --font-body: "Saans", "Saans Fallback", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
        --font-mono: "SaansMono", "SaansMono Fallback", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 54px;
        --text-4xl: 80px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
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

        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 2px 8px color-mix(in oklab, var(--fg), transparent 94%);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

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
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
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

      /* ─── Typography — Saans, 1.00 leading, negative tracking ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 400;
        line-height: var(--leading-tight);
        color: var(--fg);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        letter-spacing: -0.02em;
      }
      h3 {
        font-size: var(--text-xl);
        letter-spacing: -0.02em;
      }
      @media (max-width: 1023px) {
        h1 { font-size: var(--text-3xl); }
        h2 { font-size: var(--text-2xl); }
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg);
        line-height: 1.4;
        letter-spacing: -0.01em;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .meta { color: var(--meta); font-size: var(--text-sm); }

      /* SaansMono uppercase eyebrow — DESIGN.md §3 mono-label voice */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
      }

      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — sharp 4px corners, scale(1.1) hover ─────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 18px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transform-origin: center;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { transform: scale(0.92); }

      /* Primary: Off Black background — the Intercom dark-button move */
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
        border-color: var(--fg);
      }
      .btn-primary:hover {
        background: #ffffff;
        color: var(--fg);
        transform: scale(1.04);
      }

      /* Outlined: hairline over the warm canvas */
      .btn-outline {
        background: transparent;
        color: var(--fg);
        border-color: var(--fg);
      }
      .btn-outline:hover {
        background: var(--fg);
        color: #ffffff;
        transform: scale(1.04);
      }

      /* Accent: Fin Orange — primary AI / brand moments only */
      .btn-accent {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-accent:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
        transform: scale(1.04);
      }
      .btn-accent:active { background: var(--accent-active); }

      /* ─── Inputs — oat borders, accent focus ─────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        padding: 14px 16px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: 1.25;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { border-color: color-mix(in oklab, var(--border), black 10%); }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — warm cream surface, oat border, no shadow ── */
      .card {
        background: var(--surface-warm);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition:
          border-color var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        border-color: color-mix(in oklab, var(--border), black 12%);
        box-shadow: var(--elev-raised);
      }
      .card-eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
      }
      .card h3 { font-size: var(--text-2xl); letter-spacing: -0.03em; }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.4;
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 88%); }
      .badge-accent { color: var(--accent); background: color-mix(in oklab, var(--accent), transparent 90%); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 88%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; text-decoration-color: var(--border); }
      a:hover { text-decoration-color: var(--accent); color: var(--accent); }

      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 3px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }

      /* ─── Hero — billboard grid ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); align-items: start; }
      }
      .hero-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }

      /* Messenger-style preview panel — Intercom's conversational signature */
      .messenger {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        display: flex; flex-direction: column; gap: var(--space-4);
        box-shadow: var(--elev-raised);
      }
      .messenger-header {
        display: flex; align-items: center; gap: var(--space-3);
        padding-block-end: var(--space-3);
        border-bottom: 1px solid var(--border-soft);
      }
      .messenger-avatar {
        width: 36px; height: 36px;
        border-radius: var(--radius-pill);
        background: var(--accent);
        color: var(--accent-on);
        display: inline-flex; align-items: center; justify-content: center;
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 500;
        letter-spacing: -0.02em;
      }
      .messenger-name {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
        line-height: 1.2;
      }
      .messenger-status {
        font-size: var(--text-xs);
        color: var(--muted);
        line-height: 1.2;
        margin-block-start: 2px;
      }
      .bubble {
        max-width: 86%;
        padding: 10px 14px;
        font-size: var(--text-sm);
        line-height: 1.4;
        border-radius: var(--radius-lg);
      }
      .bubble-in {
        align-self: flex-start;
        background: var(--surface-warm);
        color: var(--fg);
        border: 1px solid var(--border-soft);
        border-bottom-left-radius: var(--radius-sm);
      }
      .bubble-out {
        align-self: flex-end;
        background: var(--fg);
        color: #ffffff;
        border-bottom-right-radius: var(--radius-sm);
      }
      .messenger-input {
        margin-block-start: var(--space-2);
        padding: 10px 14px;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        font-size: var(--text-sm);
        color: var(--meta);
        background: var(--surface);
      }

      /* ─── Features grid ─────────────────────────────────────── */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }

      /* ─── Form section ──────────────────────────────────────── */
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; gap: var(--space-8); } }
      .form {
        display: flex; flex-direction: column; gap: var(--space-4);
        max-width: 460px;
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
      }
      .form-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-2);
        flex-wrap: wrap;
      }

      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
    </style>
  <style data-hey-responsive-repair>
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
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · intercom</p>
            <h1>AI-first customer service, built on real conversations.</h1>
            <p class="lead" style="max-width: 56ch">
              Fin handles the routine questions instantly, your team handles the rest.
              One platform for every message — chat, email, phone, ticket — with the
              warmth of a human and the speed of a machine.
            </p>
            <div class="hero-actions">
              
              
            </div>
            <p class="meta" style="margin-block-start: var(--space-4)">
              No credit card · 14-day trial · cancel anytime
            </p>
          </div>

          <aside class="messenger" aria-label="Messenger preview">
            <header class="messenger-header">
              <span class="messenger-avatar" aria-hidden="true">F</span>
              <div>
                <div class="messenger-name">Fin</div>
                <div class="messenger-status">
                  <span class="badge badge-success" style="padding: 2px 8px">
                    <span class="badge-dot" aria-hidden="true"></span>
                    Online
                  </span>
                </div>
              </div>
            </header>
            <div class="stack-2" style="display: flex; flex-direction: column; gap: var(--space-2)">
              <div class="bubble bubble-in">Hi there — how can I help today?</div>
              <div class="bubble bubble-out">Where do I update my billing address?</div>
              <div class="bubble bubble-in">
                Settings → Billing → Payment details. Want me to open it for you?
              </div>
            </div>
            <div class="messenger-input" role="presentation">Write a reply…</div>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">A conversational system, not a help-desk form.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <p class="card-eyebrow">Fin AI</p>
            <h3>Answers in seconds</h3>
            <p class="body-muted body-sm">
              Trained on your help center, past conversations, and product docs.
              Resolves up to 50% of queries with no human escalation.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">Inbox</p>
            <h3>One thread per customer</h3>
            <p class="body-muted body-sm">
              Chat, email, phone, and social messages collapse into a single
              conversation — your team never asks the customer to repeat themselves.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">Workflows</p>
            <h3>Sharp by design</h3>
            <p class="body-muted body-sm">
              4px button corners, oat-tone borders, 80px Saans display with
              -2.4px tracking — the system insists on precision.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Get started</p>
            <h2>Install the Messenger in three minutes.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Drop one script into your site, point Fin at your help center, and
              the conversation surface is live. No backend rewrites, no design audit.
            </p>
            <p class="meta">
              Press <kbd>⌘</kbd> <kbd>K</kbd> anywhere to search the docs.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">We'll send setup steps and nothing else.</p>
            </div>
            <div class="field">
              <label for="company">Company</label>
              <input id="company" type="text" placeholder="Acme, Inc." autocomplete="organization" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-accent">
                Start free trial
                <svg class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <button type="button" class="btn btn-outline">Talk to sales</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=intercom_default;return module.exports}});
//# sourceMappingURL=client.intercom.js.map