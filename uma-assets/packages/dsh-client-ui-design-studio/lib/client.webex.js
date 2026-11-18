
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.webex.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var webex_default={"contract":`## 1. Visual Theme & Atmosphere

Webex is cleaner, friendlier, and more product-led than Cisco corporate while still living inside the same trust-oriented universe. The brand language combines bright white canvases with dark in-product surfaces, then anchors interaction around a precise family of blue action colors drawn from Momentum. The result is a collaboration platform aesthetic: capable, legible, modern, and designed for continuous use rather than one-shot marketing drama.

Typography is driven by the Momentum system, whose primary font stack is \`Momentum, Inter, Arial, Helvetica Neue, Helvetica, sans-serif\`. This gives Webex a more software-native rhythm than Cisco's broader corporate presence. Headings should be clear and confident, but not monumental. Body copy should feel practical and human. In contrast to Cisco's singular-signal visual system, Webex allows a broader supporting collaboration palette — cobalt, cyan, mint, lime, gold, orange, pink, purple — but these should appear as **secondary accents** for teams, avatars, presence, or workspace state, not as uncontrolled decoration.

What defines Webex is **blue-guided clarity plus collaborative color**. Action is blue. Surfaces are simple. Supporting colors represent people, teams, or activity.

**Key Characteristics:**
- Momentum typography stack with clean product rhythm
- Blue action system centered on \`#1170cf\`, \`#0353a8\`, and \`#063a75\`
- White marketing/product canvases paired with optional charcoal dark-mode surfaces
- Soft pill geometry for actions and controls
- Collaboration-spectrum accent colors used sparingly for people/workspaces
- Product-first clarity over ornamental flourish
- Motion should feel polished and unobtrusive

## 4. Component Stylings

### Buttons

**Primary Blue Pill**
- Background: Webex Action Blue (\`#1170cf\`)
- Text: White (\`#ffffff\`)
- Radius: pill
- Hover: \`#0353a8\`
- Active: \`#063a75\`

**Secondary Outline / Ghost on Light**
- Background: transparent or white
- Text: \`#1170cf\`
- Border: subtle dark or blue-tinted alpha border
- Radius: pill
- Purpose: secondary CTA on white or light product surfaces

**Secondary Outline / Ghost on Dark**
- Background: transparent or \`#1a1a1a\`
- Text: \`#64b4fa\` or white for the strongest emphasis
- Border: 1px white-alpha or Accent Light Blue (\`#64b4fa\`) depending on emphasis
- Radius: pill
- Hover: soft blue-tinted dark fill with the text color preserved
- Focus ring: 2px Accent Light Blue halo
- Purpose: dark-surface secondary CTA without dropping below contrast targets

### Cards & Containers
- Light cards: white fill with subtle outline
- Dark cards: \`#1a1a1a\` fill with bright text and light outline
- Radius: 16px
- Keep interiors airy; do not over-densify by default

### Inputs & Controls
- Light surfaces: subtle outline, blue focus
- Dark surfaces: bright text, soft white-alpha outline, blue focus signal
- Toggles, tabs, and nav should feel precise and product-native, not ornamental

### Collaboration Tokens
- Use team-spectrum colors for presence chips, avatar backgrounds, workspace badges, or lightweight categorization
- Do not assign them to all primary buttons or all large surfaces

### Brand-Specific Recipes

**Meeting Card**
- Anatomy: title, time block, participant count, host avatar, device or room status, primary join action
- States: upcoming, live, ended, recording, muted-device warning
- Brand behavior: primary action stays blue; meeting state uses subtle chips rather than full-surface color fills

**Presence Chip**
- Anatomy: avatar or initials, user name, compact status dot/chip, optional location/device label
- Sizes: 24px compact, 32px default, 40px prominent
- States: available, presenting, in meeting, away, do-not-disturb
- Color rule: use collaboration colors as supporting identity accents, not as replacements for semantic status

**Workspace Sidebar**
- Anatomy: workspace switcher, search, primary nav groups, badge counts, pinned spaces, footer utilities
- Behavior: keep hierarchy obvious and allow badge counts or unread state to read at a glance
- States: selected item, unread, hovered, collapsed narrow mode

**Roster Row**
- Anatomy: avatar, display name, role label, mute/video state, hand-raise or reaction slot, overflow actions
- States: speaking, muted, hand raised, spotlighted, disconnected
- Density: support both meeting roster density and more spacious messaging/contact density

## 5. Layout Principles

### Spacing & Grid
- Base rhythm: 8px
- Common scale: 8px, 12px, 16px, 24px, 32px, 48px, 64px, 88px
- Use clean marketing bands and product-story sections
- Prefer simple grids with clear scanning order
- Breakpoints: mobile up to 767px, tablet 768px-1199px, desktop 1200px and above

### Composition
- White space is important; the UI should not feel cramped
- Marketing layouts should balance clarity with product focus
- Collaboration/product pages may mix white sections with dark embedded product surfaces
- Blue should lead the eye; collaboration colors should support, not compete
- On tablet, reduce multi-panel collaboration layouts to two primary regions and preserve a clear action rail
- On mobile, stack sidebars beneath the main header, collapse meeting side-panels into drawers, and keep call controls centered in a single thumb-reachable row
- Navigation should shift to a compact app bar plus drawer on smaller screens rather than shrinking labels until they wrap

### Accessibility & Responsiveness
- Minimum touch target: 44px by 44px for buttons, tabs, roster actions, and call controls
- Maintain visible keyboard focus with an Accent Light Blue halo on both light and dark surfaces
- Any hover-revealed affordance must also appear on focus and touch
- Respect reduced-motion users by replacing staggered entrance motion with instant layout plus subtle opacity changes only

## 6. Motion & Interaction

- Motion should feel polished, calm, and practical
- Use fade, slide, and soft stagger in the 160ms–280ms range
- Hover and focus can use gentle blue glow or highlight
- Avoid loud spring physics or excessive flourish
- Under \`prefers-reduced-motion\`, remove stagger choreography and large panel slides; keep state feedback under 120ms with opacity or outline changes only`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webex - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/webex: cool collaboration surfaces with teal and violet meeting signals."
    />
    <style>
      :root {
        --bg: #f6f8fb;
        --surface: #ffffff;
        --surface-warm: #eef8f6;
        --fg: #0f172a;
        --fg-2: #334155;
        --muted: #64748b;
        --meta: #12a594;
        --border: #dbe4ee;
        --border-soft: #edf2f7;
        --accent: #00a3a6;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #22c55e;
        --warn: #f59e0b;
        --danger: #e11d48;
        --font-display: "CiscoSansTT", Inter, Arial, sans-serif;
        --font-body: "CiscoSansTT", Inter, Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 44px;
        --text-4xl: 60px;
        --leading-body: 1.55;
        --leading-tight: 1.1;
        --tracking-display: -0.015em;
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
        --radius-sm: 12px;
        --radius-md: 18px;
        --radius-lg: 28px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 20px 50px rgba(15, 23, 42, 0.10);
        --focus-ring: 0 0 0 4px rgba(0, 163, 166, 0.24);
        --motion-fast: 160ms;
        --motion-base: 240ms;
        --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 36px;
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
        background: radial-gradient(circle at 18% 12%, rgba(0, 163, 166, 0.22), transparent 34%), radial-gradient(circle at 82% 4%, rgba(91, 77, 246, 0.20), transparent 35%), #f6f8fb;
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
            <p class="eyebrow">Webex design system</p>
            <h1>Collaboration room</h1>
            <p class="lead">Soft collaboration gradients, meeting controls, and calm status color.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary meeting pill action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Webex component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>soft room tile</h3>
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
                <p>cool collaboration surfaces with teal and violet meeting signals.</p>
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
                  <label for="webex-input">Reference input</label>
                  <input id="webex-input" value="Webex system token" />
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
`};exports.default=webex_default;return module.exports}});
//# sourceMappingURL=client.webex.js.map