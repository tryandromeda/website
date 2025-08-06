---
title: "Cache Storage API"
description: "Web-standard cache storage for HTTP responses and data persistence"
section: "API Reference"
order: 15
id: "cache-storage-api"
---

The Cache Storage API provides a web-standard interface for caching HTTP responses and other data. It's designed for storing network requests and responses, enabling offline functionality and improved performance.

## Overview

The Cache Storage API in Andromeda allows you to:

- Store HTTP requests and responses for offline access
- Cache static assets and API responses
- Implement custom caching strategies
- Manage multiple named caches
- Follow the web standards for cache management

## Basic Usage

### Opening a Cache

```typescript
// Open or create a cache with a specific name
const cache = await caches.open("my-cache-v1");

// Open cache for API responses
const apiCache = await caches.open("api-cache");

// Open cache for static assets
const assetCache = await caches.open("static-assets");
```

### Storing Responses

```typescript
// Cache a fetch response
const response = await fetch("https://api.example.com/data");
await cache.put("https://api.example.com/data", response);

// Cache multiple requests
const urls = [
  "https://api.example.com/users",
  "https://api.example.com/posts",
  "https://api.example.com/comments"
];

for (const url of urls) {
  const response = await fetch(url);
  await cache.put(url, response);
}
```

### Retrieving Cached Responses

```typescript
// Get a cached response
const cachedResponse = await cache.match("https://api.example.com/data");

if (cachedResponse) {
  const data = await cachedResponse.json();
  console.log("Using cached data:", data);
} else {
  console.log("No cached response found");
}
```

## API Reference

### `caches` Global Object

The global `caches` object provides access to cache management methods.

#### `caches.open(cacheName)`

Opens an existing cache or creates a new one with the specified name.

**Parameters:**

- `cacheName` (string): Name of the cache to open or create

**Returns:**

- `Promise<Cache>`: A Cache object for the specified cache

**Example:**

```typescript
const cache = await caches.open("my-app-cache");
```

#### `caches.has(cacheName)`

Checks if a cache with the specified name exists.

**Parameters:**

- `cacheName` (string): Name of the cache to check

**Returns:**

- `Promise<boolean>`: True if the cache exists, false otherwise

**Example:**

```typescript
const exists = await caches.has("my-cache");
if (exists) {
  console.log("Cache exists");
}
```

#### `caches.delete(cacheName)`

Deletes a cache and all its contents.

**Parameters:**

- `cacheName` (string): Name of the cache to delete

**Returns:**

- `Promise<boolean>`: True if the cache was deleted, false if it didn't exist

**Example:**

```typescript
const deleted = await caches.delete("old-cache");
if (deleted) {
  console.log("Cache deleted successfully");
}
```

#### `caches.keys()`

Returns a list of all cache names.

**Returns:**

- `Promise<string[]>`: Array of cache names

**Example:**

```typescript
const cacheNames = await caches.keys();
console.log("Available caches:", cacheNames);
```

### Cache Object Methods

#### `cache.put(request, response)`

Stores a request/response pair in the cache.

**Parameters:**

- `request` (string | Request): URL string or Request object
- `response` (Response): Response object to cache

**Returns:**

- `Promise<void>`

**Example:**

```typescript
const response = await fetch("/api/data");
await cache.put("/api/data", response);
```

#### `cache.match(request, options?)`

Retrieves a cached response for the given request.

**Parameters:**

- `request` (string | Request): URL string or Request object to match
- `options` (object, optional): Match options

**Returns:**

- `Promise<Response | undefined>`: Cached response or undefined if not found

**Example:**

```typescript
const cached = await cache.match("/api/data");
if (cached) {
  const data = await cached.json();
}
```

#### `cache.matchAll(request?, options?)`

Retrieves all cached responses that match the given request.

**Parameters:**

- `request` (string | Request, optional): URL string or Request object to match
- `options` (object, optional): Match options

**Returns:**

- `Promise<Response[]>`: Array of matching cached responses

**Example:**

```typescript
// Get all cached responses
const allResponses = await cache.matchAll();

// Get responses matching a pattern
const apiResponses = await cache.matchAll("/api/");
```

#### `cache.add(request)`

Fetches a URL and stores the response in the cache.

**Parameters:**

- `request` (string | Request): URL string or Request object to fetch and cache

**Returns:**

- `Promise<void>`

**Example:**

```typescript
// Fetch and cache in one operation
await cache.add("https://api.example.com/config");
```

#### `cache.addAll(requests)`

Fetches multiple URLs and stores all responses in the cache.

**Parameters:**

- `requests` (Array<string | Request>): Array of URLs or Request objects

**Returns:**

- `Promise<void>`

**Example:**

```typescript
await cache.addAll([
  "/api/users",
  "/api/posts",
  "/static/app.css",
  "/static/app.js"
]);
```

#### `cache.delete(request, options?)`

Removes a cached response.

**Parameters:**

- `request` (string | Request): URL string or Request object to remove
- `options` (object, optional): Match options

**Returns:**

- `Promise<boolean>`: True if the entry was deleted, false if not found

**Example:**

```typescript
const deleted = await cache.delete("/api/old-data");
if (deleted) {
  console.log("Cached entry removed");
}
```

#### `cache.keys(request?, options?)`

Returns a list of all cached request URLs.

**Parameters:**

- `request` (string | Request, optional): URL pattern to filter by
- `options` (object, optional): Match options

**Returns:**

- `Promise<Request[]>`: Array of cached Request objects

**Example:**

```typescript
// Get all cached request URLs
const allKeys = await cache.keys();

// Get API-related cached URLs
const apiKeys = await cache.keys("/api/");
```

## Examples

### Basic Caching Strategy

```typescript
async function fetchWithCache(url: string) {
  const cache = await caches.open("api-cache");
  
  // Try to get from cache first
  let response = await cache.match(url);
  
  if (response) {
    console.log("Using cached response");
    return response;
  }
  
  // Fetch from network
  console.log("Fetching from network");
  response = await fetch(url);
  
  // Cache the response
  if (response.ok) {
    await cache.put(url, response.clone());
  }
  
  return response;
}

// Usage
const data = await fetchWithCache("https://api.example.com/users");
const users = await data.json();
```

### Cache-First Strategy

```typescript
async function cacheFirst(url: string, cacheName: string = "default") {
  const cache = await caches.open(cacheName);
  
  // Always try cache first
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to network
  try {
    const networkResponse = await fetch(url);
    if (networkResponse.ok) {
      await cache.put(url, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Network failed:", error);
    throw error;
  }
}
```

### Network-First Strategy

```typescript
async function networkFirst(url: string, cacheName: string = "default") {
  const cache = await caches.open(cacheName);
  
  try {
    // Try network first
    const networkResponse = await fetch(url);
    if (networkResponse.ok) {
      await cache.put(url, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.warn("Network failed, trying cache:", error);
  }
  
  // Fallback to cache
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error("Both network and cache failed");
}
```

### Cache Management

```typescript
class CacheManager {
  private static readonly CACHE_VERSION = "v1";
  private static readonly MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  static async preloadEssentialResources() {
    const cache = await caches.open(`app-${this.CACHE_VERSION}`);
    
    const essentialUrls = [
      "/api/config",
      "/api/user/profile",
      "/static/critical.css",
      "/static/app.js"
    ];
    
    await cache.addAll(essentialUrls);
    console.log("Essential resources cached");
  }
  
  static async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCache = `app-${this.CACHE_VERSION}`;
    
    const deletePromises = cacheNames
      .filter(name => name.startsWith("app-") && name !== currentCache)
      .map(name => caches.delete(name));
    
    await Promise.all(deletePromises);
    console.log("Old caches cleaned up");
  }
  
  static async clearExpiredEntries(cacheName: string) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get("date");
        if (dateHeader) {
          const age = Date.now() - new Date(dateHeader).getTime();
          if (age > this.MAX_CACHE_AGE) {
            await cache.delete(request);
            console.log(`Expired entry removed: ${request.url}`);
          }
        }
      }
    }
  }
}

// Initialize cache management
await CacheManager.preloadEssentialResources();
await CacheManager.cleanupOldCaches();
```

### Selective Caching

```typescript
async function smartCache(url: string) {
  const cache = await caches.open("smart-cache");
  
  // Check if URL should be cached
  const shouldCache = (url: string) => {
    return url.includes("/api/") && 
           !url.includes("/user/") && 
           !url.includes("/auth/");
  };
  
  if (!shouldCache(url)) {
    return fetch(url);
  }
  
  // Use cache for cacheable URLs
  const cached = await cache.match(url);
  if (cached) {
    // Check if cache is still fresh (5 minutes)
    const cacheTime = cached.headers.get("x-cache-time");
    if (cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
      return cached;
    }
  }
  
  // Fetch fresh data
  const response = await fetch(url);
  if (response.ok) {
    // Add cache timestamp
    const responseToCache = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "x-cache-time": Date.now().toString()
      }
    });
    
    await cache.put(url, responseToCache);
    return response;
  }
  
  return response;
}
```

### Offline-First Application

```typescript
class OfflineApp {
  private static readonly CACHE_NAME = "offline-app-v1";
  
  static async initialize() {
    await this.cacheEssentialResources();
    this.setupFetchHandler();
  }
  
  private static async cacheEssentialResources() {
    const cache = await caches.open(this.CACHE_NAME);
    
    const resources = [
      "/",
      "/offline.html",
      "/app.css",
      "/app.js",
      "/api/config"
    ];
    
    await cache.addAll(resources);
  }
  
  private static setupFetchHandler() {
    // In a service worker context, you would use:
    // self.addEventListener('fetch', this.handleFetch);
    
    // For demonstration, wrapping fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = this.handleFetch.bind(this);
  }
  
  private static async handleFetch(request: RequestInfo): Promise<Response> {
    const cache = await caches.open(this.CACHE_NAME);
    const url = typeof request === 'string' ? request : request.url;
    
    try {
      // Try network first for API calls
      if (url.includes('/api/')) {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }
      
      // For other resources, try cache first
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
      
    } catch (error) {
      console.warn("Network failed, trying cache");
      
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline page for navigation requests
      if (url.endsWith('.html') || !url.includes('.')) {
        const offlinePage = await cache.match('/offline.html');
        if (offlinePage) {
          return offlinePage;
        }
      }
      
      throw error;
    }
  }
}

// Initialize offline capabilities
await OfflineApp.initialize();
```

## Best Practices

### Cache Naming

```typescript
// Use versioned cache names
const CACHE_VERSION = "v1.2.0";
const cache = await caches.open(`my-app-${CACHE_VERSION}`);

// Use descriptive names for different types of content
const apiCache = await caches.open("api-responses-v1");
const staticCache = await caches.open("static-assets-v1");
const imageCache = await caches.open("images-v1");
```

### Response Cloning

```typescript
// Always clone responses when caching
const response = await fetch(url);
await cache.put(url, response.clone());
return response; // Original can still be consumed
```

### Cache Size Management

```typescript
async function manageCacheSize(cacheName: string, maxEntries: number) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    // Remove oldest entries (FIFO)
    const entriesToRemove = keys.slice(0, keys.length - maxEntries);
    await Promise.all(
      entriesToRemove.map(key => cache.delete(key))
    );
  }
}
```

## Error Handling

```typescript
async function robustCacheOperation(url: string) {
  try {
    const cache = await caches.open("my-cache");
    
    try {
      const cached = await cache.match(url);
      if (cached) {
        return cached;
      }
    } catch (cacheError) {
      console.warn("Cache read failed:", cacheError);
    }
    
    const response = await fetch(url);
    
    try {
      if (response.ok) {
        await cache.put(url, response.clone());
      }
    } catch (cacheError) {
      console.warn("Cache write failed:", cacheError);
    }
    
    return response;
  } catch (error) {
    console.error("Operation failed:", error);
    throw error;
  }
}
```

## Notes

- Cache Storage follows web standards and is persistent across application restarts
- Cached responses maintain their original headers and status codes
- Always clone responses when you need to cache and consume them
- Consider cache size limits and implement cleanup strategies
- Cache names are case-sensitive and should follow a consistent naming convention

## See Also

- **[Fetch API](/docs/api/fetch)** - HTTP client functionality
- **[Web Storage API](/docs/api/web-storage)** - localStorage and sessionStorage
- **[File System API](/docs/api/file-system)** - File-based storage options
