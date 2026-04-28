import type { DevsyncPartial } from '@template/src/devsync-validator'
import { mdUtilsMixin } from '@/utils/md-utils.ts'
import { MD_SEPARATOR } from '@/constants/md-separator'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { writeFileMixin } from '../infra/write-file'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { pathAcademics } from '@/constants/paths'

export function CreateAcademicsMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends mdUtilsMixin(writeFileMixin(Base)) {
    private async createAcademicsMd({ devsync }: { devsync: DevsyncPartial }) {
      let md = ''
      md += this.getEducationTimeline({ devsync })
      md += this.getCertifications({ devsync })

      return md
    }

    private getEducationTimeline({ devsync }: { devsync: DevsyncPartial }) {
      let md = ''
      md += '# Academics \n\n'
      md += '<table>'

      for (const ed of devsync.education ?? []) {
        const links = this.getLinks({ links: ed.links })
        const listItems = ed.list?.items ? this.getListItems({ items: ed.list.items }) : ''

        md += `
      <tr>
        <td>
          <h3>${ed.name ?? 'Name'} | ${ed.degree ?? 'Degree'} | ${ed.date ?? 'Date'}</h3>\n
${links}
          <br>
          ${ed.list?.title.length > 1 ? ed.list?.title : MD_SEPARATOR}
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

    private getCertifications({ devsync }: { devsync: DevsyncPartial }) {
      let md = ''

      md += '## Certifications \n\n'
      md += '<table>'

      for (const cert of devsync.certifications ?? []) {
        const listItems = cert.list?.items ? this.getListItems({ items: cert.list.items }) : ''
        const skills = this.getSkills({ skills: cert.skills })

        md += `
      <tr>
        <td>
          <h3>${cert.name ?? 'Certification'}</h3>
          ${cert.list?.title.length > 1 ? cert.list?.title : MD_SEPARATOR}
          <ul>
            ${listItems}
          </ul>
          </br>\n
${skills}
        </td>
        <td> <a href="${cert.url ?? '#'}" target="_blank">View Certificate</a> </td>
      </tr>`
      }

      md += '</table> \n\n'

      return md
    }

    async createAcademics({ devsync }: { devsync: DevsyncPartial }) {
      console.log(`${SPACE}${GREEN('4.')} Generating academics README...`)
      // create certifications md
      const academics = await this.createAcademicsMd({ devsync })
      await this.writeFile({ path: pathAcademics, data: academics })
      console.log(`${SPACE}${CHECK(`Academics file generated at ${BOLD(pathAcademics)}`)}`)
      console.log('')
    }
  }
}
