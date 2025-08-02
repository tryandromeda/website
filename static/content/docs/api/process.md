# Process API

The Process API provides access to runtime process information including
command-line arguments, environment variables, and process control. This API is
similar to Node.js process globals but adapted for Andromeda's runtime.

## Overview

The process-related functionality in Andromeda allows scripts to interact with
the runtime environment, access configuration through environment variables, and
obtain information about how the script was invoked.

## Environment Variables

### `Deno.env.get(name)`

Gets the value of an environment variable.

**Parameters:**

- `name` - The name of the environment variable

**Returns:** `string | undefined` - The value of the environment variable, or
undefined if not set

**Example:**

```typescript
const homeDir = Deno.env.get("HOME");
const path = Deno.env.get("PATH");
const customVar = Deno.env.get("MY_CUSTOM_VAR");

console.log("Home directory:", homeDir);
console.log("Custom variable:", customVar || "Not set");
```

### `Deno.env.set(name, value)`

Sets an environment variable.

**Parameters:**

- `name` - The name of the environment variable
- `value` - The value to set

**Example:**

```typescript
Deno.env.set("MY_APP_CONFIG", "production");
Deno.env.set("DEBUG_LEVEL", "2");

console.log("Config:", Deno.env.get("MY_APP_CONFIG"));
```

### `Deno.env.delete(name)`

Deletes an environment variable.

**Parameters:**

- `name` - The name of the environment variable to delete

**Example:**

```typescript
Deno.env.set("TEMP_VAR", "temporary");
console.log("Before delete:", Deno.env.get("TEMP_VAR"));

Deno.env.delete("TEMP_VAR");
console.log("After delete:", Deno.env.get("TEMP_VAR")); // undefined
```

### `Deno.env.toObject()`

Gets all environment variables as an object.

**Returns:** `Record<string, string>` - Object containing all environment
variables

**Example:**

```typescript
const allEnv = Deno.env.toObject();
console.log("Environment variables:");
for (const [key, value] of Object.entries(allEnv)) {
  console.log(`${key}=${value}`);
}
```

## Command Line Arguments

### `Deno.args`

An array containing the command-line arguments passed to the script.

**Type:** `string[]`

**Example:**

```typescript
// If script is run with: andromeda run script.ts --config=prod --verbose
console.log("Arguments:", Deno.args);
// Output: Arguments: ["--config=prod", "--verbose"]

// Parse arguments
const config = Deno.args.find((arg) => arg.startsWith("--config="))?.split(
  "=",
)[1];
const verbose = Deno.args.includes("--verbose");

console.log("Config:", config);
console.log("Verbose mode:", verbose);
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

const parsed = parseArgs(Deno.args);
console.log("Parsed arguments:", parsed);
```

## Process Information

### Process ID and Platform

While Andromeda doesn't expose all Node.js process properties, you can access
basic information:

```typescript
// Check if running in Andromeda
if (typeof Deno !== "undefined") {
  console.log("Running in Andromeda runtime");
}

// Environment-based platform detection
const platform = Deno.env.get("OS") || Deno.env.get("OSTYPE") || "unknown";
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
    port: parseInt(Deno.env.get("PORT") || "3000", 10),
    debug: Deno.env.get("DEBUG") === "true",
    apiKey: Deno.env.get("API_KEY"),
    logLevel: Deno.env.get("LOG_LEVEL") || "info",
  };
}

const config = loadConfig();
console.log("Application config:", config);
```

### Argument-based Configuration

```typescript
function createConfigFromArgs(): AppConfig {
  const args = parseArgs(Deno.args);

  return {
    port: args.port || parseInt(Deno.env.get("PORT") || "3000", 10),
    debug: args.verbose || Deno.env.get("DEBUG") === "true",
    apiKey: Deno.env.get("API_KEY"),
    logLevel: args.verbose ? "debug" : "info",
  };
}
```

### Environment Detection

```typescript
function getEnvironment(): "development" | "production" | "test" {
  const nodeEnv = Deno.env.get("NODE_ENV");
  const env = Deno.env.get("ENVIRONMENT");

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
    const value = Deno.env.get(name);
    if (!value) {
      throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
  }

  static getEnvAsNumber(name: string, defaultValue: number): number {
    const value = Deno.env.get(name);
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static getEnvAsBoolean(name: string, defaultValue: boolean): boolean {
    const value = Deno.env.get(name);
    if (!value) return defaultValue;
    return value.toLowerCase() === "true" || value === "1";
  }

  static hasFlag(flag: string): boolean {
    return Deno.args.includes(flag) ||
      Deno.args.includes(`-${flag}`) ||
      Deno.args.includes(`--${flag}`);
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
