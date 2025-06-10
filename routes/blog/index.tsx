import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { formatDate, getAllBlogPosts } from "../../utils/blog.ts";

export default async function Blog() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <NavBar />
      <main class="min-h-screen pt-32 pb-20">
        <div class="container mx-auto px-4 max-w-6xl">
          {/* Blog header */}
          <header class="text-center mb-16">
            <h1 class="text-5xl md:text-6xl font-bold text-text mb-6">
              Blog
            </h1>
            <p class="text-xl text-subtext1 max-w-3xl mx-auto leading-relaxed mb-6">
              Latest updates, insights, and technical deep-dives from the
              Andromeda team. Discover how we're building the future of
              JavaScript runtimes.
            </p>
            {/* RSS/Atom feed links */}
            <div class="flex justify-center gap-4">
              <a
                href="/blog/rss.xml"
                class="inline-flex items-center gap-2 bg-surface0 hover:bg-surface1 text-subtext1 hover:text-text px-4 py-2 rounded-lg text-sm transition-colors border border-surface1"
                title="Subscribe to RSS feed"
              >
                📡 RSS Feed
              </a>
              <a
                href="/blog/atom.xml"
                class="inline-flex items-center gap-2 bg-surface0 hover:bg-surface1 text-subtext1 hover:text-text px-4 py-2 rounded-lg text-sm transition-colors border border-surface1"
                title="Subscribe to Atom feed"
              >
                ⚛️ Atom Feed
              </a>
              <a
                href="/blog/feed.json"
                class="inline-flex items-center gap-2 bg-surface0 hover:bg-surface1 text-subtext1 hover:text-text px-4 py-2 rounded-lg text-sm transition-colors border border-surface1"
                title="Subscribe to JSON feed"
              >
                📄 JSON Feed
              </a>
            </div>
          </header>

          {/* Blog posts grid */}
          {posts.length > 0
            ? (
              <div class="grid gap-8 md:gap-12">
                {posts.map((post, index) => (
                  <article
                    key={post.slug}
                    class={`bg-surface0 rounded-2xl overflow-hidden border border-surface1 hover:border-surface2 transition-all duration-300 ${
                      index === 0 ? "md:grid md:grid-cols-2 md:gap-8" : ""
                    }`}
                  >
                    {/* Featured post layout for first post */}
                    {index === 0
                      ? (
                        <>
                          <div class="p-8 md:p-12 flex flex-col justify-center">
                            <div class="flex items-center gap-2 text-sm text-subtext1 mb-4">
                              <span class="bg-blue text-base px-2 py-1 rounded text-xs font-semibold">
                                FEATURED
                              </span>
                              <time>
                                {formatDate(post.date)}
                              </time>
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight">
                              <a
                                href={`/blog/${post.slug}`}
                                class="hover:text-subtext0 transition-colors"
                              >
                                {post.title}
                              </a>
                            </h2>

                            <p class="text-subtext1 text-lg leading-relaxed mb-6">
                              {post.excerpt}
                            </p>

                            <div class="flex flex-wrap items-center justify-between gap-4">
                              <div class="flex items-center gap-2 text-subtext1">
                                {post.iconUrl && (
                                  <img
                                    src={post.iconUrl}
                                    alt={`${post.author} avatar`}
                                    class="w-6 h-6 rounded-full"
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
                              </div>

                              <a
                                href={`/blog/${post.slug}`}
                                class="inline-flex items-center gap-2 bg-blue hover:bg-blue/80 text-base px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                Read More →
                              </a>
                            </div>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                              <div class="flex flex-wrap gap-2 mt-6">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    class="bg-surface1 text-subtext0 px-3 py-1 rounded-full text-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div class="bg-gradient-to-br from-blue/20 to-mauve/20 p-8 md:p-12 flex items-center justify-center">
                            <div class="text-6xl opacity-20">📝</div>
                          </div>
                        </>
                      )
                      : (
                        /* Regular post layout */
                        <div class="p-8">
                          <div class="flex items-center gap-4 text-sm text-subtext1 mb-4">
                            <time>
                              {formatDate(post.date)}
                            </time>
                            <span>•</span>
                            <div class="flex items-center gap-2">
                              {post.iconUrl && (
                                <img
                                  src={post.iconUrl}
                                  alt={`${post.author} avatar`}
                                  class="w-5 h-5 rounded-full"
                                />
                              )}
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
                            </div>
                          </div>

                          <h2 class="text-2xl md:text-3xl font-bold text-text mb-4 leading-tight">
                            <a
                              href={`/blog/${post.slug}`}
                              class="hover:text-subtext0 transition-colors"
                            >
                              {post.title}
                            </a>
                          </h2>

                          <p class="text-subtext1 leading-relaxed mb-6">
                            {post.excerpt}
                          </p>

                          <div class="flex flex-wrap items-center justify-between gap-4">
                            {/* Tags */}
                            {post.tags.length > 0 && (
                              <div class="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    class="bg-surface1 text-subtext0 px-3 py-1 rounded-full text-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span class="text-subtext1 text-sm">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            <a
                              href={`/blog/${post.slug}`}
                              class="inline-flex items-center gap-2 text-blue hover:text-blue/80 font-semibold transition-colors"
                            >
                              Read More →
                            </a>
                          </div>
                        </div>
                      )}
                  </article>
                ))}
              </div>
            )
            : (
              /* No posts state */
              <div class="text-center py-20">
                <div class="text-6xl mb-6 opacity-20">📝</div>
                <h2 class="text-2xl font-bold text-text mb-4">
                  No Blog Posts Yet
                </h2>
                <p class="text-subtext1">
                  We're working on some great content. Check back soon!
                </p>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </>
  );
}
