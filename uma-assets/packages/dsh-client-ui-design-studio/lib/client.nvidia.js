
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.nvidia.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var nvidia_default={"contract":`## 1. Visual Theme & Atmosphere

NVIDIA's website is a high-contrast, technology-forward experience that communicates raw computational power through design restraint. The page is built on a stark black (\`#000000\`) and white (\`#ffffff\`) foundation, punctuated by NVIDIA's signature green (\`#76b900\`) -- a color so specific it functions as a brand fingerprint. This is not the lush green of nature; it's the electric, lime-shifted green of GPU-rendered light, a color that sits between chartreuse and kelly green and immediately signals "NVIDIA" to anyone in technology.

The custom NVIDIA-EMEA font family (with Arial and Helvetica fallbacks) creates a clean, industrial typographic voice. Headings at 36px bold with tight 1.25 line-height create dense, authoritative blocks of text. The font lacks the geometric playfulness of Silicon Valley sans-serifs -- it's European, pragmatic, and engineering-focused. Body text runs at 15-16px, comfortable for reading but not generous, maintaining the sense that screen real estate is optimized like GPU memory.

What distinguishes NVIDIA's design from other dark-background tech sites is the disciplined use of the green accent. The \`#76b900\` appears in borders (\`2px solid #76b900\`), link underlines (\`underline 2px rgb(118, 185, 0)\`), and CTAs -- but never as backgrounds or large surface areas on the main content. The green is a signal, not a surface. Combined with a deep shadow system (\`rgba(0, 0, 0, 0.3) 0px 0px 5px\`) and minimal border radius (1-2px), the overall effect is of precision engineering hardware rendered in pixels.

**Key Characteristics:**
- NVIDIA Green (\`#76b900\`) as pure accent -- borders, underlines, and interactive highlights only
- Black (\`#000000\`) dominant background with white (\`#ffffff\`) text on dark sections
- NVIDIA-EMEA custom font with Arial/Helvetica fallback -- industrial, European, clean
- Tight line-heights (1.25 for headings) creating dense, authoritative text blocks
- Minimal border radius (1-2px) -- sharp, engineered corners throughout
- Green-bordered buttons (\`2px solid #76b900\`) as primary interactive pattern
- Font Awesome 6 Pro/Sharp icon system at weight 900 for sharp iconography
- Multi-framework architecture (PrimeReact, Fluent UI, Element Plus) enabling rich interactive components

## 4. Component Stylings

### Buttons

**Primary (Green Border)**
- Background: \`transparent\`
- Text: \`#000000\`
- Padding: 11px 13px
- Border: \`2px solid #76b900\`
- Radius: 2px
- Font: 16px weight 700
- Hover: background \`#1eaedb\`, text \`#ffffff\`
- Active: background \`#007fff\`, text \`#ffffff\`, border \`1px solid #003eff\`, scale(1)
- Focus: background \`#1eaedb\`, text \`#ffffff\`, outline \`#000000 solid 2px\`, opacity 0.9
- Use: Primary CTA ("Learn More", "Explore Solutions")

**Secondary (Green Border Thin)**
- Background: transparent
- Border: \`1px solid #76b900\`
- Radius: 2px
- Use: Secondary actions, alternative CTAs

**Compact / Inline**
- Font: 14.4px weight 700
- Letter-spacing: 0.144px
- Line-height: 1.00
- Use: Inline CTAs, compact navigation

### Cards & Containers
- Background: \`#ffffff\` (light) or \`#1a1a1a\` (dark sections)
- Border: none (clean edges) or \`1px solid #5e5e5e\`
- Radius: 2px
- Shadow: \`rgba(0, 0, 0, 0.3) 0px 0px 5px 0px\` for elevated cards
- Hover: shadow intensification
- Padding: 16-24px internal

### Links
- **On Dark Background**: \`#ffffff\`, no underline, hover shifts to \`#3860be\`
- **On Light Background**: \`#000000\` or \`#1a1a1a\`, underline \`2px solid #76b900\`, hover shifts to \`#3860be\`, underline removed
- **Green Links**: \`#76b900\`, hover shifts to \`#3860be\`
- **Muted Links**: \`#666666\`, hover shifts to \`#3860be\`

### Navigation
- Dark black background (\`#000000\`)
- Logo left-aligned, prominent NVIDIA wordmark
- Links: NVIDIA-EMEA 14px weight 700 uppercase, \`#ffffff\`
- Hover: color shift, no underline change
- Mega-menu dropdowns for product categories
- Sticky on scroll with backdrop

### Image Treatment
- Product/GPU renders as hero images, often full-width
- Screenshot images with subtle shadow for depth
- Green gradient overlays on dark hero sections
- Circular avatar containers with 50% radius

### Distinctive Components

**Product Cards**
- Clean white or dark card with minimal radius (2px)
- Green accent border or underline on title
- Bold heading + lighter description pattern
- CTA with green border at bottom

**Tech Spec Tables**
- Industrial grid layouts
- Alternating row backgrounds (subtle gray shift)
- Bold labels, regular values
- Green highlights for key metrics

**Cookie/Consent Banner**
- Fixed bottom positioning
- Rounded buttons (2px radius)
- Gray border treatments

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 13px, 15px
- Primary padding values: 8px, 11px, 13px, 16px, 24px, 32px
- Section spacing: 48-80px vertical padding

### Grid & Container
- Max content width: approximately 1200px (contained)
- Full-width hero sections with contained text
- Feature sections: 2-3 column grids for product cards
- Single-column for article/blog content
- Sidebar layouts for documentation

### Whitespace Philosophy
- **Purposeful density**: NVIDIA uses tighter spacing than typical SaaS sites, reflecting the density of technical content. White space exists to separate concepts, not to create luxury emptiness.
- **Section rhythm**: Dark sections alternate with white sections, using background color (not just spacing) to separate content blocks.
- **Card density**: Product cards sit close together with 16-20px gaps, creating a catalog feel rather than a gallery feel.

### Border Radius Scale
- Micro (1px): Inline spans, tiny elements
- Standard (2px): Buttons, cards, containers, inputs -- the default for nearly everything
- Circle (50%): Avatar images, circular tab indicators

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page backgrounds, inline text |
| Subtle (Level 1) | \`rgba(0,0,0,0.3) 0px 0px 5px 0px\` | Standard cards, modals |
| Border (Level 1b) | \`1px solid #5e5e5e\` | Content dividers, section borders |
| Green accent (Level 2) | \`2px solid #76b900\` | Active elements, CTAs, selected items |
| Focus (Accessibility) | \`2px solid #000000\` outline | Keyboard focus ring |

**Shadow Philosophy**: NVIDIA's depth system is minimal and utilitarian. There is essentially one shadow value -- a 5px ambient blur at 30% opacity -- used sparingly for cards and modals. The primary depth signal is not shadow but _color contrast_: black backgrounds next to white sections, green borders on black surfaces. This creates hardware-like visual layering where depth comes from material difference, not simulated light.

### Decorative Depth
- Green gradient washes behind hero content
- Dark-to-darker gradients (black to near-black) for section transitions
- No glassmorphism or blur effects -- clarity over atmosphere

## 7. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <375px | Compact single column, reduced padding |
| Mobile | 375-425px | Standard mobile layout |
| Mobile Large | 425-600px | Wider mobile, some 2-col hints |
| Tablet Small | 600-768px | 2-column grids begin |
| Tablet | 768-1024px | Full card grids, expanded nav |
| Desktop | 1024-1350px | Standard desktop layout |
| Large Desktop | >1350px | Maximum content width, generous margins |

### Touch Targets
- Buttons use 11px 13px padding for comfortable tap targets
- Navigation links at 14px uppercase with adequate spacing
- Green-bordered buttons provide high-contrast touch targets on dark backgrounds
- Mobile: hamburger menu collapse with full-screen overlay

### Collapsing Strategy
- Hero: 36px heading scales down proportionally
- Navigation: full horizontal nav collapses to hamburger menu at ~1024px
- Product cards: 3-column to 2-column to single column stacked
- Footer: multi-column grid collapses to single stacked column
- Section spacing: 64-80px reduces to 32-48px on mobile
- Images: maintain aspect ratio, scale to container width

### Image Behavior
- GPU/product renders maintain high resolution at all sizes
- Hero images scale proportionally with viewport
- Card images use consistent aspect ratios
- Full-bleed dark sections maintain edge-to-edge treatment

## 8. Responsive Behavior (Extended)

### Typography Scaling
- Display 36px scales to ~24px on mobile
- Section headings 24px scale to ~20px on mobile
- Body text maintains 15-16px across all breakpoints
- Button text maintains 16px for consistent tap targets

### Dark/Light Section Strategy
- Dark sections (black bg, white text) alternate with light sections (white bg, black text)
- The green accent remains consistent across both surface types
- On dark: links are white, underlines are green
- On light: links are black, underlines are green
- This alternation creates natural scroll rhythm and content grouping`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NVIDIA — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/nvidia. GPU computing aesthetic:
        true black canvas, NVIDIA Green (#76b900) as signal-only accent,
        bold NVIDIA-EMEA typography, minimal 2px radius, teal hover surprise."
    />

    <style>
      :root {
        --bg: #000000;
        --surface: #1a1a1a;
        --surface-warm: var(--surface);

        --fg: #ffffff;
        --fg-2: #a7a7a7;
        --muted: #757575;
        --meta: #898989;

        --border: #5e5e5e;
        --border-soft: #2a2a2a;

        /* NVIDIA Green — SIGNAL only: borders, underlines, outlines, NOT fills */
        --accent: #76b900;
        --accent-on: #000000;
        --accent-hover: #1eaedb;   /* Teal — the NVIDIA button hover surprise */
        --accent-active: #007fff;  /* Bright Blue — pressed state */

        --success: #3f8500;
        --warn: #ef9100;
        --danger: #e52020;

        --font-display: "NVIDIA-EMEA", Arial, Helvetica, sans-serif;
        --font-body: "NVIDIA-EMEA", Arial, Helvetica, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;

        --text-xs: 10px;
        --text-sm: 12px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 24px;
        --text-3xl: 32px;
        --text-4xl: 36px;

        --leading-body: 1.5;
        --leading-tight: 1.25;
        --tracking-display: 0em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 64px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 2px;   /* Everything — precision-engineered, no softness */
        --radius-md: 2px;
        --radius-lg: 4px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 2px var(--accent); /* Green ring — the NVIDIA signal */
        --elev-raised: rgba(0, 0, 0, 0.3) 0px 0px 5px 0px;

        --focus-ring: 0 0 0 2px #ffffff;

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
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — Bold dominant voice ──────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 700;                   /* Bold is the NVIDIA voice */
        line-height: var(--leading-tight);
        margin: 0;
        letter-spacing: 0;
      }
      h1 { font-size: var(--text-4xl); }   /* 36px display */
      h2 { font-size: var(--text-3xl); }   /* 32px */
      h3 { font-size: var(--text-2xl); }   /* 24px */
      p { margin: 0; font-weight: 400; }   /* 400 for body only */
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-family: var(--font-body);
        font-size: var(--text-xs);
        font-weight: 700;
        color: var(--accent);              /* Green eyebrow — signal, not decoration */
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      /* NVIDIA Green underline treatment — brand rule */
      .green-underline { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 3px; }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — green border, teal hover ────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 20px;
        border-radius: var(--radius-sm);   /* 2px — precision hardware */
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 700;                  /* Bold — NVIDIA voice */
        line-height: 1;
        cursor: pointer;
        border: 2px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: transparent + 2px green border → teal fill on hover */
      .btn-primary {
        background: transparent;
        color: var(--fg);
        border-color: var(--accent);       /* Green border IS the primary signal */
      }
      .btn-primary:hover {
        background: var(--accent-hover);   /* Teal fill — the NVIDIA surprise */
        border-color: var(--accent-hover);
        color: #ffffff;
      }
      .btn-primary:active {
        background: var(--accent-active);
        border-color: var(--accent-active);
      }
      /* Secondary: dark surface fill, gray border */
      .btn-secondary {
        background: var(--surface);
        color: var(--fg-2);
        border-color: var(--border);
      }
      .btn-secondary:hover { background: #2a2a2a; color: var(--fg); border-color: var(--fg-2); }

      /* ─── Light section override ─────────────────────────────── */
      .section-light {
        background: #ffffff;
        color: #000000;
      }
      .section-light .eyebrow { color: var(--accent); }
      .section-light p { color: #333333; }
      .section-light .card {
        background: #f5f5f5;
        border-color: #e0e0e0;
      }
      .section-light .btn-primary {
        background: transparent;
        color: #000000;
        border-color: var(--accent);
      }
      .section-light .btn-primary:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
        color: #ffffff;
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 700;
        color: var(--fg-2);
      }
      .field input {
        padding: 10px 14px;
        border-radius: var(--radius-sm);   /* 2px */
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);       /* Green border on focus */
        box-shadow: 0 0 0 1px var(--accent);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--meta); }

      /* ─── Cards ─────────────────────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
      }
      /* Green-accented card: left border signal */
      .card.accent-border { border-left: 3px solid var(--accent); }

      /* ─── Badges ─────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 2px 8px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-xs); font-weight: 700; line-height: 1.2;
        text-transform: uppercase; letter-spacing: 0.06em;
      }
      .badge-green  { color: var(--accent); background: rgba(118, 185, 0, 0.12); border: 1px solid rgba(118,185,0,0.3); }
      .badge-muted  { color: var(--muted);  background: rgba(94,94,94,0.2); }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; text-decoration-color: var(--accent); }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-12); align-items: center; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 420px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      /* GPU spec row */
      .spec-row {
        display: flex; gap: var(--space-4); flex-wrap: wrap;
        border-top: 1px solid var(--border-soft);
        padding-block-start: var(--space-4);
        margin-block-start: var(--space-4);
      }
      .spec { display: flex; flex-direction: column; gap: 2px; }
      .spec .num { font-size: var(--text-xl); font-weight: 700; color: var(--accent); }
      .spec .lbl { font-size: var(--text-xs); color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
    </style>
  </head>
  <body>
    <main>
      <!-- Dark section — primary NVIDIA canvas -->
      <section data-od-id="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="stack-4">
              <p class="eyebrow">reference-fixture · nvidia</p>
              <h1>Accelerated<br><span class="green-underline">intelligence.</span></h1>
              <p class="lead" style="max-width: 48ch">
                True black canvas. NVIDIA Green (#76b900) used only as signal —
                borders, underlines, outlines. Never filled. Hover reveals
                teal (#1eaedb) — the brand surprise.
              </p>
              <div class="hero-actions">
                
                
              </div>
              <div class="spec-row">
                <div class="spec"><span class="num">2px</span><span class="lbl">radius</span></div>
                <div class="spec"><span class="num">700</span><span class="lbl">weight</span></div>
                <div class="spec"><span class="num">#76b900</span><span class="lbl">green</span></div>
                <div class="spec"><span class="num">#1eaedb</span><span class="lbl">hover</span></div>
              </div>
            </div>
            <aside style="display: flex; flex-direction: column; gap: var(--space-4);">
              <div class="card accent-border">
                <div class="row-between">
                  <span class="eyebrow">key rule</span>
                  <span class="badge badge-green">A1-identity</span>
                </div>
                <h3>Green = signal, not fill</h3>
                <p class="body-muted body-sm">
                  --accent: #76b900 appears as 2px borders and underlines only.
                  The primary button is transparent with a green border — hover
                  fills it with teal (#1eaedb), not green.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- Features — dark cards -->
      <section data-od-id="features">
        <div class="container">
          <div class="stack-3">
            <p class="eyebrow">what-this-fixture-exercises</p>
            <h2>2px radius. Bold hierarchy. Green borders.</h2>
          </div>
          <div class="features-grid" style="margin-block-start: var(--space-8)">
            <article class="card">
              <span class="badge badge-green">A1-identity</span>
              <h3>NVIDIA-EMEA Bold</h3>
              <p class="body-muted body-sm">
                Arial/Helvetica fallback. Font-weight 700 is the dominant voice
                for headings, buttons, nav, labels. Weight 400 reserved for body
                copy and descriptions only.
              </p>
              
            </article>
            <article class="card">
              <span class="badge badge-green">A1-identity</span>
              <h3>Teal hover surprise</h3>
              <p class="body-muted body-sm">
                Primary CTA: transparent + 2px green border at rest.
                Hover: teal fill (#1eaedb). Active: bright blue (#007fff).
                No dark-green variation — it's a horizontal color shift.
              </p>
              
            </article>
            <article class="card">
              <span class="badge badge-muted">A1-structure</span>
              <h3>Dense 64px sections</h3>
              <p class="body-muted body-sm">
                --section-y-desktop: 64px — tighter than typical SaaS.
                Technical product catalogs require density. 1200px container,
                full-width alternating dark/light sections.
              </p>
              
            </article>
          </div>
        </div>
      </section>

      <!-- Light section override — NVIDIA alternates black/white -->
      <section data-od-id="light-world" class="section-light">
        <div class="container">
          <div class="form-row">
            <div class="stack-4">
              <p class="eyebrow">light-section-override</p>
              <h2 style="color: #000000;">Same green signal. White canvas.</h2>
              <p style="color: #333333; max-width: 48ch">
                NVIDIA alternate sections use white backgrounds. Green accent
                remains #76b900 — it works identically on both dark and light.
                Button behavior is identical: transparent + green border,
                teal fill on hover.
              </p>
            </div>
            <div role="group" class="uma-preview-form form">
              <div class="field" style="--border: #d0d0d0; --surface: #f5f5f5;">
                <label for="api-key" style="color: #333;">API key</label>
                <input id="api-key" type="text"
                  style="background: #f5f5f5; color: #000; border-color: #d0d0d0;"
                  placeholder="nvapi-..." autocomplete="off" />
                <p class="field-help" style="color: #666;">Access NVIDIA NIM inference endpoints.</p>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary" style="color: #000;">Save</button>
                <button type="button" class="btn" style="border-color: #999; color: #333; background: transparent;">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=nvidia_default;return module.exports}});
//# sourceMappingURL=client.nvidia.js.map