import {
  Bolt,
  Cpu,
  Database,
  Github,
  Globe,
  Image,
  Lock,
  MessageSquare,
  Package,
  Rocket,
  Target,
  Wrench,
  Zap,
} from "lucide-preact";

import Footer from "../components/Footer.tsx";
import NavBar from "../components/NavBar.tsx";
import AnimatedCodeBlock from "../islands/AnimatedCodeBlock.tsx";
import GitHubStats from "../islands/GitHubStats.tsx";
import InstallToggle from "../islands/InstallToggle.tsx";
import ParticleBackground from "../islands/ParticleBackground.tsx";
import RecentActivity from "../islands/RecentActivity.tsx";
import ScrollAnimations from "../islands/ScrollAnimations.tsx";
import TerminalDemo from "../islands/TerminalDemo.tsx";
import WPTMetrics from "../islands/WPTMetrics.tsx";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <ScrollAnimations />
      <NavBar />
      {/* Hero Section */}
      <section class="pt-32 pb-20 px-4 bg-base relative z-10">
        <div class="container mx-auto text-center">
          <img
            src="/logo.svg"
            alt="Andromeda"
            class="hero-logo mx-auto w-24 h-24 mb-8 animate-spin [animation-duration:10000ms]"
          />
          <div class="hero-content">
            <h1 class="text-6xl font-bold mb-6 text-text animate-on-scroll fade-in-up">
              Andromeda
            </h1>
            <p class="text-xl text-subtext1 max-w-3xl mx-auto leading-relaxed mb-8 animate-on-scroll fade-in-up">
              A modern, fast, and secure JavaScript & TypeScript runtime built
              from the ground up in Rust 🦀 and powered by{" "}
              <a
                href="https://trynova.dev/"
                class="text-text hover:text-subtext0 underline font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                The Nova Engine
              </a>
              . Zero-config TypeScript support, hardware-accelerated graphics,
              comprehensive Web APIs, and developer-first tooling for the next
              generation of JavaScript applications.
            </p>

            {/* Key Benefits */}
            <div class="flex flex-wrap justify-center gap-6 mb-8 text-sm text-subtext0 animate-on-scroll fade-in-up">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green rounded-full"></span>
                <span>Memory Safe</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue rounded-full"></span>
                <span>GPU Accelerated</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow rounded-full"></span>
                <span>Zero Config TypeScript</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red rounded-full"></span>
                <span>WinterTC Compliant</span>
              </div>
            </div>

            {/* Install Command */}
            <div class="max-w-4xl mx-auto mb-8 animate-on-scroll scale-in">
              <InstallToggle />
            </div>

            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll fade-in-up">
              <a
                href="#features"
                class="interactive-button border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-all hover-lift"
              >
                Learn More
              </a>
              <a
                href="/docs/index"
                class="interactive-button border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-all hover-lift"
              >
                Documentation
              </a>
              <a
                href="/blog"
                class="interactive-button border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-all hover-lift"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="py-20 px-4 bg-mantle">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-16 text-text animate-on-scroll fade-in-up">
            Why Andromeda?
          </h2>
          <div class="grid md:grid-cols-3 gap-8 stagger-children animate-on-scroll">
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all hover-lift float-animation">
              <div class="text-4xl mb-4">
                <Package size={36} class="mx-auto text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Built in Rust
              </h3>
              <p class="text-subtext1">
                Leveraging Rust's performance and safety guarantees for a
                lightning-fast runtime experience.
              </p>
            </div>
            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all hover-lift">
              <div class="flex justify-center mb-4">
                <Zap
                  size={48}
                  class="text-subtext0 hover:text-yellow transition-colors duration-300 hover:scale-110 transform"
                />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Nova Powered
              </h3>
              <p class="text-subtext1">
                Leveraging the innovative{" "}
                <a
                  href="https://trynova.dev/"
                  class="text-text hover:text-subtext0 underline font-semibold transition-colors glitch-effect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nova
                </a>{" "}
                engine to provide a modern JavaScript and TypeScript runtime
                experience with promising performance potential.
              </p>
            </div>
            <div
              class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all hover-lift float-animation"
              style="animation-delay: 1s;"
            >
              <div class="flex justify-center mb-4">
                <Target
                  size={48}
                  class="text-subtext0 hover:text-green transition-colors duration-300 hover:rotate-45 transform"
                />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Simple & Clean
              </h3>
              <p class="text-subtext1">
                Minimal setup, maximum productivity. Focus on building instead
                of configuring.
              </p>
            </div>

            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all">
              <div class="text-4xl mb-4">
                <Cpu size={36} class="mx-auto text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Language Server
              </h3>
              <p class="text-subtext1">
                Built-in LSP support with real-time diagnostics, comprehensive
                linting, and rich error messages for VS Code, Neovim, and other
                editors.
              </p>
            </div>

            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all">
              <div class="text-4xl mb-4">
                <Image size={36} class="mx-auto text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                GPU Canvas
              </h3>
              <p class="text-subtext1">
                Hardware-accelerated 2D Canvas API with WGPU backend, linear
                gradients, and PNG export capabilities for high-performance
                graphics.
              </p>
            </div>

            <div class="text-center p-6 bg-base rounded-lg shadow-sm border border-surface0 hover:border-surface1 transition-all">
              <div class="text-4xl mb-4">
                <Package size={36} class="mx-auto text-subtext0" />
              </div>
              <h3 class="text-xl font-semibold mb-4 text-text">
                Complete Toolchain
              </h3>
              <p class="text-subtext1">
                REPL, formatter, bundler, linter, compiler, and self-updater -
                everything you need for modern JavaScript/TypeScript
                development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section class="py-20 px-4 bg-base">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-16 text-text animate-on-scroll fade-in-up">
            Technical Specifications
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto stagger-children animate-on-scroll">
            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Github size={18} class="inline-block" />
                </span>{" "}
                Architecture
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• Rust-based runtime engine</li>
                <li>• Nova JavaScript engine integration</li>
                <li>• WGPU-powered graphics backend</li>
                <li>• Zero-copy data structures</li>
                <li>• Multi-threaded execution model</li>
              </ul>
            </div>

            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Globe size={18} class="inline-block" />
                </span>{" "}
                Web Standards
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• WHATWG Fetch API</li>
                <li>• W3C Canvas 2D Context</li>
                <li>• Web Crypto API</li>
                <li>• TextEncoder/TextDecoder</li>
                <li>• WinterTC compliance</li>
              </ul>
            </div>

            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Rocket size={18} class="inline-block" />
                </span>{" "}
                Performance
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• Sub-10ms startup time</li>
                <li>• Hardware-accelerated graphics</li>
                <li>• Efficient memory management</li>
                <li>• Optimized module resolution</li>
                <li>• Native binary compilation</li>
              </ul>
            </div>

            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Wrench size={18} class="inline-block" />
                </span>{" "}
                Developer Tools
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• Built-in Language Server Protocol</li>
                <li>• Interactive REPL with syntax highlighting</li>
                <li>• Code formatter and linter</li>
                <li>• Module bundler</li>
                <li>• Single-file executable compiler</li>
              </ul>
            </div>

            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Lock size={18} class="inline-block" />
                </span>{" "}
                Security
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• Memory-safe Rust foundation</li>
                <li>• Secure cryptographic primitives</li>
                <li>• Sandboxed execution environment</li>
                <li>• Permission-based API access</li>
                <li>• No undefined behavior</li>
              </ul>
            </div>

            <div class="p-6 bg-mantle rounded-lg border border-surface0 hover:border-surface1 transition-all">
              <h3 class="text-lg font-semibold mb-4 text-text flex items-center">
                <span class="mr-2">
                  <Package size={18} class="inline-block" />
                </span>{" "}
                Platform Support
              </h3>
              <ul class="text-subtext1 space-y-2 text-sm">
                <li>• Linux (x86_64, ARM64)</li>
                <li>• macOS (Intel, Apple Silicon)</li>
                <li>• Windows (x86_64)</li>
                <li>• Docker containerization</li>
                <li>• Cross-compilation support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section class="py-20 px-4 bg-mantle">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-16 text-text animate-on-scroll fade-in-up">
            Built for Modern Applications
          </h2>
          <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div class="space-y-8 animate-on-scroll fade-in-left">
              <div class="p-6 bg-base rounded-lg border border-surface0 hover:border-surface1 transition-all">
                <h3 class="text-xl font-semibold mb-3 text-text flex items-center">
                  <span class="mr-3 text-2xl">
                    <Image size={20} class="inline-block" />
                  </span>
                  Graphics & Visualization
                </h3>
                <p class="text-subtext1 mb-4">
                  Create stunning visualizations, charts, and graphics with
                  hardware-accelerated Canvas API. Perfect for data
                  visualization, game development, and creative coding.
                </p>
                <div class="text-sm text-subtext0 bg-surface0 rounded p-3 font-mono">
                  <div>• Real-time data dashboards</div>
                  <div>• Scientific visualizations</div>
                  <div>• Interactive animations</div>
                  <div>• Image processing pipelines</div>
                </div>
              </div>

              <div class="p-6 bg-base rounded-lg border border-surface0 hover:border-surface1 transition-all">
                <h3 class="text-xl font-semibold mb-3 text-text flex items-center">
                  <span class="mr-3 text-2xl">
                    <Bolt size={20} class="inline-block" />
                  </span>
                  High-Performance Scripts
                </h3>
                <p class="text-subtext1 mb-4">
                  Build fast automation scripts, data processing pipelines, and
                  system utilities with near-native performance and memory
                  safety.
                </p>
                <div class="text-sm text-subtext0 bg-surface0 rounded p-3 font-mono">
                  <div>• Build tools and automation</div>
                  <div>• Data transformation scripts</div>
                  <div>• System administration tools</div>
                  <div>• Performance-critical applications</div>
                </div>
              </div>
            </div>

            <div class="space-y-8 animate-on-scroll fade-in-right">
              <div class="p-6 bg-base rounded-lg border border-surface0 hover:border-surface1 transition-all">
                <h3 class="text-xl font-semibold mb-3 text-text flex items-center">
                  <span class="mr-3 text-2xl">
                    <Globe size={20} class="inline-block" />
                  </span>
                  Web Services & APIs
                </h3>
                <p class="text-subtext1 mb-4">
                  Develop lightweight web services, APIs, and microservices with
                  built-in security features and excellent performance
                  characteristics.
                </p>
                <div class="text-sm text-subtext0 bg-surface0 rounded p-3 font-mono">
                  <div>• REST and GraphQL APIs</div>
                  <div>• Microservices architecture</div>
                  <div>• Real-time applications</div>
                  <div>• Edge computing functions</div>
                </div>
              </div>

              <div class="p-6 bg-base rounded-lg border border-surface0 hover:border-surface1 transition-all">
                <h3 class="text-xl font-semibold mb-3 text-text flex items-center">
                  <span class="mr-3 text-2xl">
                    <Cpu size={20} class="inline-block" />
                  </span>
                  Scientific Computing
                </h3>
                <p class="text-subtext1 mb-4">
                  Leverage SQLite integration, cryptographic APIs, and
                  performance monitoring for research, analysis, and
                  computational workflows.
                </p>
                <div class="text-sm text-subtext0 bg-surface0 rounded p-3 font-mono">
                  <div>• Data analysis and modeling</div>
                  <div>• Simulation and modeling</div>
                  <div>• Research computation</div>
                  <div>• Algorithm prototyping</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section class="py-20 px-4 bg-base">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-center mb-16 text-text animate-on-scroll fade-in-up">
            How Andromeda Compares
          </h2>
          <div class="max-w-5xl mx-auto animate-on-scroll scale-in">
            <div class="overflow-x-auto rounded-lg border border-surface0">
              <table class="w-full min-w-[500px] border-collapse bg-mantle">
                <thead>
                  <tr class="border-b border-surface0">
                    <th class="text-left p-3 md:p-4 text-text font-semibold min-w-[160px]">
                      Feature
                    </th>
                    <th class="text-center p-3 md:p-4 text-text font-semibold min-w-[120px]">
                      Andromeda
                    </th>
                    <th class="text-center p-3 md:p-4 text-subtext1 min-w-[100px]">
                      Node.js
                    </th>
                    <th class="text-center p-3 md:p-4 text-subtext1 min-w-[100px]">
                      Deno
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Memory Usage (Base)
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ~41MB
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">~89MB</td>
                    <td class="p-3 md:p-4 text-center text-subtext1">~116MB</td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Zero-config TypeScript
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ Handled natively
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Type step
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Type step
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Runtime Engine
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      Nova (Rust)
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      V8 (C++)
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      V8 (C++)
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Hardware-Accelerated Graphics
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ WGPU Canvas
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✗ No Canvas
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      Partial
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Built-in Database
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ SQLite Native
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ SQLite (v22+)
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ SQLite API
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Single-file Compilation
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ Native
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ~ Third-party
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Built-in
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      WinterTC Web Standards
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ Full compliance
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Compatible
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Compatible
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Language Server Protocol
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      ✓ Integrated
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ~ TypeScript LSP
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Built-in
                    </td>
                  </tr>
                  <tr class="border-b border-surface0/50">
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Package Manager
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      None yet
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      npm/yarn/pnpm
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      ✓ Built-in
                    </td>
                  </tr>
                  <tr>
                    <td class="p-3 md:p-4 text-subtext1 font-medium">
                      Security Model
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1 font-medium">
                      Memory safe
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      Runtime checks
                    </td>
                    <td class="p-3 md:p-4 text-center text-subtext1">
                      Permissions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-6 text-center">
              <p class="text-sm text-subtext0">
                * Performance numbers are from the project's test harness and
                may not be directly comparable across different runtimes or
                hardware. See the WPT Metrics below for raw data and links to
                the test artifacts.
              </p>
            </div>
            <div class="mt-8 animate-on-scroll fade-in-up">
              <WPTMetrics />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="install" class="py-20 px-4 bg-base">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold mb-8 text-text text-center animate-on-scroll fade-in-up">
            Get Started in Minutes
          </h2>
          <p class="text-xl text-subtext1 mb-12 text-center max-w-3xl mx-auto animate-on-scroll fade-in-up">
            Experience the power of Rust-based JavaScript runtime with zero
            configuration
          </p>

          <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-12">
            {/* Installation */}
            <div class="animate-on-scroll fade-in-left">
              <InstallToggle />
            </div>

            {/* Animated Code Example */}
            <div class="animate-on-scroll fade-in-right">
              <AnimatedCodeBlock />
            </div>
          </div>

          {/* Live Terminal Demo Section */}
          <div class="max-w-4xl mx-auto mb-12 animate-on-scroll scale-in">
            <div class="text-center mb-6">
              <h4 class="text-2xl font-semibold text-text mb-2">
                See Andromeda In Action
              </h4>
              <p class="text-subtext1">
                Watch a live demonstration of Andromeda's capabilities
              </p>
            </div>
            <TerminalDemo />
          </div>

          {/* Feature Examples */}
          <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto stagger-children animate-on-scroll">
            <div class="bg-mantle rounded-lg border border-surface1 p-6 hover:border-surface2 transition-all hover-lift code-block-enhanced">
              <h4 class="text-lg font-semibold mb-3 text-text flex items-center">
                <span class="mr-2">
                  <Image size={16} class="inline-block mr-1" />
                </span>{" "}
                Graphics
              </h4>
              <div class="terminal-window">
                <pre class="text-xs font-mono text-subtext1 bg-surface0 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words matrix-text">
{`const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;

// Hardware-accelerated gradients
const gradient = ctx.createLinearGradient(
  0, 0, 400, 0
);
gradient.addColorStop(0, "#ff6b6b");
gradient.addColorStop(1, "#4ecdc4");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 400, 300);
canvas.saveAsPng("gradient.png");`}
                </pre>
              </div>
            </div>

            <div class="bg-mantle rounded-lg border border-surface1 p-6 hover:border-surface2 transition-all hover-lift code-block-enhanced float-animation">
              <h4 class="text-lg font-semibold mb-3 text-text flex items-center">
                <span class="mr-2">
                  <Database size={16} class="inline-block mr-1" />
                </span>{" "}
                Database
              </h4>
              <div class="terminal-window">
                <pre class="text-xs font-mono text-subtext1 bg-surface0 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words">
{`const db = new DatabaseSync("app.db");

db.exec(\`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT
)\`);

const stmt = db.prepare(
  "INSERT INTO users (name, email) VALUES (?, ?)"
);
stmt.run("Alice", "alice@example.com");`}
                </pre>
              </div>
            </div>

            <div class="bg-mantle rounded-lg border border-surface1 p-6 hover:border-surface2 transition-all hover-lift code-block-enhanced">
              <h4 class="text-lg font-semibold mb-3 text-text flex items-center">
                <span class="mr-2">
                  <Lock size={16} class="inline-block mr-1" />
                </span>{" "}
                Crypto
              </h4>
              <div class="terminal-window">
                <pre class="text-xs font-mono text-subtext1 bg-surface0 rounded p-3 overflow-x-auto whitespace-pre-wrap break-words">
{`// Generate secure random values
const id = crypto.randomUUID();
const bytes = crypto.getRandomValues(
  new Uint8Array(32)
);

// Hash data with Web Crypto API
const data = new TextEncoder()
  .encode("secret");
const hash = await crypto.subtle.digest(
  "SHA-256", data
);

console.log("Secure hash:", hash);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="docs" class="py-20 px-4 bg-mantle">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl font-bold mb-8 text-text animate-on-scroll fade-in-up">
            Documentation
          </h2>
          <p class="text-xl text-subtext1 mb-12 animate-on-scroll fade-in-up">
            Everything you need to know to get productive with Andromeda
          </p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto stagger-children animate-on-scroll">
            <a
              href="/docs/index"
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-all border border-surface0 hover:border-surface1"
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
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-all border border-surface0 hover:border-surface1"
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
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-all border border-surface0 hover:border-surface1"
            >
              <h3 class="text-lg font-semibold mb-2 text-text">Examples</h3>
              <p class="text-subtext1">Code samples and real-world use cases</p>
            </a>
            <a
              href="/std"
              class="block p-6 bg-base rounded-lg hover:shadow-md transition-all border border-surface0 hover:border-surface1"
              aria-label="Open standard library documentation"
            >
              <h3 class="text-lg font-semibold mb-2 text-text">
                Standard Library
              </h3>
              <p class="text-subtext1">
                Browse the runtime's standard library documentation
              </p>
            </a>
          </div>
          <div class="mt-12 animate-on-scroll fade-in-up">
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
          <h2 class="text-4xl font-bold text-center mb-8 text-text animate-on-scroll fade-in-up">
            Join Our Community
          </h2>
          <p class="text-xl text-subtext1 text-center mb-12 max-w-3xl mx-auto animate-on-scroll fade-in-up">
            Andromeda is built by developers, for developers. Join our growing
            community and help shape the future of JavaScript runtimes.
          </p>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="animate-on-scroll fade-in-left">
              <GitHubStats />
            </div>
            <div class="animate-on-scroll fade-in-right">
              <RecentActivity />
            </div>
          </div>

          <div class="mt-12 text-center animate-on-scroll fade-in-up">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/tryandromeda/andromeda"
                class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} class="inline-block mr-2" /> Star on GitHub
              </a>
              <a
                href="https://discord.gg/tgjAnX2Ny3"
                class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare size={16} class="inline-block mr-2" />{" "}
                Join Discord
              </a>
              <a
                href="/docs/contributing"
                class="border border-surface1 hover:border-surface2 text-text px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Rocket size={16} class="inline-block mr-2" /> Contribute
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
