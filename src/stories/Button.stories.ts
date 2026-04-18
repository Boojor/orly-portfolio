// Button — visual parity replica of src/components/ui/Button.astro.
// Every variant + arrow combination that appears in the live site is
// covered as its own named story so reviewers can see them side by
// side without scrolling the full pages.
import type { Meta, StoryObj } from '@storybook/html';

type Variant =
  | 'primary'
  | 'secondary'
  | 'submit-dark'
  | 'submit-gold'
  | 'arrow-circle'
  | 'outline-pill';

type Arrow = 'none' | 'right' | 'left';

interface ButtonArgs {
  variant: Variant;
  arrow: Arrow;
  label: string;
  backdrop: 'dark' | 'light' | 'yellow' | 'hero';
}

const variantClass: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center rounded-2xl border border-yellow-500 bg-yellow-500 px-[2.5rem] py-[1rem] font-heading text-[1.125rem] leading-[1.4] font-bold text-white transition-colors hover:bg-yellow-600 hover:border-yellow-600',
  secondary:
    'inline-flex items-center justify-center rounded-2xl border border-yellow-500 bg-black px-[2.5rem] py-[1rem] font-heading text-[1.125rem] leading-[1.4] font-bold text-white transition-colors hover:bg-white hover:text-black',
  'submit-dark':
    'inline-flex items-center gap-small rounded-2xl bg-bg px-large py-small font-heading text-base md:text-lg font-bold text-white transition-colors hover:bg-bg/90',
  'submit-gold':
    'inline-flex items-center gap-small rounded-2xl bg-yellow-500 px-large py-small font-heading text-base md:text-lg font-bold text-white transition-colors hover:bg-yellow-600',
  'arrow-circle':
    'inline-flex items-center justify-center rounded-full border border-transparent bg-[#0000001a] px-[2.5rem] py-[1rem] text-white transition-opacity hover:opacity-100 cursor-pointer',
  'outline-pill':
    'rounded-full border border-white px-xlarge py-small font-heading text-xl text-white md:text-2xl',
};

const ARROW = (direction: 'left' | 'right') => `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="${direction === 'left' ? 'rotate-180' : ''}">
    <path d="M0.8125 8H15.1875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8.47949 14.7077L15.1878 7.99935L8.47949 1.29102" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const backdropBg: Record<ButtonArgs['backdrop'], string> = {
  dark: '#171717',
  light: '#f5f5f4',
  yellow: '#d1a451',
  hero: 'linear-gradient(180deg,#2a1d3a,#171717)',
};

const render = (args: ButtonArgs): string => {
  const classes = variantClass[args.variant];
  const left = args.arrow === 'left' ? ARROW('left') : '';
  const right = args.arrow === 'right' ? ARROW('right') : '';
  const isArrowCircle = args.variant === 'arrow-circle';
  // arrow-circle always wraps its icon in a 16×16 centered box to
  // match live Testimonials markup.
  const inner = isArrowCircle
    ? `<div class="flex h-4 w-4 items-center justify-center">${ARROW(args.arrow === 'left' ? 'left' : 'right')}</div>`
    : `${left}${args.label ? `<span>${args.label}</span>` : ''}${right}`;

  return `
    <div style="background:${backdropBg[args.backdrop]}; padding:48px; display:flex; align-items:center; justify-content:center;">
      <button type="button" class="${classes}" aria-label="${args.label || 'Arrow button'}">
        ${inner}
      </button>
    </div>`;
};

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'submit-dark', 'submit-gold', 'arrow-circle', 'outline-pill'],
      description:
        "Matches the Astro prop. primary = Hero/WorkGrid gold CTA. secondary = Services dark+gold-border CTA. submit-dark / submit-gold = ContactForm. arrow-circle = Testimonials prev/next. outline-pill = WorkTile DIVE IN overlay.",
    },
    arrow: {
      control: { type: 'inline-radio' },
      options: ['none', 'right', 'left'],
      description: 'Trailing / leading arrow. arrow-circle forces one (direction follows this prop).',
    },
    label: { control: 'text' },
    backdrop: {
      control: { type: 'inline-radio' },
      options: ['dark', 'light', 'yellow', 'hero'],
      description: 'Backdrop color for readability only — not part of the component API.',
    },
  },
  args: {
    variant: 'primary',
    arrow: 'none',
    label: 'Dive into my work',
    backdrop: 'dark',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All button variants used across the site. Variants mirror the inline markup each section currently ships with; classes are identical so the component can be swapped in later without visual drift.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  name: 'Primary (Hero / WorkGrid CTA)',
  args: { variant: 'primary', arrow: 'none', label: 'Dive into my work', backdrop: 'hero' },
};

export const Secondary: Story = {
  name: 'Secondary (Services CTA)',
  args: { variant: 'secondary', arrow: 'none', label: 'Book a free consultation', backdrop: 'dark' },
};

export const SubmitDark: Story = {
  name: 'Submit · Dark (ContactForm default — yellow footer)',
  args: { variant: 'submit-dark', arrow: 'right', label: 'Send it', backdrop: 'yellow' },
};

export const SubmitGold: Story = {
  name: 'Submit · Gold (ContactForm dark variant — case-study footer)',
  args: { variant: 'submit-gold', arrow: 'right', label: 'Send it', backdrop: 'dark' },
};

export const ArrowCircleRight: Story = {
  name: 'Arrow Circle · Right (Testimonials next)',
  args: { variant: 'arrow-circle', arrow: 'right', label: '', backdrop: 'hero' },
};

export const ArrowCircleLeft: Story = {
  name: 'Arrow Circle · Left (Testimonials prev)',
  args: { variant: 'arrow-circle', arrow: 'left', label: '', backdrop: 'hero' },
};

export const OutlinePill: Story = {
  name: 'Outline Pill (WorkTile DIVE IN overlay)',
  args: { variant: 'outline-pill', arrow: 'none', label: 'DIVE IN', backdrop: 'hero' },
};
