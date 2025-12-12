import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import "jsr:@std/dotenv@0.225.5/load";
export const app = new App<State>();

app.use(staticFiles());

app.get("/docs", () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/docs/index",
    },
  });
});

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
