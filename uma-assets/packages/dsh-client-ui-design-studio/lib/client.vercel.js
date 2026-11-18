
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.vercel.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var vercel_default={"contract":`## 1. Visual Theme & Atmosphere

Vercel's website is the visual thesis of developer infrastructure made invisible — a design system so restrained it borders on philosophical. The page is overwhelmingly white (\`#ffffff\`) with near-black (\`#171717\`) text, creating a gallery-like emptiness where every element earns its pixel. This isn't minimalism as decoration; it's minimalism as engineering principle. The Geist design system treats the interface like a compiler treats code — every unnecessary token is stripped away until only structure remains.

The custom Geist font family is the crown jewel. Geist Sans uses aggressive negative letter-spacing (-2.4px to -2.88px at display sizes), creating headlines that feel compressed, urgent, and engineered — like code that's been minified for production. At body sizes, the tracking relaxes but the geometric precision persists. Geist Mono completes the system as the monospace companion for code, terminal output, and technical labels. Both fonts enable OpenType \`"liga"\` (ligatures) globally, adding a layer of typographic sophistication that rewards close reading.

What distinguishes Vercel from other monochrome design systems is its shadow-as-border philosophy. Instead of traditional CSS borders, Vercel uses \`box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)\` — a zero-offset, zero-blur, 1px-spread shadow that creates a border-like line without the box model implications. This technique allows borders to exist in the shadow layer, enabling smoother transitions, rounded corners without clipping, and a subtler visual weight than traditional borders. The entire depth system is built on layered, multi-value shadow stacks where each layer serves a specific purpose: one for the border, one for soft elevation, one for ambient depth.

**Key Characteristics:**
- Geist Sans with extreme negative letter-spacing (-2.4px to -2.88px at display) — text as compressed infrastructure
- Geist Mono for code and technical labels with OpenType \`"liga"\` globally
- Shadow-as-border technique: \`box-shadow 0px 0px 0px 1px\` replaces traditional borders throughout
- Multi-layer shadow stacks for nuanced depth (border + elevation + ambient in single declarations)
- Near-pure white canvas with \`#171717\` text — not quite black, creating micro-contrast softness
- Workflow-specific accent colors: Ship Red (\`#ff5b4f\`), Preview Pink (\`#de1d8d\`), Develop Blue (\`#0a72ef\`)
- Focus ring system using \`hsla(212, 100%, 48%, 1)\` — a saturated blue for accessibility
- Pill badges (9999px) with tinted backgrounds for status indicators

## 4. Component Stylings

### Buttons

**Primary White (Shadow-bordered)**
- Background: \`#ffffff\`
- Text: \`#171717\`
- Padding: 0px 6px (minimal — content-driven width)
- Radius: 6px (subtly rounded)
- Shadow: \`rgb(235, 235, 235) 0px 0px 0px 1px\` (ring-border)
- Hover: background shifts to \`var(--ds-gray-1000)\` (dark)
- Focus: \`2px solid var(--ds-focus-color)\` outline + \`var(--ds-focus-ring)\` shadow
- Use: Standard secondary button

**Primary Dark (Inferred from Geist system)**
- Background: \`#171717\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 6px
- Use: Primary CTA ("Start Deploying", "Get Started")

**Pill Button / Badge**
- Background: \`#ebf5ff\` (tinted blue)
- Text: \`#0068d6\`
- Padding: 0px 10px
- Radius: 9999px (full pill)
- Font: 12px weight 500
- Use: Status badges, tags, feature labels

**Large Pill (Navigation)**
- Background: transparent or \`#171717\`
- Radius: 64px–100px
- Use: Tab navigation, section selectors

### Cards & Containers
- Background: \`#ffffff\`
- Border: via shadow — \`rgba(0, 0, 0, 0.08) 0px 0px 0px 1px\`
- Radius: 8px (standard), 12px (featured/image cards)
- Shadow stack: \`rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, #fafafa 0px 0px 0px 1px\`
- Image cards: \`1px solid #ebebeb\` with 12px top radius
- Hover: subtle shadow intensification

### Inputs & Forms
- Radio: standard styling with focus \`var(--ds-gray-200)\` background
- Focus shadow: \`1px 0 0 0 var(--ds-gray-alpha-600)\`
- Focus outline: \`2px solid var(--ds-focus-color)\` — consistent blue focus ring
- Border: via shadow technique, not traditional border

### Navigation
- Clean horizontal nav on white, sticky
- Vercel logotype left-aligned, 262x52px
- Links: Geist 14px weight 500, \`#171717\` text
- Active: weight 600 or underline
- CTA: dark pill buttons ("Start Deploying", "Contact Sales")
- Mobile: hamburger menu collapse
- Product dropdowns with multi-level menus

### Image Treatment
- Product screenshots with \`1px solid #ebebeb\` border
- Top-rounded images: \`12px 12px 0px 0px\` radius
- Dashboard/code preview screenshots dominate feature sections
- Soft gradient backgrounds behind hero images (pastel multi-color)

### Distinctive Components

**Workflow Pipeline**
- Three-step horizontal pipeline: Develop → Preview → Ship
- Each step has its own accent color: Blue → Pink → Red
- Connected with lines/arrows
- The visual metaphor for Vercel's core value proposition

**Trust Bar / Logo Grid**
- Company logos (Perplexity, ChatGPT, Cursor, etc.) in grayscale
- Horizontal scroll or grid layout
- Subtle \`#ebebeb\` border separation

**Metric Cards**
- Large number display (e.g., "10x faster")
- Geist 48px weight 600 for the metric
- Description below in gray body text
- Shadow-bordered card container

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 14px, 16px, 32px, 36px, 40px
- Notable gap: jumps from 16px to 32px — no 20px or 24px in primary scale

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with generous top padding
- Feature sections: 2–3 column grids for cards
- Full-width dividers using \`border-bottom: 1px solid #171717\`
- Code/dashboard screenshots as full-width or contained with border

### Whitespace Philosophy
- **Gallery emptiness**: Massive vertical padding between sections (80px–120px+). The white space IS the design — it communicates that Vercel has nothing to prove and nothing to hide.
- **Compressed text, expanded space**: The aggressive negative letter-spacing on headlines is counterbalanced by generous surrounding whitespace. The text is dense; the space around it is vast.
- **Section rhythm**: White sections alternate with white sections — there's no color variation between sections. Separation comes from borders (shadow-borders) and spacing alone.

### Border Radius Scale
- Micro (2px): Inline code snippets, small spans
- Subtle (4px): Small containers
- Standard (6px): Buttons, links, functional elements
- Comfortable (8px): Cards, list items
- Image (12px): Featured cards, image containers (top-rounded)
- Large (64px): Tab navigation pills
- XL (100px): Large navigation links
- Full Pill (9999px): Badges, status pills, tags
- Circle (50%): Menu toggle, avatar containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Ring (Level 1) | \`rgba(0,0,0,0.08) 0px 0px 0px 1px\` | Shadow-as-border for most elements |
| Light Ring (Level 1b) | \`rgb(235,235,235) 0px 0px 0px 1px\` | Lighter ring for tabs, images |
| Subtle Card (Level 2) | Ring + \`rgba(0,0,0,0.04) 0px 2px 2px\` | Standard cards with minimal lift |
| Full Card (Level 3) | Ring + Subtle + \`rgba(0,0,0,0.04) 0px 8px 8px -8px\` + inner \`#fafafa\` ring | Featured cards, highlighted panels |
| Focus (Accessibility) | \`2px solid hsla(212, 100%, 48%, 1)\` outline | Keyboard focus on all interactive elements |

**Shadow Philosophy**: Vercel has arguably the most sophisticated shadow system in modern web design. Rather than using shadows for elevation in the traditional Material Design sense, Vercel uses multi-value shadow stacks where each layer has a distinct architectural purpose: one creates the "border" (0px spread, 1px), another adds ambient softness (2px blur), another handles depth at distance (8px blur with negative spread), and an inner ring (\`#fafafa\`) creates the subtle highlight that makes the card "glow" from within. This layered approach means cards feel built, not floating.

### Decorative Depth
- Hero gradient: soft, pastel multi-color gradient wash behind hero content (barely visible, atmospheric)
- Section borders: \`1px solid #171717\` (full dark line) between major sections
- No background color variation — depth comes entirely from shadow layering and border contrast

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <400px | Tight single column, minimal padding |
| Mobile | 400–600px | Standard mobile, stacked layout |
| Tablet Small | 600–768px | 2-column grids begin |
| Tablet | 768–1024px | Full card grids, expanded padding |
| Desktop Small | 1024–1200px | Standard desktop layout |
| Desktop | 1200–1400px | Full layout, maximum content width |
| Large Desktop | >1400px | Centered, generous margins |

### Touch Targets
- Buttons use comfortable padding (8px–16px vertical)
- Navigation links at 14px with adequate spacing
- Pill badges have 10px horizontal padding for tap targets
- Mobile menu toggle uses 50% radius circular button

### Collapsing Strategy
- Hero: display 48px → scales down, maintains negative tracking proportionally
- Navigation: horizontal links + CTAs → hamburger menu
- Feature cards: 3-column → 2-column → single column stacked
- Code screenshots: maintain aspect ratio, may horizontally scroll
- Trust bar logos: grid → horizontal scroll
- Footer: multi-column → stacked single column
- Section spacing: 80px+ → 48px on mobile

### Image Behavior
- Dashboard screenshots maintain border treatment at all sizes
- Hero gradient softens/simplifies on mobile
- Product screenshots use responsive images with consistent border radius
- Full-width sections maintain edge-to-edge treatment`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Vercel — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/vercel. Every visible
        value comes from tokens.css; the page itself follows Vercel's
        rules — near-white canvas, near-black text, blue reserved for
        the chromatic moments, shadow-as-border instead of CSS border,
        Geist with tight negative tracking on display."
    />

    <style>
      /* :root paste — sourced verbatim from design-systems/vercel/tokens.css. */
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-warm: var(--surface);

        --fg: #171717;
        --fg-2: #4d4d4d;
        --muted: #666666;
        --meta: #808080;

        --border: rgba(0, 0, 0, 0.08);
        --border-soft: rgba(0, 0, 0, 0.04);

        --accent: #0070f3;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Geist", "Geist Sans", -apple-system, "Segoe UI", Arial, sans-serif;
        --font-body: "Geist", "Geist Sans", -apple-system, "Segoe UI", Arial, sans-serif;
        --font-mono: "Geist Mono", ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 40px;
        --text-4xl: 48px;

        --leading-body: 1.5;
        --leading-tight: 1.1;
        --tracking-display: -0.05em;

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

        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 0 0 1px rgba(0, 0, 0, 0.08),
          0 2px 2px rgba(0, 0, 0, 0.04),
          0 8px 8px -8px rgba(0, 0, 0, 0.04),
          0 0 0 1px #fafafa;

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset (minimal) ─────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        font-weight: 400;
        /* OpenType ligatures globally — DESIGN.md §3: "Every Geist
           text element enables \`liga\`. Ligatures aren't decorative —
           they're structural." */
        font-feature-settings: "liga" 1;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section {
        padding-block: var(--section-y-desktop);
      }
      section + section {
        /* DESIGN.md §5: full-dark divider between major sections —
           a "1px solid #171717" line. Modeled as a single-pixel top
           border via the foreground token so the brand voice
           (engineered hairline, no fade) survives token rebinding. */
        border-top: 1px solid var(--fg);
      }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography ────────────────────────────────────────────
       * The Geist principle: hierarchy comes from size + tracking,
       * not weight. Three weights only — 400 (read), 500 (interact),
       * 600 (announce). Display sizes use the negative em tracking
       * from \`--tracking-display\`; smaller scales relax toward 0. */
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
        /* 40px Section Heading: line-height 1.20 per DESIGN.md §Typography.
           Overrides the shared 1.10 (--leading-tight) set on h1/h2/h3 above. */
        line-height: 1.20;
        letter-spacing: var(--tracking-display);
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 600;
        /* 24px Card Title: line-height 1.33 per DESIGN.md §Typography.
           Overrides the shared 1.10 (--leading-tight) set on h1/h2/h3 above. */
        line-height: 1.33;
        /* Card title tracking from DESIGN.md §3: -0.96px at 24px ≈ -0.04em */
        letter-spacing: -0.04em;
      }
      h4 {
        font-size: var(--text-lg);
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      p { margin: 0; }

      .lede {
        font-size: var(--text-lg);
        line-height: 1.6;
        color: var(--fg-2);
      }
      .body-muted { color: var(--fg-2); }
      .body-meta  { color: var(--muted); font-size: var(--text-sm); }
      .body-sm    { font-size: var(--text-sm); }

      /* Eyebrow uses Geist Mono uppercase — DESIGN.md §3: "Geist
         Mono in uppercase with tnum or liga serves as the developer
         console voice — compact technical labels that connect the
         marketing site to the product." */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────
       * Vercel's primary CTA is BLACK, not the accent color — the
       * brand voice is monochrome-with-blue-restraint, so the
       * primary button uses \`--fg\` as background and the accent
       * stays reserved for links and focus. Secondary buttons use
       * the shadow-as-border technique (\`box-shadow\` edge) instead
       * of a CSS border so the rectangle aligns with the fill at
       * any radius. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border: none;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1.43;
        cursor: pointer;
        text-decoration: none;
        background: transparent;
        color: inherit;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
      }
      .btn-primary {
        background: var(--fg);
        color: var(--bg);
      }
      .btn-primary:hover {
        background: color-mix(in oklab, var(--fg), white 14%);
      }
      .btn-primary:focus-visible {
        /* Layered: keep the dark fill, lay the accent ring outside. */
        box-shadow: var(--focus-ring);
      }
      .btn-secondary {
        background: var(--surface);
        color: var(--fg);
        box-shadow: 0 0 0 1px var(--border);
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, var(--bg), var(--fg) 2%);
        box-shadow: 0 0 0 1px color-mix(in oklab, var(--fg), transparent 84%);
      }
      .btn-ghost {
        background: transparent;
        color: var(--fg-2);
        padding-inline: var(--space-3);
      }
      .btn-ghost:hover {
        color: var(--fg);
        background: color-mix(in oklab, var(--bg), var(--fg) 2%);
      }

      /* ─── Inputs ────────────────────────────────────────────────
       * Border via shadow technique — DESIGN.md §4: "Border: via
       * shadow technique, not traditional border." On focus the
       * shadow ring intensifies into the 2px accent ring. */
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
        padding: 8px 12px;
        border: none;
        border-radius: var(--radius-sm);
        background: var(--surface);
        color: var(--fg);
        font-family: inherit;
        font-size: var(--text-sm);
        line-height: 1.43;
        outline: none;
        box-shadow: 0 0 0 1px var(--border);
        transition: box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { box-shadow: 0 0 0 1px color-mix(in oklab, var(--fg), transparent 84%); }
      .field input:focus-visible {
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
      }

      /* ─── Cards ─────────────────────────────────────────────────
       * The multi-layer shadow card — DESIGN.md §6 Level 3 — uses
       * \`--elev-raised\` directly. No \`border:\` rule; the shadow
       * stack carries every edge AND the inner \`#fafafa\` glow.
       * Image cards (\`.card-image\`) use a real 1px border because
       * the top corners clip the image and need a clean edge. */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        /* Layered: keep the elev-raised stack, lift the ring tier. */
        box-shadow:
          0 0 0 1px color-mix(in oklab, var(--fg), transparent 84%),
          0 4px 12px color-mix(in oklab, var(--fg), transparent 94%),
          0 12px 24px -12px color-mix(in oklab, var(--fg), transparent 94%),
          0 0 0 1px color-mix(in oklab, var(--bg), var(--fg) 2%);
      }
      .card-image {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        overflow: hidden;
      }

      /* ─── Badges ────────────────────────────────────────────────
       * Pill badges — DESIGN.md §4: "Background #ebf5ff, text
       * #0068d6, 9999px radius". We tint the accent over white at
       * ~92% transparency to land near #ebf5ff, and use a slightly
       * darker accent for the label so it reads against the tint. */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        padding: 2px 10px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.5;
        font-family: var(--font-display);
      }
      .badge-accent {
        color: color-mix(in oklab, var(--accent), black 14%);
        background: color-mix(in oklab, var(--accent), white 92%);
      }
      .badge-muted {
        color: var(--fg-2);
        background: color-mix(in oklab, var(--bg), var(--fg) 2%);
        box-shadow: 0 0 0 1px var(--border);
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), white 92%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────────
       * Underlined by default — DESIGN.md §2: "Primary link color
       * with underline decoration." Underline offset relaxes the
       * line away from the descenders so it doesn't crowd Geist's
       * compressed forms. */
      a {
        color: var(--accent);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }
      a:hover { text-decoration-thickness: 2px; }
      a:focus-visible {
        outline: none;
        border-radius: 2px;
        box-shadow: var(--focus-ring);
      }

      /* ─── Kbd ───────────────────────────────────────────────────
       * Geist Mono, hairline shadow-border edge. Vercel uses kbd
       * forms in docs and product tooltips with the same restraint. */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--surface);
        color: var(--fg-2);
        box-shadow: 0 0 0 1px var(--border);
      }

      /* ─── Distinctive: Workflow pipeline ────────────────────────
       * Vercel's signature three-step pipeline (Develop → Preview
       * → Ship). DESIGN.md §4 documents each step with a brand-
       * specific accent color (Develop Blue, Preview Pink, Ship
       * Red); those colors are NOT part of the shared token schema
       * and would each need to be promoted to a C-extension before
       * we could express them here. This fixture renders the
       * pipeline LAYOUT — three shadow-bordered cards, separated by
       * mono arrow glyphs, with mono uppercase eyebrows — and
       * leaves the chromatic stage labels to brand-specific
       * extensions that ship later. The numbered tag in each
       * eyebrow still communicates ordering. */
      .pipeline {
        display: grid;
        grid-template-columns: 1fr auto 1fr auto 1fr;
        align-items: stretch;
        gap: var(--space-4);
        margin-block-start: var(--space-8);
      }
      .pipeline-step {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-5) var(--space-5) var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        box-shadow: var(--elev-raised);
      }
      .pipeline-step .eyebrow {
        letter-spacing: 0.1em;
        color: var(--accent);
      }
      .pipeline-step .step-title {
        font-family: var(--font-display);
        font-size: var(--text-xl);
        font-weight: 600;
        line-height: 1.33;
        letter-spacing: -0.04em;
        color: var(--fg);
      }
      .pipeline-step .step-body {
        font-size: var(--text-sm);
        color: var(--fg-2);
        line-height: 1.5;
      }
      .pipeline-arrow {
        align-self: center;
        font-family: var(--font-mono);
        font-size: var(--text-base);
        color: var(--meta);
        line-height: 1;
      }
      @media (max-width: 1023px) {
        .pipeline {
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }
        .pipeline-arrow { display: none; }
      }

      /* ─── Distinctive: Metric row ───────────────────────────────
       * DESIGN.md §4 "Metric Cards": large display number at
       * Geist W600, description below in --fg-2. Tabular-nums so
       * columns of metrics align across the row. The metric IS the
       * marker — no eyebrow, no icon, no decoration. */
      .metric-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-8);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 639px) {
        .metric-row { grid-template-columns: 1fr; gap: var(--space-6); }
      }
      .metric {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .metric-value {
        font-family: var(--font-display);
        font-size: var(--text-4xl);
        font-weight: 600;
        line-height: 1;
        letter-spacing: var(--tracking-display);
        color: var(--fg);
        font-variant-numeric: tabular-nums;
      }
      .metric-label {
        font-size: var(--text-base);
        color: var(--fg-2);
      }

      /* ─── Section-specific layout ─────────────────────────────── */
      .hero {
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      /* Atmospheric hero gradient — DESIGN.md §1: "Conic gradients
         are a Vercel signature". A monochromatic conic of accent
         tints layered behind the headline at low opacity reads as
         an atmospheric wash rather than a decoration. We stay
         token-clean by mixing \`var(--accent)\` over \`var(--bg)\` at
         five intensities; agents extending the brand can swap in
         workflow C-extensions once those promote into the schema. */
      .hero::before {
        content: "";
        position: absolute;
        inset: -40% -10% auto -10%;
        height: 70%;
        background: conic-gradient(
          from 220deg at 50% 50%,
          color-mix(in oklab, var(--accent), var(--bg) 30%) 0deg,
          color-mix(in oklab, var(--accent), var(--bg) 60%) 90deg,
          color-mix(in oklab, var(--accent), var(--bg) 85%) 180deg,
          var(--bg) 270deg,
          color-mix(in oklab, var(--accent), var(--bg) 30%) 360deg
        );
        filter: blur(120px);
        opacity: 0.18;
        z-index: 0;
        pointer-events: none;
      }
      .hero > * { position: relative; z-index: 1; }
      .hero .eyebrow { margin-block-end: var(--space-4); }
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
        gap: var(--space-2);
        margin-block-start: var(--space-6);
        color: var(--muted);
        font-size: var(--text-sm);
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
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        align-items: center;
      }

      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: conic-gradient atmospheric wash (the
           Vercel signature on hero), h1 at 48px Geist W600 with
           -0.05em tracking, .lede in --fg-2, .btn-primary (black-on-
           white), .btn-secondary (shadow-as-border edge), .badge-
           muted (status pill), kbd (hairline shadow). Single-column
           layout — Vercel heroes don't asymmetric-split; the page IS
           the column.
      ═══════════════════════════════════════════════════════════════ -->
      <section class="hero" data-od-id="hero">
        <p class="eyebrow">Reference fixture · Vercel</p>
        <h1>Build, preview, and ship without rebuilding the platform underneath.</h1>
        <p class="lede">
          A token block distilled from Vercel's published design
          system — Geist Sans with -0.05em display tracking, shadow-
          as-border throughout, blue reserved for the chromatic
          moments. The fixture you are reading paints from the same
          <code style="font-family: var(--font-mono); font-size: 0.95em">:root</code>
          block agents inline into every Vercel artifact.
        </p>
        <div class="hero-actions">
          
          
          <a href="#pipeline" class="btn btn-ghost">See the pipeline</a>
        </div>
        <p class="hero-meta">
          <span class="badge badge-muted">
            <span class="badge-dot" aria-hidden="true" style="color: var(--success)"></span>
            v0.1 · stable
          </span>
          <span>Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens.</span>
        </p>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           PIPELINE + METRICS — Vercel's distinctive three-step
           workflow (Develop → Preview → Ship) rendered as token-
           pure cards with shadow-as-border arrows in Geist Mono.
           Workflow accents (Develop Blue, Preview Pink, Ship Red)
           are deliberately deferred — they would each become C-
           extensions in this brand's tokens.css, and the schema
           rule forbids inventing C-extensions inside the fixture.
           The metric row below uses --text-4xl + --tracking-display
           to demonstrate Geist's compression at the display tier.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="pipeline" id="pipeline">
        <p class="eyebrow">The Vercel workflow</p>
        <h2 style="max-width: 22ch; margin-block-start: var(--space-3)">
          Three steps, one platform.
        </h2>
        <p class="body-muted" style="margin-block-start: var(--space-4); max-width: 56ch">
          DESIGN.md gives each stage its own workflow accent
          (Develop Blue, Preview Pink, Ship Red). Those colors are
          deliberately deferred here — they are pipeline labels, not
          brand accents, and would each promote in as a C-extension
          rather than ride on the shared accent slot.
        </p>

        <div class="pipeline">
          <article class="pipeline-step">
            <p class="eyebrow">01 · Develop</p>
            <p class="step-title">Write the code.</p>
            <p class="step-body">
              Local dev with hot-reload that mirrors the production
              runtime. No surprises between localhost and the deploy.
            </p>
          </article>
          <div class="pipeline-arrow" aria-hidden="true">&rarr;</div>
          <article class="pipeline-step">
            <p class="eyebrow">02 · Preview</p>
            <p class="step-title">Share the branch.</p>
            <p class="step-body">
              Every push gets a preview URL. Stakeholders review
              against the same runtime that will serve production.
            </p>
          </article>
          <div class="pipeline-arrow" aria-hidden="true">&rarr;</div>
          <article class="pipeline-step">
            <p class="eyebrow">03 · Ship</p>
            <p class="step-title">Promote, atomically.</p>
            <p class="step-body">
              One click promotes the previewed build. Rollback is the
              same one click in reverse.
            </p>
          </article>
        </div>

        <div class="metric-row">
          <div class="metric">
            <div class="metric-value">10×</div>
            <div class="metric-label">faster cold starts at the edge</div>
          </div>
          <div class="metric">
            <div class="metric-value">≤2</div>
            <div class="metric-label">accent uses per screen (lint enforced)</div>
          </div>
          <div class="metric">
            <div class="metric-value">56</div>
            <div class="metric-label">tokens declared in this :root</div>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURE CARDS — exercises: .card (multi-layer Vercel
           shadow stack including the inner #fafafa glow), h3 with
           -0.04em tracking, .body-muted, link, .features-grid.
           Three cards per row at desktop, collapses on mobile.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 28ch">
            Every component below pulls from <code style="font-family: var(--font-mono); font-size: 0.92em">var(--*)</code> — no raw hex, no off-token type.
          </h2>
        </div>

        <div class="features-grid">
          <article class="card">
            <span class="badge badge-accent">Surface</span>
            <h3>Achromatic canvas, one accent.</h3>
            <p class="body-muted body-sm">
              Pure white for the page, pure white for cards, no warm
              tier. The whole system stays achromatic until the
              accent moment — links, focus rings, badge tints.
            </p>
            
          </article>

          <article class="card">
            <span class="badge badge-accent">Shadows</span>
            <h3>Edges live in the shadow layer.</h3>
            <p class="body-muted body-sm">
              <code style="font-family: var(--font-mono); font-size: 0.95em">box-shadow: 0 0 0 1px rgba(0,0,0,.08)</code>
              replaces traditional borders throughout. Cards layer
              four shadows — ring, close, far, and inner glow — into
              a single elevation.
            </p>
            
          </article>

          <article class="card">
            <span class="badge badge-accent">Type</span>
            <h3>Geist runs tight.</h3>
            <p class="body-muted body-sm">
              Display tracking is <code style="font-family: var(--font-mono); font-size: 0.95em">-0.05em</code>
              — the most aggressive negative tracking of any major
              design system. Three weights only: 400 reads, 500
              interacts, 600 announces.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — exercises: .field with shadow-border inputs,
           focus-visible swap to the 2px accent ring, .btn-primary
           and .btn-secondary reuse. Form sits inside its own
           multi-layer-shadow card so the input edges read as
           recessed beneath the form surface.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <p class="eyebrow">Form components</p>
        <h2 style="margin-block-start: var(--space-3); max-width: 28ch">
          Inputs inherit the same tokens.
        </h2>

        <div class="form-row">
          <div class="stack-4">
            <p class="body-muted" style="max-width: 48ch">
              Focus rings, edges, placeholder color — all derive from
              <code style="font-family: var(--font-mono); font-size: 0.95em">--accent</code>
              and <code style="font-family: var(--font-mono); font-size: 0.95em">--border</code>.
              The submit button reuses
              <code style="font-family: var(--font-mono); font-size: 0.95em">.btn-primary</code>
              unchanged — black fill, white label, 6px radius.
            </p>
            <p class="body-muted body-sm">
              No new token is introduced for this section. The form
              card uses
              <code style="font-family: var(--font-mono); font-size: 0.95em">--elev-raised</code>
              directly so the input shadow-borders read as recessed
              beneath the form's outer ring.
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
              <p class="field-help">
                We'll send the spec PDF and nothing else.
              </p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Send the spec
              </button>
              <button type="button" class="btn btn-secondary">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=vercel_default;return module.exports}});
//# sourceMappingURL=client.vercel.js.map