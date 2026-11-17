
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.binance.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var binance_default={"contract":`## 1. Visual Theme & Atmosphere

Binance.US radiates the polished urgency of a digital trading floor — a space where money moves and decisions happen in seconds. The design is a two-tone composition that alternates between stark white trading surfaces and deep near-black panels (\`#222126\`), creating a visual rhythm that mirrors the bull-and-bear duality of crypto markets. Binance Yellow (\`#F0B90B\`) cuts through this monochrome foundation like a gold ingot on a steel desk — unmistakable, confident, and engineered to guide every eye toward the next action.

The interface speaks the language of fintech trust. Custom BinancePlex typography gives every headline and data point a proprietary gravitas, while generous whitespace and restrained decoration keep the focus on numbers, charts, and call-to-action buttons. The design avoids visual complexity in favor of operational clarity — every element exists to either inform or convert. Product screenshots of the mobile trading app dominate the middle sections, presented on floating device mockups against golden gradients, reinforcing that this is a platform you carry with you.

What makes Binance.US distinctive is the tension between warmth and precision. The golden yellow brand color — warm, optimistic, almost celebratory — lives inside a system of cold, clinical grey text and razor-sharp borders. This isn't a playful fintech like Robinhood or a corporate fortress like Fidelity — it's a crypto-native platform that wraps cutting-edge trading technology in the visual language of established finance.

**Key Characteristics:**
- Two-tone light/dark section alternation — white surfaces for trust, dark panels for depth
- Binance Yellow (\`#F0B90B\`) as the singular accent color driving all primary actions
- BinancePlex custom typeface providing proprietary brand identity at every text level
- Pill-shaped CTA buttons (50px radius) that demand attention
- Floating device mockups on golden gradients for product showcasing
- Crypto price tickers with real-time data prominently displayed
- Shadow-light elevation with subtle 5% opacity card shadows

## 4. Component Stylings

### Buttons

**Primary (Yellow Fill)**
- Background: Binance Yellow (\`#F0B90B\`)
- Text: Ink (\`#1E2026\`), 16px/600, BinancePlex
- Border: none
- Border radius: slightly rounded (6px)
- Padding: 6px 32px
- Hover: shifts to Focus Blue (\`#1EAEDB\`) with white text
- Active: darkens to Active Yellow (\`#D0980B\`)
- Focus: Focus Blue (\`#1EAEDB\`) bg, 1px black border, 2px black outline, opacity 0.9
- Transition: background 200ms ease

**Primary Pill (Gold)**
- Background: Binance Gold (\`#FFD000\`)
- Text: White (\`#FFFFFF\`)
- Border: 1px solid \`#FFD000\`
- Border radius: full pill (50px)
- Padding: 10px horizontal
- Shadow: \`rgb(153,153,153) 0px 2px 10px -3px\`
- Hover: shifts to Focus Blue (\`#1EAEDB\`) with white text

**Secondary (White Outlined)**
- Background: White (\`#FFFFFF\`)
- Text: Binance Yellow (\`#F0B90B\`)
- Border: 1px solid \`#F0B90B\`
- Border radius: full pill (50px)
- Padding: 10px horizontal
- Shadow: \`rgb(153,153,153) 0px 2px 10px -3px\`
- Hover: shifts to Focus Blue bg, white text

**Disabled**
- Background: \`#E6E8EA\`
- Text: \`#848E9C\`
- Cursor: not-allowed

### Cards & Containers

- Background: White (\`#FFFFFF\`) on light sections, Dark Card (\`#2B2F36\`) on dark sections
- Border: 1px solid \`#E6E8EA\` on light cards
- Border radius: medium rounded (12px) for content cards, tight (8px) for data cards
- Shadow: \`rgba(32, 32, 37, 0.05) 0px 3px 5px 0px\` — barely visible, trust-building
- Hover: shadow intensifies to \`rgba(8, 8, 8, 0.05) 0px 3px 5px 5px\`
- Transition: box-shadow 200ms ease

### Inputs & Forms

- Background: White (\`#FFFFFF\`) or Snow (\`#F5F5F5\`)
- Text: Ink (\`#1E2026\`)
- Border: 1px solid \`#E6E8EA\`
- Border radius: 8px
- Padding: 0px 12px (compact for trading context)
- Focus: border shifts to black (\`#000000\`), 1px outline
- Placeholder: Slate (\`#848E9C\`)
- Transition: border-color 200ms ease

### Navigation

- Background: White (\`#FFFFFF\`), sticky
- Height: ~64px
- Left: Binance logo (SVG, yellow mark + dark wordmark)
- Center/Right: navigation links in 14px/600 BinancePlex, color \`#32313A\`
- CTA: Yellow pill button "Get Started" in nav right
- Hover: links darken to \`#1A1A1A\`
- Mobile: hamburger menu, full-height overlay
- Top: optional promotional banner bar

### Image Treatment

- Product mockups: device frames on golden gradient backgrounds, floating with subtle shadow
- Hero images: full-width contained within card-like areas with rounded corners (24px)
- Video sections: 24px radius with embedded player controls
- App screenshots: dark-themed trading UI shown within phone/tablet bezels
- Crypto icons: 48px circular with brand colors

### Trust Indicators

- Real-time crypto price ticker (BTC, BNB, SOL with green/red price change)
- "Trusted by millions" section with statistics on dark background
- Security badges and regulatory compliance mentions
- QR code for direct app download in footer

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Tight inline gaps, icon padding |
| space-2 | 8px | Base unit, button icon gaps, tight margins |
| space-3 | 12px | Card internal padding, input padding |
| space-4 | 16px | Standard padding, section margins |
| space-5 | 20px | Card gaps, medium padding |
| space-6 | 24px | Section internal padding |
| space-7 | 32px | Section breaks, large padding |
| space-8 | 48px | Major section padding |
| space-9 | 64px | Hero section padding |
| space-10 | 80px | Large section spacing |

### Grid & Container

- Max container width: 1200px (centered)
- Hero area: single column with side-by-side text + image above 1024px
- Feature grid: 3-column on desktop, single column on mobile
- Product showcase: 2-column (text + device mockup)
- Horizontal padding: 32px desktop, 16px mobile
- Grid gap: 24px between feature cards

### Whitespace Philosophy

Binance.US uses whitespace as a trust signal. Generous padding around the hero section and between content blocks creates a sense of spaciousness that counters the information density typically associated with crypto exchanges. The light sections breathe — wide margins around headlines and ample spacing between cards — while dark sections compress, packing features into tighter grids to convey capability and depth. The overall rhythm alternates between "inviting entry" (light, spacious) and "deep functionality" (dark, dense).

### Border Radius Scale

| Value | Context |
|-------|---------|
| 1px | Subtle edge softening, fine UI elements |
| 2px | Close buttons, micro-interactive elements |
| 6px | Primary buttons (non-pill), small cards |
| 8px | Form inputs, data cards, image containers |
| 10px | Navigation pills, tag containers |
| 12px | Content cards, feature containers |
| 24px | Video containers, hero imagery, large cards |
| 50px | Pill buttons (CTA), search inputs, full-round elements |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, solid background | Default for inline elements |
| Subtle | \`rgba(32, 32, 37, 0.05) 0px 3px 5px\` | Content cards, resting state |
| Medium | \`rgba(8, 8, 8, 0.05) 0px 3px 5px 5px\` | Hovered cards, elevated containers |
| Pill Shadow | \`rgb(153,153,153) 0px 2px 10px -3px\` | Pill CTA buttons, floating actions |
| Heavy | \`rgba(0,0,0) 0px 32px 37px\` | Modal overlays, dropdown menus |

Binance.US uses a whisper-light shadow system. Card shadows are barely perceptible at 5% opacity — they exist not for dramatic depth but as subtle ground cues that keep cards from feeling pasted onto the surface. The pill button shadow is the exception: slightly more visible to give CTAs a "floating" quality that invites clicks. The philosophy is pragmatic — in a financial context, heavy shadows feel frivolous, while no shadows at all feel flat and untrustworthy. The 5% sweet spot communicates professionalism.

### Decorative Depth

- **Golden gradient backgrounds**: Behind device mockup sections, radial golden glow centered on the product
- **Dark-to-light section transitions**: Hard cut (no gradient blend) between white and \`#222126\` sections
- **Price ticker strip**: Flat, borderless, reads as a data bar rather than a decorative element

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <425px | Single column, stacked hero, hamburger nav, 16px padding |
| Small Mobile | 425-599px | Wider mobile layout, price ticker wraps |
| Tablet Small | 600-768px | 2-column feature grid begins |
| Tablet | 769-896px | Hero side-by-side layout begins |
| Desktop Small | 897-1024px | Full nav expands, 3-column features |
| Desktop | 1024-1280px | Full layout, max content width |
| Large Desktop | 1280-1440px | Increased margins, centered container |
| XL Desktop | >1440px | Max-width container (1200px) with expanded margins |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA)
- Pill CTA buttons: 48px height minimum
- Nav links: 44px touch area
- Crypto ticker items: full-width tappable rows on mobile
- App download buttons: large tap zones (50px+)

### Collapsing Strategy

- **Navigation**: Full horizontal links → hamburger menu below 897px; logo and "Get Started" CTA remain visible
- **Hero section**: Side-by-side (text left, image right) → stacked (text top, image below) at 768px
- **Feature grid**: 3-col → 2-col at 768px → 1-col at 600px
- **Price ticker**: Horizontal row → wrapping or scrollable at 600px
- **Section padding**: 64px → 48px → 32px → 16px as viewport narrows
- **Device mockups**: Scale down proportionally, maintain centered positioning
- **Footer**: Multi-column → stacked accordion sections on mobile

### Image Behavior

- Device mockups: CSS-scaled with max-width constraints, maintain aspect ratio
- Hero imagery: contained within rounded containers (24px), scale proportionally
- App screenshots: responsive width with fixed aspect ratio
- QR code: fixed 120px square, hidden on mobile (replaced with direct app store links)`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Binance — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/binance. White trading-floor canvas
        alternating with deep #222126 panels, Binance Yellow (#F0B90B) as the singular
        accent, BinancePlex headlines, pill CTAs, and whisper-light 5%-opacity shadows."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: #f5f5f5;

        --fg: #1e2026;
        --fg-2: #32313a;
        --muted: #848e9c;
        --meta: #777e90;

        --border: #e6e8ea;
        --border-soft: #f0f1f2;

        --accent: #f0b90b;
        --accent-on: #1e2026;
        --accent-hover: #1eaedb;
        --accent-active: #d0980b;

        --success: #0ecb81;
        --warn: #eab308;
        --danger: #f6465d;

        --font-display: BinancePlex, Arial, sans-serif;
        --font-body: BinancePlex, Arial, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 11px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 28px;
        --text-3xl: 34px;
        --text-4xl: 60px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: 0;

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
        --radius-md: 12px;
        --radius-lg: 24px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 3px 5px 0 rgba(32, 32, 37, 0.05);

        --focus-ring: 0 0 0 2px #1eaedb;

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 16px;
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
        font-weight: 500;
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "tnum" 1;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
        --hey-preview-gutter: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); --hey-preview-gutter: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); --hey-preview-gutter: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* Dark section variant — DESIGN.md §1 alternating light/dark rhythm. */
      .section-dark {
        background: #222126;
        color: #ffffff;
      }
      .section-dark .body-muted,
      .section-dark .eyebrow,
      .section-dark .lead { color: rgba(255, 255, 255, 0.7); }

      /* ─── Typography — BinancePlex, weights 500–700 only ────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        margin: 0;
      }
      h1 { font-size: var(--text-4xl); font-weight: 700; }
      h2 { font-size: var(--text-3xl); font-weight: 700; }
      h3 { font-size: var(--text-lg); font-weight: 600; line-height: 1.25; }
      p { margin: 0; }
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 600;
      }
      .lead { font-size: var(--text-lg); color: var(--muted); font-weight: 500; line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); font-weight: 500; }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — DESIGN.md §4 ────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: 12px 28px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: 0.01em;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition: background-color var(--motion-base) var(--ease-standard),
                    color var(--motion-base) var(--ease-standard),
                    border-color var(--motion-base) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary pill CTA — Binance Yellow, full-round (signature shape) */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-radius: var(--radius-pill);
        box-shadow: rgb(153, 153, 153) 0 2px 10px -3px;
      }
      .btn-primary:hover {
        background: var(--accent-hover);
        color: #ffffff;
      }
      .btn-primary:active { background: var(--accent-active); color: var(--accent-on); }
      /* Secondary pill — white with yellow outline */
      .btn-secondary {
        background: #ffffff;
        color: var(--fg);
        border-color: var(--fg);
        border-radius: var(--radius-pill);
      }
      .btn-secondary:hover {
        background: var(--accent-hover);
        color: #ffffff;
        border-color: var(--accent-hover);
      }
      /* Ghost — for dark sections */
      .btn-ghost {
        background: transparent;
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.3);
        border-radius: var(--radius-pill);
      }
      .btn-ghost:hover { background: rgba(255, 255, 255, 0.08); border-color: #ffffff; }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; color: var(--fg); }
      .field input {
        padding: 14px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface-warm);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        outline: none;
        transition: border-color var(--motion-base) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: #000000;
        box-shadow: var(--focus-ring);
        background: #ffffff;
      }
      .field input::placeholder { color: var(--muted); font-weight: 500; }
      .field-help { font-size: var(--text-xs); color: var(--meta); font-weight: 500; }

      /* ─── Cards ─────────────────────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover { box-shadow: 0 3px 5px 5px rgba(8, 8, 8, 0.05); }
      .card-icon {
        width: 48px; height: 48px;
        border-radius: var(--radius-pill);
        background: color-mix(in oklab, var(--accent), white 78%);
        color: var(--accent-active);
        display: inline-flex; align-items: center; justify-content: center;
      }
      .card .card-meta {
        margin-block-start: auto;
        padding-block-start: var(--space-4);
        border-block-start: 1px solid var(--border-soft);
        display: flex; align-items: center; justify-content: space-between;
      }

      /* ─── Price ticker — the "numbers build trust" surface ──── */
      .ticker {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      @media (max-width: 639px) { .ticker { grid-template-columns: repeat(2, 1fr); } }
      .ticker-cell {
        background: var(--surface);
        padding: var(--space-4) var(--space-5);
        display: flex; flex-direction: column; gap: 2px;
        font-variant-numeric: tabular-nums;
      }
      .ticker-symbol { font-size: var(--text-xs); font-weight: 600; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }
      .ticker-price { font-size: var(--text-lg); font-weight: 600; color: var(--fg); }
      .ticker-change { font-size: var(--text-sm); font-weight: 600; }
      .ticker-change.up { color: var(--success); }
      .ticker-change.down { color: var(--danger); }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.6;
        font-variant-numeric: tabular-nums;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 88%); }
      .badge-danger  { color: var(--danger);  background: color-mix(in oklab, var(--danger),  transparent 88%); }
      .badge-accent  { color: var(--accent-active); background: color-mix(in oklab, var(--accent), white 82%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; font-weight: 600; transition: color var(--motion-fast) var(--ease-standard); }
      a:hover { color: #1a1a1a; }
      .section-dark a:hover { color: var(--accent); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface-warm); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: center; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-art {
        aspect-ratio: 4 / 3;
        border-radius: var(--radius-lg);
        background:
          radial-gradient(circle at 50% 45%, #f0b90b 0%, #fcd535 38%, #f8d12f 72%, rgba(248, 209, 47, 0) 100%),
          #ffffff;
        display: grid; place-items: center;
        box-shadow: var(--elev-raised);
        position: relative;
        overflow: hidden;
      }
      .hero-art-device {
        width: 58%;
        aspect-ratio: 9 / 16;
        background: #222126;
        border-radius: 28px;
        border: 6px solid #1a1a1a;
        padding: var(--space-4);
        display: flex; flex-direction: column; gap: var(--space-3);
        color: #ffffff;
        box-shadow: 0 24px 40px -16px rgba(0, 0, 0, 0.35);
      }
      .hero-art-row { display: flex; justify-content: space-between; align-items: baseline; font-variant-numeric: tabular-nums; }
      .hero-art-row .sym { font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.7); letter-spacing: 0.06em; }
      .hero-art-row .pr { font-size: 13px; font-weight: 600; }

      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }

      .form-row { display: grid; grid-template-columns: 1.1fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex; flex-direction: column; gap: var(--space-4);
        max-width: 460px;
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
      }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
      .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
      @media (max-width: 639px) { .stat-grid { grid-template-columns: 1fr; } }
      .stat-num { font-size: var(--text-3xl); font-weight: 700; line-height: var(--leading-tight); color: var(--accent); font-variant-numeric: tabular-nums; }
      .stat-label { font-size: var(--text-sm); font-weight: 500; color: rgba(255, 255, 255, 0.7); }
    </style>

    <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · binance</p>
            <h1>The world's leading cryptocurrency exchange.</h1>
            <p class="lead" style="max-width: 56ch">
              Trade 350+ coins on the platform millions trust for low fees, deep liquidity,
              and a security record built for the long term. Buy, sell, and stake in seconds.
            </p>
            <div class="ticker" aria-label="Live crypto prices">
              <div class="ticker-cell">
                <span class="ticker-symbol">BTC / USD</span>
                <span class="ticker-price">$68,432.10</span>
                <span class="ticker-change up">+2.41%</span>
              </div>
              <div class="ticker-cell">
                <span class="ticker-symbol">ETH / USD</span>
                <span class="ticker-price">$3,584.20</span>
                <span class="ticker-change up">+1.18%</span>
              </div>
              <div class="ticker-cell">
                <span class="ticker-symbol">BNB / USD</span>
                <span class="ticker-price">$612.55</span>
                <span class="ticker-change down">−0.73%</span>
              </div>
              <div class="ticker-cell">
                <span class="ticker-symbol">SOL / USD</span>
                <span class="ticker-price">$148.07</span>
                <span class="ticker-change up">+4.92%</span>
              </div>
            </div>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-art" aria-hidden="true">
            <div class="hero-art-device">
              <div class="hero-art-row" style="margin-block-end: 4px">
                <span class="sym" style="color: var(--accent); letter-spacing: 0.08em">PORTFOLIO</span>
                <span class="pr" style="color: var(--success)">+8.42%</span>
              </div>
              <div class="hero-art-row"><span class="sym">BTC</span><span class="pr">$68,432.10</span></div>
              <div class="hero-art-row"><span class="sym">ETH</span><span class="pr">$3,584.20</span></div>
              <div class="hero-art-row"><span class="sym">BNB</span><span class="pr">$612.55</span></div>
              <div class="hero-art-row"><span class="sym">SOL</span><span class="pr">$148.07</span></div>
              <div class="hero-art-row"><span class="sym">USDT</span><span class="pr">$1.00</span></div>
            </div>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">Built for traders</p>
          <h2 style="max-width: 24ch">Operational clarity, every screen.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <span class="card-icon" aria-hidden="true">
              <svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>
              </svg>
            </span>
            <h3>Industry-low fees</h3>
            <p class="body-muted body-sm">
              0.10% spot trading fee — discounted further when paying in BNB.
              Tabular numerics keep price columns aligned across portfolios.
            </p>
            <div class="card-meta">
              <span class="badge badge-accent">Spot · 0.10%</span>
              
            </div>
          </article>
          <article class="card">
            <span class="card-icon" aria-hidden="true">
              <svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </span>
            <h3>Security &amp; SAFU</h3>
            <p class="body-muted body-sm">
              Cold-storage majority, real-time risk monitoring, and the SAFU fund —
              an insurance reserve protecting user assets since 2018.
            </p>
            <div class="card-meta">
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
              
            </div>
          </article>
          <article class="card">
            <span class="card-icon" aria-hidden="true">
              <svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 17l6-6 4 4 8-9"/>
                <path d="M14 6h7v7"/>
              </svg>
            </span>
            <h3>Deep liquidity</h3>
            <p class="body-muted body-sm">
              Execute size on 350+ markets with the order-book depth of the world's
              busiest exchange. Sub-millisecond matching engine across global regions.
            </p>
            <div class="card-meta">
              <span class="badge badge-danger">24h vol −1.2%</span>
              
            </div>
          </article>
        </div>
      </section>

      <section data-od-id="trust" class="section-dark" style="margin-inline: calc(var(--hey-preview-gutter) * -1); padding-inline: var(--hey-preview-gutter);">
        <div class="stack-6">
          <div class="stack-3">
            <p class="eyebrow">Trusted by millions</p>
            <h2 style="color: #ffffff; max-width: 22ch">A platform engineered to scale.</h2>
          </div>
          <div class="stat-grid">
            <div>
              <p class="stat-num">$76B+</p>
              <p class="stat-label">24h trading volume across spot and derivatives</p>
            </div>
            <div>
              <p class="stat-num">180M+</p>
              <p class="stat-label">Registered users in 180+ countries worldwide</p>
            </div>
            <div>
              <p class="stat-num">350+</p>
              <p class="stat-label">Cryptocurrencies and trading pairs available today</p>
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Open an account</p>
            <h2 style="max-width: 18ch">Start trading in minutes.</h2>
            <p class="body-muted" style="max-width: 50ch">
              KYC verification is fast and runs entirely in-app. Sign up with email,
              verify your identity, fund your account, and place your first trade.
              Press <kbd>⌘</kbd> <kbd>K</kbd> anytime to search markets.
            </p>
            <p class="body-sm">
              Already have an account?
              
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@example.com" autocomplete="email" required />
              <p class="field-help">We'll send a verification code — no marketing.</p>
            </div>
            <div class="field">
              <label for="referral">Referral ID <span style="color: var(--meta); font-weight: 500">(optional)</span></label>
              <input id="referral" type="text" placeholder="e.g. 35480123" autocomplete="off" />
              <p class="field-help">Get up to 20% trading-fee kickback on your first trades.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create account</button>
              <button type="button" class="btn btn-secondary">Continue with passkey</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=binance_default;return module.exports}});
//# sourceMappingURL=client.binance.js.map