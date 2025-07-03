# Web Storage Examples

Web Storage provides persistent client-side storage with localStorage and
temporary storage with sessionStorage.

## localStorage Examples

```typescript
// Store different types of data
localStorage.setItem("username", "alice");
localStorage.setItem("theme", "dark");
localStorage.setItem("fontSize", "16");

// Retrieve data
const username = localStorage.getItem("username");
const theme = localStorage.getItem("theme");
const fontSize = localStorage.getItem("fontSize");

console.log("Retrieved data:");
console.log(`   Username: ${username}`);
console.log(`   Theme: ${theme}`);
console.log(`   Font size: ${fontSize}`);

// Check storage length
console.log(`📊 Storage contains ${localStorage.length} items`);

// List all keys
console.log("🔑 All keys:");
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`   ${i}: ${key}`);
}
```

## sessionStorage Examples

```typescript
// Store session data
sessionStorage.setItem("sessionId", crypto.randomUUID());
sessionStorage.setItem("startTime", Date.now().toString());
sessionStorage.setItem("pageViews", "1");

// Retrieve session data
const sessionId = sessionStorage.getItem("sessionId");
const startTime = sessionStorage.getItem("startTime");
const pageViews = sessionStorage.getItem("pageViews");

console.log("Session data:");
console.log(`   Session ID: ${sessionId}`);
console.log(
  `   Start time: ${new Date(parseInt(startTime || "0")).toISOString()}`,
);
console.log(`   Page views: ${pageViews}`);
```

## Storing Complex Data

```typescript
// Store and retrieve objects using JSON
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: {
    notifications: boolean;
    language: string;
    theme: "light" | "dark";
  };
  lastLogin: string;
}

const userProfile: UserProfile = {
  id: crypto.randomUUID(),
  name: "John Doe",
  email: "john@example.com",
  preferences: {
    notifications: true,
    language: "en",
    theme: "dark",
  },
  lastLogin: new Date().toISOString(),
};

// Store object as JSON
localStorage.setItem("userProfile", JSON.stringify(userProfile));

// Retrieve and parse object
const storedProfile = localStorage.getItem("userProfile");
if (storedProfile) {
  const parsedProfile: UserProfile = JSON.parse(storedProfile);
  console.log("👤 User Profile:");
  console.log(`   Name: ${parsedProfile.name}`);
  console.log(`   Email: ${parsedProfile.email}`);
  console.log(`   Theme: ${parsedProfile.preferences.theme}`);
  console.log(`   Last login: ${parsedProfile.lastLogin}`);
}
```

## Storage Manager Class

```typescript
class StorageManager {
  #storageType: Storage;

  constructor(type: "local" | "session" = "local") {
    this.#storageType = type === "local" ? localStorage : sessionStorage;
  }

  // Set with automatic JSON serialization
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = typeof value === "string"
        ? value
        : JSON.stringify(value);
      this.#storageType.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      return false;
    }
  }

  // Get with automatic JSON parsing
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.#storageType.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }

      // Try to parse as JSON, fall back to string
      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return defaultValue || null;
    }
  }

  // Remove item
  remove(key: string): boolean {
    try {
      this.#storageType.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  }

  // Clear all items
  clear(): boolean {
    try {
      this.#storageType.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear storage:", error);
      return false;
    }
  }

  // Check if key exists
  has(key: string): boolean {
    return this.#storageType.getItem(key) !== null;
  }

  // Get all keys
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.#storageType.length; i++) {
      const key = this.#storageType.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }

  // Get storage size
  size(): number {
    return this.#storageType.length;
  }

  // Get all items as object
  getAll(): Record<string, any> {
    const items: Record<string, any> = {};
    this.keys().forEach((key) => {
      items[key] = this.get(key);
    });
    return items;
  }
}

// Usage examples
const storage = new StorageManager("local");

// Store various data types
storage.set("simpleString", "Hello World");
storage.set("number", 42);
storage.set("boolean", true);
storage.set("array", [1, 2, 3, 4, 5]);
storage.set("object", { name: "Test", active: true });

console.log("🗄️  Storage Manager Examples:");
console.log("   String:", storage.get("simpleString"));
console.log("   Number:", storage.get("number"));
console.log("   Boolean:", storage.get("boolean"));
console.log("   Array:", storage.get("array"));
console.log("   Object:", storage.get("object"));

console.log(`📊 Total items: ${storage.size()}`);
console.log("🔑 All keys:", storage.keys());
```

## Settings Management System

```typescript
interface AppSettings {
  theme: "light" | "dark" | "auto";
  language: string;
  fontSize: number;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  autoSave: boolean;
  version: string;
}

class SettingsManager {
  static readonly #SETTINGS_KEY = "app-settings";
  static readonly #DEFAULT_SETTINGS: AppSettings = {
    theme: "auto",
    language: "en",
    fontSize: 14,
    notifications: {
      email: true,
      push: true,
      sound: false,
    },
    autoSave: true,
    version: "1.0.0",
  };

  #settings: AppSettings;

  constructor() {
    this.#settings = this.#loadSettings();
  }

  #loadSettings(): AppSettings {
    const stored = localStorage.getItem(SettingsManager.#SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle missing properties
        return { ...SettingsManager.#DEFAULT_SETTINGS, ...parsed };
      } catch (error) {
        console.warn("Failed to parse stored settings, using defaults");
      }
    }
    return { ...SettingsManager.#DEFAULT_SETTINGS };
  }

  #saveSettings(): void {
    try {
      localStorage.setItem(
        SettingsManager.#SETTINGS_KEY,
        JSON.stringify(this.#settings),
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  // Get current settings
  getAll(): AppSettings {
    return { ...this.#settings };
  }

  // Get specific setting
  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.#settings[key];
  }

  // Update specific setting
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.#settings[key] = value;
    this.#saveSettings();
  }

  // Update multiple settings
  update(updates: Partial<AppSettings>): void {
    this.#settings = { ...this.#settings, ...updates };
    this.#saveSettings();
  }

  // Reset to defaults
  reset(): void {
    this.#settings = { ...SettingsManager.#DEFAULT_SETTINGS };
    this.#saveSettings();
  }

  // Export settings
  export(): string {
    return JSON.stringify(this.#settings, null, 2);
  }

  // Import settings
  import(settingsJson: string): boolean {
    try {
      const imported = JSON.parse(settingsJson);
      this.#settings = { ...SettingsManager.#DEFAULT_SETTINGS, ...imported };
      this.#saveSettings();
      return true;
    } catch (error) {
      console.error("Failed to import settings:", error);
      return false;
    }
  }
}

// Usage example
const settings = new SettingsManager();

console.log("⚙️  Settings Management Example:");
console.log("Current theme:", settings.get("theme"));
console.log("Current font size:", settings.get("fontSize"));

// Update individual setting
settings.set("theme", "dark");
settings.set("fontSize", 16);

// Update multiple settings
settings.update({
  language: "es",
  notifications: {
    email: false,
    push: true,
    sound: true,
  },
});

console.log("Updated settings:", settings.getAll());
```

## Cache with Expiration

```typescript
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ExpiringCache {
  static readonly #CACHE_PREFIX = "cache:";

  // Set item with expiration time (in milliseconds)
  set<T>(key: string, data: T, ttl: number): void {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    localStorage.setItem(
      ExpiringCache.#CACHE_PREFIX + key,
      JSON.stringify(item),
    );
  }

  // Get item if not expired
  get<T>(key: string): T | null {
    const stored = localStorage.getItem(ExpiringCache.#CACHE_PREFIX + key);
    if (!stored) return null;

    try {
      const item: CacheItem<T> = JSON.parse(stored);
      const now = Date.now();

      if (now > item.expiresAt) {
        // Item expired, remove it
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error("Failed to parse cache item:", error);
      this.remove(key);
      return null;
    }
  }

  // Remove item
  remove(key: string): void {
    localStorage.removeItem(ExpiringCache.#CACHE_PREFIX + key);
  }

  // Clear all cache items
  clearAll(): void {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ExpiringCache.#CACHE_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  }

  // Clean up expired items
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ExpiringCache.#CACHE_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const item = JSON.parse(stored);
            if (now > item.expiresAt) {
              localStorage.removeItem(key);
              removedCount++;
            }
          } catch {
            localStorage.removeItem(key);
            removedCount++;
          }
        }
      }
    }

    return removedCount;
  }
}

// Usage example
const cache = new ExpiringCache();

// Cache data for 5 seconds
cache.set("user-data", { name: "Alice", id: 123 }, 5000);
cache.set("api-response", { status: "success", data: [1, 2, 3] }, 10000);

console.log("💾 Cache Example:");
console.log("Cached user:", cache.get("user-data"));
console.log("Cached API response:", cache.get("api-response"));

// Wait and check expiration
setTimeout(() => {
  console.log("After 6 seconds:");
  console.log("User data (expired):", cache.get("user-data"));
  console.log("API response (still valid):", cache.get("api-response"));

  console.log(`🧹 Cleaned up ${cache.cleanup()} expired items`);
}, 6000);
```

## Run the Examples

Save any of these examples as `.ts` files and run them:

```bash
andromeda run storage-example.ts
```

Web Storage provides powerful client-side data persistence for building
responsive applications that work offline!
