
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.bmw-m.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var bmw_m_default={"contract":'## 1. Visual Theme & Atmosphere\nBMW M\'s analyzed editorial and marketing pages lean on a near-pure black canvas (`{colors.canvas}` — #000) holding white BMW Type Next Latin headlines in **confident UPPERCASE**. The system has no decorative voltage of its own; brand energy comes from **full-bleed automotive photography** — cars cornering at speed, carbon-fiber wheel detail, driver cockpit shots, motorsport pit lanes — placed as edge-to-edge content that fills entire bands. UI chrome around the photography stays minimal: thin sans-serif copy, dividers as 1px hairlines (`{colors.hairline}`), all-caps button labels with no fill until hovered.\n\nThe **M tricolor stripe** — `{colors.m-blue-light}` (#0066b1) → `{colors.m-blue-dark}` (#1c69d4) → `{colors.m-red}` (#e22718) — appears sparingly as the brand\'s signature accent, used on the M wordmark, motorsport chrome, vehicle-tech callouts, and model badges. It is never a CTA color and never used as a background fill — the tricolor is exclusively a brand-identity marker.\n\nType voice should stay aligned with the broader BMW family system: BMW Type Next Latin Light carries the large editorial display voice, while BMW Type Next Latin regular carries body and UI text. BMW M can use heavier uppercase weights for buttons, labels, cards, and emphasis, but agents should not treat a 700/300 split as a universal BMW M rule without page-specific evidence.\n\n**Key Characteristics:**\n- Near-pure black canvas (`{colors.canvas}` — #000) with white type across the analyzed editorial and marketing pages. Configurator, account, checkout, and order-management flows are unresolved and may introduce light surfaces.\n- Display headlines use UPPERCASE BMW Type Next Latin Light when following the BMW family system. Heavier uppercase settings are reserved for labels, buttons, card titles, and observed M-specific emphasis.\n- M tricolor (`{colors.m-blue-light}` / `{colors.m-blue-dark}` / `{colors.m-red}`) used as 4px brand-stripe dividers, M-wordmark accents, and motorsport chrome — never as buttons or fills.\n- Photography fills entire bands edge-to-edge. Cars are always the visual subject; UI chrome backs off to small white labels overlaid on photography.\n- Buttons are flat with 0px corners and uppercase letterspaced labels. The "industrial precision" rectangular silhouette IS the brand.\n- Border radius is mostly zero across the system. The few exceptions are circular icon buttons such as carousel arrows and any confirmed small toggle pills.\n- Spacing is generous and grid-aligned: `{spacing.section}` (96px) between major bands; `{spacing.xxl}` (64px) inside hero photo bands; `{spacing.xl}` (40px) inside content cards.\n\n## 4. Component Stylings\n### Top Navigation\n\n**`top-nav`** — Black nav bar pinned to the top of every page. 64px tall, `{colors.canvas}` background. Carries the BMW M logo at left (M tricolor + BMW roundel + "M" wordmark), primary horizontal menu (Models, Topics, Magazine, Configurator, Fastlane), right-side cluster with language selector, search icon, account icon. Menu items render in `{typography.nav-link}` with sentence-case labels.\n\n### Buttons\n\n**`button-primary`** — The signature primary CTA. Background `{colors.canvas}` (or transparent over photography), text `{colors.on-dark}` (white), 1px white border outline, 0px radius, padding 16px × 32px, height 48px. Type `{typography.button}` — uppercase 14px / 700 / 1.5px tracking. The rectangular silhouette and uppercase letterspaced label IS the brand button.\n\n**`button-primary-outline`** — Same shape as primary but with transparent background and white outline only. Used over photography where a filled button would clash with the image.\n\n**`button-on-light`** — Tentative pattern for unresolved light-surface contexts such as configurator, account, checkout, or order dialogs. Background `{colors.canvas}`, text `{colors.on-dark}` — black button with white text, inverted from the dark-canvas default. Confirm against the specific flow before treating it as canonical.\n\n**`button-icon`** — Circular icon buttons (carousel controls, share, favorite). 48 × 48px, background `{colors.surface-card}`, white icon centered, full-circle radius. The only non-rectangular button shape in the system.\n\n**`carousel-arrow`** — Specific 48 × 48 circular arrow used in photo carousels. Same shape as `button-icon` with chevron glyph.\n\n**`text-link`** — Inline uppercase letterspaced links ("VIEW ALL MODELS", "READ MORE"). `{typography.label-uppercase}`, white on dark, no underline. The chevron arrow → glyph appears next to most link labels.\n\n### Cards & Containers\n\n**`hero-photo-band`** — Full-width black band with full-bleed automotive photography filling most of the frame. The h1 uses `{typography.display-xl}` and sits left-aligned over the photo, often with a small subtitle in `{typography.body-md}` below. Vertical padding `{spacing.xxl}` (64px). No card frame — the photo IS the band.\n\n**`feature-photo-card`** — Used in 3-up grids for "MORE FROM BMW M MAGAZINE" and similar editorial sections. Background `{colors.surface-card}`, 0px radius, internal padding `{spacing.lg}` (24px). Top half of the card is a 16:9 photo (full-bleed within the card); below the photo, a category tag in `{typography.label-uppercase}`, a `{typography.title-lg}` title, and a short body description.\n\n**`model-card`** — Used in the "MORE NEW M MODELS" 3-up grid. Background `{colors.canvas}` (no card surface — just photo on black), 0px radius. Top: 16:10 hero shot of the model. Below: model name in `{typography.display-md}`, short specs line in `{typography.body-sm}`, a `text-link` ("EXPLORE THIS MODEL").\n\n**`magazine-article-card`** — A more text-forward card variant used on the magazine overview page. Background `{colors.canvas}` with hairline border, 0px radius. Carries a small thumbnail at top, a category label in `{typography.label-uppercase}`, headline in `{typography.title-lg}`, and a body excerpt.\n\n**`spec-cell`** — Technical specification cells used on model-detail pages (engine specs, weight, top speed, 0-100 time). Background `{colors.surface-soft}` (#0d0d0d), 0px radius, padding `{spacing.lg}` (24px). Each cell holds a value in `{typography.display-sm}` at top and a label in `{typography.label-uppercase}` below.\n\n**`motorsport-photo-card`** — Edge-to-edge photo cards used in the racing-team / motorsport sections. No card surface — just a full-bleed photograph with a small overlay caption in white text at the bottom-left. The photography IS the brand here.\n\n**`chatbot-launcher`** — A right-side card-style entry point ("BMW M CHATBOT") on the homepage. Background `{colors.surface-card}`, 0px radius, padding `{spacing.lg}` (24px). Carries an h3 title, a short prompt, and a `button-primary` to launch.\n\n**`category-tab`** + **`category-tab-active`** — The category selector tabs used on the magazine and topics pages (e.g., "ALL · MAGAZINE · MODELS · LIFESTYLE · MOTORSPORT"). Tabs render as text-only labels in `{typography.label-uppercase}`. Active state changes text color from `{colors.body}` to `{colors.on-dark}` and adds a 2px white underline below the label. No background fill, no rounded corners.\n\n### Inputs & Forms\n\n**`text-input`** — Standard text input on dark surfaces. Background `{colors.surface-card}`, text `{colors.on-dark}`, type `{typography.body-md}`, 0px radius, padding 12px × 16px, height 48px. 1px hairline border. Focus state thickens the border to white.\n\n**`cookie-consent-card`** — A right-side cookie-banner card visible on the homepage. Background `{colors.canvas}` with 1px hairline, 0px radius, padding `{spacing.lg}` (24px). Body text in `{typography.body-sm}`. Two buttons stacked at bottom: primary outline + text-link.\n\n### Signature Components\n\n**`m-stripe-divider`** — The 4px horizontal stripe carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used as a divider on motorsport chrome, between brand-identity sections, and as a hover-state indicator on category tabs. The most distinctive non-typographic element in the system.\n\n**`cta-band-photo`** — A pre-footer "Drive an M" CTA band carrying full-bleed photography of a car cornering on a track, with a centered headline in `{typography.display-md}` and a `button-primary-outline` below. Vertical padding 80px. The CTA inherits the editorial gravity of the rest of the page through full-bleed photography rather than chrome.\n\n### Footer\n\n**`footer`** — Black footer observed on analyzed marketing pages. Background `{colors.canvas}`, text `{colors.body}`. 4-column link list at desktop covering BMW M Models / BMW M Lifestyle / Owners / Company. Vertical padding 64px. Bottom row carries the BMW corporate disclaimer in `{typography.caption}` and language selector. Treat black footer behavior as confirmed for editorial/marketing pages, not for unresolved account or checkout flows.\n\n## 5. Layout Principles\n### Spacing System\n- **Base unit:** 4px.\n- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 40px · `{spacing.xxl}` 64px · `{spacing.section}` 96px.\n- **Section padding (vertical):** `{spacing.section}` (96px) between major editorial bands.\n- **Hero photo bands:** `{spacing.xxl}` (64px) internal vertical padding around the hero h1 + sub-headline pair.\n- **Card internal padding:** `{spacing.lg}` (24px) for content and model cards; `{spacing.xl}` (40px) for spec-cell tables.\n- **Gutters:** `{spacing.lg}` (24px) between cards in 3-up grids; `{spacing.md}` (16px) inside footer columns.\n\n### Grid & Container\n- **Max content width:** ~1440px centered on marketing pages — wider than typical SaaS to give photography breathing room.\n- **Editorial body:** Single 12-column grid; photo bands bleed full-bleed (no max-width).\n- **Card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.\n- **Footer:** 4-column link list at desktop, 2-up at tablet, 1-up at mobile.\n\n### Whitespace Philosophy\nBMW M trusts photography to do the visual work. Whitespace around photography is restrained — the cars fill the frame, and copy sits below or beside them in tightly-aligned columns. Where whitespace appears (between body sections, around CTAs), it\'s always uniform `{spacing.section}` (96px). The system should avoid decorative atmospheric backdrops and ornamental gradients; functional contrast scrims are allowed when photo crops would make white text fail contrast.\n\n## 6. Depth & Elevation\n| Level | Treatment | Use |\n|---|---|---|\n| Flat | No shadow, no border | Body sections, top nav, footer, photo bands |\n| Soft hairline | 1px `{colors.hairline}` border | Section dividers, card outlines, table rows |\n| Card surface | `{colors.surface-card}` background over canvas — no shadow | Feature photo cards, magazine cards, chatbot launcher |\n| Photographic depth | Full-bleed photography with edge-to-edge crop | Hero bands, motorsport features — depth via subject matter, not chrome |\n\nThe system uses no drop shadows and no layered chrome. Depth comes entirely from photography (subject + lens + lighting) and the contrast between black canvas and slightly-elevated `{colors.surface-card}`.\n\n### Decorative Depth\n- **M Stripe Divider** (`m-stripe-divider`): A 4px-tall horizontal divider carrying the M tricolor (`{colors.m-blue-light}` → `{colors.m-blue-dark}` → `{colors.m-red}`). Used on motorsport chrome, model-detail headers, and brand-identity moments. The stripe is the system\'s only true "decorative" element — used sparingly to mark significance.\n- **Carbon-fiber surfaces**: The technical-spec page uses `{colors.carbon-gray}` (#2b2b2b) cells with subtle texture overlay. This is a single-page treatment, not a system-wide pattern.\n- **Photographic depth**: Full-bleed cars are the depth. Lighting in the photography (track lights, sunset rim-light) does the elevation work that drop shadows would do in a SaaS system.\n\n## 8. Responsive Behavior\n### Breakpoints\n\n| Name | Width | Key Changes |\n|---|---|---|\n| Mobile | < 768px | Hamburger nav; hero h1 scales 80→48px; demo grid 1-up; photo cards stack full-width; footer 4 cols → 1 |\n| Tablet | 768–1024px | Top nav stays horizontal but tightens; 2-up card grids; spec tables 2-up |\n| Desktop | 1024–1440px | Full top-nav; 3-up card grids; spec tables 4-up |\n| Wide | > 1440px | Same as desktop with more breathing room; max content 1440px |\n\n### Touch Targets\n- `button-primary` renders at 48 × 48px minimum where possible; never go below a 44 × 44px pointer target.\n- `button-icon` and `carousel-arrow` are exactly 48 × 48px — comfortably above the 44 × 44px minimum.\n- `text-input` height is 48px.\n- Category tabs render as text-only labels with at least 12px vertical padding and enough horizontal spacing to create a 44px minimum effective tap area.\n\n### Text Over Photography & Focus\n- White body text over photography must meet at least 4.5:1 contrast; large display text and icon strokes must meet at least 3:1.\n- First choice is crop discipline: place text over dark track, shadow, cockpit, or black bodywork regions. Avoid placing text over sky, headlights, white paint, concrete, or reflective highlights.\n- If crop discipline is not enough, use a functional black scrim (`rgba(0,0,0,0.45)` to `rgba(0,0,0,0.70)`) behind the text area. A left-to-right scrim is acceptable only as an accessibility layer, not as decoration.\n- If a scrim still fails contrast, move copy into a solid `{colors.canvas}` panel with 24px minimum padding.\n- Focus visibility on black or photo backgrounds must use a 2px white outline plus a 2px offset ring in `{colors.electric-blue}`. On light unresolved surfaces, invert to a 2px `{colors.electric-blue}` outline with visible offset.\n\n### Collapsing Strategy\n- Top nav collapses to a hamburger sheet at < 768px; the menu opens as a full-screen black overlay with the M tricolor stripe at the top.\n- Photography stays full-bleed at every breakpoint — never collapses to a margin\'d container.\n- Card grids reduce columns rather than scaling cards down; photography retains its native aspect ratio.\n- Spec tables collapse from 4-up to 2-up to 1-up; spec values stay at `{typography.display-sm}` regardless of column count.\n- The M-stripe divider stays at 4px height across all breakpoints.\n\n### Image Behavior\n- Hero photography crops responsively — wider crops at desktop, vertical crops on mobile.\n- Lifestyle and motorsport photos retain native aspect ratios; the system never letterboxes or pillarboxes.\n- The M wordmark + tricolor logo scales proportionally with viewport width.',"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>BMW M - reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/bmw-m: precise motorsport interface with white engineering calm and sharp M color signals."
    />
    <style>
      :root {
        --bg: #f7f8fa;
        --surface: #ffffff;
        --surface-warm: #eef3f8;
        --fg: #111827;
        --fg-2: #334155;
        --muted: #64748b;
        --meta: #0066b1;
        --border: #d7dee8;
        --border-soft: #edf1f6;
        --accent: #0066b1;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);
        --success: #16a34a;
        --warn: #f59e0b;
        --danger: #e4002b;
        --font-display: "BMWTypeNext", "Helvetica Neue", Arial, sans-serif;
        --font-body: "BMWTypeNext", "Helvetica Neue", Arial, sans-serif;
        --font-mono: "SF Mono", ui-monospace, Menlo, monospace;
        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 36px;
        --text-3xl: 56px;
        --text-4xl: 78px;
        --leading-body: 1.5;
        --leading-tight: 1.02;
        --tracking-display: -0.025em;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 20px;
        --space-6: 24px;
        --space-8: 32px;
        --space-12: 48px;
        --section-y-desktop: 104px;
        --section-y-tablet: 76px;
        --section-y-phone: 52px;
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 14px;
        --radius-pill: 9999px;
        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 22px 56px rgba(17, 24, 39, 0.12);
        --focus-ring: 0 0 0 4px rgba(0, 102, 177, 0.24);
        --motion-fast: 130ms;
        --motion-base: 220ms;
        --ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
        --container-max: 1220px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet: 28px;
        --container-gutter-phone: 18px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        min-height: 100vh;
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        -webkit-font-smoothing: antialiased;
      }
      .page {
        min-height: 100vh;
        background: linear-gradient(135deg, #f7f8fa 0%, #ffffff 52%, #dbeafe 100%);
      }
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }
      h1, h2, h3, p { margin: 0; }
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h1 { max-width: 820px; font-size: var(--text-4xl); font-weight: 700; }
      h2 { font-size: var(--text-3xl); font-weight: 650; }
      h3 { font-size: var(--text-xl); font-weight: 650; }
      .eyebrow {
        color: var(--meta);
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .lead {
        max-width: 620px;
        color: var(--fg-2);
        font-size: var(--text-lg);
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        gap: var(--space-8);
        align-items: center;
      }
      .stack > * + * { margin-block-start: var(--space-4); }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 var(--space-5);
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        font: 700 var(--text-sm) / 1 var(--font-body);
        text-decoration: none;
        cursor: pointer;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
      .btn-secondary { background: var(--surface); color: var(--fg); border-color: var(--border); box-shadow: var(--elev-ring); }
      .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
      .panel {
        background: color-mix(in oklab, var(--surface), transparent 4%);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        box-shadow: var(--elev-raised);
        overflow: hidden;
      }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-5);
        border-bottom: 1px solid var(--border-soft);
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--meta);
        font: 700 var(--text-xs) / 1 var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .status::before {
        width: 8px;
        height: 8px;
        border-radius: var(--radius-pill);
        background: var(--success);
        content: "";
      }
      .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        border-bottom: 1px solid var(--border-soft);
      }
      .metric {
        padding: var(--space-5);
        border-right: 1px solid var(--border-soft);
      }
      .metric:last-child { border-right: 0; }
      .metric strong {
        display: block;
        font-family: var(--font-display);
        font-size: var(--text-2xl);
        line-height: var(--leading-tight);
      }
      .metric span { color: var(--muted); font-size: var(--text-sm); }
      .card-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        padding: var(--space-5);
      }
      .mini-card {
        min-height: 148px;
        padding: var(--space-5);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        background: var(--surface-warm);
      }
      .mini-card p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      .swatches {
        display: flex;
        gap: var(--space-2);
        margin-block-start: var(--space-4);
      }
      .swatch {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
      }
      .swatch.accent { background: var(--accent); }
      .swatch.surface { background: var(--surface); }
      .swatch.warm { background: var(--surface-warm); }
      .swatch.fg { background: var(--fg); }
      .field {
        display: grid;
        gap: var(--space-2);
        margin-block-start: var(--space-5);
      }
      label { color: var(--fg-2); font-size: var(--text-sm); font-weight: 700; }
      input {
        width: 100%;
        min-height: 46px;
        padding: 0 var(--space-4);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--surface);
        color: var(--fg);
        font: inherit;
      }
      input:focus { outline: none; box-shadow: var(--focus-ring); border-color: var(--accent); }
      .lower {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .tile {
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .tile p { color: var(--muted); font-size: var(--text-sm); margin-block-start: var(--space-3); }
      @media (max-width: 860px) {
        .hero, .lower { grid-template-columns: 1fr; }
        .metric-grid, .card-row { grid-template-columns: 1fr; }
        .metric { border-right: 0; border-bottom: 1px solid var(--border-soft); }
        .metric:last-child { border-bottom: 0; }
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
    <main class="page">
      <section>
        <div class="container hero">
          <div class="stack">
            <p class="eyebrow">BMW M design system</p>
            <h1>Motorsport cockpit</h1>
            <p class="lead">White engineering surfaces, M-stripe accents, and track-day telemetry.</p>
            <div class="actions" aria-label="Reference actions">
              <a class="btn btn-primary" href="#">Primary motorsport blue CTA</a>
              <a class="btn btn-secondary" href="#">Secondary action</a>
            </div>
          </div>
          <article class="panel" aria-label="BMW M component preview">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Live module</p>
                <h3>track telemetry module</h3>
              </div>
              <span class="status">online</span>
            </div>
            <div class="metric-grid">
              <div class="metric"><strong>98%</strong><span>Signal quality</span></div>
              <div class="metric"><strong>24</strong><span>Active flows</span></div>
              <div class="metric"><strong>3.2s</strong><span>Response time</span></div>
            </div>
            <div class="card-row">
              <div class="mini-card">
                <h3>Palette</h3>
                <p>precise motorsport interface with white engineering calm and sharp M color signals.</p>
                <div class="swatches" aria-label="Token swatches">
                  <span class="swatch accent"></span>
                  <span class="swatch surface"></span>
                  <span class="swatch warm"></span>
                  <span class="swatch fg"></span>
                </div>
              </div>
              <div class="mini-card">
                <h3>Control</h3>
                <p>Focus, hover, and status states share the same brand signal.</p>
                <div class="field">
                  <label for="bmw-m-input">Reference input</label>
                  <input id="bmw-m-input" value="BMW M system token" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section>
        <div class="container lower">
          <article class="tile">
            <p class="eyebrow">Typography</p>
            <h2>Display rhythm</h2>
            <p>Headlines use the brand display stack with the declared scale and leading.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Surface</p>
            <h2>Layer system</h2>
            <p>Cards, warm panels, borders, and raised states resolve through shared tokens.</p>
          </article>
          <article class="tile">
            <p class="eyebrow">Interaction</p>
            <h2>Motion states</h2>
            <p>Buttons, inputs, and panels use brand-specific focus rings and easing.</p>
          </article>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=bmw_m_default;return module.exports}});
//# sourceMappingURL=client.bmw-m.js.map