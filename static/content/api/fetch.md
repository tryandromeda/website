# Fetch API

The Fetch API provides an interface for fetching resources from across the network. It's a modern replacement for XMLHttpRequest that uses promises.

## Overview

Andromeda implements the standard Fetch API as defined in the WHATWG Fetch specification, providing a powerful and flexible HTTP client that works seamlessly with async/await syntax.

## Headers

### Constructor

```typescript
new Headers(init?: HeadersInit)
```

Creates a new Headers object.

**Parameters:**

- `init` (optional): Initial headers as an object, array of key-value pairs, or another Headers object

**Example:**

```typescript
// From object
const headers1 = new Headers({
  "Content-Type": "application/json",
  "Authorization": "Bearer token123"
});

// From array
const headers2 = new Headers([
  ["Content-Type", "text/html"],
  ["Set-Cookie", "session=abc"]
]);

// Empty headers
const headers3 = new Headers();
```

### Methods

#### `append(name: string, value: string): void`

Appends a new value to an existing header, or adds the header if it doesn't exist.

```typescript
const headers = new Headers();
headers.append("Content-Type", "text/html");
headers.append("Set-Cookie", "session=abc");
headers.append("Set-Cookie", "theme=dark"); // Multiple values
```

#### `delete(name: string): void`

Deletes a header from the Headers object.

```typescript
headers.delete("Authorization");
```

#### `get(name: string): string | null`

Returns the first value of a given header name, or null if not found.

```typescript
const contentType = headers.get("Content-Type");
console.log(contentType); // "application/json"
```

#### `has(name: string): boolean`

Returns whether a header with the given name exists.

```typescript
if (headers.has("Authorization")) {
  // Handle authenticated request
}
```

#### `set(name: string, value: string): void`

Sets a header value, replacing any existing value.

```typescript
headers.set("Content-Type", "application/json");
```

#### `forEach(callback: (value: string, name: string, parent: Headers) => void): void`

Executes a function for each header in the Headers object.

```typescript
headers.forEach((value, name) => {
  console.log(`${name}: ${value}`);
});
```

## Usage Examples

### Basic Headers Usage

```typescript
// Create headers for API request
const apiHeaders = new Headers({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer your-token-here"
});

// Add additional headers
apiHeaders.append("X-Client-Version", "1.0.0");

// Check if header exists
if (apiHeaders.has("Authorization")) {
  console.log("Request is authenticated");
}

// Get header value
const contentType = apiHeaders.get("Content-Type");
console.log(`Content-Type: ${contentType}`);
```

### Multiple Cookie Headers

```typescript
const responseHeaders = new Headers();

// Add multiple Set-Cookie headers
responseHeaders.append("Set-Cookie", "sessionId=abc123; HttpOnly");
responseHeaders.append("Set-Cookie", "theme=dark; Path=/");
responseHeaders.append("Set-Cookie", "lang=en; Max-Age=86400");

// All cookies will be properly handled
console.log(responseHeaders.get("Set-Cookie"));
```

### Header Manipulation

```typescript
const headers = new Headers({
  "Content-Type": "text/plain",
  "X-Custom-Header": "initial-value"
});

// Update existing header
headers.set("Content-Type", "application/json");

// Remove header
headers.delete("X-Custom-Header");

// Add new header
headers.set("Cache-Control", "no-cache");
```

## Browser Compatibility

Andromeda's Headers implementation follows the WHATWG Fetch specification and provides compatibility with:

- Standard header name case-insensitive behavior
- Proper handling of multiple values for the same header
- Forbidden header names protection
- CORS-safe header handling

## Best Practices

### Header Names

Header names are case-insensitive, but it's good practice to use consistent casing:

```typescript
// Recommended
headers.set("Content-Type", "application/json");
headers.set("Authorization", "Bearer token");

// Works but inconsistent
headers.set("content-type", "application/json");
headers.set("AUTHORIZATION", "Bearer token");
```

### Security Considerations

Some headers are restricted for security reasons:

```typescript
// These will be ignored or throw errors
headers.set("Host", "evil.com");           // Forbidden
headers.set("Content-Length", "1000");     // Managed by runtime
```

### Performance Tips

- Reuse Headers objects when possible
- Use object notation for initial headers when you have multiple headers
- Avoid unnecessary header manipulation in hot code paths

```typescript
// Efficient
const baseHeaders = new Headers({
  "User-Agent": "Andromeda/1.0",
  "Accept": "application/json"
});

// Less efficient
const headers = new Headers();
headers.set("User-Agent", "Andromeda/1.0");
headers.set("Accept", "application/json");
```

## Related APIs

- [URL API](url) - For working with URLs in fetch requests
- [Web APIs](web) - For additional web standards support
- [Text Encoding](web.md#text-encoding) - For handling request/response bodies

## Error Handling

Headers operations can throw TypeErrors for invalid inputs:

```typescript
try {
  const headers = new Headers();
  headers.set("Invalid\nHeader", "value"); // Throws TypeError
} catch (error) {
  console.error("Invalid header:", error.message);
}
```

Common error cases:

- Invalid header names (containing forbidden characters)
- Invalid header values (containing forbidden characters)
- Attempting to modify immutable headers in certain contexts
