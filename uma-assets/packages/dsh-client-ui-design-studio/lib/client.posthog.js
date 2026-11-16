
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.posthog.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var posthog_default={"contract":`## 1. Visual Theme & Atmosphere

PostHog's website feels like a startup's internal wiki that escaped into the wild — warm, irreverent, and deliberately anti-corporate. The background isn't the expected crisp white or dark void of developer tools; it's a warm, sage-tinted cream (\`#fdfdf8\`) that gives every surface a handmade, paper-like quality. Colors lean into earthy olive greens and muted sage rather than the conventional blues and purples of the SaaS world. It's as if someone designed a developer analytics platform inside a cozy garden shed.

The personality is the star: hand-drawn hedgehog illustrations, quirky action figures, and playful imagery replace the stock photography and abstract gradients typical of B2B SaaS. IBM Plex Sans Variable serves as the typographic foundation — a font with genuine technical credibility (created by IBM, widely used in developer contexts) deployed here with bold weights (700, 800) on headings and generous line-heights on body text. The typography says "we're serious engineers" while everything around it says "but we don't take ourselves too seriously."

The interaction design carries the same spirit: hover states flash PostHog Orange (\`#F54E00\`) text — a hidden brand color that doesn't appear at rest but surprises on interaction. Dark near-black buttons (\`#1e1f23\`) use opacity reduction on hover rather than color shifts, and active states scale slightly. The border system uses sage-tinted grays (\`#bfc1b7\`) that harmonize with the olive text palette. Built on Tailwind CSS with Radix UI and shadcn/ui primitives, the technical foundation is modern and component-driven, but the visual output is stubbornly unique.

**Key Characteristics:**
- Warm sage/olive color palette instead of conventional blues — earthy and approachable
- IBM Plex Sans Variable font at bold weights (700/800) for headings with generous 1.50+ line-heights
- Hidden brand orange (\`#F54E00\`) that only appears on hover interactions — a delightful surprise
- Hand-drawn hedgehog illustrations and playful imagery — deliberately anti-corporate
- Sage-tinted borders (\`#bfc1b7\`) and backgrounds (\`#eeefe9\`) creating a unified warm-green system
- Dark near-black CTAs (\`#1e1f23\`) with opacity-based hover states
- Content-heavy editorial layout — the site reads like a magazine, not a typical landing page
- Tailwind CSS + Radix UI + shadcn/ui component architecture

## 4. Component Stylings

### Buttons
- **Dark Primary**: \`#1e1f23\` background, white text, 6px radius, \`10px 12px\` padding. Hover: opacity 0.7 with Amber Gold text. Active: opacity 0.8 with slight scale transform. The main CTA — dark and confident
- **Sage Light**: \`#e5e7e0\` background, Olive Ink (\`#4d4f46\`) text, 4px radius, \`4px\` padding. Hover: \`#f4f4f4\` bg with PostHog Orange text. Compact utility button
- **Warm Tan Featured**: \`#d4c9b8\` background, black text, no visible radius. Hover: same orange text flash. Featured/premium actions
- **Input-style**: \`#eeefe9\` background, Sage Placeholder (\`#9ea096\`) text, 4px radius, 1px \`#b6b7af\` border. Looks like a search/filter control
- **Near-white Ghost**: \`#fdfdf8\` background, Olive Ink text, 4px radius, transparent 1px border. Minimal presence
- **Hover pattern**: All buttons flash PostHog Orange (\`#F54E00\`) or Amber Gold (\`#F7A501\`) text on hover — the brand's signature interaction surprise

### Cards & Containers
- **Bordered Card**: Warm Parchment (\`#fdfdf8\`) or white background, 1px \`#bfc1b7\` border, 4px–6px radius — clean and minimal
- **Sage Surface Card**: \`#eeefe9\` background for secondary content containers
- **Shadow Card**: \`0px 25px 50px -12px rgba(0, 0, 0, 0.25)\` — a single deep shadow for elevated content (modals, dropdowns)
- **Hover**: Orange text flash on interactive cards — consistent with button behavior

### Inputs & Forms
- **Default**: \`#eeefe9\` background, \`#9ea096\` placeholder text, 1px \`#b6b7af\` border, 4px radius, \`2px 0px 2px 8px\` padding
- **Focus**: \`#3b82f6\` ring at 50% opacity (Tailwind blue focus ring)
- **Text color**: \`#374151\` for input values — darker than primary text for readability
- **Border variations**: Multiple border patterns — some inputs use compound borders (top, left, bottom-only)

### Navigation
- **Top nav**: Warm background, IBM Plex Sans at 15px weight 600
- **Dropdown menus**: Rich mega-menu structure with product categories
- **Link color**: Deep Olive (\`#23251d\`) for nav links, underline on hover
- **CTA**: Dark Primary button (#1e1f23) in the nav — "Get started - free"
- **Mobile**: Collapses to hamburger with simplified menu

### Image Treatment
- **Hand-drawn illustrations**: Hedgehog mascot and quirky illustrations — the signature visual element
- **Product screenshots**: UI screenshots embedded in device frames or clean containers
- **Action figures**: Playful product photography of hedgehog figurines — anti-corporate
- **Trust logos**: Enterprise logos (Airbus, GOV.UK) displayed in a muted trust bar
- **Aspect ratios**: Mixed — illustrations are irregular, screenshots are 16:9 or widescreen

### AI Chat Widget
- Floating PostHog AI assistant with speech bubble — an interactive product demo embedded in the marketing site

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 2px, 4px, 6px, 8px, 10px, 12px, 16px, 18px, 24px, 32px, 34px
- **Section padding**: 32px–48px vertical between sections (compact for a content-heavy site)
- **Card padding**: 4px–12px internal (notably compact)
- **Component gaps**: 4px–8px between related elements

### Grid & Container
- **Max width**: 1536px (largest breakpoint), with content containers likely 1200px–1280px
- **Column patterns**: Varied — single column for text content, 2-3 column grids for feature cards, asymmetric layouts for product demos
- **Breakpoints**: 13 defined — 1px, 425px, 482px, 640px, 768px, 767px, 800px, 900px, 1024px, 1076px, 1160px, 1280px, 1536px

### Whitespace Philosophy
- **Content-dense by design**: PostHog's site is information-rich — whitespace is measured, not lavish
- **Editorial pacing**: Content sections flow like a magazine with varied layouts keeping the eye moving
- **Illustrations as breathing room**: Hand-drawn hedgehog art breaks up dense content sections naturally

### Border Radius Scale
- **2px**: Small inline elements, tags (\`span\`)
- **4px**: Primary UI components — buttons, inputs, dropdowns, menu items (\`button\`, \`div\`, \`combobox\`)
- **6px**: Secondary containers — larger buttons, list items, card variants (\`button\`, \`div\`, \`li\`)
- **9999px**: Pill shape — badges, status indicators, rounded tags (\`span\`, \`div\`)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Level 0 (Flat) | No shadow, warm parchment background | Page canvas, most surfaces |
| Level 1 (Border) | \`1px solid #bfc1b7\` (Sage Border) | Card containment, input borders, section dividers |
| Level 2 (Compound Border) | Multiple 1px borders on different sides | Input groupings, toolbar elements |
| Level 3 (Deep Shadow) | \`0px 25px 50px -12px rgba(0, 0, 0, 0.25)\` | Modals, floating elements, mega-menu dropdowns |

### Shadow Philosophy
PostHog's elevation system is remarkably minimal — only one shadow definition exists in the entire system. Depth is communicated through:
- **Border containment**: Sage-tinted borders (\`#bfc1b7\`) at 1px create gentle warm separation
- **Surface color shifts**: Moving from \`#fdfdf8\` to \`#eeefe9\` to \`#e5e7e0\` creates layered depth without shadows
- **The single shadow**: The one defined shadow (\`0 25px 50px -12px\`) is reserved for floating elements — modals, dropdowns, popovers. It's a deep, dramatic shadow that creates clear separation when needed

### Decorative Depth
- **Illustration layering**: Hand-drawn hedgehog art creates visual depth naturally
- **No gradients or glow**: The flat, warm surface system relies entirely on border and surface-color differentiation
- **No glassmorphism**: Fully opaque surfaces throughout

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <425px | Single column, compact padding, stacked cards |
| Mobile | 425px–640px | Slight layout adjustments, larger touch targets |
| Tablet | 640px–768px | 2-column grids begin, nav partially visible |
| Tablet Large | 768px–1024px | Multi-column layouts, expanded navigation |
| Desktop | 1024px–1280px | Full layout, 3-column feature grids, expanded mega-menu |
| Large Desktop | 1280px–1536px | Max-width container, generous margins |
| Extra Large | >1536px | Centered container at max-width |

### Touch Targets
- Buttons: 4px–6px radius with \`4px–12px\` padding — compact but usable
- Nav links: 15px text at weight 600 with adequate padding
- Mobile: Hamburger menu with simplified navigation
- Inputs: Generous vertical padding for thumb-friendly forms

### Collapsing Strategy
- **Navigation**: Full mega-menu with dropdowns → hamburger menu on mobile
- **Feature grids**: 3-column → 2-column → single column stacked
- **Typography**: Display sizes reduce across breakpoints (30px → smaller)
- **Illustrations**: Scale within containers, some may hide on mobile for space
- **Section spacing**: Reduces proportionally while maintaining readability

### Image Behavior
- Illustrations scale responsively within containers
- Product screenshots maintain aspect ratios
- Trust logos reflow into multi-row grids on mobile
- AI chat widget may reposition or simplify on small screens`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PostHog — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/posthog. Every visible
        value comes from tokens.css; the page itself honors PostHog's
        rules — warm parchment surfaces, olive-tinted text, IBM Plex
        Sans bold headings, sage-bordered cards with no shadow, and the
        signature hover orange (#F54E00) that flashes on interaction."
    />

    <style>
      /* :root paste — sourced verbatim from design-systems/posthog/tokens.css.
         Comments stripped per the design-system token-fixture sync contract. */
      :root {
        --bg: #fdfdf8;
        --surface: #eeefe9;
        --surface-warm: #e5e7e0;

        --fg: #4d4f46;
        --fg-2: #23251d;
        --muted: #65675e;
        --meta: #9ea096;

        --border: #bfc1b7;
        --border-soft: color-mix(in oklab, var(--border), var(--bg) 50%);

        --accent: #F54E00;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #F7A501;
        --danger: #dc2626;

        --font-display: "IBM Plex Sans Variable", "IBM Plex Sans", -apple-system, system-ui, "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, Ubuntu, Roboto, Noto, Arial, sans-serif;
        --font-body: "IBM Plex Sans Variable", "IBM Plex Sans", -apple-system, system-ui, "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, Ubuntu, Roboto, Noto, Arial, sans-serif;
        --font-mono: "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 30px;
        --text-3xl: 36px;
        --text-4xl: 44px;

        --leading-body: 1.5;
        --leading-tight: 1.2;
        --tracking-display: -0.025em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 48px;
        --section-y-tablet: 32px;
        --section-y-phone: 24px;

        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0px 25px 50px -12px rgba(0, 0, 0, 0.25);

        --focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.5);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1280px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset (minimal) ───────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 400;
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* ─── Layout primitives ─────────────────────────────────────── */
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
        font-family: var(--font-display);
        margin: 0;
        color: var(--fg-2);
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 800;
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.2;
      }
      h3 {
        font-size: var(--text-lg);
        font-weight: 700;
        line-height: 1.4;
        letter-spacing: -0.01em;
      }
      p { margin: 0; }

      .lede {
        font-size: var(--text-lg);
        line-height: 1.5;
        color: var(--fg);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-meta  { color: var(--meta); font-size: var(--text-sm); }
      .body-sm    { font-size: var(--text-sm); }

      .eyebrow {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 700;
        line-height: 1.33;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────────────
       * Primary CTA is the Dark Primary from DESIGN.md §4 — near-black
       * (--fg-2 territory) with white text and the brand's signature
       * opacity-based hover (0.7) plus an Amber Gold text flash. Active
       * scales slightly. Sage button uses --surface-warm and flashes
       * PostHog Orange text on hover — the hidden brand signature. */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: 10px 14px;
        border: 1px solid transparent;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1.4;
        cursor: pointer;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          opacity var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active        { transform: scale(0.98); }

      .btn-primary {
        background: var(--fg-2);
        color: var(--bg);
        padding: 10px 16px;
        border-radius: var(--radius-md);
      }
      .btn-primary:hover  { opacity: 0.7; color: var(--warn); }
      .btn-primary:active { opacity: 0.85; transform: scale(0.97); }

      .btn-secondary {
        background: var(--surface-warm);
        color: var(--fg);
        border-color: transparent;
      }
      .btn-secondary:hover { background: var(--surface); color: var(--accent); }

      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-ghost:hover { color: var(--accent); border-color: var(--fg); }

      /* Hidden-orange link — the brand's signature interaction surprise.
         Body links rest in --fg-2 with a sage underline that swaps to
         orange on hover. DESIGN.md §1: "hover states flash PostHog
         Orange — a hidden brand color that doesn't appear at rest". */
      a {
        color: var(--fg-2);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
        text-decoration-color: var(--border);
        transition:
          color var(--motion-fast) var(--ease-standard),
          text-decoration-color var(--motion-fast) var(--ease-standard);
      }
      a:hover {
        color: var(--accent);
        text-decoration-color: var(--accent);
      }
      a:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring);
        border-radius: var(--radius-sm);
      }

      /* ─── Badges / pills ───────────────────────────────────────── */
      .pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 700;
        line-height: 1.33;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .pill-soft {
        background: var(--surface);
        color: var(--fg-2);
        border: 1px solid var(--border);
      }
      .pill-warn {
        background: var(--surface);
        color: var(--warn);
        border: 1px solid var(--border);
      }
      .pill-status {
        background: var(--surface-warm);
        color: var(--fg-2);
        text-transform: none;
        letter-spacing: 0;
      }
      .pill-status .dot {
        width: 6px; height: 6px;
        border-radius: var(--radius-pill);
        background: var(--success);
      }

      /* ─── Cards ─────────────────────────────────────────────────────
       * Bordered cards per DESIGN.md §4 — Warm Parchment background,
       * 1px Sage Border, 6px radius (--radius-md). No shadow at rest:
       * DESIGN.md §6 reserves the only shadow for floating elements.
       * Hover swaps the heading color to PostHog Orange to keep the
       * "flash on interact" pattern alive across the system. */
      .card {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard);
      }
      .card:hover { border-color: var(--fg); }
      .card:hover h3 { color: var(--accent); }
      .card-warm { background: var(--surface); border-color: var(--border); }

      /* Floating panel — the ONE sanctioned shadow per DESIGN.md §6.
         Used for the hero status panel and any modal/dropdown. */
      .panel {
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
        padding: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      /* ─── Inputs ────────────────────────────────────────────────────
       * Default per DESIGN.md §4 Inputs & Forms: --surface (#eeefe9)
       * background, sage placeholder, 1px sage border, 4px radius
       * (--radius-sm). Focus swaps in the Focus Blue ring at 50%
       * opacity from --focus-ring. Field value text uses --fg-2 for
       * readability on the warm surface. */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--fg-2);
      }
      .field input,
      .field select,
      .field textarea {
        background: var(--surface);
        color: var(--fg-2);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 10px 12px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: 1.4;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus-visible,
      .field select:focus-visible,
      .field textarea:focus-visible {
        border-color: var(--fg);
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--muted);
        line-height: 1.4;
      }

      /* ─── Code / kbd ───────────────────────────────────────────── */
      code, kbd, .mono {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
      }
      kbd {
        display: inline-block;
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg-2);
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
      }
      .code-block {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-sm);
        padding: var(--space-3) var(--space-4);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        line-height: 1.5;
        color: var(--fg-2);
        overflow-x: auto;
        white-space: pre;
      }
      .code-block .tok-cmt { color: var(--meta); }
      .code-block .tok-fn  { color: var(--accent); }
      .code-block .tok-str { color: var(--fg); }

      /* ─── Distinctive: hedgehog mark ────────────────────────────────
       * Hand-drawn Max-style hedgehog rendered as a thick-stroke SVG
       * — the brand's anti-corporate signature per DESIGN.md §4 Image
       * Treatment. Sketchy, deliberate, never polished. Reused in the
       * hero panel, the nav lockup, and the empty-state .uma-preview-form copy. */
      .hedgehog {
        color: var(--fg-2);
      }

      /* ─── Section-specific layout ──────────────────────────────── */
      .nav-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-block: var(--space-4);
        gap: var(--space-4);
      }
      .nav-logo {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-family: var(--font-display);
        font-size: var(--text-lg);
        font-weight: 800;
        color: var(--fg-2);
        letter-spacing: -0.01em;
        text-decoration: none;
      }
      .nav-logo:hover { color: var(--accent); text-decoration: none; }
      .nav-links {
        display: inline-flex;
        align-items: center;
        gap: var(--space-6);
      }
      .nav-links a {
        font-family: var(--font-display);
        font-size: 15px;
        font-weight: 600;
        color: var(--fg-2);
        text-decoration: none;
      }
      .nav-links a:hover { color: var(--accent); }

      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      .hero-meta {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-block-start: var(--space-4);
        font-size: var(--text-sm);
        color: var(--muted);
      }
      .hero-meta .dot {
        width: 4px; height: 4px;
        border-radius: var(--radius-pill);
        background: var(--meta);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
        margin-block-start: var(--space-6);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .feature-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .feature-tag::before {
        content: "";
        width: 6px; height: 6px;
        background: var(--accent);
        border-radius: var(--radius-pill);
      }

      .form-row {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
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
        padding: var(--space-6);
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
      }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .row-cluster {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex-wrap: wrap;
      }
      .divider-soft {
        height: 1px;
        background: var(--border-soft);
        border: none;
        margin: 0;
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .trust-row {
        display: flex;
        align-items: center;
        gap: var(--space-6);
        flex-wrap: wrap;
        color: var(--meta);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: var(--text-sm);
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
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
           NAV — exercises: .nav-logo (hedgehog mark + wordmark with
           orange hover), .nav-links (15px·600 with orange flash),
           .btn-primary (Dark CTA per DESIGN.md §4 Navigation).
      ═══════════════════════════════════════════════════════════════ -->
      <nav class="nav-row" aria-label="Primary">
        
        <div class="nav-links" role="navigation">
          
          
          
          
        </div>
        <div class="row-cluster">
          
          
        </div>
      </nav>

      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: .eyebrow, h1 (44px·800, -0.025em tracking),
           .lede, .btn-primary / .btn-ghost / hidden-orange link hover,
           hero status .panel (the one sanctioned shadow), .pill-status
           with success dot, .pill-warn for the "1.0 incoming" pill,
           kbd inline keyboard cues, .trust-row enterprise muted bar.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · posthog</p>
            <h1 style="max-width: 18ch">
              How engineers build better products.
            </h1>
            <p class="lede body-muted" style="max-width: 56ch">
              PostHog is the open-source all-in-one platform for product
              analytics, session replay, feature flags, A/B tests, and
              the surveys you keep meaning to send. Built by engineers
              who got tired of stitching together six SaaS dashboards
              that all charge per-seat for the privilege.
            </p>

            <div class="hero-actions">
              
              
            </div>

            <div class="hero-meta">
              <span>Self-host with <kbd>docker compose up</kbd></span>
              <span class="dot" aria-hidden="true"></span>
              <span>1M events/mo free</span>
              <span class="dot" aria-hidden="true"></span>
              <span>No credit card</span>
            </div>

            <hr class="divider-soft" style="margin-block: var(--space-6)" />

            <p class="eyebrow">Trusted by engineering teams at</p>
            <div class="trust-row" aria-label="Trusted by">
              <span>Airbus</span>
              <span>GOV.UK</span>
              <span>Y&nbsp;Combinator</span>
              <span>Hasura</span>
              <span>Raycast</span>
            </div>
          </div>

          <aside class="panel" aria-label="Live event stream">
            <div class="row-between">
              <span class="pill pill-soft">Live · last 60s</span>
              <span class="pill pill-status">
                <span class="dot" aria-hidden="true"></span>
                Ingesting
              </span>
            </div>

            <div class="stack-2">
              <h3 style="line-height: 1.3">12,418 events</h3>
              <p class="body-muted body-sm">
                Across <strong style="color: var(--fg-2)">2,107</strong>
                anonymous people, 38 countries, and one suspicious cron
                in <code style="color: var(--accent)">us-east-1</code>.
              </p>
            </div>

            <pre class="code-block" aria-label="Event payload"><span class="tok-cmt"># last event seen 0.4s ago</span>
posthog.<span class="tok-fn">capture</span>(
  distinct_id=<span class="tok-str">"max@hog.com"</span>,
  event=<span class="tok-str">"button_clicked"</span>,
  properties={
    <span class="tok-str">"label"</span>: <span class="tok-str">"get_started"</span>,
    <span class="tok-str">"$session_id"</span>: <span class="tok-str">"01HX…"</span>
  }
)</pre>

            <div class="row-between">
              <span class="body-sm body-muted">
                <kbd>⌘</kbd> <kbd>K</kbd> to jump
              </span>
              
            </div>
          </aside>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURES — exercises: .card (bordered, no shadow, 6px radius,
           hover swaps title to PostHog Orange — the hidden brand
           signature), .feature-tag (orange dot eyebrow), nested links
           with sage-to-orange underline swap, .body-meta footer line.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What's in the box</p>
          <h2 style="max-width: 28ch">
            Every analytics tool a product engineer actually needs.
          </h2>
          <p class="body-muted" style="max-width: 60ch">
            One database, one billing line, one set of definitions for
            what an &ldquo;active user&rdquo; is. Hover any card to flash
            the hidden brand orange &mdash; DESIGN.md §1 calls it the
            signature interaction surprise.
          </p>
        </div>

        <div class="features-grid">
          <article class="card">
            <span class="feature-tag">Analytics</span>
            <h3>Product analytics that don't lie</h3>
            <p class="body-muted body-sm">
              Funnels, retention, paths, lifecycle &mdash; all built on
              raw events you actually own. No sampling, no aggregated
              hand-waving, no &ldquo;trust us, the dashboard is
              right.&rdquo;
            </p>
            
          </article>

          <article class="card">
            <span class="feature-tag">Replay</span>
            <h3>Watch what your users actually did</h3>
            <p class="body-muted body-sm">
              Session replay with console logs, network requests, and
              the rage clicks your support team have been complaining
              about all week. Privacy masking on by default.
            </p>
            
          </article>

          <article class="card">
            <span class="feature-tag">Experiments</span>
            <h3>Feature flags &amp; A/B tests</h3>
            <p class="body-muted body-sm">
              Ship a flag in five minutes, run an experiment in five
              days, kill the bad arm in five seconds. Same data
              warehouse as your analytics &mdash; the results never
              disagree with the funnel.
            </p>
            
          </article>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — exercises: .field (sage-cream bg, sage border, Focus
           Blue ring at 50%), .field-help, .btn-primary submit, code
           inline, .pill-warn footer note. The right column reuses
           .panel to show the email confirmation preview.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Self-host or hosted</p>
            <h2 style="max-width: 22ch">
              Two clicks from zero to first event.
            </h2>
            <p class="body-muted" style="max-width: 52ch">
              Drop us your work email and we&apos;ll send the install
              command that fits your stack &mdash; <code>npm</code>,
              <code>pnpm</code>, <code>pip</code>, <code>go get</code>,
              or one truly heroic <code>curl | bash</code>. No
              calendars, no &ldquo;quick chat&rdquo; bookings.
            </p>

            <hr class="divider-soft" />

            <p class="body-meta">
              By the way: PostHog is open source under MIT. The
              hosted plan exists because someone has to pay the
              S3 bill. Read the
               or
              .
            </p>
          </div>

          <div role="group" class="uma-preview-form form">
            <div class="row-between">
              <p class="eyebrow" style="color: var(--fg-2)">Start free</p>
              <span class="pill pill-warn">1M events / mo</span>
            </div>

            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email"
                placeholder="ada@hedgehog.dev"
                autocomplete="email" required />
              <p class="field-help">
                We&apos;ll never sell it. We&apos;ll barely even use it.
              </p>
            </div>

            <div class="field">
              <label for="company">Company</label>
              <input id="company" type="text"
                placeholder="The Cottage Garden Co."
                autocomplete="organization" />
            </div>

            <div class="field">
              <label for="stack">Where should we point you?</label>
              <select id="stack">
                <option>JavaScript / TypeScript</option>
                <option>Python</option>
                <option>Go</option>
                <option>Ruby</option>
                <option>iOS · Android</option>
                <option>Just curious, send the marketing</option>
              </select>
              <p class="field-help">
                We&apos;ll match the install snippet to your runtime.
              </p>
            </div>

            <div class="row-cluster" style="margin-block-start: var(--space-2)">
              <button type="submit" class="btn btn-primary">
                Send the install command
              </button>
              <button type="button" class="btn btn-ghost">
                Or self-host instead
              </button>
            </div>

            <p class="body-sm body-muted" style="margin-block-start: var(--space-2)">
              No credit card. No marketing automation gauntlet.
              The hedgehog approves.
            </p>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=posthog_default;return module.exports}});
//# sourceMappingURL=client.posthog.js.map