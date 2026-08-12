import { useEffect, useState } from "react";
import { ME, NAV, SOCIALS, TICKER } from "../data";

// Every hero-driven movement is a slice of the hero's own scroll range, so the
// whole opening runs off one clock. Writing them as percentages here keeps the
// sequence readable as a score rather than a pile of magic strings.
const at = (start, end) => ({
  "data-tl-type": "scroll",
  "data-tl-trigger": ".hero",
  "data-tl-start": `${start}% top`,
  "data-tl-end": `${end}% top`,
  "data-tl-desktop": "",
});

/*
 * The rail: a left-hand drawer that assembles out of the hero as it scrolls
 * away, in place of the horizontal bar this used to be.
 *
 * The order of the blocks is the order the hero sheds them — mark, note, stats,
 * links — so each one appears to travel from where it was in the hero into its
 * slot here rather than fading in from nowhere. Every block is scrubbed against
 * the hero's own range, which is what ties the movement to the scrollbar
 * instead of to a duration: stop scrolling and the drawer stops with you.
 *
 * Below 1000px none of this compiles (`data-tl-desktop`), and the rail lays
 * itself out as an ordinary top bar instead — a fixed 15vw column would eat a
 * phone screen.
 */
export default function Nav() {
  // LinkedIn only for now. The GitHub entry stays in the data so it can be
  // switched on by adding it here once there is a profile to point at.
  const linkedin = SOCIALS.find((s) => s.label === "LinkedIn");
  const active = useActiveSection();

  return (
    <header className="nav rail">
      <div className="rail-inner tl-hide">
        {/*
         * The destination of the hero monogram's flight. It is invisible for
         * the first fifth of the page but must still occupy its box the whole
         * time — Flip measures this element to work out where to land, so it
         * is laid out first and revealed second.
         */}
        {/*
         * Nothing in the rail slides in from the left any more: everything with
         * a counterpart in the hero arrives by flying out of it, and a second
         * copy sliding in beside the one in flight is what put two of each on
         * screen at once.
         *
         * Opacity only for a second reason as well — this block holds the
         * wordmark's landing box, and Flip measures that box after from-states
         * are applied, so an `x` here would be measured into the flight and land
         * the name 40px off.
         */}
        <div className="rail-brand">
          <CardBg from={10} to={18} />
          <div className="rail-head">
            {/*
             * The wordmark's landing box, and the full name rather than initials.
             *
             * The hero's letters fly into this box, and Flip maps one rectangle
             * onto another — a six-letter word landing in a square monogram would
             * have to distort to fit. The reference's chip is its wordmark shrunk
             * down for the same reason.
             */}
            <span
              className="rail-mark"
              data-flip-slot="mark"
              // Held back until the flight lands. The card around it finishes
              // opening at 18%, but the hero's name is still in the air until
              // 30% — showing this any earlier put two DILEEPs on screen.
              {...at(30, 33)}
              data-tl-from="{'opacity': 0}"
            >
              {ME.name.split(" ")[0].toUpperCase()}
            </span>
            {linkedin && (
              <div
                className="rail-socials"
                // Nothing inside a card appears before the card does. Without
                // its own declaration this group inherited none and sat on the
                // hero from the first frame.
                {...at(18, 21)}
                data-tl-from="{'opacity': 0}"
              >
                <Social {...linkedin} />
              </div>
            )}
          </div>

          {/*
           * The landing box for the hero's note, and the copy that takes over
           * once it arrives.
           *
           * Opacity only, and no `x`: Flip measures this element to work out
           * where the hero's copy has to fly to, and a from-state that moved it
           * would be measured in its shifted position — the flight would land
           * 40px to the left of where the note actually sits.
           *
           * The fade starts at 30%, which is where the flight ends, so the two
           * copies cross over in the same box at the same size.
           */}
          <p
            className="rail-note"
            data-flip-slot="note"
            {...at(30, 33)}
            data-tl-from="{'opacity': 0}"
          >
            {ME.lead}
          </p>
        </div>

        <div className="rail-stats">
          <CardBg from={14} to={22} />
          {ME.stats.map((s, i) => (
            <div
              className="rail-stat"
              key={s.label}
              data-flip-slot={`stat-${i}`}
              {...at(30, 33)}
              data-tl-from="{'opacity': 0}"
            >
              <span className="rail-stat-value">{s.value}</span>
              <span className="rail-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <nav className="rail-links">
          <CardBg from={18} to={26} />
          {NAV.map((item, i) => {
            // A link only where there is a section to reach. The rest are
            // listed but inert — see the note on NAV in data.js.
            const Tag = item.href ? "a" : "span";
            return (
              <Tag
                key={item.label}
                href={item.href || undefined}
                className="rail-link"
                data-empty={item.href ? undefined : "true"}
                // Staggered by trigger offset rather than by a stagger value,
                // so the rhythm is tied to scroll distance and survives any
                // scroll speed.
                {...at(26 + i * 0.7, 29 + i * 0.7)}
                data-tl-from="{'opacity': 0}"
                // Set from the scroll position rather than from a click, so the
                // highlight is still right when the reader arrives by scrolling.
                aria-current={
                  item.href && active === item.href ? "true" : undefined
                }
              >
                <NavIcon label={item.label} />
                {item.label}
              </Tag>
            );
          })}
        </nav>

        {/*
         * The ticker. The only block in the rail with no counterpart in the
         * hero — nothing flies into it, so it simply opens like the cards
         * around it and starts running.
         */}
        <div className="rail-ticker">
          <CardBg from={22} to={28} />
          <div
            className="rail-ticker-view"
            {...at(26, 30)}
            data-tl-from="{'opacity': 0}"
          >
            <div className="rail-ticker-track">
              {/*
               * The list twice over. The track scrolls exactly half its own
               * width and resets, so the second copy is what occupies the strip
               * at the moment the first one runs out — that is what makes the
               * loop seamless rather than a jump back to the start.
               */}
              <TickerRun />
              <TickerRun aria-hidden />
            </div>
          </div>
        </div>

        <div className="rail-email">
          <CardBg from={25} to={31} />
          {/* A field inside the card rather than plain text on it — the address
              is something to be taken away, and an inset well says that in a
              way a line of copy does not. */}
          <div
            className="rail-email-inset"
            {...at(30, 33)}
            data-tl-from="{'opacity': 0}"
          >
            <a className="rail-email-link" href={`mailto:${ME.email}`}>
              {ME.email}
            </a>
            <CopyButton value={ME.email} />
          </div>
        </div>

        <a
          className="rail-cta"
          href={`mailto:${ME.email}`}
          {...at(28, 33)}
          data-tl-from="{'opacity': 0}"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

/*
 * A card's chrome, on its own element.
 *
 * The growth cannot go on the card itself. Two of these cards hold the boxes
 * Flip measures to aim the hero's flights, and Flip measures them after
 * from-states are applied — a card scaled to nothing at measurement time would
 * send the name and the note flying into a point in its top-left corner.
 *
 * So the card keeps its layout box untouched and only its background grows:
 * absolutely positioned over the card, scaled from the top-left corner out to
 * full size. What the reader sees is the panel unfolding into place while the
 * hero's text arrives inside it.
 */
function CardBg({ from, to }) {
  return (
    <span
      className="rail-cardbg"
      aria-hidden="true"
      {...at(from, to)}
      data-tl-from="{'scaleX': 0, 'scaleY': 0}"
    />
  );
}

/*
 * Copies the address to the clipboard and says so.
 *
 * `navigator.clipboard` is unavailable on insecure origins and can be refused
 * outright, so the failure path matters: the button falls back to selecting
 * nothing and simply does not claim success. The label swap is the only
 * feedback — a toast for two words would be more machinery than the act needs.
 */
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard refused — leave the button as it was rather than reporting a
      // copy that did not happen.
    }
  };

  return (
    <button
      type="button"
      className="rail-email-copy"
      onClick={copy}
      aria-label={copied ? "Address copied" : `Copy ${value}`}
      data-copied={copied ? "true" : undefined}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {copied ? (
          <path d="M9.6 16.2 4.8 11.4l1.4-1.4 3.4 3.4 8-8 1.4 1.4-9.4 9.4Z" />
        ) : (
          <path d="M9 3h9a2 2 0 0 1 2 2v11h-2V5H9V3ZM6 7h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0 2v10h8V9H6Z" />
        )}
      </svg>
    </button>
  );
}

function TickerRun({ "aria-hidden": hidden }) {
  return (
    <ul className="rail-ticker-run" aria-hidden={hidden ? "true" : undefined}>
      {TICKER.map((item) => (
        <li key={item.label} data-group={item.group}>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/*
 * The menu icons.
 *
 * Keyed by label rather than carried in `data.js`: the icon is presentation,
 * and the data file is the one place a non-developer should be able to edit
 * without meeting an SVG path. An unknown label simply renders no icon.
 *
 * All five share a 24-box and `currentColor`, so they take the pill's colour
 * in every state — including the yellow active pill and the inverted rail over
 * dark sections — without a single extra rule.
 */
const ICONS = {
  Home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3V10.5Z",
  "About me":
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z",
  Projects:
    "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
  "What you get":
    "m12 3 9 4.5-9 4.5-9-4.5L12 3Zm9 8.25-9 4.5-9-4.5L4.9 10.3 12 13.8l7.1-3.5 1.9.95Zm0 4.5-9 4.5-9-4.5 1.9-.95L12 18.3l7.1-3.5 1.9.95Z",
  // An envelope: the contact section is an email address and nothing else.
  Contact:
    "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 4.85 8-4.85V7H4Zm16 2.75-7.48 4.53a1 1 0 0 1-1.04 0L4 9.75V17h16V9.75Z",
};

function NavIcon({ label }) {
  const path = ICONS[label];
  if (!path) return null;
  return (
    <svg
      className="rail-link-icon"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

/*
 * A social chip.
 *
 * Renders as a link only when there is somewhere to go. With `href: null` still
 * in the data it draws the same chip as a plain span instead — the drawer keeps
 * its shape, and a reader who clicks it is not sent to the top of the page by a
 * dead `#`. Filling the URL in `SOCIALS` turns it into a real link.
 */
function Social({ label, href }) {
  const Tag = href ? "a" : "span";
  return (
    <Tag
      className="rail-social"
      href={href || undefined}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer" : undefined}
      aria-label={label}
      title={label}
    >
      {/* Inline, because a strict icon set is not worth a dependency for one
          glyph — and an inline path inherits `currentColor`, so the chip's
          inverted state over dark sections comes for free. */}
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.4 8.75 22 11 22 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.37 1.6-2.37 3.27V21h-4V9Z" />
      </svg>
    </Tag>
  );
}

/*
 * Which section the reader is actually looking at.
 *
 * Measured rather than observed. An IntersectionObserver reports a section's
 * `intersectionRatio`, which is a fraction of that section's *own* height — the
 * hero is a viewport and a half tall and About is one screen, so the hero reads
 * as barely visible at the exact moment it fills the display. Comparing those
 * two numbers picks the wrong section. What matters is how much of the screen
 * each one covers, which is a measurement in pixels.
 *
 * The band is the top half of the viewport, which is where a section reads as
 * "current" — over the whole viewport two sections are in view for most of a
 * scroll and the highlight flickers between them.
 *
 * Three rectangles per frame, and only on frames that actually scrolled, so
 * this is cheaper than it looks — `getBoundingClientRect` on an element with no
 * pending style change is a read out of the current layout, not a reflow.
 */
function useActiveSection() {
  const [active, setActive] = useState(NAV.find((n) => n.href)?.href ?? null);

  useEffect(() => {
    // Filtered before the query: `querySelector(null)` throws, and half the
    // menu has no section to point at yet. Kept in menu order, which is also
    // document order — the tie-break below depends on that.
    const targets = NAV.filter((n) => n.href)
      .map((n) => ({ href: n.href, el: document.querySelector(n.href) }))
      .filter((t) => t.el);
    if (!targets.length) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const band = window.innerHeight * 0.5;
      let claimed = null;
      let widest = null;
      let cover = 0;

      targets.forEach((t) => {
        // A section GSAP is still holding hidden is not on screen, whatever its
        // rectangle says — About sits under the hero's transparent panel for a
        // third of the page before it is uncovered.
        if (getComputedStyle(t.el).visibility === "hidden") return;

        const r = t.el.getBoundingClientRect();
        const seen = Math.min(r.bottom, band) - Math.max(r.top, 0);

        /*
         * The last section holding the majority of the band wins.
         *
         * Comparing areas alone cannot switch this in time. About is pulled a
         * full viewport up over the hero's tail, so the hero's rectangle covers
         * the band completely for that entire stretch — by area it stays ahead
         * until About has finished climbing, which is half a screen after the
         * reader is plainly looking at About. Taking the *later* of the
         * sections that hold the band's majority hands the highlight over as
         * soon as About is the thing on screen rather than when it comes to
         * rest, which is what a menu is for.
         *
         * It costs nothing at the ordinary handovers further down the page: two
         * stacked sections both pass half the band at the same instant, so the
         * later one taking it is the same moment an area comparison would pick.
         */
        if (seen >= band / 2) claimed = t.href;
        if (seen > cover) {
          cover = seen;
          widest = t.href;
        }
      });

      // Nothing holds a majority at the very foot of the page, where the last
      // section has no menu entry of its own — the nearest one keeps the pill
      // rather than the rail going blank.
      const best = claimed || widest;
      if (best) setActive(best);
    };

    // Coalesced to one measurement per frame. Lenis emits a scroll event every
    // frame it interpolates, and the rail only changes once per frame anyway.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}
