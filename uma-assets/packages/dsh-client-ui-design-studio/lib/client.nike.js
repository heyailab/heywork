
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.nike.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var nike_default={"contract":`## 1. Visual Theme & Atmosphere

Nike.com is a kinetic retail cathedral — a site that channels the explosive energy of sport into a digital shopping experience. The design operates on a principle of radical simplicity: strip everything back to black, white, and grey so that athletic photography and product color can dominate without competition. The result feels less like a website and more like a sports editorial laid out with the precision of a luxury magazine. Every pixel of real estate is either selling product or driving toward product.

The "Podium CDS" (Nike's internal Core Design System) establishes an aggressively monochromatic foundation. The UI disappears into black (\`#111111\`) text and white surfaces, allowing hero photography — sweating athletes, mid-air shoes, stadium energy — to carry the emotional weight. When color does appear in the UI, it's almost exclusively functional: red for errors, blue for links, green for success. The product itself is the color story. This restraint creates a visual paradox: the most colorful pages on the internet feel the most minimal, because all vibrancy comes from merchandise rather than interface.

The typography system is the other half of Nike's visual identity. Massive uppercase headlines in Nike Futura ND — a custom condensed Futura variant with impossibly tight line-height (0.90) — punch through hero imagery like a typographic shockwave. Below the headlines, the workhorse Helvetica Now family handles everything from navigation to product descriptions with Swiss-precision clarity. This split between expressive display type and functional body type mirrors Nike's brand duality: inspiration meets execution.

**Key Characteristics:**
- Monochromatic UI (black/white/grey) that lets product photography be the only color source
- Massive uppercase display typography (96px, line-height 0.90) that punches through hero images
- Full-bleed photography with no border radius — imagery fills every available edge
- Pill-shaped buttons (30px radius) as the primary interactive element
- 8px spacing grid with athletic discipline — every measurement snaps to the system
- Category-driven shopping architecture with large navigational image cards
- Shadow-free, border-minimal elevation model — surface differentiation through grey shifts only

## 4. Component Stylings

### Buttons

**Primary**
- Background: Nike Black (\`#111111\`)
- Text: White (\`#FFFFFF\`), 16px/500, Helvetica Now Text Medium
- Border: none
- Border radius: fully rounded pill (30px)
- Padding: ~12px 24px
- Hover: background shifts to Grey-500 (\`#707072\`), text hover color
- Active: scale(0) ripple effect with opacity 0.5
- Focus: 2px box-shadow ring in \`rgba(39, 93, 197, 1)\`
- Transition: background 200ms ease

**Primary on Dark**
- Background: White (\`#FFFFFF\`)
- Text: Black (\`#111111\`)
- Hover: background shifts to Grey-300 (\`#CACACB\`)

**Secondary (Outlined)**
- Background: transparent
- Text: Nike Black (\`#111111\`)
- Border: 1.5px solid \`#CACACB\` (grey-300)
- Border radius: 30px
- Hover: border darkens to \`#707072\`, background to grey-200

**Disabled**
- Background: Grey-200 (\`#E5E5E5\`)
- Text: Grey-400 (\`#9E9EA0\`)
- Cursor: not-allowed

**Icon Button**
- Background: Grey-100 (\`#F5F5F5\`)
- Shape: 30px radius (or 50% for circular)
- Padding: 6px
- Hover: Grey-500 background

### Cards & Containers

- Background: White (\`#FFFFFF\`) — no visible card boundary in most cases
- Border radius: 0px for product image cards (edge-to-edge imagery), 20px for interactive containers
- Shadow: none — Nike uses no card shadows whatsoever
- Hover: no lift effect on product cards; underline on text links within cards
- Product cards: image on top (no radius), text metadata below with 12px gap
- Category cards: full-bleed photography with text overlay on dark gradient
- Transition: opacity 200ms ease for image swap on hover

### Inputs & Forms

- Background: Grey-100 (\`#F5F5F5\`)
- Border: 1px solid \`#CACACB\` when visible, or borderless on search
- Border radius: 24px (search inputs), 8px (form inputs)
- Font: Helvetica Now Text, 16px
- Focus: border shifts to \`#111111\` (border-active), 2px focus ring in \`rgba(39, 93, 197, 1)\`
- Error: border \`#D30005\` (critical)
- Placeholder: Grey-500 (\`#707072\`)
- Transition: border-color 200ms ease

### Navigation

- Background: White (\`#FFFFFF\`), sticky
- Height: ~60px desktop
- Left: Nike Swoosh logo (24x24px SVG)
- Center: Category links (New & Featured, Men, Women, Kids, Sale) in 16px/500 Helvetica Now Text Medium
- Right: Search (24px radius input), Favorites, Cart icons
- Hover: text color shifts to Grey-500 (\`#707072\`)
- Mobile: hamburger menu, full-screen overlay
- Top banner: promotional message bar with dark background (#111111) and white text

### Image Treatment

- Hero images: full-bleed, no border radius, edge-to-edge
- Product grid: square (1:1) or 4:3 aspect ratio, no border radius
- Category cards: 16:9 or 4:3, full-bleed with text overlay
- Image placeholder: Grey-100 (\`#F5F5F5\`) solid background
- Lazy loading: native loading="lazy", skeleton uses #F5F5F5 bg
- Product hover: secondary image swap (front → side view)

### Promotional Banners

- Full-width dark (\`#111111\`) background with white text
- Tight padding (8-12px vertical)
- Centered text, 12px/500 Helvetica Now Text Medium
- Used for shipping promotions, member benefits, sale announcements

## 5. Layout Principles

### Spacing System

Base unit: 4px (primary grid is 8px multiples)

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Tight icon gaps, inline spacing |
| space-2 | 8px | Base unit, button icon gaps |
| space-3 | 12px | Card internal padding, tight margins |
| space-4 | 16px | Standard padding, nav spacing |
| space-5 | 20px | Product card gaps |
| space-6 | 24px | Section internal padding, grid gaps |
| space-7 | 32px | Section breaks |
| space-8 | 48px | Major section padding |
| space-9 | 64px | Hero section padding |
| space-10 | 80px | Large section spacing |

### Grid & Container

- Max container width: 1920px
- Standard content width: ~1440px with horizontal padding
- Product grid: 3-column on desktop, 2-column on tablet, 1-column on mobile
- Category grid: 3-column with full-bleed images
- Grid gap: 4-12px between product cards (intentionally tight)
- Horizontal padding: 48px desktop, 24px tablet, 16px mobile

### Whitespace Philosophy

Nike's whitespace strategy is deliberately aggressive — not in the luxurious, breathing way of a fashion brand, but in a compressed, high-density way that fills every pixel with either content or intentional absence. Product grids use minimal gaps (4-12px) to create a sense of abundance and choice. Section breaks are generous (48-80px) to separate shopping contexts. The overall effect is a store that feels packed with product while remaining navigable — like a well-organized athletic superstore.

### Border Radius Scale

| Value | Context |
|-------|---------|
| 0px | Product images, hero photography (sharp edges) |
| 8px | Form inputs (non-search) |
| 18px | Small interactive elements |
| 20px | Containers, cards with UI content |
| 24px | Search inputs, medium pills |
| 30px | Buttons, tags, filters (full pill) |
| 50% | Circular icon buttons, avatar placeholders |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, no border | Default state for everything |
| Divider | \`0px -1px 0px 0px #E5E5E5 inset\` | Subtle inset line between sections |
| Focus | \`0 0 0 2px rgba(39, 93, 197, 1)\` | Keyboard focus ring |
| Overlay | Dark scrim over photography | Text-on-image legibility |

Nike's elevation philosophy is radically flat. There are no card shadows, no hover lifts, no floating elements. Depth is communicated exclusively through color — dark sections recede, light sections advance, grey shifts indicate state changes. This flatness reinforces the athletic, no-nonsense brand personality: no visual frills, just direct communication. The only "shadow" in the entire system is a 1px inset divider line and the accessibility-required focus ring.

### Decorative Depth

- **Hero photography overlays**: Dark gradient scrims over full-bleed photography for text readability
- **Product background gradients**: Colored backgrounds behind hero product shots (e.g., red shoe on red gradient)
- **Banner bars**: Solid dark (#111111) promotional strips at page top

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hamburger nav, display text scales down, tight 16px padding |
| Small Tablet | 640-768px | 2-column product grid begins, nav still collapsed |
| Tablet | 768-960px | 2-column grids, category cards scale, horizontal padding 24px |
| Small Desktop | 960-1024px | Nav expands to full horizontal, 3-column product grid |
| Desktop | 1024-1440px | Full layout, expanded nav, 3-column grids, 48px padding |
| Large Desktop | >1440px | Max-width container centered, increased margins, hero images full-bleed |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA)
- Mobile nav icons: 48x48px touch area
- Product cards: full surface is tappable
- Filter pills: minimum 36px height with 12px padding

### Collapsing Strategy

- **Navigation**: Full category links → hamburger menu below 960px; search, favorites, cart icons remain visible
- **Product grids**: 3-col → 2-col at 960px → 1-col at 640px
- **Hero sections**: Display text scales from 96px → 64px → 48px; hero images remain full-bleed at all sizes
- **Category cards**: 3-col → 2-col → 1-col with maintained full-bleed imagery
- **Section padding**: 80px → 48px → 32px → 24px as viewport narrows
- **Promotional banner**: text wraps or truncates, maintains dark background

### Image Behavior

- Responsive images via Nike CDN (\`c.static-nike.com\`) with width parameters
- Product images: srcset with multiple resolutions (w_320, w_640, w_960, w_1920)
- Hero images: full-bleed at all breakpoints, aspect ratio shifts (16:9 desktop → 4:3 mobile)
- Lazy loading: native loading="lazy", grey-100 placeholder during load
- Art direction: hero crops change between desktop and mobile compositions`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nike — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/nike. Monochromatic UI
        (black / white / grey only), massive uppercase Nike Futura ND display
        type at 96px / 0.90 line-height, pill-shaped buttons (30px radius),
        zero card shadows. Just keep going."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f5f5f5;
        --surface-warm: #fafafa;

        --fg: #111111;
        --fg-2: var(--fg);
        --muted: #707072;
        --meta: #9e9ea0;

        --border: #cacacb;
        --border-soft: #e5e5e5;

        --accent: #111111;
        --accent-on: #ffffff;
        --accent-hover: #707072;
        --accent-active: #000000;

        --success: #007d48;
        --warn: #fca600;
        --danger: #d30005;

        --font-display:
          "Nike Futura ND", "Helvetica Now Display Medium", "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:
          "Helvetica Now Text Medium", "Helvetica Now Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:
          ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 48px;
        --text-4xl: 96px;

        --leading-body: 1.75;
        --leading-tight: 0.9;

        --tracking-display: -0.02em;

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

        --radius-sm: 8px;
        --radius-md: 20px;
        --radius-lg: 24px;
        --radius-pill: 30px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0 1px var(--border);

        --focus-ring: 0 0 0 2px rgba(39, 93, 197, 1);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1440px;
        --container-gutter-desktop: 48px;
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
        font-weight: 500;            /* Nike's body weight — Helvetica Now Text Medium */
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ─── Promo bar — Nike's signature dark band atop every page ─
         §4: "Top banner: promotional message bar with dark background
         (#111111) and white text", 8–12px vertical padding, 12px/500
         centered text. */
      .promo-bar {
        background: var(--fg);
        color: var(--bg);
        font-size: var(--text-xs);
        font-weight: 500;
        text-align: center;
        padding: var(--space-2) var(--space-4);
        letter-spacing: 0.02em;
      }
      .promo-bar a { color: var(--bg); text-decoration: underline; text-underline-offset: 2px; }

      /* ─── Layout ─────────────────────────────────────────────── */
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

      /* ─── Typography ─────────────────────────────────────────────
         Nike's display layer is uppercase Nike Futura ND at 96px with
         0.90 line-height — the "stadium scoreboard" §3 calls for.
         Below the display layer, Helvetica Now (body) handles
         everything at weight 500 (the brand's documented dominant
         weight for interactive copy). */
      h1, h2, h3 {
        margin: 0;
        color: var(--fg);
      }
      /* h1 — Hero Display, uppercase Futura, ascenders nearly touch
         descenders. Nike Futura ND below 24px is forbidden (§7), so
         h1 is the ONLY place this size and treatment appear. */
      h1 {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 500;
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        text-transform: uppercase;
      }
      /* h2 — section heading, Helvetica Now Display Medium tier
         (the second slot in --font-display falls onto it when
         Futura ND is absent). Title-case, NOT uppercase. */
      h2 {
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        font-weight: 500;
        line-height: 1.2;
      }
      /* h3 — card title at the body baseline, weight 500. */
      h3 {
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1.5;
      }
      p { margin: 0; }

      .lead {
        font-size: var(--text-lg);
        line-height: 1.5;
        color: var(--muted);
        font-weight: 500;
      }
      .body-muted { color: var(--muted); }
      .body-meta  { color: var(--meta); font-size: var(--text-sm); }
      .body-sm    { font-size: var(--text-sm); }

      /* \`.eyebrow\` — small uppercase label above section heads. The
         only place Nike pushes positive tracking (uppercase needs the
         breathing room); display copy below uses negative tracking. */
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }
      .stack-8 > * + * { margin-block-start: var(--space-8); }

      /* ─── Buttons — pill geometry, monochrome only ───────────────
         Nike's pill (30px radius) is the SOLE button silhouette across
         the whole brand (§4). Primary uses --accent (Nike Black) with
         the hover shifting to grey-500 — the documented behaviour, not
         a darken. Secondary is the 1.5px outlined variant from §4. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 24px;
        border: none;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;            /* §7 — never weight 400 on buttons */
        line-height: 1.2;
        cursor: pointer;
        text-decoration: none;
        transition:
          background-color var(--motion-base) var(--ease-standard),
          color            var(--motion-base) var(--ease-standard),
          border-color     var(--motion-base) var(--ease-standard),
          box-shadow       var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { opacity: 0.85; }

      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover  { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }

      /* §4 — secondary outlined: 1.5px solid grey-300, 30px pill. */
      .btn-secondary {
        background: transparent;
        color: var(--fg);
        border: 1.5px solid var(--border);
        padding: 10.5px 22.5px;       /* compensates for the 1.5px border */
      }
      .btn-secondary:hover {
        border-color: var(--muted);
        background: var(--surface);
      }

      /* ─── Inputs — fill-led, soft hairline ───────────────────────
         §4 — non-search inputs use grey-100 fill, 8px radius
         (--radius-sm), border-active darkens to Nike Black on focus,
         and the focus ring is the documented blue 2px halo. */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        padding: 14px 16px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1.2;
        outline: none;
        transition:
          border-color var(--motion-base) var(--ease-standard),
          background-color var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--muted); font-weight: 500; }
      .field input:hover { border-color: var(--muted); }
      .field input:focus-visible {
        border-color: var(--fg);     /* Border Active = Nike Black, §2 */
        background: var(--bg);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — flat, surface-defined, NO shadow ───────────────
         §6 — "Nike's elevation philosophy is radically flat. There
         are no card shadows, no hover lifts, no floating elements."
         Cards differentiate from --bg by sitting on --surface, with
         a 20px (--radius-md) corner for "interactive containers"
         per §5. */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        /* No box-shadow, no border, no hover lift — by Nike contract. */
      }

      /* ─── Badges — pill-shaped status indicators ─────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.4;
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), transparent 88%);
      }
      .badge-muted {
        color: var(--muted);
        background: var(--surface);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links — black text, hover underline, kbd ─────────────
         §4 nav: "text color shifts to Grey-500 (#707072)" on hover.
         No blue inline links here — Nike keeps reading copy
         monochrome and reserves --focus-ring blue for keyboard focus
         alone. */
      a { color: var(--fg); text-decoration: none; transition: color var(--motion-base) var(--ease-standard); }
      a:hover { color: var(--muted); text-decoration: underline; text-underline-offset: 3px; }

      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }

      /* ─── Layout helpers — hero, features, .uma-preview-form ───────────────── */
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
        background: var(--surface);
        border-radius: var(--radius-md);
        /* No border, no shadow — surface contrast does the work. */
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-2);          /* Nike's "tight 4-12px" product-grid gap */
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
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); flex-wrap: wrap; }

      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* \`.swoosh\` — a stylized swoosh divider rule that anchors the
         hero. Pure CSS, no real Nike marks, just a visual nod to the
         brand's geometric language. */
      .swoosh {
        width: 64px;
        height: 4px;
        background: var(--fg);
        border-radius: var(--radius-pill);
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
    <div class="promo-bar" role="region" aria-label="Promotional banner">
      Free shipping for members. <a href="#join">Join us.</a>
    </div>

    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-6">
            <div class="stack-3">
              <span class="swoosh" aria-hidden="true"></span>
              <p class="eyebrow">Reference fixture · nike</p>
            </div>
            <h1>Just keep going.</h1>
            <p class="lead" style="max-width: 44ch">
              Built for the ones who don't quit. From dawn miles to sold-out
              stadiums, every stitch earns its place — and every pixel of
              this page is here to sell sport, nothing else.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Member benefits">
            <div class="row-between">
              <span class="body-sm" style="font-weight: 500">Member status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Active
              </span>
            </div>
            <p class="body-meta">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-meta">Press <kbd>⌘</kbd> <kbd>K</kbd> to search the spec.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Restraint as an athletic discipline.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Monochrome on purpose</h3>
            <p class="body-muted body-sm">
              --bg (#ffffff) → --surface (#f5f5f5) → --fg (#111111).
              The UI carries no color so product photography can. Red, green,
              blue are reserved for semantic moments only.
            </p>
            
          </article>
          <article class="card">
            <h3>Display type that punches</h3>
            <p class="body-muted body-sm">
              Nike Futura ND at 96px / 0.90 line-height, uppercase, tightened
              tracking. A typographic shockwave reserved exclusively for the
              hero — never below 24px.
            </p>
            
          </article>
          <article class="card">
            <h3>Pills, no shadows</h3>
            <p class="body-muted body-sm">
              --radius-pill is bound to 30px (the literal Nike value, not
              9999). --elev-raised collapses onto --elev-ring because the
              brand refuses card shadows outright.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form" id="join">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Become a member</p>
            <h2>Free shipping. First access. No nonsense.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Members hear about drops first, get free shipping on every order,
              and unlock the Nike Run Club / Training Club apps. One account,
              every sport.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@nike.com" autocomplete="email" required />
              <p class="field-help">We'll send membership perks. No marketing noise.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Sign me up</button>
              <button type="button" class="btn btn-secondary">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=nike_default;return module.exports}});
//# sourceMappingURL=client.nike.js.map