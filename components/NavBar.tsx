import { GithubIcon } from "lucide-preact";

export default function NavBar() {
  return (
    <nav class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div class="bg-white/60 backdrop-blur-xl border border-gray-300 rounded-2xl shadow-lg px-8 py-3">
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center space-x-3">
            <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
            <span class="text-xl font-bold text-gray-900">Andromeda</span>
          </a>

          <div class="hidden sm:flex items-center space-x-8">
            <a
              href="/#features"
              class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="/docs"
              class="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Documentation
            </a>
            <a
              href="https://github.com/tryandromeda/andromeda"
              class="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg p-2 transition-all duration-200 border border-gray-300"
            >
              <GithubIcon class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
