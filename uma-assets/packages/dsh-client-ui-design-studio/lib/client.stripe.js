
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.stripe.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var stripe_default={"contract":`## 1. Visual Theme & Atmosphere

Stripe's website is the gold standard of fintech design -- a system that manages to feel simultaneously technical and luxurious, precise and warm. The page opens on a clean white canvas (\`#ffffff\`) with deep navy headings (\`#061b31\`) and a signature purple (\`#533afd\`) that functions as both brand anchor and interactive accent. This isn't the cold, clinical purple of enterprise software; it's a rich, saturated violet that reads as confident and premium. The overall impression is of a financial institution redesigned by a world-class type foundry.

The custom \`sohne-var\` variable font is the defining element of Stripe's visual identity. Every text element enables the OpenType \`"ss01"\` stylistic set, which modifies character shapes for a distinctly geometric, modern feel. At display sizes (48px-56px), sohne-var runs at weight 300 -- an extraordinarily light weight for headlines that creates an ethereal, almost whispered authority. This is the opposite of the "bold hero headline" convention; Stripe's headlines feel like they don't need to shout. The negative letter-spacing (-1.4px at 56px, -0.96px at 48px) tightens the text into dense, engineered blocks. At smaller sizes, the system also uses weight 300 with proportionally reduced tracking, and tabular numerals via \`"tnum"\` for financial data display.

What truly distinguishes Stripe is its shadow system. Rather than the flat or single-layer approach of most sites, Stripe uses multi-layer, blue-tinted shadows: the signature \`rgba(50,50,93,0.25)\` combined with \`rgba(0,0,0,0.1)\` creates shadows with a cool, almost atmospheric depth -- like elements are floating in a twilight sky. The blue-gray undertone of the primary shadow color (50,50,93) ties directly to the navy-purple brand palette, making even elevation feel on-brand.

**Key Characteristics:**
- sohne-var with OpenType \`"ss01"\` on all text -- a custom stylistic set that defines the brand's letterforms
- Weight 300 as the signature headline weight -- light, confident, anti-convention
- Negative letter-spacing at display sizes (-1.4px at 56px, progressive relaxation downward)
- Blue-tinted multi-layer shadows using \`rgba(50,50,93,0.25)\` -- elevation that feels brand-colored
- Deep navy (\`#061b31\`) headings instead of black -- warm, premium, financial-grade
- Conservative border-radius (4px-8px) -- nothing pill-shaped, nothing harsh
- Ruby (\`#ea2261\`) and magenta (\`#f96bee\`) accents for gradient and decorative elements
- \`SourceCodePro\` as the monospace companion for code and technical labels

## 4. Component Stylings

### Buttons

**Primary Purple**
- Background: \`#533afd\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 4px
- Font: 16px sohne-var weight 400, \`"ss01"\`
- Hover: \`#4434d4\` background
- Use: Primary CTA ("Start now", "Contact sales")

**Ghost / Outlined**
- Background: transparent
- Text: \`#533afd\`
- Padding: 8px 16px
- Radius: 4px
- Border: \`1px solid #b9b9f9\`
- Font: 16px sohne-var weight 400, \`"ss01"\`
- Hover: background shifts to \`rgba(83,58,253,0.05)\`
- Use: Secondary actions

**Transparent Info**
- Background: transparent
- Text: \`#2874ad\`
- Padding: 8px 16px
- Radius: 4px
- Border: \`1px solid rgba(43,145,223,0.2)\`
- Use: Tertiary/info-level actions

**Neutral Ghost**
- Background: transparent (\`rgba(255,255,255,0)\`)
- Text: \`rgba(16,16,16,0.3)\`
- Padding: 8px 16px
- Radius: 4px
- Outline: \`1px solid rgb(212,222,233)\`
- Use: Disabled or muted actions

### Cards & Containers
- Background: \`#ffffff\`
- Border: \`1px solid #e5edf5\` (standard) or \`1px solid #061b31\` (dark accent)
- Radius: 4px (tight), 5px (standard), 6px (comfortable), 8px (featured)
- Shadow (standard): \`rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px\`
- Shadow (ambient): \`rgba(23,23,23,0.08) 0px 15px 35px 0px\`
- Hover: shadow intensifies, often adding the blue-tinted layer

### Badges / Tags / Pills
**Neutral Pill**
- Background: \`#ffffff\`
- Text: \`#000000\`
- Padding: 0px 6px
- Radius: 4px
- Border: \`1px solid #f6f9fc\`
- Font: 11px weight 400

**Success Badge**
- Background: \`rgba(21,190,83,0.2)\`
- Text: \`#108c3d\`
- Padding: 1px 6px
- Radius: 4px
- Border: \`1px solid rgba(21,190,83,0.4)\`
- Font: 10px weight 300

### Inputs & Forms
- Border: \`1px solid #e5edf5\`
- Radius: 4px
- Focus: \`1px solid #533afd\` or purple ring
- Label: \`#273951\`, 14px sohne-var
- Text: \`#061b31\`
- Placeholder: \`#64748d\`

### Navigation
- Clean horizontal nav on white, sticky with blur backdrop
- Brand logotype left-aligned
- Links: sohne-var 14px weight 400, \`#061b31\` text with \`"ss01"\`
- Radius: 6px on nav container
- CTA: purple button right-aligned ("Sign in", "Start now")
- Mobile: hamburger toggle with 6px radius

### Decorative Elements
**Dashed Borders**
- \`1px dashed #362baa\` (purple) for placeholder/drop zones
- \`1px dashed #ffd7ef\` (magenta) for magenta-themed decorative borders

**Gradient Accents**
- Ruby-to-magenta gradients (\`#ea2261\` to \`#f96bee\`) for hero decorations
- Brand dark sections use \`#1c1e54\` backgrounds with white text

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 4px, 6px, 8px, 10px, 11px, 12px, 14px, 16px, 18px, 20px
- Notable: The scale is dense at the small end (every 2px from 4-12), reflecting Stripe's precision-oriented UI for financial data

### Grid & Container
- Max content width: approximately 1080px
- Hero: centered single-column with generous padding, lightweight headlines
- Feature sections: 2-3 column grids for feature cards
- Full-width dark sections with \`#1c1e54\` background for brand immersion
- Code/dashboard previews as contained cards with blue-tinted shadows

### Whitespace Philosophy
- **Precision spacing**: Unlike the vast emptiness of minimalist systems, Stripe uses measured, purposeful whitespace. Every gap is a deliberate typographic choice.
- **Dense data, generous chrome**: Financial data displays (tables, charts) are tightly packed, but the UI chrome around them is generously spaced. This creates a sense of controlled density -- like a well-organized spreadsheet in a beautiful frame.
- **Section rhythm**: White sections alternate with dark brand sections (\`#1c1e54\`), creating a dramatic light/dark cadence that prevents monotony without introducing arbitrary color.

### Border Radius Scale
- Micro (1px): Fine-grained elements, subtle rounding
- Standard (4px): Buttons, inputs, badges, cards -- the workhorse
- Comfortable (5px): Standard card containers
- Relaxed (6px): Navigation, larger interactive elements
- Large (8px): Featured cards, hero elements
- Compound: \`0px 0px 6px 6px\` for bottom-rounded containers (tab panels, dropdown footers)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, inline text |
| Ambient (Level 1) | \`rgba(23,23,23,0.06) 0px 3px 6px\` | Subtle card lift, hover hints |
| Standard (Level 2) | \`rgba(23,23,23,0.08) 0px 15px 35px\` | Standard cards, content panels |
| Elevated (Level 3) | \`rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px\` | Featured cards, dropdowns, popovers |
| Deep (Level 4) | \`rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px\` | Modals, floating panels |
| Ring (Accessibility) | \`2px solid #533afd\` outline | Keyboard focus ring |

**Shadow Philosophy**: Stripe's shadow system is built on a principle of chromatic depth. Where most design systems use neutral gray or black shadows, Stripe's primary shadow color (\`rgba(50,50,93,0.25)\`) is a deep blue-gray that echoes the brand's navy palette. This creates shadows that don't just add depth -- they add brand atmosphere. The multi-layer approach pairs this blue-tinted shadow with a pure black secondary layer (\`rgba(0,0,0,0.1)\`) at a different offset, creating a parallax-like depth where the branded shadow sits farther from the element and the neutral shadow sits closer. The negative spread values (-30px, -18px) ensure shadows don't extend beyond the element's footprint horizontally, keeping elevation vertical and controlled.

### Decorative Depth
- Dark brand sections (\`#1c1e54\`) create immersive depth through background color contrast
- Gradient overlays with ruby-to-magenta transitions for hero decorations
- Shadow color \`rgba(0,55,112,0.08)\` (\`--hds-color-shadow-sm-top\`) for top-edge shadows on sticky elements

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, reduced heading sizes, stacked cards |
| Tablet | 640-1024px | 2-column grids, moderate padding |
| Desktop | 1024-1280px | Full layout, 3-column feature grids |
| Large Desktop | >1280px | Centered content with generous margins |

### Touch Targets
- Buttons use comfortable padding (8px-16px vertical)
- Navigation links at 14px with adequate spacing
- Badges have 6px horizontal padding minimum for tap targets
- Mobile nav toggle with 6px radius button

### Collapsing Strategy
- Hero: 56px display -> 32px on mobile, weight 300 maintained
- Navigation: horizontal links + CTAs -> hamburger toggle
- Feature cards: 3-column -> 2-column -> single column stacked
- Dark brand sections: maintain full-width treatment, reduce internal padding
- Financial data tables: horizontal scroll on mobile
- Section spacing: 64px+ -> 40px on mobile
- Typography scale compresses: 56px -> 48px -> 32px hero sizes across breakpoints

### Image Behavior
- Dashboard/product screenshots maintain blue-tinted shadow at all sizes
- Hero gradient decorations simplify on mobile
- Code blocks maintain \`SourceCodePro\` treatment, may horizontally scroll
- Card images maintain consistent 4px-6px border-radius`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inspired by Stripe — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/stripe. Every visible
        value comes from tokens.css; the page itself follows Stripe's
        rules — sohne-var with ss01 globally, weight 300 at display
        sizes, deep navy (#061b31) headings instead of black, blue-
        tinted multi-layer shadows on elevated surfaces, conservative
        4-8px radius, and Stripe Purple capped at ≤2 visible uses
        per screen."
    />

    <style>
      /* :root paste — sourced verbatim from
         design-systems/stripe/tokens.css. Keep this block in sync
         when tokens.css changes. The agent prompt instructs the
         Designer panelist to paste this block as the FIRST thing in
         their <style>, then reference everything below via var(...). */
      :root {
        --bg:           #ffffff;
        --surface:      #ffffff;
        --surface-warm: #f6f9fc;

        --fg:    #061b31;
        --fg-2:  #273951;
        --muted: #64748d;
        --meta:  var(--muted);

        --border:      #e5edf5;
        --border-soft: var(--border);

        --accent:    #533afd;
        --accent-on: #ffffff;

        --accent-hover:  #4434d4;
        --accent-active: #2e2b8c;

        --success: #15be53;
        --warn:    #9b6829;
        --danger:  #ea2261;

        --font-display:
          "sohne-var", "Söhne", "Sohne",
          "SF Pro Display", -apple-system, BlinkMacSystemFont,
          system-ui, "Helvetica Neue", Arial, sans-serif;
        --font-body:
          "sohne-var", "Söhne", "Sohne",
          "SF Pro Display", -apple-system, BlinkMacSystemFont,
          system-ui, "Helvetica Neue", Arial, sans-serif;
        --font-mono:
          "SourceCodePro", "Source Code Pro",
          ui-monospace, "SF Mono", "JetBrains Mono",
          Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   22px;
        --text-2xl:  32px;
        --text-3xl:  48px;
        --text-4xl:  56px;

        --leading-body:     1.40;
        --leading-tight:    1.10;
        --tracking-display: -0.02em;

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
        --section-y-phone:   40px;

        --radius-sm:   4px;
        --radius-md:   6px;
        --radius-lg:   8px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised:
          rgba(50, 50, 93, 0.25)  0px 30px 45px -30px,
          rgba(0,   0,  0, 0.10)  0px 18px 36px -18px;

        --focus-ring:
          0 0 0 2px var(--accent),
          0 0 0 5px color-mix(in oklab, var(--accent), transparent 75%);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1080px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet:  24px;
        --container-gutter-phone:   16px;
      }

      /* ─── Reset (minimal) ───────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 300;        /* Stripe's signature: 300 is body weight */
        line-height: var(--leading-body);
        /* \`"ss01"\` is non-negotiable on every sohne-var element
           (DESIGN.md §3 Principles). Inheriting from <body> applies
           it to every descendant by default; specific components
           that need \`tnum\` for financial tables override locally. */
        font-feature-settings: "ss01";
        -webkit-font-smoothing: antialiased;
      }
      strong { font-weight: 400; } /* never 600/700 in sohne-var per DESIGN.md §7 */

      /* ─── Layout primitives ─────────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section {
        padding-block: var(--section-y-desktop);
      }
      section + section {
        border-top: 1px solid var(--border);
      }
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
        font-family: var(--font-display);
        font-weight: 300;          /* Stripe's anti-convention signature */
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        color: var(--fg);
        margin: 0;
      }
      h1 {
        font-size: var(--text-4xl);
        line-height: 1.03;         /* DESIGN.md §3: display hero ratio */
        letter-spacing: -0.025em;  /* exact -1.4px at 56px */
      }
      h2 {
        font-size: var(--text-2xl);
      }
      h3 {
        font-size: var(--text-xl);
        letter-spacing: -0.01em;   /* relaxed at 22px per DESIGN.md §3 */
      }
      p { margin: 0; }

      .lede {
        font-size: var(--text-lg);
        line-height: var(--leading-body);
        color: var(--muted);
        max-width: 56ch;
      }
      .body-muted { color: var(--muted); }
      .body-meta  { color: var(--meta); font-size: var(--text-sm); }
      .body-sm    { font-size: var(--text-sm); }

      /* \`.eyebrow\` is the only place uppercase + tracking is used —
         small label, deep-navy on lavender wash. tracking is well
         above the craft 0.06em floor. */
      .eyebrow {
        display: inline-block;
        font-size: var(--text-xs);
        font-weight: 400;
        line-height: 1;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }
      .stack-8 > * + * { margin-block-start: var(--space-8); }

      /* ─── Buttons ───────────────────────────────────────────────
       * Stripe buttons are conservative — 4px radius, 8/16 padding,
       * weight-400 sohne-var with ss01. Hover shifts background
       * colour; never transforms. Primary uses --accent / --accent-on;
       * ghost uses the brand purple as text colour against a
       * transparent shell with a purple-tinted border. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-feature-settings: "ss01";
        font-weight: 400;
        font-size: var(--text-base);
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        background: transparent;
        color: var(--fg);
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
      }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover  { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }

      /* Ghost / outlined — DESIGN.md §4 spec verbatim.
         The hover wash is the only place we tint --accent with
         transparency inline; it's a once-per-page rule rather than
         a cross-component pattern, so it stays inline rather than
         being promoted to a token. */
      .btn-ghost {
        background: transparent;
        color: var(--accent);
        border-color: color-mix(in oklab, var(--accent), white 65%);
      }
      .btn-ghost:hover {
        background: color-mix(in oklab, var(--accent), transparent 95%);
        border-color: color-mix(in oklab, var(--accent), white 55%);
      }

      /* Compact button for nav and toolbar — 14px / 4px radius */
      .btn-sm {
        padding: 6px 12px;
        font-size: var(--text-sm);
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-size: var(--text-sm);
        font-weight: 400;
        color: var(--fg-2);        /* dark-slate label per DESIGN.md §4 */
      }
      .field input,
      .field select,
      .field textarea {
        padding: 10px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: inherit;
        font-feature-settings: "ss01";
        font-size: var(--text-base);
        font-weight: 300;
        line-height: 1.4;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible,
      .field select:focus-visible,
      .field textarea:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
      }

      /* ─── Cards ─────────────────────────────────────────────────
       * Two card flavours:
       *   .card           hairline border, no shadow — for grids and
       *                   .hey-preview-form panels where the border IS the edge.
       *   .card-elevated  no border, blue-tinted multi-layer shadow —
       *                   for featured / hero cards where Stripe's
       *                   trademark elevation does the work.
       * Both share radius and padding. Hover on .card-elevated
       * intensifies the shadow; .card stays static (border doesn't
       * pulse). */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .card-elevated {
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: var(--space-8);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        box-shadow: var(--elev-raised);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card-elevated:hover {
        /* Intensify the near layer; far stays the same so the lift
           reads as "drawing closer", not "growing larger". */
        box-shadow:
          rgba(50, 50, 93, 0.25)  0px 30px 45px -30px,
          rgba(0,   0,  0, 0.14)  0px 24px 48px -16px;
      }
      .card-title {
        font-family: var(--font-display);
        font-feature-settings: "ss01";
        font-weight: 300;
        font-size: var(--text-xl);
        line-height: 1.12;
        letter-spacing: -0.01em;
        color: var(--fg);
      }

      /* ─── Badges ────────────────────────────────────────────────
       * Success badge per DESIGN.md §4. Pill radius is wrong here —
       * Stripe uses 4px on badges, never 9999px. */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 1px 6px;
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 300;
        line-height: 1.6;
        font-feature-settings: "ss01";
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), transparent 80%);
        border: 1px solid
          color-mix(in oklab, var(--success), transparent 60%);
      }
      .badge-muted {
        color: var(--muted);
        background: var(--surface-warm);
        border: 1px solid var(--border);
      }
      .badge-accent {
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), white 88%);
        border: 1px solid
          color-mix(in oklab, var(--accent), white 70%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────────
       * Default link is Stripe Purple. Underline appears only on
       * hover, at a generous offset so the rule reads as a
       * deliberate gesture. */
      a {
        color: var(--accent);
        text-decoration: none;
        font-feature-settings: "ss01";
      }
      a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }

      /* ─── Kbd ───────────────────────────────────────────────────
       * SourceCodePro at 12px, hairline border, navy text. Stripe's
       * kbd is small and dense — no padding inflation. */
      kbd {
        font-family: var(--font-mono);
        font-size: 11px;
        font-weight: 500;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface-warm);
        color: var(--fg-2);
      }

      /* ─── Distinctive brand element: gradient halo ──────────────
       * Stripe's signature hero decoration is a soft pastel wash
       * behind the headline — built here from the brand purple
       * mixed at varying transparencies (no raw hex outside :root).
       * The halo sits in a layered radial-gradient and lets the
       * navy headline read as "floating in twilight". */
      .halo {
        position: absolute;
        inset: -10% -20% -20% -10%;
        pointer-events: none;
        background:
          radial-gradient(
            60% 50% at 15% 30%,
            color-mix(in oklab, var(--accent), transparent 70%) 0%,
            color-mix(in oklab, var(--accent), transparent 100%) 65%
          ),
          radial-gradient(
            45% 40% at 85% 20%,
            color-mix(in oklab, var(--danger), transparent 75%) 0%,
            color-mix(in oklab, var(--danger), transparent 100%) 70%
          ),
          radial-gradient(
            55% 45% at 70% 80%,
            color-mix(in oklab, var(--accent), transparent 80%) 0%,
            color-mix(in oklab, var(--accent), transparent 100%) 70%
          );
        filter: blur(40px);
        z-index: 0;
      }

      /* ─── Code block ────────────────────────────────────────────
       * DESIGN.md §3: SourceCodePro at 12px / weight 500 / 2.00
       * line-height. The 2.00 leading is intentional — Stripe's
       * payment-integration snippets need to read like prose, not
       * like a terminal dump. */
      .code {
        background: var(--surface-warm);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-5);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 2.0;
        color: var(--fg);
        white-space: pre;
        overflow-x: auto;
      }
      .code .k { color: var(--accent); }                 /* keyword */
      .code .s { color: var(--success); }                /* string  */
      .code .c { color: var(--muted); }                  /* comment */
      .code .n { color: var(--fg-2); }                   /* identifier */

      /* ─── Metric (tabular financial rendering) ──────────────────
       * DESIGN.md §3 "Caption Tabular" — \`tnum\` for any number in
       * a data display so columns of figures align. The values use
       * deep navy; the labels use slate. */
      .metric {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .metric-value {
        font-family: var(--font-display);
        font-feature-settings: "tnum", "ss01";
        font-weight: 300;
        font-size: var(--text-2xl);
        line-height: 1.1;
        letter-spacing: -0.01em;
        color: var(--fg);
      }
      .metric-label {
        font-size: var(--text-sm);
        color: var(--muted);
      }

      /* ─── Section-specific layout ───────────────────────────── */
      .hero {
        position: relative;
        overflow: hidden;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-inner { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero h1 {
        max-width: 14ch;
        margin: 0;
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-8);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }

      /* Pricing-style featured card row — exercises .card-elevated
         alongside .card so the elevation contrast is visible. */
      .pricing-grid {
        display: grid;
        grid-template-columns: 1fr 1.1fr 1fr;
        gap: var(--space-5);
        align-items: stretch;
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .pricing-grid { grid-template-columns: 1fr; }
      }
      .pricing-price {
        font-family: var(--font-display);
        font-feature-settings: "tnum", "ss01";
        font-weight: 300;
        font-size: var(--text-3xl);
        line-height: 1.05;
        letter-spacing: -0.02em;
        color: var(--fg);
      }
      .pricing-price small {
        font-size: var(--text-sm);
        color: var(--muted);
        margin-inline-start: var(--space-2);
        font-feature-settings: "ss01";
      }
      .pricing-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .pricing-list li {
        position: relative;
        padding-inline-start: var(--space-5);
        font-size: var(--text-sm);
        color: var(--fg-2);
        line-height: 1.5;
      }
      .pricing-list li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.45em;
        width: 12px;
        height: 7px;
        border-left: 1.5px solid var(--accent);
        border-bottom: 1.5px solid var(--accent);
        transform: rotate(-45deg);
        transform-origin: 0 100%;
      }

      .metric-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-8);
      }
      @media (max-width: 767px) {
        .metric-row { grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
      }

      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 460px;
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised);
      }
      .form-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-3);
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        align-items: center;
      }

      .icon { width: 14px; height: 14px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
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
      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: gradient .halo (Stripe's signature
           pastel-wash behind the headline, built entirely from
           color-mix() over --accent and --danger), h1 at 56px /
           weight 300 / -0.025em (the brand's "whisper authority"),
           .lede in slate, .btn-primary + .btn-ghost from DESIGN.md
           §4 verbatim. Asymmetric grid on desktop; single column on
           tablet.
      ═══════════════════════════════════════════════════════════════ -->
      <section class="hero" data-od-id="hero">
        <div class="halo" aria-hidden="true"></div>

        <div class="hero-inner">
          <div class="stack-6">
            <span class="eyebrow">Payments · Infrastructure</span>
            <h1>Financial infrastructure designed for the internet.</h1>
            <p class="lede">
              The reference fixture pastes Stripe's token block into a
              single <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">&lt;style&gt;</code>
              and renders a recognisable Stripe page without authoring
              any additional values — every colour, type size, and
              shadow below resolves through <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">var(--*)</code>.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside class="card-elevated" aria-label="Payment summary">
            <div class="row-between">
              <span class="eyebrow">Payment intent</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Succeeded
              </span>
            </div>

            <div class="metric">
              <div
                class="metric-value"
                style="font-size: var(--text-3xl); letter-spacing: -0.02em"
              >
                $4,280.<span style="color: var(--muted)">00</span>
              </div>
              <div class="metric-label">
                Charged via card_1NqK… · 2026-05-14
              </div>
            </div>

            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--space-3);
                padding-block-start: var(--space-3);
                border-top: 1px solid var(--border);
              "
            >
              <div class="metric">
                <div class="metric-label">Net</div>
                <div
                  class="metric-value"
                  style="font-size: var(--text-base); color: var(--fg-2)"
                >
                  $4,154.88
                </div>
              </div>
              <div class="metric">
                <div class="metric-label">Fee</div>
                <div
                  class="metric-value"
                  style="font-size: var(--text-base); color: var(--fg-2)"
                >
                  $125.12
                </div>
              </div>
            </div>

            <p class="body-sm body-muted">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to inspect this token block
              in the design-system viewer.
            </p>
          </aside>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           METRICS — exercises: .metric pattern with \`tnum\`, deep-
           navy values, slate labels. Numbers describe the fixture
           itself, not invented claims.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="metrics">
        <div class="stack-3">
          <span class="eyebrow">Schema in numbers</span>
          <h2 style="max-width: 24ch">
            Fifty-six tokens carry every visible value below.
          </h2>
        </div>

        <div class="metric-row" style="margin-block-start: var(--space-8)">
          <div class="metric">
            <div class="metric-value">56</div>
            <div class="metric-label">tokens in :root</div>
          </div>
          <div class="metric">
            <div class="metric-value">0</div>
            <div class="metric-label">brand-C extensions</div>
          </div>
          <div class="metric">
            <div class="metric-value">3</div>
            <div class="metric-label">elevation levels (flat · ring · raised)</div>
          </div>
          <div class="metric">
            <div class="metric-value">300</div>
            <div class="metric-label">default sohne-var weight</div>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURES — exercises: h2, .card (hairline border), h3 with
           tighter tracking, body text, .features-grid responsive
           ladder. Each card describes a real property of this
           fixture (no "feature one/two/three" filler).
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <div class="stack-3">
          <span class="eyebrow">What this fixture exercises</span>
          <h2 style="max-width: 30ch">
            Every component renders through <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">var(--*)</code> —
            no raw hex, no off-token type.
          </h2>
        </div>

        <div class="features-grid">
          <article class="card">
            <h3 class="card-title">Shadow as identity</h3>
            <p class="body-muted body-sm">
              The trademark blue-tinted multi-layer shadow lives at
              <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">--elev-raised</code>.
              Rebinding it to a neutral drop shadow erases Stripe's
              atmosphere even when every colour is right.
            </p>
            
          </article>

          <article class="card">
            <h3 class="card-title">Light weight as voice</h3>
            <p class="body-muted body-sm">
              Display sizes run at weight 300 with negative tracking.
              Stripe's headlines feel like they don't need to shout;
              weight 600 would erase the brand instantly.
            </p>
            
          </article>

          <article class="card">
            <h3 class="card-title">Accent discipline</h3>
            <p class="body-muted body-sm">
              <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">--accent</code>
              appears at most twice per screen — primary CTA and link
              colour. Decorative ruby / magenta gradients live in the
              hero halo, not on interactive elements.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           PRICING — exercises: .card-elevated with the trademark
           blue-tinted shadow, alongside two .card siblings so the
           elevation hierarchy is immediately visible. Tabular numerals
           on the price; check-mark feature list keyed to --accent.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="pricing">
        <div class="stack-3">
          <span class="eyebrow">Pricing pattern</span>
          <h2 style="max-width: 26ch">
            Featured tier lifts via shadow alone — no colour shift, no
            border change.
          </h2>
        </div>

        <div class="pricing-grid">
          <article class="card">
            <div class="stack-3">
              <h3 class="card-title">Starter</h3>
              <p class="body-muted body-sm">
                For new accounts integrating their first payment flow.
              </p>
            </div>
            <div class="pricing-price">
              $0<small>/month</small>
            </div>
            <ul class="pricing-list">
              <li>Standard processing rates</li>
              <li>Dashboard access</li>
              <li>Email support</li>
            </ul>
            
          </article>

          <article class="card-elevated" aria-label="Featured tier">
            <div class="row-between">
              <span class="eyebrow">Most popular</span>
              <span class="badge badge-accent">Featured</span>
            </div>
            <h3 class="card-title">Growth</h3>
            <div class="pricing-price">
              $79<small>/month</small>
            </div>
            <ul class="pricing-list">
              <li>Volume processing discounts</li>
              <li>Subscriptions &amp; invoicing</li>
              <li>Fraud monitoring</li>
              <li>Priority support</li>
            </ul>
            
          </article>

          <article class="card">
            <div class="stack-3">
              <h3 class="card-title">Scale</h3>
              <p class="body-muted body-sm">
                Custom pricing for high-volume merchants and platforms.
              </p>
            </div>
            <div class="pricing-price">
              Custom
            </div>
            <ul class="pricing-list">
              <li>Negotiated processing rates</li>
              <li>Dedicated solutions engineer</li>
              <li>Custom data residency</li>
            </ul>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           CODE PREVIEW — exercises: SourceCodePro at 12px / weight
           500 / line-height 2.00 (DESIGN.md §3). Keyword tokens use
           --accent; strings use --success; comments use --muted.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="code">
        <div class="form-row">
          <div class="stack-4">
            <span class="eyebrow">Integration preview</span>
            <h2 style="max-width: 18ch">
              Two lines of code, one charge.
            </h2>
            <p class="body-muted lede">
              The monospace face is <code style="font-family:var(--font-mono);font-size:0.95em">SourceCodePro</code>
              at 12px / weight 500 / line-height 2.00 — generous leading
              so payment snippets read like prose, not like terminal
              output.
            </p>
            <div>
              
            </div>
          </div>

<pre class="code"><span class="c">// Create a PaymentIntent on your server.</span>
<span class="k">const</span> <span class="n">intent</span> = <span class="k">await</span> <span class="n">stripe</span>.<span class="n">paymentIntents</span>.<span class="n">create</span>({
  <span class="n">amount</span>: <span class="k">4280</span>,
  <span class="n">currency</span>: <span class="s">"usd"</span>,
  <span class="n">automatic_payment_methods</span>: { <span class="n">enabled</span>: <span class="k">true</span> },
});

<span class="c">// Return the client secret to the browser.</span>
<span class="k">res</span>.<span class="n">json</span>({ <span class="n">clientSecret</span>: <span class="n">intent</span>.<span class="n">client_secret</span> });</pre>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — exercises: .field, input :focus-visible (purple halo
           via --focus-ring), .btn-primary (reused), .btn-ghost,
           .field-help. The form panel itself uses .card-elevated so
           the trademark shadow frames the inputs.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <span class="eyebrow">Form components</span>
            <h2 style="max-width: 22ch">
              Inputs inherit the same tokens.
            </h2>
            <p class="body-muted lede">
              Focus rings, borders, placeholder colour — all derive
              from <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">--accent</code>
              and <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">--border</code>.
              The submit button reuses <code style="font-family:var(--font-mono);font-size:0.92em;color:var(--fg-2)">.btn-primary</code>
              unchanged. The panel itself lifts via the trademark
              blue-tinted shadow.
            </p>
          </div>

          <div role="group" class="hey-preview-form form">
            <div class="row-between">
              <h3 class="card-title" style="font-size: var(--text-lg)">
                Contact sales
              </h3>
              <span class="badge badge-muted">Secure</span>
            </div>

            <div class="form-grid-2">
              <div class="field">
                <label for="first">First name</label>
                <input
                  id="first"
                  type="text"
                  placeholder="Jamie"
                  autocomplete="given-name"
                />
              </div>
              <div class="field">
                <label for="last">Last name</label>
                <input
                  id="last"
                  type="text"
                  placeholder="Liu"
                  autocomplete="family-name"
                />
              </div>
            </div>

            <div class="field">
              <label for="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="jamie@acme.dev"
                autocomplete="email"
                required
              />
              <p class="field-help">
                We'll send the integration brief and nothing else.
              </p>
            </div>

            <div class="field">
              <label for="volume">Monthly processing volume</label>
              <select id="volume">
                <option>Under $80k</option>
                <option>$80k – $500k</option>
                <option>$500k – $5M</option>
                <option>Over $5M</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Start now
              </button>
              <button type="button" class="btn btn-ghost">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=stripe_default;return module.exports}});
//# sourceMappingURL=client.stripe.js.map