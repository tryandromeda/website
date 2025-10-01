import { Search } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import SearchComponent from "./SearchComponent.tsx";

interface SearchTriggerProps {
  variant?: "navbar" | "inline" | "button";
  className?: string;
}

export default function SearchTrigger(
  { variant = "navbar", className = "" }: SearchTriggerProps,
) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Open search with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  const handleTriggerSearch = (_e: CustomEvent) => {
    setIsSearchOpen(true);
    // The query will be handled by the SearchComponent
  };

  useEffect(() => {
    // Add global keyboard listener
    document.addEventListener("keydown", handleKeyDown);
    // Add custom search event listener
    addEventListener(
      "triggerSearch",
      handleTriggerSearch as EventListener,
    );

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      removeEventListener(
        "triggerSearch",
        handleTriggerSearch as EventListener,
      );
    };
  }, []);

  const renderTrigger = () => {
    switch (variant) {
      case "navbar":
        return (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            class={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-subtext1 hover:text-text transition-colors border border-surface1 rounded-lg hover:border-surface2 bg-surface0/50 ${className}`}
          >
            <Search class="w-3 h-3 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline text-sm">Search</span>
            <div class="hidden sm:flex items-center gap-1 ml-2">
              <kbd class="bg-surface1 text-subtext1 px-1.5 py-0.5 rounded text-xs">
                {typeof navigator !== "undefined" &&
                    navigator.platform?.toLowerCase().includes("mac") ?
                  "⌘" :
                  "Ctrl"}
              </kbd>
              <kbd class="bg-surface1 text-subtext1 px-1.5 py-0.5 rounded text-xs">
                K
              </kbd>
            </div>
          </button>
        );

      case "inline":
        return (
          <div
            onClick={() => setIsSearchOpen(true)}
            class={`cursor-pointer flex items-center gap-3 p-4 bg-surface0 hover:bg-surface1 transition-colors border border-surface1 rounded-xl ${className}`}
          >
            <div class="flex items-center justify-center w-10 h-10 bg-blue/20 rounded-lg">
              <Search size={20} class="text-blue" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-text mb-1">Search Documentation</h3>
              <p class="text-sm text-subtext1">
                Find APIs, guides, examples, and more
              </p>
            </div>
            <div class="flex items-center gap-1">
              <kbd class="bg-surface1 text-subtext1 px-2 py-1 rounded text-xs">
                {typeof navigator !== "undefined" &&
                    navigator.platform?.toLowerCase().includes("mac") ?
                  "⌘" :
                  "Ctrl"}
              </kbd>
              <kbd class="bg-surface1 text-subtext1 px-2 py-1 rounded text-xs">
                K
              </kbd>
            </div>
          </div>
        );

      case "button":
        return (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            class={`inline-flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue/90 text-white rounded-lg transition-colors font-medium ${className}`}
          >
            <Search size={16} />
            Search
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderTrigger()}
      <SearchComponent
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        autoFocus
      />
    </>
  );
}
