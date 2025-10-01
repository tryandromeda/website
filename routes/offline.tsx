import Footer from "../components/Footer.tsx";
import NavBar from "../components/NavBar.tsx";
import TryAgainButton from "../islands/TryAgainButton.tsx";

export default function Offline() {
  return (
    <>
      <NavBar />
      <main class="min-h-screen pt-32 pb-20">
        <div class="container mx-auto px-4 max-w-4xl text-center">
          <div class="text-8xl mb-8 opacity-20">📡</div>
          <h1 class="text-4xl md:text-5xl font-bold text-text mb-6">
            You're Offline
          </h1>
          <p class="text-xl text-subtext1 mb-8 max-w-2xl mx-auto">
            It looks like you're not connected to the internet. Some content may
            not be available, but you can still browse cached documentation
            pages.
          </p>

          <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div class="p-6 bg-surface0 rounded-lg border border-surface1">
              <h3 class="text-lg font-semibold text-text mb-2">
                Available Offline
              </h3>
              <ul class="text-left text-subtext1 space-y-1">
                <li>• Documentation pages</li>
                <li>• API references</li>
                <li>• Quick start guide</li>
                <li>• Installation instructions</li>
              </ul>
            </div>

            <div class="p-6 bg-surface0 rounded-lg border border-surface1">
              <h3 class="text-lg font-semibold text-text mb-2">
                Requires Connection
              </h3>
              <ul class="text-left text-subtext1 space-y-1">
                <li>• Live GitHub stats</li>
                <li>• Recent activity</li>
                <li>• Blog feed updates</li>
                <li>• External links</li>
              </ul>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/docs/index"
              class="border border-surface1 bg-crust hover:bg-mantle text-text px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Documentation
            </a>{" "}
            <TryAgainButton />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
