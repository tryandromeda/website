import { GithubIcon } from "lucide-preact";
import PWAStatus from "../islands/PWAStatus.tsx";
import SearchTrigger from "../islands/SearchTrigger.tsx";

export default function NavBar() {
  return (
    <>
      <nav class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
        <div class="bg-base/60 backdrop-blur-xl border border-surface1 rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
          <div class="flex items-center justify-between">
            <a
              href="/"
              class="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group transition-all duration-300 hover:scale-105"
            >
              <img
                src="/logo.svg"
                alt="Andromeda"
                class="w-6 h-6 sm:w-8 sm:h-8 group-hover:rotate-12 transition-transform duration-300"
              />
              <span class="text-lg sm:text-xl font-bold text-text group-hover:text-blue transition-colors duration-300">
                Andromeda
              </span>
            </a>
            <div class="hidden md:flex items-center space-x-3 lg:space-x-6">
              <SearchTrigger variant="navbar" />
              <a
                href="/docs/index"
                class="text-subtext1 hover:text-text transition-all duration-300 font-medium text-sm relative group"
              >
                Documentation
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-green transition-all duration-300 group-hover:w-full">
                </span>
              </a>
              <a
                href="/blog"
                class="text-subtext1 hover:text-text transition-all duration-300 font-medium text-sm relative group"
              >
                Blog
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow transition-all duration-300 group-hover:w-full">
                </span>
              </a>
              <a
                href="/std"
                class="text-subtext1 hover:text-text transition-all duration-300 font-medium text-sm relative group"
              >
                Std
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow transition-all duration-300 group-hover:w-full">
                </span>
              </a>
              <a
                href="https://github.com/tryandromeda/andromeda"
                class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-300 border border-surface2 flex-shrink-0 hover:scale-110 hover:border-blue"
              >
                <GithubIcon class="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
            </div>
            {/* Mobile menu - show search and GitHub only */}
            <div class="flex md:hidden items-center space-x-2">
              <SearchTrigger variant="navbar" />
              <a
                href="https://github.com/tryandromeda/andromeda"
                class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-200 border border-surface2"
              >
                <GithubIcon class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <PWAStatus />
    </>
  );
}
