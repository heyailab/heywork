
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.lovable.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var lovable_default={"contract":`## 1. Visual Theme & Atmosphere

Lovable's website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (\`#f7f4ed\`) that immediately separates it from the cold-white conventions of most developer tool sites. This isn't minimalism for minimalism's sake — it's a deliberate choice to feel approachable, almost analog, like a well-crafted notebook. The near-black text (\`#1c1c1c\`) against this warm cream creates a contrast ratio that's easy on the eyes while maintaining sharp readability.

The custom Camera Plain Variable typeface is the system's secret weapon. Unlike geometric sans-serifs that signal "tech company," Camera Plain has a humanist warmth — slightly rounded terminals, organic curves, and a comfortable reading rhythm. At display sizes (48px–60px), weight 600 with aggressive negative letter-spacing (-0.9px to -1.5px) compresses headlines into confident, editorial statements. The font uses \`ui-sans-serif, system-ui\` as fallbacks, acknowledging that the custom typeface carries the brand personality.

What makes Lovable's visual system distinctive is its opacity-driven depth model. Rather than using a traditional gray scale, the system modulates \`#1c1c1c\` at varying opacities (0.03, 0.04, 0.4, 0.82–0.83) to create a unified tonal range. Every shade of gray on the page is technically the same hue — just more or less transparent. This creates a visual coherence that's nearly impossible to achieve with arbitrary hex values. The border system follows suit: \`1px solid #eceae4\` for light divisions and \`1px solid rgba(28, 28, 28, 0.4)\` for stronger interactive boundaries.

**Key Characteristics:**
- Warm parchment background (\`#f7f4ed\`) — not white, not beige, a deliberate cream that feels hand-selected
- Camera Plain Variable typeface with humanist warmth and editorial letter-spacing at display sizes
- Opacity-driven color system: all grays derived from \`#1c1c1c\` at varying transparency levels
- Inset shadow technique on buttons: \`rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset\`
- Warm neutral border palette: \`#eceae4\` for subtle, \`rgba(28,28,28,0.4)\` for interactive elements
- Full-pill radius (\`9999px\`) used extensively for action buttons and icon containers
- Focus state uses \`rgba(0,0,0,0.1) 0px 4px 12px\` shadow for soft, warm emphasis
- shadcn/ui + Radix UI component primitives with Tailwind CSS utility styling

## 4. Component Stylings

### Buttons

**Primary Dark (Inset Shadow)**
- Background: \`#1c1c1c\`
- Text: \`#fcfbf8\`
- Padding: 8px 16px
- Radius: 6px
- Shadow: \`rgba(0,0,0,0) 0px 0px 0px 0px, rgba(0,0,0,0) 0px 0px 0px 0px, rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px\`
- Active: opacity 0.8
- Focus: \`rgba(0,0,0,0.1) 0px 4px 12px\` shadow
- Use: Primary CTA ("Start Building", "Get Started")

**Ghost / Outline**
- Background: transparent
- Text: \`#1c1c1c\`
- Padding: 8px 16px
- Radius: 6px
- Border: \`1px solid rgba(28,28,28,0.4)\`
- Active: opacity 0.8
- Focus: \`rgba(0,0,0,0.1) 0px 4px 12px\` shadow
- Use: Secondary actions ("Log In", "Documentation")

**Cream Surface**
- Background: \`#f7f4ed\`
- Text: \`#1c1c1c\`
- Padding: 8px 16px
- Radius: 6px
- No border
- Active: opacity 0.8
- Use: Tertiary actions, toolbar buttons

**Pill / Icon Button**
- Background: \`#f7f4ed\`
- Text: \`#1c1c1c\`
- Radius: 9999px (full pill)
- Shadow: same inset pattern as primary dark
- Opacity: 0.5 (default), 0.8 (active)
- Use: Additional actions, plan mode toggle, voice recording

### Cards & Containers
- Background: \`#f7f4ed\` (matches page)
- Border: \`1px solid #eceae4\`
- Radius: 12px (standard), 16px (featured), 8px (compact)
- No box-shadow by default — borders define boundaries
- Image cards: \`1px solid #eceae4\` with 12px radius

### Inputs & Forms
- Background: \`#f7f4ed\`
- Text: \`#1c1c1c\`
- Border: \`1px solid #eceae4\`
- Radius: 6px
- Focus: ring blue (\`rgba(59,130,246,0.5)\`) outline
- Placeholder: \`#5f5f5d\`

### Navigation
- Clean horizontal nav on cream background, fixed
- Logo/wordmark left-aligned (128.75 x 22px)
- Links: Camera Plain 14–16px weight 400, \`#1c1c1c\` text
- CTA: dark button with inset shadow, 6px radius
- Mobile: hamburger menu with 6px radius button
- Subtle border or no border on scroll

### Links
- Color: \`#1c1c1c\`
- Decoration: underline (default)
- Hover: primary accent (via CSS variable \`hsl(var(--primary))\`)
- No color change on hover — decoration carries the interactive signal

### Image Treatment
- Showcase/portfolio images with \`1px solid #eceae4\` border
- Consistent 12px border radius on all image containers
- Soft gradient backgrounds behind hero content (warm multi-color wash)
- Gallery-style presentation for template/project showcases

### Distinctive Components

**AI Chat Input**
- Large prompt input area with soft borders
- Suggestion pills with \`#eceae4\` borders
- Voice recording / plan mode toggle buttons as pill shapes (9999px)
- Warm, inviting input area — not clinical

**Template Gallery**
- Card grid showing project templates
- Each card: image + title, \`1px solid #eceae4\` border, 12px radius
- Hover: subtle shadow or border darkening
- Category labels as text links

**Stats Bar**
- Large metrics: "0M+" pattern in 48px+ weight 600
- Descriptive text below in muted gray
- Horizontal layout with generous spacing

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 8px, 10px, 12px, 16px, 24px, 32px, 40px, 56px, 80px, 96px, 128px, 176px, 192px, 208px
- The scale expands generously at the top end — sections use 80px–208px vertical spacing for editorial breathing room

### Grid & Container
- Max content width: approximately 1200px (centered)
- Hero: centered single-column with massive vertical padding (96px+)
- Feature sections: 2–3 column grids
- Full-width footer with multi-column link layout
- Showcase sections with centered card grids

### Whitespace Philosophy
- **Editorial generosity**: Lovable's spacing is lavish at section boundaries (80px–208px). The warm cream background makes these expanses feel cozy rather than empty.
- **Content-driven rhythm**: Tight internal spacing within cards (12–24px) contrasts with wide section gaps, creating a reading rhythm that alternates between focused content and visual rest.
- **Section separation**: Footer uses \`1px solid #eceae4\` border and 16px radius container. Sections defined by generous spacing rather than border lines.

### Border Radius Scale
- Micro (4px): Small buttons, interactive elements
- Standard (6px): Buttons, inputs, navigation menu
- Comfortable (8px): Compact cards, divs
- Card (12px): Standard cards, image containers, templates
- Container (16px): Large containers, footer sections
- Full Pill (9999px): Action pills, icon buttons, toggles

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, cream background | Page surface, most content |
| Bordered (Level 1) | \`1px solid #eceae4\` | Cards, images, dividers |
| Inset (Level 2) | \`rgba(255,255,255,0.2) 0px 0.5px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px\` | Dark buttons, primary actions |
| Focus (Level 3) | \`rgba(0,0,0,0.1) 0px 4px 12px\` | Active/focus states |
| Ring (Accessibility) | \`rgba(59,130,246,0.5)\` 2px ring | Keyboard focus on inputs |

**Shadow Philosophy**: Lovable's depth system is intentionally shallow. Instead of floating cards with dramatic drop-shadows, the system relies on warm borders (\`#eceae4\`) against the cream surface to create gentle containment. The only notable shadow pattern is the inset shadow on dark buttons — a subtle multi-layer technique where a white highlight line sits at the top edge while a dark ring and soft drop handle the bottom. This creates a tactile, pressed-into-surface feeling rather than a hovering-above-surface feeling. The warm focus shadow (\`rgba(0,0,0,0.1) 0px 4px 12px\`) is deliberately diffused and large, creating a soft glow rather than a sharp outline.

### Decorative Depth
- Hero: soft, warm multi-color gradient wash (pinks, oranges, blues) behind hero — atmospheric, barely visible
- Footer: gradient background with warm tones transitioning to the bottom
- No harsh section dividers — spacing and background warmth handle transitions

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <600px | Tight single column, reduced padding |
| Mobile | 600–640px | Standard mobile layout |
| Tablet Small | 640–700px | 2-column grids begin |
| Tablet | 700–768px | Card grids expand |
| Desktop Small | 768–1024px | Multi-column layouts |
| Desktop | 1024–1280px | Full feature layout |
| Large Desktop | 1280–1536px | Maximum content width, generous margins |

### Touch Targets
- Buttons: 8px 16px padding (comfortable touch)
- Navigation: adequate spacing between items
- Pill buttons: 9999px radius creates large tap-friendly targets
- Menu toggle: 6px radius button with adequate sizing

### Collapsing Strategy
- Hero: 60px → 48px → 36px headline scaling with proportional letter-spacing
- Navigation: horizontal links → hamburger menu at 768px
- Feature cards: 3-column → 2-column → single column stacked
- Template gallery: grid → stacked vertical cards
- Stats bar: horizontal → stacked vertical
- Footer: multi-column → stacked single column
- Section spacing: 128px+ → 64px on mobile

### Image Behavior
- Template screenshots maintain \`1px solid #eceae4\` border at all sizes
- 12px border radius preserved across breakpoints
- Gallery images responsive with consistent aspect ratios
- Hero gradient softens/simplifies on mobile`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lovable — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/lovable. Warm parchment canvas
        (#f7f4ed), opacity-driven gray ramp from charcoal #1c1c1c, Camera Plain
        Variable display type with -1.5px tracking, borders-not-shadows for cards,
        the signature inset-shadow on dark CTAs."
    />

    <style>
      :root {
        --bg: #f7f4ed;
        --surface: #f7f4ed;
        --surface-warm: var(--surface);

        --fg: #1c1c1c;
        --fg-2: rgba(28, 28, 28, 0.83);
        --muted: #5f5f5d;
        --meta: rgba(28, 28, 28, 0.4);

        --border: #eceae4;
        --border-soft: var(--border);

        --accent: #ff4d8d;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Camera Plain Variable", "Camera Plain", ui-sans-serif, system-ui, sans-serif;
        --font-body: "Camera Plain Variable", "Camera Plain", ui-sans-serif, system-ui, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 20px;
        --text-2xl: 36px;
        --text-3xl: 48px;
        --text-4xl: 60px;

        --leading-body: 1.5;
        --leading-tight: 1.10;
        --tracking-display: -0.025em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 128px;
        --section-y-tablet: 80px;
        --section-y-phone: 64px;

        --radius-sm: 6px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 4px 12px rgba(0, 0, 0, 0.1);

        --focus-ring: 0 0 0 2px rgba(59, 130, 246, 0.5);

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

      /* ─── Typography — Camera Plain Variable carries the personality ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 600;
        letter-spacing: var(--tracking-display);   /* -1.5px @ 60px */
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 600;
        letter-spacing: -0.02em;                    /* -1.2px @ 48px (DESIGN.md §3) */
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 400;                           /* card titles stay 400 */
        letter-spacing: normal;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: 1.38;                          /* DESIGN.md §3 Body Large */
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-sm);
        color: var(--muted);
        font-weight: 400;
        letter-spacing: normal;                     /* Lovable does NOT track up labels */
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — inset-shadow CTA, ghost outline, pill action ─ */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px var(--space-4);                /* DESIGN.md §4: 8px 16px */
        border-radius: var(--radius-sm);            /* 6px — functional radius */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;                           /* DESIGN.md §3: buttons 400 */
        line-height: 1.5;
        cursor: pointer;
        border: 0;
        text-decoration: none;
        transition: opacity var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard),
                    background-color var(--motion-fast) var(--ease-standard);
      }
      .btn:active { opacity: 0.8; }                 /* DESIGN.md §4 active feedback */
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Primary Dark — the signature inset-shadow CTA from DESIGN.md §4 */
      .btn-primary {
        background: var(--fg);
        color: #fcfbf8;                             /* off-white per DESIGN.md §2 */
        box-shadow:
          inset 0 0.5px 0 rgba(255, 255, 255, 0.2),
          inset 0 0 0 0.5px rgba(0, 0, 0, 0.2),
          0 1px 2px rgba(0, 0, 0, 0.05);
      }
      .btn-primary:hover {
        box-shadow:
          inset 0 0.5px 0 rgba(255, 255, 255, 0.2),
          inset 0 0 0 0.5px rgba(0, 0, 0, 0.2),
          0 4px 12px rgba(0, 0, 0, 0.1);            /* the warm focus shadow */
      }

      /* Ghost / Outline — DESIGN.md §4 secondary actions */
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border: 1px solid var(--meta);              /* charcoal-40% interactive border */
      }
      .btn-ghost:hover {
        background: rgba(28, 28, 28, 0.04);         /* charcoal-4% subtle hover */
      }

      /* ─── Inputs — warm cream surface, soft cream border ─────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 400; }
      .field input,
      .field textarea {
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-sm);            /* 6px — DESIGN.md §4 inputs */
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        outline: none;
        transition: box-shadow var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        resize: vertical;
      }
      .field input::placeholder,
      .field textarea::placeholder { color: var(--muted); }
      .field input:focus-visible,
      .field textarea:focus-visible {
        box-shadow: var(--focus-ring);              /* 2px ring blue, accessibility */
      }
      .field-help { font-size: var(--text-sm); color: var(--muted); }

      /* ─── Cards — borders define edges, NOT shadows ──────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);            /* 12px — DESIGN.md §4 cards */
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-flat);               /* explicit: no shadow on cards */
        transition: border-color var(--motion-base) var(--ease-standard);
      }
      .card:hover { border-color: rgba(28, 28, 28, 0.12); }  /* subtle darken on hover */

      /* ─── Pills & badges — action pill (9999px) per §4 ────────── */
      .pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 6px var(--space-3);
        border-radius: var(--radius-pill);
        background: var(--surface);
        color: var(--fg);
        border: 1px solid var(--border);
        font-size: var(--text-sm);
        font-weight: 400;
        line-height: 1;
      }
      .pill-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: var(--accent);                  /* the brand pink, used sparingly */
      }

      /* ─── Links — underline carries the signal, NOT color ────── */
      a {
        color: var(--fg);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }
      a:hover { color: var(--accent); }             /* primary accent per §4 */

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
        padding: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 460px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); flex-wrap: wrap; }
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
            <p class="eyebrow">Reference fixture · lovable</p>
            <h1>Describe your app.<br />Lovable builds it.</h1>
            <p class="lead" style="max-width: 52ch">
              Type a sentence in plain language and watch your idea become a working
              web app — no setup, no boilerplate, just a preview that updates as you
              tinker. Built warm, on cream, never on cold white.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Build status">
            <div class="row-between">
              <span class="body-sm">Preview</span>
              <span class="pill">
                <span class="pill-dot" aria-hidden="true"></span>
                Live
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">
              Last revised <time datetime="2026-05-15">2026-05-15</time> · v1.0
            </p>
            <p class="body-sm" style="color: var(--muted)">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to open the prompt.
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Warmth as a system, not a coat of paint.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Cream-on-cream depth</h3>
            <p class="body-muted body-sm">
              --bg and --surface are the same warm parchment (#f7f4ed). The 1px
              #eceae4 border carries the containment — Lovable's depth model is
              borders, never drop-shadows on cards.
            </p>
            
          </article>
          <article class="card">
            <h3>Camera Plain humanism</h3>
            <p class="body-muted body-sm">
              Display type runs at 60px / weight 600 / -1.5px tracking. The
              variable axis lets weight 480 sit between regular and semibold
              for editorial moments. Body stays at 400, normal tracking.
            </p>
            
          </article>
          <article class="card">
            <h3>Inset, not lifted</h3>
            <p class="body-muted body-sm">
              Dark CTAs press into the cream with a multi-layer inset shadow:
              white highlight at 0.5px, dark ring at 0.5px, soft drop at 1px.
              The button feels pressed-into-paper, not floated above it.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Try it</p>
            <h2>Start with a sentence.</h2>
            <p class="body-muted" style="max-width: 48ch">
              The whole product begins from one prompt — the input below uses the
              same warm cream surface, the same #eceae4 border, the same Tailwind
              ring blue at 50% for keyboard focus. Form is page is craft.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="prompt">What do you want to build?</label>
              <textarea
                id="prompt"
                rows="3"
                placeholder="A todo app that syncs with my calendar and reminds me on my watch."
                required
              ></textarea>
              <p class="field-help">Plain language is fine — Lovable handles the scaffolding.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Build my app</button>
              <button type="button" class="btn btn-ghost">See examples</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=lovable_default;return module.exports}});
//# sourceMappingURL=client.lovable.js.map