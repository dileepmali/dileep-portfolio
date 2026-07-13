import { useLayoutEffect } from "react";
import gsap from "gsap";

/*
 * Pointer-driven micro-interactions — the "premium" layer you feel the moment
 * you move the mouse (not just on scroll):
 *
 *   • TILT      — cards lean toward the cursor in 3D (rotateX/Y) + lift + scale
 *   • SPOTLIGHT — a soft accent glow follows the cursor inside each card
 *   • MAGNET    — buttons drift toward the cursor and snap back on leave
 *
 * Enabled only on real pointer devices (hover: hover) so touch stays clean.
 * Re-binds per route via the `dep` argument.
 */

const TILT = [
  ".service-card",
  ".proj-card",
  ".pshow-card",
  ".blog-card",
  ".skill-card",
  ".tl-card",
  ".ci-item",
  ".testi-wrap",
];

const MAGNET = [".btn", ".hire-btn", ".cta-form button"];

export function useInteractions(dep) {
  useLayoutEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups = [];

    // ---------------- 3D tilt + spotlight ----------------
    const tiltEls = document.querySelectorAll(TILT.join(","));
    tiltEls.forEach((el) => {
      el.classList.add("rv-spot");
      const MAX = 11; // degrees

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, {
          rotationY: px * MAX,
          rotationX: -py * MAX,
          y: -8,
          scale: 1.03,
          transformPerspective: 900,
          transformOrigin: "center",
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
        el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
      };
      const onLeave = () => {
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.classList.remove("rv-spot");
        gsap.set(el, { clearProps: "transform" });
      });
    });

    // ---------------- magnetic buttons ----------------
    const magEls = document.querySelectorAll(MAGNET.join(","));
    magEls.forEach((el) => {
      const PULL = 0.4;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(el, {
          x: x * PULL,
          y: y * PULL,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set(el, { clearProps: "transform" });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [dep]);
}
