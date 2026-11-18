
window.__ModuleLoader__.load({id:`@deepseek-ai/dsh-client-ui-design-studio`,chunk:`client.starbucks.js`,factory:require=>{var module={exports:{}};var exports=module.exports;var starbucks_default={"contract":'## 1. Visual Theme & Atmosphere\n\nStarbucks\' design system is a **warm, confident retail flagship** wearing the green of their storefront apron across every surface. The canvas alternates between a neutral-warm cream (`#f2f0eb`) and a ceramic off-white (`#edebe9`) — colors that reference actual store materials: the paper napkins, the café walls, the wood finishes — while the signature **Starbucks Green** (`#006241`) anchors the brand moment on hero bands, CTAs, and the Rewards experience. The greens come in four calibrated shades (Starbucks, Accent, House, Uplift) each mapped to a specific surface role, and gold (`#cba258`) appears only around Rewards-status ceremony — not as a general accent.\n\nTypography carries most of the brand voice. The proprietary **SoDoSans** typeface (custom to Starbucks) sits across nearly every surface with a tight `-0.16px` letter-spacing — it reads confident and friendly rather than fashion-magazine severe. What\'s unusual: the Rewards page switches to a warm serif (`"Lander Tall", "Iowan Old Style", Georgia`) for specific headline moments, subtly echoing the nostalgic feel of a coffeehouse chalkboard. And the Careers pages use a handwritten script (`"Kalam", "Comic Sans MS", cursive`) for personal cup-name touches. Three typefaces, three contexts — the system is disciplined about when each appears.\n\nThe surfaces breathe through rounded geometry. Every button is a 50px full-pill. Cards take a 12px rounded-rectangle. The "Frap" floating CTA — a 56px circular order button in Green Accent (`#00754A`) — is the product\'s signature depth move: it floats bottom-right with a layered shadow stack (`0 0 6px rgba(0,0,0,0.24)` base + `0 8px 12px rgba(0,0,0,0.14)` ambient) and compresses via `scale(0.95)` on press. Elevations are otherwise restrained — card shadows stay at a whispered `0.14/0.24` alpha, global nav gets a quiet three-layer shadow stack. The whole system feels like clean café signage: legible, warm, and never shouting.\n\n**Key Characteristics:**\n- Four-tier green brand system (Starbucks / Accent / House / Uplift) each mapped to a distinct surface role — not a single "brand green"\n- Gold reserved for Rewards-status moments only; never a general-purpose accent\n- Warm-neutral canvas (`#f2f0eb` / `#edebe9`) instead of cold white — references café materials\n- Custom proprietary typeface (SoDoSans) with tight `-0.16px` letter-spacing as the universal voice\n- Context-specific type switches: serif (Lander Tall) for Rewards, script (Kalam) for Careers cup-names\n- Full-pill buttons (`50px` radius) universal, `scale(0.95)` active press the signature micro-interaction\n- Floating "Frap" circular CTA (`56px`, Green Accent fill, layered shadow stack) — the product\'s signature elevation element\n- Gift-card surfaces designed as **photographed physical product** — every card is a distinct illustrated photograph rather than a generated graphic\n- 12px card radius + whisper-soft shadows keep content cards flat-plus-hint-of-lift\n- Rem-based spacing scale anchored at 1.6rem (~16px) = `--space-3`, stepping to 6.4rem (~64px)\n\n**Color-block page rhythm:** Cream hero → White content sections → Dark-green (`#1E3932`) feature band with white text → Cream utility zone → Dark-green (`#1E3932`) footer with gold / white text — an espresso-dark bookend around the bright body.\n\n## 4. Component Stylings\n\n### Buttons\n\n**1. Primary Filled — "Explore our afternoon menu / Sign up for free"**\n- Background: `#00754A` (Green Accent)\n- Text: `#ffffff`\n- Border: `1px solid #00754A`\n- Radius: `50px` (full pill)\n- Padding: `7px 16px`\n- Font: SoDoSans, 16px, weight 600, letter-spacing `-0.01em`\n- Active state: `transform: scale(0.95)` via `--buttonActiveScale`\n- Transition: `all 0.2s ease`\n\n**2. Primary Outlined — "Give them a try / Start an order"**\n- Background: transparent\n- Text: `#00754A` (Green Accent)\n- Border: `1px solid #00754A`\n- Same radius/padding/active/transition as Primary Filled\n\n**3. Black Filled — "Join now"**\n- Background: `#000000`\n- Text: `#ffffff`\n- Border: `1px solid #000000`\n- Radius: `50px`, Padding: `7px 16px`\n- Font: 14px, weight 600\n- Used on the top-of-page join strip and similar conversion moments\n\n**4. Dark Outlined — "Sign in"**\n- Background: transparent\n- Text: `rgba(0, 0, 0, 0.87)` (Text Black)\n- Border: `1px solid rgba(0, 0, 0, 0.87)`\n- Radius: `50px`, Padding: `7px 16px`\n- Font: 14px, weight 600\n\n**5. Green-on-Green Inverted — "See the spring menu"**\n- Background: `#ffffff`\n- Text: `#00754A`\n- Border: `1px solid #ffffff`\n- Used when the surface behind the button is the dark green House Green band — white button with green text instead of a filled green pill on green bg\n\n**6. Outlined on Dark — "Learn more / Order now"**\n- Background: transparent\n- Text: `#ffffff`\n- Border: `1px solid #ffffff`\n- Used on dark-green feature bands for secondary action paired with a white filled CTA\n\n**7. Consent Agree (dark-green variant)**\n- Background: `rgb(0, 130, 72)` (a specific variant green used in the cookie-consent module)\n- Text: `#ffffff`\n- No border, `50px` radius, `7px 16px` padding, 14px / weight 400\n- Slightly brighter than Green Accent — reserved for the consent-banner Agree action\n\n**8. Frap — Floating Circular Order Button**\n- Background: `#00754A` (Green Accent)\n- Icon: `#ffffff`\n- Size: `5.6rem / 56px` (standard), `4rem / 40px` (mini variant)\n- Radius: `50%` (full circle)\n- Fixed bottom-right, `-0.8rem` touch offset for extra tap comfort\n- Shadow stack: base `0 0 6px rgba(0,0,0,0.24)` + ambient `0 8px 12px rgba(0,0,0,0.14)`\n- Active state: ambient shadow fades to `0 8px 12px rgba(0,0,0,0)`\n- This is the product\'s signature elevation element — it floats over every scrolled surface\n\n**9. Full-width Feedback Tab — "Provide feedback"**\n- Background: `#00754A`\n- Text: `#ffffff`\n- Radius: `12px 12px 0px 0px` (top-rounded only)\n- Padding: `8px 16px`\n- Font: 14px, weight 400\n- Positioned fixed bottom-right-inside, attached to the viewport edge\n\n### Cards & Containers\n\n**Content Card (default)**\n- Background: `#ffffff` (`--cardBackgroundColor`)\n- Radius: `12px` (`--cardBorderRadius`)\n- Shadow: `0px 0px .5px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.24)` (`--cardBoxShadow`)\n- Used for: feature cards, menu-item tiles, reward-status panels\n\n**Gift Card Tile**\n- Background: illustrated photography fills the card (no solid bg)\n- Radius: similar to cards (`~12px`, slightly tighter on corners)\n- Shadow: lighter than default card — these are treated like physical cards laid on the canvas\n- Labeled by category above the card grid (Spring, Thank You, Birthday, Celebration, Mother\'s Day, Appreciation, Encouragement, Milestones, Anytime)\n\n**Rewards Status Cards (Rewards page signature)**\n- Three-column grid: Bronze / Gold / Silver-ish — each a dark-green (`#1E3932`) panel with:\n  - Colored gradient/color header ring\n  - Numbered "Level" badge\n  - Status title in large SoDoSans weight 600\n  - Stars / benefits list in white/translucent-white text\n  - Bottom "As you earn more stars…" progression caption\n\n**Partnership Card (Rewards)**\n- Background: `#faf6ee` (Gold Lightest) warm-cream surface\n- Content: partner logos ("SkyMiles", "Bonvoy") centered, with descriptive text below\n- Radius and shadow follow default card spec\n\n**Dropdown Menu (Account dropdown, top-nav)**\n- Background: `#f9f9f9` (Neutral Cool)\n- Menu items at `24px / weight 400` in Text Black\n- No border — just background surface shift against white nav\n\n**Modal**\n- Padding: `2.4rem` (`--modalPadding`)\n- Top padding: `8.8rem` (`--modalTopPadding`) — leaves room for close button / header\n- Combined vertical padding: `11.2rem`\n- Radius inherits from card spec (`12px`)\n\n### Inputs & Forms\n\n**Floating Label Input**\n- Label floats above the input border when focused/filled\n- Desktop label font size: `1.9rem` default, animates to `1.4rem` when active\n- Mobile label font size: `1.6rem` default, animates to `1.3rem` active\n- Label horizontal offset: `12px` from left\n- Active label translate: up to `-12px` with `-50%` Y translation\n- Field padding: `12px`\n- Form horizontal padding: `1.6rem`\n- Validation: valid-field gets `rgba(green-light, 0.33)` tint; invalid-field gets `rgba(red, 0.05)` tint\n- Transition: `0.3s option-label-marker-expansion cubic-bezier(0.32, 2.32, 0.61, 0.27)` on checked-input\n\n**Option Icon (checkbox/radio)**\n- Padding: `3px` inner\n- Uses the checked-input cubic-bezier animation above (a slightly "springy" 2.32 overshoot curve)\n\n### Navigation\n\n**Global Nav (top bar)**\n- Fixed position with progressive heights: `64px` xs → `72px` mobile → `83px` tablet → `99px` desktop\n- Shadow stack: `0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)` — three-layer soft lift\n- Left: Starbucks wordmark logo, offsetting by `99px` (md) / `131px` (lg) from left edge\n- Primary links inline in SoDoSans weight 400–600: Menu · Rewards · Gift Cards\n- Right: Find a store link + Sign in (outlined) + Join now (black filled)\n\n**Sub-nav (second bar, e.g., Rewards internal)**\n- Height: `53px` (global subnav) / `48px` (internal subnav)\n- Typically horizontal tab group beneath the global nav\n\n**Mobile Nav**\n- Collapses to a hamburger drawer below tablet breakpoint\n- Frap floating button persists at bottom-right regardless of nav state\n\n### Image Treatment\n\n- **Hero photography**: Product photos (beverages in clear glass with colored backgrounds — coral, sage, warm amber) occupy ~40vw of a split-hero layout; text occupies the other 60vw (`--headerCrateProportion: 40vw` / `--contentCrateProportion: 60vw`)\n- **Gift card illustrations**: Each card is a distinct illustrated photograph (painted-feel, hand-drawn-looking, warm color palette). Never generic generated graphics.\n- **Rewards ceremony imagery**: Photographs of Starbucks Rewards App screens held in-hand, angled compositions — product-in-context photography.\n- **Menu thumbnails**: Square or 4:3 product photography with clean white/cream backdrops, slight soft drop-shadow around the glass.\n- **Image fade-in**: `opacity 0.3s ease-in` transition on image load (`--imageFadeTransition`).\n\n### Feature Band (dark-green hero strip)\n\nFull-width `#1E3932` (House Green) band with:\n- Left: white headline + subhead + CTA row\n- Right: product photography or illustration\n- Split ratio ~40/60 or 50/50 depending on section\n- White text throughout with `rgba(255,255,255,0.70)` for secondary copy\n- CTAs follow Green-on-Green Inverted (white filled) + Outlined on Dark (white outline) pairing\n\n### Expander / Accordion\n\n- Duration: `300ms` (`--expanderDuration`)\n- Timing curve: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — a measured ease-out\n- Used for FAQ sections on Rewards and gift page\n\n### Cookie Consent Module\n\nDark-green modal card at top of page with "Agree" (green-filled) and "Manage preferences" (outlined) buttons. Appears on first visit; dismissible.\n\n### Product Detail Components (PDP signature cluster)\n\nA repeating component cluster used on menu product pages (e.g., `/menu/product/40498/iced` for a drink detail, `/menu/product/.../nutrition` for nutrition facts). These extend the component inventory without changing tokens.\n\n**Size Options Selector**\n- Horizontal row of 4 cup-icon buttons (Tall / Grande / Venti / Trenta)\n- Each item: cup silhouette icon on top, size name below (16/700 in Starbucks-Green), fluid-ounce caption (13/400 in Text Black Soft)\n- Active state: a green circular ring outline (`2px solid #00754A`) around the selected cup icon\n- Inactive: no ring, same typography\n- Full-width row, equal spacing\n- Radius of container: `12px` or flat; individual icons are `50%` circular\n- Padding: `16px 24px` internal\n\n**Add-in / Milk Select (outlined rectangle)**\n- Background: `#ffffff`\n- Border: `1px solid #d6dbde` (Input Border)\n- Radius: `4px`\n- Full-width in its column\n- Floating label above top border: "Add-ins" / "Milk" / "Add-ins" — 13/700 in Text Black, uppercase, `0.325px` letter-spacing\n- Value displayed centered (e.g., "Ice", "Coconut", "Strawberry Fruit Inclusions scoop"): 16/400 Text Black\n- Chevron-down icon right side in Text Black Soft\n- Focus: border shifts to Green Accent (`#00754A`)\n\n**Numeric Stepper**\n- Embedded inside an Add-in row when a quantity is required (e.g., Strawberry Fruit Inclusions scoop)\n- `−` minus button + count number + `+` plus button, all inline right of the label\n- Buttons: circular `32×32px` with `1px solid #d6dbde` border, neutral gray icon\n- Count number: 16/700 Text Black centered\n\n**Customize Button**\n- Background: `#ffffff`\n- Text: `#00754A` (Green Accent)\n- Border: `1.5px solid #00754A`\n- Radius: `50px` (full pill)\n- Padding: `14px 40px` (generously larger than default pills — this is a secondary primary action)\n- Label: "Customize" with a gold sparkle ✨ icon inset left\n- Used for: entering the drink-customization flow after size/milk selection\n\n**Add to Order Button (PDP)**\n- Background: `#00754A` (Green Accent)\n- Text: `#ffffff`\n- Radius: `50px`\n- Padding: `14px 32px`\n- Pinned top-right of product card and/or aligned right within the store-availability band\n- Same scale(0.95) active behavior as other primary CTAs\n\n**Rewards Cost Pill — "200★ item"**\n- Background: transparent\n- Border: `1px solid #cba258` (Gold)\n- Text: `#cba258` (Gold)\n- Radius: `50px` (full pill)\n- Padding: `4px 12px`\n- Content: "200★ item" where `★` is a small filled star glyph — indicates the Rewards Stars required to redeem this item\n- Font: Proxima Nova 13/700 with `0.5px` letter-spacing\n- Used only on products that are Rewards-redeemable\n\n**Product Description Band**\n- Full-width dark-green band (`#1E3932` House Green)\n- Contains top-to-bottom:\n  1. Rewards Cost Pill (gold) if applicable\n  2. Product description body copy in white (16/400/1.5)\n  3. Nutritional summary inline ("140 calories, 25g sugar, 2.5g fat") with info-icon tooltip — 14/700 white\n  4. "Full nutrition & ingredients list" outlined-white-on-green pill button\n- Padding: `32px` vertical\n- Appears beneath the primary product header band\n\n**Ingredients / Nutrition Table**\n- Two-column layout on the Nutrition page\n- Left column: "Ingredients" header + list or "Not available for this item" placeholder text block with an explanatory paragraph in Text Black Soft 14/400\n- Right column: "Nutrition" header + label/value rows\n- Each row: nutrient label (Proxima Nova 14/400) on the left, value (e.g., "140 calories", "25g", "205 mg**") on the right, separated by a `1px solid #e7e7e7` hairline below\n- Footnote for caffeine/asterisk markers in 13/400 Text Black Soft at the bottom\n- Reusable pattern for nutrition facts regulation-compliant tables\n\n**Store Availability Selector**\n- Appears on dark-green feature band above the size-options row\n- Full-width rounded rectangle with transparent-white interior\n- Text: "For item availability, choose a store" in white, 14/400\n- Right side: chevron-down affordance + shopping-bag SVG icon in white outline\n- Radius: `4px`\n- Height: ~48px\n\n**PDP Breadcrumb**\n- "Menu / Refreshers / Pink Energy Drink" trail above the product title\n- Separator: `/` slash character in Text Black Soft\n- Current page is unlinked, prior pages are underlined green-accent links\n- Font: 14/400 Proxima Nova\n- Appears on all PDP pages\n\n**Back Chevron Link (PDP nutrition / detail sub-pages)**\n- "← Back" text link above section headings on the nutrition page\n- Text in Green Accent (`#00754A`) 14/700 Proxima Nova\n- Left chevron `<` in the same green\n- Alternative to full breadcrumb on deep sub-pages\n\n## 5. Layout Principles\n\n### Spacing System\n\nRem-based semantic scale (anchored `1rem = 10px`):\n\n| Token | Rem | Pixels | Typical Use |\n|-------|-----|--------|-------------|\n| `--space-1` | `0.4rem` | 4px | Tightest inline padding |\n| `--space-2` | `0.8rem` | 8px | Small gap, button vertical padding |\n| `--space-3` | `1.6rem` | 16px | Default — card padding, outer gutter xs |\n| `--space-4` | `2.4rem` | 24px | Section inner spacing, outer gutter md |\n| `--space-5` | `3.2rem` | 32px | Major between-section spacing |\n| `--space-6` | `4rem` | 40px | Large gaps, outer gutter lg, header crate |\n| `--space-7` | `4.8rem` | 48px | Section-to-section spacing |\n| `--space-8` | `5.6rem` | 56px | Very large breathing — Frap height |\n| `--space-9` | `6.4rem` | 64px | Widest section padding |\n\n**Gutter tokens:**\n- `--outerGutter: 1.6rem` (16px, default / mobile)\n- `--outerGutterMedium: 2.4rem` (24px, tablet)\n- `--outerGutterLarge: 4.0rem` (40px, desktop)\n\n**Universal rhythm constant:** `1.6rem` (16px) appears across every page as the default outer gutter, card padding baseline, and text size 3 body — the system\'s most frequent spacing unit.\n\n### Grid & Container\n\n- Column width scale: `--columnWidthSmall: 343px` / `Medium: 500px` / `Large: 720px` / `XLarge: 1440px`\n- Gift-card grid uses a 3-5-up responsive grid of `~343px` tiles\n- Rewards status section: 3-up dark-green panels at `lg+` breakpoints\n- Hero: asymmetric split 40% (image) / 60% (content) via `--headerCrateProportion` / `--contentCrateProportion`\n\n### Whitespace Philosophy\n\nWhitespace carries the feeling of "plenty of space in the café." Section padding leans generous (40–64px). Content blocks are separated by whitespace rather than dividers. The cream canvas (`#f2f0eb`) is itself a visual breath between white cards and green feature bands.\n\n### Border Radius Scale\n\n| Value | Use |\n|-------|-----|\n| `12px` | Cards, modals, menu-item tiles (`--cardBorderRadius`) |\n| `12px 12px 0 0` | Full-width feedback tab (top-rounded only) |\n| `50px` | All buttons — full-pill radius (`--buttonBorderRadius`) |\n| `50%` | Circular icons, Frap floating button, avatar thumbnails |\n| Specialty | `3.3333%/5.298%` elliptical for Starbucks-Visa-Card mockups (`--svcRoundedCorners`) |\n\n## 6. Depth & Elevation\n\n| Level | Treatment | Use |\n|-------|-----------|-----|\n| Card | `0 0 0.5px rgba(0,0,0,0.14), 0 1px 1px rgba(0,0,0,0.24)` | Default content cards — a whisper-soft dual-shadow |\n| Global Nav | `0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)` | Triple-layer soft lift on the fixed top bar |\n| Frap Base | `0 0 6px rgba(0,0,0,0.24)` | Base halo around the floating circular CTA |\n| Frap Ambient | `0 8px 12px rgba(0,0,0,0.14)` | Stacked directional ambient — floats the Frap forward |\n| Gift Card | Light drop shadow around illustrated photograph | Physical-card feel for gift tiles |\n| Starbucks Card (SVC) | `drop-shadow(0 4px 1px rgba(0,0,0,0.11)) drop-shadow(0 0 2px rgba(0,0,0,0.24))` | Stacked SVG drop shadows for Starbucks Card visuals |\n\n**Shadow philosophy:** Whisper-soft, layered over solid — the system never reaches for a single heavy drop shadow. Instead, it stacks 2–3 low-alpha shadows with different offsets to simulate real-world ambient + direct lighting. The Frap button is the most elevated element on any page.\n\n### Decorative Depth\n\n- **No gradient system** — surfaces are solid color-block\n- **Color-block banding** carries perceived depth (dark-green bands read as "recessed feature zones" between cream/white body sections)\n- **SVG filter shadows** on Starbucks-Card visuals add a slight 3D physicality without a box-shadow\n\n## 8. Responsive Behavior\n\n### Breakpoints\n\nInferred from component width tokens and progressive nav heights:\n\n| Name | Width | Key Changes |\n|------|-------|-------------|\n| xs | < 480px | Global nav 64px; hamburger menu; single-column layouts; pill buttons full-width |\n| Mobile | 480–767px | Global nav 72px; gift-card grid 2-up; card padding tightens |\n| Tablet | 768–1023px | Global nav 83px; gift-card grid 3-up; hero split begins to appear |\n| Desktop | 1024–1439px | Global nav 99px; gift-card grid 4-up; full asymmetric hero 40/60 |\n| XLarge | 1440px+ | Content caps at `--columnWidthXLarge`; gift-card grid 5-up; extra cream margin |\n\n### Touch Targets\n\n- Pill buttons at `7px 16px` padding measure ~32px tall — below 44px WCAG AAA minimum for touch-only surfaces. On mobile, button padding may be visually expanded to meet the minimum.\n- Frap floating circular button at `56px` is well above minimum.\n- Frap uses `--frapTouchOffset: calc(-1 * .8rem)` to extend tap area 8px beyond visual edge.\n- Form float-label inputs grow their label font size on mobile (1.6rem base vs 1.9rem desktop) — easier to tap and read at arm\'s-length.\n\n### Collapsing Strategy\n\n- **Global nav height scales progressively**: 64 → 72 → 83 → 99px across breakpoints, not a single value\n- **Hero split collapses**: 40/60 asymmetric split → stacked (image top, content below) at mobile\n- **Gift-card grid**: 5-up → 4-up → 3-up → 2-up → 1-up across breakpoints with adjusted card widths\n- **Feature bands**: Stay full-width but text + imagery stack vertically on mobile\n- **Outer gutter scales**: 16px → 24px → 40px as viewport grows\n- **Rewards 3-column status panels**: Stack to single column on mobile\n\n### Image Behavior\n\n- Hero product photography crops tighter vertically on mobile; content becomes the visual anchor\n- Gift-card illustrations preserve aspect ratio; card grid reflows\n- `opacity 0.3s ease-in` fade-in transition on image load (prevents jarring pop-in)\n- Rewards app-in-hand photography scales proportionally; never stretches',"components":`<!doctype html>
<html lang="en">
  <head><base href="about:srcdoc">
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Starbucks — reference components</title>
    <meta
      name="description"
      content="Reference fixture for design-systems/starbucks. Warm cream canvas,
        four-tier green system, full-pill buttons, whisper-soft layered shadows,
        and SoDoSans with universal -0.01em tracking."
    />

    <style>
      :root {
        --bg: #f2f0eb;
        --surface: #ffffff;
        --surface-warm: #edebe9;

        --fg: rgba(0, 0, 0, 0.87);
        --fg-2: #33433d;
        --muted: rgba(0, 0, 0, 0.58);
        --meta: var(--muted);

        --border: #d6dbde;
        --border-soft: #e7e7e7;

        --accent: #00754A;
        --accent-on: #ffffff;
        --accent-hover: color-mix(in oklab, var(--accent), black 8%);
        --accent-active: color-mix(in oklab, var(--accent), black 14%);

        --success: #16a34a;
        --warn: #fbbc05;
        --danger: #c82014;

        --font-display: SoDoSans, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-body: SoDoSans, "Helvetica Neue", Helvetica, Arial, sans-serif;
        --font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Monaco, Consolas, monospace;

        --text-xs: 13px;
        --text-sm: 14px;
        --text-base: 16px;
        --text-lg: 19px;
        --text-xl: 24px;
        --text-2xl: 32px;
        --text-3xl: 45px;
        --text-4xl: 58px;

        --leading-body: 1.5;
        --leading-tight: 1.2;
        --tracking-display: -0.01em;

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
        --radius-md: 12px;
        --radius-lg: 16px;
        --radius-pill: 9999px;

        --elev-flat: none;
        --elev-ring: 0 0 0 1px var(--border);
        --elev-raised: 0 0 0.5px 0 rgba(0, 0, 0, 0.14), 0 1px 1px 0 rgba(0, 0, 0, 0.24);

        --focus-ring: 0 0 0 3px color-mix(in oklab, var(--accent), transparent 70%);

        --motion-fast: 150ms;
        --motion-base: 200ms;
        --ease-standard: cubic-bezier(0.25, 0.46, 0.45, 0.94);

        --container-max: 1440px;
        --container-gutter-desktop: 40px;
        --container-gutter-tablet: 24px;
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
        letter-spacing: var(--tracking-display);
        -webkit-font-smoothing: antialiased;
      }

      /* ─── Layout ────────────────────────────────────────────── */
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

      /* ─── Typography ─────────────────────────────────────────
       * Universal -0.01em tracking; hierarchy carried by weight + color,
       * not by size jumps. H1 in Starbucks Green; H2 stays in Text Black. */
      h1, h2, h3 {
        font-family: var(--font-display);
        line-height: var(--leading-tight);
        letter-spacing: var(--tracking-display);
        margin: 0;
      }
      h1 {
        font-size: var(--text-3xl);
        font-weight: 600;
        color: #006241;
      }
      h2 {
        font-size: var(--text-xl);
        font-weight: 400;
        color: var(--fg);
      }
      h3 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--fg);
      }
      p { margin: 0; }
      .lead {
        font-size: var(--text-lg);
        color: var(--fg);
        line-height: var(--leading-body);
      }
      .body-muted { color: var(--muted); }
      .body-sm { font-size: var(--text-sm); }
      .eyebrow {
        font-size: var(--text-xs);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-weight: 600;
      }
      .stack-3 > * + * { margin-block-start: var(--space-3); }
      .stack-4 > * + * { margin-block-start: var(--space-4); }
      .stack-6 > * + * { margin-block-start: var(--space-6); }

      /* ─── Buttons — universal 9999px pill, scale(0.95) press ── */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 14px 28px;
        border-radius: var(--radius-pill);
        font-family: var(--font-body);
        font-size: var(--text-base);
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: var(--tracking-display);
        cursor: pointer;
        border: 1px solid transparent;
        transition: background-color var(--motion-base) var(--ease-standard),
                    color var(--motion-base) var(--ease-standard),
                    border-color var(--motion-base) var(--ease-standard),
                    transform var(--motion-fast) var(--ease-standard);
        text-decoration: none;
      }
      .btn:active { transform: scale(0.95); }
      .btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }

      /* Primary Filled — Green Accent fill */
      .btn-primary {
        background: var(--accent);
        color: var(--accent-on);
        border-color: var(--accent);
      }
      .btn-primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }

      /* Primary Outlined — transparent / Green Accent stroke */
      .btn-secondary {
        background: transparent;
        color: var(--accent);
        border-color: var(--accent);
      }
      .btn-secondary:hover {
        background: color-mix(in oklab, var(--accent), transparent 92%);
      }

      /* Dark Outlined — Text Black stroke (top-nav "Sign in") */
      .btn-ghost {
        background: transparent;
        color: var(--fg);
        border-color: var(--fg);
        padding: 7px 16px;
        font-size: var(--text-sm);
      }
      .btn-ghost:hover { background: rgba(0, 0, 0, 0.04); }

      /* ─── Inputs — outlined-rectangle with --radius-sm ──────── */
      .field { display: flex; flex-direction: column; gap: var(--space-2); }
      .field label {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--fg);
      }
      .field input {
        padding: 12px var(--space-4);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--fg);
        font-family: var(--font-body);
        font-size: var(--text-base);
        letter-spacing: var(--tracking-display);
        outline: none;
        transition: border-color var(--motion-fast) var(--ease-standard),
                    box-shadow var(--motion-fast) var(--ease-standard);
      }
      .field input:focus-visible {
        border-color: var(--accent);
        box-shadow: var(--focus-ring);
      }
      .field input::placeholder { color: var(--muted); }
      .field-help { font-size: var(--text-xs); color: var(--muted); }

      /* ─── Cards — whisper-soft dual shadow, --radius-md ─────── */
      .card {
        background: var(--surface);
        border-radius: var(--radius-md);
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        box-shadow: var(--elev-raised);
      }
      .card-eyebrow {
        font-size: var(--text-xs);
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-weight: 700;
      }

      /* ─── Badges ────────────────────────────────────────────── */
      .badge {
        display: inline-flex; align-items: center; gap: var(--space-2);
        padding: 4px var(--space-3);
        border-radius: var(--radius-pill);
        font-size: var(--text-xs); font-weight: 600; line-height: 1.4;
      }
      .badge-success { color: var(--success); background: color-mix(in oklab, var(--success), transparent 88%); }
      .badge-muted { color: var(--muted); background: var(--surface-warm); }
      .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

      /* Rewards Cost Pill — gold outline on transparent */
      .badge-rewards {
        color: #cba258;
        background: transparent;
        border: 1px solid #cba258;
        letter-spacing: 0.05em;
      }

      /* ─── Links ─────────────────────────────────────────────── */
      a { color: var(--accent); text-decoration: none; }
      a:hover { text-decoration: underline; text-underline-offset: 3px; }
      kbd {
        font-family: var(--font-mono); font-size: var(--text-xs);
        padding: 2px 6px; border-radius: var(--radius-sm);
        border: 1px solid var(--border); background: var(--surface); color: var(--muted);
      }

      /* ─── Hero / Layout helpers ─────────────────────────────── */
      .hero {
        background: var(--bg);
        padding-block: var(--section-y-desktop);
      }
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
      .hero-meta {
        display: flex; flex-direction: column; gap: var(--space-3);
        padding: var(--space-6);
        background: var(--surface);
        border-radius: var(--radius-md);
        box-shadow: var(--elev-raised);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-6);
      }
      @media (max-width: 1023px) { .features-grid { grid-template-columns: 1fr 1fr; } }
      @media (max-width: 639px) { .features-grid { grid-template-columns: 1fr; } }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-12);
        align-items: start;
      }
      @media (max-width: 1023px) { .form-row { grid-template-columns: 1fr; } }
      .form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 440px; }
      .form-actions { display: flex; gap: var(--space-3); margin-block-start: var(--space-2); flex-wrap: wrap; }
      .icon { width: 16px; height: 16px; flex-shrink: 0; }
      .row-between { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }

      /* Feature band — House Green band with white text on dark surface */
      .band-dark {
        background: #1E3932;
        border-radius: var(--radius-md);
        padding: var(--space-12) var(--space-8);
        color: #ffffff;
      }
      .band-dark h2 { color: #ffffff; }
      .band-dark .lead { color: rgba(255, 255, 255, 0.70); }
      .band-dark .btn-primary {
        background: #ffffff;
        color: var(--accent);
        border-color: #ffffff;
      }
      .band-dark .btn-primary:hover { background: rgba(255, 255, 255, 0.92); border-color: rgba(255, 255, 255, 0.92); }
      .band-dark .btn-secondary {
        background: transparent;
        color: #ffffff;
        border-color: #ffffff;
      }
      .band-dark .btn-secondary:hover { background: rgba(255, 255, 255, 0.12); }
    </style>
  </head>
  <body>
    <main class="container">
      <section class="hero" data-od-id="hero">
        <div class="hero-grid">
          <div class="stack-4">
            <p class="eyebrow">Reference fixture · starbucks</p>
            <h1>More than coffee — your third place, on the house.</h1>
            <p class="lead" style="max-width: 56ch">
              Warm cream canvas, four greens with assigned roles, and the friendly
              confidence of SoDoSans. Open the app, find a store, or sit awhile —
              every surface is built to feel like the café itself.
            </p>
            <div class="hero-actions">
              
              
              <a href="#" class="btn btn-ghost">Find a store</a>
            </div>
          </div>
          <aside class="hero-meta" aria-label="Store status">
            <div class="row-between">
              <span class="body-sm">Nearest store</span>
              <span class="badge badge-success">
                <span class="badge-dot" aria-hidden="true"></span>
                Open · 1.2 mi
              </span>
            </div>
            <p class="body-sm" style="color: var(--muted)">
              Pike Place Roast brewing now · pickup in 6&nbsp;min
            </p>
            <span class="badge badge-rewards" style="align-self:flex-start">200★ free drink</span>
            <p class="body-sm" style="color: var(--muted)">
              Press <kbd>⌘</kbd> <kbd>K</kbd> to reorder a favorite.
            </p>
          </aside>
        </div>
      </section>

      <section data-od-id="features">
        <div class="stack-3">
          <p class="eyebrow">A system for the café</p>
          <h2 style="max-width: 28ch">Warmth, mapped to a role — never a single brand green.</h2>
        </div>
        <div class="features-grid" style="margin-block-start: var(--space-8)">
          <article class="card">
            <p class="card-eyebrow">Four-tier green</p>
            <h3>Starbucks · Accent · House · Uplift</h3>
            <p class="body-muted body-sm">
              Each green is mapped to a surface role: Starbucks Green for headings,
              Green Accent (#00754A) for CTAs and the Frap, House Green for deep
              feature bands and the footer, Uplift for decorative accents.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">Warm cream canvas</p>
            <h3>Never pure white.</h3>
            <p class="body-muted body-sm">
              Neutral Warm (#f2f0eb) and Ceramic (#edebe9) reference café paper,
              wood, and ceramic mugs. White is reserved for the card surface so
              content reads like a mug placed on the table.
            </p>
            
          </article>
          <article class="card">
            <p class="card-eyebrow">Pill + press</p>
            <h3>Full-pill buttons, scale(0.95) press.</h3>
            <p class="body-muted body-sm">
              Every button is a 9999px pill. The active-press tactile rebound
              uses transform: scale(0.95) — a signature micro-interaction across
              every CTA, including the floating Frap order button.
            </p>
            
          </article>
        </div>
      </section>

      <section data-od-id="band">
        <div class="band-dark">
          <div class="hero-grid">
            <div class="stack-4">
              <p class="eyebrow" style="color: rgba(255,255,255,0.70)">Rewards</p>
              <h2 style="font-size: var(--text-2xl); font-weight: 600">
                Free coffee is just the beginning.
              </h2>
              <p class="lead">
                Earn a Star for every dollar — redeem for handcrafted drinks,
                food, and at-home favorites. Members also unlock birthday treats,
                free refills in-café, and exclusive offers.
              </p>
              <div class="hero-actions">
                <a href="#" class="btn btn-primary">Sign up for free</a>
                <a href="#" class="btn btn-secondary">Learn more</a>
              </div>
            </div>
            <div class="stack-3" aria-label="Rewards summary">
              <p class="body-sm" style="color: rgba(255,255,255,0.70)">Your Stars</p>
              <p style="font-family: var(--font-display); font-size: var(--text-4xl); font-weight: 600; line-height: var(--leading-tight); letter-spacing: var(--tracking-display)">
                312<span style="color: #cba258">★</span>
              </p>
              <p class="body-sm" style="color: rgba(255,255,255,0.70)">
                88 more Stars to your next free handcrafted drink.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-od-id="form">
        <div class="form-row">
          <div class="stack-4">
            <p class="eyebrow">Join Rewards</p>
            <h2>Sit awhile — and earn a Star on the way out.</h2>
            <p class="body-muted" style="max-width: 48ch">
              No fees, no commitment. Save your favorite drink, skip the line
              with mobile order, and let the third place come to you.
            </p>
          </div>
          <div role="group" class="uma-preview-form form">
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" type="email" placeholder="you@starbucks.com" autocomplete="email" required />
              <p class="field-help">We'll send your welcome Star and nothing else.</p>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Create account</button>
              <button type="button" class="btn btn-secondary">Browse menu</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
`};exports.default=starbucks_default;return module.exports}});
//# sourceMappingURL=client.starbucks.js.map