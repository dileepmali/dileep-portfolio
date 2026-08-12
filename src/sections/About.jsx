import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ME, JOURNEY, PHOTO } from "../data";
import { useJourneyWire } from "../motion/useJourneyWire";

/*
 * The second beat, and the first screen the rail is fully assembled against.
 *
 * The heading holds the top-left of the first screen and the journey runs down
 * from the bottom-right of it as a timeline: one card at a time, alternating
 * side to side, each hanging off a vertical stroke that ends in a dot, and a
 * diagonal drawn from one card's dot to the next. The rail's own indent comes
 * from `main`, so nothing here has to know the drawer exists — beyond being the
 * section its "About me" tab points at.
 */
export default function About() {
  // Draws the strokes between the cards. Everything it makes is decoration
  // measured from the finished layout, so it runs after the cards are placed
  // and adds nothing to the markup below.
  useJourneyWire();

  /*
   * Which card is open, at most one.
   *
   * A card does not open into anything — it opens. It stays in its own slot on
   * the timeline, turns dark, and grows to hold the whole story, and the cards
   * under it are pushed down the page by its new height. Opening a second one
   * closes the first, which is the reference's behaviour and also the only one
   * that makes sense on a staircase this tall: two open cards put a screen and
   * a half of reading between two beats of the same story.
   */
  const [open, setOpen] = useState(null);
  const cardRefs = useRef([]);
  // Every card's height as it was at the moment of the click. Read back in the
  // layout effect below, which is the only place the new heights exist.
  const before = useRef(null);

  const toggle = (i) => {
    before.current = cardRefs.current.map((el) => el?.offsetHeight ?? 0);
    setOpen((current) => (current === i ? null : i));
  };

  /*
   * The growth, animated on height alone.
   *
   * Deliberately not a Flip, and not a transform of any kind. The card already
   * carries a scrubbed `y` that ties its arrival to the scrollbar, and an
   * element may only have one thing writing to its transform — a Flip here
   * would take that over and the card would stop rising with the page. Height
   * is the one property nothing else on this element is using.
   *
   * It also happens to be the honest one: the card genuinely becomes taller,
   * so everything below it moves down by the real amount rather than being
   * faked into place. `offsetHeight` and not a rect, because a rect includes
   * the scrubbed transform and would measure a card mid-rise as short.
   *
   * A layout effect, because this runs between React writing the new markup and
   * the browser painting it — a frame later and the reader sees the card snap
   * to full height and then animate from it.
   */
  useLayoutEffect(() => {
    const prev = before.current;
    if (!prev) return;
    before.current = null;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const to = el.offsetHeight;
      if (Math.abs(to - prev[i]) < 1) return;
      gsap.fromTo(
        el,
        { height: prev[i] },
        {
          height: to,
          duration: 0.6,
          ease: "power3.inOut",
          // Clipped only while it moves. Left on, the card's own shadow and the
          // year's flip would both be cut off at its edge for good.
          overflow: "hidden",
          clearProps: "height,overflow",
        }
      );
    });

    /*
     * Bring the opened card back onto the screen, if it left.
     *
     * The chip that opens a card sits at the foot of it, so the growth happens
     * entirely below where the reader is looking and a long story ends up
     * mostly past the bottom of the window. Only when it does: a card that
     * still fits is left exactly where the reader put it, because moving the
     * page under someone who did not ask for it is its own kind of rude.
     *
     * After the growth rather than during it — the card's final foot is not
     * known until it has one, and Lenis would be easing toward a target that
     * was still moving.
     */
    if (open !== null) {
      gsap.delayedCall(0.62, () => {
        const el = cardRefs.current[open];
        if (!el) return;
        const r = el.getBoundingClientRect();
        // Below 1000px the rail lies down as a bar across the top of the window,
        // and a card parked at 24px is parked underneath it. On desktop there is
        // nothing above the card but page.
        const margin = window.innerWidth < 1000 ? 96 : 24;
        if (r.bottom <= window.innerHeight - margin && r.top >= margin) return;
        const y = window.scrollY + r.top - margin;
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(y, { duration: 0.9 });
        else window.scrollTo({ top: y, behavior: "smooth" });
      });
    }

    // The story, the close button and the byline are new elements every time, so
    // they arrive at full strength in the middle of a card that is still
    // opening. Held back until the growth is half done, which is about when
    // there is room for them.
    if (open !== null) {
      const card = cardRefs.current[open];
      const arriving = card?.querySelectorAll(
        ".about-card-story, .about-card-by, .about-card-close"
      );
      if (arriving?.length) {
        gsap.from(arriving, {
          opacity: 0,
          y: 12,
          duration: 0.45,
          delay: 0.22,
          stagger: 0.05,
          ease: "power2.out",
        });
      }
    }
  }, [open]);

  // Escape closes whatever is open. The close button is inside the card and can
  // be scrolled past; the key never is.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      before.current = cardRefs.current.map((el) => el?.offsetHeight ?? 0);
      setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section
      className="about"
      id="about"
      /*
       * Held until the hero is done with the screen.
       *
       * This section is pulled a full viewport up over the hero's tail so that
       * it is already in place the moment the drawer finishes — but the hero's
       * panel is transparent (it has to be; the rail assembles behind it), so
       * without this the section showed through the opening from the first
       * frame. It uncovers exactly as the last flight lands.
       *
       * `autoAlpha`, not `opacity`: a transparent section still takes the
       * clicks meant for the hero underneath it.
       *
       * No movement here, and that is a hard constraint rather than a taste:
       * ScrollTrigger measures a trigger's position with whatever transform is
       * on it, and it does not clear an ancestor's transform to do it. A
       * from-state on this element offsets every start point inside it by the
       * same distance — with the journey below, that was over a thousand pixels
       * and not one card ever reached its trigger. The climb lives on the
       * heading block instead, which nothing else is measured against.
       */
      data-tl-type="scroll"
      data-tl-trigger=".hero"
      data-tl-start="27% top"
      data-tl-end="33% top"
      data-tl-from="{'autoAlpha': 0}"
      data-tl-desktop=""
    >
      <div className="wrap about-inner">
        <div
          className="about-head"
          /*
           * The climb.
           *
           * Sitting under the hero's panel, this section's opening is already
           * within 10vh of the top of the screen by the time the fade starts,
           * so a plain fade had nothing to travel — it simply resolved where it
           * stood. Starting the heading 40vh lower puts it at the middle of the
           * screen and lets it rise into place as the pin releases, which is
           * what makes the arrival read as a movement rather than a switch.
           *
           * A viewport distance rather than a share of anything: this used to
           * be a percentage of the section, and the section stopped being one
           * screen tall the moment the journey became a timeline.
           *
           * It ends a little past the pin release (33%) on purpose — the last
           * of the climb happens under the reader's own scrolling, so the
           * heading docks rather than arriving pre-parked.
           */
          data-tl-type="scroll"
          data-tl-trigger=".hero"
          data-tl-start="27% top"
          data-tl-end="35% top"
          data-tl-from="{'y': '40vh'}"
          data-tl-desktop=""
        >
          {/* An outlined chip rather than the bare small-caps the other sections
              use — this is the one heading that sits on its own screen, and the
              chip is what stops it floating. */}
          <p
            className="about-chip"
            data-tl-from="{'opacity': 0, 'y': 14}"
            data-tl-duration="0.7"
            data-tl-ease="power2.out"
          >
            Built for real devices
          </p>

          <h2
            className="about-statement"
            data-tl-split="lines"
            data-tl-from="{'yPercent': 110}"
            data-tl-delay="0.1"
          >
            About Me (&amp;)
            <br />
            My Journey
          </h2>

          <div
            className="about-body"
            data-tl-from="{'opacity': 0, 'y': 22}"
            data-tl-duration="0.9"
            data-tl-ease="power3.out"
          >
            {/*
             * One short paragraph, not two.
             *
             * The reference gives this screen a single sentence of about three
             * lines and lets the cards carry the detail; two paragraphs here
             * ran to six lines and turned the opening of the section into a
             * block of copy. The company and what was built there are both
             * still on the screen — they are what the cards below say.
             */}
            <p>
              A year and a bit in, all of it spent building product: two apps
              taken from an empty repository to something running on real
              devices.
            </p>
          </div>
        </div>

        {/*
         * The timeline.
         *
         * The wire is a sibling of the list rather than something inside it, for
         * two reasons: an <ol> may only hold list items, and the strokes have to
         * paint *behind* the cards — the diagonal between two dots runs straight
         * through the card it is heading for, and the card covering that stretch
         * is what makes the line read as passing under it.
         *
         * `.about-track` is the positioned ancestor the wire measures against,
         * so every card's offset is already relative to the box the SVG fills.
         */}
        <div className="about-track">
          <svg className="about-wire" aria-hidden="true" />

          <ol className="about-steps">
            {JOURNEY.map((step, i) => {
              /*
               * The first card does not move.
               *
               * It is already on screen when the section arrives — it sits in
               * the bottom-right of the opening screen, under the hero's tail —
               * so there is no approach for it to make. Animating it would mean
               * animating something the reader is already looking at.
               *
               * Every card after it floats up into place instead, and does it
               * against the scrollbar rather than on a timer: the card is tied
               * to the reader's own scrolling, so it rises as they come down the
               * page and stops the moment they do.
               */
              const rise =
                i === 0
                  ? null
                  : {
                      "data-tl-type": "scroll",
                      // Measured against the row, never against the card.
                      // ScrollTrigger reads a trigger's position with its own
                      // from-state applied, so a card that starts 140px low
                      // measures its own start 140px late — and the year inside
                      // it, hinged flat, measures somewhere else again. The row
                      // is the one box here that never moves, so pointing
                      // everything at it is what keeps the card, the year and
                      // the stroke on the same clock.
                      "data-tl-trigger": `.about-step[data-step="${i}"]`,
                      "data-tl-start": "top bottom",
                      "data-tl-end": "top 58%",
                      "data-tl-from": "{'opacity': 0, 'y': 140}",
                    };

              /*
               * The year turns over rather than fading in — it is the one thing
               * on the card set at display scale, and a flip is what makes it
               * read as landing.
               *
               * Hinged at its own baseline so it swings up from under the card's
               * top edge. The perspective that makes it a turn rather than a
               * vertical squash lives in CSS, on the card: as a tween property
               * it is animated like any other, so a `from` state of 700 runs it
               * down to zero over the flip — and a rotation seen through a
               * perspective approaching nothing does not turn, it tears. That
               * was the wrong-looking flip.
               *
               * It starts a little after the card does and finishes a little
               * before it, so the number lands into a panel that is still
               * arriving rather than turning over on a card already at rest.
               */
              const flip =
                i === 0
                  ? null
                  : {
                      "data-tl-type": "scroll",
                      "data-tl-trigger": `.about-step[data-step="${i}"]`,
                      "data-tl-start": "top 92%",
                      "data-tl-end": "top 66%",
                      "data-tl-from": "{'rotationX': -92, 'opacity': 0}",
                    };

              return (
                <li
                  className="about-step"
                  key={step.title}
                  /*
                   * The staircase, in threes: right, then left, then further
                   * left, then back out to the right to start again.
                   *
                   * Not a left-right alternation — that walks the reader's eye
                   * back and forth across the same two columns. Stepping the
                   * same way twice before resetting is what the reference does,
                   * and it gives the run of cards a direction: each one is
                   * further down *and* further across than the one before it.
                   */
                  data-side={["right", "mid", "left"][i % 3]}
                  // The handle every movement in this row is triggered from.
                  data-step={i}
                >
                  {/*
                   * The movement is on the card, not on the <li>: the wire reads
                   * the card's layout position to place its dot, and `offsetTop`
                   * ignores transforms while `getBoundingClientRect` does not.
                   * Keeping it here also keeps the row's own box still, so the
                   * strokes stay put while the card arrives.
                   */}
                  <article
                    className="about-card"
                    ref={(el) => (cardRefs.current[i] = el)}
                    // The whole of the open card's appearance hangs off this
                    // one attribute — the dark ground, the larger type, which
                    // blocks are on screen. Nothing here decides how it looks.
                    data-open={open === i ? "true" : undefined}
                    {...rise}
                  >
                    <span className="about-card-year" {...flip}>
                      {step.year}
                    </span>

                    {open === i && (
                      <>
                        <button
                          type="button"
                          className="about-card-close"
                          onClick={() => toggle(i)}
                          aria-label={`Close ${step.title}`}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3 1.4 1.4Z" />
                          </svg>
                        </button>

                        {/* The byline moves from the foot of the card to the
                            head of it when the card opens — the reference puts
                            it under the year, where it reads as the story being
                            attributed rather than as a caption at the bottom. */}
                        <div className="about-card-by">
                          <Avatar />
                          <span>
                            <strong>{step.who ?? ME.name}</strong>
                            {step.when}
                          </span>
                        </div>
                      </>
                    )}

                    <h3 className="about-card-title">{step.title}</h3>

                    {open === i ? (
                      <p className="about-card-story">{step.story}</p>
                    ) : (
                      <p className="about-card-body">{step.body}</p>
                    )}

                    {open !== i && (
                      <div className="about-card-foot">
                        <Avatar />
                        <span className="about-card-who">
                          <strong>{step.who ?? ME.name}</strong>
                          {step.when}
                        </span>

                        {/*
                         * Three chips, one shape.
                         *
                         * A story opens the card in place, which is what every
                         * card does today. An `href` instead would send the
                         * reader somewhere — kept for a step that one day points
                         * at a write-up rather than carrying one. With neither it
                         * is a plain span: the card keeps the reference's shape
                         * without offering a control that does nothing, the same
                         * treatment the drawer's dead menu entries get.
                         */}
                        {step.story ? (
                          <button
                            type="button"
                            className="about-card-more"
                            onClick={() => toggle(i)}
                            aria-expanded={false}
                          >
                            Read more
                          </button>
                        ) : step.href ? (
                          <a className="about-card-more" href={step.href}>
                            Read more
                          </a>
                        ) : (
                          <span className="about-card-more" data-empty="true">
                            Read more
                          </span>
                        )}
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/*
 * Dileep's photograph, at chip size.
 *
 * Two places on a card show it — the foot when the card is closed and the head
 * when it is open — and they are the same picture at the same size, so they are
 * the same component rather than the same eight lines written twice.
 */
function Avatar() {
  return PHOTO ? (
    <img className="about-card-avatar" src={PHOTO} alt="" loading="lazy" />
  ) : (
    <span className="about-card-avatar" aria-hidden="true" />
  );
}
