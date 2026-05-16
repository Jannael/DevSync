# Devsync Template

A professional template for generating developer profiles, and portfolios using [Devsync](https://devsync.work).

## Usage

Initialize a new project with this template:

```bash
bunx @jannael/devsync init --template @owner/repo-name
```

Replace `@owner/repo-name` with the GitHub repository where this template is published.

## Template Structure

```
.
├── DEVSYNC.json          # Main configuration file with your profile data
├── package.json          # Project dependencies
├── src/
│   └── devsync/         # Custom Devsync components and logic
├── public/              # Static assets (images, icons)
│   ├── poster-light-mode.webp
│   └── poster-dark-mode.webp
├── .github/
│   └── workflows/       # GitHub Actions for automation
└── .agents/
    └── skills/          # AI agent skills and configurations
```

## Configuration

Edit `DEVSYNC.json` to customize your profile:

- **Personal info**: name, image, social media links
- **Professional data**: job title, description, status
- **Experience**: work history with achievements
- **Projects**: portfolio items with links and descriptions
- **Skills**: technologies and tools you use
- **Languages**: spoken languages

The file supports multiple languages (default: English and Spanish).

## Publishing Your Template

Share your customized template with the community:

1. Publish it on [devsync.work](https://devsync.work)

## Support the Project

If you find Devsync useful, give it a star on GitHub:

⭐ [github.com/jannael/devsync](https://github.com/jannael/devsync)

---

Built with [Devsync](https://devsync.work) — Focus on what you do best.
