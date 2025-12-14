// deno-lint-ignore-file no-explicit-any no-explicit-any no-explicit-any
import { ArrowLeft, ExternalLink, Menu, Search, X } from "lucide-preact";
import Fuse from "npm:fuse.js@7.0.0";
import { useEffect, useState } from "preact/hooks";

interface DocEntry {
  name: string;
  id: string;
  path: string;
}

interface DocTopic {
  name: string;
  children: DocEntry[];
}

const iconMap: Record<string, any> = {
  "Getting Started": "🚀",
  "API Reference": "⚡",
  "Examples": "📝",
  "Development": "🔧",
  "Help & Support": "🆘",
};

export function DocNav({
  data,
  path,
}: {
  data: DocTopic[];
  path: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  // Auto-expand section containing current page
  useEffect(() => {
    const currentSection = data.find((section) =>
      section.children.some((child) => child.path === path)
    );
    if (currentSection) {
      setExpandedSections((prev) => new Set([...prev, currentSection.name]));
    }
  }, [path, data]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  const fuse = new Fuse(
    data.flatMap((section) =>
      section.children.map((child) => ({
        ...child,
        section: section.name,
        sectionIcon: iconMap[section.name] || "📄",
      }))
    ),
    {
      keys: ["name", "section"],
      threshold: 0.3,
      includeScore: true,
    },
  );

  const searchResults = searchTerm ?
    fuse.search(searchTerm).map((result: any) => result.item) :
    null;

  const filteredData = searchTerm ? [] : data;

  return (
    <div>
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Toggle navigation"
        class="md:hidden p-3 fixed top-4 left-4 z-50 bg-base border border-surface0 rounded-lg shadow-lg text-text hover:bg-surface0 transition-all duration-200"
        onClick={toggleNav}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation sidebar - Fixed on desktop, sliding on mobile */}
      <nav
        class={`
          fixed top-0 left-0 h-full w-80 bg-base border-r border-surface0 flex flex-col z-40 shadow-lg
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header */}
        <div class="px-6 py-4 border-b border-surface0/50">
          <div class="flex items-center justify-between mb-6 pt-16 md:pt-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-surface1 rounded-xl flex items-center justify-center shadow-sm border border-surface0">
                <img src="/logo.svg" alt="Andromeda" class="w-6 h-6" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-text">
                  <a href="/" class="hover:text-subtext0 transition-colors">
                    Andromeda
                  </a>
                </h1>
                <p class="text-xs text-subtext0">Documentation</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeNav}
              class="md:hidden p-2 hover:bg-surface0 rounded-lg transition-colors"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search */}
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-subtext0"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm((e.target as any).value)}
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-surface1 bg-surface0 text-text placeholder-subtext0 focus:outline-none focus:ring-2 focus:ring-text/20 focus:border-text transition-all duration-200"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-subtext0 hover:text-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation content */}
        <div class="flex-1 overflow-y-auto px-6 py-4">
          {searchResults ?
            (
              /* Search results */
              searchResults.length > 0 ?
                (
                  <div class="space-y-1">
                    <div class="text-xs font-semibold uppercase text-subtext0 tracking-wider mb-3">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((result: any) => (
                      <a
                        key={result.id}
                        href={result.path}
                        onClick={closeNav}
                        class={`flex items-center space-x-3 py-3 px-4 rounded-lg text-sm transition-all duration-200 ${
                          path === result.path ?
                            "bg-surface1 text-text font-medium border border-surface2" :
                            "text-subtext1 hover:bg-surface0/50 hover:text-text"
                        }`}
                      >
                        <span class="text-lg">{result.sectionIcon}</span>
                        <div class="flex-1 min-w-0">
                          <div class="font-medium truncate">{result.name}</div>
                          <div class="text-xs text-subtext0 truncate">
                            {result.section}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) :
                (
                  <div class="text-center py-12">
                    <div class="text-4xl mb-3">🔍</div>
                    <div class="text-subtext0 text-sm">No results found</div>
                    <div class="text-subtext1 text-xs mt-1">
                      Try a different search term
                    </div>
                  </div>
                )
            ) :
            (
              /* Regular navigation */
              <div class="space-y-2">
                {filteredData.map(
                  ({ name: topicName, children: topicChildren }: any) => {
                    const isExpanded = expandedSections.has(topicName);
                    const hasCurrentPage = topicChildren.some((child: any) =>
                      child.path === path
                    );

                    return (
                      <div key={topicName} class="space-y-1">
                        <button
                          type="button"
                          onClick={() => toggleSection(topicName)}
                          class={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            hasCurrentPage ?
                              "bg-surface0/50 text-text" :
                              "text-subtext0 hover:bg-surface0/30 hover:text-text"
                          }`}
                        >
                          <div class="flex items-center space-x-3">
                            <span class="text-lg">
                              {iconMap[topicName] || "📄"}
                            </span>
                            <span class="uppercase tracking-wider">
                              {topicName}
                            </span>
                          </div>
                          <span
                            class={`transform transition-transform duration-200 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          >
                            ›
                          </span>
                        </button>

                        {isExpanded && (
                          <div class="ml-4 space-y-1 border-l-2 border-surface1/50 pl-4">
                            {topicChildren.map((
                              { name: routeName, path: routePath, id: routeId }:
                                any,
                            ) => (
                              <a
                                key={routeId}
                                href={routePath}
                                onClick={closeNav}
                                class={`block py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
                                  path === routePath ?
                                    "bg-surface1 text-text font-medium border border-surface2 shadow-sm" :
                                    "text-subtext1 hover:bg-surface0/50 hover:text-text hover:translate-x-1"
                                }`}
                              >
                                {routeName}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}
        </div>

        {/* Footer */}
        <div class="px-6 py-4 border-t border-surface0/50 bg-surface0/20">
          <div class="space-y-3">
            <a
              href="/"
              class="flex items-center space-x-2 text-sm text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </a>
            <div class="flex items-center space-x-4 text-xs text-subtext0">
              <a
                href="https://github.com/tryandromeda/andromeda"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 hover:text-text transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://discord.gg/tgjAnX2Ny3"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-1 hover:text-text transition-colors"
              >
                <span>Discord</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={closeNav}
        />
      )}
    </div>
  );
}
