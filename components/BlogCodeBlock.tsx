import type { ComponentChildren } from "preact";

interface BlogCodeBlockProps {
  language: string;
  children: ComponentChildren;
}

export default function BlogCodeBlock(
  { language, children }: BlogCodeBlockProps,
) {
  return (
    <div class="relative group">
      <div class="absolute top-2 right-2 text-xs text-subtext1 bg-surface0 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {language}
      </div>
      <pre
        class={`language-${language} bg-surface0 border border-surface1 rounded-lg p-4 overflow-x-auto`}
      >
        <code class={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}
