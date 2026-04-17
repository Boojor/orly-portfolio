# Orly Portfolio — Agent Instructions

This is a **visual parity rebuild** of `orly-website.webflow/` (an exported
Webflow static site) into an independent Astro 6 + Tailwind 4 codebase.
Orly owns the code and will deploy it independently of Webflow.

## The rule (non-negotiable)

**Match live Webflow literally. UI-only. No invention.**

- Don't "fix" perceived errors in the source (including typos like
  "Design systems that scales" — that's literal source copy)
- Don't add gradient fades, height bumps, padding band-aids, or any
  value not present in the source CSS
- Don't rearrange layout to feel "cleaner" — the source is the spec

**Code-side cleanups ARE welcome** (framework idioms, typed props,
token extraction, accessibility attrs) as long as they change **zero
pixels** at every breakpoint in every state.

## When fixing reported drift

**Invoke the `visual-parity-rebuild` skill** — it encodes the full
workflow (screenshots find drifts, measurements find causes, walk up
the DOM, literal port). The skill is the source of truth for
methodology; this file just covers project-specific paths and commands.

Common trap on this project: when CSS on a drifting element matches
live exactly, the cause is content size on an ancestor. Measure the
hero first — it's been the culprit multiple times (see commit
`60c050b` where a weighted grid was squeezing the h1 column to 166px
at 1024 and blowing hero height by 373px).

## Reference paths

| What | Where |
|---|---|
| Live HTML reference | `../orly-website.webflow/index.html` |
| Live CSS reference | `../orly-website.webflow/css/orly-website.webflow.css` |
| Live image assets | `../orly-website.webflow/images/` |
| QA screenshots (user's reference) | `../zz_Design QA/{375,768,1024,1440,1920} Source.png` |
| Audit report | `../zz_Design QA/audit-report.md` |
| Plans directory | `~/.claude/plans/*.md` |

## Commands

```bash
# Dev server (already runs on 4321 via webServer config in Playwright)
npm run dev

# Type check — must be clean before every commit
npx astro check

# Smoke tests — 12 tests across 3 projects (mobile/tablet/desktop)
npx playwright test

# Pair-review screenshots at all 5 breakpoints
npx playwright test tests/pair-review.spec.ts --project chromium-desktop
# Outputs land in screenshots/pair-review/{local,live}-{375,768,1024,1440,1920}.png
```

## Pair-review workflow

For every drift-fix batch:

1. Regenerate pair-review screenshots:
   `npx playwright test tests/pair-review.spec.ts --project chromium-desktop --grep "{bp}"`
2. **Run the heatmap pixel diff at the affected breakpoint(s)**:
   `node scripts/visual-diff.mjs 1440 1200` (crop height 1200px ≈ hero area)
   Outputs to `screenshots/pair-review/`:
     - `diff-{bp}-heatmap.png` — red pixels = differences, grey = matches
     - `diff-{bp}-side-by-side.png` — local left / live right
     - `diff-{bp}-stats.txt` — one-line % difference
3. **Measure DOM** with `scripts/hero-cols.mjs`, `scripts/bg-image-diff.mjs`,
   or write a new one-off for the affected section. Never trust a
   screenshot-only verdict.
4. **"Fixed" requires ALL three passes**: measurements match, 12/12
   tests green, heatmap clean in the drift area. One out of three is
   not fixed. If I claim fixed without all three, treat it as suspect.
5. Update `../zz_Design QA/audit-report.md` after the batch
6. Commit

## Diagnostic scripts (gitignored under `scripts/`)

| Script | Purpose |
|---|---|
| `visual-diff.mjs {bp} {cropH}` | Pixel heatmap diff of `local-{bp}.png` vs `live-{bp}.png` |
| `hero-cols.mjs` | Measures hero grid columns at 1440 + 1920 |
| `bg-image-diff.mjs` | Walks hero → logos → services heights at 992-1280 |
| `hero-subcopy.mjs` | Measures hero `<p>` + button + wrapper at 1024 + 1440 |
| `hero-width.mjs` | Confirms hero stretches full viewport minus 5% padding |
| `kpi-positions.mjs` | KPI card top/bottom/right + font size at 1024/1440/1920 |
| `kpi-visibility.mjs` | Asserts KPI `display: none` at mobile/tablet, `flex` at ≥992 |
| `logo-measure.mjs` | Nav logo w/h/top/left at all 5 breakpoints, local vs live |
| `worktiles.mjs` | Asserts 5 work tiles render with correct dimensions per BP |
| `live-tiles.mjs` | Same for live reference — use to confirm target values |
| `fixed-nav-heatmap.mjs {bp}` | Scrolls past hero, screenshots + diffs top 120px |
| `nav-full-verify.mjs` | Rigorous check: height + opacity-over-time + scroll-spy |
| `nav-state-check.mjs` | Samples fixed-nav opacity/visibility/transform at scroll states |
| `scroll-spy-debug.mjs` | Scrolls to each section, reads `.is-active` nav links |

Project-specific wiring for any new script:
- Live URL: `file://` + `path.resolve('../../orly-website.webflow/index.html')`
- Local URL: `http://localhost:4321/`
- Network idle hangs on `file://` — use `.catch(() => page.goto(liveUrl))`
  and `await page.waitForTimeout(1500)` for Webflow/Swiper JS to settle

## Diagnostic scripts

One-off Playwright scripts live in `scripts/` (gitignored via
`.gitignore`). They load both local and live in the same chromium
instance at the target viewport and dump DOM measurements side-by-side.
Template and pattern live in the `visual-parity-rebuild` skill.

Key project-specific wiring for scripts:
- Live URL: `file://` + `path.resolve('../../orly-website.webflow/index.html')`
- Local URL: `http://localhost:4321/`
- Network idle can hang on `file://` with CDN scripts — wrap in
  `.catch(() => page.goto(liveUrl))` and add a 1.5s `waitForTimeout`
  so Webflow/Swiper JS settles before measurement

## Project-specific gotchas

- **Tailwind 4 via `@tailwindcss/vite`**, no `tailwind.config.mjs`.
  Tokens live in `@theme { }` in `src/styles/global.css`.
- **Don't zero out `--radius-*` tokens.** Doing this broke every
  `rounded-2xl`/`rounded-xl` in the codebase. Fix in `10d9106`.
- **Container naming collision:** Finsweet Client-First uses the same
  semantic names (`small`, `large`, etc.) for both spacing and
  max-widths. Prefix max-widths with `site-` (`--container-site-large`
  → `max-w-site-large`) to avoid `max-w-large` resolving to the
  spacing value.
- **Hero does NOT use `min-h-screen`.** Live uses `padding-top: 9rem`
  (tablet: `8rem`) and `padding-bottom: 0`. Full-viewport hero causes
  anchor-test threshold failures.
- **Bg image lives at body level in `BaseLayout.astro`** as a sibling
  of `<main>`, matching live's `<div class="page-wrapper">` child
  pattern. CSS port of `.bg-image` is in `global.css`.
- **Hero grid is `grid-cols-3 gap-4` at `lg+`**, NOT weighted columns.
  Weighted grids squeeze the headline column too narrow at 1024 and
  blow up hero height. Match live's literal `1fr 1fr 1fr`.
- **Mobile carousels use scroll-snap**, not Swiper. Pattern:
  `flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`
  on the wrapper + `shrink-0 basis-[85%] snap-start md:basis-auto md:shrink`
  on each item. Real Swiper is deferred to Phase 4.
- **Anchor test threshold is `topPx < 500`.** Tight enough to catch
  broken `scroll-padding-top`, loose enough that a 330px footer top
  still passes. Don't tighten without checking all anchors.
- **GSAP installed (^3.15.0) for JS-driven transitions** — currently
  used by `src/scripts/nav-scroll-swap.ts` for the fixed-nav slide
  in/out. Pre-bundled via `optimizeDeps.include: ['gsap']` in
  `astro.config.mjs` so Playwright cold-starts don't hit Vite's
  504 Outdated Dep response.
- **GSAP transforms and CSS transforms don't mix.** If GSAP
  animates `yPercent`/`x`/`y`, the element's CSS must NOT have a
  `transform:` rule — they stack, leaving residual translate after
  the tween. For initial "hidden above" state, use CSS `opacity: 0;
  visibility: hidden;` only; let `gsap.set({ yPercent: -100 })`
  handle the transform.
- **Scroll-spy uses top-crossing, not midpoint-closest.**
  `src/scripts/nav-scroll-swap.ts` picks the section whose
  `getBoundingClientRect().top` is ≤ `innerHeight/3` and closest to
  it. Returns null (no highlight) when no section has crossed —
  matches user intuition at page top where hero is visible. A
  `nearBottom` branch (within 50px of page bottom) activates the
  last in-viewport section for short footers that can't scroll to
  top:0. Skips placeholder `href="#"` links to avoid the
  `querySelector('#')` syntax error.
- **Verify animations by sampling opacity over time, not start/end.**
  `scripts/nav-state-check.mjs` samples computed opacity at 8+
  timestamps across the transition (50ms, 100ms, 150ms, 200ms, ...)
  to prove the delay + ease curve — not just that it starts at 0
  and ends at 1. Two data points can't distinguish instant from
  eased.
- **Responsive rules that need to beat Tailwind's `md:`/`lg:`** live
  in `src/styles/global.css` under `@layer utilities` with a
  `data-*` or semantic class selector. Tailwind 4 outputs custom /
  arbitrary breakpoint variants BEFORE default named ones in
  source, so `min-[992px]:grid-cols-3` loses to `md:grid-cols-2` at
  1024. Plain CSS in `@layer utilities` lands after all Tailwind
  utilities and reliably wins. See `.nav-logo-absolute`,
  `.nav-logo-sticky`, `.work-tile`, `[data-hero-*]` rules for
  examples.

## Commit message shape for parity fixes

```
fix(<area>): <what got ported>

Root cause: <the REAL cause>. Source uses <literal value>, I had
<divergent value>. This caused <visible effect>.

Port: <exact rules copied over>

Verification: <measured before/after numbers>. 12/12 tests green,
astro check clean.
```

The measured-numbers line is the receipt that you ran a diagnostic
script instead of eyeballing screenshots.

## Files NOT to commit

- `.claude/launch.json` — local dev preview config
- `scripts/*.mjs` — diagnostic one-offs (gitignore if not already)
- `screenshots/pair-review/` — gitignored; regenerated per batch

## Phase gate

- **Phase 1:** Layout scaffold — ✅ done
- **Phase 2:** Homepage sections (Nav, Hero, LogoStrip, Services,
  WorkGrid, Testimonials, ContactForm, Footer) — ✅ done
- **Phase 2.9:** Visual parity pass — ✅ done (through commit `60c050b`)
- **Phase 3:** Case study pages (`/work/cinch-logistics`,
  `/work/fundbox-pay-checkout`, `/work/fundbox-partnerships`) — pending
- **Phase 4:** Polish — Swiper real animations, LogoStrip marquee,
  subtle typography — deferred
- **Phase 5:** Deploy — pending (pick host, wire real form backend,
  replace `site.url` placeholder, final audit)

## When in doubt

1. Re-read source HTML for the drifting element
2. Re-read source CSS (including media queries) for every class on it
3. Measure both sides with a diagnostic script
4. Port the literal values
5. Regenerate screenshots
6. If still wrong, the drift is upstream — measure the parent, then
   grandparent, etc.
