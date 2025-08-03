import CompactGitHubStats from "../islands/CompactGitHubStats.tsx";

export default function Footer() {
  return (
    <footer class="py-16 px-4 border-t border-surface0 bg-base">
      <div class="container mx-auto">
        {/* Top section */}
        <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Brand */}
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-3 mb-4">
              <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
              <span class="font-semibold text-text text-lg">Andromeda</span>
            </div>
            <p class="text-subtext1 text-sm leading-relaxed mb-4">
              A modern, fast, and secure JavaScript & TypeScript runtime built
              from the ground up in Rust and powered by the Nova Engine.
            </p>
            <CompactGitHubStats showForks className="mb-4" />
          </div>

          {/* Documentation */}
          <div>
            <h3 class="font-semibold text-text mb-3">Documentation</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="/docs/quick-start"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Quick Start
                </a>
              </li>
              <li>
                <a
                  href="/docs/installation"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Installation
                </a>
              </li>
              <li>
                <a
                  href="/docs/api/index"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="/docs/examples/index"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="/docs/cli-reference"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  CLI Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 class="font-semibold text-text mb-3">Community</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/tryandromeda/andromeda"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/tgjAnX2Ny3"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord Community
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tryandromeda/andromeda/discussions"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discussions
                </a>
              </li>
              <li>
                <a
                  href="/docs/contributing"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Contributing
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Blog & Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 class="font-semibold text-text mb-3">Resources</h3>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  href="https://trynova.dev/"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nova
                </a>
              </li>
              <li>
                <a
                  href="https://wintertc.org/"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WinterTC Standard
                </a>
              </li>
              <li>
                <a
                  href="/docs/troubleshooting"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  Troubleshooting
                </a>
              </li>
              <li>
                <a
                  href="/docs/faq"
                  class="text-subtext1 hover:text-text transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/tryandromeda/andromeda/releases"
                  class="text-subtext1 hover:text-text transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Releases
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div class="border-t border-surface0 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-subtext1 text-sm">
              © 2025 Andromeda Runtime. Licensed under the{" "}
              <a
                href="https://github.com/tryandromeda/andromeda/blob/main/LICENSE"
                class="text-text hover:text-subtext0 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Public License 2.0
              </a>
            </div>
            <div class="flex items-center gap-4 text-sm text-subtext1">
              <span>
                Built in <a href="https://www.rust-lang.org/">Rust 🦀</a>
              </span>
              <span>•</span>
              <span>
                Powered by <a href="https://trynova.dev/">Nova</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
