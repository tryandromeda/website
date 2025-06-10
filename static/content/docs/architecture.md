# Architecture Overview

Andromeda is built with a modular, extensible architecture that separates
concerns while maintaining high performance and security.

## High-Level Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        CLI Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │    REPL     │ │   Runner    │ │  Formatter  │ │Compiler│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Core Runtime                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │ Event Loop  │ │   Agent     │ │ Host Hooks  │ │ Tasks  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nova JavaScript Engine                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐ │
│  │   Parser    │ │  Compiler   │ │Interpreter  │ │   GC   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Runtime Extensions                        │
│ ┌─────┐ ┌────────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│ │ FS  │ │Canvas  │ │Crypto│ │Console│ │Time │ │ Web │ │ ... ││
│ └─────┘ └────────┘ └─────┘ └──────┘ └─────┘ └─────┘ └─────┘│
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. CLI Layer (`andromeda` crate)

The command-line interface provides the main entry point for users and handles:

- **Command parsing** - Using Clap for robust CLI argument handling
- **Subcommand routing** - Directing to appropriate functionality (run, repl,
  fmt, compile)
- **Error reporting** - Beautiful error messages with context and suggestions
- **File discovery** - Finding and validating input files

**Key files:**

- `cli/src/main.rs` - Main entry point and command routing
- `cli/src/run.rs` - Script execution logic
- `cli/src/repl.rs` - Interactive REPL implementation
- `cli/src/compile.rs` - Single-file executable compilation
- `cli/src/format.rs` - Code formatting functionality

### 2. Core Runtime (`andromeda-core` crate)

The core runtime provides the fundamental JavaScript execution environment:

#### Event Loop

- **Asynchronous execution** - Handles promises, timers, and async operations
- **Macro task scheduling** - Manages larger units of work
- **Micro task processing** - Handles promise continuations

#### Runtime Agent

- **Script execution** - Orchestrates JavaScript parsing and execution
- **Memory management** - Interfaces with Nova's garbage collector
- **Error handling** - Provides context and stack traces

#### Host Data & Resource Management

- **Shared state** - Manages global runtime state across extensions
- **Resource tracking** - Handles file descriptors, timers, and other resources
- **Extension coordination** - Facilitates communication between extensions

**Key files:**

- `core/src/runtime.rs` - Main runtime orchestration
- `core/src/event_loop.rs` - Event loop implementation
- `core/src/host_data.rs` - Shared runtime state
- `core/src/extension.rs` - Extension system interfaces

### 3. Nova JavaScript Engine

Andromeda is powered by [Nova](https://trynova.dev/), a fast JavaScript engine
written in Rust:

#### Parser & Compiler

- **TypeScript support** - Direct parsing of TypeScript without transpilation
- **Modern JavaScript** - Full ES2023+ support
- **Optimization** - Just-in-time compilation for performance

#### Execution Environment

- **Standards compliance** - Implements ECMAScript specifications
- **Memory safety** - Rust's ownership model prevents memory corruption
- **Performance** - Optimized for modern JavaScript patterns

### 4. Runtime Extensions (`andromeda-runtime` crate)

Extensions provide specific functionality through a modular system:

#### Extension Architecture

Each extension implements:

- **Initialization** - Sets up APIs and resources
- **Binding** - Exposes functions to JavaScript
- **Cleanup** - Handles resource deallocation
- **Event handling** - Processes async operations

#### Available Extensions

**File System (`FsExt`)**

- File I/O operations
- Directory management
- Path utilities

**Canvas (`CanvasExt`)**

- 2D graphics rendering
- Image generation and export
- Drawing operations

**Crypto (`CryptoExt`)**

- Web Crypto API implementation
- Secure random generation
- Hashing and encryption

**Console (`ConsoleExt`)**

- Enhanced logging with colors
- Performance timing
- Debug utilities

**Time (`TimeExt`)**

- Performance timing APIs
- Sleep functionality
- Date/time utilities

**Process (`ProcessExt`)**

- Environment variable access
- Command line arguments
- Process control

**Web (`WebExt`)**

- Text encoding/decoding
- URL manipulation
- Web standards compliance

## Extension System

### Extension Lifecycle

```rust
pub trait Extension {
    fn name(&self) -> &'static str;
    
    fn init(
        &self,
        agent: &mut Agent,
        realm_root: &RealmRoot,
        host_data: &HostData<RuntimeMacroTask>,
    ) -> JsResult<()>;
    
    fn bind_to_global(
        &self,
        agent: &mut Agent,
        realm_root: &RealmRoot,
        global: Object,
    ) -> JsResult<()>;
}
```

### Extension Registration

Extensions are registered during runtime initialization:

```rust
// In recommended.rs
pub fn recommended_extensions() -> Vec<Extension> {
    vec![
        FsExt::new_extension(),
        ConsoleExt::new_extension(),
        TimeExt::new_extension(),
        ProcessExt::new_extension(),
        URLExt::new_extension(),
        WebExt::new_extension(),
        HeadersExt::new_extension(),
        #[cfg(feature = "canvas")]
        crate::CanvasExt::new_extension(),
        #[cfg(feature = "crypto")]
        crate::CryptoExt::new_extension(),
    ]
}
```

### Feature Gates

Extensions can be enabled/disabled at compile time:

```toml
[dependencies]
andromeda-runtime = { path = "runtime", features = ["canvas", "crypto"] }
```

## Memory Management

### Garbage Collection Integration

Andromeda integrates with Nova's garbage collector:

- **Automatic collection** - Objects are collected when no longer referenced
- **Manual triggers** - Extensions can request garbage collection
- **Resource cleanup** - Extensions handle cleanup during GC cycles

### Resource Management

```rust
pub struct HostData<UserMacroTask> {
    pub macro_task_count: AtomicUsize,
    pub extension_data: AnyMap,
    pub resource_table: ResourceTable,
}
```

- **Reference counting** - Tracks active resources
- **Cleanup callbacks** - Ensures proper resource deallocation
- **Extension isolation** - Each extension manages its own resources

## Security Model

### Sandboxing

Andromeda provides controlled access to system resources:

- **Permission system** - Extensions request specific capabilities
- **Path validation** - File system access is validated and restricted
- **Resource limits** - Extensions can be limited in resource usage

### Safe Rust Integration

- **Memory safety** - Rust's ownership model prevents common vulnerabilities
- **Type safety** - Strong typing prevents many runtime errors
- **Error handling** - Explicit error handling prevents silent failures

## Performance Characteristics

### Startup Time

Andromeda is optimized for fast startup:

1. **Lazy extension loading** - Extensions load only when needed
2. **Compilation caching** - Parsed scripts are cached
3. **Minimal runtime** - Core runtime has minimal overhead

### Execution Performance

- **Nova engine** - Fast JavaScript execution
- **Zero-cost abstractions** - Rust optimizations carry through
- **Efficient resource usage** - Minimal memory footprint

### Memory Usage

- **Efficient allocation** - Arena-based allocation for temporary objects
- **Garbage collection** - Automatic memory management
- **Resource tracking** - Prevents memory leaks

## Configuration and Customization

### Build-time Configuration

Features can be enabled/disabled at build time:

```toml
[features]
default = ["canvas", "crypto", "fetch"]
canvas = ["image", "wgpu"]
crypto = ["ring"]
fetch = ["reqwest"]
all = ["canvas", "crypto", "fetch"]
```

### Runtime Configuration

Extensions can be configured at runtime:

```rust
// Custom extension configuration
let config = ExtensionConfig {
    canvas: CanvasConfig {
        max_size: (4096, 4096),
        formats: vec!["png", "jpeg"],
    },
    crypto: CryptoConfig {
        algorithms: vec!["SHA-256", "AES-GCM"],
    },
};
```

## Error Handling Strategy

### Error Types

Andromeda uses a hierarchical error system:

```rust
#[derive(Debug, thiserror::Error)]
pub enum AndromedaError {
    #[error("Parse error: {message}")]
    ParseError { message: String, location: Option<SourceLocation> },
    
    #[error("Runtime error: {message}")]
    RuntimeError { message: String, stack_trace: Option<String> },
    
    #[error("IO error: {message}")]
    IoError { message: String, path: Option<PathBuf> },
    
    #[error("Extension error: {extension}: {message}")]
    ExtensionError { extension: String, message: String },
}
```

### Error Recovery

- **Graceful degradation** - Missing extensions don't crash the runtime
- **Error context** - Rich error information for debugging
- **Recovery mechanisms** - Ability to continue execution after errors

## Development and Testing

### Development Workflow

1. **Modular development** - Each component can be developed independently
2. **Test isolation** - Extensions can be tested in isolation
3. **Integration testing** - Full runtime testing with all extensions

### Testing Strategy

- **Unit tests** - Individual component testing
- **Integration tests** - Cross-component interaction testing
- **Performance benchmarks** - Ensuring performance requirements
- **Compatibility tests** - WinterTC compliance testing

## Future Architecture Plans

### Planned Enhancements

1. **WebAssembly support** - Running WASM modules
2. **Worker threads** - Parallel JavaScript execution
3. **Network extensions** - HTTP client/server capabilities
4. **Database extensions** - Built-in database connectivity
5. **Plugin system** - Dynamic extension loading

### Scalability Considerations

- **Multi-threading** - Planned support for parallel execution
- **Cluster support** - Multiple runtime instances
- **Resource isolation** - Better sandboxing and security

The architecture is designed to be:

- **Modular** - Easy to add/remove functionality
- **Performant** - Minimal overhead and fast execution
- **Secure** - Safe resource access and memory management
- **Extensible** - Simple to add new capabilities
- **Standards-compliant** - Following web and JavaScript standards
