
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.meta.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var meta_default={"contract":`## 1. Visual Theme & Atmosphere

The Meta Store is a product-forward retail experience built to sell hardware — Quest VR headsets, Ray-Ban Meta smart glasses, and accessories. The design walks a tightrope between consumer electronics showroom and lifestyle editorial, deploying cinematic product photography against expansive white canvas to create a gallery-like sense of aspiration. Every design decision serves the merchandise: generous negative space frames hero product shots like museum pieces, while alternating light and dark surface sections create a visual rhythm that mimics the experience of walking through a physical retail space.

The "Dolly" design system (Meta's internal name for the store layer) sits atop the broader FDS (Facebook Design System) foundation, inheriting its gray scale and semantic tokens while overlaying its own product-focused palette. The result is a system that feels distinctly Meta — the custom Optimistic typeface brings warmth and approachability to what could otherwise be cold tech retail — yet flexible enough to showcase wildly different product lines (from VR headsets to fashion eyewear) without feeling disjointed. The surface strategy is binary: pure white for browsing and information, rich dark for immersive product moments.

The store's visual hierarchy is ruthlessly simple. Photography does the heavy lifting, supported by short, punchy headlines in Optimistic Medium and body text that stays brief and scannable. Calls to action are pill-shaped, unmistakable, and always Meta Blue. There is no visual noise, no decoration for decoration's sake — every element either sells or navigates.

**Key Characteristics:**
- Photography-first retail design where products are the visual heroes, not UI
- Binary surface strategy: pure white for information, deep dark for immersive product moments
- Pill-shaped CTAs in saturated blue create unmistakable action points
- Optimistic VF typeface with OpenType ss01/ss02 features brings geometric warmth
- Generous whitespace frames products like gallery exhibits
- 8px spacing grid with disciplined vertical rhythm
- Alternating light/dark sections create a "walkthrough" retail cadence

## 4. Component Stylings

### Buttons

**Primary (Pill)**
- Background: Meta Blue (\`#0064E0\`)
- Text: White (\`#FFFFFF\`)
- Border: none
- Border radius: fully rounded pill (100px)
- Padding: 10px 22px
- Font: Optimistic VF, 14px, regular, -0.14px tracking
- Hover: darkens to \`#0143B5\`, scale(1.1) transform
- Pressed: \`#004BB9\`, scale(0.9), opacity 0.5
- Focus: 3px ring in accent color, outline auto 2px
- Transition: background 200ms ease, transform 150ms ease

**Secondary (Outlined Pill)**
- Background: transparent
- Text: Dark Charcoal (\`#1C2B33\`) at 50% opacity
- Border: 2px solid \`rgba(10, 19, 23, 0.12)\`
- Border radius: fully rounded pill (100px)
- Padding: 10px 22px
- Hover: background shifts to \`rgba(70, 90, 105, 0.7)\`, text to white

**Ghost/Link Button**
- Background: transparent / \`rgba(255, 255, 255, 0)\`
- Text: Link Blue (\`#385898\`)
- Border radius: 24px
- Padding: 4px 12px

**Disabled**
- Background: \`#DEE3E9\` (--dolly-cta-disabled)
- Text: \`#8595A4\` (--dolly-cta-disabled-text)
- Cursor: not-allowed, no hover effects

### Cards & Containers

- Background: White (\`#FFFFFF\`) or Flat Gray (\`#F7F8FA\`)
- Corner radius: 20px (--card-corner-radius) for standard cards, 24px for product feature cards
- Padding: 10px horizontal, 20px vertical (--card-padding)
- Shadow: \`0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)\` (elevated cards)
- Hover: subtle lift via translateY(-2px) and shadow intensification
- Transition: transform 300ms ease, box-shadow 300ms ease
- Product cards use full-bleed imagery with text overlay on dark gradient

### Inputs & Forms

- Background: White (\`#FFFFFF\`)
- Border: 1px solid \`#CED0D4\` (--input-border-color)
- Border radius: 8px
- Font: Optimistic VF, 16px
- Focus: border color shifts to accent blue \`hsl(214, 89%, 52%)\`, 3px outer ring
- Error: border and label color \`hsl(350, 87%, 55%)\`
- Placeholder: \`#65676B\` (--secondary-text)
- Transition: border-color 200ms ease, box-shadow 200ms ease

### Navigation

- Background: White (\`#FFFFFF\`), sticky at top
- Frosted glass effect: \`rgba(241, 244, 247, 0.8)\` with backdrop-filter blur
- Logo: Meta wordmark SVG, left-aligned
- Links: Optimistic VF, 16px/500, Dark Charcoal (\`#1C2B33\`)
- Hover: underline decoration
- CTA: Blue pill button, right-aligned
- Mobile: hamburger collapse, full-screen overlay nav
- Height: approximately 56px desktop, 48px mobile
- Border-bottom: subtle \`rgba(0,0,0,0.1)\` separator

### Image Treatment

- Product hero: full-width, cinematic aspect ratio (~21:9 on desktop, ~4:3 on mobile)
- Product cards: 1:1 or 4:3, edge-to-edge within card radius
- Feature images: rounded corners matching card radius (20-24px)
- Dark text-over-image: gradient overlay \`linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))\`
- Lazy loading: native loading="lazy" on below-fold images
- WebP format with JPEG fallback

### Product-Specific Sections

- **Quest sections**: Dark backgrounds (\`#181A1B\` or \`#000000\`), white/light text, purple accents (\`#A121CE\`)
- **Ray-Ban sections**: Warm lifestyle photography, red accents (\`#D6311F\`), linen tones (\`#F2F0E6\`)
- **Portal sections**: Teal-blue palette (\`#C8E4E8\`, \`#ADD4E0\`), navy accents (\`#1B365D\`)

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| space-1 | 1px | Hairline borders |
| space-2 | 4px | Tight internal padding |
| space-3 | 8px | Base unit, icon gaps |
| space-4 | 10px | Card horizontal padding |
| space-5 | 12px | Button icon spacing, tight margins |
| space-6 | 14px | Caption line height spacing |
| space-7 | 16px | Standard paragraph spacing, nav padding |
| space-8 | 18px | Body text vertical rhythm |
| space-9 | 24px | Card section spacing, grid gaps |
| space-10 | 32px | Section content padding |
| space-11 | 40px | Major content block spacing |
| space-12 | 48px | Section vertical padding (compact) |
| space-13 | 64px | Section vertical padding (standard) |
| space-14 | 80px | Hero section padding, large section gaps |

### Grid & Container

- Max container width: ~1440px, centered with auto margins
- Product grid: 3-column on desktop, 2-column on tablet, 1-column on mobile
- Feature grid: 2-column split (image + content), stacks on mobile
- Grid gap: 24px between cards, 16px on mobile
- Page horizontal padding: 24-40px depending on breakpoint

### Whitespace Philosophy

Whitespace is the store's primary luxury signifier. Sections breathe with 64-80px vertical padding, creating a sense of unhurried browsing. Product images float in generous negative space rather than being crammed edge-to-edge. This restrained spacing communicates premium positioning — the visual equivalent of wide aisles in a high-end retail store.

### Border Radius Scale

| Value | Context |
|-------|---------|
| 8px | Inputs, small UI elements, glimmer placeholders |
| 20px | Cards (--card-corner-radius) |
| 24px | Feature cards, product highlight areas, ghost buttons |
| 100px | Pill buttons, tags, badges (fully rounded) |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow, background differentiation only | Default cards, sections |
| Level 1 | \`0 2px 4px 0 rgba(0,0,0,0.1)\` | Subtle lift for interactive cards |
| Level 2 | \`0 12px 28px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)\` | Elevated cards, dropdowns |
| Overlay | \`rgba(0,0,0,0.6)\` full-screen | Modal/lightbox backdrop |
| Inset | \`rgba(255,255,255,0.5)\` inset | Inner glow on glass-effect surfaces |

The Meta Store favors a primarily flat elevation model. Most surface differentiation comes from background color shifts (white → soft gray → dark) rather than shadows. When shadows appear, they are soft, diffused, and use the dual-shadow pattern (a large blurred shadow for ambient light + a small sharp shadow for direct light). This creates a physically plausible depth feel without heavy visual weight.

### Decorative Depth

- **Frosted glass nav**: \`rgba(241, 244, 247, 0.8)\` background with backdrop-filter blur, creating a translucent navigation bar
- **Dark section gradient**: \`linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))\` overlay on product photography for text legibility
- **Glimmer loading states**: Pulsating opacity animation (0.25 → 1.0) on \`#979A9F\` base color with 8px radius, 1000ms steps timing — used for skeleton screens during product image loading

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hamburger nav, hero text shrinks to 36px, full-width product cards, 48px section padding |
| Tablet | 768-1024px | 2-column product grid, compact nav, hero text at 48px |
| Desktop | 1024-1440px | 3-column product grid, full horizontal nav, hero text at 64px, 80px section padding |
| Large Desktop | >1440px | Max-width container (1440px) centered, increased horizontal margins |

### Touch Targets

- Minimum touch target: 44x44px (WCAG AAA compliant)
- Mobile button height: minimum 44px with 10px vertical padding
- Nav hamburger icon: 48x48px touch area
- Product card tappable area: full card surface

### Collapsing Strategy

- **Navigation**: Horizontal links collapse to hamburger menu below 768px; CTA button remains visible
- **Product grids**: 3-col → 2-col at 1024px → 1-col at 768px
- **Hero sections**: Display text scales from 64px → 48px → 36px; CTA buttons stack vertically on mobile
- **Feature sections**: 2-column (image + text) → full-width stacked below 768px, image on top
- **Section padding**: 80px → 64px → 48px → 32px as viewport narrows
- **Card radius**: Remains consistent at 20-24px across all breakpoints

### Image Behavior

- Responsive images via srcset with multiple resolutions
- WebP format with progressive JPEG fallback
- Hero images: full-bleed on mobile, contained on desktop
- Product grid images: maintain aspect ratio, scale proportionally
- Art direction: hero crop changes between desktop (wide cinematic) and mobile (tighter product focus)
- Lazy loading with glimmer skeleton (pulsating gray placeholder) during load`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Meta — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/meta. Photography-first retail polish:
        white canvas, Optimistic VF type, Meta Blue (#0064E0) pill CTAs, gallery whitespace."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f7f8fa;
        --surface-warm: #f2f0e6;

        --fg: #1c2b33;
        --fg-2: #5d6c7b;
        --muted: #65676b;
        --meta: #8595a4;

        --border: #ced0d4;
        --border-soft: #dee3e9;

        --accent: #0064e0;
        --accent-on: #ffffff;
        --accent-hover: #0143b5;
        --accent-active: #004bb9;

        --success: #31a24c;
        --warn: #f7b928;
        --danger: #e41e3f;

        --font-display: "Optimistic VF", "Optimistic", Inter, Montserrat, Helvetica, Arial, "Noto Sans", sans-serif;
        --font-body: "Optimistic VF", "Optimistic", Inter, Montserrat, Helvetica, Arial, "Noto Sans", sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 28px;
        --text-2xl: 36px;
        --text-3xl: 48px;
        --text-4xl: 64px;

        --leading-body: 1.5;
        --leading-tight: 1.16;
        --tracking-display: -0.01em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet: 64px;
        --section-y-phone: 48px;

        --radius-sm: 8px;
        --radius-md: 20px;
        --radius-lg: 24px;
        --radius-pill: 100px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 12px 28px 0 rgba(0, 0, 0, 0.2),
          0 2px 4px 0 rgba(0, 0, 0, 0.1);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1440px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet: 24px;
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
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "ss01", "ss02";
      }

      /* ─── Layout ─────────────────────────────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* Alternating light cadence — DESIGN.md §1 walkthrough rhythm */
      .surface-soft { background: var(--surface); }

      /* ─── Typography — Optimistic VF, weight carries hierarchy ── */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      h1 { font-size: var(--text-4xl); font-weight: 500; letter-spacing: var(--tracking-display); }
      h2 { font-size: var(--text-3xl); font-weight: 500; letter-spacing: var(--tracking-display); }
      h3 { font-size: var(--text-lg); font-weight: 700; }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: 1.44; font-weight: 300; }
      .body-muted { color: var(--fg-2); }
      .body-meta { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }
      .stack-8 > * + * { margin-block-start: var(--space-8); }

      @media (max-width: 1023px) {
        h1 { font-size: var(--text-3xl); }
      }
      @media (max-width: 639px) {
        h1 { font-size: var(--text-2xl); }
        h2 { font-size: var(--text-xl); }
      }

      /* ─── Buttons — Meta Blue pill ───────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 22px;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1.43;
        letter-spacing: -0.14px;
        cursor: pointer;
        border: none;
        text-decoration: none;
        transition:
          background-color var(--motion-base) var(--ease-standard),
          color var(--motion-base) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: Meta Blue pill — the only chromatic action */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); transform: scale(1.02); }
      .btn-primary:active { background: var(--accent-active); transform: scale(0.98); }
      /* Secondary: outlined pill, Dark Charcoal at 50% opacity per DESIGN.md §4 */
      .btn-secondary {
        background: transparent;
        color: color-mix(in oklab, var(--fg), transparent 50%);
        box-shadow: inset 0 0 0 2px rgba(10, 19, 23, 0.12);
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, var(--fg-2), transparent 30%);
        color: var(--bg);
        box-shadow: inset 0 0 0 2px transparent;
      }

      /* ─── Inputs — Dolly .hey-preview-form pattern ────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 500; color: var(--fg); }
      .field input {
        padding: 12px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — 20px radius, dual-shadow elevation on hover ─ */
      .card {
        background: var(--bg);
        border-radius: var(--radius-md);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        box-shadow: var(--elev-ring);
        transition:
          transform var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        transform: translateY(-2px);
        box-shadow: var(--elev-raised);
      }
      .card-feature {
        background: var(--surface-warm);
        border-radius: var(--radius-lg);
      }

      /* ─── Badges ─────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 700; line-height: 1.43;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 88%); }
      .badge-muted { color: var(--muted); background: var(--surface); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links ──────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; transition: color var(--motion-fast) var(--ease-standard); }
      a:hover { color: var(--accent-hover); text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border-soft); background: var(--surface); color: var(--muted);
      }

      /* ─── Layout helpers ─────────────────────────────────────── */
      .hero-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-12); align-items: end; }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-8); flex-wrap: wrap; }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-4);
        padding: var(--space-6);
        border-radius: var(--radius-md);
        background: var(--surface);
        box-shadow: var(--elev-ring);
      }
      .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; gap: var(--space-4); } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; gap: var(--space-8); } }
      .form { display: flex; flex-direction: column; gap: var(--space-5); max-width: 440px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* Brand mark — gradient logotype dot (Meta's blue → purple → magenta) */
      .brand-mark {
        display: inline-flex; align-items: center; gap: var(--space-2);
        font-size: var(--text-sm); font-weight: 700; color: var(--fg);
      }
      .brand-mark::before {
        content: "";
        width: 14px; height: 14px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0064e0 0%, #6441d2 50%, #d6311f 100%);
      }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-6">
            <span class="brand-mark">From Meta</span>
            <h1 style="max-width: 16ch">Build what brings us closer.</h1>
            <p class="lead" style="max-width: 56ch">
              From mixed reality to open-source AI, we ship the platforms and tools that
              billions of people use to create, connect, and discover what's next.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Newsroom">
            <div class="row-between">
              <span class="eyebrow">Newsroom</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Live
              </span>
            </div>
            <p class="body-sm body-muted" style="line-height: 1.5">
              Llama 4 ships with native multimodal reasoning. Quest 4 introduces full-color
              passthrough across the entire device family.
            </p>
            <p class="body-sm body-meta">
              Updated <time datetime="2026-05-15">2026-05-15</time> · Press
              <kbd>⌘</kbd> <kbd>K</kbd> to search the press library.
            </p>
          </aside>
        </div>
      </section>

      <section class="surface-soft" data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What we build</p>
          <h2 style="max-width: 22ch">Three product families, one long-running thesis.</h2>
          <p class="lead" style="max-width: 60ch">
            Every Meta surface — phone, headset, glasses, model, API — is built so the next
            billion creators can move at the speed of imagination.
          </p>
        </div>
        <div class="features-grid stack-8" style="margin-block-start: var(--space-12)">
          <article class="card">
            <span class="eyebrow">Meta AI</span>
            <h3>An assistant that meets you where you are.</h3>
            <p class="body-muted body-sm">
              Llama-powered, multimodal, available in every Meta app — and open-weight
              for anyone who wants to build on top.
            </p>
            
          </article>
          <article class="card card-feature">
            <span class="eyebrow">Reality Labs</span>
            <h3>Mixed reality, finally for everyone.</h3>
            <p class="body-muted body-sm">
              Quest headsets and Ray-Ban Meta glasses share one platform — pass-through
              video, spatial audio, and on-device AI built in.
            </p>
            
          </article>
          <article class="card">
            <span class="eyebrow">Open source</span>
            <h3>The infrastructure of the open web.</h3>
            <p class="body-muted body-sm">
              PyTorch, Llama, React, GraphQL — Meta open-sources the technology that
              billions of products depend on, every day.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Stay close to what's next</p>
            <h2 style="max-width: 18ch">Get the Meta brief.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Quarterly updates on our research, product launches, and open-source releases —
              written by the people who built them. No marketing copy, no tracking pixels.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">One short email per quarter. Unsubscribe in one click.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Subscribe</button>
              <button type="button" class="btn btn-secondary">Read past issues</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=meta_default;return module.exports}});
//# sourceMappingURL=client.meta.js.map