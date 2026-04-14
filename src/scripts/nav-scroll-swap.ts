// Toggles between <nav data-nav="absolute"> and <nav data-nav="fixed">
// based on scroll position. Uses IntersectionObserver on a sentinel element
// at the top of the page (the hero's top edge).

export function initNavScrollSwap(): void {
  const absoluteNav = document.querySelector<HTMLElement>('[data-nav="absolute"]');
  const fixedNav = document.querySelector<HTMLElement>('[data-nav="fixed"]');
  const sentinel = document.querySelector<HTMLElement>('[data-nav-sentinel]');

  if (!absoluteNav || !fixedNav || !sentinel) {
    console.warn('[nav-scroll-swap] Missing nav or sentinel element.');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        // Hero visible → show absolute, hide fixed
        absoluteNav.classList.remove('hidden');
        fixedNav.classList.add('hidden');
        fixedNav.classList.remove('flex');
      } else {
        // Scrolled past hero → hide absolute, show fixed
        absoluteNav.classList.add('hidden');
        fixedNav.classList.remove('hidden');
        fixedNav.classList.add('flex');
      }
    },
    { threshold: 0 }
  );

  observer.observe(sentinel);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavScrollSwap);
  } else {
    initNavScrollSwap();
  }
}
