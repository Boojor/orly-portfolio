import type { Preview } from '@storybook/html-vite';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#171717',
        },
        {
          name: 'light',
          value: '#f5f5f4',
        },
      ],
    },
    a11y: {
      test: 'todo'
    }
  },
  decorators: [
    (story, context) => {
      // Create a wrapper element
      const wrapper = document.createElement('div');
      
      // Check current background from Storybook context
      const isLight = context.globals.backgrounds?.value === '#f5f5f4';
      
      // Override text color if light mode is selected, since global.css sets body { color: #fff }
      if (isLight) {
        wrapper.style.color = '#171717';
      }

      // We just return a wrapping div that overrides styles for the story context
      // When rendering HTML strings in Storybook, decorators wrap the HTML string
      const storyResult = story();
      
      if (typeof storyResult === 'string') {
        wrapper.innerHTML = storyResult;
        return wrapper;
      }
      return storyResult;
    }
  ]
};

export default preview;