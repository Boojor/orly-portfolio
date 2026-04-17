// Carousel behavior — matches live Webflow's Swiper UX without pulling Swiper in.
//
// Wires:
//   1. Infinite wrap: cloning the last slide at the start and the first slide
//      at the end so swiping past either end seamlessly wraps around.
//   2. Prev/Next arrow buttons: data-carousel-prev/next="<name>" → advance by
//      one slide with wrap-around.
//   3. Pagination dot clicks → scroll to that slide (smooth).
//   4. Mouse drag on carousel → scrolls horizontally (Swiper grab-drag UX).
//   5. Scroll position → updates the active dot (rAF throttled).
// Touch swipe already works natively via `overflow-x-auto + snap-x snap-mandatory`.
//
// Elements wire up by name:
//   <div data-carousel="services"> … <div data-carousel-slide>…</div> … </div>
//   <div data-carousel-dots="services"> <button data-carousel-dot="0"> … </div>
//   <button data-carousel-prev="services">  <button data-carousel-next="services">
//
// At breakpoints where the track becomes a grid/column (md+ for services and
// testimonials in this project), the clones are hidden via global.css rules
// targeting [data-carousel-clone] and arrow scroll is no-op (detected via
// `flexDirection === 'column'` or `scrollWidth === clientWidth`).

type Carousel = {
  name: string;
  track: HTMLElement;
  slides: HTMLElement[]; // REAL slides only (clones are excluded)
  dots: HTMLButtonElement[];
  activeClass: string;
  inactiveClass: string;
};

const ACTIVE_SERVICES = 'bg-yellow-500';
const INACTIVE_SERVICES = 'bg-transparent';
const ACTIVE_TESTIMONIALS = 'bg-current';
const INACTIVE_TESTIMONIALS = 'bg-transparent';

function setActiveDot(c: Carousel, idx: number) {
  c.dots.forEach((dot, i) => {
    if (i === idx) {
      dot.classList.add(c.activeClass);
      dot.classList.remove(c.inactiveClass);
    } else {
      dot.classList.remove(c.activeClass);
      dot.classList.add(c.inactiveClass);
    }
  });
}

// Real-slide index closest to current scroll position. Clones resolve to the
// real slide they are mirroring: `last-clone` → last real, `first-clone` → first real.
function indexFromScroll(c: Carousel): number {
  const trackLeft = c.track.scrollLeft;
  let best = 0;
  let bestDelta = Infinity;
  c.slides.forEach((slide, i) => {
    const delta = Math.abs(slide.offsetLeft - trackLeft);
    if (delta < bestDelta) {
      best = i;
      bestDelta = delta;
    }
  });
  return best;
}

// Horizontal-carousel guard. Returns false when the track is in column/grid
// mode (md+ for this project) — callers should short-circuit.
function isHorizontal(c: Carousel): boolean {
  const cs = getComputedStyle(c.track);
  if (cs.flexDirection === 'column') return false;
  if (cs.display === 'grid') return false;
  return c.track.scrollWidth > c.track.clientWidth + 1;
}

// Insert clones of the first+last slides to enable infinite wrap.
// - Last slide cloned and inserted at the start (before first real slide)
// - First slide cloned and inserted at the end (after last real slide)
// - Clones marked with [data-carousel-clone] so CSS can hide them at md+ and
//   the slide query filter can skip them.
// - Initial scrollLeft set to the first real slide so the last-clone is
//   offscreen-left on load.
function installClones(c: Carousel) {
  if (c.slides.length < 2) return;
  const first = c.slides[0];
  const last = c.slides[c.slides.length - 1];

  const lastClone = last.cloneNode(true) as HTMLElement;
  const firstClone = first.cloneNode(true) as HTMLElement;

  // Don't pick clones up in slide queries or active-dot sync.
  lastClone.removeAttribute('data-carousel-slide');
  firstClone.removeAttribute('data-carousel-slide');
  lastClone.setAttribute('data-carousel-clone', 'last');
  firstClone.setAttribute('data-carousel-clone', 'first');
  // Clones are decorative — screen readers already have the real slides.
  lastClone.setAttribute('aria-hidden', 'true');
  firstClone.setAttribute('aria-hidden', 'true');

  c.track.insertBefore(lastClone, first);
  c.track.appendChild(firstClone);

  // Wait a frame so layout is final, then park at first real slide.
  requestAnimationFrame(() => {
    if (!isHorizontal(c)) return;
    c.track.scrollLeft = first.offsetLeft;
  });
}

// When scroll settles, detect if we landed on a clone and teleport to the
// equivalent real slide without animation. This is the mechanism that makes
// swiping past either end feel like a continuous loop.
function installWrapTeleport(c: Carousel) {
  let settleTimer: number | null = null;
  c.track.addEventListener('scroll', () => {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (!isHorizontal(c)) return;
      const first = c.slides[0];
      const last = c.slides[c.slides.length - 1];
      const scroll = c.track.scrollLeft;
      const epsilon = 5;

      if (scroll < first.offsetLeft - epsilon) {
        // User scrolled into the last-clone at the start. Jump to the real last.
        c.track.style.scrollBehavior = 'auto';
        c.track.scrollLeft = last.offsetLeft;
        requestAnimationFrame(() => (c.track.style.scrollBehavior = ''));
      } else if (scroll > last.offsetLeft + epsilon) {
        // User scrolled into the first-clone at the end. Jump to the real first.
        c.track.style.scrollBehavior = 'auto';
        c.track.scrollLeft = first.offsetLeft;
        requestAnimationFrame(() => (c.track.style.scrollBehavior = ''));
      }
    }, 180);
  });
}

// Prev/next buttons — scroll by one slide width. If we overshoot into clone
// territory the wrap-teleport handler silently puts us on the real slide.
function goRelative(c: Carousel, delta: number) {
  if (!isHorizontal(c)) return;
  const current = indexFromScroll(c);
  const targetIdx = current + delta;
  const slideCount = c.slides.length;

  let target: HTMLElement | null = null;
  if (targetIdx < 0) {
    // Scroll into the last-clone (which is `previousElementSibling` of first real).
    target = c.slides[0].previousElementSibling as HTMLElement | null;
  } else if (targetIdx >= slideCount) {
    // Scroll into the first-clone (which is `nextElementSibling` of last real).
    target = c.slides[slideCount - 1].nextElementSibling as HTMLElement | null;
  } else {
    target = c.slides[targetIdx];
  }
  if (!target) return;
  c.track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
}

function wireArrows(c: Carousel) {
  const prev = document.querySelector<HTMLButtonElement>(
    `[data-carousel-prev="${c.name}"]`,
  );
  const next = document.querySelector<HTMLButtonElement>(
    `[data-carousel-next="${c.name}"]`,
  );
  prev?.addEventListener('click', (e) => {
    e.preventDefault();
    goRelative(c, -1);
  });
  next?.addEventListener('click', (e) => {
    e.preventDefault();
    goRelative(c, +1);
  });
}

function wireDots(c: Carousel) {
  c.dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isHorizontal(c)) return; // md+ grid: dots are decorative
      const slide = c.slides[i];
      if (!slide) return;
      c.track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    });
  });
}

function wireDotSync(c: Carousel) {
  let rafPending = false;
  c.track.addEventListener('scroll', () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      setActiveDot(c, indexFromScroll(c));
    });
  });
}

function wireMouseDrag(c: Carousel) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  const DRAG_THRESHOLD = 6;

  c.track.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    if (!isHorizontal(c)) return;
    isDown = true;
    moved = false;
    startX = e.pageX;
    startScroll = c.track.scrollLeft;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
      moved = true;
      c.track.style.cursor = 'grabbing';
      c.track.style.userSelect = 'none';
      c.track.style.scrollSnapType = 'none';
    }
    if (moved) {
      e.preventDefault();
      c.track.scrollLeft = startScroll - dx;
    }
  });

  function endDrag() {
    if (!isDown) return;
    isDown = false;
    c.track.style.cursor = '';
    c.track.style.userSelect = '';
    if (moved) {
      requestAnimationFrame(() => {
        c.track.style.scrollSnapType = '';
        const idx = indexFromScroll(c);
        const slide = c.slides[idx];
        if (slide) c.track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
      });
    }
  }
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mouseleave', endDrag);

  // Cancel the stray click browsers fire at the end of a drag.
  c.track.addEventListener(
    'click',
    (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    },
    true,
  );
}

function getActiveClasses(name: string): [string, string] {
  if (name === 'services') return [ACTIVE_SERVICES, INACTIVE_SERVICES];
  return [ACTIVE_TESTIMONIALS, INACTIVE_TESTIMONIALS];
}

function init() {
  const tracks = document.querySelectorAll<HTMLElement>('[data-carousel]');
  tracks.forEach((track) => {
    const name = track.dataset.carousel;
    if (!name) return;
    const dotsContainer = document.querySelector<HTMLElement>(
      `[data-carousel-dots="${name}"]`,
    );
    // Slides are live references — re-queried after cloning because the track
    // now contains `[data-carousel-clone]` siblings we want to skip.
    const slides = Array.from(
      track.querySelectorAll<HTMLElement>(
        '[data-carousel-slide]:not([data-carousel-clone])',
      ),
    );
    if (slides.length === 0) return;
    const dots = dotsContainer
      ? Array.from(
          dotsContainer.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'),
        )
      : [];
    const [activeClass, inactiveClass] = getActiveClasses(name);
    const c: Carousel = { name, track, slides, dots, activeClass, inactiveClass };

    installClones(c);
    installWrapTeleport(c);
    wireArrows(c);
    if (dots.length) wireDots(c);
    if (dots.length) wireDotSync(c);
    wireMouseDrag(c);
    if (dots.length) setActiveDot(c, indexFromScroll(c));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
