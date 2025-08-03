import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";

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
