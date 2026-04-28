# AGENTS.md - Devsync Codebase Guide

## Build, Lint, and Test Commands

```bash
bun install        # Install dependencies
bun run lint       # Lint CLI code (ignores .js files)
bun run lint:fix   # Auto-fix lint issues
bun run fmt        # Format code
bun run fmt:check  # Check formatting
bun run build      # Build CLI bundle -> dist/index.js
```

**Template app** (run in `apps/template`):

```bash
bun run dev     # Dev server
bun run build   # Static site build
bun run preview # Preview build
```

**Note**: No automated test suite configured yet.

---

## Code Style

### Formatter (oxfmt) - `.oxfmtrc.json`
- **Single quotes**: `true` (use `'` not `"`)
- **Semicolons**: `false` (no trailing semicolons)
- **Ignore patterns**: `*.js`

### Linter (oxlint) - `.oxlintrc.json`
- **Plugins**: `typescript`, `unicorn`, `oxc`
- **Category**: `correctness` set to `error`
- **Env**: `builtin` enabled (Node.js globals)

### TypeScript (tsconfig.json)
- `strict: true`, `noImplicitOverride: true`, `noUncheckedIndexedAccess: true`
- `verbatimModuleSyntax: true` (use `import type` for type-only imports)
- `moduleResolution: bundler`, `module: Preserve`

---

## Path Aliases

```typescript
// CLI code (@ -> apps/cli)
import { GREEN } from '@/utils/colors'

// Template app (@template -> apps/template)
import template from '@template/DEVSYNC.json'
import type { DevsyncPartial } from '@template/src/devsync-validator'
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `error-instance.ts`, `md-utils.ts` |
| Functions/variables | camelCase | `createGithubProfile`, `devsync` |
| Types/Classes | PascalCase | `CreateGithubProfileMixin`, `ServerError` |
| Constants | SCREAMING_SNAKE_CASE | `AVAILABLE_COMMANDS` |
| Error type unions | PascalCase prefix + descriptive | `INotFound`, `IServerError` |

---

## Error Handling Pattern

Use typed literal-union errors via `CreateError<T>('ErrorName')`:

```typescript
import { CreateError } from '@/error/error-constructor'

type INotFound = 'DEVSYNC.json not found' | 'Template DEVSYNC.json not found'
export const NotFound = CreateError<INotFound>('NotFound')

// Usage
throw new NotFound('DEVSYNC.json not found')
```

Error constructors: `apps/cli/error/error-constructor.ts`
Error instances: `apps/cli/error/error-instance.ts`

---

## Architecture

### CLI App (`apps/cli`)
- `index.ts` - Entrypoint
- `commands.ts` - Command declarations
- `commands-fn.ts` - Handler mappings
- `error/` - Typed error definitions
- `modules/<command>/main.ts` - Command implementations (`init`, `build`, `update`)
- `shared/app/` - Business logic mixins
- `shared/infra/` - Infrastructure (file I/O, PDF)
- `utils/` - Helpers (colors, icons, markdown)
- `constants/` - Constants (paths, badges)

### Template App (`apps/template`)
- `src/devsync.ts` - Zod schema validation, typed data export
- `src/pages/cv.astro` - ATS-oriented CV renderer
- `src/pages/index.astro` - Landing page

---

## Terminal Output Style

Use color/icon helpers from `apps/cli/utils/`:

```typescript
import { GREEN, BOLD, RED } from '@/utils/colors'
import { CHECK, SPACE, X } from '@/utils/icons-terminal'

console.log(`${SPACE}${CHECK(`${BOLD('Success')} ${GREEN('message')}`)}`)
console.log(`${SPACE}${X('Error: something went wrong')}`)
```

Available colors: `GREEN`, `YELLOW`, `RED`, `MAGENTA`, `BLUE`, `BOLD`, `BLACK`, `BG_YELLOW`

---

## Adding New Commands

1. Add command metadata to `apps/cli/commands.ts`
2. Add handler mapping in `apps/cli/commands-fn.ts`
3. Implement command module under `apps/cli/modules/<command>/main.ts`

---

## Agent Skills Available

Skills in `.agents/skills/`:

- `typescript-advanced-types` - TypeScript type system mastery
- `oxlint` - Linter configuration and usage
- `tailwind-css-patterns` - Tailwind CSS styling
- `astro` - Astro framework best practices
- `frontend-design` - UI design patterns
- `accessibility` - WCAG 2.2 compliance
- `seo` - Search engine optimization

Use the `skill` tool to load a skill when relevant.

---

## VSCode Setup

```json
{
  "oxc.fmt.configPath": ".oxfmtrc.json",
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true
}
```

---

## Dependencies

- **Runtime**: Bun (`>=1.0.0`) - use Bun for all scripts
- **Template runtime**: Node.js (`>=22.12.0`)
- **Peer dependency**: TypeScript 5
- **Template deps**: Astro 6, Tailwind 4, Zod 3, Puppeteer 24