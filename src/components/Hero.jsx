import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { HERO } from "../data";
import { useHeroWaves } from "../useHeroWaves";

// simple typewriter hook
function useTyped(words, speed = 90, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    let t;
    if (!del && text === word) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && text === "") {
      setDel(false);
      setI((p) => p + 1);
    } else {
      t = setTimeout(() => {
        setText((prev) =>
          del ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1)
        );
      }, del ? speed / 2 : speed);
    }
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}

export default function Hero() {
  const typed = useTyped(HERO.typed);
  const heroRef = useRef(null);
  useHeroWaves();

  return (
    <header id="home" className="hero" ref={heroRef}>
      <div className="hero-godrays" aria-hidden="true" />
      <div className="hero-visual" aria-hidden="true">
        <div id="hero-waves" />
      </div>
      <div className="hero-dots" aria-hidden="true">
        <span className="fdot d1" />
        <span className="fdot d2" />
        <span className="fdot d3" />
        <span className="fdot d4" />
      </div>
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="greet">{HERO.greeting}</p>
          <h1>
            {HERO.prefix} <br />
            <span className="typed">{typed}</span>
          </h1>
          <a href="#" className="btn">
            Download CV <Download size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
