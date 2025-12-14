# Andromeda Website

The official website and docs for
[Andromeda](https://github.com/tryandromeda/andromeda), a modern JavaScript and
TypeScript runtime built entirely in Rust and powered by the
[Nova JavaScript engine](https://trynova.dev/).

## 🌐 Live Website

Visit the live documentation at:
**[tryandromeda.dev](https://tryandromeda.dev)**

## 🛠️ Development

### Prerequisites

- [Deno](https://deno.land/) 2.0 or higher

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tryandromeda/website.git
   cd website
   ```

2. **Start the development server**:

   ```bash
   deno task dev
   ```

3. **Open your browser** to `http://localhost:8000`

## 📝 Contributing to Documentation

We welcome contributions to improve the documentation! Here's how you can help:

### Adding New Documentation

1. **API Documentation**: Add new files to `static/content/docs/api/`
2. **Examples**: Add code examples to `static/content/docs/examples/`
3. **Guides**: Add tutorials to `static/content/docs/`

### Writing Style Guide

- Use clear, concise language
- Include practical code examples
- Follow the existing markdown structure
- Test all code examples with Andromeda

## 🚀 Building & Deployment

### Building for Production

To create a production build:

```bash
deno task build
```

This generates optimized assets in the `_fresh/` directory.

### Running in Production

After building, start the production server:

```bash
deno run -A _fresh/server.js
```

Or use the start task (for development):

```bash
deno task start
```

### Deployment Notes

- **main.ts**: Re-exports from `main.tsx` for Fresh build compatibility
- **Build Output**: The `_fresh/` directory contains the compiled server and assets
- **Environment**: Ensure Deno 2.0+ is installed on your deployment platform
- **Port**: Default port is 8000 (configurable via environment variables)

### Deploy to Deno Deploy

1. Push your changes to GitHub
2. Connect your repository to [Deno Deploy](https://dash.deno.com)
3. Set the build command: `deno task build`
4. Set the entry point: `_fresh/server.js`

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guide](https://tryandromeda.dev/docs/contributing) for details.

## 📄 License

This project is licensed under the
[Mozilla Public License Version 2.0](LICENSE).

## 🆘 Support

- 💬 [Discord Community](https://discord.gg/tgjAnX2Ny3)
- 🐛 [GitHub Issues](https://github.com/tryandromeda/andromeda/issues)
- 📧 [GitHub Discussions](https://github.com/tryandromeda/andromeda/discussions)

## 🔗 Links

- **[Andromeda Runtime](https://github.com/tryandromeda/andromeda)** - Main
  repository
- **[Nova JavaScript Engine](https://trynova.dev/)** - Underlying engine
- **[WinterTC](https://wintertc.org/)** - Runtime compatibility standard

---
