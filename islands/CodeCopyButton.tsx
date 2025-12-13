import { Check, Copy } from "lucide-preact";
import { useState } from "preact/hooks";

interface CodeCopyButtonProps {
  code: string;
  className?: string;
}

export function CodeCopyButton({ code, className = "" }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
        copied
          ? "bg-green/20 text-green border border-green/30"
          : "bg-surface1/80 text-subtext1 border border-surface2/50 hover:bg-surface2/80 hover:text-text"
      } ${className}`}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied
        ? (
          <>
            <Check size={14} />
            <span>Copied!</span>
          </>
        )
        : (
          <>
            <Copy size={14} />
            <span>Copy</span>
          </>
        )}
    </button>
  );
}
