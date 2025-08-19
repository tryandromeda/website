import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";
import SearchTrigger from "../islands/SearchTrigger.tsx";

export default function SearchPage() {
  return (
    <>
      <NavBar />

      <main class="pt-32 pb-20 px-4 min-h-screen bg-base">
        <div class="container mx-auto max-w-4xl">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4 text-text">
              Search Documentation
            </h1>
            <p class="text-xl text-subtext1 max-w-2xl mx-auto">
              Find APIs, guides, examples, and everything you need to build with
              Andromeda
            </p>
          </div>

          {/* Featured Search */}
          <div class="mb-12">
            <SearchTrigger variant="inline" className="max-w-2xl mx-auto" />
          </div>

          {/* Search Tips */}
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div class="bg-surface0 rounded-xl p-6 border border-surface1">
              <h3 class="text-lg font-semibold text-text mb-4">Search Tips</h3>
              <ul class="space-y-2 text-subtext1">
                <li class="flex items-start gap-2">
                  <span class="text-blue">•</span>
                  <span>
                    Use specific keywords like "canvas", "fetch", or "file
                    system"
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue">•</span>
                  <span>
                    Search for code examples with terms like "example" or
                    "tutorial"
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue">•</span>
                  <span>
                    Find API documentation by searching for function names
                  </span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue">•</span>
                  <span>
                    Use keyboard shortcuts:{" "}
                    <kbd class="bg-surface1 px-2 py-1 rounded text-xs">
                      Ctrl+K
                    </kbd>{" "}
                    (or{" "}
                    <kbd class="bg-surface1 px-2 py-1 rounded text-xs">⌘K</kbd>
                    {" "}
                    on Mac)
                  </span>
                </li>
              </ul>
            </div>

            <div class="bg-surface0 rounded-xl p-6 border border-surface1">
              <h3 class="text-lg font-semibold text-text mb-4">
                Popular Searches
              </h3>
              <div class="flex flex-wrap gap-2">
                {[
                  "Canvas API",
                  "File System",
                  "Fetch",
                  "Installation",
                  "TypeScript",
                  "Getting Started",
                  "Web APIs",
                  "Performance",
                  "Examples",
                  "CLI Reference",
                ].map((term) => (
                  <a
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    class="bg-surface1 hover:bg-surface2 text-text px-3 py-1 rounded-lg text-sm transition-colors inline-block"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div class="grid md:grid-cols-3 gap-6">
            <a
              href="/docs/index"
              class="block p-6 bg-surface0 hover:bg-surface1 rounded-xl border border-surface1 transition-colors"
            >
              <h3 class="text-lg font-semibold text-text mb-2">
                📚 Documentation
              </h3>
              <p class="text-subtext1">Complete guides and references</p>
            </a>

            <a
              href="/docs/api/index"
              class="block p-6 bg-surface0 hover:bg-surface1 rounded-xl border border-surface1 transition-colors"
            >
              <h3 class="text-lg font-semibold text-text mb-2">
                🔧 API Reference
              </h3>
              <p class="text-subtext1">Detailed API documentation</p>
            </a>

            <a
              href="/docs/examples/index"
              class="block p-6 bg-surface0 hover:bg-surface1 rounded-xl border border-surface1 transition-colors"
            >
              <h3 class="text-lg font-semibold text-text mb-2">💡 Examples</h3>
              <p class="text-subtext1">Code samples and tutorials</p>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
