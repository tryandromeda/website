---
title: "Console API"
description: "Simple debugging console for outputting messages to the terminal"
section: "API Reference"
order: 10
id: "console-api"
---

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

## CSS Styling Support

Andromeda's console supports CSS-like styling for enhanced visual output. You can use special formatting directives to style your console messages.

### `console.log(message, ...styles)`

When the first argument contains `%c` placeholders, subsequent arguments are treated as CSS-like style strings.

**Supported CSS Properties:**

- `color` - Text color (named colors, hex, rgb)
- `background-color` - Background color  
- `font-weight` - Font weight (normal, bold)
- `font-style` - Font style (normal, italic)
- `text-decoration` - Text decoration (none, underline)

**Example:**

```typescript
// Basic colored text
console.log("%cHello World!", "color: red");

// Multiple styles
console.log("%cSuccess!", "color: green; font-weight: bold");

// Background colors
console.log("%cWarning", "background-color: yellow; color: black");

// Multiple styled sections
console.log(
  "%cError: %cOperation failed", 
  "color: red; font-weight: bold", 
  "color: gray"
);
```

### Advanced Styling Examples

```typescript
// Header styling
console.log(
  "%c🚀 Application Started", 
  "color: blue; font-weight: bold; background-color: lightblue"
);

// Success message
console.log(
  "%c✅ Success: %cData saved successfully", 
  "color: green; font-weight: bold", 
  "color: gray"
);

// Error styling
console.log(
  "%c❌ Error: %cConnection failed", 
  "color: red; font-weight: bold", 
  "color: darkred"
);

// Debug with styling
console.log(
  "%c[DEBUG] %cUser action: %c%s", 
  "color: purple; font-weight: bold",
  "color: blue",
  "color: black; font-style: italic",
  "button_clicked"
);
```

### Color Examples

```typescript
// Named colors
console.log("%cRed text", "color: red");
console.log("%cBlue text", "color: blue");
console.log("%cGreen text", "color: green");

// Hex colors
console.log("%cCustom color", "color: #ff6b6b");
console.log("%cAnother color", "color: #4ecdc4");

// RGB colors
console.log("%cRGB color", "color: rgb(255, 107, 107)");
console.log("%cRGBA color", "color: rgba(78, 205, 196, 0.8)");
```

### Practical Styling Patterns

```typescript
// Log levels with styling
function styledLog(level: string, message: string, ...args: any[]) {
  const styles = {
    info: "color: blue; font-weight: bold",
    warn: "color: orange; font-weight: bold", 
    error: "color: red; font-weight: bold",
    success: "color: green; font-weight: bold"
  };
  
  console.log(`%c[${level.toUpperCase()}] %c${message}`, 
    styles[level] || "color: gray", 
    "color: black", 
    ...args
  );
}

// Usage
styledLog("info", "Server starting on port 3000");
styledLog("warn", "Deprecated API usage detected");
styledLog("error", "Database connection failed");
styledLog("success", "User authenticated successfully");
```

### Component-based Styling

```typescript
class Logger {
  private static readonly STYLES = {
    timestamp: "color: gray; font-size: 0.8em",
    level: {
      info: "color: blue; font-weight: bold",
      warn: "color: orange; font-weight: bold",
      error: "color: red; font-weight: bold",
      debug: "color: purple; font-weight: bold"
    },
    message: "color: black"
  };

  static log(level: keyof typeof Logger.STYLES.level, message: string) {
    const timestamp = new Date().toISOString();
    console.log(
      "%c[%s] %c%s %c%s",
      Logger.STYLES.timestamp,
      timestamp,
      Logger.STYLES.level[level],
      level.toUpperCase(),
      Logger.STYLES.message,
      message
    );
  }
}

// Usage
Logger.log("info", "Application initialized");
Logger.log("warn", "Configuration file not found, using defaults");
Logger.log("error", "Failed to connect to database");
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

- [Performance API](/docs/api/performance) - For timing and performance
  measurements
- [Process API](/docs/api/process) - For environment variables and process
  information
