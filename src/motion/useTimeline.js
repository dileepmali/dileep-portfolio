import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

/*
 * A declarative motion engine.
 *
 * Rather than hand-writing a GSAP timeline per element, animations are declared
 * on the markup itself and this hook compiles them. That is the same approach
 * the reference site takes, and it is what lets a page carry 100+ individually
 * timed movements without the JS turning into an unreadable wall of tweens:
 * the choreography lives next to the thing being choreographed.
 *
 *   <h2 data-tl-split="lines" data-tl-from="{'yPercent': 100}">
 *
 *   <div data-tl-type="scroll"          // scrub against the scrollbar
 *        data-tl-trigger=".hero"        // measure against this element
 *        data-tl-start="34% top"        // ...from 34% of its height
 *        data-tl-end="38% top"          // ...to 38%
 *        data-tl-from="{'scale': 0.5, 'opacity': 0}">
 *
 * Percentage-based start/end is the important part. Every hero movement is
 * expressed as a slice of one tall element's scroll range, so the whole opening
 * sequence is a single shared clock rather than dozens of unrelated triggers.
 */

// ---------------------------------------------------------------- helpers --

/*
 * Attribute values are written with single quotes so they survive inside an
 * HTML attribute without escaping every character: {'scale': 0.5}.
 */
function parseVars(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw.replace(/'/g, '"'));
  } catch {
    if (import.meta.env.DEV) console.warn("[tl] could not parse vars:", raw);
    return null;
  }
}

const num = (raw, fallback) => {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
};

const DESKTOP = "(min-width: 1000px)";

/*
 * Resolves once the hero portrait is decoded and ready to paint.
 *
 * `decode()` is the only way to know that — `load` fires when the bytes have
 * arrived, which is well before the browser can put pixels on screen for an
 * image this size.
 *
 * Never rejects and never hangs: a missing, broken or slow image resolves
 * anyway, because the opening sequence failing to start would be a far worse
 * outcome than one element fading in unevenly.
 */
function decodeHeroImage(timeout = 3000) {
  const img = document.querySelector(".hero-photo img");
  if (!img) return Promise.resolve();

  const decoded = img.decode
    ? img.decode().catch(() => {})
    : new Promise((res) => {
        if (img.complete) return res();
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
      });

  return Promise.race([
    decoded,
    new Promise((res) => setTimeout(res, timeout)),
  ]);
}

// ------------------------------------------------------------- the preload --

/*
 * The title card, and the gate in front of everything else.
 *
 * Returns the moment the rest of the page should start, which is a little
 * before this finishes — the hero begins arriving while the blur is still
 * clearing, so the two sequences read as one continuous opening rather than as
 * a loader followed by a website.
 *
 * The blur lives on `#page` and is cleared with `clearProps`. Leaving a filter
 * on that element permanently would make it the containing block for every
 * fixed descendant, which is not a side effect worth carrying for the rest of
 * the session.
 */
function buildPreload(root) {
  const overlay = root.querySelector(".preload");
  const html = document.documentElement;
  if (!overlay || !html.hasAttribute("data-preload")) return 0;

  const name = overlay.querySelector(".preload-name");
  const wordmark = root.querySelector(".hero-wordmark");
  const page = document.getElementById("page");
  const lenis = window.__lenis;

  // Nothing should scroll while the card is up — a scroll here would drive the
  // hero's scrubbed sequence behind an opaque overlay and it would be half
  // spent by the time it was visible.
  lenis?.stop();

  const tl = gsap.timeline({
    onComplete: () => {
      html.removeAttribute("data-preload");
      lenis?.start();
    },
  });

  /*
   * The name's resting place is the hero wordmark's slot near the top of the
   * screen — the loading card shares the hero's geometry, so `y: 0` is already
   * exactly that spot. This measures how far below it the vertical centre of
   * the viewport is, which is where the name arrives before it rises.
   */
  const rect = name.getBoundingClientRect();
  const drop = Math.max(
    0,
    Math.round((window.innerHeight - rect.height) / 2 - rect.top)
  );

  /*
   * 1. The name crosses in from off the right edge, at full size, and stops
   *    centred on the screen.
   *
   *    Nothing scales at any point. The letters are already the right size
   *    before they start moving (see the `.hero-wordmark, .preload-name` rule),
   *    so this animates position only.
   */
  tl.set(page, { filter: "blur(22px)" })
    .set(name, { y: drop })
    .fromTo(
      name,
      { xPercent: 115 },
      { xPercent: 0, duration: 1.1, ease: "power4.out" }
    )
    .addLabel("centred", "+=0.4")

    /*
     * 2. It rises, slowly, into the wordmark's position.
     *
     * 1.8s is far longer than the entrance and that is the point — the arrival
     * is the flourish, this is the settling. `power2.inOut` keeps both ends
     * soft so the move has no visible start or stop, which is what stops a
     * long tween reading as a lag.
     */
    .to(name, { y: 0, duration: 1.8, ease: "power2.inOut" }, "centred")
    .addLabel("settled", ">");

  /*
   * 2. The card dissolves out from under it.
   *
   * Only the ground fades — the name's own opacity is untouched, so the letters
   * simply stay put while the rest of the hero appears around them. The two
   * remaining steps are positioned against `settled` rather than chained so the
   * reveal and the defocus overlap instead of queueing.
   */
  tl.to(
    overlay,
    {
      backgroundColor: "rgba(223,222,206,0)",
      duration: 0.7,
      ease: "power2.inOut",
    },
    // Starts before the rise ends, so the hero materialises around the name
    // while it is still travelling rather than after it has parked.
    "settled-=0.7"
  );

  if (wordmark) {
    // Revealed underneath the loading card's name, at identical coordinates, so
    // dropping the card at the end of the timeline swaps nothing visible.
    tl.set(wordmark, { visibility: "visible" }, "settled");
  }

  // Runs past everything else. If the defocus ended with the reveal there would
  // be nothing to see — the page would simply appear sharp. Letting it finish
  // last is what makes the opening read as pulling into focus.
  tl.to(
    page,
    {
      filter: "blur(0px)",
      duration: 1.3,
      ease: "power2.out",
      clearProps: "filter",
    },
    "settled-=0.7"
  ).set(overlay, { autoAlpha: 0 });

  /*
   * When the hero is allowed to begin.
   *
   * Anchored to `settled` — the instant the name finishes rising — rather than
   * to the timeline's total length, so it stays correct if the tail of this
   * sequence is retimed. Starting 0.6s early puts the portrait's entrance
   * inside the last stretch of the rise, which is the staging that was asked
   * for: the name goes up, the portrait comes in under it, and only then does
   * the rest of the interface follow.
   */
  return Math.max(0, (tl.labels.settled ?? tl.duration()) - 0.6);
}

// ------------------------------------------------------------ the compiler --

/*
 * Walks `root` for annotated elements and builds their tweens. Returns a
 * cleanup that reverts every SplitText, because a split rewrites the element's
 * innerHTML and leaving that behind would break the next build.
 */
function compile(root, isDesktop, onIntroBuilt) {
  const splits = [];

  /*
   * Splitting measures the rendered text, so a split element must keep its own
   * line breaks: `mask: "lines"` wraps each line in an overflow-hidden box,
   * which is what lets a line rise into place instead of merely fading.
   */
  const resolveTargets = (el, d) => {
    if (d.tlSplit) {
      const split = new SplitText(el, { type: d.tlSplit, mask: d.tlSplit });
      splits.push(split);
      return split[d.tlSplit]; // .lines / .words / .chars
    }
    // A group animates its members, not itself. `data-tl-children` names them
    // explicitly; a bare `data-tl-stagger` implies the direct children, since
    // staggering a single element is meaningless and always means "these".
    if (d.tlChildren) return el.querySelectorAll(d.tlChildren);
    if (d.tlStagger !== undefined) return Array.from(el.children);
    return el;
  };

  /*
   * The opening sequence. Elements marked `intro` are not triggered by scroll
   * at all — they join one shared timeline in DOM order and play on load, so
   * the hero arrives as a single choreographed move. Without this they would
   * all be above the fold, every trigger would satisfy at once, and the whole
   * sequence would collapse into one simultaneous flash.
   */
  // Built paused. The caller decides when it may run — see `build()`.
  const intro = gsap.timeline({ paused: true });

  root.querySelectorAll("[data-tl-from], [data-tl-to]").forEach((el) => {
    const d = el.dataset;

    // Viewport gating. The reference ships 96 desktop-only movements and falls
    // back to a plain stacked document on phones; scrubbing a pinned hero on a
    // touch device is where these designs usually come apart.
    if (d.tlDesktop !== undefined && !isDesktop) return;
    if (d.tlMobile !== undefined && isDesktop) return;

    const from = parseVars(d.tlFrom);
    const to = parseVars(d.tlTo);
    if (!from && !to) return;

    const scrubbed = d.tlType === "scroll";
    const isIntro = d.tlType === "intro";

    const targets = resolveTargets(el, d);
    if (!targets || targets.length === 0) return;

    const shared = {
      // A scrubbed tween is positioned by the scrollbar, so its own easing
      // would fight the user's scroll — it must stay linear.
      ease: scrubbed ? "none" : d.tlEase || "expo.out",
      duration: scrubbed ? 1 : num(d.tlDuration, 1.05),
      ...(d.tlStagger ? { stagger: num(d.tlStagger, 0.08) } : {}),
      // Split lines animate as a group by default; a lone element does not.
      ...(d.tlSplit && !d.tlStagger ? { stagger: 0.08 } : {}),
    };

    if (!isIntro) {
      const trigger = (d.tlTrigger && root.querySelector(d.tlTrigger)) || el;
      shared.scrollTrigger = {
        trigger,
        start: d.tlStart || (scrubbed ? "top top" : "top 82%"),
        ...(d.tlEnd ? { end: d.tlEnd } : {}),
        ...(scrubbed ? { scrub: num(d.tlScrub, true) } : { once: true }),
      };
      if (!scrubbed) shared.delay = num(d.tlDelay, 0);
    }

    const make = () => {
      if (from && to) return gsap.fromTo(targets, from, { ...to, ...shared });
      if (from) return gsap.from(targets, { ...from, ...shared });
      return gsap.to(targets, { ...to, ...shared });
    };

    // `data-tl-at` is a GSAP position parameter ("-=0.6", "0", "<") and is what
    // lets intro steps overlap instead of running strictly end to end.
    if (isIntro) intro.add(make(), d.tlAt ?? ">");
    else make();
  });

  onIntroBuilt?.(intro);

  return () => splits.forEach((s) => s.revert());
}

// --------------------------------------------------------------- the Flip --

/*
 * The signature move: an element sitting in the hero physically travels into
 * its slot in the navigation as you scroll, rather than one fading out while
 * the other fades in. Flip.fit measures both boxes and produces the transform
 * that maps one onto the other; parking that tween on a scrubbed ScrollTrigger
 * hands the playhead to the scrollbar.
 *
 * The measurement is only valid from a known scroll position, which is why the
 * page forces itself to the top before this runs.
 */
function compileFlips(root, isDesktop) {
  if (!isDesktop) return;

  root.querySelectorAll("[data-flip-id]").forEach((el) => {
    const d = el.dataset;
    const dest = document.querySelector(`[data-flip-slot="${d.flipId}"]`);
    const trigger = d.flipTrigger && document.querySelector(d.flipTrigger);
    if (!dest || !trigger) return;

    const tween = Flip.fit(el, dest, {
      duration: 1,
      ease: "none",
      paused: true,
      scale: true, // transform-only, so text inside does not reflow mid-flight
    });
    if (!tween) return;

    ScrollTrigger.create({
      trigger,
      start: d.flipStart || "top top",
      end: d.flipEnd || "40% top",
      scrub: true,
      animation: tween,
    });
  });
}

/*
 * A safety net for the last screenful.
 *
 * A reveal starting at "top 82%" needs its element to climb to 82% of the
 * viewport height. Anything close enough to the bottom of the document can
 * never get there — the page runs out of scroll first — so the trigger never
 * fires and the element stays at `opacity: 0` permanently. The footer hit this
 * exactly, and any content added near the end of the page would hit it again.
 *
 * So after every refresh, any non-scrubbed trigger whose start point lies past
 * the maximum scroll offset is completed outright. Content that cannot be
 * animated into view must still be in view.
 */
function revealUnreachable() {
  const max = ScrollTrigger.maxScroll(window);
  ScrollTrigger.getAll().forEach((st) => {
    if (st.vars.scrub || st.start <= max) return;
    st.animation?.progress(1);
  });
}

// ----------------------------------------------------------------- the hook --

export function useTimeline(rootSelector = "body") {
  useLayoutEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;

    // Everything is authored as `.from()`, so the CSS resting state is the
    // finished state. Doing nothing here therefore renders a complete, static
    // page — which is exactly what a reduced-motion visitor should get.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx;
    let cancelled = false;
    let width = window.innerWidth;

    const build = () => {
      const isDesktop = window.matchMedia(DESKTOP).matches;
      ctx = gsap.context(() => {
        // Only the first build shows the title card; a rebuild after a resize
        // must not replay it, so buildPreload gates on the document attribute
        // it clears when it finishes.
        const introDelay = buildPreload(root) || 0.15;

        const revert = compile(root, isDesktop, (intro) => {
          /*
           * The hero waits on two independent things and starts at whichever
           * finishes last: its cue in the opening sequence, and the portrait
           * being decoded and ready to paint.
           *
           * Splitting it this way is the point. The name's arrival runs the
           * moment the fonts land, so the screen is never idle; only the hero
           * behind it holds for the image. Animating an <img> the browser has
           * not finished decoding is what made the entrance stutter — the first
           * frames render nothing, then the decode lands and it snaps in
           * mid-tween.
           */
          Promise.all([
            decodeHeroImage(),
            new Promise((resolve) => gsap.delayedCall(introDelay, resolve)),
          ]).then(() => {
            if (!cancelled) intro.play();
          });
        });

        compileFlips(root, isDesktop);
        return revert;
      }, root);
      // compile() ran synchronously and every `.from()` renders its start
      // state immediately, so by this line the elements are already hidden by
      // GSAP and the CSS pre-paint guard can be lifted in the same frame.
      document.documentElement.removeAttribute("data-motion");
      ScrollTrigger.refresh();
      revealUnreachable();
    };

    /*
     * Only the fonts gate the build. Splitting against a fallback face produces
     * the wrong line breaks, and the loading card is measured against the
     * wordmark's box, which is about to change size.
     *
     * The portrait is deliberately NOT waited on here — see `build()`. Gating
     * everything on a megabyte of PNG means a slow connection stares at an
     * empty screen instead of watching the name arrive.
     */
    document.fonts.ready.then(() => {
      if (!cancelled) build();
    });

    /*
     * Only width matters. Mobile browsers fire resize every time the URL bar
     * slides away, and rebuilding on that would restart the hero mid-scroll.
     */
    let debounce;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (cancelled) return;
        ctx?.revert();
        build();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
    };
  }, [rootSelector]);
}
