
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.tom-modern.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var tom_modern_default={"contract":`## 1. Visual Theme & Atmosphere

Tom Modern Design is an editorial-technical design family: structured, sharp, restrained, premium, intentional, anti-generic. It reads like a deliberate design — not a mass-generated startup template.

The system sits on a near-white neutral canvas (\`#fafafa\`) with deep ink text (\`#27272a\`). One primary accent — vermillion (\`#ff5a00\`) — carries all interactive emphasis. Typography is Geist Sans for body and Geist Mono for labels, metadata, and technical notes. Every corner is sharp (0px radius). Shadows are hard-offset, never soft.

Atmosphere comes from a subtle 30px grid overlay on the page background, structural lines, and the contrast between quiet white zones and dense information bands. The design avoids decorative noise — no blobs, no gradients, no glow effects.

**Key signals:**
- Neutral near-white canvas with strong ink contrast
- Single vermillion accent reserved for CTAs, links, and highlights
- Sharp 0px corners throughout — rectangular silhouette is the brand
- Hard offset shadows (\`8px 8px 0\`) for elevation
- Geist Sans/Mono typography with strong hierarchy
- Editorial split layouts with asymmetric composition
- Uppercase compact labels for eyebrows and metadata

**Anti-patterns to avoid:**
- Generic centered startup heroes
- Purple gradients by default
- Rounded cards and buttons
- Beige or cream backgrounds
- Blob-based decorative elements
- Repetitive identical card grids

## 4. Component Stylings

### Buttons

- **Primary:** Dark fill (\`--fg\`), white text, 0px radius, hard shadow on hover
- **Secondary:** Transparent, dark text, 1px border, white fill on hover
- **Block:** Full-width variant of any button

### Cards

- **Frame:** White surface, 1px border, soft shadow
- **Panel:** White surface, 1px border, hard shadow, accent top-border (4px)
- **Feature card:** 2-column grid with optional full-width variant
- **Feature 3-card:** 3-column grid with icon headers

### Navigation

- **Header:** Sticky, blurred background (\`rgba(250,250,250,0.88)\`), 1px bottom border
- **Nav links:** Geist Sans, secondary text color
- **CTA button:** Dark fill, same as primary button

### Forms

- **Input:** White background, 1px border, 44px height, accent border on focus
- **Textarea:** Same as input, resizable
- **Label:** Mono font, uppercase, muted color

### Premium Components

- **Token Card:** Dark gradient (\`#14192B\` → \`#1B2A3D\` → \`#11393A\`), holographic sheen animation, mono typography, perforation line with circular cutouts
- **Code Window:** Dark background (\`#111517\`), macOS-style traffic light dots, atmospheric gradient overlay, 7 syntax highlighting tokens

### Tabs

- **Tab nav:** Horizontal, mono font, uppercase, accent bottom-border on active
- **Tab panel:** Hidden by default, shown with \`.is-active\` class

### FAQ

- **Item:** Frame with expandable answer
- **Question:** Full-width button, plus/minus icon
- **Answer:** Hidden by default, shown when \`.is-open\`

## 5. Layout Principles

### Container

- Max width: 1240px
- Padding: \`min(100% - 40px, 1240px)\`
- Centered with \`margin: 0 auto\`

### Section

- Vertical padding: 96px
- Alternate sections use \`rgba(255,255,255,0.72)\` background with 1px borders

### Grid System

- **Hero:** 2-column split (0.92fr / 1.08fr) with 42px gap
- **Feature grid:** 2-column with optional full-width cards
- **Feature 3-col:** 3-column with icon headers
- **Updates/Pain:** 3-column grid
- **Pricing/Contact:** 2-column split
- **Footer:** 3-column (2fr / 1fr / 1fr)

### Section Rhythm

Sections alternate between:
1. White background (\`--bg\`)
2. Alternate surface (\`rgba(255,255,255,0.72)\` with borders)

This creates visual rhythm without color changes.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border | Body text, section backgrounds |
| 1 — Border | 1px \`--border\` border | Cards, panels, inputs |
| 2 — Soft shadow | \`4px 4px 0 rgba(150,150,150,0.1)\` | Default card state |
| 3 — Hard shadow | \`8px 8px 0 rgba(150,150,150,0.12)\` | Hover states, emphasis |
| 4 — Code shadow | \`0 28px 90px rgba(22,22,22,0.14)\` | Code window only |

The system uses **color contrast** (surface vs. background) rather than shadow depth for hierarchy. Shadows are reserved for interactive feedback and premium components.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 560px | Single column, compact padding (24px), smaller type |
| Tablet | 560–980px | 2-column grids, stacked hero |
| Desktop | > 980px | Full layout, 1240px max-width |

### Touch Targets

- Minimum 44×44px for all interactive elements
- Buttons: 44px height + 24px horizontal padding
- Nav links: extend tap area to full row height

### Collapsing Strategy

- **Hero:** Stacks to single column below 980px
- **Feature grids:** 2-col → 1-col below 980px
- **3-col grids:** 3-col → 2-col → 1-col
- **Footer:** 3-col → 2-col → 1-col
- **Navigation:** Hamburger menu on mobile (not included in CSS — implement per project)

### Image Behavior

- Hero photography fills full width
- Product thumbnails maintain aspect ratio
- Lifestyle photography uses horizontal cropping on mobile`,"components":`<!-- Tom Modern Design — Component Fixture -->
<!-- Source: https://github.com/Tom-Opencart/tom-modern-html-style-rule -->
<!-- Standalone preview of key components -->

<!DOCTYPE html>
<html lang="en">
<head><base href="about:srcdoc">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tom Modern — Components</title>
<style>
:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg: #fafafa;
  --surface: #ffffff;
  --surface-warm: var(--surface);

  /* ─── Foreground ───────────────────────────────────────────────── */
  --fg: #27272a;
  --fg-2: #52525b;
  --muted: #71717a;
  --meta: var(--muted);

  /* ─── Border ───────────────────────────────────────────────────── */
  --border: #969696;
  --border-soft: #d4d4d8;

  /* ─── Accent ───────────────────────────────────────────────────── */
  --accent: #ff5a00;
  --accent-on: #ffffff;
  --accent-hover: color-mix(in oklab, var(--accent), black 8%);
  --accent-active: color-mix(in oklab, var(--accent), black 14%);

  /* ─── Semantic ─────────────────────────────────────────────────── */
  --success: #16a34a;
  --warn: #eab308;
  --danger: #dc2626;

  /* ─── Typography ───────────────────────────────────────────────── */
  --font-display: 'Geist Sans', 'Geist', system-ui, -apple-system, sans-serif;
  --font-body: 'Geist Sans', 'Geist', system-ui, -apple-system, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 18px;
  --text-xl: 22px;
  --text-2xl: 28px;
  --text-3xl: 38px;
  --text-4xl: 48px;

  --leading-body: 1.65;
  --leading-tight: 0.96;
  --tracking-display: -0.04em;

  /* ─── Spacing ──────────────────────────────────────────────────── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* ─── Section rhythm ───────────────────────────────────────────── */
  --section-y-desktop: 96px;
  --section-y-tablet: 64px;
  --section-y-phone: 48px;

  /* ─── Radius ───────────────────────────────────────────────────── */
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-pill: 0px;

  /* ─── Elevation ────────────────────────────────────────────────── */
  --elev-flat: none;
  --elev-ring: 0 0 0 1px var(--border);
  --elev-raised: 4px 4px 0 rgba(150, 150, 150, 0.1);

  /* ─── Focus ────────────────────────────────────────────────────── */
  --focus-ring: 0 0 0 2px var(--accent);

  /* ─── Motion ───────────────────────────────────────────────────── */
  --motion-fast: 150ms;
  --motion-base: 200ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);

  /* ─── Layout ───────────────────────────────────────────────────── */
  --container-max: 1240px;
  --container-gutter-desktop: 20px;
  --container-gutter-tablet: 16px;
  --container-gutter-phone: 12px;

  /* ─── Brand-specific extensions ────────────────────────────────── */
  --tm-accent-soft: rgba(255, 90, 0, 0.08);
  --tm-shadow-hard: 8px 8px 0 rgba(150, 150, 150, 0.12);
  --tm-shadow-soft: 4px 4px 0 rgba(150, 150, 150, 0.1);
  --tm-shadow-code: 0 28px 90px rgba(22, 22, 22, 0.14);
  --tm-header-height: 82px;
  --tm-code-bg: #111517;
  --tm-code-panel: #151a1d;
  --tm-code-text: #d8dee9;
}

/* Layout */
.container { width: min(100% - 40px, var(--container-max)); margin: 0 auto; }
.section { padding: var(--section-y-desktop) 0; }
.section-alt { background: rgba(255,255,255,0.72); border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); }
.section-head { max-width: 760px; margin: 0 auto 48px; text-align: center; }
.section-head h2 { margin: 0; font-weight: 700; letter-spacing: var(--tracking-display); text-transform: uppercase; font-size: clamp(2.3rem, 5vw, 4.8rem); line-height: var(--leading-tight); }
.section-head p { color: var(--fg-2); line-height: var(--leading-body); margin-top: 16px; }
.title-highlight { color: var(--accent); }
.frame { background: var(--surface); border: 1px solid var(--border); box-shadow: var(--elev-raised); }
.eyebrow { display: inline-block; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }

/* Reset */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { color: var(--fg); font-family: var(--font-body); background-color: var(--bg); background-image: linear-gradient(rgba(150,150,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(150,150,150,0.04) 1px, transparent 1px); background-size: 30px 30px; -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }

/* Buttons */
.button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 22px; border: 1px solid var(--border); text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; font-size: var(--text-sm); font-weight: 700; transition: transform var(--motion-base), box-shadow var(--motion-base); cursor: pointer; }
.button:hover { transform: translate(-2px, -2px); box-shadow: var(--tm-shadow-hard); }
.button-primary { background: var(--fg); color: #fff; box-shadow: var(--elev-raised); }
.button-secondary { background: transparent; color: var(--fg); }
.button-block { width: 100%; }

/* Feature 3-col */
.feature-3col { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }
.feature-3card { display: flex; flex-direction: column; padding: 18px; border: 1px solid var(--border); background: var(--surface); transition: transform 0.18s; }
.feature-3card:hover { transform: translate(-3px, -3px); box-shadow: var(--tm-shadow-hard); }
.feature-3card__icon { width: 40px; height: 40px; margin-bottom: 14px; border: 1px solid var(--border); background: var(--accent); color: var(--accent-on); display: flex; align-items: center; justify-content: center; }
.feature-3card__icon svg { width: 18px; height: 18px; }
.feature-3card h3 { margin: 0 0 8px; font-size: 15px; font-weight: 700; text-transform: uppercase; }
.feature-3card p { margin: 0; color: var(--muted); font-size: var(--text-sm); }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 42px; align-items: start; }
.pricing-card { padding: 32px; }
.pricing-head { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid var(--border); }
.pricing-head span { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.pricing-head strong { display: block; font-size: var(--text-4xl); letter-spacing: var(--tracking-display); margin: 8px 0 4px; }
.pricing-head small { font-size: var(--text-sm); color: var(--muted); }
.plain-list { list-style: none; margin-top: 16px; }
.plain-list li { position: relative; padding-left: 18px; margin-bottom: 8px; font-size: var(--text-sm); color: var(--fg-2); }
.plain-list li::before { content: ""; position: absolute; left: 0; top: 8px; width: 8px; height: 8px; background: var(--accent); }

/* FAQ */
.faq-wrap { max-width: 800px; margin: 0 auto; }
.faq-list { display: flex; flex-direction: column; gap: 12px; }
.faq-item { overflow: hidden; }
.faq-question { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 18px 24px; border: none; background: none; font-size: 15px; font-weight: 600; text-align: left; cursor: pointer; }
.faq-question:hover { background: var(--bg); }
.faq-icon { width: 20px; height: 20px; position: relative; }
.faq-icon::before, .faq-icon::after { content: ""; position: absolute; background: var(--fg); }
.faq-icon::before { left: 9px; top: 4px; width: 2px; height: 12px; }
.faq-icon::after { left: 4px; top: 9px; width: 12px; height: 2px; }
.faq-item.is-open .faq-icon::before { display: none; }
.faq-answer { display: none; padding: 0 24px 18px; }
.faq-answer p { color: var(--fg-2); font-size: var(--text-sm); line-height: var(--leading-body); }
.faq-item.is-open .faq-answer { display: block; }

/* Token Card */
.key-card-frame { width: 100%; max-width: 390px; padding: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--elev-raised); }
.key-card-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border-soft); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.key-card { position: relative; isolation: isolate; overflow: hidden; background: linear-gradient(155deg, #14192B 0%, #1B2A3D 55%, #11393A 100%); padding: 24px 22px 18px; color: #EEF1F8; }
.key-card__sheen { position: absolute; top: -40%; left: -65%; width: 170%; height: 180%; background: linear-gradient(115deg, transparent 32%, rgba(14,124,123,0.45) 42%, rgba(201,127,30,0.4) 50%, rgba(255,255,255,0.3) 56%, transparent 66%); transform: rotate(9deg) translateX(-12%); mix-blend-mode: screen; pointer-events: none; z-index: 0; animation: sheen-sweep 2.4s ease-out 0.2s 1; }
@keyframes sheen-sweep { from { transform: rotate(9deg) translateX(-38%); } to { transform: rotate(9deg) translateX(-12%); } }
.key-card__label { position: relative; z-index: 1; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #E8B872; margin-bottom: 12px; }
.key-card__value { position: relative; z-index: 1; font-family: var(--font-mono); font-size: clamp(19px, 2.1vw, 24px); letter-spacing: 1px; font-weight: 500; display: flex; flex-wrap: wrap; gap: 2px; margin-bottom: 20px; }
.key-card__value .sep { color: rgba(238,241,248,0.35); margin: 0 1px; }
.key-card__value .seg--dim { color: rgba(238,241,248,0.32); }
.key-card__perforation { position: relative; border-top: 1px dashed rgba(238,241,248,0.28); margin: 0 -22px; padding: 0 22px; }
.key-card__perforation::before, .key-card__perforation::after { content: ""; position: absolute; top: -8px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg); }
.key-card__perforation::before { left: -8px; }
.key-card__perforation::after { right: -8px; }
.key-card__footer { position: relative; z-index: 1; display: flex; gap: 8px; flex-wrap: wrap; padding-top: 14px; }
.chip { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; border: 1px solid rgba(238,241,248,0.22); color: #DCE2F0; }
.chip svg { width: 12px; height: 12px; flex-shrink: 0; }

/* Code Window */
.tm-code-window { position: relative; overflow: hidden; border: 1px solid rgba(17,21,23,0.12); background: var(--tm-code-bg); box-shadow: var(--tm-shadow-code); }
.tm-code-window::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(120deg, rgba(255,255,255,0.08), transparent 34%), radial-gradient(circle at 80% 0%, rgba(92,207,230,0.12), transparent 30%); }
.tm-code-header { position: relative; z-index: 1; display: flex; align-items: center; gap: 14px; min-height: 44px; padding: 0 18px; border-bottom: 1px solid rgba(255,255,255,0.08); background: var(--tm-code-panel); }
.tm-code-dots { display: inline-flex; gap: 8px; }
.tm-code-dots span { width: 11px; height: 11px; border-radius: 50%; }
.tm-code-dots span:nth-child(1) { background: #ff5f57; }
.tm-code-dots span:nth-child(2) { background: #ffbd2e; }
.tm-code-dots span:nth-child(3) { background: #28c840; }
.tm-code-title { overflow: hidden; color: rgba(238,242,245,0.58); font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 800; letter-spacing: 0.08em; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
.tm-code-body { position: relative; z-index: 1; overflow-x: auto; padding: 24px; }
.tm-code-body pre { margin: 0; }
.tm-code-body code { display: block; min-width: max-content; color: var(--tm-code-text); font-family: var(--font-mono); font-size: 14px; line-height: 1.72; tab-size: 2; }
.token-keyword { color: #ffd866; }
.token-function { color: #5ccfe6; }
.token-string { color: #a6e3a1; }
.token-number { color: #c792ea; }
.token-property { color: #82aaff; }
.token-comment { color: #6f7b86; }
.token-punctuation { color: #aab2bf; }

/* Panel */
.panel { position: relative; padding: 30px 32px 32px; margin-bottom: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--tm-shadow-hard); }
.panel::before { content: ""; position: absolute; left: 0; top: 0; width: 72px; border-top: 4px solid var(--accent); }
.panel-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border-soft); }
.panel-tick { width: 11px; height: 11px; background: var(--accent); }
.panel h2 { margin: 0; font-size: clamp(21px, 2vw, 25px); line-height: 1.15; font-weight: 700; letter-spacing: -0.03em; text-transform: uppercase; }
.list-clean { list-style: none; display: grid; gap: 12px; }
.list-clean li { position: relative; padding: 0 0 0 22px; color: var(--fg-2); }
.list-clean li::before { content: ""; position: absolute; left: 0; top: 9px; width: 9px; height: 9px; background: var(--accent); }
.list-clean li strong { color: var(--fg); }

/* Palette + type scale */
.token-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 24px; margin-bottom: 64px; }
.swatch-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.swatch-card { padding: 14px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--elev-raised); }
.swatch-chip { height: 88px; margin-bottom: 12px; border: 1px solid var(--border); }
.swatch-meta { display: grid; gap: 5px; }
.swatch-meta strong { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.swatch-meta span { color: var(--fg-2); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; }
.scale-card { padding: 20px 22px; border: 1px solid var(--border); background: var(--surface); box-shadow: var(--tm-shadow-hard); }
.scale-list { display: grid; gap: 16px; }
.scale-row { padding-bottom: 14px; border-bottom: 1px solid var(--border-soft); }
.scale-row:last-child { padding-bottom: 0; border-bottom: none; }
.scale-kicker { display: block; margin-bottom: 8px; color: var(--muted); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
.scale-display { display: block; }
.scale-display.display { font-size: clamp(2.2rem, 4vw, 4.2rem); line-height: 0.96; letter-spacing: -0.04em; font-weight: 700; text-transform: uppercase; }
.scale-display.section { font-size: 26px; line-height: 1.1; letter-spacing: -0.03em; font-weight: 700; text-transform: uppercase; }
.scale-display.body { font-size: 15px; line-height: 1.65; font-weight: 400; color: var(--fg-2); }
.scale-display.mono { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }

@media (max-width: 980px) {
    .token-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
    .container { width: min(100% - 24px, var(--container-max)); }
    .section { padding: var(--section-y-phone) 0; }
    .feature-3col { grid-template-columns: 1fr; }
    .swatch-grid { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="container" style="padding-top: 48px; padding-bottom: 48px;">

    <!-- PALETTE + TYPE SCALE -->
    <div class="section-head">
        <p class="eyebrow">Tokens</p>
        <h2>Palette & <span class="title-highlight">Type Scale</span></h2>
        <p>Neutral canvas, one vermillion accent, zero-radius geometry, and a Geist-led hierarchy that keeps the system sharp and technical.</p>
    </div>
    <div class="token-grid">
        <div class="swatch-grid">
            <article class="swatch-card">
                <div class="swatch-chip" style="background:#fafafa;"></div>
                <div class="swatch-meta">
                    <strong>Canvas</strong>
                    <span>#fafafa / neutral page background</span>
                </div>
            </article>
            <article class="swatch-card">
                <div class="swatch-chip" style="background:#ffffff;"></div>
                <div class="swatch-meta">
                    <strong>Surface</strong>
                    <span>#ffffff / cards and panels</span>
                </div>
            </article>
            <article class="swatch-card">
                <div class="swatch-chip" style="background:#27272a;"></div>
                <div class="swatch-meta">
                    <strong>Ink</strong>
                    <span>#27272a / primary text and dark actions</span>
                </div>
            </article>
            <article class="swatch-card">
                <div class="swatch-chip" style="background:#ff5a00;"></div>
                <div class="swatch-meta">
                    <strong>Accent</strong>
                    <span>#ff5a00 / single vermillion highlight</span>
                </div>
            </article>
        </div>
        <aside class="scale-card">
            <div class="scale-list">
                <div class="scale-row">
                    <span class="scale-kicker">Display / Geist Sans / 700</span>
                    <span class="scale-display display">Tom Modern</span>
                </div>
                <div class="scale-row">
                    <span class="scale-kicker">Section / Geist Sans / Uppercase</span>
                    <span class="scale-display section">Structured Editorial-Technical</span>
                </div>
                <div class="scale-row">
                    <span class="scale-kicker">Body / Geist Sans / 400</span>
                    <span class="scale-display body">A restrained system with hard borders, controlled rhythm, and a single accent used only where emphasis matters.</span>
                </div>
                <div class="scale-row">
                    <span class="scale-kicker">Mono / Geist Mono</span>
                    <span class="scale-display mono">labels / metadata / technical notes</span>
                </div>
            </div>
        </aside>
    </div>

    <!-- BUTTONS -->
    <div class="section-head">
        <p class="eyebrow">Buttons</p>
        <h2>Primary & <span class="title-highlight">Secondary</span></h2>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 64px;">
        <button class="button button-primary">Primary Action</button>
        <button class="button button-secondary">Secondary Action</button>
    </div>

    <!-- FEATURE CARDS -->
    <div class="section-head">
        <p class="eyebrow">Features</p>
        <h2>Three <span class="title-highlight">Columns</span></h2>
    </div>
    <div class="feature-3col" style="margin-bottom: 64px;">
        <article class="feature-3card">
            <div class="feature-3card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg></div>
            <h3>Layout Blocks</h3>
            <p>Hero, trust band, feature grids, panels, and more.</p>
        </article>
        <article class="feature-3card">
            <div class="feature-3card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
            <h3>Premium Cards</h3>
            <p>Token card with holographic sheen and code window.</p>
        </article>
        <article class="feature-3card">
            <div class="feature-3card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg></div>
            <h3>Interactive</h3>
            <p>Tabs, FAQ accordion, contact forms with JS.</p>
        </article>
    </div>

    <!-- PANEL -->
    <div class="panel" style="margin-bottom: 64px;">
        <div class="panel-head">
            <span class="panel-tick"></span>
            <h2>Key Features</h2>
        </div>
        <ul class="list-clean">
            <li><strong>Automation:</strong> Key binding on order status transition.</li>
            <li><strong>Uniqueness:</strong> Same code never issued twice.</li>
            <li><strong>Stock sync:</strong> Quantity auto-recalculates from free key count.</li>
        </ul>
    </div>

    <!-- PRICING -->
    <div class="section-head">
        <p class="eyebrow">Pricing</p>
        <h2>One <span class="title-highlight">Plan</span></h2>
    </div>
    <div class="pricing-grid" style="margin-bottom: 64px;">
        <div>
            <p style="color: var(--fg-2); line-height: var(--leading-body);">Everything included in a single subscription. No hidden fees.</p>
        </div>
        <div class="pricing-card frame">
            <div class="pricing-head">
                <span>Platform</span>
                <strong>$49</strong>
                <small>/ month</small>
            </div>
            <ul class="plain-list">
                <li>AI insights and problem list</li>
                <li>Replay and heatmaps</li>
                <li>Revenue loss counter</li>
                <li>Trigger forms</li>
                <li>Email notifications</li>
                <li>Unlimited users</li>
            </ul>
            <a class="button button-primary button-block" href="#">Get Started</a>
        </div>
    </div>

    <!-- TOKEN CARD -->
    <div class="section-head">
        <p class="eyebrow">Premium Component</p>
        <h2>Token <span class="title-highlight">Card</span></h2>
    </div>
    <div style="display: flex; justify-content: center; margin-bottom: 64px;">
        <div class="key-card-frame">
            <div class="key-card-meta">
                <span>Preview</span>
                <span>Sample</span>
            </div>
            <div class="key-card">
                <div class="key-card__sheen"></div>
                <div class="key-card__label">Activation Key</div>
                <div class="key-card__value">
                    <span>8F2C</span><span class="sep">-</span><span class="seg--dim">ZQ91</span><span class="sep">-</span><span>K4D7</span><span class="sep">-</span><span class="seg--dim">TX5E</span>
                </div>
                <div class="key-card__perforation">
                    <div class="key-card__footer">
                        <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>Unique</span>
                        <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>1 Code = 1 Order</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CODE WINDOW -->
    <div class="section-head">
        <p class="eyebrow">Premium Component</p>
        <h2>Code <span class="title-highlight">Window</span></h2>
    </div>
    <div class="tm-code-window">
        <div class="tm-code-header">
            <span class="tm-code-dots"><span></span><span></span><span></span></span>
            <span class="tm-code-title">example.js</span>
        </div>
        <div class="tm-code-body">
<pre><code><span class="token-keyword">const</span> <span class="token-function">pluckDeep</span> = <span class="token-property">key</span> <span class="token-punctuation">=></span> <span class="token-property">obj</span> <span class="token-punctuation">=></span>
  key<span class="token-punctuation">.</span><span class="token-function">split</span>(<span class="token-string">'.'</span>)<span class="token-punctuation">.</span><span class="token-function">reduce</span>(
    (<span class="token-property">accum</span><span class="token-punctuation">,</span> <span class="token-property">key</span>) <span class="token-punctuation">=></span> accum<span class="token-punctuation">[</span>key<span class="token-punctuation">]</span><span class="token-punctuation">,</span>
    obj
  )<span class="token-punctuation">;</span>

<span class="token-comment">// Extract tokens from page styles</span>
<span class="token-keyword">const</span> <span class="token-function">analyze</span> <span class="token-punctuation">=</span> <span class="token-keyword">async</span> (<span class="token-property">url</span>) <span class="token-punctuation">=></span> <span class="token-punctuation">{</span>
  <span class="token-keyword">const</span> tokens <span class="token-punctuation">=</span> <span class="token-keyword">await</span> <span class="token-function">extractDesignTokens</span>(url)<span class="token-punctuation">;</span>
  <span class="token-keyword">return</span> <span class="token-function">createDesignMarkdown</span>(tokens)<span class="token-punctuation">;</span>
<span class="token-punctuation">}</span><span class="token-punctuation">;</span></code></pre>
        </div>
    </div>

</div>

</body>
</html>
`};exports.default=tom_modern_default;return module.exports}});
//# sourceMappingURL=client.tom-modern.js.map