---
title: "Web Storage API"
description: "localStorage and sessionStorage with SQLite backend"
section: "API Reference"
order: 21
id: "web-storage-api"
---

Andromeda provides a comprehensive Web Storage API that implements the standard
`localStorage` and `sessionStorage` interfaces. The storage is backed by SQLite
for persistence and follows WHATWG specifications for compatibility with web
applications.

## Overview

The Web Storage API provides two storage mechanisms:

- **localStorage**: Persistent storage that survives application restarts
- **sessionStorage**: Session-based storage that's cleared when the session ends

Both storage mechanisms provide the same interface and are backed by SQLite for
reliability and performance.

## localStorage

The `localStorage` object provides persistent storage that remains available
across application restarts.

### Properties

#### `localStorage.length: number`

Returns the number of key-value pairs stored in localStorage.

```typescript
console.log(`localStorage contains ${localStorage.length} items`);
```

### Methods

#### `localStorage.setItem(key: string, value: string): void`

Stores a key-value pair in localStorage.

**Parameters:**

- `key` - The storage key (string)
- `value` - The value to store (string)

**Example:**

```typescript
// Store simple values
localStorage.setItem("username", "john_doe");
localStorage.setItem("theme", "dark");

// Store serialized objects
const user = { name: "John", age: 30, preferences: { theme: "dark" } };
localStorage.setItem("user", JSON.stringify(user));

// Store arrays
const favorites = ["item1", "item2", "item3"];
localStorage.setItem("favorites", JSON.stringify(favorites));
```

#### `localStorage.getItem(key: string): string | null`

Retrieves a value from localStorage by key.

**Parameters:**

- `key` - The storage key

**Returns:** The stored value as a string, or `null` if the key doesn't exist

**Example:**

```typescript
// Retrieve simple values
const username = localStorage.getItem("username");
console.log("Username:", username); // "john_doe"

// Retrieve and parse objects
const userStr = localStorage.getItem("user");
if (userStr) {
  const user = JSON.parse(userStr);
  console.log("User name:", user.name);
}

// Handle missing keys
const nonExistent = localStorage.getItem("missing");
console.log(nonExistent); // null
```

#### `localStorage.removeItem(key: string): void`

Removes a specific key-value pair from localStorage.

**Parameters:**

- `key` - The storage key to remove

**Example:**

```typescript
// Remove specific items
localStorage.removeItem("username");
localStorage.removeItem("temp_data");

// Check if item was removed
const removed = localStorage.getItem("username");
console.log(removed); // null
```

#### `localStorage.clear(): void`

Removes all key-value pairs from localStorage.

**Example:**

```typescript
// Clear all localStorage data
localStorage.clear();
console.log(`localStorage now contains ${localStorage.length} items`); // 0
```

#### `localStorage.key(index: number): string | null`

Returns the key at the specified index.

**Parameters:**

- `index` - The index of the key to retrieve

**Returns:** The key at the specified index, or `null` if the index is out of
range

**Example:**

```typescript
// Store some data
localStorage.setItem("first", "value1");
localStorage.setItem("second", "value2");
localStorage.setItem("third", "value3");

// Iterate through all keys
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key!);
  console.log(`${key}: ${value}`);
}
```

## sessionStorage

The `sessionStorage` object provides session-based storage that's cleared when
the session ends. It has the same interface as `localStorage`.

### Properties and Methods

`sessionStorage` provides exactly the same API as `localStorage`:

- `sessionStorage.length`
- `sessionStorage.setItem(key, value)`
- `sessionStorage.getItem(key)`
- `sessionStorage.removeItem(key)`
- `sessionStorage.clear()`
- `sessionStorage.key(index)`

### Usage Examples

```typescript
// Session storage works identically to localStorage
sessionStorage.setItem("session_id", "abc123");
sessionStorage.setItem("current_page", "dashboard");

// Retrieve session data
const sessionId = sessionStorage.getItem("session_id");
console.log("Session ID:", sessionId);

// Session storage is cleared when the session ends
// (implementation-dependent in Andromeda)
```

## Practical Examples

### User Preferences Manager

```typescript
class UserPreferences {
  private static STORAGE_KEY = "user_preferences";

  static save(preferences: object): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
      console.log("✓ Preferences saved");
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }

  static load(): object | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to load preferences:", error);
      return null;
    }
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log("✓ Preferences cleared");
  }
}

// Usage
const preferences = {
  theme: "dark",
  language: "en",
  notifications: true,
  fontSize: 16,
};

UserPreferences.save(preferences);

// Later...
const loadedPrefs = UserPreferences.load();
console.log("User theme:", loadedPrefs?.theme);
```

### Application Cache Manager

```typescript
class CacheManager {
  private static PREFIX = "cache_";

  static set(key: string, data: any, ttl?: number): void {
    const item = {
      data: data,
      timestamp: Date.now(),
      ttl: ttl || null, // Time to live in milliseconds
    };

    localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
  }

  static get(key: string): any | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Check if item has expired
      if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Cache retrieval error:", error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    // Remove all cache items
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }

  static cleanup(): void {
    // Remove expired items
    const now = Date.now();
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key)!);
          if (item.ttl && now - item.timestamp > item.ttl) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    }
  }
}

// Usage
CacheManager.set("user_data", { id: 123, name: "John" }, 3600000); // 1 hour TTL
CacheManager.set("api_response", { status: "success", data: [] }, 300000); // 5 minutes TTL

// Retrieve cached data
const userData = CacheManager.get("user_data");
if (userData) {
  console.log("Cached user:", userData.name);
} else {
  console.log("User data not in cache or expired");
}

// Cleanup expired items
CacheManager.cleanup();
```

### Session State Manager

```typescript
class SessionState {
  private static readonly SESSION_KEY = "app_session";

  static saveState(state: object): void {
    sessionStorage.setItem(
      this.SESSION_KEY,
      JSON.stringify({
        ...state,
        lastUpdated: Date.now(),
      }),
    );
  }

  static getState(): object | null {
    const stateStr = sessionStorage.getItem(this.SESSION_KEY);
    return stateStr ? JSON.parse(stateStr) : null;
  }

  static updateState(updates: object): void {
    const currentState = this.getState() || {};
    this.saveState({ ...currentState, ...updates });
  }

  static clearState(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  static isStateValid(maxAge: number = 3600000): boolean {
    const state = this.getState() as any;
    if (!state || !state.lastUpdated) return false;

    return Date.now() - state.lastUpdated < maxAge;
  }
}

// Usage
SessionState.saveState({
  currentView: "dashboard",
  userId: 123,
  filters: { category: "electronics", priceRange: [10, 100] },
});

// Update specific parts of the state
SessionState.updateState({ currentView: "profile" });

// Check if session state is still valid (within 1 hour)
if (SessionState.isStateValid()) {
  const state = SessionState.getState();
  console.log("Current view:", state?.currentView);
}
```

### Storage Utilities

```typescript
class StorageUtils {
  // Get storage usage information
  static getStorageInfo(): { local: number; session: number } {
    return {
      local: localStorage.length,
      session: sessionStorage.length,
    };
  }

  // Export all localStorage data
  static exportLocalStorage(): object {
    const data: { [key: string]: string } = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key)!;
      }
    }

    return data;
  }

  // Import data to localStorage
  static importLocalStorage(data: { [key: string]: string }): void {
    for (const [key, value] of Object.entries(data)) {
      localStorage.setItem(key, value);
    }
  }

  // Find keys matching a pattern
  static findKeys(pattern: RegExp, storage: Storage = localStorage): string[] {
    const keys: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && pattern.test(key)) {
        keys.push(key);
      }
    }

    return keys;
  }

  // Bulk remove keys matching pattern
  static removeByPattern(
    pattern: RegExp,
    storage: Storage = localStorage,
  ): number {
    const keysToRemove = this.findKeys(pattern, storage);

    keysToRemove.forEach((key) => storage.removeItem(key));

    return keysToRemove.length;
  }

  // Storage size estimation (approximate)
  static estimateSize(storage: Storage = localStorage): number {
    let total = 0;

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) {
        const value = storage.getItem(key);
        total += key.length + (value?.length || 0);
      }
    }

    return total; // Size in characters
  }
}

// Usage examples
console.log("Storage info:", StorageUtils.getStorageInfo());
console.log("localStorage size:", StorageUtils.estimateSize(), "characters");

// Find all cache keys
const cacheKeys = StorageUtils.findKeys(/^cache_/);
console.log("Cache keys:", cacheKeys);

// Remove all temporary data
const removedCount = StorageUtils.removeByPattern(/^temp_/);
console.log(`Removed ${removedCount} temporary items`);

// Export/import localStorage
const backup = StorageUtils.exportLocalStorage();
// ... later ...
StorageUtils.importLocalStorage(backup);
```

## Error Handling

Web Storage operations can fail due to various reasons. Always handle errors
appropriately:

```typescript
function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error("localStorage.setItem failed:", error);
    return false;
  }
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error("localStorage.getItem failed:", error);
    return null;
  }
}

function safeParsedGet(key: string): any | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse stored data:", error);
    // Clean up corrupted data
    localStorage.removeItem(key);
    return null;
  }
}
```

## Storage Limits and Performance

### SQLite Backend

Andromeda's Web Storage is backed by SQLite, providing:

- **Reliability**: ACID transactions ensure data integrity
- **Performance**: Optimized for frequent read/write operations
- **Scalability**: Can handle large amounts of data efficiently
- **Persistence**: Data survives application restarts

### Best Practices

1. **Serialize Data Properly**: Always use `JSON.stringify()` and `JSON.parse()`
   for objects
2. **Handle Errors**: Wrap storage operations in try-catch blocks
3. **Avoid Large Values**: Store large data in files, keep storage for metadata
4. **Use Appropriate Storage**: Use `sessionStorage` for temporary data,
   `localStorage` for persistent data
5. **Clean Up**: Regularly remove outdated or unnecessary data

```typescript
// Good: Proper error handling and data serialization
function storeUserData(userData: object): boolean {
  try {
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Failed to store user data:", error);
    return false;
  }
}

// Good: Check before accessing
function getUserData(): object | null {
  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Invalid user data in storage");
    localStorage.removeItem("user"); // Clean up corrupted data
    return null;
  }
}
```

## Browser Compatibility

Andromeda's Web Storage API is designed to be fully compatible with browser
implementations:

- **Standard Interface**: Same methods and properties as browser
  `localStorage`/`sessionStorage`
- **Behavior Compatibility**: Handles edge cases the same way as browsers
- **Error Handling**: Throws the same types of exceptions as browser
  implementations
- **Data Types**: Stores everything as strings, just like browsers

This means existing web applications using Web Storage can run on Andromeda with
minimal or no modifications.

## Related APIs

- [SQLite API](/docs/api/sqlite) - Direct database access for complex storage
  needs
- [File System API](/docs/api/file-system) - File-based storage for large data
- [Fetch API](/docs/api/fetch) - Network requests that might use cached data
- [Console API](/docs/api/console) - Debugging storage operations
