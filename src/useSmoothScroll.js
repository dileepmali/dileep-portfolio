import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Global momentum (smooth) scrolling via Lenis, synced to GSAP ScrollTrigger —
 * the same "buttery luxury" feel as the Florée site. Lenis drives the real
 * window scroll (so every scrubbed animation eases instead of snapping) while
 * position:sticky, reveals and hash links keep working. UI/layout untouched:
 * this only changes HOW the page scrolls, not how it looks.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    // respect users who ask for less motion — no smooth scroll for them
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    window.__lenis = lenis;

    // slim gradient scroll-progress bar pinned to the very top of the page
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);

    // drive Lenis from GSAP's ticker so scrubbed ScrollTriggers stay perfectly synced
    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      bar.style.transform = `scaleX(${e.progress || 0})`;
    });
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // native CSS smooth-scroll fights Lenis — turn it off while Lenis is active
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // in-page hash links (#contact, #about …) should ease via Lenis too.
    // HashRouter route links ("#/about") have no matching id, so they safely
    // fall through to the router untouched.
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href").split("#")[1];
      const target = hash && document.getElementById(hash);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      html.style.scrollBehavior = prevBehavior;
      bar.remove();
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
