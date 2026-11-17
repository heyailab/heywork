
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.duolingo.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var duolingo_default={"contract":`## 1. Visual Theme & Atmosphere

Duolingo is gamification rendered as visual language. The interface is unapologetically bright, with **owl green** (\`#58cc02\`) as the brand primary and a chunky 4px bottom-shadow on every interactive element that reads like a 3D button waiting to be pressed. The page is white (\`#ffffff\`) with thick 2–3px borders in a deep gray (\`#e5e5e5\`) and the entire system reads like an iOS app from 2015 reborn with better hierarchy.

Typography uses **Feather Bold** (a custom rounded sans) for chrome and **Mona Sans** (or Inter) for body. Display sizes are big and confident — Duolingo never whispers. Headings often carry the green underline-stroke or sit on a green pill, and the mascot Duo (a green owl) appears as an active illustration character, not a static logo.

Shape language is friendly: 16–20px radii on cards, 12px on buttons, 9999px on chips and progress bars. Iconography is filled, rounded, and color-coded by skill — every lesson surface has an instantly identifiable color pairing.

**Key Characteristics:**
- Owl green (\`#58cc02\`) as the dominant brand color, used in 30%+ of the surface
- Chunky 4px bottom-shadow on every button (the "tactile press" affordance)
- 2–3px solid borders, never hairlines
- Feather Bold (rounded display) + Mona Sans (body)
- Big confident type — display sizes start at 48px and climb
- Mascot-as-character: Duo the owl appears in onboarding, errors, streaks
- Streak orange (\`#ff9600\`) and gem pink (\`#ce82ff\`) as secondary brand colors

## 4. Component Stylings

### Buttons

**Primary (Owl Green)**
- Background: \`#58cc02\`
- Text: \`#3c3c3c\` for readable labels on the bright green fill
- Padding: 14px 24px
- Radius: 16px
- Border-bottom: 4px solid \`#58a700\` (the chunky shadow)
- Hover: background \`#89e219\`
- Active: translate-y 4px, border-bottom 0 (button "presses")
- Use: "Continue", "Check", main CTA.

**Secondary (White with Bottom-Shadow)**
- Background: \`#ffffff\`
- Text: \`#777777\`
- Border: 2px solid \`#e5e5e5\`
- Border-bottom: 4px solid \`#e5e5e5\`
- Radius: 16px
- Padding: 14px 24px
- Hover: text \`#3c3c3c\`, border \`#afafaf\`

**Streak Orange**
- Background: \`#ff9600\`
- Text: \`#ffffff\`
- Border-bottom: 4px solid \`#cc7a00\`
- Use: streak goal, "Start streak"

**Error (Cardinal Red)**
- Background: \`#ff4b4b\`
- Text: \`#ffffff\`
- Border-bottom: 4px solid \`#cc3b3b\`
- Use: wrong answer feedback.

### Cards / Lesson Tiles
- Background: \`#ffffff\`
- Border: 2px solid \`#e5e5e5\`
- Border-bottom: 4px solid \`#e5e5e5\`
- Radius: 16px
- Padding: 16px
- Hover: lift 2px, shadow \`0 4px 0 #d7d7d7\`

### Skill Tree Node (Lesson Bubble)
- Size: 80×72px
- Background: skill-color tinted (green for active, gray for locked)
- Border-bottom: 6px solid darker variant
- Radius: 50% (circular)
- Active: pulses 1.0 → 1.05 every 1.6s

### Inputs
- Background: \`#ffffff\`
- Border: 2px solid \`#e5e5e5\`
- Radius: 12px
- Padding: 12px 16px
- Focus: border \`#1cb0f6\` (eel blue), ring \`0 0 0 3px rgba(28, 176, 246, 0.2)\`

### Progress Bar
- Track: \`#e5e5e5\`
- Fill: \`#58cc02\` (or \`#ff9600\` for streak)
- Radius: 9999px
- Height: 16px
- Animated fill: 320ms ease-out on increment.

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64.
- **Container**: max 1080px, 24px gutter.
- **Lesson tree column**: 320px wide; centered on desktop.

## 6. Motion

- **Duration**: 180ms for button press; 320ms for skill-node unlock; 1.6s for active-node pulse.
- **Easing**: \`cubic-bezier(0.34, 1.56, 0.64, 1)\` (back-out, slight overshoot) for unlocks.
- **Mascot**: Duo blinks every 4–6s, jumps on streak milestones (480ms ease-out spring).`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Duolingo — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/duolingo. Owl-green gamified
        universe, chunky 4px tactile shadows, big confident type, friendly pill geometry."
    />

    <style>
      :root {
        --bg: #ffffff;
        --surface: #f7f7f7;
        --surface-warm: var(--surface);

        --fg: #3c3c3c;
        --fg-2: var(--fg);
        --muted: #777777;
        --meta: #afafaf;

        --border: #e5e5e5;
        --border-soft: var(--border);

        --accent: #58cc02;
        --accent-on: #ffffff;
        --accent-hover: #89e219;
        --accent-active: #58a700;

        --success: #58cc02;
        --warn: #ffc800;
        --danger: #ff4b4b;

        --font-display: "Feather Bold", "DIN Round Pro", "Helvetica Neue", sans-serif;
        --font-body: "Mona Sans", "Helvetica Neue", system-ui, sans-serif;
        --font-mono: "JetBrains Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;

        --text-xs: 12px;
        --text-sm: 13px;
        --text-base: 15px;
        --text-lg: 18px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 40px;
        --text-4xl: 56px;

        --leading-body: 1.5;
        --leading-tight: 1.15;
        --tracking-display: -0.01em;

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

        --radius-sm: 12px;
        --radius-md: 16px;
        --radius-lg: 20px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 2px var(--border);
        --elev-raised: 0 4px 0 #d7d7d7;

        --focus-ring: 0 0 0 3px rgba(28, 176, 246, 0.2);

        --motion-fast: 180ms;
        --motion-base: 320ms;
        --ease-standard: cubic-bezier(0.34, 1.56, 0.64, 1);

        --container-max: 1080px;
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

      /* ─── Layout ────────────────────────────────────────────── */
      .container {
        max-width: var(--container-max);
        margin-inline: auto;
        padding-inline: var(--container-gutter-desktop);
      }
      section { padding-block: var(--section-y-desktop); }
      section + section { border-top: 2px solid var(--border); }
      @media (max-width: 1023px) {
        .container { padding-inline: var(--container-gutter-tablet); }
        section { padding-block: var(--section-y-tablet); }
      }
      @media (max-width: 639px) {
        .container { padding-inline: var(--container-gutter-phone); }
        section { padding-block: var(--section-y-phone); }
      }

      /* ─── Typography — Feather Bold @ 800 across chrome ─────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 800;
        line-height: var(--leading-tight);
        margin: 0;
        color: var(--fg);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
        line-height: 1.05;
      }
      h2 { font-size: var(--text-2xl); letter-spacing: -0.005em; }
      h3 { font-size: var(--text-lg); font-weight: 700; line-height: 1.25; }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); color: var(--fg); line-height: var(--leading-body); }
      .body-muted { color: var(--muted); }
      .body-meta { color: var(--meta); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        display: inline-block;
        font-family: var(--font-display);
        font-size: var(--text-xs);
        color: var(--accent-active);
        background: color-mix(in oklab, var(--accent), transparent 82%);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-weight: 800;
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-pill);
      }
      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — chunky 4px bottom-shadow tactile press ──── */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: 14px var(--space-6);
        border-radius: var(--radius-md);
        font-family: var(--font-display);
        font-size: var(--text-base);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
        border: none;
        text-decoration: none;
        transition:
          background-color var(--motion-fast) var(--ease-standard),
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Primary — Owl Green with darker green underside */
      .btn-primary {
        background: var(--accent);
        color: var(--fg);
        box-shadow: 0 4px 0 var(--accent-active);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-primary:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 var(--accent-active);
      }

      /* Secondary — White with neutral underside */
      .btn-secondary {
        background: var(--bg);
        color: var(--muted);
        border: 2px solid var(--border);
        box-shadow: 0 4px 0 var(--border);
        padding: 12px calc(var(--space-6) - 2px);
      }
      .btn-secondary:hover { color: var(--fg); border-color: var(--meta); }
      .btn-secondary:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 var(--border);
      }

      /* Streak — Bee Yellow with warm underside */
      .btn-streak {
        background: var(--warn);
        color: var(--fg);
        box-shadow: 0 4px 0 color-mix(in oklab, var(--warn), black 18%);
      }
      .btn-streak:hover { background: color-mix(in oklab, var(--warn), white 8%); }
      .btn-streak:active {
        transform: translateY(4px);
        box-shadow: 0 0 0 color-mix(in oklab, var(--warn), black 18%);
      }

      /* ─── Inputs — thick borders, soft eel-blue focus glow ─── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-family: var(--font-display);
        font-size: var(--text-sm);
        font-weight: 800;
        color: var(--fg);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .field input {
        padding: 14px var(--space-4);
        border-radius: var(--radius-sm);
        border: 2px solid var(--border);
        background: var(--bg);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        outline: none;
        transition:
          border-color var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--meta); }
      .field input:hover { border-color: var(--meta); }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards / Lesson tiles — chunky offset shadow ───────── */
      .card {
        background: var(--bg);
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
        transition:
          transform var(--motion-fast) var(--ease-standard),
          box-shadow var(--motion-fast) var(--ease-standard);
      }
      .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 0 #d7d7d7;
      }
      .card-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-pill);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-on);
        font-family: var(--font-display);
        font-weight: 800;
        font-size: var(--text-xl);
        box-shadow: 0 3px 0 color-mix(in oklab, currentColor, black 22%);
      }
      .card-icon-green { background: var(--accent); }
      .card-icon-red { background: var(--danger); }
      .card-icon-yellow { background: var(--warn); color: var(--fg); }

      /* ─── Badges + chips ────────────────────────────────────── */
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1) var(--space-3);
        border-radius: var(--radius-pill);
        font-family: var(--font-display);
        font-size: var(--text-xs);
        font-weight: 800;
        letter-spacing: 0.04em;
        line-height: 1.6;
        text-transform: uppercase;
      }
      .badge-success { color: var(--accent-on); background: var(--success); }
      .badge-streak  { color: var(--fg); background: var(--warn); }
      .badge-muted   { color: var(--muted); background: var(--surface); border: 2px solid var(--border); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* ─── Progress bar ──────────────────────────────────────── */
      .progress {
        position: relative;
        background: var(--border);
        border-radius: var(--radius-pill);
        height: 16px;
        overflow: hidden;
      }
      .progress > .progress-fill {
        height: 100%;
        width: 64%;
        background: var(--accent);
        border-radius: var(--radius-pill);
        box-shadow: inset 0 -4px 0 var(--accent-active);
      }

      /* ─── Mascot panel ──────────────────────────────────────── */
      .mascot-card {
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        box-shadow: var(--elev-raised);
      }
      .mascot-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }
      .mascot-svg {
        width: 96px;
        height: 96px;
        flex-shrink: 0;
        filter: drop-shadow(0 3px 0 var(--accent-active));
      }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* ─── Links + kbd ───────────────────────────────────────── */
      a { color: var(--accent-active); text-decoration: none; font-weight: 700; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px var(--space-2);
        border-radius: var(--radius-sm);
        border: 2px solid var(--border);
        background: var(--bg);
        color: var(--muted);
        box-shadow: 0 2px 0 var(--border);
      }

      /* ─── Layout helpers ────────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) {
        .hero-grid { grid-template-columns: 1fr; gap: var(--space-8); }
      }
      .hero-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-6);
        flex-wrap: wrap;
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
        grid-template-columns: 1.2fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        max-width: 420px;
        background: var(--bg);
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        box-shadow: var(--elev-raised);
      }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); }
      .icon { width: 18px; height: 18px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-6">
            <span class="eyebrow">Reference fixture · duolingo</span>
            <div class="stack-4">
              <h1>Free language learning for the world.</h1>
              <p class="lead" style="max-width: 48ch">
                15 minutes a day can teach you a language. Practice with bite-sized lessons,
                keep your streak alive, and let Duo the owl cheer you on every step of the way.
              </p>
            </div>
            <div class="hero-actions">
              
              
            </div>
          </div>
          <aside class="mascot-card" aria-label="Today's lesson">
            <div class="mascot-row">
              <svg class="mascot-svg" viewBox="0 0 96 96" aria-hidden="true">
                <ellipse cx="48" cy="58" rx="34" ry="32" fill="var(--accent)"/>
                <ellipse cx="48" cy="58" rx="22" ry="22" fill="color-mix(in oklab, var(--accent), white 22%)"/>
                <circle cx="36" cy="46" r="9" fill="#ffffff"/>
                <circle cx="60" cy="46" r="9" fill="#ffffff"/>
                <circle cx="36" cy="48" r="4.5" fill="var(--fg)"/>
                <circle cx="60" cy="48" r="4.5" fill="var(--fg)"/>
                <circle cx="34.5" cy="46.5" r="1.6" fill="#ffffff"/>
                <circle cx="58.5" cy="46.5" r="1.6" fill="#ffffff"/>
                <path d="M40 60 L48 67 L56 60 Z" fill="var(--warn)"/>
                <path d="M22 32 Q30 18 42 26" fill="none" stroke="var(--accent-active)" stroke-width="6" stroke-linecap="round"/>
                <path d="M74 32 Q66 18 54 26" fill="none" stroke="var(--accent-active)" stroke-width="6" stroke-linecap="round"/>
              </svg>
              <div class="stack-2">
                <h3>Spanish · Unit 3</h3>
                <p class="body-sm body-muted">Order food at the café</p>
              </div>
            </div>
            <div class="stack-2">
              <div class="row-between">
                <span class="body-sm" style="font-family: var(--font-display); font-weight: 800">Lesson progress</span>
                <span class="body-sm" style="color: var(--muted)">3 / 5 crowns</span>
              </div>
              <div class="progress" aria-label="Lesson progress 64%">
                <div class="progress-fill"></div>
              </div>
            </div>
            <div class="row-between">
              <span class="badge badge-streak">
                <span class="badge-dot" aria-hidden="true"></span>
                14 day streak
              </span>
              <span class="body-sm" style="color: var(--muted)">+15 XP today</span>
            </div>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <span class="eyebrow">What this fixture exercises</span>
          <h2 style="max-width: 22ch">Joy is the curriculum.</h2>
          <p class="body-muted" style="max-width: 56ch">
            Every surface is built for the next correct answer — green to celebrate,
            chunky shadows to invite the press, and Duo waiting on the other side.
          </p>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <span class="card-icon card-icon-green" aria-hidden="true">✓</span>
            <h3>Owl green throughout</h3>
            <p class="body-muted body-sm">
              --accent (#58cc02) covers 30%+ of every screen. Primary CTA, correct
              answer, progress fill — they're all the same affirming green.
            </p>
            
          </article>
          <article class="card">
            <span class="card-icon card-icon-yellow" aria-hidden="true">★</span>
            <h3>Tactile 4px shadow</h3>
            <p class="body-muted body-sm">
              --elev-raised drops a hard 4px offset under every button. On :active
              we translateY(4px) and zero the shadow — the button literally presses.
            </p>
            
          </article>
          <article class="card">
            <span class="card-icon card-icon-red" aria-hidden="true">!</span>
            <h3>Big confident type</h3>
            <p class="body-muted body-sm">
              --text-4xl (56px) is +25% over typical product brands. Feather Bold at
              800 is the default — we never whisper, we never apologize for size.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <span class="eyebrow">Start your streak</span>
            <h2>One inbox is all it takes.</h2>
            <p class="body-muted" style="max-width: 48ch">
              We'll send a friendly nudge when Duo notices you missed a day. No tricks,
              no spam — just the kind of gentle accountability that turns 15 minutes
              into a year-long habit.
            </p>
            <p class="body-meta body-sm">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to search the lesson library.
            </p>
          </div>
          <div role="group" class="hey-preview-form form">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="you@duolingo.com" autocomplete="email" required />
              <p class="field-help">Free forever · 600M+ learners worldwide</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create account</button>
              <button type="button" class="btn btn-secondary">Sign in</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=duolingo_default;return module.exports}});
//# sourceMappingURL=client.duolingo.js.map