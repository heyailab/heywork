
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.opencode-ai.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var opencode_ai_default={"contract":`## 1. Visual Theme & Atmosphere

OpenCode's website embodies a terminal-native, monospace-first aesthetic that reflects its identity as an open source AI coding agent. The entire visual system is built on a stark dark-on-light contrast using a near-black background (\`#201d1d\`) with warm off-white text (\`#fdfcfc\`). This isn't a generic dark theme -- it's a warm, slightly reddish-brown dark that feels like a sophisticated terminal emulator rather than a cold IDE. The warm undertone in both the darks and lights (notice the subtle red channel in \`#201d1d\` -- rgb(32, 29, 29)) creates a cohesive, lived-in quality.

Berkeley Mono is the sole typeface, establishing an unapologetic monospace identity. Every element -- headings, body text, buttons, navigation -- shares this single font family, creating a unified "everything is code" philosophy. The heading at 38px bold with 1.50 line-height is generous and readable, while body text at 16px with weight 500 provides a slightly heavier-than-normal reading weight that enhances legibility on screen. The monospace grid naturally enforces alignment and rhythm across the layout.

The color system is deliberately minimal. The primary palette consists of just three functional tones: the warm near-black (\`#201d1d\`), a medium warm gray (\`#9a9898\`), and a bright off-white (\`#fdfcfc\`). Semantic colors borrow from the Apple HIG palette -- blue accent (\`#007aff\`), red danger (\`#ff3b30\`), green success (\`#30d158\`), orange warning (\`#ff9f0a\`) -- giving the interface familiar, trustworthy signal colors without adding brand complexity. Borders use a subtle warm transparency (\`rgba(15, 0, 0, 0.12)\`) that ties into the warm undertone of the entire system.

**Key Characteristics:**
- Berkeley Mono as the sole typeface -- monospace everywhere, no sans-serif or serif voices
- Warm near-black primary (\`#201d1d\`) with reddish-brown undertone, not pure black
- Off-white text (\`#fdfcfc\`) with warm tint, not pure white
- Minimal 4px border radius throughout -- sharp, utilitarian corners
- 8px base spacing system scaling up to 96px
- Apple HIG-inspired semantic colors (blue, red, green, orange)
- Transparent warm borders using \`rgba(15, 0, 0, 0.12)\`
- Email input with generous 20px padding and 6px radius -- the most generous component radius
- Single button variant: dark background, light text, tight vertical padding (4px 20px)
- Underlined links as default link style, reinforcing the text-centric identity

## 4. Component Stylings

### Buttons

**Primary (Dark Fill)**
- Background: \`#201d1d\` (OpenCode Dark)
- Text: \`#fdfcfc\` (OpenCode Light)
- Padding: 4px 20px
- Radius: 4px
- Font: 16px Berkeley Mono, weight 500, line-height 2.00 (relaxed)
- Outline: \`rgb(253, 252, 252) none 0px\`
- Use: Primary CTAs, main actions

### Inputs

**Email Input**
- Background: \`#f8f7f7\` (light neutral)
- Text: \`#201d1d\`
- Border: \`1px solid rgba(15, 0, 0, 0.12)\`
- Padding: 20px
- Radius: 6px
- Font: Berkeley Mono, standard size
- Use: Form fields, email capture

### Links

**Default Link**
- Color: \`#201d1d\`
- Decoration: underline 1px
- Font-weight: 500
- Use: Primary text links in body content

**Light Link**
- Color: \`#fdfcfc\`
- Decoration: none
- Use: Links on dark backgrounds, navigation

**Muted Link**
- Color: \`#9a9898\`
- Decoration: none
- Use: Footer links, secondary navigation

### Tabs

**Tab Navigation**
- Border-bottom: \`2px solid #9a9898\` (active tab indicator)
- Font: 16px, weight 500, line-height 1.00
- Use: Section switching, content filtering

### Navigation
- Clean horizontal layout with Berkeley Mono throughout
- Brand logotype left-aligned in monospace
- Links at 16px weight 500 with underline decoration
- Dark background matching page background
- No backdrop blur or transparency -- solid surfaces only

### Image Treatment
- Terminal/code screenshots as hero imagery
- Dark terminal aesthetic with monospace type
- Minimal borders, content speaks for itself

### Distinctive Components

**Terminal Hero**
- Full-width dark terminal window as hero element
- ASCII art / stylized logo within terminal frame
- Monospace command examples with syntax highlighting
- Reinforces the CLI-first identity of the product

**Feature List**
- Bulleted feature items with Berkeley Mono text
- Weight 500 for feature names, 400 for descriptions
- Tight vertical spacing between items
- No cards or borders -- pure text layout

**Email Capture**
- Light background input (\`#f8f7f7\`) contrasting dark page
- Generous 20px padding for comfortable typing
- 6px radius -- the roundest element in the system
- Newsletter/waitlist pattern

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Fine scale: 1px, 2px, 4px (sub-8px for borders and micro-adjustments)
- Standard scale: 8px, 12px, 16px, 20px, 24px
- Extended scale: 32px, 40px, 48px, 64px, 80px, 96px
- The system follows a clean 4/8px grid with consistent doubling

### Grid & Container
- Max content width: approximately 800-900px (narrow, reading-optimized)
- Single-column layout as the primary pattern
- Centered content with generous horizontal margins
- Hero section: full-width dark terminal element
- Feature sections: single-column text blocks
- Footer: multi-column link grid

### Whitespace Philosophy
- **Monospace rhythm**: The fixed-width nature of Berkeley Mono creates a natural vertical grid. Line-heights of 1.50 and 2.00 maintain consistent rhythm.
- **Narrow and focused**: Content is constrained to a narrow column, creating generous side margins that focus attention on the text.
- **Sections through spacing**: No decorative dividers. Sections are separated by generous vertical spacing (48-96px) rather than borders or background changes.

### Border Radius Scale
- Micro (4px): Default for all elements -- buttons, containers, badges
- Input (6px): Form inputs get slightly more roundness
- The entire system uses just two radius values, reinforcing the utilitarian aesthetic

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow, no border | Default state for most elements |
| Border Subtle (Level 1) | \`1px solid rgba(15, 0, 0, 0.12)\` | Section dividers, input borders, horizontal rules |
| Border Tab (Level 2) | \`2px solid #9a9898\` bottom only | Active tab indicator |
| Border Outline (Level 3) | \`1px solid #646262\` | Container outlines, elevated elements |

**Shadow Philosophy**: OpenCode's depth system is intentionally flat. There are no box-shadows in the extracted tokens -- zero shadow values were detected. Depth is communicated exclusively through border treatments and background color shifts. This flatness is consistent with the terminal aesthetic: terminals don't have shadows, and neither does OpenCode. The three border levels (transparent warm, tab indicator, solid outline) create sufficient visual hierarchy without any elevation illusion.

### Decorative Depth
- Background color shifts between \`#201d1d\` and \`#302c2c\` create subtle surface differentiation
- Transparent borders at 12% opacity provide barely-visible structure
- The warm reddish tint in border colors (\`rgba(15, 0, 0, 0.12)\`) ties borders to the overall warm dark palette
- No gradients, no blurs, no ambient effects -- pure flat terminal aesthetic

## 7. Interaction & Motion

### Hover States
- Links: color shift from default to accent blue (\`#007aff\`) or underline style change
- Buttons: subtle background lightening or border emphasis
- Accent blue provides a three-stage hover sequence: \`#007aff\` → \`#0056b3\` → \`#004085\` (default → hover → active)
- Danger red: \`#ff3b30\` → \`#d70015\` → \`#a50011\`
- Warning orange: \`#ff9f0a\` → \`#cc7f08\` → \`#995f06\`

### Focus States
- Border-based focus: increased border opacity or solid border color
- No shadow-based focus rings -- consistent with the flat, no-shadow aesthetic
- Keyboard focus likely uses outline or border color shift to accent blue

### Transitions
- Minimal transitions expected -- terminal-inspired interfaces favor instant state changes
- Color transitions: 100-150ms for subtle state feedback
- No scale, rotate, or complex transform animations

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, reduced padding, heading scales down |
| Tablet | 640-1024px | Content width expands, slight padding increase |
| Desktop | >1024px | Full content width (~800-900px centered), maximum whitespace |

### Touch Targets
- Buttons with 4px 20px padding provide adequate horizontal touch area
- Input fields with 20px padding ensure comfortable mobile typing
- Tab items at 16px with tight line-height may need mobile adaptation

### Collapsing Strategy
- Hero heading: 38px → 28px → 24px on smaller screens
- Navigation: horizontal links → hamburger/drawer on mobile
- Feature lists: maintain single-column, reduce horizontal padding
- Terminal hero: maintain full-width, reduce internal padding
- Footer columns: multi-column → stacked single column
- Section spacing: 96px → 64px → 48px on mobile

### Image Behavior
- Terminal screenshots maintain aspect ratio and border treatment
- Full-width elements scale proportionally
- Monospace type maintains readability at all sizes due to fixed-width nature`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>OpenCode AI — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/opencode-ai. Terminal-native dark:
        warm near-black canvas, Berkeley Mono sole typeface, flat depth (no shadows),
        Apple HIG semantic colors, 880px narrow reading column."
    />

    <style>
      :root {
        --bg: #201d1d;
        --surface: #302c2c;
        --surface-warm: var(--surface);

        --fg: #fdfcfc;
        --fg-2: #c8c6c4;
        --muted: #9a9898;
        --meta: #6e6e73;

        --border: #464343;
        --border-soft: #302c2c;

        --accent: #007aff;
        --accent-on: #ffffff;
        --accent-hover: #0056b3;
        --accent-active: #004085;

        --success: #30d158;
        --warn: #ff9f0a;
        --danger: #ff3b30;

        /* Berkeley Mono is the ONLY font — no typographic variation */
        --font-display: "Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        --font-body: "Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        --font-mono: "Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;

        --text-xs: 12px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 18px;
        --text-xl: 22px;
        --text-2xl: 28px;
        --text-3xl: 38px;
        --text-4xl: 48px;

        --leading-body: 1.5;
        --leading-tight: 1.0;
        --tracking-display: 0em;

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

        --radius-sm: 4px;
        --radius-md: 6px;
        --radius-lg: 8px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0 2px var(--border);

        --focus-ring: 0 0 0 2px var(--accent);

        --motion-fast: 100ms;
        --motion-base: 150ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max: 880px;   /* Narrow reading column — "everything is code" */
        --container-gutter-desktop: 24px;
        --container-gutter-tablet: 20px;
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
      }

      /* ─── Layout — narrow reading column ─────────────────────── */
      .container { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-gutter-desktop); }
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

      /* ─── Typography — Berkeley Mono only ───────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);   /* Same typeface as body — no switching */
        font-weight: 700;                   /* Bold headings — size + weight only */
        line-height: 1.2;
        margin: 0;
        letter-spacing: 0;                  /* Monospace needs no tracking adjust */
      }
      h1 { font-size: var(--text-3xl); }   /* 38px — Heading 1 */
      h2 { font-size: var(--text-2xl); }   /* 28px */
      h3 { font-size: var(--text-xl); }    /* 22px */
      p { margin: 0; font-weight: 400; }
      .lead { font-size: var(--text-lg); color: var(--fg-2); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      /* Section labels — same font, smaller, muted */
      .eyebrow {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--muted);
        letter-spacing: 0;
      }
      /* Inline code — same mono font, just tinted */
      code {
        font-family: var(--font-mono);
        font-size: 0.9em;
        color: var(--success);             /* Apple green for inline code */
        background: rgba(48, 209, 88, 0.08);
        padding: 1px 5px;
        border-radius: var(--radius-sm);
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — flat, Apple-blue primary ────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-sm);   /* 4px — utilitarian */
        font-family: var(--font-body);     /* Berkeley Mono */
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    border-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: translateY(1px); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Primary: Apple system blue */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
      .btn-primary:active { background: var(--accent-active); }
      /* Secondary: flat outlined on dark surface */
      .btn-secondary {
        background: transparent;
        color: var(--fg-2);
        border-color: var(--border);
      }
      .btn-secondary:hover { background: var(--surface); color: var(--fg); }

      /* ─── Inputs — flat, no shadows ────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--muted);
      }
      .field input {
        padding: 8px 12px;
        border-radius: var(--radius-md);   /* 6px — slightly more approachable */
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-mono);     /* Berkeley Mono in inputs */
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);     /* Apple blue ring — no shadow */
      }
      .field input::placeholder { color: var(--meta); }
      .field-help { font-size: var(--text-xs); color: var(--meta); }

      /* ─── Cards — flat via border, not shadow ───────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);   /* Ring creates depth — NO shadow */
        border-radius: var(--radius-md);
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      /* ─── Badges — Apple HIG semantic palette ───────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 2px 8px;
        border-radius: var(--radius-sm);
        font-family: var(--font-mono);
        font-size: var(--text-xs); font-weight: 500; line-height: 1.2;
      }
      .badge-success { color: var(--success); background: rgba(48, 209, 88, 0.12); }
      .badge-danger  { color: var(--danger);  background: rgba(255, 59, 48,  0.12); }
      .badge-warn    { color: var(--warn);    background: rgba(255, 159, 10, 0.12); }
      .badge-accent  { color: var(--accent);  background: rgba(0, 122, 255, 0.12); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Links, kbd ────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }

      /* ─── Terminal prompt prefix ────────────────────────────── */
      .prompt {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--success);
        display: flex; align-items: baseline; gap: var(--space-2);
      }
      .prompt::before {
        content: "$";
        color: var(--muted);
        flex-shrink: 0;
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
      .features-stack > * + * { margin-block-start: var(--space-5); }
      .form { display: flex; flex-direction: column; gap: var(--space-4); }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="stack-4">
          <p class="eyebrow">reference-fixture · opencode-ai</p>
          <h1>The terminal has a design system.</h1>
          <p class="lead" style="max-width: 60ch">
            Warm near-black canvas (<code>#201d1d</code>). Berkeley Mono is the
            only typeface — "everything is code." Flat depth: no shadows, only
            border rings and background shifts. Apple HIG colors.
          </p>
          <div class="hero-actions">
            
            
          </div>
        </div>
      </section>

      <section data-od-id="status">
        <div class="stack-4">
          <p class="eyebrow">apple-hig-semantic-colors</p>
          <h2>Familiar signals on dark canvas.</h2>
          <p class="body-muted" style="max-width: 56ch">
            <code>#30d158</code> success · <code>#ff9f0a</code> warn ·
            <code>#ff3b30</code> danger · <code>#007aff</code> accent.
            Monospace badges. No rounded pills.
          </p>
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; margin-block-start: var(--space-4);">
            <span class="badge badge-success"><span class="badge-dot" aria-hidden="true"></span>passing</span>
            <span class="badge badge-warn"><span class="badge-dot" aria-hidden="true"></span>stale</span>
            <span class="badge badge-danger"><span class="badge-dot" aria-hidden="true"></span>failed</span>
            <span class="badge badge-accent"><span class="badge-dot" aria-hidden="true"></span>running</span>
          </div>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">what-this-fixture-exercises</p>
          <h2>Flat depth. Border rings. No blur.</h2>
        </div>
        <div class="features-stack" style="margin-block-start: var(--space-8)">
          <article class="card">
            <div class="row-between">
              <h3>Berkeley Mono — every tier</h3>
              <span class="badge badge-accent">A1-identity</span>
            </div>
            <p class="body-muted body-sm">
              --font-display, --font-body, and --font-mono all resolve to the same
              font stack. Hierarchy is created by size and weight (400 / 500 / 700)
              alone. No switching between faces.
            </p>
            <p class="prompt" aria-label="Inspect tokens">cat tokens.css | grep font</p>
          </article>
          <article class="card">
            <div class="row-between">
              <h3>Flat elevation system</h3>
              <span class="badge badge-accent">A1-structure</span>
            </div>
            <p class="body-muted body-sm">
              --elev-flat: none · --elev-ring: 0 0 0 1px var(--border) ·
              --elev-raised: 0 0 0 2px var(--border). All three use ring outlines.
              Zero blur, zero spread. Depth via bg-shift: <code>#201d1d</code> → <code>#302c2c</code>.
            </p>
            
          </article>
          <article class="card">
            <div class="row-between">
              <h3>880px narrow column</h3>
              <span class="badge badge-accent">A1-structure</span>
            </div>
            <p class="body-muted body-sm">
              --container-max: 880px. Single-column, text-centric layout.
              "The whole page is a terminal session" — no multi-column marketing grids.
              Generous 80px section spacing.
            </p>
            <div style="display: flex; gap: var(--space-2); margin-block-start: var(--space-1);">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to jump
            </div>
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="stack-4">
          <p class="eyebrow">form-components</p>
          <h2>Config-file inputs.</h2>
          <p class="body-muted" style="max-width: 56ch">
            Labels are small monospace — they look like config keys.
            Inputs use 6px radius (the roundest element in the system),
            warm borders, and a 2px Apple blue focus ring.
          </p>
        </div>
        <div role="group" class="uma-preview-form form" style="margin-block-start: var(--space-8);">
          <div class="field">
            <label for="anthropic-key">ANTHROPIC_API_KEY</label>
            <input id="anthropic-key" type="text" placeholder="sk-ant-api03-..." autocomplete="off" />
            <p class="field-help">Set in environment or paste here to persist in keychain.</p>
          </div>
          <div class="field">
            <label for="model-id">DEFAULT_MODEL</label>
            <input id="model-id" type="text" placeholder="claude-opus-4" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save config</button>
            <button type="button" class="btn btn-secondary">Reset</button>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=opencode_ai_default;return module.exports}});
//# sourceMappingURL=client.opencode-ai.js.map