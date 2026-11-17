
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.xiaohongshu.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var xiaohongshu_default={"contract":`## 1. Visual Theme & Atmosphere

Xiaohongshu (小红书 / RED) is the visual opposite of a SaaS console. Open the app and you do not see "Xiaohongshu" — you see other people's breakfasts, hotel sofas, the lipstick they bought on the third try. That is by design. The entire UI tries to act as a transparent picture frame: white surfaces, low-noise components, no shadow stacks competing for attention. Everything yields to the user-uploaded image.

The palette is brutally restrained. A near-white canvas (\`#FFFFFF\` / \`#F5F5F5\`) covers the majority of every page. Neutrals are built from translucent overlays (\`rgba(48,48,52, 0.05~0.20)\`) rather than discrete grey steps — the same fill drops onto white for hover, onto a card for divider, onto a button for disabled. The brand red \`#FF2442\` is the only saturated color the system permits, and it shows up only on tab indicators, the heart-active state, and primary CTAs. Semantic colors (success green, warning orange, info blue) exist as tokens but are nearly invisible in the consumer flow — danger is not a separate color, it just reuses brand red.

Form is soft. Cards round at 12–16px. Buttons round all the way to pills (\`border-radius: 9999px\`). Shadows are essentially absent — depth comes from spacing and rounding, not elevation. The signature layout is a two-column (mobile) or 5-column (PC) waterfall masonry where rows do not align — image height drives card height, and that misalignment *is* the realism.

Type is PingFang SC at medium weight throughout. There is no thin-light heroic display, no all-caps Latin headline. Hierarchy is compact (\`H1: 32/600\`, body: \`14-16/400\`), tracking is \`0\`, and digits use a custom \`RED Number\` family so counts on like buttons line up. The voice of the writing matches the visual: second person, conversational, never enterprise. "你的生活兴趣社区" — *your* lifestyle interest community, not "the platform".

The result reads like a slightly worn lifestyle magazine with a few handwritten Post-its tucked between the pages. Not Apple-store cold-minimal. Not Lark efficiency-console. Definitely not any SaaS dashboard. The design baseline is *daily-ness* — the user should not feel they are using software, only flipping through someone else's life.

**Key Characteristics:**
- Singular brand red (\`#FF2442\` token, \`#FF2E4D\` at the component layer) — never two saturated colors at once
- Translucent neutrals (\`rgba(48,48,52, .05/.10/.20)\`) instead of discrete grey steps
- Generous rounding everywhere: cards 12–16px, buttons fully pill, sheets 16px top-only
- Near-zero shadow — flat by default
- PingFang SC at 400/500/600 only; no thin display weights
- Content (user photos) is the color source — UI yields
- Bottom sheet for secondary actions on mobile, never modal
- Voice: second person, lifestyle, never SaaS-enterprise

## 4. Component Stylings

### Buttons

**Primary**
- Background: \`#FF2442\` (or \`#FF2E4D\` when matching the live \`.reds-button-new.primary\` class)
- Text: \`#FFFFFF\`, weight 500, 14px
- Radius: **pill — \`border-radius: 9999px\`**
- Padding: \`8px 20px\` small / \`12px 32px\` large
- No shadow

**Secondary (filled)**
- Background: \`rgba(48,48,52,0.10)\` (\`--fill2\`) — soft grey
- Text: \`rgba(0,0,0,0.80)\` (\`--title\`)
- Same pill radius

**Secondary (outlined)**
- Background: \`#FFFFFF\`
- Border: \`1px solid #FF2E4D\`
- Text: \`#FF2E4D\`
- Pill radius. Used for the unfollowed-state follow CTA on profile cards.

**Icon button (like / collect / comment)**
- Pure icon (24px) stacked over count (12px, \`rgba(0,0,0,0.45)\`)
- No background plate
- Active state: icon flips to \`#FF2442\` (heart) or \`#FDBC5F\` (star); count text matches

### Follow Button — three-state (highest-recognition component)

| State | Background | Label (Chinese / English) | Text | Shape |
|---|---|---|---|---|
| Not following | \`#FF2442\` | \`+ 关注\` (Follow) | white | pill |
| Following | \`rgba(48,48,52,0.10)\` | \`已关注\` (Following) | \`rgba(0,0,0,0.45)\` | pill |
| Mutual | \`rgba(48,48,52,0.10)\` | \`互相关注\` (Mutual) | \`rgba(0,0,0,0.62)\` | pill |

Feed-card variant: \`6px 14px\` padding, 12px text. Profile-page variant: \`8px 20px\`, 14px text.

### Cards (Feed / Note Card)

- Radius **12px** (16px for larger feature cards)
- **No box-shadow by default.** White card sits on \`#F5F5F5\` canvas — separation comes from the canvas color, not elevation.
- Structure: image fills top edge-to-edge → title (1–2 lines, 12px padding) → footer (32px round avatar + nickname + heart + count)
- Image clips to top corners only; bottom corners are square because the image fills to the bottom of the image region.
- PC hover: subtle \`translateY(-2px)\` plus a very light shadow (\`0 4px 12px rgba(0,0,0,0.08)\`). Mobile: no hover state.

### Inputs / Search

- Background: \`#F5F5F5\`
- Border: none (focus may add a \`1px solid\` of \`--separator\`)
- Radius: pill (or 20px for taller fields)
- Height: 36–40px
- Inline magnifier icon at the leading edge

### Tabs / Segmented Control

- Text-only tabs with a **2px underline bar** — never pill background, never colored chip.
- Active: text color shifts to \`rgba(0,0,0,0.80)\` and weight bumps to 600; underline bar uses \`#FF2E4D\`, width matches text width.
- Inactive: text \`rgba(0,0,0,0.45)\`, weight 400.
- Tab spacing: ~40px.

### Tags / Topics

- Pill rectangle, \`padding: 4px 12px\`, \`font-size: 12px\`
- Default: \`rgba(48,48,52,0.10)\` bg + \`rgba(0,0,0,0.62)\` text
- Trending / featured: \`#FF2442\` bg + white text

### Badges / Counts

- Numeric badge: \`#FF2442\` bg + white digit, min 16×16, pill
- Pure red dot: 8px diameter, offset \`-4px / -4px\` from icon corner
- HOT marker: small pill, \`#FF6B35\` or brand red, 10px white text

### Avatars

- Always circular (\`border-radius: 50%\`)
- Feed: 28–32px. Profile hero: 80–96px.
- No white stroke.
- Verification badges sit on the lower-right at ~25–30% of the avatar diameter:
  - Red V (creator)
  - Blue V (enterprise)

### Bottom Sheet (mobile only — replaces most modals)

- Slides from screen bottom over a \`rgba(0,0,0,0.5)\` scrim
- **Top-only radius \`16px 16px 0 0\`**
- Drag handle: \`4px × 36px\`, \`#E0E0E0\`, centered, ~6px below top edge
- Dismiss: drag-down past threshold, or tap scrim
- Used for: share, report, more-actions, comment-compose — almost everything that would be a modal on PC.

### PC Modal

- Centered, white background, 12px radius
- Light shadow (\`0 8px 32px rgba(0,0,0,0.12)\`) — the only place shadow is conspicuous

## 5. Layout Principles

### Spacing System (8pt grid)

Base unit 8px. Common stops: \`4 / 8 / 12 / 16 / 20 / 24 / 32\`. Section gaps jump to \`48 / 64\`.

### Responsive Waterfall (PC discover)

Five-column masonry at the standard desktop width, stepping down on narrower viewports.

| Viewport | Columns | Column gap |
|---|---|---|
| ≥ 960px | 5 | 10px |
| 690–960px | 4 | 10px |
| 500–690px | 3 | 10px |
| < 500px | 2 | 10px |

Implementation is JavaScript-positioned (\`translate3d\` + ResizeObserver), not CSS Grid, because card heights are unknown until images load. This also predates widespread CSS Masonry support (still behind flags in most browsers as of 2026); the JS approach buys cross-browser consistency at the cost of layout-shift risk on slow image loads. The masonry deliberately does not align rows — variable image height *is* the realism.

### Mobile Two-Column

- Two columns, each ~48.2% of viewport width
- Row gap ~7px
- Outer side margin \`12rpx\` per side (≈ 6px @ 375px)

### Note Detail (PC)

- Two-pane: left ~500px image carousel / right ~500px metadata + comments, total ~1100px
- Image aspect chosen at upload time — vertical 3:4 / square 1:1 / horizontal 4:3
- The carousel is the dominant visual; comments scroll independently on the right

### Profile

- 16:9 banner image at top
- Circular avatar (80–96px) overlaps banner / content edge
- Three-stat horizontal row (following / followers / likes-and-collects)
- Tab strip below: Notes / Saved / Liked (笔记 / 收藏 / 赞过)

### Creator / Ad Console (B2B)

Standard left-nav console: 200–240px sidebar + ~1000–1100px content area. Top of content is a row of stat cards (impressions, likes, follower delta), below is a list or chart region. **No left-border accent on cards.** Surfaces are white, separation is by spacing.

### Whitespace

- The discover grid is dense — *content* density is the value proposition.
- Section padding sits *between* feeds, not within them.
- Cards do not have internal vertical padding above the image — image is flush to the top of the card.

## 6. Depth & Elevation

Three levels, used sparingly.

| Level | Treatment | Use |
|---|---|---|
| Flat (0) | No shadow | Default — feed cards, tags, buttons (both modes) |
| Subtle (1) | \`0 4px 12px rgba(0,0,0,0.08)\` | PC card hover (light mode only) |
| Modal (2) | \`0 8px 32px rgba(0,0,0,0.12)\` | Centered modal on PC (light mode only) |
| Dark mode | Drop shadows or replace with a \`1px\` hairline (\`rgba(255,255,255,0.07)\`) | \`rgba(0,0,0,*)\` shadows are invisible on the \`#19191E\` canvas; the scrim alone provides modal separation, and the PC card-hover \`translateY(-2px)\` is dropped entirely (motion + shadow both read as no-ops against the dark surface) |

**Shadow is the exception, not the rule.** Depth comes from:
1. Background color contrast (\`#F5F5F5\` canvas under \`#FFFFFF\` cards)
2. Generous radius (cards visually float because corners are rounded)
3. Whitespace between elements

No neumorphism. No glassmorphism. No coloured shadows. Bottom sheet has no shadow at all — the scrim provides the separation. In dark mode, drop the PC card-hover effect (\`translateY(-2px)\` + alpha-on-black shadow) entirely; both motion and shadow read as no-ops against the dark canvas.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Discover columns | Notes |
|---|---|---|---|
| Mobile | < 500px | 2 | App-like density, edge-to-edge waterfall |
| Tablet | 500–690px | 3 | Padding eases, tap targets stay 44px+ |
| Small Desktop | 690–960px | 4 | Standard reading width |
| Desktop | ≥ 960px | 5 | Full waterfall, sidebar visible |

### Collapsing Strategy

- **Discover**: 5 → 4 → 3 → 2 columns; column gap stays at 10px throughout.
- **Note detail**: two-pane PC layout collapses to single-column stack on mobile (image carousel on top, body + comments below).
- **Profile**: stat row stays horizontal at 3 columns down to mobile; tab strip remains horizontal with overflow scroll.
- **Console (creator / ad)**: sidebar collapses to a hamburger drawer below ~768px; stat-card row wraps to 2-up.

### Touch Targets

- Minimum tap target 44×44px on mobile. Icon buttons render at 24px icon inside a 44×44 hit zone.
- Pill buttons keep 36–40px height on mobile to honor this without growing radius.

### Type at Mobile

- Body sizes do not shrink below 14px. Small captions stay at 12px to preserve density without becoming illegible on Chinese characters.`,"components":`<!doctype html>
<html lang="zh-CN">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>小红书 / Xiaohongshu — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/xiaohongshu. Every visible
        value comes from tokens.css. 小红书 / RED signature moves: grey
        canvas + white card masonry, PingFang SC throughout, brand red
        used exactly once per screen as accent, full-pill CTAs, soft
        black text (rgba 0,0,0,.8), no shadow until hover."
    />

    <style>
      :root {
        --bg:           #f5f5f5;
        --surface:      #ffffff;
        --surface-warm: #fafafa;

        --fg:    rgba(0, 0, 0, 0.8);
        --fg-2:  rgba(0, 0, 0, 0.62);
        --muted: rgba(0, 0, 0, 0.45);
        --meta:  rgba(0, 0, 0, 0.27);

        --border:      rgba(0, 0, 0, 0.08);
        --border-soft: rgba(0, 0, 0, 0.05);

        --accent:        #ff2442;
        --accent-on:     #ffffff;
        --accent-hover:  #ff2e4d;
        --accent-active: #e6203a;

        --success: #02b940;
        --warn:    #ff7d03;
        --danger:  #ff2442;

        --font-display: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body:    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono:    ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs:   12px;
        --text-sm:   14px;
        --text-base: 16px;
        --text-lg:   18px;
        --text-xl:   20px;
        --text-2xl:  24px;
        --text-3xl:  28px;
        --text-4xl:  32px;

        --leading-body:     1.5;
        --leading-tight:    1.25;
        --tracking-display: 0;

        --space-1:  4px;
        --space-2:  8px;
        --space-3:  12px;
        --space-4:  16px;
        --space-5:  20px;
        --space-6:  24px;
        --space-8:  32px;
        --space-12: 48px;

        --section-y-desktop: 64px;
        --section-y-tablet:  48px;
        --section-y-phone:   32px;

        --radius-sm:   8px;
        --radius-md:   12px;
        --radius-lg:   16px;
        --radius-pill: 9999px;

        --elev-flat:   none;
        --elev-ring:   0 0 0 1px var(--border);
        --elev-raised: 0 4px 12px rgba(0, 0, 0, 0.08);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast:   150ms;
        --motion-base:   200ms;
        --ease-standard: cubic-bezier(0.2, 0, 0, 1);

        --container-max:            1200px;
        --container-gutter-desktop: 24px;
        --container-gutter-tablet:  16px;
        --container-gutter-phone:   12px;
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
        -moz-osx-font-smoothing: grayscale;
      }

      /* ─── Layout primitives ─────────────────────────────────── */
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

      /* ─── Typography — PingFang SC throughout, tracking 0 ───── */
      h1, h2, h3 {
        margin: 0;
        color: var(--fg);
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
      }
      h1 { font-size: var(--text-4xl); font-weight: 600; }
      h2 { font-size: var(--text-2xl); font-weight: 600; }
      h3 { font-size: var(--text-xl); font-weight: 600; }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg-2);
        line-height: var(--leading-body);
        font-weight: 400;
      }
      .body-muted { color: var(--fg-2); }
      .body-sm { font-size: var(--text-sm); }
      /* Eyebrow stays sentence-case (not uppercase) — Chinese voice */
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--accent);
        font-weight: 500;
        font-family: var(--font-body);
      }
      .stack-2 > * + * { margin-block-start: var(--space-2); }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Top nav — soft pill segmented ─────────────────────── */
      .topnav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-block: var(--space-4);
        gap: var(--space-4);
      }
      .topnav-brand {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: var(--text-lg);
        color: var(--fg);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .topnav-brand-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--radius-pill);
        background: var(--accent);
        color: var(--accent-on);
        font-size: var(--text-xs);
        font-weight: 600;
        letter-spacing: 0.04em;
      }
      .topnav-tabs {
        display: flex;
        align-items: center;
        gap: var(--space-1);
      }
      .topnav-tabs a {
        position: relative;
        padding: var(--space-2) var(--space-3);
        font-size: var(--text-sm);
        font-weight: 400;
        color: var(--muted);
        text-decoration: none;
        transition: color var(--motion-fast) var(--ease-standard);
      }
      .topnav-tabs a:hover { color: var(--fg-2); }
      .topnav-tabs a[aria-current="page"] {
        color: var(--fg);
        font-weight: 600;
      }
      /* DESIGN.md §4: tab indicator is a 2px underline at component-layer red, matched to text width */
      .topnav-tabs a[aria-current="page"]::after {
        content: "";
        position: absolute;
        left: var(--space-3);
        right: var(--space-3);
        bottom: 0;
        height: 2px;
        background: var(--accent-hover);
        border-radius: var(--radius-pill);
      }
      .topnav-right { display: flex; align-items: center; gap: var(--space-3); }

      /* ─── Buttons — full pill, no shadow ────────────────────── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 10px 20px;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-sm);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
        transition: background-color var(--motion-fast) var(--ease-standard),
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
        background: var(--border);
        color: var(--fg);
      }
      .btn-secondary:hover { background: rgba(0, 0, 0, 0.12); }
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: var(--border);
      }
      .btn-ghost:hover { background: var(--border-soft); }
      /* Follow CTA: feed-card variant per DESIGN.md §4 "Follow Button — three-state" */
      .btn-follow {
        padding: 6px 14px;
        font-size: var(--text-xs);
        font-weight: 500;
        border-radius: var(--radius-pill);
        border: none;
        cursor: pointer;
        background: var(--accent);
        color: var(--accent-on);
      }
      .btn-follow[aria-pressed="true"] {
        background: rgba(0, 0, 0, 0.05);
        color: var(--muted);
      }

      /* ─── Chips / tags — pill rectangle ─────────────────────── */
      .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 4px 12px;
        border-radius: var(--radius-pill);
        font-size: var(--text-xs);
        font-weight: 400;
        background: rgba(0, 0, 0, 0.05);
        color: var(--fg-2);
      }
      .chip-trending {
        background: var(--accent);
        color: var(--accent-on);
        font-weight: 500;
      }
      .chip-success {
        background: color-mix(in oklab, var(--success), transparent 88%);
        color: var(--success);
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }

      /* ─── Cards — 12px radius, flat by default ──────────────── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition: box-shadow var(--motion-base) var(--ease-standard),
                    transform var(--motion-base) var(--ease-standard);
      }
      /* DESIGN.md §6 "Subtle (1)" — PC card hover only */
      .card:hover {
        box-shadow: var(--elev-raised);
        transform: translateY(-2px);
      }

      /* ─── Feed card — image flush, footer with heart + count ─ */
      .feed-card {
        background: var(--surface);
        border-radius: var(--radius-md);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: box-shadow var(--motion-base) var(--ease-standard),
                    transform var(--motion-base) var(--ease-standard);
      }
      .feed-card:hover {
        box-shadow: var(--elev-raised);
        transform: translateY(-2px);
      }
      .feed-card-cover {
        width: 100%;
        aspect-ratio: 3 / 4;
        display: block;
        background:
          linear-gradient(135deg,
            color-mix(in oklab, var(--accent), white 80%),
            color-mix(in oklab, var(--accent), white 50%));
        position: relative;
      }
      .feed-card-cover-tag {
        position: absolute;
        top: var(--space-3);
        left: var(--space-3);
        padding: 4px 10px;
        border-radius: var(--radius-pill);
        background: rgba(0, 0, 0, 0.45);
        color: #ffffff;
        font-size: var(--text-xs);
        font-weight: 500;
        backdrop-filter: blur(4px);
      }
      .feed-card-body {
        padding: var(--space-3);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .feed-card-title {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
        line-height: 1.43;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .feed-card-foot {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        color: var(--muted);
      }
      .feed-card-avatar {
        width: 24px;
        height: 24px;
        border-radius: var(--radius-pill);
        background: color-mix(in oklab, var(--accent), white 70%);
        flex-shrink: 0;
      }
      .feed-card-author {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--fg-2);
      }
      .feed-card-likes {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        color: var(--muted);
        font-variant-numeric: tabular-nums;
      }
      .feed-card-likes .icon { color: var(--muted); }
      .feed-card-likes[data-liked="true"] .icon { color: var(--accent); fill: var(--accent); }

      /* ─── Inputs — F5F5F5 fill, pill, no border ─────────────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--fg);
      }
      .field input, .field textarea {
        background: var(--bg);
        color: var(--fg);
        border: 1px solid transparent;
        border-radius: var(--radius-pill);
        padding: 10px 16px;
        font-family: var(--font-body);
        font-size: var(--text-sm);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard),
                    background-color var(--motion-fast) var(--ease-standard);
      }
      .field textarea {
        border-radius: var(--radius-md);
        padding: var(--space-3) var(--space-4);
        resize: vertical;
        min-height: 88px;
        font-family: var(--font-body);
      }
      .field input::placeholder, .field textarea::placeholder { color: var(--meta); }
      .field input:focus, .field textarea:focus {
        background: var(--surface);
        border-color: var(--border);
        box-shadow: var(--focus-ring);
      }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Hero meta sidecar (soft pink-tinted card) ─────────── */
      .hero-meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-6);
        border-radius: var(--radius-lg);
        /* Soft pink-tinted surface — derived from accent at low alpha,
           a brand-friendly tint without introducing a new token. */
        background: color-mix(in oklab, var(--accent), white 92%);
      }
      .hero-meta-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--fg);
        margin: 0;
      }
      .hero-meta-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-3);
      }
      .hero-meta-stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .hero-meta-stat-num {
        font-size: var(--text-xl);
        font-weight: 600;
        color: var(--fg);
        font-variant-numeric: tabular-nums;
        line-height: 1.2;
      }
      .hero-meta-stat-label {
        font-size: var(--text-xs);
        color: var(--muted);
      }
      .hero-meta-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        padding-block-start: var(--space-3);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
      }

      /* ─── Section layouts ───────────────────────────────────── */
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 1fr;
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
        margin-block-start: var(--space-8);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px)  { .features-grid { grid-template-columns: 1fr; } }
      .feed-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--space-3);
        margin-block-start: var(--space-6);
      }
      @media (max-width: 1023px) { .feed-grid { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 639px)  { .feed-grid { grid-template-columns: repeat(2, 1fr); } }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        padding: var(--space-6);
        background: var(--surface);
        border-radius: var(--radius-lg);
        max-width: 480px;
      }
      .form-actions {
        display: flex;
        gap: var(--space-3);
        margin-block-start: var(--space-2);
      }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .icon-lg { width: 18px; height: 18px; flex-shrink: 0; }
      .row-between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      kbd {
        font-family: var(--font-mono);
        font-size: var(--text-xs);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--muted);
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.875em;
        background: rgba(0, 0, 0, 0.05);
        border-radius: var(--radius-sm);
        padding: 1px 6px;
        color: var(--fg);
      }
    </style>
  <style data-hey-responsive-repair>
      /* Grid and flex children may shrink; long labels wrap within their own column. */
      :where(*) { min-width: 0; }
      :where(h1, h2, h3, p, a, span, strong, label, code) { overflow-wrap: anywhere; }
      :where(input, select, textarea) { max-width: 100%; }
    </style>
</head>
  <body>
    <header class="container">
      <nav class="topnav" aria-label="Primary">
        
        <div class="topnav-tabs" role="tablist">
          <a href="#" role="tab" aria-current="page">发现</a>
          <a href="#" role="tab">关注</a>
          <a href="#" role="tab">附近</a>
          <a href="#" role="tab">购物</a>
        </div>
        <div class="topnav-right">
          <a href="#" class="body-sm" style="color: var(--fg-2); text-decoration: none; font-weight: 500;">登录</a>
          <a href="#" class="btn btn-primary">发布笔记</a>
        </div>
      </nav>
    </header>

    <main class="container">
      <!-- HERO — 种草 voice, pill CTA, soft pink-tinted sidecar. -->
      <section data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">灵感参考 · xiaohongshu</p>
            <h1>标记你的生活，<br />让世界被你种草。</h1>
            <p class="lead" style="max-width: 30ch;">
              你今天的早餐、出差住的酒店、买了三支才挑对的口红 —
              都是别人正在寻找的灵感。Show up. 被看见。被收藏。
            </p>
            <div class="hero-actions">
              
              
            </div>
            <p class="body-sm body-muted" style="margin-block-start: var(--space-3);">
              按 <kbd>⌘</kbd> <kbd>K</kbd> 搜索笔记 · Press <kbd>⌘</kbd> <kbd>K</kbd> to search.
            </p>
          </div>

          <aside class="hero-meta" aria-label="今日数据 · Today on RED">
            <div class="row-between">
              <p class="hero-meta-title">今日小红书 · Today on RED</p>
              <span class="chip chip-trending">
                <span class="dot" aria-hidden="true"></span>
                热门
              </span>
            </div>
            <div class="hero-meta-stats">
              <div class="hero-meta-stat">
                <span class="hero-meta-stat-num">3.2亿</span>
                <span class="hero-meta-stat-label">月活用户</span>
              </div>
              <div class="hero-meta-stat">
                <span class="hero-meta-stat-num">8,400万</span>
                <span class="hero-meta-stat-label">日均笔记</span>
              </div>
              <div class="hero-meta-stat">
                <span class="hero-meta-stat-num">72%</span>
                <span class="hero-meta-stat-label">女性用户</span>
              </div>
            </div>
            <div class="hero-meta-foot">
              <span class="body-sm" style="color: var(--muted);">
                Source · xiaohongshu.com · <time datetime="2026-05-18">2026.05</time>
              </span>
              <a href="#" class="body-sm" style="color: var(--accent); text-decoration: none; font-weight: 500;">查看 →</a>
            </div>
          </aside>
        </div>
      </section>

      <!-- DISCOVER — masonry-style feed mock with bilingual titles. -->
      <section data-od-id="discover">
        <div class="row-between" style="flex-wrap: wrap; gap: var(--space-3);">
          <div class="stack-2">
            <p class="eyebrow">今日发现 · Discover</p>
            <h2>看看大家正在种草什么</h2>
          </div>
          <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
            <span class="chip chip-trending">穿搭</span>
            <span class="chip">咖啡</span>
            <span class="chip">旅行</span>
            <span class="chip">护肤</span>
            <span class="chip">家居</span>
          </div>
        </div>
        <div class="feed-grid">
          <article class="feed-card">
            <div class="feed-card-cover" aria-hidden="true">
              <span class="feed-card-cover-tag">视频</span>
            </div>
            <div class="feed-card-body">
              <h3 class="feed-card-title" style="font-family: var(--font-body);">
                周末和朋友的 brunch 小记 · A slow Saturday in Shanghai
              </h3>
              <div class="feed-card-foot">
                <span class="feed-card-avatar" aria-hidden="true"></span>
                <span class="feed-card-author">小满 · xiaoman</span>
                <span class="feed-card-likes" data-liked="true" aria-label="2.3 万 likes">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7-4.5-9.5-9C.9 8.8 2.7 5 6 5c2 0 3.3 1 4 2.3C10.7 6 12 5 14 5c3.3 0 5.1 3.8 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                  </svg>
                  2.3w
                </span>
              </div>
            </div>
          </article>
          <article class="feed-card">
            <div class="feed-card-cover" aria-hidden="true" style="aspect-ratio: 1 / 1;"></div>
            <div class="feed-card-body">
              <h3 class="feed-card-title" style="font-family: var(--font-body);">
                租房 50㎡ 的暖色客厅改造 — before / after 全记录
              </h3>
              <div class="feed-card-foot">
                <span class="feed-card-avatar" aria-hidden="true" style="background: color-mix(in oklab, var(--success), white 70%);"></span>
                <span class="feed-card-author">桃子家的小屋</span>
                <span class="feed-card-likes" aria-label="8,712 likes">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-4.5-9.5-9C.9 8.8 2.7 5 6 5c2 0 3.3 1 4 2.3C10.7 6 12 5 14 5c3.3 0 5.1 3.8 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                  </svg>
                  8,712
                </span>
              </div>
            </div>
          </article>
          <article class="feed-card">
            <div class="feed-card-cover" aria-hidden="true" style="aspect-ratio: 4 / 5; background: linear-gradient(160deg, color-mix(in oklab, var(--accent), white 60%), color-mix(in oklab, var(--warn), white 70%));"></div>
            <div class="feed-card-body">
              <h3 class="feed-card-title" style="font-family: var(--font-body);">
                第三支才挑对 · 显白程度十级的口红种草清单
              </h3>
              <div class="feed-card-foot">
                <span class="feed-card-avatar" aria-hidden="true" style="background: color-mix(in oklab, var(--warn), white 60%);"></span>
                <span class="feed-card-author">林深 · lin.shen</span>
                <span class="feed-card-likes" data-liked="true" aria-label="1.1 万 likes">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7-4.5-9.5-9C.9 8.8 2.7 5 6 5c2 0 3.3 1 4 2.3C10.7 6 12 5 14 5c3.3 0 5.1 3.8 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                  </svg>
                  1.1w
                </span>
              </div>
            </div>
          </article>
          <article class="feed-card">
            <div class="feed-card-cover" aria-hidden="true" style="aspect-ratio: 3 / 4; background: linear-gradient(200deg, color-mix(in oklab, var(--success), white 60%), color-mix(in oklab, var(--success), white 88%));">
              <span class="feed-card-cover-tag">长图</span>
            </div>
            <div class="feed-card-body">
              <h3 class="feed-card-title" style="font-family: var(--font-body);">
                京都早春三日 · 在小巷里慢慢迷路也很好
              </h3>
              <div class="feed-card-foot">
                <span class="feed-card-avatar" aria-hidden="true" style="background: color-mix(in oklab, var(--success), white 50%);"></span>
                <span class="feed-card-author">远野日记 · tono</span>
                <span class="feed-card-likes" aria-label="6,304 likes">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 21s-7-4.5-9.5-9C.9 8.8 2.7 5 6 5c2 0 3.3 1 4 2.3C10.7 6 12 5 14 5c3.3 0 5.1 3.8 3.5 7-2.5 4.5-9.5 9-9.5 9z"/>
                  </svg>
                  6,304
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- FEATURES — three guiding principles, flat cards, hover lift. -->
      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">为什么这样设计 · Why it looks like this</p>
          <h2 style="max-width: 22ch;">
            克制做底色，内容才是主角。
          </h2>
          <p class="lead" style="max-width: 56ch;">
            一个 <code>--accent</code>，一种 <code>PingFang SC</code>，
            一套 <code>rgba(0,0,0,*)</code> 的浮层灰阶 —
            其余空间，全部交给图片本身。
          </p>
        </div>

        <div class="features-grid">
          <article class="card">
            <span class="chip chip-trending" style="align-self: flex-start;">
              <span class="dot" aria-hidden="true"></span>
              品牌唯一红
            </span>
            <h3>一屏只用一次的红</h3>
            <p class="body-muted body-sm">
              <code>#ff2442</code> 只出现在主要 CTA、心形高亮、
              热门标签上。同一个页面里出现两次饱和红，画面就立刻
              "降级"成了打折海报，而不是一张笔记。
            </p>
            
          </article>

          <article class="card">
            <span class="chip" style="align-self: flex-start;">柔黑文字</span>
            <h3>从不使用纯黑</h3>
            <p class="body-muted body-sm">
              标题 <code>rgba(0,0,0,.8)</code>、正文 <code>.62</code>、
              描述 <code>.45</code>、占位 <code>.27</code> —
              四级透明黑替代离散灰阶，同一个浮层落在白卡、照片、
              抽屉上都成立。
            </p>
            
          </article>

          <article class="card">
            <span class="chip" style="align-self: flex-start;">圆得彻底</span>
            <h3>能按的，一定是 pill</h3>
            <p class="body-muted body-sm">
              卡片 <code>12px</code>、按钮 <code>9999px</code>。
              一个直角按钮在这套系统里立刻显得不对 —
              层次靠间距和圆角，不靠投影。Shadow stays
              off until hover earns it.
            </p>
            
          </article>
        </div>
      </section>

      <!-- FORM — pill input on F5F5F5, primary red CTA, follow CTA demo. -->
      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">订阅每日灵感 · Daily inspo digest</p>
            <h2>每天一封 · 100 张被收藏最多的笔记。</h2>
            <p class="lead" style="max-width: 44ch;">
              No spam，no third-party，no enterprise tone.
              一个邮箱，一个发布频率，仅此而已 —
              我们用 <code>--focus-ring</code> 的 RED 红圈
              提示你正在专注的输入框。
            </p>
            <ul style="margin: 0; padding-inline-start: var(--space-5); color: var(--fg-2); font-size: var(--text-sm);" class="stack-3">
              <li>输入框背景使用 <code>--bg</code>（#F5F5F5），focus 时升到 <code>--surface</code>。</li>
              <li>提交按钮即 <code>.btn-primary</code> — 系统里只有一种红 CTA。</li>
              <li>占位符使用 <code>--meta</code>，0.27 透明度的最弱一档。</li>
            </ul>
            <div class="row-between" style="margin-block-start: var(--space-4); max-width: 360px;">
              <div class="stack-2" style="display: flex; flex-direction: column;">
                <span class="body-sm" style="color: var(--fg); font-weight: 500;">关注按钮三态</span>
                <span class="body-sm" style="color: var(--muted);">DESIGN.md §4 · Follow Button</span>
              </div>
              <div style="display: flex; gap: var(--space-2);">
                <button type="button" class="btn-follow">+ 关注</button>
                <button type="button" class="btn-follow" aria-pressed="true">已关注</button>
              </div>
            </div>
          </div>

          <div role="group" class="hey-preview-form form" aria-label="订阅每日灵感">
            <div class="row-between">
              <p style="font-size: var(--text-sm); font-weight: 600; color: var(--fg); margin: 0;">订阅每日灵感</p>
              <span class="chip chip-success">
                <span class="dot" aria-hidden="true"></span>
                Free · 免费
              </span>
            </div>
            <div class="field">
              <label for="nickname">你的昵称 · Nickname</label>
              <input
                id="nickname"
                type="text"
                placeholder="给未来的自己留个名字"
                autocomplete="nickname"
              />
            </div>
            <div class="field">
              <label for="email">邮箱 · Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
              />
              <p class="field-help">仅用于发送每日灵感清单，可随时退订。</p>
            </div>
            <div class="field">
              <label for="topic">最想被种草的主题 · What to be inspired by</label>
              <textarea
                id="topic"
                placeholder="例如：周末 brunch、出租屋改造、本子文具、晨跑路线…"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                立即订阅
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
              <button type="button" class="btn btn-ghost">看示例</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=xiaohongshu_default;return module.exports}});
//# sourceMappingURL=client.xiaohongshu.js.map