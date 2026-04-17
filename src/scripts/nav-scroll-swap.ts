// Nav behavior:
//
// 1. Swap between absolute (over hero) and fixed (on scroll past hero).
//    Uses IntersectionObserver on a sentinel at the top of the hero.
//    Fixed nav appearance is animated with GSAP: short delay in, then
//    slide-down + fade-in with an `out` ease that starts slow and
//    settles — far more elegant than a linear CSS transition.
//
// 2. Scroll-spy: highlights the nav link whose target section is
//    currently in view. Uses a scroll listener (not IntersectionObserver
//    with a thin rootMargin band, which misses scrollIntoView cases).
//    Each frame we pick the section whose top is the LARGEST value
//    that's still ≤ the activation line (viewport top + ~120px).
import { gsap } from 'gsap';

// ——— Tunables ———
// Appear: short delay so the swap isn't instant, then 0.45s ease.out
// (starts fast-ish, settles smoothly). Disappear is snappier (0.25s)
// so the absolute nav is visible sooner when scrolling back up.
const APPEAR_DELAY = 0.08;
const APPEAR_DURATION = 0.45;
const APPEAR_EASE = 'power2.out';
const DISAPPEAR_DURATION = 0.25;
const DISAPPEAR_EASE = 'power2.in';
// Scroll-spy activation line: sections whose top is ≤ this y value
// are considered "at the top". We use 1/3 of the viewport so the
// active link changes as the next section's heading crosses the
// upper third of the screen — more natural than a tiny offset.

export function initNavScrollSwap(): void {
  const absoluteNav = document.querySelector<HTMLElement>('[data-nav="absolute"]');
  const fixedNav = document.querySelector<HTMLElement>('[data-nav="fixed"]');
  const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]');

  if (!absoluteNav || !fixedNav || !sentinel) {
    console.warn('[nav-scroll-swap] Missing nav or sentinel element.');
    return;
  }

  // ——— Prep fixed nav initial state (GSAP) ———
  // Hidden off-screen above, not interactive. GSAP `autoAlpha` sets
  // both opacity + visibility so the hidden state also skips paint.
  gsap.set(fixedNav, { autoAlpha: 0, yPercent: -100, pointerEvents: 'none' });

  let fixedTween: gsap.core.Tween | null = null;

  const showFixed = () => {
    fixedTween?.kill();
    fixedTween = gsap.to(fixedNav, {
      autoAlpha: 1,
      yPercent: 0,
      pointerEvents: 'auto',
      delay: APPEAR_DELAY,
      duration: APPEAR_DURATION,
      ease: APPEAR_EASE,
      overwrite: true,
    });
  };

  const hideFixed = () => {
    fixedTween?.kill();
    fixedTween = gsap.to(fixedNav, {
      autoAlpha: 0,
      yPercent: -100,
      pointerEvents: 'none',
      duration: DISAPPEAR_DURATION,
      ease: DISAPPEAR_EASE,
      overwrite: true,
    });
  };

  // ——— Nav swap ———
  const swapObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        absoluteNav.classList.remove('hidden');
        hideFixed();
      } else {
        absoluteNav.classList.add('hidden');
        showFixed();
      }
    },
    { threshold: 0 },
  );
  swapObserver.observe(sentinel);

  // ——— Scroll-spy ———
  // Collect [link, sectionEl] pairs, skipping placeholder hrefs like '#'.
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'),
  );
  const pairs: Array<{ link: HTMLAnchorElement; section: Element }> = [];
  for (const link of navLinks) {
    const sel = link.getAttribute('data-nav-link');
    if (!sel || sel === '#' || !sel.startsWith('#')) continue;
    try {
      const section = document.querySelector(sel);
      if (section) pairs.push({ link, section });
    } catch {
      /* invalid selector, skip */
    }
  }
  if (pairs.length === 0) return;

  // Dedupe sections so we don't re-measure the same element twice.
  const uniqueSections = Array.from(new Set(pairs.map((p) => p.section)));
  const sectionToLinks = new Map<Element, HTMLAnchorElement[]>();
  for (const { link, section } of pairs) {
    const arr = sectionToLinks.get(section) ?? [];
    arr.push(link);
    sectionToLinks.set(section, arr);
  }

  let rafScheduled = false;
  let lastActive: Element | null = null;

  const updateActive = () => {
    rafScheduled = false;

    // Pick the section whose MIDPOINT is closest to the viewport's
    // activation line (1/3 from top). This is the standard scroll-
    // spy heuristic and handles short last sections correctly
    // (e.g. a short footer whose top never crosses the usual ≤line
    // threshold — its midpoint will still be closest to center when
    // the user is scrolled into it).
    const activationLine = window.innerHeight / 3;
    let best: Element | null = null;
    let bestDist = Infinity;
    for (const section of uniqueSections) {
      const r = section.getBoundingClientRect();
      const midpoint = r.top + r.height / 2;
      const dist = Math.abs(midpoint - activationLine);
      if (dist < bestDist) {
        best = section;
        bestDist = dist;
      }
    }
    if (best === lastActive) return;
    lastActive = best;
    // Clear, then set
    for (const link of navLinks) link.classList.remove('is-active');
    if (best) {
      const links = sectionToLinks.get(best) ?? [];
      for (const l of links) l.classList.add('is-active');
    }
  };

  const onScroll = () => {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(updateActive);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  // Initial state.
  updateActive();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScrollSwap);
  } else {
    initNavScrollSwap();
  }
}
