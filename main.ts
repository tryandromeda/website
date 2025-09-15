import { App, staticFiles } from "fresh";
import "jsr:@std/dotenv/load";

export const app = new App()
  .use(staticFiles())
  // .get("/docs", () => {
  //   return new Response(null, {
  //     status: 302,
  //     headers: {
  //       Location: "/docs/index",
  //     },
  //   });
  // })
  .fsRoutes();

// if (import.meta.main) {
//   await app.listen();
// }
