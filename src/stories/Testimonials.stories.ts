// Testimonials — visual parity replica of src/components/home/Testimonials.astro.
// The Astro component ships two bgVariants:
//   • image  — home page with footer-image.webp backdrop + dark gradient overlay
//   • purple — case-study pages with solid Purple Jam (#662998) bg
// Responsive card: flex-col at mobile ≤767, flex-row at ≥768.
// Border-radius: 96/96/16/16 at mobile+tablet, 40/96/96/40 at desktop ≥992.
import type { Meta, StoryObj } from '@storybook/html';

interface TestimonialsArgs {
  bgVariant: 'image' | 'purple';
  quote: string;
  name: string;
  role: string;
}

const AVATAR = `
  <svg width="100%" height="100%" viewBox="0 0 152 152" fill="none">
    <circle cx="76" cy="76" r="76" fill="#9d8fc1"/>
    <circle cx="76" cy="60" r="24" fill="#f6f7f8"/>
    <path d="M36 128c0-22 18-40 40-40s40 18 40 40" fill="#f6f7f8"/>
  </svg>`;

const ARROW = (direction: 'left' | 'right') => `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="${direction === 'left' ? 'rotate-180' : ''}">
    <path d="M0.81 8H15.19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M8.48 14.71L15.19 8L8.48 1.29" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

const render = (args: TestimonialsArgs): string => {
  const isPurple = args.bgVariant === 'purple';
  const sectionBg = isPurple ? 'background-color:#662998;' : '';
  // Simulated dark photo backdrop for the 'image' variant so the story
  // shows readable contrast without loading the real asset.
  const imageBg = !isPurple
    ? 'background:linear-gradient(180deg,rgba(23,23,23,.7),rgba(23,23,23,.4) 40%,rgba(23,23,23,.7)),radial-gradient(circle at 30% 30%,#3b2084,#171717);'
    : '';

  return `
    <section class="relative isolate overflow-hidden" style="${sectionBg}${imageBg}">
      <div class="relative z-10 px-[5%] py-section-large">
        <div class="mx-auto max-w-[97.5rem]">
          <div class="flex flex-col gap-medium">
            <div class="flex items-center gap-small">
              <p class="font-body text-xs uppercase tracking-widest text-stone-200">Testimonials</p>
              <div class="h-px flex-1 bg-white/30"></div>
            </div>
            <div class="flex flex-col gap-medium md:flex-row md:items-end md:justify-between md:gap-large">
              <h2 class="font-heading text-[2.25rem] md:text-[2.75rem] xl:text-[3.5rem] leading-[1.15] font-black text-white max-w-site-large">
                What my team has to say
              </h2>
              <div class="flex w-full justify-between gap-[0.5rem] md:w-auto md:justify-start">
                <button type="button" class="inline-flex items-center justify-center rounded-full border border-transparent bg-[#0000001a] px-[2.5rem] py-[1rem] text-white">
                  <div class="flex h-4 w-4 items-center justify-center">${ARROW('left')}</div>
                </button>
                <button type="button" class="inline-flex items-center justify-center rounded-full border border-transparent bg-[#0000001a] px-[2.5rem] py-[1rem] text-white">
                  <div class="flex h-4 w-4 items-center justify-center">${ARROW('right')}</div>
                </button>
              </div>
            </div>
          </div>
          <div class="mt-large md:flex-col md:gap-[2rem]">
            <article class="testimonial-card border border-white h-full">
              <div class="flex-1 flex flex-col gap-[1.5rem]">
                <p class="testimonial-quote font-heading font-light text-white">${args.quote}</p>
                <div class="flex flex-row flex-wrap items-baseline gap-x-[0.375rem] gap-y-[0.25rem]">
                  <p class="font-body text-[0.875rem] font-medium text-white">${args.name}</p>
                  <p class="font-body text-[0.875rem] text-stone-300">${args.role}</p>
                </div>
              </div>
              <div class="shrink-0 rounded-full overflow-hidden w-[6rem] h-[6rem] md:w-[9.5rem] md:h-[9.5rem]">
                ${AVATAR}
              </div>
            </article>
          </div>
        </div>
      </div>
      <style>
        /* Scoped copy of the live .testimonial_card responsive shape —
           flex-col at mobile, flex-row at ≥768, padding + gap scale up,
           asymmetric border-radius flips at ≥992. */
        .testimonial-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 96px 96px 16px 16px;
        }
        @media (min-width: 768px) {
          .testimonial-card { flex-direction: row; align-items: center; gap: 4rem; padding: 3rem; }
        }
        @media (min-width: 992px) {
          .testimonial-card { border-radius: 40px 96px 96px 40px; }
        }
      </style>
    </section>`;
};

const meta: Meta<TestimonialsArgs> = {
  title: 'Components/Testimonials',
  tags: ['autodocs'],
  render,
  argTypes: {
    bgVariant: {
      control: { type: 'inline-radio' },
      options: ['image', 'purple'],
      description:
        "Matches the Astro prop. 'image' = home's footer-image bg with dark gradient. 'purple' = case studies' solid Purple Jam (#662998).",
    },
    quote: { control: 'text' },
    name: { control: 'text' },
    role: { control: 'text' },
  },
  args: {
    bgVariant: 'image',
    quote:
      '“Hiring Orly was one of our best product decisions. She has a unique talent for translating high-level business goals into a user experience that just works.”',
    name: 'Sarah Jenkins',
    role: 'CEO, Kestrel',
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shared testimonials block used on the home page (image bg) and all case studies (purple bg). Card layout: flex-col at mobile, flex-row at ≥768 with 9.5rem avatar. Border-radius: 96/96/16/16 at mobile+tablet, 40/96/96/40 at desktop. Resize the Storybook viewport to review each breakpoint shape.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TestimonialsArgs>;

export const HomeImageBg: Story = {
  name: 'Home (image bg)',
  args: { bgVariant: 'image' },
};

export const CaseStudyPurple: Story = {
  name: 'Case study (purple bg)',
  args: { bgVariant: 'purple' },
};
