import { useState } from "preact/hooks";
import { Copy, Download, Monitor, Terminal, Zap } from "lucide-preact";

interface Platform {
  id: string;
  name: string;
  icon: unknown;
  command: string;
  downloadUrl: string;
  color: string;
}

const platforms: Platform[] = [
  {
    id: "bash",
    name: "Linux/macOS",
    icon: Terminal,
    command: "curl -fsSL https://tryandromeda.dev/install.sh | bash",
    downloadUrl: "/install.sh",
    color: "green",
  },
  {
    id: "powershell",
    name: "Windows (PowerShell)",
    icon: Monitor,
    command: `iwr -Uri "https://tryandromeda.dev/install.ps1" | Invoke-Expression`,
    downloadUrl: "/install.ps1",
    color: "blue",
  },
  {
    id: "cmd",
    name: "Windows (CMD)",
    icon: Zap,
    command: "curl -L -o install.bat https://tryandromeda.dev/install.bat && install.bat",
    downloadUrl: "/install.bat",
    color: "peach",
  },
];

export default function InstallToggle() {
  const [selectedPlatform, setSelectedPlatform] = useState("bash");

  const currentPlatform = platforms.find(p => p.id === selectedPlatform)!;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadScript = () => {
    const link = document.createElement('a');
    link.href = currentPlatform.downloadUrl;
    link.download = currentPlatform.downloadUrl.split('/').pop() || 'install';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div class="w-full max-w-4xl mx-auto">      {/* Container with consistent theme colors */}
      <div class="relative overflow-hidden bg-base border border-surface1 rounded-2xl shadow-lg">        {/* Header */}
        <div class="text-center p-6 sm:p-8 pb-4">
          <h3 class="text-xl sm:text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--color-text)' }}>
            Quick Install
          </h3>
          <p class="text-sm sm:text-base font-medium" style={{ color: 'var(--color-subtext1)' }}>
            Choose your platform to get started
          </p>
        </div>{/* Platform Selection Grid - Smaller boxes */}
        <div class="px-4 sm:px-8 pb-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">{platforms.map((platform) => {
              // deno-lint-ignore no-explicit-any
              const IconComponent = platform.icon as any;
              const isSelected = selectedPlatform === platform.id;
              
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}                  class={`group relative overflow-hidden p-4 rounded-lg border transition-all duration-300 transform ${
                    isSelected
                      ? `bg-${platform.color} text-base border-${platform.color} shadow-lg scale-105`
                      : "bg-surface0 hover:bg-surface1 border-surface1 hover:border-surface2 hover:scale-102 hover:shadow-md"
                  }`}
                  style={isSelected ? {
                    backgroundColor: `var(--color-${platform.color})`,
                    borderColor: `var(--color-${platform.color})`,
                    color: 'var(--color-base)'
                  } : {
                    color: 'var(--color-text)'
                  }}>                  {/* Icon */}
                  <div class="flex justify-center mb-2">
                    <div class={`p-2 rounded-lg transition-colors ${
                      isSelected 
                        ? "bg-base/20" 
                        : "bg-surface1 group-hover:bg-surface2"
                    }`}>                      <IconComponent 
                        size={20} 
                        class={isSelected ? "text-base" : ""}
                        style={isSelected ? { color: 'var(--color-base)' } : { color: 'var(--color-text)' }}
                      />
                    </div>
                  </div>                  {/* Platform name */}
                  <div class="text-center">                    <div 
                      class={`text-xs sm:text-sm font-semibold ${
                        isSelected ? "text-base" : ""
                      }`}
                      style={isSelected ? { color: 'var(--color-base)' } : { color: 'var(--color-text)' }}
                    >
                      {platform.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Command Section */}
        <div class="px-4 sm:px-8 pb-6 sm:pb-8">          <div class="bg-mantle rounded-xl border border-surface1 overflow-hidden">
            {/* Header with actions */}
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-surface0 border-b border-surface1">              <h4 class="text-sm sm:text-base font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                <Terminal size={16} style={{ color: 'var(--color-subtext1)' }} />
                Installation Command
              </h4>
              <div class="flex gap-2">                <button
                  type="button"
                  onClick={downloadScript}
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-yellow)',
                    color: 'var(--color-base)'
                  }}
                  title="Download script"
                >
                  <Download size={16} />
                  <span class="hidden sm:inline">Download</span>
                </button>                <button
                  type="button"
                  onClick={() => copyToClipboard(currentPlatform.command)}
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-green)',
                    color: 'var(--color-base)'
                  }}
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                  <span class="hidden sm:inline">Copy</span>
                </button>
              </div>
            </div>
              {/* Command display */}
            <div class="p-4">
              <pre class="text-sm sm:text-base font-mono leading-relaxed overflow-x-auto" style={{ color: 'var(--color-text)' }}>
                <code>{currentPlatform.command}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div class="px-4 sm:px-8 pb-6 sm:pb-8">
          <div class="bg-surface0/50 rounded-lg border border-surface1/50 p-4">            <p class="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--color-subtext1)' }}>
              <span class="font-semibold" style={{ color: 'var(--color-text)' }}>Note:</span> These scripts automatically detect your platform, download the appropriate binary, and add it to your PATH.{" "}
              <span class="hidden sm:inline">You can also download and inspect the scripts before running them.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
