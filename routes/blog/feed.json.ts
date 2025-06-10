import { type BlogPost, getAllBlogPosts } from "../../utils/blog.ts";

function generateJSONFeed(posts: BlogPost[], baseUrl: string) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: "Andromeda Blog",
    home_page_url: `${baseUrl}/blog`,
    feed_url: `${baseUrl}/blog/feed.json`,
    description:
      "Latest updates, insights, and technical deep-dives from the Andromeda team. Discover how we're building the future of JavaScript runtimes.",
    icon: `${baseUrl}/logo.svg`,
    favicon: `${baseUrl}/favicon.ico`,
    language: "en",
    items: posts.map((post) => ({
      id: `${baseUrl}/blog/${post.slug}`,
      url: `${baseUrl}/blog/${post.slug}`,
      title: post.title,
      content_html: post.excerpt, // We could render full markdown here if needed
      summary: post.excerpt,
      date_published: new Date(post.date).toISOString(),
      authors: [
        {
          name: post.author,
          url: post.authorUrl,
          avatar: post.iconUrl,
        },
      ],
      tags: post.tags,
    })),
  };
}

export async function handler(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const posts = await getAllBlogPosts();
    const jsonFeed = generateJSONFeed(posts, baseUrl);

    return new Response(JSON.stringify(jsonFeed, null, 2), {
      headers: {
        "Content-Type": "application/feed+json; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating JSON feed:", error);
    return new Response("Error generating JSON feed", { status: 500 });
  }
}
