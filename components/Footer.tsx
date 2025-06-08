export default function Footer() {
  return (
    <footer class="py-12 px-4 border-t border-gray-200 bg-white">
      <div class="container mx-auto text-center">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <img src="/logo.svg" alt="Andromeda" class="w-6 h-6" />
          <span class="font-semibold text-gray-900">Andromeda</span>
        </div>
        <p class="text-gray-600 mb-4">
          The simplest JavaScript and TypeScript runtime
        </p>
        <div class="flex justify-center space-x-6">
          <a
            href="https://github.com/tryandromeda/andromeda"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="/docs"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Documentation
          </a>
          <a
            href="https://discord.gg/w8JkSeNcEe"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Community
          </a>
        </div>
      </div>
    </footer>
  );
}
