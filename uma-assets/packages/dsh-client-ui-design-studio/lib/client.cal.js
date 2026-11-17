
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.cal.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var cal_default={"contract":`## 1. Visual Theme & Atmosphere

Cal.com's website is a masterclass in monochromatic restraint — a grayscale world where boldness comes not from color but from the sheer confidence of black text on white space. Inspired by Uber's minimal aesthetic, the palette is deliberately stripped of hue: near-black headings (\`#242424\`), mid-gray secondary text (\`#898989\`), and pure white surfaces. Color is treated as a foreign substance — when it appears (a rare blue link, a green trust badge), it feels like a controlled accent in an otherwise black-and-white photograph.

Cal Sans, the brand's custom geometric display typeface designed by Mark Davis, is the visual centerpiece. Letters are intentionally spaced extremely close at large sizes, creating dense, architectural headlines that feel like they're carved into the page. At 64px and 48px, Cal Sans headings sit at weight 600 with a tight 1.10 line-height — confident, compressed, and immediately recognizable. For body text, the system switches to Inter, providing "rock-solid" readability that complements Cal Sans's display personality. The typography pairing creates a clear division: Cal Sans speaks, Inter explains.

The elevation system is notably sophisticated for a minimal site — 11 shadow definitions create a nuanced depth hierarchy using multi-layered shadows that combine ring borders (\`0px 0px 0px 1px\`), soft diffused shadows, and inset highlights. This shadow-first approach to depth (rather than border-first) gives surfaces a subtle three-dimensionality that feels modern and polished. Built on Framer with a border-radius scale from 2px to 9999px (pill), Cal.com balances geometric precision with soft, rounded interactive elements.

**Key Characteristics:**
- Purely grayscale brand palette — no brand colors, boldness through monochrome
- Cal Sans custom geometric display font with extremely tight default letter-spacing
- Multi-layered shadow system (11 definitions) with ring borders + diffused shadows + inset highlights
- Cal Sans for headings, Inter for body — clean typographic division
- Wide border-radius scale from 2px to 9999px (pill) — versatile rounding
- White canvas with near-black (#242424) text — maximum contrast, zero decoration
- Product screenshots as primary visual content — the scheduling UI sells itself
- Built on Framer platform

## 4. Component Stylings

### Buttons
- **Dark Primary**: \`#242424\` (or \`#1e1f23\`) background, white text, 6–8px radius. Hover: opacity reduction to 0.7. The signature CTA — maximally dark on white
- **White/Ghost**: White background with shadow-ring border, dark text. Uses the multi-layered shadow system for subtle elevation
- **Pill**: 9999px radius for rounded pill-shaped actions and badges
- **Compact**: 4px padding, small text — utility actions within product UI
- **Inset highlight**: Some buttons feature \`rgba(255, 255, 255, 0.15) 0px 2px 0px inset\` — a subtle inner-top highlight creating a 3D pressed effect

### Cards & Containers
- **Shadow Card**: White background, multi-layered shadow — \`rgba(19, 19, 22, 0.7) 0px 1px 5px -4px, rgba(34, 42, 53, 0.08) 0px 0px 0px 1px, rgba(34, 42, 53, 0.05) 0px 4px 8px 0px\`. The ring shadow (0px 0px 0px 1px) acts as a shadow-border
- **Product UI Cards**: Screenshots of the scheduling interface displayed in card containers with shadow elevation
- **Radius**: 8px for standard cards, 12px for larger containers, 16px for prominent sections
- **Hover**: Likely subtle shadow deepening or scale transform

### Inputs & Forms
- **Select dropdown**: White background, \`#000000\` text, 1px solid \`rgb(118, 118, 118)\` border
- **Focus**: Uses Framer's focus outline system (\`--framer-focus-outline\`)
- **Text input**: 8px radius, standard border treatment
- **Minimal form presence**: The marketing site prioritizes CTA buttons over complex forms

### Navigation
- **Top nav**: White/transparent background, Cal Sans links at near-black
- **Nav text**: \`#111111\` (Midnight) for primary links, \`#000000\` for emphasis
- **CTA button**: Dark Primary in the nav — high contrast call-to-action
- **Mobile**: Collapses to hamburger with simplified navigation
- **Sticky**: Fixed on scroll

### Image Treatment
- **Product screenshots**: Large scheduling UI screenshots — the product is the primary visual
- **Trust logos**: Grayscale company logos in a horizontal trust bar
- **Aspect ratios**: Wide landscape for product UI screenshots
- **No decorative imagery**: No illustrations, photos, or abstract graphics — pure product + typography

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 1px, 2px, 3px, 4px, 6px, 8px, 12px, 16px, 20px, 24px, 28px, 80px, 96px
- **Section padding**: 80px–96px vertical between major sections (generous)
- **Card padding**: 12px–24px internal
- **Component gaps**: 4px–8px between related elements
- **Notable jump**: From 28px to 80px — a deliberate gap emphasizing the section-level spacing tier

### Grid & Container
- **Max width**: ~1200px content container, centered
- **Column patterns**: Full-width hero, centered text blocks, 2-3 column feature grids
- **Feature showcase**: Product screenshots flanked by description text
- **Breakpoints**: 98px, 640px, 768px, 810px, 1024px, 1199px — Framer-generated

### Whitespace Philosophy
- **Lavish section spacing**: 80px–96px between sections creates a breathable, premium feel
- **Product-first content**: Screenshots dominate the visual space — minimal surrounding decoration
- **Centered headlines**: Cal Sans headings centered with generous margins above and below

### Border Radius Scale
- **2px**: Subtle rounding on inline elements
- **4px**: Small UI components
- **6px–7px**: Buttons, small cards, images
- **8px**: Standard interactive elements — buttons, inputs, images
- **12px**: Medium containers — links, larger cards, images
- **16px**: Large section containers
- **29px**: Special rounded elements
- **100px**: Large rounding — nearly circular on small elements
- **1000px**: Very large rounding
- **9999px**: Full pill shape — badges, links

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow | Page canvas, basic text containers |
| Level 1 (Inset) | \`rgba(0,0,0,0.16) 0px 1px 1.9px 0px inset\` | Pressed/recessed elements, input wells |
| Level 2 (Ring + Soft) | \`rgba(19,19,22,0.7) 0px 1px 5px -4px, rgba(34,42,53,0.08) 0px 0px 0px 1px, rgba(34,42,53,0.05) 0px 4px 8px\` | Cards, containers — the workhorse shadow |
| Level 3 (Ring + Soft Alt) | \`rgba(36,36,36,0.7) 0px 1px 5px -4px, rgba(36,36,36,0.05) 0px 4px 8px\` | Alt card elevation without ring border |
| Level 4 (Inset Highlight) | \`rgba(255,255,255,0.15) 0px 2px 0px inset\` or \`rgb(255,255,255) 0px 2px 0px inset\` | Button inner highlight — 3D pressed effect |
| Level 5 (Soft Only) | \`rgba(34,42,53,0.05) 0px 4px 8px\` | Subtle ambient shadow |

### Shadow Philosophy
Cal.com's shadow system is the most sophisticated element of the design — 11 shadow definitions using a multi-layered compositing technique:
- **Ring borders**: \`0px 0px 0px 1px\` shadows act as borders, avoiding CSS \`border\` entirely. This creates hairline containment without affecting layout
- **Diffused soft shadows**: \`0px 4px 8px\` at 5% opacity add gentle ambient depth
- **Sharp contact shadows**: \`0px 1px 5px -4px\` at 70% opacity create tight bottom-edge shadows for grounding
- **Inset highlights**: White inset shadows at the top of buttons create a subtle 3D bevel
- Shadows are composed in comma-separated stacks — each surface gets 2-3 layered shadow definitions working together

### Decorative Depth
- No gradients or glow effects
- All depth comes from the sophisticated shadow compositing system
- The overall effect is subtle but precise — surfaces feel like physical cards sitting on a table

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hero text ~36px, stacked features, hamburger nav |
| Tablet Small | 640px–768px | 2-column begins for some elements |
| Tablet | 768px–810px | Layout adjustments, fuller grid |
| Tablet Large | 810px–1024px | Multi-column feature grids |
| Desktop | 1024px–1199px | Full layout, expanded navigation |
| Large Desktop | >1199px | Max-width container, centered content |

### Touch Targets
- Buttons: 8px radius with comfortable padding (10px+ vertical)
- Nav links: Dark text with adequate spacing
- Mobile CTAs: Full-width dark buttons for easy thumb access
- Pill badges: 9999px radius creates large, tappable targets

### Collapsing Strategy
- **Navigation**: Full horizontal nav → hamburger on mobile
- **Hero**: 64px Cal Sans display → ~36px on mobile
- **Feature grids**: Multi-column → 2-column → single stacked column
- **Product screenshots**: Scale within containers, maintaining aspect ratios
- **Section spacing**: Reduces from 80px–96px to ~48px on mobile

### Image Behavior
- Product screenshots scale responsively
- Trust logos reflow to multi-row grid on mobile
- No art direction changes — same compositions at all sizes
- Images use 7px–12px border-radius for consistent rounded corners`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cal — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/cal. Pure-white canvas, charcoal
        (#242424) text, link-blue reserved for hyperlinks, and a multi-layer
        ring-shadow stack that replaces CSS borders."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: var(--surface);

        --fg: #242424;
        --fg-2: #111111;
        --muted: #898989;
        --meta: var(--muted);

        --border: rgba(34, 42, 53, 0.08);
        --border-soft: rgba(34, 42, 53, 0.05);

        --accent: #0099ff;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Cal Sans", "Inter", -apple-system, "Segoe UI", Arial, sans-serif;
        --font-body: "Inter", -apple-system, "Segoe UI", Arial, sans-serif;
        --font-mono: "Roboto Mono", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 48px;
        --text-4xl: 64px;

        --leading-body: 1.5;
        --leading-tight: 1.1;
        --tracking-display: 0;

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

        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 1px 5px -4px rgba(19, 19, 22, 0.7),
          0 0 0 1px rgba(34, 42, 53, 0.08),
          0 4px 8px rgba(34, 42, 53, 0.05);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
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
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — Cal Sans for display, Inter for body ─── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 600;              /* Cal Sans is designed for weight 600 */
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        color: var(--fg);
        margin: 0;
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-3xl); }
      h3 { font-size: var(--text-xl); line-height: 1.3; }
      p { margin: 0; }
      .lead {
        font-family: var(--font-body);
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: var(--leading-body);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — charcoal-on-white primary, ghost secondary ─ */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard),
                    opacity var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: charcoal (#242424) on white — Cal.com's signature CTA */
      .btn-primary {
        background: var(--fg);
        color: #ffffff;
      }
      .btn-primary:hover { opacity: 0.85; }
      .btn-primary:active { opacity: 0.75; }
      /* Secondary: white with ring-shadow border — uses the elevation system */
      .btn-secondary {
        background: var(--surface);
        color: var(--fg);
        box-shadow: var(--elev-ring);
      }
      .btn-secondary:hover {
        box-shadow:
          0 0 0 1px rgba(34, 42, 53, 0.12),
          0 1px 2px rgba(34, 42, 53, 0.04);
      }

      /* ─── Inputs — minimal, ring-on-focus ─────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg-2);
      }
      .field input {
        padding: 10px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — white surface, multi-layer ring-shadow stack ─ */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);  /* Cal.com's workhorse card shadow */
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        box-shadow:
          0 2px 8px -4px rgba(19, 19, 22, 0.7),
          0 0 0 1px rgba(34, 42, 53, 0.1),
          0 8px 16px rgba(34, 42, 53, 0.06);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px var(--space-2);
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.6;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 90%); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 92%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links — the only blue in the system ───────────────── */
      a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
      a:hover { color: var(--accent-hover); }
      a.card-link { text-decoration: none; color: var(--fg-2); font-weight: 500; }
      a.card-link:hover { color: var(--accent); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        background: var(--surface); color: var(--muted);
        box-shadow: var(--elev-ring);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface);
        box-shadow: var(--elev-raised);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
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
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · cal</p>
            <h1>Scheduling infrastructure for everyone.</h1>
            <p class="lead" style="max-width: 52ch">
              Open-source meetings, calendars, and booking links that just work —
              for individuals, teams, and the developers building the next wave
              of scheduling on top of an API they can read.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Booking status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--fg-2)">Booking API</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--muted)">Press <kbd>⌘</kbd> <kbd>K</kbd> to search availability.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">A calendar that gets out of the way.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Monochrome by design</h3>
            <p class="body-muted body-sm">
              Pure white canvas, charcoal (#242424) text, and a single
              link-blue. Boldness comes from contrast, not from color.
            </p>
            
          </article>
          <article class="card">
            <h3>Cal Sans speaks. Inter explains.</h3>
            <p class="body-muted body-sm">
              A custom geometric display face for headings, Inter for body.
              The font pairing enforces a clear typographic division —
              Cal Sans is never used below 16px.
            </p>
            
          </article>
          <article class="card">
            <h3>Shadows do the bordering</h3>
            <p class="body-muted body-sm">
              A multi-layer ring + contact + ambient shadow stack replaces
              CSS borders. Surfaces feel like physical cards sitting on a
              table — never floating, never flat.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Get scheduling at the speed of Cal.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs are minimal: hairline border, charcoal text, and the
              one link-blue makes its second appearance only on the focus
              ring — exactly where it earns its keep.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">We'll send your booking link and nothing else.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create my link</button>
              <button type="button" class="btn btn-secondary">See a demo</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=cal_default;return module.exports}});
//# sourceMappingURL=client.cal.js.map