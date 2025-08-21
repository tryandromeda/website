import { useEffect, useState } from "preact/hooks";
import { Rocket } from "lucide-preact";

const codeLines = [
  { text: "// hello.ts - TypeScript works out of the box", type: "comment" },
  { text: 'console.log("Hello, Andromeda! 🌌");', type: "code" },
  { text: "", type: "empty" },
  { text: "// Built-in APIs ready to use", type: "comment" },
  { text: "const canvas = new OffscreenCanvas(200, 100);", type: "code" },
  { text: 'const ctx = canvas.getContext("2d")!;', type: "code" },
  { text: 'ctx.fillStyle = "#4ecdc4";', type: "code" },
  { text: "ctx.fillRect(0, 0, 200, 100);", type: "code" },
  { text: 'canvas.saveAsPng("hello.png");', type: "code" },
  { text: "", type: "empty" },
  { text: "// Run with: andromeda run hello.ts", type: "comment" },
];

export default function AnimatedCodeBlock() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const animateLines = async () => {
      setIsTyping(true);

      for (let i = 0; i <= codeLines.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setVisibleLines(i);
      }

      setIsTyping(false);
    };

    const timeout = setTimeout(() => {
      animateLines();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const highlightSyntax = (text: string, type: string) => {
    if (type === "comment") {
      return <span class="text-green opacity-80 italic">{text}</span>;
    }

    if (type === "code") {
      // Simple syntax highlighting
      const parts = text.split(
        /(\bconst\b|\blet\b|\bvar\b|\bnew\b|\bfunction\b|"[^"]*"|'[^']*'|\/\/.*$|\d+)/g,
      );

      return parts.map((part, index) => {
        if (part.match(/\bconst\b|\blet\b|\bvar\b|\bnew\b|\bfunction\b/)) {
          return (
            <span key={index} class="text-purple font-semibold">{part}</span>
          );
        } else if (part.match(/"[^"]*"|'[^']*'/)) {
          return <span key={index} class="text-green">{part}</span>;
        } else if (part.match(/\d+/)) {
          return <span key={index} class="text-blue">{part}</span>;
        } else if (part.match(/console|canvas|ctx/)) {
          return <span key={index} class="text-yellow">{part}</span>;
        }
        return <span key={index} class="text-text">{part}</span>;
      });
    }

    return <span class="text-text">{text}</span>;
  };

  return (
    <div class="bg-mantle rounded-xl border border-surface1 overflow-hidden hover:border-surface2 transition-all code-block-enhanced">
      <div class="terminal-header p-4 bg-surface0 border-b border-surface1">
        <div class="flex items-center gap-2">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot yellow"></div>
          <div class="terminal-dot green"></div>
        </div>
        <h4 class="font-semibold flex items-center gap-2 text-text mt-2 ml-5">
          <Rocket size={18} class="inline-block" /> Your First Program
        </h4>
      </div>

      <div class="p-4">
        <pre class="text-sm font-mono leading-relaxed overflow-x-auto text-text whitespace-pre-wrap break-words min-h-[240px]">
          <code>
            {codeLines.slice(0, visibleLines).map((line, index) => (
              <div
                key={index}
                class={`transition-all duration-300 ${index === visibleLines - 1 ? 'animate-fade-in-up' : ''}`}
              >
                {highlightSyntax(line.text, line.type)}
              </div>
            ))}
            {isTyping && visibleLines < codeLines.length && (
              <span class="inline-block w-2 h-4 bg-green animate-pulse"></span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
