export function handler(req: Request): Response {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Feed URLs
Sitemap: ${baseUrl}/blog/rss.xml
Sitemap: ${baseUrl}/blog/atom.xml
`;

  return new Response(robotsContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
}
