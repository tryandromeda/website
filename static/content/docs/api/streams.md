---
title: "Streams API"
description: "Web-standard Streams API for processing streaming data"
section: "API Reference"
order: 17
id: "streams-api"
---

The Streams API provides a web-standard interface for reading, writing, and transforming streaming data. It enables efficient processing of large datasets and real-time data without loading everything into memory.

## Overview

The Streams API in Andromeda allows you to:

- Create and consume readable streams
- Write data to writable streams
- Transform data with transform streams
- Handle backpressure and flow control
- Process data in chunks for memory efficiency

## Stream Types

### ReadableStream

A source of data that can be read in chunks.

### WritableStream

A destination for data that can be written in chunks.

### TransformStream

Transforms data as it flows from a readable stream to a writable stream.

## Basic Usage

### Creating a ReadableStream

```typescript
// Create a simple readable stream
const readableStream = new ReadableStream({
  start(controller) {
    // Called immediately when the stream is created
    console.log("Stream started");
  },
  
  pull(controller) {
    // Called when the stream needs more data
    const chunk = generateData();
    if (chunk) {
      controller.enqueue(chunk);
    } else {
      controller.close();
    }
  },
  
  cancel(reason) {
    // Called when the stream is cancelled
    console.log("Stream cancelled:", reason);
  }
});
```

### Reading from a Stream

```typescript
const reader = readableStream.getReader();

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log("Stream finished");
      break;
    }
    console.log("Received chunk:", value);
  }
} finally {
  reader.releaseLock();
}
```

### Creating a WritableStream

```typescript
const writableStream = new WritableStream({
  start(controller) {
    console.log("Writable stream started");
  },
  
  write(chunk, controller) {
    console.log("Writing chunk:", chunk);
    // Process the chunk (save to file, send over network, etc.)
    return processChunk(chunk);
  },
  
  close() {
    console.log("Stream closed");
  },
  
  abort(reason) {
    console.log("Stream aborted:", reason);
  }
});
```

### Writing to a Stream

```typescript
const writer = writableStream.getWriter();

try {
  await writer.write("Hello, ");
  await writer.write("World!");
  await writer.close();
} finally {
  writer.releaseLock();
}
```

## API Reference

### ReadableStream Class

#### ReadableStream Constructor

```typescript
new ReadableStream(underlyingSource?, strategy?)
```

**Parameters:**

- `underlyingSource` (object, optional): Source configuration
- `strategy` (object, optional): Queuing strategy

**Underlying Source:**

- `start(controller)`: Called when stream is created
- `pull(controller)`: Called when more data is needed
- `cancel(reason)`: Called when stream is cancelled

#### ReadableStream Methods

##### `getReader(options?)`

Gets a reader for the stream.

**Parameters:**

- `options` (object, optional): Reader options
  - `mode`: "byob" for bring-your-own-buffer mode

**Returns:**

- `ReadableStreamDefaultReader | ReadableStreamBYOBReader`

```typescript
const reader = stream.getReader();
```

##### `pipeThrough(transform, options?)`

Pipes the stream through a transform stream.

**Parameters:**

- `transform` (object): Transform stream with `readable` and `writable` properties
- `options` (object, optional): Pipe options

**Returns:**

- `ReadableStream`: The readable side of the transform

```typescript
const transformedStream = sourceStream.pipeThrough(transformStream);
```

##### `pipeTo(destination, options?)`

Pipes the stream to a writable stream.

**Parameters:**

- `destination` (WritableStream): Target writable stream
- `options` (object, optional): Pipe options
  - `preventClose`: Don't close destination when source ends
  - `preventAbort`: Don't abort destination on error
  - `preventCancel`: Don't cancel source on error

**Returns:**

- `Promise<void>`: Resolves when piping completes

```typescript
await sourceStream.pipeTo(destinationStream);
```

##### `tee()`

Creates two identical copies of the stream.

**Returns:**

- `[ReadableStream, ReadableStream]`: Array of two identical streams

```typescript
const [stream1, stream2] = originalStream.tee();
```

### WritableStream Class

#### WritableStream Constructor

```typescript
new WritableStream(underlyingSink?, strategy?)
```

**Parameters:**

- `underlyingSink` (object, optional): Sink configuration
- `strategy` (object, optional): Queuing strategy

**Underlying Sink:**

- `start(controller)`: Called when stream is created
- `write(chunk, controller)`: Called for each chunk
- `close()`: Called when stream is closing
- `abort(reason)`: Called when stream is aborted

#### WritableStream Methods

##### `getWriter()`

Gets a writer for the stream.

**Returns:**

- `WritableStreamDefaultWriter`

```typescript
const writer = stream.getWriter();
```

### TransformStream Class

#### TransformStream Constructor

```typescript
new TransformStream(transformer?, writableStrategy?, readableStrategy?)
```

**Parameters:**

- `transformer` (object, optional): Transform configuration
- `writableStrategy` (object, optional): Writable side queuing strategy
- `readableStrategy` (object, optional): Readable side queuing strategy

**Transformer:**

- `start(controller)`: Called when stream is created
- `transform(chunk, controller)`: Called for each chunk
- `flush(controller)`: Called when stream is closing

#### Properties

##### `readable`

The readable side of the transform stream.

**Type:** `ReadableStream`

##### `writable`

The writable side of the transform stream.

**Type:** `WritableStream`

```typescript
const { readable, writable } = new TransformStream();
```

## Examples

### Data Generator Stream

```typescript
function createNumberStream(start: number, end: number): ReadableStream<number> {
  let current = start;
  
  return new ReadableStream({
    pull(controller) {
      if (current <= end) {
        controller.enqueue(current);
        current++;
      } else {
        controller.close();
      }
    }
  });
}

// Usage
const numberStream = createNumberStream(1, 10);
const reader = numberStream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log("Number:", value);
}
```

### File Processing Stream

```typescript
async function createFileStream(filename: string): Promise<ReadableStream<Uint8Array>> {
  const file = await Andromeda.open(filename, { read: true });
  const chunkSize = 64 * 1024; // 64KB chunks
  
  return new ReadableStream({
    async pull(controller) {
      try {
        const buffer = new Uint8Array(chunkSize);
        const bytesRead = await file.read(buffer);
        
        if (bytesRead === 0) {
          // End of file
          await file.close();
          controller.close();
        } else {
          controller.enqueue(buffer.slice(0, bytesRead));
        }
      } catch (error) {
        controller.error(error);
      }
    },
    
    async cancel() {
      await file.close();
    }
  });
}

// Usage
const fileStream = await createFileStream("large-file.txt");
await fileStream.pipeTo(new WritableStream({
  write(chunk) {
    console.log(`Read ${chunk.length} bytes`);
  }
}));
```

### Data Transformation Pipeline

```typescript
// Transform stream that converts text to uppercase
class UpperCaseTransform extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        if (typeof chunk === 'string') {
          controller.enqueue(chunk.toUpperCase());
        } else {
          controller.enqueue(chunk);
        }
      }
    });
  }
}

// Transform stream that adds line numbers
class LineNumberTransform extends TransformStream {
  private lineNumber = 1;
  
  constructor() {
    super({
      transform(chunk, controller) {
        if (typeof chunk === 'string') {
          const lines = chunk.split('\n');
          const numberedLines = lines.map(line => 
            line ? `${this.lineNumber++}: ${line}` : line
          );
          controller.enqueue(numberedLines.join('\n'));
        } else {
          controller.enqueue(chunk);
        }
      }
    });
  }
}

// Create processing pipeline
async function processText(input: string): Promise<string> {
  const inputStream = new ReadableStream({
    start(controller) {
      controller.enqueue(input);
      controller.close();
    }
  });
  
  let result = '';
  const outputStream = new WritableStream({
    write(chunk) {
      result += chunk;
    }
  });
  
  await inputStream
    .pipeThrough(new UpperCaseTransform())
    .pipeThrough(new LineNumberTransform())
    .pipeTo(outputStream);
  
  return result;
}

// Usage
const processed = await processText("hello\nworld\nhow are you?");
console.log("Processed text:", processed);
```

### HTTP Response Streaming

```typescript
async function streamResponse(url: string): Promise<void> {
  const response = await fetch(url);
  
  if (!response.body) {
    throw new Error("No response body");
  }
  
  // Create a transform stream to process chunks
  const processor = new TransformStream({
    transform(chunk, controller) {
      // Process each chunk (e.g., parse JSON lines)
      const text = new TextDecoder().decode(chunk);
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            controller.enqueue(data);
          } catch (error) {
            console.warn("Invalid JSON line:", line);
          }
        }
      }
    }
  });
  
  // Create output stream
  const output = new WritableStream({
    write(data) {
      console.log("Received data:", data);
    }
  });
  
  // Process the response stream
  await response.body
    .pipeThrough(processor)
    .pipeTo(output);
}
```

### Compression Stream

```typescript
class SimpleCompressionTransform extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        // Simple compression: replace repeated characters
        if (typeof chunk === 'string') {
          const compressed = chunk.replace(/(.)\1+/g, (match, char) => {
            return `${char}${match.length}`;
          });
          controller.enqueue(compressed);
        } else {
          controller.enqueue(chunk);
        }
      }
    });
  }
}

class SimpleDecompressionTransform extends TransformStream {
  constructor() {
    super({
      transform(chunk, controller) {
        if (typeof chunk === 'string') {
          const decompressed = chunk.replace(/(.)\d+/g, (match, char) => {
            const count = parseInt(match.slice(1));
            return char.repeat(count);
          });
          controller.enqueue(decompressed);
        } else {
          controller.enqueue(chunk);
        }
      }
    });
  }
}

// Usage
const originalText = "aaabbbccccdddd";
let compressedText = '';
let decompressedText = '';

// Compression pipeline
const inputStream = new ReadableStream({
  start(controller) {
    controller.enqueue(originalText);
    controller.close();
  }
});

await inputStream
  .pipeThrough(new SimpleCompressionTransform())
  .pipeTo(new WritableStream({
    write(chunk) {
      compressedText += chunk;
    }
  }));

console.log("Original:", originalText);
console.log("Compressed:", compressedText);

// Decompression pipeline
const compressedStream = new ReadableStream({
  start(controller) {
    controller.enqueue(compressedText);
    controller.close();
  }
});

await compressedStream
  .pipeThrough(new SimpleDecompressionTransform())
  .pipeTo(new WritableStream({
    write(chunk) {
      decompressedText += chunk;
    }
  }));

console.log("Decompressed:", decompressedText);
```

### Real-time Data Processing

```typescript
class DataAnalyzer {
  private count = 0;
  private sum = 0;
  private min = Infinity;
  private max = -Infinity;
  
  createAnalysisStream(): TransformStream<number, any> {
    return new TransformStream({
      transform: (value, controller) => {
        this.count++;
        this.sum += value;
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        
        const stats = {
          count: this.count,
          sum: this.sum,
          average: this.sum / this.count,
          min: this.min,
          max: this.max,
          current: value
        };
        
        controller.enqueue(stats);
      }
    });
  }
}

// Simulate real-time data
function createRandomDataStream(): ReadableStream<number> {
  return new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const value = Math.random() * 100;
        controller.enqueue(value);
      }, 100);
      
      // Stop after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 5000);
    }
  });
}

// Process real-time data
const analyzer = new DataAnalyzer();
const dataStream = createRandomDataStream();

await dataStream
  .pipeThrough(analyzer.createAnalysisStream())
  .pipeTo(new WritableStream({
    write(stats) {
      console.log(`Stats: avg=${stats.average.toFixed(2)}, min=${stats.min.toFixed(2)}, max=${stats.max.toFixed(2)}, count=${stats.count}`);
    }
  }));
```

### Stream Multiplexing

```typescript
function createMultiplexer<T>(): {
  input: WritableStream<T>,
  outputs: ReadableStream<T>[]
} {
  const outputs: ReadableStreamDefaultController<T>[] = [];
  
  const input = new WritableStream({
    write(chunk) {
      // Send chunk to all outputs
      outputs.forEach(controller => {
        try {
          controller.enqueue(chunk);
        } catch (error) {
          console.warn("Failed to enqueue to output:", error);
        }
      });
    },
    
    close() {
      outputs.forEach(controller => {
        try {
          controller.close();
        } catch (error) {
          console.warn("Failed to close output:", error);
        }
      });
    }
  });
  
  function createOutput(): ReadableStream<T> {
    return new ReadableStream({
      start(controller) {
        outputs.push(controller);
      },
      
      cancel() {
        const index = outputs.indexOf(controller);
        if (index >= 0) {
          outputs.splice(index, 1);
        }
      }
    });
  }
  
  return {
    input,
    outputs: [createOutput(), createOutput(), createOutput()]
  };
}

// Usage
const multiplexer = createMultiplexer<string>();

// Set up multiple consumers
multiplexer.outputs[0].pipeTo(new WritableStream({
  write(chunk) { console.log("Output 1:", chunk); }
}));

multiplexer.outputs[1].pipeTo(new WritableStream({
  write(chunk) { console.log("Output 2:", chunk.toUpperCase()); }
}));

multiplexer.outputs[2].pipeTo(new WritableStream({
  write(chunk) { console.log("Output 3 length:", chunk.length); }
}));

// Send data to all outputs
const writer = multiplexer.input.getWriter();
await writer.write("Hello");
await writer.write("World");
await writer.close();
```

## Best Practices

### Error Handling

```typescript
async function robustStreamProcessing(stream: ReadableStream) {
  const reader = stream.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      try {
        await processChunk(value);
      } catch (chunkError) {
        console.error("Chunk processing failed:", chunkError);
        // Continue with next chunk
      }
    }
  } catch (streamError) {
    console.error("Stream error:", streamError);
    throw streamError;
  } finally {
    reader.releaseLock();
  }
}
```

### Resource Management

```typescript
class ManagedStream {
  private resources: Set<any> = new Set();
  
  createStream<T>(): ReadableStream<T> {
    return new ReadableStream({
      start: (controller) => {
        // Track resources
      },
      
      cancel: () => {
        this.cleanup();
      }
    });
  }
  
  private cleanup() {
    for (const resource of this.resources) {
      try {
        if (resource.close) {
          resource.close();
        }
      } catch (error) {
        console.warn("Resource cleanup failed:", error);
      }
    }
    this.resources.clear();
  }
}
```

### Backpressure Handling

```typescript
function createControlledStream<T>(): ReadableStream<T> {
  const queue: T[] = [];
  let controller: ReadableStreamDefaultController<T>;
  
  return new ReadableStream({
    start(c) {
      controller = c;
    },
    
    pull() {
      // Only add more data when requested
      if (queue.length > 0) {
        controller.enqueue(queue.shift()!);
      }
    }
  });
}
```

## Notes

- Streams are designed for efficient memory usage with large datasets
- Always properly release stream locks when done
- Use backpressure mechanisms to prevent memory overflow
- Transform streams can be chained for complex processing pipelines
- Error handling in streams should be implemented at multiple levels

## See Also

- **[File API](/docs/api/file)** - File objects with stream support
- **[Fetch API](/docs/api/fetch)** - HTTP responses as streams
- **[File System API](/docs/api/file-system)** - File streaming operations
