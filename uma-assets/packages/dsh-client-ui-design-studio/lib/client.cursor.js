
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.cursor.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var cursor_default={"contract":`## 1. Visual Theme & Atmosphere

Cursor's website is a study in warm minimalism meets code-editor elegance. The entire experience is built on a warm off-white canvas (\`#f2f1ed\`) with dark warm-brown text (\`#26251e\`) -- not pure black, not neutral gray, but a deeply warm near-black with a yellowish undertone that evokes old paper, ink, and craft. This warmth permeates every surface: backgrounds lean toward cream (\`#e6e5e0\`, \`#ebeae5\`), borders dissolve into transparent warm overlays using \`oklab\` color space, and even the error state (\`#cf2d56\`) carries warmth rather than clinical red. The result feels more like a premium print publication than a tech website.

The custom CursorGothic font is the typographic signature -- a gothic sans-serif with aggressive negative letter-spacing at display sizes (-2.16px at 72px) that creates a compressed, engineered feel. As a secondary voice, the jjannon serif font (with OpenType \`"cswh"\` contextual swash alternates) provides literary counterpoint for body copy and editorial passages. The monospace voice comes from berkeleyMono, a refined coding font that connects the marketing site to Cursor's core identity as a code editor. This three-font system (gothic display, serif body, mono code) gives Cursor one of the most typographically rich palettes in developer tooling.

The border system is particularly distinctive -- Cursor uses \`oklab()\` color space for border colors, applying warm brown at various alpha levels (0.1, 0.2, 0.55) to create borders that feel organic rather than mechanical. The signature border color \`oklab(0.263084 -0.00230259 0.0124794 / 0.1)\` is not a simple rgba value but a perceptually uniform color that maintains visual consistency across different backgrounds.

**Key Characteristics:**
- CursorGothic with aggressive negative letter-spacing (-2.16px at 72px, -0.72px at 36px) for compressed display headings
- jjannon serif for body text with OpenType \`"cswh"\` (contextual swash alternates)
- berkeleyMono for code and technical labels
- Warm off-white background (\`#f2f1ed\`) instead of pure white -- the entire system is warm-shifted
- Primary text color \`#26251e\` (warm near-black with yellow undertone)
- Accent orange \`#f54e00\` for brand highlight and links
- oklab-space borders at various alpha levels for perceptually uniform edge treatment
- Pill-shaped elements with extreme radius (33.5M px, effectively full-pill)
- 8px base spacing system with fine-grained sub-8px increments (1.5px, 2px, 2.5px, 3px, 4px, 5px, 6px)

## 4. Component Stylings

### Buttons

**Primary (Warm Surface)**
- Background: \`#ebeae5\` (Surface 300)
- Text: \`#26251e\` (Cursor Dark)
- Padding: 10px 12px 10px 14px
- Radius: 8px
- Outline: none
- Hover: text shifts to \`var(--color-error)\` (\`#cf2d56\`)
- Focus shadow: \`rgba(0,0,0,0.1) 0px 4px 12px\`
- Use: Primary actions, main CTAs

**Secondary Pill**
- Background: \`#e6e5e0\` (Surface 400)
- Text: \`rgba(38, 37, 30, 0.9)\` (\`--fg-2\`) for readable interactive filter labels
- Padding: 3px 8px
- Radius: full pill (33.5M px)
- Hover: text shifts to \`var(--color-error)\`
- Use: Tags, filters, secondary actions

**Tertiary Pill**
- Background: \`#e1e0db\` (Surface 500)
- Text: \`oklab(0.263 / 0.6)\` (60% warm brown)
- Radius: full pill
- Use: Active filter state, selected tags

**Ghost (Transparent)**
- Background: \`rgba(38, 37, 30, 0.06)\` (6% warm brown)
- Text: \`rgba(38, 37, 30, 0.55)\` (55% warm brown)
- Padding: 6px 12px
- Use: Tertiary actions, dismiss buttons

**Light Surface**
- Background: \`#f7f7f4\` (Surface 100) or \`#f2f1ed\` (Surface 200)
- Text: \`#26251e\` or \`oklab(0.263 / 0.9)\` (90%)
- Padding: 0px 8px 1px 12px
- Use: Dropdown triggers, subtle interactive elements

### Cards & Containers
- Background: \`#e6e5e0\` or \`#f2f1ed\`
- Border: \`1px solid oklab(0.263 / 0.1)\` (warm brown at 10%)
- Radius: 8px (standard), 4px (compact), 10px (featured)
- Shadow: \`rgba(0,0,0,0.14) 0px 28px 70px, rgba(0,0,0,0.1) 0px 14px 32px\` for elevated cards
- Hover: shadow intensification

### Inputs & Forms
- Background: transparent or surface
- Text: \`#26251e\`
- Padding: 8px 8px 6px (textarea)
- Border: \`1px solid oklab(0.263 / 0.1)\`
- Focus: border shifts to \`oklab(0.263 / 0.2)\` or accent orange

### Navigation
- Clean horizontal nav on warm cream background
- Cursor logotype left-aligned (~96x24px)
- Links: 14px CursorGothic or system-ui, weight 500
- CTA button: warm surface with Cursor Dark text
- Tab navigation: bottom border \`1px solid oklab(0.263 / 0.1)\` with active tab differentiation

### Image Treatment
- Code editor screenshots with \`1px solid oklab(0.263 / 0.1)\` border
- Rounded corners: 8px standard
- AI chat/timeline screenshots dominate feature sections
- Warm gradient or solid cream backgrounds behind hero images

### Distinctive Components

**AI Timeline**
- Vertical timeline showing AI operations: thinking (peach), grep (sage), read (blue), edit (lavender)
- Each step uses its semantic color with matching text
- Connected with vertical lines
- Core visual metaphor for Cursor's AI-first coding experience

**Code Editor Previews**
- Dark code editor screenshots with warm cream border frame
- berkeleyMono for code text
- Syntax highlighting using timeline colors

**Pricing Cards**
- Warm surface backgrounds with bordered containers
- Feature lists using jjannon serif for readability
- CTA buttons with accent orange or primary dark styling

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Fine scale: 1.5px, 2px, 2.5px, 3px, 4px, 5px, 6px (sub-8px for micro-adjustments)
- Standard scale: 8px, 10px, 12px, 14px (derived from extraction)
- Extended scale (inferred): 16px, 24px, 32px, 48px, 64px, 96px
- Notable: fine-grained sub-8px increments for precise icon/text alignment

### Grid & Container
- Max content width: approximately 1200px
- Hero: centered single-column with generous top padding (80-120px)
- Feature sections: 2-3 column grids for cards and features
- Full-width sections with warm cream or slightly darker backgrounds
- Sidebar layouts for documentation and settings pages

### Whitespace Philosophy
- **Warm negative space**: The cream background means whitespace has warmth and texture, unlike cold white minimalism. Large empty areas feel cozy rather than clinical.
- **Compressed text, open layout**: Aggressive negative letter-spacing on CursorGothic headlines is balanced by generous surrounding margins. Text is dense; space around it breathes.
- **Section variation**: Alternating surface tones (cream → lighter cream → cream) create subtle section differentiation without harsh boundaries.

### Border Radius Scale
- Micro (1.5px): Fine detail elements
- Small (2px): Inline elements, code spans
- Medium (3px): Small containers, inline badges
- Standard (4px): Cards, images, compact buttons
- Comfortable (8px): Primary buttons, cards, menus
- Featured (10px): Larger containers, featured cards
- Full Pill (33.5M px / 9999px): Pill buttons, tags, badges

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Border Ring (Level 1) | \`oklab(0.263 / 0.1) 0px 0px 0px 1px\` | Standard card/container border (warm oklab) |
| Border Medium (Level 1b) | \`oklab(0.263 / 0.2) 0px 0px 0px 1px\` | Emphasized borders, active states |
| Ambient (Level 2) | \`rgba(0,0,0,0.02) 0px 0px 16px, rgba(0,0,0,0.008) 0px 0px 8px\` | Floating elements, subtle glow |
| Elevated Card (Level 3) | \`rgba(0,0,0,0.14) 0px 28px 70px, rgba(0,0,0,0.1) 0px 14px 32px, oklab ring\` | Modals, popovers, elevated cards |
| Focus | \`rgba(0,0,0,0.1) 0px 4px 12px\` on button focus | Interactive focus feedback |

**Shadow Philosophy**: Cursor's depth system is built around two ideas. First, borders use perceptually uniform oklab color space rather than rgba, ensuring warm brown borders look consistent across different background tones. Second, elevation shadows use dramatically large blur values (28px, 70px) with moderate opacity (0.14, 0.1), creating a diffused, atmospheric lift rather than hard-edged drop shadows. Cards don't feel like they float above the page -- they feel like the page has gently opened a space for them.

### Decorative Depth
- Warm cream surface variations create subtle tonal depth without shadows
- oklab borders at 10% and 20% create a spectrum of edge definition
- No harsh divider lines -- section separation through background tone shifts and spacing

## 7. Interaction & Motion

### Hover States
- Buttons: text color shifts to \`--color-error\` (\`#cf2d56\`) on hover -- a distinctive warm crimson that signals interactivity
- Links: color shift to accent orange (\`#f54e00\`) or underline decoration with \`rgba(38, 37, 30, 0.4)\`
- Cards: shadow intensification on hover (ambient → elevated)

### Focus States
- Shadow-based focus: \`rgba(0,0,0,0.1) 0px 4px 12px\` for depth-based focus indication
- Border focus: \`oklab(0.263 / 0.2)\` (20% border) for input/form focus
- Consistent warm tone in all focus states -- no cold blue focus rings

### Transitions
- Color transitions: 150ms ease for text/background color changes
- Shadow transitions: 200ms ease for elevation changes
- Transform: subtle scale or translate for interactive feedback

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <600px | Single column, reduced padding, stacked navigation |
| Tablet Small | 600-768px | 2-column grids begin |
| Tablet | 768-900px | Expanded card grids, sidebar appears |
| Desktop Small | 900-1279px | Full layout forming |
| Desktop | >1279px | Full layout, maximum content width |

### Touch Targets
- Buttons use comfortable padding (6px-14px vertical, 8px-14px horizontal)
- Pill buttons maintain tap-friendly sizing with 3px-10px padding
- Navigation links at 14px with adequate spacing for touch

### Collapsing Strategy
- Hero: 72px CursorGothic → 36px → 26px on smaller screens, maintaining proportional letter-spacing
- Navigation: horizontal links → hamburger menu on mobile
- Feature cards: 3-column → 2-column → single column stacked
- Code editor screenshots: maintain aspect ratio, may shrink with border treatment preserved
- Timeline visualization: horizontal → vertical stacking
- Section spacing: 80px+ → 48px → 32px on mobile

### Image Behavior
- Editor screenshots maintain warm border treatment at all sizes
- AI timeline adapts from horizontal to vertical layout
- Product screenshots use responsive images with consistent border radius
- Full-width hero images scale proportionally`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cursor — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/cursor. Every visible
        value comes from tokens.css; if the agent paste-replaces the
        :root block and reuses the component selectors below verbatim,
        the artifact passes lint without further audit. Cursor's
        signature moves: warm cream surfaces, three typographic voices
        (CursorGothic / jjannon / berkeleyMono), oklab borders rendered
        as rgba fallback, hover-text shifts to --danger crimson, and
        diffused atmospheric shadows."
    />

    <style>
      /* :root paste — sourced verbatim from
         design-systems/cursor/tokens.css. Keep this block in sync
         when tokens.css changes. The agent prompt instructs the
         Designer panelist to paste this block as the FIRST thing in
         their <style>, then reference everything below via var(...). */
      :root {
        --bg: #f2f1ed;
        --surface: #e6e5e0;
        --surface-warm: #ebeae5;

        --fg: #26251e;
        --fg-2: rgba(38, 37, 30, 0.9);
        --muted: rgba(38, 37, 30, 0.55);
        --meta: rgba(38, 37, 30, 0.4);

        --border: rgba(38, 37, 30, 0.1);
        --border-soft: rgba(38, 37, 30, 0.06);

        --accent: #f54e00;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #1f8a65;
        --warn: #eab308;
        --danger: #cf2d56;

        --font-display: "CursorGothic", "CursorGothic Fallback", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body: "jjannon", "Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        --font-mono: "berkeleyMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

        --text-xs: 11px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19.2px;
        --text-xl: 22px;
        --text-2xl: 26px;
        --text-3xl: 36px;
        --text-4xl: 72px;

        --leading-body: 1.5;
        --leading-tight: 1.10;
        --tracking-display: -0.03em;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet: 48px;
        --section-y-phone: 32px;

        --radius-sm: 8px;
        --radius-md: 10px;
        --radius-lg: 12px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          0 28px 70px rgba(0, 0, 0, 0.14),
          0 14px 32px rgba(0, 0, 0, 0.1),
          0 0 0 1px var(--border);

        --focus-ring: 0 4px 12px rgba(0, 0, 0, 0.1);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: ease;

        --container-max: 1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset (minimal) ───────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        /* Body uses jjannon serif. The three-voice system is a brand
           signature; do not collapse to one font for "simplicity". */
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        font-feature-settings: "cswh"; /* contextual swash alternates */
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section {
        /* Cursor's section separation is via tone shift + spacing,
           not hard rules. The ring is intentionally faint. */
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

      /* ─── Typography ────────────────────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
        /* CursorGothic uses weight 400 almost exclusively; size +
           tracking carry hierarchy, not weight (DESIGN.md §3.4). */
        font-weight: 400;
      }
      h1 {
        /* Hero uses --text-4xl=72px with the full -0.03em tracking. */
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        /* 36px section heading: line-height 1.20, tracking -0.72px (-0.02em).
           Overrides the shared 1.10 (--leading-tight) set on h1/h2/h3 above. */
        line-height: 1.20;
        letter-spacing: -0.02em;
      }
      h3 {
        font-size: var(--text-2xl);
        /* 26px sub-heading: line-height 1.25, tracking -0.325px (-0.0125em).
           Overrides the shared 1.10 (--leading-tight) set on h1/h2/h3 above. */
        line-height: 1.25;
        letter-spacing: -0.0125em;
      }
      p { margin: 0; }
      .lead {
        /* Lead body in serif voice — Cursor's editorial signature. */
        font-family: var(--font-body);
        font-size: var(--text-lg);
        line-height: 1.35;
        color: var(--muted);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .body-mono { font-family: var(--font-mono); font-size: var(--text-sm); }
      /* \`.eyebrow\` — uppercase micro label, system-ui voice. Letter
         spacing is well above craft/typography.md's 0.06em floor. */
      .eyebrow {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 500;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ───────────────────────────────────────────── */
      /* Cursor's primary CTA is NOT accent-bg — it is warm-surface bg
         with dark text, signature for the brand. The accent orange
         appears on link decoration and on the "accent pill" CTA used
         sparingly (≤1 per screen). The hover signature is a text-color
         shift to --danger (warm crimson), not bg-darken. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 400;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition:
          color var(--motion-fast) var(--ease-standard),
          background-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible {
        outline: none;
        /* DESIGN.md §7: focus is depth (4 12 0.1), not halo. */
        box-shadow: var(--focus-ring);
      }
      /* Primary — warm-surface CTA. */
      .btn-primary {
        background: var(--surface-warm);
        color: var(--fg);
      }
      .btn-primary:hover { color: var(--danger); }
      .btn-primary:active { background: var(--surface); }
      /* Secondary — ghost on warm surface. */
      .btn-secondary {
        background: transparent;
        color: var(--muted);
        border-color: var(--border);
      }
      .btn-secondary:hover {
        color: var(--danger);
        border-color: rgba(38, 37, 30, 0.2);
      }
      /* Accent pill — used at most once per screen for the loudest CTA.
         This is the only place on the page where --accent is a bg. */
      .btn-accent {
        background: var(--accent);
        color: var(--accent-on);
        border-radius: var(--radius-pill);
        padding: 10px 18px;
      }
      .btn-accent:hover { background: var(--accent-hover); }
      .btn-accent:active { background: var(--accent-active); }

      /* ─── Pill tags ─────────────────────────────────────────── */
      /* Cursor's full-pill (9999px) badges/filters — DESIGN.md §4.1. */
      .pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 3px 10px;
        border-radius: var(--radius-pill);
        background: var(--surface);
        color: var(--fg-2);
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 400;
        line-height: 1.5;
      }
      .pill-active {
        background: rgba(38, 37, 30, 0.06); /* deeper surface for selected state */
        color: var(--fg);
      }

      /* ─── Inputs ────────────────────────────────────────────── */
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .field label {
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input {
        padding: 10px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-base) var(--ease-standard);
      }
      .field input:focus-visible {
        outline: none;
        border-color: rgba(38, 37, 30, 0.2);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help {
        font-family: var(--font-body);
        font-size: var(--text-sm);
        color: var(--muted);
      }

      /* ─── Cards ─────────────────────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition: box-shadow var(--motion-base) var(--ease-standard);
      }
      .card:hover {
        /* DESIGN.md §7: hover shadow intensification (ambient → elevated). */
        box-shadow: var(--elev-raised);
      }
      .card-featured {
        /* Featured card uses the larger 10px radius (DESIGN.md §5.4). */
        border-radius: var(--radius-md);
        background: var(--bg);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 2px var(--space-3);
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 500;
        line-height: 1.6;
      }
      .badge-success {
        color: var(--success);
        background: color-mix(in oklab, var(--success), transparent 90%);
      }
      .badge-muted {
        color: var(--muted);
        background: color-mix(in oklab, var(--muted), transparent 88%);
      }
      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Links ─────────────────────────────────────────────── */
      a {
        color: var(--accent);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-color: var(--meta);
      }

      /* ─── Kbd ───────────────────────────────────────────────── */
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }

      /* ─── AI timeline (decorative, signature element) ──────── */
      /* DESIGN.md §4.7 — Cursor's AI timeline shows four states with
         soft "warm pastel" colors. These are decorative state markers,
         intentionally NOT promoted to brand surface tokens. */
      .timeline {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-4);
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
      }
      .timeline-step {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--fg-2);
      }
      .timeline-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .timeline-thinking .timeline-dot { background: #dfa88f; }
      .timeline-grep     .timeline-dot { background: #9fc9a2; }
      .timeline-read     .timeline-dot { background: #9fbbe0; }
      .timeline-edit     .timeline-dot { background: #c0a8dd; }

      /* ─── Section-specific layout ───────────────────────────── */
      .hero-grid {
        display: grid;
        /* Asymmetric hero — keeps the page from looking like an
           AI-default centered template. */
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--bg);
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) {
        .features-grid { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 639px) {
        .features-grid { grid-template-columns: 1fr; }
      }
      .form-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
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
        max-width: 420px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
      }
      .filter-row {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- ════════════════════════════════════════════════════════════
           HERO — exercises: h1 (CursorGothic 72px / -0.03em),
           .lead (jjannon serif), .eyebrow, .btn-primary (warm-surface
           CTA + crimson hover), .btn-accent (orange pill, used once
           per page max), kbd (berkeleyMono), .badge-success.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · cursor</p>
            <h1>The editor your team writes through, not at.</h1>
            <p class="lead" style="max-width: 52ch">
              Cursor pairs a serif voice with gothic compression so
              feature copy reads like a publication and headlines hit
              like an engineered statement. Three fonts, one warm cream
              canvas, every value below comes from tokens.css.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside class="hero-meta" aria-label="System status">
            <div class="row-between">
              <span class="body-sm">System status</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Stable
              </span>
            </div>
            <p class="body-sm body-muted">
              Last reviewed
              <time datetime="2026-05-14">2026-05-14</time> · v0.1
            </p>
            <p class="body-sm body-muted">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to search tokens.
            </p>
          </aside>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FEATURES — exercises: h2, h3, .card (warm surface + hover
           shadow lift), .body-muted, .pill / .pill-active (full-pill
           filter row), .features-grid, AI timeline component (the
           cursor signature element).
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 28ch">
            Every component below uses only var(--*) — no raw hex, no
            off-token type.
          </h2>
        </div>

        <div class="filter-row" style="margin-block-start: var(--space-6)">
          <button class="pill pill-active">All</button>
          <button class="pill">Surfaces</button>
          <button class="pill">Typography</button>
          <button class="pill">Motion</button>
        </div>

        <div class="features-grid" style="margin-block-start: var(--space-6)">
          <article class="card">
            <h3>Warm surfaces</h3>
            <p class="body-muted body-sm">
              --bg, --surface, --surface-warm form a three-tier cream
              ladder. Pure white only inside code panels; the page
              never reaches it on the canvas.
            </p>
            
          </article>

          <article class="card">
            <h3>Three voices</h3>
            <p class="body-muted body-sm">
              CursorGothic for display, jjannon serif for body,
              berkeleyMono for code. Each voice carries one role; the
              system never collapses to two faces.
            </p>
            
          </article>

          <article class="card card-featured">
            <h3>oklab borders</h3>
            <p class="body-muted body-sm">
              Borders ship as rgba fallbacks of the oklab originals at
              0.1 / 0.06 alpha — perceptually uniform across every
              warm surface.
            </p>
            
          </article>
        </div>

        <div class="timeline" style="margin-block-start: var(--space-8); max-width: 480px">
          <p class="eyebrow">AI timeline · signature element</p>
          <div class="timeline-step timeline-thinking">
            <span class="timeline-dot" aria-hidden="true"></span>
            <span>thinking…</span>
          </div>
          <div class="timeline-step timeline-grep">
            <span class="timeline-dot" aria-hidden="true"></span>
            <span>grep "tokens.css" -r design-systems/</span>
          </div>
          <div class="timeline-step timeline-read">
            <span class="timeline-dot" aria-hidden="true"></span>
            <span>read default/tokens.css</span>
          </div>
          <div class="timeline-step timeline-edit">
            <span class="timeline-dot" aria-hidden="true"></span>
            <span>edit cursor/tokens.css → +56 tokens</span>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           FORM — exercises: .field (jjannon body input), focus-visible
           depth shadow (no halo), .btn-primary (warm-surface CTA),
           .btn-secondary (ghost border), .field-help.
      ═══════════════════════════════════════════════════════════════ -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs inherit the same tokens.</h2>
            <p class="body-muted" style="max-width: 48ch">
              The focus state is a soft 4px-12px depth shadow — no
              cool-blue halo. Border weights stay at oklab 0.1; on
              focus the active border lifts to 0.2.
            </p>
          </div>

          <div role="group" class="hey-preview-form form">
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
`};exports.default=cursor_default;return module.exports}});
//# sourceMappingURL=client.cursor.js.map