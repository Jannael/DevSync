import { type DevsyncPartial, translations, type availableLangsType } from '@devsync/core'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { BOLD, GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { LINKEDIN } from '@/constants/paths'
import { writeFileMixin } from '@/shared/infra/write-file'

/*
Linkedin.md will have a version with each translation
linkedin-{lang}.md

example:
linkedin-en.md
linkedin-es.md

*/

export function CreateLinkedinMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends writeFileMixin(Base) {
    private getLinkedinSkills({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
      const translation = devsync[lang]
      const skills = new Set<string>()
      for (const ex of translation?.experience ?? []) {
        for (const skill of ex.skills ?? []) {
          if (skill.name) {
            skills.add(skill.name)
          }
        }
      }
      for (const project of translation?.projects ?? []) {
        for (const skill of project.skills ?? []) {
          if (skill.name) {
            skills.add(skill.name)
          }
        }
      }
      for (const cert of translation?.certifications ?? []) {
        for (const skill of cert.skills ?? []) {
          if (skill.name) {
            skills.add(skill.name)
          }
        }
      }

      return skills
    }

    private async getMD({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
      let md = ''
      const translation = devsync[lang]
      const innerTranslation = translations[lang as availableLangsType]

      md += `# ${translation?.jobTitle ?? 'Professional Update'}\n\n`
      md += `${innerTranslation['I am']} ${devsync?.name ?? 'a software engineer'}.\n\n`

      if (translation?.description) {
        md += `${translation.description}\n\n`
      }

      if ((translation?.experience?.length ?? 0) > 0) {
        md += `## ${innerTranslation['Professional Experience']} \n\n`

        for (const ex of translation?.experience ?? []) {
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

      if ((translation?.projects?.length ?? 0) > 0) {
        md += `## ${innerTranslation['Selected projects']} \n\n`

        for (const project of translation?.projects ?? []) {
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
            md += ` - ${innerTranslation['Links']}: ${(project.links ?? []).map((link) => link.url).join(' | ')}\n`
          }
        }

        md += '\n'
      }

      const skills = this.getLinkedinSkills({ devsync, lang })

      if (skills.size > 0) {
        md += `## ${innerTranslation['Core Skills']} \n\n`
        md += `${Array.from(skills).join(' | ')}\n\n`
      }

      if ((translation?.certifications?.length ?? 0) > 0) {
        md += `## ${innerTranslation['Certifications']} \n\n`
        for (const cert of translation?.certifications ?? []) {
          md += `- ${cert.name}${cert.url ? ` — ${cert.url}` : ''}\n`
        }
        md += '\n'
      }

      md += `## ${innerTranslation["Let's connect"]} \n\n`
      for (const social of devsync?.socialMedia ?? []) {
        md += `- ${social.name}: ${social.url}\n`
      }

      if (devsync?.githubUserName) {
        md += `- ${innerTranslation['Github Profile']}: https://github.com/${devsync?.githubUserName}\n`
      }

      return md
    }

    async createLinkedin({ devsync, lang }: { devsync: DevsyncPartial; lang: string }) {
      console.log(`${SPACE}${GREEN('-')} Generating LinkedIn presentation...`)
      const linkedin = await this.getMD({ devsync, lang })
      await this.writeFile({ path: LINKEDIN(lang), data: linkedin })
      console.log(`${SPACE}${CHECK(`LinkedIn markdown generated at ${BOLD(LINKEDIN(lang))}`)}`)
      console.log('')
    }
  }
}
