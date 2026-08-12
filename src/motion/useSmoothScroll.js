import { useLayoutEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Momentum scrolling.
 *
 * This is half of why the reference site reads as expensive. Native wheel
 * scrolling moves in hard steps, so a scrubbed animation attached to it also
 * moves in hard steps. Lenis interpolates the scroll position every frame, and
 * every scrubbed tween inherits that smoothing for free.
 *
 * Lenis must be driven from GSAP's ticker rather than its own rAF loop: two
 * independent loops would read and write scroll in an undefined order and the
 * pinned hero would jitter by a frame.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Native smooth-scroll fights Lenis for the same scroll position.
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // In-page anchors should ease through Lenis too, otherwise a nav click
    // teleports and every scrubbed tween snaps to its end state at once.
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onTick);
      html.style.scrollBehavior = prev;
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
