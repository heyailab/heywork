
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.superhuman.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var superhuman_default={"contract":`## 1. Visual Theme & Atmosphere

Superhuman's website feels like opening a luxury envelope — predominantly white, immaculately clean, with a single dramatic gesture of color that commands attention. The hero section is a cinematic purple gradient, a deep twilight wash of \`#1b1938\` that evokes the moment just before dawn, overlaid with confident white typography. Below this dramatic entrance, the rest of the site is almost entirely white canvas with dark charcoal text, creating a stark but refined reading experience.

The typography is the true signature: Super Sans VF, a custom variable font with unconventional weight stops (460, 540, 600, 700) that sit between traditional font weight categories. Weight 460 — slightly heavier than regular but lighter than medium — is the workhorse, creating text that feels more confident than typical 400-weight but never aggressive. The tight line-heights (0.96 on display text) compress headlines into dense, powerful blocks, while generous 1.50 line-height on body text provides airy readability. This tension between compressed power and breathing room defines the Superhuman typographic voice.

The design philosophy is maximum confidence through minimum decoration. Warm cream buttons (\`#e9e5dd\`) instead of bright CTAs, a near-absence of borders and shadows, and lavender purple (\`#cbb7fb\`) as the sole accent color. It's a productivity tool that markets itself like a luxury brand — every pixel earns its place, nothing is merely decorative. The brand naming convention extends to colors: the primary purple is called "Mysteria," straddling blue and purple with deliberate ambiguity.

**Key Characteristics:**
- Deep purple gradient hero (\`#1b1938\`) contrasting against a predominantly white content body
- Super Sans VF variable font with non-standard weight stops (460, 540, 600, 700) — sits between conventional weight categories
- Ultra-tight display line-height (0.96) creating compressed, powerful headlines
- Warm Cream (\`#e9e5dd\`) buttons instead of bright/saturated CTAs — understated luxury
- Lavender Purple (\`#cbb7fb\`) as the singular accent color — a soft, approachable purple
- Minimal border-radius scale: only 8px and 16px — no micro-rounding, no pill shapes
- Product screenshots dominate the content — the UI sells itself with minimal surrounding decoration

## 4. Component Stylings

### Buttons
- **Warm Cream Primary**: \`#e9e5dd\` background, Charcoal Ink (\`#292827\`) text, subtle rounded corners (8px radius), no visible border. The signature CTA — warm, muted, luxurious rather than aggressive
- **Dark Primary** (on light sections): \`#292827\` background with white text, 8px radius — inverse of the warm cream for contrast sections
- **Ghost / Text Link**: No background, underline decoration, Amethyst Link (\`#714cb6\`) or Charcoal Ink color depending on context
- **Hero CTA**: Warm Cream on the dark purple gradient — the cream color pops dramatically against \`#1b1938\`
- **Hover**: Subtle opacity or brightness shift — no dramatic color transformations

### Cards & Containers
- **Content Card**: White background, Parchment Border (\`#dcd7d3\`) 1px border, 16px border-radius — clean and minimal
- **Dark Surface Card**: \`#292827\` border on dark sections, maintaining warm-neutral tone
- **Hero Surface**: Semi-transparent white border (\`rgba(255, 255, 255, 0.2)\`) on purple gradient — ghostly containment
- **Product Screenshot Cards**: Large product UI images with clean edges, minimal framing — the product itself is the visual
- **Hover**: Minimal state changes — consistency and calm over flashy interactions

### Inputs & Forms
- Minimal form presence on the marketing site — Superhuman funnels users directly to signup
- Dark-bordered inputs with Charcoal Ink borders and warm-toned placeholder text
- Focus: Border emphasis increase, likely shifting from Parchment Border to Charcoal Ink

### Navigation
- **Top nav**: Clean white background on content sections, transparent on hero gradient
- **Nav links**: Super Sans VF at 16px, weight 460/600 for hierarchy
- **CTA button**: Warm Cream (\`#e9e5dd\`) pill in the nav — subtle, not attention-grabbing
- **Sticky behavior**: Nav remains fixed on scroll with background transition
- **Mobile**: Collapses to hamburger menu with simplified layout

### Image Treatment
- **Product screenshots**: Large, dominant product UI images showing the email interface — the product is the hero
- **Lifestyle photography**: A single dramatic image (silhouette against purple/red gradient) in the hero area — cinematic and editorial
- **Full-width presentation**: Screenshots span full container width with subtle shadow or no border
- **Aspect ratios**: Wide landscape ratios (roughly 16:9) for product screenshots
- **Color integration**: Screenshots are carefully color-graded to harmonize with the purple-to-white page flow

### Testimonial / Social Proof
- "Your Superhuman suite" section with product feature grid
- Feature descriptions paired with product screenshots — proof through demonstration rather than quotes
- Clean grid layout with consistent card sizing

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 2px, 4px, 6px, 8px, 12px, 16px, 18px, 20px, 24px, 28px, 32px, 36px, 40px, 48px, 56px
- **Section padding**: 48px–80px vertical between major sections
- **Card padding**: 16px–32px internal spacing
- **Component gaps**: 8px–16px between related elements

### Grid & Container
- **Max width**: ~1200px content container, centered
- **Column patterns**: Full-width hero, centered single-column for key messaging, 2-3 column grid for feature cards
- **Feature grid**: Even column distribution for "Your Superhuman suite" product showcase

### Whitespace Philosophy
- **Confident emptiness**: Generous whitespace between sections signals premium positioning — every element has room to breathe
- **Product as content**: Large product screenshots fill space that lesser sites would fill with marketing copy
- **Progressive density**: The hero is spacious and cinematic, content sections become denser with feature grids, then opens up again for CTAs

### Border Radius Scale
- **8px**: Buttons, inline elements (\`span\`, \`button\`, \`div\`) — the universal small radius
- **16px**: Cards, links, larger containers (\`a\`, card elements) — the universal large radius
- Only two radii in the entire system — radical simplicity. No micro-rounding (2px), no pill shapes (50px+)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, white background | Primary page canvas, most content surfaces |
| Level 1 (Border) | \`1px solid #dcd7d3\` (Parchment Border) | Card containment, section dividers |
| Level 2 (Dark Border) | \`1px solid #292827\` | Header elements, dark section separators |
| Level 3 (Glow) | Subtle shadow (from 6 shadow definitions detected) | Product screenshot containers, elevated cards |
| Level 4 (Hero Depth) | \`rgba(255, 255, 255, 0.2)\` transparent border | Elements on the dark purple gradient hero |

### Shadow Philosophy
Superhuman's elevation system is remarkably restrained on the marketing site. Depth is primarily communicated through:
- **Border containment**: Warm-toned borders (\`#dcd7d3\`) at 1px create gentle separation
- **Color contrast**: The hero gradient creates massive depth through color shift rather than shadows
- **Product screenshots**: Screenshots themselves create depth by showing a layered UI within the flat page
- **Opacity layering**: Semi-transparent whites on the hero gradient create atmospheric depth layers

### Decorative Depth
- **Hero gradient**: The \`#1b1938\` → white gradient transition is the primary depth device — a cinematic curtain effect
- **Lavender accents**: \`#cbb7fb\` Lavender Glow elements float above the dark gradient, creating a stellar/atmospheric effect
- **No glassmorphism**: Despite the translucent borders, there are no blur/frosted-glass effects
- **Photography depth**: The hero silhouette image creates natural atmospheric depth without artificial CSS

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hero text reduces to ~36px, stacked feature cards, hamburger nav |
| Tablet | 768px–1024px | 2-column feature grid begins, hero text ~48px, nav partially visible |
| Desktop | 1024px–1440px | Full layout, 64px hero display, multi-column feature grid, full nav |
| Large Desktop | >1440px | Max-width container centered, generous side margins |

### Touch Targets
- Buttons: 8px radius with comfortable padding — meets touch target guidelines
- Nav links: 16px text with adequate surrounding padding
- Mobile CTAs: Full-width Warm Cream buttons for easy thumb reach
- Links: Underline decoration provides clear tap affordance

### Collapsing Strategy
- **Navigation**: Full horizontal nav → hamburger menu on mobile
- **Hero text**: 64px display → 48px → ~36px across breakpoints
- **Feature grid**: Multi-column product showcase → 2-column → single stacked column
- **Product screenshots**: Scale within containers, maintaining landscape ratios
- **Section spacing**: Reduces proportionally — generous desktop margins compress on mobile

### Image Behavior
- Product screenshots scale responsively while maintaining aspect ratios
- Hero silhouette image crops or scales — maintains dramatic composition
- No art direction changes — same compositions across all breakpoints
- Lazy loading likely on below-fold product screenshots`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Superhuman — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/superhuman. The fastest email
        experience ever made — keyboard-first velocity, warm cream CTAs, lavender
        as the sole accent, charcoal ink at weight 460."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: #e9e5dd;

        --fg: #292827;
        --fg-2: var(--fg);
        --muted: #6f6c69;
        --meta: var(--muted);

        --border: #dcd7d3;
        --border-soft: var(--border);

        --accent: #cbb7fb;
        --accent-on: #292827;
        --accent-hover: color-mix(in oklab, var(--accent), black 6%);
        --accent-active: color-mix(in oklab, var(--accent), black 12%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Super Sans VF", system-ui, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        --font-body: "Super Sans VF", system-ui, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 22px;
        --text-2xl: 28px;
        --text-3xl: 48px;
        --text-4xl: 64px;

        --leading-body: 1.5;
        --leading-tight: 0.96;
        --tracking-display: -0.0275em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet: 56px;
        --section-y-phone: 40px;

        --radius-sm: 8px;
        --radius-md: 8px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 2px 12px rgba(41, 40, 39, 0.06);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 55%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset ──────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 460;
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
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

      /* ─── Typography — non-standard weight axis (460/540/600/700) ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 540;                          /* Display weight */
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 460;                          /* Section heading */
        letter-spacing: var(--tracking-display);
      }
      h3 {
        font-size: var(--text-2xl);
        font-weight: 540;                          /* Feature title */
        letter-spacing: -0.0225em;                 /* -0.63px / 28px */
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg);
        line-height: var(--leading-body);
        font-weight: 460;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); line-height: var(--leading-body); }
      .body-xs { font-size: var(--text-xs); line-height: 1.5; }

      /* Eyebrow — micro label, the only place we go bold (700) per DESIGN.md §3 */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 700;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — 8px radius, never pill, warm cream signature ─ */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px var(--space-5);
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;                          /* Button / UI Semi */
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Warm Cream primary — the signature CTA. Charcoal text on cream. */
      .btn-primary {
        background: var(--surface-warm);
        color: var(--fg);
      }
      .btn-primary:hover {
        background: color-mix(in oklab, var(--surface-warm), black 5%);
      }
      .btn-primary:active {
        background: color-mix(in oklab, var(--surface-warm), black 10%);
      }

      /* Dark Primary — charcoal bg on white sections (DESIGN.md §4). */
      .btn-dark {
        background: var(--fg);
        color: var(--bg);
      }
      .btn-dark:hover {
        background: color-mix(in oklab, var(--fg), white 8%);
      }

      /* Ghost / Text Link — underline only, no fill. */
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        padding-inline: var(--space-3);
        text-decoration: underline;
        text-underline-offset: 4px;
        text-decoration-thickness: 1px;
      }
      .btn-ghost:hover {
        background: color-mix(in oklab, var(--fg), transparent 95%);
      }

      /* ─── Inputs — borders define them, focus deepens to charcoal ─ */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 540;
        color: var(--fg);
      }
      .field input {
        padding: 12px var(--space-4);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 460;
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--muted); }
      .field input:hover { border-color: color-mix(in oklab, var(--border), var(--fg) 25%); }
      .field input:focus-visible {
        border-color: var(--fg);
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
        line-height: 1.5;
      }

      /* ─── Cards — 16px radius, parchment border, no shadow by default ─ */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition: box-shadow var(--motion-base) var(--ease-standard),
                    border-color var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        box-shadow: var(--elev-raised);
        border-color: color-mix(in oklab, var(--border), var(--fg) 15%);
      }
      .card .card-eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      /* ─── Badges ─────────────────────────────────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-sm);          /* 8px — not pill */
        font-size: var(--text-xs);
        font-weight: 700;                          /* Micro Label weight */
        line-height: 1.5;
        letter-spacing: 0.02em;
      }
      .badge-accent {
        background: var(--accent);
        color: var(--accent-on);
      }
      .badge-success {
        background: color-mix(in oklab, var(--success), transparent 88%);
        color: var(--success);
      }
      .badge-muted {
        background: color-mix(in oklab, var(--muted), transparent 88%);
        color: var(--muted);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-pill);         /* Only place pill is used */
        background: currentColor;
      }

      /* ─── Keyboard chips — Superhuman is keyboard-first ─────── */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 600;
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        line-height: 1;
        box-shadow: 0 1px 0 0 var(--border);
      }

      /* ─── Links — Amethyst-style underline (DESIGN.md §4) ────── */
      a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
      a:hover { text-decoration-thickness: 2px; }

      /* ─── Layout helpers ─────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
        align-items: center;
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-6);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--surface);
      }
      .kbd-row {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
        max-width: 460px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        flex-wrap: wrap;
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .meta-divider {
        height: 1px;
        background: var(--border-soft);
        border: 0;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · superhuman</p>
            <h1>The fastest email<br />experience ever made.</h1>
            <p class="lead" style="max-width: 52ch">
              Fly through your inbox with keyboard shortcuts, instant
              search, and AI that drafts replies in your voice. Built
              for high performers who answer hundreds of messages a day.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Keyboard shortcuts">
            <div class="row-between">
              <span class="badge badge-accent">Most loved by execs</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                4× faster
              </span>
            </div>
            <hr class="meta-divider" />
            <p class="body-sm body-muted" style="line-height: 1.55">
              Press <kbd>K</kbd> to compose. Press <kbd>⌘</kbd> <kbd>K</kbd>
              to jump anywhere. <kbd>E</kbd> archives. <kbd>⇧</kbd> <kbd>R</kbd>
              replies all.
            </p>
            <p class="body-xs" style="color: var(--muted)">
              Last reviewed <time datetime="2026-05-18">2026-05-18</time> · v1.0
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3" style="max-width: 30ch">
          <p class="eyebrow">Your Superhuman suite</p>
          <h2>Velocity, by design.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-12)">
          <article class="card">
            <p class="card-eyebrow">Accent · 01</p>
            <h3>One color, total restraint.</h3>
            <p class="body-muted body-sm">
              Lavender Glow (#cbb7fb) is the only chromatic departure from
              the warm-neutral palette. Every saturated CTA you've seen on
              other sites — Superhuman quietly omits it.
            </p>
            <p class="body-sm">
              
            </p>
          </article>
          <article class="card">
            <p class="card-eyebrow">Type · 02</p>
            <h3>Weights between weights.</h3>
            <p class="body-muted body-sm">
              Super Sans VF runs at 460 / 540 / 600 / 700 — non-standard
              stops that sit between Regular and Medium, between Medium
              and Semibold. Body is 460. Display is 540. Bold is rare.
            </p>
            <p class="body-sm">
              
            </p>
          </article>
          <article class="card">
            <p class="card-eyebrow">Geometry · 03</p>
            <h3>Two radii, total clarity.</h3>
            <p class="body-muted body-sm">
              <code style="font-family: var(--font-mono); font-size: var(--text-xs);">--radius-sm: 8px</code> for buttons and inputs.
              <code style="font-family: var(--font-mono); font-size: var(--text-xs);">--radius-lg: 16px</code> for cards.
              No micro-rounding. No pill buttons. The binary system is the system.
            </p>
            <p class="body-sm">
              
            </p>
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Get on the list</p>
            <h2>Built for the highest performers.</h2>
            <p class="body-muted lead" style="max-width: 44ch">
              Superhuman is invitation-only. Tell us your work email and
              we'll let you know when a seat opens up. No marketing, no
              follow-ups, no noise — that's the whole point.
            </p>
            <div class="kbd-row">
              <span class="body-xs body-muted">Tip:</span>
              <kbd>Tab</kbd>
              <span class="body-xs body-muted">to focus,</span>
              <kbd>Enter</kbd>
              <span class="body-xs body-muted">to submit.</span>
            </div>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                autocomplete="email"
                required
              />
              <p class="field-help">
                We'll only email you when a seat opens. Promise.
              </p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Request access
                <svg class="icon" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.75"
                  stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <button type="button" class="btn btn-ghost">See a demo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=superhuman_default;return module.exports}});
//# sourceMappingURL=client.superhuman.js.map