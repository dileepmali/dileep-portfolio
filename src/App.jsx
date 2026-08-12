import Preload from "./sections/Preload";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import WhatYouGet from "./sections/WhatYouGet";
import Contact from "./sections/Contact";
import { useSmoothScroll } from "./motion/useSmoothScroll";
import { useTimeline } from "./motion/useTimeline";
import { useNavTheme } from "./motion/useNavTheme";

/*
 * One page, four sections, no router.
 *
 * The site previously carried seven routes, four of which held template
 * placeholder copy. A portfolio with two shipped projects is a single scroll —
 * the routing was structure borrowed from a template that had more to say.
 *
 * Both hooks mount once here and cover the whole document: Lenis smooths the
 * scroll position, and the timeline engine compiles every `data-tl-*`
 * declaration in the markup below into GSAP tweens.
 */
export default function App() {
  useSmoothScroll();
  // Scoped to the document, not to `#page`: the nav sits outside the page
  // wrapper (it is fixed and has to outlive the hero) but its assembly is
  // declared against the hero's scroll range, so both must compile together.
  useTimeline("body");
  // Inverts the fixed nav's colours over the dark sections, which it would
  // otherwise be invisible against.
  useNavTheme();

  return (
    <>
      {/* Skip link — the hero is 300vh of scripted motion, so a keyboard user
          needs a way past it that does not involve tabbing through it. It aims
          at About now that the work section is gone; a link to a removed anchor
          would leave the keyboard user exactly where they started. */}
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Preload />
      <Nav />
      <div id="page">
        <Hero />
        <main>
          <About />
          <Projects />
          <WhatYouGet />
          <Contact />
        </main>
      </div>
    </>
  );
}
