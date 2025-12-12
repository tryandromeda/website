import Footer from "../components/Footer.tsx";
import NavBar from "../components/NavBar.tsx";
import SatelliteInstaller from "../islands/SatelliteInstaller.tsx";
import { Package, Play, Wrench, Zap, Check, Terminal } from "lucide-preact";

export default function Satellites() {
  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section class="pt-32 pb-20 px-4 bg-base relative z-10">
        <div class="container mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-5xl sm:text-6xl font-bold mb-6 text-text">
              🛰️ Andromeda Satellites
            </h1>
            <p class="text-xl text-subtext1 max-w-3xl mx-auto leading-relaxed">
              Lightweight, purpose-built executables designed for containerized
              environments and microservice architectures. Each satellite focuses
              on a single capability for optimal performance.
            </p>
          </div>

          {/* Main Installer */}
          <div class="mb-16">
            <SatelliteInstaller />
          </div>

          {/* Why Satellites Section */}
          <div class="max-w-6xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-text mb-8 text-center">
              Why Satellites?
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div class="bg-surface0 border border-surface1 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-3 bg-blue rounded-lg">
                    <Package size={24} style={{ color: "var(--color-base)" }} />
                  </div>
                  <h3 class="text-xl font-bold text-text">Smaller Images</h3>
                </div>
                <p class="text-subtext1">
                  Each satellite is optimized for a single task, resulting in container
                  images that are 70-90% smaller than the full runtime.
                </p>
              </div>

              {/* Benefit 2 */}
              <div class="bg-surface0 border border-surface1 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-3 bg-green rounded-lg">
                    <Zap size={24} style={{ color: "var(--color-base)" }} />
                  </div>
                  <h3 class="text-xl font-bold text-text">Faster Startup</h3>
                </div>
                <p class="text-subtext1">
                  Minimal binary size and focused functionality means faster cold starts
                  and reduced memory footprint in serverless environments.
                </p>
              </div>

              {/* Benefit 3 */}
              <div class="bg-surface0 border border-surface1 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="flex items-center gap-3 mb-4">
                  <div class="p-3 bg-yellow rounded-lg">
                    <Terminal size={24} style={{ color: "var(--color-base)" }} />
                  </div>
                  <h3 class="text-xl font-bold text-text">Better Security</h3>
                </div>
                <p class="text-subtext1">
                  Reduced attack surface with only the necessary code included.
                  Perfect for security-conscious production deployments.
                </p>
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div class="max-w-6xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-text mb-8 text-center">
              Common Use Cases
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Use Case 1 */}
              <div class="bg-gradient-to-br from-surface0 to-surface1 border border-surface1 rounded-xl p-6">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-green rounded-lg mt-1">
                    <Play size={20} style={{ color: "var(--color-base)" }} />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-text mb-2">Serverless Functions</h3>
                    <p class="text-sm text-subtext1 mb-3">
                      Use <code class="px-2 py-1 rounded bg-surface2 text-xs">andromeda-run</code> in
                      AWS Lambda, Google Cloud Functions, or Azure Functions for minimal cold start times.
                    </p>
                    <pre class="text-xs bg-mantle p-3 rounded-lg text-text overflow-x-auto">
{`FROM alpine:latest
COPY andromeda-run /usr/local/bin/
COPY handler.ts /app/
CMD ["andromeda-run", "/app/handler.ts"]`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Use Case 2 */}
              <div class="bg-gradient-to-br from-surface0 to-surface1 border border-surface1 rounded-xl p-6">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-yellow rounded-lg mt-1">
                    <Wrench size={20} style={{ color: "var(--color-base)" }} />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-text mb-2">CI/CD Pipeline</h3>
                    <p class="text-sm text-subtext1 mb-3">
                      Install only the tools you need for your pipeline stages: fmt, lint, check, or compile.
                    </p>
                    <pre class="text-xs bg-mantle p-3 rounded-lg text-text overflow-x-auto">
{`# GitHub Actions example
- name: Format Check
  run: andromeda-fmt --check src/
- name: Lint
  run: andromeda-lint src/
- name: Type Check
  run: andromeda-check src/`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Use Case 3 */}
              <div class="bg-gradient-to-br from-surface0 to-surface1 border border-surface1 rounded-xl p-6">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-blue rounded-lg mt-1">
                    <Package size={20} style={{ color: "var(--color-base)" }} />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-text mb-2">Build Containers</h3>
                    <p class="text-sm text-subtext1 mb-3">
                      Use <code class="px-2 py-1 rounded bg-surface2 text-xs">andromeda-compile</code> or
                      <code class="px-2 py-1 rounded bg-surface2 text-xs ml-1">andromeda-bundle</code> for
                      production builds.
                    </p>
                    <pre class="text-xs bg-mantle p-3 rounded-lg text-text overflow-x-auto">
{`FROM node:alpine as builder
COPY --from=andromeda/compile /usr/local/bin/
RUN andromeda-compile app.ts -o app
FROM scratch
COPY --from=builder /app /app
CMD ["/app"]`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Use Case 4 */}
              <div class="bg-gradient-to-br from-surface0 to-surface1 border border-surface1 rounded-xl p-6">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-mauve rounded-lg mt-1">
                    <Check size={20} style={{ color: "var(--color-base)" }} />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-text mb-2">Development Tools</h3>
                    <p class="text-sm text-subtext1 mb-3">
                      Install satellites as Git hooks or editor integrations for on-save formatting and linting.
                    </p>
                    <pre class="text-xs bg-mantle p-3 rounded-lg text-text overflow-x-auto">
{`# .git/hooks/pre-commit
#!/bin/bash
andromeda-fmt --check .
andromeda-lint .
andromeda-check .`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div class="max-w-6xl mx-auto mb-16">
            <h2 class="text-3xl font-bold text-text mb-8 text-center">
              Satellite vs Full Runtime
            </h2>
            
            <div class="overflow-x-auto">
              <table class="w-full bg-surface0 border border-surface1 rounded-xl overflow-hidden">
                <thead class="bg-surface1">
                  <tr>
                    <th class="px-6 py-4 text-left text-text font-bold">Feature</th>
                    <th class="px-6 py-4 text-center text-text font-bold">Satellite</th>
                    <th class="px-6 py-4 text-center text-text font-bold">Full Runtime</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface1">
                  <tr class="hover:bg-surface1/50 transition-colors">
                    <td class="px-6 py-4 text-text">Binary Size</td>
                    <td class="px-6 py-4 text-center text-green font-bold">~3-35 MB</td>
                    <td class="px-6 py-4 text-center text-subtext1">~45 MB</td>
                  </tr>
                  <tr class="hover:bg-surface1/50 transition-colors">
                    <td class="px-6 py-4 text-text">Cold Start Time</td>
                    <td class="px-6 py-4 text-center text-green font-bold">&lt;50ms</td>
                    <td class="px-6 py-4 text-center text-subtext1">~100ms</td>
                  </tr>
                  <tr class="hover:bg-surface1/50 transition-colors">
                    <td class="px-6 py-4 text-text">Memory Footprint</td>
                    <td class="px-6 py-4 text-center text-green font-bold">Minimal</td>
                    <td class="px-6 py-4 text-center text-subtext1">Full Runtime</td>
                  </tr>
                  <tr class="hover:bg-surface1/50 transition-colors">
                    <td class="px-6 py-4 text-text">Container Image Size</td>
                    <td class="px-6 py-4 text-center text-green font-bold">10-50 MB</td>
                    <td class="px-6 py-4 text-center text-subtext1">100+ MB</td>
                  </tr>
                  <tr class="hover:bg-surface1/50 transition-colors">
                    <td class="px-6 py-4 text-text">Use Case</td>
                    <td class="px-6 py-4 text-center text-subtext1">Single Purpose</td>
                    <td class="px-6 py-4 text-center text-subtext1">All Features</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation Options */}
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-text mb-6">
              Ready to Get Started?
            </h2>
            <p class="text-subtext1 mb-8">
              Use the interactive installer above to select the satellites you need,
              or install the full runtime for development.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <a
                href="/"
                class="px-6 py-3 bg-blue text-base rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Install Full Runtime
              </a>
              <a
                href="/docs/index"
                class="px-6 py-3 bg-surface1 text-text rounded-lg font-semibold hover:bg-surface2 transition-colors"
              >
                Read Documentation
              </a>
              <a
                href="https://github.com/tryandromeda/andromeda"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3 bg-surface1 text-text rounded-lg font-semibold hover:bg-surface2 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
