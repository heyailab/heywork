
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.runwayml.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var runwayml_default={"contract":`## 1. Visual Theme & Atmosphere

Runway's interface is a cinematic reel brought to life as a website — a dark, editorial, film-production-grade design where full-bleed photography and video ARE the primary UI elements. This is not a typical tech product page; it's a visual manifesto for AI-powered creativity. Every section feels like a frame from a film: dramatic lighting, sweeping landscapes, and intimate human moments captured in high-quality imagery that dominates the viewport.

The design language is built on a single typeface — abcNormal — a clean, geometric sans-serif that handles everything from 48px display headlines to 11px uppercase labels. This single-font commitment creates an extreme typographic uniformity that lets the visual content speak louder than the text. Headlines use tight line-heights (1.0) with negative letter-spacing (-0.9px to -1.2px), creating compressed text blocks that feel like film titles rather than marketing copy.

What makes Runway distinctive is its complete commitment to visual content as design. Rather than illustrating features with icons or diagrams, Runway shows actual AI-generated and AI-enhanced imagery — cars driving through cinematic landscapes, artistic portraits, architectural renders. The interface itself retreats into near-invisibility: minimal borders, zero shadows, subtle cool-gray text, and a dark palette that puts maximum focus on the photography.

**Key Characteristics:**
- Cinematic full-bleed photography and video as primary UI elements
- Single typeface system: abcNormal for everything from display to micro labels
- Dark-dominant palette with cool-toned neutrals (#767d88, #7d848e)
- Zero shadows, minimal borders — the interface is intentionally invisible
- Tight display typography (line-height 1.0) with negative tracking (-0.9px to -1.2px)
- Uppercase labels with positive letter-spacing for navigational structure
- Weight 450 (unusual intermediate) for small uppercase text — precision craft
- Editorial magazine layout with mixed-size image grids

## 4. Component Stylings

### Buttons
- Text: weight 600 at 14px abcNormal
- Background: likely transparent or dark, with minimal border
- Radius: small (4px) for button-like links
- The button design is extremely restrained — no heavy fills or borders detected
- Interactive elements blend into the editorial flow

### Cards & Containers
- Background: transparent or Dark Surface (\`#1a1a1a\`)
- Border: \`1px solid #27272a\` (dark mode) — barely visible containment
- Radius: small (4–8px) for functional elements; 16px for alert-style containers
- Shadow: zero — no shadows on any element
- Cards are primarily photographic — the image IS the card

### Navigation
- Minimal horizontal nav — transparent over hero content
- Logo: Runway wordmark in white/black
- Links: abcNormal at 16px, weight 400–600
- Hover: text shifts to white or higher opacity
- Extremely subtle — designed to not compete with visual content

### Image Treatment
- Full-bleed cinematic photography and video dominate
- AI-generated content shown at large scale as primary visual elements
- Mixed-size image grids creating editorial magazine layouts
- Dark overlays on hero images for text readability
- Product screenshots with subtle rounded corners (8px)

### Distinctive Components

**Cinematic Hero**
- Full-viewport image or video with text overlay
- Headline in 48px abcNormal, white on dark imagery
- The image is always cinematic quality — film-grade composition

**Research Article Cards**
- Photographic thumbnails with article titles
- Mixed-size grid layout (large feature + smaller supporting)
- Clean text overlay or below-image caption style

**Trust Bar**
- Company logos (leading organizations across industries)
- Clean, monochrome treatment
- Horizontal layout with generous spacing

**Mission Statement**
- "We are building AI to simulate the world through imagination, art and aesthetics"
- On a dark background with white text
- The emotional close — artistic and philosophical

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 6px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 48px, 64px, 78px
- Section vertical spacing: generous (48–78px)
- Component gaps: 16–24px

### Grid & Container
- Max container width: up to 1600px (cinema-wide)
- Hero: full-viewport, edge-to-edge
- Content sections: centered with generous margins
- Image grids: asymmetric, magazine-style mixed sizes
- Footer: full-width dark section

### Whitespace Philosophy
- **Cinema-grade breathing**: Large vertical gaps between sections create a scrolling experience that feels like watching scenes change.
- **Images replace whitespace**: Where other sites use empty space, Runway fills it with photography. The visual content IS the breathing room.
- **Editorial grid asymmetry**: The image grid uses intentionally varied sizes — large hero images paired with smaller supporting images, creating visual rhythm.

### Border Radius Scale
- Sharp (4px): Buttons, small interactive elements
- Subtle (6px): Links, small containers
- Comfortable (8px): Standard containers, image cards
- Generous (16px): Alert-style containers, featured elements

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Everything — the dominant state |
| Bordered (Level 1) | \`1px solid #27272a\` | Alert containers only |
| Dark Section (Level 2) | Dark bg (#000000 / #1a1a1a) with light text | Hero, features, footer |
| Light Section (Level 3) | White/Cool Cloud bg with dark text | Content sections, research |

**Shadow Philosophy**: Runway uses **zero shadows**. This is a film-production design decision — in cinema, depth comes from lighting, focus, and composition, not drop shadows. The interface mirrors this philosophy: depth is communicated through dark/light section alternation, photographic depth-of-field, and overlay transparency — never through CSS box-shadow.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, stacked images, reduced hero text |
| Tablet | 640–768px | 2-column image grids begin |
| Small Desktop | 768–1024px | Standard layout |
| Desktop | 1024–1280px | Full layout, expanded hero |
| Large Desktop | 1280–1600px | Maximum cinema-width container |

### Touch Targets
- Navigation links at comfortable 16px
- Article cards serve as large touch targets
- Buttons at 14px weight 600 with adequate padding

### Collapsing Strategy
- **Navigation**: Collapses to hamburger on mobile
- **Hero**: Full-bleed maintained, text scales down
- **Image grids**: Multi-column → 2-column → single column
- **Research articles**: Feature-size cards → stacked full-width
- **Trust logos**: Horizontal scroll or reduced grid

### Image Behavior
- Cinematic images scale proportionally
- Full-bleed hero maintained across all sizes
- Image grids reflow to fewer columns
- Video content maintains aspect ratio`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Runway — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/runwayml. Every visible
        value comes from tokens.css. Runway's signature moves: true black
        canvas, single typeface (abcNormal), cool-slate neutrals, zero
        shadows, sharp 4–8px corners, cinema-wide 1600px container."
    />

    <style>
      :root {
        --bg:           #000000;
        --surface:      #1a1a1a;
        --surface-warm: #030303;

        --fg:    #ffffff;
        --fg-2:  #e9ecf2;
        --muted: #767d88;
        --meta:  #7d848e;

        --border:      #27272a;
        --border-soft: #1a1a1a;

        --accent:        #ffffff;
        --accent-on:     #000000;
        --accent-hover:  #e9ecf2;
        --accent-active: #c9ccd1;

        --success: #16a34a;
        --warn:    #eab308;
        --danger:  #dc2626;

        --font-display: "abcNormal", "abcNormal Fallback", "Inter", "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
        --font-body:    "abcNormal", "abcNormal Fallback", "Inter", "DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
        --font-mono:    ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   11px;
        --text-sm:   13px;
        --text-base: 16px;
        --text-lg:   20px;
        --text-xl:   24px;
        --text-2xl:  36px;
        --text-3xl:  40px;
        --text-4xl:  48px;

        --leading-body:     1.4;
        --leading-tight:    1.0;
        --tracking-display: -0.025em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 78px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   4px;
        --radius-md:   8px;
        --radius-lg:   16px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: none;

        --focus-ring: 0 0 0 2px color-mix(in oklab, var(--accent), transparent 60%);

        --motion-fast:   150ms;
        --motion-base:   220ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1600px;
        --container-gutter-desktop: 48px;
        --container-gutter-tablet:  24px;
        --container-gutter-phone:   16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-body);
        letter-spacing: -0.01em;
        -webkit-font-smoothing: antialiased;
      }

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

      /* ─── Typography ─────────────────────────────
       * abcNormal handles every role; size + case + tracking carry
       * hierarchy, not weight. Display sizes use line-height 1.0 and
       * heavy negative tracking ("film-title" compression). */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        margin: 0;
        font-weight: 400;
        color: var(--fg);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        letter-spacing: -0.022em;
      }
      h3 {
        font-size: var(--text-xl);
        letter-spacing: -0.005em;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.35;
        color: var(--muted);
        letter-spacing: -0.01em;
        font-weight: 400;
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); letter-spacing: -0.01em; }

      /* Eyebrow / navigational labels — uppercase with positive
         tracking, weight 450 (the "precision detail" called out in
         DESIGN.md §3 principles). */
      .label {
        font-size: var(--text-xs);
        font-weight: 450;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-family: var(--font-body);
      }
      .caption {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
      }
      code, kbd {
        font-family: var(--font-mono);
        font-size: 0.875em;
        color: var(--fg-2);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 1px 6px;
      }
      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }
      .stack-8 > * + * { margin-block-start: var(--space-8); }

      /* ─── Buttons ─────────────────────────────────
       * Restrained per DESIGN.md §4 ("no heavy fills or borders").
       * Primary = white-on-black CTA pill-free (sharp 4px corners).
       * Secondary = ghost outline. No drop shadows on any state. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 12px 18px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          color var(--motion-fast) var(--ease-standard),
          border-color var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover  { background: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }
      .btn-secondary {
        background: transparent;
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-secondary:hover {
        border-color: var(--fg-2);
        color: var(--fg);
      }
      .btn-ghost {
        background: transparent;
        color: var(--muted);
        padding: 12px 6px;
      }
      .btn-ghost:hover { color: var(--fg); }

      /* ─── Tags / chips ───────────────────────────
       * Micro labels at 11px uppercase weight 450 (no bg fill — the
       * surface itself is the container; DESIGN.md is explicit that
       * the design is NOT pill-shaped). */
      .tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        background: transparent;
        border: 1px solid var(--border);
        color: var(--muted);
        font-size: var(--text-xs);
        font-weight: 450;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .tag-dot {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-pill);
        background: currentColor;
      }

      /* ─── Cards ──────────────────────────────────
       * Cards barely exist as containers — DESIGN.md §4: "the image
       * IS the card." We keep a hairline ring (--elev-ring) and a
       * subtle dark surface; no drop shadow ever. Image-first card
       * uses an 8px image radius and a flat text well below. */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .card-media {
        aspect-ratio: 16 / 10;
        background: var(--surface-warm);
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        padding: var(--space-4);
        color: var(--fg);
      }
      .card-media::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 0%,
          transparent 55%,
          rgba(0, 0, 0, 0.55) 100%
        );
        pointer-events: none;
      }
      .card-media-tag {
        position: relative;
        z-index: 1;
        font-size: var(--text-xs);
        font-weight: 450;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--fg);
      }
      .card-body {
        padding: var(--space-5) var(--space-5) var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .card-body h3 { color: var(--fg); }

      /* Synthesized cinematic stills — we have no image asset, so we
         paint film-grade frames with layered radial gradients. The
         raw hex values here are LOCAL to a single component (visual
         content is not part of the brand chrome; DESIGN.md §2:
         "Visual richness comes entirely from photographic content").
         Token discipline is honored — every UI surface uses var(--*). */
      .frame-1 {
        background:
          radial-gradient(120% 80% at 20% 30%, #2a2a2e 0%, transparent 55%),
          radial-gradient(80% 60% at 80% 70%, #4a4d57 0%, transparent 60%),
          linear-gradient(180deg, #0d0d0f 0%, #1c1c20 100%);
      }
      .frame-2 {
        background:
          radial-gradient(60% 90% at 70% 40%, #3a3138 0%, transparent 60%),
          radial-gradient(90% 70% at 20% 80%, #232024 0%, transparent 55%),
          linear-gradient(135deg, #050507 0%, #1f1c22 100%);
      }
      .frame-3 {
        background:
          radial-gradient(80% 100% at 50% 0%, #2c2e3a 0%, transparent 65%),
          radial-gradient(60% 60% at 50% 100%, #14161c 0%, transparent 70%),
          linear-gradient(180deg, #0a0a10 0%, #15161c 100%);
      }
      .frame-hero {
        background:
          radial-gradient(70% 60% at 50% 35%, #3a3a40 0%, transparent 60%),
          radial-gradient(40% 80% at 80% 90%, #1e1e22 0%, transparent 60%),
          linear-gradient(180deg, #0a0a0c 0%, #1d1d22 100%);
      }

      /* ─── Inputs ─────────────────────────────────
       * Flat dark fields, 4px sharp radius, hairline border, white
       * focus ring (the only chromatic affordance). */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-xs);
        font-weight: 450;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .field input {
        background: var(--surface);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: var(--text-base);
        letter-spacing: -0.01em;
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:focus-visible {
        border-color: var(--fg-2);
        box-shadow: var(--focus-ring);
      }
      .field-help {
        font-size: var(--text-xs);
        color: var(--meta);
        letter-spacing: 0.01em;
      }

      /* ─── Layout primitives ──────────────────────
       * Asymmetric editorial grids per DESIGN.md §5 ("image grids:
       * asymmetric, magazine-style mixed sizes"). */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: end;
        min-height: 70vh;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; min-height: 0; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
      }
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-5);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .hero-meta-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .hero-meta-row + .hero-meta-row {
        padding-block-start: var(--space-3);
        border-block-start: 1px solid var(--border-soft);
      }

      /* Hero film frame fills the left column with synthetic cinema. */
      .hero-frame {
        position: relative;
        border-radius: var(--radius-md);
        overflow: hidden;
        aspect-ratio: 16 / 11;
        display: flex;
        align-items: flex-end;
        padding: var(--space-6);
      }
      .hero-frame::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 0%,
          transparent 50%,
          rgba(0, 0, 0, 0.6) 100%
        );
        pointer-events: none;
      }
      .hero-frame-caption {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        color: var(--fg);
      }
      .hero-frame-caption .label { color: var(--fg-2); }

      .features-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }

      .form-row {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; gap: var(--space-8); } }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 440px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
        flex-wrap: wrap;
      }

      .icon { width: 14px; height: 14px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- HERO — cinematic frame on the left, manifesto on the right.
           Display headline uses Runway's signature compressed
           film-title typography. -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="hero-frame frame-hero" aria-hidden="true">
            <div class="hero-frame-caption">
              <span class="label">Gen-X · 00:00:42 / 00:01:08</span>
              <span class="body-sm" style="color: var(--fg-2)">
                Prompt — "a 35mm wide shot of empty coastal highway at dawn, low fog, anamorphic lens flare"
              </span>
            </div>
          </div>

          <div class="stack-4">
            <p class="label">Reference fixture · runwayml</p>
            <h1>The video model<br />for the next reel.</h1>
            <p class="lead" style="max-width:38ch">
              Gen-X generates cinema-grade video from a single sentence,
              a still frame, or a 24-second reference clip. The interface
              gets out of the way — the footage is the design.
            </p>
            <div class="hero-actions">
              
              
              <a href="#research" class="btn btn-ghost">Research →</a>
            </div>

            <aside class="hero-meta" aria-label="Render status">
              <div class="hero-meta-row">
                <span class="caption">Latest render</span>
                <span class="tag"><span class="tag-dot" aria-hidden="true"></span>Ready</span>
              </div>
              <div class="hero-meta-row">
                <span class="body-sm body-muted">Gen-X · 10s · 1080p</span>
                <span class="body-sm" style="color: var(--fg-2)">38&nbsp;sec to&nbsp;render</span>
              </div>
              <div class="hero-meta-row">
                <span class="body-sm body-muted">Press <kbd>R</kbd> to re-roll the seed.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- RESEARCH — editorial three-card grid: one large feature plus
           two smaller supporting cards (DESIGN.md §4 "mixed-size grid"). -->
      <section data-od-id="research" id="research">
        <div class="stack-3" style="margin-bottom: var(--space-8)">
          <p class="label">Research</p>
          <h2 style="max-width: 32ch">
            We are building AI to simulate the world through imagination, art and aesthetics.
          </h2>
        </div>

        <div class="features-grid">
          <article class="card">
            <div class="card-media frame-1">
              <span class="card-media-tag">Featured · Gen-X</span>
            </div>
            <div class="card-body">
              <p class="caption">Paper · 2026-03-14</p>
              <h3>Long-horizon video coherence beyond 60 seconds.</h3>
              <p class="body-muted body-sm">
                Gen-X stitches scene-aware latents across shot boundaries — the
                first time a single model has held character, lighting, and
                camera continuity past a one-minute cut without re-prompting.
              </p>
              
            </div>
          </article>

          <article class="card">
            <div class="card-media frame-2">
              <span class="card-media-tag">Tools</span>
            </div>
            <div class="card-body">
              <p class="caption">Update · 2026-04-02</p>
              <h3>Camera control, on every frame.</h3>
              <p class="body-muted body-sm">
                Dolly, push, orbit, and tilt — directable per-shot, exported
                as standard motion-track data.
              </p>
            </div>
          </article>

          <article class="card">
            <div class="card-media frame-3">
              <span class="card-media-tag">Film</span>
            </div>
            <div class="card-body">
              <p class="caption">Showcase · 2026-04-19</p>
              <h3>The Coastal Reels — a 12-minute short.</h3>
              <p class="body-muted body-sm">
                Directed by Lina Marès. Every frame rendered with Gen-X,
                no live photography on set.
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- FORM — minimal access request, single field, two CTAs. -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="label">Early access</p>
            <h2>Request a Gen-X studio invite.</h2>
            <p class="lead" style="max-width: 44ch">
              We open studios in waves. Drop your work email — we send the
              brief, the model card, and a render quota for evaluation. Nothing else.
            </p>
            <p class="body-sm body-muted" style="max-width: 44ch">
              Filmmakers, agencies, and post houses currently in production
              get prioritized; press <kbd>esc</kbd> to dismiss the form.
            </p>
          </div>

          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="director@studio.com"
                autocomplete="email"
                required
              />
              <p class="field-help">
                We will only contact you about your studio invite.
              </p>
            </div>
            <div class="field">
              <label for="reel">Project or reel link <span style="color: var(--meta); text-transform: none; letter-spacing: 0">(optional)</span></label>
              <input
                id="reel"
                type="url"
                placeholder="https://yourstudio.com/reel"
              />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Request invite
              </button>
              <button type="button" class="btn btn-secondary">
                Watch a reel first
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=runwayml_default;return module.exports}});
//# sourceMappingURL=client.runwayml.js.map