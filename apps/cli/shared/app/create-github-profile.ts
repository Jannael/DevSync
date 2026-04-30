import type { DevsyncPartial } from '@template/src/devsync-validator'
import { academicsBadge } from '@/constants/academics-badge'
import { mdUtilsMixin } from '@/utils/md-utils.ts'
import { MD_SEPARATOR } from '@/constants/md-separator'
import { pathREADME } from '@/constants/paths'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { writeFileMixin } from '../infra/write-file'
import type { GConstructor } from '../infra/mixin-constructor'
import { translations, type availableLangsType } from '@template/src/const/fields-translations'

export function CreateGithubProfileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends writeFileMixin(mdUtilsMixin(Base)) {
    private async createGithubProfileMd({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      let md = ''

      md += this.getHeader({ devsync, defaultLang })
      md += this.getExperienceSection({ devsync, defaultLang })
      md += this.getProjectsSection({ devsync, defaultLang })

      return md
    }

    private getHeader({ devsync, defaultLang }: { devsync: DevsyncPartial; defaultLang: string }) {
      const devsyncTranslation = devsync[defaultLang]
      let md = ''
      md += `# ${devsyncTranslation?.jobTitle ?? 'Professional'} | ${devsync?.name ?? 'Name'}\n\n`
      md += `${devsyncTranslation?.status?.badge ?? 'Active'}\n\n`
      md += `${devsyncTranslation?.description ?? ''}\n\n`

      for (const socialMedia of devsync?.socialMedia ?? []) {
        md += this.badgeWithLink({
          badge: socialMedia.mdBadge,
          link: socialMedia.url,
        })
      }

      md += this.badgeWithLink({
        badge: academicsBadge,
        link: `https://github.com/${devsync?.githubUserName ?? ''}/${devsync?.githubUserName ?? ''}/tree/main/academics`,
      })

      for (const lang of devsyncTranslation?.languages ?? []) {
        md += lang.mdBadge
      }
      md += '\n\n'
      return md
    }

    private getExperienceSection({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      const devsyncTranslation = devsync[defaultLang]
      const translation = translations[defaultLang as availableLangsType]

      let md = ''
      md += `## ${translation['Professional Experience']} \n\n`
      md += '<table>'

      for (const ex of devsyncTranslation?.experience ?? []) {
        const links = this.getLinks({ links: ex.links })
        const listItems = ex.list?.items ? this.getListItems({ items: ex.list.items }) : ''
        const skills = this.getSkills({ skills: ex.skills })

        md += `
      <tr>
        <td>
          <h3>${ex.company ?? 'Company'}</h3>\n
${links}
          <p>${ex.description ?? ''}</p>
          ${ex.list?.title.length > 1 ? ex.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>
${skills}
        </td>
        ${this.getTdImg({ img: ex.img ?? '', link: ex.web ?? '#', alt: ex.company ?? 'Company' })}
      </tr>`
      }
      md += '</table> \n\n'

      return md
    }

    private getProjectsSection({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      const devsyncTranslation = devsync[defaultLang]
      const translation = translations[defaultLang as availableLangsType]
      let md = ''
      md += `## ${translation['Projects']} \n\n`
      md += '<table>'

      for (const proj of devsyncTranslation?.projects ?? []) {
        const links = this.getLinks({ links: proj.links })
        const listItems = proj.list?.items ? this.getListItems({ items: proj.list.items }) : ''
        const skills = this.getSkills({ skills: proj.skills })

        md += `
      <tr>
        <td>
          <h3>${proj.name ?? 'Project'}</h3>\n
${links}
          <p>${proj.description ?? ''}</p>
          ${proj.list?.title.length > 1 ? proj.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>
${skills}
        </td>
        ${this.getTdImg({ img: proj.img ?? '', link: proj.web ?? '#', alt: proj.name ?? 'Project' })}
      </tr>`
      }

      md += '</table> \n\n'

      return md
    }

    async createGithubProfile({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      console.log(`${SPACE}${GREEN('3.')} Generating GitHub profile README...`)
      const README = await this.createGithubProfileMd({ devsync, defaultLang })
      await this.writeFile({ path: pathREADME, data: README })
      console.log(`${SPACE}${CHECK(`README generated at ${BOLD(pathREADME)}`)}`)
      console.log('')
    }
  }
}
