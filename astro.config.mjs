// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle GSAP so Playwright's first cold request doesn't hit
    // Vite's 504 "Outdated Optimize Dep" response while deps reload.
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});