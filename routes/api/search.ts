import { getTableOfContents, parseFrontmatter } from "../../utils/docs.ts";

interface SearchResult {
  title: string;
  url: string;
  excerpt: string;
  type: "doc" | "api" | "example" | "blog" | "std";
  score: number;
  highlights: string[];
}

interface RawIndexItem {
  title: string;
  url: string;
  excerpt: string;
  type: SearchResult["type"];
  keywords?: string[];
  body?: string;
}

interface GitTreeItem {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  url?: string;
}
let indexCache: SearchResult[] | null = null;
let lastIndexTime = 0;
const INDEX_CACHE_DURATION = 60 * 1000; // 60s

async function buildIndex(): Promise<SearchResult[]> {
  const now = Date.now();
  if (indexCache && now - lastIndexTime < INDEX_CACHE_DURATION) {
    return indexCache;
  }

  const items: RawIndexItem[] = [];

  try {
    const sections = await getTableOfContents();
    for (const sec of sections) {
      for (const doc of sec.children) {
        items.push({
          title: doc.title,
          url: doc.path,
          excerpt: doc.description || "",
          type: doc.section && doc.section.toLowerCase().includes("example")
            ? "example"
            : "doc",
          keywords: [doc.section, doc.id, doc.title].filter(Boolean).map(
            (s) => String(s).toLowerCase(),
          ),
        });
      }
    }
  } catch (err) {
    console.warn("Failed to build docs index:", err);
  }

  try {
    for await (const entry of Deno.readDir("static/content/blog")) {
      if (!entry.isFile) continue;
      if (!entry.name.endsWith(".md")) continue;
      try {
        const full = `static/content/blog/${entry.name}`;
        const content = await Deno.readTextFile(full);
        const { meta, content: body } = parseFrontmatter(content);
        const filename = entry.name.replace(/\.md$/, "");
        items.push({
          title: (meta.title as string) || filename,
          url: `/blog/${filename}`,
          excerpt: (meta.description as string) || body.slice(0, 200),
          type: "blog",
          keywords: [filename, meta.title, meta.description]
            .filter(Boolean)
            .map((s) => String(s).toLowerCase()),
          body,
        });
      } catch (e) {
        console.warn("Failed to read blog post:", entry.name, e);
      }
    }
  } catch (_e) {
    // no blog dir - ignore
  }
  try {
    const OWNER = "tryandromeda";
    const REPO = "std";
    const BRANCH = "main";
    const treeUrl =
      `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (Deno.env.get("GITHUB_TOKEN")) {
      headers["Authorization"] = `token ${Deno.env.get("GITHUB_TOKEN")}`;
    }

    const treeRes = await fetch(treeUrl, { headers });
    if (treeRes.ok) {
      const treeJson = await treeRes.json();
      if (treeJson && Array.isArray(treeJson.tree)) {
        const mdFiles = (treeJson.tree as GitTreeItem[])
          .filter((it) => it.path && it.path.endsWith(".md"))
          .slice(0, 500);
        for (const f of mdFiles) {
          try {
            const rawUrl =
              `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${f.path}`;
            const r = await fetch(rawUrl);
            if (!r.ok) continue;
            const txt = await r.text();
            const { meta, content: body } = parseFrontmatter(txt);
            const title = (meta.title as string) ||
              f.path!.split("/").pop()!.replace(".md", "");
            items.push({
              title,
              url: `/std/${f.path}`,
              excerpt: (meta.description as string) || body.slice(0, 200),
              type: "std",
              keywords: [meta.title, meta.description, f.path]
                .filter(Boolean)
                .map((s) => String(s).toLowerCase()),
              body,
            });
          } catch (_e) {
            // ignore single file failures
          }
        }
      }
    }
  } catch (e) {
    console.warn("Failed to index std repo:", e);
  }

  const results: SearchResult[] = items.map((it) => ({
    title: it.title,
    url: it.url,
    excerpt: it.excerpt || "",
    type: it.type,
    score: 0,
    highlights: [],
  }));

  indexCache = results;
  lastIndexTime = Date.now();
  return results;
}

function scoreAndFilter(results: SearchResult[], query: string, limit = 10) {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = results.map((r) => {
    let score = 0;
    const lowTitle = r.title.toLowerCase();
    const lowExcerpt = r.excerpt.toLowerCase();

    if (lowTitle.includes(q)) score += 20;
    if (lowExcerpt.includes(q)) score += 5;

    for (const t of terms) {
      if (lowTitle.includes(t)) score += 4;
      if (lowExcerpt.includes(t)) score += 2;
    }

    return { r, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({ ...s.r, score: s.score }));
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
      return (async () => {
        const rawIndex = await buildIndex();
        const results = scoreAndFilter(rawIndex, query, limit);

        return new Response(
          JSON.stringify({
            query,
            results,
            total: results.length,
            searchMode: "dynamic",
            timestamp: new Date().toISOString(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      })();
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
