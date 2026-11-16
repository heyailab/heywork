
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.theverge.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var theverge_default={"contract":`## 1. Visual Theme & Atmosphere

The Verge's 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (\`#131313\`), the headlines are built from a brutally heavy display face (Manuka) that runs up to 107px, and the whole page is peppered with acid-mint \`#3cffd0\` and ultraviolet \`#5200ff\` that behave less like brand colors and more like hazard tape. Story tiles are not quiet gray cards — they're saturated, full-bleed color blocks (yellow, pink, orange, blue, purple) that feel like pasted-up rave flyers arranged into a timeline. The mood is "developer console meets club night meets tech tabloid": serious enough to cover a congressional hearing, loud enough to review a synthesizer.

What makes this system unmistakable is the **StoryStream** timeline: a vertical feed where every post is a rounded rectangle — often 20–40px radius — filled edge-to-edge with color, framed by a thin border, and marked by a mono-uppercase timestamp on its left rail. Stories don't float on a grid; they stack on a dashed vertical rule like commits in a git log. Above that, a massive **"The Verge" wordmark** dominates the masthead in Manuka at hero scale, letting the reader know before any headline loads that this is editorial territory, not a template.

There is no "light mode" on the homepage — the dark canvas is the product, and the only time the palette inverts is when a single story tile takes a mint or yellow fill. The depth is almost entirely flat: **hairline 1px borders** (\`#ffffff\`, \`#3cffd0\`, or \`#5200ff\`) do the work that shadows would do on a Material-flavored site. Every container is either \`#131313\` with a 1px outline, a fully saturated accent block, or a slate-gray \`#2d2d2d\` secondary surface.

**Key Characteristics:**
- Near-black editorial canvas (\`#131313\`) as the default surface — no light mode on the homepage
- Acid-mint \`#3cffd0\` + ultraviolet \`#5200ff\` as hazard-tape accents, never quiet background wash
- Massive Manuka display headlines up to 107px — the single loudest type move in mainstream tech media
- Rounded pill-card everything: 20/24/30/40px corner radii, never square
- Fully saturated color-block story tiles (mint, purple, yellow, pink, orange, electric blue) on a dark page
- Timeline "StoryStream" feed with mono uppercase timestamps rather than a traditional magazine grid
- Flat depth — 1px borders in white, mint, purple do the work that shadows would do elsewhere

## 4. Component Stylings

### Buttons

**Primary — Jelly Mint Pill**
- Background: \`#3cffd0\` (Jelly Mint)
- Text: \`#000000\` (Absolute Black), PolySans 16px / 700 or PolySans Mono 12px / 600 UPPERCASE
- Border: none (pure fill)
- Border radius: \`24px\` — fully rounded pill
- Padding: \`10px 24px\`
- Outline: \`none\` at rest
- Hover: background shifts to \`rgba(255, 255, 255, 0.2)\` (translucent white), text stays black, adds a 1px \`#c2c2c2\` ring shadow
- Active: background \`rgba(140, 140, 140, 0.87)\`, opacity \`0.5\`, ring shadow \`#8c8c8c\`
- Focus: background \`#1eaedb\`, white text, 1px solid \`#0500ff\` border, translucent white focus ring
- Transition: ~180ms ease on background and shadow

**Secondary — Dark Slate Pill**
- Background: \`#2d2d2d\` (Surface Slate)
- Text: \`#e9e9e9\` (Muted Text), PolySans 16px / 400
- Border: none
- Border radius: \`24px\`
- Padding: \`10px 24px\`
- Outline: \`rgb(233, 233, 233) none 0px\`
- Hover: same translucent white invert as primary — \`rgba(255, 255, 255, 0.2)\` bg, black text, 1px \`#c2c2c2\` ring
- Focus: same cyan focus treatment as primary

**Tertiary — Outlined Mint**
- Background: transparent
- Text: \`#3cffd0\`, PolySans Mono 12px / 600 UPPERCASE, 1.5px tracking
- Border: \`1px solid #3cffd0\`
- Border radius: \`40px\` — larger pill for secondary outline style
- Padding: ~\`10px 20px\`
- Hover: inverts to mint fill, black text
- Transition: 150ms ease

**Outlined Ultraviolet (Promotional)**
- Background: transparent
- Text: \`#5200ff\` or \`#ffffff\`
- Border: \`1px solid #5200ff\`
- Border radius: \`30px\`
- Used for "Subscribe" or "Join the Stream" style promotional callouts

**Pill Tag (Non-interactive)**
- Background: saturated accent (\`#3cffd0\`, \`#5200ff\`, yellow, etc.)
- Text: black or white depending on background luminance
- Border radius: \`20px\` (tighter radius than buttons — this is the *text pill*)
- Font: PolySans Mono 11px / 600 UPPERCASE, 1.8px tracking
- Padding: ~\`4px 10px\`

### Cards & Containers

**StoryStream Tile**
- Background: either \`#131313\` + 1px white border, OR a saturated accent fill (mint, purple, yellow, pink, orange, white)
- Border radius: \`20px\` (standard) or \`24px\` (feature)
- Border: \`1px solid #ffffff\` (on dark) or \`0px 0px 1px solid #3cffd0\` (on mint) or nothing (on saturated fill)
- Padding: ~24–32px interior
- Hover: no lift, no scale — the headline text color transitions from white to \`#3860be\` (deep link blue)
- Transition: 150ms ease on color only

**Feature Card (Top Story)**
- Background: \`#131313\` with 1px hairline border, OR full-bleed color accent
- Border radius: \`24px\`
- Padding: 32px+
- Image inside: clipped to match the outer radius (\`3px\` or \`4px\` inner radius when nested)
- Hover: text color shift only; the image remains static

**StoryStream Rail (Timeline)**
- A vertical dashed or solid rule (1px \`#3d00bf\` or \`#ffffff\`) runs along the left edge of each item, marking the timeline spine
- Timestamps sit on the left rail in PolySans Mono 11px / 500 / UPPERCASE / 1.1px tracking
- Each entry is a pill-cornered rectangle separated from its neighbors by 12–16px vertical gap

### Inputs & Forms
- **Default**: \`#131313\` background, 1px solid \`#ffffff\` or \`#949494\` border, \`2px\` border radius (tight, newspaper-form feel), PolySans 15px text in \`#ffffff\`, placeholder in \`#949494\`.
- **Focus**: border transitions to \`#3cffd0\` (jelly mint) with optional \`1px solid #5200ff\` inner ring on deep focus. No glow.
- **Error**: border turns \`#5200ff\` (ultraviolet — used as error/alert accent here, not the usual red).
- **Transition**: ~150ms ease on border-color.

### Navigation

- **Top nav**: thin \`#131313\` bar with the Verge wordmark (Manuka) left-aligned, a search icon and a few UPPERCASE mono category links (12–14px, PolySans Mono, 1.5–1.8px tracking), and a single mint-pill CTA (usually "Subscribe") pinned right.
- **Wordmark**: massive on first scroll — the homepage treats the "The Verge" logo as a hero element, not a 32px corner logo.
- **Hover**: every link transitions from \`#ffffff\` to \`#3860be\` (deep link blue). No underline — it's a color-only response.
- **Active section**: marked by a 1px mint underline (inset box-shadow \`0px -1px 0px 0px inset #3cffd0\`)
- **Mobile**: the wordmark shrinks, category nav collapses into a hamburger drawer. Inside the drawer, links are mono-uppercase and stack with 16–20px gaps.

### Image Treatment

- **Aspect ratios**: 16:9 dominates for hero and feature images, 4:3 for mid-feed, 1:1 for thumbnails and author avatars.
- **Corners**: always rounded to match the parent card — \`3px\`, \`4px\`, or inherit \`20px\` / \`24px\` from the tile.
- **Frame**: 1px \`#313131\` or \`#ffffff\` hairline around photography, giving a "contained Polaroid" feel.
- **Full-bleed**: only within the color-block tiles, where the image runs to the padded edge of the accent fill.
- **Hover**: static — no zoom, no scale, no opacity shift. The headline below is the only interactive response.
- **Lazy loading**: \`loading="lazy"\` on everything below the first fold; eager on the masthead hero only.

### StoryStream Timeline Item (Distinctive)

- Vertical rail line (1px \`#3d00bf\` or \`#ffffff\` on \`#131313\`)
- Mono timestamp on the left in PolySans Mono 11px / UPPERCASE
- Pill-cornered body card (20px radius) with kicker, headline, and optional deck
- Stacked vertically with 12–16px gap, the rail continuing between them
- Often interleaved with full-bleed accent tiles that "break" the timeline rhythm for emphasis

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale**: 1, 2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 20, 24, 25px.
- **Section padding**: 32–64px vertical between major feed sections. StoryStream items themselves are tighter — 12–16px gaps.
- **Card padding**: 20–32px interior. Feature cards expand to 40–48px.
- **Inline spacing**: kickers sit ~6–10px above headlines; headlines sit ~10–14px above decks; timestamps sit ~6–8px below decks.
- **Micro-scale**: The 2/4/5/6/9/10px values are used inside buttons, pills, and tight label clusters, not in the editorial grid.

### Grid & Container
- **Max width**: ~1280–1300px (dembrandt detected breakpoints at 1200/1280/1300).
- **Column patterns**: a 12-column underlying grid that resolves into 3-column hero + 1-column StoryStream rail + feature panels. The homepage feels freeform because color-block tiles frequently span 2–3 columns on a whim.
- **Container padding**: 24px mobile / 48px desktop on the outer edges.
- **Gutters**: 16–24px between columns, tighter (8–12px) inside StoryStream items.

### Whitespace Philosophy
The Verge treats whitespace like a club DJ treats silence — as a dramatic reset between loud moments. The canvas is so dark and the accents are so saturated that even 32px of empty \`#131313\` between two tiles acts as a palette cleanser. The page is not airy like Apple or Stripe; it's **paced**, with loud hazard-color blocks interrupting stretches of near-black. Whitespace carries the rhythm, not the elegance.

### Border Radius Scale
- **2px** — inputs, small badges (feels like a typewriter tag)
- **3px** — inline images (just enough to soften against the canvas)
- **4px** — nested card images and small button variants
- **20px** — standard pill cards and color-block tiles
- **24px** — feature tile radius and primary button pill
- **30px** — large promotional buttons
- **40px** — outlined CTA pills (the loudest pill in the system)
- **50%** — avatar circles, icon buttons, and certain round badges

Eight discrete radius values — a **lot** for a single site. This is deliberate: the rhythm between 2px typewriter tags, 20px pill cards, and 40px outlined buttons creates a "nested scale" feel where every component announces its hierarchy through its corners.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No border, no shadow | Default \`#131313\` canvas text |
| 1 | \`rgba(0,0,0,0) 0px 0px 0px 0px inset\` (placeholder) | Reset state for interactive elements |
| 2 | \`1px solid #ffffff\` or \`#313131\` hairline | Image frames and quiet card outlines |
| 3 | \`1px solid #3cffd0\` hairline | Active button outlines, focused story tiles |
| 4 | \`1px solid #5200ff\` hairline | Promotional/alternate state outlines |
| 5 | \`rgba(0, 0, 0, 0.33) 0px 0px 0px 1px\` | The single "atmospheric" ring — applied to layered cards |
| 6 | \`0px -1px 0px 0px inset\` (mint/black/white) | Active tab underline — a signature Verge move |
| 7 | Saturated accent fill (\`#3cffd0\`, \`#5200ff\`, white, yellow, pink) | Story-tile elevation via color, not shadow |

The Verge's depth philosophy is **color-as-elevation**. When something needs to stand out, it doesn't get a shadow — it gets a mint fill or a 1px hazard-color border. There are 14 shadow entries in the extracted tokens, but all of them are either inset underlines (0px -1px inset) or near-transparent 1px rings — none of them are traditional elevation shadows. The \`#131313\` canvas stays perfectly flat throughout, and hierarchy is carried by color saturation.

### Decorative Depth
- **1px inset underline** on active tabs/nav links (mint, black, or white depending on context)
- **Subtle \`rgba(0, 0, 0, 0.33)\` 1px ring** on stacked cards — the only effect that faintly resembles a shadow
- **No gradients, no glows, no atmospheric blurs** anywhere. The hazard-tape aesthetic would break if anything faded softly.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <400px | Single column, Manuka hero scales down to ~48–54px, StoryStream rail collapses to inline timestamps |
| Mobile | 400–549px | Single column, color-block tiles stack full-width, nav is a hamburger drawer |
| Large Mobile | 550–767px | Still single column but padding opens up, tile radii stay at 20px |
| Tablet | 768–1023px | 2-column StoryStream with feature card spanning, wordmark shrinks ~50% |
| Small Desktop | 1024–1179px | Full 3–4 column editorial grid, mint pill CTA restored to nav |
| Desktop | 1180–1299px | Max padding, Manuka wordmark at full hero scale |
| Large Desktop | ≥1300px | Container caps at ~1280–1300px, whitespace expands at the margins, no further scaling |

The dembrandt sweep detected 26 intermediate breakpoints (1300 → 1280 → 1200 → 1181 → 1180 → 1179 → 1024 → 1023 → 901 → 900 → 897 → 896 → 890 → 769 → 768 → 620 → 605 → 600 → 550 → 549 → 530 → 426 → 425 → 400 → 320). The Verge tunes its grid at virtually every major device boundary — an unusually aggressive responsive strategy.

### Touch Targets
- Primary pill buttons are ~44px minimum height (10px vertical padding + 16px text + 2px border) — meets WCAG AA.
- Mono uppercase nav links are smaller (~28–32px tall) — for derivative work, pad to 44px on mobile.
- Circle icon buttons are 40–44px circles, touch-friendly.

### Collapsing Strategy
- **Nav**: wordmark scales from hero (Manuka 60–107px) to ~24–32px on mobile. Category links collapse to a hamburger drawer below 900px.
- **Grid**: 4-col → 3-col → 2-col → 1-col. Feature cards that span 2 columns on desktop reflow to full-width single-column on mobile.
- **Spacing**: section padding tightens from 64px → 32px → 20px. Tile interior padding tightens from 32px → 20px.
- **Type**: Manuka hero scales from 107px to ~48–54px on mobile. PolySans headlines scale from 34px → 24px. Mono labels stay pinned at 11–12px (they don't shrink further or they become unreadable).
- **Color tiles**: accent story blocks never lose saturation on mobile — they just reflow to full width.

### Image Behavior
- Responsive raster via \`srcset\`, aspect ratios preserved.
- No art-direction swaps — same crop scales across all viewports.
- \`loading="lazy"\` on everything below the fold, \`eager\` on the masthead hero.
- Images inside color-block tiles inherit the tile's inner radius (4px or 20px nested).`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>The Verge - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/theverge: high-energy technology magazine with black surfaces, magenta signal, and dense editorial cards."
    />
    <style>
      :root {
        --bg: #050505;
        --surface: #111111;
        --surface-warm: #211022;
        --fg: #ffffff;
        --fg-2: #e5e7eb;
        --muted: #9ca3af;
        --meta: #ff00a8;
        --border: #2b2b2b;
        --border-soft: #1d1d1d;
        --accent: #ff00a8;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #22c55e;
        --warn: #facc15;
        --danger: #ef4444;
        --font-display: "PolySans", "Helvetica Neue", Arial, sans-serif;
        --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;
        --font-mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 26px;
        --text-2xl: 42px;
        --text-3xl: 66px;
        --text-4xl: 96px;
        --leading-body: 1.48;
        --leading-tight: 0.95;
        --tracking-display: -0.035em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 88px;
        --section-y-tablet: 64px;
        --section-y-phone: 44px;
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 24px 70px rgba(255, 0, 168, 0.12);
        --focus-ring: 0 0 0 4px rgba(255, 0, 168, 0.30);
        --motion-fast: 120ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1240px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 28px;
        --container-gutter-phone: 18px;
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
        background: linear-gradient(135deg, #050505 0%, #211022 62%, #ff00a8 100%);
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
            <p class="eyebrow">The Verge design system</p>
            <h1>Tech culture front page</h1>
            <p class="lead">Editorial density, neon-magenta signal, and magazine section rhythm.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary neon editorial CTA</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="The Verge component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>story rail card</h3>
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
                <p>high-energy technology magazine with black surfaces, magenta signal, and dense editorial cards.</p>
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
                  <label for="theverge-input">Reference input</label>
                  <input id="theverge-input" value="The Verge system token" />
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
`};exports.default=theverge_default;return module.exports}});
//# sourceMappingURL=client.theverge.js.map