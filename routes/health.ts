import { getAllBlogPosts } from "../utils/blog.ts";

export async function handler(): Promise<Response> {
  try {
    // Test if we can load blog posts
    const posts = await getAllBlogPosts();

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        blog: {
          status: "up",
          posts_count: posts.length,
        },
        feeds: {
          status: "up",
          formats: ["rss", "atom", "json"],
        },
      },
      version: "1.0.0",
    };

    return new Response(JSON.stringify(healthData, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const errorData = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      version: "1.0.0",
    };

    return new Response(JSON.stringify(errorData, null, 2), {
      status: 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }
}
