
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.github.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var github_default={"contract":`## 1. Visual Theme & Atmosphere

GitHub's surface is engineered, not decorated. Every pixel announces a stance: this is a tool for people who care about diffs, builds, and pull requests. The page background is a clean \`#ffffff\` (light) or \`#0d1117\` (dark), with content arranged on dense rectangular panes separated by hairline borders rather than negative space. Information density is the brand — list rows, code lines, repository headers, and notification cards are all packed close together so a power user can scan a hundred items without scrolling.

The signature accents are the **Primer blue** (\`#0969da\`) for links and primary actions, and **GitHub green** (\`#1a7f37\`) for merged states, success, and the merge button itself. Both feel slightly muted compared to consumer-product blues and greens — saturated enough to read against the dense gray text, restrained enough to disappear into the background when several appear in one viewport.

Typography uses the **system-ui** stack across the entire product so text renders crisply on every OS, paired with **SFMono / Menlo / Consolas** for code. There is no editorial display font; GitHub's voice is the voice of the system you're already on.

**Key Characteristics:**
- True white canvas (\`#ffffff\`) or deep navy-black (\`#0d1117\`) — no warmth, no tint
- Hairline gray borders (\`#d0d7de\`) define every pane and panel
- Primer blue (\`#0969da\`) for links/primary; GitHub green (\`#1a7f37\`) for success/merge
- system-ui for prose; SFMono for code — no custom typeface
- Dense list rows with minimal padding; whitespace is rare
- Octicon iconography at 16px / 24px — single-stroke, geometric, consistent
- Pill-shaped status badges with strong color semantics

## 4. Component Stylings

### Buttons

**Primary (Green)**
- Background: \`#1f883d\`
- Text: \`#ffffff\`
- Border: 1px solid \`rgba(31, 35, 40, 0.15)\`
- Padding: 5px 16px
- Radius: 6px
- Shadow: \`0 1px 0 rgba(31,35,40,0.1)\`
- Hover: background \`#1a7f37\`
- Use: "Create repository", "Merge pull request"

**Default**
- Background: \`#f6f8fa\`
- Text: \`#1f2328\`
- Border: 1px solid \`#d0d7de\`
- Padding: 5px 16px
- Radius: 6px
- Hover: background \`#f3f4f6\`, border \`#d0d7de\`

**Outline (Blue Link Style)**
- Background: \`#ffffff\`
- Text: \`#0969da\`
- Border: 1px solid \`#d0d7de\`
- Hover: background \`#0969da\`, text \`#ffffff\`

**Danger**
- Background: \`#ffffff\`
- Text: \`#cf222e\`
- Border: 1px solid \`#d0d7de\`
- Hover: background \`#a40e26\`, text \`#ffffff\`, border \`#a40e26\`

### Cards / Boxes
- Background: \`#ffffff\`
- Border: 1px solid \`#d0d7de\`
- Radius: 6px
- Padding: 16px (header) + 16px (body)
- Header has a \`#f6f8fa\` strip with bottom border.

### Inputs
- Background: \`#ffffff\`
- Border: 1px solid \`#d0d7de\`
- Radius: 6px
- Padding: 5px 12px
- Focus: border \`#0969da\`, ring \`0 0 0 3px rgba(9,105,218,0.3)\`

### Status Pills (Issue / PR)
- **Open**: background \`#1a7f37\`, text white, padding 4px 10px, radius 9999px.
- **Closed**: background \`#cf222e\`, text white.
- **Merged**: background \`#8250df\`, text white.
- **Draft**: background \`#6e7781\`, text white.

### Labels (Tags on Issues/PRs)
- Padding: 0 7px
- Radius: 9999px
- Font: 12px / 500
- Background and text are programmatic (label color → text computed for contrast).

## 5. Spacing & Layout

- **Base unit**: 4px. Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48.
- **Page max-width**: 1280px (\`Container-xl\`).
- **Sidebar**: 296px on desktop, collapses below 1012px.
- **Row padding**: 16px horizontal, 12px vertical (lists are dense by design).

## 6. Motion

- **Duration**: 80ms for hover; 200ms for menu/popover open.
- **Easing**: \`ease-out\` for opens, \`ease-in\` for closes.
- **Avoided**: page-load animation, parallax, persistent micro-interactions. Things appear; they do not perform.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GitHub — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/github. Every visible
        value comes from tokens.css. GitHub's signature moves: true white
        canvas, hairline borders (#d0d7de), Primer blue CTAs, GitHub green
        for success/merge, system-ui fonts, 14px body density."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #f6f8fa;
        --surface-warm: var(--surface);

        --fg:   #1f2328;
        --fg-2: #1f2328;
        --muted: #656d76;
        --meta:  #656d76;

        --border:      #d0d7de;
        --border-soft: #d8dee4;

        --accent:        #0969da;
        --accent-on:     #ffffff;
        --accent-hover:  #0550ae;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #1a7f37;
        --warn:    #9a6700;
        --danger:  #cf222e;

        --font-display: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        --font-body:    -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        --font-mono:    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 14px;
        --text-lg:   16px;
        --text-xl:   20px;
        --text-2xl:  24px;
        --text-3xl:  28px;
        --text-4xl:  32px;

        --leading-body:     1.5;
        --leading-tight:    1.25;
        --tracking-display: -0.01em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 64px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   6px;
        --radius-md:   6px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 1px 3px rgba(31, 35, 40, 0.12), 0 8px 24px rgba(66, 74, 83, 0.12);

        --focus-ring: 0 0 0 3px rgba(9, 105, 218, 0.3);

        --motion-fast:   80ms;
        --motion-base:   200ms;
        --ease-standard: ease-out;

        --container-max:            1280px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
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

      /* ─── Typography ─────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 600;
        margin: 0;
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-xl);
        /* 20px section heading: line-height 1.25, normal tracking. */
      }
      h3 {
        font-size: var(--text-lg);
        /* 16px sub-section/panel header: line-height 1.25.
           Overrides the shared --leading-tight set above. */
      }
      p { margin: 0; }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .body-xs { font-size: var(--text-xs); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 1px 4px;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }

      /* ─── Buttons ────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 5px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 400;
        line-height: 1.5;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: #1f883d;
        color: #ffffff;
        border-color: rgba(31, 35, 40, 0.15);
        box-shadow: 0 1px 0 rgba(31, 35, 40, 0.1);
        font-weight: 500;
      }
      .btn-primary:hover { background: var(--success); }
      .btn-default {
        background: var(--surface);
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-default:hover { background: #f3f4f6; }
      .btn-outline {
        background: var(--bg);
        color: var(--accent);
        border-color: var(--border);
      }
      .btn-outline:hover { background: var(--accent); color: white; }

      /* ─── Status pills ───────────────────────── */
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 500;
        color: white;
        line-height: 1;
      }
      .status-open    { background: #1a7f37; }
      .status-closed  { background: #cf222e; }
      .status-merged  { background: #8250df; }
      .status-draft   { background: #6e7781; }

      /* ─── Box / Card ─────────────────────────── */
      .box {
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        overflow: hidden;
      }
      .box-header {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        padding: var(--space-3) var(--space-4);
        font-weight: 600;
        font-size: var(--text-sm);
      }
      .box-body { padding: var(--space-4); }

      /* ─── Inputs ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; color: var(--fg); }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 5px 12px;
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--muted); }
      .field input:focus {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-8);
        align-items: start;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-4); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>

    <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-hey-layout-repair>.hey-preview-form > div { flex-wrap: wrap; } .hey-preview-form button { flex-shrink: 0; max-width: 100%; white-space: normal; }</style>
<style data-hey-form-layout>.hey-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .hey-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · github</p>
            <h1>Where the world builds software.</h1>
            <p class="body-muted" style="max-width:48ch;font-size:var(--text-lg);line-height:1.5;margin-top:var(--space-3)">
              Millions of developers and companies build, ship, and maintain
              their software on GitHub. Every value below comes from tokens.css
              — no raw hex, no off-token type.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside>
            <div class="box">
              <div class="box-header">open-design / design-systems</div>
              <div class="box-body stack-3">
                <div style="display:flex;align-items:center;justify-content:space-between">
                  <span class="body-sm" style="font-weight:600;color:var(--accent)">Pull requests</span>
                  <span class="status-pill status-open">Open</span>
                </div>
                <div style="font-size:var(--text-xs);color:var(--muted)">
                  #1652 · feat: add structured tokens for 5 brands
                </div>
                <div style="font-size:var(--text-xs);color:var(--muted)">
                  #1653 · feat: add batch 2 token fixtures
                </div>
                <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">
                  <span class="status-pill status-merged">Merged</span>
                  <span class="status-pill status-draft">Draft</span>
                  <span class="status-pill status-closed">Closed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2>Dense, functional, system-native.</h2>
        </div>

        <div class="features-grid" style="margin-block-start:var(--space-6)">
          <article class="box stack-3">
            <div class="box-header">14px body</div>
            <div class="box-body">
              <p class="body-sm body-muted">
                Not 16px — GitHub's prose density is its identity. 14px base
                fits more content per viewport. system-ui renders instantly on
                every OS with zero webfont load.
              </p>
            </div>
          </article>
          <article class="box stack-3">
            <div class="box-header">Hairline borders</div>
            <div class="box-body">
              <p class="body-sm body-muted">
                <code>#d0d7de</code> — every pane, panel, and card. Structure
                communicated by stroke, not shadow. Density without visual noise.
              </p>
            </div>
          </article>
          <article class="box stack-3">
            <div class="box-header">Primer blue + green</div>
            <div class="box-body">
              <p class="body-sm body-muted">
                <code>#0969da</code> for all interactive affordances.
                <code>#1a7f37</code> exclusively for success/merge states.
                Both restrained — never decorative.
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="hey-form-layout">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Primer form inputs.</h2>
            <p class="body-muted" style="max-width:44ch">
              Focus: border <code>#0969da</code> + <code>0 0 0 3px rgba(9,105,218,0.3)</code>.
              5px 12px padding. 6px radius. Weight 600 label.
            </p>
          </div>
          <div role="group" class="hey-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="repo">Repository name</label>
              <input id="repo" type="text" placeholder="my-project" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Create repository</button>
              <button type="button" class="btn btn-default">Cancel</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=github_default;return module.exports}});
//# sourceMappingURL=client.github.js.map