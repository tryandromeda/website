import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { formatDate, getAllBlogPosts } from "../../utils/blog.ts";

export default async function Blog() {
  const posts = await getAllBlogPosts();

  return (
    <div class="min-h-screen bg-base text-text">
      <NavBar />
      <main class="pt-20 pb-20">
        <div class="container mx-auto px-6 max-w-7xl">
          {/* Enhanced blog header with gradient background */}
          <header class="relative text-center mb-20 py-16">
            <div class="absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-mauve/5 rounded-3xl">
            </div>
            <div class="relative z-10">
              <div class="inline-flex items-center gap-2 bg-blue/10 text-blue px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue/20">
                <span class="w-2 h-2 bg-blue rounded-full animate-pulse"></span>
                Latest Articles
              </div>
              <h1 class="text-5xl md:text-7xl font-bold text-text mb-8 tracking-tight">
                Blog
              </h1>
              <p class="text-xl md:text-2xl text-subtext1 max-w-4xl mx-auto leading-relaxed mb-10 font-light">
                Latest updates, insights, and technical deep-dives from the
                Andromeda team. Discover how we're building the future of
                JavaScript runtimes.
              </p>
              {/* Enhanced RSS/Atom feed links */}
              <div class="flex flex-wrap justify-center gap-3">
                <a
                  href="/blog/rss.xml"
                  class="group inline-flex items-center gap-2 bg-surface0/50 hover:bg-surface1 text-subtext1 hover:text-text px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-surface1/50 hover:border-surface2 backdrop-blur-sm hover:scale-105"
                  title="Subscribe to RSS feed"
                >
                  <span class="text-base group-hover:scale-110 transition-transform duration-300">
                    📡
                  </span>
                  RSS Feed
                </a>
                <a
                  href="/blog/atom.xml"
                  class="group inline-flex items-center gap-2 bg-surface0/50 hover:bg-surface1 text-subtext1 hover:text-text px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-surface1/50 hover:border-surface2 backdrop-blur-sm hover:scale-105"
                  title="Subscribe to Atom feed"
                >
                  <span class="text-base group-hover:scale-110 transition-transform duration-300">
                    ⚛️
                  </span>
                  Atom Feed
                </a>
                <a
                  href="/blog/feed.json"
                  class="group inline-flex items-center gap-2 bg-surface0/50 hover:bg-surface1 text-subtext1 hover:text-text px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-surface1/50 hover:border-surface2 backdrop-blur-sm hover:scale-105"
                  title="Subscribe to JSON feed"
                >
                  <span class="text-base group-hover:scale-110 transition-transform duration-300">
                    📄
                  </span>
                  JSON Feed
                </a>
              </div>
            </div>
          </header>

          {/* Enhanced blog posts grid */}
          {posts.length > 0
            ? (
              <div class="space-y-12">
                {posts.map((post, index) => (
                  <article
                    key={post.slug}
                    class={`group relative bg-gradient-to-br from-surface0/30 to-surface0/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-surface1/30 hover:border-blue/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue/5 ${
                      index === 0
                        ? "lg:grid lg:grid-cols-2 lg:gap-0 lg:min-h-[500px]"
                        : ""
                    }`}
                  >
                    {/* Featured post layout for first post */}
                    {index === 0
                      ? (
                        <>
                          <div class="relative p-8 lg:p-12 flex flex-col justify-center">
                            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue via-mauve to-blue">
                            </div>

                            <div class="flex items-center gap-3 text-sm mb-6">
                              <span class="bg-gradient-to-r from-blue to-mauve text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg">
                                ✨ Featured
                              </span>
                              <time class="text-subtext1 font-medium">
                                {formatDate(post.date)}
                              </time>
                            </div>

                            <h2 class="text-3xl lg:text-5xl font-bold text-text mb-6 leading-tight tracking-tight group-hover:text-blue transition-colors duration-300">
                              <a
                                href={`/blog/${post.slug}`}
                                class="hover:text-blue transition-colors duration-300"
                              >
                                {post.title}
                              </a>
                            </h2>

                            <p class="text-subtext1 text-lg lg:text-xl leading-relaxed mb-8 font-light">
                              {post.excerpt}
                            </p>

                            <div class="flex flex-wrap items-center justify-between gap-6 mb-8">
                              <div class="flex items-center gap-3 text-subtext1">
                                {post.iconUrl && (
                                  <div class="relative">
                                    <img
                                      src={post.iconUrl}
                                      alt={`${post.author} avatar`}
                                      class="w-10 h-10 rounded-full ring-2 ring-surface1 group-hover:ring-blue/30 transition-all duration-300"
                                    />
                                    <div class="absolute inset-0 rounded-full bg-gradient-to-br from-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                  </div>
                                )}
                                {!post.iconUrl && (
                                  <span class="text-2xl">👤</span>
                                )}
                                <div>
                                  {post.authorUrl
                                    ? (
                                      <a
                                        href={post.authorUrl}
                                        class="font-medium hover:text-blue transition-colors duration-300"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {post.author}
                                      </a>
                                    )
                                    : (
                                      <span class="font-medium">
                                        {post.author}
                                      </span>
                                    )}
                                  <div class="text-sm text-subtext0">
                                    Article Author
                                  </div>
                                </div>
                              </div>

                              <a
                                href={`/blog/${post.slug}`}
                                class="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-blue to-mauve hover:from-blue/80 hover:to-mauve/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                Read Full Article
                                <span class="group-hover/btn:translate-x-1 transition-transform duration-300">
                                  →
                                </span>
                              </a>
                            </div>

                            {/* Enhanced tags */}
                            {post.tags.length > 0 && (
                              <div class="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    class="bg-surface1/50 hover:bg-surface2/50 text-subtext0 hover:text-text px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-surface1/30 hover:border-surface2/50 backdrop-blur-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div class="relative bg-gradient-to-br from-blue/10 via-mauve/10 to-blue/10 p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-full">
                            <div class="text-8xl lg:text-9xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                              📝
                            </div>
                            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue/5 to-mauve/5">
                            </div>
                          </div>
                        </>
                      )
                      : (
                        /* Enhanced regular post layout */
                        <div class="p-8 lg:p-10">
                          <div class="flex items-center gap-4 text-sm text-subtext1 mb-6">
                            <time class="bg-surface1/50 px-3 py-1.5 rounded-lg font-medium">
                              {formatDate(post.date)}
                            </time>
                            <span class="w-1 h-1 bg-surface2 rounded-full">
                            </span>
                            <div class="flex items-center gap-3">
                              {post.iconUrl && (
                                <img
                                  src={post.iconUrl}
                                  alt={`${post.author} avatar`}
                                  class="w-6 h-6 rounded-full ring-1 ring-surface1"
                                />
                              )}
                              {post.authorUrl
                                ? (
                                  <a
                                    href={post.authorUrl}
                                    class="font-medium hover:text-blue transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {post.author}
                                  </a>
                                )
                                : <span class="font-medium">{post.author}
                                </span>}
                            </div>
                          </div>

                          <h2 class="text-2xl lg:text-3xl font-bold text-text mb-4 leading-tight tracking-tight group-hover:text-blue transition-colors duration-300">
                            <a
                              href={`/blog/${post.slug}`}
                              class="hover:text-blue transition-colors duration-300"
                            >
                              {post.title}
                            </a>
                          </h2>

                          <p class="text-subtext1 leading-relaxed mb-8 text-lg font-light">
                            {post.excerpt}
                          </p>

                          <div class="flex flex-wrap items-center justify-between gap-6">
                            {/* Enhanced tags */}
                            {post.tags.length > 0 && (
                              <div class="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    class="bg-surface1/50 hover:bg-surface2/50 text-subtext0 hover:text-text px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border border-surface1/30 hover:border-surface2/50"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 3 && (
                                  <span class="text-subtext1 text-sm bg-surface1/30 px-3 py-1.5 rounded-lg border border-surface1/30">
                                    +{post.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            <a
                              href={`/blog/${post.slug}`}
                              class="group/link inline-flex items-center gap-2 text-blue hover:text-blue/80 font-semibold transition-all duration-300 bg-blue/10 hover:bg-blue/20 px-4 py-2 rounded-lg"
                            >
                              Read More
                              <span class="group-hover/link:translate-x-1 transition-transform duration-300">
                                →
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                  </article>
                ))}
              </div>
            )
            : (
              /* Enhanced no posts state */
              <div class="text-center py-32">
                <div class="relative mb-8">
                  <div class="text-8xl mb-6 opacity-20">📝</div>
                  <div class="absolute inset-0 bg-gradient-to-br from-blue/5 to-mauve/5 rounded-full blur-3xl">
                  </div>
                </div>
                <h2 class="text-3xl font-bold text-text mb-6">
                  No Blog Posts Yet
                </h2>
                <p class="text-subtext1 text-lg max-w-md mx-auto leading-relaxed">
                  We're working on some great content. Check back soon for
                  insights and updates!
                </p>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
