// deno-lint-ignore-file no-explicit-any no-explicit-any

import { marked } from "npm:marked";
import { tomorrow } from "https://esm.sh/react-syntax-highlighter@15.5.0/dist/esm/styles/prism";

import { Prism as SyntaxHighlighter } from "https://esm.sh/react-syntax-highlighter@15.5.0";
export const renderMarkdown = (content: any) => {
    const renderer = new marked.Renderer();
    (renderer.code as any) = (code: any, language: any) => {
        return (
            <SyntaxHighlighter language={language} style={tomorrow}>
                {code}
            </SyntaxHighlighter>
        );
    };
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: marked(content, { renderer }) as string,
            }}
        />
    );
};
