import { ChevronDown, ChevronUp } from "lucide-preact";
import { useState } from "preact/hooks";

interface QuickNavProps {
  sections: Array<{ name: string; path: string }>;
  currentPath: string;
}

export function QuickNav({ sections, currentPath }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentIndex = sections.findIndex((section) =>
    section.path === currentPath
  );
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1
    ? sections[currentIndex + 1]
    : null;

  return (
    <div class="fixed bottom-6 right-6 z-20">
      <div
        class={`transform transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {isOpen && (
          <div class="mb-4 bg-base/95 backdrop-blur-xl border border-surface1 rounded-xl shadow-xl p-4 min-w-[200px]">
            <div class="space-y-3">
              {previousSection && (
                <a
                  href={previousSection.path}
                  class="flex items-center space-x-2 text-sm text-subtext1 hover:text-text transition-colors p-2 rounded-lg hover:bg-surface0/50"
                >
                  <ChevronUp size={16} />
                  <span>Previous: {previousSection.name}</span>
                </a>
              )}
              {nextSection && (
                <a
                  href={nextSection.path}
                  class="flex items-center space-x-2 text-sm text-subtext1 hover:text-text transition-colors p-2 rounded-lg hover:bg-surface0/50"
                >
                  <ChevronDown size={16} />
                  <span>Next: {nextSection.name}</span>
                </a>
              )}
              {!previousSection && !nextSection && (
                <div class="text-sm text-subtext0">No navigation available</div>
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="bg-surface1 hover:bg-surface2 text-text p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 border border-surface0"
        title="Quick Navigation"
      >
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>
    </div>
  );
}
