import type { APIRoute } from 'astro'
import devsync from '@/devsync'

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() ?? devsync.site ?? 'https://devsync.work'

  return new Response(
    `
User-agent: *
Allow: /

Sitemap: ${new URL('sitemap.xml', siteUrl)}
  `.trim(),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  )
}
