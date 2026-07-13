import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { PROJECTS_PAGE, PROJECT_FILTERS } from "../data";
import { TECH } from "./tech";

// NEW big-card layout — used ONLY on the dedicated /projects page
export default function ProjectsShowcase() {
  const [filter, setFilter] = useState("All");
  const shown =
    filter === "All"
      ? PROJECTS_PAGE
      : PROJECTS_PAGE.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="pshow-filters">
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

        <div className="pshow-grid">
          {shown.map((p) => {
            const t = TECH[p.icon];
            const Icon = t?.Icon;
            return (
              <div className="pshow-card" key={p.title}>
                <div
                  className="pshow-logo"
                  style={{ background: `${t?.color}14`, color: t?.color }}
                >
                  {Icon && <Icon size={70} />}
                </div>
                <div className="pshow-info">
                  <h4>{p.title}</h4>
                  <span className="sub">
                    {p.sub} <ExternalLink size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
