// PWA Cache Manager - Client-side helper for managing cache
class PWACacheManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    this.newWorker = null;
    this.setupEventListeners();
    this.initServiceWorker();
  }

  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Check for updates on page load
        registration.addEventListener('updatefound', () => {
          this.newWorker = registration.installing;
          this.newWorker.addEventListener('statechange', () => {
            if (this.newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_UPDATED') {
            this.showUpdateNotification();
          }
        });

        // Check for updates periodically when page is visible
        this.startPeriodicUpdateCheck(registration);

      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  startPeriodicUpdateCheck(registration) {
    // Only check for updates when page is visible
    const checkForUpdates = () => {
      if (!document.hidden && this.isOnline) {
        registration.update();
      }
    };

    // Check every 30 seconds
    setInterval(checkForUpdates, 30000);

    // Also check when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        registration.update();
      }
    });
  }

  showUpdateNotification() {
    // Don't show multiple notifications
    if (document.getElementById('update-notification')) return;
    
    this.updateAvailable = true;
    
    // Create update notification
    const notification = this.createUpdateNotification();
    document.body.appendChild(notification);

    // Auto-hide after 15 seconds if user doesn't interact
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 15000);
  }

  createUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1e1e2e;
        color: #cdd6f4;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        border: 1px solid #313244;
        font-family: system-ui, sans-serif;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="font-weight: 600; margin-bottom: 8px;">
          🚀 Update Available
        </div>
        <div style="font-size: 14px; margin-bottom: 12px; color: #a6adc8;">
          New features and improvements are ready!
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="pwaCacheManager.applyUpdate()" style="
            background: #89b4fa;
            color: #1e1e2e;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            flex: 1;
            transition: all 0.2s;
          " onmouseover="this.style.background='#74c0fc'" onmouseout="this.style.background='#89b4fa'">
            Refresh Now
          </button>
          <button onclick="this.closest('#update-notification').remove()" style="
            background: transparent;
            color: #a6adc8;
            border: 1px solid #45475a;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            flex: 1;
            transition: all 0.2s;
          " onmouseover="this.style.borderColor='#585b70'" onmouseout="this.style.borderColor='#45475a'">
            Later
          </button>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    return notification;
  }

  async applyUpdate() {
    if (this.newWorker) {
      // Tell the new service worker to skip waiting
      this.newWorker.postMessage({ type: 'SKIP_WAITING' });
    }

    // Clear notification
    const notification = document.getElementById('update-notification');
    if (notification) notification.remove();

    // Show loading indicator
    this.showLoadingIndicator();

    // Clear all caches and reload
    await this.clearCache();
    
    // Reload the page to get fresh content
    globalThis.location.reload(true);
  }

  showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'update-loader';
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1e1e2e;
        color: #cdd6f4;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        border: 1px solid #313244;
        font-family: system-ui, sans-serif;
        text-align: center;
      ">
        <div style="margin-bottom: 10px;">🔄 Updating...</div>
        <div style="font-size: 14px; color: #a6adc8;">Getting the latest features</div>
      </div>
    `;
    document.body.appendChild(loader);
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
    if (!("caches" in globalThis)) return false;

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

  // Method to manually check for updates
  async checkForUpdates() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
        console.log("[PWA] Checking for updates...");
      }
    }
  }
}

// Initialize cache manager when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    globalThis.pwaCacheManager = new PWACacheManager();
  });
} else {
  globalThis.pwaCacheManager = new PWACacheManager();
}

// Add keyboard shortcut for manual cache clear (Ctrl+Shift+R)
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyR') {
    event.preventDefault();
    if (globalThis.pwaCacheManager) {
      globalThis.pwaCacheManager.clearCache().then(() => {
        globalThis.location.reload();
      });
    }
  }
});

// Expose for debugging
globalThis.PWACacheManager = PWACacheManager;
