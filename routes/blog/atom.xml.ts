import { type BlogPost, getAllBlogPosts } from "../../utils/blog.ts";

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => {
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

function generateAtomFeed(posts: BlogPost[], baseUrl: string): string {
  const now = new Date().toISOString();
  const latestPostDate = posts.length > 0
    ? new Date(posts[0].date).toISOString()
    : now;

  const entries = posts.map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;

    return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${postUrl}"/>
    <id>${postUrl}</id>
    <updated>${new Date(post.date).toISOString()}</updated>
    <published>${new Date(post.date).toISOString()}</published>
    <summary type="text">${escapeXml(post.excerpt)}</summary>
    <author>
      <name>${escapeXml(post.author)}</name>${
      post.authorUrl
        ? `
      <uri>${escapeXml(post.authorUrl)}</uri>`
        : ""
    }
    </author>
    ${
      post.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join(
        "\n    ",
      )
    }
  </entry>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Andromeda Blog</title>
  <link href="${baseUrl}/blog"/>
  <link href="${baseUrl}/blog/atom.xml" rel="self"/>
  <id>${baseUrl}/blog</id>
  <updated>${latestPostDate}</updated>
  <subtitle>Latest updates, insights, and technical deep-dives from the Andromeda team. Discover how we're building the future of JavaScript runtimes.</subtitle>
  <generator uri="https://fresh.deno.dev/" version="2.0">Fresh</generator>
  <icon>${baseUrl}/favicon.ico</icon>
  <logo>${baseUrl}/logo.svg</logo>
${entries}
</feed>`;
}

export async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const posts = await getAllBlogPosts();
    const atomContent = generateAtomFeed(posts, baseUrl);

    return new Response(atomContent, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return new Response("Error generating Atom feed", { status: 500 });
  }
}
