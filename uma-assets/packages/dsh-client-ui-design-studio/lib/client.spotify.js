
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.spotify.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var spotify_default={"contract":`## 1. Visual Theme & Atmosphere

Spotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (\`#121212\`, \`#181818\`, \`#1f1f1f\`) where album art and content become the primary source of color. The design philosophy is "content-first darkness" — the UI recedes into shadow so that music, podcasts, and playlists can glow. Every surface is a shade of charcoal, creating a theater-like environment where the only true color comes from the iconic Spotify Green (\`#1ed760\`) and the album artwork itself.

The typography uses SpotifyMixUI and SpotifyMixUITitle — proprietary fonts from the CircularSp family (Circular by Lineto, customized for Spotify) with an extensive fallback stack that includes Arabic, Hebrew, Cyrillic, Greek, Devanagari, and CJK fonts, reflecting Spotify's global reach. The type system is compact and functional: 700 (bold) for emphasis and navigation, 600 (semibold) for secondary emphasis, and 400 (regular) for body. Buttons use uppercase with positive letter-spacing (1.4px–2px) for a systematic, label-like quality.

What distinguishes Spotify is its pill-and-circle geometry. Primary buttons use 500px–9999px radius (full pill), circular play buttons use 50% radius, and search inputs are 500px pills. Combined with heavy shadows (\`rgba(0,0,0,0.5) 0px 8px 24px\`) on elevated elements and a unique inset border-shadow combo (\`rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset\`), the result is an interface that feels like a premium audio device — tactile, rounded, and built for touch.

**Key Characteristics:**
- Near-black immersive dark theme (\`#121212\`–\`#1f1f1f\`) — UI disappears behind content
- Spotify Green (\`#1ed760\`) as singular brand accent — never decorative, always functional
- SpotifyMixUI/CircularSp font family with global script support
- Pill buttons (500px–9999px) and circular controls (50%) — rounded, touch-optimized
- Uppercase button labels with wide letter-spacing (1.4px–2px)
- Heavy shadows on elevated elements (\`rgba(0,0,0,0.5) 0px 8px 24px\`)
- Semantic colors: negative red (\`#f3727f\`), warning orange (\`#ffa42b\`), announcement blue (\`#539df5\`)
- Album art as the primary color source — the UI is achromatic by design

## 4. Component Stylings

### Buttons

**Dark Pill**
- Background: \`#1f1f1f\`
- Text: \`#ffffff\` or \`#b3b3b3\`
- Padding: 8px 16px
- Radius: 9999px (full pill)
- Use: Navigation pills, secondary actions

**Dark Large Pill**
- Background: \`#181818\`
- Text: \`#ffffff\`
- Padding: 0px 43px
- Radius: 500px
- Use: Primary app navigation buttons

**Light Pill**
- Background: \`#eeeeee\`
- Text: \`#181818\`
- Radius: 500px
- Use: Light-mode CTAs (cookie consent, marketing)

**Outlined Pill**
- Background: transparent
- Text: \`#ffffff\`
- Border: \`1px solid #7c7c7c\`
- Padding: 4px 16px 4px 36px (asymmetric for icon)
- Radius: 9999px
- Use: Follow buttons, secondary actions

**Circular Play**
- Background: \`#1f1f1f\`
- Text: \`#ffffff\`
- Padding: 12px
- Radius: 50% (circle)
- Use: Play/pause controls

### Cards & Containers
- Background: \`#181818\` or \`#1f1f1f\`
- Radius: 6px–8px
- No visible borders on most cards
- Hover: slight background lightening
- Shadow: \`rgba(0,0,0,0.3) 0px 8px 8px\` on elevated

### Inputs
- Search input: \`#1f1f1f\` background, \`#ffffff\` text
- Radius: 500px (pill)
- Padding: 12px 96px 12px 48px (icon-aware)
- Focus: border becomes \`#000000\`, outline \`1px solid\`

### Navigation
- Dark sidebar with SpotifyMixUI 14px weight 700 for active, 400 for inactive
- \`#b3b3b3\` muted color for inactive items, \`#ffffff\` for active
- Circular icon buttons (50% radius)
- Spotify logo top-left in green

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 2px, 3px, 4px, 5px, 6px, 8px, 10px, 12px, 14px, 15px, 16px, 20px

### Grid & Container
- Sidebar (fixed) + main content area
- Grid-based album/playlist cards
- Full-width now-playing bar at bottom
- Responsive content area fills remaining space

### Whitespace Philosophy
- **Dark compression**: Spotify packs content densely — playlist grids, track lists, and navigation are all tightly spaced. The dark background provides visual rest between elements without needing large gaps.
- **Content density over breathing room**: This is an app, not a marketing site. Every pixel serves the listening experience.

### Border Radius Scale
- Minimal (2px): Badges, explicit tags
- Subtle (4px): Inputs, small elements
- Standard (6px): Album art containers, cards
- Comfortable (8px): Sections, dialogs
- Medium (10px–20px): Panels, overlay elements
- Large (100px): Large pill buttons
- Pill (500px): Primary buttons, search input
- Full Pill (9999px): Navigation pills, search
- Circle (50%): Play buttons, avatars, icons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base (Level 0) | \`#121212\` background | Deepest layer, page background |
| Surface (Level 1) | \`#181818\` or \`#1f1f1f\` | Cards, sidebar, containers |
| Elevated (Level 2) | \`rgba(0,0,0,0.3) 0px 8px 8px\` | Dropdown menus, hover cards |
| Dialog (Level 3) | \`rgba(0,0,0,0.5) 0px 8px 24px\` | Modals, overlays, menus |
| Inset (Border) | \`rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset\` | Input borders |

**Shadow Philosophy**: Spotify uses notably heavy shadows for a dark-themed app. The 0.5 opacity shadow at 24px blur creates a dramatic "floating in darkness" effect for dialogs and menus, while the 0.3 opacity at 8px blur provides a more subtle card lift. The unique inset border-shadow combination on inputs creates a recessed, tactile quality.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <425px | Compact mobile layout |
| Mobile | 425–576px | Standard mobile |
| Tablet | 576–768px | 2-column grid |
| Tablet Large | 768–896px | Expanded layout |
| Desktop Small | 896–1024px | Sidebar visible |
| Desktop | 1024–1280px | Full desktop layout |
| Large Desktop | >1280px | Expanded grid |

### Collapsing Strategy
- Sidebar: full → collapsed → hidden
- Album grid: 5 columns → 3 → 2 → 1
- Now-playing bar: maintained at all sizes
- Search: pill input maintained, width adjusts
- Navigation: sidebar → bottom bar on mobile`,"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Spotify — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/spotify. Every visible
        value comes from tokens.css. Spotify's signature moves: near-black
        immersive surfaces, Spotify Green (#1ed760) for play/active/CTA only,
        full-pill and circular geometry, uppercase button labels with wide tracking."
    />

    <style>
      :root {
        --bg:           #121212;
        --surface:      #181818;
        --surface-warm: #1f1f1f;

        --fg:   #ffffff;
        --fg-2: #fdfdfd;
        --muted: #b3b3b3;
        --meta:  #cbcbcb;

        --border:      #4d4d4d;
        --border-soft: rgba(255, 255, 255, 0.1);

        --accent:        #1ed760;
        --accent-on:     #000000;
        --accent-hover:  #1db954;
        --accent-active: color-mix(in oklab, var(--accent), black 10%);

        --success: #1ed760;
        --warn:    #ffa42b;
        --danger:  #f3727f;

        --font-display: "SpotifyMixUITitle", "CircularSp", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:    "SpotifyMixUI", "CircularSp", "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

        --text-xs:   10px;
        --text-sm:   12px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   20px;
        --text-2xl:  24px;
        --text-3xl:  24px;
        --text-4xl:  24px;

        --leading-body:     1.50;
        --leading-tight:    1.00;
        --tracking-display: normal;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 64px;
        --section-y-tablet:  40px;
        --section-y-phone:   24px;

        --radius-sm:   9999px;
        --radius-md:   6px;
        --radius-lg:   8px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: rgba(0, 0, 0, 0.3) 0px 8px 8px;

        --focus-ring: 0 0 0 3px rgba(30, 215, 96, 0.4);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: ease;

        --container-max:            1280px;
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
      h1, h2 {
        font-family: var(--font-display);
        font-weight: 700;
        margin: 0;
        color: var(--fg);
        line-height: var(--leading-tight);
      }
      h1 { font-size: var(--text-2xl); }
      h2 { font-size: var(--text-2xl); }
      h3 {
        font-family: var(--font-body);
        font-size: var(--text-lg);
        font-weight: 600;
        line-height: 1.30;
        margin: 0;
        color: var(--fg);
      }
      p { margin: 0; }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); color: var(--muted); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }

      /* ─── Buttons — full pill; uppercase + wide tracking on labels. */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 8px 16px;
        border-radius: var(--radius-sm);   /* 9999px full pill */
        font-family: var(--font-body);
        font-size: 14px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        border: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
                    opacity var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
      /* Standard dark pill. */
      .btn-dark {
        background: var(--surface-warm);
        color: var(--fg);
      }
      .btn-dark:hover { background: #2a2a2a; }
      /* Outlined pill. */
      .btn-outline {
        background: transparent;
        color: var(--fg);
        border: 1px solid var(--border);
        padding: 4px 16px 4px 36px;
      }
      /* Uppercase CTA label variant. */
      .btn-upper {
        text-transform: uppercase;
        letter-spacing: 1.4px;
        font-size: 12px;
      }
      /* Green circular play button. */
      .btn-play {
        background: var(--accent);
        color: var(--accent-on);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        padding: 0;
        justify-content: center;
        flex-shrink: 0;
      }
      .btn-play:hover { background: var(--accent-hover); transform: scale(1.04); }

      /* ─── Nav pill ───────────────────────────── */
      .nav-pill {
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        border-radius: var(--radius-sm);
        font-size: 14px;
        font-weight: 700;
        color: var(--fg);
        background: var(--surface);
        text-decoration: none;
        transition: background-color var(--motion-fast) var(--ease-standard);
      }
      .nav-pill.active { background: var(--surface-warm); }
      .nav-pill:hover { background: #2a2a2a; }

      /* ─── Track row ──────────────────────────── */
      .track-row {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-md);
        transition: background-color var(--motion-fast) var(--ease-standard);
        cursor: pointer;
      }
      .track-row:hover { background: rgba(255, 255, 255, 0.1); }
      .track-thumb {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        background: var(--surface-warm);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
      .track-info { flex: 1; min-width: 0; }
      .track-name { font-size: var(--text-base); font-weight: 400; color: var(--fg); }
      .track-artist { font-size: var(--text-sm); color: var(--muted); }
      .track-duration { font-size: var(--text-sm); color: var(--muted); font-tabular-nums: tabular-nums; }

      /* ─── Card ───────────────────────────────── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        transition: background-color var(--motion-base) var(--ease-standard);
      }
      .card:hover { background: #202020; box-shadow: var(--elev-raised); }

      /* ─── Layout ─────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
        gap: var(--space-8);
        align-items: center;
      }
      @media (max-width: 1023px) { .hero-grid { grid-template-columns: 1fr; } }
      .album-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-4);
      }
      @media (max-width: 1023px) { .album-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 639px)  { .album-grid { grid-template-columns: 1fr 1fr; } }
      .hero-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-6); flex-wrap: wrap; align-items: center; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
    </style>
  </head>
  <body>
    <main class="container">
      <!-- HERO -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <h1>Music for everyone.</h1>
            <p class="body-muted" style="font-size:var(--text-base);margin-top:var(--space-3)">
              Millions of songs and podcasts. No credit card needed.
              Dark immersion — the UI recedes so content can glow.
            </p>
            <div class="hero-actions">
              
              
              
            </div>
          </div>

          <aside>
            <div class="card stack-4">
              <p style="font-size:var(--text-sm);font-weight:700;color:var(--fg)">Now playing</p>
              <div class="track-row" style="padding:0">
                <div class="track-thumb" style="background:var(--accent);color:#000;font-size:24px">♪</div>
                <div class="track-info">
                  <p class="track-name">design-systems/tokens</p>
                  <p class="track-artist">OpenDesign · 2026</p>
                </div>
                <span class="track-duration">3:22</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- FEATURES / PLAYLIST -->
      <section data-od-id="features">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-5)">
          <h2>Recent picks</h2>
          <a href="#" style="font-size:var(--text-sm);font-weight:700;color:var(--muted);text-decoration:none;text-transform:uppercase;letter-spacing:1.4px">Show all</a>
        </div>

        <div class="album-grid">
          <div class="card stack-3">
            <div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#5e6ad2,#1ed760);border-radius:var(--radius-md);margin-bottom:var(--space-3)"></div>
            <p style="font-weight:700;font-size:var(--text-base)">Token Fixtures</p>
            <p class="body-sm">Brand oracle collection</p>
          </div>
          <div class="card stack-3">
            <div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#f54e00,#cf2d56);border-radius:var(--radius-md);margin-bottom:var(--space-3)"></div>
            <p style="font-weight:700;font-size:var(--text-base)">Cursor Sessions</p>
            <p class="body-sm">Warm cream meets code</p>
          </div>
          <div class="card stack-3">
            <div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#10a37f,#0d0d0d);border-radius:var(--radius-md);margin-bottom:var(--space-3)"></div>
            <p style="font-weight:700;font-size:var(--text-base)">OpenAI Calm</p>
            <p class="body-sm">Research lab dressed public</p>
          </div>
          <div class="card stack-3">
            <div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,#0969da,#1a7f37);border-radius:var(--radius-md);margin-bottom:var(--space-3)"></div>
            <p style="font-weight:700;font-size:var(--text-base)">GitHub Primer</p>
            <p class="body-sm">Density over decoration</p>
          </div>
        </div>
      </section>

      <!-- TRACKS -->
      <section data-od-id="tracks">
        <h2 style="margin-bottom:var(--space-5)">Track list</h2>
        <div style="display:flex;flex-direction:column;gap:var(--space-1)">
          <div class="track-row">
            <span style="color:var(--muted);font-size:var(--text-sm);width:16px;text-align:right">1</span>
            <div class="track-thumb">🎵</div>
            <div class="track-info">
              <p class="track-name">tokens.css</p>
              <p class="track-artist">notion · design-systems</p>
            </div>
            <span class="track-duration">4:12</span>
          </div>
          <div class="track-row">
            <span style="color:var(--accent);font-size:var(--text-sm);width:16px;text-align:right">▶</span>
            <div class="track-thumb" style="background:linear-gradient(135deg,#5e6ad2,#191a1b)">🎸</div>
            <div class="track-info">
              <p class="track-name" style="color:var(--accent)">components.html</p>
              <p class="track-artist">linear-app · design-systems</p>
            </div>
            <span class="track-duration">3:55</span>
          </div>
          <div class="track-row">
            <span style="color:var(--muted);font-size:var(--text-sm);width:16px;text-align:right">3</span>
            <div class="track-thumb">🎹</div>
            <div class="track-info">
              <p class="track-name">DESIGN.md</p>
              <p class="track-artist">github · design-systems</p>
            </div>
            <span class="track-duration">2:48</span>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=spotify_default;return module.exports}});
//# sourceMappingURL=client.spotify.js.map