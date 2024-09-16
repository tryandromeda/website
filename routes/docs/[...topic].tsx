import { PageProps } from "$fresh/server.ts";
import { Content } from "../../components/Content.tsx";
import { DocNav } from "../../islands/DocNav.tsx";
import toc from "../../utils/toc.ts";

export default async function DocTopic(req: Request, props: PageProps) {
    const topic = props.params.topic;
    const content = await Deno.readTextFile(`static/content/${topic}.md`).then((
        res,
    ) => res).catch((_e) => {
        console.error(_e);
        return `# 404 Not Found
    
    [Go Home](/)`;
    });
    return (
        <main class="flex flex-col min-h-screen max-w-7xl mx-auto p-4 md:flex-row">
            <aside class="md:w-1/4 w-full md:fixed md:h-screen">
            <DocNav data={toc} path={props.url.pathname} />
            </aside>
            <div class="md:w-3/4 w-full md:ml-[25%] flex justify-center p-4">
            <Content markdown={content} baseUrl={new URL(req.url).host} />
            </div>
        </main>
    );
}
