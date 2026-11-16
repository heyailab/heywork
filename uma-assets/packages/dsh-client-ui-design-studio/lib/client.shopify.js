
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.shopify.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var shopify_default={"contract":`## 1. Visual Theme & Atmosphere

Shopify.com is a dark-first digital theatre — a website that stages its commerce platform like a cinematic premiere. The entire experience unfolds against an abyss of near-black surfaces that carry the faintest whisper of deep forest green (\`#02090A\`, \`#061A1C\`, \`#102620\`), creating a nocturnal atmosphere that feels less like a SaaS marketing page and more like an exclusive product reveal at a tech keynote. This darkness isn't cold or corporate — it's the warm, enveloping dark of a luxury experience, like sitting in the front row of a darkened auditorium.

The typography is the undeniable star. NeueHaasGrotesk — a refined Helvetica descendant — appears at monumental scale (96px) with impossibly light weight (330-400), creating headlines that feel etched in light rather than printed in ink. The \`ss03\` OpenType feature gives letterforms a distinctive character that separates Shopify's type from generic Helvetica usage. Below the display layer, Inter Variable handles body text with surgical precision, using equally unusual variable weights (420, 450, 550) that live in the spaces between traditional weight stops. This precision signals a company that sweats every detail.

Color is used with extreme restraint. The primary accent is Shopify Neon Green (\`#36F4A4\`) — an electric mint that appears exclusively on focus rings and accent highlights, pulsing like a bioluminescent signal against the dark canvas. Softer green tints (Aloe \`#C1FBD4\`, Pistachio \`#D4F9E0\`) provide atmospheric washes. White is the only text color that matters on dark surfaces, while a zinc-based neutral scale (\`#A1A1AA\` through \`#3F3F46\`) handles the hierarchy of quiet information. The result is a design that makes commerce technology feel like it belongs in a science-fiction future.

**Key Characteristics:**
- Dark-first design with deep forest-teal undertones (not pure black)
- Ultra-light display typography (weight 330) at monumental scale (96px) creating an ethereal presence
- Neon Green (\`#36F4A4\`) as the singular high-energy accent against darkness
- Full-pill buttons (9999px radius) as the primary interactive shape
- Layered, multi-stage box shadows creating photographic depth
- Product screenshots embedded in dark UI contexts, matching the surrounding darkness
- Zinc-based neutral scale for text hierarchy — balanced between warm and cool

## 4. Component Stylings

### Buttons

**Primary (White Fill)**
- Background: White (\`#FFFFFF\`)
- Text: Black (\`#000000\`)
- Border: 2px solid transparent
- Border radius: full pill (9999px)
- Padding: 12px 26px 12px 16px (asymmetric — more right padding for visual balance)
- Hover: slight opacity reduction or background shift
- Focus: 2px \`#36F4A4\` (Neon Green) outline ring
- Transition: all 200ms ease

**Secondary (Ghost/Outlined)**
- Background: transparent
- Text: White (\`#FFFFFF\`)
- Border: 2px solid White (\`#FFFFFF\`)
- Border radius: full pill (9999px)
- Padding: 12px 26px 12px 16px
- Hover: fills to white bg with black text
- Focus: 2px \`#36F4A4\` outline

**Badge/Tag (Neutral Filled)**
- Background: \`rgba(255, 255, 255, 0.2)\` (frosted glass)
- Text: White (\`#FFFFFF\`)
- Border: none
- Border radius: subtly rounded (4px)
- Padding: 12px 16px
- Font: 16px regular

### Cards & Containers

- Background: Deep Teal (\`#02090A\`) on dark pages
- Border: 1px solid \`#1E2C31\` (Dark Card Border) — barely visible boundary
- Border radius: 8px for standard cards, 12px for featured cards, 20px 20px 0 0 for top-rounded cards
- Shadow: Multi-layered system:
  - Resting: \`rgba(0,0,0,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 2px 2px, rgba(0,0,0,0.1) 0px 4px 4px, rgba(0,0,0,0.1) 0px 8px 8px\` + \`rgba(255,255,255,0.03) 0px 1px 0px inset\`
  - The inset white highlight creates a subtle top-edge glow
- Hover: shadow expands, card may slightly brighten
- Transition: box-shadow 300ms ease, transform 200ms ease

### Inputs & Forms

- Background: transparent or Dark Forest (\`#061A1C\`)
- Text: White (\`#FFFFFF\`)
- Border: 1px solid \`#3F3F46\` (Shade-70)
- Border radius: 8px
- Padding: 12px 16px
- Focus: 2px solid \`#36F4A4\` (Neon Green focus ring)
- Placeholder: Shade-50 (\`#71717A\`)
- Transition: border-color 200ms ease

### Navigation

- Background: transparent (overlaid on dark hero), becomes Forest (\`#102620\`) on scroll
- Height: ~64px
- Left: Shopify wordmark logo (SVG, white on dark)
- Center/Right: nav links in 18px/500 NeueHaasGrotesk, white, letter-spacing 0.72px
- CTA: White pill button "Start for free" (right)
- Secondary CTA: Ghost button with white border
- Hover: links shift to Muted Text (\`#A1A1AA\`) or gain underline
- Mobile: hamburger menu, full-screen dark overlay
- Transition: background 300ms ease on scroll

### Image Treatment

- Product screenshots: embedded in dark UI contexts, matching the surrounding darkness
- Admin interface previews: shown on dark backgrounds with subtle card borders
- Aspect ratios: varied — hero images are wide (16:9-ish), feature shots are flexible
- All images sit flush within dark containers — no bright borders or frames
- Lazy loading with dark placeholder surfaces

### Trust Indicators

- Statistics displayed prominently: "15+" (years), "150M+" (buyers)
- Numbers at display scale in NeueHaasGrotesk
- Partner/developer ecosystem callout sections
- Dark-themed testimonials integrated into the page flow

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 4px | Tight inline gaps |
| space-2 | 8px | Base unit, icon gaps |
| space-3 | 12px | Card padding, tight margins |
| space-4 | 16px | Standard element padding |
| space-5 | 24px | Card gaps, section padding |
| space-6 | 28px | Medium section spacing |
| space-7 | 32px | Section breaks |
| space-8 | 36px | Large padding |
| space-9 | 40px | Major section padding |
| space-10 | 64px | Hero section padding, large gaps |

### Grid & Container

- Max container width: ~1280px (centered)
- Hero: full-width, edge-to-edge dark background with centered text
- Feature sections: 2-column layouts with text and product screenshots
- Stats sections: horizontal layout with large numbers
- Horizontal padding: 64px desktop, 32px tablet, 16px mobile
- Grid gap: 24-32px between major content blocks

### Whitespace Philosophy

Shopify's whitespace strategy is theatrical. Sections are separated by vast expanses of dark space — 80px to 120px of pure black breathing room — that create the pacing of a presentation, not a webpage. Each content block is its own "slide" in a keynote-style scroll. Within sections, spacing is tighter and more deliberate, creating focal density against the expansive void. The contrast between macro-level emptiness and micro-level precision is what gives the site its cinematic cadence.

### Border Radius Scale

| Value | Context |
|-------|---------|
| 4px | Tags, badges, micro-elements |
| 8px | Standard cards, inputs, video containers |
| 12px | Featured cards, image containers, buttons (non-pill) |
| 20px | Top-rounded cards (20px 20px 0 0), modal headers |
| 340px | Large rounded decorative elements |
| 9999px | Pill buttons, pill badges, nav elements |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base | No shadow, dark surface | Default page background |
| Subtle | \`rgba(0,0,0,0.1) 0px 0px 0px 1px\` + inset white glow | Resting cards |
| Medium | Multi-layer: 1px ring + 2px + 4px + 8px shadow stack | Elevated cards, featured sections |
| High | \`rgba(0,0,0,0.25) 0px 25px 50px -12px\` | Modals, dropdowns, overlays |
| Focus | \`0px 0px 0px 2px #36F4A4\` | Keyboard focus ring (Neon Green) |

Shopify's shadow system is unusually sophisticated. Rather than single-value shadows, cards use a stacked, multi-layer approach: a 1px ring for boundary definition, 2px/4px/8px progressive blurs for natural light falloff, and a delicate inset white glow (\`rgba(255,255,255,0.03)\`) that simulates a top-lit glass surface. On dark backgrounds, shadows darken from already-dark surfaces, so the shadows function more as "ambient occlusion" than traditional elevation — the card appears to sink slightly into the surface rather than float above it.

### Decorative Depth

- **Dark teal gradients**: Ambient radial washes behind hero sections and product showcases
- **Spotlight effects**: Bright centered areas fading to black, creating keynote-style theatrical lighting
- **Edge glow**: Subtle light colored edges on dark cards via inset box-shadow
- **Green atmospheric halos**: Faint green tints in background gradients, echoing the brand accent

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, hamburger nav, display text scales to 48px, 16px padding |
| Tablet | 640-1024px | 2-column grids begin, display text at 70px, 32px padding |
| Desktop | 1024-1440px | Full layout, expanded nav, 96px display, 64px padding |
| Large Desktop | >1440px | Max-width container centered, increased section spacing |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA)
- Pill buttons: 48px height minimum with generous horizontal padding
- Nav links: 44px touch area
- Card surfaces: full card is tappable where linked

### Collapsing Strategy

- **Navigation**: Full horizontal links → hamburger menu below 1024px; logo and CTA button remain visible
- **Hero section**: 96px display → 70px at tablet → 48px on mobile; maintains single-column center alignment
- **Feature sections**: 2-column text+image → stacked single column below 768px
- **Stats**: Horizontal row → stacked vertical on mobile
- **Section padding**: 64px → 40px → 24px → 16px as viewport narrows
- **Cards**: Grid → stack, maintaining full-width on mobile

### Image Behavior

- Product screenshots: responsive within dark containers, maintain aspect ratio
- Hero images: full-width on all breakpoints, lazy loaded with dark placeholders
- Admin UI previews: scale proportionally, may crop on mobile
- All images use CDN (\`cdn.shopify.com\`) with responsive srcset`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Shopify — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/shopify. Every visible
        value comes from tokens.css. Shopify's signature moves: dark-first
        cinematic (void black canvas), NeueHaasGrotesk ultra-light display,
        full-pill CTAs, neon green (#36F4A4) focus rings only."
    />

    <style>
      :root {
        --bg:           #000000;
        --surface:      #02090a;
        --surface-warm: #061a1c;

        --fg:   #ffffff;
        --fg-2: #ffffff;
        --muted: #a1a1aa;
        --meta:  #71717a;

        --border:      #1e2c31;
        --border-soft: #3f3f46;

        --accent:        #36f4a4;
        --accent-on:     #000000;
        --accent-hover:  #2de097;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #36f4a4;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "NeueHaasGrotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:    "Inter Variable", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 18px;
        --text-lg:   20px;
        --text-xl:   32px;
        --text-2xl:  48px;
        --text-3xl:  70px;
        --text-4xl:  96px;

        --leading-body:     1.56;
        --leading-tight:    1.00;
        --tracking-display: 0em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  24px;
        --space-6:  28px;
        --space-8:  36px;
        --space-12: 64px;

        --section-y-desktop: 96px;
        --section-y-tablet:  64px;
        --section-y-phone:   40px;

        --radius-sm:   9999px;
        --radius-md:   8px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised:
          rgba(0, 0, 0, 0.1) 0px 0px 0px 1px,
          rgba(0, 0, 0, 0.1) 0px 2px 2px,
          rgba(0, 0, 0, 0.1) 0px 4px 4px,
          rgba(0, 0, 0, 0.1) 0px 8px 8px,
          rgba(255, 255, 255, 0.03) 0px 1px 0px inset;

        --focus-ring: 0 0 0 2px #36f4a4;

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: ease;

        --container-max:            1280px;
        --container-gutter-desktop: 64px;
        --container-gutter-tablet:  32px;
        --container-gutter-phone:   16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--muted);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        /* ss03 on all text per brand spec. */
        font-feature-settings: "ss03";
        -webkit-font-smoothing: antialiased;
      }

      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
        --uma-preview-gutter:           var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 1px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); --uma-preview-gutter:           var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); --uma-preview-gutter:           var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ─────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 330;              /* ultra-light — the Shopify signature */
        margin: 0;
        color: var(--fg);
        font-feature-settings: "ss03";
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        /* 96px display: weight 330, line-height 1.00. */
      }
      h2 {
        font-size: var(--text-3xl);
        /* 70px heading 1: line-height 1.00. */
      }
      h3 {
        font-size: var(--text-xl);
        /* 32px heading 4: line-height 1.14, tracking 0.32px (positive).
           Overrides the shared 1.00 set above. */
        line-height: 1.14;
        letter-spacing: 0.32px;
        font-weight: 360;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.40;
        color: var(--muted);
        font-weight: 500;
        letter-spacing: 0.3px;
      }
      .body-muted { color: var(--muted); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — full pill for all CTAs. ──── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 26px 12px 16px;
        border-radius: var(--radius-sm);   /* 9999px full pill */
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 400;
        font-feature-settings: "ss03";
        line-height: 1.5;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all var(--motion-base) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--fg);
        color: var(--bg);
        border-color: transparent;
      }
      .btn-primary:hover { opacity: 0.9; }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: var(--fg);
      }
      .btn-ghost:hover { background: var(--fg); color: var(--bg); }

      /* ─── Cards ──────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-raised);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }

      /* ─── Stats ──────────────────────────────── */
      .stat {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .stat-number {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 750;
        color: var(--fg);
        font-feature-settings: "ss03";
        line-height: 1.00;
      }

      /* ─── Inputs ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--muted); }
      .field input {
        background: var(--surface-warm);
        color: var(--fg);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: 12px 16px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-8);
      }
      @media (max-width: 639px) { .stats-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-4); margin-block-start: var(--space-8); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>

    <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-uma-form-layout>.uma-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .uma-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-6">
            <h1>Commerce is yours to own.</h1>
            <p class="lead" style="max-width:46ch">
              Start, run, and grow your business. Shopify's cinematic dark canvas
              stages commerce like a product keynote. Ultra-light NeueHaasGrotesk
              at 96px. Every value from tokens.css.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside>
            <div class="card">
              <p style="font-size:var(--text-sm);color:var(--meta);margin-bottom:var(--space-4)">Commerce data</p>
              <div class="stats-grid" style="grid-template-columns:1fr 1fr">
                <div class="stat">
                  <span class="stat-number">150M+</span>
                  <span style="font-size:var(--text-sm);color:var(--muted)">buyers served</span>
                </div>
                <div class="stat">
                  <span class="stat-number">15+</span>
                  <span style="font-size:var(--text-sm);color:var(--muted)">years in commerce</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features" style="background:var(--surface-warm);margin-inline:calc(var(--uma-preview-gutter)*-1);padding-inline:var(--uma-preview-gutter)">
        <h2 style="max-width:24ch;margin-bottom:var(--space-8)">Built for scale.</h2>

        <div class="stats-grid">
          <div class="stat">
            <span style="font-family:var(--font-display);font-size:var(--text-3xl);font-weight:750;color:var(--fg);font-feature-settings:'ss03';line-height:1">96px</span>
            <span style="font-size:var(--text-sm);color:var(--muted);margin-top:var(--space-2)">Display XL, weight 330 — featherweight monumental type</span>
          </div>
          <div class="stat">
            <span style="font-family:var(--font-display);font-size:var(--text-3xl);font-weight:750;color:var(--accent);font-feature-settings:'ss03';line-height:1">#36F4A4</span>
            <span style="font-size:var(--text-sm);color:var(--muted);margin-top:var(--space-2)">Neon Green — focus rings only, never fills large surfaces</span>
          </div>
          <div class="stat">
            <span style="font-family:var(--font-display);font-size:var(--text-3xl);font-weight:750;color:var(--fg);font-feature-settings:'ss03';line-height:1">9999px</span>
            <span style="font-size:var(--text-sm);color:var(--muted);margin-top:var(--space-2)">Full pill for all primary CTAs — non-negotiable brand rule</span>
          </div>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="uma-form-layout">
          <div class="stack-4">
            <h3>Start your free trial.</h3>
            <p style="font-size:var(--text-base);color:var(--muted);line-height:var(--leading-body);margin-top:var(--space-3)">
              Dark input surfaces. Border: 1px solid #3f3f46 at rest.
              Focus: 2px solid neon green. 8px radius on inputs.
            </p>
          </div>
          <div role="group" class="uma-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" type="email" placeholder="you@store.com" />
            </div>
            <div style="margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Start for free</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=shopify_default;return module.exports}});
//# sourceMappingURL=client.shopify.js.map