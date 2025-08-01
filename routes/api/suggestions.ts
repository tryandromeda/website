import type { Handlers } from "fresh";

const suggestions = [
  "Installation Guide",
  "Quick Start", 
  "Fetch API",
  "File System API",
  "Canvas API",
  "Console API",
  "Performance",
  "TypeScript",
  "Examples",
  "Configuration",
  "Debugging",
  "CLI Reference",
  "Web APIs",
  "Graphics",
  "HTTP requests",
  "File operations",
  "Getting started"
];

export const handler: Handlers = {
  GET(req: Request) {
    console.log("Suggestions handler called with GET method, URL:", req.url);
    
    if (!req || !req.url) {
      return new Response(
        JSON.stringify({ error: "Invalid request", suggestions: [] }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const limit = parseInt(url.searchParams.get("limit") || "8");

    if (!query) {
      return new Response(
        JSON.stringify({ 
          error: "Query parameter 'q' is required",
          suggestions: []
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const queryLower = query.toLowerCase();
      const filteredSuggestions = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(queryLower)
        )
        .slice(0, limit);

      return new Response(
        JSON.stringify({
          query,
          suggestions: filteredSuggestions
        }),
        {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        }
      );
    } catch (error) {
      console.error("Suggestions API error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Internal server error",
          suggestions: []
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
};
