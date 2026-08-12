import { WHAT_YOU_GET } from "../data";

/*
 * The claim, at full size.
 *
 * The fourth beat, and the light screen that follows the dark run of project
 * cards — the swing between the two is what stops the middle of the page
 * reading as one long stretch.
 *
 * Two things happen here and nothing else: a heading that fills the screen, and
 * one sentence saying what the work actually amounts to. The sentence is the
 * section; everything around it is spacing.
 */

/*
 * The chips that sit inside the sentence.
 *
 * Small tiles between words, each with a glyph and the caret the reference puts
 * on its own — the caret is what makes them read as objects dropped into the
 * line rather than as coloured punctuation.
 *
 * Drawn at 24×24 and sized in `em`, so a chip is always in proportion to the
 * type it is sitting in, at every step of the statement's clamp.
 */
const GLYPHS = {
  // An empty repository: a branch, before anything has been merged into it.
  repo: (
    <>
      <circle cx="7" cy="6" r="2.6" />
      <circle cx="7" cy="18" r="2.6" />
      <circle cx="17" cy="10" r="2.6" />
      <path d="M7 8.6v6.8M17 12.6c0 2.4-2 2.8-4 3.2" />
    </>
  ),
  // A phone: the thing it ends up running on.
  device: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.6" />
      <path d="M10.6 6.2h2.8" />
    </>
  ),
  // A browser window: the same product, in a tab.
  browser: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="M3 9.6h18M6.4 7.4h.01M9 7.4h.01" />
    </>
  ),
  // Handed over: out, and away.
  ship: (
    <>
      <path d="M8 16 16 8" />
      <path d="M9.5 8H16v6.5" />
    </>
  ),
};

function Chip({ icon }) {
  return (
    <span className="wyg-ink wyg-chip" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {GLYPHS[icon]}
        </g>
      </svg>
      <svg className="wyg-caret" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2 4 L5 7 L8 4 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default function WhatYouGet() {
  const { title, label, statement } = WHAT_YOU_GET;

  return (
    <section className="what-you-get" id="what-you-get">
      <div className="wrap">
        <h2
          className="wyg-title"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 110}"
          data-tl-duration="1.1"
        >
          {title[0]}
          <br />
          {title[1]}
        </h2>

        <p
          className="wyg-label"
          data-tl-from="{'opacity': 0, 'y': 16}"
          data-tl-duration="0.7"
          data-tl-ease="power2.out"
        >
          {label}
        </p>

        {/*
         * The sentence is written in white and inked in by the scrollbar.
         *
         * It arrives entirely white on the bone ground — there, but barely —
         * and blackens a letter at a time as the section is scrolled through, so
         * the reader's eye is pulled along the line at the pace they set. Scrub,
         * not a one-shot reveal: scrolling back up takes the ink out again.
         *
         * A letter at a time, not a word: the wave crossing the sentence is what
         * makes it feel written rather than switched on, and per-word it moved in
         * jumps at this type size.
         *
         * The chips are in the same queue and fill to yellow in their turn,
         * because their resting colour is the accent rather than the ink.
         *
         * Split by hand rather than by the split plugin, because splitting
         * rewrites the element's innerHTML and the chips are elements, not text
         * — a split would either drop them or clip them inside a line mask.
         */}
        <p
          className="wyg-statement"
          data-tl-type="scroll"
          data-tl-trigger=".wyg-statement"
          /* The whole sentence has to fit inside the stretch it is legible for:
             it starts white as it comes on screen and lands on the last word
             about when the paragraph reaches the top third. A shorter range
             finished the fill while the sentence was still arriving. */
          data-tl-start="top 90%"
          data-tl-end="bottom 28%"
          data-tl-children=".wyg-ink"
          /* Tight, because there are now a hundred and thirty of these rather
             than thirty: at the word stagger the wave would be longer than the
             sentence and every letter on screen would be mid-grey. */
          data-tl-stagger="0.045"
          /* The un-inked colour is the ground itself, not white: a letter that
             has not been reached is meant to be the page, so the sentence reads
             as being written rather than as pale type darkening. Kept in step
             with the middle stop of `.what-you-get`'s gradient — change one and
             the other has to move with it. */
          data-tl-from="{'color': '#dcd8c6', 'yPercent': 12}"
        >
          {statement.map((part, i) =>
            typeof part === "string" ? (
              part.split(" ").map((word, k) => (
                /* The space belongs between the boxes, not inside one: a
                   trailing space inside an inline-block is collapsed away and
                   the sentence sets as one unbroken word.

                   The word keeps its own box around the letters so a line can
                   only ever break between words — letters loose in the
                   paragraph would wrap mid-word. */
                <span key={`${i}-${k}`}>
                  <span className="wyg-word">
                    {[...word].map((ch, c) => (
                      <span className="wyg-ink wyg-char" key={c}>
                        {ch}
                      </span>
                    ))}
                  </span>{" "}
                </span>
              ))
            ) : (
              <Chip icon={part.icon} key={i} />
            )
          )}
        </p>
      </div>
    </section>
  );
}
