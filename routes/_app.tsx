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
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/logo.svg" />
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
});`,
          }}
        />
      </head>
      <body class="min-h-screen bg-base text-text">
        <Component />
      </body>
    </html>
  );
}
