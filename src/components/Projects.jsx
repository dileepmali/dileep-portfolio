import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { PROJECTS, PROJECT_FILTERS } from "../data";
import { TECH } from "./tech";

// OLD layout — used ONLY on the Home one-pager (unchanged)
export default function Projects() {
  const [filter, setFilter] = useState("All");
  const shown =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <>
      <section id="projects" className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge">Work</span>
            <h2>My Projects</h2>
            <p>
              We craft digital, graphic and dimensional thinking, to create
              category leading brand experiences that have meaning.
            </p>
          </div>

          <div className="proj-filters">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="proj-grid">
            {shown.map((p) => {
              const t = TECH[p.icon];
              const Icon = t?.Icon;
              return (
                <div className="proj-card" key={p.title}>
                  <div className="proj-top">
                    <span
                      className="proj-ico"
                      style={{ background: `${t?.color}1f`, color: t?.color }}
                    >
                      {Icon && <Icon size={28} />}
                    </span>
                    <div>
                      <h4>{p.title}</h4>
                      <span className="sub">
                        {p.sub}{" "}
                        <ExternalLink size={12} style={{ verticalAlign: "middle" }} />
                      </span>
                    </div>
                  </div>
                  <div className="tag-row">
                    {p.tags.map((tag) => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
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
