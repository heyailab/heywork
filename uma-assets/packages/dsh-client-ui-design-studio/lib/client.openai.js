
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.openai.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var openai_default={"contract":`## 1. Visual Theme & Atmosphere

OpenAI's product surface reads like a research lab dressed for the public — clinical, restrained, deliberately quiet. The page background is a true white (\`#ffffff\`) layered against a near-black ink (\`#0d0d0d\`) with a subtle teal undertone, so even the text feels slightly cooled rather than aggressively dark. The result is a chromatic neutrality that puts model output, code, and prose front and center, not the chrome around them.

The signature move is the use of **Söhne** (or its system stand-in \`inter\`) at restrained weights — 400 for body, 500 for nav and labels, 600 for emphasis — paired with **Signifier**, a contemporary serif used for editorial display. Where most AI brands lean futuristic, OpenAI's serif headlines give the product a quietly literary tone, as if every announcement is an essay.

The shape system is uniformly soft: 8px–12px radii, 9999px pills for tags and chips, no harsh corners anywhere. Section transitions are denoted by whitespace rather than dividers; when borders appear they are \`#e5e5e5\` hairlines that read as the absence of color rather than its presence.

**Key Characteristics:**
- True white canvas (\`#ffffff\`) with deep teal-black ink (\`#0d0d0d\`)
- Söhne / Inter at modest weights (400, 500, 600) — restraint over assertion
- Signifier serif for editorial display headlines
- Soft 8–12px radii everywhere; 9999px pills for chips
- Hairline borders (\`#e5e5e5\`) used sparingly; whitespace as primary divider
- Single-color illustrations in deep teal — no gradients in marks
- Generous line-height (1.55–1.65) and tracking near zero

## 4. Component Stylings

### Buttons

**Primary**
- Background: \`#0d0d0d\`
- Text: \`#ffffff\`
- Padding: 10px 18px
- Radius: 9999px (full pill) on chips, 12px on rectangular CTAs
- Hover: \`#1a1a1a\` background
- Use: Primary CTA, "Try ChatGPT", "Sign in"

**Secondary**
- Background: \`#ffffff\`
- Text: \`#0d0d0d\`
- Border: 1px solid \`#e5e5e5\`
- Padding: 10px 18px
- Radius: 12px
- Hover: background \`#fafafa\`, border \`#d4d4d4\`

**Brand Accent**
- Background: \`#10a37f\`
- Text: \`#ffffff\`
- Padding: 10px 18px
- Radius: 12px
- Hover: \`#0a7a5e\`
- Use: Highlighted upgrade CTA, success path

### Cards
- Background: \`#ffffff\`
- Border: 1px solid \`#ededed\`
- Radius: 16px
- Padding: 24px–32px
- Shadow: none by default; on hover \`0 4px 16px rgba(13,13,13,0.06)\`

### Inputs
- Background: \`#ffffff\`
- Border: 1px solid \`#e5e5e5\`
- Radius: 12px
- Padding: 12px 14px
- Focus: border \`#10a37f\`, ring \`0 0 0 3px rgba(16,163,127,0.12)\`

### Pills & Tags
- Background: \`#f5f5f5\`
- Text: \`#3c3c3c\`
- Padding: 4px 10px
- Radius: 9999px
- Font: 12px / 500

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Container**: max-width 1200px, 24px gutter on mobile, 48px on desktop.
- **Section rhythm**: 96–128px vertical between major sections; 64px on mobile.
- **Grid**: 12-column desktop, 4-column mobile, 24px gap.

## 6. Motion

- **Duration**: 150–220ms for hover; 280–360ms for layout transitions.
- **Easing**: \`cubic-bezier(0.16, 1, 0.3, 1)\` (smooth out) for entrances.
- **Restraint**: no parallax, no scroll-jacking. Subtle fade and translate only.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OpenAI — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/openai. Every visible
        value comes from tokens.css. OpenAI's signature moves: true white
        canvas, Signifier serif for editorial display, Söhne sans for UI,
        OpenAI Teal accent (#10a37f), generous line-heights, hairline borders."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #f5f5f5;
        --surface-warm: #fafafa;

        --fg:   #0d0d0d;
        --fg-2: #1a1a1a;
        --muted: #6e6e6e;
        --meta:  #9b9b9b;

        --border:      #e5e5e5;
        --border-soft: #ededed;

        --accent:        #10a37f;
        --accent-on:     #ffffff;
        --accent-hover:  #0a7a5e;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #10a37f;
        --warn:    #f5a623;
        --danger:  #ef4146;

        --font-display: "Signifier", "Source Serif Pro", Georgia, ui-serif, serif;
        --font-body:    "Söhne", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
        --font-mono:    "Söhne Mono", ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   13px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   20px;
        --text-2xl:  28px;
        --text-3xl:  40px;
        --text-4xl:  56px;

        --leading-body:     1.65;
        --leading-tight:    1.08;
        --tracking-display: -0.02em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;
        --space-16: 64px;

        --section-y-desktop: 96px;
        --section-y-tablet:  64px;
        --section-y-phone:   48px;

        --radius-sm:   12px;
        --radius-md:   16px;
        --radius-lg:   16px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 4px 16px rgba(13, 13, 13, 0.06);

        --focus-ring: 0 0 0 3px rgba(16, 163, 127, 0.12);

        --motion-fast:   150ms;
        --motion-base:   220ms;
        --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 48px;
        --container-gutter-tablet:  24px;
        --container-gutter-phone:   24px;
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
        --hey-preview-gutter:           var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); --hey-preview-gutter:           var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); --hey-preview-gutter:           var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ─────────────────────────── */
      /* h1 uses Signifier (serif editorial voice). */
      h1 {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 400;
        letter-spacing: var(--tracking-display);
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      /* h2 and h3 use Söhne (sans UI voice). */
      h2 {
        font-family: var(--font-body);
        font-size: var(--text-2xl);
        font-weight: 600;
        /* 28px section heading: line-height 1.20, tracking -0.005em. */
        line-height: 1.20;
        letter-spacing: -0.005em;
        margin: 0;
        color: var(--fg);
      }
      h3 {
        font-family: var(--font-body);
        font-size: var(--text-xl);
        font-weight: 600;
        /* 20px sub-section: line-height 1.30, normal tracking.
           Overrides h1 leading-tight. */
        line-height: 1.30;
        margin: 0;
        color: var(--fg);
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.60;
        color: var(--muted);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .label {
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-family: var(--font-body);
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.875em;
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-sm);
        padding: 1px 5px;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ─────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 18px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
        border-radius: var(--radius-sm);
      }
      .btn-primary:hover { background: var(--fg-2); }
      .btn-secondary {
        background: var(--bg);
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-secondary:hover { background: var(--surface-warm); border-color: #d4d4d4; }
      .btn-teal {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-teal:hover { background: var(--accent-hover); }
      /* Chip / pill */
      .chip {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 500;
        background: var(--surface);
        color: var(--muted);
      }
      .chip-teal { background: #e8f5f0; color: var(--accent); }

      /* ─── Cards ──────────────────────────────── */
      .card {
        background: var(--bg);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover { box-shadow: var(--elev-raised); }

      /* ─── Inputs ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--fg); }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
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
      <!-- HERO — Signifier serif display voice. -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="label">Reference fixture · openai</p>
            <h1>AI that works for everyone.</h1>
            <p class="lead" style="max-width:46ch">
              OpenAI builds safe artificial general intelligence for humanity.
              A quietly literary interface: Signifier for display moments,
              Söhne for system text, OpenAI Teal as the lone accent.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside style="display:flex;flex-direction:column;gap:var(--space-4)">
            <div class="card">
              <p class="label" style="margin-bottom:var(--space-4)">Recent models</p>
              <div style="display:flex;flex-direction:column;gap:var(--space-3)">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:var(--text-sm);font-weight:500">GPT-4o</span>
                  <span class="chip chip-teal">Latest</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:var(--text-sm)">GPT-4 Turbo</span>
                  <span class="chip">Stable</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="font-size:var(--text-sm)">o1</span>
                  <span class="chip">Preview</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features" style="background:var(--surface-warm);margin-inline:calc(var(--hey-preview-gutter)*-1);padding-inline:var(--hey-preview-gutter)">
        <div class="stack-3" style="margin-bottom:var(--space-6)">
          <p class="label">What this fixture exercises</p>
          <h2>Restraint as identity.</h2>
        </div>

        <div class="features-grid">
          <article class="card stack-3">
            <h3>Two voices</h3>
            <p class="body-muted" style="font-size:var(--text-sm)">
              Signifier (serif) for editorial display moments only. Söhne sans
              for all UI and body text. Weights cap at 600 — 700+ feels off-brand.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Teal accent</h3>
            <p class="body-muted" style="font-size:var(--text-sm)">
              <code>#10a37f</code> — the lone color in an otherwise neutral system.
              Links, highlight badges, success path CTAs. Hairline borders
              (#e5e5e5) used sparingly; whitespace as primary divider.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Generous rhythm</h3>
            <p class="body-muted" style="font-size:var(--text-sm)">
              --leading-body: 1.65. --leading-tight (Signifier display): 1.08.
              96px section rhythm on desktop. Whitespace is the architecture.
            </p>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="hey-form-layout">
          <div class="stack-4">
            <p class="label">Form components</p>
            <h2>Soft radius, teal focus.</h2>
            <p class="lead" style="max-width:44ch">
              12px radius on inputs; border: 1px solid #e5e5e5 at rest.
              Focus: border <code>#10a37f</code> + 3px rgba ring.
            </p>
          </div>
          <div role="group" class="hey-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-teal">Sign in</button>
              <button type="button" class="btn btn-secondary">Create account</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=openai_default;return module.exports}});
//# sourceMappingURL=client.openai.js.map