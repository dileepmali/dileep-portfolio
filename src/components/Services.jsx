import { Layers, TrendingUp, CheckSquare } from "lucide-react";
import { SERVICES } from "../data";

const ICONS = {
  layers: Layers,
  trending: TrendingUp,
  check: CheckSquare,
};

export default function Services() {
  return (
    <>
      <section id="services" className="section">
        <div className="container">
          <div className="section-head">
            <span className="badge">Services</span>
            <h2>Our Services</h2>
            <p>
              We craft digital, graphic and dimensional thinking, to create
              category leading brand experiences that have meaning.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <div className="service-card" key={s.title}>
                  <div
                    className="service-ico"
                    style={{ background: `${s.color}1f`, color: s.color }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
