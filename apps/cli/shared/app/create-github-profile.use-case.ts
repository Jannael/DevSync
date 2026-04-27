import type { DevsyncPartial } from '@template/src/devsync-validator'
import { academicsBadge } from '@/constants/academics-badge'
import { mdUtilsMixin } from '@/utils/md-utils.ts'

class BaseClass {}

class CreateGithubProfileUseCase extends mdUtilsMixin(BaseClass) {
  constructor() {
    super()
  }

  async execute({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''

    md += this.getHeader({ devsync })
    md += this.getExperienceSection({ devsync })
    md += this.getProjectsSection({ devsync })

    return md
  }

  private getHeader({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    //first let's create the header
    md += `# ${devsync.title} | ${devsync.name}\n\n`
    md += `Status: ${devsync.status?.badge}\n\n`
    md += devsync.description + '\n\n'

    // here badges goes this way: social media then certifications badge(with url to md with the details - built from certifications field)
    for (const socialMedia of devsync.socialMedia ?? []) {
      md += `[${socialMedia.mdBadge}](${socialMedia.url})`
    }
    md += this.badgeWithLink({
      badge: academicsBadge,
      link: `https://github.com/${devsync.githubUserName}/${devsync.githubUserName}/tree/main/academics`,
    })

    for (const lang of devsync.languages ?? []) {
      md += lang.mdBadge
    }
    md += '\n\n'
    return md
  }

  private getExperienceSection({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    // then experience section
    md += '## Experience \n\n'
    md += '<table>'

    for (const ex of devsync.experience ?? []) {
      const links = this.getLinks({ links: ex.links })
      const listItems = this.getListItems({ items: ex.list })
      const skills = this.getSkills({ skills: ex.skills })

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
  ${this.getTdImg({ img: ex.img, link: ex.imgLink, alt: ex.company })}
</tr>`
    }
    md += '</table> \n\n'

    return md
  }

  private getProjectsSection({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    //then projects sections
    md += '## Projects \n\n'
    md += '<table>'

    for (const proj of devsync.projects ?? []) {
      const links = this.getLinks({ links: proj.links })
      const listItems = this.getListItems({ items: proj.list })
      const skills = this.getSkills({ skills: proj.skills })

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
  ${this.getTdImg({ img: proj.img, link: proj.imgLink, alt: proj.name })}
</tr>`
    }

    md += '</table> \n\n'

    return md
  }
}

export default CreateGithubProfileUseCase
