// Nav behavior:
//
// 1. Swap between absolute (over hero) and fixed (on scroll) variants.
//    Uses IntersectionObserver on a sentinel at the top of the hero.
//    The fixed nav fades/slides in via CSS transition (.nav-fixed--shown)
//    instead of an abrupt display:none swap.
//
// 2. Scroll-spy: highlights the nav link whose target section is
//    currently in the viewport. Adds `.is-active` class on both nav
//    variants' links so the highlight applies before AND after the swap.

export function initNavScrollSwap(): void {
  const absoluteNav = document.querySelector<HTMLElement>('[data-nav="absolute"]');
  const fixedNav = document.querySelector<HTMLElement>('[data-nav="fixed"]');
  const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]');

  if (!absoluteNav || !fixedNav || !sentinel) {
    console.warn('[nav-scroll-swap] Missing nav or sentinel element.');
    return;
  }

  // ——— Nav swap ———
  const swapObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // Hero visible → show absolute, hide fixed (slide up + fade out)
        absoluteNav.classList.remove('hidden');
        fixedNav.classList.remove('nav-fixed--shown');
      } else {
        // Scrolled past hero → hide absolute, show fixed (slide down + fade in)
        absoluteNav.classList.add('hidden');
        fixedNav.classList.add('nav-fixed--shown');
      }
    },
    { threshold: 0 }
  );
  swapObserver.observe(sentinel);

  // ——— Scroll-spy for nav anchor links ———
  // Find every [data-nav-link] element, resolve its target section by
  // the href's hash, and observe all targets. Highlight whichever
  // section is most prominently in view.
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'),
  );
  const sectionToLinks = new Map<Element, HTMLAnchorElement[]>();
  for (const link of navLinks) {
    const hash = link.getAttribute('data-nav-link');
    if (!hash || !hash.startsWith('#')) continue;
    const section = document.querySelector(hash);
    if (!section) continue;
    const arr = sectionToLinks.get(section) ?? [];
    arr.push(link);
    sectionToLinks.set(section, arr);
  }

  const clearActive = () => {
    for (const link of navLinks) link.classList.remove('is-active');
  };

  const setActive = (section: Element) => {
    clearActive();
    const links = sectionToLinks.get(section);
    if (!links) return;
    for (const l of links) l.classList.add('is-active');
  };

  if (sectionToLinks.size > 0) {
    // Track which sections are in view. Use a small top margin to
    // trigger the swap when the section's heading crosses roughly the
    // top third of the viewport (not the absolute top).
    const spyObserver = new IntersectionObserver(
      (entries) => {
        // Of all currently-intersecting sections, pick the one whose
        // top is closest to (but at or below) 0 — i.e. the one
        // visually "active" at the top of the viewport.
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ target: e.target, top: e.boundingClientRect.top }));
        if (intersecting.length === 0) return;
        intersecting.sort((a, b) => {
          // Prefer top >=0 (at/below top), sort ascending.
          const aNegative = a.top < 0;
          const bNegative = b.top < 0;
          if (aNegative && !bNegative) return 1;
          if (!aNegative && bNegative) return -1;
          return a.top - b.top;
        });
        setActive(intersecting[0].target);
      },
      {
        // Trigger when the section's top passes the top ~35% of
        // viewport and continues until it's 60% past.
        rootMargin: '-35% 0px -60% 0px',
        threshold: 0,
      },
    );
    for (const section of sectionToLinks.keys()) spyObserver.observe(section);
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScrollSwap);
  } else {
    initNavScrollSwap();
  }
}
