#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { tailwind } from "@pakornv/fresh-plugin-tailwindcss";
import { Builder } from "fresh/dev";

const builder = new Builder();

if (Deno.args.includes("build")) {
  const { app } = await import("./main.tsx");
  tailwind(builder, app);
  await builder.build();
} else {
  await builder.listen(async () => {
    const { app } = await import("./main.tsx");
    tailwind(builder, app);
    return app;
  });
}
