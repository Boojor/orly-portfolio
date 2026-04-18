// WorkTile — visual parity replica of src/components/home/WorkTile.astro.
// Classes match the Astro component exactly; source file is not modified.
// The `.work-tile` class carries responsive aspect/size rules from
// global.css @layer utilities (square at ≤991px, auto+min-h-30rem at ≥992px).
import type { Meta, StoryObj } from '@storybook/html';

interface WorkTileArgs {
  href: string;
  alt: string;
  thumbnail: string;
  duplicateOverlay: boolean;
  forceHover: boolean;
}

const sampleThumb =
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&auto=format&fit=crop';

const render = (args: WorkTileArgs): string => {
  const hoverClass = args.forceHover ? 'opacity-100' : 'opacity-0';
  const overlay = `
    <div class="absolute inset-0 flex items-center justify-center bg-bg/70 ${hoverClass} transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
      <div class="rounded-full border border-white px-xlarge py-small font-heading text-xl text-white md:text-2xl">
        DIVE IN
      </div>
    </div>`;
  return `
    <div style="max-width: 640px; padding: 24px;">
      <a
        href="${args.href}"
        class="work-tile group relative block w-full overflow-hidden rounded-2xl"
      >
        <img
          src="${args.thumbnail}"
          alt="${args.alt}"
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover"
        />
        ${overlay}
        ${args.duplicateOverlay ? overlay : ''}
      </a>
    </div>`;
};

const meta: Meta<WorkTileArgs> = {
  title: 'Components/WorkTile',
  tags: ['autodocs'],
  render,
  argTypes: {
    href: { control: 'text', description: 'Link target.' },
    alt: { control: 'text', description: 'Image alt text.' },
    thumbnail: { control: 'text', description: 'Image URL.' },
    duplicateOverlay: {
      control: 'boolean',
      description:
        'Ports a live Webflow authoring accident on the first "#" tile — two overlay blocks stacked. Leave off unless you need that specific tile.',
    },
    forceHover: {
      control: 'boolean',
      description: 'Force the DIVE IN overlay visible for review (no real hover needed).',
    },
  },
  args: {
    href: '/my-work/cinch-logistics',
    alt: 'Case study thumbnail',
    thumbnail: sampleThumb,
    duplicateOverlay: false,
    forceHover: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Grid tile used in `WorkGrid`. Square at mobile/tablet, min-height-driven landscape at desktop (≥992). Hover reveals the DIVE IN overlay via `group-hover`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<WorkTileArgs>;

export const Default: Story = {};

export const Hovered: Story = {
  args: { forceHover: true },
  parameters: {
    docs: {
      description: {
        story: 'Overlay forced visible to review the DIVE IN pill without triggering hover.',
      },
    },
  },
};

export const DuplicateOverlay: Story = {
  args: { duplicateOverlay: true, forceHover: true },
  parameters: {
    docs: {
      description: {
        story:
          'Ports the live site\'s first `href="#"` tile which accidentally contains two stacked overlay blocks. Preserved verbatim per the no-invention rule.',
      },
    },
  },
};
