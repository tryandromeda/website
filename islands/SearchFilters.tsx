// deno-lint-ignore-file no-explicit-any
import {
  BookOpen,
  ChevronDown,
  Code,
  FileText,
  Filter,
  Hash,
  MessageSquare,
  X,
} from "lucide-preact";
import { useState } from "preact/hooks";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

interface SearchFilters {
  type?: "doc" | "api" | "example" | "blog";
  tags?: string[];
  dateRange?: { from?: Date; to?: Date };
  minWordCount?: number;
  sortBy?: "relevance" | "date" | "title" | "wordCount";
}

export default function SearchFilters(
  { onFiltersChange, currentFilters }: SearchFiltersProps,
) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(
    currentFilters,
  );

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...localFilters, ...newFilters };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  const typeOptions = [
    {
      value: "doc",
      label: "Documentation",
      icon: BookOpen,
      color: "text-blue",
    },
    { value: "api", label: "API Reference", icon: Code, color: "text-green" },
    {
      value: "example",
      label: "Examples",
      icon: FileText,
      color: "text-yellow",
    },
    {
      value: "blog",
      label: "Blog Posts",
      icon: MessageSquare,
      color: "text-mauve",
    },
  ];

  const popularTags = [
    "typescript",
    "javascript",
    "installation",
    "performance",
    "configuration",
    "debugging",
    "http",
    "file-system",
    "graphics",
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "date", label: "Date Modified" },
    { value: "title", label: "Title" },
    { value: "wordCount", label: "Length" },
  ];

  return (
    <div class="bg-surface0 rounded-xl border border-surface1 overflow-hidden">
      {/* Filter Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        class="w-full flex items-center justify-between p-4 text-left hover:bg-surface1 transition-colors"
      >
        <div class="flex items-center gap-2">
          <Filter size={16} class="text-blue" />
          <span class="font-medium text-text">Search Filters</span>
          {hasActiveFilters && (
            <span class="bg-blue text-white text-xs px-2 py-0.5 rounded-full">
              {Object.keys(localFilters).length}
            </span>
          )}
        </div>
        <div class="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              class="text-xs text-red hover:underline"
            >
              Clear
            </button>
          )}
          <ChevronDown
            size={16}
            class={`text-subtext1 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div class="border-t border-surface1 p-4 space-y-6">
          {/* Content Type Filter */}
          <div>
            <label class="block text-sm font-medium text-text mb-3">
              Content Type
            </label>
            <div class="grid grid-cols-2 gap-2">
              {typeOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() =>
                    updateFilters({
                      type: localFilters.type === option.value
                        ? undefined
                        : option.value as any,
                    })}
                  class={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    localFilters.type === option.value
                      ? "border-blue bg-blue/10 text-blue"
                      : "border-surface1 hover:border-surface2 text-subtext1 hover:text-text"
                  }`}
                >
                  <option.icon
                    size={16}
                    class={localFilters.type === option.value
                      ? "text-blue"
                      : option.color}
                  />
                  <span class="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label class="block text-sm font-medium text-text mb-3">
              Popular Tags
            </label>
            <div class="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => {
                    const currentTags = localFilters.tags || [];
                    const newTags = currentTags.includes(tag)
                      ? currentTags.filter((t) => t !== tag)
                      : [...currentTags, tag];
                    updateFilters({
                      tags: newTags.length > 0 ? newTags : undefined,
                    });
                  }}
                  class={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-all ${
                    localFilters.tags?.includes(tag)
                      ? "border-blue bg-blue/10 text-blue"
                      : "border-surface1 hover:border-surface2 text-subtext1 hover:text-text"
                  }`}
                >
                  <Hash size={12} />
                  {tag}
                  {localFilters.tags?.includes(tag) && (
                    <X size={12} class="ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Word Count Filter */}
          <div>
            <label class="block text-sm font-medium text-text mb-3">
              Minimum Content Length
            </label>
            <div class="flex gap-2">
              {[100, 300, 500, 1000].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() =>
                    updateFilters({
                      minWordCount: localFilters.minWordCount === count
                        ? undefined
                        : count,
                    })}
                  class={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    localFilters.minWordCount === count
                      ? "border-blue bg-blue/10 text-blue"
                      : "border-surface1 hover:border-surface2 text-subtext1 hover:text-text"
                  }`}
                >
                  {count}+ words
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label class="block text-sm font-medium text-text mb-3">
              Sort By
            </label>
            <select
              value={localFilters.sortBy || "relevance"}
              onChange={(e: any) =>
                updateFilters({ sortBy: e!.target!.value })}
              class="w-full px-3 py-2 bg-surface1 border border-surface2 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label class="block text-sm font-medium text-text mb-3">
              Date Range
            </label>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs text-subtext1 mb-1">From</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.from?.toISOString().split(
                    "T",
                  )[0] || ""}
                  onChange={(e: any) => {
                    const from = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    updateFilters({
                      dateRange: { ...localFilters.dateRange, from },
                    });
                  }}
                  class="w-full px-2 py-1.5 bg-surface1 border border-surface2 rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue/50"
                />
              </div>
              <div>
                <label class="block text-xs text-subtext1 mb-1">To</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.to?.toISOString().split(
                    "T",
                  )[0] || ""}
                  onChange={(e: any) => {
                    const to = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    updateFilters({
                      dateRange: { ...localFilters.dateRange, to },
                    });
                  }}
                  class="w-full px-2 py-1.5 bg-surface1 border border-surface2 rounded text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
