# Process API

Andromeda provides a comprehensive Process API for managing the current process, accessing environment variables, handling command-line arguments, and controlling process execution. The API is available through both Deno-compatible interfaces and the native Andromeda.process object.

## Overview

The Process API provides access to:

- Process information (PID, platform, architecture)
- Environment variables (both Deno-style and Node-style)
- Command-line arguments
- Process exit control
- Working directory management
- Standard input/output streams

## Process Information

### `Andromeda.process.pid: number`

The process ID of the current Andromeda process.

```typescript
console.log(`Current process ID: ${Andromeda.process.pid}`);
```

### `Andromeda.process.platform: string`

The operating system platform where Andromeda is running.

**Possible values:**

- `"linux"` - Linux systems
- `"darwin"` - macOS
- `"windows"` - Windows
- `"freebsd"` - FreeBSD
- `"openbsd"` - OpenBSD

```typescript
console.log(`Running on: ${Andromeda.process.platform}`);

// Platform-specific logic
if (Andromeda.process.platform === "windows") {
  console.log("Running on Windows");
} else {
  console.log("Running on Unix-like system");
}
```

### `Andromeda.process.arch: string`

The CPU architecture of the current process.

**Possible values:**

- `"x64"` - 64-bit x86 architecture
- `"arm64"` - 64-bit ARM architecture
- `"x86"` - 32-bit x86 architecture

```typescript
console.log(`Architecture: ${Andromeda.process.arch}`);

// Architecture-specific optimizations
if (Andromeda.process.arch === "arm64") {
  console.log("Optimizing for ARM64");
}
```

## Environment Variables

Andromeda supports both Andromeda-style and Node-style environment variable access.

### Andromeda Environment Variables

#### `Andromeda.env.get(name)`

Gets the value of an environment variable.

**Parameters:**

- `name` - The name of the environment variable

**Returns:** `string | undefined` - The value of the environment variable, or
undefined if not set

**Example:**

```typescript
const homeDir = Andromeda.env.get("HOME");
const path = Andromeda.env.get("PATH");
const customVar = Andromeda.env.get("MY_CUSTOM_VAR");

console.log("Home directory:", homeDir);
console.log("Custom variable:", customVar || "Not set");
```

#### `Andromeda.env.set(name, value)`

Sets an environment variable.

**Parameters:**

- `name` - The name of the environment variable
- `value` - The value to set

**Example:**

```typescript
Andromeda.env.set("MY_APP_CONFIG", "production");
Andromeda.env.set("DEBUG_LEVEL", "2");

console.log("Config:", Andromeda.env.get("MY_APP_CONFIG"));
```

#### `Andromeda.env.delete(name)`

Deletes an environment variable.

**Parameters:**

- `name` - The name of the environment variable to delete

**Example:**

```typescript
Andromeda.env.set("TEMP_VAR", "temporary");
console.log("Before delete:", Andromeda.env.get("TEMP_VAR"));

Andromeda.env.delete("TEMP_VAR");
console.log("After delete:", Andromeda.env.get("TEMP_VAR")); // undefined
```

#### `Andromeda.env.toObject()`

Gets all environment variables as an object.

**Returns:** `Record<string, string>` - Object containing all environment
variables

**Example:**

```typescript
const allEnv = Andromeda.env.toObject();
console.log("Environment variables:");
for (const [key, value] of Object.entries(allEnv)) {
  console.log(`${key}=${value}`);
}
```

### Node Environment Variables

#### `Andromeda.process.env: { [key: string]: string | undefined }`

An object containing the current environment variables (Node.js style).

```typescript
// Access specific environment variables
const home = Andromeda.process.env.HOME;
const path = Andromeda.process.env.PATH;
const nodeEnv = Andromeda.process.env.NODE_ENV;

console.log(`Home directory: ${home}`);
console.log(`Node environment: ${nodeEnv || "development"}`);

// Check if environment variable exists
if (Andromeda.process.env.DEBUG) {
  console.log("Debug mode enabled");
}

// Get environment variable with fallback
const port = Andromeda.process.env.PORT || "3000";
const apiUrl = Andromeda.process.env.API_URL || "http://localhost:8080";
```

## Command Line Arguments

### Andromeda Command Arguments

#### `Andromeda.args`

An array containing the command-line arguments passed to the script.

**Type:** `string[]`

**Example:**

```typescript
// If script is run with: andromeda run script.ts --config=prod --verbose
console.log("Arguments:", Andromeda.args);
// Output: Arguments: ["--config=prod", "--verbose"]

// Parse arguments
const config = Andromeda.args.find((arg) => arg.startsWith("--config="))?.split(
  "=",
)[1];
const verbose = Andromeda.args.includes("--verbose");

console.log("Config:", config);
console.log("Verbose mode:", verbose);
```

### Node Command Arguments

#### `Andromeda.process.argv: string[]`

An array containing the command-line arguments passed to the Andromeda process (Node.js style).

```typescript
// Display all command-line arguments
console.log("Command-line arguments:", Andromeda.process.argv);

// Skip the first two arguments (executable and script name)
const args = Andromeda.process.argv.slice(2);
console.log("Script arguments:", args);

// Parse simple flags
const hasVerbose = args.includes("--verbose") || args.includes("-v");
const hasHelp = args.includes("--help") || args.includes("-h");

if (hasHelp) {
  console.log("Usage: andromeda script.js [options]");
  console.log("  --verbose, -v    Enable verbose output");
  console.log("  --help, -h       Show this help message");
  Andromeda.process.exit(0);
}
```

## Process Control

### `Andromeda.process.exit(code?: number): never`

Terminates the current process with the specified exit code.

**Parameters:**

- `code` (optional) - Exit code (default: 0)

```typescript
// Successful exit
Andromeda.process.exit(0);

// Exit with error code
Andromeda.process.exit(1);

// Exit with custom error code
Andromeda.process.exit(42);
```

## Working Directory

### `Andromeda.process.cwd(): string`

Returns the current working directory of the process.

```typescript
const currentDir = Andromeda.process.cwd();
console.log(`Current directory: ${currentDir}`);

// Use in file operations
const configPath = `${currentDir}/config.json`;
```

### `Andromeda.process.chdir(directory: string): void`

Changes the current working directory of the process.

**Parameters:**

- `directory` - Path to the new working directory

```typescript
console.log("Before:", Andromeda.process.cwd());

// Change to parent directory
Andromeda.process.chdir("..");
console.log("After:", Andromeda.process.cwd());

// Change to specific directory
Andromeda.process.chdir("/home/user/projects");
console.log("New directory:", Andromeda.process.cwd());
```

### Parsing Command Line Arguments

```typescript
interface ParsedArgs {
  config?: string;
  verbose: boolean;
  port?: number;
  files: string[];
}

function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    verbose: false,
    files: [],
  };

  for (const arg of args) {
    if (arg === "--verbose" || arg === "-v") {
      result.verbose = true;
    } else if (arg.startsWith("--config=")) {
      result.config = arg.split("=")[1];
    } else if (arg.startsWith("--port=")) {
      result.port = parseInt(arg.split("=")[1], 10);
    } else if (!arg.startsWith("-")) {
      result.files.push(arg);
    }
  }

  return result;
}

const parsed = parseArgs(Andromeda.args);
console.log("Parsed arguments:", parsed);
```

## Process Information

### Process ID and Platform

While Andromeda doesn't expose all Node.js process properties, you can access
basic information:

```typescript
// Check if running in Andromeda
if (typeof Andromeda !== "undefined") {
  console.log("Running in Andromeda runtime");
}

// Environment-based platform detection
const platform = Andromeda.env.get("OS") || Andromeda.env.get("OSTYPE") || "unknown";
console.log("Platform:", platform);
```

## Common Usage Patterns

### Configuration Management

```typescript
interface AppConfig {
  port: number;
  debug: boolean;
  apiKey?: string;
  logLevel: string;
}

function loadConfig(): AppConfig {
  return {
    port: parseInt(Andromeda.env.get("PORT") || "3000", 10),
    debug: Andromeda.env.get("DEBUG") === "true",
    apiKey: Andromeda.env.get("API_KEY"),
    logLevel: Andromeda.env.get("LOG_LEVEL") || "info",
  };
}

const config = loadConfig();
console.log("Application config:", config);
```

### Argument-based Configuration

```typescript
function createConfigFromArgs(): AppConfig {
  const args = parseArgs(Andromeda.args);

  return {
    port: args.port || parseInt(Andromeda.env.get("PORT") || "3000", 10),
    debug: args.verbose || Andromeda.env.get("DEBUG") === "true",
    apiKey: Andromeda.env.get("API_KEY"),
    logLevel: args.verbose ? "debug" : "info",
  };
}
```

### Environment Detection

```typescript
function getEnvironment(): "development" | "production" | "test" {
  const nodeEnv = Andromeda.env.get("NODE_ENV");
  const env = Andromeda.env.get("ENVIRONMENT");

  if (nodeEnv === "production" || env === "prod") return "production";
  if (nodeEnv === "test" || env === "test") return "test";
  return "development";
}

const environment = getEnvironment();
console.log("Running in environment:", environment);
```

### Script Utilities

```typescript
class ProcessUtils {
  static getRequiredEnv(name: string): string {
    const value = Andromeda.env.get(name);
    if (!value) {
      throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
  }

  static getEnvAsNumber(name: string, defaultValue: number): number {
    const value = Andromeda.env.get(name);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static getEnvAsBoolean(name: string, defaultValue: boolean): boolean {
    const value = Andromeda.env.get(name);
    if (!value) return defaultValue;
    return value.toLowerCase() === "true" || value === "1";
  }

  static hasFlag(flag: string): boolean {
    return Andromeda.args.includes(flag) ||
      Andromeda.args.includes(`-${flag}`) ||
      Andromeda.args.includes(`--${flag}`);
  }
}

// Usage
const apiKey = ProcessUtils.getRequiredEnv("API_KEY");
const port = ProcessUtils.getEnvAsNumber("PORT", 3000);
const debug = ProcessUtils.getEnvAsBoolean("DEBUG", false);
const verbose = ProcessUtils.hasFlag("verbose");
```

## Security Considerations

1. **Sensitive data**: Be careful not to log environment variables that might
   contain secrets

2. **Input validation**: Always validate and sanitize command-line arguments

3. **Environment isolation**: Be aware that environment variables are inherited
   from the parent process

## Best Practices

1. **Use descriptive names**: Use clear, consistent naming for environment
   variables

2. **Provide defaults**: Always provide sensible default values

3. **Document requirements**: Document which environment variables are required

4. **Type safety**: Use utility functions to safely parse environment variables

## See Also

- [File System API](/docs/api/file-system) - For file and directory operations
- [Console API](/docs/api/console) - For logging and debugging
- [CLI Reference](/docs/cli-reference) - For command-line usage
