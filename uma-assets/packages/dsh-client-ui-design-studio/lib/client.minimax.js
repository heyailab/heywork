
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.minimax.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var minimax_default={"contract":`## 1. Visual Theme & Atmosphere

MiniMax's website is a clean, product-showcase platform for a Chinese AI technology company that bridges consumer-friendly appeal with technical credibility. The design language is predominantly white-space-driven with a light, airy feel — pure white backgrounds (\`#ffffff\`) dominate, letting colorful product cards and AI model illustrations serve as the visual anchors. The overall aesthetic sits at the intersection of Apple's product marketing clarity and a playful, rounded design language that makes AI technology feel approachable.

The typography system is notably multi-font: DM Sans serves as the primary UI workhorse, Outfit handles display headings with geometric elegance, Poppins appears for mid-tier headings, and Roboto handles data-heavy contexts. This variety reflects a brand in rapid growth — each font serves a distinct communicative purpose rather than competing for attention. The hero heading at 80px weight 500 in both DM Sans and Outfit with a tight 1.10 line-height creates a bold but not aggressive opening statement.

What makes MiniMax distinctive is its pill-button geometry (9999px radius) for navigation and primary actions, combined with softer 8px–24px radiused cards for product showcases. The product cards themselves are richly colorful — vibrant gradients in pink, purple, orange, and blue — creating a "gallery of AI capabilities" feel. Against the white canvas, these colorful cards pop like app icons on a phone home screen, making each AI model/product feel like a self-contained creative tool.

**Key Characteristics:**
- White-dominant layout with colorful product card accents
- Multi-font system: DM Sans (UI), Outfit (display), Poppins (mid-tier), Roboto (data)
- Pill buttons (9999px radius) for primary navigation and CTAs
- Generous rounded cards (20px–24px radius) for product showcases
- Brand blue spectrum: from \`#1456f0\` (brand-6) through \`#3b82f6\` (primary-500) to \`#60a5fa\` (light)
- Brand pink (\`#ea5ec1\`) as secondary accent
- Near-black text (\`#222222\`, \`#18181b\`) on white backgrounds
- Purple-tinted shadows (\`rgba(44, 30, 116, 0.16)\`) creating subtle brand-colored depth
- Dark footer section (\`#181e25\`) with product/company links

## 4. Component Stylings

### Buttons

**Pill Primary Dark**
- Background: \`#181e25\`
- Text: \`#ffffff\`
- Padding: 11px 20px
- Radius: 8px
- Use: Primary CTA ("Get Started", "Learn More")

**Pill Nav**
- Background: \`rgba(0, 0, 0, 0.05)\` (subtle tint)
- Text: \`#18181b\`
- Radius: 9999px (full pill)
- Use: Navigation tabs, filter toggles

**Pill White**
- Background: \`#ffffff\`
- Text: \`rgba(24, 30, 37, 0.8)\`
- Radius: 9999px
- Opacity: 0.5 (default state)
- Use: Secondary nav, inactive tabs

**Secondary Light**
- Background: \`#f0f0f0\`
- Text: \`#333333\`
- Padding: 11px 20px
- Radius: 8px
- Use: Secondary actions

### Product Cards
- Background: Vibrant gradients (pink/purple/orange/blue)
- Radius: 20px–24px (generous rounding)
- Shadow: \`rgba(44, 30, 116, 0.16) 0px 0px 15px\` (brand purple glow)
- Content: Product name, model version, descriptive text
- Each card has its own color palette matching the product identity

### AI Product Cards (Matrix)
- Background: white with subtle shadow
- Radius: 13px–16px
- Shadow: \`rgba(0, 0, 0, 0.08) 0px 4px 6px\`
- Icon/illustration centered above product name
- Product name in DM Sans 14–16px weight 500

### Links
- **Primary**: \`#18181b\` or \`#181e25\`, underline on dark text
- **Secondary**: \`#8e8e93\`, muted for less emphasis
- **On Dark**: \`rgba(255, 255, 255, 0.8)\` for footer and dark sections

### Navigation
- Clean horizontal nav on white background
- MiniMax logo left-aligned (red accent in logo)
- DM Sans 14px weight 500 for nav items
- Pill-shaped active indicators (9999px radius)
- "Login" text link, minimal right-side actions
- Sticky header behavior

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 6px, 8px, 10px, 11px, 14px, 16px, 24px, 32px, 40px, 50px, 64px, 80px

### Grid & Container
- Max content width centered on page
- Product card grids: horizontal scroll or 3–4 column layout
- Full-width white sections with contained content
- Dark footer at full-width

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, stacked cards |
| Tablet | 768–1024px | 2-column grids |
| Desktop | >1024px | Full layout, horizontal card scrolls |

### Whitespace Philosophy
- **Gallery spacing**: Products are presented like gallery items with generous white space between cards, letting each AI model breathe as its own showcase.
- **Section rhythm**: Large vertical gaps (64px–80px) between major sections create distinct "chapters" of content.
- **Card breathing**: Product cards use internal padding of 16px–24px with ample whitespace around text.

### Border Radius Scale
- Minimal (4px): Small tags, micro badges
- Standard (8px): Buttons, small cards
- Comfortable (11px–13px): Medium cards, panels
- Generous (16px–20px): Large product cards
- Large (22px–24px): Hero product cards, major containers
- Pill (30px–32px): Badge pills, rounded panels
- Full (9999px): Buttons, nav tabs

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | White background, text blocks |
| Subtle (Level 1) | \`rgba(0, 0, 0, 0.08) 0px 4px 6px\` | Standard cards, containers |
| Ambient (Level 2) | \`rgba(0, 0, 0, 0.08) 0px 0px 22.576px\` | Soft glow around elements |
| Brand Glow (Level 3) | \`rgba(44, 30, 116, 0.16) 0px 0px 15px\` | Featured product cards |
| Elevated (Level 4) | \`rgba(36, 36, 36, 0.08) 0px 12px 16px -4px\` | Lifted cards, hover states |

**Shadow Philosophy**: MiniMax uses a distinctive purple-tinted shadow (\`rgba(44, 30, 116, ...)\`) for featured elements, creating a subtle brand-color glow that connects the shadow system to the blue brand identity. Standard shadows use neutral black but at low opacity (0.08), keeping everything feeling light and airy. The directional shadow variant (6.5px offset) adds dimensional interest to hero product cards.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, stacked product cards, hamburger nav |
| Tablet | 768–1024px | 2-column product grids, condensed spacing |
| Desktop | >1024px | Full horizontal card layouts, expanded spacing |

### Collapsing Strategy
- Hero: 80px → responsive scaling to ~40px on mobile
- Product card grid: horizontal scroll → 2-column → single column stacked
- Navigation: horizontal → hamburger menu
- Footer: multi-column → stacked sections
- Spacing: 64–80px gaps → 32–40px on mobile`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MiniMax — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/minimax. Every visible
        value comes from tokens.css. MiniMax / Hailuo (海螺) signature
        moves: white-dominant gallery, Outfit display + DM Sans body
        with CJK fallbacks, pill nav, brand-blue accent, near-black CTA
        per the MiniMax button system, purple-tinted glow on the
        featured product card."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #fafafa;
        --surface-warm: #f0f0f0;

        --fg:   #222222;
        --fg-2: #18181b;
        --muted: #45515e;
        --meta:  #8e8e93;

        --border:      #e5e7eb;
        --border-soft: #f2f3f5;

        --accent:        #1456f0;
        --accent-on:     #ffffff;
        --accent-hover:  #2563eb;
        --accent-active: #1d4ed8;

        --success: #16a34a;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "Outfit", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
        --font-body:    "DM Sans", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
        --font-mono:    ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   20px;
        --text-xl:   24px;
        --text-2xl:  32px;
        --text-3xl:  48px;
        --text-4xl:  80px;

        --leading-body:     1.5;
        --leading-tight:    1.1;
        --tracking-display: -0.01em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet:  64px;
        --section-y-phone:   40px;

        --radius-sm:   8px;
        --radius-md:   13px;
        --radius-lg:   20px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 4px 6px rgba(0, 0, 0, 0.08);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
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

      /* ─── Typography ────────────────────────────────────────── */
      h1, h2, h3 { margin: 0; color: var(--fg); }
      /* Outfit display — weight 500 (not 700) per DESIGN.md §3. */
      h1 {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 500;
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.005em;
      }
      h3 {
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 600;
        line-height: var(--leading-body);
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: var(--leading-body);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
        font-family: var(--font-body);
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* Smaller hero on tablet/phone — DESIGN.md §8 collapses 80px → 40px. */
      @media (max-width: 1023px) { h1 { font-size: 56px; } }
      @media (max-width: 639px)  { h1 { font-size: 40px; } }

      /* ─── Nav ───────────────────────────────────────────────── */
      .topnav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-block: var(--space-5);
        gap: var(--space-4);
      }
      .topnav-brand {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: var(--text-lg);
        color: var(--fg-2);
        text-decoration: none;
        letter-spacing: -0.01em;
      }
      .topnav-tabs {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        background: rgba(0, 0, 0, 0.04);
        padding: 4px;
        border-radius: var(--radius-pill);
      }
      .topnav-tabs a {
        padding: 8px 14px;
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--muted);
        text-decoration: none;
        border-radius: var(--radius-pill);
        transition: color var(--motion-fast) var(--ease-standard),
                    background-color var(--motion-fast) var(--ease-standard);
      }
      .topnav-tabs a:hover { color: var(--fg); }
      .topnav-tabs a[aria-current="page"] {
        background: var(--bg);
        color: var(--fg-2);
        box-shadow: var(--elev-raised);
      }
      .topnav-right { display: flex; align-items: center; gap: var(--space-3); }

      /* ─── Buttons ───────────────────────────────────────────── */
      /* MiniMax primary CTA: near-black pill-radius (8px) bg, white text,
         11px 20px padding per DESIGN.md §4 "Pill Primary Dark". */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 11px 20px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--fg-2);
        color: var(--bg);
      }
      .btn-primary:hover  { background: #2a323b; }
      .btn-primary:active { background: #0f1419; }
      .btn-secondary {
        background: var(--surface-warm);
        color: var(--fg-2);
      }
      .btn-secondary:hover { background: #e3e3e6; }
      .btn-ghost {
        background: transparent;
        color: var(--fg-2);
        border-color: var(--border);
      }
      .btn-ghost:hover { background: var(--surface); }

      /* ─── Chips ─────────────────────────────────────────────── */
      .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px 12px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 600;
        background: var(--surface-warm);
        color: var(--muted);
      }
      .chip-accent {
        background: color-mix(in oklab, var(--accent), transparent 90%);
        color: var(--accent);
      }
      .chip-success {
        background: color-mix(in oklab, var(--success), transparent 88%);
        color: var(--success);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Cards ─────────────────────────────────────────────── */
      .card {
        background: var(--bg);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition: box-shadow var(--motion-base) var(--ease-standard),
                    transform var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        box-shadow: var(--elev-raised);
        transform: translateY(-2px);
      }
      .card-product {
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        background: var(--bg);
        /* MiniMax purple-tinted brand glow — DESIGN.md §6 Level 3.
           Single-use here; not promoted to a token. */
        box-shadow: rgba(44, 30, 116, 0.16) 0px 0px 15px;
        overflow: hidden;
        position: relative;
        min-height: 240px;
      }
      .card-product-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--meta);
      }
      .card-product-title {
        font-family: var(--font-display);
        font-size: 28px;
        font-weight: 600;
        line-height: 1.2;
        color: var(--fg-2);
        margin: 0;
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg-2);
      }
      .field input, .field textarea {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus, .field textarea:focus {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Section layouts ───────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
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
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 460px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.875em;
        background: var(--surface-warm);
        border-radius: var(--radius-sm);
        padding: 1px 6px;
        color: var(--fg-2);
      }
    </style>

    <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <header class="container">
      <nav class="topnav" aria-label="Primary">
        
        <div class="topnav-tabs" role="tablist">
          <a href="#" role="tab" aria-current="page">Products</a>
          <a href="#" role="tab">Hailuo</a>
          <a href="#" role="tab">Conch</a>
          <a href="#" role="tab">Developers</a>
        </div>
        <div class="topnav-right">
          <a href="#" class="body-sm" style="color: var(--fg-2); text-decoration: none; font-weight: 500;">Log in</a>
          <a href="#" class="btn btn-primary">Get started</a>
        </div>
      </nav>
    </header>

    <main class="container">
      <!-- HERO — Outfit display, near-black CTA, brand-glow product card. -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · minimax</p>
            <h1>Generative AI, made for everyone.</h1>
            <p class="lead" style="max-width: 52ch;">
              From <strong style="color: var(--fg-2); font-weight: 600;">Hailuo</strong>
              video to <strong style="color: var(--fg-2); font-weight: 600;">Conch</strong> text,
              MiniMax ships consumer-friendly models that creators in
              Shanghai, São Paulo, and San Francisco can pick up in a
              single click — 一个画面，一段对话，一支视频。
            </p>
            <div class="hero-actions">
              
              
            </div>
            <p class="body-sm body-muted" style="margin-block-start: var(--space-3);">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to search the catalogue.
            </p>
          </div>

          <aside class="card-product" aria-label="Featured product">
            <div class="row-between" style="margin-block-end: var(--space-6);">
              <span class="card-product-tag">
                <span class="dot" style="color: var(--accent);"></span>
                Featured · v2.5
              </span>
              <span class="chip chip-accent">New</span>
            </div>
            <h2 class="card-product-title">Hailuo · 海螺 Video</h2>
            <p class="body-muted" style="margin-block-start: var(--space-2); font-size: var(--text-sm); max-width: 36ch;">
              Cinema-grade clips from a single prompt. 6 seconds, 1080p,
              ready to share — every render begins on a clean white canvas.
            </p>
            <div class="row-between" style="margin-block-start: var(--space-6); padding-block-start: var(--space-4); border-block-start: 1px solid var(--border-soft);">
              <span class="body-sm body-muted">Avg. render</span>
              <span class="body-sm" style="font-weight: 600; color: var(--fg-2);">42s</span>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES — 3-card matrix, 13px radius, neutral shadow. -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 28ch;">
            Restraint in chrome. Color in the products.
          </h2>
          <p class="lead" style="max-width: 56ch;">
            Every component below uses <code>var(--*)</code> only — the
            only place a raw color enters is the purple-tinted brand glow
            on the featured card above, justified explicitly by DESIGN.md §6.
          </p>
        </div>

        <div class="features-grid">
          <article class="card">
            <span class="chip chip-accent" style="align-self: flex-start;">Type</span>
            <h3>Two display voices</h3>
            <p class="body-muted body-sm">
              Outfit drives display headings at weight 500 — geometric,
              never aggressive. DM Sans handles ~70% of UI text. Both
              stacks ship with PingFang SC / Noto Sans SC fallbacks so
              <code>海螺 Video</code> aligns with English on the same baseline.
            </p>
            
          </article>

          <article class="card">
            <span class="chip chip-success" style="align-self: flex-start;">
              <span class="dot"></span>
              Accent
            </span>
            <h3>Brand blue, used sparingly</h3>
            <p class="body-muted body-sm">
              <code>--accent: #1456f0</code> appears at most twice per
              screen — eyebrow + chip here, focus ring on the form below.
              Brand pink stays out of the token system entirely (logo-only
              per DESIGN.md §7).
            </p>
            
          </article>

          <article class="card">
            <span class="chip" style="align-self: flex-start;">Rhythm</span>
            <h3>Universal 1.5 leading</h3>
            <p class="body-muted body-sm">
              Display hero compresses to 1.10; everything else — body,
              headings, captions — rides on a single 1.50 line-height.
              That uniformity is the MiniMax signature, holding equally
              for Latin and CJK runs.
            </p>
            
          </article>
        </div>
      </section>

      <!-- FORM — accent-focused input, dark CTA, secondary action. -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Start a render in one prompt.</h2>
            <p class="lead" style="max-width: 46ch;">
              8px radius on inputs and buttons. Focus pulls in
              <code>#1456f0</code> as the border and a 3px translucent ring —
              the only place the brand blue earns its keep in a form.
            </p>
            <ul style="margin: 0; padding-inline-start: var(--space-5); color: var(--muted); font-size: var(--text-sm);" class="stack-3">
              <li>Single source of truth: <code>--focus-ring</code>.</li>
              <li>Submit reuses <code>.btn-primary</code> — no new variant.</li>
              <li>Placeholder uses <code>--meta</code> (tertiary tier).</li>
            </ul>
          </div>

          <div role="group" class="uma-preview-form form" aria-label="Render prompt">
            <div class="field">
              <label for="prompt">Prompt</label>
              <textarea
                id="prompt"
                rows="3"
                placeholder="A neon koi gliding through a Shanghai night market…"
              ></textarea>
              <p class="field-help">English or 中文 — Hailuo accepts either.</p>
            </div>
            <div class="field">
              <label for="email">Notify me at</label>
              <input
                id="email"
                type="email"
                placeholder="you@studio.dev"
                autocomplete="email"
                required
              />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Start render
              </button>
              <button type="button" class="btn btn-secondary">
                Save draft
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=minimax_default;return module.exports}});
//# sourceMappingURL=client.minimax.js.map