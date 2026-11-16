
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.x-ai.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var x_ai_default={"contract":`## 1. Visual Theme & Atmosphere

xAI's website is a masterclass in dark-first, monospace-driven brutalist minimalism -- a design system that feels like it was built by engineers who understand that restraint is the ultimate form of sophistication. The entire experience is anchored to an almost-black background (\`#1f2228\`) with pure white text (\`#ffffff\`), creating a high-contrast, terminal-inspired aesthetic that signals deep technical credibility. There are no gradients, no decorative illustrations, no color accents competing for attention. This is a site that communicates through absence.

The typographic system is split between two carefully chosen typefaces. \`GeistMono\` (Vercel's monospace font) handles display-level headlines at an extraordinary 320px with weight 300, and also serves as the button typeface in uppercase with tracked-out letter-spacing (1.4px). \`universalSans\` handles all body and secondary heading text with a clean, geometric sans-serif voice. The monospace-as-display-font choice is the defining aesthetic decision -- it positions xAI not as a consumer product but as infrastructure, as something built by people who live in terminals.

The spacing system operates on an 8px base grid with values concentrated at the small end (4px, 8px, 24px, 48px), reflecting a dense, information-focused layout philosophy. Border radius is minimal -- the site barely rounds anything, maintaining sharp, architectural edges. There are no decorative shadows, no gradients, no layered elevation. Depth is communicated purely through contrast and whitespace.

**Key Characteristics:**
- Pure dark theme: \`#1f2228\` background with \`#ffffff\` text -- no gray middle ground
- GeistMono at extreme display sizes (320px, weight 300) -- monospace as luxury
- Uppercase monospace buttons with 1.4px letter-spacing -- technical, commanding
- universalSans for body text at 16px/1.5 and headings at 30px/1.2 -- clean contrast
- Zero decorative elements: no shadows, no gradients, no colored accents
- 8px spacing grid with a sparse, deliberate scale
- Heroicons SVG icon system -- minimal, functional
- Tailwind CSS with arbitrary values -- utility-first engineering approach

## 4. Component Stylings

### Buttons

**Primary (White on Dark)**
- Background: \`#ffffff\`
- Text: \`#1f2228\`
- Padding: 12px 24px
- Radius: 0px (sharp corners)
- Font: GeistMono 14px weight 400, uppercase, letter-spacing 1.4px
- Hover: \`rgba(255, 255, 255, 0.9)\` background
- Use: Primary CTA ("TRY GROK", "GET STARTED")

**Ghost / Outlined**
- Background: transparent
- Text: \`#ffffff\`
- Padding: 12px 24px
- Radius: 0px
- Border: \`1px solid rgba(255, 255, 255, 0.2)\`
- Font: GeistMono 14px weight 400, uppercase, letter-spacing 1.4px
- Hover: \`rgba(255, 255, 255, 0.05)\` background
- Use: Secondary actions ("LEARN MORE", "VIEW API")

**Text Link**
- Background: none
- Text: \`#ffffff\`
- Font: universalSans 16px weight 400
- Hover: \`rgba(255, 255, 255, 0.5)\` -- dims on hover
- Use: Inline links, navigation items

### Cards & Containers
- Background: \`rgba(255, 255, 255, 0.03)\` or transparent
- Border: \`1px solid rgba(255, 255, 255, 0.1)\`
- Radius: 0px (sharp) or 4px (subtle)
- Shadow: none -- xAI does not use box shadows
- Hover: border shifts to \`rgba(255, 255, 255, 0.2)\`

### Navigation
- Dark background matching page (\`#1f2228\`)
- Brand logotype: white text, left-aligned
- Links: universalSans 14px weight 400, \`#ffffff\` text
- Hover: \`rgba(255, 255, 255, 0.5)\` text color
- CTA: white primary button, right-aligned
- Mobile: hamburger toggle

### Badges / Tags
**Monospace Tag**
- Background: transparent
- Text: \`#ffffff\`
- Padding: 4px 8px
- Border: \`1px solid rgba(255, 255, 255, 0.2)\`
- Radius: 0px
- Font: GeistMono 12px uppercase, letter-spacing 1px

### Inputs & Forms
- Background: transparent or \`rgba(255, 255, 255, 0.05)\`
- Border: \`1px solid rgba(255, 255, 255, 0.2)\`
- Radius: 0px
- Focus: ring with \`rgb(59, 130, 246) / 0.5\`
- Text: \`#ffffff\`
- Placeholder: \`rgba(255, 255, 255, 0.3)\`
- Label: \`rgba(255, 255, 255, 0.7)\`, universalSans 14px

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 24px, 48px
- The scale is deliberately sparse -- xAI avoids granular spacing distinctions, preferring large jumps that create clear visual hierarchy through whitespace alone

### Grid & Container
- Max content width: approximately 1200px
- Hero: full-viewport height with massive centered monospace headline
- Feature sections: simple vertical stacking with generous section padding (48px-96px)
- Two-column layouts for feature descriptions at desktop
- Full-width dark sections maintain the single dark background throughout

### Whitespace Philosophy
- **Extreme generosity**: xAI uses vast amounts of whitespace. The 320px headline with 48px+ surrounding padding creates a sense of emptiness that is itself a design statement -- the content is so important it needs room to breathe.
- **Vertical rhythm over horizontal density**: Content stacks vertically with large gaps between sections rather than packing horizontally. This creates a scroll-driven experience that feels deliberate and cinematic.
- **No visual noise**: The absence of decorative elements, borders between sections, and color variety means whitespace is the primary structural tool.

### Breakpoints
- 2000px, 1536px, 1280px, 1024px, 1000px, 768px, 640px
- Tailwind responsive modifiers drive breakpoint behavior

### Border Radius Scale
- Sharp (0px): Primary treatment for buttons, cards, inputs -- the default
- Subtle (4px): Occasional softening on secondary containers
- The near-zero radius philosophy is core to the brand's brutalist identity

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, body content |
| Surface (Level 1) | \`rgba(255,255,255,0.03)\` background | Subtle card surfaces |
| Bordered (Level 2) | \`1px solid rgba(255,255,255,0.1)\` border | Cards, containers, dividers |
| Active (Level 3) | \`1px solid rgba(255,255,255,0.2)\` border | Hover states, active elements |
| Focus (Accessibility) | \`ring\` with \`rgb(59,130,246)/0.5\` | Keyboard focus indicator |

**Elevation Philosophy**: xAI rejects the conventional shadow-based elevation system entirely. There are no box-shadows anywhere on the site. Instead, depth is communicated through three mechanisms: (1) opacity-based borders that brighten on interaction, creating a sense of elements "activating" rather than lifting; (2) extremely subtle background opacity shifts (\`0.03\` to \`0.08\`) that create barely-perceptible surface differentiation; and (3) the massive scale contrast between the 320px display type and 16px body text, which creates typographic depth. This is elevation through contrast and opacity, not through simulated light and shadow.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hero headline scales dramatically down |
| Small Tablet | 640-768px | Slight increase in padding |
| Tablet | 768-1024px | Two-column layouts begin, heading sizes increase |
| Desktop | 1024-1280px | Full layout, generous whitespace |
| Large | 1280-1536px | Wider containers, more breathing room |
| Extra Large | 1536-2000px | Maximum content width, centered |
| Ultra | >2000px | Content stays centered, extreme margins |

### Touch Targets
- Buttons use 12px 24px padding for comfortable touch
- Navigation links spaced with 24px gaps
- Minimum tap target: 44px height
- Mobile: full-width buttons for easy thumb reach

### Collapsing Strategy
- Hero: 320px monospace headline scales down dramatically (to ~48px-64px on mobile)
- Navigation: horizontal links collapse to hamburger menu
- Feature sections: two-column to single-column stacking
- Section padding: 96px -> 48px -> 24px across breakpoints
- Massive display type is the first thing to resize -- it must remain impactful but not overflow

### Image Behavior
- Minimal imagery -- the site relies on typography and whitespace
- Any product screenshots maintain sharp corners
- Full-width media scales proportionally with viewport`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>x-ai — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/x-ai. Every visible value
        comes from tokens.css. xAI's signature moves: #1f2228 warm near-black
        canvas, pure-white text on opacity-based foreground tiers, GeistMono
        as the display + button face, uppercase tracked-out CTAs, zero
        shadows, near-zero radii, blue-only focus ring."
    />

    <style>
      :root {
        --bg:           #1f2228;
        --surface:      rgba(255, 255, 255, 0.03);
        --surface-warm: rgba(255, 255, 255, 0.05);

        --fg:    #ffffff;
        --fg-2:  rgba(255, 255, 255, 0.7);
        --muted: rgba(255, 255, 255, 0.5);
        --meta:  rgba(255, 255, 255, 0.3);

        --border:      rgba(255, 255, 255, 0.1);
        --border-soft: rgba(255, 255, 255, 0.05);

        --accent:        #ffffff;
        --accent-on:     #1f2228;
        --accent-hover:  rgba(255, 255, 255, 0.9);
        --accent-active: rgba(255, 255, 255, 0.8);

        --success: #16a34a;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "GeistMono", ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
        --font-body:    "universalSans", "universalSans Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --font-mono:    "GeistMono", ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   20px;
        --text-xl:   24px;
        --text-2xl:  30px;
        --text-3xl:  40px;
        --text-4xl:  64px;

        --leading-body:     1.5;
        --leading-tight:    1.2;
        --tracking-display: normal;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 96px;
        --section-y-tablet:  64px;
        --section-y-phone:   48px;

        --radius-sm:   0px;
        --radius-md:   0px;
        --radius-lg:   4px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: none;

        --focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.5);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   12px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }

      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
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

      /* ─── Typography ────────────────────────────────────────────── */
      h1, h2, h3 {
        margin: 0;
        color: var(--fg);
        line-height: var(--leading-tight);
      }
      h1 {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 300;
        letter-spacing: var(--tracking-display);
      }
      /* The 320px hero treatment from DESIGN.md §3 is a one-off, not a
         token tier. We render the hero headline at clamp(--text-4xl,
         16vw, 320px) so it scales down from the cinematic 320px on
         ultrawide canvases to ~48–64px on phones (DESIGN.md §8 collapsing
         strategy: "320px monospace headline scales down dramatically"). */
      h1.hero-display {
        font-size: clamp(var(--text-4xl), 16vw, 320px);
        line-height: 1.5;
      }
      h2 {
        font-family: var(--font-body);
        font-size: var(--text-2xl);
        font-weight: 400;
      }
      h3 {
        font-family: var(--font-body);
        font-size: var(--text-xl);
        font-weight: 400;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg-2);
        max-width: 60ch;
      }
      .body-muted { color: var(--fg-2); }
      .body-sm { font-size: var(--text-sm); color: var(--fg-2); }
      .meta { font-size: var(--text-xs); color: var(--meta); }
      /* Uppercase monospace eyebrow — the brand's signature label voice.
         The 1.4px tracking matches the button treatment from DESIGN.md
         §3, expressed in em so it scales proportionally with size. */
      .eyebrow {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 400;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────────
         DESIGN.md §4: GeistMono 14px, uppercase, 1.4px letter-spacing,
         12px 24px padding, 0px radius. Hover DIMS rather than brightens
         — the convention is reversed (DESIGN.md §7 "Don't brighten
         elements on hover — xAI dims to 0.5 opacity instead"). */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-6);
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 400;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 1.4px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .btn-ghost:hover {
        background: var(--surface);
        border-color: rgba(255, 255, 255, 0.2);
      }

      /* ─── Monospace tag / badge ─────────────────────────────────────
         DESIGN.md §4 "Monospace Tag": GeistMono 12px uppercase, 1px
         letter-spacing, 4px 8px padding, sharp corners. */
      .tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: transparent;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 400;
        color: var(--fg);
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1.4;
      }

      /* ─── Cards ─────────────────────────────────────────────────────
         DESIGN.md §4: surface 0.03 background, 1px solid 0.1 border,
         0px radius, NO shadow. Hover lifts the border alpha to 0.2
         — depth through edge brightness, not shadow simulation. */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-flat);
        transition: background-color var(--motion-base) var(--ease-standard),
                    border-color var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        background: var(--surface-warm);
        border-color: rgba(255, 255, 255, 0.2);
      }
      .card .card-title {
        font-family: var(--font-body);
        font-size: var(--text-xl);
        font-weight: 400;
        color: var(--fg);
        margin: 0;
      }
      .card .card-body {
        font-size: var(--text-base);
        color: var(--fg-2);
      }

      /* ─── Inputs ────────────────────────────────────────────────────
         DESIGN.md §4 "Inputs & Forms": transparent / 0.05 bg, 0.2
         border, 0px radius, white 16px universalSans text, 0.3
         placeholder. Focus uses the blue ring (the lone chromatic
         move in the system). */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 400;
        color: var(--fg-2);
      }
      .field input,
      .field textarea {
        background: var(--surface);
        color: var(--fg);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-4);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field textarea { resize: vertical; min-height: 96px; }
      .field input::placeholder,
      .field textarea::placeholder { color: var(--meta); }
      .field input:focus,
      .field textarea:focus {
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: var(--focus-ring);
      }

      /* ─── Layout ────────────────────────────────────────────────── */
      .hero {
        text-align: center;
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        justify-content: center;
        margin-block-start: var(--space-8);
        flex-wrap: wrap;
      }
      .tag-row {
        display: flex;
        gap: var(--space-2);
        justify-content: center;
        flex-wrap: wrap;
        margin-block-end: var(--space-8);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
        margin-block-start: var(--space-12);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .feature-meta {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--meta);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .feature-meta .dot {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-pill);
        background: var(--fg);
        opacity: 0.5;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-grid { grid-template-columns: 1fr; } }
      .uma-preview-form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 480px; }
      .uma-preview-form .actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        flex-wrap: wrap;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero" class="hero">
        <div class="tag-row">
          <span class="tag">Grok 3</span>
          <span class="tag">API</span>
          <span class="tag">Frontier</span>
        </div>
        <h1 class="hero-display">xAI</h1>
        <p class="lead" style="margin: var(--space-6) auto 0; color: var(--fg-2)">
          Understand the universe. We are a frontier AI lab building the
          tools to accelerate human scientific discovery — and the
          monospace-on-warm-black voice that says so without decoration.
        </p>
        <div class="hero-actions">
          
          
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <div class="stack-3" style="text-align: center">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 32ch; margin-inline: auto">
            Restraint as sophistication.
          </h2>
          <p class="lead" style="margin-inline: auto; color: var(--muted)">
            Three cards. Sharp corners, opacity-based borders, zero
            shadows. Depth through contrast — never simulated light.
          </p>
        </div>

        <div class="features-grid">
          <article class="card stack-4">
            <div class="feature-meta"><span class="dot"></span><span>01 / Voice</span></div>
            <h3 class="card-title">Monospace as luxury</h3>
            <p class="card-body">
              GeistMono at display sizes positions xAI as infrastructure,
              not product. Fixed-width characters at scale create a
              rhythmic, architectural quality no proportional font can
              match. universalSans handles the reading.
            </p>
          </article>
          <article class="card stack-4">
            <div class="feature-meta"><span class="dot"></span><span>02 / Canvas</span></div>
            <h3 class="card-title">#1f2228, never #000</h3>
            <p class="card-body">
              The warm near-black with a subtle blue undertone prevents
              the harsh eye strain of pure black while maintaining deep
              darkness. The canvas is the foundation — every surface
              renders against it directly.
            </p>
          </article>
          <article class="card stack-4">
            <div class="feature-meta"><span class="dot"></span><span>03 / Depth</span></div>
            <h3 class="card-title">Zero shadows</h3>
            <p class="card-body">
              Elevation through opacity-based borders that brighten on
              interaction, subtle background tints (0.03 → 0.08), and
              the massive typographic scale contrast. No simulated
              light. No drop shadows. Ever.
            </p>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="form-grid">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs on the dark canvas.</h2>
            <p class="lead">
              Transparent ground, hairline borders at 20% white. Focus
              halos the field with Tailwind's default ring blue — the
              single chromatic exception in an otherwise monochromatic
              system. Placeholders dim to 30% white. Labels to 70%.
            </p>
            <p class="meta">All values from tokens.css — no raw hex.</p>
          </div>
          <div role="group" class="uma-preview-form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@xai.com" />
            </div>
            <div class="field">
              <label for="org">Organization</label>
              <input id="org" type="text" placeholder="Frontier AI Lab" />
            </div>
            <div class="field">
              <label for="msg">Use case</label>
              <textarea id="msg" placeholder="Describe the workload — training, inference, evaluation, or something we have not built yet."></textarea>
            </div>
            <div class="actions">
              <button type="submit" class="btn btn-primary">Request access</button>
              <button type="button" class="btn btn-ghost">Read the docs</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=x_ai_default;return module.exports}});
//# sourceMappingURL=client.x-ai.js.map