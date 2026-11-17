
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.spacex.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var spacex_default={"contract":`## 1. Visual Theme & Atmosphere

SpaceX's website is a full-screen cinematic experience that treats aerospace engineering like a film — every section is a scene, every photograph is a frame, and the interface disappears entirely behind the imagery. The design is pure black (\`#000000\`) with photography of rockets, space, and planets occupying 100% of the viewport. Text overlays sit directly on these photographs with no background panels, cards, or containers — just type on image, bold and unapologetic.

The typography system uses D-DIN, an industrial geometric typeface with DIN heritage (the German industrial standard). The defining characteristic is that virtually ALL text is uppercase with positive letter-spacing (0.96px–1.17px), creating a military/aerospace labeling system where every word feels stenciled onto a spacecraft hull. D-DIN-Bold at 48px with uppercase and 0.96px tracking for the hero creates headlines that feel like mission briefing titles. Even body text at 16px maintains the uppercase/tracked treatment at smaller scales.

What makes SpaceX distinctive is its radical minimalism: no shadows, no borders (except one ghost button border at \`rgba(240,240,250,0.35)\`), no color (only black and a spectral near-white \`#f0f0fa\`), no cards, no grids. The only visual element is photography + text. The ghost button with \`rgba(240,240,250,0.1)\` background and 32px radius is the sole interactive element — barely visible, floating over the imagery like a heads-up display. This isn't a design system in the traditional sense — it's a photographic exhibition with a type system and a single button.

**Key Characteristics:**
- Pure black canvas with full-viewport cinematic photography — the interface is invisible
- D-DIN / D-DIN-Bold — industrial DIN-heritage typeface
- Universal uppercase + positive letter-spacing (0.96px–1.17px) — aerospace stencil aesthetic
- Near-white spectral text (\`#f0f0fa\`) — not pure white, a slight blue-violet tint
- Zero shadows, zero cards, zero containers — text on image only
- Single ghost button: \`rgba(240,240,250,0.1)\` background with spectral border
- Full-viewport sections — each section is a cinematic "scene"
- No decorative elements — every pixel serves the photography

## 4. Component Stylings

### Buttons

**Ghost Button**
- Background: \`rgba(240, 240, 250, 0.1)\` (barely visible)
- Text: Spectral White (\`#f0f0fa\`)
- Padding: 18px
- Radius: 32px
- Border: \`1px solid rgba(240, 240, 250, 0.35)\`
- Hover: background brightens, text to \`var(--white-100)\`
- Use: The only button variant — "LEARN MORE" CTAs on photography

### Cards & Containers
- **None.** SpaceX does not use cards, panels, or containers. All content is text directly on full-viewport photographs. The absence of containers IS the design.

### Inputs & Forms
- Not present on the homepage. The site is purely presentational.

### Navigation
- Transparent overlay nav on photography
- D-DIN 13px weight 700, uppercase, 1.17px tracking
- Spectral white text on dark imagery
- Logo: SpaceX wordmark at 147x19px
- Mobile: hamburger collapse

### Image Treatment
- Full-viewport (100vh) photography sections
- Professional aerospace photography: rockets, Mars, space
- Dark gradient overlays (\`rgba(0,0,0,0.5)\`) for text legibility
- Each section = one full-screen photograph with text overlay
- No border radius, no frames — edge-to-edge imagery

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 3px, 5px, 12px, 15px, 18px, 20px, 24px, 30px
- Minimal scale — spacing is not the organizing principle; photography is

### Grid & Container
- No traditional grid — each section is a full-viewport cinematic frame
- Text is positioned absolutely or with generous padding over imagery
- Left-aligned text blocks on photography backgrounds
- No max-width container — content bleeds to viewport edges

### Whitespace Philosophy
- **Photography IS the whitespace**: Empty space in the design is never empty — it's filled with the dark expanse of space, the curve of a planet, or the flame of a rocket engine. Traditional whitespace concepts don't apply.
- **Vertical pacing through viewport**: Each section is exactly one viewport tall, creating a rhythmic scroll where each "page" reveals a new scene.

### Border Radius Scale
- Sharp (4px): Small dividers, utility elements
- Button (32px): Ghost buttons — the only rounded element

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Photography (Level 0) | Full-viewport imagery | Background layer — always present |
| Overlay (Level 1) | \`rgba(0, 0, 0, 0.5)\` gradient | Text legibility layer over photography |
| Text (Level 2) | Spectral white text, no shadow | Content layer — text floats directly on image |
| Ghost (Level 3) | \`rgba(240, 240, 250, 0.1)\` surface | Barely-visible interactive layer |

**Shadow Philosophy**: SpaceX uses ZERO shadows. In a design built entirely on photography, shadows are meaningless — every surface is already a photograph with natural lighting. Depth comes from the photographic content itself: the receding curvature of Earth, the diminishing trail of a rocket, the atmospheric haze around Mars.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Stacked, reduced padding, smaller type |
| Tablet Small | 600–960px | Adjusted layout |
| Tablet | 960–1280px | Standard scaling |
| Desktop | 1280–1350px | Full layout |
| Large Desktop | 1350–1500px | Expanded |
| Ultra-wide | >1500px | Maximum viewport |

### Touch Targets
- Ghost buttons: 18px padding provides adequate touch area
- Navigation links: uppercase with generous letter-spacing aids readability

### Collapsing Strategy
- Photography: maintains full-viewport at all sizes, content reposition
- Hero text: 48px → scales down proportionally
- Navigation: horizontal → hamburger
- Text blocks: reposition but maintain overlay-on-photography pattern
- Full-viewport sections maintained on mobile

### Image Behavior
- Edge-to-edge photography at all viewport sizes
- Background-size: cover with center focus
- Dark overlay gradients adapt to content position
- No art direction changes — same photographs, responsive positioning`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SpaceX — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/spacex. Pure black canvas,
        spectral white type, full-viewport cinematic sections, D-DIN industrial
        uppercase, ghost-button as the sole interactive element, zero shadows."
    />

    <style>
      :root {
        --bg: #000000;
        --surface: #000000;
        --surface-warm: var(--surface);

        --fg: #f0f0fa;
        --fg-2: var(--fg);
        --muted: rgba(240, 240, 250, 0.7);
        --meta: var(--muted);

        --border: rgba(240, 240, 250, 0.35);
        --border-soft: rgba(240, 240, 250, 0.1);

        --accent: #f0f0fa;
        --accent-on: #000000;
        --accent-hover: #ffffff;
        --accent-active: #d8d8e6;

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "D-DIN-Bold", "D-DIN", "DIN Alternate", "Helvetica Neue", Arial, Verdana, sans-serif;
        --font-body: "D-DIN", "DIN Alternate", "Helvetica Neue", Arial, Verdana, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 10px;
        --text-sm: 12px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 40px;
        --text-4xl: 48px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: 0.02em;

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
        --section-y-phone: 56px;

        --radius-sm: 4px;
        --radius-md: 4px;
        --radius-lg: 4px;
        --radius-pill: 32px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: none;

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1440px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 20px;
        --container-gutter-phone: 18px;
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
      /* Sharp 4px ghost dividers between cinematic scenes — never decorative */
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — universal uppercase + positive tracking ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 700;
        line-height: var(--leading-tight);
        text-transform: uppercase;
        letter-spacing: var(--tracking-display);
        margin: 0;
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-base); letter-spacing: 0.04em; }
      p { margin: 0; }
      .lead {
        font-size: var(--text-base);
        color: var(--fg);
        line-height: var(--leading-body);
        text-transform: uppercase;
        letter-spacing: 0.02em;
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      /* Caption Bold / Nav Link Bold tier — DESIGN.md §3 (13px / 1.17px) */
      .caption-bold {
        font-family: var(--font-body);
        font-size: 13px;
        font-weight: 700;
        line-height: 0.94;
        letter-spacing: 1.17px;
        text-transform: uppercase;
        color: var(--fg);
      }
      /* Eyebrow — micro tier; DESIGN.md §3 Micro = 10px / 1px tracking */
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 400;
        line-height: 0.94;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--muted);
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }
      .stack-8 > * + * { margin-block-start: var(--space-8); }

      /* ─── Buttons — Ghost is the only variant ────────────────
       * DESIGN.md §4: rgba(240,240,250,0.1) bg, 1px spectral border,
       * 32px radius, 18px padding. The sole interactive element. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 18px var(--space-6);
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 700;
        line-height: 1;
        letter-spacing: 1.17px;
        text-transform: uppercase;
        cursor: pointer;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Ghost — the canonical SpaceX button */
      .btn-ghost {
        background: rgba(240, 240, 250, 0.1);
        color: var(--fg);
        border: 1px solid var(--border);
      }
      .btn-ghost:hover {
        background: rgba(240, 240, 250, 0.18);
        color: var(--accent-hover);
        border-color: var(--accent-hover);
      }
      .btn-ghost:active { background: rgba(240, 240, 250, 0.24); }
      /* Solid spectral — used sparingly for the highest-priority CTA */
      .btn-solid {
        background: var(--accent);
        color: var(--accent-on);
        border: 1px solid var(--accent);
      }
      .btn-solid:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
      .btn-solid:active { background: var(--accent-active); border-color: var(--accent-active); }

      /* ─── Inputs — spectral hairline only, no surface fill ──── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-xs);
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--muted);
      }
      .field input {
        padding: 14px var(--space-3);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: transparent;
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        text-transform: uppercase;
        letter-spacing: 0.02em;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent-hover);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder {
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .field-help {
        font-size: var(--text-xs);
        font-weight: 400;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--muted);
      }

      /* ─── Hero — full-viewport cinematic scene ──────────────
       * DESIGN.md §1: each section is a film frame. No external
       * image lives in the fixture; we evoke the cosmic black
       * sky / planetary curve with layered radial gradients +
       * the canonical rgba(0,0,0,0.5) legibility overlay. */
      .hero {
        position: relative;
        min-height: 100vh;
        display: flex;
        align-items: flex-end;
        padding-block: var(--section-y-desktop);
        background:
          linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%),
          radial-gradient(2px 2px at 12% 22%, rgba(240, 240, 250, 0.85), transparent 60%),
          radial-gradient(1px 1px at 28% 64%, rgba(240, 240, 250, 0.7), transparent 60%),
          radial-gradient(2px 2px at 47% 18%, rgba(240, 240, 250, 0.6), transparent 60%),
          radial-gradient(1px 1px at 63% 41%, rgba(240, 240, 250, 0.85), transparent 60%),
          radial-gradient(1.5px 1.5px at 78% 12%, rgba(240, 240, 250, 0.5), transparent 60%),
          radial-gradient(1px 1px at 88% 73%, rgba(240, 240, 250, 0.6), transparent 60%),
          radial-gradient(1px 1px at 38% 88%, rgba(240, 240, 250, 0.4), transparent 60%),
          radial-gradient(2px 2px at 6% 84%, rgba(240, 240, 250, 0.5), transparent 60%),
          radial-gradient(ellipse 120% 70% at 50% 100%, rgba(36, 32, 64, 0.85) 0%, rgba(0, 0, 0, 0) 70%),
          radial-gradient(ellipse 90% 60% at 80% 18%, rgba(80, 60, 110, 0.25) 0%, rgba(0, 0, 0, 0) 65%),
          #000000;
      }
      .hero-inner { max-width: 720px; }
      .hero h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      .hero .lead { max-width: 56ch; }
      .hero-actions { display: flex; gap: var(--space-4); margin-block-start: var(--space-8); flex-wrap: wrap; }

      /* Mission status strip — uppercase, hairline-divided, no card */
      .mission-strip {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        margin-block-start: var(--space-12);
        border-top: 1px solid var(--border-soft);
        border-bottom: 1px solid var(--border-soft);
      }
      .mission-strip > * {
        padding: var(--space-5) var(--space-4);
      }
      .mission-strip > * + * { border-left: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .mission-strip { grid-template-columns: 1fr 1fr; }
        .mission-strip > *:nth-child(2n+1) { border-left: none; }
      }
      @media (max-width: 639px) {
        .mission-strip { grid-template-columns: 1fr; }
        .mission-strip > * + * { border-left: none; border-top: 1px solid var(--border-soft); }
      }
      .mission-strip dt { color: var(--muted); margin: 0; }
      .mission-strip dd {
        margin: var(--space-2) 0 0;
        font-family: var(--font-display);
        font-size: var(--text-xl);
        font-weight: 700;
        line-height: var(--leading-tight);
        text-transform: uppercase;
        letter-spacing: 0.02em;
        color: var(--fg);
      }

      /* ─── Features — text-on-void, no cards ─────────────────
       * DESIGN.md §4: no panels, no containers, no cards. Three
       * vertical text blocks sit directly on the void, separated
       * only by hairline ghost dividers. */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        border-top: 1px solid var(--border-soft);
      }
      .features-grid > article {
        padding: var(--space-12) var(--space-6) var(--space-12) 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .features-grid > article + article {
        border-left: 1px solid var(--border-soft);
        padding-inline-start: var(--space-6);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr; }
        .features-grid > article + article {
          border-left: none;
          border-top: 1px solid var(--border-soft);
          padding-inline-start: 0;
        }
      }
      .feature-index {
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 700;
        letter-spacing: 1.17px;
        text-transform: uppercase;
        color: var(--muted);
      }
      .feature h3 {
        font-size: var(--text-xl);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      .feature p { color: var(--muted); }
      .feature a {
        color: var(--fg);
        font-size: var(--text-sm);
        font-weight: 700;
        letter-spacing: 1.17px;
        text-transform: uppercase;
        text-decoration: none;
        border-bottom: 1px solid var(--border);
        padding-block-end: 4px;
        align-self: flex-start;
        transition: color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
      }
      .feature a:hover { color: var(--accent-hover); border-color: var(--accent-hover); }

      /* ─── Form — mission briefing, spectral hairlines ──────── */
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; gap: var(--space-8); } }
      .form { display: flex; flex-direction: column; gap: var(--space-5); max-width: 480px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-3); flex-wrap: wrap; }
      .icon { width: 14px; height: 14px; flex-shrink: 0; }
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
      <section class="hero" data-od-id="hero">
        <div class="hero-inner stack-6">
          <p class="caption-bold">SpaceX · Mission 2026</p>
          <h1>Making life multi&#8209;planetary.</h1>
          <p class="lead">
            From low&#8209;Earth orbit to the surface of Mars — we build the
            rockets, the spacecraft, and the operating cadence that turn
            humanity into a multi&#8209;planet species.
          </p>
          <div class="hero-actions">
            
            
          </div>

          <dl class="mission-strip" aria-label="Mission counters">
            <div>
              <dt class="eyebrow">Total Launches</dt>
              <dd>438</dd>
            </div>
            <div>
              <dt class="eyebrow">Total Landings</dt>
              <dd>406</dd>
            </div>
            <div>
              <dt class="eyebrow">Reflights</dt>
              <dd>377</dd>
            </div>
            <div>
              <dt class="eyebrow">Status</dt>
              <dd>Nominal</dd>
            </div>
          </dl>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-4">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 24ch">A type system for engineering on the edge of the atmosphere.</h2>
          <p class="body-muted" style="max-width: 60ch; text-transform: uppercase; letter-spacing: 0.02em;">
            Three principles, no cards, no shadows — text sits directly on the void.
          </p>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-12)">
          <article class="feature stack-4">
            <p class="feature-index">01 / Atmosphere</p>
            <h3>Pure black canvas, full&#8209;viewport imagery.</h3>
            <p>
              --bg (#000000) is the void. There is no card surface, no warm
              tier — every section is text on photograph, every photograph
              is one cinematic frame.
            </p>
            
          </article>
          <article class="feature stack-4">
            <p class="feature-index">02 / Voice</p>
            <h3>Universal uppercase, positive tracking.</h3>
            <p>
              D&#8209;DIN at 0.02em (= 0.96px at 48px). Every label, every
              counter, every CTA is stenciled like a serial number on a
              spacecraft hull.
            </p>
            
          </article>
          <article class="feature stack-4">
            <p class="feature-index">03 / Restraint</p>
            <h3>Zero shadows, one ghost button.</h3>
            <p>
              --elev-raised resolves to <code style="font-family: var(--font-mono); font-size: var(--text-sm);">none</code>.
              Depth comes from the photography. The lone ghost CTA at 32px
              radius is the entire interactive surface area.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-6">
            <p class="eyebrow">Mission Briefing</p>
            <h2>Receive launch and re&#8209;entry telemetry.</h2>
            <p class="body-muted" style="text-transform: uppercase; letter-spacing: 0.02em; max-width: 48ch;">
              We&#8217;ll send pre&#8209;flight readiness reviews and
              post&#8209;landing recovery summaries. Hairline borders only —
              no surface fills, no shadows, no cool grays.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="callsign">Callsign</label>
              <input id="callsign" type="text" placeholder="Mission control" autocomplete="username" required />
            </div>
            <div class="field">
              <label for="email">Operator email</label>
              <input id="email" type="email" placeholder="ops@spacex.com" autocomplete="email" required />
              <p class="field-help">For mission summaries only.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-ghost">Confirm uplink</button>
              <button type="button" class="btn btn-ghost">Stand down</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=spacex_default;return module.exports}});
//# sourceMappingURL=client.spacex.js.map