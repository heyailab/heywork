
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.replicate.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var replicate_default={"contract":`## 1. Visual Theme & Atmosphere

Replicate's interface is a developer playground crackling with creative energy — a bold, high-contrast design that feels more like a music festival poster than a typical API platform. The hero section explodes with a vibrant orange-red-magenta gradient that immediately signals "this is where AI models come alive," while the body of the page grounds itself in a clean white canvas where code snippets and model galleries take center stage.

The design personality is defined by two extreme choices: **massive display typography** (up to 128px) using the custom rb-freigeist-neue face, and **exclusively pill-shaped geometry** (9999px radius on everything). The display font is thick, bold, and confident — its heavy weight at enormous sizes creates text that feels like it's shouting with joy rather than whispering authority. Combined with basier-square for body text (a clean geometric sans) and JetBrains Mono for code, the system serves developers who want power and playfulness in equal measure.

What makes Replicate distinctive is its community-powered energy. The model gallery with AI-generated images, the dotted-underline links, the green status badges, and the "Imagine what you can build" closing manifesto all create a space that feels alive and participatory — not a corporate product page but a launchpad for creative developers.

**Key Characteristics:**
- Explosive orange-red-magenta gradient hero (#ea2804 brand anchor)
- Massive display typography (128px) in heavy rb-freigeist-neue
- Exclusively pill-shaped geometry: 9999px radius on EVERYTHING
- High-contrast black (#202020) and white palette with red brand accent
- Developer-community energy: model galleries, code examples, dotted-underline links
- Green status badges (#2b9a66) for live/operational indicators
- Bold/heavy font weights (600-700) creating maximum typographic impact
- Playful closing manifesto: "Imagine what you can build."

## 4. Component Stylings

### Buttons

**Dark Solid**
- Background: Replicate Dark (\`#202020\`)
- Text: Near White (\`#fcfcfc\`)
- Padding: 0px 4px (extremely compact)
- Outline: Replicate Dark 4px solid
- Radius: pill-shaped (implied by system)
- Maximum emphasis — dark pill on light surface

**White Outlined**
- Background: Pure White (\`#ffffff\`)
- Text: Replicate Dark (\`#202020\`)
- Border: \`1px solid #202020\`
- Radius: pill-shaped
- Clean outlined pill for secondary actions

**Transparent Glass**
- Background: \`rgba(255, 255, 255, 0.1)\` (frosted glass)
- Text: Replicate Dark (\`#202020\`)
- Padding: 6px 56px 6px 28px (asymmetric — icon/search layout)
- Border: transparent
- Outline: Light Silver (\`#bbbbbb\`) 1px solid
- Used for search/input-like buttons

### Cards & Containers
- Background: Pure White or subtle gray
- Border: \`1px solid #202020\` for prominent containment
- Radius: pill-shaped (9999px) for badges, labels, images
- Shadow: minimal standard shadows
- Model gallery: grid of AI-generated image thumbnails
- Accent border: \`1px solid #ea2804\` for highlighted/featured items

### Inputs & Forms
- Background: \`rgba(255, 255, 255, 0.1)\` (frosted glass)
- Text: Replicate Dark (\`#202020\`)
- Border: transparent with outline
- Padding: 6px 56px 6px 28px (search-bar style)

### Navigation
- Clean horizontal nav on white
- Logo: Replicate wordmark in dark
- Links: dark text with dotted underline on hover
- CTA: Dark pill button
- GitHub link and sign-in

### Image Treatment
- AI-generated model output images in a gallery grid
- Pill-shaped image containers (9999px)
- Full-width gradient hero section
- Product screenshots with dark backgrounds

### Distinctive Components

**Model Gallery Grid**
- Horizontal scrolling or grid of AI-generated images
- Each image in a pill-shaped container
- Model names and run counts displayed
- The visual heart of the community platform

**Dotted Underline Links**
- Links use \`text-decoration: underline dotted #bbbbbb\`
- A distinctive, developer-notebook aesthetic
- Lighter and more casual than solid underlines

**Status Badges**
- Status Green (\`#2b9a66\`) background with white text
- Pill-shaped (9999px)
- 14px font size
- Indicates model availability/operational status

**Manifesto Section**
- "Imagine what you can build." at 128px
- Dark background with white text
- Images embedded between words
- The emotional climax of the page

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 6px, 8px, 10px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 160px, 192px
- Button padding: varies widely (0px 4px to 6px 56px)
- Section vertical spacing: very generous (96–192px)

### Grid & Container
- Fluid width with responsive constraints
- Hero: full-width gradient with centered content
- Model gallery: multi-column responsive grid
- Feature sections: mixed layouts
- Code examples: contained dark blocks

### Whitespace Philosophy
- **Bold and generous**: Massive spacing between sections (up to 192px) creates distinct zones.
- **Dense within galleries**: Model images are tightly packed in the grid for browsable density.
- **The gradient IS the whitespace**: The hero gradient section occupies significant vertical space as a colored void.

### Border Radius Scale
- **Pill (9999px)**: The ONLY radius in the system. Everything interactive, every image, every badge, every label, every container uses 9999px. This is the most extreme pill-radius commitment in any major tech brand.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | White body, text blocks |
| Bordered (Level 1) | \`1px solid #202020\` | Cards, buttons, containers |
| Accent Border (Level 2) | \`1px solid #ea2804\` | Featured/highlighted items |
| Gradient Hero (Level 3) | Full-width blaze gradient | Hero section, maximum visual impact |
| Dark Section (Level 4) | Dark bg (#202020) with light text | Manifesto, footer, feature sections |

**Shadow Philosophy**: Replicate relies on **borders and background color** for depth rather than shadows. The \`1px solid #202020\` border is the primary containment mechanism. The dramatic gradient hero and dark/light section alternation provide all the depth the design needs.

## 8. Responsive Behavior

### Breakpoints
*No explicit breakpoints detected — likely using fluid/container-query responsive system.*

### Touch Targets
- Pill buttons with generous padding
- Gallery images as large touch targets
- Navigation adequately spaced

### Collapsing Strategy
- **Hero text**: 128px → 72px → 48px progressive scaling
- **Model gallery**: Grid reduces columns
- **Navigation**: Collapses to hamburger
- **Manifesto**: Scales down but maintains impact

### Image Behavior
- AI-generated images scale within pill containers
- Gallery reflows to fewer columns on narrow screens
- Hero gradient maintained at all sizes`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Replicate — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/replicate. Developer playground:
        everything pill-shaped (9999px), heavy display (700), red brand accent."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f8f8f8;
        --surface-warm: var(--surface);

        --fg: #202020;
        --fg-2: #4e4e4e;
        --muted: #646464;
        --meta: #8d8d8d;

        --border: #202020;
        --border-soft: #e5e5e5;

        --accent: #ea2804;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 16%);

        --success: #2b9a66;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "rb-freigeist-neue", ui-sans-serif, system-ui, sans-serif;
        --font-body: "basier-square", ui-sans-serif, system-ui, sans-serif;
        --font-mono: "jetbrains-mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 30px;
        --text-2xl: 48px;
        --text-3xl: 72px;
        --text-4xl: 128px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: -0.025em;

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

        --radius-sm: 9999px;
        --radius-md: 9999px;
        --radius-lg: 9999px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0 1px var(--accent);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 120ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
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
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — heavy display 700, quiet body 400 ────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 700;               /* Thundering heavy display */
        line-height: var(--leading-tight);
        margin: 0;
      }
      h1 { font-size: var(--text-3xl); letter-spacing: var(--tracking-display); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-xl); }
      p { margin: 0; }
      .lead { font-family: var(--font-body); font-size: var(--text-lg); color: var(--muted); line-height: var(--leading-body); font-weight: 400; }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        color: var(--meta);
        font-weight: 600;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — ALL pill-shaped, dark/outlined variants ─── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-pill); /* ALWAYS 9999px */
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: dark solid pill */
      .btn-primary {
        background: var(--fg);
        color: #fcfcfc;
        border-color: var(--fg);
        outline: 4px solid var(--fg);
        outline-offset: 2px;
      }
      .btn-primary:hover { background: #333333; border-color: #333333; outline-color: #333333; }
      /* Secondary: white outlined pill */
      .btn-secondary {
        background: var(--bg);
        color: var(--fg);
        border-color: var(--fg);
      }
      .btn-secondary:hover { background: var(--surface); }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-family: var(--font-body); font-size: var(--text-sm); font-weight: 600; }
      .field input {
        padding: 10px 16px;
        border-radius: var(--radius-pill); /* Pill input */
        border: 1px solid var(--fg);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--meta); }

      /* ─── Cards — bordered, pill-rounded ───────────────────── */
      .card {
        background: var(--bg);
        border: 1px solid var(--fg);
        border-radius: var(--radius-md); /* 9999px — still pill */
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      /* ─── Badges — pill status indicators ──────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 400; line-height: 1.4;
        text-transform: lowercase; /* Replicate uses lowercase tags */
      }
      .badge-success { color: #ffffff; background: var(--success); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 88%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links — dotted underline (#bbbbbb) — the signature ── */
      a { color: var(--fg); text-decoration: underline dotted #bbbbbb; text-underline-offset: 3px; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-pill);
        border: 1px solid var(--fg); background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4); border: 1px solid var(--fg);
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
            <p class="eyebrow">Reference fixture · replicate</p>
            <h1>Run models with a single API call.</h1>
            <p class="lead" style="max-width: 52ch">
              A developer playground crackling with creative energy.
              Bold, high-contrast, pill-shaped — everything.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--muted)">API status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                running
              </span>
            </div>
            <p class="body-sm" style="color: var(--meta)">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--meta)">Press <kbd>⌘</kbd> <kbd>K</kbd> to search.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Everything is pill-shaped. Everything.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Universal pill radius</h3>
            <p class="body-muted body-sm">
              --radius-sm/md/lg/pill: all 9999px. Buttons, cards, inputs,
              images, badges — the most extreme pill commitment in any tech brand.
            </p>
            
          </article>
          <article class="card">
            <h3>Heavy display, quiet body</h3>
            <p class="body-muted body-sm">
              rb-freigeist-neue at weight 700 thunders through headlines.
              basier-square at weight 400 handles body text silently. Extreme contrast.
            </p>
            
          </article>
          <article class="card">
            <h3>Dotted underline links</h3>
            <p class="body-muted body-sm">
              text-decoration: underline dotted #bbbbbb — a developer notebook
              aesthetic. Lighter and more casual than solid underlines.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Even inputs are pill-shaped.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs use 9999px radius consistent with the system commitment.
              Border is Replicate Dark (#202020) — heavy, high-contrast containment.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Your email</label>
              <input id="email" type="email" placeholder="dev@your.app" autocomplete="email" required />
              <p class="field-help">Get your API key.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get API key</button>
              <button type="button" class="btn btn-secondary">Explore models</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=replicate_default;return module.exports}});
//# sourceMappingURL=client.replicate.js.map