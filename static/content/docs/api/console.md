# Console API

The Console API provides a simple debugging console similar to what you'd find
in browsers and Node.js. It allows you to output messages to the
terminal/console.

## Overview

The console in Andromeda provides basic logging functionality with methods to
print messages, errors, and other diagnostic information.

## Methods

### `console.log(...args)`

Outputs a message to the console.

**Parameters:**

- `...args` - One or more values to output

**Example:**

```typescript
console.log("Hello, World!");
console.log("Number:", 42);
console.log("Multiple", "values", "at", "once");
```

### `console.error(...args)`

Outputs an error message to the console.

**Parameters:**

- `...args` - One or more values to output as errors

**Example:**

```typescript
console.error("Something went wrong!");
console.error("Error code:", 404);
```

### `console.warn(...args)`

Outputs a warning message to the console.

**Parameters:**

- `...args` - One or more values to output as warnings

**Example:**

```typescript
console.warn("This is deprecated");
console.warn("Warning:", "Low disk space");
```

### `console.info(...args)`

Outputs an informational message to the console.

**Parameters:**

- `...args` - One or more values to output as information

**Example:**

```typescript
console.info("Application started");
console.info("Version:", "1.0.0");
```

### `console.debug(...args)`

Outputs a debug message to the console.

**Parameters:**

- `...args` - One or more values to output for debugging

**Example:**

```typescript
console.debug("Debug info:", { x: 10, y: 20 });
console.debug("Function called with args:", arguments);
```

## Output Formatting

The console automatically converts objects to string representations for
display:

```typescript
const obj = { name: "John", age: 30 };
console.log("User:", obj); // Outputs: User: [object Object]

const arr = [1, 2, 3, 4, 5];
console.log("Numbers:", arr); // Outputs: Numbers: 1,2,3,4,5
```

## Usage in Scripts

The console is available globally in all Andromeda scripts without any imports:

```typescript
// Direct usage
console.log("Script started");

// In functions
function processData(data: any[]) {
  console.log("Processing", data.length, "items");
  // ... processing logic
  console.log("Processing complete");
}

// Error handling
try {
  riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
}
```

## Best Practices

1. **Use appropriate log levels**: Use `console.error()` for errors,
   `console.warn()` for warnings, etc.

2. **Provide context**: Include relevant information in your log messages:

   ```typescript
   // Good
   console.log("User login attempt for:", username);

   // Better
   console.log("User login attempt for:", username, "at", new Date());
   ```

3. **Avoid logging sensitive information**: Don't log passwords, tokens, or
   other sensitive data.

4. **Use structured logging for complex data**:

   ```typescript
   const result = { success: true, count: 42, errors: [] };
   console.log("Operation result:", JSON.stringify(result, null, 2));
   ```

## See Also

- [Performance API](./performance) - For timing and performance measurements
- [Process API](./process) - For environment variables and process information
