import { Trophy, Building2 } from "lucide-react";
import { EDUCATION, EXPERIENCE } from "../data";

const COLORS = ["#e0556b", "#f1b34b", "#3fc28a", "#5b8def"];

// "2010 - 2012" -> "2010-12"
function shortYears(period) {
  const parts = period.split("-").map((s) => s.trim());
  if (parts.length < 2) return period;
  return `${parts[0]}-${parts[1].slice(-2)}`;
}

export default function Resume() {
  const items = [
    ...EXPERIENCE.map((e) => ({ ...e, Icon: Trophy })),
    ...EDUCATION.map((e) => ({ ...e, Icon: Building2 })),
  ];

  return (
    <>
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

          <div className="timeline2">
            {items.map((it, idx) => {
              const color = COLORS[idx % COLORS.length];
              const Icon = it.Icon;
              return (
                <div
                  className={`tl-card ${idx % 2 ? "rev" : ""}`}
                  key={it.title}
                  style={{ borderColor: `${color}cc` }}
                >
                  <div className="tl-ico" style={{ background: `${color}1f`, color }}>
                    <Icon size={40} />
                  </div>
                  <div className="tl-text">
                    <h4>{it.title}</h4>
                    <p>{it.desc}</p>
                  </div>
                  <div className="tl-badge-wrap">
                    <div
                      className="tl-badge"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                        boxShadow: `0 18px 38px -6px ${color}`,
                      }}
                    >
                      {shortYears(it.period)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
