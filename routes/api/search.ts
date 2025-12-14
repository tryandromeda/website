import {
  create,
  insert,
  insertMultiple,
  search as oramaSearch,
} from "@orama/orama";
import { FreshContext } from "fresh";
import { getTableOfContents, parseFrontmatter } from "../../utils/docs.ts";

interface SearchResult {
  title: string;
  url: string;
  excerpt: string;
  type: "doc" | "api" | "example" | "blog" | "std" | "page";
  label: string;
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
  headings?: string[];
  code?: string[];
}

interface GitTreeItem {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  url?: string;
}
let indexCache: SearchResult[] | null = null;
let rawIndexCache: RawIndexItem[] | null = null;
let lastIndexTime = 0;
const INDEX_CACHE_DURATION = 60 * 1000;

let oramaDb: ReturnType<typeof create> | null = null;

function ensureOrama() {
  if (oramaDb) return oramaDb;
  try {
    oramaDb = create({
      schema: {
        title: "string",
        excerpt: "string",
        body: "string",
        headings: "string",
        code: "string",
        type: "string",
        url: "string",
        label: "string",
      },
    });
    return oramaDb;
  } catch (e) {
    console.warn("Orama init failed, falling back to built-in search:", e);
    oramaDb = null;
    return null;
  }
}

async function buildIndex(): Promise<SearchResult[]> {
  const now = Date.now();
  if (indexCache && now - lastIndexTime < INDEX_CACHE_DURATION) {
    return indexCache;
  }

  // Reset Orama DB to prevent duplicate document errors
  oramaDb = null;

  const items: RawIndexItem[] = [];

  try {
    const sections = await getTableOfContents();
    for (const sec of sections) {
      for (const doc of sec.children) {
        items.push({
          title: doc.title,
          url: doc.path,
          excerpt: doc.description || "",
          type: doc.section && doc.section.toLowerCase().includes("example") ?
            "example" :
            "doc",
          keywords: [doc.section, doc.id, doc.title].filter(Boolean).map(
            (s) => String(s).toLowerCase(),
          ),
        });
      }
    }
  } catch (err) {
    console.warn("Failed to build docs index:", err);
  }

  const mdHeadingRegex = /^#{1,6}\s+(.*)$/gm;
  const codeFenceRegex = /```(?:[a-zA-Z0-9_-]+)?\n([\s\S]*?)\n```/g;

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
  } catch {
    // ignore
  }
  try {
    for await (const file of Deno.readDir("content/docs")) {
      if (!file.isFile || !file.name.endsWith(".md")) continue;
      try {
        const path = `content/docs/${file.name}`;
        const text = await Deno.readTextFile(path);
        const titleMatch = text.match(/^#\s+(.*)$/m);
        const title = titleMatch ?
          titleMatch[1].trim() :
          file.name.replace(/\.md$/, "");
        const url = `/docs/${file.name.replace(/\.md$/, "")}`;
        const excerpt = text.split(/\n\n/)[1] || text.slice(0, 200);
        const headings: string[] = [];
        const code: string[] = [];
        let m;
        while ((m = mdHeadingRegex.exec(text)) !== null) {
          headings.push(m[1].trim());
        }
        while ((m = codeFenceRegex.exec(text)) !== null) {
          code.push(m[1].trim());
        }
        items.push({
          title,
          url,
          excerpt,
          type: "doc",
          body: text,
          headings,
          code,
        });
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
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
            const isReadme = /readme\.md$/i.test(f.path || "");
            let url = `/std/${f.path}`;
            if (isReadme) {
              const dir = (f.path || "").replace(/readme\.md$/i, "").replace(
                /\/$/,
                "",
              );
              url = dir ? `/std/${dir}` : "/std";
            }

            items.push({
              title,
              url,
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

  // Index static pages (home, satellites, etc.)
  try {
    // Home page
    items.push({
      title: "Andromeda - Modern JavaScript & TypeScript Runtime",
      url: "/",
      excerpt:
        "A modern, fast, and secure JavaScript & TypeScript runtime built from the ground up in Rust. Zero-config TypeScript support, hardware-accelerated graphics, comprehensive Web APIs, and developer-first tooling.",
      type: "page",
      keywords: [
        "home",
        "andromeda",
        "javascript",
        "typescript",
        "runtime",
        "rust",
        "nova engine",
        "gpu accelerated",
        "memory safe",
        "wintertc",
      ],
      body:
        "Andromeda JavaScript TypeScript runtime Rust Nova Engine zero config GPU accelerated memory safe WinterTC compliant fast secure modern developer tooling Web APIs hardware acceleration",
      headings: ["Andromeda", "Features", "Installation", "Getting Started"],
    });

    // Satellites page
    items.push({
      title: "Andromeda Satellites",
      url: "/satellites",
      excerpt:
        "Lightweight, purpose-built executables designed for containerized environments and microservice architectures. Each satellite focuses on a single capability for optimal performance.",
      type: "page",
      keywords: [
        "satellites",
        "containers",
        "docker",
        "microservices",
        "serverless",
        "ci/cd",
        "andromeda-run",
        "andromeda-fmt",
        "andromeda-lint",
        "andromeda-check",
        "andromeda-compile",
        "andromeda-bundle",
      ],
      body:
        "satellites lightweight executables containers docker microservices serverless functions lambda cold start CI/CD pipeline build tools andromeda-run andromeda-fmt andromeda-lint andromeda-check andromeda-compile andromeda-bundle smaller images faster startup better security",
      headings: [
        "Satellites",
        "Why Satellites",
        "Smaller Images",
        "Faster Startup",
        "Better Security",
        "Common Use Cases",
        "Serverless Functions",
        "CI/CD Pipeline",
        "Build Containers",
        "Development Tools",
      ],
    });
  } catch (e) {
    console.warn("Failed to index static pages:", e);
  }

  const results: SearchResult[] = items.map((it) => ({
    title: it.title,
    url: it.url,
    excerpt: it.excerpt || "",
    type: it.type,
    label: (() => {
      switch (it.type) {
        case "api":
          return "API";
        case "example":
          return "Example";
        case "blog":
          return "Blog";
        case "std":
          return "Std";
        case "page":
          return "Page";
        default:
          return "Docs";
      }
    })(),
    score: 0,
    highlights: [],
  }));

  rawIndexCache = items;
  indexCache = results;
  lastIndexTime = Date.now();

  // Attempt to index into Orama (best-effort). Use insertMultiple when possible.
  try {
    const db = ensureOrama();
    if (db) {
      // Prepare docs for Orama inserting. Keep id as url to make it stable.
      // Deduplicate by URL to avoid inserting the same id multiple times which
      // causes Orama DOCUMENT_ALREADY_EXISTS errors (seen e.g. for "/docs/index").
      const seen = new Set<string>();
      const uniqueItems = items.filter((it) => {
        const id = String(it.url || "");
        if (!id) return true;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      const docs = uniqueItems.map((it) => ({
        id: it.url,
        title: it.title,
        excerpt: it.excerpt || "",
        body: it.body || "",
        headings: (it.headings || []).join(" "),
        code: (it.code || []).join(" "),
        type: it.type,
        url: it.url,
        label: (() => {
          switch (it.type) {
            case "api":
              return "API";
            case "example":
              return "Example";
            case "blog":
              return "Blog";
            case "std":
              return "Std";
            case "page":
              return "Page";
            default:
              return "Docs";
          }
        })(),
      }));

      if (typeof insertMultiple === "function") {
        // insertMultiple may throw synchronously or return a Promise.
        // Catch both to prevent the outer try/catch from receiving the error
        // and to log the failure without breaking the search API.
        try {
          const res = insertMultiple(db, docs);
          if (res && typeof (res as Promise<unknown>).then === "function") {
            (res as Promise<unknown>).catch((e: Error) => {
              console.warn("Orama insertMultiple failed:", e);
            });
          }
        } catch (e) {
          console.warn("Orama insertMultiple failed:", e);
        }
      } else {
        for (const d of docs) {
          // @ts-ignore: best-effort insert, allow unknown signature
          try {
            const r = insert(db, d);
            if (r && typeof (r as Promise<unknown>).then === "function") {
              (r as Promise<unknown>).catch(() => {});
            }
          } catch {
            // ignore individual insert errors
          }
        }
      }
    }
  } catch (e) {
    console.warn("Failed to populate Orama DB:", e);
  }
  return results;
}

function makeSnippet(text: string, index: number, radius = 80) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet.replace(/\s+/g, " ").trim();
}

function scoreAndFilter(results: SearchResult[], query: string, limit = 10) {
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = results.map((r, idx) => {
    let score = 0;
    const lowTitle = r.title.toLowerCase();
    const lowExcerpt = r.excerpt.toLowerCase();
    const raw = rawIndexCache && rawIndexCache[idx];
    const lowBody = raw && raw.body ? raw.body.toLowerCase() : "";
    const highlights: string[] = [];

    if (lowTitle.includes(q)) {
      score += 20;
      const pos = lowTitle.indexOf(q);
      highlights.push(makeSnippet(r.title, pos, 60));
    }
    if (lowExcerpt.includes(q)) {
      score += 5;
      const pos = lowExcerpt.indexOf(q);
      highlights.push(makeSnippet(r.excerpt, pos, 60));
    }

    for (const t of terms) {
      if (lowTitle.includes(t)) score += 4;
      if (lowExcerpt.includes(t)) score += 2;
      if (lowBody.includes(t)) score += 1;
    }

    if (lowBody) {
      const pos = terms.map((t) =>
        lowBody.indexOf(t)
      ).filter((p) => p >= 0).sort((a, b) =>
        a - b
      )[0];
      if (typeof pos === "number" && pos >= 0) {
        highlights.push(makeSnippet(raw!.body || "", pos, 80));
        score += 3;
      }
    }

    return { r, score, highlights };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({
    ...s.r,
    score: s.score,
    highlights: s.highlights,
  }));
}

export const handler = {
  GET(ctx: FreshContext) {
    const req = ctx.req;

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

        const typeParam = url.searchParams.get("type");
        const allowedTypes = typeParam ?
          typeParam.split(",").map((s) => s.trim().toLowerCase()).filter(
            Boolean,
          ) :
          null;

        const filtered = allowedTypes ?
          rawIndex.filter((it) => allowedTypes.includes(it.type)) :
          rawIndex;

        const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
        const pageSize = Math.max(
          1,
          parseInt(url.searchParams.get("pageSize") || String(limit)),
        );

        const q = query as string;

        let scored: SearchResult[] = [];
        try {
          const db = oramaDb || ensureOrama();
          if (db) {
            try {
              // @ts-ignore: imported from npm specifier in Deno environment
              const oramaRes = await oramaSearch(db, { term: query });
              if (
                oramaRes &&
                Array.isArray((oramaRes as unknown as { hits?: unknown; }).hits)
              ) {
                const hits =
                  (oramaRes as unknown as { hits: Array<unknown>; }).hits;
                const mapped: SearchResult[] = hits.map((h) => {
                  const hitObj = h as unknown as Record<string, unknown>;
                  const doc = (hitObj.document as Record<string, unknown>) ||
                    {};

                  const title = typeof doc.title === "string" ?
                    doc.title :
                    (typeof doc.name === "string" ? doc.name : "");
                  const urlVal = typeof doc.url === "string" ?
                    doc.url :
                    (typeof hitObj.id === "string" ? hitObj.id : "");
                  const excerpt = typeof doc.excerpt === "string" ?
                    doc.excerpt :
                    "";
                  const typeVal = typeof doc.type === "string" ?
                    doc.type :
                    (typeof doc.label === "string" ? doc.label : "doc");
                  const labelVal = typeof doc.label === "string" ?
                    doc.label :
                    "Docs";

                  const highlights: string[] = [];
                  const matches = Array.isArray(hitObj.matches) ?
                    hitObj.matches as unknown[] :
                    undefined;
                  if (matches) {
                    for (const m of matches) {
                      if (!m || typeof m !== "object") continue;
                      const mo = m as Record<string, unknown>;
                      const frag = typeof mo.match === "string" ?
                        mo.match :
                        (typeof mo.fragment === "string" ?
                          mo.fragment :
                          undefined);
                      if (typeof frag === "string") {
                        highlights.push(frag.slice(0, 300));
                        continue;
                      }
                      if (typeof mo.field === "string") {
                        const f = mo.field;
                        const fv = doc[f];
                        if (typeof fv === "string") {
                          highlights.push(fv.slice(0, 300));
                        }
                      }
                    }
                  } else if (Array.isArray(hitObj.highlights)) {
                    const hh = hitObj.highlights as unknown[];
                    for (const item of hh.slice(0, 3)) {
                      if (typeof item === "string") highlights.push(item);
                    }
                  } else {
                    const raw = rawIndexCache &&
                      rawIndexCache.find((r) => r.url === urlVal);
                    if (raw && raw.body) {
                      const bodyLower = raw.body.toLowerCase();
                      const qLower = q.toLowerCase();
                      const pos = bodyLower.indexOf(qLower);
                      if (pos >= 0) {
                        highlights.push(makeSnippet(raw.body, pos, 80));
                      } else if (raw.headings && raw.headings.length) {
                        highlights.push(raw.headings.slice(0, 3).join(" — "));
                      }
                    }
                  }

                  return {
                    title,
                    url: urlVal,
                    excerpt,
                    type: (typeVal as string) as SearchResult["type"],
                    label: labelVal,
                    score: typeof hitObj.score === "number" ?
                      (hitObj.score as number) :
                      0,
                    highlights,
                  };
                });

                const filteredHits = allowedTypes ?
                  mapped.filter((m) => allowedTypes.includes(m.type)) :
                  mapped;
                scored = filteredHits;
              }
            } catch (e) {
              console.warn("Orama search call failed:", e);
            }
          }
        } catch (e) {
          console.warn(
            "Orama search failed, falling back to legacy scorer:",
            e,
          );
        }

        if (!scored || scored.length === 0) {
          scored = scoreAndFilter(
            filtered.map((it) => ({
              title: it.title,
              url: it.url,
              excerpt: it.excerpt || "",
              type: it.type,
              label: (() => {
                switch (it.type) {
                  case "api":
                    return "API";
                  case "example":
                    return "Example";
                  case "blog":
                    return "Blog";
                  case "std":
                    return "Std";
                  case "page":
                    return "Page";
                  default:
                    return "Docs";
                }
              })(),
              score: 0,
              highlights: [],
            })),
            q,
            filtered.length,
          );
        }

        const total = scored.length;
        const start = (page - 1) * pageSize;
        const paged = scored.slice(start, start + pageSize);

        return new Response(
          JSON.stringify({
            query,
            results: paged,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
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
