// deno-lint-ignore-file react-no-danger
// [...topic].tsx
import type { PageProps } from "fresh";
import { render } from "@deno/gfm";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";
import "npm:prismjs@1.29.0/components/prism-json.js";
import "npm:prismjs@1.29.0/components/prism-powershell.js";

import { DocNav } from "../../islands/DocNav.tsx";
import { ScrollProgress } from "../../islands/ScrollProgress.tsx";
import { QuickNav } from "../../islands/QuickNav.tsx";
import toc from "../../utils/toc.ts";

function extractHeadings(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    headings.push({ level, text, id });
  }

  return headings;
}
export default async function DocTopic(props: PageProps) {
  const topic = props.params.topic;
  let content;

  try {
    content = await Deno.readTextFile(`static/content/docs/${topic}.md`);
  } catch (_e) {
    try {
      content = await Deno.readTextFile(
        `static/content/docs/${topic}/index.md`,
      );
    } catch (_e2) {
      console.error(_e2);
      content = `# 404 Not Found

The page you're looking for doesn't exist.

[← Back to Documentation](/docs/index)`;
    }
  }

  const headings = extractHeadings(content);
  const renderedContent = render(content, { baseUrl: new URL(props.url).host });

  // Find the current page in TOC for breadcrumbs and navigation
  let currentPage = null;
  let allPages: Array<{ name: string; path: string }> = [];

  // Flatten all pages for navigation
  toc.forEach((section) => {
    section.children.forEach((child) => {
      allPages.push({ name: child.name, path: child.path });
    });
  });

  for (const section of toc) {
    const found = section.children.find((child) =>
      child.path === props.url.pathname
    );
    if (found) {
      currentPage = { section: section.name, page: found.name };
      break;
    }
  }

  return (
    <>
      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Fixed sidebar */}
      <DocNav data={toc} path={props.url.pathname} />

      {/* Quick navigation for mobile/desktop */}
      <QuickNav sections={allPages} currentPath={props.url.pathname} />

      <main class="md:ml-80 min-h-screen bg-base">
        {/* Breadcrumb navigation */}
        {currentPage && (
          <div class="border-b border-surface0 bg-mantle/50 backdrop-blur-sm sticky top-1 z-10">
            <div class="p-4 md:p-6">
              <nav class="flex items-center space-x-2 text-sm text-subtext1">
                <a href="/docs" class="hover:text-text transition-colors">
                  Documentation
                </a>
                <span>›</span>
                <span class="text-subtext0">{currentPage.section}</span>
                <span>›</span>
                <span class="text-text font-medium">{currentPage.page}</span>
              </nav>
            </div>
          </div>
        )}

        <div class="flex">
          {/* Main content area */}
          <div class="flex-1 min-w-0">
            <article class="p-4 md:p-8 pt-6 md:pt-8 max-w-4xl">
              {/* Content */}
              <div
                class="markdown-body"
                data-color-mode="light"
                data-light-theme="light"
                data-dark-theme="dark"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />

              {/* Page navigation */}
              <div class="mt-16 pt-8 border-t border-surface0">
                <div class="flex justify-between items-center">
                  <div class="text-sm text-subtext1">
                    <span>Found an issue with this page?</span>
                    <a
                      href={`https://github.com/tryandromeda/website/edit/main/static/content/docs/${topic}.md`}
                      class="ml-2 text-blue hover:text-sky transition-colors underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Edit on GitHub
                    </a>
                  </div>
                  <div class="text-sm text-subtext1">
                    Last updated: <time class="text-text">Jan 2025</time>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right sidebar for larger screens */}
          <aside class="hidden xl:block w-64 shrink-0">
            <div class="sticky top-24 p-6">
              {headings.length > 1 && (
                <div class="space-y-4">
                  <h3 class="text-sm font-semibold text-text uppercase tracking-wider">
                    On this page
                  </h3>
                  <nav class="space-y-2">
                    {headings.map(({ level, text, id }) => {
                      if (level === 1) return null;
                      const indent = (level - 2) * 12;
                      return (
                        <a
                          key={id}
                          href={`#${id}`}
                          class="block text-sm text-subtext1 hover:text-text transition-colors py-1 border-l-2 border-transparent hover:border-surface2 pl-3"
                          style={{ marginLeft: `${indent}px` }}
                        >
                          {text}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              <div class="mt-8 pt-6 border-t border-surface0">
                <h3 class="text-sm font-semibold text-text uppercase tracking-wider mb-3">
                  Helpful Links
                </h3>
                <nav class="space-y-2 text-sm">
                  <a
                    href="https://github.com/tryandromeda/andromeda"
                    class="block text-subtext1 hover:text-text transition-colors"
                  >
                    GitHub Repository
                  </a>
                  <a
                    href="https://discord.gg/tgjAnX2Ny3"
                    class="block text-subtext1 hover:text-text transition-colors"
                  >
                    Discord Community
                  </a>
                  <a
                    href="/docs/faq"
                    class="block text-subtext1 hover:text-text transition-colors"
                  >
                    FAQ
                  </a>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
