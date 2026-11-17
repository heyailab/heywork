
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.together-ai.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var together_ai_default={"contract":`## 1. Visual Theme & Atmosphere

Together AI's interface is a pastel-gradient dreamscape built for enterprise AI infrastructure — a design that somehow makes GPU clusters and model inference feel light, airy, and optimistic. The hero section blooms with soft pink-blue-lavender gradients and abstract, painterly illustrations that evoke clouds and flight, establishing a visual metaphor for the "AI-Native Cloud" proposition. Against this softness, the typography cuts through with precision: "The Future" display font at 64px with aggressive negative tracking (-1.92px) creates dense, authoritative headline blocks.

The design straddles two worlds: a bright, white-canvas light side where pastel gradients and stats cards create an approachable platform overview, and a dark navy universe (\`#010120\` — not gray-black but a deep midnight blue) where research papers and technical content live. This dual-world approach elegantly separates the "business" messaging (light, friendly, stat-driven) from the "research" messaging (dark, serious, academic).

What makes Together AI distinctive is its type system. "The Future" handles all display and body text with a geometric modernist aesthetic, while "PP Neue Montreal Mono" provides uppercase labels with meticulous letter-spacing — creating a "technical infrastructure company with taste" personality. The brand accents — magenta (\`#ef2cc1\`) and orange (\`#fc4c02\`) — appear sparingly in the gradient and illustrations, never polluting the clean UI.

**Key Characteristics:**
- Soft pastel gradients (pink, blue, lavender) against pure white canvas
- Deep midnight blue (\`#010120\`) for dark/research sections — not gray-black
- Custom "The Future" font with aggressive negative letter-spacing throughout
- PP Neue Montreal Mono for uppercase technical labels
- Sharp geometry (4px, 8px radius) — not rounded, not pill
- Magenta (#ef2cc1) + orange (#fc4c02) brand accents in illustrations only
- Lavender (#bdbbff) as a soft secondary accent
- Enterprise stats prominently displayed (2x, 60%, 90%)
- Dark-blue-tinted shadows (rgba(1, 1, 32, 0.1))

## 4. Component Stylings

### Buttons

**Glass on Dark**
- Background: \`rgba(255, 255, 255, 0.12)\` (frosted glass)
- Text: Pure White (\`#ffffff\`)
- Radius: sharp (4px)
- Opacity: 0.5
- Hover: transparent dark overlay
- Used on dark sections — subtle, glass-like

**Dark Solid**
- Background: Dark Blue (\`#010120\`) or Pure Black
- Text: Pure White
- Radius: sharp (4px)
- The primary CTA on light surfaces

**Outlined Light**
- Border: \`1px solid rgba(0, 0, 0, 0.08)\`
- Background: transparent or subtle glass
- Text: Pure Black
- Radius: sharp (4px)
- Secondary actions on light surfaces

### Cards & Containers
- Background: Pure White or subtle glass tint
- Border: \`1px solid rgba(0, 0, 0, 0.08)\` on light; \`1px solid rgba(255, 255, 255, 0.12)\` on dark
- Radius: sharp (4px) for badges and small elements; comfortable (8px) for larger containers
- Shadow: dark-blue-tinted (\`rgba(1, 1, 32, 0.1) 0px 4px 10px\`) — warm and subtle
- Stats cards with large numbers prominently displayed

### Badges / Tags
- Background: \`rgba(0, 0, 0, 0.04)\` (light) or \`rgba(255, 255, 255, 0.12)\` (dark)
- Text: Black (light) or White (dark)
- Padding: 2px 8px (compact)
- Radius: sharp (4px)
- Border: \`1px solid rgba(0, 0, 0, 0.08)\`
- PP Neue Montreal Mono, uppercase, 16px

### Navigation
- Clean horizontal nav on white/transparent
- Logo: Together AI wordmark
- Links: The Future at 16px, weight 400
- CTA: Dark solid button
- Hover: no text-decoration

### Image Treatment
- Abstract pastel gradient illustrations (cloud/feather forms)
- Product UI screenshots on dark/light surfaces
- Team photos in editorial style
- Research paper cards with dark backgrounds

### Distinctive Components

**Stats Bar**
- Large performance metrics (2x, 60%, 90%)
- Bold display numbers
- Short descriptive captions beneath
- Clean horizontal layout

**Mono Section Labels**
- PP Neue Montreal Mono, uppercase, 11px, letter-spacing 0.055px
- Used as navigational signposts throughout the page
- Technical, structured feel

**Research Section**
- Dark Blue (#010120) background
- White text, research paper thumbnails
- Creates a distinct "academic" zone

**Large Footer Logo**
- "together" wordmark rendered at massive scale in the dark footer
- Creates a brand-statement closing moment

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 44px, 48px, 80px, 100px, 120px
- Button/badge padding: 2px 8px (compact)
- Card internal padding: approximately 24–32px
- Section vertical spacing: generous (80–120px)

### Grid & Container
- Max container width: approximately 1200px, centered
- Hero: centered with pastel gradient background
- Feature sections: multi-column card grids
- Stats: horizontal row of metric cards
- Research: dark full-width section

### Whitespace Philosophy
- **Optimistic breathing room**: Generous spacing between sections creates an open, inviting feel that makes enterprise AI infrastructure feel accessible.
- **Dual atmosphere**: Light sections breathe with whitespace; dark sections are denser with content.
- **Stats as visual anchors**: Large numbers with small captions create natural focal points.

### Border Radius Scale
- Sharp (4px): Buttons, badges, tags, small interactive elements — the primary radius
- Comfortable (8px): Larger containers, feature cards

*This is a deliberately restrained radius system — no pills, no generous rounding. The sharp geometry contrasts with the soft pastel gradients.*

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, text blocks |
| Contained (Level 1) | \`1px solid rgba(0,0,0,0.08)\` (light) or \`rgba(255,255,255,0.12)\` (dark) | Cards, badges, containers |
| Elevated (Level 2) | \`rgba(1, 1, 32, 0.1) 0px 4px 10px\` | Feature cards, hover states |
| Dark Zone (Level 3) | Dark Blue (#010120) full-width background | Research, footer, technical sections |

**Shadow Philosophy**: Together AI uses a single, distinctive shadow — tinted with Dark Blue (\`rgba(1, 1, 32, 0.1)\`) rather than generic black. This gives elevated elements a subtle blue-ish cast that ties them to the brand's midnight-blue dark mode. The shadow is soft (10px blur, 4px offset) and always downward — creating gentle paper-hover elevation.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <479px | Compact layout, stacked everything |
| Large Mobile | 479–767px | Single column, hamburger nav |
| Tablet | 768–991px | 2-column grids begin |
| Desktop | 992px+ | Full multi-column layout |

### Touch Targets
- Buttons with adequate padding
- Card surfaces as touch targets
- Navigation links at comfortable 16px

### Collapsing Strategy
- **Navigation**: Collapses to hamburger on mobile
- **Hero text**: 64px → 40px → 28px progressive scaling
- **Stats bar**: Horizontal → stacked vertical
- **Feature grids**: Multi-column → single column
- **Research section**: Cards stack vertically

### Image Behavior
- Pastel illustrations scale proportionally
- Product screenshots maintain aspect ratio
- Team photos scale within containers`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Together AI — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/together-ai. Enterprise AI infrastructure:
        'The Future' font, aggressive negative tracking, pure white light sections,
        midnight blue dark sections, sharp 4/8px geometry."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: var(--surface);

        --fg: #000000;
        --fg-2: rgba(0, 0, 0, 0.6);
        --muted: #666666;
        --meta: var(--muted);

        --border: #ebebeb;
        --border-soft: var(--border);

        --accent: #010120;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), white 8%);
        --accent-active: color-mix(in oklab, var(--accent), white 16%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "The Future", Arial, ui-sans-serif, sans-serif;
        --font-body: "The Future", Arial, ui-sans-serif, sans-serif;
        --font-mono: "PP Neue Montreal Mono", Georgia, ui-monospace, monospace;

        --text-xs: 10px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 28px;
        --text-3xl: 40px;
        --text-4xl: 64px;

        --leading-body: 1.3;
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

        --section-y-desktop: 80px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: rgba(1, 1, 32, 0.1) 0px 4px 10px;

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

      /* ─── "The Future" typography ────────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 500;                  /* Medium — NO bold in Together AI */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: var(--tracking-display); /* Always negative */
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-3xl); }
      h3 { font-size: var(--text-2xl); }
      p { margin: 0; font-weight: 400; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      /* PP Neue Montreal Mono for section labels — uppercase technical */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 400;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;            /* Mono labels: positive tracking contrast */
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — dark midnight primary, lavender ghost ────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 20px;
        border-radius: var(--radius-sm);    /* 4px — sharp geometry */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;
        letter-spacing: var(--tracking-display);
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: midnight dark — main CTA */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      /* Secondary: outlined with lavender tint on hover */
      .btn-secondary {
        background: transparent;
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-secondary:hover { background: rgba(189, 187, 255, 0.12); border-color: #bdbbff; }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }
      .field input {
        padding: 12px 14px;
        border-radius: var(--radius-sm);  /* 4px */
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;
        letter-spacing: var(--tracking-display);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); font-family: var(--font-mono); }

      /* ─── Cards — enterprise feature cards ──────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);   /* 8px — feature containers */
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
      }

      /* ─── Dark section override — the "midnight world" ─────── */
      .section-dark {
        background: #010120;             /* Brand dark blue — the research world */
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }
      .section-dark .eyebrow { color: rgba(255, 255, 255, 0.5); }
      .section-dark p { color: rgba(255, 255, 255, 0.7); }
      .section-dark .card {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }
      .section-dark .btn-primary {
        background: #bdbbff;
        color: var(--accent);            /* Dark on lavender — reverse CTA */
      }
      .section-dark .btn-primary:hover { background: #d4d3ff; }

      /* ─── Badges ─────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        font-family: var(--font-mono);
        font-size: var(--text-xs); font-weight: 400; line-height: 1.2;
        text-transform: uppercase; letter-spacing: 0.06em;
      }
      .badge-lavender { color: #6059ff; background: rgba(189, 187, 255, 0.2); }
      .badge-muted { color: var(--muted); background: var(--border-soft); }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: none; letter-spacing: var(--tracking-display); }
      a:hover { text-decoration: underline; }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
      /* Lavender gradient stat pill */
      .stat-pill {
        display: inline-flex; flex-direction: column; align-items: center;
        padding: 12px 20px;
        background: rgba(189, 187, 255, 0.15);
        border: 1px solid rgba(189, 187, 255, 0.35);
        border-radius: var(--radius-md);
      }
      .stat-pill .num { font-size: var(--text-2xl); font-weight: 500; letter-spacing: var(--tracking-display); }
      .stat-pill .lbl { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
    </style>
  </head>
  <body>
    <main>
      <!-- Light section — the "business world" -->
      <section data-od-id="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="stack-4">
              <p class="eyebrow">reference-fixture · together-ai</p>
              <h1>Fast inference. Open models.</h1>
              <p class="lead" style="max-width: 48ch">
                "The Future" font with aggressive negative tracking.
                Pure white canvas for business, deep midnight for research.
                Sharp 4/8px geometry — never pill, never generous.
              </p>
              <div class="hero-actions">
                
                
              </div>
            </div>
            <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
              <div class="stat-pill">
                <span class="num">100+</span>
                <span class="lbl">open models</span>
              </div>
              <div class="stat-pill">
                <span class="num">64px</span>
                <span class="lbl">display size</span>
              </div>
              <div class="stat-pill">
                <span class="num">−0.03em</span>
                <span class="lbl">tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Light features section -->
      <section data-od-id="features">
        <div class="container">
          <div class="stack-3">
            <p class="eyebrow">what-this-fixture-exercises</p>
            <h2 style="max-width: 24ch">Sharp geometry. Negative tracking. Lavender tints.</h2>
          </div>
          <div class="features-grid" style="margin-block-start: var(--space-8)">
            <article class="card">
              <span class="badge badge-lavender">Display</span>
              <h3>"The Future"</h3>
              <p style="color: var(--fg-2); font-size: var(--text-sm)">
                Single typeface for both display and body. Weight capped at 500.
                Aggressive negative tracking (−0.03em) throughout — no exceptions.
              </p>
              
            </article>
            <article class="card">
              <span class="badge badge-muted">Geometry</span>
              <h3>4px + 8px only</h3>
              <p style="color: var(--fg-2); font-size: var(--text-sm)">
                --radius-sm: 4px for buttons, badges, tags. --radius-md: 8px for
                feature containers. No pill shapes — technical precision over softness.
              </p>
              
            </article>
            <article class="card">
              <span class="badge badge-lavender">Accent</span>
              <h3>Midnight CTA</h3>
              <p style="color: var(--fg-2); font-size: var(--text-sm)">
                --accent: #010120. The dark world's background color used as the
                primary CTA on light sections. Lavender (#bdbbff) as soft UI tint.
              </p>
              
            </article>
          </div>
        </div>
      </section>

      <!-- Dark section override — the "research/technical world" -->
      <section data-od-id="dark-world" class="section-dark">
        <div class="container">
          <div class="hero-grid">
            <div class="stack-4">
              <p class="eyebrow">dark-section-override</p>
              <h2 style="color: #ffffff; max-width: 28ch">The research world. Midnight blue.</h2>
              <p style="color: rgba(255,255,255,0.7); max-width: 48ch; font-size: var(--text-lg)">
                Dark sections use background #010120 with white text. Same font,
                same sharp geometry. Lavender becomes the primary CTA color here.
              </p>
              <div class="hero-actions">
                
                
              </div>
            </div>
            <div class="features-grid" style="grid-template-columns: 1fr;">
              <article class="card" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);">
                <span class="badge" style="color: #bdbbff; background: rgba(189,187,255,0.15);">Technical</span>
                <h3 style="color: #ffffff;">PP Neue Montreal Mono</h3>
                <p style="color: rgba(255,255,255,0.6); font-size: var(--text-sm)">
                  --font-mono: "PP Neue Montreal Mono". Used for uppercase section
                  labels and technical markers. Positive tracking contrast (0.1em)
                  against "The Future"'s negative display tracking.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Form — light section -->
      <section data-od-id="form">
        <div class="container">
          <div class="form-row">
            <div class="stack-4">
              <p class="eyebrow">form-components</p>
              <h2 style="max-width: 24ch">Sharp inputs. Mono labels.</h2>
              <p style="color: var(--fg-2); max-width: 48ch">
                Labels use PP Neue Montreal Mono, uppercase. Inputs have 4px radius,
                crisp 1px borders. Focus shifts border to midnight dark (#010120)
                with brand-tinted focus ring.
              </p>
            </div>
            <div role="group" class="hey-preview-form form">
              <div class="field">
                <label for="api-key">API key</label>
                <input id="api-key" type="text" placeholder="sk-together-..." autocomplete="off" />
                <p class="field-help">Used to authenticate all inference requests.</p>
              </div>
              <div class="field">
                <label for="model">Default model</label>
                <input id="model" type="text" placeholder="meta-llama/Llama-3-70b-chat" />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save config</button>
                <button type="button" class="btn btn-secondary">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=together_ai_default;return module.exports}});
//# sourceMappingURL=client.together-ai.js.map