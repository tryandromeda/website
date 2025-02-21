export default function Home() {
  return (
    <div class="container mx-auto p-4">
      <div class="min-h-screen text-white">
        <main class="container mx-auto mt-16 px-4">
          <div class="text-center">
            <img src="/logo.svg" alt="Andromeda" class="mx-auto w-20" />
            <a href="/" class="text-5xl font-bold mb-16 p-6">
              Andromeda
            </a>
            <p class="text-xl mt-8 mb-8">
              The simplest JavaScript and TypeScript runtime, fully written in
              Rust 🦀 and powered Nova
            </p>
          </div>
          <div class="mt-16 text-center">
            <h3 class="text-2xl font-semibold mb-4">Get Started</h3>
            <pre class="bg-black text-blue-400 p-4 rounded-lg inline-block">cargo install --git https://github.com/tryandromeda/andromeda</pre>
          </div>
          <div class="mt-16 text-center">
            <h3 class="text-2xl font-semibold mb-4">Documentation</h3>
            <a href="/docs" class="text-blue-400 hover:underline">
              Read the docs
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
