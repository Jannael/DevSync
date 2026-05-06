---
name: devsync-portfolio
description: Create portfolios using Devsync template with automated CV, GitHub, LinkedIn, and academics generation
---

# Devsync Portfolio Creation Skill

## Purpose
Create and maintain developer portfolios using the Devsync template system. This skill guides you through building portfolios where all content comes from `DEVSYNC.json` - never hardcode text in templates.

## Core Principle: Zero Hardcoded Text
All UI text must use `translations[lang]['key']` from `@devsync/src/devsync/fields-translations.ts`. Never write `<h3>Projects</h3>` - use `<h3>{translations[lang]['Projects']}</h3>`.

## DEVSYNC.json Structure

### Global Fields (required, language-agnostic)
```json
{
  "defaultLang": "en",
  "site": "https://your-site.com",
  "name": "Your Name",
  "img": "https://image-url.com/photo.jpg",
  "socialMedia": [{ "name": "LinkedIn", "url": "...", "icon": "...", "mdBadge": "..." }],
  "githubUserName": "your-username"
}
```

### Language-Specific Sections (optional arrays)
Each language code (`en`, `es`, `fr`, etc.) contains:
- `jobTitle`, `description`: Professional summary
- `status`: `{ status: "Open to Work", badge: "badge-url" }`
- `languages`: Array of language badges
- `experience[]`: Work history with company, position, description, date, links[], list{title, items[]}, skills[]
- `projects[]`: Portfolio projects with name, description, web, links[], list{title, items[]}, skills[]
- `education[]`: Education entries with name, degree, date, links[], list{title, items[]}
- `certifications[]`: Certifications with name, url, list{title, items[]}, skills[]

**Key flexibility**: Any section can be omitted - if `experience` is missing, it simply won't appear in CV. Portfolio can add custom fields beyond CV requirements.

## package.json Configuration

```json
{
  "devsync": {
    "pathToCompiledCV": "src/[lang]/cv.html"
  }
}
```

**Important**: `[lang]` is a placeholder. The `devsync build` command iterates through available languages and replaces `[lang]` with each language code. If your portfolio is monolingual, the replacement still occurs but only one iteration happens.

## How 'devsync build' Works

The CLI command (`bunx devsync build`) executes:

1. **Installs dependencies** → `bun install`
2. **Builds project** → `bun run build`
3. **Extract languages** → Reads `DEVSYNC.json`, filters out global fields to get language codes
4. **For each language**:
   - Builds CV HTML → Gets path from `package.json`, replaces `[lang]`, fetches HTML, generates PDF
   - Creates LinkedIn markdown → Generates `linkedin-{lang}.md` with professional summary
5. **Once **(using defaultLang):
   - Creates GitHub README → Combines experience + projects into `README.md`
   - Creates academics file → Education + certifications in `academics/README.md`

## Translation System

### Current Keys (fields-translations.ts)
Available in 8 languages (en, es, fr, pt, de, zh, ja, ko):
- `Description`, `jobTitle`, `Status`, `Languages`
- `Professional Experience`, `Projects`, `Education`, `Certifications`
- `Core Skills`, `credential`, `academics`
- `View Certificate`, `Selected projects`, `Let's connect`, `Github Profile`, `I am`, `Links`

**Extensible**: Add new keys as needed for portfolio-specific UI text.

## GitHub Actions Automation

`.github/workflows/update-on-devsync-change.yml` triggers on `DEVSYNC.json` pushes:
```yaml
- run: bunx devsync build  # Updates CV, README, LinkedIn, academics
- uses: git-auto-commit-action  # Commits changes
```

## Creating a Portfolio: Step-by-Step

1. **Initialize from template**: `bunx devsync init`
2. **Configure DEVSYNC.json**: Fill global fields, add language sections
3. **Set package.json**: Update `devsync.pathToCompiledCV` with your build output path
4. **Build your portfolio**: Use your framework, import translations from `fields-translations.ts`
5. **Test build**: Run `bunx devsync build` to generate artifacts
6. **Verify outputs**:
   - `cv/{lang}.pdf` - PDF CV
   - `README.md` - GitHub profile
   - `linkedin/{lang}.md` - LinkedIn copy
   - `academics/README.md` - Academic history

## Validation Schema

Zod schema in `src/devsync/devsync-validator.ts` validates:
- Required fields per section
- Array structures (links, skills, list items)
- Type safety for all DEVSYNC.json entries

Use `parseDevsync(devsync)` from `@devsync/src/devsync/devsync.ts` for validation.

## Available Exports (devsync.ts)
```typescript
import devsync, { devsyncGlobalFields, languages, defaultLang, parseDevsync } from '@devsync/src/devsync/devsync'
```

## Best Practices

1. **Never hardcode** - Always use translation keys
2. **Optional sections** - Omit experience/projects/education if not needed
3. **Badge consistency** - Use shields.io for consistent badge styling
4. **Icon paths** - Use `/icons/` for local, CDN URLs for external
5. **Date format** - Use `MM/YY - Present` or `MM/YY - MM/YY`
6. **Skills reuse** - Same skill can appear across experience, projects, certifications
