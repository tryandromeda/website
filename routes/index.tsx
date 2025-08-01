import { Target, Zap } from "lucide-preact";

import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";
import InstallToggle from "../islands/InstallToggle.tsx";
import GitHubStats from "../islands/GitHubStats.tsx";
import RecentActivity from "../islands/RecentActivity.tsx";

export default function Home() {
  return (
    <>
      <NavBar />
      {/* Hero Section */}
      <section class="pt-32 pb-20 px-4 bg-base">
        <div class="container mx-auto text-center">
          <img
            src="/logo.svg"
            alt="Andromeda"
            class="mx-auto w-24 h-24 mb-8 animate-spin [animation-duration:10000ms]"
          />
          <h1 class="text-6xl font-bold mb-6 text-text">
            Andromeda
          </h1>
          <p class="text-xl text-subtext1 max-w-3xl mx-auto leading-relaxed mb-8">
            A modern, fast, and secure JavaScript & TypeScript runtime built from the ground up in Rust 🦀 and powered by{" "}
            <a
              href="https://trynova.dev/"
              class="text-text hover:text-subtext0 underline font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nova Engine
            </a>
            . Zero-config TypeScript support, rich Web APIs, native performance, and developer-first tooling.
          </p>

          {/* Install Command */}
          <div class="max-w-4xl mx-auto mb-8">
            <InstallToggle />
          </div>{" "}
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#features"
              class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </a>
            <a
              href="/docs/index"
              class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Documentation
            </a>
            <a
              href="/blog"
              class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Blog
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="py-20 px-4 bg-mantle">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-16 text-text">
            Why Andromeda?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="text-4xl mb-4">🦀</div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Built with Rust
              </h3>
              <p class="text-subtext1">
                Leveraging Rust's performance and safety guarantees for a
                lightning-fast runtime experience.
              </p>
            </div>
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="flex justify-center mb-4">
                <Zap size={48} class="text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Nova Powered
              </h3>
              <p class="text-subtext1">
                Leveraging the innovative{" "}
                <a
                  href="https://trynova.dev/"
                  class="text-text hover:text-subtext0 underline font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nova
                </a>{" "}
                engine to provide a modern JavaScript and TypeScript runtime
                experience with promising performance potential.
              </p>
            </div>
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="flex justify-center mb-4">
                <Target size={48} class="text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Simple & Clean
              </h3>
              <p class="text-subtext1">
                Minimal setup, maximum productivity. Focus on building instead
                of configuring.
              </p>
            </div>
            
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="text-4xl mb-4">🧑‍💻</div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Language Server
              </h3>
              <p class="text-subtext1">
                Built-in LSP support with real-time diagnostics, comprehensive linting, and rich error messages for VS Code, Neovim, and other editors.
              </p>
            </div>
            
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="text-4xl mb-4">🎨</div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                GPU Canvas
              </h3>
              <p class="text-subtext1">
                Hardware-accelerated 2D Canvas API with WGPU backend, linear gradients, and PNG export capabilities for high-performance graphics.
              </p>
            </div>
            
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0">
              <div class="text-4xl mb-4">📦</div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Complete Toolchain
              </h3>
              <p class="text-subtext1">
                REPL, formatter, bundler, linter, compiler, and self-updater - everything you need for modern JavaScript/TypeScript development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="install" class="py-20 px-4 bg-base">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold mb-8 text-text text-center">
            Quick Start
          </h2>
          <p class="text-xl text-subtext1 mb-12 text-center max-w-3xl mx-auto">
            Get productive with Andromeda in seconds
          </p>

          <div class="w-full max-w-2xl mx-auto">
            <div class="bg-mantle rounded-xl border border-surface1 overflow-hidden">
              {/* Header with actions */}
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-surface0 border-b border-surface1">
                <h4
                  class="text-sm sm:text-base font-semibold flex items-center gap-2"
                  style={{ color: "var(--color-text)" }}
                >
                  Installation & Usage
                </h4>
                <div class="flex gap-2">
                </div>
              </div>
              {/* Command display */}
              <div class="p-4">
                <pre
                  class="text-sm sm:text-base font-mono leading-relaxed overflow-x-auto"
                  style={{ color: "var(--color-text)" }}
                >
            <code>{`# Install Andromeda
cargo install --git https://github.com/tryandromeda/andromeda

# Run your TypeScript/JavaScript files
andromeda run app.ts

# Format your code
andromeda fmt src/

# Bundle for distribution
andromeda bundle src/main.ts dist/app.js

# Start interactive REPL
andromeda repl`}</code>
                </pre>
              </div>
            </div>

            {/* Info note */}
            <div class="mt-4 bg-surface0/50 rounded-lg border border-surface1/50 p-4">
              <p
                class="text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--color-subtext1)" }}
              >
                <span
                  class="font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  Note:
                </span>{" "}
                You'll need Rust installed to use the cargo command. For
                pre-built binaries and alternative installation methods, see the
                installation section above.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" class="py-20 px-4 bg-mantle">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl font-bold mb-8 text-text">Documentation</h2>
          <p class="text-xl text-subtext1 mb-12">
            Everything you need to know to get productive with Andromeda
          </p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="/docs/index"
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-shadow border border-surface0"
            >
              <h3 class="text-lg font-semibold mb-2 text-text">
                Getting Started
              </h3>
              <p class="text-subtext1">
                Learn the basics and get up and running quickly
              </p>
            </a>
            <a
              href="/docs/api/console"
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-shadow border border-surface0"
            >
              <h3 class="text-lg font-semibold mb-2 text-text">
                API Reference
              </h3>
              <p class="text-subtext1">
                Complete API documentation and examples
              </p>
            </a>
            <a
              href="/docs/examples/fizzbuzz"
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-shadow border border-surface0"
            >
              <h3 class="text-lg font-semibold mb-2 text-text">Examples</h3>
              <p class="text-subtext1">Code samples and real-world use cases</p>
            </a>
          </div>
          <div class="mt-12">
            <a
              href="/docs/index"
              class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Read Full Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" class="py-20 px-4 bg-base">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-8 text-text">
            Join Our Community
          </h2>
          <p class="text-xl text-subtext1 text-center mb-12 max-w-3xl mx-auto">
            Andromeda is built by developers, for developers. Join our growing
            community and help shape the future of JavaScript runtimes.
          </p>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <GitHubStats />
            <RecentActivity />
          </div>

          <div class="mt-12 text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/tryandromeda/andromeda"
                class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⭐ Star on GitHub
              </a>
              <a
                href="https://discord.gg/tgjAnX2Ny3"
                class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Join Discord
              </a>
              <a
                href="/docs/contributing"
                class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                🚀 Contribute
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
