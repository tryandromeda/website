# Contributing to Andromeda

Thank you for your interest in contributing to Andromeda! This guide will help
you get started with contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Community](#community)

## Getting Started

Andromeda is a TypeScript runtime built in Rust, providing a modern
JavaScript/TypeScript execution environment with web-standard APIs.

### Prerequisites

Before contributing, ensure you have:

- **Rust** (latest stable version)
- **Git** for version control
- **VS Code** or another TypeScript-capable editor (recommended)

### Areas for Contribution

We welcome contributions in several areas:

- 🚀 **Core Runtime**: Improving the Rust-based runtime engine
- 🌐 **Web APIs**: Implementing additional web standard APIs
- 📚 **Documentation**: Improving guides, and API documentation
- 🧪 **Testing**: Adding tests and improving test coverage
- 🐛 **Bug Fixes**: Identifying and fixing issues
- ✨ **Features**: Proposing and implementing new functionality

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/andromeda-org/andromeda.git
cd andromeda
```

### 2. Install Dependencies

```bash
# Install Rust dependencies and build
cargo build
```

### 3. Verify Installation

```bash
# Test the CLI
cargo run -- --help

# Run examples
cargo run -- run examples/main.ts
```

## Project Structure

Understanding the project structure will help you navigate and contribute
effectively:

```text
andromeda/
├── cli/                 # Command-line interface
│   ├── src/
│   │   ├── main.rs     # CLI entry point
│   │   ├── compile.rs  # TypeScript compilation
│   │   ├── run.rs      # Script execution
│   │   └── repl.rs     # Interactive REPL
├── core/               # Core runtime engine
│   ├── src/
│   │   ├── lib.rs      # Core library
│   │   ├── runtime.rs  # Runtime management
│   │   ├── extension.rs # Extension system
│   │   └── event_loop.rs # Event loop implementation
├── runtime/            # Runtime extensions and APIs
│   ├── src/
│   │   ├── lib.rs      # Runtime library
│   │   ├── recommended.rs # Standard API set
│   │   └── ext/        # Individual API implementations
│   │       ├── fs.rs   # File system API
│   │       ├── console/ # Console API
│   │       ├── crypto/ # Crypto API
│   │       └── ...
├── examples/           # Example TypeScript scripts
├── docs/              # Documentation
├── types/             # TypeScript type definitions
└── target/            # Build artifacts (generated)
```

### Key Components

- **CLI**: User-facing command-line tool
- **Core**: Low-level runtime engine and extension system
- **Runtime**: High-level APIs and standard library
- **Examples**: Demonstration scripts and usage examples

## Contributing Guidelines

### Issue Reporting

Before reporting an issue:

1. Check existing issues to avoid duplicates
2. Use the issue template if provided
3. Include minimal reproduction steps
4. Specify your environment (OS, Rust version, etc.)

### Feature Requests

For new features:

1. Search existing feature requests
2. Describe the problem you're solving
3. Propose a solution or API design
4. Consider backwards compatibility

### Pull Requests

Before submitting a PR:

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with clear commit messages
4. Add tests for new functionality
5. Update documentation as needed
6. Ensure all tests pass

## Code Style

### Rust Code

Follow standard Rust conventions:

```rust
// Use snake_case for functions and variables
fn process_request() -> Result<(), Error> {
    // Implementation
}

// Use PascalCase for types
struct RuntimeConfig {
    debug_mode: bool,
    max_memory: usize,
}

// Use SCREAMING_SNAKE_CASE for constants
const DEFAULT_TIMEOUT: Duration = Duration::from_secs(30);
```

**Formatting**: Use `cargo fmt` to format code and `andromeda fmt` for
TypeScript files.

**Linting**: Use `cargo clippy` to check for common issues

### TypeScript Code

For TypeScript examples and type definitions:

```typescript
// Use camelCase for functions and variables
function processData(inputData: string): Promise<Result> {
  // Implementation
}

// Use PascalCase for interfaces and classes
interface ApiResponse {
  status: number;
  data: unknown;
}

class HttpClient {
  // Implementation
}

// Use UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
```

### Documentation

- Use clear, concise language
- Include code examples for APIs
- Follow the existing documentation structure
- Update related documentation when making changes

## Testing

### Running Tests

```bash
# Run all tests
cargo test

# Run tests for a specific package
cargo test -p andromeda-core

# Run tests with output
cargo test -- --nocapture

# Run integration tests
cargo test --test integration
```

### Writing Tests

#### TypeScript Examples

Ensure examples work correctly:

```typescript
// examples/test_feature.ts
console.log("Testing new feature...");

// Test the new functionality
const result = await newFeature();
console.assert(result.success, "Feature should work");

console.log("✅ Test passed");
```

## Submitting Changes

### Commit Guidelines

Use clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "feat: add WebSocket support to runtime"
git commit -m "fix: resolve memory leak in event loop"
git commit -m "docs: add canvas API tutorial"
git commit -m "test: add integration tests for file system"

# Use conventional commits format
# type(scope): description
#
# Types: feat, fix, docs, style, refactor, test, chore
```

### Pull Request Process

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/websocket-support
   ```

2. **Make your changes** with clear commits

3. **Test thoroughly**:

   ```bash
   cargo test
   cargo clippy
   cargo fmt --check
   ```

4. **Update documentation** if needed

5. **Push and create PR**:

   ```bash
   git push origin feature/websocket-support
   ```

6. **Fill out PR template** with:
   - Description of changes
   - Related issues
   - Testing information
   - Breaking changes (if any)

### PR Review Process

- Maintainers will review your PR
- Address feedback promptly
- Be open to suggestions and changes
- PRs require approval before merging

## Development Workflows

### Adding a New API

1. **Plan the API**:
   - Research web standards
   - Design the interface
   - Consider compatibility

2. **Implement in Rust**:

   ```rust
   // runtime/src/ext/new_api/mod.rs
   pub struct NewApiExt;

   impl NewApiExt {
       pub fn new_extension() -> Extension {
           Extension {
               name: "new_api",
               ops: vec![
                   ExtensionOp::new("method_name", Self::method_impl, 1),
               ],
               storage: None,
               files: vec![include_str!("./mod.ts")],
           }
       }
   }
   ```

3. **Add TypeScript definitions**:

   ```typescript
   // runtime/src/ext/new_api/mod.ts
   function methodName(param: string): Promise<Result> {
     // Implementation
   }
   // TODO: once imports are supported, use `export` syntax
   ```

4. **Write tests**:

   ```typescript
   // tests/new_api.test.ts

   describe("New API", () => {
     it("should return expected result", async () => {
       const result = await methodName("test");
       expect(result).toEqual({ success: true });
     });
   });
   ```

5. **Add examples**:

   ```typescript
   // examples/new_api.ts
   const result = await newApi.methodName("test");
   console.log("Result:", result);
   ```

6. **Update documentation**:
   - API reference in `docs/api/`
   - Tutorial if complex
   - Update index.md if significant

### Debugging

#### Debug the Runtime

```bash
# Build with debug symbols
cargo build

# Run with debug output
RUST_LOG=debug cargo run -- run script.ts

# Use debugger
rust-gdb target/debug/andromeda
```

#### Debug TypeScript Execution

```bash
# Compile TypeScript separately
cargo run -- compile script.ts
```

### Performance Considerations

When contributing:

- Profile performance-critical code
- Minimize allocations in hot paths
- Use appropriate data structures
- Consider async/await overhead
- Test with realistic workloads

## Community

### Communication

- [**GitHub Issues**](https://github.com/tryandromeda/andromeda/issues): Bug
  reports and feature requests
- [**GitHub Discussions**](https://github.com/orgs/tryandromeda/discussions):
  Questions and general discussion
- [**Community Discord**](https://discord.gg/w8JkSeNcEe): Real-time chat
- **Code Reviews**: Technical discussions on PRs

### Code of Conduct

We follow the
[Rust Code of Conduct](https://www.rust-lang.org/policies/code-of-conduct). Be
respectful, inclusive, and constructive in all interactions.

### Getting Help

If you need help:

1. Check existing documentation
2. Search issues and discussions
3. Ask questions in GitHub Discussions
4. Join community chat (if available)

## Release Process

(For maintainers and regular contributors)

1. **Version Bumping**: Follow semantic versioning
2. **Testing**: Ensure all tests pass across platforms
3. **Documentation**: Verify documentation is up to date
4. **Release**: Create release notes and tag

## Advanced Contributing

### Custom Extensions

You can contribute extensions that:

- Implement web standards
- Provide platform-specific functionality
- Add developer tools and utilities

### Performance Improvements

Areas for optimization:

- Runtime startup time
- Memory usage
- Execution speed
- Bundle size

### Platform Support

Help expand platform support:

- Windows improvements
- macOS optimization
- Linux distribution packaging
- Mobile platform exploration

## Resources

- [Rust Programming Language](https://doc.rust-lang.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Web APIs Standards](https://developer.mozilla.org/en-US/docs/Web/API)
- [Nova Engine](https://trynova.dev)
- [WinterTC](https://wintertc.org)
- [Andromeda GitHub Repository](https://github.com/tryandromeda/andromeda)

Thank you for contributing to Andromeda! Your efforts help make it a better
runtime for everyone.
