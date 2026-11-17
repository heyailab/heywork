
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.clickhouse.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var clickhouse_default={"contract":`## 1. Visual Theme & Atmosphere

ClickHouse's interface is a high-performance cockpit rendered in acid yellow-green on obsidian black — a design that screams "speed" before you read a single word. The entire experience lives in darkness: pure black backgrounds (\`#000000\`) with dark charcoal cards (\`#414141\` borders) creating a terminal-grade aesthetic where the only chromatic interruption is the signature neon yellow-green (\`#faff69\`) that slashes across CTAs, borders, and highlighted moments like a highlighter pen on a dark console.

The typography is aggressively heavy — Inter at weight 900 (Black) for the hero headline at 96px creates text blocks that feel like they have physical mass. This "database for AI" site communicates raw power through visual weight: thick type, high-contrast neon accents, and performance stats displayed as oversized numbers. There's nothing subtle about ClickHouse's design, and that's entirely the point — it mirrors the product's promise of extreme speed and performance.

What makes ClickHouse distinctive is the electrifying tension between the near-black canvas and the neon yellow-green accent. This color combination (\`#faff69\` on \`#000000\`) creates one of the highest-contrast pairings in any tech brand, making every CTA button, every highlighted card, and every accent border impossible to miss. Supporting this is a forest green (\`#166534\`) for secondary CTAs that adds depth to the action hierarchy without competing with the neon.

**Key Characteristics:**
- Pure black canvas (#000000) with neon yellow-green (#faff69) accent — maximum contrast
- Extra-heavy display typography: Inter at weight 900 (Black) up to 96px
- Dark charcoal card system with #414141 borders at 80% opacity
- Forest green (#166534) secondary CTA buttons
- Performance stats as oversized display numbers
- Uppercase labels with wide letter-spacing (1.4px) for navigation structure
- Active/pressed state shifts text to pale yellow (#f4f692)
- All links hover to neon yellow-green — unified interactive signal
- Inset shadows on select elements creating "pressed into the surface" depth

## 4. Component Stylings

### Buttons

**Neon Primary**
- Background: Neon Volt (\`#faff69\`)
- Text: Near Black (\`#151515\`)
- Padding: 0px 16px
- Radius: sharp (4px)
- Border: \`1px solid #faff69\`
- Hover: background shifts to dark (\`rgb(29, 29, 29)\`), text stays
- Active: text shifts to Pale Yellow (\`#f4f692\`)
- The eye-catching CTA — neon on black

**Dark Solid**
- Background: Near Black (\`#141414\`)
- Text: Pure White (\`#ffffff\`)
- Padding: 12px 16px
- Radius: 4px or 8px
- Border: \`1px solid #141414\`
- Hover: bg shifts to Hover Gray (\`#3a3a3a\`), text to 80% opacity
- Active: text to Pale Yellow
- The standard action button

**Forest Green**
- Background: Forest Green (\`#166534\`)
- Text: Pure White (\`#ffffff\`)
- Padding: 12px 16px
- Border: \`1px solid #141414\`
- Hover: same dark shift
- Active: Pale Yellow text
- The "Get Started" / primary conversion button

**Ghost / Outlined**
- Background: transparent
- Text: Pure White (\`#ffffff\`)
- Padding: 0px 32px
- Radius: 4px
- Border: \`1px solid #4f5100\` (olive-tinted)
- Hover: dark bg shift
- Active: Pale Yellow text
- Secondary actions with neon-tinted border

**Pill Toggle**
- Background: transparent
- Radius: pill (9999px)
- Used for toggle/switch elements

### Cards & Containers
- Background: transparent or Near Black
- Border: \`1px solid rgba(65, 65, 65, 0.8)\` — the signature charcoal containment
- Radius: 4px (small elements) or 8px (cards, containers)
- Shadow Level 1: subtle (\`rgba(0,0,0,0.1) 0px 1px 3px, rgba(0,0,0,0.1) 0px 1px 2px -1px\`)
- Shadow Level 2: medium (\`rgba(0,0,0,0.1) 0px 10px 15px -3px, rgba(0,0,0,0.1) 0px 4px 6px -4px\`)
- Shadow Level 3: inset (\`rgba(0,0,0,0.06) 0px 4px 4px, rgba(0,0,0,0.14) 0px 4px 25px inset\`) — the "pressed" effect
- Neon-highlighted cards: selected/active cards get neon yellow-green border or accent

### Navigation
- Dark nav on black background
- Logo: ClickHouse wordmark + icon in yellow/neon
- Links: white text, hover to Neon Volt (#faff69)
- CTA: Neon Volt button or Forest Green button
- Uppercase labels for categories

### Distinctive Components

**Performance Stats**
- Oversized numbers (72px+, weight 700–900)
- Brief descriptions beneath
- High-contrast neon accents on key metrics
- The primary visual proof of performance claims

**Neon-Highlighted Card**
- Standard dark card with neon yellow-green border highlight
- Creates "selected" or "featured" treatment
- The accent border makes the card pop against the dark canvas

**Code Blocks**
- Dark surface with Inconsolata at weight 600
- Neon and white syntax highlighting
- Terminal-like aesthetic

**Trust Bar**
- Company logos on dark background
- Monochrome/white logo treatment
- Horizontal layout

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 6px, 7px, 8px, 10px, 12px, 16px, 20px, 24px, 25px, 32px, 40px, 44px, 48px, 64px
- Button padding: 12px 16px (standard), 0px 16px (compact), 0px 32px (wide ghost)
- Section vertical spacing: generous (48–64px)

### Grid & Container
- Max container width: up to 2200px (extra-wide) with responsive scaling
- Hero: full-width dark with massive typography
- Feature sections: multi-column card grids with dark borders
- Stats: horizontal metric bar
- Full-dark page — no light sections

### Whitespace Philosophy
- **Dark void as canvas**: The pure black background provides infinite depth — elements float in darkness.
- **Dense information**: Feature cards and stats are packed with data, reflecting the database product's performance focus.
- **Neon highlights as wayfinding**: Yellow-green accents guide the eye through the dark interface like runway lights.

### Border Radius Scale
- Sharp (4px): Buttons, badges, small elements, code blocks
- Comfortable (8px): Cards, containers, dividers
- Pill (9999px): Toggle buttons, status indicators

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Black background, text blocks |
| Bordered (Level 1) | \`1px solid rgba(65,65,65,0.8)\` | Standard cards, containers |
| Subtle (Level 2) | \`0px 1px 3px rgba(0,0,0,0.1)\` | Subtle card lift |
| Elevated (Level 3) | \`0px 10px 15px -3px rgba(0,0,0,0.1)\` | Feature cards, hover states |
| Pressed/Inset (Level 4) | \`0px 4px 25px rgba(0,0,0,0.14) inset\` | Active/pressed elements — "sunk into the surface" |
| Neon Highlight (Level 5) | Neon Volt border (\`#faff69\`) | Featured/selected cards, maximum emphasis |

**Shadow Philosophy**: ClickHouse uses shadows on a black canvas, where they're barely visible — they exist more for subtle dimensionality than obvious elevation. The most distinctive depth mechanism is the **inset shadow** (Level 4), which creates a "pressed into the surface" effect unique to ClickHouse. The neon border highlight (Level 5) is the primary attention-getting depth mechanism.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, stacked cards |
| Small Tablet | 640–768px | Minor adjustments |
| Tablet | 768–1024px | 2-column grids |
| Desktop | 1024–1280px | Standard layout |
| Large Desktop | 1280–1536px | Expanded content |
| Ultra-wide | 1536–2200px | Maximum container width |

### Touch Targets
- Buttons with 12px 16px padding minimum
- Card surfaces as touch targets
- Adequate nav link spacing

### Collapsing Strategy
- **Hero text**: 96px → 72px → 48px → 36px
- **Feature grids**: Multi-column → 2 → 1 column
- **Stats**: Horizontal → stacked
- **Navigation**: Full → hamburger

### Image Behavior
- Product screenshots maintain aspect ratio
- Code blocks use horizontal scroll on narrow screens
- All images on dark backgrounds`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ClickHouse — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/clickhouse. Pure black canvas,
        neon volt accent (#faff69), Inter Black (900) display at 96px,
        charcoal-bordered cards, terminal-grade database aesthetic."
    />

    <style>
      :root {
        --bg: #000000;
        --surface: #141414;
        --surface-warm: var(--surface);

        --fg: #ffffff;
        --fg-2: #a0a0a0;
        --muted: #a0a0a0;
        --meta: #585858;

        --border: rgba(65, 65, 65, 0.8);
        --border-soft: #343434;

        --accent: #faff69;
        --accent-on: #151515;
        --accent-hover: #1d1d1d;
        --accent-active: #f4f692;

        --success: #166534;
        --warn: #eab308;
        --danger: #dc2626;

        --font-display: "Inter", "Basier", Arial, Helvetica, ui-sans-serif, system-ui, sans-serif;
        --font-body: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        --font-mono: "Inconsolata", ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 72px;
        --text-4xl: 96px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: normal;

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

        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1280px;
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

      /* ─── Typography — weight IS hierarchy ──────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 900;                 /* Inter Black — the weapon */
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-2xl);
        font-weight: 600;                 /* Basier-style feature heading */
        line-height: 1.30;
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 700;
        line-height: 1.17;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--muted);
        line-height: 1.56;
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .body-mono { font-family: var(--font-mono); font-weight: 600; }
      /* Uppercase overline — DESIGN.md: 14px / weight 600 / 1.4px tracking */
      .eyebrow {
        font-size: var(--text-sm);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 1.4px;
        font-weight: 600;
        line-height: 1.43;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-5 > * + * { margin-block-start: var(--space-5); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — sharp 4px radius, terminal-grade ────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        border: 1px solid var(--surface);
        background: var(--surface);
        color: var(--fg);
        text-decoration: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Neon Primary — the eye-catching CTA: neon-on-black, hover inverts to dark */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
        padding: 0 16px;
        height: 40px;
      }
      .btn-primary:hover {
        background: var(--accent-hover);
        color: var(--accent);
      }
      .btn-primary:active { color: var(--accent-active); }
      /* Forest Green — the "Get Started" conversion button */
      .btn-success {
        background: var(--success);
        color: var(--fg);
        border-color: var(--surface);
      }
      .btn-success:hover { background: #3a3a3a; color: rgba(255, 255, 255, 0.8); }
      .btn-success:active { color: var(--accent-active); }
      /* Ghost / Outlined — olive-tinted border, transparent bg */
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: #4f5100;
        padding: 0 var(--space-8);
        height: 40px;
      }
      .btn-ghost:hover { background: var(--surface); }
      .btn-ghost:active { color: var(--accent-active); }
      /* Dark solid — standard action button */
      .btn-dark {
        background: var(--surface);
        color: var(--fg);
        border-color: var(--surface);
      }
      .btn-dark:hover { background: #3a3a3a; color: rgba(255, 255, 255, 0.8); }
      .btn-dark:active { color: var(--accent-active); }

      /* ─── Inputs — dark fill, charcoal border ───────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; color: var(--fg); }
      .field input {
        padding: 12px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — charcoal-bordered containment ─────────────── */
      .card {
        background: transparent;
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .card-neon {
        border-color: var(--accent);
      }
      .card-stat {
        background: transparent;
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
      }
      .stat-number {
        font-family: var(--font-display);
        font-size: var(--text-3xl);
        font-weight: 700;
        line-height: 1.0;
        color: var(--fg);
        letter-spacing: -0.02em;
      }
      .stat-number-accent { color: var(--accent); }
      .stat-label {
        margin-block-start: var(--space-3);
        font-size: var(--text-sm);
        color: var(--muted);
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.6;
        border: 1px solid var(--border);
      }
      .badge-success {
        color: var(--accent);
        background: color-mix(in oklab, var(--accent), transparent 92%);
        border-color: color-mix(in oklab, var(--accent), transparent 70%);
      }
      .badge-muted {
        color: var(--muted);
        background: var(--surface);
        border-color: var(--border-soft);
      }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links — always hover to neon ──────────────────────── */
      a { color: var(--fg); text-decoration: none; transition: color var(--motion-fast) var(--ease-standard); }
      a:hover { color: var(--accent); }
      .link-accent { color: var(--accent); }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600;
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--fg-2);
      }

      /* ─── Code block — Inconsolata, terminal aesthetic ──────── */
      .code-block {
        font-family: var(--font-mono);
        font-size: var(--text-base);
        font-weight: 600;
        line-height: var(--leading-body);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-4) var(--space-5);
        color: var(--fg);
        overflow-x: auto;
        white-space: pre;
      }
      .code-block .tok-kw { color: var(--accent); }
      .code-block .tok-com { color: var(--meta); }
      .code-block .tok-str { color: var(--fg-2); }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); align-items: stretch; }
      }
      .hero-actions {
        display: flex; gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-4);
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .stats-bar {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
        margin-block-start: var(--space-8);
      }
      @media (max-width: 639px) {
        .stats-bar { grid-template-columns: 1fr; }
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }
      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 440px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
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
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-5">
            <p class="eyebrow">Reference fixture · clickhouse</p>
            <h1>The fastest open-source OLAP database.</h1>
            <p class="lead" style="max-width: 56ch">
              Sub-second analytical queries over petabytes. A columnar engine built
              for real-time analytics, observability, and the agentic workloads of
              the next decade — running on commodity hardware.
            </p>
            <div class="hero-actions">
              
              
              
            </div>
          </div>
          <aside class="hero-meta" aria-label="Cluster status">
            <div class="row-between">
              <span class="body-sm body-muted">Cluster</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <pre class="code-block" aria-label="Sample query"><span class="tok-com">-- 1.2B rows · 38ms</span>
<span class="tok-kw">SELECT</span> country,
       <span class="tok-kw">count</span>(*) <span class="tok-kw">AS</span> hits
<span class="tok-kw">FROM</span>   events
<span class="tok-kw">WHERE</span>  ts &gt; <span class="tok-str">'2026-05-01'</span>
<span class="tok-kw">GROUP BY</span> country
<span class="tok-kw">ORDER BY</span> hits <span class="tok-kw">DESC</span>
<span class="tok-kw">LIMIT</span>  10;</pre>
            <p class="body-sm body-muted">Press <kbd>⌘</kbd> <kbd>K</kbd> to open the query palette.</p>
          </aside>
        </div>

        <div class="stats-bar" role="list">
          <article class="card-stat" role="listitem">
            <div class="stat-number stat-number-accent">100×</div>
            <p class="stat-label">Faster than row-oriented stores on analytical workloads.</p>
          </article>
          <article class="card-stat" role="listitem">
            <div class="stat-number">38<span style="font-size: var(--text-2xl); color: var(--muted)">ms</span></div>
            <p class="stat-label">P95 latency on 1.2B-row aggregations, single replica.</p>
          </article>
          <article class="card-stat" role="listitem">
            <div class="stat-number">2.2PB</div>
            <p class="stat-label">Largest production cluster — and growing every quarter.</p>
          </article>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 26ch">Engineered for the workloads other databases can't keep up with.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card card-neon">
            <p class="eyebrow" style="color: var(--accent)">Featured</p>
            <h3>Columnar at the core</h3>
            <p class="body-muted body-sm">
              A vectorized execution engine reads only the columns a query touches.
              Compression ratios of 10–100× shrink storage and accelerate scans.
            </p>
            
          </article>
          <article class="card">
            <h3>Real-time ingestion</h3>
            <p class="body-muted body-sm">
              Millions of rows per second per node. Kafka, S3, JDBC, HTTP —
              ingest from anywhere, query while writes are still in flight.
            </p>
            
          </article>
          <article class="card">
            <h3>SQL you already know</h3>
            <p class="body-muted body-sm">
              ANSI SQL plus a powerful expression library. Window functions,
              JSON, geospatial, arrays — every analytical primitive, native.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Spin up a cluster in 30 seconds.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Inputs use the same charcoal-bordered geometry as the cards. Focus
              ring is neon volt — unified interactive feedback across the system.
            </p>
            <p class="body-sm body-muted">
              Already running ClickHouse? <a href="#" class="link-accent">Connect an existing cluster</a>.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" autocomplete="email" required />
              <p class="field-help">We'll send your free-tier credentials and nothing else.</p>
            </div>
            <div class="field">
              <label for="region">Region</label>
              <input id="region" type="text" placeholder="us-east-1" value="us-east-1" />
              <p class="field-help">Pick a region close to your data sources for lowest latency.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-success">Create cluster</button>
              <button type="button" class="btn btn-ghost">View pricing</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=clickhouse_default;return module.exports}});
//# sourceMappingURL=client.clickhouse.js.map