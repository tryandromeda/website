# Troubleshooting Guide

Common issues and solutions for Andromeda runtime.

## Installation Issues

### "cargo: command not found"

**Problem:** Rust/Cargo is not installed or not in PATH.

**Solutions:**

1. **Install Rust:**

   ```bash
   # Visit https://rustup.rs/ or run:
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Add Cargo to PATH:**

   ```bash
   # Add to ~/.bashrc or ~/.zshrc
   export PATH="$HOME/.cargo/bin:$PATH"
   source ~/.bashrc
   ```

3. **Verify installation:**

   ```bash
   cargo --version
   rustc --version
   ```

### "andromeda: command not found" after installation

**Problem:** Andromeda was installed but not in PATH.

**Solutions:**

1. **Check installation location:**

   ```bash
   # Cargo bin directory should contain andromeda
   ls ~/.cargo/bin/andromeda
   ```

2. **Add to PATH if needed:**

   ```bash
   echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Reinstall with force:**

   ```bash
   cargo install --git https://github.com/tryandromeda/andromeda --force
   ```

### Build failures during installation

**Problem:** Compilation errors during `cargo install`.

**Common causes and solutions:**

1. **Outdated Rust version:**

   ```bash
   rustup update stable
   ```

2. **Missing system dependencies:** **Ubuntu/Debian:**

   ```bash
   sudo apt update
   sudo apt install build-essential pkg-config libssl-dev
   ```

   **CentOS/RHEL:**

   ```bash
   sudo yum groupinstall "Development Tools"
   sudo yum install openssl-devel
   ```

   **macOS:**

   ```bash
   xcode-select --install
   ```

3. **Clear Cargo cache:**

   ```bash
   cargo clean
   rm -rf ~/.cargo/registry/cache
   ```

4. **Check available disk space:**

   ```bash
   df -h ~/.cargo
   ```

## Runtime Issues

### TypeScript files not recognized

**Problem:** `.ts` files treated as JavaScript, type errors.

**Solutions:**

1. **Verify file extension:**

   ```bash
   # Ensure file ends with .ts
   mv script.js script.ts
   ```

2. **Check file content:**

   ```typescript
   // TypeScript features should work
   interface User {
     name: string;
     age: number;
   }

   const user: User = { name: "John", age: 30 };
   console.log(user);
   ```

3. **Try explicit execution:**

   ```bash
   andromeda run --verbose script.ts
   ```

### "Module not found" errors

**Problem:** Import/require statements failing.

**Solutions:**

1. **Use relative paths:**

   ```typescript
   // ✅ Correct
   import { helper } from "./utils.ts";

   // ❌ Incorrect (no npm modules yet)
   import express from "express";
   ```

2. **Check file paths:**

   ```bash
   # Verify file exists
   ls -la utils.ts
   ```

3. **Use absolute paths:**

   ```typescript
   const fullPath = Andromeda.resolve("./utils.ts");
   console.log("Looking for:", fullPath);
   ```

### Canvas operations failing

**Problem:** Canvas API errors or black images.

**Solutions:**

1. **Check context creation:**

   ```typescript
   const canvas = new OffscreenCanvas(800, 600);
   const ctx = canvas.getContext("2d");

   if (!ctx) {
     throw new Error("Failed to get 2D context");
   }
   ```

2. **Ensure canvas.render() is called:**

   ```typescript
   // Draw something
   ctx.fillStyle = "red";
   ctx.fillRect(0, 0, 100, 100);

   // Must call render before saving
   canvas.render();
   canvas.saveAsPng("output.png");
   ```

3. **Check canvas feature:**

   ```bash
   # Verify canvas feature is enabled
   andromeda --version
   # Should mention canvas support
   ```

### File operations failing

**Problem:** File read/write operations throwing errors.

**Solutions:**

1. **Check file permissions:**

   ```bash
   # Verify read permissions
   ls -la myfile.txt

   # Fix permissions if needed
   chmod 644 myfile.txt
   ```

2. **Use absolute paths:**

   ```typescript
   const absolutePath = Andromeda.resolve("./data/config.json");
   if (Andromeda.exists(absolutePath)) {
     const content = Andromeda.readTextFileSync(absolutePath);
   }
   ```

3. **Handle errors gracefully:**

   ```typescript
   try {
     const content = Andromeda.readTextFileSync("file.txt");
     console.log(content);
   } catch (error) {
     console.error("File operation failed:", error.message);
   }
   ```

### Crypto operations not working

**Problem:** Crypto API functions undefined or failing.

**Solutions:**

1. **Check feature availability:**

   ```typescript
   if (typeof crypto === "undefined") {
     console.error("Crypto feature not enabled");
   } else {
     console.log("Crypto available");
   }
   ```

2. **Use async/await for subtle crypto:**

   ```typescript
   // ✅ Correct
   const hash = await crypto.subtle.digest("SHA-256", data);

   // ❌ Incorrect
   const hash = crypto.subtle.digest("SHA-256", data); // Returns Promise
   ```

3. **Check build features:**

   ```bash
   # Reinstall with crypto feature
   cargo install --git https://github.com/tryandromeda/andromeda --features crypto
   ```

## Performance Issues

### Slow script execution

**Problem:** Scripts taking longer than expected to run.

**Solutions:**

1. **Enable verbose mode:**

   ```bash
   andromeda run --verbose slow-script.ts
   ```

2. **Profile your code:**

   ```typescript
   const start = performance.now();

   // Your code here
   heavyComputation();

   const end = performance.now();
   console.log(`Execution time: ${end - start}ms`);
   ```

3. **Check for infinite loops:**

   ```typescript
   // Add safety counter
   let iterations = 0;
   while (condition && iterations < 10000) {
     // Your loop code
     iterations++;
   }
   ```

4. **Optimize file operations:**

   ```typescript
   // ❌ Reading files in a loop
   for (const file of files) {
     const content = Andromeda.readTextFileSync(file);
   }

   // ✅ Batch operations when possible
   const contents = files.map((file) => ({
     file,
     content: Andromeda.readTextFileSync(file),
   }));
   ```

### Memory usage issues

**Problem:** High memory consumption or out-of-memory errors.

**Solutions:**

1. **Check canvas sizes:**

   ```typescript
   // ❌ Very large canvas
   const canvas = new OffscreenCanvas(10000, 10000);

   // ✅ Reasonable size
   const canvas = new OffscreenCanvas(1920, 1080);
   ```

2. **Process data in chunks:**

   ```typescript
   // ❌ Loading entire large file
   const bigFile = Andromeda.readTextFileSync("huge-file.txt");

   // ✅ Process in smaller pieces
   function processLargeFile(path: string) {
     const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
     // Implementation depends on your use case
   }
   ```

3. **Monitor memory usage:**

   ```typescript
   // Use performance API to track memory
   console.log("Memory usage:", performance.memory?.usedJSHeapSize);
   ```

## REPL Issues

### REPL not starting

**Problem:** `andromeda repl` command fails.

**Solutions:**

1. **Check terminal compatibility:**

   ```bash
   # Try in different terminal
   # Ensure terminal supports ANSI colors
   ```

2. **Disable colors if needed:**

   ```bash
   NO_COLOR=1 andromeda repl
   ```

3. **Check for conflicting processes:**

   ```bash
   # Kill any existing andromeda processes
   pkill andromeda
   ```

### REPL commands not working

**Problem:** REPL-specific commands like `help` not responding.

**Solutions:**

1. **Type commands without quotes:**

   ```javascript
   // ✅ Correct
   help;

   // ❌ Incorrect
   "help";
   ```

2. **Use `.exit` to quit:**

   ```javascript
   .exit
   // or
   exit
   ```

3. **Clear screen:**

   ```javascript
   clear;
   ```

## Debugging Tips

### Enable verbose logging

```bash
# Runtime debugging
RUST_LOG=debug andromeda run script.ts

# Extension debugging
RUST_LOG=andromeda_runtime=debug andromeda run script.ts
```

### Check system information

```typescript
// System info script
console.log("Environment variables:");
console.log("HOME:", Andromeda.env.get("HOME"));
console.log("PATH:", Andromeda.env.get("PATH"));
console.log("PWD:", Andromeda.cwd());

console.log("\nArguments:");
console.log("Args:", Andromeda.args);

console.log("\nPlatform info:");
console.log("Platform detected from environment");
```

### Test individual features

```typescript
// Feature test script
console.log("Testing Andromeda features...");

// File system
try {
  Andromeda.writeTextFileSync("test.txt", "Hello");
  const content = Andromeda.readTextFileSync("test.txt");
  console.log("✅ File system:", content === "Hello");
  Andromeda.remove("test.txt");
} catch (e) {
  console.log("❌ File system:", e.message);
}

// Canvas
try {
  const canvas = new OffscreenCanvas(100, 100);
  const ctx = canvas.getContext("2d");
  console.log("✅ Canvas:", !!ctx);
} catch (e) {
  console.log("❌ Canvas:", e.message);
}

// Crypto
try {
  const uuid = crypto.randomUUID();
  console.log("✅ Crypto:", typeof uuid === "string");
} catch (e) {
  console.log("❌ Crypto:", e.message);
}

// Performance
try {
  const start = performance.now();
  console.log("✅ Performance:", typeof start === "number");
} catch (e) {
  console.log("❌ Performance:", e.message);
}
```

## Platform-Specific Issues

### Windows Issues

**PowerShell execution policy:**

```powershell
# If you get execution policy errors
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Path separator issues:**

```typescript
// Use forward slashes or Andromeda.join
const path = Andromeda.join("folder", "file.txt");
// Instead of "folder\\file.txt"
```

### macOS Issues

**Gatekeeper warnings:**

```bash
# If macOS blocks execution
xattr -d com.apple.quarantine /path/to/andromeda
```

**Permission issues:**

```bash
# Fix homebrew permissions if needed
sudo chown -R $(whoami) /usr/local/bin
```

### Linux Issues

**Missing dependencies:**

```bash
# Ubuntu/Debian
sudo apt install libc6-dev

# CentOS/RHEL
sudo yum install glibc-devel
```

**AppArmor/SELinux:**

```bash
# Check if security modules are blocking execution
dmesg | grep -i denied
```

## Getting Help

If you're still experiencing issues:

1. **Search existing issues:**
   - [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)

2. **Create a minimal reproduction:**

   ```typescript
   // minimal-repro.ts
   console.log("This is a minimal example that shows the problem");
   // Add only the code that demonstrates the issue
   ```

3. **Gather system information:**

   ```bash
   # Include this information in bug reports
   andromeda --version
   rustc --version
   uname -a  # Linux/macOS
   systeminfo  # Windows
   ```

4. **Join our community:**
   - [Discord Server](https://discord.gg/tgjAnX2Ny3)
   - [GitHub Discussions](https://github.com/tryandromeda/andromeda/discussions)

5. **Check logs:**

   ```bash
   # Run with maximum logging
   RUST_LOG=trace andromeda run problematic-script.ts 2>&1 | tee debug.log
   ```

When reporting issues, please include:

- Andromeda version (`andromeda --version`)
- Operating system and version
- Rust version (`rustc --version`)
- Complete error message
- Minimal reproduction case
- Steps you've already tried

This helps us diagnose and fix issues quickly!
