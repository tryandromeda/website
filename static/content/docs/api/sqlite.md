---
title: "SQLite API"
description: "Built-in synchronous SQLite via DatabaseSync"
section: "API Reference"
order: 11
id: "sqlite"
---

Andromeda bundles SQLite through the `DatabaseSync` class (aliased as
`Database`). The API mirrors the
[Node.js `node:sqlite`](https://nodejs.org/api/sqlite.html) and Deno
`node:sqlite` shapes: a synchronous database with prepared statements,
transactions, custom functions, sessions, and changesets.

The SQLite extension is included when Andromeda is built with the `storage`
feature (enabled by default).

## Opening a database

```typescript
// File on disk (created if missing)
const db = new Database("myapp.db");

// In-memory database
const mem = new Database(":memory:");

// With options
const ro = new Database("readonly.db", {
  open: true,
  readOnly: true,
  allowExtension: false,
  enableForeignKeyConstraints: true,
  enableDoubleQuotedStringLiterals: false,
});
```

`Database` is a re-export of `DatabaseSync`. Use either name.

## Executing statements

### `exec(sql)`

Execute one or more statements and discard any results.

```typescript
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER
  );
  CREATE INDEX idx_users_name ON users(name);
`);
```

### `prepare(sql)`

Create a prepared statement (`StatementSync`).

```typescript
const insert = db.prepare("INSERT INTO users (name, age) VALUES (?, ?)");
insert.run("Alice", 30);
insert.run("Bob", 25);
```

## Statement methods

| Method                           | Returns                     | Description                               |
| -------------------------------- | --------------------------- | ----------------------------------------- |
| `run(...params)`                 | `StatementResultingChanges` | Execute and return change info            |
| `get(...params)`                 | `unknown`                   | First row, or `undefined`                 |
| `all(...params)`                 | `unknown[]`                 | All rows as an array of objects           |
| `iterate(...params)`             | `IterableIterator<unknown>` | Lazily iterate rows                       |
| `finalize()`                     | `void`                      | Free statement resources                  |
| `setAllowBareNamedParameters(b)` | `this`                      | Allow `:name` without leading `$`/`@`/`:` |
| `setReadBigInts(b)`              | `this`                      | Read INTEGER columns as `bigint`          |

Statement properties:

- `sourceSQL` — original SQL text
- `expandedSQL` — SQL with parameter values substituted

```typescript
const usersOver26 = db.prepare("SELECT * FROM users WHERE age > ?").all(26);

const { changes, lastInsertRowid } = db.prepare(
  "INSERT INTO users (name, age) VALUES (?, ?)",
).run("Charlie", 35);

console.log(changes, lastInsertRowid);

for (const row of db.prepare("SELECT * FROM users ORDER BY name").iterate()) {
  console.log((row as any).name);
}
```

## Parameter Binding

Use `?` placeholders and pass values positionally to `run`, `get`, `all`, or
`iterate`. Supported parameter and result types: `null`, `number`, `bigint`,
`string`, `Uint8Array` (blobs), `boolean` (stored as `INTEGER`).

```typescript
const stmt = db.prepare(`
  INSERT INTO data (id, name, value, blob, flag)
  VALUES (?, ?, ?, ?, ?)
`);

stmt.run(1, "alpha", 3.14, new Uint8Array([1, 2, 3]), true);
stmt.run(2, null, null, null, false);
```

## Transactions

SQLite transactions are managed with raw SQL:

```typescript
db.exec("BEGIN TRANSACTION");
try {
  db.prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?").run(
    100,
    1,
  );
  db.prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?").run(
    100,
    2,
  );
  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  throw err;
}
```

## Custom Functions

Register a JavaScript function as a SQL function:

```typescript
db.function("greet", (name) => `Hello, ${name}!`, {
  varargs: false,
  deterministic: true,
  directOnly: false,
  useBigIntArguments: false,
});

console.log(db.prepare("SELECT greet(?) AS msg").get("World"));
// { msg: "Hello, World!" }
```

## Extensions

```typescript
db.enableLoadExtension(true);
db.loadExtension("./my_extension.so");
db.enableLoadExtension(false);
```

## Sessions and changesets

```typescript
const session = db.createSession({ db: "main", table: "users" });

db.prepare("INSERT INTO users (name, age) VALUES (?, ?)").run("Diana", 40);

const changeset = session.changeset();
session.close();

// Apply the changeset to another database
otherDb.applyChangeset(changeset, {
  filter: (table) => table === "users",
  onConflict: constants.SQLITE_CHANGESET_REPLACE,
});
```

## Closing

```typescript
db.close();
```

Always close databases when you're done — outstanding prepared statements are
finalized automatically.

## Constants

```typescript
constants.SQLITE_CHANGESET_OMIT;
constants.SQLITE_CHANGESET_REPLACE;
constants.SQLITE_CHANGESET_ABORT;
constants.SQLITE_CHANGESET_NOTFOUND;
constants.SQLITE_CHANGESET_CONFLICT;
constants.SQLITE_CHANGESET_DATA;
constants.SQLITE_CHANGESET_FOREIGN_KEY;
```

## Patterns

### Repository wrapper

```typescript
class UserRepo {
  #db: Database;
  #insert: StatementSync;
  #findByEmail: StatementSync;

  constructor(db: Database) {
    this.#db = db;
    this.#db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
      )
    `);
    this.#insert = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)");
    this.#findByEmail = db.prepare("SELECT * FROM users WHERE email = ?");
  }

  create(email: string, name: string) {
    return this.#insert.run(email, name);
  }

  findByEmail(email: string) {
    return this.#findByEmail.get(email);
  }
}
```

### Bulk inserts

```typescript
const insert = db.prepare(
  "INSERT INTO log (ts, level, message) VALUES (?, ?, ?)",
);

db.exec("BEGIN TRANSACTION");
for (const entry of entries) {
  insert.run(entry.ts, entry.level, entry.message);
}
db.exec("COMMIT");
```

A few thousand inserts inside a single transaction is dramatically faster than
the same inserts outside one.

## See Also

- [Web Storage API](/docs/api/web-storage) — `localStorage` is backed by SQLite
- [Examples → SQLite](/docs/examples/sqlite)
- [Examples → Web Storage](/docs/examples/web-storage)
