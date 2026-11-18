
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.huggingface.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var huggingface_default={"contract":`## 1. Visual Theme & Atmosphere

Hugging Face is the rare ML brand that refuses to look serious. The hub leans into a sunshine-yellow accent (\`#ffd21e\`), a cartoon hugging-face emoji as the logo, and a confident **IBM Plex Mono** voice that reads more like a community zine than a research lab. The page background is a clean off-white (\`#fafafa\`) with text in a deep slate (\`#0d1117\`), and the yellow appears in pull quotes, tags, "new" badges, and the model-card header strip — never as an entire surface, always as punctuation.

The typographic system is monospace-forward in a way few product brands attempt: **IBM Plex Mono** for headings and tags, **Source Sans Pro** (or Inter) for body. The mix gives every page a "config file is the README" vibe — fitting for a platform built around \`.gitattributes\` and \`model-card.md\`.

Shapes are crisp, not soft: 4–6px radii, 1px solid borders that announce themselves rather than hide. Tables are dense, with row hover in a faint gray (\`#f3f4f6\`). The brand emoji punctuates everything — chips, headings, even error states wear a 🤗 — so the system feels human even when displaying technical data.

**Key Characteristics:**
- Sunshine yellow \`#ffd21e\` as the lone saturated accent
- IBM Plex Mono for headings and tags; Source Sans Pro for body
- Off-white canvas (\`#fafafa\`) with crisp 1px borders (\`#e5e7eb\`)
- 4–6px radii — closer to brutalist than rounded
- Hugging-face emoji 🤗 used unironically as a system glyph
- Dense tables, minimal padding — a community hub for power users
- Color-coded model categories (NLP blue, vision green, audio purple)

## 4. Component Stylings

### Buttons

**Primary**
- Background: \`#0d1117\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 6px
- Hover: \`#374151\`
- Use: "Use this model", primary forms.

**Yellow CTA**
- Background: \`#ffd21e\`
- Text: \`#0d1117\`
- Padding: 8px 16px
- Radius: 6px
- Hover: \`#f59e0b\`
- Use: "Pro upgrade", "Sponsor".

**Outline**
- Background: \`#ffffff\`
- Text: \`#0d1117\`
- Border: 1px solid \`#e5e7eb\`
- Hover: background \`#f3f4f6\`

### Cards / Model Cards
- Background: \`#ffffff\`
- Border: 1px solid \`#e5e7eb\`
- Radius: 6px
- Padding: 16px 20px
- Header strip: \`#ffd21e\` background, 4px tall, only on featured model cards.

### Inputs
- Background: \`#ffffff\`
- Border: 1px solid \`#e5e7eb\`
- Radius: 6px
- Padding: 8px 12px
- Focus: border \`#0d1117\`, ring \`0 0 0 3px rgba(13,17,23,0.1)\`

### Tags / Chips (Task / Framework)
- Background: category-tinted soft (\`#dbeafe\` for NLP, \`#dcfce7\` for vision, etc.)
- Text: matching strong category color.
- Padding: 2px 8px
- Radius: 4px
- Font: IBM Plex Mono 12px / 500

### Tables
- Header: background \`#fafafa\`, border-bottom 1px \`#e5e7eb\`.
- Row: border-bottom 1px \`#f3f4f6\`, hover \`#f3f4f6\`.
- Padding: 8px 16px per cell — dense by design.

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64.
- **Container**: max 1280px, 24px gutter.
- **Sidebar (model browser)**: 280px wide.
- **Section rhythm**: 64–96px vertical between major sections.

## 6. Motion

- **Duration**: 120ms for hover; 200ms for menu open.
- **Easing**: \`ease-out\`.
- **Tag pop**: a 1.05× scale on hover at 120ms — the only exception to flat-on-hover.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hugging Face — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/huggingface. ML community hub:
        IBM Plex Mono headings, HF Yellow badge accent, crisp 1px borders, 4-6px radius."
    />

    <style>
      :root {
        --bg: #fafafa;
        --surface: #ffffff;
        --surface-warm: #fff4cc;

        --fg: #0d1117;
        --fg-2: #374151;
        --muted: #6b7280;
        --meta: var(--muted);

        --border: #e5e7eb;
        --border-soft: #f3f4f6;

        --accent: #ffd21e;
        --accent-on: #0d1117;
        --accent-hover: #f59e0b;
        --accent-active: color-mix(in oklab, var(--accent), black 20%);

        --success: #16a34a;
        --warn: #f59e0b;
        --danger: #dc2626;

        --font-display: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        --font-body: "Source Sans Pro", Inter, system-ui, -apple-system, sans-serif;
        --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 15px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 40px;
        --text-4xl: 48px;

        --leading-body: 1.55;
        --leading-tight: 1.1;
        --tracking-display: -0.01em;

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

        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 2px 8px color-mix(in oklab, var(--fg), transparent 90%);

        --focus-ring: 0 0 0 3px rgba(13, 17, 23, 0.1);

        --motion-fast: 120ms;
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

      /* ─── Typography — IBM Plex Mono for all headings/tags ─── */
      h1, h2, h3 {
        font-family: var(--font-display); /* IBM Plex Mono — "config file is README" */
        font-weight: 600;                 /* Weight cap at 600 — 700 is too loud vs yellow */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: var(--tracking-display);
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-xl); }
      p { margin: 0; font-family: var(--font-body); } /* Source Sans Pro for all body */
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* IBM Plex Mono tags — look like the strings devs paste into Python */
      .eyebrow {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--muted);
        letter-spacing: 0.02em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — dark primary, yellow CTA, outlined ──────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-md); /* 6px — crisp, not rounded */
        font-family: var(--font-display); /* IBM Plex Mono on buttons */
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: dark — "Use this model", primary actions */
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
      }
      .btn-primary:hover { background: var(--fg-2); }
      /* Yellow CTA: HF accent — "Pro upgrade", "Sponsor" */
      .btn-secondary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-secondary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-display);
        font-size: var(--text-sm); font-weight: 500;
      }
      .field input {
        padding: 8px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--fg);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — model card style ──────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      /* Yellow header strip — featured model card indicator */
      .card.featured { border-top: 4px solid var(--accent); }

      /* ─── Badges — task category tags ───────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 2px 8px;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.2;
      }
      .badge-success { color: #16a34a; background: #dcfce7; }          /* Vision green */
      .badge-muted { color: var(--muted); background: var(--border-soft); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links, Kbd ────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: none; }
      a:hover { text-decoration: underline; }
      kbd {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--border-soft); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4); border: 1px solid var(--border);
        border-radius: var(--radius-md); background: var(--surface);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">reference-fixture · huggingface</p>
            <h1>The AI community building the future.</h1>
            <p class="lead" style="max-width: 52ch">
              The ML platform that refuses to look serious. Sunshine yellow,
              monospace everywhere, crisp 1px borders. A community zine, not a research lab.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="eyebrow">build status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                passing
              </span>
            </div>
            <p class="body-sm body-muted">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm body-muted">Press <kbd>⌘</kbd> <kbd>K</kbd> to search.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">what-this-fixture-exercises</p>
          <h2 style="max-width: 28ch">Mono headings. Yellow accents. Crisp borders.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card featured">
            <h3>IBM Plex Mono</h3>
            <p class="body-muted body-sm">
              All headings and tags use IBM Plex Mono — they look like strings
              developers paste into Python. Source Sans Pro for prose only.
            </p>
            
          </article>
          <article class="card">
            <h3>HF Yellow (#ffd21e)</h3>
            <p class="body-muted body-sm">
              --accent: #ffd21e. The sunshine yellow for badge strips, "new" pills,
              and sponsor CTAs. Dark text (--accent-on: #0d1117) for contrast.
            </p>
            
          </article>
          <article class="card">
            <h3>4–6px brutalist radius</h3>
            <p class="body-muted body-sm">
              --radius-md: 6px. Closer to brutalist than rounded. Borders announce
              themselves. Tables are dense — this is a hub for power users.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">form-components</p>
            <h2>Model search with crisp inputs.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs use 6px radius with 1px borders. Focus shifts border to --fg
              (#0d1117) with dark ring. Dark focus ring — 3px rgba(13,17,23,0.1).
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Email or username</label>
              <input id="email" type="email" placeholder="your@email.com" autocomplete="email" required />
              <p class="field-help">Sign in to download models and datasets.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Sign in</button>
              <button type="button" class="btn btn-secondary">Create account</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=huggingface_default;return module.exports}});
//# sourceMappingURL=client.huggingface.js.map