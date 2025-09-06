import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import "jsr:@std/dotenv/load";

export const app = new App<State>()
  .use(staticFiles())
  .get("/docs", () => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/docs/index",
      },
    });
  })
  .fsRoutes();

if (import.meta.main) {
  await app.listen();
}
