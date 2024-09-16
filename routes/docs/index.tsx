export default function Docs() {
    const docItems = [
        { title: "Getting Started", href: "/docs/getting-started", icon: "🚀" },
    ];

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <section className="mb-12 text-center">
                <h1 className="text-5xl font-bold mb-4"><a href="/">Andromeda Docs</a></h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                </p>
            </section>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docItems.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors group"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {item.title}
                        </h3>
                        <p className="text-gray-400">
                            Explore {item.title.toLowerCase()}{" "}
                            and enhance your Andromeda skills.
                        </p>
                    </a>
                ))}
            </div>
        </main>
    );
}
