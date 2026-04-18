# Orly Portfolio - Design System Documentation

This folder `src/stories/` contains the interactive design system documentation built with **Storybook**. It acts strictly as a documentation layer for the UI primitives used in the Orly Portfolio rebuilding project.

## Core Philosophy

Consistent with the rule of maintaining a **1:1 visual parity rebuild** to the exported Webflow static site, this documentation layer **does not modify any source code** in the `src/` directory (including components or `global.css`). 

Storybook runs in total isolation. Its job is to ingest the `--color-*` tokens, spacing mappings, and typography choices defined within `src/styles/global.css` and display them visually without altering their implementation in the shipped project.

## Files
- **`Colors.mdx`**: Visually maps out the full set of fallback colors and accent palettes located in tailwind `@theme` configuration.
- **`Typography.mdx`**: Details Adobe Typekit `Neue Haas Grotesk` font behavior including heading responsivity and font-weights.
- **`Spacing.mdx`**: Exposes the *Finsweet Client-First* scaling tables for spacing, max-width containers, and section paddings.

## How to use Storybook

To spin up the interactive documentation, run the following command from the root `orly-portfolio/` directory:

```bash
npm run storybook
```

This will automatically open a local web server (usually on port 6006) displaying the interactive boards.

### Simulating Light and Dark Themes
Currently, the codebase exclusively loads a dark background (`--color-bg: #171717`) universally in `global.css`. To safely simulate the Design System in a **Light Theme** context without breaking the parity rule, a custom decorator resides inside `.storybook/preview.ts`.

It behaves as follows:
1. In the Storybook UI, go to the top toolbar of any open story.
2. Click the **Backgrounds** icon (Looks like an image/frame: 🖼️).
3. Toggle between `Dark` (`#171717`) and `Light` (`#f5f5f4`).
4. Our custom decorator will automatically detect when the `Light` background is selected and dynamically force text color inversion so the documentation remains readable.

## Configuration Paths
If you need to adjust storybook, refer to:
- `.storybook/main.ts`: Imports the `@tailwindcss/vite` plugin so Tailwind directives work inside `.mdx` files.
- `.storybook/preview.ts`: Imports the `global.css` and sets up Light/Dark global wrappers.
