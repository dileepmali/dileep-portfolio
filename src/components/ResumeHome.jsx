import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { EDUCATION, EXPERIENCE } from "../data";
import { EducationArt, ExperienceArt } from "./Illustrations";

function Timeline({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="timeline">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div className={`tl-item ${isOpen ? "open" : ""}`} key={it.title}>
            <div className="tl-head" onClick={() => setOpen(isOpen ? -1 : idx)}>
              <span className="tt">
                <span className="pm">{isOpen ? <Minus size={16} /> : <Plus size={16} />}</span>
                {it.title}
              </span>
              <span className="tl-period">{it.period}</span>
            </div>
            <div className="tl-body">
              <p className="place">{it.place}</p>
              <p>{it.desc}</p>
              {it.tags && (
                <div className="tag-row">
                  {it.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResumeBlock({ icon, label, items }) {
  return (
    <div className="resume-grid">
      <aside className="resume-aside">
        <div className="ill">{icon}</div>
        <h4>{label}</h4>
      </aside>
      <Timeline items={items} />
    </div>
  );
}

// Old layout — used ONLY on the Home one-pager
export default function ResumeHome() {
  return (
    <section id="resume" className="section">
      <div className="container">
        <div className="section-head">
          <span className="badge">Life Time</span>
          <h2>Education &amp; Experience</h2>
          <p>
            We craft digital, graphic and dimensional thinking, to create
            category leading brand experiences that have meaning.
          </p>
        </div>

        <ResumeBlock icon={<EducationArt />} label="Education" items={EDUCATION} />
        <div style={{ height: 40 }} />
        <ResumeBlock icon={<ExperienceArt />} label="Experience" items={EXPERIENCE} />
      </div>
    </section>
  );
}
