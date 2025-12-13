import type { PageProps } from "fresh";
import { CodeBlock } from "../../components/CodeBlock.tsx";
import { Content as MarkdownContent } from "../../components/Content.tsx";
import Footer from "../../components/Footer.tsx";
import NavBar from "../../components/NavBar.tsx";
import { isHtmlRequest } from "../../utils/mod.ts";

interface TreeItem {
  name: string;
  path: string;
  type: "file" | "dir" | string;
  download_url?: string | null;
  size?: number;
}

interface Data {
  items?: TreeItem[];
  content?: string;
  isFile?: boolean;
  path: string;
  error?: string;
}

const OWNER = "tryandromeda";
const REPO = "std";
const BRANCH = "main";

async function fetchGitHubPath(path: string) {
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${
    encodeURI(path)
  }`;
  const res = await fetch(apiUrl, {
    headers: {
      "Authorization": Deno.env.get("GITHUB_TOKEN")
        ? `token ${Deno.env.get("GITHUB_TOKEN")}`
        : "",
      "Accept": "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    return { ok: false, status: res.status, text };
  }
  const json = await res.json();
  return { ok: true, json };
}

function extToLang(path: string) {
  const m = path.match(/\.([^.]+)$/);
  if (!m) return "ts";
  const ext = m[1].toLowerCase();
  if (ext === "ts" || ext === "tsx") return "ts";
  if (ext === "js" || ext === "jsx") return "js";
  if (ext === "md" || ext === "markdown") return "md";
  if (ext === "sh" || ext === "bash") return "bash";
  return "ts";
}

export default async function StdPage(props: PageProps<never>) {
  const rawParam = props.params.path as string | string[] | undefined;
  const segments = Array.isArray(rawParam)
    ? rawParam
    : rawParam
    ? [rawParam]
    : [];
  const path = segments.join("/");

  let items: TreeItem[] | undefined;
  let content: string | undefined;
  let readmePreview: { path: string; content: string } | undefined;
  let isFile = false;
  let error: string | undefined;

  try {
    const result = await fetchGitHubPath(path);
    if (!result.ok) {
      error = `GitHub API error: ${result.status} - ${result.text}`;
    } else {
      const json = result.json;
      if (Array.isArray(json)) {
        json.sort((a: TreeItem, b: TreeItem) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "dir" ? -1 : 1;
        });
        items = json as TreeItem[];
        isFile = false;
        try {
          const readmeItem = items.find((it) =>
            it.type === "file" && /readme\.md$/i.test(it.name)
          );
          if (readmeItem && readmeItem.path) {
            const r = await fetchGitHubPath(readmeItem.path);
            if (r.ok && r.json && r.json.content) {
              const raw = r.json;
              let readmeContent = "";
              if (raw.encoding === "base64" && raw.content) {
                readmeContent = atob(raw.content.replace(/\n/g, ""));
              } else if (raw.content) {
                readmeContent = raw.content;
              } else if (raw.download_url) {
                const rr = await fetch(raw.download_url);
                readmeContent = await rr.text();
              }
              if (readmeContent) {
                readmePreview = {
                  path: readmeItem.path,
                  content: readmeContent,
                };
              }
            }
          }
        } catch (_e) {
          // non-fatal; just don't show preview
        }
      } else if (json && json.type === "file") {
        isFile = true;
        if (json.encoding === "base64" && json.content) {
          content = atob(json.content.replace(/\n/g, ""));
        } else if (json.content) {
          content = json.content;
        } else if (json.download_url) {
          const raw = await fetch(json.download_url);
          content = await raw.text();
        }
      } else {
        error = "Unknown GitHub response shape";
      }
    }
  } catch (err) {
    error = String(err);
  }
  if (!isHtmlRequest(props.req)) {
    if (isFile && content) {
      const lower = path.toLowerCase();
      let contentType = "application/octet-stream";
      if (lower.endsWith(".md")) contentType = "text/markdown; charset=utf-8";
      else if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
        contentType = "application/typescript; charset=utf-8";
      } else if (
        lower.endsWith(".js") || lower.endsWith(".mjs") ||
        lower.endsWith(".cjs") || lower.endsWith(".jsx")
      ) contentType = "application/javascript; charset=utf-8";
      else if (lower.endsWith(".json")) {
        contentType = "application/json; charset=utf-8";
      } else if (lower.endsWith(".sh") || lower.endsWith(".bash")) {
        contentType = "text/x-sh; charset=utf-8";
      }
      if (!isFile && items) {
        return new Response(JSON.stringify(items), {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }
      return new Response(content, {
        headers: {
          "Content-Type": contentType,
        },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  const parentPath = segments.slice(0, -1).join("/");

  return (
    <>
      <NavBar />

      <main class="pt-30 pb-20 px-4 bg-base">
        <div class="container mx-auto max-w-6xl">
          <div class="relative mb-6">
            <div class="max-w-2xl mx-auto text-center">
              <h1 class="text-3xl font-semibold text-center">std</h1>
              <p class="text-sm text-muted-foreground text-center">
                Browse the standard library for Andromeda
              </p>
            </div>
          </div>

          {error && (
            <div class="bg-red-900 text-red-100 p-4 rounded mb-6">{error}</div>
          )}

          <nav class="mb-6 text-sm text-muted-foreground">
            <a href="/std" class="hover:underline">/std</a>
            {segments.map((s: string, i: number) => (
              <span key={i}>
                <span class="mx-2">/</span>
                <a
                  href={`/std/${segments.slice(0, i + 1).join("/")}`}
                  class="hover:underline"
                >
                  {s}
                </a>
              </span>
            ))}
          </nav>

          {!isFile && items && (
            <div class="rounded-lg p-4 bg-surface border border-surface1">
              <div class="flex justify-between items-center mb-4">
                <div class="font-medium">Contents</div>
                <div class="text-sm text-muted-foreground">
                  {items.length} items
                </div>
              </div>

              <div class="space-y-2">
                {parentPath !== "" && (
                  <div class="p-3 rounded bg-base border border-surface0">
                    <a
                      class="text-blue-400 hover:underline font-medium"
                      href={`/std/${parentPath}`}
                    >
                      .. (parent)
                    </a>
                  </div>
                )}

                <div class="grid sm:grid-cols-2 gap-2">
                  {items.map((it: TreeItem) => (
                    <div
                      class="p-3 rounded bg-base border border-surface0 hover:shadow-sm transition-all"
                      key={it.path}
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          {(() => {
                            if (it.type === "dir") {
                              return (
                                <a
                                  class="text-blue-300 hover:underline font-medium"
                                  href={`/std/${it.path}`}
                                >
                                  📁 {it.name}
                                </a>
                              );
                            }
                            const isReadme = /readme\.md$/i.test(
                              it.name || "",
                            );
                            if (isReadme) {
                              const dir = it.path
                                ? it.path.replace(/readme\.md$/i, "").replace(
                                  /\/$/,
                                  "",
                                )
                                : "";
                              const href = dir ? `/std/${dir}` : "/std";
                              return (
                                <a
                                  class="text-sky-200 hover:underline font-medium"
                                  href={href}
                                >
                                  📄 {it.name}
                                </a>
                              );
                            }

                            return (
                              <a
                                class="text-sky-200 hover:underline font-medium"
                                href={`/std/${it.path}`}
                              >
                                📄 {it.name}
                              </a>
                            );
                          })()}
                          {typeof it.size === "number" && (
                            <div class="text-xs text-subtext1">
                              {it.size} bytes
                            </div>
                          )}
                        </div>
                        <div class="text-xs text-muted-foreground">
                          {it.type === "file" && (
                            <a
                              class="ml-3 text-blue-400 hover:underline"
                              href={`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${it.path}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              raw
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* README preview for directories */}
          {!isFile && items && readmePreview && (
            <div class="mt-6 rounded-lg border border-surface1 p-6 bg-surface">
              <div class="prose max-w-none">
                <MarkdownContent
                  markdown={readmePreview.content}
                  baseUrl={`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${readmePreview.path}`}
                  siteBaseUrl="/std/"
                />
              </div>
            </div>
          )}

          {isFile && (
            <div class="mt-6">
              <div class="flex items-center justify-between mb-3">
                <div class="text-sm text-muted-foreground">{path}</div>
                <div class="space-x-3">
                  <a
                    class="text-blue-400 hover:underline"
                    href={`https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on GitHub
                  </a>
                  <a
                    class="text-blue-400 hover:underline"
                    href={`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Raw
                  </a>
                </div>
              </div>

              {path.endsWith(".md")
                ? (
                  <div class="rounded-lg border border-surface1 p-6 bg-surface">
                    <MarkdownContent
                      markdown={content || ""}
                      baseUrl={`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`}
                      siteBaseUrl="/std/"
                    />
                  </div>
                )
                : (
                  <div class="rounded-lg border border-surface1 bg-mantle p-4">
                    <CodeBlock
                      code={content || ""}
                      lang={extToLang(path) as "ts" | "js" | "md" | "bash"}
                    />
                  </div>
                )}
            </div>
          )}

          {!isFile && !items && !error && (
            <div class="text-muted-foreground">No items found.</div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
