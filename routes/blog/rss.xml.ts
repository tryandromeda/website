import { FreshContext } from "fresh";
import { type BlogPost, getAllBlogPosts } from "../../utils/blog.ts";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function(c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function generateRSSFeed(posts: BlogPost[], baseUrl: string): string {
  const now = new Date().toUTCString();

  const items = posts.map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const pubDate = new Date(post.date).toUTCString();

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@tryandromeda.dev (${escapeXml(post.author)})</author>
      ${
      post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`)
        .join("\n      ")
    }
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Andromeda Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Latest updates, insights, and technical deep-dives from the Andromeda team. Discover how we're building the future of JavaScript runtimes.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.svg</url>
      <title>Andromeda Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
${items}
  </channel>
</rss>`;
}

export async function handler(ctx: FreshContext): Promise<Response> {
  const req = ctx.req;

  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const posts = await getAllBlogPosts();
    const rssContent = generateRSSFeed(posts, baseUrl);

    return new Response(rssContent, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
