import { Calendar, Tag } from "lucide-react";
import { BLOGS } from "../data";

export default function Blogs() {
  return (
    <>
      <section id="blogs" className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge">Blogs</span>
            <h2>Latest news &amp; insights</h2>
            <p>
              We craft digital, graphic and dimensional thinking, to create
              category leading brand experiences that have meaning.
            </p>
          </div>

          <div className="blog-grid">
            {BLOGS.map((b, i) => (
              <article className="blog-card" key={i}>
                <div className="thumb">
                  <img src={b.image} alt={b.title} loading="lazy" decoding="async" />
                </div>
                <div className="blog-body">
                  <div className="blog-meta">
                    <span><Calendar size={13} /> {b.date}</span>
                    <span><Tag size={13} /> {b.category}</span>
                  </div>
                  <h4>{b.title}</h4>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
