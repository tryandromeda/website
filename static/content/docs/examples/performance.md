# Performance API Examples

The Performance API provides timing and performance measurement capabilities for
optimizing your Andromeda applications.

## Basic Timing

```typescript
// Measure execution time with performance.now()
const start = performance.now();

// Simulate some work
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += Math.sqrt(i);
}

const end = performance.now();
const duration = end - start;

console.log(`⚡ Calculated sum: ${sum.toFixed(2)}`);
console.log(`⏱️  Execution time: ${duration.toFixed(2)}ms`);
```

## Performance Marks and Measures

```typescript
// Using performance marks for complex operations
performance.mark("data-processing-start");

// Generate test data
const data = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
  category: `category-${i % 10}`,
}));

performance.mark("data-generation-complete");

// Process the data
const processed = data
  .filter((item) => item.value > 500)
  .map((item) => ({ ...item, processed: true }))
  .sort((a, b) => b.value - a.value);

performance.mark("data-processing-end");

// Create measures
performance.measure(
  "data-generation",
  "data-processing-start",
  "data-generation-complete",
);
performance.measure(
  "data-processing",
  "data-generation-complete",
  "data-processing-end",
);
performance.measure(
  "total-operation",
  "data-processing-start",
  "data-processing-end",
);

console.log(`📊 Processed ${processed.length} items from ${data.length} total`);

// Get performance entries
const entries = performance.getEntries();
console.log("📈 Performance entries:");
entries.forEach((entry) => {
  console.log(`   ${entry.name}: ${entry.duration.toFixed(2)}ms`);
});
```

## Benchmarking Functions

```typescript
async function benchmark<T>(
  name: string,
  fn: () => T | Promise<T>,
  iterations: number = 1000,
): Promise<{ average: number; min: number; max: number; total: number }> {
  const times: number[] = [];

  console.log(`🏃 Running benchmark: ${name} (${iterations} iterations)`);

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const total = times.reduce((sum, time) => sum + time, 0);
  const average = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`📈 Results for ${name}:`);
  console.log(`   Average: ${average.toFixed(3)}ms`);
  console.log(`   Min:     ${min.toFixed(3)}ms`);
  console.log(`   Max:     ${max.toFixed(3)}ms`);
  console.log(`   Total:   ${total.toFixed(3)}ms`);

  return { average, min, max, total };
}

// Benchmark different operations
await benchmark("Array creation", () => {
  return new Array(10000).fill(0).map((_, i) => i * 2);
});

await benchmark("Object manipulation", () => {
  const obj = { count: 0 };
  for (let i = 0; i < 1000; i++) {
    obj.count += i;
  }
  return obj;
});

await benchmark("String operations", () => {
  let result = "";
  for (let i = 0; i < 100; i++) {
    result += `item-${i}-`;
  }
  return result;
});
```

## Performance Monitoring Class

```typescript
class PerformanceMonitor {
  #measurements: Map<string, number[]> = new Map();

  startTimer(name: string): string {
    const markName = `${name}-start-${Date.now()}`;
    performance.mark(markName);
    return markName;
  }

  endTimer(startMarkName: string, operationName: string): number {
    const endMarkName = `${operationName}-end-${Date.now()}`;
    performance.mark(endMarkName);

    const measureName = `${operationName}-measure`;
    performance.measure(measureName, startMarkName, endMarkName);

    const entries = performance.getEntriesByName(measureName);
    const duration = entries[entries.length - 1].duration;

    // Store measurement
    if (!this.#measurements.has(operationName)) {
      this.#measurements.set(operationName, []);
    }
    this.#measurements.get(operationName)!.push(duration);

    return duration;
  }

  getStats(operationName: string) {
    const times = this.#measurements.get(operationName);
    if (!times || times.length === 0) {
      return null;
    }

    const total = times.reduce((sum, time) => sum + time, 0);
    const average = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    const median =
      [...times].sort((a, b) => a - b)[Math.floor(times.length / 2)];

    return {
      count: times.length,
      total: total.toFixed(3),
      average: average.toFixed(3),
      min: min.toFixed(3),
      max: max.toFixed(3),
      median: median.toFixed(3),
    };
  }

  getAllStats() {
    const stats: Record<string, any> = {};
    for (const [operation, _] of this.#measurements) {
      stats[operation] = this.getStats(operation);
    }
    return stats;
  }

  clear(operationName?: string) {
    if (operationName) {
      this.#measurements.delete(operationName);
      performance.clearMarks(`${operationName}-start`);
      performance.clearMarks(`${operationName}-end`);
      performance.clearMeasures(`${operationName}-measure`);
    } else {
      this.#measurements.clear();
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Usage example
const monitor = new PerformanceMonitor();

// Monitor database operations
const dbTimer = monitor.startTimer("database-query");
// Simulate database work
await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
monitor.endTimer(dbTimer, "database-query");

// Monitor API calls
const apiTimer = monitor.startTimer("api-call");
// Simulate API call
await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));
monitor.endTimer(apiTimer, "api-call");

// Get statistics
console.log("📊 Performance Statistics:");
console.log(monitor.getAllStats());
```

## Memory and Resource Monitoring

```typescript
class ResourceMonitor {
  #startTime: number;
  #checkpoints: Array<{ name: string; time: number; memory?: number }> = [];

  constructor() {
    this.#startTime = performance.now();
    this.checkpoint("initialization");
  }

  checkpoint(name: string): void {
    const currentTime = performance.now();
    this.#checkpoints.push({
      name,
      time: currentTime - this.#startTime,
    });
  }

  getResourceUsage(): Array<
    { name: string; timeFromStart: string; timeDiff: string }
  > {
    return this.#checkpoints.map((checkpoint, index) => {
      const timeDiff = index > 0
        ? (checkpoint.time - this.#checkpoints[index - 1].time).toFixed(2)
        : "0.00";

      return {
        name: checkpoint.name,
        timeFromStart: checkpoint.time.toFixed(2) + "ms",
        timeDiff: timeDiff + "ms",
      };
    });
  }

  report(): void {
    console.log("🔍 Resource Usage Report:");
    console.log("=".repeat(50));

    const usage = this.getResourceUsage();
    usage.forEach((item) => {
      console.log(`📌 ${item.name}:`);
      console.log(`   Time from start: ${item.timeFromStart}`);
      console.log(`   Time diff: ${item.timeDiff}`);
    });

    console.log("=".repeat(50));
    console.log(
      `⏱️  Total runtime: ${
        (performance.now() - this.#startTime).toFixed(2)
      }ms`,
    );
  }
}

// Usage example
const resourceMonitor = new ResourceMonitor();

// Simulate some work
for (let i = 0; i < 5; i++) {
  // Some computational work
  const result = Array.from({ length: 10000 }, (_, j) => j * i).reduce(
    (a, b) => a + b,
    0,
  );
  resourceMonitor.checkpoint(`computation-${i + 1}`);
}

resourceMonitor.report();
```

## Performance Best Practices

```typescript
// Example of optimizing code using performance measurements
function optimizeOperation() {
  console.log("🎯 Performance Optimization Example");

  // Test different approaches
  const testData = Array.from({ length: 100000 }, (_, i) => i);

  // Approach 1: Traditional for loop
  performance.mark("for-loop-start");
  let sum1 = 0;
  for (let i = 0; i < testData.length; i++) {
    sum1 += testData[i];
  }
  performance.mark("for-loop-end");
  performance.measure("for-loop", "for-loop-start", "for-loop-end");

  // Approach 2: Array.reduce
  performance.mark("reduce-start");
  const sum2 = testData.reduce((acc, val) => acc + val, 0);
  performance.mark("reduce-end");
  performance.measure("reduce", "reduce-start", "reduce-end");

  // Approach 3: for...of loop
  performance.mark("for-of-start");
  let sum3 = 0;
  for (const value of testData) {
    sum3 += value;
  }
  performance.mark("for-of-end");
  performance.measure("for-of", "for-of-start", "for-of-end");

  // Compare results
  const measures = performance.getEntriesByType("measure");
  console.log("🏁 Performance Comparison:");
  measures.slice(-3).forEach((measure) => {
    console.log(`   ${measure.name}: ${measure.duration.toFixed(3)}ms`);
  });

  // All sums should be equal
  console.log(`✅ Results match: ${sum1 === sum2 && sum2 === sum3}`);
}

optimizeOperation();
```

## Run the Examples

Save any of these examples as `.ts` files and run them:

```bash
andromeda run performance-example.ts
```

The Performance API helps you identify bottlenecks and optimize your Andromeda
applications for better performance!
