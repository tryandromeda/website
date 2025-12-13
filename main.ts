import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import "jsr:@std/dotenv@0.225.5/load";

export const app = new App<State>();

app.use(staticFiles());

// Enable file-system based routing
app.fsRoutes();

// Redirect /docs to /docs/index
app.get("/docs", () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/docs/index",
    },
  });
});

if (import.meta.main) {
  await app.listen();
}
