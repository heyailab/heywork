
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.linear-app.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var linear_app_default={"contract":`## 1. Visual Theme & Atmosphere

Linear's website is a masterclass in dark-mode-first product design — a near-black canvas (\`#08090a\`) where content emerges from darkness like starlight. The overall impression is one of extreme precision engineering: every element exists in a carefully calibrated hierarchy of luminance, from barely-visible borders (\`rgba(255,255,255,0.05)\`) to soft, luminous text (\`#f7f8f8\`). This is not a dark theme applied to a light design — it is darkness as the native medium, where information density is managed through subtle gradations of white opacity rather than color variation.

The typography system is built entirely on Inter Variable with OpenType features \`"cv01"\` and \`"ss03"\` enabled globally, giving the typeface a cleaner, more geometric character. Inter is used at a remarkable range of weights — from 300 (light body) through 510 (medium, Linear's signature weight) to 590 (semibold emphasis). The 510 weight is particularly distinctive: it sits between regular and medium, creating a subtle emphasis that doesn't shout. At display sizes (72px, 64px, 48px), Inter uses aggressive negative letter-spacing (-1.584px to -1.056px), creating compressed, authoritative headlines that feel engineered rather than designed. Berkeley Mono serves as the monospace companion for code and technical labels, with fallbacks to ui-monospace, SF Mono, and Menlo.

The color system is almost entirely achromatic — dark backgrounds with white/gray text — punctuated by a single brand accent: Linear's signature indigo-violet (\`#5e6ad2\` for backgrounds, \`#7170ff\` for interactive accents). This accent color is used sparingly and intentionally, appearing only on CTAs, active states, and brand elements. The border system uses ultra-thin, semi-transparent white borders (\`rgba(255,255,255,0.05)\` to \`rgba(255,255,255,0.08)\`) that create structure without visual noise, like wireframes drawn in moonlight.

**Key Characteristics:**
- Dark-mode-native: \`#08090a\` marketing background, \`#0f1011\` panel background, \`#191a1b\` elevated surfaces
- Inter Variable with \`"cv01", "ss03"\` globally — geometric alternates for a cleaner aesthetic
- Signature weight 510 (between regular and medium) for most UI text
- Aggressive negative letter-spacing at display sizes (-1.584px at 72px, -1.056px at 48px)
- Brand indigo-violet: \`#5e6ad2\` (bg) / \`#7170ff\` (accent) / \`#828fff\` (hover) — the only chromatic color in the system
- Semi-transparent white borders throughout: \`rgba(255,255,255,0.05)\` to \`rgba(255,255,255,0.08)\`
- Button backgrounds at near-zero opacity: \`rgba(255,255,255,0.02)\` to \`rgba(255,255,255,0.05)\`
- Multi-layered shadows with inset variants for depth on dark surfaces
- Radix UI primitives as the component foundation (6 detected primitives)
- Success green (\`#27a644\`, \`#10b981\`) used only for status indicators

## 4. Component Stylings

### Buttons

**Ghost Button (Default)**
- Background: \`rgba(255,255,255,0.02)\`
- Text: \`#e2e4e7\` (near-white)
- Padding: comfortable
- Radius: 6px
- Border: \`1px solid rgb(36, 40, 44)\`
- Outline: none
- Focus shadow: \`rgba(0,0,0,0.1) 0px 4px 12px\`
- Use: Standard actions, secondary CTAs

**Subtle Button**
- Background: \`rgba(255,255,255,0.04)\`
- Text: \`#d0d6e0\` (silver-gray)
- Padding: 0px 6px
- Radius: 6px
- Use: Toolbar actions, contextual buttons

**Primary Brand Button (Inferred)**
- Background: \`#5e6ad2\` (brand indigo)
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 6px
- Hover: \`#828fff\` shift
- Use: Primary CTAs ("Start building", "Sign up")

**Icon Button (Circle)**
- Background: \`rgba(255,255,255,0.03)\` or \`rgba(255,255,255,0.05)\`
- Text: \`#f7f8f8\` or \`#ffffff\`
- Radius: 50%
- Border: \`1px solid rgba(255,255,255,0.08)\`
- Use: Close, menu toggle, icon-only actions

**Pill Button**
- Background: transparent
- Text: \`#d0d6e0\`
- Padding: 0px 10px 0px 5px
- Radius: 9999px
- Border: \`1px solid rgb(35, 37, 42)\`
- Use: Filter chips, tags, status indicators

**Small Toolbar Button**
- Background: \`rgba(255,255,255,0.05)\`
- Text: \`#62666d\` (muted)
- Radius: 2px
- Border: \`1px solid rgba(255,255,255,0.05)\`
- Shadow: \`rgba(0,0,0,0.03) 0px 1.2px 0px 0px\`
- Font: 12px weight 510
- Use: Toolbar actions, quick-access controls

### Cards & Containers
- Background: \`rgba(255,255,255,0.02)\` to \`rgba(255,255,255,0.05)\` (never solid — always translucent)
- Border: \`1px solid rgba(255,255,255,0.08)\` (standard) or \`1px solid rgba(255,255,255,0.05)\` (subtle)
- Radius: 8px (standard), 12px (featured), 22px (large panels)
- Shadow: \`rgba(0,0,0,0.2) 0px 0px 0px 1px\` or layered multi-shadow stacks
- Hover: subtle background opacity increase

### Inputs & Forms

**Text Area**
- Background: \`rgba(255,255,255,0.02)\`
- Text: \`#d0d6e0\`
- Border: \`1px solid rgba(255,255,255,0.08)\`
- Padding: 12px 14px
- Radius: 6px

**Search Input**
- Background: transparent
- Text: \`#f7f8f8\`
- Padding: 1px 32px (icon-aware)

**Button-style Input**
- Text: \`#8a8f98\`
- Padding: 1px 6px
- Radius: 5px
- Focus shadow: multi-layer stack

### Badges & Pills

**Success Pill**
- Background: \`#10b981\`
- Text: \`#f7f8f8\`
- Radius: 50% (circular)
- Font: 10px weight 510
- Use: Status dots, completion indicators

**Neutral Pill**
- Background: transparent
- Text: \`#d0d6e0\`
- Padding: 0px 10px 0px 5px
- Radius: 9999px
- Border: \`1px solid rgb(35, 37, 42)\`
- Font: 12px weight 510
- Use: Tags, filter chips, category labels

**Subtle Badge**
- Background: \`rgba(255,255,255,0.05)\`
- Text: \`#f7f8f8\`
- Padding: 0px 8px 0px 2px
- Radius: 2px
- Border: \`1px solid rgba(255,255,255,0.05)\`
- Font: 10px weight 510
- Use: Inline labels, version tags

### Navigation
- Dark sticky header on near-black background
- Linear logomark left-aligned (SVG icon)
- Links: Inter Variable 13–14px weight 510, \`#d0d6e0\` text
- Active/hover: text lightens to \`#f7f8f8\`
- CTA: Brand indigo button or ghost button
- Mobile: hamburger collapse
- Search: command palette trigger (\`/\` or \`Cmd+K\`)

### Image Treatment
- Product screenshots on dark backgrounds with subtle border (\`rgba(255,255,255,0.08)\`)
- Top-rounded images: \`12px 12px 0px 0px\` radius
- Dashboard/issue previews dominate feature sections
- Subtle shadow beneath screenshots: \`rgba(0,0,0,0.4) 0px 2px 4px\`

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 7px, 8px, 11px, 12px, 16px, 19px, 20px, 22px, 24px, 28px, 32px, 35px
- The 7px and 11px values suggest micro-adjustments for optical alignment
- Primary rhythm: 8px, 16px, 24px, 32px (standard 8px grid)

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with generous vertical padding
- Feature sections: 2–3 column grids for feature cards
- Full-width dark sections with internal max-width constraints
- Changelog: single-column timeline layout

### Whitespace Philosophy
- **Darkness as space**: On Linear's dark canvas, empty space isn't white — it's absence. The near-black background IS the whitespace, and content emerges from it.
- **Compressed headlines, expanded surroundings**: Display text at 72px with -1.584px tracking is dense and compressed, but sits within vast dark padding. The contrast between typographic density and spatial generosity creates tension.
- **Section isolation**: Each feature section is separated by generous vertical padding (80px+) with no visible dividers — the dark background provides natural separation.

### Border Radius Scale
- Micro (2px): Inline badges, toolbar buttons, subtle tags
- Standard (4px): Small containers, list items
- Comfortable (6px): Buttons, inputs, functional elements
- Card (8px): Cards, dropdowns, popovers
- Panel (12px): Panels, featured cards, section containers
- Large (22px): Large panel elements
- Full Pill (9999px): Chips, filter pills, status tags
- Circle (50%): Icon buttons, avatars, status dots

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, \`#010102\` bg | Page background, deepest canvas |
| Subtle (Level 1) | \`rgba(0,0,0,0.03) 0px 1.2px 0px\` | Toolbar buttons, micro-elevation |
| Surface (Level 2) | \`rgba(255,255,255,0.05)\` bg + \`1px solid rgba(255,255,255,0.08)\` border | Cards, input fields, containers |
| Inset (Level 2b) | \`rgba(0,0,0,0.2) 0px 0px 12px 0px inset\` | Recessed panels, inner shadows |
| Ring (Level 3) | \`rgba(0,0,0,0.2) 0px 0px 0px 1px\` | Border-as-shadow technique |
| Elevated (Level 4) | \`rgba(0,0,0,0.4) 0px 2px 4px\` | Floating elements, dropdowns |
| Dialog (Level 5) | Multi-layer stack: \`rgba(0,0,0,0) 0px 8px 2px, rgba(0,0,0,0.01) 0px 5px 2px, rgba(0,0,0,0.04) 0px 3px 2px, rgba(0,0,0,0.07) 0px 1px 1px, rgba(0,0,0,0.08) 0px 0px 1px\` | Popovers, command palette, modals |
| Focus | \`rgba(0,0,0,0.1) 0px 4px 12px\` + additional layers | Keyboard focus on interactive elements |

**Shadow Philosophy**: On dark surfaces, traditional shadows (dark on dark) are nearly invisible. Linear solves this by using semi-transparent white borders as the primary depth indicator. Elevation isn't communicated through shadow darkness but through background luminance steps — each level slightly increases the white opacity of the surface background (\`0.02\` → \`0.04\` → \`0.05\`), creating a subtle stacking effect. The inset shadow technique (\`rgba(0,0,0,0.2) 0px 0px 12px 0px inset\`) creates a unique "sunken" effect for recessed panels, adding dimensional depth that traditional dark themes lack.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <600px | Single column, compact padding |
| Mobile | 600–640px | Standard mobile layout |
| Tablet | 640–768px | Two-column grids begin |
| Desktop Small | 768–1024px | Full card grids, expanded padding |
| Desktop | 1024–1280px | Standard desktop, full navigation |
| Large Desktop | >1280px | Full layout, generous margins |

### Touch Targets
- Buttons use comfortable padding with 6px radius minimum
- Navigation links at 13–14px with adequate spacing
- Pill tags have 10px horizontal padding for touch accessibility
- Icon buttons at 50% radius ensure circular, easy-to-tap targets
- Search trigger is prominently placed with generous hit area

### Collapsing Strategy
- Hero: 72px → 48px → 32px display text, tracking adjusts proportionally
- Navigation: horizontal links + CTAs → hamburger menu at 768px
- Feature cards: 3-column → 2-column → single column stacked
- Product screenshots: maintain aspect ratio, may reduce padding
- Changelog: timeline maintains single-column through all sizes
- Footer: multi-column → stacked single column
- Section spacing: 80px+ → 48px on mobile

### Image Behavior
- Dashboard screenshots maintain border treatment at all sizes
- Hero visuals simplify on mobile (fewer floating UI elements)
- Product screenshots use responsive sizing with consistent radius
- Dark background ensures screenshots blend naturally at any viewport`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Linear — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/linear-app. Every visible
        value comes from tokens.css. Linear's signature moves: near-black
        canvas, Inter Variable with cv01+ss03, weight-510 emphasis, indigo
        accent, semi-transparent white borders, luminance stepping for depth."
    />

    <style>
      :root {
        --bg:           #08090a;
        --surface:      #191a1b;
        --surface-warm: var(--surface);

        --fg:   #f7f8f8;
        --fg-2: #d0d6e0;
        --muted: #8a8f98;
        --meta:  #62666d;

        --border:      rgba(255, 255, 255, 0.08);
        --border-soft: rgba(255, 255, 255, 0.05);

        --accent:        #5e6ad2;
        --accent-on:     #ffffff;
        --accent-hover:  #828fff;
        --accent-active: #4752c4;

        --success: #27a644;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "Inter Variable", "Inter", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
        --font-body:    "Inter Variable", "Inter", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
        --font-mono:    "Berkeley Mono", ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   24px;
        --text-2xl:  32px;
        --text-3xl:  48px;
        --text-4xl:  72px;

        --leading-body:     1.5;
        --leading-tight:    1.00;
        --tracking-display: -0.022em;

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

        --radius-sm:   6px;
        --radius-md:   8px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised:
          rgba(0, 0, 0, 0.4) 0px 2px 4px,
          0 0 0 1px rgba(255, 255, 255, 0.05);

        --focus-ring: 0 0 0 2px color-mix(in oklab, var(--accent), transparent 30%), 0 4px 12px rgba(0, 0, 0, 0.1);

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
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        /* Linear's signature: cv01 (alternate 'a') + ss03 (geometric alternates). */
        font-feature-settings: "cv01", "ss03";
        -webkit-font-smoothing: antialiased;
      }

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

      /* ─── Typography ────────────────────────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 510;              /* Linear's signature between-weight */
        margin: 0;
        color: var(--fg);
        font-feature-settings: "cv01", "ss03";
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-2xl);
        /* 32px heading 1: line-height 1.13, tracking -0.704px (-0.022em). */
        line-height: 1.13;
        letter-spacing: -0.022em;
      }
      h3 {
        font-size: var(--text-xl);
        /* 24px heading 2: line-height 1.33, tracking -0.288px (-0.012em).
           Overrides the shared 1.00 set on h1/h2/h3 above. */
        line-height: 1.33;
        letter-spacing: -0.012em;
        font-weight: 590;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.60;
        color: var(--muted);
        font-weight: 400;
        letter-spacing: -0.009em;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); color: var(--muted); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 510;
        color: var(--meta);
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
        font-weight: 510;
        font-feature-settings: "cv01", "ss03";
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-ghost {
        background: rgba(255, 255, 255, 0.02);
        color: #e2e4e7;
        border-color: rgba(36, 40, 44, 1);
      }
      .btn-ghost:hover { background: rgba(255, 255, 255, 0.05); }

      /* ─── Pill badges ───────────────────────────────────────────── */
      .pill {
        display: inline-flex;
        align-items: center;
        padding: 0 10px 0 5px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 510;
        color: var(--fg-2);
        border: 1px solid #23252a;
        line-height: 1.8;
      }

      /* ─── Cards ─────────────────────────────────────────────────── */
      .card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        transition: background-color var(--motion-base) var(--ease-standard);
      }
      .card:hover { background: rgba(255, 255, 255, 0.04); }

      /* ─── Inputs ────────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 510;
        color: var(--fg-2);
        font-feature-settings: "cv01", "ss03";
      }
      .field input {
        background: rgba(255, 255, 255, 0.02);
        color: var(--fg-2);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-feature-settings: "cv01", "ss03";
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus { border-color: var(--accent); }

      /* ─── Layout ────────────────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); }
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
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · linear</p>
            <h1>Built for the next era of product development.</h1>
            <p class="lead" style="max-width:50ch">
              Linear streamlines software projects, sprints, tasks, and bug
              tracking. Precision engineered — from the 510 between-weight to
              the semi-transparent white borders. Every value from tokens.css.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside style="display:flex;flex-direction:column;gap:var(--space-4)">
            <div class="card">
              <p class="eyebrow" style="margin-bottom:var(--space-3)">Issue tracker</p>
              <div style="display:flex;flex-direction:column;gap:var(--space-2)">
                <div style="display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-sm);color:var(--fg-2)">
                  <span style="width:8px;height:8px;border-radius:50%;background:#27a644;flex-shrink:0"></span>
                  Fix token channel drift in derive script
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-sm);color:var(--muted)">
                  <span style="width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0"></span>
                  Add 10 brand oracle fixtures
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-sm);color:var(--meta)">
                  <span style="width:8px;height:8px;border-radius:2px;background:rgba(255,255,255,0.1);flex-shrink:0"></span>
                  Ship PR-B derive script
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width:28ch">Darkness as the native medium.</h2>
        </div>

        <div class="features-grid" style="margin-block-start:var(--space-6)">
          <article class="card stack-3">
            <h3>Dark-first</h3>
            <p class="body-sm">
              #08090a marketing black → #191a1b elevated surface. Luminance
              stepping, not color: each level increases white opacity by 0.02.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Weight 510</h3>
            <p class="body-sm">
              Inter Variable's between-weight. Not 500, not 600 — precisely 510.
              cv01+ss03 on all text transforms generic Inter into Linear's face.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Indigo accent</h3>
            <p class="body-sm">
              #5e6ad2 for CTA backgrounds; #7170ff for interactive; #828fff
              on hover. The only chromatic color in an otherwise achromatic system.
            </p>
          </article>
        </div>

        <div style="margin-block-start:var(--space-6);display:flex;gap:var(--space-2);flex-wrap:wrap">
          <span class="pill">All issues</span>
          <span class="pill">Active</span>
          <span class="pill">Backlog</span>
          <span class="pill">Done</span>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="uma-form-layout">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs on dark surfaces.</h2>
            <p class="lead" style="max-width:44ch">
              rgba(255,255,255,0.02) background, border: 1px solid rgba(255,255,255,0.08).
              Focus shifts border to --accent; no halo, no blue ring.
            </p>
          </div>
          <div role="group" class="uma-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Sign up</button>
              <button type="button" class="btn btn-ghost">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=linear_app_default;return module.exports}});
//# sourceMappingURL=client.linear-app.js.map