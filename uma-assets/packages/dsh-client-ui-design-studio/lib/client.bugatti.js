
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.bugatti.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var bugatti_default={"contract":`## 1. Visual Theme & Atmosphere

Bugatti.com does not behave like a website — it behaves like a feature-length car film that a visitor happens to be standing inside. The canvas is pure \`#000000\`, the only color that appears at rest is white, and the entire page is carried by full-bleed hero video and photography with a single typographic moment laid over the top. There are no cards, no grids, no promotional modules, no newsletter signups, no three-column editorial layouts. It is one continuous cinema-black channel, interrupted only by the cars themselves and a few pill-shaped calls to action that quietly say things like "EXPLORE OUR OPPORTUNITIES" in ALL CAPS monospace.

The single most distinctive move in the entire system is **scale**: the \`Bugatti Display\` typeface runs at **288px** at hero moments. Two hundred and eighty-eight pixels. That is not a typo — the dembrandt sweep extracted a heading style rendered at an 18rem size, ALL CAPS, line-height 1.0, meant to be read the way you read a brand mark on the front of a Chiron: from across a showroom floor. At 288px the headline is no longer text, it is architecture. The secondary display scale of 60px feels almost miniature next to it, and the 36px mid-display feels like fine print. This typographic hierarchy is the most extreme of any production brand website in this catalog, and it is what gives Bugatti.com its sculptural, couture-showroom presence.

The other signature is **monochromatic austerity**. The entire homepage uses exactly three colors at rest: \`#000000\`, \`#ffffff\`, and \`#999999\` (mid gray for disabled/tertiary states). There is no accent, no brand blue, no hazard color, no commerce orange, no gradient wash. The designers have made a conscious decision that Bugatti's color system should be the car paint itself — the page is a black velvet display stand, and the only color that exists is whatever blue-on-black lacquer the hero vehicle happens to be wearing today. This discipline is the exact opposite of PlayStation's PlayStation Blue or The Verge's Jelly Mint: Bugatti refuses to compete with its own product.

**Key Characteristics:**
- Cinema-black \`#000000\` canvas for the entire page — no gradients, no tints, no accents
- 288px \`Bugatti Display\` ALL-CAPS headline — the most extreme display scale in the catalog
- Three-font custom family: \`Bugatti Display\` (sculptural), \`Bugatti Monospace\` (UI labels), \`Bugatti Text Regular\` (body)
- Monochrome-only palette: black, white, and a single \`#999999\` mid gray for tertiary/disabled
- Pill buttons at \`9999px\` radius — transparent with a 1px white border, padding \`12px 24px\`
- Video- and photography-first page — the chrome is almost silent so the product can speak
- Mono UPPERCASE labels with 1.2–1.4px letter-spacing on every CTA, navigation link, and caption

## 4. Component Stylings

### Buttons

**Primary — White Outlined Pill**
- Background: transparent
- Text: \`#ffffff\`, Bugatti Monospace 14px / 400 / 1.4px tracking, UPPERCASE
- Border: \`1px solid #ffffff\`
- Border radius: \`9999px\` — full pill
- Padding: \`12px 24px\`
- Outline: \`rgb(255, 255, 255) none 0px\` at rest
- Hover: likely background fill to \`#ffffff\` with black text, or a subtle opacity dim (the extracted token set did not capture a bespoke hover — treat this as a safe assumption since the default Bugatti interaction is restraint)
- Active: opacity drop to ~0.7
- Focus: use a 1px \`#ffffff\` outer ring via \`box-shadow: 0 0 0 1px #ffffff, 0 0 0 2px #000000\` for contrast
- Transition: 200–300ms ease on background/color — quiet, never bouncy

**Secondary — Gray Rounded Button**
- Background: transparent
- Text: \`#ffffff\`, Bugatti Monospace 12px / 400 / 1.2px tracking, UPPERCASE
- Border: \`1px solid #999999\` (Silver Mist)
- Border radius: \`6px\` — subtle corner, the only non-pill non-zero radius in the system
- Padding: \`6px 12px\`
- Hover: border transitions to \`#ffffff\`, text stays white
- Active: opacity 0.7
- Used for compact utility buttons (menu toggles, closed-dialog buttons)

**Ghost — Unbordered Link Button**
- Background: transparent
- Text: \`#ffffff\`, Bugatti Monospace 12px / 400 — plain or UPPERCASE
- No border, no padding beyond inline
- Used in the footer and tertiary nav

### Cards & Containers
- **There are no cards.** Bugatti.com has no card component. The entire page is a sequence of full-bleed media blocks with a headline and optional CTA overlaid — more akin to a film chapter than a card grid.
- The closest thing to a "container" is the rare bordered section that uses a \`1px solid #999999\` frame, a \`6px\` border radius, and \`#000000\` interior. These are reserved for cookie-consent notices and modal-style dialogues, not editorial content.
- Hover state on media blocks: none. The video plays, the CTA becomes clickable, and that is the entire interaction vocabulary.

### Inputs & Forms
- The extracted tokens captured **zero input styles** (\`⚠ Inputs: 0 styles\`). This is because Bugatti.com has essentially no forms on the homepage — no newsletter signup, no search bar, no contact form, no email capture. When forms do appear (on deeper pages), apply these defaults consistent with the rest of the system:
  - **Default**: \`#000000\` background, \`1px solid #999999\` border, \`6px\` radius, \`#ffffff\` text in Bugatti Text Regular 16px, placeholder \`#999999\`.
  - **Focus**: border transitions to \`#ffffff\`, no glow — the border change IS the focus signal.
  - **Error**: border stays white; add a \`#999999\` inline message below. Bugatti does not use red error colors — it stays in the monochrome palette.
  - **Transition**: ~250ms ease on border-color.

### Navigation

- **Top nav**: black (\`#000000\`) thin strip with the Bugatti "EB" monogram or full "BUGATTI" wordmark centered, a hamburger "MENU" link left, and a "STORE" link right. Both nav links are Bugatti Monospace 14px UPPERCASE with 1.4px tracking.
- **Logo**: 128×29px at desktop scale — smaller than nearly every other brand in this catalog. Bugatti does not need to shout its name.
- **Hover on nav links**: color stays \`#ffffff\` — the hover signal is a subtle text-decoration underline or an opacity shift to ~0.75. No color change.
- **Mobile**: the full nav collapses to just three elements — "MENU", the wordmark, and "STORE" — which is basically the desktop layout minus the separator spacing.
- **Sticky behavior**: the nav is pinned at the top on scroll and stays black-on-black. When it overlaps a dark video, it becomes nearly invisible, which is by design.

### Image & Video Treatment
- **Aspect ratios**: 16:9 and 21:9 for hero video, 4:3 for mid-feature photography, 1:1 for rare portrait shots.
- **Corners**: rare — most media is full-bleed with zero border radius. When radius appears, it's \`6px\`.
- **Full-bleed**: yes, always. The hero video fills the viewport. Secondary feature video fills 100% of the section width.
- **Captions**: Bugatti Monospace 12px UPPERCASE in \`#ffffff\` at ~1.2px tracking, placed below the media or in the lower-left corner.
- **Hover**: no zoom, no scale, no scrim. The video plays, that is the hover state.
- **Lazy loading**: \`loading="lazy"\` on every image below the fold; hero video is preloaded.

### Atmospheric Overlay
- When type sits over photography or video that might threaten legibility, Bugatti uses a subtle \`rgba(0, 0, 0, 0.4)\` linear gradient from bottom (40% black) to top (transparent) — the only "shadow-like" effect in the system. It's a vignette, not a drop shadow.

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale** (from tokens): 4, 6, 12, 36, 48, 64px. Six values. **Six.** This is one of the smallest spacing scales of any major brand site — Bugatti uses a handful of discrete gaps and refuses to invent in-between values.
- **Section padding**: typically 48–64px vertical. Hero panels are full-viewport-height, which bypasses the scale entirely.
- **Button padding**: 6px 12px (compact) or 12px 24px (primary). Nothing else.
- **Inline spacing**: 4–12px between stacked labels; the big jump to 36/48/64 happens between content blocks.

### Grid & Container
- **Max width**: 1720px (dembrandt detected breakpoints up to 1720). The site scales to ultra-wide for luxury showroom displays and wide cinema monitors.
- **Column patterns**: there is essentially no multi-column grid on the homepage — it is a stack of single full-width blocks. When deeper pages need columns (configurator, atelier, technical specs), they use a 12-column Tailwind-based grid.
- **Outer padding**: minimal. Most sections bleed to the viewport edge, with padding only applied to the overlaid text and CTA block (typically 48–64px from the bottom-center).

### Whitespace Philosophy
Bugatti's whitespace philosophy is **cinematic negative space** — the page is 90% empty even when content is present, because the content is usually a video or photograph of a single car. The rhythm is: full-bleed media → monumental headline → single pill CTA → scroll → next full-bleed media. There is no "information density" anywhere. The page breathes the way a museum breathes, with each exhibit getting its own silent room.

### Border Radius Scale
- **0** — default for all media and the hero canvas
- **6px** — secondary rounded buttons, bordered frames, small utility containers
- **9999px** — primary pill buttons

Three values. No \`12px\`, no \`24px\`, no \`20px\`. Bugatti's radius system is the most restrained of any site in this catalog — the brand has made an active decision that "slightly rounded rectangle" is a vulgar shape, and committed to either true rectangle or true pill.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow, no border | Default text and media on \`#000000\` |
| 1 | \`1px solid #999999\` | Secondary containers, cookie-style dialogs |
| 2 | \`1px solid #ffffff\` | Primary button outline, active state indicators |
| 3 | Bottom-to-top \`rgba(0, 0, 0, 0.4) → transparent\` vignette | Text-legibility gradient when type sits over video |

**That is the entire depth system.** There are 1 shadows in the extracted token set (zero meaningful \`box-shadow\` values — just a placeholder). Bugatti does not use drop shadows. It does not use elevation rings. It does not use glowing focus states. Depth is implied by the 1px hairline of a border or the presence of a vignette gradient — nothing more.

### Decorative Depth
None. Zero gradients (except the subtle text-legibility vignette), zero blurs, zero glows, zero atmospheric effects. The decorative depth of Bugatti's site comes entirely from the lighting baked into the product photography. The chrome does not compete.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | <640px | Single column, hamburger "MENU", hero video locked to 9:16 or 16:9, hero headline scales to ~48–72px |
| Small Tablet | 640–767px | Still single column, padding opens slightly, typography scales up |
| Tablet | 768–1023px | Still single column for content, nav expands to include wordmark, headline scales to ~120px |
| Small Desktop | 1024–1279px | Full desktop nav, headline scales to ~200px |
| Desktop | 1280–1535px | Full layout, headline at 240–260px |
| Large Desktop | 1536–1719px | Max headline scale (288px), ultra-wide hero video |
| Ultra-Wide | ≥1720px | Container caps, hero video locks at 21:9 or wider, everything else stays proportional |

The dembrandt sweep detected 6 breakpoints (1720 → 1536 → 1280 → 1024 → 768 → 640). This is a narrower responsive set than PlayStation's 30 — Bugatti tunes for six clean thresholds rather than micro-adjusting every device boundary. The brand's assumption is that its visitors are either on a high-end laptop, a desktop monitor, or a phone, and the site doesn't need to fuss over everything in between.

### Touch Targets
- Primary pill buttons are \`12px 24px\` padded with 14px text — approximately 38–42px tall. **This falls slightly below WCAG AAA 44px recommendations**. For derivative work, bump vertical padding to 14–16px to hit 44px+.
- Secondary buttons at \`6px 12px\` padding are about 28–32px tall — definitely below touch-target minimums. Use these only on desktop pointer contexts.
- Navigation links have no explicit padding — the tap area is the text box, which at 14px is too small. Add \`12–14px\` vertical padding on mobile to make them touchable.

### Collapsing Strategy
- **Nav**: desktop shows \`MENU / BUGATTI wordmark / STORE\`. Mobile keeps the same layout — there is no drawer, because there are only three items.
- **Grid**: no grid to collapse. The page is already single-column at every breakpoint.
- **Spacing**: section padding tightens from 64 → 48 → 36 → 12px as viewport narrows.
- **Type**: Bugatti Display scales from 288px → 200px → 120px → 60px → 48px as viewport narrows. The scale curve is aggressive — losing 240px between the max and mobile hero.
- **Video**: art-direction swap between 21:9 desktop and 16:9 or 9:16 mobile hero cuts.

### Image & Video Behavior
- Hero video uses adaptive bitrate streaming and \`poster=\` fallback.
- Below-the-fold media uses \`loading="lazy"\` with \`srcset\` art direction.
- Bugatti serves high-density imagery through \`imgix\` — you'll see \`bugatti.imgix.net\` URLs with transformation parameters.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bugatti - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/bugatti: hyper-luxury automotive calm with deep blue, chrome edges, and gallery spacing."
    />
    <style>
      :root {
        --bg: #07111f;
        --surface: #101d2f;
        --surface-warm: #16283f;
        --fg: #f7fbff;
        --fg-2: #d6e0ee;
        --muted: #8fa1b7;
        --meta: #b7c7d9;
        --border: #2c405c;
        --border-soft: #1c2d44;
        --accent: #1b4d8f;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #2fbf71;
        --warn: #d9b45f;
        --danger: #c1121f;
        --font-display: "Bugatti Display", "Didot", Georgia, serif;
        --font-body: "Avenir Next", Inter, Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 26px;
        --text-2xl: 42px;
        --text-3xl: 64px;
        --text-4xl: 88px;
        --leading-body: 1.58;
        --leading-tight: 1;
        --tracking-display: -0.015em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 120px;
        --section-y-tablet: 84px;
        --section-y-phone: 60px;
        --radius-sm: 8px;
        --radius-md: 14px;
        --radius-lg: 22px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 28px 86px rgba(0, 0, 0, 0.46);
        --focus-ring: 0 0 0 4px rgba(183, 199, 217, 0.28);
        --motion-fast: 170ms;
        --motion-base: 280ms;
        --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
        --container-max: 1200px;
        --container-gutter-desktop: 42px;
        --container-gutter-tablet: 30px;
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
        background: radial-gradient(circle at 72% 16%, rgba(183, 199, 217, 0.20), transparent 34%), linear-gradient(135deg, #07111f 0%, #16283f 100%);
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
            <p class="eyebrow">Bugatti design system</p>
            <h1>Hyper-luxury salon</h1>
            <p class="lead">Deep French blue, polished chrome, and composed automotive prestige.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary blue chrome action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="Bugatti component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>gallery specification panel</h3>
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
                <p>hyper-luxury automotive calm with deep blue, chrome edges, and gallery spacing.</p>
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
                  <label for="bugatti-input">Reference input</label>
                  <input id="bugatti-input" value="Bugatti system token" />
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
`};exports.default=bugatti_default;return module.exports}});
//# sourceMappingURL=client.bugatti.js.map