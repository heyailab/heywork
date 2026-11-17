
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.elevenlabs.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var elevenlabs_default={"contract":`## 1. Visual Theme & Atmosphere

ElevenLabs' website is a study in restrained elegance — a near-white canvas (\`#ffffff\`, \`#f5f5f5\`) where typography and subtle shadows do all the heavy lifting. The design feels like a premium audio product brochure: clean, spacious, and confident enough to let the content speak (literally, given ElevenLabs makes voice AI). There's an almost Apple-like quality to the whitespace strategy, but warmer — the occasional warm stone tint (\`#f5f2ef\`, \`#777169\`) prevents the purity from feeling clinical.

The typography system is built on a fascinating duality: Waldenburg at weight 300 (light) for display headings creates ethereal, whisper-thin titles that feel like sound waves rendered in type — delicate, precise, and surprisingly impactful at large sizes. This light-weight display approach is the design's signature — where most sites use bold headings to grab attention, ElevenLabs uses lightness to create intrigue. Inter handles all body and UI text with workmanlike reliability, using slight positive letter-spacing (0.14px–0.18px) that gives body text an airy, well-spaced quality. WaldenburgFH appears as a bold uppercase variant for specific button labels.

What makes ElevenLabs distinctive is its multi-layered shadow system. Rather than simple box-shadows, elements use complex stacks: inset border-shadows (\`rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset\`), outline shadows (\`rgba(0,0,0,0.06) 0px 0px 0px 1px\`), and soft elevation shadows (\`rgba(0,0,0,0.04) 0px 4px 4px\`) — all at remarkably low opacities. The result is a design where surfaces seem to barely exist, floating just above the page with the lightest possible touch. Pill-shaped buttons (9999px) with warm-tinted backgrounds (\`rgba(245,242,239,0.8)\`) and warm shadows (\`rgba(78,50,23,0.04)\`) add a tactile, physical quality.

**Key Characteristics:**
- Near-white canvas with warm undertones (\`#f5f5f5\`, \`#f5f2ef\`)
- Waldenburg weight 300 (light) for display — ethereal, whisper-thin headings
- Inter with positive letter-spacing (0.14–0.18px) for body — airy readability
- Multi-layered shadow stacks at sub-0.1 opacity — surfaces barely exist
- Pill buttons (9999px) with warm stone-tinted backgrounds
- WaldenburgFH bold uppercase for specific CTA labels
- Warm shadow tints: \`rgba(78, 50, 23, 0.04)\` — shadows have color, not just darkness
- Geist Mono / ui-monospace for code snippets

## 4. Component Stylings

### Buttons

**Primary Black Pill**
- Background: \`#000000\`
- Text: \`#ffffff\`
- Padding: 0px 14px
- Radius: 9999px (full pill)
- Use: Primary CTA

**White Pill (Shadow-bordered)**
- Background: \`#ffffff\`
- Text: \`#000000\`
- Radius: 9999px
- Shadow: \`rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px\`
- Use: Secondary CTA on white

**Warm Stone Pill**
- Background: \`rgba(245, 242, 239, 0.8)\` (warm translucent)
- Text: \`#000000\`
- Padding: 12px 20px 12px 14px (asymmetric)
- Radius: 30px
- Shadow: \`rgba(78, 50, 23, 0.04) 0px 6px 16px\` (warm-tinted)
- Use: Featured CTA, hero action — the signature warm button

**Uppercase Waldenburg Button**
- Font: WaldenburgFH 14px weight 700
- Text-transform: uppercase
- Letter-spacing: 0.7px
- Use: Specific bold CTA labels

### Cards & Containers
- Background: \`#ffffff\`
- Border: \`1px solid #e5e5e5\` or shadow-as-border
- Radius: 16px–24px
- Shadow: multi-layer stack (inset + outline + elevation)
- Content: product screenshots, code examples, audio waveform previews

### Inputs & Forms
- Textarea: padding 12px 20px, transparent text at default
- Select: white background, standard styling
- Radio: standard with tw-ring focus
- Focus: \`var(--tw-ring-offset-shadow)\` ring system

### Navigation
- Clean white sticky header
- Inter 15px weight 500 for nav links
- Pill CTAs right-aligned (black primary, white secondary)
- Mobile: hamburger collapse at 1024px

### Image Treatment
- Product screenshots and audio waveform visualizations
- Warm gradient backgrounds in feature sections
- 20px–24px radius on image containers
- Full-width sections alternating white and light gray

### Distinctive Components

**Audio Waveform Sections**
- Colorful gradient backgrounds showcasing voice AI capabilities
- Warm amber, blue, and green gradients behind product demos
- Screenshots of the ElevenLabs product interface

**Warm Stone CTA Block**
- \`rgba(245,242,239,0.8)\` background with warm shadow
- Asymmetric padding (more right padding)
- Creates a physical, tactile quality unique to ElevenLabs

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 3px, 4px, 8px, 9px, 10px, 11px, 12px, 16px, 18px, 20px, 24px, 28px, 32px, 40px

### Grid & Container
- Centered content with generous max-width
- Single-column hero, expanding to feature grids
- Full-width gradient sections for product showcases
- White card grids on light gray backgrounds

### Whitespace Philosophy
- **Apple-like generosity**: Massive vertical spacing between sections creates a premium, unhurried pace. Each section is an exhibit.
- **Warm emptiness**: The whitespace isn't cold — the warm stone undertones and warm shadows give empty space a tactile, physical quality.
- **Typography-led rhythm**: The light-weight Waldenburg headings create visual "whispers" that draw the eye through vast white space.

### Border Radius Scale
- Minimal (2px): Small links, inline elements
- Subtle (4px): Nav items, tab panels, tags
- Standard (8px): Small containers
- Comfortable (10px–12px): Medium cards, dropdowns
- Card (16px): Standard cards, articles
- Large (18px–20px): Featured cards, code panels
- Section (24px): Large panels, section containers
- Warm Button (30px): Warm stone CTA
- Pill (9999px): Primary buttons, navigation pills

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Inset Edge (Level 0.5) | \`rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset, #fff 0px 0px 0px 0px inset\` | Internal border definition |
| Outline Ring (Level 1) | \`rgba(0,0,0,0.06) 0px 0px 0px 1px\` + \`rgba(0,0,0,0.04) 0px 1px 2px\` + \`rgba(0,0,0,0.04) 0px 2px 4px\` | Shadow-as-border for cards |
| Card (Level 2) | \`rgba(0,0,0,0.4) 0px 0px 1px, rgba(0,0,0,0.04) 0px 4px 4px\` | Button elevation, prominent cards |
| Warm Lift (Level 3) | \`rgba(78,50,23,0.04) 0px 6px 16px\` | Featured CTAs — warm-tinted |
| Focus (Accessibility) | \`var(--tw-ring-offset-shadow)\` blue ring | Keyboard focus |

**Shadow Philosophy**: ElevenLabs uses the most refined shadow system of any design system analyzed. Every shadow is at sub-0.1 opacity, many include both outward cast AND inward inset components, and the warm CTA shadows use an actual warm color (\`rgba(78,50,23,...)\`) rather than neutral black. The inset half-pixel borders (\`0px 0px 0px 0.5px inset\`) create edges so subtle they're felt rather than seen — surfaces define themselves through the lightest possible touch.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <1024px | Single column, hamburger nav, stacked sections |
| Desktop | >1024px | Full layout, horizontal nav, multi-column grids |

### Touch Targets
- Pill buttons with generous padding (12px–20px)
- Navigation links at 15px with adequate spacing
- Select dropdowns maintain comfortable sizing

### Collapsing Strategy
- Navigation: horizontal → hamburger at 1024px
- Feature grids: multi-column → stacked
- Hero: maintains centered layout, font scales proportionally
- Gradient sections: full-width maintained, content stacks
- Spacing compresses proportionally

### Image Behavior
- Product screenshots scale responsively
- Gradient backgrounds simplify on mobile
- Audio waveform previews maintain aspect ratio
- Rounded corners maintained across breakpoints`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ElevenLabs — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/elevenlabs. Achromatic premium:
        Waldenburg weight 300 headings, warm stone surfaces, multi-layer whisper shadows."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f5f5f5;
        --surface-warm: #f5f2ef;

        --fg: #000000;
        --fg-2: #4e4e4e;
        --muted: #777169;
        --meta: var(--muted);

        --border: #e5e5e5;
        --border-soft: rgba(0, 0, 0, 0.05);

        --accent: #000000;
        --accent-on: #ffffff;
        --accent-hover: #1a1a1a;
        --accent-active: #333333;

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Waldenburg", "Waldenburg Fallback", system-ui, sans-serif;
        --font-body: "Inter", "Inter Fallback", system-ui, -apple-system, sans-serif;
        --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 36px;
        --text-4xl: 48px;

        --leading-body: 1.5;
        --leading-tight: 1.08;
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
        --section-y-tablet: 64px;
        --section-y-phone: 48px;

        --radius-sm: 8px;
        --radius-md: 16px;
        --radius-lg: 24px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px, rgba(0, 0, 0, 0.04) 0px 2px 4px;
        --elev-raised: rgba(0, 0, 0, 0.4) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 4px;

        --focus-ring: 0 0 0 3px rgba(147, 197, 253, 0.5);

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
        letter-spacing: 0.16px; /* Inter positive tracking — airy reading */
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

      /* ─── Typography — Waldenburg weight 300 — the brand ────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 300;                 /* Light IS the brand — never bold */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: var(--tracking-display);
      }
      h1 { font-size: var(--text-4xl); }
      h2 { font-size: var(--text-2xl); }
      h3 { font-size: var(--text-xl); }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); letter-spacing: 0.18px; }
      .body-muted { color: var(--fg-2); }
      .body-sm { font-size: var(--text-sm); letter-spacing: 0.14px; }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        color: var(--muted);
        letter-spacing: 0.08em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — pill primary, warm stone CTA ────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-family: var(--font-body);
        font-size: 15px;
        font-weight: 500;
        line-height: 1.47;
        cursor: pointer;
        border: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary black pill */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        padding: 0 14px;
        height: 36px;
        border-radius: var(--radius-pill);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      /* Secondary: white pill with shadow-as-border */
      .btn-secondary {
        background: var(--bg);
        color: var(--fg);
        padding: 0 14px;
        height: 36px;
        border-radius: var(--radius-pill);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 4px;
      }
      .btn-secondary:hover {
        box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 4px 6px;
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; letter-spacing: 0.14px; }
      .field input {
        padding: 12px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        letter-spacing: 0.14px;
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

      /* ─── Cards — multi-layer whisper shadow ────────────────── */
      .card {
        background: var(--bg);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-ring);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 3px var(--space-2); border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.6;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 90%); }
      .badge-muted { color: var(--muted); background: color-mix(in oklab, var(--muted), transparent 88%); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links, Kbd ────────────────────────────────────────── */
      a { color: var(--fg); text-decoration: none; }
      a:hover { color: var(--muted); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        box-shadow: rgba(0, 0, 0, 0.075) 0px 0px 0px 0.5px inset;
        background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; align-items: center; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-4); border-radius: var(--radius-lg);
        box-shadow: var(--elev-ring); background: var(--bg);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); align-items: center; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · elevenlabs</p>
            <h1>Give every voice a presence.</h1>
            <p class="lead" style="max-width: 52ch">
              A premium audio product brochure in pixel form. Whisper-thin
              headings, warm stone surfaces, achromatic warmth.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm" style="color: var(--muted)">Service status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Live
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">Last reviewed <time datetime="2026-05-15">2026-05-15</time> · v1.0</p>
            <p class="body-sm" style="color: var(--muted)">Press <kbd>⌘</kbd> <kbd>K</kbd> to search.</p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 28ch">Lightness as the defining typographic statement.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <h3>Waldenburg weight 300</h3>
            <p class="body-muted body-sm" style="letter-spacing: 0.16px">
              All h1/h2/h3 use Waldenburg at font-weight 300. The whisper-thin
              strokes feel like audio waveforms. Never bold — lightness IS the brand.
            </p>
            
          </article>
          <article class="card">
            <h3>Multi-layer shadows</h3>
            <p class="body-muted body-sm" style="letter-spacing: 0.16px">
              --elev-ring: three layers at sub-0.04 opacity each. Surfaces barely
              exist — defined by the lightest possible touch.
            </p>
            
          </article>
          <article class="card">
            <h3>Warm stone surfaces</h3>
            <p class="body-muted body-sm" style="letter-spacing: 0.16px">
              --surface-warm: #f5f2ef. The achromatic system gets warmth through
              stone-tinted backgrounds and rgba(78,50,23,...) warm shadows.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs with the same whisper-level depth.</h2>
            <p class="body-muted" style="max-width: 48ch; letter-spacing: 0.16px">
              Form inputs use 16px radius matching the card tier. Focus ring uses
              Ring Blue (rgba(147,197,253,0.5)) — the only cool tone in the system.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@studio.ai" autocomplete="email" required />
              <p class="field-help">Start generating voice in minutes.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Get started</button>
              <button type="button" class="btn btn-secondary">Learn more</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=elevenlabs_default;return module.exports}});
//# sourceMappingURL=client.elevenlabs.js.map