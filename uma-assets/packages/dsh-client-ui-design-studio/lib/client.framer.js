
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.framer.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var framer_default={"contract":`## 1. Visual Theme & Atmosphere

Framer's website is a cinematic, tool-obsessed dark canvas that radiates the confidence of a design tool built by designers who worship craft. The entire experience is drenched in pure black — not a warm charcoal or a cozy dark gray, but an absolute void (\`#000000\`) that makes every element, every screenshot, every typographic flourish feel like it's floating in deep space. This is a website that treats its own product UI as the hero art, embedding full-fidelity screenshots and interactive demos directly into the narrative flow.

The typography is the signature move: GT Walsheim with aggressively tight letter-spacing (as extreme as -5.5px on 110px display text) creates headlines that feel compressed, kinetic, almost spring-loaded — like words under pressure that might expand at any moment. The transition to Inter for body text is seamless, with extensive OpenType feature usage (\`cv01\`, \`cv05\`, \`cv09\`, \`cv11\`, \`ss03\`, \`ss07\`) that gives even small text a refined, custom feel. Framer Blue (\`#0099ff\`) is deployed sparingly but decisively — as link color, border accents, and subtle ring shadows — creating a cold, electric throughline against the warm-less black.

The overall effect is a nightclub for web designers: dark, precise, seductive, and unapologetically product-forward. Every section exists to showcase what the tool can do, with the website itself serving as proof of concept.

**Key Characteristics:**
- Pure black (\`#000000\`) void canvas — absolute dark, not warm or gray-tinted
- GT Walsheim display font with extreme negative letter-spacing (-5.5px at 110px)
- Framer Blue (\`#0099ff\`) as the sole accent color — cold, electric, precise
- Pill-shaped buttons (40px–100px radius) — no sharp corners on interactive elements
- Product screenshots as hero art — the tool IS the marketing
- Frosted glass button variants using \`rgba(255, 255, 255, 0.1)\` on dark surfaces
- Extensive OpenType feature usage across Inter for refined micro-typography

## 4. Component Stylings

### Buttons
- **Frosted Pill**: \`rgba(255, 255, 255, 0.1)\` background, black text (\`#000000\`), pill shape (40px radius). The glass-effect button that lives on dark surfaces — translucent, ambient, subtle
- **Solid White Pill**: \`rgb(255, 255, 255)\` background, black text (\`#000000\`), full pill shape (100px radius), padding \`10px 15px\`. The primary CTA — clean, high-contrast on dark, unmissable
- **Ghost**: No visible background, white text, relies on text styling alone. Hover reveals subtle frosted background
- **Transition**: Scale-based animations (matrix transform with 0.85 scale factor), opacity transitions for reveal effects

### Cards & Containers
- **Dark Surface Card**: Black or near-black (\`#090909\`) background, \`rgba(0, 153, 255, 0.15) 0px 0px 0px 1px\` blue ring shadow border, rounded corners (10px–15px radius)
- **Elevated Card**: Multi-layer shadow — \`rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px\` (subtle top highlight) + \`rgba(0, 0, 0, 0.25) 0px 10px 30px\` (deep ambient shadow)
- **Product Screenshots**: Full-width or padded within dark containers, 8px–12px border-radius for software UI previews
- **Hover**: Subtle glow increase on Framer Blue ring shadow, or brightness shift on frosted surfaces

### Inputs & Forms
- Minimal form presence on the marketing site
- Input fields follow dark theme: dark background, subtle border, white text
- Focus state: Framer Blue (\`#0099ff\`) ring border, \`1px solid #0099ff\`
- Placeholder text in \`rgba(255, 255, 255, 0.4)\`

### Navigation
- **Dark floating nav bar**: Black background with frosted glass effect, white text links
- **Nav links**: Inter at 15px, weight 400, white text with subtle hover opacity change
- **CTA button**: Pill-shaped, white or frosted, positioned at right end of nav
- **Mobile**: Collapses to hamburger menu, maintains dark theme
- **Sticky behavior**: Nav remains fixed at top on scroll

### Image Treatment
- **Product screenshots as hero art**: Full-width embedded UI screenshots with rounded corners (8px–12px)
- **Dark-on-dark composition**: Screenshots placed on black backgrounds with subtle shadow for depth separation
- **16:9 and custom aspect ratios**: Product demos fill their containers
- **No decorative imagery**: All images are functional — showing the tool, the output, or the workflow

### Trust & Social Proof
- Customer logos and testimonials in muted gray on dark surfaces
- Minimal ornamentation — the product screenshots serve as the trust signal

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 15px, 20px, 30px, 35px
- **Section padding**: Large vertical spacing (80px–120px between sections)
- **Card padding**: 15px–30px internal padding
- **Component gaps**: 8px–20px between related elements

### Grid & Container
- **Max width**: ~1200px container, centered
- **Column patterns**: Full-width hero, 2-column feature sections, single-column product showcases
- **Asymmetric layouts**: Feature sections often pair text (40%) with screenshot (60%)

### Whitespace Philosophy
- **Breathe through darkness**: Generous vertical spacing between sections — the black background means whitespace manifests as void, creating dramatic pauses between content blocks
- **Dense within, spacious between**: Individual components are tightly composed (tight line-heights, compressed text) but float in generous surrounding space
- **Product-first density**: Screenshot areas are allowed to be dense and information-rich, contrasting with the sparse marketing text

### Border Radius Scale
- **1px**: Micro-elements, nearly squared precision edges
- **5px–7px**: Small UI elements, image thumbnails — subtly softened
- **8px**: Standard component radius — code blocks, buttons, interactive elements
- **10px–12px**: Cards, product screenshots — comfortably rounded
- **15px–20px**: Large containers, feature cards — generously rounded
- **30px–40px**: Navigation pills, pagination — noticeably rounded
- **100px**: Full pill shape — primary CTAs, tag elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, pure black surface | Page background, empty areas |
| Level 1 (Ring) | \`rgba(0, 153, 255, 0.15) 0px 0px 0px 1px\` | Card borders, interactive element outlines — Framer Blue glow ring |
| Level 2 (Contained) | \`rgb(9, 9, 9) 0px 0px 0px 2px\` | Near-black ring for subtle containment on dark surfaces |
| Level 3 (Floating) | \`rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px, rgba(0, 0, 0, 0.25) 0px 10px 30px\` | Elevated cards, floating elements — subtle white top-edge highlight + deep ambient shadow |

### Shadow Philosophy
Framer's elevation system is inverted from traditional light-theme designs. Instead of darker shadows on light backgrounds, Framer uses:
- **Blue-tinted ring shadows** at very low opacity (0.15) for containment — a signature move that subtly brands every bordered element
- **White edge highlights** (0.5px) on the top edge of elevated elements — simulating light hitting the top surface
- **Deep ambient shadows** for true floating elements — \`rgba(0, 0, 0, 0.25)\` at large spread (30px)

### Decorative Depth
- **Blue glow auras**: Subtle Framer Blue (\`#0099ff\`) radial gradients behind key interactive areas
- **No background blur/glassmorphism**: Despite the frosted button effect, there's no heavy glass blur usage — the translucency is achieved through simple rgba opacity

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <809px | Single column, stacked feature sections, reduced hero text (62px→40px), hamburger nav |
| Tablet | 809px–1199px | 2-column features begin, nav links partially visible, screenshots scale down |
| Desktop | >1199px | Full layout, expanded nav with all links + CTA, 110px display hero, side-by-side features |

### Touch Targets
- Pill buttons: minimum 40px height with 10px vertical padding — exceeds 44px WCAG minimum
- Nav links: 15px text with generous padding for touch accessibility
- Mobile CTA buttons: Full-width pills on mobile for easy thumb reach

### Collapsing Strategy
- **Navigation**: Full horizontal nav → hamburger menu at mobile breakpoint
- **Hero text**: 110px display → 85px → 62px → ~40px across breakpoints, maintaining extreme negative tracking proportionally
- **Feature sections**: Side-by-side (text + screenshot) → stacked vertically on mobile
- **Product screenshots**: Scale responsively within containers, maintaining aspect ratios
- **Section spacing**: Reduces proportionally — 120px desktop → 60px mobile

### Image Behavior
- Product screenshots are responsive, scaling within their container boundaries
- No art direction changes — same crops across breakpoints
- Dark background ensures screenshots maintain visual impact at any size
- Screenshots lazy-load as user scrolls into view`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Framer — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/framer. Void black canvas,
        Framer Blue accent, GT Walsheim display with extreme negative
        letter-spacing, pill buttons, blue ring-shadow elevation."
    />

    <style>
      :root {
        --bg: #000000;
        --surface: #090909;
        --surface-warm: var(--surface);

        --fg: #ffffff;
        --fg-2: #a6a6a6;
        --muted: rgba(255, 255, 255, 0.6);
        --meta: rgba(255, 255, 255, 0.4);

        --border: rgba(0, 153, 255, 0.15);
        --border-soft: rgba(255, 255, 255, 0.06);

        --accent: #0099ff;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "GT Walsheim Framer Medium", "GT Walsheim Medium", "GT Walsheim", -apple-system, "Segoe UI", Inter, sans-serif;
        --font-body: "Inter Variable", "Inter", -apple-system, "Segoe UI", Arial, sans-serif;
        --font-mono: "Azeret Mono", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 15px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 62px;
        --text-4xl: 110px;

        --leading-body: 1.3;
        --leading-tight: 0.95;
        --tracking-display: -0.05em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 120px;
        --section-y-tablet: 80px;
        --section-y-phone: 60px;

        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 20px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 0.5px 0 0.5px rgba(255, 255, 255, 0.1),
          0 10px 30px rgba(0, 0, 0, 0.25);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
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
        font-feature-settings: "cv01", "cv05", "cv09", "cv11", "ss03", "ss07";
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1199px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 809px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — GT Walsheim display, Inter body ───────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 500;              /* GT Walsheim Medium — the brand weight, never bold */
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      /* Display hero: 110px on desktop, scaling down on smaller breakpoints.
         The most extreme 0.85 line-height is reserved for this size only. */
      h1 {
        font-size: var(--text-4xl);
        line-height: 0.85;
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        letter-spacing: var(--tracking-display);
      }
      h3 {
        font-size: var(--text-xl);
        font-family: var(--font-body);
        font-weight: 700;
        letter-spacing: -0.025em;
        line-height: 1.2;
      }
      @media (max-width: 1199px) {
        h1 { font-size: 85px; }
        h2 { font-size: 48px; }
      }
      @media (max-width: 809px) {
        h1 { font-size: 56px; letter-spacing: -0.04em; }
        h2 { font-size: 36px; }
      }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      .body-muted { color: var(--fg-2); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: 11px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — pill shapes, no sharp corners ────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 18px;
        border-radius: var(--radius-pill); /* Pill — DESIGN.md: never sharp corners */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          transform var(--motion-base) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: scale(0.97); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Primary: solid white pill on void — DESIGN.md §4 primary CTA */
      .btn-primary {
        background: #ffffff;
        color: #000000;
      }
      .btn-primary:hover { background: color-mix(in oklab, #ffffff, black 6%); }

      /* Secondary: frosted glass pill on dark — DESIGN.md §4 frosted variant */
      .btn-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: var(--fg);
        backdrop-filter: blur(8px);
      }
      .btn-secondary:hover { background: rgba(255, 255, 255, 0.18); }

      /* ─── Inputs — dark surface, blue focus ring ─────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--fg); }
      .field input {
        padding: 12px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-soft);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { border-color: var(--border); }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — near-black surface, Framer Blue ring shadow ── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-ring); /* Framer Blue 1px ring — the signature */
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        box-shadow:
          0 0 0 1px rgba(0, 153, 255, 0.28),
          var(--elev-raised);
      }
      .card .card-eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--accent);
        letter-spacing: 0.04em;
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.4;
      }
      .badge-accent {
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), transparent 88%);
        box-shadow: inset 0 0 0 1px var(--border);
      }
      .badge-muted {
        color: var(--muted);
        background: rgba(255, 255, 255, 0.06);
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

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero { display: flex; flex-direction: column; gap: var(--space-8); }
      .hero-headline { max-width: 16ch; }
      .hero-lead { max-width: 48ch; }
      .hero-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
      .hero-meta {
        display: flex; align-items: center; gap: var(--space-3);
        margin-block-start: var(--space-6);
        color: var(--meta); font-size: var(--text-sm);
      }
      .hero-divider { width: 4px; height: 4px; border-radius: 50%; background: var(--border-soft); }

      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1199px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 809px) { .features-grid { grid-template-columns: 1fr; } }

      .form-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1199px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex; flex-direction: column; gap: var(--space-4);
        max-width: 460px;
        padding: var(--space-6);
        background: var(--surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised); /* Floating elevated stack */
      }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* ─── Background glow — subtle blue radial behind hero ──── */
      .hero-glow {
        position: relative;
        isolation: isolate;
      }
      .hero-glow::before {
        content: "";
        position: absolute;
        inset: -10% -20% auto -20%;
        height: 60%;
        background: radial-gradient(50% 60% at 50% 0%, rgba(0, 153, 255, 0.15), transparent 70%);
        z-index: -1;
        pointer-events: none;
      }
    </style>

    <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-hey-layout-repair>.hero-glow::before { inset-inline: 0; }</style>
</head>
  <body>
    <main class="container">
      <section data-od-id="hero" class="hero-glow">
        <div class="hero">
          <div class="stack-6">
            <p class="eyebrow">Reference fixture · framer</p>
            <h1 class="hero-headline">The&nbsp;internet is your canvas.</h1>
            <p class="lead hero-lead">
              Design and ship production-grade sites without writing the
              boilerplate. Every interaction, every breakpoint, every motion
              curve — composed on the void, rendered to the open web.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <div class="hero-meta">
            <span>v1.0</span>
            <span class="hero-divider" aria-hidden="true"></span>
            <span>Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens</span>
            <span class="hero-divider" aria-hidden="true"></span>
            <span class="badge badge-accent">
              <span class="badge-dot" aria-hidden="true"></span>
              Live preview
            </span>
          </div>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-4">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 18ch">Craft is the product, polish is the proof.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <span class="card-eyebrow">01 · CANVAS</span>
            <h3>Pure void, no compromise.</h3>
            <p class="body-muted body-sm">
              --bg (#000000) → --surface (#090909) → --accent (#0099ff).
              Absolute black is the foundation — never charcoal, never
              brown-tinted dark gray. The void is the design.
            </p>
            
          </article>
          <article class="card">
            <span class="card-eyebrow">02 · TYPE</span>
            <h3>Compressed, spring-loaded.</h3>
            <p class="body-muted body-sm">
              GT Walsheim Medium at -0.05em tracking gives display
              text the breathless density Framer is known for. Inter
              for body, with six OpenType features for refined micro-type.
            </p>
            
          </article>
          <article class="card">
            <span class="card-eyebrow">03 · DEPTH</span>
            <h3>Blue rings, white edges.</h3>
            <p class="body-muted body-sm">
              Cards are contained by a 1px Framer Blue ring shadow
              (rgba(0, 153, 255, 0.15)) — depth comes from light tints,
              not from heavy drop shadows. The blue is the brand.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-5">
            <p class="eyebrow">Form components</p>
            <h2>Inputs in the void.</h2>
            <p class="body-muted" style="max-width: 44ch">
              Form fields sit on the near-black surface with subtle
              translucent borders. Focus lights up the Framer Blue ring —
              a halo, not a hard edge, so the void stays sacred even
              while you type.
            </p>
            <div class="row-between" style="max-width: 44ch">
              <span class="badge badge-muted">
                <span class="badge-dot" aria-hidden="true"></span>
                No tracking
              </span>
              <span class="body-sm" style="color: var(--meta)">Updated <time datetime="2026-05-18">2026-05-18</time></span>
            </div>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@studio.com" autocomplete="email" required />
              <p class="field-help">We'll send a beta invite and nothing else.</p>
            </div>
            <div class="field">
              <label for="project">Project name</label>
              <input id="project" type="text" placeholder="Untitled canvas" autocomplete="off" />
              <p class="field-help">You can rename it any time from the editor.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Request access</button>
              <button type="button" class="btn btn-secondary">View showcase</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=framer_default;return module.exports}});
//# sourceMappingURL=client.framer.js.map