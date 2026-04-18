// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    // TS type mismatch between two copies of vite after the Storybook
    // removal shuffled node_modules hoisting. Runtime is fine; silencing
    // the check keeps `astro check` green.
    // @ts-expect-error tailwind vite plugin typed against root vite copy
    plugins: [tailwindcss()],
    // Pre-bundle GSAP so Playwright's first cold request doesn't hit
    // Vite's 504 "Outdated Optimize Dep" response while deps reload.
    optimizeDeps: {
      include: ['gsap'],
    },
  },
});