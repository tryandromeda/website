---
title: "Andromeda Documentation"
description: "Comprehensive guides and API references for the Andromeda JavaScript/TypeScript runtime"
section: "Getting Started"
order: 1
id: "overview"
---

Welcome to the Andromeda documentation! Andromeda is a modern, fast, and secure
JavaScript & TypeScript runtime built from the ground up in Rust 🦀 and powered
by the Nova Engine. This documentation contains comprehensive guides and API
references to help you get started.

## 📚 Documentation Structure

### 🚀 Getting Started

- [**Installation Guide**](/docs/installation) - How to install and set up
  Andromeda
- [**Quick Start**](/docs/quick-start) - Your first Andromeda program
- [**CLI Reference**](/docs/cli-reference) - Complete command-line interface
  documentation

### 🛠️ API Documentation

- [**File System API**](/docs/api/file-system) - File I/O operations and path
  manipulation
- [**Canvas API**](/docs/api/canvas) - 2D graphics and image generation
- [**Crypto API**](/docs/api/crypto) - Cryptographic operations and security
- [**Console API**](/docs/api/console) - Enhanced console output and debugging
  with CSS styling support
- [**Performance API**](/docs/api/performance) - Timing and performance
  monitoring
- [**Process API**](/docs/api/process) - System interaction and environment
  access
- [**Time API**](/docs/api/time) - Date, time, and timing utilities
- [**Fetch API**](/docs/api/fetch) - HTTP client and Headers manipulation
- [**URL API**](/docs/api/url) - URL parsing, construction, and manipulation
- [**Web APIs**](/docs/api/web) - Standard web APIs (Events,
  TextEncoder/Decoder, etc.)
- [**SQLite API**](/docs/api/sqlite) - Database operations with SQLite support
- [**Web Storage API**](/docs/api/web-storage) - localStorage and sessionStorage
  with SQLite backend
- [**Cache Storage API**](/docs/api/cache-storage) - Web-standard cache storage
  for HTTP responses and offline functionality
- [**File API**](/docs/api/file) - Web-standard File objects and file metadata
- [**Streams API**](/docs/api/streams) - Web-standard streaming data processing
- [**Cron API**](/docs/api/cron) - Schedule and manage recurring tasks with cron
  expressions

### 🔧 Development

- [**Contributing Guide**](/docs/contributing) - How to contribute to Andromeda
- [**Building from Source**](/docs/building) - Compiling Andromeda yourself
- [**Testing Guide**](/docs/testing) - Running and writing tests
- [**Language Server**](/docs/cli-reference#lsp) - LSP integration for editors

### 🛠️ Developer Tools

- [**REPL**](/docs/cli-reference#repl) - Interactive development environment
- [**Formatter**](/docs/cli-reference#fmt) - Code formatting tool
- [**Bundler**](/docs/cli-reference#bundle) - Module bundling
- [**Linter**](/docs/cli-reference#lint) - Code analysis and linting
- [**Compiler**](/docs/cli-reference#compile) - Single-file executable creation

### 📋 Reference

- [**Examples Index**](/docs/examples/index) - Code examples and practical
  demonstrations
- [**FAQ**](/docs/faq) - Frequently asked questions
- [**Troubleshooting**](/docs/troubleshooting) - Common issues and solutions

## 🎯 Standards Compliance

Andromeda aims to be **WinterTC** compliant, ensuring interoperability and
compatibility with the broader JavaScript ecosystem. WinterTC provides a test
suite for JavaScript engines to ensure they conform to ECMAScript standards and
common runtime behaviors.

Our APIs follow established web standards including:

- **WHATWG Standards** - URL, Encoding, Fetch, and Streams specifications
- **W3C Standards** - Canvas 2D Context, Performance API, Web Crypto API, Cache
  Storage
- **ECMAScript Standards** - Modern JavaScript/TypeScript features with
  zero-config TypeScript support

## ✨ Key Features

- 🚀 **Zero-configuration TypeScript** - Run `.ts` files directly, no
  compilation or transpilation needed
- 🦀 **Built in Rust** - Memory-safe foundation leveraging Rust's performance
  and safety guarantees
- ⚡ **Nova Powered** - Innovative Nova JavaScript engine providing modern
  runtime experience with promising performance potential
- 🎨 **GPU-Accelerated Canvas** - Hardware-accelerated 2D Canvas API with WGPU
  backend, linear gradients, and PNG export capabilities
- 🔐 **Web Crypto API** - Industry-standard cryptographic primitives
  (randomUUID, getRandomValues, SubtleCrypto)
- 📒 **SQLite Support** - Built-in native SQLite database with DatabaseSync API
- 📁 **File System Access** - Simple synchronous and asynchronous APIs for
  reading/writing files
- 💾 **Web Storage** - localStorage and sessionStorage APIs for data persistence
  with SQLite backend
- 🗄️ **Cache Storage** - Web-standard cache storage for HTTP responses and
  offline functionality
- 🌐 **Complete Web APIs** - Fetch, Headers, Request, Response,
  TextEncoder/Decoder, URL, URLSearchParams, Blob, File
- 🌊 **Streams API** - Web-standard ReadableStream, WritableStream, and
  TransformStream for efficient data processing
- 🛠️ **Complete Toolchain** - REPL, formatter, bundler, linter, compiler, and
  self-updater - everything you need for modern development
- 🧑‍💻 **Language Server Protocol** - Built-in LSP with real-time diagnostics,
  comprehensive linting, and rich error messages
- 📦 **Import Maps** - Modern module resolution with bare specifiers and CDN
  integration
- 🚀 **Sub-10ms Startup** - Lightning-fast startup time (~12MB base memory
  usage)
- 🏗️ **HTTP Server** - Built-in HTTP server capabilities for web services and
  APIs
- ⏰ **Task Scheduling** - Built-in cron functionality for recurring tasks
- 🎨 **Enhanced Console** - CSS-style formatting support for beautiful console
  output
- ⚙️ **Task System** - Deno-inspired task system for defining and running custom
  scripts
- 🔄 **Self-Updating** - Built-in upgrade system to stay current with latest
  releases
- 🐚 **Shell Integration** - Auto-completion support for bash, zsh, fish, and
  PowerShell
- 🔧 **Extensible Architecture** - Modular architecture with optional runtime
  extensions
- 📦 **Single-file Compilation** - Compile scripts into standalone executables
- 🎯 **WinterTC Compliant** - Full compliance with WinterTC web standards

## 🏗️ Architecture

Andromeda features a modular architecture with runtime extensions that can be
enabled or disabled as needed:

- **Canvas** - GPU-accelerated 2D graphics with WGPU backend
- **Crypto** - Web Crypto API implementation
- **Console** - Enhanced console output with CSS styling
- **Fetch** - HTTP client capabilities
- **File System** - File I/O operations
- **Web Storage** - localStorage and sessionStorage
- **Cache Storage** - HTTP response caching
- **Process** - System interaction and environment access
- **SQLite** - Native database operations
- **Time** - Timing utilities and scheduling
- **URL** - URL parsing and manipulation
- **Web** - Standard web APIs (Events, TextEncoder/Decoder, etc.)
- **Streams** - Web-standard streaming data processing
- **Cron** - Task scheduling with cron expressions

## 🛰️ Andromeda Satellites

**Satellites** are minimal, purpose-built executables designed for containerized
environments and microservice architectures:

- **andromeda-run** - Execute JavaScript/TypeScript in production containers
- **andromeda-compile** - Compile JS/TS to executables
- **andromeda-fmt** - Format code
- **andromeda-lint** - Lint code for quality issues
- **andromeda-check** - Type-check TypeScript
- **andromeda-bundle** - Bundle and minify code

## 🆘 Getting Help

- 💬 [Discord Community](https://discord.gg/tgjAnX2Ny3) - Chat with the
  community
- 🐛 [GitHub Issues](https://github.com/tryandromeda/andromeda/issues) - Report
  bugs or request features
- 📧 [Discussions](https://github.com/tryandromeda/andromeda/discussions) - Ask
  questions and share ideas
- 🌐 [Official Website](https://tryandromeda.dev) - Latest news and updates

## 📄 License

Andromeda is licensed under the Mozilla Public License Version 2.0.
