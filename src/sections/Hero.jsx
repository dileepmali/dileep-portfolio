import { ME, NAV, TRAITS, PHOTO } from "../data";

const at = (start, end) => ({
  "data-tl-type": "scroll",
  "data-tl-trigger": ".hero",
  "data-tl-start": `${start}% top`,
  "data-tl-end": `${end}% top`,
  "data-tl-desktop": "",
});

/*
 * The opening screen.
 *
 * Three stacked layers, which is the whole trick of this composition:
 *
 *   1. the wordmark  — the name at display scale, filling the upper half
 *   2. the portrait  — cut out, centred, standing in front of the letters
 *   3. the interface — nav row, cards and claim, in front of the portrait
 *
 * The portrait sitting between the type and the interface is what stops the
 * screen reading as a poster with a photo pasted on: the letters pass behind a
 * person, and the copy passes in front of them.
 *
 * The wordmark is where the loading card's name comes to rest. It crosses in
 * from the right at full size and simply stops here, so the load and the hero
 * are one continuous move rather than a loader and then a page.
 *
 * On scroll the whole thing takes itself apart across 240vh while the nav
 * assembles. Below 1000px none of that runs and this is an ordinary screen.
 */
export default function Hero() {
  /*
   * Only the items that lead somewhere, and only the ones there is room for.
   *
   * The drawer lists the full menu; this row is a single strip across the top
   * of the hero, and the portrait now runs most of the way across it. What is
   * left is a stack of labels on either side of the head — three on the left
   * before the stats card, and one on the right past the trait card.
   *
   * The middle entries are dropped rather than squeezed. There is no z-index
   * that saves them: the trait card lives in the travelling layer and the nav
   * row in the fading one, and GSAP gives each layer its own stacking context,
   * so the card paints over anything this row puts under it. A label a reader
   * cannot see is worse than one that is not there — the rail carries the whole
   * menu a moment later either way.
   */
  const navItems = NAV.filter((n) => n.href);
  const navLeft = navItems.slice(0, 3);
  // Guarded, or a three-item menu would render its last entry on both sides.
  const navRight = navItems.length > 3 ? navItems.slice(-1) : [];

  return (
    <section className="hero" id="top">
      <div className="hero-sticky">
        {/*
         * Hidden until the loading card's name comes to rest on top of it —
         * the two share one CSS rule, so they are the same size in the same
         * place and the handover is invisible.
         */}
        <h1 className="hero-wordmark">
          {/*
           * Three levels, one per owner of a transform.
           *
           * The <h1> is the layout box. The middle span is what flies: Flip
           * writes its transform outright, mapping the name's box onto the
           * rail's chip, so the letters shrink into the drawer as you scroll
           * rather than fading out and being replaced by a logo. The innermost
           * span carries the static horizontal condense, which has to be a
           * level below the flight or Flip's transform would replace it and
           * the name would snap back to its uncondensed width mid-flight.
           */}
          <span
            className="hero-wordmark-fly"
            data-flip-id="mark"
            data-flip-trigger=".hero"
            data-flip-start="4% top"
            data-flip-end="30% top"
            {...at(30, 33)}
            data-tl-to="{'autoAlpha': 0}"
          >
            <span>{ME.name.split(" ")[0].toUpperCase()}</span>
          </span>
        </h1>

        {/*
         * The portrait blurs out rather than simply fading — the reference
         * drives its photo from blur(0) to blur(90px) as the hero unloads, and
         * that is what makes the screen feel like it is defocusing rather than
         * emptying.
         */}
        <div
          className="hero-photo tl-hide"
          {...at(0, 18)}
          data-tl-to="{'filter': 'blur(60px)', 'autoAlpha': 0, 'scale': 1.06}"
          aria-hidden={PHOTO ? undefined : "true"}
        >
          {/*
           * The entrance lives on this inner element, not on the wrapper above.
           * An element carries one declaration, and the wrapper already owns the
           * scroll-driven defocus — this is the same split the monogram needed.
           *
           * It is also the first `intro` element in the document, and intro
           * order is DOM order: the portrait arrives while the name is still
           * rising, and every piece of interface below queues up behind it.
           */}
          {/*
           * The figure arrives out of depth rather than up from the floor.
           *
           * Scale and blur move together, which is the whole illusion: small and
           * unfocused reads as far away, and resolving to full size and sharp
           * reads as walking toward the camera — arriving in front of the
           * letters rather than simply appearing over them. Either property on
           * its own just looks like a zoom or a fade.
           *
           * `power2.out` over 1.7s because `power3.out` spends its movement in
           * the first few frames; on a subject this size that is a jolt, not an
           * approach. The origin is the bottom edge (see the CSS) so the feet
           * stay planted while the figure grows.
           */}
          <div
            className="hero-photo-in"
            data-tl-type="intro"
            data-tl-from="{'opacity': 0, 'scale': 0.74, 'filter': 'blur(34px)'}"
            data-tl-duration="1.7"
            data-tl-ease="power2.out"
          >
            {PHOTO ? (
              // Fetched at high priority and decoded off the main thread: this
              // is the largest asset on the page and the opening sequence waits
              // on it, so every millisecond of it is on the critical path.
              <img
                src={PHOTO}
                alt={`${ME.name}, ${ME.role}`}
                fetchPriority="high"
                decoding="async"
                draggable="false"
              />
            ) : (
              <PhotoPlaceholder />
            )}
          </div>
        </div>

        {/*
         * Two layers, not one.
         *
         * `.hero-fade` is everything that simply leaves — it carries the fade
         * the whole interface used to carry. `.hero-fly` holds the three things
         * that do not leave but travel: the note and the two stat cards fly
         * into their slots in the rail, so they have to outlive the fade that
         * takes the rest of the screen away.
         *
         * Both cover the same box, so the absolute offsets inside them (which
         * measure from the panel's padding edge) are unchanged by the split.
         */}
        <div className="hero-front tl-hide">
          <div
            className="hero-fade"
            {...at(2, 17)}
            data-tl-to="{'autoAlpha': 0, 'y': -60}"
          >
            {/* The wide nav row. It is the hero's own navigation — the compact
              bar at the top of the window assembles separately as this goes. */}
            <nav
              className="hero-navrow"
              data-tl-type="intro"
              data-tl-children="a"
              data-tl-stagger="0.06"
              data-tl-from="{'opacity': 0, 'y': 14}"
              data-tl-duration="0.7"
              data-tl-ease="power2.out"
            >
              <span className="hero-navgroup">
                {navLeft.map((n) => (
                  <NavLink key={n.href} {...n} />
                ))}
              </span>
              <span className="hero-navgroup">
                {navRight.map((n) => (
                  <NavLink key={n.href} {...n} />
                ))}
              </span>
            </nav>

            <div className="hero-grid">
              {/* ------------------------------------------------- left -- */}
              <div className="hero-col hero-col--left">
                <p
                  className="hero-kicker"
                  data-tl-type="intro"
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 110}"
                  data-tl-at="-=0.9"
                >
                  {ME.role}.
                  <br />
                  That&rsquo;s {ME.name.split(" ")[0]}.
                </p>
              </div>

              {/* ----------------------------------------------- centre -- */}
              <div className="hero-col hero-col--center">
                <h2
                  className="hero-claim"
                  data-tl-type="intro"
                  data-tl-split="lines"
                  data-tl-from="{'yPercent': 115}"
                  data-tl-at="-=1.05"
                >
                  Mobile,
                  <br />
                  Built
                  <br />
                  Properly.
                </h2>

                <div
                  className="hero-buttons"
                  data-tl-type="intro"
                  data-tl-children="a"
                  data-tl-stagger="0.08"
                  data-tl-from="{'opacity': 0, 'y': 18, 'scale': 0.94}"
                  data-tl-duration="0.7"
                  data-tl-ease="back.out(1.5)"
                  data-tl-at="-=0.65"
                >
                  <a className="btn" href={`mailto:${ME.email}`}>
                    Get in touch
                  </a>
                  {/* The work itself, not the story of getting to it. This used
                      to point at About, which is a timeline — a reader who
                      presses a button labelled "See the work" and lands on five
                      cards about school has been sent somewhere else. */}
                  <a className="btn btn--ghost" href="#projects">
                    See the work
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/*
           * The travelling layer. Nothing in here fades with the interface —
           * each block flies to the matching `data-flip-slot` in the rail, and
           * hands over to the rail's own copy on arrival. The hand-off is a
           * fade between two boxes that are, by then, in the same place at the
           * same size, so it is not visible as a swap.
           */}
          <div className="hero-fly">
            <div className="hero-cards">
              {ME.stats.map((s, i) => (
                <div
                  className="hero-fly-item"
                  key={s.label}
                  data-flip-id={`stat-${i}`}
                  data-flip-trigger=".hero"
                  data-flip-start="12% top"
                  data-flip-end="30% top"
                  {...at(30, 33)}
                  data-tl-to="{'autoAlpha': 0}"
                >
                  <div
                    className="glass hero-stat"
                    data-tl-type="intro"
                    data-tl-from="{'opacity': 0, 'y': 26, 'scale': 0.96}"
                    data-tl-duration="0.85"
                    data-tl-ease="power3.out"
                    data-tl-at={i === 0 ? "-=0.65" : "-=0.75"}
                  >
                    <span className="hero-stat-value">{s.value}</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-col hero-col--right">
              {/* Leaves with the rest of the interface — the rail has no slot
                  for it, so there is nowhere for it to fly to. */}
              <div
                className="hero-traits-wrap"
                {...at(2, 17)}
                data-tl-to="{'autoAlpha': 0, 'y': -60}"
              >
                <ul
                  className="glass hero-traits"
                  data-tl-type="intro"
                  data-tl-children="li"
                  data-tl-stagger="0.07"
                  data-tl-from="{'opacity': 0, 'x': 20}"
                  data-tl-duration="0.7"
                  data-tl-ease="power3.out"
                  data-tl-at="-=0.9"
                >
                  {TRAITS.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              <div
                className="hero-fly-item hero-note-fly"
                data-flip-id="note"
                data-flip-trigger=".hero"
                data-flip-start="12% top"
                data-flip-end="30% top"
                {...at(30, 33)}
                data-tl-to="{'autoAlpha': 0}"
              >
                <p
                  className="hero-note"
                  data-tl-type="intro"
                  data-tl-from="{'opacity': 0, 'y': 18}"
                  data-tl-duration="0.8"
                  data-tl-ease="power3.out"
                  data-tl-at="-=0.65"
                >
                  {ME.lead}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/*
 * A nav link that rolls on hover: the label lifts out of the top while an
 * identical copy arrives from the bottom, so it reads as the word turning over
 * rather than as anything appearing or disappearing.
 *
 * The whole effect is one transform on the stack — cheap, interruptible, and it
 * reverses cleanly if the pointer leaves mid-roll. The reference builds it the
 * same way; its duplicate is literally classed "ghost".
 *
 * The second copy is `aria-hidden`: it is the same word, and a screen reader
 * announcing every link twice would be the price of a visual flourish.
 */
function NavLink({ label, href }) {
  return (
    <a className="hero-navlink" href={href}>
      <span className="hero-navlink-roll">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </a>
  );
}

/*
 * Stands in until a real cut-out portrait exists.
 *
 * Deliberately a marked placeholder rather than a stock photograph: the only
 * portrait in the repository is a template model, and shipping a photograph of
 * someone else as the site's owner is not a placeholder, it is a wrong claim
 * about a real person. This holds the exact footprint the real image will take,
 * so the composition can be judged now and the file dropped in later.
 */
function PhotoPlaceholder() {
  return (
    <div className="hero-photo-ph">
      {/* viewBox matches the 3/7 box exactly, so nothing stretches. */}
      <svg viewBox="0 0 300 700" preserveAspectRatio="xMidYMax meet">
        {/* Shoulders start above the head's baseline so the two shapes read as
            one silhouette rather than a ball floating over a slab. */}
        <circle cx="150" cy="96" r="58" />
        <path d="M150 142c-79 0-143 64-143 143v415h286V285c0-79-64-143-143-143z" />
      </svg>
      <span>Add portrait — PHOTO in src/data.js</span>
    </div>
  );
}
