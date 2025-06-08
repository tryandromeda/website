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
      </head>
      <body class="min-h-screen bg-gray-50 text-gray-900">
        <Component />
      </body>
    </html>
  );
}
