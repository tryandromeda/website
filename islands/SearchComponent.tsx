import { useEffect, useState, useRef } from "preact/hooks";
import { Search, X, FileText, Code, BookOpen, MessageSquare, ExternalLink } from "lucide-preact";

interface SearchResult {
  title: string;
  url: string;
  excerpt: string;
  type: "doc" | "api" | "example" | "blog";
  score: number;
  highlights: SearchHighlight[];
}

interface SearchHighlight {
  field: "title" | "content" | "headings" | "codeBlocks";
  value: string;
  indices: [number, number][];
}

interface SearchProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchComponent({ 
  isOpen = false, 
  onClose, 
  autoFocus = false,
  placeholder = "Search documentation..."
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number>();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, autoFocus]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      await performSearch(query);
      if (query.length >= 2) {
        await fetchSuggestions(query);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`);
      if (!response.ok) return;

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(data.suggestions.length > 0);
    } catch (err) {
      console.error("Suggestions error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showSuggestions) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } else if (onClose) {
        onClose();
      }
      return;
    }

    const totalItems = showSuggestions ? suggestions.length : results.length;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      
      if (showSuggestions && selectedIndex >= 0) {
        // Select suggestion
        const suggestion = suggestions[selectedIndex];
        setQuery(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      } else if (!showSuggestions && selectedIndex >= 0) {
        // Navigate to result
        const result = results[selectedIndex];
        window.location.href = result.url;
      } else if (query.trim()) {
        // Perform search if no selection
        setShowSuggestions(false);
        await performSearch(query);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const highlightText = (text: string, highlight: string): string => {
    if (!highlight) return text;
    
    const regex = new RegExp(`(${highlight.split(' ').join('|')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow/30 px-1 rounded">$1</mark>');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Code size={16} class="text-blue" />;
      case "example":
        return <FileText size={16} class="text-green" />;
      case "blog":
        return <MessageSquare size={16} class="text-mauve" />;
      default:
        return <BookOpen size={16} class="text-text" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "api":
        return "API";
      case "example":
        return "Example";
      case "blog":
        return "Blog";
      default:
        return "Docs";
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div class="w-full max-w-2xl bg-base rounded-2xl shadow-2xl border border-surface1 overflow-hidden">
        {/* Search Input */}
        <div class="flex items-center gap-3 p-4 border-b border-surface1">
          <Search size={20} class="text-subtext1" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            placeholder={placeholder}
            class="flex-1 bg-transparent text-text placeholder-subtext1 outline-none text-lg"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              class="text-subtext1 hover:text-text transition-colors"
            >
              <X size={20} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              class="text-subtext1 hover:text-text transition-colors ml-2"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div ref={resultsRef} class="max-h-96 overflow-y-auto">
          {loading && (
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue border-t-transparent"></div>
              <span class="ml-2 text-subtext1">Searching...</span>
            </div>
          )}

          {error && (
            <div class="p-4 text-center text-red">
              <p>Search error: {error}</p>
              <button
                onClick={() => performSearch(query)}
                class="mt-2 text-sm text-blue hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div class="border-b border-surface1">
              <div class="px-4 py-2 text-xs text-subtext1 uppercase tracking-wide font-semibold">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  class={`w-full text-left px-4 py-2 hover:bg-surface0 transition-colors flex items-center gap-2 ${
                    selectedIndex === index ? "bg-surface0" : ""
                  }`}
                >
                  <Search size={14} class="text-subtext1" />
                  <span class="text-text">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {!showSuggestions && results.length > 0 && (
            <div>
              <div class="px-4 py-2 text-xs text-subtext1 uppercase tracking-wide font-semibold border-b border-surface1">
                Results ({results.length})
              </div>
              {results.map((result, index) => (
                <a
                  key={result.url}
                  href={result.url}
                  class={`block px-4 py-3 hover:bg-surface0 transition-colors border-b border-surface1/50 last:border-b-0 ${
                    selectedIndex === index ? "bg-surface0" : ""
                  }`}
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-1">
                      {getTypeIcon(result.type)}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 
                          class="font-semibold text-text truncate"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightText(result.title, query) 
                          }}
                        />
                        <span class="text-xs bg-surface1 text-subtext1 px-2 py-0.5 rounded-full">
                          {getTypeLabel(result.type)}
                        </span>
                        <ExternalLink size={12} class="text-subtext1" />
                      </div>
                      <p 
                        class="text-sm text-subtext1 line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(result.excerpt, query) 
                        }}
                      />
                      {result.highlights.length > 0 && (
                        <div class="mt-2 flex flex-wrap gap-1">
                          {result.highlights.slice(0, 3).map((highlight, i) => (
                            <span
                              key={i}
                              class="text-xs bg-yellow/20 text-yellow px-2 py-0.5 rounded"
                            >
                              {highlight.field}: {highlight.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !showSuggestions && query.trim() && results.length === 0 && (
            <div class="text-center py-8 text-subtext1">
              <Search size={32} class="mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p class="text-sm mt-1">Try different keywords or check the spelling</p>
            </div>
          )}

          {/* Empty State */}
          {!query.trim() && (
            <div class="text-center py-8 text-subtext1">
              <Search size={32} class="mx-auto mb-2 opacity-50" />
              <p>Start typing to search documentation...</p>
              <div class="mt-4 text-xs space-y-1">
                <p><kbd class="bg-surface1 px-2 py-1 rounded text-xs">↑</kbd> <kbd class="bg-surface1 px-2 py-1 rounded text-xs">↓</kbd> to navigate</p>
                <p><kbd class="bg-surface1 px-2 py-1 rounded text-xs">Enter</kbd> to select</p>
                <p><kbd class="bg-surface1 px-2 py-1 rounded text-xs">Esc</kbd> to close</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
