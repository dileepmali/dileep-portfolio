import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, StarHalf } from "lucide-react";
import { TESTIMONIALS } from "../data";

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={16} fill="#f5b301" stroke="#f5b301" />
      ))}
      {half && <StarHalf size={16} fill="#f5b301" stroke="#f5b301" />}
    </div>
  );
}

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const go = (d) => setI((p) => (p + d + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="section testi">
      <div className="container">
        <div className="testi-wrap">
          <button className="testi-arrow left" onClick={() => go(-1)} aria-label="prev">
            <ArrowLeft size={18} />
          </button>

          <p className="testi-brand">manter.</p>
          <p className="testi-quote">{t.quote}</p>
          <img className="testi-avatar" src={t.avatar} alt={t.name} loading="lazy" decoding="async" />
          <p className="testi-name">- {t.name}</p>
          <Stars rating={t.rating} />

          <button className="testi-arrow right" onClick={() => go(1)} aria-label="next">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
