# Fetch API

The Fetch API provides an interface for fetching resources from across the
network. It's a modern replacement for XMLHttpRequest that uses promises and integrates seamlessly with async/await syntax.

## Overview

Andromeda implements the standard Fetch API as defined in the WHATWG Fetch
specification, providing a powerful and flexible HTTP client with support for:

- HTTP methods (GET, POST, PUT, DELETE, etc.)
- Request and response headers
- Request and response bodies
- Streaming responses
- AbortController for request cancellation
- Standard web APIs like Headers, Request, and Response

## Basic Usage

### Simple GET Request

```typescript
// Basic fetch
const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);

// With error handling
try {
  const response = await fetch("https://api.example.com/data");
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error("Fetch failed:", error);
}
```

### POST Request with JSON

```typescript
const postData = {
  name: "John Doe",
  email: "john@example.com"
};

const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-token"
  },
  body: JSON.stringify(postData)
});

const result = await response.json();
console.log("Created user:", result);
```

## Request Objects

### Creating Requests

```typescript
// Create a Request object
const request = new Request("https://api.example.com/data", {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "User-Agent": "Andromeda/1.0"
  }
});

// Use the Request object
const response = await fetch(request);
```

### Request Options

```typescript
const options = {
  method: "POST",           // HTTP method
  headers: {               // Request headers
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  body: JSON.stringify(data), // Request body
  mode: "cors",            // Request mode
  credentials: "include",   // Credentials policy
  cache: "no-cache",       // Cache policy
  redirect: "follow",      // Redirect policy
  referrer: "no-referrer", // Referrer policy
};

const response = await fetch(url, options);
```

## Response Objects

### Response Properties

```typescript
const response = await fetch("https://api.example.com/data");

console.log(response.status);     // 200
console.log(response.statusText); // "OK"
console.log(response.ok);         // true (status 200-299)
console.log(response.url);        // Final URL after redirects
console.log(response.headers);    // Headers object
console.log(response.type);       // Response type
```

### Reading Response Body

```typescript
const response = await fetch("https://api.example.com/data");

// JSON data
const jsonData = await response.json();

// Text data
const textData = await response.text();

// Binary data
const arrayBuffer = await response.arrayBuffer();
const blob = await response.blob();

// Form data
const formData = await response.formData();
```

### Response Methods

```typescript
// Check if response is successful
if (response.ok) {
  const data = await response.json();
} else {
  console.error(`Request failed: ${response.status} ${response.statusText}`);
}

// Clone response for multiple reads
const response1 = response.clone();
const response2 = response.clone();

const json = await response1.json();
const text = await response2.text();
```

## Headers

### Constructor

```typescript
new Headers(init?: HeadersInit)
```

Creates a new Headers object.

**Parameters:**

- `init` (optional): Initial headers as an object, array of key-value pairs, or
  another Headers object

**Example:**

```typescript
// From object
const headers1 = new Headers({
  "Content-Type": "application/json",
  "Authorization": "Bearer token123",
});

// From array
const headers2 = new Headers([
  ["Content-Type", "text/html"],
  ["Set-Cookie", "session=abc"],
]);

// Empty headers
const headers3 = new Headers();
```

### Methods

#### `append(name: string, value: string): void`

Appends a new value to an existing header, or adds the header if it doesn't
exist.

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
  "Authorization": "Bearer your-token-here",
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
  "X-Custom-Header": "initial-value",
});

// Update existing header
headers.set("Content-Type", "application/json");

// Remove header
headers.delete("X-Custom-Header");

// Add new header
headers.set("Cache-Control", "no-cache");
```

## Practical Examples

### REST API Client

```typescript
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Headers;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    
    if (token) {
      this.defaultHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.defaultHeaders
    });
    
    return this.handleResponse(response);
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.defaultHeaders,
      body: JSON.stringify(data)
    });
    
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.defaultHeaders
    });
    
    return this.handleResponse(response);
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    
    return response.text();
  }
}

// Usage
const api = new ApiClient("https://jsonplaceholder.typicode.com", "your-token");

try {
  const users = await api.get("/users");
  console.log("Users:", users);
  
  const newUser = await api.post("/users", {
    name: "John Doe",
    email: "john@example.com"
  });
  console.log("Created:", newUser);
} catch (error) {
  console.error("API Error:", error);
}
```

### File Upload

```typescript
async function uploadFile(file: Blob, filename: string) {
  const formData = new FormData();
  formData.append("file", file, filename);
  formData.append("description", "Uploaded via Andromeda");

  const response = await fetch("https://api.example.com/upload", {
    method: "POST",
    body: formData,
    // Don't set Content-Type header - let browser set it with boundary
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

// Create a text file and upload it
const textContent = "Hello from Andromeda!";
const blob = new Blob([textContent], { type: "text/plain" });

try {
  const result = await uploadFile(blob, "hello.txt");
  console.log("Upload successful:", result);
} catch (error) {
  console.error("Upload failed:", error);
}
```

### Download with Progress

```typescript
async function downloadWithProgress(url: string, filename: string) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  let received = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    received += value.length;
    
    if (total > 0) {
      const progress = (received / total) * 100;
      console.log(`Download progress: ${progress.toFixed(1)}%`);
    }
  }

  // Combine chunks
  const combinedArray = new Uint8Array(received);
  let position = 0;
  for (const chunk of chunks) {
    combinedArray.set(chunk, position);
    position += chunk.length;
  }

  // Save to file (example - actual implementation depends on your needs)
  console.log(`Downloaded ${received} bytes to ${filename}`);
  return combinedArray;
}

// Usage
try {
  const data = await downloadWithProgress(
    "https://example.com/large-file.zip",
    "download.zip"
  );
  console.log("Download complete!");
} catch (error) {
  console.error("Download failed:", error);
}
```

### Request with Timeout and Retry

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 5000
) {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // Don't retry for client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      // Server error - retry
      if (i === retries) {
        throw new Error(`Server error: ${response.status}`);
      }

    } catch (error) {
      clearTimeout(timeoutId);

      if (i === retries) {
        throw error;
      }

      // Wait before retry with exponential backoff
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${retries} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
try {
  const response = await fetchWithRetry("https://unreliable-api.com/data");
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error("All retries failed:", error);
}
```

## Error Handling

### Common Error Patterns

```typescript
async function robustFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Check if request was successful
    if (!response.ok) {
      // Handle different status codes
      switch (response.status) {
        case 400:
          throw new Error("Bad Request: Check your request parameters");
        case 401:
          throw new Error("Unauthorized: Check your authentication");
        case 403:
          throw new Error("Forbidden: You don't have permission");
        case 404:
          throw new Error("Not Found: Resource doesn't exist");
        case 500:
          throw new Error("Internal Server Error: Try again later");
        default:
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return response;
    
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new Error("Network error: Check your internet connection");
    }
    
    // Handle abort errors
    if (error.name === "AbortError") {
      throw new Error("Request was cancelled");
    }
    
    // Re-throw other errors
    throw error;
  }
}
```

### Validation and Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Validate response structure
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response format");
  }
  
  if (typeof data.id !== "number" || 
      typeof data.name !== "string" || 
      typeof data.email !== "string") {
    throw new Error("Invalid user data structure");
  }
  
  return data as User;
}

// Usage with proper error handling
try {
  const user = await fetchUser(123);
  console.log(`User: ${user.name} (${user.email})`);
} catch (error) {
  console.error("Failed to load user:", error.message);
}
```

## Performance Optimization

### Connection Reuse

```typescript
// Create a base configuration for reusing connections
const baseRequest = new Request("https://api.example.com", {
  headers: {
    "Connection": "keep-alive",
    "User-Agent": "Andromeda/1.0"
  }
});

// Reuse the base configuration
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = new URL(endpoint, baseRequest.url);
  
  return fetch(url.toString(), {
    ...baseRequest,
    ...options,
    headers: {
      ...baseRequest.headers,
      ...options.headers
    }
  });
}
```

### Caching Strategy

```typescript
class CachedFetcher {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = url + JSON.stringify(options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log("Cache hit for:", url);
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("Cache miss for:", url);
    const response = await fetch(url, options);
    
    if (response.ok) {
      const data = await response.clone().json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return response;
  }

  clearCache() {
    this.cache.clear();
  }
}

const cachedFetcher = new CachedFetcher();
```

## Best Practices

1. **Always handle errors**: Network requests can fail for many reasons
2. **Use appropriate HTTP methods**: GET for fetching, POST for creating, etc.
3. **Set proper headers**: Especially Content-Type for POST/PUT requests
4. **Validate responses**: Check status codes and response structure
5. **Use AbortController**: For request cancellation and timeouts
6. **Implement retry logic**: For handling temporary network issues
7. **Cache when appropriate**: To reduce unnecessary network requests
