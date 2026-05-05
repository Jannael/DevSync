# AGENTS.md - Devsync Codebase Guide

## Project Overview

Devsync is a CLI tool for syncing portfolio/CV across GitHub, LinkedIn, and PDF outputs. Built with Bun + TypeScript.

## Commands

```bash
# Install dependencies
bun install

# Build CLI (outputs to dist/index.js)
bun run build

# Lint (oxlint - quiet mode, ignores .js files)
bun run lint

# Auto-fix lint issues
bun run lint:fix

# Format code (prettier)
bun run fmt

# Check formatting without fixing
bun run fmt:check

# Run all tests
bun test

# Run single test file
bun test test/cli/shared/infra/write-file.test.ts
bun test --run test/cli/utils/run-bun-command.test.ts  # alternative syntax

# Run tests matching pattern
bun test --run -t "writeFileMixin"
```

## Code Style

### General

- No comments unless explaining complex logic
- Prefer named exports where practical
- Default exports for classes used with `import type`

### Formatting (Prettier)

- Single quotes: `true`
- Semicolons: `false`
- Trailing commas: `es5`
- Print width: `100`
- Tab width: `2` spaces, no tabs

### Linting (oxlint)

- Uses TypeScript, Unicorn, and OXC plugins
- Correctness rules set to `error`
- Environment: `builtin` (Node.js)

### TypeScript

- Strict mode enabled
- `moduleResolution: bundler`
- `verbatimModuleSyntax: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- Path aliases:
  - `@/*` → `apps/cli/*`
  - `@devsync/*` → `apps/devsync/*`

### Imports

- Use path aliases: `import { X } from '@/utils/icons-terminal'`
- Node.js builtins: `import { spawn } from 'node:child_process'`
- Type imports: `import type { CloneRepositoryUseCase } from './...'` (when not used at runtime)

### File Naming

- TypeScript files: `kebab-case.ts` or `camelCase.ts` based on content
- Classes: `PascalCase.ts`
- Test files: `*.test.ts`

### Architecture Pattern

```
modules/    - Feature modules (init, build, create-template)
  app/      - Use cases with execute() methods
  domain/   - Business logic interfaces
  infra/    - External integrations (git, file system)

shared/
  app/      - Shared application logic
  infra/    - Shared infrastructure (write-file, read-file, etc.)

error/      - Error types using discriminated unions
utils/      - Pure utility functions
```

### Error Handling

- Use custom error classes from `@/error/error-instance`
- Discriminated union types for error messages
- Wrap errors with descriptive context using second arg to constructors
- Use `errorHandler()` in CLI entry points to exit with proper messaging

### Error Pattern

```typescript
type IServerError = 'Failed to read file' | 'Failed to write file'
export const ServerError = CreateError<IServerError>('ServerError')

// Usage in infrastructure code:
try {
  await fs.writeFile(path, data)
} catch {
  throw new ServerError('Failed to write file', 'Check permissions...')
}
```

### Mixin Pattern

For shared infrastructure methods on classes:

```typescript
export function writeFileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async writeFile({ path, data }: { path: string; data: string }) {
      // implementation
    }
  }
}
```

### Class Structure

```typescript
class BaseInitCommand {}

class InitCommand extends BaseInitCommand {
  constructor(private readonly cloneRepository: CloneRepositoryUseCase) {
    super()
  }

  async execute(): Promise<void> {
    // implementation
  }
}
```

## Testing

- Framework: Vitest with Node environment
- Test files: `*.test.ts` in `test/` mirroring `apps/cli/` structure
- Mock with `vi.mock()` and `vi.mocked()`
- Use `beforeEach` with `vi.clearAllMocks()`
- Helper: `createChildMock()` for EventEmitter mocks

## Directories

```
apps/cli/          - Main CLI entry, commands, modules
apps/devsync/      - Template package (zod-based validation)
test/cli/          - Tests mirroring apps/cli structure
dist/              - Build output
```
