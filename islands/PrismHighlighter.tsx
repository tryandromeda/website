import { useEffect, useRef } from "preact/hooks";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
}

// Lightweight client-side highlighter: highlights comments and strings.
export default function PrismHighlighter(
  { code, language = "typescript" }: { code: string; language?: string },
) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    try {
      // Work on original code and produce escaped HTML with simple highlights
      let html = escapeHtml(code);

      // Highlight block comments
      html = html.replace(
        /\/\*[\s\S]*?\*\//g,
        (m) => `<span class="text-subtext0 italic">${escapeHtml(m)}</span>`,
      );
      // Highlight line comments
      html = html.replace(
        /\/\/.*$/gm,
        (m) => `<span class="text-subtext0">${escapeHtml(m)}</span>`,
      );
      // Highlight strings ("" '' ``)
      html = html.replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
        (m) => `<span class="text-green">${escapeHtml(m)}</span>`,
      );

      ref.current.innerHTML = html;
    } catch (err) {
      console.error("Simple highlighter error:", err);
      ref.current.textContent = code;
    }
  }, [code, language]);

  return (
    <pre class="rounded-lg border border-surface0 bg-mantle p-4 overflow-auto"><code ref={ref} class={`language-${language}`} /></pre>
  );
}
