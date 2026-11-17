
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.mongodb.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var mongodb_default={"contract":`## 1. Visual Theme & Atmosphere

MongoDB's website is a deep-forest-meets-terminal experience — a design system rooted in the darkest teal-black (\`#001e2b\`) that evokes both the density of a database and the depth of a forest canopy. Against this near-black canvas, a striking neon green (\`#00ed64\`) pulses as the brand accent — bright enough to feel electric, organic enough to feel alive. This isn't the cold neon of cyberpunk; it's the bioluminescent green of something growing in the dark.

The typography system is architecturally ambitious: MongoDB Value Serif for massive hero headlines (96px) creates an editorial, authoritative presence — serif type at database-company scale is a bold choice that says "we're not just another tech company." Euclid Circular A handles the heavy lifting of body and UI text with an unusually wide weight range (300–700), while Source Code Pro serves as the code and label font with distinctive uppercase treatments featuring very wide letter-spacing (1px–3px). This three-font system creates a hierarchy that spans editorial elegance → geometric professionalism → engineering precision.

What makes MongoDB distinctive is its dual-mode design: a dark hero/feature section world (\`#001e2b\` with neon green accents) and a light content world (white with teal-gray borders \`#b8c4c2\`). The transition between these modes creates dramatic contrast. The shadow system uses teal-tinted dark shadows (\`rgba(0, 30, 43, 0.12)\`) that maintain the forest-dark atmosphere even on light surfaces. Buttons use pill shapes (100px–999px radius) with MongoDB Green borders (\`#00684a\`), and the entire component system references the LeafyGreen design system.

**Key Characteristics:**
- Deep teal-black backgrounds (\`#001e2b\`) — forest-dark, not space-dark
- Neon MongoDB Green (\`#00ed64\`) as the singular brand accent — electric and organic
- MongoDB Value Serif for hero headlines — editorial authority at tech scale
- Euclid Circular A for body with weight 300 (light) as a distinctive body weight
- Source Code Pro with wide uppercase letter-spacing (1px–3px) for technical labels
- Teal-tinted shadows: \`rgba(0, 30, 43, 0.12)\` — shadows carry the forest color
- Dual-mode: dark teal hero sections + light white content sections
- Pill buttons (100px radius) with green borders (\`#00684a\`)
- Link Blue (\`#006cfa\`) and hover transition to \`#3860be\`

## 4. Component Stylings

### Buttons

**Primary Green (Dark Surface)**
- Background: \`#00684a\` (muted MongoDB green)
- Text: \`#000000\`
- Radius: 50% (circular) or 100px (pill)
- Border: \`1px solid #00684a\`
- Shadow: \`rgba(0,0,0,0.06) 0px 1px 6px\`
- Hover: scale 1.1
- Active: scale 0.85

**Dark Teal Button**
- Background: \`#1c2d38\`
- Text: \`#5c6c75\`
- Radius: 100px (pill)
- Border: \`1px solid #3d4f58\`
- Hover: background \`#1eaedb\`, text white, translateX(5px)

**Outlined Button (Light Surface)**
- Background: transparent
- Text: \`#001e2b\`
- Border: \`1px solid #b8c4c2\`
- Radius: 4px–8px
- Hover: background tint

### Cards & Containers
- Light mode: white background with \`1px solid #b8c4c2\` border
- Dark mode: \`#001e2b\` or \`#1c2d38\` background with \`1px solid #3d4f58\`
- Radius: 16px (standard), 24px (medium), 48px (large/hero)
- Shadow: \`rgba(0,30,43,0.12) 0px 26px 44px\` (forest-tinted)
- Image containers: 30px–32px radius

### Inputs & Forms
- Textarea: text \`#e8edeb\`, padding 12px 12px 12px 8px
- Borders: \`1px solid #b8c4c2\` on light, \`1px solid #3d4f58\` on dark
- Input radius: 4px

### Navigation
- Dark header on forest-black background
- Euclid Circular A 16px weight 500 for nav links
- MongoDB logo (leaf icon + wordmark) left-aligned
- Green CTA pill buttons right-aligned
- Mega-menu dropdowns with product categories

### Image Treatment
- Dashboard screenshots on dark backgrounds
- Green-accented UI elements in screenshots
- 30px–32px radius on image containers
- Full-width dark sections for product showcases

### Distinctive Components

**Neon Green Accent Underlines**
- \`0px 2px 2px 0px solid #00ed64\` — bottom + right border creating accent underlines
- Used on feature headings and highlighted text
- Also appears as \`#006cfa\` (blue) variant

**Source Code Label System**
- 14px uppercase Source Code Pro with 1px–2px letter-spacing
- Used as section category markers above headings
- Creates a "database field label" aesthetic

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 7px, 8px, 10px, 12px, 14px, 15px, 16px, 18px, 20px, 24px, 32px

### Grid & Container
- Max content width centered
- Dark hero section with contained content
- Light content sections below
- Card grids: 2–3 columns
- Full-width dark footer

### Whitespace Philosophy
- **Dramatic mode transitions**: The shift from dark teal sections to white content creates built-in visual breathing through contrast, not just space.
- **Generous dark sections**: Dark hero and feature areas use extra vertical padding (80px+) to let the forest-dark background breathe.
- **Compact light sections**: White content areas are denser, with tighter card grids and less vertical spacing.

### Border Radius Scale
- Minimal (1px–2px): Small spans, badges
- Subtle (4px): Inputs, small buttons
- Standard (8px): Cards, links
- Card (16px): Standard cards, containers
- Toggle (20px): Switch elements
- Large (24px): Large panels
- Image (30px–32px): Image containers
- Hero (48px): Hero cards
- Pill (100px–999px): Buttons, navigation pills
- Full (9999px): Maximum pill

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Default surfaces |
| Subtle (Level 1) | \`rgba(0,0,0,0.1) 0px 2px 4px\` | Light card lift |
| Standard (Level 2) | \`rgba(0,0,0,0.15) 0px 3px 9px\` | Standard cards |
| Prominent (Level 3) | \`rgba(0,0,0,0.15) 0px 3px 20px\` | Elevated panels |
| Forest (Level 4) | \`rgba(0,30,43,0.12) 0px 26px 44px, rgba(0,0,0,0.13) 0px 7px 13px\` | Hero cards — teal-tinted |

**Shadow Philosophy**: MongoDB's shadow system is unique in that the primary elevation shadow uses \`rgba(0, 30, 43, 0.12)\` — a teal-tinted shadow that carries the forest-dark brand color into the depth system. This means even on white surfaces, shadows feel like they belong to the MongoDB color world rather than being generic neutral black.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <425px | Tight single column |
| Mobile | 425–768px | Standard mobile |
| Tablet | 768–1024px | 2-column grids begin |
| Desktop | 1024–1280px | Standard layout |
| Large Desktop | 1280–1440px | Expanded layout |
| Ultra-wide | >1440px | Maximum width, generous margins |

### Touch Targets
- Pill buttons with generous padding
- Navigation links at 16px with adequate spacing
- Card surfaces as full-area touch targets

### Collapsing Strategy
- Hero: MongoDB Value Serif 96px → 64px → scales further
- Navigation: horizontal mega-menu → hamburger
- Feature cards: multi-column → stacked
- Dark/light sections maintain their mode at all sizes
- Source Code Pro labels maintain uppercase treatment

### Image Behavior
- Dashboard screenshots scale proportionally
- Dark section backgrounds maintained full-width
- Image radius maintained across breakpoints`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MongoDB — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/mongodb. Forest-dark canvas (#001e2b),
        neon MongoDB Green (#00ed64) accent, MongoDB Value Serif at hero scale,
        wide-tracked Source Code Pro labels, teal-tinted shadows."
    />

    <style>
      :root {
        --bg: #001e2b;
        --surface: #1c2d38;
        --surface-warm: var(--surface);

        --fg: #ffffff;
        --fg-2: #e8edeb;
        --muted: #b8c4c2;
        --meta: #5c6c75;

        --border: #3d4f58;
        --border-soft: var(--border);

        --accent: #00ed64;
        --accent-on: #001e2b;
        --accent-hover: #00684a;
        --accent-active: color-mix(in oklab, var(--accent-hover), black 12%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "MongoDB Value Serif", "Times New Roman", Times, ui-serif, Georgia, serif;
        --font-body: "Euclid Circular A", "Akzidenz-Grotesk Std", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-mono: "Source Code Pro", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 11px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 64px;
        --text-4xl: 96px;

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

        --section-y-desktop: 96px;
        --section-y-tablet: 64px;
        --section-y-phone: 40px;

        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 26px 44px rgba(0, 30, 43, 0.12),
          0 7px 13px rgba(0, 0, 0, 0.13);

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
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 300;              /* DESIGN.md §3: weight 300 is the body voice */
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

      /* ─── Typography — serif authority, geometric workhorse ─── */
      h1, h2 {
        font-family: var(--font-display);
        font-weight: 400;              /* MongoDB Value Serif at 400 — the editorial move */
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        color: var(--fg);
        margin: 0;
      }
      h3 {
        font-family: var(--font-body);
        font-weight: 500;              /* Euclid Circular A medium for sub-headings */
        line-height: 1.33;
        color: var(--fg);
        margin: 0;
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-xl); }
      @media (max-width: 1023px) {
        h1 { font-size: var(--text-3xl); }     /* 96 → 64 on tablet */
      }
      @media (max-width: 639px) {
        h1 { font-size: 44px; }                /* further collapse on phone */
      }
      p { margin: 0; }
      .lead {
        font-family: var(--font-body);
        font-size: var(--text-lg);
        font-weight: 300;
        line-height: 1.6;
        color: var(--fg-2);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* Source Code Pro uppercase eyebrow — the database-field label voice */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 2px;
        line-height: 1.14;
        margin: 0;
      }
      /* Neon green accent underline — the signature decorative element */
      .accent-underline {
        background-image: linear-gradient(var(--accent), var(--accent));
        background-size: 100% 2px;
        background-repeat: no-repeat;
        background-position: 0 100%;
        padding-bottom: 2px;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — pill primary on dark, ghost secondary ────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 24px;
        border-radius: var(--radius-pill);  /* DESIGN.md §4: pill CTAs */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: neon-on-dark — the brand's electric CTA */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-primary:hover {
        background: var(--accent-hover);   /* settles to muted Dark Green on hover */
        border-color: var(--accent-hover);
        color: var(--fg);
      }
      .btn-primary:active { background: var(--accent-active); border-color: var(--accent-active); }
      /* Secondary: dark teal pill with cool-gray text — the muted alternative */
      .btn-secondary {
        background: var(--surface);
        color: var(--muted);
        border-color: var(--border);
      }
      .btn-secondary:hover {
        background: #1eaedb;               /* Teal Active — DESIGN.md §4 hover */
        color: var(--fg);
        border-color: #1eaedb;
      }

      /* ─── Inputs — dark surface, light input text ───────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg-2);
      }
      .field input {
        padding: 12px 12px 12px 8px;     /* DESIGN.md §4 textarea padding */
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 300;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — dark surface, forest-tinted shadow ────────── */
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

      /* ─── Badges — pill chips for status ────────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 3px 10px;
        border-radius: var(--radius-pill);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        line-height: 1.6;
      }
      .badge-success {
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), transparent 86%);
      }
      .badge-muted {
        color: var(--muted);
        background: color-mix(in oklab, var(--muted), transparent 88%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { color: #3860be; text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
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
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        background: var(--surface);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
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
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · mongodb</p>
            <h1>The developer data <span class="accent-underline">platform</span>.</h1>
            <p class="lead" style="max-width: 56ch">
              Atlas-scale documents, query, and search across every cloud. Built for
              builders who treat the database as part of the application, not the
              place applications go to wait.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Cluster status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--fg-2)">Cluster status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Healthy
              </span>
            </div>
            <p class="body-sm body-muted">
              Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0
            </p>
            <p class="body-sm body-muted">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to open the Atlas command palette.
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 26ch">
            Forest-dark canvas, <span class="accent-underline">electric green</span> signal.
          </h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <p class="eyebrow">Color</p>
            <h3>Bioluminescent accent</h3>
            <p class="body-muted body-sm">
              MongoDB Green (#00ed64) burns through a forest-black (#001e2b)
              canvas. Used once per section, sparingly, for maximum electric
              impact — never as a background.
            </p>
            
          </article>
          <article class="card">
            <p class="eyebrow">Type</p>
            <h3>Serif at database scale</h3>
            <p class="body-muted body-sm">
              MongoDB Value Serif at 96px gives the page editorial authority
              normally reserved for newspapers. Euclid Circular A at weight 300
              keeps body copy airy against the dense dark surface.
            </p>
            
          </article>
          <article class="card">
            <p class="eyebrow">Depth</p>
            <h3>Teal-tinted elevation</h3>
            <p class="body-muted body-sm">
              Card shadows use rgba(0,30,43,0.12) — the forest tone carried
              into the depth system so even lifted surfaces feel like they
              belong to the MongoDB color world.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs in the forest-dark context.</h2>
            <p class="body-muted" style="max-width: 50ch">
              Borders use teal-gray (#3d4f58), text uses light-input (#e8edeb),
              focus rings glow neon green. Source Code Pro uppercase labels
              read as database field names — systematic, structured, classified.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">We'll send Atlas access and nothing else.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get Atlas access</button>
              <button type="button" class="btn btn-secondary">Talk to sales</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=mongodb_default;return module.exports}});
//# sourceMappingURL=client.mongodb.js.map