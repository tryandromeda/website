import { Download, WifiOff } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(globalThis.navigator?.onLine ?? true);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    globalThis.addEventListener?.("online", handleOnline);
    globalThis.addEventListener?.("offline", handleOffline);

    // Check for service worker updates
    if ("serviceWorker" in globalThis.navigator) {
      globalThis.navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          setUpdateAvailable(true);
        },
      );
    }

    return () => {
      globalThis.removeEventListener?.("online", handleOnline);
      globalThis.removeEventListener?.("offline", handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    globalThis.location?.reload();
  };

  if (!isOnline || updateAvailable) {
    return (
      <div class="fixed top-20 right-4 z-40 max-w-sm">
        <div class="bg-surface0 border border-surface1 rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <div class="flex items-center gap-2">
            {!isOnline
              ? (
                <>
                  <WifiOff class="w-4 h-4 text-red" />
                  <span class="text-sm text-text">Offline Mode</span>
                </>
              )
              : updateAvailable
              ? (
                <>
                  <Download class="w-4 h-4 text-blue" />
                  <span class="text-sm text-text">Update Available</span>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    class="ml-auto text-xs bg-blue hover:bg-blue/80 text-base px-2 py-1 rounded transition-colors"
                  >
                    Reload
                  </button>
                </>
              )
              : null}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
