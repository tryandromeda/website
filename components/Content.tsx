// deno-lint-ignore-file react-no-danger
import { render } from "@deno/gfm";
import "npm:prismjs@1.29.0/components/prism-typescript.js";

export function Content({
  markdown,
  baseUrl,
  siteBaseUrl,
}: {
  markdown: string;
  baseUrl?: string;
  siteBaseUrl?: string;
}) {
  let html = render(markdown, { baseUrl });

  // If siteBaseUrl is provided, transform relative links to use site URLs instead of raw GitHub URLs
  if (siteBaseUrl && baseUrl) {
    // Replace links that point to the raw GitHub URL with site URLs
    const githubRawPattern = new RegExp(
      baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[^/]+$/, ""),
      "g",
    );
    html = html.replace(
      /href="https:\/\/raw\.githubusercontent\.com\/[^"]+"/g,
      (match: string) => {
        // Extract the path from the raw GitHub URL
        const urlMatch = match.match(
          /href="https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/(.+?)"/,
        );
        if (urlMatch && urlMatch[1]) {
          const path = urlMatch[1];
          return `href="${siteBaseUrl}${path}"`;
        }
        return match;
      },
    );
  }

  return (
    <>
      <div
        class="prose prose-invert ml-10 markdown-body max-w-2xl overflow-y-auto"
        data-color-mode="dark"
        data-dark-theme="dark"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
