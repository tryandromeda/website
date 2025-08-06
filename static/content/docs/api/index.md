---
title: "API Reference"
description: "Comprehensive documentation for all APIs available in Andromeda"
section: "API Reference"
order: 1
id: "api-overview"
---

This section provides comprehensive documentation for all APIs available in
Andromeda. The APIs are organized by category and follow web standards wherever
possible.

## Core APIs

### Runtime APIs

- **[Console API](/docs/api/console)** - Logging, debugging, and output
  functions
- **[Performance API](/docs/api/performance)** - Timing and performance
  measurement utilities
- **[Process API](/docs/api/process)** - Process information and environment
  access

### File System APIs

- **[File System API](/docs/api/file-system)** - File and directory operations,
  path manipulation

### Database APIs

- **[SQLite API](/docs/api/sqlite)** - Full SQLite database support with
  synchronous APIs

### Storage APIs

- **[Web Storage API](/docs/api/web-storage)** - localStorage and sessionStorage
  with SQLite backend
- **[Cache Storage API](/docs/api/cache-storage)** - Web-standard cache storage for HTTP responses and offline functionality

### Network APIs

- **[Fetch API](/docs/api/fetch)** - HTTP client functionality and Headers
  manipulation
- **[URL API](/docs/api/url)** - URL parsing, construction, and manipulation

### Graphics APIs

- **[Canvas API](/docs/api/canvas)** - 2D graphics rendering with advanced path
  methods (quadraticCurveTo, ellipse, roundRect) and GPU acceleration

### Cryptography APIs

- **[Crypto API](/docs/api/crypto)** - Cryptographic functions and secure random
  generation

### Web Standard APIs

- **[Web APIs](/docs/api/web)** - Event handling, text encoding, and other web
  standards
  - Event API - Standard event handling and custom events
  - TextEncoder/TextDecoder - Text encoding and decoding utilities
- **[File API](/docs/api/file)** - Web-standard File objects and file metadata
- **[Streams API](/docs/api/streams)** - Web-standard streaming data processing

### Utility APIs

- **[Time API](/docs/api/time)** - Date, time, and timing utilities
- **[Cron API](/docs/api/cron)** - Schedule and manage recurring tasks with cron expressions

## API Categories

### Standard Web APIs

Andromeda implements many standard web APIs to provide compatibility with
existing JavaScript/TypeScript code:

- **Events** - Standard DOM-style event handling
- **Text Encoding** - UTF-8 encoding/decoding following WHATWG standards
- **URL** - WHATWG URL Standard implementation
- **Headers** - HTTP Headers manipulation for fetch requests
- **Performance** - Web Performance API subset

### Runtime-Specific APIs

APIs that provide access to the underlying system and runtime environment:

- **Console** - Enhanced logging with styling and formatting
- **File System** - Cross-platform file and directory operations
- **Process** - Environment variables and process information
- **Crypto** - Secure cryptographic functions

### Graphics and Media APIs

APIs for working with graphics and visual content:

- **Canvas** - 2D graphics rendering compatible with HTML5 Canvas

## API Design Principles

### Web Standards Compliance

Andromeda APIs follow web standards wherever possible:

- **WHATWG Standards** - URL, Encoding, and other WHATWG specifications
- **W3C Standards** - Canvas 2D, Performance API, and related standards
- **ECMAScript Standards** - Modern JavaScript/TypeScript language features

### TypeScript Support

All APIs are designed with TypeScript in mind:

- **Type Definitions** - Comprehensive TypeScript definitions included
- **Type Safety** - APIs designed to catch errors at compile time
- **Modern Syntax** - Support for async/await, modules, and modern JavaScript

### Cross-Platform Compatibility

APIs work consistently across different platforms:

- **Windows** - Full support for Windows environments
- **macOS** - Compatible with macOS systems
- **Linux** - Works on various Linux distributions

### Performance Focused

APIs are optimized for performance:

- **Efficient Operations** - Minimal overhead for common operations
- **Resource Management** - Proper cleanup and resource management
- **Streaming Support** - Support for streaming and chunked data processing

## Common Patterns

### Error Handling

Most APIs follow consistent error handling patterns:

```typescript
try {
  const result = await someApiCall();
  // Handle success
} catch (error) {
  // Handle error
  console.error("API call failed:", error.message);
}
```

### Async Operations

APIs that perform I/O operations are typically async:

```typescript
// File operations
const content = await Andromeda.readTextFile("file.txt");

// Network operations
const response = await fetch("https://api.example.com/data");
```

### Configuration Objects

Many APIs accept configuration objects for flexibility:

```typescript
// Canvas context with options
const canvas = new OffscreenCanvas(800, 600);
const ctx = canvas.getContext("2d", {
  alpha: false,
  desynchronized: true,
});

// Text decoder with options
const decoder = new TextDecoder("utf-8", {
  fatal: true,
  ignoreBOM: false,
});
```

## Getting Started

### Basic API Usage

```typescript
// Console output
console.log("Hello, Andromeda!");

// File operations
const content = await Andromeda.readTextFile("config.json");
const config = JSON.parse(content);

// HTTP requests
const response = await fetch("https://api.example.com/data");
const data = await response.json();

// Canvas graphics
const canvas = new OffscreenCanvas(400, 300);
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 100, 100);
```

### Working with Multiple APIs

```typescript
import { performance } from "./performance.js";

async function processData() {
  const start = performance.now();

  try {
    // Read input file
    const input = await Andromeda.readTextFile("input.txt");

    // Process with crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);

    // Log results
    console.log("Processing completed");
    console.log(
      "Hash:",
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
  } catch (error) {
    console.error("Processing failed:", error);
  } finally {
    const duration = performance.now() - start;
    console.log(`Operation took ${duration.toFixed(2)}ms`);
  }
}
```

## API Reference Organization

Each API documentation includes:

- **Overview** - Purpose and key features
- **Constructor/Creation** - How to create instances
- **Methods** - Available functions and their signatures
- **Properties** - Available properties and their types
- **Examples** - Practical usage examples
- **Error Handling** - Common errors and how to handle them
- **Best Practices** - Recommended usage patterns
- **Browser Compatibility** - Standards compliance notes

## Contributing to API Documentation

If you find issues in the API documentation or want to contribute improvements:

1. Check the existing documentation for accuracy
2. Test examples to ensure they work correctly
3. Submit issues or pull requests with improvements
4. Follow the established documentation format and style

## See Also

- **[Quick Start Guide](/docs/quick-start)** - Get started with Andromeda
- **[Examples](/docs/examples/)** - Practical code examples
