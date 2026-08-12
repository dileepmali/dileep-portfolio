import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * The thread running through the journey.
 *
 * Each card hangs off a vertical stroke on its outer edge that ends in a dot at
 * the card's floor, and a diagonal runs from that dot to the next card's — so
 * the five cards read as one path zigzagging down the section rather than as
 * five panels that happen to alternate.
 *
 * It is drawn rather than written, because none of it can be authored: every
 * coordinate depends on where the cards actually landed, which depends on the
 * copy in them, the viewport, and the fonts. Markup would have to guess. So the
 * layout is measured once it is settled and the SVG is built from it.
 *
 * Two decisions worth keeping:
 *
 * `offsetLeft` / `offsetTop`, never `getBoundingClientRect`. The cards carry
 * GSAP from-states — they are sitting 48px low and invisible when this runs —
 * and a rect includes that transform while an offset does not. Measuring rects
 * here put every dot 48px above the card it belonged to until the card was
 * scrolled into view.
 *
 * The SVG paints *under* the cards. The diagonal between two dots runs straight
 * through the card it is heading for; the card covering that stretch is what
 * makes the line read as passing behind it rather than across it.
 */

const DESKTOP = "(min-width: 1000px)";
const NS = "http://www.w3.org/2000/svg";

function el(name, attrs) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

/*
 * The curve from one card's dot to the next.
 *
 * A straight rule between two dots reads as a measurement, not as a path — and
 * where two cards sit almost above one another it collapses into a stub. So
 * both ends leave vertically, continuing the stroke the dot is the foot of, and
 * the line turns in the space between: the long crossings sweep, and the short
 * ones bow out into the margin.
 *
 * The bow is inversely proportional to the horizontal distance, which is the
 * whole trick. Two dots a screen apart already have all the curve they need
 * from the vertical tangents alone and get none added; two dots a hundred
 * pixels apart get the full bow, and it is what stops the second step of the
 * staircase looking like a dropped vertical.
 */
function curve(a, b) {
  const dy = b.bottom - a.bottom;
  const dx = b.x - a.x;
  const bow = Math.max(0, 190 - Math.abs(dx) * 0.45);
  // Outwards means away from the cards: right of a right-hand stroke, left of a
  // left-hand one. Bowing the other way would run the line under the card.
  const c1 = a.x + (a.right ? bow : -bow);
  const c2 = b.x + (b.right ? bow : -bow);
  const reach = dy * 0.45;

  return `M ${a.x} ${a.bottom} C ${c1} ${a.bottom + reach} ${c2} ${
    b.bottom - reach
  } ${b.x} ${b.bottom}`;
}

export function useJourneyWire() {
  useLayoutEffect(() => {
    const wire = document.querySelector(".about-wire");
    const track = document.querySelector(".about-track");
    if (!wire || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    let ctx;
    let cancelled = false;

    const build = () => {
      wire.replaceChildren();
      // Below the breakpoint the cards stack in one column and there is no
      // zigzag to trace — a stroke down the side of every card would just be
      // five vertical lines.
      if (!window.matchMedia(DESKTOP).matches) return;

      const cards = Array.from(track.querySelectorAll(".about-card"));
      if (cards.length < 1) return;

      const w = track.offsetWidth;
      const h = track.offsetHeight;
      wire.setAttribute("viewBox", `0 0 ${w} ${h}`);
      wire.setAttribute("width", w);
      wire.setAttribute("height", h);

      // How far outside the card the stroke stands. Lives in CSS so the lane
      // reserved by the step's padding and the line drawn in it cannot drift
      // apart — they are the same number.
      const lane =
        parseFloat(getComputedStyle(track).getPropertyValue("--wire-lane")) ||
        22;

      /*
       * One gradient per stroke, and they have to live in user space.
       *
       * A stem is a vertical line, so its bounding box is zero pixels wide —
       * and a gradient in `objectBoundingBox` units (the default) is undefined
       * on a box with no width, which paints nothing at all. Giving each one the
       * stem's own coordinates sidesteps that, at the cost of a gradient per
       * card and a rebuild whenever the layout moves. Both are already true of
       * everything else here.
       */
      const defs = el("defs", {});
      wire.append(defs);

      const parts = cards.map((card, i) => {
        // Only the flush-right stop hangs its stroke off the card's right edge.
        // The two left-hand stops both keep theirs on the left, which is what
        // lets the curve between them bow outwards into the margin.
        const right = card.closest(".about-step").dataset.side === "right";
        const x = right
          ? card.offsetLeft + card.offsetWidth + lane
          : card.offsetLeft - lane;
        const top = card.offsetTop;
        const bottom = card.offsetTop + card.offsetHeight;

        /*
         * The stroke fades down its own length: full weight where it meets the
         * card's shoulder, almost nothing by the time it reaches the dot. That
         * is what stops a plain rule beside every card reading as a border —
         * it has a top and a bottom, so it belongs to the path rather than to
         * the panel.
         *
         * The gradient is anchored to the card's top and bottom, not to the
         * line's own direction, so reversing the line below to draw it upwards
         * leaves the shading where it is.
         */
        const fade = el("linearGradient", {
          id: `about-wire-fade-${i}`,
          gradientUnits: "userSpaceOnUse",
          x1: x,
          y1: top,
          x2: x,
          y2: bottom,
        });
        /*
         * Three stops, not two. A straight fade from full ink to nothing spends
         * its whole length half-there; holding the weight through the first
         * half and letting go over the second is what gives the stroke a body
         * and a tail rather than an even wash.
         */
        fade.append(
          el("stop", { class: "about-wire-fade-top", offset: "0" }),
          el("stop", { class: "about-wire-fade-mid", offset: "0.55" }),
          el("stop", { class: "about-wire-fade-foot", offset: "1" })
        );
        defs.append(fade);

        // Drawn from the dot upwards, not from the card's shoulder down. The
        // stroke reveals from its own start point, and this stroke arrives from
        // below with everything else.
        const stem = el("line", {
          class: "about-wire-stem",
          stroke: `url(#about-wire-fade-${i})`,
          x1: x,
          y1: bottom,
          x2: x,
          y2: top,
        });
        const dot = el("circle", { class: "about-wire-dot", cx: x, cy: bottom, r: 6 });

        return { card, x, top, bottom, stem, dot, right, i };
      });

      /*
       * Painted in one pass, and in this order, because SVG has no z-index: the
       * diagonals go down first so a dot always sits on top of the line that
       * arrives at it.
       */
      parts.forEach((p, i) => {
        if (i > 0) {
          const prev = parts[i - 1];
          p.link = el("path", { class: "about-wire-link", d: curve(prev, p) });
          wire.append(p.link);
        }
      });
      parts.forEach((p) => wire.append(p.stem));
      parts.forEach((p) => wire.append(p.dot));

      // Everything is authored as a `.from()`, so the drawn wire above is the
      // resting state — a reduced-motion visitor gets the finished diagram.
      if (reduced) return;

      ctx = gsap.context(() => {
        parts.forEach((p) => {
          // The opening card is already on screen when the section arrives, so
          // its stroke and dot are simply there — same as the card itself.
          if (p.i === 0) return;

          /*
           * Each segment draws itself as its own card arrives, so the path is
           * always one step ahead of the reader rather than laid out in
           * advance. The link is first: the line reaches down to the new card
           * before the card's own stroke and dot appear under it.
           *
           * Scrubbed against the same range the card rises through, so the line
           * and the panel it belongs to are driven by one thing — the reader's
           * scrolling. On a timer they would drift apart the moment somebody
           * scrolled at any speed but the one they were tuned at.
           */
          const tl = gsap.timeline({
            scrollTrigger: {
              // The row, not the card — the card is 140px low at measurement
              // time and would put this stroke on a different clock from the
              // panel it belongs to. See the note on the card's own trigger.
              trigger: p.card.closest(".about-step"),
              start: "top bottom",
              end: "top 58%",
              scrub: true,
            },
          });

          // A scrubbed tween is positioned by the scrollbar, so its own easing
          // would fight the reader's scroll — these have to stay linear.
          if (p.link) {
            const len = p.link.getTotalLength();
            gsap.set(p.link, { strokeDasharray: len });
            tl.from(p.link, {
              strokeDashoffset: len,
              duration: 0.9,
              ease: "none",
            });
          }

          const stemLen = Math.max(1, p.bottom - p.top);
          gsap.set(p.stem, { strokeDasharray: stemLen });
          tl.from(
            p.stem,
            { strokeDashoffset: stemLen, duration: 0.7, ease: "none" },
            p.link ? "-=0.35" : 0
          );

          tl.from(
            p.dot,
            {
              scale: 0,
              transformOrigin: "center",
              // `back.out` on a six-pixel circle is the whole difference between
              // the dot landing and the dot merely existing. It is the one ease
              // kept under the scrub: the segment is short enough that scrolling
              // back through it reads as the dot retracting, not as a wobble.
              ease: "back.out(2.4)",
              duration: 0.45,
            },
            "-=0.2"
          );
        });
      }, wire);
    };

    const rebuild = () => {
      if (cancelled) return;
      ctx?.revert();
      ctx = null;
      build();
      ScrollTrigger.refresh();
    };

    /*
     * Fonts first. Every measurement here is the height of a card full of type,
     * and a card set in the fallback face is a different height — building
     * before the swap put every dot a line or two off its card's floor.
     */
    document.fonts.ready.then(rebuild);

    /*
     * The track changes height for reasons a resize listener never sees: a card
     * rewrapping, an image finally laying out. Observing the box catches those
     * as well as the window, and the SVG is absolutely positioned so writing to
     * it cannot feed back into what is being observed.
     */
    let debounce;
    const observer = new ResizeObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(rebuild, 180);
    });
    observer.observe(track);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      observer.disconnect();
      ctx?.revert();
      wire.replaceChildren();
    };
  }, []);
}
