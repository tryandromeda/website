import { useEffect, useState } from "preact/hooks";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "error";
  delay: number;
}

const demoSequence: TerminalLine[] = [
  { text: "$ andromeda --version", type: "command", delay: 1000 },
  {
    text: "andromeda 0.1.0 (Rust 1.75.0, Nova Engine)",
    type: "output",
    delay: 500,
  },
  { text: "$ andromeda run hello.ts", type: "command", delay: 1500 },
  { text: "Hello, Andromeda! 🌌", type: "output", delay: 600 },
  { text: "$ andromeda repl", type: "command", delay: 2000 },
  { text: "Welcome to Andromeda REPL v0.1.0", type: "output", delay: 300 },
  { text: "> const x = 42;", type: "command", delay: 1000 },
  { text: "undefined", type: "output", delay: 200 },
  { text: "> console.log(x * 2);", type: "command", delay: 1000 },
  { text: "84", type: "output", delay: 300 },
];

export default function TerminalDemo() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentIndex >= demoSequence.length) {
      // Reset after a delay
      const resetTimeout = setTimeout(() => {
        setLines([]);
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }

    const currentLine = demoSequence[currentIndex];
    const timeout = setTimeout(() => {
      setIsTyping(true);

      // Simulate typing animation
      let typedText = "";
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < currentLine.text.length) {
          typedText += currentLine.text[charIndex];
          setLines((prev) => {
            const newLines = [...prev];
            if (newLines.length === currentIndex) {
              newLines.push({ ...currentLine, text: typedText });
            } else {
              newLines[currentIndex] = { ...currentLine, text: typedText };
            }
            return newLines;
          });
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setCurrentIndex((prev) => prev + 1);
        }
      }, currentLine.type === "command" ? 80 : 30);

      return () => clearInterval(typeInterval);
    }, currentLine.delay);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div class="bg-surface1 rounded-xl border border-surface2 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Terminal Header */}
      <div class="bg-surface2 px-4 py-3 flex items-center gap-2">
        <div class="flex gap-2">
          <div class="w-3 h-3 rounded-full bg-red"></div>
          <div class="w-3 h-3 rounded-full bg-yellow"></div>
          <div class="w-3 h-3 rounded-full bg-green"></div>
        </div>
        <div class="text-sm text-subtext1 ml-3 font-mono">andromeda-demo</div>
      </div>

      {/* Terminal Content */}
      <div class="p-4 font-mono text-sm min-h-[300px] bg-gradient-to-br from-surface1 to-surface0">
        {lines.map((line, index) => (
          <div
            key={index}
            class={`mb-1 ${
              line.type === "command" ?
                "text-green" :
                line.type === "error" ?
                "text-red" :
                "text-subtext1"
            }`}
          >
            {line.type === "command" && !line.text.startsWith("$") &&
              !line.text.startsWith(">") && <span class="text-blue">$</span>}
            <span class={line.type === "command" ? "text-yellow" : ""}>
              {line.text}
            </span>
          </div>
        ))}

        {/* Cursor */}
        {isTyping && (
          <span class="inline-block w-2 h-4 bg-green animate-pulse ml-1"></span>
        )}

        {/* Interactive prompt when demo is complete */}
        {currentIndex >= demoSequence.length && (
          <div class="text-green animate-pulse">
            <span class="text-blue">$</span>
            <span class="text-yellow">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
