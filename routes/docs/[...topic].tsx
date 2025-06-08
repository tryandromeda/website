// [...topic].tsx
import type { PageProps } from "fresh";
import { CSS, render } from "@deno/gfm";
import "npm:prismjs@1.29.0/components/prism-typescript.js";
import "npm:prismjs@1.29.0/components/prism-bash.js";

import { Content } from "../../components/Content.tsx";
import { DocNav } from "../../islands/DocNav.tsx";
import toc from "../../utils/toc.ts";

export default async function DocTopic(props: PageProps) {
  console.log(props);
  const topic = props.params.topic;
  const content = await Deno.readTextFile(`static/content/${topic}.md`).then((
    res,
  ) => res).catch((_e) => {
    console.error(_e);
    return `# 404 Not Found

    The page you're looking for doesn't exist.

    [← Back to Documentation](/docs)`;
  });

  return (
    <>
      {/* Fixed sidebar */}
      <DocNav data={toc} path={props.url.pathname} />

      <main class="md:ml-80 min-h-screen">
        {/* Main content */}
        <div
          class="p-4 md:p-8 markdown-body pt-24 md:pt-8 min-h-screen"
          data-color-mode="light"
          data-light-theme="light"
          data-dark-theme="dark"
          dangerouslySetInnerHTML={{
            __html: render(content, { baseUrl: new URL(props.url).host }),
          }}
        />
      </main>
    </>
  );
}
