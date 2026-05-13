---
title: "Cron API"
description: "Schedule recurring tasks with Andromeda.cron"
section: "API Reference"
order: 14
id: "cron-api"
---

`Andromeda.cron(name, schedule, handler)` schedules a recurring task. The
schedule can be a standard Unix cron string or a structured JSON object. All
times are interpreted in UTC.

## Signatures

```typescript
declare namespace Andromeda {
  function cron(
    name: string,
    schedule: string | CronSchedule,
    handler: () => Promise<void> | void,
  ): Promise<void>;

  function cron(
    name: string,
    schedule: string | CronSchedule,
    options: { backoffSchedule?: number[]; signal?: AbortSignal },
    handler: () => Promise<void> | void,
  ): Promise<void>;

  type CronScheduleExpression =
    | number
    | { exact: number | number[] }
    | { start?: number; end?: number; every?: number };

  interface CronSchedule {
    minute?: CronScheduleExpression;
    hour?: CronScheduleExpression;
    dayOfMonth?: CronScheduleExpression;
    month?: CronScheduleExpression;
    dayOfWeek?: CronScheduleExpression;
  }
}
```

`name` is used in logs and to identify the job. Each call registers a job and
returns a `Promise<void>` that runs as long as the runtime is alive.

## Cron-string schedules

Cron strings follow the standard `minute hour day-of-month month day-of-week`
five-field format:

```text
* * * * *
│ │ │ │ │
│ │ │ │ └── day of week  (1=Mon … 7=Sun)
│ │ │ └──── month         (1-12)
│ │ └────── day of month  (1-31)
│ └──────── hour          (0-23)
└────────── minute        (0-59)
```

```typescript
// Every minute
Andromeda.cron("heartbeat", "* * * * *", () => {
  console.log("alive", new Date().toISOString());
});

// Daily at 02:30 UTC
Andromeda.cron("nightly", "30 2 * * *", async () => {
  await nightlyMaintenance();
});

// Every 15 minutes
Andromeda.cron("poll", "*/15 * * * *", () => poll());

// Monday – Friday at 09:00
Andromeda.cron("standup", "0 9 * * 1-5", () => notifyTeam());
```

## Object schedules

The object form is type-safe and avoids cron-string ambiguities. Every field is
optional and defaults to "any value":

```typescript
// Every six hours
Andromeda.cron("rotate", { hour: { every: 6 } }, rotateLogs);

// Exactly minute 0, 30 of every hour
Andromeda.cron("half-hour", { minute: { exact: [0, 30] } }, work);

// 09:30 on weekdays
Andromeda.cron(
  "weekday-am",
  {
    minute: 30,
    hour: 9,
    dayOfWeek: { start: 1, end: 5 },
  },
  ping,
);
```

Field bounds:

| Field        | Range               |
| ------------ | ------------------- |
| `minute`     | 0-59                |
| `hour`       | 0-23                |
| `dayOfMonth` | 1-31                |
| `month`      | 1-12                |
| `dayOfWeek`  | 1-7 (Mon=1 … Sun=7) |

## Options

### `backoffSchedule`

If the handler throws, the job is retried following the given delays (in
milliseconds). After the schedule is exhausted, the failure is propagated and
the job will fire again on the next regular tick.

```typescript
Andromeda.cron(
  "fetch-feed",
  "*/5 * * * *",
  { backoffSchedule: [100, 500, 2000] },
  async () => {
    await refreshFeed();
  },
);
```

### `signal`

Use an `AbortSignal` to cancel a cron job permanently:

```typescript
const controller = new AbortController();

Andromeda.cron("temp", "* * * * *", { signal: controller.signal }, () => {
  console.log("tick");
});

Andromeda.addSignalListener("SIGTERM", () => controller.abort());
```

## Patterns

### Self-limiting job

```typescript
let runs = 0;
Andromeda.cron("limited", "* * * * *", () => {
  runs++;
  console.log(`run ${runs}`);
  if (runs >= 3) Andromeda.exit(0);
});
```

### Long-running async handler

The cron driver does not stack overlapping invocations. If your handler is still
running when the next tick fires, the next tick is queued.

```typescript
Andromeda.cron("nightly", "0 0 * * *", async () => {
  performance.mark("nightly:start");
  await heavyJob();
  performance.measure("nightly", "nightly:start");
});
```

## See Also

- [Time API](/docs/api/time) for `setTimeout` / `setInterval`
- [Process API](/docs/api/process) for `Andromeda.exit` and signals
- [Andromeda examples → cron.ts](https://github.com/tryandromeda/andromeda/blob/main/examples/cron.ts)
