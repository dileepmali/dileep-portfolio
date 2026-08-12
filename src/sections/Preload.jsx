import { ME } from "../data";

/*
 * The opening title card.
 *
 * The reference site parks its wordmark at `translate(110%)` — fully off the
 * right edge — and drives it left across the screen before the page proper is
 * allowed to exist. This is the same move: the name crosses in from the right
 * at full size and stops on the spot the hero wordmark occupies, then the card
 * dissolves out from under it while the page pulls into focus.
 *
 * Nothing here scales. This element and `.hero-wordmark` share one CSS rule, so
 * the letters are the right size before they start moving.
 *
 * The markup is deliberately inert. It is hidden by default and only displays
 * while `data-preload` is set on the document by the inline script in
 * index.html, so a visitor whose JS never runs is never trapped behind a
 * full-screen overlay that has nothing left to remove it.
 */
export default function Preload() {
  return (
    <div className="preload" aria-hidden="true">
      {/*
       * The same string the hero wordmark renders, and that is not incidental:
       * this element flies into that one. If the text changed mid-flight the
       * Flip would be morphing between two different shapes and read as a
       * substitution rather than as one object travelling.
       */}
      <span className="preload-name">
        {/* Mirrors the hero wordmark's nesting exactly — the condense lives on
            the inner span in both, so the two boxes stay identical. */}
        <span>{ME.name.split(" ")[0].toUpperCase()}</span>
      </span>
    </div>
  );
}
