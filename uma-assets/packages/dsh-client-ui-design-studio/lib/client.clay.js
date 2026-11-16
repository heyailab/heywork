
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.clay.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var clay_default={"contract":`## 1. Visual Theme & Atmosphere

Clay's website is a warm, playful celebration of color that treats B2B data enrichment like a craft rather than an enterprise chore. The design language is built on a foundation of warm cream backgrounds (\`#faf9f7\`) and oat-toned borders (\`#dad4c8\`, \`#eee9df\`) that give every surface the tactile quality of handmade paper. Against this artisanal canvas, a vivid swatch palette explodes with personality — Matcha green, Slushie cyan, Lemon gold, Ube purple, Pomegranate pink, Blueberry navy, and Dragonfruit magenta — each named like flavors at a juice bar, not colors in an enterprise UI kit.

The typography is anchored by Roobert, a geometric sans-serif with character, loaded with an extensive set of OpenType stylistic sets (\`"ss01"\`, \`"ss03"\`, \`"ss10"\`, \`"ss11"\`, \`"ss12"\`) that give the text a distinctive, slightly quirky personality. At display scale (80px, weight 600), Roobert uses aggressive negative letter-spacing (-3.2px) that compresses headlines into punchy, billboard-like statements. Space Mono serves as the monospace companion for code and technical labels, completing the craft-meets-tech duality.

What makes Clay truly distinctive is its hover micro-animations: buttons on hover rotate slightly (\`rotateZ(-8deg)\`), translate upward (\`translateY(-80%)\`), change background to a contrasting swatch color, and cast a hard offset shadow (\`rgb(0,0,0) -7px 7px\`). This playful hover behavior — where a button literally tilts and jumps on interaction — creates a sense of physical delight that's rare in B2B software. Combined with generously rounded containers (24px–40px radius), dashed borders alongside solid ones, and a multi-layer shadow system that includes inset highlights, Clay feels like a design system that was made by people who genuinely enjoy making things.

**Key Characteristics:**
- Warm cream canvas (\`#faf9f7\`) with oat-toned borders (\`#dad4c8\`) — artisanal, not clinical
- Named swatch palette: Matcha, Slushie, Lemon, Ube, Pomegranate, Blueberry, Dragonfruit
- Roobert font with 5 OpenType stylistic sets — quirky geometric character
- Playful hover animations: rotateZ(-8deg) + translateY(-80%) + hard offset shadow
- Space Mono for code and technical labels
- Generous border radius: 24px cards, 40px sections, 1584px pills
- Mixed border styles: solid + dashed in the same interface
- Multi-layer shadow with inset highlight: \`0px 1px 1px\` + \`-1px inset\` + \`-0.5px\`

## 4. Component Stylings

### Buttons

**Primary (Transparent with Hover Animation)**
- Background: transparent (\`rgba(239, 241, 243, 0)\`)
- Text: \`#000000\`
- Padding: 6.4px 12.8px
- Border: none (or \`1px solid #717989\` for outlined variant)
- Hover: background shifts to swatch color (e.g., \`#434346\`), text to white, \`rotateZ(-8deg)\`, \`translateY(-80%)\`, hard shadow \`rgb(0,0,0) -7px 7px\`
- Focus: \`rgb(20, 110, 245) solid 2px\` outline

**White Solid**
- Background: \`#ffffff\`
- Text: \`#000000\`
- Padding: 6.4px
- Hover: oat-200 swatch color, animated rotation + shadow
- Use: Primary CTA on colored sections

**Ghost Outlined**
- Background: transparent
- Text: \`#000000\`
- Padding: 8px
- Border: \`1px solid #717989\`
- Radius: 4px
- Hover: dragonfruit swatch color, white text, animated rotation

### Cards & Containers
- Background: \`#ffffff\` on cream canvas
- Border: \`1px solid #dad4c8\` (warm oat) or \`1px dashed #dad4c8\`
- Radius: 12px (standard cards), 24px (feature cards/images), 40px (section containers/footer)
- Shadow: \`rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px\`
- Colorful section backgrounds using swatch palette (matcha, slushie, ube, lemon)

### Inputs & Forms
- Text: \`#000000\`
- Border: \`1px solid #717989\`
- Radius: 4px
- Focus: \`rgb(20, 110, 245) solid 2px\` outline

### Navigation
- Sticky top nav on cream background
- Roobert 15px weight 500 for nav links
- Clay logo left-aligned
- CTA buttons right-aligned with pill radius
- Border bottom: \`1px solid #dad4c8\`
- Mobile: hamburger collapse at 767px

### Image Treatment
- Product screenshots in white cards with oat borders
- Colorful illustrated sections with swatch background colors
- 8px–24px radius on images
- Full-width colorful section backgrounds

### Distinctive Components

**Swatch Color Sections**
- Full-width sections with swatch-colored backgrounds (matcha green, slushie cyan, ube purple, lemon gold)
- White text on dark swatches, black text on light swatches
- Each section tells a distinct product story through its color

**Playful Hover Buttons**
- Rotate -8deg + translate upward on hover
- Hard offset shadow (\`-7px 7px\`) instead of soft blur
- Background transitions to contrasting swatch color
- Creates a physical, toy-like interaction quality

**Dashed Border Elements**
- Dashed borders (\`1px dashed #dad4c8\`) alongside solid borders
- Used for secondary containers and decorative elements
- Adds a hand-drawn, craft-like quality

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 6.4px, 8px, 12px, 12.8px, 16px, 18px, 20px, 24px

### Grid & Container
- Max content width centered
- Feature sections alternate between white cards and colorful swatch backgrounds
- Card grids: 2–3 columns on desktop
- Full-width colorful sections break the grid
- Footer with generous 40px radius container

### Whitespace Philosophy
- **Warm, generous breathing**: The cream background provides a warm rest between content blocks. Spacing is generous but not austere — it feels inviting, like a well-set table.
- **Color as spatial rhythm**: The alternating swatch-colored sections create visual rhythm through hue rather than just whitespace. Each color section is its own "room."
- **Craft-like density inside cards**: Within cards, content is compact and well-organized, contrasting with the generous outer spacing.

### Border Radius Scale
- Sharp (4px): Ghost buttons, inputs
- Standard (8px): Small cards, images, links
- Badge (11px): Tag badges
- Card (12px): Standard cards, buttons
- Feature (24px): Feature cards, images, panels
- Section (40px): Large sections, footer, containers
- Pill (1584px): CTAs, pill-shaped buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, cream canvas | Page background |
| Clay Shadow (Level 1) | \`rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px inset, rgba(0,0,0,0.05) 0px -0.5px\` | Cards, buttons — multi-layer with inset highlight |
| Hover Hard (Level 2) | \`rgb(0,0,0) -7px 7px\` | Hover state — playful hard offset shadow |
| Focus (Level 3) | \`rgb(20, 110, 245) solid 2px\` | Keyboard focus ring |

**Shadow Philosophy**: Clay's shadow system is uniquely three-layered: a downward cast (\`0px 1px 1px\`), an upward inset highlight (\`0px -1px 1px inset\`), and a subtle edge (\`0px -0.5px 1px\`). This creates a "pressed into clay" quality where elements feel both raised AND embedded — like a clay tablet where content is stamped into the surface. The hover hard shadow (\`-7px 7px\`) is deliberately retro-graphic, referencing print-era drop shadows and adding physical playfulness.

### Decorative Depth
- Full-width swatch-colored sections create dramatic depth through color contrast
- Dashed borders add visual texture alongside solid borders
- Product illustrations with warm, organic art style

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <479px | Single column, tight padding |
| Mobile | 479–767px | Standard mobile, stacked layout |
| Tablet | 768–991px | 2-column grids, condensed nav |
| Desktop | 992px+ | Full layout, 3-column grids, expanded sections |

### Touch Targets
- Buttons: minimum 6.4px + 12.8px padding for adequate touch area
- Nav links: 15px font with generous spacing
- Mobile: full-width buttons for easy tapping

### Collapsing Strategy
- Hero: 80px → 60px → smaller display text
- Navigation: horizontal → hamburger at 767px
- Feature sections: multi-column → stacked
- Colorful sections: maintain full-width but compress padding
- Card grids: 3-column → 2-column → single column

### Image Behavior
- Product screenshots scale proportionally
- Colorful section illustrations adapt to viewport width
- Rounded corners maintained across breakpoints`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Clay - reference components</title>
    <meta name="description" content="Reference fixture for design-systems/clay: soft clay interface with molded surfaces, warm shadows, and approachable controls." />
    <style>
      :root {
        --bg: #f7eee6;
        --surface: #fff8f1;
        --surface-warm: #ead6c7;
        --fg: #2b211c;
        --fg-2: #5a4b43;
        --muted: #8a7a70;
        --meta: #b46a46;
        --border: #dac8b9;
        --border-soft: #eaded4;
        --accent: #b46a46;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #4d8f5a;
        --warn: #c88735;
        --danger: #b84c4c;
        --font-display: Inter, system-ui, sans-serif;
        --font-body: Inter, system-ui, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 54px;
        --text-4xl: 76px;
        --leading-body: 1.52;
        --leading-tight: 1.06;
        --tracking-display: -0.025em;
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
        --radius-sm: 14px;
        --radius-md: 22px;
        --radius-lg: 34px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 8px 10px 24px rgba(128, 92, 70, 0.18), -8px -8px 20px rgba(255, 255, 255, 0.70);
        --focus-ring: 0 0 0 4px rgba(180, 106, 70, 0.24);
        --motion-fast: 150ms;
        --motion-base: 240ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);
        --container-max: 1180px;
        --container-gutter-desktop: 36px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { min-height: 100vh; background: var(--bg); color: var(--fg); font-family: var(--font-body); font-size: var(--text-base); line-height: var(--leading-body); -webkit-font-smoothing: antialiased; }
      .page { min-height: 100vh; background: linear-gradient(135deg, #f7eee6 0%, #fff8f1 100%); }
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) { .container { padding-inline: var(--container-gutter-tablet); } section { padding-block: var(--section-y-tablet); } }
      @media (max-width: 639px) { .container { padding-inline: var(--container-gutter-phone); } section { padding-block: var(--section-y-phone); } }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 { font-family: var(--font-display); line-height: var(--leading-tight); letter-spacing: var(--tracking-display); }
      h1 { max-width: 840px; font-size: var(--text-4xl); font-weight: 760; }
      h2 { font-size: var(--text-3xl); font-weight: 700; }
      h3 { font-size: var(--text-xl); font-weight: 700; }
      .eyebrow { color: var(--meta); font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      .lead { max-width: 640px; color: var(--fg-2); font-size: var(--text-lg); }
      .hero { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr); gap: var(--space-8); align-items: center; }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-block-start: var(--space-6); }
      .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 var(--space-5); border: 1px solid transparent; border-radius: var(--radius-md); font: 700 var(--text-sm) / 1 var(--font-body); color: inherit; text-decoration: none; cursor: pointer; transition: background-color var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard); }
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
            <p class="eyebrow">Clay design system</p>
            <h1>Soft molded interface</h1>
            <p class="lead">Tactile clay surfaces, raised controls, and warm product cards for playful tools.</p>
            <div class="actions" aria-label="Reference actions"><a class="btn btn-primary" href="#">Primary action</a><a class="btn btn-secondary" href="#">Secondary action</a></div>
          </div>
          <article class="panel" aria-label="Clay component preview">
            <div class="panel-head"><div><p class="eyebrow">Live module</p><h3>Reference component</h3></div><span class="status">online</span></div>
            <div class="metric-grid"><div class="metric"><strong>98%</strong><span>Signal quality</span></div><div class="metric"><strong>24</strong><span>Active flows</span></div><div class="metric"><strong>3.2s</strong><span>Response time</span></div></div>
            <div class="card-row"><div class="mini-card"><h3>Palette</h3><p>soft clay interface with molded surfaces, warm shadows, and approachable controls.</p><div class="swatches" aria-label="Token swatches"><span class="swatch accent"></span><span class="swatch surface"></span><span class="swatch warm"></span><span class="swatch fg"></span></div></div><div class="mini-card"><h3>Control</h3><p>Focus, hover, and status states share the same system signal.</p><div class="field"><label for="clay-input">Reference input</label><input id="clay-input" value="Clay system token" /></div></div></div>
          </article>
        </div>
      </section>
      <section><div class="container lower"><article class="tile"><p class="eyebrow">Typography</p><h2>Display rhythm</h2><p>Headlines use the display stack with the declared scale and leading.</p></article><article class="tile"><p class="eyebrow">Surface</p><h2>Layer system</h2><p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p></article><article class="tile"><p class="eyebrow">Interaction</p><h2>Motion states</h2><p>Buttons, inputs, and panels use system-specific focus rings and easing.</p></article></div></section>
    </main>
  </body>
</html>
`};exports.default=clay_default;return module.exports}});
//# sourceMappingURL=client.clay.js.map