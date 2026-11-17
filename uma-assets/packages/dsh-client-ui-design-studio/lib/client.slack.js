
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.slack.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var slack_default={"contract":`## 1. Visual Theme & Atmosphere

Slack's identity is built around the idea that work should feel human and even a little fun. The canonical surface is **light** — white content areas with a deep aubergine (\`#4A154B\`) sidebar — the inverse of dark-first tools. This contrast is intentional: the sidebar is a calm, always-present navigation anchor, while the content area is bright and open.

The logo palette — blue, green, yellow, red — appears primarily in the hashtag icon and marketing contexts, not scattered through the UI. In the product itself, Slack uses a restrained, professional color system with aubergine as the sole brand anchor.

**Key Characteristics:**
- Light-first content surfaces: white \`#FFFFFF\` and near-white \`#F8F8F8\`
- Deep aubergine \`#4A154B\` sidebar — the brand's most recognizable UI element
- Four logo accent colors (blue, green, yellow, red) used sparingly as highlights only
- Larsseit for headings (marketing), system sans-serif for UI
- Rounded but not cartoonish: 4–8px radius on most components
- Dense but breathable: compact message rows with clear thread hierarchy
- Warm and conversational tone — emojis, reactions, and illustrations are first-class

---

## 4. Component Stylings

### Buttons



### Input Fields


### Sidebar Channel Item


### Unread Badge


### Message Attachments / Cards


### Reactions


---

## 5. Layout Principles

### Three-Column Layout


### Spacing System (4px base)
| Token | Value | Usage |
|---|---|---|
| \`--space-1\` | 4px | Tight gaps |
| \`--space-2\` | 8px | Component padding |
| \`--space-3\` | 12px | Input padding |
| \`--space-4\` | 16px | Standard padding |
| \`--space-6\` | 24px | Card padding |
| \`--space-8\` | 32px | Section gaps |

### Sidebar Structure


### Message Composer
- Pinned to bottom of message area
- \`border: 1px solid #DDDDDD\`, \`border-radius: 8px\`, \`margin: 0 16px 16px\`
- Toolbar: emoji, attach, format, send button

---

## 6. Depth & Elevation

Slack uses light shadows on a light surface:

| Level | Usage | Shadow |
|---|---|---|
| Flat | Message rows, sidebar items | none |
| Low | Cards, inputs | \`0 1px 3px rgba(0,0,0,0.08)\` |
| Medium | Dropdowns, popovers | \`0 4px 12px rgba(0,0,0,0.12)\` |
| High | Modals, dialogs | \`0 8px 24px rgba(0,0,0,0.15)\` |
| Overlay | Modal backdrops | \`rgba(0,0,0,0.5)\` |

---

## 8. Responsive Behavior

### Breakpoints
| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 768px | Single panel, sidebar as left drawer |
| Tablet | 768–1024px | Sidebar + message area only |
| Desktop | > 1024px | Full three-column layout |

### Mobile Adaptations
- Sidebar: left drawer, swipe right to open
- Bottom tab bar: Home, DMs, Activity, You
- Thread panel: full-screen overlay
- Composer: pinned above keyboard
- Channel list items: 44px touch target height
- Aubergine top header bar retained on mobile

---`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Slack — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/slack. Every visible
        value comes from tokens.css. Slack's signature moves: aubergine
        sidebar (#4A154B), white content surfaces, Larsseit display,
        4px button radius, logo-color semantic palette."
    />

    <style>
      :root {
        --bg:           #ffffff;
        --surface:      #f8f8f8;
        --surface-warm: var(--surface);

        --fg:   #1d1c1d;
        --fg-2: #1d1c1d;
        --muted: #616061;
        --meta:  #616061;

        --border:      #dddddd;
        --border-soft: #f1f1f1;

        --accent:        #4a154b;
        --accent-on:     #ffffff;
        --accent-hover:  #611f69;
        --accent-active: #350d36;

        --success: #2eb67d;
        --warn:    #ecb22e;
        --danger:  #e01e5a;

        --font-display: "Larsseit", "Helvetica Neue", Arial, sans-serif;
        --font-body:    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        --font-mono:    "Monaco", "Menlo", "Courier New", Courier, monospace;

        --text-xs:   12px;
        --text-sm:   13px;
        --text-base: 15px;
        --text-lg:   16px;
        --text-xl:   22px;
        --text-2xl:  28px;
        --text-3xl:  36px;
        --text-4xl:  48px;

        --leading-body:     1.5;
        --leading-tight:    1.10;
        --tracking-display: -0.021em;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 80px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   4px;
        --radius-md:   8px;
        --radius-lg:   12px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 4px 12px rgba(0, 0, 0, 0.12);

        --focus-ring: 0 0 0 2px rgba(18, 100, 163, 0.25);

        --motion-fast:   150ms;
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
      section + section { border-top: 1px solid var(--border-soft); }
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
        font-weight: 700;
        margin: 0;
        line-height: var(--leading-tight);
        color: var(--fg);
      }
      h1 {
        font-size: var(--text-4xl);
        letter-spacing: var(--tracking-display);
      }
      h2 {
        font-size: var(--text-3xl);
        /* 36px section hero: line-height 1.15, tracking -0.5px (-0.014em). */
        line-height: 1.15;
        letter-spacing: -0.014em;
      }
      h3 {
        font-size: var(--text-2xl);
        /* 28px heading 1: line-height 1.25 per DESIGN.md.
           Overrides the shared 1.10 set above. */
        line-height: 1.25;
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        line-height: 1.5;
        color: var(--muted);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons ─────────────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 0 var(--space-4);
        height: 36px;
        border-radius: var(--radius-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-primary:hover { background: var(--accent-hover); }
      .btn-secondary {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
      }
      .btn-secondary:hover { background: var(--surface); }
      .btn-danger {
        background: var(--danger);
        color: #ffffff;
      }

      /* ─── Sidebar ─────────────────────────────── */
      .sidebar {
        background: var(--accent);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        color: rgba(255, 255, 255, 0.9);
        font-size: var(--text-base);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 220px;
      }
      .sidebar-title {
        font-weight: 700;
        color: #ffffff;
        font-size: var(--text-base);
        padding: var(--space-2) var(--space-4);
        margin-bottom: var(--space-2);
      }
      .channel-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        height: 28px;
        padding: 0 var(--space-4);
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.7);
        font-size: var(--text-base);
        font-weight: 400;
        cursor: pointer;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    color var(--motion-fast) var(--ease-standard);
      }
      .channel-item:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
      .channel-item.active {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
      .channel-item.unread {
        color: #ffffff;
        font-weight: 700;
      }

      /* ─── Reaction ───────────────────────────── */
      .reaction {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--surface);
        padding: 2px 8px;
        font-size: var(--text-sm);
        cursor: pointer;
        transition: background-color var(--motion-fast) var(--ease-standard);
      }
      .reaction:hover { background: var(--border-soft); }
      .reaction.active {
        background: rgba(18, 100, 163, 0.1);
        border-color: #1264a3;
      }

      /* ─── Input ──────────────────────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label { font-size: var(--text-base); font-weight: 700; color: var(--fg); }
      .field input {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 8px 12px;
        font-size: var(--text-base);
        height: 36px;
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input::placeholder { color: var(--muted); }
      .field input:focus {
        border-color: #1264a3;
        box-shadow: var(--focus-ring);
      }

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
        gap: var(--space-5);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; }
    </style>

    <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
<style data-hey-layout-repair>.hey-preview-form > div { flex-wrap: wrap; } .hey-preview-form button { flex-shrink: 0; max-width: 100%; white-space: normal; }</style>
<style data-hey-form-layout>.hey-form-layout { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-12);align-items:start; } @media (max-width: 1023px) { .hey-form-layout { grid-template-columns: minmax(0, 1fr); } }</style>
</head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <h1>Made for people. Built for productivity.</h1>
            <p class="lead" style="max-width:48ch">
              Slack brings your team's communication and tools together in one
              place. Warm, human, and structured around the aubergine sidebar
              that's become a workplace icon.
            </p>
            <div class="hero-actions">
              
              
            </div>
          </div>

          <aside>
            <div class="sidebar">
              <div class="sidebar-title">open-design ▼</div>
              <div class="channel-item"># threads</div>
              <div class="channel-item"># all-dms</div>
              <div class="channel-item active"># general</div>
              <div class="channel-item unread"># design ●</div>
              <div class="channel-item"># engineering</div>
              <div class="channel-item"># random</div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES -->
      <section data-od-id="features">
        <h2 style="max-width:28ch;margin-bottom:var(--space-6)">Warm, professional, human.</h2>

        <div class="features-grid">
          <article style="border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-6)" class="stack-3">
            <h3>Aubergine sidebar</h3>
            <p class="body-muted body-sm">
              #4A154B — the most recognizable UI element in workplace software.
              Channel items: 28px height, 6px radius, bold when unread.
            </p>
          </article>
          <article style="border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-6)" class="stack-3">
            <h3>Logo palette</h3>
            <p class="body-muted body-sm">
              Blue (#36C5F0), green (#2EB67D), yellow (#ECB22E), red (#E01E5A) —
              strictly semantic. Info, success, warning, danger. Never decorative.
            </p>
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">
              <span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#36c5f0"></span>
              <span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#2eb67d"></span>
              <span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#ecb22e"></span>
              <span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#e01e5a"></span>
            </div>
          </article>
          <article style="border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-6)" class="stack-3">
            <h3>Reactions</h3>
            <p class="body-muted body-sm">
              Pill border-radius 24px, 1px border, surface background. Active
              state: tinted blue. Timestamps show on hover only.
            </p>
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);flex-wrap:wrap">
              <span class="reaction active">👍 3</span>
              <span class="reaction">🎉 1</span>
              <span class="reaction">❤️ 2</span>
            </div>
          </article>
        </div>
      </section>

      <!-- FORM -->
      <section data-od-id="form">
        <div class="hey-form-layout">
          <div class="stack-4">
            <h2>Inputs and buttons.</h2>
            <p class="body-muted" style="max-width:44ch">
              4px radius on buttons and inputs — not cartoonish.
              Focus ring: 2px solid #1264A3. Height 36px, font-size 15px.
            </p>
          </div>
          <div role="group" class="hey-preview-form" style="display:flex;flex-direction:column;gap:var(--space-4);max-width:400px">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@company.com" />
            </div>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2)">
              <button type="submit" class="btn btn-primary">Get started</button>
              <button type="button" class="btn btn-secondary">Skip</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=slack_default;return module.exports}});
//# sourceMappingURL=client.slack.js.map