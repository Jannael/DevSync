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
    md += `# ${devsync.jobTitle ?? 'Professional'} | ${devsync.name ?? 'Name'}\n\n`
    md += `Status: ${devsync.status?.badge ?? 'Active'}\n\n`
    md += `${devsync.description ?? ''}\n\n`

    for (const socialMedia of devsync.socialMedia ?? []) {
      md += `[${socialMedia.mdBadge}](${socialMedia.url})`
    }
    md += this.badgeWithLink({
      badge: academicsBadge,
      link: `https://github.com/${devsync.githubUserName ?? ''}/${devsync.githubUserName ?? ''}/tree/main/academics`,
    })

    for (const lang of devsync.languages ?? []) {
      md += lang.mdBadge
    }
    md += '\n\n'
    return md
  }

  private getExperienceSection({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    md += '## Experience \n\n'
    md += '<table>'

    for (const ex of devsync.experience ?? []) {
      const links = this.getLinks({ links: ex.links })
      const listItems = ex.list?.items ? this.getListItems({ items: ex.list.items }) : ''
      const skills = this.getSkills({ skills: ex.skills })

      md += `
      <tr>
        <td>
          <h3>${ex.company ?? 'Company'}</h3>
${links}
          <p>${ex.description ?? ''}</p>
          ${ex.list?.title ?? ''}
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

  private getProjectsSection({ devsync }: { devsync: DevsyncPartial }) {
    let md = ''
    md += '## Projects \n\n'
    md += '<table>'

    for (const proj of devsync.projects ?? []) {
      const links = this.getLinks({ links: proj.links })
      const listItems = proj.list?.items ? this.getListItems({ items: proj.list.items }) : ''
      const skills = this.getSkills({ skills: proj.skills })

      md += `
      <tr>
        <td>
          <h3>${proj.name ?? 'Project'}</h3>
${links}
          <p>${proj.description ?? ''}</p>
          ${proj.list?.title ?? ''}
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
}

export default CreateGithubProfileUseCase
