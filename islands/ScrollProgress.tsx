// deno-lint-ignore-file no-window
import { useEffect, useState } from "preact/hooks";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight -
        window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    addEventListener("scroll", updateScrollProgress);
    updateScrollProgress(); // Initial calculation

    return () => removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div class="fixed top-0 left-0 right-0 h-1 bg-surface0 z-50">
      <div
        class="h-full bg-gradient-to-r from-text to-subtext0 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
