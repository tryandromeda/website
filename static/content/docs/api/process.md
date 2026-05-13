---
title: "Process API"
description: "CLI args, environment variables, signals, exit, and subprocesses"
section: "API Reference"
order: 16
id: "process-api"
---

Andromeda exposes process-level primitives directly on the `Andromeda` namespace
— there is no `Andromeda.process` object. Everything you need lives at the top
level: CLI args, environment variables, signals, exit, and the `Command`
subprocess class.

## CLI Arguments

`Andromeda.args` is a `string[]` containing the arguments passed to the script
(everything after the script path on the command line). It does not include the
binary name itself.

```bash
andromeda run app.ts -- --port 3000 --name Alice
```

```typescript
console.log(Andromeda.args);
// ["--port", "3000", "--name", "Alice"]
```

Simple parsing:

```typescript
function getFlag(name: string, fallback?: string) {
  const idx = Andromeda.args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return Andromeda.args[idx + 1];
}

const port = parseInt(getFlag("port", "3000")!, 10);
```

## Environment Variables

```typescript
// Read
const home = Andromeda.env.get("HOME") || Andromeda.env.get("USERPROFILE");

// Write
Andromeda.env.set("MY_VAR", "value");

// Delete
Andromeda.env.remove("OLD_VAR");

// List
for (const key of Andromeda.env.keys()) {
  console.log(`${key}=${Andromeda.env.get(key)}`);
}
```

Andromeda also ships [Web Storage](/docs/api/web-storage) and a SQLite-backed
database for persistent state. Prefer those for application data over env vars.

## Standard I/O

```typescript
// Read a line from stdin (blocks)
const line = Andromeda.stdin.readLine();

// Write to stdout (no trailing newline)
Andromeda.stdout.write("Pick one: ");

// Write to stdout with a newline
Andromeda.stdout.writeLine("Done!");
```

`prompt(message)`, `confirm(message)`, and `alert(message)` are global helpers
built on top of stdin/stdout.

```typescript
const name = prompt("Your name?");
const ok = confirm("Continue?");
alert("All done!");
```

## Exit

```typescript
Andromeda.exit(0); // success
Andromeda.exit(1); // failure
Andromeda.exit(); // defaults to 0
```

`exit` terminates the runtime immediately — no `finally` blocks or
`process.on("beforeExit")` semantics. Clean up explicitly before calling it.

## Sleep

```typescript
await Andromeda.sleep(500); // 500ms

// Pattern: poll with a budget
for (let i = 0; i < 10; i++) {
  if (await isReady()) break;
  await Andromeda.sleep(250);
}
```

## Signals

`addSignalListener` / `removeSignalListener` register POSIX-style signal
handlers. On Windows only `SIGINT` (Ctrl+C) and `SIGBREAK` (Ctrl+Break) are
supported.

```typescript
type Signal =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBREAK"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGEMT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINFO"
  | "SIGINT"
  | "SIGIO"
  | "SIGPOLL"
  | "SIGUNUSED"
  | "SIGKILL"
  | "SIGPIPE"
  | "SIGPROF"
  | "SIGPWR"
  | "SIGQUIT"
  | "SIGSEGV"
  | "SIGSTKFLT"
  | "SIGSTOP"
  | "SIGSYS"
  | "SIGTERM"
  | "SIGTRAP"
  | "SIGTSTP"
  | "SIGTTIN"
  | "SIGTTOU"
  | "SIGURG"
  | "SIGUSR1"
  | "SIGUSR2"
  | "SIGVTALRM"
  | "SIGWINCH"
  | "SIGXCPU"
  | "SIGXFSZ";

const onInt = () => {
  console.log("\nGoodbye!");
  Andromeda.exit(0);
};

Andromeda.addSignalListener("SIGINT", onInt);

// Later, to detach:
Andromeda.removeSignalListener("SIGINT", onInt);
```

## Spawning Subprocesses (`Andromeda.Command`)

Run external programs with `Andromeda.Command`. The API mirrors Deno's
`Deno.Command`.

### Run-to-completion

```typescript
const cmd = new Andromeda.Command("echo", { args: ["hello", "world"] });

const output = await cmd.output();
console.log(output.success); // true
console.log(output.code); // 0
console.log(output.signal); // null
console.log(output.stdout); // "hello world\n"
console.log(output.stderr); // ""
```

`outputSync()` is the synchronous variant of `output()`.

### Spawn (long-running)

```typescript
const cmd = new Andromeda.Command("ping", { args: ["-c", "5", "1.1.1.1"] });
const child = cmd.spawn();

console.log("pid:", child.pid);
child.kill("SIGTERM"); // or "SIGKILL", etc.

const status = await child.status;
const output = await child.output();
```

### Options

```typescript
interface CommandOptions {
  args?: string[];
  cwd?: string;
  env?: Record<string, string>;
  clearEnv?: boolean;
  stdin?: "piped" | "inherit" | "null"; // default: "inherit" for spawn, "null" otherwise
  stdout?: "piped" | "inherit" | "null"; // default: "piped"
  stderr?: "piped" | "inherit" | "null"; // default: "piped"
  uid?: number; // Unix only
  gid?: number; // Unix only
  windowsRawArguments?: boolean; // Windows only
}
```

### Examples

```typescript
// Custom environment
const cmd = new Andromeda.Command("node", {
  args: ["-e", "console.error('hi')"],
  env: { NODE_ENV: "production" },
  stderr: "piped",
});
const out = await cmd.output();
console.log(out.stderr);

// Pipe vs inherit
new Andromeda.Command("ls", {
  args: ["-la"],
  stdout: "inherit",
}).spawn();
```

## See Also

- [File System API](/docs/api/file-system) for stdin/stdout helpers
- [Time API](/docs/api/time) for `setTimeout` / `setInterval`
- [Cron API](/docs/api/cron) for scheduled tasks
