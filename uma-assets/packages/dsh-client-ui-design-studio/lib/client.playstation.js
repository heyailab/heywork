
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.playstation.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var playstation_default={"contract":`## 1. Visual Theme & Atmosphere

PlayStation.com carries itself like the marketing wing of a premium consumer-electronics brand that happens to sell entertainment. The page is organized as a **vertical channel of alternating surfaces**: a near-black masthead and hero, a sequence of paper-white editorial panels in the middle, and a deep cobalt-blue footer that anchors the entire experience. Between those surface modes the site leans hard on photography and 3D product renders — the PS5 console, game cover art, DualSense controllers — letting the hardware do the emotional work while the chrome stays restrained.

The signature typographic move is **SST Light (weight 300) at large sizes**. Sony's custom SST family is used from 22px up to 54px in weight 300, giving display headlines a whispered, elegant quality that feels closer to a luxury watch ad than a game store. That "quiet authority" is the exact opposite of The Verge's Manuka shout or Wired's newsstand density — PlayStation wants the type to recede and the product to lead. Body and UI lean on weights 500–700, but the *display* voice is consistently thin and calm.

The one place restraint breaks is **interaction**. Every primary button has the same hover move: fill swaps to an electric cyan \`#1eaedb\`, a 2px white border appears, a 2px PlayStation-blue outer ring blooms behind it, and the entire button **scales up 1.2×**. That combination of color pop, border, ring, and lift-scale is a signature move unique to Sony among major brands — a miniature "power-on" animation that the site repeats hundreds of times across a single page.

**Key Characteristics:**
- Three-surface channel layout: near-black hero, paper-white content, cobalt-blue footer — alternating, never blending
- SST weight 300 at 22–54px for display — "quiet authority" headlines that let product photography lead
- PlayStation Blue \`#0070cc\` as the brand anchor; cyan \`#1eaedb\` reserved exclusively for hover/focus states
- Every interactive element scales 1.2× on hover — a signature "power-on" lift unique to PlayStation
- Pill buttons at full 999px radius; card art in rounded 12–24px rectangles
- Commerce-orange \`#d53b00\` used exclusively for PlayStation Store / buy-state CTAs
- Wide breakpoint coverage up to 2120px — the site scales all the way to 4K-TV browsing contexts

## 4. Component Stylings

### Buttons

**Primary — PlayStation Blue Pill**
- Background: \`#0070cc\` (PlayStation Blue)
- Text: \`#ffffff\`, SST 18px / 500 / 0.4px tracking
- Border: none at rest
- Border radius: \`999px\` — full pill
- Padding: ~\`12px 24px\` (variable based on size class)
- Outline: \`rgb(255, 255, 255) none 0px\` at rest
- **Hover (signature move)**:
  - Background fills to \`#1eaedb\` (PlayStation Cyan)
  - Text stays \`#ffffff\`
  - 2px \`#ffffff\` border appears
  - 2px \`#0070cc\` outer ring shadow blooms (\`0 0 0 2px #0070cc\`)
  - \`transform: scale(1.2)\` — the button actually grows 20%
- Active: \`opacity: 0.6\` — a quick dim to signal press
- Focus: Same as hover, but the ring turns into \`rgb(0, 114, 206) 0px 0px 0px 2px\` focus shadow
- Transition: ~180ms ease on background, transform, and shadow

**Secondary — White Outline on Dark**
- Background: \`#ffffff\`
- Text: \`#0172ce\` (PlayStation Blue variant)
- Border: \`2px outset #000000\` — a genuine \`outset\` border, which is extremely rare in modern CSS
- Radius: varies (often \`999px\` or \`36px\`)
- Padding: \`16px 20px\`
- Hover: same signature cyan fill + scale(1.2) + ring treatment
- Focus: same ring treatment

**Commerce Orange**
- Background: \`#d53b00\` (Commerce Orange)
- Text: \`#ffffff\`, SST 18px / 700 / 0.45px tracking
- Border radius: \`999px\` — pill
- Used only on PS Store / Buy / Subscribe Plus CTAs
- Active: background darkens to \`#aa2f00\`
- Hover: follows the cyan-invert rule like all other buttons (NOT an orange-specific hover)

**Transparent Ghost**
- Background: transparent
- Text: \`#1f1f1f\` (Deep Charcoal)
- Border: \`1px solid #dedede\`
- Padding: \`0 10px\` (tight, nav-optimized)
- Hover: cyan fill, white text, 2px white border, scale(1.2)
- Active: text shifts to \`#0072ce\`, opacity 0.6

**Icon Circle**
- Background: \`rgba(0, 0, 0, 0.2)\` on photography; \`#ffffff\` on light surfaces
- Border radius: \`100%\` — perfect circle
- Used for carousel prev/next arrows and share buttons
- Hover: lightens to \`var(--color-role-backgrounds-primary-link-hover)\` (roughly \`#e5e5e5\` on light)

**Mini CTA (In-card)**
- SST 14px / 700 / 0.324px tracking
- Padding ~8px 16px
- Radius: \`999px\`
- Used inside game cards for "Buy Now" / "Add to Cart" mini CTAs

### Cards & Containers

**Hero Card (Game Feature)**
- Background: photography/render — usually black-anchored
- Border radius: \`24px\` or \`19px\` for feature cards
- Padding: 32–48px interior
- Shadow: \`rgba(0, 0, 0, 0.8) 0px 5px 9px 0px\` — a dramatic drop-shadow only used when a card overlaps the hero photography
- Hover: subtle scale transform, cyan outline appears on primary CTA

**Game Cover Tile**
- Background: game cover art, unpadded
- Border radius: \`12px\` or \`13px\` (images) / \`19px\` (card frame)
- Shadow: \`rgba(0, 0, 0, 0.08) 0px 5px 9px 0px\` — feather-weight elevation
- Hover: the card's primary CTA lights up cyan, the card itself may scale 1.02×
- Transition: 200ms ease on transform

**Content Panel (White)**
- Background: \`#ffffff\` or the light section gradient \`#ffffff → #f5f7fa\`
- Border: typically none; separated from neighbors by spacing and subtle shadows
- Radius: \`12px\`–\`24px\` depending on panel hierarchy
- Shadow: \`rgba(0, 0, 0, 0.06) 0px 5px 9px 0px\` — the lightest in the system

**Dark Card on Dark**
- Background: \`rgba(0, 0, 0, 0.2)\` over photography
- Border radius: \`6px\` (compact) or \`24px\` (feature)
- Used for "press kit" or "stat block" inlays over hero video

### Inputs & Forms
- **Default**: \`#ffffff\` background, \`1px solid #cccccc\` border, \`3px\` border radius (tighter than the rest of the system — inputs are the one place where PlayStation gets genuinely compact), SST 16px text in \`#1f1f1f\`, placeholder \`rgba(0, 0, 0, 0.6)\`.
- **Focus**: 2px \`#0070cc\` focus ring via \`box-shadow: 0 0 0 2px #0070cc\`. No border-color change — the ring does the work.
- **Error**: border and text shift to \`#c81b3a\` (Warning Red), inline error text below in the same red.
- **Transition**: ~180ms ease on border and shadow.

### Navigation

- **Top nav**: black (\`#000000\`) full-bleed strip with the PlayStation logo (white) left-aligned, category links centered in SST 14–16px / 500, and a small "Sign In" CTA right-aligned.
- **Hover on nav link**: color transitions from \`#ffffff\` to \`#1883fd\` (Link Hover Blue), no underline.
- **Active section**: marked by a subtle 2px underline in \`#0070cc\`.
- **Mobile**: nav collapses to a hamburger drawer. Inside the drawer, links stack vertically with 16px gaps and 20px horizontal padding.
- **Sticky behavior**: the nav stays pinned at the top on scroll; when it enters a light-surface zone it **does not invert** — it stays black-backed throughout.

### Image Treatment

- **Aspect ratios**: 16:9 hero video/photography, 1:1 console renders, 3:4 game cover art, 4:3 lifestyle imagery.
- **Corners**: rounded to \`12px\`, \`13px\`, or \`24px\` depending on card context. Game covers get \`6–12px\`, hero images get \`24px\`.
- **Full-bleed**: only in the masthead hero and footer promotional banners. Everything else sits inside a padded content column.
- **Shadow**: dramatic \`rgba(0, 0, 0, 0.8) 0 5px 9px 0\` drop on heroes, feather \`rgba(0, 0, 0, 0.06) 0 5px 9px 0\` on grid tiles.
- **Hover**: image stays static, the card frame and primary CTA respond.
- **Lazy loading**: \`loading="lazy"\` on everything below the fold, \`eager\` on the masthead hero.

### Game Store Pill (Distinctive)
- Background: \`#ffffff\`
- Text: \`#000000\`, SST 14px / 500
- Padding: \`14px 18px\`
- Radius: \`9999px\` — full pill
- A neutral pill tag that sits next to game covers to label platform ("PS5", "PS4", "PSVR2"). White-on-dark contrast.

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px.
- **Scale**: 1, 2, 3, 4.5, 5, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21px.
- **Section padding**: 48–96px vertical between major panels. Hero-to-content transitions use the larger end.
- **Card padding**: 20–32px interior. Feature hero cards can expand to 48px.
- **Inline spacing**: 8–12px between headline and deck, 12–16px between deck and CTA.
- **Micro-scale**: The 1/2/3/4.5/5/9/10/12 values are used for pill padding, caption spacing, and border offsets — not for editorial rhythm.

### Grid & Container
- **Max width**: ~1920px (dembrandt detected breakpoints up to 2120px). Container caps typically around \`1280–1920px\` depending on panel.
- **Column patterns**: 12-column responsive grid that resolves into 3/4/6-column game tile rows depending on hierarchy. Hero zones often span 12 columns; featured tiles sit in 6+3+3 or 4+4+4 configurations.
- **Outer padding**: 16px mobile → 48px tablet → 64–96px desktop.
- **Gutters**: 16–24px between columns, tighter (8–12px) inside tile clusters.

### Whitespace Philosophy
PlayStation treats whitespace like a luxury brand treats store lighting — as a premium signal. There is noticeably more vertical breathing room between modules than on any other major retail site, and the white editorial panels often hold only one headline + one image + one CTA at hero-scale padding. The effect is a "gallery pace" where each product gets its own room rather than competing in a grid of thumbnails.

### Border Radius Scale
- **2px** — cookie banner buttons and small admin UI
- **3px** — form inputs, tab panels (tighter than everything else — a deliberate "functional UI" cue)
- **6px** — compact buttons and inline images
- **12px** — standard game cover images and content images
- **13px** — certain figure wrappers (a 1px offset from 12px for nesting)
- **19px** — feature cards
- **20px** — inline tag spans
- **24px** — hero cards, primary feature frames
- **36px** — full-pill nav and secondary button variants
- **48px** — large feature buttons
- **999px / 100%** — full pill primary buttons and circular icon buttons

Eleven discrete radius values — one of the richest radius systems of any site in this catalog. The range exists because PlayStation deliberately uses different radii for different *hierarchies*: 3px for utility, 12px for media, 24px for features, 999px for CTAs.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 | No shadow | Default content on \`#ffffff\` |
| 1 | \`rgba(0, 0, 0, 0.06) 0 5px 9px 0\` | Feather-light editorial panel lift |
| 2 | \`rgba(0, 0, 0, 0.08) 0 5px 9px 0\` | Standard grid tile elevation |
| 3 | \`rgba(0, 0, 0, 0.16) 0 5px 9px 0\` | Emphasized card (hover or active) |
| 4 | \`rgba(0, 0, 0, 0.8) 0 5px 9px 0\` | Hero overlay shadow — dramatic drop used over photography |
| 5 | \`0 0 0 2px #0070cc\` (focus ring) | Primary button focus state |
| 6 | \`0 0 0 2px #000000\` (hover ring) | Secondary button hover ring |
| 7 | Section gradient \`#121314 → #000000\` | Atmospheric depth on dark hero panels |

PlayStation's depth philosophy is **layered but restrained**. The shadow scale runs from 0.06 to 0.16 for normal states, then jumps to 0.8 for hero drops — there is no 0.2, 0.3, 0.4 middle ground. The effect is that most of the page sits almost flat, but when a hero card needs to float over photography, it genuinely *floats*. Elevation is either whispered or shouted, never muttered.

### Decorative Depth
- **Section gradients** (dark and light, both described above) — used only as section backgrounds
- **Focus/hover rings** at 2px, always blue or cyan depending on state
- **No glows, blurs, or atmospheric effects** beyond the two section gradients
- **No gradient buttons or text** — the visual system is solid color blocks everywhere except section transitions

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | <400px | Single column, nav collapses to hamburger, SST hero scales to ~28px |
| Mobile | 400–599px | Single column, tiles stack full-width, padding opens to 16px |
| Large Mobile | 600–767px | Still single column but 2-column tile option in select modules |
| Tablet Portrait | 768–1023px | 2-column game grid, nav still condensed |
| Tablet Landscape | 1024–1279px | 3–4 column grid, full nav restored |
| Desktop | 1280–1599px | Full editorial grid, max hero display scale (44–54px) |
| Large Desktop | 1600–1919px | Container caps at 1600px, margins expand |
| 4K / Big-Screen | ≥1920px | Container expands to 1920px max, hero content scales up to match TV viewing distance |
| Ultra-Wide | ≥2120px | Extreme breakpoint — page stays anchored, outer margins absorb extra width |

The dembrandt sweep detected 30 breakpoints between 320px and 2120px — an unusually wide responsive range. PlayStation tunes specifically for **big-screen contexts** (1920–2120px) because PS5 owners frequently browse the site on TVs via the console's browser or via cast-to-TV from a phone. Most retail sites stop tuning at 1440px; PlayStation keeps tuning through 4K.

### Touch Targets
- Primary pill buttons are ~48–56px tall (SST 18px text + ~12–16px vertical padding) — comfortably WCAG AAA.
- Nav links are smaller (~32–40px tall) at desktop; on mobile they pad out to 48px+ inside the drawer.
- Icon circle buttons are 40–48px — touch-friendly.

### Collapsing Strategy
- **Nav**: full nav → condensed → hamburger drawer as viewport narrows. Logo stays pinned left; CTA stays pinned right.
- **Grid**: 6-col → 4-col → 3-col → 2-col → 1-col. Game tile cards reflow without cropping cover art.
- **Spacing**: section padding tightens from 96px → 64px → 48px → 32px → 24px as viewport narrows.
- **Type**: SST hero scales from 54px → 44px → 35px → 28px → 22px. The light weight 300 is preserved at every size.
- **Hero photography**: art-direction swap — desktop uses wide 16:9 crops, mobile uses 4:3 or 1:1 crops with the product centered.

### Image Behavior
- Responsive raster (\`srcset\` + \`<picture>\` with art-direction), aspect ratios preserved per breakpoint.
- 4K-ready: the site serves high-density imagery at 1920px+ to avoid upscaling on TV browsing.
- \`loading="lazy"\` on everything below the fold; hero is \`eager\` with a preload hint.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PlayStation — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/playstation. Console Black hero,
        Paper White content panels, SST weight 300 display type, 1.2× scale-on-hover
        with PlayStation Cyan fill and a 2px PlayStation Blue ring."
    />

    <style>
      :root {
        --bg: #000000;
        --surface: #ffffff;
        --surface-warm: #f5f7fa;

        --fg: #ffffff;
        --fg-2: var(--fg);
        --muted: #cccccc;
        --meta: var(--muted);

        --border: #cccccc;
        --border-soft: #f3f3f3;

        --accent: #0070cc;
        --accent-on: #ffffff;
        --accent-hover: #1eaedb;
        --accent-active: #0068bd;

        --success: #16a34a;
        --warn: #eab308;
        --danger: #c81b3a;

        --font-display: "SST", "Playstation SST", Arial, Helvetica, sans-serif;
        --font-body: "SST", "Playstation SST", Arial, Helvetica, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 18px;
        --text-lg: 22px;
        --text-xl: 28px;
        --text-2xl: 35px;
        --text-3xl: 44px;
        --text-4xl: 54px;

        --leading-body: 1.5;
        --leading-tight: 1.25;
        --tracking-display: -0.1px;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 96px;
        --section-y-tablet: 64px;
        --section-y-phone: 48px;

        --radius-sm: 6px;
        --radius-md: 12px;
        --radius-lg: 24px;
        --radius-pill: 999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: rgba(0, 0, 0, 0.08) 0 5px 9px 0;

        --focus-ring: 0 0 0 2px #0070cc;

        --motion-fast: 180ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1600px;
        --container-gutter-desktop: 64px;
        --container-gutter-tablet: 32px;
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
        line-height: var(--leading-body);
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Surface alternation — three-channel layout ────────── */
      .panel-light {
        background: var(--surface);
        color: #1f1f1f; /* Deep Charcoal — body on Paper White */
      }
      .panel-light h1,
      .panel-light h2,
      .panel-light h3 { color: #000000; }      /* Display Ink */
      .panel-light .lead { color: #6b6b6b; }   /* Body Gray */
      .panel-light .body-muted { color: #6b6b6b; }
      .panel-light .eyebrow { color: #6b6b6b; }

      /* ─── Typography — SST weight 300 at display sizes ──────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 300; /* Quiet-authority — the PlayStation voice */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: var(--tracking-display);
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); letter-spacing: 0; }
      h3 { font-size: var(--text-lg); letter-spacing: 0.1px; }
      p { margin: 0; }
      .lead { font-size: var(--text-base); color: var(--muted); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* No ALL-CAPS — sentence case eyebrow */
      .eyebrow {
        font-size: var(--text-sm);
        color: var(--muted);
        font-weight: 500;
        letter-spacing: 0.1px;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — full-pill, 1.2× cyan power-on hover ─────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 24px;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        letter-spacing: 0.4px;
        line-height: 1.25;
        cursor: pointer;
        border: 2px solid transparent; /* Reserved gutter so hover border doesn't shift */
        text-decoration: none;
        transform-origin: center;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard),
                    transform var(--motion-fast) var(--ease-standard);
      }
      .btn:active { opacity: 0.6; }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Primary — PlayStation Blue → Cyan power-on signature */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover {
        background: var(--accent-hover);
        color: var(--accent-on);
        border-color: #ffffff;
        box-shadow: 0 0 0 2px var(--accent);
        transform: scale(1.2);
      }

      /* Secondary on dark — White surface, blue ink */
      .btn-secondary {
        background: var(--surface);
        color: var(--accent);
        border-color: var(--surface);
      }
      .btn-secondary:hover {
        background: var(--accent-hover);
        color: var(--accent-on);
        border-color: #ffffff;
        box-shadow: 0 0 0 2px var(--accent);
        transform: scale(1.2);
      }
      /* On Paper White panels, secondary inverts to outline ink */
      .panel-light .btn-secondary {
        background: transparent;
        color: var(--accent);
        border-color: var(--accent);
      }
      .panel-light .btn-secondary:hover {
        background: var(--accent-hover);
        color: var(--accent-on);
        border-color: #ffffff;
        box-shadow: 0 0 0 2px var(--accent);
        transform: scale(1.2);
      }

      /* ─── Inputs — 3px radius, 2px blue focus ring ──────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; color: #1f1f1f; }
      .field input {
        padding: 12px 14px;
        border-radius: 3px; /* Tighter than the system — DESIGN.md §Inputs */
        border: 1px solid var(--border);
        background: #ffffff;
        color: #1f1f1f;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        box-shadow: var(--focus-ring); /* Ring does the work — no border-color shift */
      }
      .field input::placeholder { color: rgba(0, 0, 0, 0.6); }
      .field-help { font-size: var(--text-sm); color: #6b6b6b; }

      /* ─── Cards — feature tile, 24px radius, feather lift ───── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        box-shadow: var(--elev-raised);
        border: 1px solid var(--border-soft);
        color: #1f1f1f;
      }
      .card h3 { color: #000000; }
      .card a { color: var(--accent); }
      .card a:hover { color: #1883fd; }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.5;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 86%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* Platform pill — distinctive game-store white-on-dark tag */
      .pill {
        display: inline-flex; align-items: center;
        padding: 6px 14px;
        border-radius: var(--radius-pill);
        background: var(--surface);
        color: #000000;
        font-size: var(--text-sm); font-weight: 500;
      }

      /* ─── Links & inline ────────────────────────────────────── */
      a { color: #53b1ff; text-decoration: none; }
      a:hover { color: #1883fd; }
      .panel-light a { color: var(--accent); }
      .panel-light a:hover { color: #1883fd; }

      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.08); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-4); margin-block-start: var(--space-8); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-5);
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(8px);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 460px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-3); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
      .pill-row { display: flex; gap: var(--space-2); flex-wrap: wrap; }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-6">
            <p class="eyebrow">Reference fixture · playstation</p>
            <h1>Play has no limits.</h1>
            <p class="lead" style="max-width: 52ch">
              From masthead to footer, PlayStation moves like a console powering on —
              quiet-weight SST headlines lead the eye, and every primary button
              scales 1.2× into PlayStation Cyan on hover.
            </p>
            <div class="pill-row" aria-label="Supported platforms">
              <span class="pill">PS5</span>
              <span class="pill">PS4</span>
              <span class="pill">PSVR2</span>
            </div>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm">PSN status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                All services online
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">Network reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--muted)">Press <kbd>⌘</kbd> <kbd>K</kbd> to browse tokens.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features" class="panel-light">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 24ch">Three surfaces. One vertical channel.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-12)">
          <article class="card">
            <h3>Quiet-authority headlines</h3>
            <p class="body-sm" style="color: #6b6b6b">
              SST weight 300 from 22 to 54px — the typographic
              signature that lets product photography lead while
              the chrome stays restrained.
            </p>
            
          </article>
          <article class="card">
            <h3>Cyan power-on hover</h3>
            <p class="body-sm" style="color: #6b6b6b">
              Hover any primary button: fill snaps to PlayStation
              Cyan, a 2px white border appears, a blue ring blooms,
              and the button scales 1.2× — all in 180ms.
            </p>
            
          </article>
          <article class="card">
            <h3>Eleven-radius system</h3>
            <p class="body-sm" style="color: #6b6b6b">
              3px on inputs, 12px on covers, 24px on hero cards,
              999px on pill CTAs. Square corners are forbidden —
              every surface lands on a declared tier.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form" class="panel-light">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs in the Paper White panel.</h2>
            <p class="body-sm" style="color: #6b6b6b; max-width: 48ch">
              Input borders sit at 1px Mute Gray with a 3px radius —
              tighter than the rest of the system. The focus indicator
              is a 2px PlayStation Blue ring; no border-color change.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="psn">PSN ID</label>
              <input id="psn" type="text" placeholder="enter your PSN ID" autocomplete="username" required />
              <p class="field-help">We'll pair this with your console on first sign-in.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Sign in</button>
              <button type="button" class="btn btn-secondary">Create an account</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=playstation_default;return module.exports}});
//# sourceMappingURL=client.playstation.js.map