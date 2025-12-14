// deno-lint-ignore-file react-no-danger
import Prism from "npm:prismjs@1.29.0";

export function CodeBlock(
  { code, lang }: { code: string; lang: "js" | "ts" | "jsx" | "md" | "bash" },
) {
  const langMap: Record<string, string> = {
    "ts": "typescript",
    "js": "javascript",
    "jsx": "jsx",
    "md": "markdown",
    "bash": "bash",
  };

  const prismLang = langMap[lang] || lang;
  const grammar = Prism.languages[prismLang] || Prism.languages.javascript;

  return (
    <div class="gfm-highlight">
      <pre
        class="rounded-lg leading-relaxed bg-slate-800 text-white p-4 sm:p-6 md:p-4 lg:p-6 2xl:p-8 overflow-x-auto"
        data-language={lang}
      ><code dangerouslySetInnerHTML={{ __html: Prism.highlight(code, grammar, prismLang)}} /></pre>
    </div>
  );
}
