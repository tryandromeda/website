# Console API Reference

The `console` module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.

## Methods

The Console API provides the following methods:

- [log](#log)
- [debug](#debug)
- [warn](#warn)
- [error](#error)
- [info](#info)
- [assert](#assert)
- [clear](#clear)

### log

```ts
console.log("Hello", "World");
```

Prints a message to the console.

### debug

```ts
console.debug("Hello", "World");
```

Prints a message to the console with the log level set to `Debug`.

### warn

```ts
console.warn("Hello", "World");
```

Prints a message to the console with the log level set to `Warn`.

### error

```ts
console.error("Hello", "World");
```

Prints a message to the console with the log level set to `Error`.

### info

```ts
console.info("Hello", "World");
```

Prints a message to the console with the log level set to `Info`.

### assert

```ts
console.assert(true, "Hello", "World");
```

Prints a message to the console with the log level set to `Error` if the first argument is `false`.

### clear

```ts
console.clear();
```

Clears the console.
