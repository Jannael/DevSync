# Design System

## Brand Identity

Devsync's design language reflects its purpose: a developer-first tool that syncs portfolios, resumes, and profiles from a single source. The aesthetic is **terminal-native**, **minimalist**, and **functional**.

## Core Principles

1. **Terminal-First Aesthetic**: All design elements should feel at home in a developer's environment
2. **Subtle Motion**: Animations enhance understanding without distracting from content
3. **Accessible Contrast**: High contrast text with muted decorative elements
4. **Consistent Spacing**: 8px grid system throughout

## ASCII Art System

ASCII art is the primary visual motif, appearing in:

- **Hero logo**: Scramble-reveal animation on page load
- **404 page**: Magnifying glass ASCII art
- **Mouse trail**: Interactive particle effect (`.`, `*`, `+`, `/`, `▓`, `░`)

**Implementation Guidelines:**

- Use green accent color (`--color-accent: #22c55e`)
- Apply `text-shadow` for glow effect: `0 0 10px var(--color-accent)`
- Font: `monospace` only
- Never auto-play sound or cause motion sickness

## Color System

### Brand Colors

| Token               | Light     | Dark      | Usage                                      |
| ------------------- | --------- | --------- | ------------------------------------------ |
| `--color-accent`    | `#22c55e` | `#4ade80` | Primary actions, ASCII art, success states |
| `--color-brand`     | `#111111` | `#f5f5f5` | Brand identity, primary buttons            |
| `--color-secondary` | `#0ea5e9` | `#38bdf8` | Secondary actions, links                   |

### Surfaces

| Token                    | Light     | Dark      | Usage             |
| ------------------------ | --------- | --------- | ----------------- |
| `--color-bg`             | `#ffffff` | `#0a0a0a` | Main background   |
| `--color-surface`        | `#ffffff` | `#141414` | Cards, panels     |
| `--color-surface-raised` | `#fafafa` | `#1a1a1a` | Elevated surfaces |

### Text Hierarchy

| Token                    | Light     | Dark      | Usage           |
| ------------------------ | --------- | --------- | --------------- |
| `--color-text`           | `#111111` | `#f5f5f5` | Primary content |
| `--color-text-secondary` | `#525252` | `#a3a3a3` | Supporting text |
| `--color-text-tertiary`  | `#737373` | `#737373` | Tertiary info   |
| `--color-text-muted`     | `#a3a3a3` | `#525252` | Disabled, hints |

## Typography

| Element    | Font            | Size    | Weight  |
| ---------- | --------------- | ------- | ------- |
| Headings   | Bitter Variable | 4xl–7xl | 800–900 |
| Body       | Bitter Variable | base–xl | 400–500 |
| Code/ASCII | Monospace       | sm–base | 400     |
| UI Labels  | Bitter Variable | sm–base | 600–700 |

## Motion & Interaction

### Entrance Animations

- **Hero section**: Staggered fade-up (0.9s, cubic-bezier)
- **ASCII scramble**: 2 chars per batch, 50ms delay
- **Mouse trail**: Instant spawn, fade-out over ~2s

### Hover States

- **Primary buttons**: Scale 1.05, color shift to hover variant
- **Secondary buttons**: Border accent, text accent
- **Links**: Underline or color shift only

### Reduced Motion

Respect `prefers-reduced-motion`: disable scramble and trail effects.

## Component Patterns

### Buttons

```
Primary:   bg-btn-primary text-btn-primary-foreground hover:scale-105
Secondary: border-border-strong hover:border-accent hover:text-accent
```

### Cards

```
bg-surface border-border-subtle rounded-3xl p-8 shadow-2xl backdrop-blur-md
```

### Gradients

- Hero glow: `radial-gradient(circle, var(--color-accent) 0%, transparent 70%)`
- Opacity: 0.04–0.06 (dark mode slightly higher)

## Layout Conventions

- **Container max-width**: `max-w-4xl` (hero), `max-w-2xl` (content)
- **Section padding**: `px-6 py-24`
- **Grid**: Background grid pattern (32px, radial-gradient)
- **Z-index layers**: 0 (bg), 10 (content), 50 (trail), 9999 (ASCII effects)

## File Structure

```
apps/web/src/
  components/     # Reusable UI (AsciiScramble, MouseASCIITrail)
  layouts/        # layout.astro (global wrapper)
  pages/          # Route definitions
  sections/       # Page sections (Hero, etc.)
  styles/         # global.css (Tailwind + CSS variables)
  i18n/           # en.json, es.json (translation keys = content)
```

## Translation Convention

Translation keys **must match content** for discoverability:

- ✅ `"Synchronization tool for developers": "..."`
- ❌ `"hero.title": "..."`

This allows reading components to understand context without checking translation files.
