
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.hashicorp.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var hashicorp_default={"contract":`## 1. Visual Theme & Atmosphere

HashiCorp's website is enterprise infrastructure made tangible — a design system that must communicate the complexity of cloud infrastructure management while remaining approachable. The visual language splits between two modes: a clean white light-mode for informational sections and a dramatic dark-mode (\`#15181e\`, \`#0d0e12\`) for hero areas and product showcases, creating a day/night duality that mirrors the "build in light, deploy in dark" developer workflow.

The typography is anchored by a custom brand font (HashiCorp Sans, loaded as \`__hashicorpSans_96f0ca\`) that carries substantial weight — literally. Headings use 600–700 weights with tight line-heights (1.17–1.19), creating dense, authoritative text blocks that communicate enterprise confidence. The hero headline at 82px weight 600 with OpenType \`"kern"\` enabled is not decorative — it's infrastructure-grade typography.

What distinguishes HashiCorp is its multi-product color system. Each product in the portfolio has its own brand color — Terraform purple (\`#7b42bc\`), Vault yellow (\`#ffcf25\`), Waypoint teal (\`#14c6cb\`), Vagrant blue (\`#1868f2\`) — and these colors appear throughout as accent tokens via a CSS custom property system (\`--mds-color-*\`). This creates a design system within a design system: the parent brand is black-and-white with blue accents, while each child product injects its own chromatic identity.

The component system uses the \`mds\` (Markdown Design System) prefix, indicating a systematic, token-driven approach where colors, spacing, and states are all managed through CSS variables. Shadows are remarkably subtle — dual-layer micro-shadows using \`rgba(97, 104, 117, 0.05)\` that are nearly invisible but provide just enough depth to separate interactive surfaces from the background.

**Key Characteristics:**
- Dual-mode: clean white sections + dramatic dark (\`#15181e\`) hero/product areas
- Custom HashiCorp Sans font with 600–700 weights and \`"kern"\` feature
- Multi-product color system via \`--mds-color-*\` CSS custom properties
- Product brand colors: Terraform purple, Vault yellow, Waypoint teal, Vagrant blue
- Uppercase letter-spaced captions (13px, weight 600, 1.3px letter-spacing)
- Micro-shadows: dual-layer at 0.05 opacity — depth through whisper, not shout
- Token-driven \`mds\` component system with semantic variable names
- Tight border radius: 2px–8px, nothing pill-shaped or circular
- System-ui fallback stack for secondary text

## 4. Component Stylings

### Buttons

**Primary Dark**
- Background: \`#15181e\`
- Text: \`#d5d7db\`
- Padding: 9px 9px 9px 15px (asymmetric, more left padding)
- Radius: 5px
- Border: \`1px solid rgba(178, 182, 189, 0.4)\`
- Shadow: \`rgba(97, 104, 117, 0.05) 0px 1px 1px, rgba(97, 104, 117, 0.05) 0px 2px 2px\`
- Focus: \`3px solid var(--mds-color-focus-action-external)\`
- Hover: uses \`--mds-color-surface-interactive\` token

**Secondary White**
- Background: \`#ffffff\`
- Text: \`#3b3d45\`
- Padding: 8px 12px
- Radius: 4px
- Hover: \`--mds-color-surface-interactive\` + low-shadow elevation
- Focus: \`3px solid transparent\` outline
- Clean, minimal appearance

**Product-Colored Buttons**
- Terraform: background \`#7b42bc\`
- Vault: background \`#ffcf25\` (dark text)
- Waypoint: background \`#14c6cb\`, hover \`#12b6bb\`
- Each product button follows the same structural pattern but uses its brand color

### Badges / Pills
- Background: \`#42225b\` (deep purple)
- Text: \`#efeff1\`
- Padding: 3px 7px
- Radius: 5px
- Border: \`1px solid rgb(180, 87, 255)\`
- Font: 16px

### Inputs

**Text Input (Dark Mode)**
- Background: \`#0d0e12\`
- Text: \`#efeff1\`
- Border: \`1px solid rgb(97, 104, 117)\`
- Padding: 11px
- Radius: 5px
- Focus: \`3px solid var(--mds-color-focus-action-external)\` outline

**Checkbox**
- Background: \`#0d0e12\`
- Border: \`1px solid rgb(97, 104, 117)\`
- Radius: 3px

### Links
- **Action Blue on Light**: \`#2264d6\`, hover → blue-600 variable, underline on hover
- **Action Blue on Dark**: \`#1060ff\` or \`#2b89ff\`, underline on hover
- **White on Dark**: \`#ffffff\`, transparent underline → visible underline on hover
- **Neutral on Light**: \`#3b3d45\`, transparent underline → visible underline on hover
- **Light on Dark**: \`#efeff1\`, similar hover pattern
- All links use \`var(--wpl-blue-600)\` as hover color

### Cards & Containers
- Light mode: white background, micro-shadow elevation
- Dark mode: \`#15181e\` or darker surfaces
- Radius: 8px for cards and containers
- Product showcase cards with gradient borders or accent lighting

### Navigation
- Clean horizontal nav with mega-menu dropdowns
- HashiCorp logo left-aligned
- system-ui 15px weight 500 for links
- Product categories organized by lifecycle management group
- "Get started" and "Contact us" CTAs in header
- Dark mode variant for hero sections

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 2px, 3px, 4px, 6px, 7px, 8px, 9px, 11px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Grid & Container
- Max content width: ~1150px (xl breakpoint)
- Full-width dark hero sections with contained content
- Card grids: 2–3 column layouts
- Generous horizontal padding at desktop scale

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <375px | Tight single column |
| Mobile | 375–480px | Standard mobile |
| Small Tablet | 480–600px | Minor adjustments |
| Tablet | 600–768px | 2-column grids begin |
| Small Desktop | 768–992px | Full nav visible |
| Desktop | 992–1120px | Standard layout |
| Large Desktop | 1120–1440px | Max-width content |
| Ultra-wide | >1440px | Centered, generous margins |

### Whitespace Philosophy
- **Enterprise breathing room**: Generous vertical spacing between sections (48px–80px+) communicates stability and seriousness.
- **Dense headings, spacious body**: Tight line-height headings sit above relaxed body text, creating visual "weight at the top" of each section.
- **Dark as canvas**: Dark hero sections use extra vertical padding to let 3D illustrations and gradients breathe.

### Border Radius Scale
- Minimal (2px): Links, small inline elements
- Subtle (3px): Checkboxes, small inputs
- Standard (4px): Secondary buttons
- Comfortable (5px): Primary buttons, badges, inputs
- Card (8px): Cards, containers, images

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Default surfaces, text blocks |
| Whisper (Level 1) | \`rgba(97, 104, 117, 0.05) 0px 1px 1px, rgba(97, 104, 117, 0.05) 0px 2px 2px\` | Cards, buttons, interactive surfaces |
| Focus (Level 2) | \`3px solid var(--mds-color-focus-action-external)\` outline | Focus rings — color-matched to context |

**Shadow Philosophy**: HashiCorp uses arguably the subtlest shadow system in modern web design. The dual-layer shadows at 5% opacity are nearly invisible — they exist not to create visual depth but to signal interactivity. If you can see the shadow, it's too strong. This restraint communicates the enterprise value of stability — nothing floats, nothing is uncertain.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <768px | Single column, hamburger nav, stacked CTAs |
| Tablet | 768–992px | 2-column grids, nav begins expanding |
| Desktop | 992–1150px | Full layout, mega-menu nav |
| Large | >1150px | Max-width centered, generous margins |

### Collapsing Strategy
- Hero: 82px → 52px → 42px heading sizes
- Navigation: mega-menu → hamburger
- Product cards: 3-column → 2-column → stacked
- Dark sections maintain full-width but compress padding
- Buttons: inline → full-width stacked on mobile`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HashiCorp — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/hashicorp. Dramatic near-black
        canvas (#15181e), HashiCorp Sans at 82px display with kerning enabled,
        whisper-level dual-layer shadows, single functional blue accent.
        Every visible value comes from tokens.css."
    />

    <style>
      :root {
        --bg: #15181e;
        --surface: #0d0e12;
        --surface-warm: var(--surface);

        --fg: #efeff1;
        --fg-2: #d5d7db;
        --muted: #b2b6bd;
        --meta: #656a76;

        --border: rgba(178, 182, 189, 0.4);
        --border-soft: rgba(178, 182, 189, 0.15);

        --accent: #1060ff;
        --accent-on: #ffffff;
        --accent-hover: #2b89ff;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #bb5a00;
        --danger: #dc2626;

        --font-display: "HashiCorp Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 13px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 20px;
        --text-xl: 26px;
        --text-2xl: 42px;
        --text-3xl: 52px;
        --text-4xl: 82px;

        --leading-body: 1.63;
        --leading-tight: 1.17;
        --tracking-display: normal;

        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet: 56px;
        --section-y-phone: 40px;

        --radius-sm: 5px;
        --radius-md: 8px;
        --radius-lg: 8px;
        --radius-pill: 5px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised:
          rgba(97, 104, 117, 0.05) 0px 1px 1px,
          rgba(97, 104, 117, 0.05) 0px 2px 2px;

        --focus-ring: 0 0 0 3px var(--accent);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 1150px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 16px;
        --container-gutter-phone: 12px;
      }

      /* ─── Reset ─────────────────────────────────────────────── */
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg-2);
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
      section + section { border-top: 1px solid var(--border-soft); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — HashiCorp Sans for headings, system-ui for body ─ */
      h1, h2, h3 {
        font-family: var(--font-display);
        color: var(--fg);
        margin: 0;
        line-height: var(--leading-tight);
        font-feature-settings: "kern";       /* DESIGN.md §3: kern always on */
      }
      h1 {
        font-size: var(--text-4xl);
        font-weight: 600;                    /* DESIGN.md hero: 600 */
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        font-weight: 600;                    /* DESIGN.md section heading: 600 */
        line-height: 1.19;
      }
      h3 {
        font-size: var(--text-xl);
        font-weight: 700;                    /* DESIGN.md card title: 700 */
        line-height: 1.19;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.50;
        color: var(--fg-2);
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .body-meta { color: var(--meta); font-size: var(--text-sm); }

      /* DESIGN.md §3 uppercase wayfinding label.
         13px HashiCorp Sans weight 600, 1.3px tracking. */
      .eyebrow {
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 600;
        line-height: 1.69;
        letter-spacing: 1.3px;
        text-transform: uppercase;
        color: var(--muted);
        font-feature-settings: "kern";
      }

      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — DESIGN.md §4 ─────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn:active { transform: translateY(0.5px); }

      /* Primary Dark — DESIGN.md §4: asymmetric 9px 9px 9px 15px padding,
         5px radius, 1px border at rgba(178,182,189,0.4), whisper shadow. */
      .btn-primary {
        background: var(--bg);
        color: var(--fg-2);
        padding: 9px 9px 9px 15px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        box-shadow: var(--elev-raised);
      }
      .btn-primary:hover {
        background: color-mix(in oklab, var(--bg), white 4%);
        color: var(--fg);
      }

      /* Secondary White — DESIGN.md §4: 4px radius, 8px 12px padding,
         clean white surface on the dark canvas. */
      .btn-secondary {
        background: #ffffff;
        color: #3b3d45;                      /* DESIGN.md Charcoal text on white */
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid transparent;
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, #ffffff, black 4%);
        box-shadow: var(--elev-raised);
      }

      /* CTA Accent — Action Blue, reserved for the single highest-signal
         CTA on the page. Hard cap of ≤2 visible accent uses per screen. */
      .btn-accent {
        background: var(--accent);
        color: var(--accent-on);
        padding: 9px 15px;
        border-radius: var(--radius-sm);
        border: 1px solid transparent;
        box-shadow: var(--elev-raised);
      }
      .btn-accent:hover { background: var(--accent-hover); }
      .btn-accent:active { background: var(--accent-active); }

      /* ─── Inputs — dark mode .uma-preview-form fields ─────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg-2);
      }
      .field input {
        background: var(--surface);
        color: var(--fg);
        border: 1px solid var(--meta);       /* DESIGN.md §4: rgb(97,104,117) — same hue as --meta */
        border-radius: var(--radius-sm);
        padding: 11px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--meta); }

      /* ─── Cards — DESIGN.md §4 ───────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-raised);      /* whisper shadow — barely there */
      }

      /* ─── Badges — 5px radius, deep purple per DESIGN.md ─────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 3px 7px;                    /* DESIGN.md §4 badge padding */
        border-radius: var(--radius-pill);   /* 5px, not 9999px — see tokens.css */
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1.4;
      }
      .badge-status {
        background: color-mix(in oklab, var(--success), transparent 80%);
        color: color-mix(in oklab, var(--success), white 30%);
        border: 1px solid color-mix(in oklab, var(--success), transparent 60%);
      }
      .badge-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
      }

      /* ─── Links ──────────────────────────────────────────────── */
      a {
        color: var(--accent-hover);          /* Bright Blue — DESIGN.md links on dark */
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color var(--motion-fast) var(--ease-standard);
      }
      a:hover { border-bottom-color: currentColor; }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: 3px;                  /* DESIGN.md "Subtle" 3px radius */
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg-2);
      }

      /* ─── Layout helpers ─────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
        h1 { font-size: var(--text-3xl); }   /* 82 → 52 collapse per DESIGN.md §8 */
      }
      @media (max-width: 639px) {
        h1 { font-size: var(--text-2xl); }   /* 52 → 42 collapse per DESIGN.md §8 */
      }

      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }

      .hero-meta {
        display: flex; flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-5);
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }

      .form-row {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex; flex-direction: column;
        gap: var(--space-4);
        max-width: 420px;
      }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }

      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between {
        display: flex; align-items: center; justify-content: space-between;
        gap: var(--space-3);
      }
      .mono { font-family: var(--font-mono); font-size: var(--text-sm); color: var(--muted); }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- HERO ───────────────────────────────────────────────── -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · hashicorp</p>
            <h1>Infrastructure for any application, on any cloud.</h1>
            <p class="lead" style="max-width: 52ch">
              Provision, secure, connect, and run any application on any
              infrastructure. The HashiCorp Cloud Platform unifies Terraform,
              Vault, Consul, and Nomad behind one operating model — built for
              the platform teams who run production.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside class="hero-meta" aria-label="Platform status">
            <p class="eyebrow">Platform status</p>
            <div class="row-between">
              <span class="body-sm">HCP control plane</span>
              <span class="badge badge-status">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <div class="row-between">
              <span class="body-sm">Terraform Cloud</span>
              <span class="badge badge-status">
                <span class="badge-dot" aria-hidden="true"></span>
                Operational
              </span>
            </div>
            <p class="body-meta">
              SOC 2 Type II · ISO 27001 · v1.0
              · <time datetime="2026-05-15">2026-05-15</time>
            </p>
            <p class="body-meta">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to search the docs.
            </p>
          </aside>
        </div>
      </section>

      <!-- FEATURES ────────────────────────────────────────────── -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">What this fixture exercises</p>
          <h2 style="max-width: 24ch">One operating model for cloud, not many.</h2>
        </div>

        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card stack-3">
            <h3>Provision with Terraform</h3>
            <p class="body-sm body-muted">
              Infrastructure as code across AWS, Azure, GCP, and 3,000+
              providers. Reproducible environments, drift detection, and
              policy as code — the platform layer for every team.
            </p>
            <p class="mono">terraform apply</p>
          </article>
          <article class="card stack-3">
            <h3>Secure with Vault</h3>
            <p class="body-sm body-muted">
              Identity-based secrets management and zero-trust security.
              Dynamic credentials, automatic rotation, encryption as a
              service — the same primitives behind production at scale.
            </p>
            <p class="mono">vault kv get secret/api</p>
          </article>
          <article class="card stack-3">
            <h3>Connect with Consul</h3>
            <p class="body-sm body-muted">
              Service mesh and service discovery across any runtime and
              any cloud. mTLS by default, intentions, and traffic shaping —
              network automation without the YAML.
            </p>
            <p class="mono">consul services register</p>
          </article>
        </div>
      </section>

      <!-- FORM ────────────────────────────────────────────────── -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Get started</p>
            <h2>Spin up your first workspace.</h2>
            <p class="body-muted" style="max-width: 48ch">
              Free tier includes Terraform Cloud, Vault Secrets, and HCP
              Boundary. Bring your own cloud account or use HCP-managed
              infrastructure — production-grade defaults, day one.
            </p>
            <p class="body-meta">
              By signing up you agree to the 
              and .
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com"
                     autocomplete="email" required />
              <p class="field-help">We'll send a verification link — nothing else.</p>
            </div>
            <div class="field">
              <label for="org">Organization name</label>
              <input id="org" type="text" placeholder="acme-platform"
                     autocomplete="organization" />
              <p class="field-help">Lowercase, hyphen-separated. Used in resource paths.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-accent">Create workspace</button>
              <button type="button" class="btn btn-primary">View pricing</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=hashicorp_default;return module.exports}});
//# sourceMappingURL=client.hashicorp.js.map