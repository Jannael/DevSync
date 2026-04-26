import type { BuildRepository } from '@/modules/build/domain/build-repository'
import type { DevsyncPartial } from '@template/src/devsync'

// academics md contains education and certifications fields.

class CreateAcademicsUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute() {
    const devsync: DevsyncPartial = JSON.parse(
      await this.buildRepository.readFile({ path: './DEVSYNC.json' }),
    )

    let md = ''
    md += '# Academics \n\n'
    md += '<table>'

    // education timeline
    for (const ed of devsync.education ?? []) {
      let listItems = ''
      for (const item of ed.list ?? []) {
        listItems += `<li><strong>${item.title}</strong>${item.description}</li>`
      }

      let links = ''
      for (const link of ed.links ?? []) {
        links += `[${link.mdBadge}](${link.url})`
      }

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
  <td width="40%">
    <picture>
      <img alt="${ed.degree}" src="${ed.img}" width="100%"/>
    </picture>
  </td>
</tr>`
    }
    md += '</table> \n\n'

    md += '## Certifications \n\n'
    md += '<table>'

    // certifications
    for (const cert of devsync.certifications ?? []) {
      let listItems = ''
      for (const item of cert.list ?? []) {
        listItems += `<li><strong>${item.title}</strong>${item.description}</li>`
      }

      let skills = ''
      for (const skill of cert.skills ?? []) {
        skills += skill.mdBadge
      }

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
