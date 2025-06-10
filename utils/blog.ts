export interface BlogPost {
  title: string;
  date: string;
  author: string;
  authorUrl?: string;
  excerpt: string;
  tags: string[];
  slug: string;
  content?: string;
  iconUrl?: string;
  coverUrl?: string;
}

export interface BlogPostMeta {
  title: string;
  date: string;
  author: string;
  authorUrl?: string;
  excerpt: string;
  tags: string[];
  iconUrl?: string;
  coverUrl?: string;
}

export function parseFrontmatter(
  content: string,
): { frontmatter: BlogPostMeta | null; content: string } {
  // Extract frontmatter (handle different line endings)
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, content };
  }

  const [, frontmatterString, markdownContent] = match;
  const frontmatter: Record<string, string | string[]> = {};

  // Parse frontmatter
  frontmatterString.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value: string | string[] = line.slice(colonIndex + 1).trim();

      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Handle arrays (tags)
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map((tag) =>
          tag.trim().replace(/['"]/g, "")
        );
      }

      frontmatter[key] = value;
    }
  });

  const meta: BlogPostMeta = {
    title: (typeof frontmatter.title === "string" ? frontmatter.title : "") ||
      "Untitled",
    date: (typeof frontmatter.date === "string" ? frontmatter.date : "") || "",
    author:
      (typeof frontmatter.author === "string" ? frontmatter.author : "") ||
      "Anonymous",
    authorUrl: typeof frontmatter.authorUrl === "string"
      ? frontmatter.authorUrl
      : undefined,
    excerpt:
      (typeof frontmatter.excerpt === "string" ? frontmatter.excerpt : "") ||
      "",
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    iconUrl: typeof frontmatter.iconUrl === "string"
      ? frontmatter.iconUrl
      : undefined,
    coverUrl: typeof frontmatter.coverUrl === "string"
      ? frontmatter.coverUrl
      : undefined,
  };

  return { frontmatter: meta, content: markdownContent };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    const blogDir = "./static/content/blog";

    for await (const dirEntry of Deno.readDir(blogDir)) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
        const slug = dirEntry.name.replace(".md", "");
        const filePath = `${blogDir}/${dirEntry.name}`;

        try {
          const fileContent = await Deno.readTextFile(filePath);
          const { frontmatter } = parseFrontmatter(fileContent);

          if (frontmatter) {
            posts.push({
              ...frontmatter,
              slug,
            });
          }
        } catch (fileError) {
          console.error("Error reading file", filePath, ":", fileError);
        }
      }
    }

    // Sort posts by date (newest first)
    return posts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const fileContent = await Deno.readTextFile(
      `static/content/blog/${slug}.md`,
    );
    const { frontmatter, content } = parseFrontmatter(fileContent);

    if (!frontmatter) {
      return null;
    }

    return {
      ...frontmatter,
      content,
      slug,
    };
  } catch (error) {
    console.error("Error loading blog post:", error);
    return null;
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
