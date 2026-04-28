import type { DevsyncPartial } from '@template/src/devsync-validator'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { BOLD, GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { pathLinkedin } from '@/constants/paths'
import { writeFileMixin } from '@/shared/infra/write-file'

export function CreateLinkedinMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends writeFileMixin(Base) {
    private async createLinkedinMd({ devsync }: { devsync: DevsyncPartial }) {
      return await this.getMD({ devsync })
    }

    private getLinkedinSkills({ devsync }: { devsync: DevsyncPartial }) {
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

    private async getMD({ devsync }: { devsync: DevsyncPartial }) {
      let md = ''

      md += `# ${devsync.jobTitle ?? 'Professional Update'}\n\n`
      md += `I am ${devsync.name ?? 'a software engineer'}.\n\n`

      if (devsync.description) {
        md += `${devsync.description}\n\n`
      }

      if ((devsync.experience?.length ?? 0) > 0) {
        md += '## Experience\n\n'

        for (const ex of devsync.experience ?? []) {
          md += `- **${ex.position ?? 'Position'}** at **${ex.company ?? 'Company'}** (${ex.date ?? 'Date'})\n`
          if (ex.description) {
            md += ` - ${ex.description}\n`
          }

          if (ex.list?.items?.length) {
            for (const item of ex.list.items) {
              md += ` - ${item.highlight}: ${item.description}\n`
            }
          }
        }

        md += '\n'
      }

      if ((devsync.projects?.length ?? 0) > 0) {
        md += '## Selected Projects\n\n'

        for (const project of devsync.projects ?? []) {
          md += `- **${project.name ?? 'Project'}**\n`
          if (project.description) {
            md += ` - ${project.description}\n`
          }

          if (project.list?.items?.length) {
            for (const item of project.list.items) {
              md += ` - ${item.highlight}: ${item.description}\n`
            }
          }

          if ((project.links?.length ?? 0) > 0) {
            md += ` - Links: ${(project.links ?? []).map((link) => link.url).join(' | ')}\n`
          }
        }

        md += '\n'
      }

      const skills = this.getLinkedinSkills({ devsync })

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

      md += "## Let's connect\n\n"
      for (const social of devsync.socialMedia ?? []) {
        md += `- ${social.name}: ${social.url}\n`
      }

      if (devsync.githubUserName) {
        md += `- GitHub profile: https://github.com/${devsync.githubUserName}\n`
      }

      return md
    }

    async createLinkedin({ devsync }: { devsync: DevsyncPartial }) {
      console.log(`${SPACE}${GREEN('5.')} Generating LinkedIn presentation...`)
      const linkedin = await this.createLinkedinMd({ devsync })
      await this.writeFile({ path: pathLinkedin, data: linkedin })
      console.log(`${SPACE}${CHECK(`LinkedIn markdown generated at ${BOLD(pathLinkedin)}`)}`)
      console.log('')
    }
  }
}
