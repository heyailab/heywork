
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.mintlify.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var mintlify_default={"contract":`## 1. Visual Theme & Atmosphere

Mintlify's website is a study in documentation-as-product design — a white, airy, information-rich surface that treats clarity as its highest aesthetic value. The page opens with a luminous white (\`#ffffff\`) background, near-black (\`#0d0d0d\`) text, and a signature green brand accent (\`#18E299\`) that signals freshness and intelligence without dominating the palette. The overall mood is calm, confident, and engineered for legibility — a design system that whispers "we care about your developer experience" in every pixel.

The Inter font family carries the entire typographic load. At display sizes (40–64px), it uses tight negative letter-spacing (-0.8px to -1.28px) and semibold weight (600), creating headlines that feel focused and compressed like well-written documentation headers. Body text at 16–18px with 150% line-height provides generous reading comfort. Geist Mono appears exclusively for code and technical labels — uppercase, tracked-out, small — the voice of the terminal inside the marketing page.

What distinguishes Mintlify from other documentation platforms is its atmospheric gradient hero. A soft, cloud-like green-to-white gradient wash behind the hero content creates a sense of ethereal intelligence — documentation that floats above the noise. Below the hero, the page settles into a disciplined alternation of white sections separated by subtle 5% opacity borders. Cards use generous padding (24px+) with large radii (16px–24px) and whisper-thin borders, creating containers that feel open rather than boxed.

**Key Characteristics:**
- Inter with tight negative tracking at display sizes (-0.8px to -1.28px) — compressed yet readable
- Geist Mono for code labels: uppercase, 12px, tracked-out, the terminal voice
- Brand green (\`#18E299\`) used sparingly — CTAs, hover states, focus rings, and accent touches
- Atmospheric gradient hero with cloud-like green-white wash
- Ultra-round corners: 16px for containers, 24px for featured cards, full-round (9999px) for buttons and pills
- Subtle 5% opacity borders (\`rgba(0,0,0,0.05)\`) creating barely-there separation
- 8px base spacing system with generous section padding (48px–96px)
- Clean white canvas — no gray backgrounds, no color sections, depth through borders and whitespace alone

## 4. Component Stylings

### Buttons

**Primary Brand (Full-round)**
- Background: \`#0d0d0d\` (near-black)
- Text: \`#ffffff\`
- Padding: 8px 24px
- Radius: 9999px (full pill)
- Font: Inter 15px weight 500
- Shadow: \`rgba(0,0,0,0.06) 0px 1px 2px\`
- Hover: opacity 0.9
- Use: Primary CTA ("Get Started", "Start Building")

**Secondary / Ghost (Full-round)**
- Background: \`#ffffff\`
- Text: \`#0d0d0d\`
- Padding: 4.5px 12px
- Radius: 9999px (full pill)
- Border: \`1px solid rgba(0,0,0,0.08)\`
- Font: Inter 15px weight 500
- Hover: opacity 0.9
- Use: Secondary actions ("Request Demo", "View Docs")

**Transparent / Nav Button**
- Background: transparent
- Text: \`#0d0d0d\`
- Padding: 5px 6px
- Radius: 8px
- Border: none or \`1px solid rgba(0,0,0,0.05)\`
- Use: Navigation items, icon buttons

**Brand Accent Button**
- Background: \`#18E299\`
- Text: \`#0d0d0d\`
- Padding: 8px 24px
- Radius: 9999px
- Use: Special promotional CTAs

### Cards & Containers

**Standard Card**
- Background: \`#ffffff\`
- Border: \`1px solid rgba(0,0,0,0.05)\`
- Radius: 16px
- Padding: 24px
- Shadow: \`rgba(0,0,0,0.03) 0px 2px 4px\`
- Hover: subtle border darkening to \`rgba(0,0,0,0.08)\`

**Featured Card**
- Background: \`#ffffff\`
- Border: \`1px solid rgba(0,0,0,0.05)\`
- Radius: 24px
- Padding: 32px
- Inner content areas may have their own 16px radius containers

**Logo/Trust Card**
- Background: \`#fafafa\` or \`#ffffff\`
- Border: \`1px solid rgba(0,0,0,0.05)\`
- Radius: 16px
- Centered logo/icon with consistent sizing

### Inputs & Forms

**Email Input**
- Background: transparent or \`#ffffff\`
- Text: \`#0d0d0d\`
- Padding: 0px 12px (height controlled by line-height)
- Border: \`1px solid rgba(0,0,0,0.08)\`
- Radius: 9999px (full pill, matching buttons)
- Focus: \`1px solid var(--color-brand)\` + \`outline: 1px solid var(--color-brand)\`
- Placeholder: \`#888888\`

### Navigation
- Clean horizontal nav on white, sticky with backdrop blur
- Brand logotype left-aligned
- Links: Inter 14–15px weight 500, \`#0d0d0d\` text
- Hover: color shifts to brand green \`var(--color-brand)\`
- CTA: dark pill button right-aligned ("Get Started")
- Mobile: hamburger menu collapse at 768px

### Image Treatment
- Product screenshots with subtle 1px borders
- Rounded containers: 16px–24px radius
- Atmospheric gradient backgrounds behind hero images
- Cloud/sky imagery with soft green tinting

### Distinctive Components

**Atmospheric Hero**
- Full-width gradient wash: soft green-to-white cloud-like gradient
- Centered headline with tight tracking
- Subtitle in muted gray
- Dual CTA buttons (dark primary + ghost secondary)
- The gradient creates a sense of elevation and intelligence

**Trust Bar / Logo Grid**
- "Loved by your favorite companies" section
- Company logos in muted grayscale
- Grid or horizontal layout with consistent sizing
- Subtle border separation between logos

**Feature Cards with Icons**
- Icon or illustration at top
- Title at 20px weight 600
- Description at 14–16px in gray
- Consistent padding and border treatment
- Grid layout: 2–3 columns on desktop

**CTA Footer Section**
- Dark or gradient background
- Large headline: "Make documentation your winning advantage"
- Email input with pill styling
- Brand green accent on CTAs

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 4px, 5px, 6px, 7px, 8px, 10px, 12px, 16px, 24px, 32px, 48px, 64px
- Section padding: 48px–96px vertical
- Card padding: 24px–32px
- Component gaps: 8px–16px

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with generous top padding (96px+)
- Feature sections: 2–3 column CSS Grid for cards
- Full-width sections with contained content
- Consistent horizontal padding: 24px (mobile) to 32px (desktop)

### Whitespace Philosophy
- **Documentation-grade breathing room**: Every element has generous surrounding whitespace. Mintlify sells documentation, so the marketing page itself demonstrates reading comfort.
- **Sections as chapters**: Each feature section is a self-contained unit with 48px–96px vertical padding, creating clear "chapter breaks."
- **Content density is low**: Unlike developer tools that pack the page, Mintlify uses 1–2 key messages per section with supporting imagery.

### Border Radius Scale
- Small (4px): Inline code, small tags, tooltips
- Medium (8px): Nav buttons, transparent buttons, small containers
- Standard (16px): Cards, content containers, image wrappers
- Large (24px): Featured cards, hero containers, section panels
- Full Pill (9999px): Buttons, inputs, badges, pills — the signature shape

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Page background, text blocks |
| Subtle Border (Level 1) | \`1px solid rgba(0,0,0,0.05)\` | Standard card borders, dividers |
| Medium Border (Level 1b) | \`1px solid rgba(0,0,0,0.08)\` | Interactive elements, input borders |
| Ambient Shadow (Level 2) | \`rgba(0,0,0,0.03) 0px 2px 4px\` | Cards with subtle lift |
| Button Shadow (Level 2b) | \`rgba(0,0,0,0.06) 0px 1px 2px\` | Button micro-depth |
| Focus Ring (Accessibility) | \`1px solid #18E299\` outline | Focused inputs, active interactive elements |

**Shadow Philosophy**: Mintlify barely uses shadows. The depth system is almost entirely border-driven — ultra-subtle 5% opacity borders create separation without visual weight. When shadows appear, they're atmospheric whispers (\`0.03 opacity, 2px blur, 4px spread\`) that add the barest sense of lift. This restraint keeps the page feeling flat and paper-like — appropriate for a documentation company whose product is about clarity and readability.

### Decorative Depth
- Hero gradient: atmospheric green-white cloud gradient behind hero content
- No background color alternation — white on white throughout
- Depth comes from border opacity variation (5% → 8%) and whitespace

## 7. Dark Mode

### Color Inversions
- **Background**: \`#0d0d0d\` (near-black)
- **Text Primary**: \`#ededed\` (near-white)
- **Text Secondary**: \`#a0a0a0\` (muted gray)
- **Brand Green**: \`#18E299\` (unchanged — the green works on both backgrounds)
- **Border**: \`rgba(255,255,255,0.08)\` (white at 8% opacity)
- **Card Background**: \`#141414\` (slightly lighter than page)
- **Shadow**: \`rgba(0,0,0,0.4) 0px 2px 4px\` (stronger shadow for contrast)

### Key Adjustments
- Buttons invert: white background dark text becomes dark background light text
- Badge backgrounds shift to deeper tones with lighter text
- Focus ring remains brand green
- Hero gradient shifts to dark-tinted green atmospheric wash

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, stacked layout, hamburger nav |
| Tablet | 768–1024px | Two-column grids begin, expanded padding |
| Desktop | >1024px | Full layout, 3-column grids, maximum content width |

### Touch Targets
- Buttons with full-pill shape have comfortable 8px+ vertical padding
- Navigation links spaced with adequate 16px+ gaps
- Mobile menu provides full-width tap targets

### Collapsing Strategy
- Hero: 64px → 40px headline, maintains tight tracking proportionally
- Navigation: horizontal links + CTA → hamburger menu at 768px
- Feature cards: 3-column → 2-column → single column stacked
- Section spacing: 96px → 48px on mobile
- Footer: multi-column → stacked single column
- Trust bar: grid → horizontal scroll or stacked

### Image Behavior
- Product screenshots maintain aspect ratio with responsive containers
- Hero gradient simplifies on mobile
- Full-width sections maintain edge-to-edge treatment`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mintlify — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/mintlify. White-on-white
        canvas, near-black text, signature mint accent (#18E299) used
        sparingly, full-pill buttons / inputs / badges, ultra-subtle 5%
        opacity borders carrying every separation."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: #fafafa;

        --fg: #0d0d0d;
        --fg-2: #333333;
        --muted: #666666;
        --meta: #888888;

        --border: rgba(0, 0, 0, 0.05);
        --border-soft: var(--border);

        --accent: #18E299;
        --accent-on: #0d0d0d;
        --accent-hover: #0fa76e;
        --accent-active: color-mix(in oklab, var(--accent-hover), black 12%);

        --success: #16a34a;
        --warn: #c37d0d;
        --danger: #d45656;

        --font-display: "Inter", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-body: "Inter", "Inter Fallback", system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-mono: "Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 20px;
        --text-2xl: 24px;
        --text-3xl: 40px;
        --text-4xl: 64px;

        --leading-body: 1.5;
        --leading-tight: 1.15;
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
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 2px 4px rgba(0, 0, 0, 0.03);

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 32px;
        --container-gutter-tablet: 24px;
        --container-gutter-phone: 24px;
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
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
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

      /* ─── Typography ────────────────────────────────────────────
       * Three weights only — 400 (read), 500 (interact), 600
       * (announce). Display sizes use --tracking-display; smaller
       * tiers relax toward 0. Headings drop --leading-tight (1.15)
       * to ~1.30 inline at the smaller sizes per DESIGN.md §3. */
      h1, h2, h3, h4 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 600;
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 600;
        line-height: 1.30;
        letter-spacing: -0.01em;
      }
      h4 {
        font-size: var(--text-lg);
        font-weight: 500;
        line-height: 1.30;
      }
      p { margin: 0; }

      .lede {
        font-size: var(--text-lg);
        line-height: var(--leading-body);
        color: var(--muted);
      }
      .body-muted { color: var(--fg-2); }
      .body-meta  { color: var(--muted); font-size: var(--text-sm); }
      .body-sm    { font-size: var(--text-sm); }

      /* Eyebrow uses Geist Mono uppercase — DESIGN.md §3 names the
         "terminal voice" for technical labels. Tracked-out 0.65px ≈
         0.05em at 13px. */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — full-pill, the signature shape ─────────────
       * DESIGN.md §4: every CTA is \`--radius-pill\`. Primary is
       * BLACK on white (the brand's documented dominant CTA),
       * secondary is white-on-white with a subtle 8% border, ghost
       * is transparent for nav use. The "brand-accent" variant is
       * the rare promotional pill that paints the mint fill with
       * dark text on top. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 24px;
        border: none;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: 15px;
        font-weight: 500;
        line-height: 1.5;
        cursor: pointer;
        text-decoration: none;
        background: transparent;
        color: inherit;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          opacity var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
      }
      .btn-primary {
        background: var(--fg);
        color: var(--bg);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      }
      .btn-primary:hover { opacity: 0.9; }
      .btn-secondary {
        background: var(--surface);
        color: var(--fg);
        padding: 7px 24px;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
      }
      .btn-secondary:hover {
        opacity: 0.9;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.14);
      }
      .btn-accent {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-accent:hover { background: var(--accent-hover); color: var(--bg); }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-radius: var(--radius-sm);
        padding: 5px 12px;
      }
      .btn-ghost:hover { color: var(--accent-hover); }

      /* ─── Inputs — full-pill, matches button silhouette ───────── */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        padding: 10px 16px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: var(--radius-pill);
        background: var(--surface);
        color: var(--fg);
        font-family: inherit;
        font-size: var(--text-sm);
        line-height: 1.5;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { border-color: rgba(0, 0, 0, 0.16); }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
      }

      /* ─── Cards — border-defined, whisper shadow ────────────────
       * DESIGN.md §4: standard card uses 16px radius + 5% border +
       * the 0.03-alpha shadow whisper. Featured card jumps to 24px
       * radius + 32px padding. Trust card uses --surface-warm to
       * tint the logo container away from pure white. */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
        transition:
          border-color var(--motion-base) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        border-color: rgba(0, 0, 0, 0.08);
      }
      .card-featured {
        border-radius: var(--radius-lg);
        padding: var(--space-8);
      }
      .card-trust {
        background: var(--surface-warm);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-5);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 72px;
      }

      /* ─── Badges — pill, mint-tinted or muted ────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: 4px 12px;
        border-radius: var(--radius-pill);
        font-size: 13px;
        font-weight: 500;
        line-height: 1.5;
        font-family: var(--font-display);
      }
      .badge-mint {
        color: var(--accent-hover);
        background: color-mix(in oklab, var(--accent), white 78%);
      }
      .badge-muted {
        color: var(--fg-2);
        background: var(--surface-warm);
        box-shadow: 0 0 0 1px var(--border);
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), white 88%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
      /* Mono uppercase tag — DESIGN.md §3 "Mono Code / Mono Badge".
         Used for technical / API labels where the "terminal voice"
         is the right register. */
      .tag-mono {
        display: inline-flex;
        align-items: center;
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 600;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 5px 10px;
        border-radius: var(--radius-sm);
        background: var(--surface-warm);
        color: var(--fg-2);
        box-shadow: 0 0 0 1px var(--border);
      }

      /* ─── Links ────────────────────────────────────────────────
       * DESIGN.md §2: "Links match text color, relying on
       * underline/context. Hover: brand green." Default link is
       * --fg with underline; hover swaps to brand-green-deep so
       * the underline stays legible on white. */
      a {
        color: var(--fg);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
        text-decoration-color: rgba(0, 0, 0, 0.20);
        transition:
          color var(--motion-fast) var(--ease-standard),
          text-decoration-color var(--motion-fast) var(--ease-standard);
      }
      a:hover {
        color: var(--accent-hover);
        text-decoration-color: var(--accent-hover);
      }
      a:focus-visible {
        outline: none;
        border-radius: 4px;
        box-shadow: var(--focus-ring);
      }

      /* ─── Kbd ──────────────────────────────────────────────── */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--surface-warm);
        color: var(--fg-2);
        box-shadow: 0 0 0 1px var(--border);
      }

      /* ─── Distinctive: Atmospheric hero gradient ───────────────
       * DESIGN.md §1 + §4 name the "soft, cloud-like green-to-
       * white gradient wash" as the hero's signature. We layer two
       * blurred radial tints in the brand mint over the white
       * background — barely registering as a hue shift, more
       * "atmospheric intelligence" than overt colour. The wash
       * fades to var(--bg) before reaching the section edges so
       * the page stays visually white-on-white. */
      .hero {
        position: relative;
        overflow: hidden;
      }
      .hero::before {
        content: "";
        position: absolute;
        inset: -20% -10% 30% -10%;
        background:
          radial-gradient(60% 80% at 30% 20%, color-mix(in oklab, var(--accent), var(--bg) 78%) 0%, var(--bg) 70%),
          radial-gradient(50% 60% at 75% 10%, color-mix(in oklab, var(--accent), var(--bg) 86%) 0%, var(--bg) 75%);
        filter: blur(40px);
        opacity: 0.9;
        z-index: 0;
        pointer-events: none;
      }
      .hero > * { position: relative; z-index: 1; }
      .hero-eyebrow-row {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .hero h1 { max-width: 18ch; }
      .hero .lede {
        max-width: 56ch;
        margin-block-start: var(--space-5);
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-8);
        align-items: center;
        flex-wrap: wrap;
      }
      .hero-meta {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        color: var(--muted);
        font-size: var(--text-sm);
        flex-wrap: wrap;
      }

      /* ─── Trust bar — DESIGN.md §4 "Loved by your favorite
         companies". A horizontal grid of muted logo containers,
         each on the warm surface tint with the signature 5%
         border. We render text wordmarks instead of real logos
         to keep the fixture self-contained. */
      .trust {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: var(--space-3);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .trust { grid-template-columns: repeat(3, 1fr); }
      }
      @media (max-width: 639px) {
        .trust { grid-template-columns: repeat(2, 1fr); }
      }
      .trust-mark {
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 500;
        letter-spacing: -0.01em;
        color: var(--muted);
      }

      /* ─── Feature cards grid ──────────────────────────────────── */
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
      .feature-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: var(--radius-pill);
        background: color-mix(in oklab, var(--accent), white 78%);
        color: var(--accent-hover);
        margin-block-end: var(--space-2);
      }
      .feature-icon svg { width: 18px; height: 18px; }

      /* ─── Form card section ───────────────────────────────────── */
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) {
        .form-row { grid-template-columns: 1fr; }
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 440px;
        padding: var(--space-6);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised);
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        align-items: center;
        flex-wrap: wrap;
      }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>

    <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <main class="container">
      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: atmospheric mint-on-white gradient wash
           (DESIGN.md §1 hero signature), h1 at 64px Inter W600 with
           -0.02em (≈ -1.28px) tracking, .lede in --muted, dual full-
           pill CTAs (.btn-primary black + .btn-secondary white), kbd
           hint and .badge-mint status pill. The gradient layers two
           blurred radial tints in the brand green over the white
           bg so it reads as "documentation that floats above the
           noise" without overpowering the page.
      ═══════════════════════════════════════════════════════════════ -->
      <section class="hero" data-od-id="hero">
        <div class="hero-eyebrow-row">
          <span class="tag-mono">v1.0 · stable</span>
          <p class="eyebrow">Reference fixture · mintlify</p>
        </div>
        <h1 style="margin-block-start: var(--space-6)">The documentation your users will love.</h1>
        <p class="lede">
          A token block distilled from Mintlify's published design system —
          Inter with tight -0.02em display tracking, full-pill buttons and
          inputs, mint accent used sparingly, and 5%-opacity hairlines
          carrying every section break. The fixture you are reading paints
          from the same <code style="font-family: var(--font-mono); font-size: 0.95em">:root</code>
          block agents inline into every Mintlify artifact.
        </p>
        <div class="hero-actions">
          
          
          <a href="#features" class="btn btn-ghost">Skip to components</a>
        </div>
        <p class="hero-meta">
          <span class="badge badge-mint">
            <span class="badge-dot" aria-hidden="true"></span>
            56 tokens · 0 C-extensions
          </span>
          <span>Press <kbd>⌘</kbd> <kbd>K</kbd> to search the docs.</span>
        </p>

        <div class="trust" aria-label="Loved by teams that ship docs">
          <div class="card-trust"><span class="trust-mark">Anthropic</span></div>
          <div class="card-trust"><span class="trust-mark">Resend</span></div>
          <div class="card-trust"><span class="trust-mark">Cursor</span></div>
          <div class="card-trust"><span class="trust-mark">Replicate</span></div>
          <div class="card-trust"><span class="trust-mark">ElevenLabs</span></div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURES — three cards demonstrating the standard card
           treatment (16px radius, 5% border, 0.03-alpha shadow
           whisper). Each card opens with a mint-tinted icon disc —
           the rare moment the brand green is visible on a non-CTA
           surface — followed by an h3 at 20px W600 with -0.01em
           tracking and a body line in --fg-2.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features" id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 22ch">Documentation as product, not afterthought.</h2>
          <p class="body-muted" style="max-width: 56ch; margin-block-start: var(--space-4)">
            Every component below pulls from <code style="font-family: var(--font-mono); font-size: 0.95em">var(--*)</code> —
            no raw hex, no off-token type, no shadow heavier than the
            documented 0.03-alpha whisper.
          </p>
        </div>

        <div class="features-grid">
          <article class="card">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </span>
            <h3>Whisper-thin separation.</h3>
            <p class="body-muted body-sm">
              5% black hairlines (<code style="font-family: var(--font-mono); font-size: 0.95em">rgba(0,0,0,0.05)</code>)
              carry every section break and card edge. No gray section
              backgrounds, no heavy shadows — the depth system is
              border-driven, paper-like.
            </p>
            
          </article>

          <article class="card">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
              </svg>
            </span>
            <h3>The pill is the signature.</h3>
            <p class="body-muted body-sm">
              Every button, input, and badge resolves to
              <code style="font-family: var(--font-mono); font-size: 0.95em">--radius-pill</code>
              (9999px). Cards step from 16 (standard) to 24 (featured) —
              the four-tier radius scale is the silhouette grammar of
              the system.
            </p>
            
          </article>

          <article class="card">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 7l4-3 4 3 4-3 4 3M4 17l4 3 4-3 4 3 4-3M4 7v10M20 7v10" />
              </svg>
            </span>
            <h3>Inter runs tight on display.</h3>
            <p class="body-muted body-sm">
              Hero tracks at <code style="font-family: var(--font-mono); font-size: 0.95em">-0.02em</code>
              (≈ -1.28px at 64px), section heads at -0.02em, body relaxes
              to 0. Three weights only: 400 reads, 500 interacts, 600
              announces. Geist Mono is reserved for the terminal voice.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — full-pill input matching the button silhouette,
           mint focus ring (--focus-ring is 2px var(--accent)), all
           wrapped in a 24px-radius featured card to demonstrate the
           large-radius tier. The dark + ghost button pair reuses
           .btn-primary / .btn-secondary unchanged so the silhouette
           stays consistent with the hero CTAs above.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <p class="eyebrow">Form components</p>
        <h2 style="margin-block-start: var(--space-3); max-width: 28ch">Inputs inherit the same tokens.</h2>

        <div class="form-row">
          <div class="stack-4">
            <p class="body-muted" style="max-width: 48ch">
              Focus ring, edge, and placeholder colour all derive from
              <code style="font-family: var(--font-mono); font-size: 0.95em">--accent</code> and
              <code style="font-family: var(--font-mono); font-size: 0.95em">--border</code>.
              The submit button reuses
              <code style="font-family: var(--font-mono); font-size: 0.95em">.btn-primary</code>
              unchanged — black fill, white label, full-pill silhouette.
            </p>
            <p class="body-muted body-sm">
              No new token is introduced for this section. The form card
              uses the documented featured-card radius
              (<code style="font-family: var(--font-mono); font-size: 0.95em">--radius-lg</code>, 24px)
              and the same 0.03-alpha shadow whisper as everything else.
            </p>
            <p class="body-meta">
              Full reference at  ·
              spec at .
            </p>
          </div>

          <div role="group" class="uma-preview-form form">
            <div class="row-between">
              <p class="eyebrow">Get the spec</p>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Open
              </span>
            </div>
            <div class="field">
              <label for="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="you@team.dev"
                autocomplete="email"
                required
              />
              <p class="field-help">We'll send the spec PDF and nothing else.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send the spec</button>
              <button type="button" class="btn btn-secondary">Skip for now</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=mintlify_default;return module.exports}});
//# sourceMappingURL=client.mintlify.js.map