const CACHE_VERSION = "v23"; // Increment this when you have new features
const STATIC_CACHE = `andromeda-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `andromeda-dynamic-${CACHE_VERSION}`;

// Detect local development host where we don't want service worker caching
const IS_LOCALHOST_DEV = self.location &&
  self.location.hostname === "localhost" && self.location.port === "8000";

// Define what to cache
const STATIC_ASSETS = [
  // Core pages
  "/",
  "/offline",

  // Documentation pages
  "/docs",
  "/docs/index",
  "/docs/installation",
  "/docs/quick-start",
  "/docs/cli-reference",
  "/docs/configuration",
  "/docs/building",
  "/docs/testing",
  "/docs/troubleshooting",
  "/docs/faq",
  "/docs/contributing",

  // API documentation
  "/docs/api",
  "/docs/api/index",
  "/docs/api/console",
  "/docs/api/fetch",
  "/docs/api/file-system",
  "/docs/api/canvas",
  "/docs/api/crypto",
  "/docs/api/performance",
  "/docs/api/process",
  "/docs/api/time",
  "/docs/api/url",
  "/docs/api/web",
  "/docs/api/sqlite",
  "/docs/api/web-storage",
  "/docs/api/cron",
  "/docs/api/cache-storage",
  "/docs/api/file",
  "/docs/api/streams",
  "/docs/api/import-maps",

  // Examples
  "/docs/examples",
  "/docs/examples/index",
  "/docs/examples/fizzbuzz",
  "/docs/examples/sqlite",

  // Blog
  "/blog",

  // Install scripts (for offline reference)
  "/install.sh",
  "/install.ps1",
  "/install.bat",

  // Static assets
  "/static/styles.css",
  "/logo.svg",
  "/favicon.ico",
  "/manifest.json",
];

// Files that should always be fetched from network
const NETWORK_FIRST = [
  "/health",
  "/blog/rss.xml",
  "/blog/atom.xml",
  "/blog/feed.json",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
];

// Patterns for dynamic routes that should be cached
const CACHEABLE_PATTERNS = [
  /^\/docs\/.*$/,
  /^\/blog\/.*$/,
  /^\/install\.(sh|ps1|bat)$/,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  if (IS_LOCALHOST_DEV) {
    console.log("[SW] Detected localhost:8000 - skipping precache in dev mode");
    // Just skip waiting so dev reloads aren't blocked by precache
    event.waitUntil(self.skipWaiting());
    return;
  }

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log("[SW] Caching static assets...");
          return cache.addAll(STATIC_ASSETS);
        }),

      // Discover and cache blog posts
      fetch("/blog")
        .then((response) => response.text())
        .then((html) => {
          // Extract blog post URLs from the blog index page
          const blogUrls = [];
          const linkRegex = /href="(\/blog\/[^"]+)"/g;
          let match;
          while ((match = linkRegex.exec(html)) !== null) {
            if (
              !match[1].includes("/rss.xml") &&
              !match[1].includes("/atom.xml") &&
              !match[1].includes("/feed.json")
            ) {
              blogUrls.push(match[1]);
            }
          }

          // Cache discovered blog posts
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              console.log("[SW] Caching discovered blog posts:", blogUrls);
              return Promise.allSettled(
                blogUrls.map((url) =>
                  fetch(url)
                    .then((response) =>
                      response.ok ? cache.put(url, response) : null
                    )
                    .catch(() => null)
                ),
              );
            });
        })
        .catch(() => console.log("[SW] Could not discover blog posts")),

      // Cache documentation structure
      fetch("/docs")
        .then((response) => response.text())
        .then((html) => {
          // Extract documentation URLs
          const docUrls = [];
          const linkRegex = /href="(\/docs\/[^"]+)"/g;
          let match;
          while ((match = linkRegex.exec(html)) !== null) {
            if (!docUrls.includes(match[1])) {
              docUrls.push(match[1]);
            }
          }

          // Cache discovered documentation pages (use cache helper)
          return Promise.allSettled(
            docUrls.map((url) =>
              fetch(url)
                .then((
                  response,
                ) => (response.ok ? cacheIfAllowed(url, response) : null))
                .catch(() => null)
            ),
          );
        })
        .catch(() =>
          console.log("[SW] Could not discover documentation pages")
        ),
    ])
      .then(() => {
        console.log("[SW] All assets cached successfully");
        // Don't skip waiting automatically - let user choose when to update
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache assets:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete all caches that don't match current version
            if (
              !cacheName.includes(CACHE_VERSION) ||
              (!cacheName.startsWith("andromeda-static-") &&
                !cacheName.startsWith("andromeda-dynamic-"))
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Service worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external domains
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // If running on localhost:8000 during development, always go to network
  if (IS_LOCALHOST_DEV) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first strategy for dynamic content
  if (NETWORK_FIRST.some((path) => url.pathname.startsWith(path))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            cacheIfAllowed(request, responseClone);
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
    return;
  }
  // Special handling for blog posts and documentation paths
  if (
    url.pathname.startsWith("/blog/") ||
    url.pathname.startsWith("/docs/") ||
    CACHEABLE_PATTERNS.some((pattern) => pattern.test(url.pathname))
  ) {
    event.respondWith(
      // Try network first for these pages to get fresh content
      fetch(request)
        .then((response) => {
          if (response.ok) {
            // Cache the fresh response
            const responseClone = response.clone();
            cacheIfAllowed(request, responseClone);
            return response;
          }

          // If network fails or returns error, fall back to cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // Handle 404s with appropriate fallbacks
            if (response.status === 404) {
              if (url.pathname.startsWith("/blog/")) {
                return caches.match("/blog") || response;
              } else if (url.pathname.startsWith("/docs/")) {
                return caches.match("/docs") || response;
              }
            }
            return response;
          });
        })
        .catch(() => {
          // Network completely failed, try cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }

              // No cache either, serve appropriate fallback
              if (url.pathname.startsWith("/blog/")) {
                return caches.match("/blog") ||
                  caches.match("/offline") ||
                  generateOfflinePage(
                    "Blog Post Unavailable",
                    "This blog post is not available offline.",
                  );
              } else if (url.pathname.startsWith("/docs/")) {
                return caches.match("/docs") ||
                  caches.match("/offline") ||
                  generateOfflinePage(
                    "Documentation Unavailable",
                    "This documentation page is not available offline.",
                  );
              }

              return generateOfflinePage(
                "Page Unavailable",
                "This page is not available offline.",
              );
            });
        }),
    );
    return;
  }

  // Cache-first strategy for static content
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response;
            }

            const responseClone = response.clone();

            // Cache the response
            cacheIfAllowed(request, responseClone);

            return response;
          })
          .catch(() => {
            // Network failed, try to serve offline page for navigation requests
            if (request.destination === "document") {
              return caches.match("/offline") ||
                caches.match("/") ||
                generateOfflinePage("Offline", "You are currently offline.");
            }

            throw error;
          });
      }),
  );
});

// Trim cache helper
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    const deleteCount = keys.length - maxItems;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Cache response helper: skip images, videos, fonts to avoid large caches
async function cacheIfAllowed(
  request,
  response,
  cacheName = DYNAMIC_CACHE,
  maxItems = 50,
) {
  try {
    if (!response || !response.ok) return;
    const ct = (response.headers && response.headers.get &&
      response.headers.get("content-type")) || "";
    if (
      ct.startsWith("image/") || ct.includes("video") || ct.includes("font") ||
      ct.includes("audio")
    ) {
      // skip caching large media files
      return;
    }
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    await trimCache(cacheName, maxItems);
  } catch (e) {
    // Don't let caching failures break the response
    console.warn("[SW] cacheIfAllowed failed", e);
  }
}

// Helper function to generate offline pages
function generateOfflinePage(title, message) {
  return new Response(
    `<!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>${title} - Andromeda</title>
       <link rel="stylesheet" href="/static/styles.css">
       <link rel="icon" href="/logo.svg">
     </head>
     <body class="min-h-screen bg-base text-text">
       <div class="min-h-screen flex items-center justify-center px-4">
         <div class="text-center max-w-md">
           <div class="text-6xl mb-6 opacity-20">📡</div>
           <h1 class="text-3xl font-bold mb-4">${title}</h1>
           <p class="text-subtext1 mb-6">${message}</p>
           <div class="space-y-2">
             <a href="/" class="block bg-blue hover:bg-blue/80 text-base px-4 py-2 rounded transition-colors">
               Home
             </a>
             <a href="/docs/index" class="block border border-surface1 hover:border-surface2 text-text px-4 py-2 rounded transition-colors">
               Documentation
             </a>
           </div>
         </div>
       </div>
     </body>
     </html>`,
    {
      headers: { "Content-Type": "text/html" },
    },
  );
}

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Optionally refresh critical data when back online
      fetch("/health")
        .then(() => console.log("[SW] Background sync completed"))
        .catch(() => console.log("[SW] Background sync failed")),
    );
  }
});

// Handle messages from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update available!",
    icon: "/logo.svg",
    badge: "/logo.svg",
    tag: "andromeda-update",
    requireInteraction: false,
    actions: [
      {
        action: "view",
        title: "View Update",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Andromeda Documentation", options),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(
      self.clients.openWindow("/"),
    );
  }
});
