// PWA Cache Manager - Client-side helper for managing cache
class PWACacheManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Monitor online/offline status
    addEventListener("online", () => {
      this.isOnline = true;
      this.syncWhenOnline();
    });

    addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Monitor user navigation for intelligent preloading
    this.setupNavigationTracking();
  }

  setupNavigationTracking() {
    // Track link hovers for preloading
    document.addEventListener("mouseover", (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link && this.isOnline) {
        this.preloadPage(link.href);
      }
    });

    // Track link clicks
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        this.trackNavigation(link.href);
      }
    });
  }

  async preloadPage(url) {
    if (!("serviceWorker" in navigator)) return;

    try {
      // Check if already cached
      const cache = await caches.open("andromeda-dynamic-v1");
      const cached = await cache.match(url);

      if (!cached) {
        // Fetch and cache the page
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone());
          console.log("[PWA] Preloaded:", url);
        }
      }
    } catch (error) {
      console.log("[PWA] Preload failed:", url, error);
    }
  }

  trackNavigation(url) {
    // Store frequently accessed pages for priority caching
    const visits = JSON.parse(localStorage.getItem("pwa-visits") || "{}");
    visits[url] = (visits[url] || 0) + 1;
    localStorage.setItem("pwa-visits", JSON.stringify(visits));
  }

  async syncWhenOnline() {
    if (!("serviceWorker" in navigator)) return;

    try {
      // Get most visited pages
      const visits = JSON.parse(localStorage.getItem("pwa-visits") || "{}");
      const popularPages = Object.entries(visits)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([url]) => url);

      // Preload popular pages
      for (const url of popularPages) {
        await this.preloadPage(url);
      }

      console.log("[PWA] Synced popular pages:", popularPages);
    } catch (error) {
      console.log("[PWA] Sync failed:", error);
    }
  }

  async getCacheStatus() {
    if (!("caches" in window)) return { supported: false };

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = {
          size: keys.length,
          urls: keys.map((req) => req.url),
        };
      }

      return {
        supported: true,
        online: this.isOnline,
        caches: cacheInfo,
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  }

  async clearCache() {
    if (!("caches" in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log("[PWA] Cache cleared");
      return true;
    } catch (error) {
      console.error("[PWA] Failed to clear cache:", error);
      return false;
    }
  }
}

// Initialize cache manager when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    globalThis.pwaCache = new PWACacheManager();
  });
} else {
  globalThis.pwaCache = new PWACacheManager();
}

// Expose for debugging
globalThis.PWACacheManager = PWACacheManager;
