// deno-lint-ignore-file no-window
import { useEffect } from "preact/hooks";

export default function ScrollAnimations() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
    elementsToAnimate.forEach((el) => {
      animateOnScroll.observe(el);
    });

    const navbar = document.querySelector("nav");
    let isScrolled = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 50;

      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        if (navbar) {
          const navDiv = navbar.querySelector("div");
          if (navDiv) {
            if (isScrolled) {
              navDiv.classList.add("navbar-scrolled");
            } else {
              navDiv.classList.remove("navbar-scrolled");
            }
          }
        }
      }
    };

    addEventListener("scroll", handleScroll, { passive: true });

    const handleParallax = () => {
      const scrollY = window.scrollY;
      const heroLogo = document.querySelector(".hero-logo");
      const heroContent = document.querySelector(".hero-content");

      if (heroLogo && scrollY < window.innerHeight) {
        const speed = scrollY * 0.2; // Reduced for subtlety
        (heroLogo as HTMLElement).style.transform = `translateY(${speed}px)`;
      }

      if (heroContent && scrollY < window.innerHeight) {
        const speed = scrollY * 0.05; // Very subtle
        (heroContent as HTMLElement).style.transform = `translateY(${speed}px)`;
      }
    };

    addEventListener("scroll", handleParallax, { passive: true });

    const handlePageLoad = () => {
      document.body.classList.add("page-loaded");
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      addEventListener("load", handlePageLoad);
    }

    return () => {
      animateOnScroll.disconnect();
      removeEventListener("scroll", handleScroll);
      removeEventListener("scroll", handleParallax);
      removeEventListener("load", handlePageLoad);
    };
  }, []);

  return null;
}
