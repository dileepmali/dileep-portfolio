import { useLayoutEffect } from "react";
import gsap from "gsap";

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * PAGE-TRANSITION WIPE — the cinematic panel sweep you see on every Florée page
 * load and every route change. Three panels cover the screen, then sweep up one
 * after another to reveal the (already-swapped) page underneath. Also fires once
 * on first load as an intro. Re-runs whenever `dep` (the route) changes.
 */
export function usePageTransition(dep) {
  useLayoutEffect(() => {
    if (reduced()) return;
    const wrap = document.querySelector(".page-wipe");
    const panels = document.querySelectorAll(".page-wipe span");
    if (!panels.length) return;

    gsap.killTweensOf(panels);
    gsap.set(wrap, { pointerEvents: "auto" });
    gsap.set(panels, { yPercent: 0 }); // cover the viewport

    gsap.to(panels, {
      yPercent: -101,
      duration: 0.75,
      ease: "power4.inOut",
      stagger: 0.09,
      onComplete: () => gsap.set(wrap, { pointerEvents: "none" }),
    });
  }, [dep]);
}

/*
 * CUSTOM CURSOR — a smoothly-lerped accent ring that follows the pointer and
 * swells over interactive elements (links, buttons, cards). Pure enhancement on
 * top of the native cursor; disabled on touch / coarse pointers. Re-binds its
 * hover targets whenever `dep` (the route) changes.
 */
export function useCursor(dep) {
  useLayoutEffect(() => {
    if (reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, autoAlpha: 1 });
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("pointermove", move);

    const grow = () => cursor.classList.add("is-grow");
    const shrink = () => cursor.classList.remove("is-grow");
    const targets = document.querySelectorAll(
      "a, button, .service-card, .proj-card, .pshow-card, .blog-card, .skill-card, .tl-card, .theme-toggle"
    );
    targets.forEach((t) => {
      t.addEventListener("pointerenter", grow);
      t.addEventListener("pointerleave", shrink);
    });

    return () => {
      window.removeEventListener("pointermove", move);
      targets.forEach((t) => {
        t.removeEventListener("pointerenter", grow);
        t.removeEventListener("pointerleave", shrink);
      });
    };
  }, [dep]);
}
