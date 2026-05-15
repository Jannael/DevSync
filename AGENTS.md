# AGENTS.md - Developer Guide

## Quick Commands

| Command | Description |
| ------- | ----------- |
| `bun install` | Install dependencies |
| `bun run build` | Build CLI (outputs to `dist/`) |
| `bun run lint` / `lint:fix` | Oxlint (ignores `*.js`) |
| `bun run fmt` / `fmt:check` | Prettier |
| `bun test` | Vitest (test path mirrors source) |

**Single test:** `bun test test/cli/utils/run-bun-command.test.ts`  
**Web docs:** `cd apps/web && bun dev`

## Project Structure

```
apps/
  cli/          # CLI app (entry: apps/cli/index.ts)
  @core/        # DEVSYNC.json schema + zod validation
  web/          # Astro + Starlight docs
  devsync/      # Core logic
test/cli/       # Tests mirror apps/cli structure
```

## Architecture

- **Mixin pattern**: Infrastructure (readFile, writeFile, createPdf) extends base constructor
- **Error handling**: Custom classes via `CreateError<T>()` factory (`NotFound`, `Forbidden`, `Conflict`, `ServerError`, `BadRequest`)
- **Paths**: `@/*` → `apps/cli/*`, `@devsync/*` → `apps/devsync/*`

## Conventions

- **Files:** kebab-case
- **Functions/Variables:** camelCase
- **Types:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Errors:** PascalCase with suffix (e.g., `ServerError`)
- **Imports:** Type imports for types
- **Formatting:** Single quotes, no semicolons, trailing commas, width 100

## Husky Pre-commit

Runs `lint:fix` + `fmt` on staged `*.{ts,tsx,js,jsx,astro}`

## Gotchas

- Bun runtime (not Node)
- TypeScript `noEmit: true` (bundler workflow)
- Oxlint ignores `*.js` files
- Astro web uses Starlight + Tailwind v4
