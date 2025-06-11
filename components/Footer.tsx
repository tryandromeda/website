import CompactGitHubStats from "../islands/CompactGitHubStats.tsx";

export default function Footer() {
  return (
    <footer class="py-12 px-4 border-t border-surface0 bg-base">
      <div class="container mx-auto text-center">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
          <span class="font-semibold text-text">Andromeda</span>
        </div>
        <p class="text-subtext1 mb-6">
          A modern, fast, and secure JavaScript & TypeScript runtime built from
          the ground up in Rust and powered by Nova Engine.
        </p>
        
        {/* Community stats */}
        <div class="mb-6">
          <CompactGitHubStats showForks className="justify-center" />
        </div>
        
        <div class="flex justify-center space-x-6">
          <a
            href="https://github.com/tryandromeda/andromeda"
            class="text-subtext1 hover:text-text transition-colors"
          >
            GitHub
          </a>
          <a
            href="/docs"
            class="text-subtext1 hover:text-text transition-colors"
          >
            Documentation
          </a>
          <a
            href="/blog"
            class="text-subtext1 hover:text-text transition-colors"
          >
            Blog
          </a>
          <a
            href="https://discord.gg/w8JkSeNcEe"
            class="text-subtext1 hover:text-text transition-colors"
          >
            Community
          </a>
        </div>
      </div>
    </footer>
  );
}
