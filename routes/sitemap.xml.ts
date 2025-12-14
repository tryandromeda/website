import { FreshContext } from "fresh";
import { type BlogPost, getAllBlogPosts } from "../utils/blog.ts";

function generateSitemap(posts: BlogPost[], baseUrl: string): string {
  const staticPages = [
    "",
    "/docs",
    "/blog",
  ];

  const staticEntries = staticPages.map((page) =>
    `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
  ).join("\n");

  const blogEntries = posts.map((post) =>
    `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;
}

export async function handler(ctx: FreshContext): Promise<Response> {
  const req = ctx.req;

  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const posts = await getAllBlogPosts();
    const sitemapContent = generateSitemap(posts, baseUrl);

    return new Response(sitemapContent, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
