# Orly Boojor Portfolio

Independent, editable, responsive rebuild of the existing Webflow portfolio
(`../orly-website.webflow/`) as an Astro 6 + Tailwind 4 codebase.

**Last updated:** 2026-04-15

---

## What this is

A 1:1 visual rebuild of the live Webflow site so Orly can own the code,
deploy it anywhere, and extend it without Webflow's CMS constraints. The
goal of Phase 2 (current) was to finish the homepage — hero, logos,
services, work grid, testimonials, contact form, footer — and have it
visually match the live site at mobile / tablet / desktop breakpoints.

Individual case study pages (Phase 3) and deployment (Phase 5) are still
pending.

---

## Tech stack

- **Astro 6.1.6** — static site generator
- **Tailwind 4** via `@tailwindcss/vite` (NOT legacy `@astrojs/tailwind`)
- **Tailwind 4 `@theme` block** in `src/styles/global.css` — design
  tokens live there, no `tailwind.config.mjs`
- **TypeScript** — strict; `astro check` in CI path
- **Adobe Typekit** (`neue-haas-grotesk-display` / `-text`) — kit `nod3oqm`
- **Playwright 1.59.1** — chromium only, 3 projects (mobile / tablet /
  desktop) for cross-breakpoint smoke tests
- **@axe-core/playwright** — installed, not wired up yet (axe audit
  deferred to pre-deploy per user preference)
- **Node 22+** required by Astro 6
- **No React / Vue / Svelte** — plain Astro components so far

---

## Project structure

```
orly-portfolio/
├── public/
│   └── assets/
│       ├── hero/            # portrait + bg variants + decorative marks
│       ├── logos/           # 11 partner-logo SVGs
│       ├── services/        # icon SVGs
│       ├── work/            # Project-thumbnail.webp + variants
│       ├── testimonials/    # footer-image bg variants + Avatar-898.svg
│       └── footer/          # footer.svg, Mobile-phone.svg
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── HeroSplitText.astro    # per-word headline renderer
│   │   │   ├── HeroMetrics.astro
│   │   │   ├── VerticalLabel.astro    # rotated "The Designer Effect" label
│   │   │   ├── LogoStrip.astro
│   │   │   ├── Services.astro
│   │   │   ├── ServiceCard.astro
│   │   │   ├── WorkGrid.astro
│   │   │   ├── WorkTile.astro
│   │   │   ├── Testimonials.astro
│   │   │   └── ContactForm.astro
│   │   └── layout/
│   │       ├── BaseLayout.astro       # <html> shell with SEO, Typekit
│   │       ├── Logo.astro             # inline SVG brand mark
│   │       ├── Nav.astro              # absolute + fixed variants
│   │       ├── MobileNav.astro        # hamburger drawer
│   │       ├── MenuIcon.astro
│   │       ├── ScrollNavSwapper.astro # IntersectionObserver swap
│   │       └── Footer.astro           # two-tone yellow/dark
│   ├── pages/
│   │   └── index.astro                # homepage
│   ├── styles/
│   │   └── global.css                 # @theme tokens + base styles
│   └── config.ts                      # site, contact, social, navLinks, work
├── tests/
│   ├── homepage.spec.ts               # 4 smoke tests × 3 projects = 12
│   └── pair-review.spec.ts            # screenshot generator (not a real test)
├── playwright.config.ts
├── astro.config.mjs
└── package.json
```

---

## Critical workflow rules (learned the hard way)

These are the rules we've established through trial and error. Future
sessions should honor them.

### 1. Match the live Webflow site literally

Established after Task 2.5 (WorkGrid) when agents tried to "improve" on
the live design. The rule:

> **Don't fix perceived errors. Do exactly as close as possible to what
> Webflow has.**

This applies to:
- Copy (quotes, typos, CMS-flattened duplicates — keep them)
- Layout (2×2 grid if live uses 2×2, even if 3-across looks better)
- Asset choice (generic `Project-thumbnail.webp` if live uses it, not
  real per-project heroes)
- Color (yellow footer bg if live has it, even if dark looks cleaner)
- Placeholder links (`href="#"` if live uses it)

### 2. Code fixes are fine — UI "improvements" are not

Clarification to rule #1:

> **Suggest fixes or fix errors in code — just not in UI.**

Code-quality fixes are welcome: type errors, dead code, missing
dependencies (`@types/node`), broken tests. What's NOT welcome is
silently making the UI "better" than the live site.

### 3. Pre-scrape live content before dispatching implementers

Every section implementation now starts with:
1. Grep `../orly-website.webflow/index.html` for the section's markup
2. Grep `../orly-website.webflow/css/orly-website.webflow.css` for the
   relevant CSS (`.form_input`, `.footer_top-content`, etc.)
3. Copy the assets we need (fonts, SVGs, images) into `public/assets/`
4. Hand the implementer a brief with the real content / class names /
   asset paths — NOT a placeholder plan

This prevented the same drift that hit the Hero on Task 2.2 (headline
content was completely wrong in the original plan).

### 4. Animation is deferred to Phase 4

For now:
- LogoStrip renders as a single horizontal track (not an animated
  marquee)
- Services cards render in a grid (not a Swiper carousel)
- Testimonials render slide 1 statically with disabled prev/next arrows

All three sections have `TODO` / comment markers explaining what Phase 4
will add. The static fallbacks were chosen to be layout-compatible with
the future animated versions.

### 5. Accessibility audit is deferred to pre-deploy

The user's preference is "make it look good first, accessibility at the
end". `@axe-core/playwright` is installed but not yet wired up. Phase 4
or Phase 5 will integrate it.

One a11y win is already in place: `scroll-behavior: smooth` is guarded
behind `@media (prefers-reduced-motion: no-preference)`.

---

## Progress log

### Phase 0 — foundation

- `64ad7d0` Tailwind CSS integration
- `7020c15` design tokens via Tailwind 4 `@theme`
- `d344880` `--container-*` namespace for `max-w-*` utilities
- `a989624` prefix `--container-site-*` to avoid collision with
  `--spacing-*` (Tailwind 4 rule: spacing wins over container when
  names match)
- `81928f5` `@astrojs/check` + TypeScript
- `a0337f4` `src/config.ts` — site / contact / social / navLinks / work
- `91dc06d` Adobe Typekit wired, `BaseLayout` shell
- `c353746` preconnect to Adobe Fonts hosts

### Phase 1 — chrome

- `293497f` BaseLayout SEO meta + nav/footer slots
- `60ab321` Logo component (inline SVG)
- `dfe03d7` Nav with absolute + fixed variants
- `b367af3` ScrollNavSwapper (IntersectionObserver → swap absolute→fixed)
- `dc624ed` MenuIcon + MobileNav drawer
- `a044023` Footer placeholder with contact info and form slot
- `815f263` wire site chrome into placeholder homepage
- `424a20f` **fix(logo)**: constrain inline SVG so `h-8` actually
  applies (anchor was `display: inline`; wrapped in `inline-flex items-
  center` + SVG `h-full w-auto`)

### Phase 2 — homepage sections

- `1585772` Task 2.1: Playwright installed, 3 smoke tests × 3 projects
  (chromium-mobile iPhone 12, chromium-tablet iPad Pro, chromium-desktop
  1440×900). Device presets forced to `chromium` via
  `defaultBrowserType` override (they default to webkit).
- `52a76ce` Task 2.2: Hero initial dispatch (wrong headline from plan)
- `840a3bc` **Task 2.2 polish**: 3-col layout with portrait, bg image,
  decorative marks, vertical label. Real headline scraped from live:
  "I turn figure it out later into shipped product". Fixed `isolate` +
  `z-0` bg, `z-[1]` overlay, `z-10` content stacking.
- `affbc15` Task 2.3: static LogoStrip with 11 partner logos
- `0240664` Task 2.4: Services with 4 cards and color-coded tags
- `a845a01` Task 2.5: WorkGrid (initial — over-improved with real
  project heroes + "COMING SOON" placeholders)
- `bff24ad` **Task 2.5 rollback**: match live exactly — generic
  `Project-thumbnail.webp` on all 5 tiles, "DIVE IN" hover overlay on
  placeholder and real links alike, exact breakpoint sizing
- `3d0a5f1` `@types/node` — fixes pre-existing TS errors in
  `playwright.config.ts`
- `4538e3f` Task 2.6: Testimonials — full-bleed bg, label + heading +
  disabled prev/next arrows, 2 cards from slide 1 rendered statically,
  CMS-flattened quote duplication preserved
- `0adc14c` Task 2.7: ContactForm + Footer rewrite (first pass — had
  dark footer top; later fixed)
- `7d92bd9` Task 2.8: `scroll-padding-top: 6rem` on `html` + anchor-
  navigation smoke test. `scroll-behavior: smooth` guarded behind
  `prefers-reduced-motion: no-preference`.

### Phase 2.9 — visual pair review (desktop first)

Pair-review screenshot spec `tests/pair-review.spec.ts` added — generates
`screenshots/pair-review/{local,live}-{mobile,tablet,desktop}.png` on
demand for side-by-side visual diffing. Screenshots dir is git-ignored.

- `d36ff6b` **Batch #1**: critical desktop misses
  - Footer top now `bg-yellow-500` with black text (live uses
    `.footer_top-content { background-color: yellow-500 }`)
  - Contact form inputs: pill-shaped (`rounded-full`), 1px black border,
    transparent bg, black text, black placeholder. Matches
    `.form_input.black` from live CSS.
  - "Send it" submit button: black bg with white text and 16px radius
    (`.button.is-secondary`)
  - Testimonials bg image: drop heavy overlay, switch to top/bottom
    dark gradient so mountain landscape dominates as it does live
- `8edc104` **Batch #2a**: mobile + tablet structural fixes
  - LogoStrip: `flex-nowrap overflow-x-auto` single horizontal track
    (was wrapping to 2-3 rows at tablet/mobile with 11 logos)
  - Hero portrait: bump mobile `max-w` from 420 to 520 so the photo
    dominates the mobile hero; tighten to 380 at tablet for balance;
    420 at desktop lg+
- `425a31e` **Batch #2b**: button base styling
  - Hero "Book a consult" and WorkGrid "See all work" CTAs were using
    inline yellow rectangles. Fixed to match `.button` base from live:
    `bg-yellow-500`, **white** text (not black), `rounded-2xl` (16px),
    `1rem 2.5rem` padding, `text-lg`, `font-bold`.

### Where the homepage stands now

Structurally matching live at all 3 breakpoints. Remaining subtle
drifts are minor (testimonial card padding, a few spacing tweaks) and
should be reviewed in-browser rather than from compressed screenshots.

---

## Tests

```sh
npx astro check            # type check
npx playwright test        # 12 smoke tests (4 × 3 projects)
npx playwright test tests/pair-review.spec.ts --project chromium-desktop
                           # regenerate pair-review screenshots
```

Current state: `astro check` clean, 12/12 Playwright tests passing.

### Test inventory (`tests/homepage.spec.ts`)

1. `loads without console errors` — no JS errors during page load
2. `nav is visible` — absolute nav variant renders
3. `footer contains contact email` — `boojor.orly@gmail.com` visible
4. `nav anchors jump to sections (all breakpoints)` — `emulateMedia
   reducedMotion:reduce`, then hash-navigate to `#services`, `#my-work`,
   `#contact`; each target should end up in viewport with
   `rect.top` between 0 and 500px (validates `scroll-padding-top`)

---

## Commands

```sh
npm install                # install deps
npm run dev                # dev server at http://localhost:4321
npm run build              # production build to ./dist/
npm run preview            # preview the production build
npx astro check            # type check
npx playwright test        # smoke tests
```

---

## What's next

### Phase 3 — case studies
Build the individual work pages:
- `/work/cinch-logistics`
- `/work/fundbox-pay-checkout`
- `/work/fundbox-partnerships`

Pattern: scrape each live page's HTML + CSS, pre-map content, dispatch
implementer subagents, pair-review screenshots, iterate.

### Phase 4 — polish
- LogoStrip marquee animation (GSAP or CSS keyframes)
- Services Swiper/Embla carousel with prev/next functional
- Testimonials Swiper with multiple slides + pagination dots
- Any remaining typography / spacing tune-ups from the pair review
- Real alt text for all images

### Phase 5 — deploy
- Pick hosting target (Netlify / Cloudflare Pages / Vercel)
- Wire real ContactForm backend (Formspree / Netlify Forms / mailto)
- Replace `site.url` placeholder with production domain
- Run `@axe-core/playwright` accessibility audit
- Final code review

---

## Key gotchas to remember

1. **Tailwind 4 `@theme`** — no `tailwind.config.mjs`. All tokens in
   `src/styles/global.css` inside the `@theme { }` block.
2. **Container vs spacing collision** — `--container-site-*` prefix is
   required to prevent `max-w-large` resolving to 3rem (spacing) instead
   of 64rem (container).
3. **Tailwind 4 JIT can't see interpolated class strings** — use static
   maps (see `TAG_STYLES` in `ServiceCard.astro`) or inline `style`.
4. **Playwright device presets default to webkit** — must override with
   `defaultBrowserType: 'chromium'` to run on chromium-only installs.
5. **Adobe Typekit font names** — `"Inter"` style is `"Semi Bold"` (with
   space), not `"SemiBold"`. Applies to any Typekit-hosted font.
6. **`scroll-behavior: smooth`** is guarded behind `prefers-reduced-motion:
   no-preference` — tests use `page.emulateMedia({ reducedMotion: 'reduce'
   })` for deterministic scroll measurements.
7. **Dev server** — `npm run dev` runs on `http://localhost:4321`.
   Playwright's `playwright.config.ts` auto-starts it during tests via
   `webServer`.
