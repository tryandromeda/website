// deno-lint-ignore-file react-no-danger
import { render } from "@deno/gfm";
import type { PageProps } from "fresh";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-rust.js";
import "npm:prismjs@1.29.0/components/prism-javascript.js";

import Footer from "../../components/Footer.tsx";
import NavBar from "../../components/NavBar.tsx";
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
      <div class="min-h-screen bg-base text-text">
        <NavBar />
        <main class="pt-20 pb-20">
          <article class="container mx-auto px-6 max-w-5xl">
            {/* Enhanced blog post header */}
            <header class="mb-16 text-center relative">
              {/* Cover image with enhanced styling */}
              {post.coverUrl && (
                <div class="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                  <div class="relative">
                    <img
                      src={post.coverUrl}
                      alt={post.title}
                      class="w-full h-64 md:h-96 object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent">
                    </div>
                  </div>
                </div>
              )}

              <div class="relative">
                {/* Article metadata */}
                <div class="inline-flex items-center gap-3 bg-surface0/50 backdrop-blur-sm px-6 py-3 rounded-full text-sm text-subtext1 mb-8 border border-surface1/30">
                  <time class="flex items-center gap-2 font-medium">
                    <span class="w-2 h-2 bg-blue rounded-full"></span>
                    {formatDate(post.date)}
                  </time>
                  <span class="w-1 h-1 bg-surface2 rounded-full"></span>
                  <span class="flex items-center gap-2 font-medium">
                    <span>⏱️</span>
                    {getReadingTime(post.content)} min read
                  </span>
                </div>

                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-text mb-8 tracking-tight leading-tight">
                  {post.title}
                </h1>

                {/* Author info with enhanced design */}
                <div class="flex items-center justify-center gap-4 mb-10">
                  <div class="flex items-center gap-4 bg-surface0/50 backdrop-blur-sm px-6 py-4 rounded-2xl border border-surface1/30">
                    {post.iconUrl && (
                      <div class="relative">
                        <img
                          src={post.iconUrl}
                          alt={`${post.author} avatar`}
                          class="w-12 h-12 rounded-full ring-2 ring-surface1"
                        />
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue/20 to-transparent">
                        </div>
                      </div>
                    )}
                    {!post.iconUrl && <span class="text-3xl">👤</span>}
                    <div class="text-left">
                      {post.authorUrl ?
                        (
                          <a
                            href={post.authorUrl}
                            class="font-semibold text-text hover:text-blue transition-colors duration-300 text-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.author}
                          </a>
                        ) :
                        (
                          <span class="font-semibold text-text text-lg">
                            {post.author}
                          </span>
                        )}
                      <div class="text-subtext1 text-sm">Article Author</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced excerpt */}
                <p class="text-xl md:text-2xl text-subtext1 max-w-4xl mx-auto leading-relaxed mb-10 font-light">
                  {post.excerpt}
                </p>

                {/* Enhanced tags */}
                {post.tags.length > 0 && (
                  <div class="flex flex-wrap justify-center gap-3 mb-8">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        class="bg-surface1/50 hover:bg-surface2/50 text-subtext0 hover:text-text px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-surface1/30 hover:border-surface2/50 backdrop-blur-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reading progress indicator */}
                <div class="w-24 h-1 bg-gradient-to-r from-blue to-mauve rounded-full mx-auto">
                </div>
              </div>
            </header>

            {/* Enhanced blog post content */}
            <div class="relative">
              {/* Content wrapper with enhanced styling */}
              <div class="bg-surface0/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-surface1/20 shadow-xl">
                <div
                  class="markdown-body prose prose-lg prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              </div>
            </div>

            {/* Enhanced back to blog section */}
            <footer class="mt-20 pt-12 text-center">
              <div class="bg-gradient-to-br from-surface0/30 to-surface0/10 backdrop-blur-sm rounded-2xl p-8 border border-surface1/20">
                <h3 class="text-2xl font-bold text-text mb-4">
                  Enjoyed this article?
                </h3>
                <p class="text-subtext1 mb-6 max-w-2xl mx-auto">
                  Explore more insights and updates from the Andromeda team.
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                  <a
                    href="/blog"
                    class="group inline-flex items-center gap-3 bg-gradient-to-r from-blue to-mauve hover:from-blue/80 hover:to-mauve/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span class="group-hover:-translate-x-1 transition-transform duration-300">
                      ←
                    </span>
                    Back to Blog
                  </a>
                  <a
                    href="/docs/index"
                    class="group inline-flex items-center gap-3 bg-surface0/50 hover:bg-surface1 text-text px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-surface1/30 hover:border-surface2/50 backdrop-blur-sm"
                  >
                    📖 Read Documentation
                    <span class="group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </footer>
          </article>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);

    return (
      <div class="min-h-screen bg-base text-text">
        <NavBar />
        <main class="pt-32 pb-20">
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
      </div>
    );
  }
}
