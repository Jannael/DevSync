import type { DevsyncPartial } from '@template/src/devsync'
import { readFileMixin } from '@/shared/infra/read-file'
import { ServerError } from '@/error/error-instance'

class baseClass {}

class CreateLinkedinUseCase extends readFileMixin(baseClass) {
  constructor() {
    super()
  }

  async execute() {
    try {
      return await this.getMD()
    } catch {
      throw new ServerError(
        'Failed to parse DEVSYNC.json',
        'Check your DEVSYNC.json follows the right format',
      )
    }
  }

  private getSkills({ devsync }: { devsync: DevsyncPartial }) {
    const skills = new Set<string>()
    for (const ex of devsync.experience ?? []) {
      for (const skill of ex.skills ?? []) {
        skills.add(skill.name)
      }
    }
    for (const project of devsync.projects ?? []) {
      for (const skill of project.skills ?? []) {
        skills.add(skill.name)
      }
    }
    for (const cert of devsync.certifications ?? []) {
      for (const skill of cert.skills ?? []) {
        skills.add(skill.name)
      }
    }

    return skills
  }
  private async getMD() {
    const devsync: DevsyncPartial = JSON.parse(await this.readFile({ path: './DEVSYNC.json' }))

    let md = ''

    md += `# ${devsync.title ?? 'Professional Update'}\n\n`
    md += `I am ${devsync.name ?? 'a software engineer'}.\n\n`

    if (devsync.description) {
      md += `${devsync.description}\n\n`
    }

    if ((devsync.experience?.length ?? 0) > 0) {
      md += '## Experience\n\n'

      for (const ex of devsync.experience ?? []) {
        md += `- **${ex.position}** at **${ex.company}** (${ex.date})\n`
        if (ex.description) {
          md += `  - ${ex.description}\n`
        }

        for (const item of ex.list ?? []) {
          md += `  - ${item.title}: ${item.description}\n`
        }
      }

      md += '\n'
    }

    if ((devsync.projects?.length ?? 0) > 0) {
      md += '## Selected Projects\n\n'

      for (const project of devsync.projects ?? []) {
        md += `- **${project.name}**\n`
        if (project.description) {
          md += `  - ${project.description}\n`
        }

        for (const item of project.list ?? []) {
          md += `  - ${item.title}: ${item.description}\n`
        }

        if ((project.links?.length ?? 0) > 0) {
          md += `  - Links: ${(project.links ?? []).map((link) => link.url).join(' | ')}\n`
        }
      }

      md += '\n'
    }

    const skills = this.getSkills({ devsync })

    if (skills.size > 0) {
      md += '## Core Skills\n\n'
      md += `${Array.from(skills).join(' | ')}\n\n`
    }

    if ((devsync.certifications?.length ?? 0) > 0) {
      md += '## Certifications\n\n'
      for (const cert of devsync.certifications ?? []) {
        md += `- ${cert.name}${cert.url ? ` — ${cert.url}` : ''}\n`
      }
      md += '\n'
    }

    md += '## Let’s connect\n\n'
    for (const social of devsync.socialMedia ?? []) {
      md += `- ${social.name}: ${social.url}\n`
    }

    if (devsync.githubUserName) {
      md += `- GitHub profile: https://github.com/${devsync.githubUserName}\n`
    }

    return md
  }
}

export default CreateLinkedinUseCase
