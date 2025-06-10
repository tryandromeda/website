# CLI Reference

Complete reference for Andromeda's command-line interface.

## Synopsis

```bash
andromeda [COMMAND] [OPTIONS] [ARGS...]
```

## Commands

### `run`

Execute JavaScript or TypeScript files.

**Syntax:**

```bash
andromeda run [OPTIONS] <FILES...>
```

**Arguments:**

- `<FILES...>` - One or more files to execute

**Options:**

- `-v, --verbose` - Enable verbose output showing detailed execution information
- `--no-strict` - Disable strict mode (allows more lenient JavaScript parsing)

**Examples:**

```bash
# Run a single file
andromeda run script.ts

# Run multiple files
andromeda run utils.js main.ts helper.ts

# Run with verbose output
andromeda run --verbose my-app.ts

# Run without strict mode
andromeda run --no-strict legacy-script.js
```

### `repl`

Start an interactive Read-Eval-Print Loop.

**Syntax:**

```bash
andromeda repl [OPTIONS]
```

**Options:**

- `--expose-internals` - Expose Nova internal APIs for debugging
- `--print-internals` - Print internal debugging information
- `--disable-gc` - Disable garbage collection

**Examples:**

```bash
# Start basic REPL
andromeda repl

# Start REPL with debugging features
andromeda repl --expose-internals --print-internals

# Start REPL with GC disabled (for debugging)
andromeda repl --disable-gc
```

**REPL Commands:**

- `help` - Show available commands
- `history` - Display command history
- `clear` - Clear the screen
- `gc` - Manually trigger garbage collection
- `exit` or `quit` - Exit the REPL

### `compile`

Compile a JavaScript/TypeScript file into a single-file executable.

**Syntax:**

```bash
andromeda compile <INPUT> <OUTPUT>
```

**Arguments:**

- `<INPUT>` - Path to the source file to compile
- `<OUTPUT>` - Path for the output executable

**Examples:**

```bash
# Compile a TypeScript file
andromeda compile my-app.ts my-app.exe

# Compile to a Unix executable
andromeda compile script.js ./my-tool

# Compile with full paths
andromeda compile /path/to/source.ts /usr/local/bin/mytool
```

### `fmt`

Format JavaScript and TypeScript files.

**Syntax:**

```bash
andromeda fmt [PATHS...]
```

**Arguments:**

- `[PATHS...]` - Files or directories to format (optional, defaults to current
  directory)

**Examples:**

```bash
# Format specific files
andromeda fmt script.ts utils.js

# Format entire directory
andromeda fmt src/

# Format current directory
andromeda fmt

# Format multiple directories
andromeda fmt src/ tests/ examples/
```

**Supported File Types:**

- `.js` - JavaScript files
- `.ts` - TypeScript files
- `.jsx` - JavaScript with JSX
- `.tsx` - TypeScript with JSX
- `.json` - JSON files

## Global Options

These options are available for all commands:

- `-h, --help` - Show help information
- `-V, --version` - Show version information

**Examples:**

```bash
# Show general help
andromeda --help

# Show help for specific command
andromeda run --help

# Show version
andromeda --version
```

## File Types

Andromeda supports these file extensions:

| Extension | Description                 |
| --------- | --------------------------- |
| `.js`     | JavaScript files            |
| `.ts`     | TypeScript files            |
| `.jsx`    | JavaScript with JSX (React) |
| `.tsx`    | TypeScript with JSX (React) |
| `.mjs`    | ES Module JavaScript        |
| `.mts`    | ES Module TypeScript        |

## Environment Variables

Andromeda respects these environment variables:

| Variable                  | Description               | Default |
| ------------------------- | ------------------------- | ------- |
| `RUST_LOG`                | Set logging level         | `info`  |
| `NO_COLOR`                | Disable colored output    | `false` |
| `ANDROMEDA_DISABLE_CACHE` | Disable compilation cache | `false` |

**Examples:**

```bash
# Enable debug logging
RUST_LOG=debug andromeda run script.ts

# Disable colors
NO_COLOR=1 andromeda run script.ts

# Disable cache
ANDROMEDA_DISABLE_CACHE=1 andromeda run script.ts
```

## Exit Codes

| Code | Description       |
| ---- | ----------------- |
| `0`  | Success           |
| `1`  | General error     |
| `2`  | Parse error       |
| `3`  | Runtime error     |
| `4`  | File not found    |
| `5`  | Permission denied |

## Configuration

### Project Configuration

Create a `.andromeda.json` file in your project root for custom configuration:

```json
{
  "strict": true,
  "extensions": ["canvas", "crypto", "fetch"],
  "formatOptions": {
    "indentSize": 2,
    "useTabs": false,
    "lineWidth": 100
  }
}
```

### Global Configuration

Global configuration is stored in:

- **Unix**: `~/.config/andromeda/config.json`
- **Windows**: `%APPDATA%\andromeda\config.json`

## Debugging

### Verbose Output

Use `--verbose` with the `run` command to see detailed execution information:

```bash
andromeda run --verbose script.ts
```

This shows:

- File loading times
- Parse times
- Execution times
- Memory usage
- Extension loading

### REPL Debugging

Start REPL with debugging options:

```bash
andromeda repl --expose-internals --print-internals
```

This provides access to:

- Nova engine internals
- Garbage collection stats
- Detailed execution traces

### Error Reporting

Andromeda provides detailed error messages with:

- File location and line numbers
- Syntax highlighting
- Suggestions for fixes
- Stack traces with source context

## Performance Tips

1. **Use compilation**: For frequently run scripts, use `andromeda compile` to
   create executables
2. **Enable caching**: Don't disable the compilation cache unless debugging
3. **Batch operations**: Run multiple files together rather than separately
4. **Optimize imports**: Only use the extensions you need

## Examples

### Basic Script Execution

```bash
# Simple execution
andromeda run hello.ts

# Multiple files with dependencies
andromeda run utils.ts main.ts

# Verbose execution for debugging
andromeda run --verbose complex-app.ts
```

### Development Workflow

```bash
# Format code
andromeda fmt src/

# Run with error checking
andromeda run --verbose src/main.ts

# Test in REPL
andromeda repl

# Create production executable
andromeda compile src/main.ts dist/my-app
```

### CI/CD Integration

```bash
# In GitHub Actions or similar
- name: Format check
  run: andromeda fmt --check src/

- name: Run tests
  run: andromeda run tests/all.ts

- name: Build executable
  run: andromeda compile src/main.ts dist/app
```

## Troubleshooting

For common issues and solutions, see the
[Troubleshooting Guide](troubleshooting).

For more examples check out the [Examples](examples)
