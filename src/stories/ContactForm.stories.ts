// ContactForm — visual parity replica of src/components/home/ContactForm.astro.
// Two variants ship:
//   • default — yellow footer bg, black labels/borders, dark Send It button
//   • dark    — case-study dark footer, white labels/borders, gold Send It
// Stories wrap each variant in the matching footer-top bg so readability is
// visible without leaving Storybook.
import type { Meta, StoryObj } from '@storybook/html';

interface ContactFormArgs {
  variant: 'default' | 'dark';
}

const CHEVRON = (stroke: string) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='${stroke}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>")`;

const ARROW = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M0.81 8H15.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8.48 14.71L15.19 8L8.48 1.29" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const render = (args: ContactFormArgs): string => {
  const isDark = args.variant === 'dark';
  const backdrop = isDark ? '#171717' : '#d1a451';
  const labelCls = isDark ? 'text-white' : 'text-bg';
  const inputCls = isDark
    ? 'w-full rounded-full border border-white bg-transparent px-medium py-xsmall font-heading text-base md:text-xl font-medium text-white placeholder:text-white/80 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-white/20'
    : 'w-full rounded-full border border-bg bg-transparent px-medium py-xsmall font-heading text-base md:text-xl font-medium text-bg placeholder:text-bg placeholder:font-light focus:outline-none focus:ring-2 focus:ring-bg/20';
  const selectCls = inputCls + ' appearance-none bg-no-repeat';
  const submitCls = isDark
    ? 'inline-flex items-center gap-small rounded-2xl bg-yellow-500 px-large py-small font-heading text-base md:text-lg font-bold text-white transition-colors hover:bg-yellow-600'
    : 'inline-flex items-center gap-small rounded-2xl bg-bg px-large py-small font-heading text-base md:text-lg font-bold text-white transition-colors hover:bg-bg/90';
  const chevron = isDark ? 'white' : 'black';

  return `
    <div style="background:${backdrop}; padding:48px; min-height:500px;">
      <form class="flex flex-col gap-small" style="max-width:720px;">
        <div class="flex items-center gap-medium">
          <label class="font-heading text-xl md:text-2xl font-normal shrink-0 ${labelCls}">Hey, I&rsquo;m</label>
          <input type="text" placeholder="Your name" class="${inputCls}" />
        </div>
        <div class="flex items-center gap-medium">
          <label class="font-heading text-xl md:text-2xl font-normal shrink-0 whitespace-nowrap ${labelCls}">Please get back to me via</label>
          <input type="text" placeholder="Your email" class="${inputCls}" />
        </div>
        <div class="flex items-center gap-medium">
          <label class="font-heading text-xl md:text-2xl font-normal shrink-0 whitespace-nowrap ${labelCls}">I&rsquo;m reaching out about</label>
          <select
            class="${selectCls}"
            style="background-image: ${CHEVRON(chevron)}; background-position: calc(100% - 1.5rem) center;"
          >
            <option>Please select</option>
            <option>First choice</option>
            <option>Second choice</option>
          </select>
        </div>
        <div class="mt-small">
          <button type="submit" class="${submitCls}">Send it ${ARROW}</button>
        </div>
      </form>
    </div>`;
};

const meta: Meta<ContactFormArgs> = {
  title: 'Components/ContactForm',
  tags: ['autodocs'],
  render,
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['default', 'dark'],
      description:
        'Matches the Astro prop. Default = home (yellow footer bg, dark labels/borders, dark Send It). Dark = case-study pages (dark footer, white labels/borders, gold Send It).',
    },
  },
  args: { variant: 'default' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Three-field contact form used inside `Footer`. `variant` drives label + border + button color to stay readable against each footer-top background.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ContactFormArgs>;

export const Default: Story = {
  name: 'Default (yellow footer — home)',
  args: { variant: 'default' },
};

export const Dark: Story = {
  name: 'Dark (case-study footer)',
  args: { variant: 'dark' },
};
