
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.expo.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var expo_default={"contract":`## 1. Visual Theme & Atmosphere

Expo's interface is a luminous, confidence-radiating developer platform built on the premise that tools for building apps should feel as polished as the apps themselves. The entire experience lives on a bright, airy canvas — a cool-tinted off-white (\`#f0f0f3\`) that gives the page a subtle technological coolness without the starkness of pure white. This is a site that breathes: enormous vertical spacing between sections creates a gallery-like pace where each feature gets its own "room."

The design language is decisively monochromatic — pure black (\`#000000\`) headlines against the lightest possible backgrounds, with a spectrum of cool blue-grays (\`#60646c\`, \`#b0b4ba\`, \`#555860\`) handling all secondary communication. Color is almost entirely absent from the interface itself; when it appears, it's reserved for product screenshots, app icons, and the React universe illustration — making the actual content burst with life against the neutral canvas.

What makes Expo distinctive is its pill-shaped geometry. Buttons, tabs, video containers, and even images use generously rounded or fully pill-shaped corners (24px–9999px), creating an organic, approachable feel that contradicts the typical sharp-edged developer tool aesthetic. Combined with tight letter-spacing on massive headlines (-1.6px to -3px at 64px), the result is a design that's simultaneously premium and friendly — like an Apple product page reimagined for developers.

**Key Characteristics:**
- Luminous cool-white canvas (\`#f0f0f3\`) with gallery-like vertical spacing
- Strictly monochromatic: pure black headlines, cool blue-gray body text, no decorative color
- Pill-shaped geometry everywhere — buttons, tabs, containers, images (24px–9999px radius)
- Massive display headlines (64px) with extreme negative letter-spacing (-1.6px to -3px)
- Inter as the sole typeface, used at weights 400–900 for full expressive range
- Whisper-soft shadows that barely lift elements from the surface
- Product screenshots as the only source of color in the interface

## 4. Component Stylings

### Buttons

**Primary (White on border)**
- Background: Pure White (\`#ffffff\`)
- Text: Near Black (\`#1c2024\`)
- Padding: 0px 12px (compact, content-driven height)
- Border: thin solid Input Border (\`1px solid #d9d9e0\`)
- Radius: subtly rounded (6px)
- Shadow: subtle combined shadow on hover
- The understated default — clean, professional, unheroic

**Primary Pill**
- Same as Primary but with pill-shaped radius (9999px)
- Used for hero CTAs and high-emphasis actions
- The extra roundness signals "start here"

**Dark Primary**
- Background: Expo Black (\`#000000\`)
- Text: Pure White (\`#ffffff\`)
- Pill-shaped (9999px) or generously rounded (32–36px)
- No border (black IS the border)
- The maximum-emphasis CTA — reserved for primary conversion actions

### Cards & Containers
- Background: Pure White (\`#ffffff\`) — clearly lifted from Cloud Gray page
- Border: thin solid Border Lavender (\`1px solid #e0e1e6\`) for standard cards
- Radius: comfortably rounded (8px) for standard cards; generously rounded (16–24px) for featured containers
- Shadow Level 1: Whisper (\`rgba(0,0,0,0.08) 0px 3px 6px, rgba(0,0,0,0.07) 0px 2px 4px\`) — barely perceptible lift
- Shadow Level 2: Standard (\`rgba(0,0,0,0.1) 0px 10px 20px, rgba(0,0,0,0.05) 0px 3px 6px\`) — clear floating elevation
- Hover: likely subtle shadow deepening or background shift

### Inputs & Forms
- Background: Pure White (\`#ffffff\`)
- Text: Near Black (\`#1c2024\`)
- Border: thin solid Input Border (\`1px solid #d9d9e0\`)
- Padding: 0px 12px (inline with button sizing)
- Radius: subtly rounded (6px)
- Focus: blue ring shadow via CSS custom property

### Navigation
- Sticky top nav on transparent/blurred background
- Logo: Expo wordmark in black
- Links: Near Black (\`#1c2024\`) or Slate Gray (\`#60646c\`) at 14–16px Inter weight 500
- CTA: Black pill button ("Sign Up") on the right
- GitHub star badge as social proof
- Status indicator ("All Systems Operational") with green dot

### Image Treatment
- Product screenshots and device mockups are the visual heroes
- Generously rounded corners (24px) on video and image containers
- Screenshots shown in realistic device frames
- Dark UI screenshots provide contrast against the light canvas
- Full-bleed within rounded containers

### Distinctive Components

**Universe React Logo**
- Animated/illustrated React logo as the visual centerpiece
- Connects Expo's identity to the React ecosystem
- The only illustrative element on an otherwise photographic page

**Device Preview Grid**
- Multiple device types (phone, tablet, web) shown simultaneously
- Demonstrates cross-platform capability visually
- Each device uses realistic device chrome

**Status Badge**
- "All Systems Operational" pill in the nav
- Green dot + text — compact trust signal
- Pill-shaped (36px radius)

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 144px
- Button padding: 0px 12px (unusually compact — height driven by line-height)
- Card internal padding: approximately 24–32px
- Section vertical spacing: enormous (estimated 96–144px between major sections)
- Component gap: 16–24px between sibling elements

### Grid & Container
- Max container width: approximately 1200–1400px, centered
- Hero: centered single-column with massive breathing room
- Feature sections: alternating layouts (image left/right, full-width showcases)
- Card grids: 2–3 column for feature highlights
- Full-width sections with contained inner content

### Whitespace Philosophy
- **Gallery-like pacing**: Each section feels like its own exhibit, surrounded by vast empty space. This creates a premium, unhurried browsing experience.
- **Breathing room is the design**: The generous whitespace IS the primary design element — it communicates confidence, quality, and that each feature deserves individual attention.
- **Content islands**: Sections float as isolated "islands" in the white space, connected by scrolling rather than visual continuation.

### Border Radius Scale
- Nearly squared (4px): Small inline elements, tags
- Subtly rounded (6px): Buttons, form inputs, combo boxes — the functional interactive radius
- Comfortably rounded (8px): Standard content cards, containers
- Generously rounded (16px): Feature tabs, content panels
- Very rounded (24px): Buttons, video/image containers, tabpanels — the signature softness
- Highly rounded (32–36px): Hero CTAs, status badges, nav buttons
- Pill-shaped (9999px): Primary action buttons, tags, avatars — maximum friendliness

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Cloud Gray page background, inline text |
| Surface (Level 1) | White bg, no shadow | Standard white cards on Cloud Gray |
| Whisper (Level 2) | \`rgba(0,0,0,0.08) 0px 3px 6px\` + \`rgba(0,0,0,0.07) 0px 2px 4px\` | Subtle card lift, hover states |
| Elevated (Level 3) | \`rgba(0,0,0,0.1) 0px 10px 20px\` + \`rgba(0,0,0,0.05) 0px 3px 6px\` | Feature showcases, product screenshots |
| Modal (Level 4) | Dark overlay (\`--dialog-overlay-background-color\`) + heavy shadow | Dialogs, overlays |

**Shadow Philosophy**: Expo uses shadows as gentle whispers rather than architectural statements. The primary depth mechanism is **background color contrast** — white cards floating on Cloud Gray — rather than shadow casting. When shadows appear, they're soft, diffused, and directional (downward), creating the feeling of paper hovering millimeters above a desk.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hamburger nav, stacked cards, hero text scales to ~36px |
| Tablet | 640–1024px | 2-column grids, condensed nav, medium hero text |
| Desktop | >1024px | Full multi-column layout, expanded nav, massive hero (64px) |

*Only one explicit breakpoint detected (640px), suggesting a fluid, container-query or min()/clamp()-based responsive system rather than fixed breakpoint snapping.*

### Touch Targets
- Buttons use generous radius (24–36px) creating large, finger-friendly surfaces
- Navigation links spaced with adequate gap
- Status badge sized for touch (36px radius)
- Minimum recommended: 44x44px

### Collapsing Strategy
- **Navigation**: Full horizontal nav with CTA collapses to hamburger on mobile
- **Feature sections**: Multi-column → stacked single column
- **Hero text**: 64px → ~36px progressive scaling
- **Device previews**: Grid → stacked/carousel
- **Cards**: Side-by-side → vertical stacking
- **Spacing**: Reduces proportionally but maintains generous rhythm

### Image Behavior
- Product screenshots scale proportionally
- Device mockups may simplify or show fewer devices on mobile
- Rounded corners maintained at all sizes
- Lazy loading for below-fold content`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Expo - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/expo: developer-console minimalism with black-and-white precision and native app launch energy."
    />
    <style>
      :root {
        --bg: #ffffff;
        --surface: #f6f7f9;
        --surface-warm: #eef2ff;
        --fg: #0b0d12;
        --fg-2: #353945;
        --muted: #6b7280;
        --meta: #4630eb;
        --border: #dfe3ea;
        --border-soft: #edf0f5;
        --accent: #000020;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #00a36c;
        --warn: #f59e0b;
        --danger: #e5484d;
        --font-display: "Inter", system-ui, sans-serif;
        --font-body: "Inter", system-ui, sans-serif;
        --font-mono: "Geist Mono", "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 48px;
        --text-4xl: 68px;
        --leading-body: 1.52;
        --leading-tight: 1.06;
        --tracking-display: -0.025em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 96px;
        --section-y-tablet: 68px;
        --section-y-phone: 48px;
        --radius-sm: 8px;
        --radius-md: 14px;
        --radius-lg: 22px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 18px 48px rgba(0, 0, 32, 0.12);
        --focus-ring: 0 0 0 4px rgba(70, 48, 235, 0.24);
        --motion-fast: 140ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1160px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        min-height: 100vh;
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }
      .page {
        min-height: 100vh;
        background: radial-gradient(circle at 84% 14%, rgba(70, 48, 235, 0.16), transparent 34%), #ffffff;
      }
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h1 { max-width: 820px; font-size: var(--text-4xl); font-weight: 700; }
      h2 { font-size: var(--text-3xl); font-weight: 650; }
      h3 { font-size: var(--text-xl); font-weight: 650; }
      .eyebrow {
        color: var(--meta);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .lead {
        max-width: 620px;
        color: var(--fg-2);
        font-size: var(--text-lg);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: var(--space-8);
        align-items: center;
      }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 var(--space-5);
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        font: 700 var(--text-sm) / 1 var(--font-body);
        text-decoration: none;
        cursor: pointer;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface); color: var(--fg); border-color: var(--border); box-shadow: var(--elev-ring); }
      .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
      .panel {
        background: color-mix(in oklab, var(--surface), transparent 4%);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised);
        overflow: hidden;
      }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-5);
        border-bottom: 1px solid var(--border-soft);
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--meta);
        font: 700 var(--text-xs) / 1 var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .status::before {
        width: 8px;
        height: 8px;
        border-radius: var(--radius-pill);
        background: var(--success);
        content: "";
      }
      .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-bottom: 1px solid var(--border-soft);
      }
      .metric {
        padding: var(--space-5);
        border-right: 1px solid var(--border-soft);
      }
      .metric:last-child { border-right: 0; }
      .metric strong {
        display: block;
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        line-height: var(--leading-tight);
      }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .card-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        padding: var(--space-5);
      }
      .mini-card {
        min-height: 148px;
        padding: var(--space-5);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        background: var(--surface-warm);
      }
      .mini-card p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      .swatches {
        display: flex;
        gap: var(--space-2);
        margin-block-start: var(--space-4);
      }
      .swatch {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
      }
      .swatch.accent { background: var(--accent); }
      .swatch.surface { background: var(--surface); }
      .swatch.warm { background: var(--surface-warm); }
      .swatch.fg { background: var(--fg); }
      .field {
        display: grid;
        gap: var(--space-2);
        margin-block-start: var(--space-5);
      }
      label { color: var(--fg-2); font-size: var(--text-sm); font-weight: 700; }
      input {
        width: 100%;
        min-height: 46px;
        padding: 0 var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--surface);
        color: var(--fg);
        font: inherit;
      }
      input:focus { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }
      .lower {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .tile {
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .tile p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      @media (max-width: 860px) {
        .hero, .lower { grid-template-columns: 1fr; }
        .metric-grid, .card-row { grid-template-columns: 1fr; }
        .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); }
        .metric:last-child { border-bottom: 0; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">Expo design system</p>
            <h1>App launch console</h1>
            <p class="lead">Developer shipping surfaces with crisp black, code density, and mobile previews.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary black launch action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Expo component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>native build panel</h3>
              </div>
              <span class="status">online</span>
            </div>
            <div class="metric-grid">
              <div class="metric"><strong>98%</strong><span>Signal quality</span></div>
              <div class="metric"><strong>24</strong><span>Active flows</span></div>
              <div class="metric"><strong>3.2s</strong><span>Response time</span></div>
            </div>
            <div class="card-row">
              <div class="mini-card">
                <h3>Palette</h3>
                <p>developer-console minimalism with black-and-white precision and native app launch energy.</p>
                <div class="swatches" aria-label="Token swatches">
                  <span class="swatch accent"></span>
                  <span class="swatch surface"></span>
                  <span class="swatch warm"></span>
                  <span class="swatch fg"></span>
                </div>
              </div>
              <div class="mini-card">
                <h3>Control</h3>
                <p>Focus, hover, and status states share the same brand signal.</p>
                <div class="field">
                  <label for="expo-input">Reference input</label>
                  <input id="expo-input" value="Expo system token" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section>
        <div class="container lower">
          <article class="tile">
            <p class="eyebrow">Typography</p>
            <h2>Display rhythm</h2>
            <p>Headlines use the brand display stack with the declared scale and leading.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Surface</p>
            <h2>Layer system</h2>
            <p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Interaction</p>
            <h2>Motion states</h2>
            <p>Buttons, inputs, and panels use brand-specific focus rings and easing.</p>
          </article>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=expo_default;return module.exports}});
//# sourceMappingURL=client.expo.js.map