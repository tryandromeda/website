// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $docs_topic_ from "./routes/docs/[...topic].tsx";
import * as $docs_index from "./routes/docs/index.tsx";
import * as $index from "./routes/index.tsx";
import * as $DocNav from "./islands/DocNav.tsx";
import * as $Docs from "./islands/Docs.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/docs/[...topic].tsx": $docs_topic_,
    "./routes/docs/index.tsx": $docs_index,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/DocNav.tsx": $DocNav,
    "./islands/Docs.tsx": $Docs,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;