// src/config.ts
// Single source of truth for tunable site content.

export const site = {
  name: 'Orly Boojor',
  tagline: 'Product Designer',
  url: 'https://orly-website.webflow.io', // TODO: replace with production domain in Phase 5
};

export const contact = {
  email: 'boojor.orly@gmail.com',
  phone: '+972-545-988-068',
};

export const social = {
  linkedin: 'https://www.linkedin.com/in/orlyboojor/',
  // Add more as needed
};

export const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'My Work', href: '/#my-work' },
  { label: 'Contact', href: '/#contact' },
];

export interface WorkItem {
  slug: string;
  title: string;
  client: string;
  year: number;
  cover: string;
  thumbnail: string;
  thumbnailSrcset?: string;
  featured: boolean;
}

export const work: WorkItem[] = [
  {
    slug: 'cinch-logistics',
    title: 'Cinch Logistics',
    client: 'Cinch',
    year: 2024,
    cover: '/assets/cinch-cover.jpg',
    thumbnail: '/assets/work/cinch.webp',
    thumbnailSrcset:
      '/assets/work/cinch-500.webp 500w, /assets/work/cinch-800.webp 800w, /assets/work/cinch-1080.webp 1080w, /assets/work/cinch.webp 1600w',
    featured: true,
  },
  {
    slug: 'fundbox-pay-checkout',
    title: 'Fundbox Pay Checkout',
    client: 'Fundbox',
    year: 2023,
    cover: '/assets/fundbox-cover.jpg',
    thumbnail: '/assets/work/fbx-checkout.webp',
    thumbnailSrcset:
      '/assets/work/fbx-checkout-500.webp 500w, /assets/work/fbx-checkout-800.webp 800w, /assets/work/fbx-checkout.webp 1200w',
    featured: true,
  },
  {
    slug: 'fundbox-partnerships',
    title: 'Fundbox Strategic Partnerships',
    client: 'Fundbox',
    year: 2022,
    cover: '/assets/partnerships-cover.jpg',
    thumbnail: '/assets/work/fbx-partnerships.png',
    thumbnailSrcset:
      '/assets/work/fbx-partnerships-500.png 500w, /assets/work/fbx-partnerships-800.png 800w, /assets/work/fbx-partnerships-1080.png 1080w, /assets/work/fbx-partnerships.png 1600w',
    featured: true,
  },
];
