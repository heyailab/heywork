
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.mastercard.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var mastercard_default={"contract":`## 1. Visual Theme & Atmosphere

Mastercard's experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (\`#F3F0EE\`) — not white, not gray, but a color that feels like the paper of a premium annual report. On top of that canvas, everything that matters is shaped like a stadium, a pill, or a perfect circle. The dominant visual gesture is the **oversized radius**: heroes carry 40-point corners, cards go fully pill-shaped, service images are cropped into circular orbits, and buttons either complete the pill or fit snugly at 20 points. There are almost no sharp corners anywhere on the page.

The second gesture is **orbit and trajectory**. Circular image masks don't sit still — they're connected by thin, hand-drawn-feeling orange arcs that span entire viewport widths, implying a constellation of services rather than a list. Each circle has a small attached "satellite" — a white micro-CTA holding an arrow icon — docked onto its perimeter like a moon. This is the most distinctive thing about Mastercard's current design language: the circles feel like they're in motion even though the page is still.

Typography is rendered entirely in **MarkForMC**, Mastercard's proprietary geometric sans. Headlines are set at a medium weight (500) with tight negative letter-spacing (-2%), giving them confidence without shouting. Body copy runs at the same family in a slightly lighter weight (450) — a weight you rarely see on the web, chosen because it reads softer than regular 400 without feeling thin. The whole system — warm cream surfaces, pill shapes, circular portraits, traced-orange orbits, black CTAs — feels simultaneously institutional (a 60-year-old payments network) and editorial (a modern brand magazine), which is exactly the tension Mastercard wants to hold.

**Key Characteristics:**
- Warm cream canvas (\`#F3F0EE\`) replaces traditional white — every surface is tinted, never sterile
- Extreme border-radius as design language: 40px, 99px, 1000px dominate; anything square is a cookie-banner third-party
- Circular image portraits with attached white satellite-CTAs and traced-orange orbital paths
- Ghost "watermark" headlines (cream-on-cream text at heading scale) layered behind circle portraits
- Black primary CTAs with 20px radius in the body — the cookie-banner orange is kept to consent flows
- Floating pill-shaped navigation that docks below the viewport top with rounded shoulders
- Eyebrow labels with a tiny accent dot + uppercase bold tracking — used as the section-category signal
- Dark warm-black footer (\`#141413\`) with four-column link layout and large conversational headline

## 4. Component Stylings

### Buttons

**Primary — Ink Pill**
- Background: Ink Black (\`#141413\`)
- Text: Canvas Cream (\`#F3F0EE\`) — not pure white
- Border: 1.5px solid Ink Black (same as bg, creates crisp edge)
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 500 / letter-spacing -0.32px
- Default: as above; solid warm-black pill on cream canvas
- Active / pressed: subtle inward-shrink or 2px offset (not a hover variant)
- Use for: all marketing CTAs in the page body ("Learn more", "Explore", "Discover")

**Secondary — Outlined Pill**
- Background: White (\`#FFFFFF\`)
- Text: Ink Black (\`#141413\`)
- Border: 1.5px solid Ink Black
- Radius: 20px
- Padding: 6px 24px
- Font: MarkForMC 16px / weight 450 / line-height 20.8px
- Default: white-on-cream pill with crisp ink outline
- Active / pressed: subtle compression
- Use for: secondary actions paired with a primary, or standalone utility CTAs

**Consent / Signal — Orange Pill**
- Background: Signal Orange (\`#CF4500\`)
- Text: White (\`#FFFFFF\`)
- Border: 0
- Radius: 24px
- Padding: 1px 30px (very tight vertical, wide horizontal)
- Font: MarkForMC 13px / weight 400 / letter-spacing 0.13px
- Default: as above; bright rust pill with white text
- Use for: cookie consent, privacy preference, and other legally-distinct confirmations. **Do not** use this orange for marketing CTAs — it reads as a compliance color.

**Satellite — Circular Micro-CTA**
- Background: White (\`#FFFFFF\`)
- Icon: Ink Black arrow (\`→\`) at ~20px
- Border: none
- Radius: 50% (perfect circle)
- Size: ~50–60px diameter
- Shadow: none or very subtle (the portrait's shadow carries the elevation)
- Default: docks onto the bottom-right edge of a circular portrait, protruding partway outside the portrait's circle
- Use for: the primary entry point into service/solution cards; always paired with a circular portrait

**Icon-Only Circle Button (carousel, play/pause)**
- Background: transparent or white
- Icon: 10–20px centered
- Border: 1px solid Ink Black (when on cream) or none (when over media)
- Radius: 50%
- Size: 40px diameter minimum for carousel controls; 80px for hero video play
- Use for: carousel pagination/play-pause, hero video play, search toggle

### Cards & Containers

**Hero Media Frame (Stadium)**
- Background: Dark video or full-bleed imagery (typically black \`#000000\` or \`#2B2B2B\` behind video)
- Radius: 40px all corners (creates a stadium shape on wide viewports)
- Width: ~full viewport minus ~48px gutter on each side
- Height: ~60–70% of viewport
- Shadow: none (sits directly on canvas)
- Corners: the extreme 40px radius on a media element is the most iconic Mastercard gesture — do not round less

**Service / Solution Portrait Card**
- Shape: Perfect circle (radius 50%) or ellipse (radius 999px / 1000px)
- Diameter: 260–340px desktop; ~220px mobile
- Image crop: square source, cropped to circle
- Attached element: White satellite circular CTA (see above) docked bottom-right, ~40% outside the portrait
- Eyebrow below: accent dot + uppercase label (e.g., "• SERVICES", "• SOLUTIONS")
- Title below: H3 (24px / weight 500 / -2% tracking), 1–2 lines max
- Decorative orbit: thin ~1px Light Signal Orange curved line spanning from this card outward to the next, implying connection

**Pill Carousel Card**
- Radius: 1000px (full pill) or 40px corners (rounded stadium)
- Width: ~40–60% of viewport
- Height: ~380–420px (portrait-pill orientation)
- Content: full-bleed photography with small overlaid chip labels
- Chip inside: White pill (~ 999px radius), Ink Black text, padding 8px 20px, used for category tags like "Story"
- Large inline CTA inside: Ink Pill button, oversized (padding 16px 40px, radius 40px)

**Ghost Watermark Text Block**
- Font: MarkForMC 72–128px / weight 500 / tight -2% tracking
- Color: Canvas Cream slightly darkened (\`#E8E2DA\` or similar — cream-on-cream)
- Position: layered behind portrait circles, bleeding off the viewport edge
- Purpose: sets section theme without competing with foreground copy

### Inputs & Forms
Minimal form surface on the marketing page. The search input in the nav header is:
- Initial state: a 48px circular button with a magnifier icon
- Expanded state: horizontal input field, border \`1px solid\` Ink Black at ~50% opacity, radius 999px, padding 12px 24px, white background

**Country/language selector (footer)**
- Background: Ink Black (same as footer)
- Text: White
- Border: 1px solid \`rgba(255,255,255,0.4)\`
- Radius: 999px (full pill)
- Icon: downward chevron on the right

### Navigation

**Floating Nav Pill (desktop)**
- Container: white-to-translucent-white pill floating below the very top of the viewport with a ~24px top margin
- Radius: 999px / 1000px (full pill)
- Padding: ~16px 40px internal
- Shadow: very soft (\`rgba(0, 0, 0, 0.04) 0px 4px 24px 0px\`) — just enough to lift it off the cream canvas
- Content: Mastercard logo left, primary link group center ("For you", "For business", "For the world", "For innovators", "News and trends"), search icon right
- Link spacing: ~48–56px gap between primary links
- Link style: Ink Black, weight 500, 16px, no underline, no pill surround until active

**Mobile Nav**
- The same pill shape but collapsed to: logo + hamburger menu button + search icon only
- Menu opens into a full-screen overlay with the primary links stacked vertically

### Image Treatment

- **Aspect ratios used**: 1:1 (all service portraits — cropped to circle), ~3:4 or ~4:5 (carousel pill cards), 16:9 or wider (hero video frame)
- **Full-bleed vs padded**: Hero is viewport-wide with gutters; service portraits are always centered in their column with generous whitespace around; footer imagery is rare
- **Masking**: Aggressive circular masking is the defining treatment — square source images are cropped to perfect circles of matching diameter. Never use rectangular service imagery.
- **Lazy loading**: Standard \`loading="lazy"\` with a soft blur-up transition from a cream-tinted placeholder, preserving the warm palette during load

### Decorative Orbital Lines

A signature motif: thin (~1–1.5px) single-weight curved lines in Light Signal Orange (\`#F37338\`) tracing arcs between circular portraits. These lines:
- Imply connection between service cards without literal arrows
- Span widths from ~200px up to full-viewport arcs
- Feel hand-drawn (subtle irregularity) rather than perfect CSS curves
- Appear only in sections with circular portrait content — never on pill sections, never in the footer

### Footer

- Background: Ink Black (\`#141413\`)
- Text: White
- Padding: 48px horizontal 100px / bottom 148px (very tall bottom space)
- Structure: large conversational H2 ("We're always here when you need us") left-aligned, then a 4-column link grid below
- Column headers: uppercase, muted, weight 700, letter-spacing +4%
- Link rows: white, weight 450, 14px; entries prefixed with a small icon (support bubble, card, map pin, question mark) for the "NEED HELP?" column
- External link marker: a small upper-right arrow (\`↗\`) after link text
- Bottom row (below a 1px white-at-opacity divider): copyright + privacy small-print + country-language pill dropdown + four social icons (LinkedIn, Facebook, X, YouTube)

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px (confirmed by dembrandt extraction and computed styles)
- **Scale**: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (powers of 8)
- **Section vertical padding**: ~96–128px between major sections on desktop; ~48–64px on mobile
- **Card internal padding**: 32–40px on desktop, ~24px on mobile
- **Nav top margin**: ~24px from viewport top (the pill floats, doesn't touch)

### Grid & Container
- **Max content width**: ~1200–1280px centered, with ~48–100px horizontal gutter
- **Column pattern**: 12-column implied, but practical layouts use 2-up asymmetric (large headline left, supporting text right), 1-up full-bleed (hero, video), or staggered single-portrait placement (service cards sit in varying grid positions creating the "constellation" feel)
- **Footer grid**: 4 equal columns on desktop, collapses to single column accordion on mobile

### Whitespace Philosophy
Mastercard treats whitespace as structure, not absence. A typical service section has:
- A ghost headline occupying the top ~40% of the section (mostly empty cream)
- A single circular portrait positioned ~60% down, asymmetric to left or right
- ~300–500px of blank canvas between the portrait and the next section
This deliberate emptiness tells the eye "slow down, read one thing at a time" — the opposite of dense dashboard UIs.

### Border Radius Scale

| Radius | Use |
|--------|-----|
| 3–6px | Tiny decorative elements, cookie banner micro-chips |
| 20px | Primary and secondary body CTAs (the signature button radius) |
| 24px | Consent/orange pill buttons, modal inner chips |
| 40px | Hero media frames, large section container corners, H2 pill labels |
| 50% | Circular portraits, icon-only buttons, satellite CTAs |
| 99px / 999px / 1000px | Full pill shapes — navigation, carousel cards, footer country selector, primary inline chips |

The scale is unusual: most systems use 4/8/12/16. Mastercard skips those and commits to **either small (≤6), medium-large (20–40), or full-pill (99+)**. The middle ground of 8–12 is absent, which is why the UI feels either "precise and utility" or "soft and editorial" with no in-between.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | No shadow | The default — 95% of surfaces sit directly on cream canvas |
| 1 | \`rgba(0, 0, 0, 0.04) 0px 4px 24px 0px\` | Floating nav pill — barely-there lift |
| 2 | \`rgba(0, 0, 0, 0.08) 0px 24px 48px 0px\` | Hero media frames, elevated cards — a soft large-radius halo rather than a hard drop |
| 3 | \`rgba(0, 0, 0, 0.25) 0px 70px 110px 0px\` | Rare; dramatic elevation on a feature tile |

### Shadow Philosophy
Mastercard uses shadows as **atmospheric cushioning**, not directional light. The Level 2 shadow has a 48px spread and only 8% opacity — it barely exists as dark pixels but creates a "the card is breathing above the canvas" feel. There are almost no hard-edged, tight shadows anywhere in the system. Border lines are preferred over shadows for functional delineation (form inputs, footer divider).

### Decorative Depth
- **Orbital arcs** (Light Signal Orange, ~1px): trace connective paths across sections
- **Ghost watermark headlines**: cream-on-cream text gives sections an almost-pressed-paper quality
- **Circle-image fade**: warm-toned photography at the edge of circular portraits dissolves into the canvas, implying soft atmospheric depth

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | ≤ 767px | Nav pill shows logo + menu + search only; primary links hide behind hamburger; service portraits stack single-column centered; hero headline drops from 64px to ~40px; footer columns collapse into a vertical accordion |
| Tablet | 768–1023px | Nav pill shows 2–3 primary links truncated; service portraits arrange 2-up; hero headline ~48px |
| Desktop | ≥ 1024px | Full nav with 5 primary links centered; service portraits asymmetrically placed with decorative orbital lines; hero headline 64px |
| Wide | ≥ 1440px | Content max-width caps at ~1280px; gutters grow symmetrically; orbital lines extend further |

### Touch Targets
All interactive elements comfortably exceed 44×44px. The satellite CTA (circle + arrow) is ~50–60px. The nav pill buttons are ~48px tall. Mobile hamburger and search are 48×48px. No link or button drops below 40px in any breakpoint.

### Collapsing Strategy
- **Nav**: full pill → compact pill with hamburger. Pill shape is preserved across breakpoints — always rounded, always floating.
- **Service grid**: asymmetric constellation → 2-up → 1-up stack. Orbital arcs are removed on mobile (they only work with asymmetric placement).
- **Spacing**: section vertical padding compresses from 128px to 48px on mobile.
- **Content**: two-column hero (headline left / supporting text right) becomes stacked (headline on top, supporting text below).
- **Footer**: 4 columns → 1 column accordion with chevron toggles per section.

### Image Behavior
Circular portraits scale proportionally (maintaining the perfect circle at every size). Hero video frames maintain their 40px radius at every breakpoint, but the frame itself shrinks with the viewport. Lazy loading is standard with a cream-tinted blur-up placeholder, preserving the palette during load.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mastercard - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/mastercard: putty-cream editorial canvas, orbital geometry, and warm payment-network restraint."
    />
    <style>
      :root {
        --bg: #f3f0ee;
        --surface: #fcfbfa;
        --surface-warm: #f7e8de;
        --fg: #141413;
        --fg-2: #262627;
        --muted: #696969;
        --meta: #9a3a0a;
        --border: #d1cdc7;
        --border-soft: #e7e1dc;
        --accent: #cf4500;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #2e7d32;
        --warn: #f79e1b;
        --danger: #eb001b;
        --font-display: "MarkForMC", "Sofia Sans", Arial, sans-serif;
        --font-body: "MarkForMC", "Sofia Sans", Arial, sans-serif;
        --font-mono: "MarkOffcForMC", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 48px;
        --text-4xl: 64px;
        --leading-body: 1.4;
        --leading-tight: 1;
        --tracking-display: -0.02em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 104px;
        --section-y-tablet: 72px;
        --section-y-phone: 52px;
        --radius-sm: 20px;
        --radius-md: 40px;
        --radius-lg: 64px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 24px 48px rgba(20, 20, 19, 0.10);
        --focus-ring: 0 0 0 4px rgba(207, 69, 0, 0.24);
        --motion-fast: 180ms;
        --motion-base: 260ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 28px;
        --container-gutter-phone: 20px;
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
        background: radial-gradient(circle at 12% 30%, #eb001b 0 9%, transparent 10%), radial-gradient(circle at 21% 30%, #f79e1b 0 9%, transparent 10%), linear-gradient(135deg, #f3f0ee 0%, #fcfbfa 100%);
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
            <p class="eyebrow">Mastercard design system</p>
            <h1>Payments orbit</h1>
            <p class="lead">Warm editorial finance built from circles, pills, and signal orange.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary warm black pill</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Mastercard component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>orbital cream capsule</h3>
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
                <p>putty-cream editorial canvas, orbital geometry, and warm payment-network restraint.</p>
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
                  <label for="mastercard-input">Reference input</label>
                  <input id="mastercard-input" value="Mastercard system token" />
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
`};exports.default=mastercard_default;return module.exports}});
//# sourceMappingURL=client.mastercard.js.map