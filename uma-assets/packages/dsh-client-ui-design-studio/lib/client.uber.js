
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.uber.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var uber_default={"contract":`## 1. Visual Theme & Atmosphere

Uber's design language is a masterclass in confident minimalism -- a black-and-white universe where every pixel serves a purpose and nothing decorates without earning its place. The entire experience is built on a stark duality: jet black (\`#000000\`) and pure white (\`#ffffff\`), with virtually no mid-tone grays diluting the message. This isn't the sterile minimalism of a startup that hasn't finished designing -- it's the deliberate restraint of a brand so established it can afford to whisper.

The signature typeface, UberMove, is a proprietary geometric sans-serif with a distinctly square, engineered quality. Headlines in UberMove Bold at 52px carry the weight of a billboard -- authoritative, direct, unapologetic. The companion face UberMoveText handles body copy and buttons with a slightly softer, more readable character at medium weight (500). Together, they create a typographic system that feels like a transit map: clear, efficient, built for scanning at speed.

What makes Uber's design truly distinctive is its use of full-bleed photography and illustration paired with pill-shaped interactive elements (999px border-radius). Navigation chips, CTA buttons, and category selectors all share this capsule shape, creating a tactile, thumb-friendly interface language that's unmistakably Uber. The illustrations -- warm, slightly stylized scenes of drivers, riders, and cityscapes -- inject humanity into what could otherwise be a cold, monochrome system. The site alternates between white content sections and a full-black footer, with card-based layouts using the gentlest possible shadows (rgba(0,0,0,0.12-0.16)) to create subtle lift without breaking the flat aesthetic.

**Key Characteristics:**
- Pure black-and-white foundation with virtually no mid-tone grays in the UI chrome
- UberMove (headlines) + UberMoveText (body/UI) -- proprietary geometric sans-serif family
- Pill-shaped everything: buttons, chips, nav items all use 999px border-radius
- Warm, human illustrations contrasting the stark monochrome interface
- Card-based layout with whisper-soft shadows (0.12-0.16 opacity)
- 8px spacing grid with compact, information-dense layouts
- Bold photography integrated as full-bleed hero backgrounds
- Black footer anchoring the page with a dark, high-contrast environment

## 4. Component Stylings

### Buttons

**Primary Black (CTA)**
- Background: Uber Black (\`#000000\`)
- Text: Pure White (\`#ffffff\`)
- Padding: 10px 12px
- Radius: 999px (full pill)
- Outline: none
- Focus: inset ring \`rgb(255,255,255) 0px 0px 0px 2px\`
- The primary action button -- bold, high-contrast, unmissable

**Secondary White**
- Background: Pure White (\`#ffffff\`)
- Text: Uber Black (\`#000000\`)
- Padding: 10px 12px
- Radius: 999px (full pill)
- Hover: background shifts to Hover Gray (\`#e2e2e2\`)
- Focus: background shifts to Hover Gray, inset ring appears
- Used on dark surfaces or as a secondary action alongside Primary Black

**Chip / Filter**
- Background: Chip Gray (\`#efefef\`)
- Text: Uber Black (\`#000000\`)
- Padding: 14px 16px
- Radius: 999px (full pill)
- Active: inset shadow \`rgba(0,0,0,0.08)\`
- Navigation chips, category selectors, filter toggles

**Floating Action**
- Background: Pure White (\`#ffffff\`)
- Text: Uber Black (\`#000000\`)
- Padding: 14px
- Radius: 999px (full pill)
- Shadow: \`rgba(0,0,0,0.16) 0px 2px 8px 0px\`
- Transform: \`translateY(2px)\` slight offset
- Hover: background shifts to \`#f3f3f3\`
- Map controls, scroll-to-top, floating CTAs

### Cards & Containers
- Background: Pure White (\`#ffffff\`) on white pages; no distinct card background differentiation
- Border: none by default -- cards are defined by shadow, not stroke
- Radius: 8px for standard content cards; 12px for featured/promoted cards
- Shadow: \`rgba(0,0,0,0.12) 0px 4px 16px 0px\` for standard lift
- Cards are content-dense with minimal internal padding
- Image-led cards use full-bleed imagery with text overlay or below

### Inputs & Forms
- Text: Uber Black (\`#000000\`)
- Background: Pure White (\`#ffffff\`)
- Border: 1px solid Black (\`#000000\`) -- the only place visible borders appear prominently
- Radius: 8px
- Padding: standard comfortable spacing
- Focus: no extracted custom focus state -- relies on standard browser focus ring

### Navigation
- Sticky top navigation with white background
- Logo: Uber wordmark/icon at 24x24px in black
- Links: UberMoveText at 14-18px, weight 500, in Uber Black
- Pill-shaped nav chips with Chip Gray (\`#efefef\`) background for category navigation ("Ride", "Drive", "Business", "Uber Eats")
- Menu toggle: circular button with 50% border-radius
- Mobile: hamburger menu pattern

### Image Treatment
- Warm, hand-illustrated scenes (not photographs for feature sections)
- Illustration style: slightly stylized people, warm color palette within illustrations, contemporary vibe
- Hero sections use bold photography or illustration as full-width backgrounds
- QR codes for app download CTAs
- All imagery uses standard 8px or 12px border-radius when contained in cards

### Distinctive Components

**Category Pill Navigation**
- Horizontal row of pill-shaped buttons for top-level navigation ("Ride", "Drive", "Business", "Uber Eats", "About")
- Each pill: Chip Gray background, black text, 999px radius
- Active state indicated by black background with white text (inversion)

**Hero with Dual Action**
- Split hero: text/CTA on left, map/illustration on right
- Two input fields side by side for pickup/destination
- "See prices" CTA button in black pill

**Plan-Ahead Cards**
- Cards promoting features like "Uber Reserve" and trip planning
- Illustration-heavy with warm, human-centric imagery
- Black CTA buttons with white text at bottom

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px, 32px
- Button padding: 10px 12px (compact) or 14px 16px (comfortable)
- Card internal padding: approximately 24-32px
- Section vertical spacing: generous but efficient -- approximately 64-96px between major sections

### Grid & Container
- Max container width: approximately 1136px, centered
- Hero: split layout with text left, visual right
- Feature sections: 2-column card grids or full-width single-column
- Footer: multi-column link grid on black background
- Full-width sections extending to viewport edges

### Whitespace Philosophy
- **Efficient, not airy**: Uber's whitespace is functional -- enough to separate, never enough to feel empty. This is transit-system spacing: compact, clear, purpose-driven.
- **Content-dense cards**: Cards pack information tightly with minimal internal spacing, relying on shadow and radius to define boundaries.
- **Section breathing room**: Major sections get generous vertical spacing, but within sections, elements are closely grouped.

### Border Radius Scale
- Sharp (0px): No square corners used in interactive elements
- Standard (8px): Content cards, input fields, listboxes
- Comfortable (12px): Featured cards, larger containers, link cards
- Full Pill (999px): All buttons, chips, navigation items, pills
- Circle (50%): Avatar images, icon containers, circular controls

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, solid background | Page background, inline content, text sections |
| Subtle (Level 1) | \`rgba(0,0,0,0.12) 0px 4px 16px\` | Standard content cards, feature blocks |
| Medium (Level 2) | \`rgba(0,0,0,0.16) 0px 4px 16px\` | Elevated cards, overlay elements |
| Floating (Level 3) | \`rgba(0,0,0,0.16) 0px 2px 8px\` + translateY(2px) | Floating action buttons, map controls |
| Pressed (Level 4) | \`rgba(0,0,0,0.08) inset\` (999px spread) | Active/pressed button states |
| Focus Ring | \`rgb(255,255,255) 0px 0px 0px 2px inset\` | Keyboard focus indicators |

**Shadow Philosophy**: Uber uses shadow purely as a structural tool, never decoratively. Shadows are always black at very low opacity (0.08-0.16), creating the bare minimum lift needed to separate content layers. The blur radii are moderate (8-16px) -- enough to feel natural but never dramatic. There are no colored shadows, no layered shadow stacks, and no ambient glow effects. Depth is communicated more through the black/white section contrast than through shadow elevation.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | 320px | Minimum layout, single column, stacked inputs, compact typography |
| Mobile | 600px | Standard mobile, stacked layout, hamburger nav |
| Tablet Small | 768px | Two-column grids begin, expanded card layouts |
| Tablet | 1119px | Full tablet layout, side-by-side hero content |
| Desktop Small | 1120px | Desktop grid activates, horizontal nav pills |
| Desktop | 1136px | Full desktop layout, maximum container width, split hero |

### Touch Targets
- All pill buttons: minimum 44px height (10-14px vertical padding + line-height)
- Navigation chips: generous 14px 16px padding for comfortable thumb tapping
- Circular controls (menu, close): 50% radius ensures large, easy-to-hit targets
- Card surfaces serve as full-area touch targets on mobile

### Collapsing Strategy
- **Navigation**: Horizontal pill nav collapses to hamburger menu with circular toggle
- **Hero**: Split layout (text + map/visual) stacks to single column -- text above, visual below
- **Input fields**: Side-by-side pickup/destination inputs stack vertically
- **Feature cards**: 2-column grid collapses to full-width stacked cards
- **Headings**: 52px display scales down through 36px, 32px, 24px, 20px
- **Footer**: Multi-column link grid collapses to accordion or stacked single column
- **Category pills**: Horizontal scroll with overflow on smaller screens

### Image Behavior
- Illustrations scale proportionally within their containers
- Hero imagery maintains aspect ratio, may crop on smaller screens
- QR code sections hide on mobile (app download shifts to direct store links)
- Card imagery maintains 8-12px border radius at all sizes`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Uber — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/uber. Every visible
        value comes from tokens.css. Uber's signature moves: pure black
        and white (no tints), UberMove bold headlines, UberMoveText body,
        999px full-pill buttons, whisper-soft shadows (0.12 opacity)."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #ffffff;
        --surface-warm: #f8f8f8;

        --fg:   #000000;
        --fg-2: #000000;
        --muted: #4b4b4b;
        --meta:  #afafaf;

        --border:      #000000;
        --border-soft: rgba(0, 0, 0, 0.1);

        --accent:        #000000;
        --accent-on:     #ffffff;
        --accent-hover:  #e2e2e2;
        --accent-active: rgba(0, 0, 0, 0.08);

        --success: #16a34a;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "UberMove", "UberMoveText", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:    "UberMoveText", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   24px;
        --text-2xl:  32px;
        --text-3xl:  36px;
        --text-4xl:  52px;

        --leading-body:     1.50;
        --leading-tight:    1.23;
        --tracking-display: normal;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   999px;
        --radius-md:   8px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border-soft);
        --elev-raised: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;

        --focus-ring: rgb(255, 255, 255) 0px 0px 0px 2px inset;

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1136px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   16px;
      }

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

      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
        --hey-preview-gutter:           var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); --hey-preview-gutter:           var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); --hey-preview-gutter:           var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ─────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 700;              /* always bold — billboard force */
        margin: 0;
        color: var(--fg);
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        /* 52px display: line-height 1.23 (--leading-tight), no letter-spacing. */
      }
      h2 {
        font-size: var(--text-3xl);
        /* 36px section heading: line-height 1.22. */
        line-height: 1.22;
      }
      h3 {
        font-size: var(--text-xl);
        /* 24px sub-heading: line-height 1.33.
           Overrides the shared 1.23 set above. */
        line-height: 1.33;
      }
      p { margin: 0; }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — 999px full pill for all. ─── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 12px;
        border-radius: var(--radius-sm);   /* 999px full pill */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-black {
        background: var(--fg);
        color: var(--accent-on);
      }
      .btn-black:hover { background: #222; }
      .btn-white {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border-soft);
      }
      .btn-white:hover { background: var(--accent-hover); }

      /* ─── Chip / category pill ───────────────── */
      .chip {
        display: inline-flex;
        align-items: center;
        padding: 14px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        background: #efefef;
        color: var(--fg);
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard);
      }
      .chip:hover { background: #e2e2e2; }
      .chip.active { background: var(--fg); color: var(--accent-on); }

      /* ─── Cards ──────────────────────────────── */
      .card {
        background: var(--bg);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-raised);
      }
      .card-featured {
        border-radius: var(--radius-lg);
      }

      /* ─── Inputs ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--muted); }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--fg);
        border-radius: var(--radius-md);
        padding: 12px 16px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus { border-color: var(--fg); box-shadow: 0 0 0 2px rgba(0,0,0,0.1); }

      /* ─── Dark footer ────────────────────────── */
      .footer-dark {
        background: var(--fg);
        color: var(--accent-on);
        padding: var(--space-8) 0;
        margin-inline: calc(var(--hey-preview-gutter) * -1);
        padding-inline: var(--hey-preview-gutter);
      }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-8);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .chip-row { display: flex; gap: var(--space-2); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
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
      <!-- HERO -->
      <section data-od-id="hero">
        <div style="margin-bottom:var(--space-6)">
          <div class="chip-row">
            <button class="chip active">Ride</button>
            <button class="chip">Drive</button>
            <button class="chip">Business</button>
            <button class="chip">Uber Eats</button>
            <button class="chip">About</button>
          </div>
        </div>

        <div class="hero-grid">
          <div class="stack-4">
            <h1>Get a ride in minutes.</h1>
            <p class="body-muted" style="font-size:var(--text-lg);line-height:1.5;max-width:44ch;margin-top:var(--space-3)">
              From your first trip to your thousandth, Uber is here for you.
              Pure black-and-white, full-pill buttons, whisper-soft shadows.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside>
            <div class="card card-featured">
              <p style="font-size:var(--text-sm);font-weight:500;color:var(--muted);margin-bottom:var(--space-4)">Your trip</p>
              <div class="field" style="margin-bottom:var(--space-3)">
                <label for="pickup">Pickup</label>
                <input id="pickup" type="text" placeholder="Enter pickup location" />
              </div>
              <div class="field" style="margin-bottom:var(--space-5)">
                <label for="dest">Destination</label>
                <input id="dest" type="text" placeholder="Where to?" />
              </div>
              <button class="btn btn-black" style="width:100%;justify-content:center">See prices</button>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <h2 style="max-width:26ch;margin-bottom:var(--space-6)">Uber for business, every day.</h2>

        <div class="features-grid">
          <article class="card stack-3">
            <h3>Black on white</h3>
            <p class="body-muted body-sm">
              True #000000 and #ffffff — not near-black, not off-white.
              The stark duality IS Uber. No warmth, no tint, no gradients.
            </p>
          </article>
          <article class="card stack-3">
            <h3>999px radius</h3>
            <p class="body-muted body-sm">
              Every button, chip, and navigation item uses full-pill geometry.
              UberMove Bold (700) for all headings — billboard force.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Whisper shadow</h3>
            <p class="body-muted body-sm">
              rgba(0,0,0,0.12) 0px 4px 16px — bare minimum lift.
              Cards defined by shadow, not border. Never dramatic depth.
            </p>
          </article>
        </div>
      </section>

      <!-- DARK FOOTER -->
      <section data-od-id="footer" style="padding-block:0">
        <div class="footer-dark">
          <h2 style="color:#ffffff;font-size:var(--text-xl);margin-bottom:var(--space-4)">Move the world forward.</h2>
          <p style="font-size:var(--text-sm);color:var(--meta);max-width:44ch">
            Uber's vision: transportation as reliable as running water, everywhere, for everyone.
          </p>
          <div style="display:flex;gap:var(--space-3);margin-top:var(--space-6);flex-wrap:wrap">
            <a href="#" style="font-size:var(--text-sm);color:var(--meta);text-decoration:none">Company</a>
            <a href="#" style="font-size:var(--text-sm);color:var(--meta);text-decoration:none">Newsroom</a>
            <a href="#" style="font-size:var(--text-sm);color:var(--meta);text-decoration:none">Investors</a>
            <a href="#" style="font-size:var(--text-sm);color:var(--meta);text-decoration:none">Blog</a>
            <a href="#" style="font-size:var(--text-sm);color:var(--meta);text-decoration:none">Careers</a>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=uber_default;return module.exports}});
//# sourceMappingURL=client.uber.js.map