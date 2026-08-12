import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * The sideways run of the project cards.
 *
 * Everything here depends on one number that cannot be authored: how far the
 * row overflows the screen. That is the card width times the number of cards,
 * less the viewport — so it changes with the copy, the breakpoint and the
 * fonts, which is why the runway's height is written from JS rather than set in
 * CSS as some guessed multiple of a screen.
 *
 * The runway is the scroll distance the row needs. Make it equal to the travel
 * and the row moves a pixel sideways for every pixel scrolled, which is the
 * ratio that feels like driving the row rather than watching it: a shorter
 * runway makes it race, a longer one makes it drag.
 */

const DESKTOP = "(min-width: 1000px)";

export function useProjectsRail() {
  useLayoutEffect(() => {
    const rail = document.querySelector(".projects-rail");
    const view = document.querySelector(".projects-view");
    const track = document.querySelector(".projects-track");
    if (!rail || !view || !track) return;

    let ctx;
    let cancelled = false;

    const build = () => {
      rail.style.removeProperty("height");
      gsap.set(track, { clearProps: "x" });

      /*
       * Below the breakpoint the row is an ordinary horizontal scroller the
       * reader swipes — a viewport held still while content moves under it is a
       * fight with a touch device, not a feature of one.
       */
      if (!window.matchMedia(DESKTOP).matches) return;

      const travel = Math.max(0, track.scrollWidth - view.clientWidth);
      // One screen to arrive and settle, plus the distance the row must cover.
      rail.style.height = `${window.innerHeight + travel}px`;
      if (!travel) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // No sideways travel to sit through: the runway collapses and the row
        // becomes a plain scroller, which is reachable by keyboard and by the
        // scrollbar the browser then draws.
        rail.style.removeProperty("height");
        return;
      }

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: -travel,
          ease: "none",
          scrollTrigger: {
            trigger: rail,
            start: "top top",
            // The row finishes exactly as the runway runs out, so the section
            // releases the screen the moment the last card is against the
            // right-hand edge — no held, empty screen at either end.
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, rail);
    };

    const rebuild = () => {
      if (cancelled) return;
      ctx?.revert();
      ctx = null;
      build();
      ScrollTrigger.refresh();
    };

    // Fonts first: the cards are sized in rems and hold type, so a row measured
    // against the fallback face is a row measured at the wrong width.
    document.fonts.ready.then(rebuild);

    /*
     * Width only. Mobile browsers fire resize every time the URL bar slides
     * away, and rebuilding on that would reset the row mid-run — and the height
     * this hook writes would itself be part of what changed.
     */
    let width = window.innerWidth;
    let debounce;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      clearTimeout(debounce);
      debounce = setTimeout(rebuild, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
      rail.style.removeProperty("height");
    };
  }, []);
}
