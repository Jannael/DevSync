---
name: devsync-portfolio
description: Create portfolios using Devsync template with automated CV, GitHub, LinkedIn, and academics generation
---

# Devsync Portfolio Creation Skill

## Purpose
Create and maintain developer portfolios using the Devsync template system. This skill guides you through building portfolios where all content comes from `DEVSYNC.json` - never hardcode text in templates.

## Core Principle: Zero Hardcoded Text
All UI text must use `translations[lang]['key']` from `@devsync/src/devsync/fields-translations.ts`. Never write `<h3>Projects</h3>` - use `<h3>{translations[lang]['Projects']}</h3>`.

## Template Framework
Templates are framework-agnostic. The developer chooses their own stack 
(Astro, Next.js, SvelteKit, Vue, vanilla HTML, etc.).

When generating a template, always ask:
- Which framework?

Infer multilingual support directly unless user specifies otherwise.

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

### DEVSYNC.json Example
```json
{
  "defaultLang": "en",
  "site": "https://devsync.work",
  "name": "Your Full Name",
  "img": "https://your-image-url.com/your-image.jpg",
  "socialMedia": [
    {
      "name": "LinkedIn",
      "url": "https://www.linkedin.com/in/your-linkedin-handle",
      "icon": "/icons/linkedin.svg",
      "mdBadge": "![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)"
    }
  ],
  "githubUserName": "your-github-username",
  "en": {
    "description": "Write a short professional summary about yourself. Example: Full-stack developer focused on developer experience, performance, and product quality.",
    "jobTitle": "Your Current Job Title",
    "status": {
      "status": "your-status",
      "badge": "![Status](https://img.shields.io/badge/Status-Your%20Status-blue)"
    },
    "languages": [
      {
        "name": "Your Language 1 / Your Language 2",
        "mdBadge": "![Languages](https://img.shields.io/badge/Languages-Your%20Languages-1f6feb)",
        "icon": "https://cdn.simpleicons.org/googletranslate"
      }
    ],
    "experience": [
      {
        "company": "Your Company Name",
        "position": "Your Position Title",
        "img": "https://your-image-url.com/company-image.jpg",
        "web": "https://your-company-website.com",
        "description": "Describe your role and impact in one concise sentence.",
        "date": "MM/YY - Present",
        "links": [
          {
            "name": "Company Website",
            "url": "https://your-company-website.com",
            "mdBadge": "![Company](https://img.shields.io/badge/Company-Website-0ea5e9)",
            "icon": "https://cdn.simpleicons.org/googlechrome"
          }
        ],
        "list": {
          "title": "key-achievements",
          "items": [
            {
              "highlight": "Achievement headline",
              "description": "Describe one measurable result you delivered (performance, revenue, growth, reliability, etc.)."
            }
          ]
        },
        "skills": [
          {
            "name": "Your Key Skill",
            "mdBadge": "![Skill](https://img.shields.io/badge/Skill-Your%20Skill-339933)",
            "icon": "https://cdn.simpleicons.org/codeforces"
          }
        ]
      }
    ],
    "projects": [
      {
        "name": "Your Project Name",
        "img": "https://your-image-url.com/project-image.jpg",
        "web": "https://your-project-url.com",
        "links": [
          {
            "name": "GitHub",
            "url": "https://github.com/your-github-username/your-project-repo",
            "mdBadge": "![GitHub Repo](https://img.shields.io/badge/Repo-GitHub-181717?logo=github&logoColor=white)",
            "icon": "/icons/github.svg"
          }
        ],
        "description": "Describe what the project does and why it matters.",
        "list": {
          "title": "project-highlights",
          "items": [
            {
              "highlight": "Technical highlight",
              "description": "Describe one concrete technical decision or outcome from this project."
            }
          ]
        },
        "skills": [
          {
            "name": "Project Skill",
            "mdBadge": "![Skill](https://img.shields.io/badge/Skill-Project%20Skill-61DAFB)",
            "icon": "https://cdn.simpleicons.org/git"
          }
        ]
      }
    ],
    "education": [
      {
        "name": "Your University or Institution",
        "degree": "Your Degree / Program",
        "img": "https://your-image-url.com/education-image.jpg",
        "date": "MM/YY - MM/YY",
        "links": [
          {
            "name": "Program URL",
            "url": "https://your-program-link.com",
            "mdBadge": "![Program](https://img.shields.io/badge/Program-Details-b45309)",
            "icon": "https://cdn.simpleicons.org/googlechrome"
          }
        ],
        "list": {
          "title": "education-highlights",
          "items": [
            {
              "highlight": "Academic highlight",
              "description": "Describe a relevant course, thesis, capstone, or achievement."
            }
          ]
        }
      }
    ],
    "certifications": [
      {
        "name": "Your Certification Name",
        "url": "https://your-certification-url.com",
        "list": {
          "title": "what-this-validates",
          "items": [
            {
              "highlight": "Validated area",
              "description": "Describe what this certification validates for your profile."
            }
          ]
        },
        "skills": [
          {
            "name": "Certification Skill",
            "mdBadge": "![Certification Skill](https://img.shields.io/badge/Skill-Certification-232F3E)",
            "icon": "https://cdn.simpleicons.org/coursera"
          }
        ]
      }
    ]
  }
}
```

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

### Adding New Translation Keys

When a template needs UI text not covered by existing keys, add it to `src/devsync/fields-translations.ts` in **all 8 languages**:

1. **Identify the key name** — use a descriptive English string (e.g. `'Open to work'`)
2. **Add to every language block**:

```typescript
// fields-translations.ts
export const translations = {
  en: {
    // ... existing keys
    'Open to work': 'Open to work',   // ← add here
  },
  es: {
    // ... existing keys
    'Open to work': 'Disponible para trabajar',
  },
  fr: {
    'Open to work': 'Disponible',
  },
  // ... repeat for pt, de, zh, ja, ko
} as const
```

3. **Use in template** via `translations[lang]['Open to work']`

> **Never** use the key string as literal UI text — always go through `translations[lang]`. Missing a language will cause a TypeScript type error, which is the intended safety net.

## GitHub Actions Automation

`.github/workflows/update-on-devsync-change.yml` triggers on `DEVSYNC.json` pushes:
```yaml
- run: bunx devsync build  # Updates CV, README, LinkedIn, academics
- uses: git-auto-commit-action  # Commits changes
```

## Validation

1. **Test build**: Run `bunx devsync build` to generate artifacts
2. **Verify outputs**:
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

## Template Folder Structure

Required structure for a Devsync portfolio template:

```
your-template/
├── public/
│   ├── poster-light-mode.webp    # Light theme preview (600x315px)
│   ├── poster-dark-mode.webp     # Dark theme preview (600x315px)
│   └── icons/                    # Optional custom icons (linkedin.svg, github.svg, etc.)
├── src/
│   └── devsync/                  # Copy from @devsync/src/devsync/
│       ├── devsync.ts
│       ├── devsync-validator.ts
│       └── fields-translations.ts
├── .github/
│   └── workflows/
│       └── update-on-devsync-change.yml
├── DEVSYNC.json
└── package.json
```

**Required files**:
- `public/poster-*.webp` - Preview images for template gallery
- `src/devsync/` - Core Devsync modules for translations and validation
- `.github/workflows/update-on-devsync-change.yml` - Auto-update workflow
- `DEVSYNC.json` - Configuration template
- `package.json` - With `devsync.pathToCompiledCV` and `devsync.poster` config

**Optional**:
- `public/icons/` - Custom icon SVGs referenced in `socialMedia[].icon` and `links[].icon`

## Publishing Templates

When publishing your Devsync template, include poster images for preview:

```json
{
  "name": "@your-username/devsync-template",
  "devsync": {
    "pathToCompiledCV": "src/[lang]/cv.html"
  }
}
```

**Poster images** (required for template preview):
- `public/poster-light-mode.webp` - Light theme preview (recommended: 600x315px)
- `public/poster-dark-mode.webp` - Dark theme preview (recommended: 600x315px)

If posters are not provided, the default Devsync posters will be shown.

## Best Practices

1. **Never hardcode** - Always use translation keys
2. **Optional sections** - Omit experience/projects/education if not needed
3. **Badge consistency** - Use shields.io for consistent badge styling
4. **Icon paths** - Use `/icons/` for local, CDN URLs for external
5. **Date format** - Use `MM/YY - Present` or `MM/YY - MM/YY`
6. **Skills reuse** - Same skill can appear across experience, projects, certifications
7. **Template publishing** - Include both poster images for gallery preview
