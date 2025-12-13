---
title: "Web APIs"
description: "Standard web APIs (Events, TextEncoder/Decoder, etc.)"
section: "API Reference"
order: 19
id: "web-apis"
---

Andromeda provides implementations of standard web APIs to ensure compatibility
with existing web code and standards. This includes event handling, text
encoding, and other essential web platform features.

## Overview

The Web APIs in Andromeda follow WHATWG specifications and provide a familiar
programming model for developers coming from browser environments.

## DOMException API

The DOMException API provides a standardized way to represent errors that occur
in web APIs, following the WHATWG DOM specification.

### DOMException Class

DOMException represents an exception that occurs as a result of calling a method
or accessing a property of a web API.

#### Constructor

```typescript
new DOMException(message?: string, name?: string)
```

Creates a new DOMException object.

**Parameters:**

- `message` (optional): Human-readable description of the error
- `name` (optional): The name of the error (default: "Error")

#### Properties

- `name`: The name of the exception
- `message`: The error message
- `code`: Legacy numeric error code (for compatibility)

#### Standard Exception Names

DOMException supports all standard exception names as defined in the WHATWG DOM
specification:

```typescript
// Network-related errors
const networkError = new DOMException("Network request failed", "NetworkError");
const timeoutError = new DOMException("Request timed out", "TimeoutError");

// Security-related errors
const securityError = new DOMException("Access denied", "SecurityError");

// Invalid state or argument errors
const invalidStateError = new DOMException(
  "Invalid state",
  "InvalidStateError",
);
const syntaxError = new DOMException("Invalid syntax", "SyntaxError");

// Data errors
const dataError = new DOMException("Invalid data", "DataError");
const quotaExceededError = new DOMException(
  "Quota exceeded",
  "QuotaExceededError",
);

// Operation errors
const abortError = new DOMException("Operation aborted", "AbortError");
const notSupportedError = new DOMException(
  "Operation not supported",
  "NotSupportedError",
);
```

### Usage Examples

#### Basic Error Creation

```typescript
// Create a basic DOMException
const basicError = new DOMException();
console.log(basicError.name); // "Error"
console.log(basicError.message); // ""

// Create with message
const messageError = new DOMException("Something went wrong");
console.log(messageError.name); // "Error"
console.log(messageError.message); // "Something went wrong"

// Create with message and name
const namedError = new DOMException("Invalid operation", "InvalidStateError");
console.log(namedError.name); // "InvalidStateError"
console.log(namedError.message); // "Invalid operation"
```

#### Error Handling in APIs

```typescript
class WebAPIExample {
  private isInitialized = false;

  initialize() {
    this.isInitialized = true;
  }

  performOperation() {
    if (!this.isInitialized) {
      throw new DOMException(
        "Cannot perform operation before initialization",
        "InvalidStateError",
      );
    }

    // Simulate network operation
    if (Math.random() < 0.1) {
      throw new DOMException(
        "Network connection failed",
        "NetworkError",
      );
    }

    return "Operation completed successfully";
  }

  parseData(data: string) {
    if (!data || data.trim().length === 0) {
      throw new DOMException(
        "Data cannot be empty",
        "SyntaxError",
      );
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      throw new DOMException(
        "Invalid JSON data format",
        "SyntaxError",
      );
    }
  }
}

// Usage with proper error handling
const api = new WebAPIExample();

try {
  api.performOperation(); // Will throw InvalidStateError
} catch (error) {
  if (error instanceof DOMException) {
    console.error(`${error.name}: ${error.message}`);

    // Handle specific error types
    switch (error.name) {
      case "InvalidStateError":
        console.log("Initializing API...");
        api.initialize();
        break;
      case "NetworkError":
        console.log("Retrying network operation...");
        break;
      default:
        console.log("Unknown error occurred");
    }
  }
}
```

#### Custom Error Hierarchy

```typescript
class APIError extends DOMException {
  constructor(message: string, name: string = "APIError") {
    super(message, name);
  }
}

class ValidationError extends APIError {
  constructor(field: string, value: any) {
    super(`Invalid value for field '${field}': ${value}`, "ValidationError");
  }
}

class AuthenticationError extends APIError {
  constructor(message: string = "Authentication failed") {
    super(message, "SecurityError");
  }
}

// Usage
function validateUser(userData: any) {
  if (!userData.email || !userData.email.includes("@")) {
    throw new ValidationError("email", userData.email);
  }

  if (!userData.password || userData.password.length < 8) {
    throw new ValidationError("password", "too short");
  }

  if (!userData.token) {
    throw new AuthenticationError("Missing authentication token");
  }
}

try {
  validateUser({ email: "invalid", password: "123" });
} catch (error) {
  if (error instanceof DOMException) {
    console.error(`Validation failed - ${error.name}: ${error.message}`);
  }
}
```

#### Integration with Fetch API

```typescript
async function safeFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Convert HTTP errors to DOMExceptions
      switch (response.status) {
        case 400:
          throw new DOMException("Bad Request", "SyntaxError");
        case 401:
          throw new DOMException("Unauthorized", "SecurityError");
        case 403:
          throw new DOMException("Forbidden", "SecurityError");
        case 404:
          throw new DOMException("Not Found", "NotFoundError");
        case 408:
          throw new DOMException("Request Timeout", "TimeoutError");
        case 429:
          throw new DOMException("Too Many Requests", "QuotaExceededError");
        case 500:
          throw new DOMException("Internal Server Error", "NetworkError");
        default:
          throw new DOMException(`HTTP ${response.status}`, "NetworkError");
      }
    }

    return response;
  } catch (error) {
    // Convert network errors to DOMExceptions
    if (error instanceof TypeError) {
      throw new DOMException("Network connection failed", "NetworkError");
    }

    if (error.name === "AbortError") {
      throw new DOMException("Request was aborted", "AbortError");
    }

    // Re-throw DOMExceptions as-is
    if (error instanceof DOMException) {
      throw error;
    }

    // Convert other errors
    throw new DOMException(error.message || "Unknown error", "UnknownError");
  }
}

// Usage
try {
  const response = await safeFetch("https://api.example.com/data");
  const data = await response.json();
  console.log(data);
} catch (error) {
  if (error instanceof DOMException) {
    console.error(`API Error - ${error.name}: ${error.message}`);

    // Handle specific error types
    switch (error.name) {
      case "NetworkError":
        console.log("Check your internet connection");
        break;
      case "SecurityError":
        console.log("Check your authentication credentials");
        break;
      case "TimeoutError":
        console.log("Request timed out, try again");
        break;
    }
  }
}
```

### Error Categories

DOMExceptions can be categorized by their purpose:

#### Network Errors

- `NetworkError`: General network failures
- `TimeoutError`: Request timeouts
- `AbortError`: Cancelled operations

#### Security Errors

- `SecurityError`: Access denied or authentication failures
- `NotAllowedError`: Operation not permitted

#### State Errors

- `InvalidStateError`: Object in wrong state for operation
- `InvalidAccessError`: Invalid access to object

#### Data Errors

- `SyntaxError`: Invalid syntax or format
- `DataError`: Invalid data
- `QuotaExceededError`: Storage or resource limits exceeded

#### Operational Errors

- `NotSupportedError`: Feature not supported
- `NotFoundError`: Resource not found
- `OperationError`: General operation failure

## Event API

### Event Class

The Event API provides a standard way to handle events, following the WHATWG
HTML Living Standard for event handling.

#### Constructor

```typescript
new Event(type: string, eventInitDict?: EventInit)
```

Creates a new Event object.

**Parameters:**

- `type`: The event type (e.g., "click", "load", "custom")
- `eventInitDict` (optional): Configuration object with properties:
  - `bubbles`: Whether the event bubbles (default: false)
  - `cancelable`: Whether the event can be canceled (default: false)
  - `composed`: Whether the event will trigger listeners outside of a shadow
    root (default: false)

#### Properties

- `type`: The event type string
- `target`: The event target (read-only)
- `currentTarget`: The current target during event propagation (read-only)
- `eventPhase`: The current phase of event propagation (read-only)
- `bubbles`: Whether the event bubbles (read-only)
- `cancelable`: Whether the event can be canceled (read-only)
- `defaultPrevented`: Whether preventDefault() was called (read-only)
- `isTrusted`: Whether the event was generated by user action (read-only)
- `timeStamp`: The time when the event was created (read-only)

#### Methods

##### `preventDefault(): void`

Cancels the event's default action if it's cancelable.

```typescript
const event = new Event("submit", { cancelable: true });
event.preventDefault();
console.log(event.defaultPrevented); // true
```

##### `stopPropagation(): void`

Stops the event from propagating further through the event flow.

```typescript
const event = new Event("click", { bubbles: true });
event.stopPropagation();
// Event will not bubble to parent elements
```

##### `stopImmediatePropagation(): void`

Stops the event from propagating and prevents other listeners on the same
element from being called.

```typescript
element.addEventListener("click", (event) => {
  event.stopImmediatePropagation();
  // Other click listeners on this element won't be called
});
```

### Event Usage Examples

#### Creating Custom Events

```typescript
// Create a simple custom event
const customEvent = new Event("myCustomEvent");

// Create an event with options
const configurableEvent = new Event("userAction", {
  bubbles: true,
  cancelable: true,
});

// Check event properties
console.log(customEvent.type); // "myCustomEvent"
console.log(customEvent.bubbles); // false
console.log(configurableEvent.bubbles); // true
```

#### Event Handling Patterns

```typescript
// Event listener function
function handleCustomEvent(event: Event) {
  console.log(`Received event: ${event.type}`);

  if (event.cancelable) {
    event.preventDefault();
    console.log("Default action prevented");
  }
}

// Create and dispatch custom event
const event = new Event("dataProcessed", {
  bubbles: false,
  cancelable: true,
});

// Simulate event handling
handleCustomEvent(event);
```

#### Event State Management

```typescript
class EventProcessor {
  processEvent(event: Event): boolean {
    // Check if event is valid for processing
    if (!event.isTrusted) {
      console.warn("Untrusted event, skipping processing");
      return false;
    }

    // Process different event phases
    switch (event.eventPhase) {
      case Event.CAPTURING_PHASE:
        console.log("Event in capturing phase");
        break;
      case Event.AT_TARGET:
        console.log("Event at target");
        break;
      case Event.BUBBLING_PHASE:
        console.log("Event in bubbling phase");
        break;
    }

    return true;
  }
}
```

## Text Encoding API

The Text Encoding API provides utilities for encoding and decoding text,
implementing the WHATWG Encoding Standard.

### TextEncoder

Encodes strings into UTF-8 byte sequences.

#### TextEncoder Constructor

```typescript
new TextEncoder();
```

Creates a new TextEncoder instance. Always uses UTF-8 encoding.

#### TextEncoder Properties

- `encoding`: Always returns "utf-8"

#### TextEncoder Methods

##### `encode(input?: string): Uint8Array`

Encodes a string into a Uint8Array of UTF-8 bytes.

```typescript
const encoder = new TextEncoder();

// Encode ASCII text
const ascii = encoder.encode("Hello, World!");
console.log(ascii); // Uint8Array with UTF-8 bytes

// Encode Unicode text
const unicode = encoder.encode("你好世界");
console.log(unicode); // Uint8Array with UTF-8 bytes for Chinese characters

// Empty string
const empty = encoder.encode("");
console.log(empty.length); // 0
```

##### `encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult`

Encodes a string into an existing Uint8Array buffer.

```typescript
const encoder = new TextEncoder();
const buffer = new Uint8Array(50);

const result = encoder.encodeInto("Hello, 世界!", buffer);
console.log(result.read); // Number of characters read
console.log(result.written); // Number of bytes written
```

### TextDecoder

Decodes byte sequences into strings using specified encoding.

#### TextDecoder Constructor

```typescript
new TextDecoder(label?: string, options?: TextDecoderOptions)
```

Creates a new TextDecoder instance.

**Parameters:**

- `label` (optional): The encoding label (default: "utf-8")
- `options` (optional): Configuration object:
  - `fatal`: Whether to throw on invalid sequences (default: false)
  - `ignoreBOM`: Whether to ignore byte order mark (default: false)

#### TextDecoder Properties

- `encoding`: The encoding being used
- `fatal`: Whether fatal error mode is enabled
- `ignoreBOM`: Whether BOM is ignored

#### TextDecoder Methods

##### `decode(input?: BufferSource, options?: TextDecodeOptions): string`

Decodes a byte sequence into a string.

```typescript
const decoder = new TextDecoder();

// Decode UTF-8 bytes
const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
const text = decoder.decode(bytes);
console.log(text); // "Hello"

// Streaming decode
const stream = { stream: true };
const partial1 = decoder.decode(bytes1, stream);
const partial2 = decoder.decode(bytes2, stream);
const final = decoder.decode(); // Finish stream
```

### Text Encoding Examples

#### Basic Encoding/Decoding

```typescript
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Round-trip encoding
const originalText = "Hello, 世界! 🌍";
const encoded = encoder.encode(originalText);
const decoded = decoder.decode(encoded);

console.log(originalText === decoded); // true
console.log(encoded.length); // Number of bytes (varies with Unicode)
```

#### Working with Different Text Types

```typescript
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ASCII text
const ascii = "Simple ASCII text";
const asciiBytes = encoder.encode(ascii);
console.log(`ASCII: ${ascii.length} chars → ${asciiBytes.length} bytes`);

// Unicode text (2-byte characters)
const latin = "Café résumé naïve";
const latinBytes = encoder.encode(latin);
console.log(`Latin: ${latin.length} chars → ${latinBytes.length} bytes`);

// Unicode text (3-byte characters)
const chinese = "你好世界";
const chineseBytes = encoder.encode(chinese);
console.log(`Chinese: ${chinese.length} chars → ${chineseBytes.length} bytes`);

// Emoji (4-byte characters)
const emoji = "🌍🚀⭐";
const emojiBytes = encoder.encode(emoji);
console.log(`Emoji: ${emoji.length} chars → ${emojiBytes.length} bytes`);
```

#### Streaming Text Processing

```typescript
const decoder = new TextDecoder();

function processTextStream(chunks: Uint8Array[]): string {
  let result = "";

  // Process all chunks except the last with streaming
  for (let i = 0; i < chunks.length - 1; i++) {
    result += decoder.decode(chunks[i], { stream: true });
  }

  // Process final chunk without streaming
  if (chunks.length > 0) {
    result += decoder.decode(chunks[chunks.length - 1]);
  }

  return result;
}

// Example usage with chunked data
const textData = "This is a long text that might be received in chunks";
const encoded = new TextEncoder().encode(textData);

// Split into chunks
const chunk1 = encoded.slice(0, 10);
const chunk2 = encoded.slice(10, 20);
const chunk3 = encoded.slice(20);

const reconstructed = processTextStream([chunk1, chunk2, chunk3]);
console.log(textData === reconstructed); // true
```

#### Error Handling

```typescript
// Fatal mode - throws on invalid sequences
const fatalDecoder = new TextDecoder("utf-8", { fatal: true });

try {
  // Invalid UTF-8 sequence
  const invalidBytes = new Uint8Array([0xFF, 0xFE, 0xFD]);
  const result = fatalDecoder.decode(invalidBytes);
} catch (error) {
  console.error("Decoding failed:", error.message);
}

// Non-fatal mode - replaces invalid sequences
const tolerantDecoder = new TextDecoder("utf-8", { fatal: false });
const invalidBytes = new Uint8Array([0xFF, 0xFE, 0xFD]);
const result = tolerantDecoder.decode(invalidBytes);
console.log(result); // Contains replacement characters
```

#### Performance Optimization

```typescript
// Reuse encoder/decoder instances
const globalEncoder = new TextEncoder();
const globalDecoder = new TextDecoder();

function efficientTextProcessing(texts: string[]): Uint8Array[] {
  // Reuse the same encoder instance
  return texts.map((text) => globalEncoder.encode(text));
}

// Pre-allocate buffers for encodeInto
const encoder = new TextEncoder();
const buffer = new Uint8Array(1024); // Reusable buffer

function encodeWithBuffer(text: string): Uint8Array {
  const result = encoder.encodeInto(text, buffer);
  return buffer.slice(0, result.written);
}
```

## Validation and Testing

### Text Encoding Validation

```typescript
function validateTextEncoding(): boolean {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Test cases
  const testCases = [
    "Hello, World!", // ASCII
    "Café résumé", // Latin-1 supplement
    "你好世界", // CJK
    "🌍🚀⭐", // Emoji
    "", // Empty string
    "\0\x01\x02", // Control characters
  ];

  for (const testCase of testCases) {
    const encoded = encoder.encode(testCase);
    const decoded = decoder.decode(encoded);

    if (testCase !== decoded) {
      console.error(`Failed for: "${testCase}"`);
      return false;
    }
  }

  console.log("✓ All text encoding tests passed");
  return true;
}

// Run validation
validateTextEncoding();
```

### Event System Testing

```typescript
function testEventSystem(): boolean {
  // Test basic event creation
  const event1 = new Event("test");
  if (event1.type !== "test" || event1.bubbles !== false) {
    return false;
  }

  // Test event with options
  const event2 = new Event("custom", { bubbles: true, cancelable: true });
  if (!event2.bubbles || !event2.cancelable) {
    return false;
  }

  // Test preventDefault
  event2.preventDefault();
  if (!event2.defaultPrevented) {
    return false;
  }

  console.log("✓ All event tests passed");
  return true;
}

// Run validation
testEventSystem();
```

## Navigator API

The Navigator API provides information about the user agent, platform, and
device capabilities. Andromeda implements both legacy navigator properties and
modern User-Agent Client Hints.

### Basic Navigator Properties

```typescript
// Get basic user agent information
console.log("User Agent:", navigator.userAgent);
console.log("Platform:", navigator.platform);
console.log("App Name:", navigator.appName);
console.log("App Code Name:", navigator.appCodeName);

// Check if this is a mobile device
console.log("Is Mobile:", navigator.userAgentData?.mobile);
```

### User-Agent Client Hints

The modern User-Agent Client Hints provide structured access to platform
information:

```typescript
// Access basic user agent data
const uaData = navigator.userAgentData;
if (uaData) {
  console.log("Brands:", uaData.brands);
  console.log("Mobile:", uaData.mobile);
  console.log("Platform:", uaData.platform);
}

// Get high entropy values (requires user permission in browsers)
const highEntropyValues = await navigator.userAgentData?.getHighEntropyValues([
  "architecture",
  "bitness",
  "model",
  "platformVersion",
  "uaFullVersion",
]);

console.log("Architecture:", highEntropyValues?.architecture);
console.log("Platform Version:", highEntropyValues?.platformVersion);
```

### Web Locks Integration

The Navigator API includes access to the Web Locks API:

```typescript
// Access lock manager through navigator
const lockManager = navigator.locks;

// Request a lock
await navigator.locks.request("shared-resource", async (lock) => {
  if (lock) {
    console.log(`Acquired lock: ${lock.name}`);
    // Work with shared resource
  }
});

// Query current lock state
const snapshot = await navigator.locks.query();
console.log("Active locks:", snapshot.held);
console.log("Pending locks:", snapshot.pending);
```

## Battery API

The Battery API provides information about the device's battery status. This API
is useful for applications that need to adapt their behavior based on power
levels.

### Basic Battery Information

```typescript
// Check if battery API is available
if ("getBattery" in navigator) {
  try {
    const battery = await navigator.getBattery();

    console.log("Battery Level:", (battery.level * 100).toFixed(1) + "%");
    console.log("Battery Charging:", battery.charging);
    console.log("Charging Time:", battery.chargingTime, "seconds");
    console.log("Discharging Time:", battery.dischargingTime, "seconds");
  } catch (error) {
    console.log("Battery API not available:", error.message);
  }
}

// Alternative approach using internal API
try {
  const batteryInfo = await __andromeda__.internal_battery_info();
  const battery = JSON.parse(batteryInfo);

  console.log("Battery Status:", battery);
} catch (error) {
  console.log("Battery information not available on this platform");
}
```

### Battery Event Handling

```typescript
// Listen for battery events (if supported)
navigator.getBattery().then((battery) => {
  battery.addEventListener("chargingchange", () => {
    console.log(`Battery charging: ${battery.charging}`);
  });

  battery.addEventListener("levelchange", () => {
    console.log(`Battery level: ${(battery.level * 100).toFixed(1)}%`);

    // Adapt behavior based on battery level
    if (battery.level < 0.2 && !battery.charging) {
      console.log("Low battery - enabling power saving mode");
      enablePowerSavingMode();
    }
  });

  battery.addEventListener("chargingtimechange", () => {
    if (battery.charging && battery.chargingTime !== Infinity) {
      const hours = Math.floor(battery.chargingTime / 3600);
      const minutes = Math.floor((battery.chargingTime % 3600) / 60);
      console.log(`Time to full charge: ${hours}h ${minutes}m`);
    }
  });
});

function enablePowerSavingMode() {
  // Reduce background activity, lower refresh rates, etc.
  console.log("Power saving mode activated");
}
```

## Browser Compatibility

Andromeda's Web APIs are designed to be compatible with standard browser
implementations:

- **Event API**: Follows WHATWG HTML Living Standard
- **Text Encoding**: Implements WHATWG Encoding Standard
- **Standard Behavior**: Compatible error handling and edge cases
- **Performance**: Optimized for server-side and CLI usage

## Best Practices

### Text Encoding

1. **Reuse Instances**: Create encoder/decoder instances once and reuse them
2. **Handle Errors**: Use fatal mode when data integrity is critical
3. **Stream Processing**: Use streaming for large text data
4. **Buffer Management**: Pre-allocate buffers for better performance

### Events

1. **Use Standard Types**: Use well-known event types when possible
2. **Configure Appropriately**: Set bubbles and cancelable based on needs
3. **Handle Errors**: Check event state before processing
4. **Performance**: Avoid creating excessive event objects

## Related APIs

- [Console API](/docs/api/console) - For debugging and logging
- [Performance API](/docs/api/performance) - For timing and performance
  measurement
- [Fetch API](/docs/api/fetch) - For network requests using standard web APIs
- [URL API](/docs/api/url) - For URL parsing and manipulation
