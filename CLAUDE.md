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

1. Regenerate pair-review screenshots
2. Visually compare `local-{bp}.png` vs `live-{bp}.png` side by side
3. **But don't trust screenshots for diagnosis** — they compress and
   can hide or invent differences. Use a diagnostic script under
   `scripts/parity-diff-*.mjs` for any ambiguous drift.
4. Update `../zz_Design QA/audit-report.md` after the batch
5. Commit

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
