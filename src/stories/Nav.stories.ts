// Nav — visual parity replica of src/components/layout/Nav.astro.
// Source uses a `variant` prop ('dark' | 'light') that flips text,
// hamburger bars, and divider colors. Matches live Webflow:
//   • dark  → absolute transparent, fixed #171717 bg, white text/bars
//   • light → absolute transparent, fixed white bg, black text/bars
//            (.navbar_fixed.white)
// Stories here render the absolute + fixed variants at both themes on
// the appropriate backdrop so reviewers can see readability.
import type { Meta, StoryObj } from '@storybook/html';

interface NavArgs {
  state: 'absolute' | 'fixed';
  variant: 'dark' | 'light';
}

const NAV_LINKS = ['Services', 'My work', 'About me', 'Contact me'] as const;
const LOGO = `
  <svg viewBox="0 0 48 48" width="42" height="42" style="flex-shrink:0">
    <rect x="3" y="3" width="14" height="42" fill="#d1a451" />
    <rect x="20" y="3" width="14" height="42" fill="#d1a451" />
    <rect x="37" y="3" width="8" height="42" fill="#d1a451" />
  </svg>`;

const MAIL_ICON = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M1.59 4.5C1.59 4.22 1.82 4 2.09 4h15.81c.28 0 .5.22.5.5v11.01c0 .28-.22.5-.5.5H2.09c-.28 0-.5-.22-.5-.5V4.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M2.2 6.25L10 11.2l7.8-4.95" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const LINKEDIN = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M0 2.79C0 1.98.27 1.31.81.79 1.35.26 2.05 0 2.92 0c.85 0 1.54.26 2.06.78.54.53.81 1.23.81 2.09 0 .78-.26 1.42-.79 1.94-.54.53-1.25.8-2.13.8h-.02c-.85 0-1.54-.27-2.06-.8C.26 4.27 0 3.6 0 2.79ZM.3 24V7.81h5.14V24H.3ZM8.29 24h5.14v-9.04c0-.57.06-1 .19-1.31.21-.55.54-1.01.98-1.4.44-.38.99-.57 1.66-.57 1.73 0 2.6 1.22 2.6 3.66V24H24v-9.29c0-2.39-.54-4.2-1.62-5.44-1.08-1.24-2.51-1.86-4.29-1.86-2 0-3.55.9-4.66 2.7v.04h-.02l.02-.04V7.81H8.29c.03.52.05 2.13.05 4.83 0 2.7-.02 6.49-.05 11.37Z"/>
  </svg>`;

const render = (args: NavArgs): string => {
  const isLight = args.variant === 'light';
  const textClass = isLight ? 'text-black' : 'text-white';
  const bars = isLight ? 'bg-black' : 'bg-white';
  const divider = isLight ? 'bg-black/40' : 'bg-white/40';
  const fixedBg = isLight ? 'bg-white' : 'bg-bg';

  // Simulated backdrop so each nav state is shown against a realistic
  // background the visitor would actually see.
  const backdrop =
    args.state === 'absolute'
      ? isLight
        ? '#e7e5e4' // case-study page body (white-body → gray-ish paper)
        : '#2a1d3a' // dark hero image area
      : isLight
        ? '#ffffff' // fixed-white on scroll over white body
        : '#171717'; // home fixed nav on dark

  const navPadding = args.state === 'fixed' ? 'py-[0.5rem]' : 'py-[1rem]';
  const navBg = args.state === 'fixed' ? fixedBg : 'bg-transparent';

  const linksHtml = NAV_LINKS.map(
    (label) => `
      <li>
        <a href="#" class="nav-link whitespace-nowrap">${label}</a>
      </li>`,
  ).join('');

  return `
    <div style="background:${backdrop}; padding:0; min-height:80px;">
      <nav class="relative ${navBg} px-[5%] ${navPadding}">
        <div class="flex items-center justify-between">
          ${LOGO}
          <div class="hidden md:flex items-center gap-0">
            <ul class="flex items-center gap-large font-body ${textClass}">
              ${linksHtml}
            </ul>
            <div class="mx-large h-4 w-px ${divider} hidden lg:block"></div>
            <a href="#" class="hidden lg:inline-flex items-center gap-[0.375rem] ${textClass} hover:opacity-70">
              ${MAIL_ICON}
              <span class="font-body text-sm">boojor.orly@gmail.com</span>
            </a>
            <div class="mx-medium h-4 w-px ${divider} hidden lg:block"></div>
            <a href="#" class="hidden lg:inline-flex ${textClass}">${LINKEDIN}</a>
          </div>
          <button class="md:hidden ${textClass}" aria-label="Open menu">
            <span class="block w-6 h-0.5 ${bars} mb-1"></span>
            <span class="block w-6 h-0.5 ${bars} mb-1"></span>
            <span class="block w-6 h-0.5 ${bars}"></span>
          </button>
        </div>
      </nav>
    </div>`;
};

const meta: Meta<NavArgs> = {
  title: 'Components/Nav',
  tags: ['autodocs'],
  render,
  argTypes: {
    state: {
      control: { type: 'inline-radio' },
      options: ['absolute', 'fixed'],
      description:
        'Absolute = top-of-page transparent overlay. Fixed = sticky nav that slides in after the sentinel scrolls out of view.',
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['dark', 'light'],
      description:
        "Matches the Astro prop. Dark = home (fixed has #171717 bg, white text). Light = case-study pages (fixed gets live's `.navbar_fixed.white`: white bg, black text).",
    },
  },
  args: { state: 'absolute', variant: 'dark' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Responsive nav with two positioning states (absolute/fixed) × two color variants (dark/light). Backdrop in each story simulates the bg that sits behind the nav in that state so contrast is visible at a glance.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<NavArgs>;

export const AbsoluteDark: Story = {
  name: 'Absolute · Dark (home hero)',
  args: { state: 'absolute', variant: 'dark' },
};

export const AbsoluteLight: Story = {
  name: 'Absolute · Light (case-study over white body)',
  args: { state: 'absolute', variant: 'light' },
};

export const FixedDark: Story = {
  name: 'Fixed · Dark (home on scroll)',
  args: { state: 'fixed', variant: 'dark' },
};

export const FixedLight: Story = {
  name: 'Fixed · Light (case-study on scroll — .navbar_fixed.white)',
  args: { state: 'fixed', variant: 'light' },
};
