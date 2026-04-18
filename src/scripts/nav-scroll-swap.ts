// Nav behavior:
//
// 1. Swap between absolute (over hero) and fixed (on scroll past hero).
//    Uses a scroll listener on a sentinel at the top of the page.
//    Fixed nav appearance is animated with CSS transitions via a
//    `nav-fixed--shown` class toggle — reliable under HMR and
//    cold-load scroll restoration.
//
// 2. Scroll-spy: highlights the nav link whose target section is
//    currently in view. Uses a scroll listener (not IntersectionObserver
//    with a thin rootMargin band, which misses scrollIntoView cases).
//    Each frame we pick the section whose top is the LARGEST value
//    that's still ≤ the activation line (viewport top + ~120px).

// Guard against duplicate init when both the module auto-init at the
// bottom of this file and the component's `<script>` block call
// initNavScrollSwap(), and when HMR re-runs the module.
let __navSwapInited = false;

export function initNavScrollSwap(): void {
  if (__navSwapInited) return;
  const absoluteNav = document.querySelector<HTMLElement>('[data-nav="absolute"]');
  const fixedNav = document.querySelector<HTMLElement>('[data-nav="fixed"]');
  const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]');

  if (!absoluteNav || !fixedNav || !sentinel) {
    console.warn('[nav-scroll-swap] Missing nav or sentinel element.');
    return;
  }
  __navSwapInited = true;

  const showFixed = () => fixedNav.classList.add('nav-fixed--shown');
  const hideFixed = () => fixedNav.classList.remove('nav-fixed--shown');

  // ——— Nav swap ———
  // Scroll-based detection: sentinel.top crossing the viewport top.
  // IntersectionObserver was flaky across cold load + scroll restoration;
  // a direct scroll read is deterministic and runs per frame anyway.
  let lastShown = null as boolean | null;
  const updateSwap = () => {
    const shouldShowFixed = sentinel.getBoundingClientRect().top < 0;
    if (shouldShowFixed === lastShown) return;
    lastShown = shouldShowFixed;
    if (shouldShowFixed) {
      absoluteNav.classList.add('hidden');
      showFixed();
    } else {
      absoluteNav.classList.remove('hidden');
      hideFixed();
    }
  };
  updateSwap();

  // Always wire swap to scroll — even if no scroll-spy pairs exist
  // (case-study pages have nav links that point to /#home-sections,
  // not to sections on this page). Scroll-spy handler attaches
  // separately below when pairs.length > 0.
  let swapRafScheduled = false;
  window.addEventListener('scroll', () => {
    if (swapRafScheduled) return;
    swapRafScheduled = true;
    requestAnimationFrame(() => {
      swapRafScheduled = false;
      updateSwap();
    });
  }, { passive: true });

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

    // Pick the section that has already crossed the activation line
    // (1/3 from viewport top) — i.e. section.top ≤ activationLine.
    // Among those, choose the one with the largest top (most recent
    // crossing). If no section has crossed yet (user is in the hero
    // above all tracked sections), return null → no highlight.
    // Exception: when near page bottom, activate the last section
    // whose top has entered the viewport, since short sections
    // can't scroll far enough to put their top at 0.
    const activationLine = window.innerHeight / 3;
    const nearBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 50;

    let best: Element | null = null;
    if (nearBottom) {
      // Activate the last section in document order that's at least
      // partially in the viewport.
      const sortedByDocOrder = uniqueSections
        .map((s) => ({ s, absTop: s.getBoundingClientRect().top + window.scrollY }))
        .sort((a, b) => a.absTop - b.absTop);
      for (const { s } of sortedByDocOrder) {
        const r = s.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) best = s;
      }
    } else {
      let bestTop = -Infinity;
      for (const section of uniqueSections) {
        const top = section.getBoundingClientRect().top;
        if (top <= activationLine && top > bestTop) {
          best = section;
          bestTop = top;
        }
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
    requestAnimationFrame(() => {
      updateSwap();
      updateActive();
    });
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
