# Performance API

The Performance API provides high-resolution timing capabilities for measuring code execution time and creating performance benchmarks. It follows the Web Performance API standards.

## Overview

The `performance` global object provides methods for measuring time with microsecond precision, creating performance marks and measures, and monitoring application performance.

## Methods

### `performance.now()`

Returns a high-resolution timestamp representing the current time.

**Returns:** `number` - Time in milliseconds with microsecond precision

**Example:**

```typescript
const start = performance.now();
// Some operation
doSomethingExpensive();
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);
```

### `performance.mark(name)`

Creates a performance mark with the given name at the current time.

**Parameters:**

- `name` - A string name for the mark

**Example:**

```typescript
performance.mark("operation-start");
doSomething();
performance.mark("operation-end");
```

### `performance.measure(name, startMark?, endMark?)`

Creates a performance measure between two marks or times.

**Parameters:**

- `name` - A string name for the measure
- `startMark` (optional) - The name of the start mark, or omit to use navigation start
- `endMark` (optional) - The name of the end mark, or omit to use current time

**Example:**

```typescript
performance.mark("process-start");
processData();
performance.mark("process-end");
performance.measure("data-processing", "process-start", "process-end");
```

### `performance.getEntries()`

Returns all performance entries (marks and measures).

**Returns:** `PerformanceEntry[]` - Array of all performance entries

**Example:**

```typescript
const entries = performance.getEntries();
entries.forEach(entry => {
    console.log(`${entry.name}: ${entry.duration}ms`);
});
```

### `performance.getEntriesByName(name)`

Returns performance entries with the specified name.

**Parameters:**

- `name` - The name of the entries to retrieve

**Returns:** `PerformanceEntry[]` - Array of matching performance entries

**Example:**

```typescript
performance.measure("my-operation", "start", "end");
const measures = performance.getEntriesByName("my-operation");
console.log(`Operation duration: ${measures[0].duration}ms`);
```

### `performance.getEntriesByType(type)`

Returns performance entries of the specified type.

**Parameters:**

- `type` - The type of entries ("mark", "measure", etc.)

**Returns:** `PerformanceEntry[]` - Array of matching performance entries

**Example:**

```typescript
const marks = performance.getEntriesByType("mark");
const measures = performance.getEntriesByType("measure");
```

### `performance.clearMarks(name?)`

Clears performance marks.

**Parameters:**

- `name` (optional) - Name of specific mark to clear, or omit to clear all marks

**Example:**

```typescript
performance.clearMarks("my-mark"); // Clear specific mark
performance.clearMarks(); // Clear all marks
```

### `performance.clearMeasures(name?)`

Clears performance measures.

**Parameters:**

- `name` (optional) - Name of specific measure to clear, or omit to clear all measures

**Example:**

```typescript
performance.clearMeasures("my-measure"); // Clear specific measure
performance.clearMeasures(); // Clear all measures
```

## Performance Entry Objects

Performance entries have the following properties:

- `name` - The name of the entry
- `entryType` - The type ("mark" or "measure")
- `startTime` - When the entry was created (for marks) or started (for measures)
- `duration` - Duration in milliseconds (0 for marks, calculated for measures)

## Usage Patterns

### Simple Timing

```typescript
function measureFunction<T>(fn: () => T, name: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
    return result;
}

const result = measureFunction(() => {
    // Some expensive operation
    return complexCalculation();
}, "Complex Calculation");
```

### Using Marks and Measures

```typescript
function benchmarkWithMarks<T>(fn: () => T, name: string): T {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${measure.name}: ${measure.duration.toFixed(2)}ms`);
    
    return result;
}
```

### Multiple Operations Timing

```typescript
async function benchmarkOperations() {
    const operations = [
        () => sortArray([...largeArray]),
        () => searchArray(largeArray, target),
        () => filterArray(largeArray, predicate)
    ];
    
    for (let i = 0; i < operations.length; i++) {
        performance.mark(`op-${i}-start`);
        await operations[i]();
        performance.mark(`op-${i}-end`);
        performance.measure(`operation-${i}`, `op-${i}-start`, `op-${i}-end`);
    }
    
    // Print results
    performance.getEntriesByType("measure").forEach(measure => {
        console.log(`${measure.name}: ${measure.duration.toFixed(2)}ms`);
    });
}
```

### Performance Monitoring

```typescript
class PerformanceMonitor {
    private measurements: Map<string, number[]> = new Map();
    
    time<T>(operation: () => T, name: string): T {
        const start = performance.now();
        const result = operation();
        const duration = performance.now() - start;
        
        if (!this.measurements.has(name)) {
            this.measurements.set(name, []);
        }
        this.measurements.get(name)!.push(duration);
        
        return result;
    }
    
    getStats(name: string) {
        const times = this.measurements.get(name) || [];
        if (times.length === 0) return null;
        
        const avg = times.reduce((a, b) => a + b) / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);
        
        return { avg, min, max, count: times.length };
    }
}

const monitor = new PerformanceMonitor();
```

## High-Resolution Timing

The performance API provides high-resolution timing with microsecond precision:

```typescript
const start = performance.now();
// Even very fast operations can be measured
const value = Math.sqrt(42);
const end = performance.now();

console.log(`Math.sqrt took ${(end - start).toFixed(6)}ms`);
// Output might be: Math.sqrt took 0.002500ms
```

## Best Practices

1. **Clean up entries**: Use `clearMarks()` and `clearMeasures()` to prevent memory leaks

2. **Use meaningful names**: Choose descriptive names for marks and measures

3. **Batch measurements**: For repeated operations, collect multiple measurements and calculate statistics

4. **Avoid overhead**: Don't measure trivial operations excessively in production

## Related Examples

- See `examples/performance.ts` for comprehensive performance measurement examples
- See `examples/main.ts` for performance monitoring in applications

## See Also

- [Time API](./time) - For timers and time-based operations
- [Console API](./console) - For logging performance results
