import type { DevsyncPartial } from '@template/src/devsync'
import { readFileMixin } from '@/shared/infra/read-file'
import { mdUtilsMixin } from '@/utils/md-utils.ts'
import { ServerError } from '@/error/error-instance'

// academics md contains education and certifications fields.
class BaseClass {}

class CreateAcademicsUseCase extends mdUtilsMixin(readFileMixin(BaseClass)) {
  constructor() {
    super()
  }

  async execute() {
    try {
      const devsync: DevsyncPartial = JSON.parse(await this.readFile({ path: './DEVSYNC.json' }))

      let md = ''
      md += this.getEducationTimeline({ devsync })
      md += this.getCertifications({ devsync })

      return md
    } catch {
      throw new ServerError(
        'Failed to parse DEVSYNC.json',
        'Check your DEVSYNC.json follows the right format',
      )
    }
  }

  private getEducationTimeline({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    md += '# Academics \n\n'
    md += '<table>'

    // education timeline
    for (const ed of devsync.education ?? []) {
      const links = this.getLinks({ links: ed.links })
      const listItems = this.getListItems({ items: ed.list })

      md += `
<tr>
  <td>
    <h3>${ed.degree} | ${ed.date}</h3>

${links}
    <br>
    ${ed.listName}
    <ul>
      ${listItems}
    </ul>
    </br>
  </td>
  ${this.getTdImg({ img: ed.img, link: '#', alt: ed.degree })}
</tr>`
    }

    md += '</table> \n\n'

    return md
  }

  private getCertifications({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''

    md += '## Certifications \n\n'
    md += '<table>'

    // certifications
    for (const cert of devsync.certifications ?? []) {
      const listItems = this.getListItems({ items: cert.list })
      const skills = this.getSkills({ skills: cert.skills })

      md += `
      <tr>
  <td>
    <h3>${cert.name}</h3>
    ${cert.listName}
    <ul>
      ${listItems}
    </ul>
    </br>\n
${skills}
  </td>
  <td> <a href="${cert.url}" target="_blank">View Certificate</a> </td>
</tr>`
    }

    md += '</table> \n\n'

    return md
  }
}

export default CreateAcademicsUseCase
