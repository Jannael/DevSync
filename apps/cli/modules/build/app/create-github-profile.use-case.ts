import type { BuildRepository } from '@/modules/build/domain/build-repository'
import type { DevsyncPartial } from '@template/src/devsync'
import { academicsBadge } from '@/constants/academics-badge'

class CreateGithubProfileUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute() {
    // we import devsync from the directory it's been executed
    const devsync: DevsyncPartial = JSON.parse(
      await this.buildRepository.readFile({ path: './DEVSYNC.json' }),
    )

    let md = ''

    //first let's create the header
    md += `# ${devsync.title} | ${devsync.name}\n\n`
    md += devsync.description + '\n\n'

    // here badges goes this way: social media then certifications badge(with url to md with the details - built from certifications field)
    for (const socialMedia of devsync.socialMedia ?? []) {
      md += `[${socialMedia.mdBadge}](${socialMedia.url})`
    }
    md += `[${academicsBadge}](https://github.com/${devsync.githubUserName}/${devsync.githubUserName}/tree/main/academics)`
    for (const lang of devsync.languages ?? []) {
      md += lang.mdBadge
    }

    md += '\n\n'

    // then experience section
    md += '## Experience \n\n'
    md += '<table>'

    for (const ex of devsync.experience ?? []) {
      let links = ''
      for (const link of ex.links ?? []) {
        links += `[${link.mdBadge}](${link.url})`
      }

      let listItems = ''
      for (const item of ex.list ?? []) {
        listItems += `<li><strong>${item.title}</strong>${item.description}</li>`
      }

      let skills = ''
      for (const skill of ex.skills ?? []) {
        skills += skill.mdBadge
      }

      md += ` 
<tr>
  <td>
    <h3>${ex.company}</h3>

${links}
    <p>${ex.description}</p>
    ${ex.listName}
    <ul>
      ${listItems}
    </ul>
    </br>
${skills}
  </td>
  <td width="40%">
    <a href="${ex.imgLink}" target="_blank" rel="noopener noreferrer">
    <picture>
      <img alt="${ex.company}" src="${ex.img}" width="100%"/>
    </picture>
    </a>
  </td>
</tr>`
    }
    md += '</table> \n\n'
    
    //then projects sections
    md += '## Projects \n\n'
    md += '<table>'
    
    for (const proj of devsync.projects ?? []) {
      let links = ''
      for (const link of proj.links ?? []) {
        links += `[${link.mdBadge}](${link.url})`
      }
      
      let listItems = ''
      for (const item of proj.list ?? []) {
        listItems += `<li><strong>${item.title}</strong>${item.description}</li>`
      }
      
      let skills = ''
      for (const skill of proj.skills ?? []) {
        skills += skill.mdBadge
      }
      
      md += `
<tr>
  <td>
    <h3>${proj.name}</h3>
    
${links}
    <p>${proj.description}</p>
    ${proj.listName}
    <ul>
      ${listItems}
    </ul>
    </br>
${skills}
  </td>
  <td width="40%">
    <a href="${proj.imgLink}" target="_blank" rel="noopener noreferrer">
    <picture>
      <img alt="${proj.name}" src="${proj.img}" width="100%"/>
    </picture>
    </a>
  </td>
</tr>`
    }
    md += '</table> \n\n'

    return md
  }
}

export default CreateGithubProfileUseCase
