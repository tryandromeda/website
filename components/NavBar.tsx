import { GithubIcon } from "lucide-preact";

export default function NavBar() {
  return (
    <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="flex items-center space-x-3">
          <img src="/logo.svg" alt="Andromeda" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">Andromeda</span>
        </a>
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="/#features"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </a>
          <a
            href="/docs"
            class="text-gray-600 hover:text-gray-900 transition-colors"
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
    </nav>
  );
}
