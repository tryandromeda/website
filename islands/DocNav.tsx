// deno-lint-ignore-file no-explicit-any no-explicit-any no-explicit-any
import Fuse from "https://cdn.skypack.dev/fuse.js";
import { useState } from "preact/hooks";

interface DocEntry {
    name: string;
    id: string;
    path: string;
}

interface DocTopic {
    name: string;
    children: DocEntry[];
}

const ChevronDown = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-chevron-down"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export function DocNav({
    data,
    path,
}: {
    data: DocTopic[];
    path: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const fuse = new Fuse(data, {
        keys: ["name", "children.name"],
        threshold: 0.3, // Adjust the threshold as needed
    });

    const filteredData = searchTerm
        ? fuse.search(searchTerm).map((result: any) => result.item)
        : data;

    return (
        <div>
            <button
                className="md:hidden p-4"
                onClick={toggleNav}
            >
                <ChevronDown />
            </button>
            <nav
                class={`block px-10 py-2 max-w-md flex flex-col w-full h-screen transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <h1 class="font-bold flex justify-center items-center">
                    <a href="/">Andromeda</a>
                </h1>
                <div className="search-container my-5 text-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm((e.target as any).value)}
                        class="w-full pl-8 pr-2 py-1 rounded-md border bg-slate-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {filteredData.length > 0
                    ? filteredData.map((
                        { name: topicName, children: topicChildren }: any,
                    ) => (
                        <div className="mt-4" key={topicName}>
                            <span className="font-bold uppercase text-gray-300">
                                {topicName}
                            </span>
                            <ul className="font-semibold nested mt-2">
                                {topicChildren.map(
                                    (
                                        {
                                            name: routeName,
                                            path: routePath,
                                            id: routeId,
                                        }: any,
                                        i: number,
                                    ) => {
                                        return (
                                            <li key={routeId} className="mb-2">
                                                <div
                                                    htmlFor={routeId}
                                                    className={`py-2 pl-4 rounded-lg ${
                                                        path === routePath
                                                            ? "bg-slate-700 text-rose-600"
                                                            : "hover:bg-slate-700 hover:text-rose-100"
                                                    } font-semibold transition-colors duration-200`}
                                                >
                                                    <a
                                                        href={routePath}
                                                        className="block"
                                                    >
                                                        {i + 1}. {routeName}
                                                    </a>
                                                </div>
                                            </li>
                                        );
                                    },
                                )}
                            </ul>
                        </div>
                    ))
                    : "No results found"}
            </nav>
        </div>
    );
}
