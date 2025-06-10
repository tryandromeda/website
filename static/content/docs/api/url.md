# URL API

The URL API provides utilities for parsing, constructing, normalizing, and
encoding URLs. It implements the WHATWG URL Standard for consistent URL
handling.

## Overview

Andromeda's URL implementation provides a robust way to work with URLs,
supporting both absolute and relative URL parsing, validation, and manipulation.

## URL Constructor

### Syntax

```typescript
new URL(url: string, base?: string)
```

Creates a new URL object from a URL string and an optional base URL.

**Parameters:**

- `url`: The URL string to parse (can be absolute or relative)
- `base` (optional): The base URL to resolve relative URLs against

**Returns:** A new URL object

**Throws:** `TypeError` if the URL is invalid

### Examples

#### Absolute URLs

```typescript
// Create URL from absolute URL
const url1 = new URL("https://example.com/path?query=value#fragment");
console.log(url1.toString()); // "https://example.com/path?query=value#fragment"
```

#### Relative URLs with Base

```typescript
const baseUrl = "https://developer.mozilla.org";

// Relative path
const url1 = new URL("/docs", baseUrl);
console.log(url1.toString()); // "https://developer.mozilla.org/docs"

// Relative path with existing path
const url2 = new URL("en-US/docs", baseUrl);
console.log(url2.toString()); // "https://developer.mozilla.org/en-US/docs"

// Absolute path overwrites base path
const url3 = new URL("/en-US/docs", "https://developer.mozilla.org/fr-FR/");
console.log(url3.toString()); // "https://developer.mozilla.org/en-US/docs"
```

#### Using URL Objects as Base

```typescript
const baseUrl = new URL("https://developer.mozilla.org/");
const docsUrl = new URL("en-US/docs", baseUrl);
console.log(docsUrl.toString()); // "https://developer.mozilla.org/en-US/docs"
```

## Static Methods

### `URL.parse(url: string, base?: string)`

A static method that safely parses a URL without throwing an exception.

```typescript
// Valid URL
const result1 = URL.parse("https://example.com/path");
console.log(result1); // URL object

// Valid relative URL with base
const result2 = URL.parse("docs", "https://example.com/");
console.log(result2); // URL object

// Invalid URL returns null (in standard implementation)
const result3 = URL.parse("not-a-valid-url");
console.log(result3); // null or throws depending on implementation
```

## Instance Methods

### `toString()`

Returns the complete URL as a string.

```typescript
const url = new URL("https://example.com/path?query=value");
console.log(url.toString()); // "https://example.com/path?query=value"

// toString() is called automatically in string contexts
console.log(`URL: ${url}`); // "URL: https://example.com/path?query=value"
```

## Usage Examples

### Basic URL Parsing

```typescript
// Parse a complete URL
const apiUrl = new URL("https://api.example.com/v1/users?limit=10&offset=0");
console.log(apiUrl.toString());

// Parse relative URL
const baseUrl = "https://api.example.com/";
const endpoint = new URL("v1/users", baseUrl);
console.log(endpoint.toString()); // "https://api.example.com/v1/users"
```

### Building URLs Dynamically

```typescript
const base = "https://api.example.com";

// Build different endpoints
const usersEndpoint = new URL("/v1/users", base);
const postsEndpoint = new URL("/v1/posts", base);
const profileEndpoint = new URL("/v1/profile", base);

console.log(usersEndpoint.toString()); // "https://api.example.com/v1/users"
console.log(postsEndpoint.toString()); // "https://api.example.com/v1/posts"
console.log(profileEndpoint.toString()); // "https://api.example.com/v1/profile"
```

### Working with Relative Paths

```typescript
const docBase = new URL("https://docs.example.com/guide/");

// Navigate to different sections
const introUrl = new URL("introduction", docBase);
const setupUrl = new URL("setup", docBase);
const advancedUrl = new URL("../advanced/", docBase);

console.log(introUrl.toString()); // "https://docs.example.com/guide/introduction"
console.log(setupUrl.toString()); // "https://docs.example.com/guide/setup"
console.log(advancedUrl.toString()); // "https://docs.example.com/advanced/"
```

### URL Validation

```typescript
function isValidUrl(urlString: string, base?: string): boolean {
  try {
    new URL(urlString, base);
    return true;
  } catch {
    return false;
  }
}

console.log(isValidUrl("https://example.com")); // true
console.log(isValidUrl("not-a-url")); // false
console.log(isValidUrl("/path", "https://example.com")); // true
console.log(isValidUrl("/path")); // false (no base for relative URL)
```

### Safe URL Parsing

```typescript
function parseUrlSafely(urlString: string, base?: string): URL | null {
  if ("parse" in URL) {
    // Use static parse method if available
    return URL.parse(urlString, base);
  } else {
    // Fallback to constructor with try-catch
    try {
      return new URL(urlString, base);
    } catch {
      return null;
    }
  }
}

const url = parseUrlSafely("https://example.com/path");
if (url) {
  console.log("Valid URL:", url.toString());
} else {
  console.log("Invalid URL");
}
```

## URL Resolution Examples

### Path Resolution

```typescript
const base = "https://example.com/docs/guide/";

// Different path types
console.log(new URL("intro.html", base)); // https://example.com/docs/guide/intro.html
console.log(new URL("./intro.html", base)); // https://example.com/docs/guide/intro.html
console.log(new URL("../api/", base)); // https://example.com/docs/api/
console.log(new URL("/help", base)); // https://example.com/help
console.log(new URL("?search=term", base)); // https://example.com/docs/guide/?search=term
console.log(new URL("#section", base)); // https://example.com/docs/guide/#section
```

### Protocol and Domain Handling

```typescript
const base = "https://example.com/path";

// Different protocols
console.log(new URL("http://other.com", base)); // http://other.com
console.log(new URL("//other.com/path", base)); // https://other.com/path
console.log(new URL("ftp://files.com", base)); // ftp://files.com
```

## Browser Compatibility

Andromeda's URL implementation follows the WHATWG URL Standard and provides:

- Standard URL parsing and resolution behavior
- Proper handling of relative URLs
- Support for various URL schemes
- Unicode normalization and encoding
- Compatible with modern browser URL APIs

## Best Practices

### Use Absolute Base URLs

Always provide absolute URLs as base when working with relative URLs:

```typescript
// Good
const goodBase = "https://api.example.com/";
const endpoint = new URL("users", goodBase);

// Avoid - relative base URLs can be confusing
const relativeBase = "/api/";
```

### Validate User Input

Always validate URLs from user input:

```typescript
function createApiUrl(userPath: string): URL | null {
  try {
    // Validate and sanitize user input
    const baseUrl = "https://api.example.com/";
    return new URL(userPath, baseUrl);
  } catch (error) {
    console.error("Invalid URL path:", userPath);
    return null;
  }
}
```

### Use URL for Path Building

Prefer URL constructor over string concatenation:

```typescript
// Good
const apiBase = "https://api.example.com/";
const userUrl = new URL(`users/${userId}`, apiBase);

// Less reliable
const userUrlString = `https://api.example.com/users/${userId}`;
```

## Common Patterns

### API Endpoint Builder

```typescript
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  buildUrl(path: string): URL {
    return new URL(path, this.baseUrl);
  }

  getUserUrl(userId: string): URL {
    return this.buildUrl(`users/${userId}`);
  }

  getPostsUrl(userId: string): URL {
    return this.buildUrl(`users/${userId}/posts`);
  }
}

const client = new ApiClient("https://api.example.com/v1/");
console.log(client.getUserUrl("123").toString());
// "https://api.example.com/v1/users/123"
```

### URL Path Navigation

```typescript
function navigateUrl(currentUrl: URL, relativePath: string): URL {
  return new URL(relativePath, currentUrl);
}

const currentPage = new URL("https://docs.example.com/guide/setup.html");
const nextPage = navigateUrl(currentPage, "configuration.html");
const prevSection = navigateUrl(currentPage, "../introduction/");

console.log(nextPage.toString()); // "https://docs.example.com/guide/configuration.html"
console.log(prevSection.toString()); // "https://docs.example.com/introduction/"
```

## Error Handling

URL constructor throws TypeError for invalid URLs:

```typescript
try {
  const url = new URL("not a valid url");
} catch (error) {
  if (error instanceof TypeError) {
    console.error("Invalid URL:", error.message);
  }
}

// Common invalid URL patterns
const invalidUrls = [
  "not-a-url",
  "http://",
  "://example.com",
  "relative/path", // without base
];

invalidUrls.forEach((urlString) => {
  try {
    new URL(urlString);
    console.log(`✓ ${urlString} is valid`);
  } catch {
    console.log(`✗ ${urlString} is invalid`);
  }
});
```

## Related APIs

- [Fetch API](fetch) - URLs are commonly used with fetch requests
- [Headers API](fetch.md#headers) - For HTTP headers in fetch requests
- [Web APIs](web) - For additional web standards support

## Limitations

Current implementation notes:

- The URL object may not expose all standard properties (hostname, port, etc.)
- Focus is on URL parsing and string representation
- Full URL manipulation API may be limited compared to browser implementations
