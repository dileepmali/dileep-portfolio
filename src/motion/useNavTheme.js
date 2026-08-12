import { useEffect } from "react";
import gsap from "gsap";

/*
 * The drawer's ink, card by card.
 *
 * The rail is fixed and full-height, and the page it sits over is not one
 * colour: the dark sections now run the full width of the window, so the edge
 * between bone and black sweeps vertically straight through the drawer.
 *
 * A single switch for the whole rail cannot be right while that edge is
 * crossing it. Whichever line you pick to test — the top, the middle — the
 * cards on the other side of it wear the wrong dress for the half-screen it
 * takes the edge to pass: black type on black, or a bone card on a photograph.
 * The previous version tested one line and, because it measured the rail's
 * height expecting a top bar, that line was the middle of the window — so half
 * the drawer was always wrong through the whole of the About/Projects handover.
 *
 * So each card is asked the question separately: is the point behind *me* dark?
 * The edge then wipes down the drawer, inverting each card as it reaches it,
 * and the colour transitions already on these elements turn each flip into a
 * fade rather than a cut.
 *
 * Per frame this is a handful of rect reads, and only on frames where the
 * scroll position actually moved — cheaper than the layout the browser has
 * already done to hand them over.
 */

/*
 * The cards, plus the two things inside them tall enough to need their own
 * answer: the menu is most of a card's height, and the sentence under the
 * masthead is the rest of that one. Everything else in the drawer is a line or
 * a pill, short enough that its card's answer is its own.
 */
const CARDS =
  ".rail-brand, .rail-stats, .rail-links, .rail-ticker, .rail-email, .rail-link, .rail-note";

export function useNavTheme() {
  useEffect(() => {
    const cards = [...document.querySelectorAll(CARDS)];
    const sections = [...document.querySelectorAll("[data-nav-dark]")];
    if (!cards.length || !sections.length) return;

    const apply = () => {
      // Read every dark section once, not once per card.
      const bands = sections.map((s) => {
        const r = s.getBoundingClientRect();
        return [r.top, r.bottom];
      });

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        // The card's own middle. Its top would flip a tall card while most of
        // it is still over bone, its bottom while most of it is already over
        // black; the middle is the point at which the flip is the lesser error
        // either side of it.
        const mid = r.top + r.height / 2;
        const dark = bands.some(([top, bottom]) => mid >= top && mid < bottom);
        card.classList.toggle("on-dark", dark);
      });
    };

    apply();

    /*
     * Driven from GSAP's ticker rather than a scroll listener: Lenis moves the
     * page from that same ticker, so this reads the position in the frame it
     * was written, and the drawer cannot lag the page by a frame. The scroll
     * check makes an idle frame free.
     */
    let last = -1;
    const tick = () => {
      if (window.scrollY === last) return;
      last = window.scrollY;
      apply();
    };
    gsap.ticker.add(tick);

    // Layout changes move the cards without moving the page.
    const onResize = () => {
      last = -1;
      apply();
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      cards.forEach((card) => card.classList.remove("on-dark"));
    };
  }, []);
}
