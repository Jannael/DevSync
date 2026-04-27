import type { DevsyncPartial } from '@template/src/devsync-validator'
import { mdUtilsMixin } from '@/utils/md-utils.ts'

// academics md contains education and certifications fields.
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

    // education timeline
    for (const ed of devsync.education ?? []) {
      const links = this.getLinks({ links: ed.links })
      const listItems = this.getListItems({ items: ed.list.items })

      md += `
<tr>
  <td>
    <h3>${ed.degree} | ${ed.date}</h3>

${links}
    <br>
    ${ed.list.title}
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
      const listItems = this.getListItems({ items: cert.list.items })
      const skills = this.getSkills({ skills: cert.skills })

      md += `
      <tr>
  <td>
    <h3>${cert.name}</h3>
    ${cert.list.title}
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
