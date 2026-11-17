
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.raycast.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var raycast_default={"contract":`## 1. Visual Theme & Atmosphere

Raycast's marketing site feels like the dark interior of a precision instrument — a Swiss watch case carved from obsidian. The background isn't just dark, it's an almost-black blue-tint (\`#07080a\`) that creates a sense of being inside a macOS native application rather than a website. Every surface, every border, every shadow is calibrated to evoke the feeling of a high-performance desktop utility: fast, minimal, trustworthy.

The signature move is the layered shadow system borrowed from macOS window chrome: multi-layer box-shadows with inset highlights that simulate physical depth, as if cards and buttons are actual pressed or raised glass elements on a dark desk. Combined with Raycast Red (\`#FF6363\`) — deployed almost exclusively in the hero's iconic diagonal stripe pattern — the palette creates a brand that reads as "powerful tool with personality." The red doesn't dominate; it punctuates.

Inter is used everywhere — headings, body, buttons, captions — with extensive OpenType features (\`calt\`, \`kern\`, \`liga\`, \`ss03\`) creating a consistent, readable typographic voice. The positive letter-spacing (0.2px–0.4px on body text) is unusual for a dark UI and gives the text an airy, breathable quality that counterbalances the dense, dark surfaces. GeistMono appears for code elements, reinforcing the developer-tool identity.

**Key Characteristics:**
- Near-black blue-tinted background (\`#07080a\`) — not pure black, subtly blue-shifted
- macOS-native shadow system with multi-layer inset highlights simulating physical depth
- Raycast Red (\`#FF6363\`) as a punctuation color — hero stripes, not pervasive
- Inter with positive letter-spacing (0.2px) for an airy, readable dark-mode experience
- Radix UI component primitives powering the interaction layer
- Subtle rgba white borders (0.06–0.1 opacity) for containment on dark surfaces
- Keyboard shortcut styling with gradient key caps and heavy shadows

## 4. Component Stylings

### Buttons
- **Primary Pill**: Transparent background, white text, pill shape (86px radius), multi-layer inset shadow (\`rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset\`). Hover: opacity 0.6
- **Secondary Button**: Transparent background, white text, 6px radius, \`1px solid rgba(255, 255, 255, 0.1)\` border, subtle drop shadow (\`rgba(0, 0, 0, 0.03) 0px 7px 3px\`). Hover: opacity 0.6
- **Ghost Button**: No background or border, gray text (\`#6a6b6c\`), 86px radius, same inset shadow. Hover: opacity 0.6, text brightens to white
- **CTA (Download)**: Semi-transparent white background (\`hsla(0, 0%, 100%, 0.815)\`), dark text (\`#18191a\`), pill shape. Hover: full white background (\`hsl(0, 0%, 100%)\`)
- **Transition**: All buttons use opacity transition for hover rather than background-color change — a signature Raycast interaction pattern

### Cards & Containers
- **Standard Card**: \`#101111\` surface, \`1px solid rgba(255, 255, 255, 0.06)\` border, 12px–16px border-radius
- **Elevated Card**: Ring shadow \`rgb(27, 28, 30) 0px 0px 0px 1px\` outer + \`rgb(7, 8, 10) 0px 0px 0px 1px inset\` inner — creates a double-ring containment
- **Feature Card**: 16px–20px border-radius, subtle warm glow (\`rgba(215, 201, 175, 0.05) 0px 0px 20px 5px\`) behind hero elements
- **Hover**: Cards brighten slightly via border opacity increase or subtle shadow enhancement

### Inputs & Forms
- Dark input fields with \`#07080a\` background, \`1px solid rgba(255, 255, 255, 0.08)\` border, 8px border-radius
- Focus state: Border brightens, blue glow (\`hsla(202, 100%, 67%, 0.15)\`) ring appears
- Text: \`#f9f9f9\` input color, \`#6a6b6c\` placeholder
- Labels: \`#9c9c9d\` at 14px weight 500

### Navigation
- **Top nav**: Dark background blending with page, white text links at 16px weight 500
- **Nav links**: Gray text (\`#9c9c9d\`) → white on hover, underline decoration on hover
- **CTA button**: Semi-transparent white pill at nav end
- **Mobile**: Collapses to hamburger, maintains dark theme
- **Sticky**: Nav fixed at top with subtle border separator

### Image Treatment
- **Product screenshots**: macOS window chrome style — rounded corners (12px), deep shadows simulating floating windows
- **Full-bleed sections**: Dark screenshots blend seamlessly into the dark background
- **Hero illustration**: Diagonal stripe pattern in Raycast Red — abstract, geometric, brand-defining
- **App UI embeds**: Showing actual Raycast command palette and extensions — product as content

### Keyboard Shortcut Keys
- **Key cap styling**: Gradient background (\`#121212\` → \`#0d0d0d\`), heavy multi-layer shadow (\`rgba(0, 0, 0, 0.4) 0px 1.5px 0.5px 2.5px\` + inset shadows), creating realistic physical key appearance
- Border-radius: 4px–6px for individual keys

### Badges & Tags
- **Neutral badge**: \`#1b1c1e\` background, white text, 6px radius, 14px font at weight 500, \`0px 6px\` padding
- Compact, pill-like treatment for categorization

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 1px, 2px, 3px, 4px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 40px
- **Section padding**: 80px–120px vertical between major sections
- **Card padding**: 16px–32px internal spacing
- **Component gaps**: 8px–16px between related elements

### Grid & Container
- **Max width**: ~1200px container (breakpoint at 1204px), centered
- **Column patterns**: Single-column hero, 2–3 column feature grids, full-width showcase sections
- **App showcase**: Product UI presented in centered window frames

### Whitespace Philosophy
- **Dramatic negative space**: Sections float in vast dark void, creating cinematic pacing between features
- **Dense product, sparse marketing**: The product UI screenshots are information-dense, but the surrounding marketing copy uses minimal text with generous spacing
- **Vertical rhythm**: Consistent 24px–32px gaps between elements within sections

### Border Radius Scale
- **2px–3px**: Micro-elements, code spans, tiny indicators
- **4px–5px**: Keyboard keys, small interactive elements
- **6px**: Buttons, badges, tags — the workhorse radius
- **8px**: Input fields, inline components
- **9px–11px**: Images, medium containers
- **12px**: Standard cards, product screenshots
- **16px**: Large cards, feature sections
- **20px**: Hero cards, prominent containers
- **86px+**: Pill buttons, nav CTAs — full pill shape

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Void) | No shadow, \`#07080a\` surface | Page background |
| Level 1 (Subtle) | \`rgba(0, 0, 0, 0.28) 0px 1.189px 2.377px\` | Minimal lift, inline elements |
| Level 2 (Ring) | \`rgb(27, 28, 30) 0px 0px 0px 1px\` outer + \`rgb(7, 8, 10) 0px 0px 0px 1px inset\` inner | Card containment, double-ring technique |
| Level 3 (Button) | \`rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset\` + \`rgba(255, 255, 255, 0.25) 0px 0px 0px 1px\` + \`rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset\` | macOS-native button press — white highlight top, dark inset bottom |
| Level 4 (Key) | 5-layer shadow stack with inset press effects | Keyboard shortcut key caps — physical 3D appearance |
| Level 5 (Floating) | \`rgba(0, 0, 0, 0.5) 0px 0px 0px 2px\` + \`rgba(255, 255, 255, 0.19) 0px 0px 14px\` + insets | Command palette, floating panels — heavy depth with glow |

### Shadow Philosophy
Raycast's shadow system is the most macOS-native on the web. Multi-layer shadows combine:
- **Outer rings** for containment (replacing traditional borders)
- **Inset top highlights** (\`rgba(255, 255, 255, 0.05–0.25)\`) simulating light source from above
- **Inset bottom darks** (\`rgba(0, 0, 0, 0.2)\`) simulating shadow underneath
- The effect is physical: elements feel like glass or brushed metal, not flat rectangles

### Decorative Depth
- **Warm glow**: \`rgba(215, 201, 175, 0.05) 0px 0px 20px 5px\` behind featured elements — a subtle warm aura on the cold dark canvas
- **Blue info glow**: \`rgba(0, 153, 255, 0.15)\` for interactive state emphasis
- **Red danger glow**: \`rgba(255, 99, 99, 0.15)\` for error/destructive state emphasis

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Single column, stacked cards, hamburger nav, hero text reduces to ~40px |
| Small Tablet | 600px–768px | 2-column grid begins, nav partially visible |
| Tablet | 768px–1024px | 2–3 column features, nav expanding, screenshots scale |
| Desktop | 1024px–1200px | Full layout, all nav links visible, 64px hero display |
| Large Desktop | >1200px | Max-width container centered, generous side margins |

### Touch Targets
- Pill buttons: 86px radius with 20px padding — well above 44px minimum
- Secondary buttons: 8px padding minimum, but border provides visual target expansion
- Nav links: 16px text with surrounding padding for accessible touch targets

### Collapsing Strategy
- **Navigation**: Full horizontal nav → hamburger at mobile with slide-out menu
- **Hero**: 64px display → 48px → 36px across breakpoints
- **Feature grids**: 3-column → 2-column → single-column stack
- **Product screenshots**: Scale within containers, maintaining macOS window chrome proportions
- **Keyboard shortcut displays**: Simplify or hide on mobile where keyboard shortcuts are irrelevant

### Image Behavior
- Product screenshots scale responsively within fixed-ratio containers
- Hero diagonal stripe pattern scales proportionally
- macOS window chrome rounded corners maintained at all sizes
- No lazy-loading artifacts — images are critical to the product narrative`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Raycast — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/raycast. Every visible value
        comes from tokens.css. Raycast's signature moves: near-black blue-tinted
        canvas, Inter with calt+kern+liga+ss03 and +0.2px body tracking, weight
        500 baseline, macOS double-ring elevation, Raycast Red as scarce
        punctuation, Raycast Blue for focus and interaction."
    />

    <style>
      :root {
        --bg:           #07080a;
        --surface:      #101111;
        --surface-warm: var(--surface);

        --fg:    #f9f9f9;
        --fg-2:  #cecece;
        --muted: #9c9c9d;
        --meta:  #6a6b6c;

        --border:      rgba(255, 255, 255, 0.06);
        --border-soft: rgba(255, 255, 255, 0.04);

        --accent:        #FF6363;
        --accent-on:     #ffffff;
        --accent-hover:  #ff7777;
        --accent-active: #e85757;

        --success: hsl(151, 59%, 59%);
        --warn:    hsl(43, 100%, 60%);
        --danger:  hsl(0, 100%, 69%);

        --font-display: "Inter", "Inter Fallback", "SF Pro Display", -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
        --font-body:    "Inter", "Inter Fallback", "SF Pro Text", -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
        --font-mono:    "GeistMono", ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   20px;
        --text-2xl:  24px;
        --text-3xl:  40px;
        --text-4xl:  64px;

        --leading-body:     1.6;
        --leading-tight:    1.1;
        --tracking-display: 0px;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 96px;
        --section-y-tablet:  64px;
        --section-y-phone:   40px;

        --radius-sm:   6px;
        --radius-md:   12px;
        --radius-lg:   16px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   rgb(27, 28, 30) 0px 0px 0px 1px, rgb(7, 8, 10) 0px 0px 0px 1px inset;
        --elev-raised:
          rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset,
          rgba(0, 0, 0, 0.28) 0px 1.189px 2.377px,
          0 0 0 1px rgba(255, 255, 255, 0.06);

        --focus-ring: 0 0 0 3px hsla(202, 100%, 67%, 0.35);

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
        font-weight: 500;
        line-height: var(--leading-body);
        letter-spacing: 0.2px;
        /* Raycast's signature OpenType stack — applied globally on Inter. */
        font-feature-settings: "calt", "kern", "liga", "ss03";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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
        margin: 0;
        color: var(--fg);
        font-feature-settings: "calt", "kern", "liga", "ss03";
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 600;
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        /* DESIGN.md §3: hero disables ligatures, enables ss02 + ss08. */
        font-feature-settings: "liga" 0, "ss02", "ss08";
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 400;
        line-height: 1.17;
        letter-spacing: 0.2px;
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 500;
        line-height: 1.6;
        letter-spacing: 0.2px;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.6;
        color: var(--fg-2);
        font-weight: 400;
        letter-spacing: 0.2px;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); color: var(--muted); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--meta);
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 18px;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 600;
        font-feature-settings: "calt", "kern", "liga", "ss03";
        line-height: 1.15;
        letter-spacing: 0.3px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: opacity var(--motion-fast) var(--ease-standard),
                    background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Raycast's CTA: translucent white pill on dark, near-black text. */
      .btn-primary {
        background: hsla(0, 0%, 100%, 0.815);
        color: #18191a;
        box-shadow:
          rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset,
          rgba(0, 0, 0, 0.25) 0px 1px 2px;
      }
      .btn-primary:hover { background: #ffffff; opacity: 1; }
      .btn-primary:active { background: #ffffff; opacity: 0.92; }
      /* Secondary: transparent with hairline border + macOS inset highlight. */
      .btn-secondary {
        background: transparent;
        color: var(--fg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow:
          rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset,
          rgba(0, 0, 0, 0.2) 0px -1px 0px 0px inset;
      }
      .btn-secondary:hover { opacity: 0.6; }

      /* ─── Keyboard key caps ─────────────────────────────────────── */
      /* DESIGN.md §4 Keyboard Keys: gradient #121212→#0d0d0d, heavy
         multi-layer shadow for realistic physical depth. */
      .kbd {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        padding: 2px 6px;
        background: linear-gradient(to bottom, #121212, #0d0d0d);
        color: var(--fg-2);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 600;
        border-radius: 5px;
        box-shadow:
          rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset,
          rgba(0, 0, 0, 0.4) 0px 1.5px 0.5px 1.5px,
          rgba(0, 0, 0, 0.6) 0px 2px 4px;
        line-height: 1.4;
      }
      .kbd-row { display: inline-flex; align-items: center; gap: var(--space-2); }

      /* ─── Cards ─────────────────────────────────────────────────── */
      .card {
        position: relative;
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        /* macOS double-ring elevation — outer card-tone + inset deep-bg. */
        box-shadow: var(--elev-ring);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        box-shadow:
          rgb(27, 28, 30) 0px 0px 0px 1px,
          rgb(7, 8, 10) 0px 0px 0px 1px inset,
          rgba(215, 201, 175, 0.05) 0px 0px 20px 5px;
      }
      .card-title {
        color: var(--fg);
        font-size: var(--text-xl);
        font-weight: 500;
        line-height: 1.15;
        letter-spacing: 0.2px;
        margin: 0;
      }

      /* ─── Inputs ────────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--muted);
        letter-spacing: 0.2px;
      }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        letter-spacing: 0.2px;
        font-feature-settings: "calt", "kern", "liga", "ss03";
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus {
        border-color: hsl(202, 100%, 67%);
        box-shadow: var(--focus-ring);
      }

      /* ─── Pills / badges ────────────────────────────────────────── */
      .pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--fg-2);
        background: #1b1c1e;
        letter-spacing: 0.2px;
      }
      .pill-accent {
        color: var(--accent);
        background: hsla(0, 100%, 69%, 0.12);
        border: 1px solid hsla(0, 100%, 69%, 0.25);
      }
      .pill-info {
        color: hsl(202, 100%, 67%);
        background: hsla(202, 100%, 67%, 0.12);
        border: 1px solid hsla(202, 100%, 67%, 0.25);
      }

      /* ─── Hero stripe decoration — Raycast Red diagonal lines ──── */
      .hero-stripes {
        position: relative;
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        box-shadow: var(--elev-ring);
        overflow: hidden;
        min-height: 280px;
        display: flex;
        align-items: flex-end;
      }
      .hero-stripes::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
          135deg,
          var(--accent) 0px,
          var(--accent) 10px,
          transparent 10px,
          transparent 28px
        );
        opacity: 0.85;
        mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.25) 70%, rgba(0, 0, 0, 0) 100%);
        -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.25) 70%, rgba(0, 0, 0, 0) 100%);
      }
      .hero-stripes .palette {
        position: relative;
        z-index: 1;
        width: 100%;
        background: linear-gradient(to bottom, rgba(16, 17, 17, 0.8), rgba(7, 8, 10, 0.95));
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-md);
        padding: var(--space-3) var(--space-4);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--fg-2);
      }

      /* ─── Layout ────────────────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
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
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .feature-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--fg);
      }
    </style>

    <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-hey-layout-repair>.hey-preview-form > div { flex-wrap: wrap; } .hey-preview-form button { flex-shrink: 0; max-width: 100%; white-space: normal; }</style>
<style data-hey-form-layout>.hey-form-layout { display:grid;grid-template-columns:1.1fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .hey-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · raycast</p>
            <h1>Your shortcut to everything.</h1>
            <p class="lead" style="max-width:52ch">
              A blazingly fast, totally extendable launcher. Raycast lets you
              complete tasks, calculate, share common links, and much more.
              Every value on this page comes from <span style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--fg)">tokens.css</span>
              — the void, the rings, the +0.2px tracking, the red stripe.
            </p>
            <div class="kbd-row" style="margin-block-start:var(--space-2)">
              <span class="body-sm">Open with</span>
              <span class="kbd">⌘</span>
              <span class="kbd">Space</span>
            </div>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside class="hero-stripes" aria-label="Raycast brand stripe with command palette preview">
            <div class="palette">
              <span style="display:inline-flex;align-items:center;gap:var(--space-3)">
                <span style="width:18px;height:18px;border-radius:4px;background:var(--accent);display:inline-block;flex-shrink:0"></span>
                <span style="color:var(--fg)">Search apps, commands, snippets…</span>
              </span>
              <span class="kbd">↵</span>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width:30ch">A precision instrument carved from obsidian.</h2>
        </div>

        <div class="features-grid" style="margin-block-start:var(--space-8)">
          <article class="card stack-3">
            <span class="feature-icon">⌘</span>
            <h3 class="card-title">Blazingly fast</h3>
            <p class="body-sm">
              Built natively for macOS with multi-layer inset shadows, the
              double-ring containment, and 150–200ms transitions on the
              standard ease curve. No web bloat — instant response.
            </p>
            <span class="pill pill-info">Native</span>
          </article>

          <article class="card stack-3">
            <span class="feature-icon">⊕</span>
            <h3 class="card-title">Totally extendable</h3>
            <p class="body-sm">
              Hundreds of community Extensions. Inter with calt+kern+liga+ss03
              on every label keeps the dense product UI legible against the
              blue-tinted near-black canvas.
            </p>
            <span class="pill">Store</span>
          </article>

          <article class="card stack-3">
            <span class="feature-icon">!</span>
            <h3 class="card-title">Scarce by design</h3>
            <p class="body-sm">
              Raycast Red appears as punctuation — hero stripes, destructive
              actions, alert glows. Interactive feedback uses Raycast Blue
              so the red retains its weight.
            </p>
            <span class="pill pill-accent">Danger only</span>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="hey-form-layout">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs on the void.</h2>
            <p class="lead" style="max-width:46ch">
              Fields sit on the page background (<span style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--fg)">#07080a</span>)
              with a barely-there 8% white border. Focus brightens the
              edge to Raycast Blue and lifts a translucent 35%-blue ring —
              never the brand red.
            </p>
          </div>
          <div role="group" class="hey-preview-form"
            style="display:flex;flex-direction:column;gap:var(--space-4);max-width:420px;background:var(--surface);padding:var(--space-6);border-radius:var(--radius-lg);box-shadow:var(--elev-ring)"
          >
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" />
            </div>
            <div class="field">
              <label for="team">Team name</label>
              <input id="team" type="text" placeholder="Acme Productivity" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2);flex-wrap:wrap">
              <button type="submit" class="btn btn-primary">Get started</button>
              <button type="button" class="btn btn-secondary">View extensions</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=raycast_default;return module.exports}});
//# sourceMappingURL=client.raycast.js.map