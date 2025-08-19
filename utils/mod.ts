import { accepts } from "jsr:@std/http@^1.0/negotiation";

export const isHtmlRequest = (req: Request) =>
  accepts(req, "application/*", "text/html") === "text/html";
