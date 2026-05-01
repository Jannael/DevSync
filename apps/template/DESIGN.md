# DESIGN

## Visual direction

The template uses a soft, card-based portfolio UI with rounded corners, high spacing, and clear hierarchy:

- Hero first, then content sections (Experience, Projects).
- Section titles are large (`text-xl` on mobile, `lg:text-5xl` on desktop).
- Content appears in flexible card grids (`flex-wrap`) to support one or multiple items.

## Theme tokens

Theme colors are defined in `src/styles/global.css` using Tailwind CSS custom theme variables:

- `--color-main`
- `--color-second`
- `--color-third`
- `--color-accent`
- `--color-text`

Dark mode is activated by adding the `.dark` class on `html`.

## Reusable content card

`src/components/info-card.astro` is the shared component for Experience and Projects.

### Supported props

- Identity: `company`, `position`, `name`
- Media/meta: `img`, `web`, `date`
- Rich content: `description`, `list`, `skills`, `links`
- Layout behavior: `expand` (used when only one card exists in the section)

### Card conventions

- Card container: `bg-third/50`, rounded corners, internal spacing.
- Chips and links: pill style with `bg-third/70`, border, and hover scale.
- Lists: emphasized `highlight` + plain description text.
- Skills: inline icon + skill name.

## Section composition

- `src/sections/experience.astro` maps `profile.experience` into `<InfoCard />`.
- `src/sections/projects.astro` maps `profile.projects` into `<InfoCard />`.
- Both sections:
  - read localized profile data from `devsync[lang]`
  - guard rendering with `length > 0`
  - set `expand` when a single card is present

## i18n + resilience rules

- Global profile fields stay at root (`name`, `img`, `socialMedia`, etc.).
- Localized fields stay inside locale keys (`en`, `es`, ...).
- Sections must tolerate missing optional fields (`experience`, `projects`, `skills`, `list`, etc.).
- All section labels should use `src/const/fields-translations.ts`.
