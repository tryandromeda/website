---
title: "Web Locks API"
description: "Coordinate access to shared resources using Web Locks with navigator.locks"
section: "API Reference"
order: 22
id: "web-locks-api"
---

The Web Locks API provides a way to coordinate access to shared resources between different execution contexts. It allows you to acquire locks with specific names and run code while holding those locks, ensuring that only the allowed number of contexts can access a shared resource at once.

## Overview

The Web Locks API in Andromeda provides:

- **Exclusive locks** - Only one holder at a time
- **Shared locks** - Multiple holders allowed simultaneously  
- **Lock queuing** - Automatic queuing and processing of lock requests
- **Timeout and abortion** - Support for AbortSignal to cancel lock requests
- **Lock introspection** - Query current lock state with held and pending locks

## Basic Usage

### Accessing the Lock Manager

The Lock Manager is available through the navigator object:

```typescript
// Access the lock manager
const lockManager = navigator.locks;

// Request an exclusive lock
await navigator.locks.request('resource-name', async (lock) => {
  if (lock === null) {
    console.log('Lock not available');
    return;
  }
  
  // Work with the shared resource
  console.log(`Acquired lock: ${lock.name} in ${lock.mode} mode`);
  await doSharedWork();
});
```

### Lock Modes

```typescript
// Exclusive lock (default) - only one holder allowed
await navigator.locks.request('exclusive-resource', async (lock) => {
  // Only this callback will run at a time
  await processExclusiveResource();
});

// Shared lock - multiple holders allowed
await navigator.locks.request('shared-resource', async (lock) => {
  // Multiple callbacks can run simultaneously
  await readSharedData();
}, { mode: 'shared' });
```

## API Reference

### `navigator.locks`

The `LockManager` interface provides methods for requesting locks and querying lock state.

#### `request(name, callback, options?)`

Request a lock and execute a callback while holding it.

**Parameters:**

- `name` (string): The name of the lock to request
- `callback` (function): The function to execute while holding the lock
- `options` (object, optional): Options for the lock request

**Options:**

- `mode` ('exclusive' | 'shared'): Lock mode (default: 'exclusive')
- `ifAvailable` (boolean): If true, don't wait if lock unavailable (default: false)
- `steal` (boolean): If true, steal existing locks with same name (default: false)
- `signal` (AbortSignal): Signal to abort the lock request

**Returns:** Promise that resolves to the return value of the callback

**Examples:**

```typescript
// Basic exclusive lock
const result = await navigator.locks.request('data-processor', async (lock) => {
  if (!lock) return null;
  
  return await processData();
});

// Shared lock with multiple readers
await navigator.locks.request('config-reader', async (lock) => {
  if (!lock) return;
  
  const config = await readConfiguration();
  console.log('Config loaded:', config);
}, { mode: 'shared' });

// Lock with timeout using AbortSignal
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // 5 second timeout

try {
  await navigator.locks.request('timed-resource', async (lock) => {
    if (!lock) return;
    
    await longRunningOperation();
  }, { signal: controller.signal });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Lock request timed out');
  }
}

// Non-blocking lock request
await navigator.locks.request('maybe-available', async (lock) => {
  if (lock === null) {
    console.log('Resource is busy, skipping');
    return;
  }
  
  await useResource();
}, { ifAvailable: true });
```

#### `query()`

Query the current state of all locks.

**Returns:** Promise resolving to `LockManagerSnapshot` with information about held and pending locks

**Example:**

```typescript
const snapshot = await navigator.locks.query();

console.log('Currently held locks:');
snapshot.held.forEach(lock => {
  console.log(`- ${lock.name} (${lock.mode})`);
});

console.log('Pending lock requests:');
snapshot.pending.forEach(lock => {
  console.log(`- ${lock.name} (${lock.mode})`);
});
```

## Types and Interfaces

### `LockManager`

The main interface for managing locks.

```typescript
interface LockManager {
  request(
    name: string,
    callback: (lock: Lock | null) => unknown,
    options?: LockOptions
  ): Promise<unknown>;
  
  query(): Promise<LockManagerSnapshot>;
}
```

### `LockOptions`

Options for lock requests.

```typescript
interface LockOptions {
  mode?: 'exclusive' | 'shared';
  ifAvailable?: boolean;
  steal?: boolean;
  signal?: AbortSignal;
}
```

### `Lock`

Represents a granted lock.

```typescript
interface Lock {
  readonly name: string;
  readonly mode: 'exclusive' | 'shared';
}
```

### `LockManagerSnapshot`

Result of a query operation.

```typescript
interface LockManagerSnapshot {
  held: LockInfo[];
  pending: LockInfo[];
}

interface LockInfo {
  name: string;
  mode: 'exclusive' | 'shared';
  clientId?: string;
}
```

## Advanced Usage

### Lock Coordination Patterns

```typescript
// Producer-Consumer pattern with shared and exclusive locks
class DataStore {
  private lockName = 'datastore-access';
  
  // Multiple readers allowed
  async read() {
    return navigator.locks.request(this.lockName, async (lock) => {
      if (!lock) throw new Error('Could not acquire read lock');
      
      return await this.performRead();
    }, { mode: 'shared' });
  }
  
  // Exclusive writer
  async write(data) {
    return navigator.locks.request(this.lockName, async (lock) => {
      if (!lock) throw new Error('Could not acquire write lock');
      
      await this.performWrite(data);
    }, { mode: 'exclusive' });
  }
}

// Critical section protection
async function criticalSection() {
  await navigator.locks.request('critical-work', async (lock) => {
    if (!lock) return;
    
    // Only one instance of this code runs at a time
    await updateSharedState();
    await validateConsistency();
  });
}

// Resource cleanup with guaranteed execution
async function updateWithCleanup() {
  let acquired = false;
  
  try {
    await navigator.locks.request('resource-with-cleanup', async (lock) => {
      if (!lock) return;
      
      acquired = true;
      await performUpdate();
      
      // Any error here will still trigger cleanup in finally
    });
  } finally {
    if (acquired) {
      await cleanup();
    }
  }
}
```

### Error Handling

```typescript
// Handle different error scenarios
async function robustLockUsage() {
  try {
    await navigator.locks.request('error-prone-resource', async (lock) => {
      if (lock === null) {
        // Lock was not available (ifAvailable: true)
        throw new Error('Resource temporarily unavailable');
      }
      
      // Potential errors during lock holding
      await riskyOperation();
      
    }, { signal: createTimeoutSignal(10000) });
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Lock request was aborted');
    } else if (error.name === 'NotSupportedError') {
      console.log('Invalid lock options');
    } else {
      console.log('Operation failed:', error.message);
    }
  }
}

function createTimeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}
```

## Best Practices

### Lock Naming

- Use descriptive, hierarchical names: `'user-data-123'`, `'cache-region-west'`
- Avoid names starting with `'-'` (reserved)
- Consider using consistent naming conventions across your application

### Lock Granularity

- **Fine-grained locks**: Better concurrency but more complex coordination
- **Coarse-grained locks**: Simpler but potentially less concurrent

```typescript
// Fine-grained: separate locks per user
async function updateUser(userId: string) {
  await navigator.locks.request(`user-${userId}`, async (lock) => {
    // Only blocks other operations on this specific user
  });
}

// Coarse-grained: single lock for all user operations  
async function updateAnyUser(userId: string) {
  await navigator.locks.request('all-users', async (lock) => {
    // Blocks all user operations
  });
}
```

### Performance Considerations

- Keep lock hold times as short as possible
- Use shared locks for read-only operations
- Consider `ifAvailable` for non-critical operations
- Use AbortSignal for timeouts to prevent deadlocks

## Compatibility

The Web Locks API follows the [W3C Web Locks API specification](https://w3c.github.io/web-locks/) and provides the same interface available in modern browsers. This ensures your code can work across different environments with minimal changes.

## See Also

- [Web APIs](/docs/api/web) - Other web standard APIs
- [Process API](/docs/api/process) - Process control and environment access
- [Time API](/docs/api/time) - Timing utilities for lock timeouts