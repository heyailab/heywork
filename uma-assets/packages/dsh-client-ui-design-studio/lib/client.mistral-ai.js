
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.mistral-ai.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var mistral_ai_default={"contract":`## 1. Visual Theme & Atmosphere

Mistral AI's interface is a sun-drenched landscape rendered in code — a warm, bold, unapologetically European design that trades the typical blue-screen AI aesthetic for golden amber, burnt orange, and the feeling of late-afternoon light in southern France. Every surface glows with warmth: backgrounds fade from pale cream to deep amber, shadows carry golden undertones (\`rgba(127, 99, 21, ...)\`), and the brand's signature orange (\`#fa520f\`) burns through the page like a signal fire.

The design language is maximalist in its warmth but minimalist in its structure. Huge display headlines (82px) crash into the viewport with aggressive negative tracking (-2.05px), creating text blocks that feel like billboards or protest posters — declarations rather than descriptions. The typography uses Arial (likely a custom font with Arial as fallback) at extreme sizes, creating a raw, unadorned voice that says "we build frontier AI" with no decoration needed.

What makes Mistral distinctive is the complete commitment to a warm color temperature. The signature "block" identity — a gradient system flowing from bright yellow (\`#ffd900\`) through amber (\`#ffa110\`) to burnt orange (\`#fa520f\`) — creates a visual identity that's immediately recognizable. Even the shadows are warm, using amber-tinted blacks instead of cool grays. Combined with dramatic landscape photography in golden tones, the design feels less like a tech company and more like a European luxury brand that happens to build language models.

**Key Characteristics:**
- Golden-amber color universe: every tone from pale cream (#fffaeb) to burnt orange (#fa520f)
- Massive display typography (82px) with aggressive negative letter-spacing (-2.05px)
- Warm golden shadow system using amber-tinted rgba values
- The Mistral "M" block identity — a gradient from yellow to orange
- Dramatic landscape photography in warm golden tones
- Uppercase typography used strategically for section labels and CTAs
- Near-zero border-radius — sharp, architectural geometry
- French-European confidence: bold, warm, declarative

## 4. Component Stylings

### Buttons

**Cream Surface**
- Background: Cream (\`#fff0c2\`)
- Text: Mistral Black (\`#1f1f1f\`)
- No visible border
- The warm, inviting secondary CTA

**Dark Solid**
- Background: Mistral Black (\`#1f1f1f\`)
- Text: Pure White (\`#ffffff\`)
- Padding: 12px (all sides)
- No visible border
- The primary action button — dark on warm

**Ghost / Transparent**
- Background: transparent with slight dark overlay (\`oklab(0, 0, 0 / 0.1)\`)
- Text: Mistral Black (\`#1f1f1f\`)
- Opacity: 0.4
- For secondary/de-emphasized actions

**Text / Underline**
- Background: transparent
- Text: Mistral Black (\`#1f1f1f\`)
- Padding: 8px 0px 0px (top-only)
- Minimal styling — text link as button
- For tertiary navigation actions

### Cards & Containers
- Background: Warm Ivory (\`#fffaeb\`), Cream (\`#fff0c2\`), or Pure White
- Border: minimal to none — containers defined by background color
- Radius: near-zero — sharp, architectural corners
- Shadow: warm golden multi-layer (\`rgba(127, 99, 21, 0.12) -8px 16px 39px, rgba(127, 99, 21, 0.1) -33px 64px 72px, rgba(127, 99, 21, 0.06) -73px 144px 97px, ...\`) — a dramatic, cascading warm shadow
- Distinctive: the golden shadow creates a "golden hour" lighting effect

### Inputs & Forms
- Border: \`hsl(240, 5.9%, 90%)\` — the sole cool-toned element
- Focus: accent color ring
- Minimal styling consistent with sparse aesthetic

### Navigation
- Transparent nav overlaying the warm hero
- Logo: Mistral "M" wordmark
- Links: Dark text (white on dark sections)
- CTA: Dark solid button or cream surface button
- Minimal, wide-spaced layout

### Image Treatment
- Dramatic landscape photography in warm golden tones
- The winding road through golden hills — a recurring visual motif
- The Mistral "M" rendered at large scale on golden backgrounds
- Warm color grading on all photography
- Full-bleed sections with photography

### Distinctive Components

**Mistral Block Identity**
- A row of colored blocks forming the gradient: yellow → amber → orange → burnt orange
- Each block gets progressively more orange/red
- The visual DNA of the brand — recognizable at any size

**Golden Shadow Cards**
- Cards elevated with warm amber multi-layered shadows
- 5 layers of shadow from 16px to 400px offset
- Creates a "floating in golden light" effect unique to Mistral

**Dark Footer Gradient**
- Footer transitions from warm amber to dark through a dramatic gradient
- Creates a "sunset" effect as the page ends

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 4px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 98px, 100px
- Button padding: 12px or 8px 0px (compact)
- Section vertical spacing: very generous (80px–100px)

### Grid & Container
- Max container width: approximately 1280px, centered
- Hero: full-width with massive typography overlaying warm backgrounds
- Feature sections: wide-format layouts with dramatic imagery
- Card grids: 2–3 column layouts

### Whitespace Philosophy
- **Bold declarations**: Huge headlines surrounded by generous whitespace create billboard-like impact — each statement gets its own breathing space.
- **Warm void**: Empty space itself feels warm because the backgrounds are tinted ivory/cream rather than pure white.
- **Photography as space-filler**: Large landscape images serve double duty as content and decorative whitespace.

### Border Radius Scale
- Near-zero: The dominant radius — sharp, architectural corners on most elements
- This extreme sharpness contrasts with the warmth of the colors, creating a tension between soft color and hard geometry.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page backgrounds, text blocks |
| Golden Float (Level 1) | Multi-layer warm shadow (5 layers, 12%→0% opacity, amber-tinted) | Feature cards, product showcases, elevated content |

**Shadow Philosophy**: Mistral uses a single but extraordinarily complex shadow — **five cascading layers** of amber-tinted shadow (\`rgba(127, 99, 21, ...)\`) that build from a close 16px offset to a distant 400px offset. The result is a rich, warm, "golden hour" lighting effect that makes elevated elements look like they're bathed in afternoon sunlight. This is the most distinctive shadow system in any major AI brand.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, stacked everything, hero text reduces to ~32px |
| Tablet | 640–768px | Minor layout adjustments |
| Small Desktop | 768–1024px | 2-column layouts begin |
| Desktop | 1024–1280px | Full layout with maximum typography scale |

### Touch Targets
- Buttons use generous padding (12px minimum)
- Navigation elements adequately spaced
- Cards serve as large touch targets

### Collapsing Strategy
- **Navigation**: Collapses to hamburger on mobile
- **Hero text**: 82px → 56px → 48px → 32px progressive scaling
- **Feature sections**: Multi-column → stacked
- **Photography**: Scales proportionally, may crop on mobile
- **Block identity**: Scales down proportionally

### Image Behavior
- Landscape photography scales proportionally
- Warm color grading maintained at all sizes
- Block gradient elements resize fluidly
- No art direction changes — same warm composition at all sizes`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mistral AI — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/mistral-ai. Golden amber universe,
        billboard typography (82px), sharp architectural corners, weight 400 only."
    />

    <style>
      :root {
        --bg: #fffaeb;
        --surface: #fff0c2;
        --surface-warm: var(--surface);

        --fg: #1f1f1f;
        --fg-2: var(--fg);
        --muted: #3d3d3d;
        --meta: var(--muted);

        --border: #f0e8c8;
        --border-soft: var(--border);

        --accent: #fa520f;
        --accent-on: #ffffff;
        --accent-hover: #fb6424;
        --accent-active: color-mix(in oklab, var(--accent), black 12%);

        --success: #17a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: Arial, ui-sans-serif, system-ui, sans-serif;
        --font-body: Arial, ui-sans-serif, system-ui, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 24px;
        --text-xl: 32px;
        --text-2xl: 48px;
        --text-3xl: 56px;
        --text-4xl: 82px;

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

        --section-y-desktop: 80px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 2px;
        --radius-md: 2px;
        --radius-lg: 4px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: -8px 16px 39px rgba(127, 99, 21, 0.12);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
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

      /* ─── Typography — weight 400 ONLY; size carries hierarchy ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 400;              /* Single weight throughout — no exception */
        line-height: var(--leading-tight);
        margin: 0;
      }
      h1 { font-size: var(--text-4xl); letter-spacing: var(--tracking-display); }
      h2 { font-size: var(--text-3xl); letter-spacing: -0.01em; }
      h3 { font-size: var(--text-xl); }
      p { margin: 0; }
      .lead { font-size: var(--text-base); color: var(--muted); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* Uppercase on section labels — European signage quality */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 400;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — sharp corners, warm palette ─────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 16px;
        border-radius: var(--radius-sm); /* Near-zero — sharp corners */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;              /* Single weight — no bold anywhere */
        line-height: 1;
        cursor: pointer;
        border: none;
        text-transform: uppercase;     /* European formality on CTAs */
        letter-spacing: 0.04em;
        transition: background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { opacity: 0.9; }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: dark solid (#1f1f1f) — dark on warm background */
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
      }
      .btn-primary:hover { background: #333333; }
      /* Secondary: Cream surface — warm, inviting */
      .btn-secondary {
        background: var(--surface);
        color: var(--fg);
      }
      .btn-secondary:hover { background: color-mix(in oklab, var(--surface), black 6%); }

      /* ─── Inputs — warm borders ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 400; }
      .field input {
        padding: 12px;
        border-radius: var(--radius-sm);
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
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — background-defined, golden shadow ─────────── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-sm); /* Sharp corners */
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);  /* Golden float shadow */
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px var(--space-2);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 400; line-height: 1.6;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 90%); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 88%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4); border: 1px solid var(--border);
        border-radius: var(--radius-sm); background: var(--surface);
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
  <style data-hey-responsive-repair>
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
            <p class="eyebrow">Reference fixture · mistral-ai</p>
            <h1>Frontier AI, forged in warmth.</h1>
            <p class="lead" style="max-width: 52ch">
              Open-weight models built with European engineering confidence.
              Every tone from pale ivory to burnt orange, no cool grays anywhere.
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
            <p class="body-sm" style="color: var(--muted)">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--muted)">Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Warmth as a system, not an afterthought.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Golden amber universe</h3>
            <p class="body-muted body-sm">
              --bg (#fffaeb) → --surface (#fff0c2) → --accent (#fa520f).
              Every tone in the warm spectrum. No cool colors permitted.
            </p>
            
          </article>
          <article class="card">
            <h3>Weight 400 throughout</h3>
            <p class="body-muted body-sm">
              The entire system uses weight 400 — even at 82px. Size and color
              carry hierarchy. Bold weight is European bad taste here.
            </p>
            
          </article>
          <article class="card">
            <h3>Sharp geometry</h3>
            <p class="body-muted body-sm">
              --radius-sm: 2px. Near-zero border-radius on everything.
              The sharpness contrasts with warm colors, creating tension.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs in the warm ivory context.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Even form borders use the warm palette. The focus ring is orange-tinted
              (--accent). No cool grays permitted in the Mistral universe.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@mistral.ai" autocomplete="email" required />
              <p class="field-help">We'll send API access and nothing else.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get access</button>
              <button type="button" class="btn btn-secondary">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=mistral_ai_default;return module.exports}});
//# sourceMappingURL=client.mistral-ai.js.map