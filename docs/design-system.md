# Design System

This project uses a basic set of CSS variables defined in `src/styles/tokens.css` for colors, typography and spacing. Import `src/styles/global.css` to access the tokens.

## Palette

| Token | Example |
|-------|--------|
| `--color-primary` | ![#2563eb](https://via.placeholder.com/15/2563eb/000000?text=+) |
| `--color-secondary` | ![#6b7280](https://via.placeholder.com/15/6b7280/000000?text=+) |
| `--color-success` | ![#16a34a](https://via.placeholder.com/15/16a34a/000000?text=+) |
| `--color-warning` | ![#d97706](https://via.placeholder.com/15/d97706/000000?text=+) |
| `--color-danger` | ![#dc2626](https://via.placeholder.com/15/dc2626/000000?text=+) |

## Typography

Font sizes are tokenized from `--fs-sm` up to `--fs-3xl` and follow a minor scale.

## Usage

Reference tokens with `var(--token-name)` in CSS or use the Tailwind classes that map to them (e.g. `bg-primary`, `text-danger`, `p-4`).

![Storybook palette](design-system.png)
