
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.cohere.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var cohere_default={"contract":`## 1. Visual Theme & Atmosphere

Cohere's interface is a polished enterprise command deck — confident, clean, and designed to make AI feel like serious infrastructure rather than a consumer toy. The experience lives on a bright white canvas where content is organized into generously rounded cards (22px radius) that create an organic, cloud-like containment language. This is a site that speaks to CTOs and enterprise architects: professional without being cold, sophisticated without being intimidating.

The design language bridges two worlds with a dual-typeface system: CohereText, a custom display serif with tight tracking, gives headlines the gravitas of a technology manifesto, while Unica77 Cohere Web handles all body and UI text with geometric Swiss precision. This serif/sans pairing creates a "confident authority meets engineering clarity" personality that perfectly reflects an enterprise AI platform.

Color is used with extreme restraint — the interface is almost entirely black-and-white with cool gray borders (\`#d9d9dd\`, \`#e5e7eb\`). Purple-violet appears only in photographic hero bands, gradient sections, and the interactive blue (\`#1863dc\`) that signals hover and focus states. This chromatic restraint means that when color DOES appear — in product screenshots, enterprise photography, and the deep purple section — it carries maximum visual weight.

**Key Characteristics:**
- Bright white canvas with cool gray containment borders
- 22px signature border-radius — the distinctive "Cohere card" roundness
- Dual custom typeface: CohereText (display serif) + Unica77 (body sans)
- Enterprise-grade chromatic restraint: black, white, cool grays, minimal purple-blue accent
- Deep purple/violet hero sections providing dramatic contrast
- Ghost/transparent buttons that shift to blue on hover
- Enterprise photography showing diverse real-world applications
- CohereMono for code and technical labels with uppercase transforms

## 4. Component Stylings

### Buttons

**Ghost / Transparent**
- Background: transparent (\`rgba(255, 255, 255, 0)\`)
- Text: Cohere Black (\`#000000\`)
- No border visible
- Hover: text shifts to Interaction Blue (\`#1863dc\`), opacity 0.8
- Focus: solid 2px outline in Interaction Blue
- The primary button style — invisible until interacted with

**Dark Solid**
- Background: dark/black
- Text: Pure White
- For CTA on light surfaces
- Pill-shaped or standard radius

**Outlined**
- Border-based containment
- Used in secondary actions

### Cards & Containers
- Background: Pure White (\`#ffffff\`)
- Border: thin solid Lightest Gray (\`1px solid #f2f2f2\`) for subtle cards; Cool Border (\`#d9d9dd\`) for emphasized
- Radius: **22px** — the signature Cohere radius for primary cards, images, and dialog containers. Also 4px, 8px, 16px, 20px for smaller elements
- Shadow: minimal — Cohere relies on background color and borders rather than shadows
- Special: \`0px 0px 22px 22px\` radius (bottom-only rounding) for section containers
- Dialog: 8px radius for modal/dialog boxes

### Inputs & Forms
- Text: white on dark input, black on light
- Focus border: Focus Purple (\`#9b60aa\`) with \`1px solid\`
- Focus shadow: red ring (\`rgb(179, 0, 0) 0px 0px 0px 2px\`) — likely for error state indication
- Focus outline: Interaction Blue solid 2px

### Navigation
- Clean horizontal nav on white or dark background
- Logo: Cohere wordmark (custom SVG)
- Links: Dark text at 16px Unica77
- CTA: Dark solid button
- Mobile: hamburger collapse

### Image Treatment
- Enterprise photography with diverse subjects and environments
- Purple-tinted hero photography for dramatic sections
- Product UI screenshots on dark surfaces
- Images with 22px radius matching card system
- Full-bleed purple gradient sections

### Distinctive Components

**22px Card System**
- The 22px border-radius is Cohere's visual signature
- All primary cards, images, and containers use this radius
- Creates a cloud-like, organic softness that's distinctive from the typical 8–12px

**Enterprise Trust Bar**
- Company logos displayed in a horizontal strip
- Demonstrates enterprise adoption
- Clean, monochrome logo treatment

**Purple Hero Bands**
- Full-width deep purple sections housing product showcases
- Create dramatic visual breaks in the white page flow
- Product screenshots float within the purple environment

**Uppercase Code Tags**
- CohereMono in uppercase with letter-spacing
- Used as section markers and categorization labels
- Creates a technical, structured information hierarchy

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 6px, 8px, 10px, 12px, 16px, 20px, 22px, 24px, 28px, 32px, 36px, 40px, 56px, 60px
- Button padding varies by variant
- Card internal padding: approximately 24–32px
- Section vertical spacing: generous (56–60px between sections)

### Grid & Container
- Max container width: up to 2560px (very wide) with responsive scaling
- Hero: centered with dramatic typography
- Feature sections: multi-column card grids
- Enterprise sections: full-width purple bands
- 26 breakpoints detected — extremely granular responsive system

### Whitespace Philosophy
- **Enterprise clarity**: Each section presents one clear proposition with breathing room between.
- **Photography as hero**: Large photographic sections provide visual interest without requiring decorative design elements.
- **Card grouping**: Related content is grouped into 22px-rounded cards, creating natural information clusters.

### Border Radius Scale
- Sharp (4px): Navigation elements, small tags, pagination
- Comfortable (8px): Dialog boxes, secondary containers, small cards
- Generous (16px): Featured containers, medium cards
- Large (20px): Large feature cards
- Signature (22px): Primary cards, hero images, main containers — THE Cohere radius
- Pill (9999px): Buttons, tags, status indicators

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, text blocks |
| Bordered (Level 1) | \`1px solid #f2f2f2\` or \`#d9d9dd\` | Standard cards, list separators |
| Purple Band (Level 2) | Full-width dark purple background | Hero sections, feature showcases |

**Shadow Philosophy**: Cohere is nearly shadow-free. Depth is communicated through **background color contrast** (white cards on purple bands, white surface on snow), **border containment** (cool gray borders), and the dramatic **light-to-dark section alternation**. When elements need elevation, they achieve it through being white-on-dark rather than through shadow casting.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <425px | Compact layout, minimal spacing |
| Mobile | 425–640px | Single column, stacked cards |
| Large Mobile | 640–768px | Minor spacing adjustments |
| Tablet | 768–1024px | 2-column grids begin |
| Desktop | 1024–1440px | Full multi-column layout |
| Large Desktop | 1440–2560px | Maximum container width |

*26 breakpoints detected — one of the most granularly responsive sites in the dataset.*

### Touch Targets
- Buttons adequately sized for touch interaction
- Navigation links with comfortable spacing
- Card surfaces as touch targets

### Collapsing Strategy
- **Navigation**: Full nav collapses to hamburger
- **Feature grids**: Multi-column → 2-column → single column
- **Hero text**: 72px → 48px → 32px progressive scaling
- **Purple sections**: Maintain full-width, content stacks
- **Card grids**: 3 → 2 → 1 column

### Image Behavior
- Photography scales proportionally within 22px-radius containers
- Product screenshots maintain aspect ratio
- Purple sections scale background proportionally`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cohere — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/cohere. Enterprise command deck:
        22px signature card radius, CohereText serif display, ghost buttons."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #fafafa;
        --surface-warm: var(--surface);

        --fg: #000000;
        --fg-2: #212121;
        --muted: #93939f;
        --meta: var(--muted);

        --border: #d9d9dd;
        --border-soft: #f2f2f2;

        --accent: #1863dc;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 16%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #ef4444;

        --font-display: "CohereText", "Space Grotesk", Inter, ui-sans-serif, sans-serif;
        --font-body: "Unica77 Cohere Web", Inter, Arial, ui-sans-serif, sans-serif;
        --font-mono: "CohereMono", "JetBrains Mono", ui-monospace, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 60px;
        --text-4xl: 72px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: -0.02em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 60px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 8px;
        --radius-md: 22px;
        --radius-lg: 22px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border-soft);
        --elev-raised: 0 4px 16px rgba(0, 0, 0, 0.06);

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1440px;
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

      /* ─── Typography — CohereText serif for display ─────────── */
      h1 {
        font-family: var(--font-display); /* CohereText serif — declaration */
        font-size: var(--text-4xl);
        font-weight: 400;
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        margin: 0;
      }
      h2 {
        font-family: var(--font-body);    /* Unica77 for h2 and below */
        font-size: var(--text-2xl);
        font-weight: 400;
        line-height: 1.2;
        letter-spacing: -0.01em;
        margin: 0;
      }
      h3 {
        font-family: var(--font-body);
        font-size: var(--text-xl);
        font-weight: 400;
        line-height: 1.3;
        margin: 0;
      }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--muted); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* CohereMono uppercase label — section markers, technical tags */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.028em;
        font-weight: 400;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — ghost by default, dark solid for CTA ────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 18px;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition:
          color var(--motion-fast) var(--ease-standard),
          background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: dark solid — the enterprise CTA */
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
      }
      .btn-primary:hover { background: var(--fg-2); }
      /* Secondary: ghost — transparent until interacted with */
      .btn-secondary {
        background: transparent;
        color: var(--fg);
      }
      .btn-secondary:hover { color: var(--accent); opacity: 0.8; }

      /* ─── Inputs — focus purple per DESIGN.md ───────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; }
      .field input {
        padding: 12px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: #9b60aa; /* Focus Purple per DESIGN.md */
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — THE 22px Cohere signature radius ──────────── */
      .card {
        background: var(--bg);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md); /* 22px — THE Cohere signature */
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px 10px; border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.4;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 90%); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 88%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links, Kbd ────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: none; }
      a:hover { color: var(--accent); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--muted);
        text-transform: uppercase; letter-spacing: 0.04em;
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4); border: 1px solid var(--border-soft);
        border-radius: var(--radius-md); background: var(--surface); /* 22px radius on meta card too */
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
  <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · cohere</p>
            <h1>Enterprise AI that thinks at your scale.</h1>
            <p class="lead" style="max-width: 52ch">
              Confident, clean, and designed to make AI feel like serious
              infrastructure. Professional without being cold.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--muted)">Platform status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--muted)">Press <kbd>⌘</kbd> <kbd>K</kbd> to search.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 28ch">The 22px radius and ghost button: two signatures one system.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>22px signature radius</h3>
            <p class="body-muted body-sm">
              --radius-md: 22px. Every primary card and container uses this radius —
              creating a cloud-like, organic softness that's distinctly Cohere.
            </p>
            
          </article>
          <article class="card">
            <h3>Ghost buttons</h3>
            <p class="body-muted body-sm">
              .btn-secondary is transparent by default — invisible until hover,
              where text shifts to Interaction Blue (#1863dc).
            </p>
            
          </article>
          <article class="card">
            <h3>Cool-toned neutrals</h3>
            <p class="body-muted body-sm">
              --muted: #93939f carries a subtle blue-violet tint. No warm grays.
              The palette is strictly black, white, and cool gray.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Enterprise inputs with focus purple.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs use 8px radius (--radius-sm) and border: #d9d9dd.
              Focus shifts border to Focus Purple (#9b60aa) — distinct from
              the Interaction Blue hover accent.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">Enterprise free trial — no credit card required.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Start trial</button>
              <button type="button" class="btn btn-secondary">Talk to sales</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=cohere_default;return module.exports}});
//# sourceMappingURL=client.cohere.js.map