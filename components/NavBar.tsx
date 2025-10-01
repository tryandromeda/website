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
                Standard Library
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow transition-all duration-300 group-hover:w-full">
                </span>
              </a>
              <a
                href="https://github.com/tryandromeda/andromeda"
                class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-300 border border-surface2 flex-shrink-0 hover:scale-110 hover:border-blue"
              >
                <GithubIcon class="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
              <a
                href="https://discord.gg/tgjAnX2Ny3"
                class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-200 border border-surface2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 lg:w-5 lg:h-5"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M9 8.5c0 .826.615 1.5 1.36 1.5c.762 0 1.35-.671 1.36-1.5S11.125 7 10.36 7C9.592 7 9 7.677 9 8.5M5.63 10c-.747 0-1.36-.671-1.36-1.5S4.866 7 5.63 7S7.01 7.677 7 8.5c-.013.826-.602 1.5-1.36 1.5z"
                  />
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M13.3 2.72a1 1 0 0 1 .41.342c1.71 2.47 2.57 5.29 2.25 8.53a1 1 0 0 1-.405.71c-1.16.851-2.47 1.5-3.85 1.91a.99.99 0 0 1-1.08-.357a10 10 0 0 1-.665-1.01a9.4 9.4 0 0 1-3.87 0a9 9 0 0 1-.664 1.01a1 1 0 0 1-1.09.357a12.8 12.8 0 0 1-3.85-1.91a1 1 0 0 1-.405-.711c-.269-2.79.277-5.64 2.25-8.52c.103-.151.246-.271.413-.347c.999-.452 2.05-.774 3.14-.957c.415-.07.83.128 1.04.494l.089.161q1.01-.087 2.03 0l.088-.161a1 1 0 0 1 1.04-.494c1.08.181 2.14.502 3.14.955zm-3.67.776a11 11 0 0 0-3.21 0a8 8 0 0 0-.37-.744c-.998.168-1.97.465-2.89.882c-1.83 2.68-2.32 5.29-2.08 7.86c1.07.783 2.27 1.38 3.54 1.76a8 8 0 0 0 .461-.681q.158-.26.297-.53a7.5 7.5 0 0 1-1.195-.565q.15-.109.293-.218a8.5 8.5 0 0 0 1.886.62a8.4 8.4 0 0 0 4.146-.217a8 8 0 0 0 1.04-.404q.144.117.293.218a11 11 0 0 1-.282.157a8 8 0 0 1-.915.41a9 9 0 0 0 .518.872q.117.17.241.337c1.27-.38 2.47-.975 3.54-1.76c.291-2.98-.497-5.57-2.08-7.86c-.92-.417-1.89-.712-2.89-.879q-.204.362-.37.744z"
                    clip-rule="evenodd"
                  />
                </svg>
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
              <a
                href="https://discord.gg/tgjAnX2Ny3"
                class="bg-surface0 hover:bg-surface1 text-text rounded-lg p-2 transition-all duration-200 border border-surface2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M9 8.5c0 .826.615 1.5 1.36 1.5c.762 0 1.35-.671 1.36-1.5S11.125 7 10.36 7C9.592 7 9 7.677 9 8.5M5.63 10c-.747 0-1.36-.671-1.36-1.5S4.866 7 5.63 7S7.01 7.677 7 8.5c-.013.826-.602 1.5-1.36 1.5z"
                  />
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M13.3 2.72a1 1 0 0 1 .41.342c1.71 2.47 2.57 5.29 2.25 8.53a1 1 0 0 1-.405.71c-1.16.851-2.47 1.5-3.85 1.91a.99.99 0 0 1-1.08-.357a10 10 0 0 1-.665-1.01a9.4 9.4 0 0 1-3.87 0a9 9 0 0 1-.664 1.01a1 1 0 0 1-1.09.357a12.8 12.8 0 0 1-3.85-1.91a1 1 0 0 1-.405-.711c-.269-2.79.277-5.64 2.25-8.52c.103-.151.246-.271.413-.347c.999-.452 2.05-.774 3.14-.957c.415-.07.83.128 1.04.494l.089.161q1.01-.087 2.03 0l.088-.161a1 1 0 0 1 1.04-.494c1.08.181 2.14.502 3.14.955zm-3.67.776a11 11 0 0 0-3.21 0a8 8 0 0 0-.37-.744c-.998.168-1.97.465-2.89.882c-1.83 2.68-2.32 5.29-2.08 7.86c1.07.783 2.27 1.38 3.54 1.76a8 8 0 0 0 .461-.681q.158-.26.297-.53a7.5 7.5 0 0 1-1.195-.565q.15-.109.293-.218a8.5 8.5 0 0 0 1.886.62a8.4 8.4 0 0 0 4.146-.217a8 8 0 0 0 1.04-.404q.144.117.293.218a11 11 0 0 1-.282.157a8 8 0 0 1-.915.41a9 9 0 0 0 .518.872q.117.17.241.337c1.27-.38 2.47-.975 3.54-1.76c.291-2.98-.497-5.57-2.08-7.86c-.92-.417-1.89-.712-2.89-.879q-.204.362-.37.744z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>
      <PWAStatus />
    </>
  );
}
