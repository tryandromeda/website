// deno-lint-ignore-file react-no-danger
import type { PageProps } from "fresh";
import { render } from "@deno/gfm";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-rust.js";
import "npm:prismjs@1.29.0/components/prism-javascript.js";

import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { formatDate, getBlogPost, getReadingTime } from "../../utils/blog.ts";

export default async function BlogPost(props: PageProps) {
  const slug = props.params.slug;

  try {
    const post = await getBlogPost(slug);

    if (!post || !post.content) {
      return (
        <div class="min-h-screen bg-base">
          <NavBar />
          <main class="min-h-screen pt-32 pb-20">
            <div class="container mx-auto px-4 max-w-4xl text-center">
              <h1 class="text-4xl font-bold text-text mb-6">
                Blog Post Not Found
              </h1>
              <p class="text-subtext1 mb-8">
                The requested blog post could not be found.
              </p>
              <a
                href="/blog"
                class="inline-flex items-center gap-2 bg-blue hover:bg-blue/80 text-base px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ← Back to Blog
              </a>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    const renderedContent = render(post.content, {
      baseUrl: new URL(props.url).host,
      allowMath: true,
    });

    return (
      <>
        <NavBar />
        <main class="min-h-screen pt-32 pb-20">
          <article class="container mx-auto px-4 max-w-4xl">
            {/* Blog post header */}
            <header class="mb-12 text-center">
              {/* Cover image */}
              {post.coverUrl && (
                <div class="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    class="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}

              <h1 class="text-4xl md:text-5xl font-bold text-text mb-6">
                {post.title}
              </h1>
              <div class="flex flex-wrap items-center justify-center gap-4 text-subtext1 mb-6">
                <time class="flex items-center gap-2">
                  <span>📅</span>
                  {formatDate(post.date)}
                </time>

                <span class="flex items-center gap-2">
                  {post.iconUrl && (
                    <img
                      src={post.iconUrl}
                      alt={`${post.author} avatar`}
                      class="w-5 h-5 rounded-full"
                    />
                  )}
                  {!post.iconUrl && <span>👤</span>}
                  {post.authorUrl
                    ? (
                      <a
                        href={post.authorUrl}
                        class="hover:text-blue transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {post.author}
                      </a>
                    )
                    : <span>{post.author}</span>}
                </span>

                <span class="flex items-center gap-2">
                  <span>⏱️</span>
                  {getReadingTime(post.content)} min read
                </span>
              </div>

              <p class="text-lg text-subtext1 max-w-2xl mx-auto leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div class="flex flex-wrap justify-center gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      class="bg-surface1 text-subtext0 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Blog post content */}
            <div
              class="markdown-body prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            {/* Back to blog link */}
            <footer class="mt-16 pt-8 border-t border-surface1 text-center">
              <a
                href="/blog"
                class="inline-flex items-center gap-2 text-blue hover:text-blue/80 font-semibold transition-colors"
              >
                ← Back to Blog
              </a>
            </footer>
          </article>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);

    return (
      <>
        <NavBar />
        <main class="min-h-screen pt-32 pb-20">
          <div class="container mx-auto px-4 max-w-4xl text-center">
            <h1 class="text-4xl font-bold text-text mb-6">
              Blog Post Not Found
            </h1>
            <p class="text-subtext1 mb-8">
              The blog post you're looking for doesn't exist.
            </p>
            <a
              href="/blog"
              class="inline-flex items-center gap-2 bg-surface0 hover:bg-surface1 text-text px-6 py-3 rounded-lg transition-colors border border-surface1"
            >
              ← Back to Blog
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }
}
