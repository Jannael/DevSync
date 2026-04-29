import type { APIRoute } from 'astro'
import devsync from '@/devsync'

export const GET: APIRoute = async () => {
  const siteName = devsync.name
  const shortName = devsync.name?.split(' ').slice(0, 2).join(' ') || 'Portfolio'
  const description = devsync.description || ''

  const manifest = {
    name: siteName,
    short_name: shortName,
    description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo-192-black.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/logo-512-black.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
    categories: ['personal', 'portfolio'],
    lang: 'en-US',
    dir: 'ltr',
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  })
}
