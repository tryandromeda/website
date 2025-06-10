// DocNav.tsx
// deno-lint-ignore-file no-explicit-any no-explicit-any no-explicit-any
import Fuse from "npm:fuse.js";
import { useState } from "preact/hooks";
import { Menu } from "lucide-preact";

interface DocEntry {
  name: string;
  id: string;
  path: string;
}

interface DocTopic {
  name: string;
  children: DocEntry[];
}

export function DocNav({
  data,
  path,
}: {
  data: DocTopic[];
  path: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const fuse = new Fuse(data, {
    keys: ["name", "children.name"],
    threshold: 0.3,
  });

  const filteredData = searchTerm
    ? fuse.search(searchTerm).map((result: any) => result.item)
    : data;

  return (
    <div>
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Toggle navigation"
        class="md:hidden p-3 fixed top-4 left-4 z-50 bg-base border border-surface0 rounded-lg shadow-sm text-text hover:bg-mantle transition-colors"
        onClick={toggleNav}
      >
        <Menu size={24} />
      </button>

      {/* Navigation sidebar - Fixed on desktop, sliding on mobile */}
      <nav
        class={`
          fixed top-0 left-0 h-full w-80 bg-base border-r border-surface0 flex flex-col z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          transition-transform duration-300
        `}
      >
        <div class="px-6 py-4">
          <div class="flex items-center space-x-3 mb-6 pt-16 md:pt-4">
            <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
            <h1 class="text-xl font-bold text-text">
              <a href="/">Andromeda</a>
            </h1>
          </div>

          <div class="mb-6">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm((e.target as any).value)}
              class="w-full px-3 py-2 rounded-lg border border-surface1 bg-base text-text placeholder-subtext0 focus:outline-none focus:ring-2 focus:ring-crust focus:border-transparent"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-6">
          {filteredData.length > 0
            ? filteredData.map(({
              name: topicName,
              children: topicChildren,
            }: any) => (
              <div class="mb-6" key={topicName}>
                <span class="text-sm font-semibold uppercase text-subtext0 tracking-wider">
                  {topicName}
                </span>
                <ul class="mt-3 space-y-1">
                  {topicChildren.map(({
                    name: routeName,
                    path: routePath,
                    id: routeId,
                  }: any, i: number) => {
                    return (
                      <li key={routeId}>
                        <a
                          href={routePath}
                          class={`block py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                            path === routePath
                              ? "bg-crust text-text font-medium"
                              : "text-subtext1 hover:bg-mantle hover:text-text"
                          }`}
                        >
                          {i + 1}. {routeName}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
            : (
              <div class="text-subtext0 text-sm text-center py-8">
                No results found
              </div>
            )}
        </div>

        <div class="px-6 py-4 border-t border-surface0">
          <a
            href="/"
            class="block text-sm text-subtext1 hover:text-text transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleNav}
        />
      )}
    </div>
  );
}
