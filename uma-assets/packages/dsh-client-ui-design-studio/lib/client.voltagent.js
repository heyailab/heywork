
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.voltagent.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var voltagent_default={"contract":`## 1. Visual Theme & Atmosphere

VoltAgent's interface is a deep-space command terminal for the AI age — a developer-facing darkness built on near-pure-black surfaces (\`#050507\`) where the only interruption is the electric pulse of emerald green energy. The entire experience evokes the feeling of staring into a high-powered IDE at 2am: dark, focused, and alive with purpose. This is not a friendly SaaS landing page — it's an engineering platform that announces itself through code snippets, architectural diagrams, and raw technical confidence.

The green accent (\`#00d992\`) is used with surgical precision — it glows from headlines, borders, and interactive elements like a circuit board carrying a signal. Against the carbon-black canvas, this green reads as "power on" — a deliberate visual metaphor for an AI agent engineering platform. The supporting palette is built entirely from warm-neutral grays (\`#3d3a39\`, \`#8b949e\`, \`#b8b3b0\`) that soften the darkness without introducing color noise, creating a cockpit-like warmth that pure blue-grays would lack.

Typography leans on the system font stack for headings — achieving maximum rendering speed and native-feeling authority — while Inter carries the body and UI text with geometric precision. Code blocks use SFMono-Regular, the same font developers see in their terminals, reinforcing the tool's credibility at every scroll.

**Key Characteristics:**
- Carbon-black canvas (\`#050507\`) with warm-gray border containment (\`#3d3a39\`) — not cold or sterile
- Single-accent identity: Emerald Signal Green (\`#00d992\`) as the sole chromatic energy source
- Dual-typography system: system-ui for authoritative headings, Inter for precise UI/body text, SFMono for code credibility
- Ultra-tight heading line-heights (1.0–1.11) creating dense, compressed power blocks
- Warm neutral palette (\`#3d3a39\`, \`#8b949e\`, \`#b8b3b0\`) that prevents the dark theme from feeling clinical
- Developer-terminal aesthetic where code snippets ARE the hero content
- Green glow effects (\`drop-shadow\`, border accents) that make UI elements feel electrically alive

## 4. Component Stylings

### Buttons

**Ghost / Outline (Standard)**
- Background: transparent
- Text: Pure White (\`#ffffff\`)
- Padding: comfortable (12px 16px)
- Border: thin solid Warm Charcoal (\`1px solid #3d3a39\`)
- Radius: comfortably rounded (6px)
- Hover: background darkens to \`rgba(0, 0, 0, 0.2)\`, opacity drops to 0.4
- Outline: subtle green tint (\`rgba(33, 196, 93, 0.5)\`)
- The default interactive element — unassuming but clearly clickable

**Primary Green CTA**
- Background: Carbon Surface (\`#101010\`)
- Text: VoltAgent Mint (\`#2fd6a1\`)
- Padding: comfortable (12px 16px)
- Border: none visible (outline-based focus indicator)
- Outline: VoltAgent Mint (\`rgb(47, 214, 161)\`)
- Hover: same darkening behavior as Ghost
- The "powered on" button — green text on dark surface reads as an active terminal command

**Tertiary / Emphasized Container Button**
- Background: Carbon Surface (\`#101010\`)
- Text: Snow White (\`#f2f2f2\`)
- Padding: generous (20px all sides)
- Border: thick solid Warm Charcoal (\`3px solid #3d3a39\`)
- Radius: comfortably rounded (8px)
- A card-like button treatment for larger interactive surfaces (code copy blocks, feature CTAs)

### Cards & Containers
- Background: Carbon Surface (\`#101010\`) — one shade lighter than the page canvas
- Border: \`1px solid #3d3a39\` (Warm Charcoal) for standard containment; \`2px solid #00d992\` for highlighted/active cards
- Radius: comfortably rounded (8px) for content cards; subtly rounded (4–6px) for smaller inline containers
- Shadow Level 1: Warm Ambient Haze (\`rgba(92, 88, 85, 0.2) 0px 0px 15px\`) for standard elevation
- Shadow Level 2: Deep Dramatic (\`rgba(0, 0, 0, 0.7) 0px 20px 60px\` + \`rgba(148, 163, 184, 0.1) 0px 0px 0px 1px inset\`) for hero/feature showcase cards
- Hover behavior: likely border color shift toward green accent or subtle opacity increase
- Dashed variant: \`1px dashed rgba(79, 93, 117, 0.4)\` for workflow/diagram containers — visually distinct from solid-border content cards

### Inputs & Forms
- No explicit input token data extracted — the site is landing-page focused with minimal form UI
- The npm install command (\`npm create voltagent-app@latest\`) is presented as a code block rather than an input field
- Inferred style: Carbon Surface background, Warm Charcoal border, VoltAgent Mint focus ring, Snow White text

### Navigation
- Sticky top nav bar on Abyss Black canvas
- Logo: VoltAgent bolt icon with animated green glow (\`drop-shadow\` cycling 2px–8px)
- Nav structure: Logo → Product dropdown → Use Cases dropdown → Resources dropdown → GitHub stars badge → Docs CTA
- Link text: Snow White (\`#f2f2f2\`) at 14–16px Inter, weight 500
- Hover: links transition to green variants (\`#00c182\` or \`#00ffaa\`)
- GitHub badge: social proof element integrated directly into nav
- Mobile: collapses to hamburger menu, single-column vertical layout

### Image Treatment
- Dark-themed product screenshots and architectural diagrams dominate
- Code blocks are treated as primary visual content — syntax-highlighted with SFMono-Regular
- Agent workflow visualizations appear as interactive node graphs with green connection lines
- Decorative dot-pattern backgrounds appear behind hero sections
- Full-bleed within card containers, respecting 8px radius rounding

### Distinctive Components

**npm Install Command Block**
- A prominent code snippet (\`npm create voltagent-app@latest\`) styled as a copyable command
- SFMono-Regular on Carbon Surface with a copy-to-clipboard button
- Functions as the primary CTA — "install first, read later" developer psychology

**Company Logo Marquee**
- Horizontal scrolling strip of developer/company logos
- Infinite animation (\`scrollLeft\`/\`scrollRight\`, 25–80s durations)
- Pauses on hover and for users with reduced-motion preferences
- Demonstrates ecosystem adoption without cluttering the layout

**Feature Section Cards**
- Large cards combining code examples with descriptive text
- Left: code snippet with syntax highlighting; Right: feature description
- Green accent border (\`2px solid #00d992\`) on highlighted/active features
- Internal padding: generous (24–32px estimated)

**Agent Flow Diagrams**
- Interactive node-graph visualizations showing agent coordination
- Connection lines use VoltAgent green variants
- Nodes styled as mini-cards within the Warm Charcoal border system

**Community / GitHub Section**
- Large GitHub icon as the visual anchor
- Star count and contributor metrics prominently displayed
- Warm social proof: Discord, X, Reddit, LinkedIn, YouTube links in footer

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 4px, 5px, 6px, 6.4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 40px, 48px, 64px
- Button padding: 12px 16px (standard), 20px (container-button)
- Card internal padding: approximately 24–32px
- Section vertical spacing: generous (estimated 64–96px between major sections)
- Component gap: 16–24px between sibling cards/elements

### Grid & Container
- Max container width: approximately 1280–1440px, centered
- Hero: centered single-column with maximum breathing room
- Feature sections: alternating asymmetric layouts (code left / text right, then reversed)
- Logo marquee: full-width horizontal scroll, breaking the container constraint
- Card grids: 2–3 column for feature showcases
- Integration grid: responsive multi-column for partner/integration icons

### Whitespace Philosophy
- **Cinematic breathing room between sections**: Massive vertical gaps create a "scroll-through-chapters" experience — each section feels like a new scene.
- **Dense within components**: Cards and code blocks are internally compact, with tight line-heights and controlled padding. Information is concentrated, not spread thin.
- **Border-defined separation**: Rather than relying solely on whitespace, VoltAgent uses the Warm Charcoal border system (\`#3d3a39\`) to delineate content zones. The border IS the whitespace signal.
- **Hero-first hierarchy**: The top of the page commands the most space — the "AI Agent Engineering Platform" headline and npm command get maximum vertical runway before the first content section appears.

### Border Radius Scale
- Nearly squared (4px): Small inline elements, SVG containers, code spans — the sharpest treatment, conveying technical precision
- Subtly rounded (6px): Buttons, links, clipboard actions — the workhorse radius for interactive elements
- Code-specific (6.4px): Code blocks, \`pre\` elements, clipboard copy targets — a deliberate micro-distinction from standard 6px
- Comfortably rounded (8px): Content cards, feature containers, emphasized buttons — the standard containment radius
- Pill-shaped (9999px): Tags, badges, status indicators, pill-shaped navigation elements — the roundest treatment for small categorical labels

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background (\`#050507\`), inline text |
| Contained (Level 1) | \`1px solid #3d3a39\`, no shadow | Standard cards, nav bar, code blocks |
| Emphasized (Level 2) | \`3px solid #3d3a39\`, no shadow | Large interactive buttons, emphasized containers |
| Accent (Level 3) | \`2px solid #00d992\`, no shadow | Active/highlighted feature cards, selected states |
| Ambient Glow (Level 4) | \`rgba(92, 88, 85, 0.2) 0px 0px 15px\` | Elevated cards, hover states, soft atmospheric lift |
| Dramatic Float (Level 5) | \`rgba(0, 0, 0, 0.7) 0px 20px 60px\` + \`rgba(148, 163, 184, 0.1) 1px inset\` | Hero feature showcase, modals, maximum-elevation content |

**Shadow Philosophy**: VoltAgent communicates depth primarily through **border weight and color**, not shadows. The standard \`1px solid #3d3a39\` border IS the elevation — adding a \`3px\` border weight or switching to green (\`#00d992\`) communicates importance more than adding shadow does. When shadows do appear, they're either warm and diffused (Level 4) or cinematic and dramatic (Level 5) — never medium or generic.

### Decorative Depth
- **Green Signal Glow**: The VoltAgent bolt logo pulses with a \`drop-shadow\` animation cycling between 2px and 8px blur radius in Emerald Signal Green. This is the most distinctive decorative element — it makes the logo feel "powered on."
- **Warm Charcoal Containment Lines**: The warm tone of \`#3d3a39\` borders creates a subtle visual warmth against the cool black, as if the cards are faintly heated from within.
- **Dashed Workflow Lines**: \`1px dashed rgba(79, 93, 117, 0.4)\` creates a blueprint-like aesthetic for architecture diagrams, visually distinct from solid content borders.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Small Mobile | <420px | Minimum layout, stacked everything, reduced hero text to ~24px |
| Mobile | 420–767px | Single column, hamburger nav, full-width cards, hero text ~36px |
| Tablet | 768–1024px | 2-column grids begin, condensed nav, medium hero text |
| Desktop | 1025–1440px | Full multi-column layout, expanded nav with dropdowns, large hero (60px) |
| Large Desktop | >1440px | Max-width container centered (est. 1280–1440px), generous horizontal margins |

*23 breakpoints detected in total, ranging from 360px to 1992px — indicating a fluid, heavily responsive grid system rather than fixed breakpoint snapping.*

### Touch Targets
- Buttons use comfortable padding (12px 16px minimum) ensuring adequate touch area
- Navigation links spaced with sufficient gap for thumb navigation
- Interactive card surfaces are large enough to serve as full touch targets
- Minimum recommended touch target: 44x44px

### Collapsing Strategy
- **Navigation**: Full horizontal nav with dropdowns collapses to hamburger menu on mobile
- **Feature grids**: 3-column → 2-column → single-column vertical stacking
- **Hero text**: 60px → 36px → 24px progressive scaling with maintained compression ratios
- **Logo marquee**: Adjusts scroll speed and item sizing; maintains infinite loop
- **Code blocks**: Horizontal scroll on smaller viewports rather than wrapping — preserving code readability
- **Section padding**: Reduces proportionally but maintains generous vertical rhythm between chapters
- **Cards**: Stack vertically on mobile with full-width treatment and maintained internal padding

### Image Behavior
- Dark-themed screenshots and diagrams scale proportionally within containers
- Agent flow diagrams simplify or scroll horizontally on narrow viewports
- Dot-pattern decorative backgrounds scale with viewport
- No visible art direction changes between breakpoints — same crops, proportional scaling
- Lazy loading for below-fold images (Docusaurus default behavior)`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>VoltAgent - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/voltagent: dark agent runtime surfaces, neon green command signals, and technical orchestration cards." />
    <style>
      :root {
        --bg: #07110c;
        --surface: #101c16;
        --surface-warm: #14281e;
        --fg: #f4fff8;
        --fg-2: #c8dfd0;
        --muted: #8ba493;
        --meta: #7cff6b;
        --border: #254132;
        --border-soft: #1a3024;
        --accent: #7cff6b;
        --accent-on: #07110c;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #52e875;
        --warn: #facc15;
        --danger: #fb7185;
        --font-display: Inter, system-ui, sans-serif;
        --font-body: Inter, system-ui, sans-serif;
        --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 15px;
        --text-lg: 17px;
        --text-xl: 22px;
        --text-2xl: 32px;
        --text-3xl: 46px;
        --text-4xl: 64px;
        --leading-body: 1.56;
        --leading-tight: 1.07;
        --tracking-display: -0.02em;
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
        --radius-md: 12px;
        --radius-lg: 18px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 24px 70px rgba(0, 0, 0, 0.42);
        --focus-ring: 0 0 0 4px rgba(124, 255, 107, 0.30);
        --motion-fast: 120ms;
        --motion-base: 210ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 36px;
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
      .page { min-height: 100vh; background: radial-gradient(circle at 78% 12%, rgba(124, 255, 107, 0.24), transparent 34%), #07110c; }
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) { .container { padding-inline: var(--container-gutter-tablet); } section { padding-block: var(--section-y-tablet); } }
      @media (max-width: 639px) { .container { padding-inline: var(--container-gutter-phone); } section { padding-block: var(--section-y-phone); } }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-display); }
      h1 { max-width: 820px; font-size: var(--text-4xl); font-weight: 760; }
      h2 { font-size: var(--text-3xl); font-weight: 700; }
      h3 { font-size: var(--text-xl); font-weight: 700; }
      .eyebrow { color: var(--meta); font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      .lead { max-width: 640px; color: var(--fg-2); font-size: var(--text-lg); }
      .hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr); gap: var(--space-8); align-items: center; }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-block-start: var(--space-6); }
      .btn {
        display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 var(--space-5);
        border: 1px solid transparent; border-radius: var(--radius-md); font: 700 var(--text-sm) / 1 var(--font-body);
        color: inherit; text-decoration: none; cursor: pointer; transition: background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface); color: var(--fg); border-color: var(--border); box-shadow: var(--elev-ring); }
      .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
      .panel { background: color-mix(in oklab, var(--surface), transparent 4%); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--elev-raised); overflow: hidden; }
      .panel-head { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); padding: var(--space-5); border-bottom: 1px solid var(--border-soft); }
      .status { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--meta); font: 700 var(--text-xs) / 1 var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; }
      .status::before { width: 8px; height: 8px; border-radius: var(--radius-pill); background: var(--success); content: ""; }
      .metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--border-soft); }
      .metric { padding: var(--space-5); border-right: 1px solid var(--border-soft); }
      .metric:last-child { border-right: 0; }
      .metric strong { display: block; font-family: var(--font-display); font-size: var(--text-2xl); line-height: var(--leading-tight); }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); padding: var(--space-5); }
      .mini-card { min-height: 148px; padding: var(--space-5); border: 1px solid var(--border-soft); border-radius: var(--radius-md); background: var(--surface-warm); }
      .mini-card p, .tile p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      .swatches { display: flex; gap: var(--space-2); margin-block-start: var(--space-4); }
      .swatch { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--border); }
      .swatch.accent { background: var(--accent); } .swatch.surface { background: var(--surface); } .swatch.warm { background: var(--surface-warm); } .swatch.fg { background: var(--fg); }
      .field { display: grid; gap: var(--space-2); margin-block-start: var(--space-5); }
      label { color: var(--fg-2); font-size: var(--text-sm); font-weight: 700; }
      input { width: 100%; min-height: 46px; padding: 0 var(--space-4); border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--fg); font: inherit; }
      input:focus { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }
      .lower { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
      .tile { padding: var(--space-5); border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
      @media (max-width: 860px) { .hero, .lower { grid-template-columns: 1fr; } .metric-grid, .card-row { grid-template-columns: 1fr; } .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); } .metric:last-child { border-bottom: 0; } }
    </style>
  </head>
  <body>
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">VoltAgent design system</p>
            <h1>Agent runtime lab</h1>
            <p class="lead">AI agent orchestration with electric green signals and dark developer modules.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary action</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="VoltAgent component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row">
              <div class="mini-card"><h3>Palette</h3><p>dark agent runtime surfaces, neon green command signals, and technical orchestration cards.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div>
              <div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same brand signal.</p><div class="field"><label for="voltagent-input">Reference input</label><input id="voltagent-input" value="VoltAgent system token" /></div></div>
            </div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use brand-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=voltagent_default;return module.exports}});
//# sourceMappingURL=client.voltagent.js.map