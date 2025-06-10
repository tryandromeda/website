# Frequently Asked Questions (FAQ)

This document answers common questions about Andromeda, its features,
limitations, and usage.

## General Questions

### What is Andromeda?

Andromeda is a TypeScript runtime built in Rust that provides a fast, secure,
and lightweight environment for executing TypeScript/JavaScript code. It focuses
on performance and safety while offering a familiar API surface similar to
Node.js and Deno.

### How is Andromeda different from Node.js or Deno?

| Feature                | Andromeda         | Node.js                | Deno              |
| ---------------------- | ----------------- | ---------------------- | ----------------- |
| **Runtime**            | Rust-based        | V8 + C++               | V8 + Rust         |
| **TypeScript**         | Native support    | Requires transpilation | Native support    |
| **Security**           | Secure by default | No built-in sandboxing | Secure by default |
| **Package management** | Built-in          | npm/yarn               | Built-in          |
| **Std library**        | Web APIs focused  | Node.js APIs           | Web APIs focused  |

### Is Andromeda production-ready?

Andromeda is currently in active development. While it implements many core
features, it's not yet recommended for production use. Check the
[roadmap](roadmap) for current status and planned features.

### What platforms does Andromeda support?

Andromeda supports:

- **Windows** (x64, ARM64)
- **macOS** (Intel, Apple Silicon)
- **Linux** (x64, ARM64)

## Installation and Setup

### How do I install Andromeda?

See the [Installation Guide](installation) for detailed instructions. The quick
version:

```bash
# Using Cargo
cargo install andromeda-cli

# Or download from releases
# https://github.com/your-org/andromeda/releases
```

## Language Support

### What TypeScript features are supported?

Andromeda supports:

- **TypeScript syntax**: Types, interfaces, generics, etc.
- **ES2020+ features**: Async/await, modules, optional chaining, etc.
- **Web APIs**: Fetch, Console, File System, Canvas, etc.

Not yet supported:

- **JSX/TSX**: React components
- **Decorators**: Experimental decorators
- **Legacy module systems**: CommonJS (partial support)

### Can I run JavaScript files?

Yes, Andromeda can execute JavaScript files with the `.js` extension. However,
you'll get better performance and type safety with TypeScript.

### How do I import npm packages?

Currently, Andromeda doesn't have direct npm support. For now, you can:

- Use Web APIs and built-in modules
- Copy and adapt compatible packages
- Write custom extensions

## APIs and Features

### Which Web APIs are available?

Currently implemented:

- **Console**: `console.log`, `console.error`, etc.
- **File System**: `Deno.readFile`, `Deno.writeFile`, etc.
- **Crypto**: `crypto.randomUUID`, `crypto.getRandomValues`
- **Performance**: `performance.now`, timing APIs
- **Canvas**: 2D graphics context (experimental)
- **Text Encoding**: `TextEncoder`, `TextDecoder`

### How do I work with files?

Use the Deno-compatible File System API:

```typescript
// Read a file
const content = await Deno.readTextFile("file.txt");

// Write a file
await Deno.writeTextFile("output.txt", "Hello, World!");

// List directory
for await (const entry of Deno.readDir(".")) {
  console.log(entry.name);
}
```

### Can I make HTTP requests?

HTTP/fetch support is planned but not yet implemented. For now, you can:

- Use the experimental `fetch` implementation (if available)
- Create a custom extension
- Process local files instead

### How do I handle errors?

Use standard JavaScript error handling:

```typescript
try {
  const data = await Deno.readTextFile("file.txt");
  console.log(data);
} catch (error) {
  console.error("Failed to read file:", error.message);
}
```

## Development

### How do I debug my code?

Debugging options:

1. **Console logging**: Use `console.log` and friends
2. **Error stack traces**: Andromeda provides detailed stack traces
3. **REPL mode**: Interactive debugging with `andromeda repl`
4. **IDE integration**: Use VS Code with TypeScript support

### Can I use external TypeScript libraries?

Limited support currently. You can:

- Copy compatible library code directly
- Use libraries that only depend on Web APIs
- Adapt libraries to work with Andromeda's API surface

### How do I contribute to Andromeda?

See the [Contributing Guide](contributing) for detailed instructions. Quick
steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### "Command not found" error

Make sure Andromeda is in your PATH:

```bash
# Check if installed
which andromeda

# Add to PATH (adjust path as needed)
export PATH="$HOME/.cargo/bin:$PATH"
```

### "Permission denied" error

On Unix-like systems, make sure the binary is executable:

```bash
chmod +x andromeda
```

### TypeScript compilation errors

Common issues:

1. **Missing type definitions**: Some APIs may not have complete types yet
2. **Strict mode**: Try `// @ts-nocheck` at the top of files
3. **Module resolution**: Use relative imports (`./module.ts`) instead of
   node-style imports

### Performance issues

If Andromeda is running slowly:

1. **Check file size**: Very large TypeScript files can be slow to parse
2. **Use `--no-check`**: Skip type checking for faster execution
3. **Profile the code**: Use built-in profiling tools
4. **Check system resources**: Ensure adequate RAM and CPU

### Memory usage problems

If Andromeda uses too much memory:

1. **Avoid large global variables**: Clean up unused data
2. **Use streaming APIs**: Process large files in chunks
3. **Garbage collection**: Andromeda handles this automatically, but be mindful
   of object creation

## Integration

### Can I embed Andromeda in my Rust application?

Yes! Andromeda is designed to be embeddable:

## Comparison with Other Runtimes

### Why choose Andromeda over Deno?

Consider Andromeda if you need:

- **Faster startup times**: Rust-based runtime starts quickly
- **Lower memory usage**: More efficient memory management
- **Embeddable runtime**: Easy to integrate into Rust applications
- **Different API focus**: Some unique APIs and features

Choose Deno if you need:

- **Mature ecosystem**: More stable and feature-complete
- **npm compatibility**: Better package ecosystem support
- **Production readiness**: Battle-tested in production environments

### Why choose Andromeda over Node.js?

Consider Andromeda if you need:

- **TypeScript-first**: Native TypeScript support
- **Simplicity**: Single binary, no complex setup

Choose Node.js if you need:

- **Ecosystem**: Vast npm package ecosystem
- **Stability**: Long-term support and stability
- **Tooling**: Mature debugging and development tools

## Getting Help

### Where can I get support?

- **Documentation**: Check the docs in this repository
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and discuss ideas
- **Community**: Join the community channels (if available)

### How do I report bugs?

1. **Check existing issues** first
2. **Create a minimal reproduction** case
3. **Include system information** (OS, version, etc.)
4. **Follow the bug report template**

### How do I request features?

1. **Search existing feature requests**
2. **Clearly describe the use case**
3. **Provide examples** of how it would be used
4. **Consider contributing** the implementation

## Roadmap and Future

### What's planned for future releases?

See the [Roadmap](roadmap) for detailed plans. Key upcoming features:

- **npm package support**
- **HTTP/fetch implementation**
- **JSX/React support**
- **Improved security model**
- **Performance optimizations**

### How can I stay updated?

- **Star the repository** for updates
- **Watch releases** for new versions
- **Follow the blog** (if available)
- **Join community channels**

---

## Still have questions?

If your question isn't answered here:

1. **Search the documentation** for more detailed information
2. **Check GitHub Issues** for similar questions
3. **Start a discussion** on GitHub Discussions
4. **Join the community** for real-time help

We're always working to improve the documentation and answer common questions!
