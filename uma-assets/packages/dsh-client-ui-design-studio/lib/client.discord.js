
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.discord.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var discord_default={"contract":`## 1. Visual Theme & Atmosphere

Discord's product is engineered for evenings, raids, and group voice — so the entire surface is dark-first. The default canvas is the deep \`Background Primary\` (\`#313338\` light theme, \`#1e1f22\` dark theme), with chat columns layered on slightly lighter or darker shades to denote channels, threads, and side panels. The signature **Blurple** (\`#5865f2\`) is reserved for the brand mark, primary CTAs, mentions, and the "you" affordance — used sparingly so it pops against the muted neutrals.

Typography is **gg sans** (Discord's custom Whitney-replacement) for prose and chrome, with rounded geometric shapes that feel approachable but still legible at the small sizes a chat client demands. Headings step up incrementally; chat rows are tight (4–8px between message groups) so hours of scrollback feel scannable.

The shape language is rounded but not balloon-soft: 8px radii on cards, 4px on inputs, full pills on status badges and tags. Servers are rounded-square avatars at 48px that morph to circles on hover — a tiny piece of motion that has become part of the brand's identity.

**Key Characteristics:**
- Dark-first surfaces: \`#1e1f22\` / \`#2b2d31\` / \`#313338\` (3-step depth)
- Blurple \`#5865f2\` as the only saturated accent in the chat surface
- gg sans (Whitney-style) for all text — friendly, geometric, neutral
- Rounded-square server avatars (16px radius) that snap to circles on hover
- Tight chat-row spacing, generous side-panel padding
- Status dots: green online, yellow idle, red dnd, gray offline
- Pixel-snapped 1px dividers in subtle off-white at low alpha

## 4. Component Stylings

### Buttons

**Primary**
- Background: \`#5865f2\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 4px
- Hover: \`#4752c4\`
- Use: Primary CTAs, "Continue", "Join Server"

**Secondary**
- Background: \`#4e5058\`
- Text: \`#ffffff\`
- Padding: 8px 16px
- Radius: 4px
- Hover: \`#6d6f78\`

**Tertiary / Subtle (Link-style)**
- Background: transparent
- Text: \`#dbdee1\`
- Hover: text underlined, no background change

**Danger**
- Background: \`#da373c\`
- Text: \`#ffffff\`
- Hover: \`#a12d2f\`

### Inputs
- Background: \`#1e1f22\`
- Text: \`#dbdee1\`
- Border: 1px solid \`#1e1f22\`
- Radius: 4px
- Padding: 10px 12px
- Focus: border \`#5865f2\`

### Server Avatars
- Size: 48×48px
- Radius: 16px (rounded square) by default; transitions to 50% on hover and active.
- Active state: 4px white pill on the left edge of the icon column.

### Status Dots
- Size: 10×10px
- Border: 3px solid background-tertiary (creates the "notch" effect)
- Position: bottom-right of avatar.

### Cards / Embeds
- Background: \`#2b2d31\` (dark) or \`#f2f3f5\` (light)
- Left border: 4px solid embed accent color.
- Radius: 4px
- Padding: 8px 16px

### Mention Pill
- Background: \`rgba(88, 101, 242, 0.3)\`
- Text: \`#c9cdfb\`
- Padding: 0 2px
- Radius: 3px

## 5. Spacing & Layout

- **Base unit**: 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40.
- **Server rail**: 72px wide, fixed.
- **Channel sidebar**: 240px wide.
- **Member list**: 240px wide on desktop.
- **Chat column**: fluid, min 380px.

## 6. Motion

- **Duration**: 200ms for hover; 350ms for the avatar circle-morph; 80ms for tooltip fade.
- **Easing**: \`cubic-bezier(0.215, 0.61, 0.355, 1)\` for the avatar morph (snappy then settle).
- **Notification pulse**: 1.4s ease-in-out infinite on unread mention indicator.`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Discord — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/discord. Every visible
        value comes from tokens.css. Discord's signature moves: dark-first
        three-step depth ladder, gg sans with friendly geometry, Blurple
        accent (#5865f2), semi-transparent white borders."
    />

    <style>
      :root {
        --bg:           #313338;
        --surface:      #2b2d31;
        --surface-warm: #1e1f22;

        --fg:   #dbdee1;
        --fg-2: #f2f3f5;
        --muted: #949ba4;
        --meta:  #80848e;

        --border:      rgba(255, 255, 255, 0.06);
        --border-soft: #3f4147;

        --accent:        #5865f2;
        --accent-on:     #ffffff;
        --accent-hover:  #4752c4;
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #23a55a;
        --warn:    #f0b232;
        --danger:  #f23f43;

        --font-display: "gg sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:    "gg sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:    "gg mono", Consolas, "Andale Mono", "Courier New", Courier, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   20px;
        --text-2xl:  24px;
        --text-3xl:  32px;
        --text-4xl:  56px;

        --leading-body:     1.375;
        --leading-tight:    1.10;
        --tracking-display: -0.02em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 40px;

        --section-y-desktop: 80px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   4px;
        --radius-md:   8px;
        --radius-lg:   16px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised:
          rgba(0, 0, 0, 0.4) 0px 2px 4px,
          0 0 0 1px rgba(255, 255, 255, 0.06);

        --focus-ring: 0 0 0 3px rgba(88, 101, 242, 0.3);

        --motion-fast:   80ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
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

      /* ─── Typography ─────────────────────────── */
      h1, h2, h3 {
        font-family: var(--font-display);
        font-weight: 800;
        margin: 0;
        color: var(--fg-2);
        line-height: var(--leading-tight);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        /* 32px section: line-height 1.20, normal tracking. */
        line-height: 1.20;
        font-weight: 700;
      }
      h3 {
        font-size: var(--text-2xl);
        /* 24px page heading: line-height 1.25 per DESIGN.md.
           Overrides the shared 1.10 set above. */
        line-height: 1.25;
        font-weight: 700;
      }
      p { margin: 0; }
      .lead { font-size: var(--text-lg); line-height: 1.55; color: var(--muted); font-weight: 400; }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); color: var(--muted); }
      .eyebrow {
        font-size: var(--text-xs);
        font-weight: 500;
        color: var(--meta);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }

      /* ─── Buttons ─────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary { background: var(--accent); color: var(--accent-on); }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-secondary { background: #4e5058; color: #ffffff; }
      .btn-secondary:hover { background: #6d6f78; }
      .btn-danger { background: #da373c; color: #ffffff; }

      /* ─── Server avatars ─────────────────────── */
      .server-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3);
        background: var(--surface-warm);
        border-radius: var(--radius-md);
      }
      .server-icon {
        width: 48px;
        height: 48px;
        border-radius: 16px;
        background: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-sm);
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: border-radius var(--motion-base) cubic-bezier(0.215, 0.61, 0.355, 1);
      }
      .server-icon:hover { border-radius: 50%; }

      /* ─── Mention pill ───────────────────────── */
      .mention {
        display: inline;
        background: rgba(88, 101, 242, 0.3);
        color: #c9cdfb;
        padding: 0 2px;
        border-radius: 3px;
        font-weight: 500;
      }

      /* ─── Card ───────────────────────────────── */
      .card {
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: var(--radius-md);
        padding: var(--space-6);
      }

      /* ─── Inputs ─────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-sm); font-weight: 600; color: var(--fg-2); text-transform: uppercase; letter-spacing: 0.04em; }
      .field input {
        background: var(--surface-warm);
        color: var(--fg);
        border: 1px solid var(--surface-warm);
        border-radius: var(--radius-sm);
        padding: 10px 12px;
        font-size: var(--text-base);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--muted); }
      .field input:focus { border-color: var(--accent); }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--space-12);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-4);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
    </style>
  <style data-uma-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-uma-form-layout>.uma-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .uma-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · discord</p>
            <h1>Your place to talk.</h1>
            <p class="lead" style="max-width:46ch">
              Discord is the easiest way to talk over voice, video, and text.
              Dark-first, Blurple accent, gg sans — every value from tokens.css.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside style="display:flex;gap:var(--space-4);align-items:flex-start">
            <div class="server-rail">
              <div class="server-icon">OD</div>
              <div style="width:32px;height:2px;background:var(--border-soft);border-radius:2px"></div>
              <div class="server-icon" style="background:#23a55a;font-size:18px">🎮</div>
              <div class="server-icon" style="background:#8250df;font-size:18px">🎨</div>
            </div>
            <div class="card stack-3" style="flex:1">
              <p class="eyebrow"># general</p>
              <p style="font-size:var(--text-base);color:var(--fg)">
                <span style="font-weight:500;color:#f2f3f5">Ada</span>&nbsp;
                <span style="font-size:var(--text-xs);color:var(--meta)">Today at 4:32 PM</span>
              </p>
              <p style="font-size:var(--text-base)">
                Adding token fixtures for <span class="mention">@batch-2</span> brands today.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <div class="stack-3" style="margin-bottom:var(--space-6)">
          <p class="eyebrow">What this fixture exercises</p>
          <h2>Dark depth through luminance steps.</h2>
        </div>

        <div class="features-grid">
          <article class="card stack-3">
            <h3>Three-step depth</h3>
            <p class="body-sm">
              #1e1f22 server rail → #2b2d31 sidebar → #313338 chat. Each step
              slightly lighter. No color variation — only luminance.
            </p>
          </article>
          <article class="card stack-3">
            <h3>Blurple accent</h3>
            <p class="body-sm">
              #5865f2 — reserved for CTAs, mentions, and "you" affordances.
              Hover: #4752c4. Used sparingly so it pops against muted neutrals.
            </p>
          </article>
          <article class="card stack-3">
            <h3>gg sans geometry</h3>
            <p class="body-sm">
              Friendly rounded terminals on a/g/s. Weight 400/500/600/700/800 —
              hierarchy through contrast, not color. 16px body never shrinks.
            </p>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="uma-form-layout">
          <div class="stack-4">
            <p class="eyebrow">Form components</p>
            <h2>Inputs on dark surfaces.</h2>
            <p class="lead" style="max-width:44ch">
              Background: #1e1f22. Border shifts to Blurple on focus.
              Labels: uppercase, 0.04em tracking, weight 600.
            </p>
          </div>
          <div role="group" class="uma-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="username">Username</label>
              <input id="username" type="text" placeholder="cooluser#1234" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Continue</button>
              <button type="button" class="btn btn-secondary">Back</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=discord_default;return module.exports}});
//# sourceMappingURL=client.discord.js.map