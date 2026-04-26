# Copilot instructions for Devsync

## Build, lint, and test commands

Run commands from the repository root unless noted.

- Install dependencies: `bun install`
- Lint CLI code: `bun run lint`
- Auto-fix lint issues: `bun run lint:fix`
- Format code: `bun run fmt`
- Check formatting: `bun run fmt:check`
- Build CLI bundle (`dist/index.js`): `bun run build`

Template app commands (run in `apps/template`):

- Dev server: `bun run dev`
- Build static site: `bun run build`
- Preview build: `bun run preview`

Tests:

- There is currently no automated test suite configured in this repository, so there is no single-test command yet.

## High-level architecture

This repository has two main pieces:

1. **CLI app (`apps/cli`)**
   - Entrypoint is `apps/cli/index.ts`.
   - Commands are declared in `apps/cli/commands.ts` and mapped to handlers in `apps/cli/commands-fn.ts`.
   - `init` (`apps/cli/modules/init/main.ts`) writes a starter `DEVSYNC.json` into the current working directory using the template JSON imported via `@template/DEVSYNC.json`.
   - `build` module is currently scaffolded with app/domain layers (`apps/cli/modules/build/app/*`, `apps/cli/modules/build/domain/build-repository.ts`) and documents the intended flow: template copy, CV HTML render, PDF generation, README/LinkedIn output generation.
   - Typed domain errors are centralized in `apps/cli/error/error-instance.ts` using `CreateError` from `apps/cli/error/error-constructor.ts`.

2. **Template Astro app (`apps/template`)**
   - Uses Astro + Tailwind.
   - `apps/template/src/devsync.ts` defines and validates the DEVSYNC schema using Zod, and exports typed data.
   - `apps/template/src/pages/cv.astro` renders an ATS-oriented CV from DEVSYNC data.
   - `apps/template/src/pages/index.astro` is still minimal/scaffolded.

The intended product flow (from module docs and command descriptions): one `DEVSYNC.json` drives generated portfolio/CV/README/LinkedIn artifacts through CLI commands (`init`, `build`, and future update automation via GitHub Actions).

## Key conventions in this codebase

- **Runtime/tooling**: Bun is the primary runtime and script runner.
- **Path aliases (root TS config)**:
  - `@/*` → `apps/cli/*`
  - `@template/*` → `apps/template/*`
- **Template app alias** (`apps/template/tsconfig.json`):
  - `devsync` → `./src/devsync.ts`
- **CLI command wiring pattern**:
  - Add command metadata to `commands.ts`.
  - Add handler mapping in `commands-fn.ts`.
  - Implement command module under `apps/cli/modules/<command>/main.ts`.
- **Terminal output style**:
  - Reuse color/icon helpers in `apps/cli/utils/colors.ts` and `apps/cli/utils/icons-terminal.ts` instead of inline ANSI strings.
- **Error modeling**:
  - Use typed literal-union errors via `CreateError<...>('ErrorName')` in `apps/cli/error/error-instance.ts`.
- **Formatting style** (`.oxfmtrc.json`):
  - Single quotes enabled (`singleQuote: true`)
  - Semicolons disabled (`semi: false`)
