
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.notion.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var notion_default={"contract":`## 1. Visual Theme & Atmosphere

Notion's website embodies the philosophy of the tool itself: a blank canvas that gets out of your way. The design system is built on warm neutrals rather than cold grays, creating a distinctly approachable minimalism that feels like quality paper rather than sterile glass. The page canvas is pure white (\`#ffffff\`) but the text isn't pure black -- it's a warm near-black (\`rgba(0,0,0,0.95)\`) that softens the reading experience imperceptibly. The warm gray scale (\`#f6f5f4\`, \`#31302e\`, \`#615d59\`, \`#a39e98\`) carries subtle yellow-brown undertones, giving the interface a tactile, almost analog warmth.

The custom NotionInter font (a modified Inter) is the backbone of the system. At display sizes (64px), it uses aggressive negative letter-spacing (-2.125px), creating headlines that feel compressed and precise. The weight range is broader than typical systems: 400 for body, 500 for UI elements, 600 for semi-bold labels, and 700 for display headings. OpenType features \`"lnum"\` (lining numerals) and \`"locl"\` (localized forms) are enabled on larger text, adding typographic sophistication that rewards close reading.

What makes Notion's visual language distinctive is its border philosophy. Rather than heavy borders or shadows, Notion uses ultra-thin \`1px solid rgba(0,0,0,0.1)\` borders -- borders that exist as whispers, barely perceptible division lines that create structure without weight. The shadow system is equally restrained: multi-layer stacks with cumulative opacity never exceeding 0.05, creating depth that's felt rather than seen.

**Key Characteristics:**
- NotionInter (modified Inter) with negative letter-spacing at display sizes (-2.125px at 64px)
- Warm neutral palette: grays carry yellow-brown undertones (\`#f6f5f4\` warm white, \`#31302e\` warm dark)
- Near-black text via \`rgba(0,0,0,0.95)\` -- not pure black, creating micro-warmth
- Ultra-thin borders: \`1px solid rgba(0,0,0,0.1)\` throughout -- whisper-weight division
- Multi-layer shadow stacks with sub-0.05 opacity for barely-there depth
- Notion Blue (\`#0075de\`) as the singular accent color for CTAs and interactive elements
- Pill badges (9999px radius) with tinted blue backgrounds for status indicators
- 8px base spacing unit with an organic, non-rigid scale

## 4. Component Stylings

### Buttons

**Primary Blue**
- Background: \`#0075de\` (Notion Blue)
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 4px (subtle)
- Border: \`1px solid transparent\`
- Hover: background darkens to \`#005bab\`
- Active: scale(0.9) transform
- Focus: \`2px solid\` focus outline, \`var(--shadow-level-200)\` shadow
- Use: Primary CTA ("Get Notion free", "Try it")

**Secondary / Tertiary**
- Background: \`rgba(0,0,0,0.05)\` (translucent warm gray)
- Text: \`#000000\` (near-black)
- Padding: 8px 16px
- Radius: 4px
- Hover: text color shifts, scale(1.05)
- Active: scale(0.9) transform
- Use: Secondary actions, form submissions

**Ghost / Link Button**
- Background: transparent
- Text: \`rgba(0,0,0,0.95)\`
- Decoration: underline on hover
- Use: Tertiary actions, inline links

**Pill Badge Button**
- Background: \`#f2f9ff\` (tinted blue)
- Text: \`#097fe8\`
- Padding: 4px 8px
- Radius: 9999px (full pill)
- Font: 12px weight 600
- Use: Status badges, feature labels, "New" tags

### Cards & Containers
- Background: \`#ffffff\`
- Border: \`1px solid rgba(0,0,0,0.1)\` (whisper border)
- Radius: 12px (standard cards), 16px (featured/hero cards)
- Shadow: \`rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px\`
- Hover: subtle shadow intensification
- Image cards: 12px top radius, image fills top half

### Inputs & Forms
- Background: \`#ffffff\`
- Text: \`rgba(0,0,0,0.9)\`
- Border: \`1px solid #dddddd\`
- Padding: 6px
- Radius: 4px
- Focus: blue outline ring
- Placeholder: warm gray \`#a39e98\`

### Navigation
- Clean horizontal nav on white, not sticky
- Brand logo left-aligned (33x34px icon + wordmark)
- Links: NotionInter 15px weight 500-600, near-black text
- Hover: color shift to \`var(--color-link-primary-text-hover)\`
- CTA: blue pill button ("Get Notion free") right-aligned
- Mobile: hamburger menu collapse
- Product dropdowns with multi-level categorized menus

### Image Treatment
- Product screenshots with \`1px solid rgba(0,0,0,0.1)\` border
- Top-rounded images: \`12px 12px 0px 0px\` radius
- Dashboard/workspace preview screenshots dominate feature sections
- Warm gradient backgrounds behind hero illustrations (decorative character illustrations)

### Distinctive Components

**Feature Cards with Illustrations**
- Large illustrative headers (The Great Wave, product UI screenshots)
- 12px radius card with whisper border
- Title at 22px weight 700, description at 16px weight 400
- Warm white (\`#f6f5f4\`) background variant for alternating sections

**Trust Bar / Logo Grid**
- Company logos (trusted teams section) in their brand colors
- Horizontal scroll or grid layout with team counts
- Metric display: large number + description pattern

**Metric Cards**
- Large number display (e.g., "$4,200 ROI")
- NotionInter 40px+ weight 700 for the metric
- Description below in warm gray body text
- Whisper-bordered card container

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 3px, 4px, 5px, 6px, 7px, 8px, 11px, 12px, 14px, 16px, 24px, 32px
- Non-rigid organic scale with fractional values (5.6px, 6.4px) for micro-adjustments

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with generous top padding (80-120px)
- Feature sections: 2-3 column grids for cards
- Full-width warm white (\`#f6f5f4\`) section backgrounds for alternation
- Code/dashboard screenshots as contained with whisper border

### Whitespace Philosophy
- **Generous vertical rhythm**: 64-120px between major sections. Notion lets content breathe with vast vertical padding.
- **Warm alternation**: White sections alternate with warm white (\`#f6f5f4\`) sections, creating gentle visual rhythm without harsh color breaks.
- **Content-first density**: Body text blocks are compact (line-height 1.50) but surrounded by ample margin, creating islands of readable content in a sea of white space.

### Border Radius Scale
- Micro (4px): Buttons, inputs, functional interactive elements
- Subtle (5px): Links, list items, menu items
- Standard (8px): Small cards, containers, inline elements
- Comfortable (12px): Standard cards, feature containers, image tops
- Large (16px): Hero cards, featured content, promotional blocks
- Full Pill (9999px): Badges, pills, status indicators
- Circle (100%): Tab indicators, avatars

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, text blocks |
| Whisper (Level 1) | \`1px solid rgba(0,0,0,0.1)\` | Standard borders, card outlines, dividers |
| Soft Card (Level 2) | 4-layer shadow stack (max opacity 0.04) | Content cards, feature blocks |
| Deep Card (Level 3) | 5-layer shadow stack (max opacity 0.05, 52px blur) | Modals, featured panels, hero elements |
| Focus (Accessibility) | \`2px solid var(--focus-color)\` outline | Keyboard focus on all interactive elements |

**Shadow Philosophy**: Notion's shadow system uses multiple layers with extremely low individual opacity (0.01 to 0.05) that accumulate into soft, natural-looking elevation. The 4-layer card shadow spans from 1.04px to 18px blur, creating a gradient of depth rather than a single hard shadow. The 5-layer deep shadow extends to 52px blur at 0.05 opacity, producing ambient occlusion that feels like natural light rather than computer-generated depth. This layered approach makes elements feel embedded in the page rather than floating above it.

### Decorative Depth
- Hero section: decorative character illustrations (playful, hand-drawn style)
- Section alternation: white to warm white (\`#f6f5f4\`) background shifts
- No hard section borders -- separation comes from background color changes and spacing

## 7. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <400px | Tight single column, minimal padding |
| Mobile | 400-600px | Standard mobile, stacked layout |
| Tablet Small | 600-768px | 2-column grids begin |
| Tablet | 768-1080px | Full card grids, expanded padding |
| Desktop Small | 1080-1200px | Standard desktop layout |
| Desktop | 1200-1440px | Full layout, maximum content width |
| Large Desktop | >1440px | Centered, generous margins |

### Touch Targets
- Buttons use comfortable padding (8px-16px vertical)
- Navigation links at 15px with adequate spacing
- Pill badges have 8px horizontal padding for tap targets
- Mobile menu toggle uses standard hamburger button

### Collapsing Strategy
- Hero: 64px display -> scales to 40px -> 26px on mobile, maintains proportional letter-spacing
- Navigation: horizontal links + blue CTA -> hamburger menu
- Feature cards: 3-column -> 2-column -> single column stacked
- Product screenshots: maintain aspect ratio with responsive images
- Trust bar logos: grid -> horizontal scroll on mobile
- Footer: multi-column -> stacked single column
- Section spacing: 80px+ -> 48px on mobile

### Image Behavior
- Workspace screenshots maintain whisper border at all sizes
- Hero illustrations scale proportionally
- Product screenshots use responsive images with consistent border radius
- Full-width warm white sections maintain edge-to-edge treatment`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Notion — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/notion. Every visible
        value comes from tokens.css. Notion's signature moves: warm neutral
        surfaces, NotionInter with aggressive negative letter-spacing at
        display sizes, whisper-thin borders (rgba(0,0,0,0.1)), multi-layer
        shadows with sub-0.05 opacity, Notion Blue CTAs."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #f6f5f4;
        --surface-warm: var(--surface);

        --fg:   rgba(0, 0, 0, 0.95);
        --fg-2: #31302e;
        --muted: #615d59;
        --meta:  #a39e98;

        --border:      rgba(0, 0, 0, 0.1);
        --border-soft: rgba(0, 0, 0, 0.06);

        --accent:        #0075de;
        --accent-on:     #ffffff;
        --accent-hover:  #005bab;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #1aae39;
        --warn:    #dd5b00;
        --danger:  #dc2626;

        --font-display: "NotionInter", "Inter", -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-body:    "NotionInter", "Inter", -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-mono:    ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   20px;
        --text-xl:   26px;
        --text-2xl:  40px;
        --text-3xl:  48px;
        --text-4xl:  64px;

        --leading-body:     1.5;
        --leading-tight:    1.00;
        --tracking-display: -0.033em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   4px;
        --radius-md:   8px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised:
          rgba(0, 0, 0, 0.04) 0px 4px 18px,
          rgba(0, 0, 0, 0.027) 0px 2px 7.85px,
          rgba(0, 0, 0, 0.02) 0px 0.8px 2.93px,
          rgba(0, 0, 0, 0.01) 0px 0.175px 1.04px;

        --focus-ring: 0 0 0 3px rgba(9, 127, 232, 0.3);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   12px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        font-feature-settings: "lnum", "locl";
        -webkit-font-smoothing: antialiased;
      }

      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
        --uma-preview-gutter:           var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); --uma-preview-gutter:           var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); --uma-preview-gutter:           var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ────────────────────────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 700;
        margin: 0;
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
        /* 64px display: -2.125px = -0.033em; OpenType lnum+locl. */
        font-feature-settings: "lnum", "locl";
      }
      h2 {
        font-size: var(--text-3xl);
        /* 48px section heading: line-height 1.00, tracking -1.5px (-0.031em). */
        letter-spacing: -0.031em;
        font-feature-settings: "lnum";
      }
      h3 {
        font-size: var(--text-xl);
        /* 26px sub-heading: line-height 1.23, tracking -0.625px (-0.024em).
           Overrides the shared 1.00 (--leading-tight) set above. */
        line-height: 1.23;
        letter-spacing: -0.024em;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.40;
        color: var(--muted);
        font-weight: 600;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1.33;
        cursor: pointer;
        border: 1px solid transparent;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { transform: scale(0.95); }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: transparent;
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-secondary {
        background: rgba(0, 0, 0, 0.05);
        color: var(--fg);
        border-color: transparent;
      }
      .btn-secondary:hover { background: rgba(0, 0, 0, 0.08); }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        text-decoration: underline;
        padding: 8px 4px;
      }

      /* ─── Pill badges ───────────────────────────────────────────── */
      .pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: 4px 8px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.125px;
        line-height: 1.33;
      }
      .pill-blue { background: #f2f9ff; color: #097fe8; }
      .pill-green { background: #e8faf0; color: #1aae39; }

      /* ─── Cards ─────────────────────────────────────────────────── */
      .card {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover { box-shadow: var(--elev-raised); }
      .card-warm { background: var(--surface); }

      /* ─── Inputs ────────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid #dddddd;
        border-radius: var(--radius-sm);
        padding: 6px 8px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }

      /* ─── Layout helpers ────────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>

    <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-uma-form-layout>.uma-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .uma-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- ════════════════════════════════════════════════════════════
           HERO — h1 (NotionInter 64px / -0.033em), .lead, .eyebrow,
           .btn-primary (Notion Blue), .btn-secondary, .pill-blue.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · notion</p>
            <h1>The connected workspace where better work happens.</h1>
            <p class="lead" style="max-width: 48ch">
              Notion combines notes, docs, wikis, and project management in one
              warm, approachable tool. Every value below comes from tokens.css —
              no raw hex, no off-token type.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside style="display:flex;flex-direction:column;gap:var(--space-4)">
            <div class="card card-warm" style="display:flex;flex-direction:column;gap:var(--space-3)">
              <div class="row-between">
                <span class="body-sm" style="font-weight:500">Trusted by teams at</span>
                <span class="pill pill-blue">New</span>
              </div>
              <p class="body-sm body-muted">Figma, Notion, Vercel, Linear, and 4M+ teams worldwide.</p>
              <span class="pill pill-green">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true"><circle cx="4" cy="4" r="4"/></svg>
                All systems operational
              </span>
            </div>
          </aside>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURES — h2 (48px / tight), h3 (26px / 1.23),
           .card (whisper border + multi-layer shadow hover),
           .pill-blue, warm section background.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features" style="background:var(--surface);margin-inline:calc(var(--uma-preview-gutter)*-1);padding-inline:var(--uma-preview-gutter)">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width:26ch">Every component uses only var(--*) tokens.</h2>
        </div>

        <div class="features-grid" style="margin-block-start:var(--space-6)">
          <article class="card">
            <h3>Warm neutrals</h3>
            <p class="body-muted body-sm" style="margin-top:var(--space-3)">
              --bg white, --surface #f6f5f4 (warm white). Grays carry
              yellow-brown undertones — never blue-gray. The warmth is
              imperceptible individually, defining at scale.
            </p>
            
          </article>

          <article class="card">
            <h3>Compression at scale</h3>
            <p class="body-muted body-sm" style="margin-top:var(--space-3)">
              -2.125px at 64px, -1.5px at 48px, -0.625px at 26px,
              relaxing to normal at 16px. Density at headlines,
              readability at body.
            </p>
            
          </article>

          <article class="card">
            <h3>Whisper depth</h3>
            <p class="body-muted body-sm" style="margin-top:var(--space-3)">
              1px solid rgba(0,0,0,0.1) borders. Shadows use 4 layers
              at max opacity 0.04 — depth felt rather than seen.
              Hover reveals the --elev-raised stack.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — .field (4px radius inputs), blue focus ring,
           .btn-primary, .btn-ghost, metric card with large number.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <div class="uma-form-layout">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs inherit the same token system.</h2>
            <p class="body-muted" style="max-width:44ch">
              Focus ring: 2px solid #097fe8 + shadow reinforcement.
              Border at rest: 1px solid #dddddd — standard Notion input.
              Hover and active use scale(0.95) via CSS transform.
            </p>

            <div class="card card-warm" style="max-width:320px">
              <p class="eyebrow">Teams using Notion</p>
              <p style="font-size:var(--text-2xl);font-weight:700;letter-spacing:-0.02em;line-height:1.5;margin-top:var(--space-2)">4,000,000+</p>
              <p class="body-sm body-muted">across engineering, design, and ops.</p>
            </div>
          </div>

          <div role="group" class="uma-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" />
            </div>
            <div class="field">
              <label for="name">Full name</label>
              <input id="name" type="text" placeholder="Ada Lovelace" autocomplete="name" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Get started free</button>
              <button type="button" class="btn btn-ghost">Skip for now</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=notion_default;return module.exports}});
//# sourceMappingURL=client.notion.js.map