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
  featured: boolean;
}

export const work: WorkItem[] = [
  {
    slug: 'cinch-logistics',
    title: 'Cinch Logistics',
    client: 'Cinch',
    year: 2024,
    cover: '/assets/cinch-cover.jpg',
    featured: true,
  },
  {
    slug: 'fundbox-pay-checkout',
    title: 'Fundbox Pay Checkout',
    client: 'Fundbox',
    year: 2023,
    cover: '/assets/fundbox-cover.jpg',
    featured: true,
  },
  {
    slug: 'fundbox-partnerships',
    title: 'Fundbox Strategic Partnerships',
    client: 'Fundbox',
    year: 2022,
    cover: '/assets/partnerships-cover.jpg',
    featured: true,
  },
];
