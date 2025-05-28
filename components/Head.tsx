import Meta, { type MetaProps } from "./Meta.tsx";
import { ComponentChildren } from "preact";

export type HeadProps =
    & Partial<Omit<MetaProps, "href">>
    & Pick<MetaProps, "href">
    & {
        children?: ComponentChildren;
    };

export default function Head(props: HeadProps) {
    return (
        <head>
            <Meta
                title={props?.title ? `${props.title} - Netsaur` : "Netsaur"}
                description={props?.description ??
                    "Netsaur brings the power of modern machine learning to the Deno ecosystem."}
                href={props.href}
                imageUrl="/cover.png"
            />
            {props.children}
        </head>
    );
}
