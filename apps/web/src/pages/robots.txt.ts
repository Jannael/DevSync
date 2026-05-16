export function GET() {
  const sitemapUrl = 'https://devsync.work/sitemap-index.xml'

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
