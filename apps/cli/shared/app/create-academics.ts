import type { DevsyncPartial } from '@template/src/devsync-validator'
import { mdUtilsMixin } from '@/utils/md-utils.ts'
import { MD_SEPARATOR } from '@/constants/md-separator'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { writeFileMixin } from '../infra/write-file'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { ACADEMICS } from '@/constants/paths'
import { translations, type availableLangsType } from '@template/src/const/fields-translations'

export function CreateAcademicsMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends mdUtilsMixin(writeFileMixin(Base)) {
    private async createAcademicsMd({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      let md = ''
      md += this.getEducationTimeline({ devsync, defaultLang })
      md += this.getCertifications({ devsync, defaultLang })

      return md
    }

    private getEducationTimeline({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      const devsyncTranslation = devsync[defaultLang]
      const translation = translations[defaultLang as availableLangsType]
      let md = ''
      md += `# ${translation['academics']} \n\n`
      md += '<table>'

      for (const ed of devsyncTranslation?.education ?? []) {
        const links = this.getLinks({ links: ed.links })
        const listItems = ed.list?.items ? this.getListItems({ items: ed.list.items }) : ''

        md += `
      <tr>
        <td>
          <h3>${ed.name ?? 'Name'} | ${ed.degree ?? 'Degree'} | ${ed.date ?? 'Date'}</h3>\n
${links}
          <br>
          ${(ed.list?.title?.length ?? 0) > 1 ? ed.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>
        </td>
        ${this.getTdImg({ img: ed.img ?? '', link: '#', alt: ed.degree ?? 'Degree' })}
      </tr>`
      }

      md += '</table> \n\n'

      return md
    }

    private getCertifications({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      const devsyncTranslation = devsync[defaultLang]
      const translation = translations[defaultLang as availableLangsType]
      let md = ''

      md += `## ${translation['Certifications']} \n\n`
      md += '<table>'

      for (const cert of devsyncTranslation?.certifications ?? []) {
        const listItems = cert.list?.items ? this.getListItems({ items: cert.list.items }) : ''
        const skills = this.getSkills({ skills: cert.skills })

        md += `
      <tr>
        <td>
          <h3>${cert.name ?? 'Certification'}</h3>
          ${(cert.list?.title?.length ?? 0) > 1 ? cert.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>\n
${skills}
        </td>
        <td> <a href="${cert.url ?? '#'}" target="_blank">${translation['View Certificate']}</a> </td>
      </tr>`
      }

      md += '</table> \n\n'

      return md
    }

    async createAcademics({
      devsync,
      defaultLang,
    }: {
      devsync: DevsyncPartial
      defaultLang: string
    }) {
      console.log(`${SPACE}${GREEN('-')} Generating academics README...`)
      // create certifications md
      const academics = await this.createAcademicsMd({ devsync, defaultLang })
      await this.writeFile({ path: ACADEMICS, data: academics })
      console.log(`${SPACE}${CHECK(`Academics file generated at ${BOLD(ACADEMICS)}`)}`)
      console.log('')
    }
  }
}
