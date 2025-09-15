// deno-lint-ignore-file react-no-danger
import type { PageProps } from "fresh";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Andromeda</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tryandromeda.dev/" />
        <meta property="og:title" content="Andromeda" />
        <meta
          property="og:description"
          content="Andromeda - Rust-powered JavaScript and TypeScript runtime"
        />
        <meta
          name="description"
          content="Andromeda - Rust-powered JavaScript and TypeScript runtime"
        />
        <meta
          name="keywords"
          content="Andromeda, Rust, JavaScript, TypeScript, runtime"
        />
        {/* <link rel="stylesheet" href="/styles.css" /> */}
        <link rel="icon" href="/logo.svg" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#89b4fa" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-title" content="Andromeda" />
        <link rel="apple-touch-icon" href="/logo.svg" />

        {/* PWA Cache Manager */}
        <script src="/pwa-cache.js" defer></script>
        {/* RSS/Atom feed discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Andromeda Blog RSS Feed"
          href="/blog/rss.xml"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Andromeda Blog Atom Feed"
          href="/blog/atom.xml"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          title="Andromeda Blog JSON Feed"
          href="/blog/feed.json"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `function updateTheme() {
  document.documentElement.classList.toggle("dark",
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

// Initial theme setup
updateTheme();

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);

// Listen for storage changes (in case theme is changed in another tab)
window.addEventListener("storage", function(e) {
  if (e.key === "theme") {
    updateTheme();
  }
});

// Service Worker Registration for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js")
      .then(function(registration) {
        console.log("SW registration successful with scope: ", registration.scope);
        
        // Handle updates
        registration.addEventListener("updatefound", function() {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", function() {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                console.log("New content available, please refresh.");
              }
            });
          }
        });
      })
      .catch(function(error) {
        console.log("SW registration failed: ", error);
      });
  });
}`,
          }}
        />
      </head>
      <body class="min-h-screen bg-base text-text">
        <Component />
      </body>
    </html>
  );
}
