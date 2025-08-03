---
title: "Time API"
description: "Date, time, and timing utilities"
section: "API Reference"
order: 17
id: "time-api"
---

The Time API provides functionality for working with timers, intervals, and
asynchronous time-based operations. It includes both immediate timing functions
and scheduled execution capabilities.

## Overview

The Time API in Andromeda provides standard timer functions similar to those
found in browsers and Node.js, allowing you to delay execution, schedule
repeated tasks, and work with time measurements.

## Sleep Function

### `sleep(ms)`

Pauses execution for the specified number of milliseconds.

**Parameters:**

- `ms` - Number of milliseconds to sleep

**Returns:** `Promise<void>` - A promise that resolves after the specified delay

**Example:**

```typescript
console.log("Starting...");
await sleep(1000); // Wait 1 second
console.log("Done waiting!");

// Use in loops
for (let i = 0; i < 5; i++) {
  console.log(`Count: ${i}`);
  await sleep(500); // Wait 500ms between counts
}
```

## Timeout Functions

### `setTimeout(callback, delay, ...args)`

Executes a function after a specified delay.

**Parameters:**

- `callback` - The function to execute
- `delay` - Delay in milliseconds
- `...args` - Optional arguments to pass to the callback

**Returns:** `number` - Timer ID that can be used with `clearTimeout()`

**Example:**

```typescript
// Basic timeout
const timerId = setTimeout(() => {
  console.log("This runs after 2 seconds");
}, 2000);

// Timeout with arguments
setTimeout(
  (name, age) => {
    console.log(`Hello ${name}, you are ${age} years old`);
  },
  1000,
  "Alice",
  30,
);

// Cancel a timeout
clearTimeout(timerId);
```

### `clearTimeout(id)`

Cancels a timeout created with `setTimeout()`.

**Parameters:**

- `id` - The timer ID returned by `setTimeout()`

**Example:**

```typescript
const timer = setTimeout(() => {
  console.log("This will not run");
}, 5000);

// Cancel the timeout
clearTimeout(timer);
```

## Interval Functions

### `setInterval(callback, delay, ...args)`

Repeatedly executes a function with a fixed time delay between calls.

**Parameters:**

- `callback` - The function to execute
- `delay` - Delay in milliseconds between executions
- `...args` - Optional arguments to pass to the callback

**Returns:** `number` - Interval ID that can be used with `clearInterval()`

**Example:**

```typescript
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Tick: ${count}`);

  if (count >= 5) {
    clearInterval(intervalId);
    console.log("Interval stopped");
  }
}, 1000);

// Interval with arguments
setInterval(
  (message) => {
    console.log(message);
  },
  2000,
  "Periodic message",
);
```

### `clearInterval(id)`

Cancels an interval created with `setInterval()`.

**Parameters:**

- `id` - The interval ID returned by `setInterval()`

**Example:**

```typescript
const interval = setInterval(() => {
  console.log("This will stop after 10 seconds");
}, 1000);

// Stop the interval after 10 seconds
setTimeout(() => {
  clearInterval(interval);
  console.log("Interval cleared");
}, 10000);
```

## Usage Patterns

### Delayed Execution

```typescript
async function delayedTask(): Promise<void> {
  console.log("Starting task...");

  await sleep(1000);
  console.log("Step 1 complete");

  await sleep(2000);
  console.log("Step 2 complete");

  await sleep(500);
  console.log("Task finished!");
}

await delayedTask();
```

### Periodic Tasks

```typescript
class PeriodicTask {
  private intervalId?: number;
  private isRunning = false;

  start(task: () => void, intervalMs: number): void {
    if (this.isRunning) {
      throw new Error("Task is already running");
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      try {
        task();
      } catch (error) {
        console.error("Periodic task error:", error);
        this.stop();
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.isRunning = false;
    }
  }

  get running(): boolean {
    return this.isRunning;
  }
}

// Usage
const task = new PeriodicTask();
task.start(() => {
  console.log("Heartbeat:", new Date().toISOString());
}, 5000);

// Stop after 30 seconds
setTimeout(() => {
  task.stop();
  console.log("Stopped heartbeat");
}, 30000);
```

### Timeout with Promise

```typescript
function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
}

// Usage
async function fetchWithTimeout(): Promise<void> {
  try {
    const data = await timeout(
      fetch("https://api.example.com/data"),
      5000,
    );
    console.log("Data received:", data);
  } catch (error) {
    console.error("Request failed or timed out:", error.message);
  }
}
```

### Debouncing

```typescript
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Usage
const debouncedLog = debounce((message: string) => {
  console.log("Debounced:", message);
}, 1000);

// Only the last call will execute after 1 second
debouncedLog("Call 1");
debouncedLog("Call 2");
debouncedLog("Call 3");
```

### Throttling

```typescript
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: number | undefined;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = undefined;
      }, delay - (now - lastCall));
    }
  };
}

// Usage
const throttledLog = throttle((message: string) => {
  console.log("Throttled:", message);
}, 1000);

// Will execute immediately, then at most once per second
for (let i = 0; i < 10; i++) {
  throttledLog(`Message ${i}`);
}
```

## Advanced Timing Utilities

### Retry with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError!;
}

// Usage
const result = await retryWithBackoff(
  async () => {
    // Simulate unreliable operation
    if (Math.random() < 0.7) {
      throw new Error("Random failure");
    }
    return "Success!";
  },
  3,
  500,
);
```

### Timer Manager

```typescript
class TimerManager {
  private timers = new Set<number>();
  private intervals = new Set<number>();

  setTimeout(callback: () => void, delay: number): number {
    const id = setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);
    this.timers.add(id);
    return id;
  }

  setInterval(callback: () => void, delay: number): number {
    const id = setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  clearTimeout(id: number): void {
    if (this.timers.has(id)) {
      clearTimeout(id);
      this.timers.delete(id);
    }
  }

  clearInterval(id: number): void {
    if (this.intervals.has(id)) {
      clearInterval(id);
      this.intervals.delete(id);
    }
  }

  clearAll(): void {
    for (const id of this.timers) {
      clearTimeout(id);
    }
    for (const id of this.intervals) {
      clearInterval(id);
    }
    this.timers.clear();
    this.intervals.clear();
  }

  get activeCount(): number {
    return this.timers.size + this.intervals.size;
  }
}

// Usage
const timerManager = new TimerManager();

// Use managed timers
timerManager.setTimeout(() => console.log("Timer 1"), 1000);
timerManager.setTimeout(() => console.log("Timer 2"), 2000);
const intervalId = timerManager.setInterval(() => console.log("Interval"), 500);

// Clean up all timers at once
setTimeout(() => {
  timerManager.clearAll();
  console.log("All timers cleared");
}, 5000);
```

### Timing Measurements

```typescript
class Timer {
  private startTime = 0;
  private endTime = 0;
  private isRunning = false;

  start(): void {
    this.startTime = performance.now();
    this.isRunning = true;
  }

  stop(): number {
    if (!this.isRunning) {
      throw new Error("Timer is not running");
    }

    this.endTime = performance.now();
    this.isRunning = false;
    return this.elapsed;
  }

  get elapsed(): number {
    if (this.isRunning) {
      return performance.now() - this.startTime;
    }
    return this.endTime - this.startTime;
  }

  reset(): void {
    this.startTime = 0;
    this.endTime = 0;
    this.isRunning = false;
  }
}

// Usage
const timer = new Timer();
timer.start();

await sleep(1000);
console.log("Elapsed so far:", timer.elapsed);

await sleep(500);
const totalTime = timer.stop();
console.log("Total time:", totalTime);
```

## Error Handling

```typescript
// Handle timer errors gracefully
function safeSetTimeout(callback: () => void, delay: number): number | null {
  try {
    return setTimeout(() => {
      try {
        callback();
      } catch (error) {
        console.error("Timer callback error:", error);
      }
    }, delay);
  } catch (error) {
    console.error("Failed to set timeout:", error);
    return null;
  }
}

// Cleanup on application exit
const activeTimers = new Set<number>();

function managedSetTimeout(callback: () => void, delay: number): number {
  const id = setTimeout(() => {
    activeTimers.delete(id);
    callback();
  }, delay);
  activeTimers.add(id);
  return id;
}

// Clean up on exit (if supported)
function cleanup(): void {
  for (const id of activeTimers) {
    clearTimeout(id);
  }
  activeTimers.clear();
}
```

## Best Practices

1. **Always clear timers**: Clear timeouts and intervals when they're no longer
   needed

2. **Handle errors**: Wrap timer callbacks in try-catch blocks

3. **Use sleep for delays**: Prefer `sleep()` over `setTimeout()` for simple
   delays in async functions

4. **Avoid excessive intervals**: Be mindful of performance with short intervals

5. **Use timer managers**: For complex applications, use timer management
   utilities

## See Also

- [Performance API](/docs/api/performance) - For high-resolution timing
  measurements
- [Console API](/docs/api/console) - For logging timed operations
- [Process API](/docs/api/process) - For process-related timing
