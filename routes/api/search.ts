interface SearchResult {
  title: string;
  url: string;
  excerpt: string;
  type: "doc" | "api" | "example" | "blog";
  score: number;
  highlights: string[];
}

const searchIndex = [
  {
    title: "Installation Guide",
    url: "/docs/installation",
    excerpt:
      "Learn how to install Andromeda on your system with various methods including cargo install.",
    type: "doc" as const,
    keywords: ["install", "installation", "setup", "cargo", "rust"],
  },
  {
    title: "Quick Start",
    url: "/docs/quick-start",
    excerpt:
      "Get started with Andromeda quickly. Learn the basics and run your first JavaScript code.",
    type: "doc" as const,
    keywords: ["quick", "start", "getting started", "tutorial", "basics"],
  },
  {
    title: "Canvas API",
    url: "/docs/api/canvas",
    excerpt:
      "Graphics and drawing capabilities with Canvas API for creating visual content and games.",
    type: "api" as const,
    keywords: ["canvas", "graphics", "drawing", "visual", "games", "2d"],
  },
  {
    title: "File System API",
    url: "/docs/api/file-system",
    excerpt:
      "Read and write files, work with directories, and manage file system operations.",
    type: "api" as const,
    keywords: ["file", "filesystem", "fs", "directory", "read", "write"],
  },
  {
    title: "Fetch API",
    url: "/docs/api/fetch",
    excerpt:
      "Make HTTP requests and handle responses with the standard Fetch API.",
    type: "api" as const,
    keywords: ["fetch", "http", "request", "api", "network", "web"],
  },
  {
    title: "Crypto API",
    url: "/docs/api/crypto",
    excerpt:
      "Cryptographic functions for hashing, encryption, and secure random number generation.",
    type: "api" as const,
    keywords: ["crypto", "encryption", "hash", "security", "random"],
  },
  {
    title: "Performance API",
    url: "/docs/api/performance",
    excerpt:
      "Measure and optimize performance with timing and profiling capabilities.",
    type: "api" as const,
    keywords: [
      "performance",
      "timing",
      "profiling",
      "benchmark",
      "optimization",
    ],
  },
  {
    title: "SQLite Example",
    url: "/docs/examples/sqlite",
    excerpt:
      "Learn how to work with SQLite databases in Andromeda with practical examples.",
    type: "example" as const,
    keywords: ["sqlite", "database", "sql", "data", "storage"],
  },
  {
    title: "FizzBuzz Example",
    url: "/docs/examples/fizzbuzz",
    excerpt:
      "Classic FizzBuzz implementation showcasing basic programming concepts.",
    type: "example" as const,
    keywords: ["fizzbuzz", "example", "basic", "programming", "tutorial"],
  },
  {
    title: "Performance Benchmarks",
    url: "/docs/examples/performance",
    excerpt:
      "Performance comparison examples showing Andromeda's speed advantages.",
    type: "example" as const,
    keywords: [
      "performance",
      "benchmark",
      "speed",
      "comparison",
      "optimization",
    ],
  },
  {
    title: "Web Storage Example",
    url: "/docs/examples/web-storage",
    excerpt:
      "Working with localStorage and sessionStorage in Andromeda applications.",
    type: "example" as const,
    keywords: ["storage", "localstorage", "sessionstorage", "web", "data"],
  },
  {
    title: "CLI Reference",
    url: "/docs/cli-reference",
    excerpt: "Complete command-line interface reference for Andromeda runtime.",
    type: "doc" as const,
    keywords: ["cli", "command", "reference", "terminal", "options"],
  },
  {
    title: "Troubleshooting",
    url: "/docs/troubleshooting",
    excerpt: "Common issues and solutions when working with Andromeda.",
    type: "doc" as const,
    keywords: ["troubleshooting", "problems", "issues", "help", "debug"],
  },
  {
    title: "FAQ",
    url: "/docs/faq",
    excerpt:
      "Frequently asked questions about Andromeda runtime and development.",
    type: "doc" as const,
    keywords: ["faq", "questions", "answers", "help", "common"],
  },
  {
    title: "Building from Source",
    url: "/docs/building",
    excerpt: "Instructions for building Andromeda from source code.",
    type: "doc" as const,
    keywords: ["build", "compile", "source", "development", "rust"],
  },
  {
    title: "Testing Guide",
    url: "/docs/testing",
    excerpt:
      "How to test your Andromeda applications and contribute to the project.",
    type: "doc" as const,
    keywords: ["testing", "test", "unit", "integration", "qa"],
  },
  {
    title: "Contributing",
    url: "/docs/contributing",
    excerpt: "Guidelines for contributing to the Andromeda project.",
    type: "doc" as const,
    keywords: [
      "contributing",
      "contribute",
      "development",
      "community",
      "help",
    ],
  },
  {
    title: "Introducing Andromeda",
    url: "/blog/introducing-andromeda",
    excerpt:
      "The story behind Andromeda and why we built a new JavaScript runtime.",
    type: "blog" as const,
    keywords: [
      "introduction",
      "announcement",
      "runtime",
      "javascript",
      "story",
    ],
  },
];

function simpleSearch(query: string, limit: number = 10): SearchResult[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter((term) => term.length > 0);

  if (queryTerms.length === 0) {
    return [];
  }

  const results = searchIndex.map((item) => {
    let score = 0;
    const highlights: string[] = [];

    // Title matching (highest weight)
    if (item.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Keyword matching (high weight)
    const matchingKeywords = item.keywords.filter((keyword) =>
      queryTerms.some((term) => keyword.includes(term))
    );
    score += matchingKeywords.length * 5;

    // Excerpt matching (medium weight)
    if (item.excerpt.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Individual term matching
    queryTerms.forEach((term) => {
      if (item.title.toLowerCase().includes(term)) {
        score += 2;
      }
      if (item.excerpt.toLowerCase().includes(term)) {
        score += 1;
      }
    });

    return {
      title: item.title,
      url: item.url,
      excerpt: item.excerpt,
      type: item.type,
      score,
      highlights,
    };
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

export const handler = {
  GET(req: Request) {
    console.log("Search handler called with GET method, URL:", req.url);

    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!query) {
      return new Response(
        JSON.stringify({
          error: "Query parameter 'q' is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    try {
      const results = simpleSearch(query, limit);

      return new Response(
        JSON.stringify({
          query,
          results,
          total: results.length,
          searchMode: "basic",
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    } catch (error) {
      console.error("Search API error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
