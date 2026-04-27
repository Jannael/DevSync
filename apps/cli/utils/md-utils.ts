import type { Link, ListSchema, Skills } from '@template/src/devsync'

type GConstructor<T = {}> = new (...args: any[]) => T

// Mixins pattern for shared infrastructure code
export function mdUtilsMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    badgeWithLink({ badge, link }: { badge: string; link: string }) {
      return `[${badge}](${link})`
    }

    getListItems({ items }: { items: ListSchema['items'] }) {
      let listItems = ''
      for (const item of items) {
        listItems += `<li><strong>${item.highlight}</strong>${item.description}</li>`
      }
      return listItems
    }

    getSkills({ skills }: { skills: Skills[] }) {
      let innerSkills = ''
      for (const skill of skills ?? []) {
        innerSkills += skill.mdBadge
      }
      return innerSkills
    }

    getLinks({ links }: { links: Link[] }) {
      let innerLinks = ''
      for (const link of links ?? []) {
        innerLinks += this.badgeWithLink({
          badge: link.mdBadge,
          link: link.url,
        })
      }
      return innerLinks
    }

    getTdImg({ img, link, alt }: { img: string; link: string; alt: string }) {
      return `
<td width="40%">
  <a href="${link}" target="_blank" rel="noopener noreferrer">
    <picture>
      <img alt="${alt}" src="${img}" width="100%"/>
    </picture>
  </a>
</td>`
    }
  }
}
