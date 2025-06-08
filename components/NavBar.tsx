import { GithubIcon } from "lucide-preact";

export default function NavBar() {
  return (
    <nav class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div class="bg-base/60 backdrop-blur-xl border border-surface1 rounded-2xl shadow-lg px-8 py-3">
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center space-x-3">
            <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
            <span class="text-xl font-bold text-text">Andromeda</span>
          </a>
          <div class="hidden sm:flex items-center space-x-8">
            <a
              href="/#features"
              class="text-subtext1 hover:text-text transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="/docs"
              class="text-subtext1 hover:text-text transition-colors font-medium"
            >
              Documentation
            </a>
            <a
              href="https://github.com/tryandromeda/andromeda"
              class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-200 border border-surface2"
            >
              <GithubIcon class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
