import { Target, Zap } from "lucide-preact";

import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";

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
            The simplest JavaScript and TypeScript runtime, 100% written in Rust
            🦀 and powered by{" "}
            <a
              href="https://trynova.dev/"
              class="text-text hover:text-subtext0 underline font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nova
            </a>
          </p>

          {/* Install Command */}
          <div class="max-w-2xl mx-auto mb-8">
            <pre class="bg-black text-green-400 p-4 rounded-lg text-left overflow-x-auto border border-surface1">
              <code>cargo install --git https://github.com/tryandromeda/andromeda</code>
            </pre>
          </div>

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
                Powered by{" "}
                <a
                  href="https://trynova.dev/"
                  class="text-text hover:text-subtext0 underline font-semibold transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Nova
                </a>{" "}
                engine for exceptional JavaScript and TypeScript execution
                performance.
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
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section id="install" class="py-20 px-4 bg-base">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl font-bold mb-8 text-text">Quick Start</h2>
          <p class="text-xl text-subtext1 mb-12">
            Get productive with Andromeda in seconds
          </p>
          <div class="max-w-2xl mx-auto">
            <div class="text-left">
              <pre class="bg-black text-green-400 p-6 rounded-lg overflow-x-auto border border-surface1">
                <code>{`# Install Andromeda
cargo install --git https://github.com/tryandromeda/andromeda

# Run your TypeScript/JavaScript files
andromeda run app.ts`}</code>
              </pre>
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
              href="/docs"
              class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Read Full Documentation
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
