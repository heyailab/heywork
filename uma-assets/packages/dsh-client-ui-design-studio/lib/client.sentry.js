
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.sentry.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var sentry_default={"contract":`## 1. Visual Theme & Atmosphere

Sentry's website is a dark-mode-first developer tool interface that speaks the language of code editors and terminal windows. The entire aesthetic is rooted in deep purple-black backgrounds (\`#1f1633\`, \`#150f23\`) that evoke the late-night debugging sessions Sentry was built for. Against this inky canvas, a carefully curated set of purples, pinks, and a distinctive lime-green accent (\`#c2ef4e\`) create a visual system that feels simultaneously technical and vibrant.

The typography pairing is deliberate: "Dammit Sans" appears at hero scale (88px, weight 700) as a display font with personality and attitude that matches Sentry's irreverent brand voice ("Code breaks. Fix it faster."), while Rubik serves as the workhorse UI font across all functional text — headings, body, buttons, captions, and navigation. Monaco provides the monospace layer for code snippets and technical content, completing the developer-tool trinity.

What makes Sentry distinctive is its embrace of the "dark IDE" aesthetic without feeling cold or sterile. Warm purple tones replace the typical cool grays of developer tools, and bold illustrative elements (3D characters, colorful product screenshots) punctuate the dark canvas. The button system uses a signature muted purple (\`#79628c\`) with inset shadows that creates a tactile, almost physical quality — buttons feel like they could be pressed into the surface.

**Key Characteristics:**
- Dark purple-black backgrounds (\`#1f1633\`, \`#150f23\`) — never pure black
- Warm purple accent spectrum: from deep (\`#362d59\`) through mid (\`#79628c\`, \`#6a5fc1\`) to vibrant (\`#422082\`)
- Lime-green accent (\`#c2ef4e\`) for high-visibility CTAs and highlights
- Pink/coral accents (\`#ffb287\`, \`#fa7faa\`) for focus states and secondary highlights
- "Dammit Sans" display font for brand personality at hero scale
- Rubik as primary UI font with uppercase letter-spaced labels
- Monaco monospace for code elements
- Inset shadows on buttons creating tactile depth
- Frosted glass effects with \`blur(18px) saturate(180%)\`

## 4. Component Stylings

### Buttons

**Primary Muted Purple**
- Background: \`#79628c\` (rgb(121, 98, 140))
- Text: \`#ffffff\`, uppercase, 14px, weight 500–700, letter-spacing 0.2px
- Border: \`1px solid #584674\`
- Radius: 13px
- Shadow: \`rgba(0, 0, 0, 0.1) 0px 1px 3px 0px inset\` (tactile inset)
- Hover: elevated shadow \`rgba(0, 0, 0, 0.18) 0px 0.5rem 1.5rem\`

**Glass White**
- Background: \`rgba(255, 255, 255, 0.18)\` (frosted glass)
- Text: \`#ffffff\`
- Padding: 8px
- Radius: 12px (left-aligned variant: \`12px 0px 0px 12px\`)
- Shadow: \`rgba(0, 0, 0, 0.08) 0px 2px 8px\`
- Hover background: \`rgba(54, 22, 107, 0.14)\`
- Use: Secondary actions on dark surfaces

**White Solid**
- Background: \`#ffffff\`
- Text: \`#1f1633\`
- Padding: 12px 16px
- Radius: 8px
- Hover: background transitions to \`#6a5fc1\`, text to white
- Focus: background \`#ffb287\` (coral), outline \`rgb(106, 95, 193) solid 0.125rem\`
- Use: High-visibility CTA on dark backgrounds

**Deep Violet (Select/Dropdown)**
- Background: \`#422082\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 8px

### Inputs

**Text Input**
- Background: \`#ffffff\`
- Text: \`#1f1633\`
- Border: \`1px solid #cfcfdb\`
- Padding: 8px 12px
- Radius: 6px
- Focus: border-color stays \`#cfcfdb\`, shadow \`rgba(0, 0, 0, 0.15) 0px 2px 10px inset\`

### Links
- **Default on dark**: \`#ffffff\`, underline decoration
- **Hover**: color transitions to \`#6a5fc1\` (Sentry Purple)
- **Purple links**: \`#6a5fc1\` default, hover underline
- **Lime accent links**: \`#c2ef4e\` default, hover to \`#6a5fc1\`
- **Dark context links**: \`#362d59\`, hover to \`#ffffff\`

### Cards & Containers
- Background: semi-transparent or dark purple surfaces
- Radius: 8px–12px
- Shadow: \`rgba(0, 0, 0, 0.1) 0px 10px 15px -3px\`
- Backdrop filter: \`blur(18px) saturate(180%)\` for glass effects

### Navigation
- Dark transparent header over hero content
- Rubik 15px weight 500 for nav links
- White text, hover to Sentry Purple (\`#6a5fc1\`)
- Uppercase labels with 0.2px letter-spacing for categories
- Mobile: hamburger menu, full-width expanded

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 5px, 6px, 8px, 12px, 16px, 24px, 32px, 40px, 44px, 45px, 47px

### Grid & Container
- Max content width: 1152px (XL breakpoint)
- Responsive padding: 2rem (mobile) → 4rem (tablet+)
- Content centered within container
- Full-width dark sections with contained inner content

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 576px | Single column, stacked layout |
| Small Tablet | 576–640px | Minor width adjustments |
| Tablet | 640–768px | 2-column begins |
| Small Desktop | 768–992px | Full nav visible |
| Desktop | 992–1152px | Standard layout |
| Large Desktop | 1152–1440px | Max-width content |

### Whitespace Philosophy
- **Dark breathing room**: Generous vertical spacing between sections (64px–80px+) lets the dark background serve as a visual rest.
- **Content islands**: Feature sections are self-contained blocks floating in the dark purple sea, each with its own internal spacing rhythm.
- **Asymmetric padding**: Buttons use asymmetric padding patterns (12px 16px, 8px 12px) that feel organic rather than rigid.

### Border Radius Scale
- Minimal (6px): Form inputs, small interactive elements
- Standard (8px): Buttons, cards, containers
- Comfortable (10px–12px): Larger containers, glass panels
- Rounded (13px): Primary muted buttons
- Pill (18px): Image containers, badges

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Sunken (Level -1) | Inset shadow \`rgba(0, 0, 0, 0.1) 0px 1px 3px inset\` | Primary buttons (tactile pressed feel) |
| Flat (Level 0) | No shadow | Default surfaces, dark backgrounds |
| Surface (Level 1) | \`rgba(0, 0, 0, 0.08) 0px 2px 8px\` | Glass buttons, subtle cards |
| Elevated (Level 2) | \`rgba(0, 0, 0, 0.1) 0px 10px 15px -3px\` | Cards, floating panels |
| Prominent (Level 3) | \`rgba(0, 0, 0, 0.18) 0px 0.5rem 1.5rem\` | Hover states, modals |
| Ambient (Level 4) | \`rgba(22, 15, 36, 0.9) 0px 4px 4px 9px\` | Deep purple ambient glow around hero |

**Shadow Philosophy**: Sentry uses a unique combination of inset shadows (buttons feel pressed INTO the surface) and ambient glows (content radiates from the dark background). The deep purple ambient shadow (\`rgba(22, 15, 36, 0.9)\`) is the signature — it creates a bioluminescent quality where content seems to emit its own purple-tinted light.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <576px | Single column, hamburger nav, stacked CTAs |
| Tablet | 576–768px | 2-column feature grids begin |
| Small Desktop | 768–992px | Full navigation, side-by-side layouts |
| Desktop | 992–1152px | Max-width container, full layout |
| Large | >1152px | Content max-width maintained, generous margins |

### Collapsing Strategy
- Hero text: 88px Dammit Sans → 60px → mobile scales
- Navigation: horizontal → hamburger with slide-out
- Feature sections: side-by-side → stacked cards
- Buttons: inline → full-width stacked on mobile
- Container padding: 4rem → 2rem`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sentry — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/sentry. Dark-mode-first developer tool
        aesthetic — deep purple-black canvas, Rubik UI, Monaco code, signature lime-green pop."
    />

    <style>
      :root {
        --bg: #1f1633;
        --surface: #150f23;
        --surface-warm: var(--surface);

        --fg: #ffffff;
        --fg-2: #e5e7eb;
        --muted: #9d96b3;
        --meta: var(--muted);

        --border: #362d59;
        --border-soft: var(--border);

        --accent: #6a5fc1;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Dammit Sans", "Rubik", -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-body: "Rubik", -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-mono: Monaco, Menlo, "Ubuntu Mono", ui-monospace, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 30px;
        --text-3xl: 60px;
        --text-4xl: 88px;

        --leading-body: 1.5;
        --leading-tight: 1.2;
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
        --section-y-tablet: 64px;
        --section-y-phone: 48px;

        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1152px;
        --container-gutter-desktop: 64px;
        --container-gutter-tablet: 32px;
        --container-gutter-phone: 24px;
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

      /* ─── Typography — Rubik workhorse; Dammit Sans hero only ── */
      h1, h2, h3 {
        font-family: var(--font-body);  /* Rubik for section + card headings */
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      h1 {
        font-family: var(--font-display); /* Dammit Sans — hero only */
        font-size: var(--text-4xl);
        font-weight: 700;
        letter-spacing: var(--tracking-display);
      }
      h2 { font-size: var(--text-2xl); font-weight: 400; }
      h3 { font-size: var(--text-xl); font-weight: 500; }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* Uppercase eyebrow — Sentry's systematic "technical label" pattern */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.2px;
        font-weight: 600;
      }
      /* Lime-green eyebrow — the signature pop accent. Per DESIGN.md §9:
         "Use once per section maximum." Raw hex is justified here because
         the lime is a brand-identity color not represented in the shared
         schema and DESIGN.md explicitly anchors its usage. */
      .eyebrow-pop {
        font-size: var(--text-xs);
        color: #c2ef4e;
        text-transform: uppercase;
        letter-spacing: 0.25px;
        font-weight: 600;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — uppercase, letter-spaced, purple-tinted ──── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 16px;
        border-radius: var(--radius-md);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        border: none;
        text-transform: uppercase;
        letter-spacing: 0.2px;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary white solid — DESIGN.md "White Solid": high-visibility CTA
         on dark backgrounds. Hover transitions to Sentry Purple. */
      .btn-primary {
        background: var(--fg);
        color: var(--bg);
      }
      .btn-primary:hover { background: var(--accent); color: var(--accent-on); }
      .btn-primary:active { background: var(--accent-active); }
      /* Secondary muted purple — DESIGN.md "Primary Muted Purple": tactile
         inset shadow, the workhorse button. */
      .btn-secondary {
        background: #79628c;            /* Muted Purple — DESIGN.md §4 button bg */
        color: var(--fg);
        border: 1px solid #584674;      /* DESIGN.md §4 button border */
        box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0 inset;  /* tactile pressed */
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, #79628c, white 6%);
        box-shadow: rgba(0, 0, 0, 0.18) 0 8px 24px;
      }

      /* ─── Inputs — light context on dark surfaces ─────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--fg); }
      .field input {
        padding: 8px 12px;
        border-radius: var(--radius-sm);     /* 6px — DESIGN.md inputs */
        border: 1px solid #cfcfdb;           /* DESIGN.md "Input Border" — light context */
        background: var(--fg);               /* white input on dark surface */
        color: var(--bg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: #cfcfdb;
        box-shadow: rgba(0, 0, 0, 0.15) 0 2px 10px inset;  /* DESIGN.md §4 input focus */
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — dark surfaces with elevated shadow ──────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
      }
      .card h3 { color: var(--fg); }
      .card a { color: var(--accent); font-weight: 500; }
      .card a:hover { color: var(--fg); }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px var(--space-2);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.6;
        text-transform: uppercase; letter-spacing: 0.2px;
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), transparent 82%);
      }
      .badge-muted {
        color: var(--muted);
        background: color-mix(in oklab, var(--muted), transparent 80%);
      }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--fg-2);
      }
      code {
        font-family: var(--font-mono);
        color: #dcdcaa;                       /* DESIGN.md "Code Yellow" — syntax tokens */
        font-size: 0.95em;
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero {
        /* Ambient purple glow — DESIGN.md §6 Level 4 signature treatment.
           Inlined per-component because it's hero-specific, not generic. */
        box-shadow: rgba(22, 15, 36, 0.9) 0 4px 4px 9px;
      }
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
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
      <section data-od-id="hero" class="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow-pop">Reference fixture · sentry</p>
            <h1>Code breaks. Fix it faster.</h1>
            <p class="lead" style="max-width: 52ch">
              Application monitoring built for the late-night debugging session.
              Errors, traces, and replays threaded together so you ship without surprises.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm">API status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <p class="body-sm body-muted">Last reviewed <time datetime="2026-05-18">2026-05-18</time> · v1.0</p>
            <p class="body-sm body-muted">Press <kbd>⌘</kbd> <kbd>K</kbd> to jump to <code>traces</code>.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 24ch">Dark purple void, warm-tinted shadows, surgical accents.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Warm purple-black</h3>
            <p class="body-muted body-sm">
              --bg (#1f1633) → --surface (#150f23). Never pure black.
              The warmth is what separates Sentry from a generic terminal-dark UI.
            </p>
            
          </article>
          <article class="card">
            <h3>Uppercase as system</h3>
            <p class="body-muted body-sm">
              Buttons, eyebrows, badges — all letter-spaced 0.2px uppercase. Rubik
              500–700. A systematic "technical label" pattern throughout.
            </p>
            
          </article>
          <article class="card">
            <h3>Tactile inset buttons</h3>
            <p class="body-muted body-sm">
              Muted purple (#79628c) with a subtle inset shadow — buttons feel
              pressed INTO the surface. Hover lifts with a warm purple cast.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs lit on the dark purple void.</h2>
            <p class="body-muted" style="max-width: 48ch">
              White input fields cut against the warm purple canvas — the same
              light-context pattern Sentry uses for sign-in and onboarding flows.
              Focus rings stay Sentry Purple (<code>#6a5fc1</code>).
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@sentry.io" autocomplete="email" required />
              <p class="field-help">We'll wire up your first project. No spam, ever.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get started</button>
              <button type="button" class="btn btn-secondary">Talk to sales</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=sentry_default;return module.exports}});
//# sourceMappingURL=client.sentry.js.map