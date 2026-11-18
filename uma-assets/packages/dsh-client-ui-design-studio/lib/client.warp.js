
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.warp.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var warp_default={"contract":`## 1. Visual Theme & Atmosphere

Warp's website feels like sitting at a campfire in a deep forest — warm, dark, and alive with quiet confidence. Unlike the cold, blue-tinted blacks favored by most developer tools, Warp wraps everything in a warm near-black that feels like charred wood or dark earth. The text isn't pure white either — it's Warm Parchment (\`#faf9f6\`), a barely-perceptible cream that softens every headline and makes the dark canvas feel inviting rather than austere.

The typography is the secret weapon: Matter, a geometric sans-serif with distinctive character, deployed at Regular weight across virtually all text. The font choice is unusual for a developer tool — Matter has a softness and humanity that signals "this terminal is for everyone, not just greybeards." Combined with tight line-heights and controlled negative letter-spacing on headlines, the effect is refined and approachable simultaneously. Nature photography is woven between terminal screenshots, creating a visual language that says: this tool brings you closer to flow, to calm productivity.

The overall design philosophy is restraint through warmth. Minimal color (almost monochromatic warm grays), minimal ornamentation, and a focus on product showcases set against cinematic dark landscapes. It's a terminal company that markets like a lifestyle brand.

**Key Characteristics:**
- Warm dark background — not cold black, but earthy near-black with warm gray undertones
- Warm Parchment (\`#faf9f6\`) text instead of pure white — subtle cream warmth
- Matter font family (Regular weight) — geometric but approachable, not the typical developer-tool typeface
- Nature photography interleaved with product screenshots — lifestyle meets developer tool
- Almost monochromatic warm gray palette — no bold accent colors
- Uppercase labels with wide letter-spacing (2.4px) for categorization — editorial signaling
- Pill-shaped dark buttons (\`#353534\`, 50px radius) — restrained, muted CTAs

## 4. Component Stylings

### Buttons
- **Dark Pill**: \`#353534\` background, Ash Gray (\`#afaeac\`) text, pill shape (50px radius), \`10px\` padding. The primary CTA — warm, muted, understated
- **Frosted Tag**: \`rgba(255, 255, 255, 0.16)\` background, black text (\`rgb(0, 0, 0)\`), rectangular (6px radius), \`1px 6px\` padding. Small inline tag-like buttons
- **Ghost**: No visible background, text-only with underline decoration on hover
- **Hover**: Subtle opacity or brightness shift — no dramatic color changes

### Cards & Containers
- **Photography Cards**: Full-bleed nature imagery with overlay text, 8px–12px border-radius
- **Terminal Screenshot Cards**: Product UI embedded in dark containers with rounded corners (8px–12px)
- **Bordered Cards**: Semi-transparent border (\`rgba(226, 226, 226, 0.35)\`) for containment, 12px–14px radius
- **Hover**: Minimal — content cards don't dramatically change on hover, maintaining the calm aesthetic

### Inputs & Forms
- Minimal form presence on the marketing site
- Dark background inputs with warm gray text
- Focus: Border brightness increase, no colored rings (consistent with the monochromatic palette)

### Navigation
- **Top nav**: Dark background, warm parchment brand text, Matter Regular at 16px for links
- **Link color**: Stone Gray (\`#868584\`) for muted nav, Warm Parchment for active/hover
- **CTA button**: Dark pill (#353534) at nav end — restrained, not attention-grabbing
- **Mobile**: Collapses to simplified navigation
- **Sticky**: Nav stays fixed on scroll

### Image Treatment
- **Nature photography**: Landscapes, forests, golden-hour scenes — completely unique for a developer tool
- **Terminal screenshots**: Product UI shown in realistic terminal window frames
- **Mixed composition**: Nature images and terminal screenshots are interleaved, creating a lifestyle-meets-tool narrative
- **Full-bleed**: Images often span full container width with 8px radius
- **Video**: Video elements present with 10px border-radius

### Testimonial Section
- Social proof area ("Don't take our word for it") with quotes
- Muted styling consistent with overall restraint

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 1px, 4px, 5px, 8px, 10px, 12px, 14px, 15px, 16px, 18px, 24px, 26px, 30px, 32px, 36px
- **Section padding**: 80px–120px vertical between major sections
- **Card padding**: 16px–32px internal spacing
- **Component gaps**: 8px–16px between related elements

### Grid & Container
- **Max width**: ~1500px container (breakpoint at 1500px), centered
- **Column patterns**: Full-width hero, 2-column feature sections with photography, single-column testimonials
- **Cinematic layout**: Wide containers that let photography breathe

### Whitespace Philosophy
- **Vast and warm**: Generous spacing between sections — the dark background creates a warm void that feels contemplative rather than empty
- **Photography as whitespace**: Nature images serve as visual breathing room between dense product information
- **Editorial pacing**: The layout reads like a magazine — each section is a deliberate page-turn moment

### Border Radius Scale
- **4px**: Small interactive elements — buttons, tags
- **5px–6px**: Standard components — links, small containers
- **8px**: Images, video containers, standard cards
- **10px**: Video elements, medium containers
- **12px**: Feature cards, large images
- **14px**: Large containers, prominent cards
- **40px**: Large rounded sections
- **50px**: Pill buttons — primary CTAs
- **200px**: Progress bars — full pill shape

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, dark background | Page canvas, most surfaces |
| Level 1 (Veil) | \`rgba(255, 255, 255, 0.04)\` overlay | Subtle surface differentiation |
| Level 2 (Border) | \`rgba(226, 226, 226, 0.35) 1px\` border | Card containment, section separation |
| Level 3 (Ambient) | \`rgba(0, 0, 0, 0.2) 0px 5px 15px\` (inferred from design) | Image containers, floating elements |

### Shadow Philosophy
Warp's elevation system is remarkably flat — almost zero shadow usage on the marketing site. Depth is communicated through:
- **Semi-transparent borders** instead of shadows — borders at 35% opacity create a ghostly containment
- **Photography layering** — images create natural depth without artificial shadows
- **Surface opacity shifts** — \`rgba(255, 255, 255, 0.04)\` overlays create barely-perceptible layer differences
- The effect is calm and grounded — nothing floats, everything rests

### Decorative Depth
- **Photography as depth**: Nature images create atmospheric depth that shadows cannot
- **No glass or blur effects**: The design avoids trendy glassmorphism entirely
- **Warm ambient**: Any glow comes from the photography's natural lighting, not artificial CSS

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <810px | Single column, stacked sections, hero text reduces to ~48px, hamburger nav |
| Tablet | 810px–1500px | 2-column features begin, photography scales, nav links partially visible |
| Desktop | >1500px | Full cinematic layout, 80px hero display, side-by-side photography + text |

### Touch Targets
- Pill buttons: 50px radius with 10px padding — comfortable touch targets
- Nav links: 16px text with surrounding padding for accessibility
- Mobile CTAs: Full-width pills on mobile for easy thumb reach

### Collapsing Strategy
- **Navigation**: Full horizontal nav → simplified mobile navigation
- **Hero text**: 80px display → 56px → 48px across breakpoints
- **Feature sections**: Side-by-side photography + text → stacked vertically
- **Photography**: Scales within containers, maintains cinematic aspect ratios
- **Section spacing**: Reduces proportionally — generous desktop → compact mobile

### Image Behavior
- Nature photography scales responsively, maintaining wide cinematic ratios
- Terminal screenshots maintain aspect ratios within responsive containers
- Video elements scale with 10px radius maintained
- No art direction changes — same compositions across breakpoints`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Warp — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/warp. Warm dark canvas,
        Matter Regular at every tier, almost-monochromatic warm grays,
        ghostly mist borders instead of shadows."
    />

    <style>
      :root {
        --bg: #161412;
        --surface: #1f1d1b;
        --surface-warm: var(--surface);

        --fg: #faf9f6;
        --fg-2: #afaeac;
        --muted: #868584;
        --meta: #666469;

        --border: rgba(226, 226, 226, 0.35);
        --border-soft: var(--border);

        --accent: #353534;
        --accent-on: #afaeac;
        --accent-hover: #454545;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Matter Regular", "Matter", "Inter", ui-sans-serif, system-ui, sans-serif;
        --font-body: "Matter Regular", "Matter", "Inter", ui-sans-serif, system-ui, sans-serif;
        --font-mono: "Geist Mono", "Matter Mono Regular", ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 18px;
        --text-lg: 24px;
        --text-xl: 32px;
        --text-2xl: 48px;
        --text-3xl: 56px;
        --text-4xl: 80px;

        --leading-body: 1.4;
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

        --section-y-desktop: 120px;
        --section-y-tablet: 80px;
        --section-y-phone: 56px;

        --radius-sm: 6px;
        --radius-md: 12px;
        --radius-lg: 14px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 5px 15px rgba(0, 0, 0, 0.2);

        --focus-ring: 0 0 0 2px rgba(250, 249, 246, 0.5);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1500px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
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
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1499px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 809px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — Matter Regular at every tier ─────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 400;              /* Single weight throughout — DESIGN.md §3 */
        line-height: var(--leading-tight);
        color: var(--fg);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-2xl);
        letter-spacing: -0.02em;        /* ≈ -0.96px at 48px */
        line-height: 1.1;
      }
      h3 {
        font-size: var(--text-lg);
        letter-spacing: -0.015em;       /* DESIGN.md Body Heading: 0 to -0.72px */
        line-height: 1.2;
      }
      p { margin: 0; color: var(--fg-2); }
      .lead {
        font-size: 20px;                /* DESIGN.md Body Large is 20px — between --text-base (18) and --text-lg (24) */
        color: var(--fg-2);
        line-height: var(--leading-body);
        letter-spacing: -0.01em;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); color: var(--fg-2); }
      /* Editorial uppercase eyebrow — DESIGN.md §3 magazine signal */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.2em;          /* ≈ 2.4px at 12px — DESIGN.md Small Label */
        font-weight: 400;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — restrained dark pills ───────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 14px var(--space-5);
        border-radius: var(--radius-pill); /* DESIGN.md §4 dark pill — primary CTA */
        font-family: var(--font-body);
        font-size: 16px;                   /* DESIGN.md Button Text — UI tier, not body baseline */
        font-weight: 500;                  /* Matter Medium — only emphasis allowed */
        line-height: 1.2;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { background: var(--accent-active); }
      /* Primary: Earth Gray pill — the brand's restrained CTA */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); color: var(--fg); }
      /* Ghost: text-only, underline on hover — DESIGN.md §4 */
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        padding-inline: var(--space-3);
      }
      .btn-ghost:hover { text-decoration: underline; text-underline-offset: 4px; }

      /* ─── Inputs — warm dark, brightness-shift focus ────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 400;
        color: var(--fg-2);
      }
      .field input {
        padding: 14px var(--space-4);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: 16px;
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        /* DESIGN.md §4 inputs: "Border brightness increase, no colored rings" */
        border-color: var(--fg);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — bordered, no shadow ───────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);  /* Mist Border containment, not shadow */
        border-radius: var(--radius-md);
        padding: var(--space-6) var(--space-6) var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        transition: border-color var(--motion-base) var(--ease-standard);
      }
      .card:hover { border-color: var(--fg-2); }
      .card-eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        color: var(--meta);
        letter-spacing: 0;
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        border: 1px solid var(--border);
        font-size: var(--text-xs); font-weight: 400; line-height: 1.4;
        color: var(--fg-2);
        background: transparent;
      }
      .badge-success { color: var(--success); border-color: color-mix(in oklab, var(--success), transparent 60%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links + kbd ───────────────────────────────────────── */
      a { color: var(--fg); text-decoration: underline; text-decoration-color: var(--meta); text-underline-offset: 4px; }
      a:hover { text-decoration-color: var(--fg); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 3px 8px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--fg-2);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* ─── Hero scroll prompt — terminal monospace flavor ───── */
      .prompt {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--meta);
      }
      .prompt b { color: var(--fg); font-weight: 400; }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · warp</p>
            <h1>The AI terminal,<br />made for flow.</h1>
            <p class="lead" style="max-width: 48ch">
              Warp turns the command line into a calm, considered space —
              block-based, AI-native, and quietly productive. A terminal
              you'd sit with, not just type into.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm">Beta channel</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <p class="prompt"><b>~ warp</b> · last reviewed <time datetime="2026-05-15">2026-05-15</time></p>
            <p class="body-sm body-muted">Press <kbd>⌘</kbd> <kbd>P</kbd> to open the command palette.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 24ch">Restraint through warmth — every tier, one weight.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <p class="card-eyebrow">01 / canvas</p>
            <h3>Earth, not eclipse.</h3>
            <p class="body-sm">
              The canvas is warm near-black with reddish undertones —
              charred wood, not a clinical OLED void. Pure white is
              never used; text is Warm Parchment <code>(--fg)</code>.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">02 / typography</p>
            <h3>One weight carries everything.</h3>
            <p class="body-sm">
              Matter Regular at 80px hero, 24px heading, 18px body.
              Bold weight is forbidden; size and tracking carry the
              hierarchy with editorial calm.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">03 / depth</p>
            <h3>Borders, not shadows.</h3>
            <p class="body-sm">
              Mist Border at 35% opacity creates ghostly containment.
              No glow, no glass, no gradients — depth comes from
              opacity shifts and warm photography, never CSS shadow.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Get the beta</p>
            <h2>One terminal, all your shells.</h2>
            <p class="body-muted" style="max-width: 46ch; font-size: var(--text-base)">
              We'll send a download link and nothing else. Focus rings
              are warm parchment, not blue — the monochromatic palette
              holds, even at the input level.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@warp.dev" autocomplete="email" required />
              <p class="field-help">No marketing — just the download link.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Request access</button>
              <button type="button" class="btn btn-ghost">Read the docs</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=warp_default;return module.exports}});
//# sourceMappingURL=client.warp.js.map