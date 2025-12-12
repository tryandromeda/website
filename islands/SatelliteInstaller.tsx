import { Check, Copy, Download, Package, Play, Terminal, Wrench, Zap } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";

interface Satellite {
  id: string;
  name: string;
  icon: unknown;
  description: string;
  color: string;
  use_cases: string[];
}

interface Platform {
  id: string;
  name: string;
  rustTarget: string;
  os: string;
}

const satellites: Satellite[] = [
  {
    id: "run",
    name: "andromeda-run",
    icon: Play,
    description: "Execute JavaScript/TypeScript files",
    color: "green",
    use_cases: ["Production runtime", "Serverless functions", "Script execution"],
  },
  {
    id: "compile",
    name: "andromeda-compile",
    icon: Package,
    description: "Compile JS/TS to standalone executables",
    color: "blue",
    use_cases: ["Building binaries", "Distribution", "CI/CD pipelines"],
  },
  {
    id: "fmt",
    name: "andromeda-fmt",
    icon: Wrench,
    description: "Format JavaScript/TypeScript files",
    color: "yellow",
    use_cases: ["Code formatting", "Pre-commit hooks", "CI checks"],
  },
  {
    id: "lint",
    name: "andromeda-lint",
    icon: Zap,
    description: "Lint code for quality issues",
    color: "peach",
    use_cases: ["Code quality", "Static analysis", "CI/CD"],
  },
  {
    id: "check",
    name: "andromeda-check",
    icon: Check,
    description: "Type-check TypeScript files",
    color: "mauve",
    use_cases: ["Type checking", "Pre-push validation", "IDE integration"],
  },
  {
    id: "bundle",
    name: "andromeda-bundle",
    icon: Package,
    description: "Bundle and minify JS/TS files",
    color: "teal",
    use_cases: ["Production builds", "Asset optimization", "Deployment prep"],
  },
];

const platforms: Platform[] = [
  { id: "linux-amd64", name: "Linux (x86_64)", rustTarget: "x86_64-unknown-linux-gnu", os: "linux" },
  { id: "linux-arm64", name: "Linux (ARM64)", rustTarget: "aarch64-unknown-linux-gnu", os: "linux" },
  { id: "macos-amd64", name: "macOS (Intel)", rustTarget: "x86_64-apple-darwin", os: "macos" },
  { id: "macos-arm64", name: "macOS (Apple Silicon)", rustTarget: "aarch64-apple-darwin", os: "macos" },
  { id: "windows-amd64", name: "Windows (x86_64)", rustTarget: "x86_64-pc-windows-msvc", os: "windows" },
  { id: "windows-arm64", name: "Windows (ARM64)", rustTarget: "aarch64-pc-windows-msvc", os: "windows" },
];

export default function SatelliteInstaller() {
  const [selectedSatellites, setSelectedSatellites] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [installCommand, setInstallCommand] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);

  // Auto-detect platform on mount
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    let detectedPlatform = "";

    if (platform.includes("win")) {
      detectedPlatform = "windows-amd64";
    } else if (platform.includes("mac") || platform.includes("darwin")) {
      // Check for Apple Silicon
      if (userAgent.includes("arm") || navigator.userAgent.includes("ARM")) {
        detectedPlatform = "macos-arm64";
      } else {
        detectedPlatform = "macos-amd64";
      }
    } else if (platform.includes("linux")) {
      // Check for ARM
      if (platform.includes("arm") || platform.includes("aarch64")) {
        detectedPlatform = "linux-arm64";
      } else {
        detectedPlatform = "linux-amd64";
      }
    }

    setSelectedPlatform(detectedPlatform || "linux-amd64");
  }, []);

  // Generate install command when satellites or platform changes
  useEffect(() => {
    if (selectedSatellites.length === 0 || !selectedPlatform) {
      setInstallCommand("");
      return;
    }

    const platform = platforms.find(p => p.id === selectedPlatform);
    if (!platform) return;

    const satelliteList = selectedSatellites.join(" ");
    const extension = platform.os === "windows" ? ".exe" : "";

    let command = "";

    if (platform.os === "windows") {
      // PowerShell command for Windows
      command = `# Install Andromeda satellites
$satellites = @(${selectedSatellites.map(s => `"${s}"`).join(", ")})
$installDir = "$env:USERPROFILE\\.local\\bin"
New-Item -ItemType Directory -Force -Path $installDir | Out-Null

foreach ($sat in $satellites) {
    $url = "https://github.com/tryandromeda/andromeda/releases/latest/download/andromeda-$sat-${platform.rustTarget}.exe"
    $output = "$installDir\\andromeda-$sat.exe"
    Write-Host "Installing andromeda-$sat..."
    Invoke-WebRequest -Uri $url -OutFile $output
}

Write-Host "✓ Installed: $($satellites -join ', ')"`;
    } else {
      // Bash command for Linux/macOS
      command = `#!/bin/bash
# Install Andromeda satellites
satellites=(${selectedSatellites.join(" ")})
install_dir="$HOME/.local/bin"
mkdir -p "$install_dir"

for sat in "\${satellites[@]}"; do
    echo "Installing andromeda-$sat..."
    curl -fsSL "https://github.com/tryandromeda/andromeda/releases/latest/download/andromeda-$sat-${platform.rustTarget}" -o "$install_dir/andromeda-$sat"
    chmod +x "$install_dir/andromeda-$sat"
done

echo "✓ Installed: \${satellites[*]}"`;
    }

    setInstallCommand(command);
  }, [selectedSatellites, selectedPlatform]);

  const toggleSatellite = (id: string) => {
    setSelectedSatellites(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedSatellites(satellites.map(s => s.id));
  };

  const clearAll = () => {
    setSelectedSatellites([]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadScript = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    if (!platform || !installCommand) return;

    const extension = platform.os === "windows" ? ".ps1" : ".sh";
    const blob = new Blob([installCommand], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `install-satellites${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    

  const handleMouseEnter = (satelliteId: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    // Set a delay before showing the info
    const timeout = setTimeout(() => {
      setShowInfo(satelliteId);
    }, 300); // 300ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear the timeout if mouse leaves before info shows
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowInfo(null);
  };URL.revokeObjectURL(url);
  };

  return (
    <div class="w-full max-w-6xl mx-auto">
      <div class="relative overflow-hidden bg-base border border-surface1 rounded-2xl shadow-lg">
        {/* Header */}
        <div class="text-center p-6 sm:p-8 pb-4">
          <h3
            class="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            🛰️ Satellite Installer
          </h3>
          <p
            class="text-sm sm:text-base font-medium"
            style={{ color: "var(--color-subtext1)" }}
          >
            Choose specialized binaries for your needs
          </p>
        </div>

        {/* Platform Selection */}
        <div class="px-4 sm:px-8 pb-6">
          <label
            class="block text-sm font-semibold mb-3"
            style={{ color: "var(--color-text)" }}
          >
            Select Platform
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {platforms.map((platform) => {
              const isSelected = selectedPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}
                  class={`p-3 text-xs font-medium rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? "bg-blue text-base border-blue shadow-lg scale-105"
                      : "bg-surface0 hover:bg-surface1 border-surface1 hover:border-surface2"
                  }`}
                  style={isSelected ? {
                    backgroundColor: "var(--color-blue)",
                    borderColor: "var(--color-blue)",
                    color: "var(--color-base)",
                    boxShadow: "0 0 15px color-mix(in srgb, var(--color-blue) 40%, transparent)",
                  } : {
                    color: "var(--color-text)",
                  }}
                >
                  {platform.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Satellite Selection */}
        <div class="px-4 sm:px-8 pb-6">
          <div class="flex justify-between items-center mb-3">
            <label
              class="text-sm font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              Select Satellites ({selectedSatellites.length}/{satellites.length})
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                class="text-xs px-3 py-1 rounded-md bg-surface1 hover:bg-surface2 transition-colors"
                style={{ color: "var(--color-text)" }}
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                class="text-xs px-3 py-1 rounded-md bg-surface1 hover:bg-surface2 transition-colors"
                style={{ color: "var(--color-text)" }}
              >
                Clear
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {satellites.map((satellite) => {
              // deno-lint-ignore no-explicit-any
              const IconComponent = satellite.icon as any;
              const isSelected = selectedSatellites.includes(satellite.id);

              return (
                <button
                  key={satellite.id}
                  type="button"
                  onClick={() => toggleSatellite(satellite.id)}
                  onMouseEnter={() => setShowInfo(satellite.id)}
                  onMouseLeave={() => setShowInfo(null)}
                  class={`relative group p-4 rounded-xl border transition-all duration-500 text-left overflow-hidden ${
                    isSelected
                      ? `bg-${satellite.color} border-${satellite.color} shadow-lg scale-105`
                      : "bg-surface0 hover:bg-surface1 border-surface1 hover:border-surface2 hover:shadow-md"
                  }`}
                  style={isSelected ? {
                    backgroundColor: `var(--color-${satellite.color})`,
                    borderColor: `var(--color-${satellite.color})`,
                    color: "var(--color-base)",
                    boxShadow: `0 0 20px color-mix(in srgb, var(--color-${satellite.color}) 30%, transparent)`,
                  } : {
                    color: "var(--color-text)",
                  }}
                >
                  <div class="absolute top-2 right-2">
                    {isSelected && (
                      <div
                        class="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-base)" }}
                      >
                        <Check
                          size={14}
                          style={{ color: `var(--color-${satellite.color})` }}
                        />
                      </div>
                    )}
                  </div>

                  <div class="flex items-start gap-3 mb-2">
                    <div
                      class={`p-2 rounded-lg ${
                        isSelected ? "bg-base/20" : "bg-surface1"
                      }`}
                    >
                      <IconComponent
                        size={20}
                        style={isSelected ? { color: "var(--color-base)" } : { color: "var(--color-text)" }}
                      />
                    </div>
                    <div class="flex-1">
                      <div class={`text-sm font-bold mb-1 ${isSelected ? "text-base" : ""}`}>
                        {satellite.name}
                      </div>
                      <div class={`text-xs ${isSelected ? "text-base/80" : "text-subtext1"}`}>
                        {satellite.description}
                      </div>
                    </div>
                  </div>
                  {(showInfo === satellite.id || isSelected) && (
                    <div 
                      class="mt-3 pt-3 border-t border-current/20 animate-fade-in-down"
                      style={{
                        animation: "fadeInDown 0.4s ease-out forwards",
                      }}
                    >
                      <div class="text-xs font-semibold mb-1">Use Cases:</div>
                      <ul class="text-xs space-y-1">
                        {satellite.use_cases.map((useCase, idx) => (
                          <li 
                            key={idx} 
                            class="flex items-center gap-1 opacity-0"
                            style={{
                              animation: `fadeIn 0.3s ease-out forwards ${0.1 + idx * 0.1}s`,
                            }}
                          >
                            <span class="inline-block w-1 h-1 rounded-full bg-current"></span>
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {installCommand && (
          <div class="px-4 sm:px-8 pb-6">
            <div class="bg-mantle rounded-xl border border-surface1 overflow-hidden">
              <div class="flex items-center justify-between p-4 bg-surface0 border-b border-surface1">
                <h4
                  class="text-sm font-semibold flex items-center gap-2"
                  style={{ color: "var(--color-text)" }}
                >
                  <Terminal size={16} style={{ color: "var(--color-subtext1)" }} />
                  Installation Script
                </h4>
                <div class="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadScript}
                    class="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "var(--color-yellow)",
                      color: "var(--color-base)",
                    }}
                    title="Download script"
                  >
                    <Download size={14} />
                    <span class="hidden sm:inline">Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(installCommand)}
                    class="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: copied ? "var(--color-green)" : "var(--color-blue)",
                      color: "var(--color-base)",
                    }}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span class="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
              <div class="p-4 overflow-x-auto">
                <pre
                  class="text-xs sm:text-sm font-mono leading-relaxed"
                  style={{ color: "var(--color-text)" }}
                >
                  <code>{installCommand}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        <div class="px-4 sm:px-8 pb-6 sm:pb-8">
          <div class="bg-surface0/50 rounded-lg border border-surface1/50 p-4">
            <p
              class="text-xs sm:text-sm leading-relaxed"
              style={{ color: "var(--color-subtext1)" }}
            >
              <span class="font-semibold" style={{ color: "var(--color-text)" }}>
                About Satellites:
              </span>{" "}
              Satellites are minimal, purpose-built executables designed for containerized
              environments and microservice architectures. Each satellite focuses on a single
              capability, providing smaller container images, faster startup times, and better
              resource utilization.
            </p>
          </div>
        </div>

        {selectedSatellites.length > 0 && (
          <div class="px-4 sm:px-8 pb-6 sm:pb-8">
            <div class="bg-blue/10 rounded-lg border border-blue/20 p-4">
              <p
                class="text-xs sm:text-sm leading-relaxed mb-2 font-semibold"
                style={{ color: "var(--color-blue)" }}
              >
                💡 Quick Start
              </p>
              <p class="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--color-subtext1)" }}>
                After installation, each satellite will be available as a standalone command.
                For example: <code class="px-2 py-1 rounded bg-surface1 font-mono text-xs">
                  andromeda-run script.ts
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
