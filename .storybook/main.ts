import type { StorybookConfig } from '@storybook/html-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/html-vite",
  viteFinal: async (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    return config;
  }
};
export default config;