import type { DevsyncPartial } from '@template/src/devsync-validator'
import { mdUtilsMixin } from '@/utils/md-utils.ts'

class BaseClass {}

class CreateAcademicsUseCase extends mdUtilsMixin(BaseClass) {
  constructor() {
    super()
  }

  async execute({ devsync }: { devsync: DevsyncPartial }) {
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
          <h3>${ed.degree ?? 'Degree'} | ${ed.date ?? 'Date'}</h3>
${links}
          <br>
          ${ed.list?.title ?? ''}
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
          ${cert.list?.title ?? ''}
          <ul>
            ${listItems}
          </ul>
          </br>
${skills}
        </td>
        <td> <a href="${cert.url ?? '#'}" target="_blank">View Certificate</a> </td>
      </tr>`
    }

    md += '</table> \n\n'

    return md
  }
}

export default CreateAcademicsUseCase
