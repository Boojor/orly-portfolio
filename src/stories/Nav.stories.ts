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
// Literal copy of src/components/layout/Logo.astro — the Orly lettermark.
// Sizing class picks up `.nav-logo-absolute` / `.nav-logo-sticky` from
// global.css so breakpoint widths match live (42/51/62/66 absolute,
// 30/42/30 sticky).
const logo = (sizeClass: string) => `
  <a href="#" aria-label="Orly Boojor — Home" class="inline-flex items-center ${sizeClass} h-auto shrink-0 text-white">
    <svg viewBox="0 0 66 88" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto">
      <path d="M59.7373 0H6.26267C2.80389 0 0 2.80389 0 6.26267V81.7373C0 85.1961 2.80389 88 6.26267 88H59.7373C63.1961 88 66 85.1961 66 81.7373V6.26267C66 2.80389 63.1961 0 59.7373 0Z" fill="#D1A451"/>
      <path d="M60.0524 80.462C59.9791 80.4253 59.8984 80.3813 59.8984 80.3813C59.3924 80.1247 58.6664 79.9267 58.6664 78.46V38.3687C58.6664 37.4227 57.8964 36.66 56.9577 36.66H51.3331C45.4664 36.66 43.9998 33.7267 43.9998 29.3267V21.9933H56.1951C57.5591 21.9933 58.6664 20.886 58.6664 19.522V9.52667C58.6664 8.06 59.3924 7.862 59.8984 7.60534C59.8984 7.60534 59.9864 7.56134 60.0524 7.52467C60.2577 7.41467 60.1624 7.31934 60.1037 7.31934H52.0884C52.0811 7.31934 52.0737 7.31934 52.0664 7.31934H43.2664C43.2664 7.31934 43.2518 7.31934 43.2444 7.31934H35.2291C35.1704 7.31934 35.0751 7.41467 35.2804 7.52467C35.3538 7.56134 35.4344 7.60534 35.4344 7.60534C35.9404 7.862 36.6664 8.06 36.6664 9.52667V78.1887C36.6664 79.5527 37.7738 80.66 39.1378 80.66H43.2077C43.2077 80.66 43.2444 80.6527 43.2664 80.6453V80.66H60.1037C60.1624 80.66 60.2577 80.5647 60.0524 80.4547V80.462ZM51.3404 8.06734C51.3404 8.06734 51.3404 8.082 51.3404 8.08934V8.06734ZM50.5998 8.06734C51.0397 8.06734 51.3331 8.214 51.3331 8.80067V19.0673C51.3331 20.3873 50.8931 21.2673 49.1331 21.2673C44.2124 21.2673 44.0071 18.7153 43.9998 14.8067V8.80067C43.9998 8.214 44.2931 8.06734 44.7331 8.06734H50.5998ZM43.9998 8.08934C43.9998 8.08934 43.9998 8.07467 43.9998 8.06734V8.08934ZM43.9851 79.934C43.9851 79.934 43.9998 79.8973 43.9998 79.8753V79.934H43.9851ZM44.7331 79.934C44.2931 79.934 43.9998 79.7873 43.9998 79.2007V36.6673C49.8664 36.6673 51.3331 39.6007 51.3331 44.0007V79.2007C51.3331 79.7873 51.0397 79.934 50.5998 79.934H44.7331Z" fill="white"/>
      <path d="M26.341 7.33366H14.6663C14.417 7.33366 14.175 7.34099 13.933 7.35566C10.2297 7.61233 7.33301 9.84166 7.33301 14.667V77.675C7.33301 79.325 8.67501 80.667 10.325 80.667H21.9997C22.249 80.667 22.491 80.6597 22.733 80.645C26.4363 80.3883 29.333 78.159 29.333 73.3337V10.3257C29.333 8.67566 27.991 7.33366 26.341 7.33366ZM21.9997 75.2257C21.9997 77.1103 21.8823 79.9337 18.817 79.9337H15.825C15.187 79.9337 14.6663 79.413 14.659 78.775V12.775C14.659 10.8903 14.8277 8.06699 17.3063 8.06699H20.841C21.4717 8.06699 21.9923 8.58033 21.9923 9.21099V75.2257H21.9997Z" fill="white"/>
    </svg>
  </a>`;

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

  // Simulated content area BEHIND the nav. For `absolute` this shows
  // through the transparent nav (so the color IS the hero/body bg).
  // For `fixed`, the nav has its own solid bg — the content area must
  // be a DIFFERENT color than the nav so reviewers can see the nav
  // sitting on top (otherwise white nav on white story = invisible).
  const pageBg =
    args.state === 'absolute'
      ? isLight
        ? '#f5f5f4' // case-study white body
        : '#2a1d3a' // dark hero image area
      : isLight
        ? '#e7e5e4' // scrolled page content visible below white fixed nav
        : '#2a2a2a'; // scrolled page content visible below dark fixed nav

  const navPadding = args.state === 'fixed' ? 'py-[0.5rem]' : 'py-[1rem]';
  const navBg = args.state === 'fixed' ? fixedBg : 'bg-transparent';
  const logoSizeClass = args.state === 'fixed' ? 'nav-logo-sticky' : 'nav-logo-absolute';

  const linksHtml = NAV_LINKS.map(
    (label) => `
      <li>
        <a href="#" class="nav-link whitespace-nowrap">${label}</a>
      </li>`,
  ).join('');

  return `
    <div style="background:${pageBg};">
      <nav class="relative ${navBg} px-[5%] ${navPadding}">
        <div class="flex items-center justify-between">
          ${logo(logoSizeClass)}
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
      <!-- Simulated page content area below the nav so reviewers can
           see the nav's height + contrast against realistic content. -->
      <div style="height:320px; display:flex; align-items:center; justify-content:center; font-family:system-ui; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; opacity:0.55; color:${isLight ? '#171717' : '#ffffff'};">
        ${args.state === 'fixed' ? 'page content scrolling under the fixed nav' : 'hero background visible through the absolute nav'}
      </div>
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
