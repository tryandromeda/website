---
title: "Building from Source"
description: "Compiling Andromeda yourself from the source code"
section: "Development"
order: 10
id: "building"
---

This guide walks you through building Andromeda from source code, setting up the
development environment, and understanding the build process.

## Prerequisites

### Required Software

- **Rust Toolchain**: Latest stable version (we're almost always on the bleeding
  edge)
- **Git**: For cloning the repository
- **System Dependencies**: Platform-specific build tools

### Platform-Specific Requirements

#### Windows

- **Visual Studio Build Tools** or **Visual Studio Community**
- **Windows SDK** (usually included with Visual Studio)
- **Git for Windows** or **WSL** (Windows Subsystem for Linux)

#### macOS

- **Xcode Command Line Tools**:

  ```bash
  xcode-select --install
  ```

- **Homebrew** (recommended for additional dependencies)

#### Linux

- **Build essentials**:

  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install build-essential git pkg-config libssl-dev

  # Fedora/RHEL
  sudo dnf install gcc gcc-c++ git openssl-devel

  # Arch Linux
  sudo pacman -S base-devel git openssl
  ```

## Getting the Source Code

### Clone the Repository

```bash
git clone https://github.com/tryandromeda/andromeda
cd andromeda

# Or clone your fork
git clone https://github.com/tryandromeda/andromeda.git
cd andromeda
```

## Setting Up Rust

### Install Rust

If you don't have Rust installed:

```bash
# Install rustup (Rust installer)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Source the environment
source $HOME/.cargo/env

# Verify installation
rustc --version
cargo --version
```

### Rust Toolchain

Andromeda uses a specific Rust toolchain defined in `rust-toolchain.toml`. This
will be automatically used when building.

```bash
# Check current toolchain
rustup show

# Install required components
rustup component add clippy rustfmt
```

## Building the Project

### Quick Build

The fastest way to build and test:

```bash
# Build all components
cargo build

# Build in release mode (optimized)
cargo build --release

# Build and run the CLI
cargo run --bin andromeda -- --help
```

### Development Build

For development with faster compilation:

```bash
# Debug build with some optimizations
cargo build --profile dev

# Build specific components
cargo build -p andromeda-cli
cargo build -p andromeda-core
cargo build -p andromeda-runtime
```

### Build Profiles

The project defines several build profiles:

- **dev**: Fast compilation, minimal optimizations
- **release**: Full optimizations, slower compilation
- **test**: Used for running tests

## Build Configuration

### Environment Variables

Control build behavior with environment variables:

```bash
# Enable debug output
export RUST_LOG=debug

# Use more CPU cores for building
export CARGO_BUILD_JOBS=8

# Custom target directory
export CARGO_TARGET_DIR=/tmp/andromeda-target
```

### Feature Flags

Andromeda supports conditional compilation features:

```bash
# Build with all features
cargo build --all-features

# Build with specific features
cargo build --features "canvas,crypto"

# Build without default features
cargo build --no-default-features
```

Common features:

- `canvas`: Canvas graphics support
- `crypto`: Cryptographic functions

## Testing the Build

### Run Tests

Verify your build works correctly:

```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Run specific test
cargo test test_file_operations

# Run tests for a specific package
cargo test -p andromeda-core
```

### Test Examples

Run the example TypeScript programs:

```bash
# Run a simple example
cargo run --bin andromeda examples/console.ts

# Run all examples
for file in examples/*.ts; do
    echo "Running $file"
    cargo run --bin andromeda "$file"
done
```

### Performance Tests

Build and test performance:

```bash
# Release build for performance testing
cargo build --release

# Run performance example
./target/release/andromeda examples/performance.ts

# Time the build process
time cargo build --release
```

## Build Optimization

### Faster Builds

Speed up development builds:

```bash
# Use shared target directory
export CARGO_TARGET_DIR=~/cargo-target

# Enable parallel builds
export CARGO_BUILD_JOBS=$(nproc)

# Use faster linker (Linux)
export RUSTFLAGS="-C link-arg=-fuse-ld=lld"
```

### Smaller Binaries

Optimize for binary size:

```bash
# Strip debug symbols
cargo build --release
strip target/release/andromeda

# Or use cargo-strip
cargo install cargo-strip
cargo strip --release
```

### Cross-Compilation

Build for different targets:

```bash
# List available targets
rustup target list

# Add a target
rustup target add x86_64-pc-windows-gnu

# Cross-compile
cargo build --target x86_64-pc-windows-gnu --release
```

## Advanced Build Options

### Build Dependencies

Understanding the dependency graph:

```bash
# Show dependency tree
cargo tree

# Show why a package is included
cargo tree -i serde

# Check for unused dependencies
cargo machete  # Requires cargo-machete
```

### Incremental Compilation

Rust supports incremental compilation for faster rebuilds:

```bash
# Enable incremental compilation (usually default)
export CARGO_INCREMENTAL=1

# Clean incremental cache if needed
cargo clean -p andromeda-core
```

## IDE Setup

### Visual Studio Code

Recommended VS Code extensions:

- **rust-analyzer**: Rust language support
- **Better TOML**: TOML file support
- **Error Lens**: Inline error display
- **CodeLLDB**: Debugging support

VS Code settings for Rust:

```json
{
  "rust-analyzer.cargo.buildScripts.enable": true,
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.features": "all"
}
```

### Other IDEs

- **IntelliJ IDEA**: Use the Rust plugin
- **CLion**: Built-in Rust support
- **Vim/Neovim**: Use vim-rust or rust.vim
- **Emacs**: Use rust-mode

## Performance Monitoring

### Build Times

Monitor build performance:

```bash
# Time the build
time cargo build

# Profile compilation
cargo build --timings

# Analyze build with cargo-bloat
cargo install cargo-bloat
cargo bloat --release
```

### Binary Analysis

Analyze the resulting binary:

```bash
# Check binary size
ls -lh target/release/andromeda

# Analyze binary contents
cargo install cargo-binutils
cargo objdump --release --bin andromeda

# Check dependencies
ldd target/release/andromeda  # Linux
otool -L target/release/andromeda  # macOS
```

## Next Steps

After successfully building Andromeda:

1. **Run the examples** to verify functionality
2. **Read the development guide** for contributing
3. **Set up your development environment** with preferred tools
4. **Explore the codebase** to understand the architecture
5. **Consider contributing** improvements or fixes

## See Also

- [Contributing Guide](/docs/contributing)
- [CLI Reference](/docs/cli-reference)
