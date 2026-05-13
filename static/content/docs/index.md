---
title: "Andromeda Documentation"
description: "Comprehensive guides and API references for the Andromeda JavaScript/TypeScript runtime"
section: "Getting Started"
order: 1
id: "overview"
---

Welcome to the Andromeda documentation. Andromeda is a modern, fast, and secure
JavaScript and TypeScript runtime built from the ground up in Rust and powered
by the [Nova Engine](https://trynova.dev/) and [Oxc](https://oxc.rs).

> **Note:** Andromeda is in active development (current version `0.1.10`). While
> functional, it is not yet recommended for production use.

## Documentation Structure

### Getting Started

- [**Installation Guide**](/docs/installation) - How to install and set up
  Andromeda
- [**Quick Start**](/docs/quick-start) - Your first Andromeda program
- [**CLI Reference**](/docs/cli-reference) - Complete command-line interface
  documentation
- [**Configuration**](/docs/configuration) - `andromeda.json` / `.toml` /
  `.yaml` reference

### API Documentation

- [**File System API**](/docs/api/file-system) - File and directory I/O with
  sync and async variants
- [**Canvas API**](/docs/api/canvas) - GPU-accelerated 2D graphics and image
  export
- [**Window API**](/docs/api/window) - Native OS windows via winit (`window`
  feature)
- [**Crypto API**](/docs/api/crypto) - `crypto.subtle`, `randomUUID`, secure
  random
- [**Console API**](/docs/api/console) - Console output and formatting
- [**Performance API**](/docs/api/performance) - High-resolution timing, marks
  and measures
- [**Process API**](/docs/api/process) - `Andromeda.args`, `env`, `exit`,
  signals, subprocess `Command`
- [**Time API**](/docs/api/time) - `setTimeout`, `setInterval`,
  `Andromeda.sleep`
- [**Fetch API**](/docs/api/fetch) - `fetch`, `Request`, `Response`, `Headers`
- [**HTTP Server**](/docs/api/serve) - `Andromeda.serve()` for HTTP services
- [**URL API**](/docs/api/url) - `URL` and `URLSearchParams`
- [**Web APIs**](/docs/api/web) - `EventTarget`, `TextEncoder`/`TextDecoder`,
  `navigator`, `structuredClone`, `atob` / `btoa`
- [**SQLite API**](/docs/api/sqlite) - Built-in synchronous `DatabaseSync` /
  `Database`
- [**Web Storage API**](/docs/api/web-storage) - `localStorage` and
  `sessionStorage` (SQLite-backed)
- [**Cache Storage API**](/docs/api/cache-storage) - HTTP response caching
- [**File API**](/docs/api/file) - `Blob`, `File`, and metadata
- [**Streams API**](/docs/api/streams) - `ReadableStream`, `WritableStream`,
  `TransformStream`
- [**Cron API**](/docs/api/cron) - `Andromeda.cron` with cron-string and JSON
  schedules
- [**Web Locks API**](/docs/api/web-locks) - `navigator.locks` for
  shared-resource coordination
- [**Import Maps**](/docs/api/import-maps) - Bare specifiers and module
  resolution

### Development

- [**Contributing Guide**](/docs/contributing) - How to contribute to Andromeda
- [**Building from Source**](/docs/building) - Compiling Andromeda yourself
- [**Testing Guide**](/docs/testing) - Running and writing tests
- [**Language Server**](/docs/cli-reference#lsp) - LSP integration for editors

### Developer Tools

- [**REPL**](/docs/cli-reference#repl) - Interactive development environment
- [**Formatter**](/docs/cli-reference#fmt) - Code formatting
- [**Bundler**](/docs/cli-reference#bundle) - Single-file bundling
- [**Linter**](/docs/cli-reference#lint) - Code analysis and linting
- [**Type Checker**](/docs/cli-reference#check) - TypeScript type checking
- [**Compiler**](/docs/cli-reference#compile) - Single-file executable creation
- [**Tasks**](/docs/cli-reference#task) - Run scripts defined in
  `andromeda.json`

### Reference

- [**Examples Index**](/docs/examples/index) - Code examples and practical
  demonstrations
- [**FAQ**](/docs/faq) - Frequently asked questions
- [**Troubleshooting**](/docs/troubleshooting) - Common issues and solutions

## Standards Compliance

Andromeda aims to be [**WinterTC**](https://wintertc.org/) compliant for broad
interoperability with the wider JavaScript runtime ecosystem.

APIs follow established standards including:

- **WHATWG** - URL, Encoding, Fetch, Streams, DOM events
- **W3C** - Canvas 2D, Performance, Web Crypto, Web Locks, Cache Storage
- **ECMAScript** - Modern JavaScript with zero-config TypeScript

## Key Features

- **Zero-config TypeScript** - Run `.ts` files directly, no transpilation step
- **Rust foundation** - Memory-safe, native performance
- **Nova engine** - Modern JS engine from [trynova.dev](https://trynova.dev/)
- **GPU-accelerated Canvas** - WGPU-backed `OffscreenCanvas` with PNG/JPEG
  export
- **Web Crypto API** - `SubtleCrypto`, `randomUUID`, `getRandomValues`
- **SQLite** - Bundled `DatabaseSync` for synchronous database access
- **File system** - Sync and async APIs for text and binary files
- **Web Storage** - `localStorage` and `sessionStorage` with persistence
- **Fetch and networking** - `fetch`, `Request`, `Response`, `Headers`, TLS
- **Streams** - `ReadableStream`, `WritableStream`, `TransformStream`
- **Import Maps** - Bare specifiers and CDN resolution
- **HTTP server** - `Andromeda.serve()` for building web services
- **Cron scheduling** - `Andromeda.cron()` with cron-string and JSON schedules
- **Full toolchain** - `run`, `repl`, `fmt`, `lint`, `check`, `bundle`,
  `compile`, `task`, `upgrade`
- **LSP** - Built-in language server with diagnostics
- **Self-updater** - `andromeda upgrade`
- **Shell completions** - bash, zsh, fish, PowerShell
- **Optional native windowing** - `Andromeda.Window` (winit) behind the `window`
  feature

## Architecture

Andromeda is composed of three workspace crates:

| Crate               | Description                                    |
| ------------------- | ---------------------------------------------- |
| `andromeda`         | CLI and developer tools                        |
| `andromeda-core`    | Runtime engine and JavaScript execution        |
| `andromeda-runtime` | Runtime extensions and Web API implementations |

The runtime is modular — extensions can be enabled or disabled at build time:

- **Always on** - Console, Time, Cron, Process, Command, URL, Web, Web Locks,
  File, BroadcastChannel, Fetch, Net, Streams, TLS, FFI, WebIDL, File system
- **Feature-gated** - Canvas (`canvas`), HTTP serve (`serve`), Crypto
  (`crypto`), Storage / SQLite / Cache Storage (`storage`), Native windowing
  (`window`), Virtual FS (`virtualfs`)

## Andromeda Satellites

**Satellites** are minimal, purpose-built executables designed for containerized
environments and microservice architectures:

- **andromeda-run** - Execute JavaScript/TypeScript in production containers
- **andromeda-compile** - Compile JS/TS to executables
- **andromeda-fmt** - Format code
- **andromeda-lint** - Lint code
- **andromeda-bundle** - Bundle and minify

## Getting Help

- [Discord Community](https://discord.gg/tgjAnX2Ny3)
- [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)
- [GitHub Discussions](https://github.com/tryandromeda/andromeda/discussions)
- [Official Website](https://tryandromeda.dev)

## License

Andromeda is licensed under the
[Mozilla Public License Version 2.0](https://github.com/tryandromeda/andromeda/blob/main/LICENSE.md).
