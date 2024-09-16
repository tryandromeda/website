import { render } from "$gfm";
import "npm:prismjs@1.29.0/components/prism-typescript.js";

export function Content({
  markdown,
  baseUrl,
}: {
  markdown: string;
  baseUrl?: string;
}) {
  const html = render(markdown, { baseUrl });
  return (
    <>
    <div
      class="prose prose-invert ml-10 markdown-body max-w-2xl overflow-y-auto" data-color-mode="dark" data-dark-theme="dark" 
      dangerouslySetInnerHTML={{ __html: html }}
    />
    </>
  );
}