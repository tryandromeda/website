---
title: "Crypto API"
description: "Cryptographic operations and security functions"
section: "API Reference"
order: 13
id: "crypto-api"
---

The Crypto API provides cryptographic functionality similar to the Web Crypto
API standard. It includes methods for generating random values, creating UUIDs,
and performing cryptographic operations.

## Overview

The `crypto` global object provides access to cryptographic functions including
random number generation, hashing, and other cryptographic operations through
the SubtleCrypto interface.

## Methods

### `crypto.randomUUID()`

Generates a random UUID (Universally Unique Identifier) string.

**Returns:** `string` - A random UUID in the format
`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

**Example:**

```typescript
const uuid = crypto.randomUUID();
console.log("Generated UUID:", uuid);
// Output: Generated UUID: f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### `crypto.getRandomValues(array)`

Fills the provided typed array with cryptographically secure random values.

**Parameters:**

- `array` - A typed array (Uint8Array, Uint16Array, Uint32Array, etc.) to fill
  with random values

**Returns:** The same array that was passed in, now filled with random values

**Example:**

```typescript
const buffer = new Uint8Array(16);
crypto.getRandomValues(buffer);
console.log("Random bytes:", buffer);
// Output: Random bytes: Uint8Array(16) [123, 45, 67, 89, ...]

// Works with different typed arrays
const uint32Buffer = new Uint32Array(4);
crypto.getRandomValues(uint32Buffer);
console.log("Random 32-bit values:", uint32Buffer);
```

## SubtleCrypto Interface

The `crypto.subtle` property provides access to the SubtleCrypto interface for
advanced cryptographic operations.

### `crypto.subtle.digest(algorithm, data)`

Generates a digest of the given data using the specified algorithm.

**Parameters:**

- `algorithm` - The hash algorithm to use (e.g., "SHA-1", "SHA-256", "SHA-384",
  "SHA-512")
- `data` - The data to hash (Uint8Array, ArrayBuffer, TypedArray, or DataView)

**Returns:** `Promise<ArrayBuffer>` - A promise that resolves to the hash as an ArrayBuffer

**Example:**

```typescript
const encoder = new TextEncoder();
const data = encoder.encode("Hello, World!");

const hashBuffer = await crypto.subtle.digest("SHA-256", data);

// Convert to hex string for display
const hashArray = new Uint8Array(hashBuffer);
const hashHex = Array.from(hashArray)
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

console.log("SHA-256 hash:", hashHex);
// Output: SHA-256 hash: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f

// Working with ArrayBuffer directly
const buffer = new ArrayBuffer(16);
const view = new Uint8Array(buffer);
view.set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

const hash = await crypto.subtle.digest("SHA-512", buffer);
console.log("Hash from ArrayBuffer:", hash);
```

### Supported Hash Algorithms

- **SHA-1**: Legacy algorithm, not recommended for security-critical
  applications
- **SHA-256**: Recommended for most applications
- **SHA-384**: Part of the SHA-2 family
- **SHA-512**: Part of the SHA-2 family, provides the highest security

### Key Generation (Future)

The SubtleCrypto interface will support additional operations in future
versions:

- `generateKey()` - Generate cryptographic keys
- `importKey()` - Import keys from external sources
- `exportKey()` - Export keys for external use
- `sign()` - Create digital signatures
- `verify()` - Verify digital signatures
- `encrypt()` - Encrypt data
- `decrypt()` - Decrypt data

## Usage Examples

### Basic Random Number Generation

```typescript
// Generate a random byte array
const randomBytes = new Uint8Array(32);
crypto.getRandomValues(randomBytes);

// Generate a random UUID
const sessionId = crypto.randomUUID();
```

### Hashing Data

```typescript
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Convert ArrayBuffer to hex string
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const hashedPassword = await hashPassword("mySecretPassword");
console.log("Hashed password:", hashedPassword);
```

### File Integrity Verification

```typescript
async function verifyFileIntegrity(
  fileData: Uint8Array,
  expectedHash: string,
): Promise<boolean> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", fileData);
  const hashArray = new Uint8Array(hashBuffer);
  const actualHash = Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return actualHash === expectedHash;
}

// Usage
const fileBuffer = new Uint8Array([/* file data */]);
const isValid = await verifyFileIntegrity(fileBuffer, "expected-hash-value");
```

## Security Considerations

1. **Use appropriate algorithms**: Use SHA-256 or higher for security-critical
   applications

2. **Random number quality**: `crypto.getRandomValues()` provides
   cryptographically secure random numbers suitable for security purposes

3. **UUID uniqueness**: UUIDs generated by `crypto.randomUUID()` are Version 4
   (random) UUIDs with proper entropy

4. **Data handling**: Always use proper encoding (TextEncoder) when hashing
   strings

## Browser Compatibility

The Crypto API in Andromeda follows the Web Crypto API standard where possible,
making it easier to port code between environments.

## See Also

- [Web APIs](/docs/api/web) - For text encoding and other web standards
