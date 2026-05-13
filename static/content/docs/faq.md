---
title: "Frequently Asked Questions"
description: "Common questions and answers about Andromeda"
section: "Help & Support"
order: 10
id: "faq"
---

## General

### What is Andromeda?

Andromeda is a JavaScript and TypeScript runtime built in Rust on top of the
[Nova engine](https://trynova.dev/) and [Oxc](https://oxc.rs). It runs `.ts`
files directly with no transpilation step and exposes web-standard APIs.

### Is it production-ready?

Not yet. The current release is `0.1.10` and the project is in active
development. Use it for experiments, scripts, and learning — not for critical
production workloads.

### How does it compare to Node.js, Deno, and Bun?

| Feature        | Andromeda                  | Node.js                | Deno          | Bun                  |
| -------------- | -------------------------- | ---------------------- | ------------- | -------------------- |
| Engine         | Nova (Rust)                | V8 (C++)               | V8 (Rust)     | JavaScriptCore (Zig) |
| TypeScript     | Native, in-engine          | Requires transpilation | Native        | Native               |
| Default APIs   | Web standards              | Node-specific          | Web standards | Mostly Node-compat   |
| Native modules | Web Crypto, SQLite, Canvas | Many native bindings   | Some          | Many                 |
| Maturity       | Early                      | Very mature            | Mature        | Mature               |

### Which platforms are supported?

- **Linux** (x86_64, ARM64)
- **macOS** (Intel and Apple Silicon)
- **Windows** (x86_64)

## Installation

### How do I install it?

See the [Installation Guide](/docs/installation). The fastest path:

```bash
# Linux / macOS
curl -fsSL https://tryandromeda.dev/install.sh | bash

# Windows
irm -Uri "https://tryandromeda.dev/install.ps1" | Invoke-Expression

# Cargo
cargo install --git https://github.com/tryandromeda/andromeda andromeda

# winget
winget install --id Andromeda.Andromeda
```

### How do I update?

```bash
andromeda upgrade
```

## Language Support

### What TypeScript features are supported?

Most modern TypeScript: types, generics, decorators, modules, optional chaining,
async/await, `using` declarations. Andromeda runs TS through Nova without an
intermediate transpilation step.

### Is JSX supported?

The formatter and linter understand `.jsx` / `.tsx` syntax, but JSX is not
executed at runtime today.

### Can I run plain `.js` files?

Yes. Andromeda is happy with `.js`, `.ts`, `.mjs`, and `.mts`.

### Can I use npm packages?

There is no built-in npm support. You can:

- Resolve packages from CDNs (esm.sh, jsdelivr, skypack) using
  [Import Maps](/docs/api/import-maps)
- Use ECMAScript modules directly
- Use the Andromeda standard library at `https://tryandromeda.dev/std/`

## APIs

### Which web APIs are implemented?

Documented under [API Reference](/docs/api/index). Highlights:

- Console, Performance, Time, Process, Command
- File System (sync and async)
- Fetch, Headers, Request, Response, AbortController
- URL, URLSearchParams
- TextEncoder, TextDecoder, structuredClone, atob, btoa
- Crypto (`SubtleCrypto`, `randomUUID`, `getRandomValues`)
- SQLite (`DatabaseSync`)
- localStorage, sessionStorage, Cache Storage
- Canvas (`OffscreenCanvas`)
- Streams (`ReadableStream`, `WritableStream`, `TransformStream`)
- Web Locks (`navigator.locks`)
- Events (`EventTarget`, `Event`, `CustomEvent`)
- Cron (`Andromeda.cron`)
- HTTP server (`Andromeda.serve`)

### Can Andromeda host an HTTP server?

Yes — see the [`Andromeda.serve` docs](/docs/api/serve). The current
implementation is minimal HTTP/1.1; TLS, HTTP/2, and WebSockets are on the
roadmap.

### How do I read and write files?

```typescript
// Sync
const txt = Andromeda.readTextFileSync("a.txt");
Andromeda.writeTextFileSync("b.txt", txt);

// Async
const txt2 = await Andromeda.readTextFile("a.txt");
await Andromeda.writeTextFile("b.txt", txt2);
```

See the [File System API](/docs/api/file-system).

### Can I make HTTP requests?

Yes — `fetch`, `Request`, and `Response` are implemented. See the
[Fetch API](/docs/api/fetch).

## Toolchain

### How do I format / lint / type-check / bundle?

```bash
andromeda fmt src/
andromeda lint src/
andromeda check src/
andromeda bundle src/main.ts dist/app.js
```

### Does Andromeda have a task runner?

Yes — define tasks in `andromeda.json` and run them with
`andromeda task <name>`. See the [Configuration Guide](/docs/configuration).

### Does Andromeda have a REPL?

Yes — `andromeda repl`. See the [CLI Reference](/docs/cli-reference#repl).

### Can I produce single-file executables?

```bash
andromeda compile src/main.ts ./my-tool
```

See [`compile`](/docs/cli-reference#compile).

## Debugging

### How do I debug my code?

- `console.log` and `console.error` work as expected
- `andromeda repl` for interactive exploration
- `andromeda run --verbose` for extra diagnostics
- `RUST_LOG=debug` enables runtime tracing
- The built-in LSP (`andromeda lsp`) gives diagnostics in VS Code, Neovim, and
  other LSP-aware editors

## Contributing

### How do I contribute?

See the [Contributing Guide](/docs/contributing). Highlights:

1. Fork the repo
2. Create a topic branch
3. Run `cargo fmt`, `cargo clippy`, and `cargo test --workspace`
4. Open a pull request

## Getting Help

- [Discord](https://discord.gg/tgjAnX2Ny3)
- [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)
- [GitHub Discussions](https://github.com/tryandromeda/andromeda/discussions)
