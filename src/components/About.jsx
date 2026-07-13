import { Github, Twitter, Linkedin, Globe, Layers, TrendingUp, CheckSquare } from "lucide-react";
import { ABOUT, SERVICES } from "../data";
import { TECH } from "./tech";
import { useAboutShape } from "../useAboutShape";
import Honeycomb from "./Honeycomb";
import aboutPerson from "../assets/about-person.png";

const SERVICE_ICONS = { layers: Layers, trending: TrendingUp, check: CheckSquare };

// Skills + Services merged into one set for the circular carousel
const CAROUSEL_ITEMS = [
  ...ABOUT.skills.map((s) => ({
    key: "sk-" + s.name, kind: "skill",
    Icon: TECH[s.icon]?.Icon, color: TECH[s.icon]?.color || "#38bdf8",
    title: s.name, sub: s.exp,
  })),
  ...SERVICES.map((s) => ({
    key: "sv-" + s.title, kind: "service",
    Icon: SERVICE_ICONS[s.icon], color: s.color,
    title: s.title, sub: s.desc,
  })),
];

function SkillCard({ s }) {
  const t = TECH[s.icon];
  const Icon = t?.Icon;
  return (
    <div className="skill-card">
      <span className="skill-ico" style={{ background: `${t?.color}1f`, color: t?.color }}>
        {Icon && <Icon size={26} />}
      </span>
      <div>
        <h4>{s.name}</h4>
        <span>{s.exp}</span>
      </div>
    </div>
  );
}

// `page` = true  -> About page layout (photo + personal details)
// `page` = false -> Home one-pager layout (personal details + skills, no photo)
export default function About({ page = false }) {
  useAboutShape();
  const PersonalInfo = (
    <div className="about-info">
      <h3>Personal Details</h3>
      <p style={{ color: "var(--text-soft)" }}>{ABOUT.intro}</p>

      <div className="about-details about-details--inline">
        {ABOUT.details.map((d) => (
          <div key={d.label}>
            <span>{d.label}</span>
            <span>:</span>
            <b>{d.value}</b>
          </div>
        ))}
      </div>

      <div className="social-row">
        <a href="#"><Github size={18} /></a>
        <a href="#"><Twitter size={18} /></a>
        <a href="#"><Globe size={18} /></a>
        <a href="#"><Linkedin size={18} /></a>
      </div>
    </div>
  );

  // About-page layout: photo + details + skills grid in one section
  if (page) {
    return (
      <section id="about" className="section">
        <div className="container">
          <div className="about-page-grid">
            <div className="about-photo">
              <img src={aboutPerson} alt="About — profile photo" loading="lazy" decoding="async" />
            </div>
            {PersonalInfo}
          </div>
          <div className="skills-grid">
            {ABOUT.skills.map((s) => (
              <SkillCard s={s} key={s.name} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Home one-pager: About is pinned (sticky) and the Skills section scrolls up
  // OVER it. Both live in one wrapper so About releases once Skills has passed.
  return (
    <div className="about-stack">
      <section id="about" className="section">
        <div className="container">
          <div className="about-block">
            <div className="about-block-text">
              <span className="badge">About Me</span>
              <h2>
                Tailored in <br /> Three Dimensions
              </h2>
              <p className="about-lead">{ABOUT.intro}</p>
              <div className="about-details about-details--inline">
                {ABOUT.details.map((d) => (
                  <div key={d.label}>
                    <span>{d.label}</span>
                    <span>:</span>
                    <b>{d.value}</b>
                  </div>
                ))}
              </div>
              <div className="social-row">
                <a href="#"><Github size={18} /></a>
                <a href="#"><Twitter size={18} /></a>
                <a href="#"><Globe size={18} /></a>
                <a href="#"><Linkedin size={18} /></a>
              </div>
            </div>
            <div className="about-visual" aria-hidden="true">
              <div id="about-shape3d" />
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container">
          <div className="skills-head" id="services">
            <span className="badge">Skills &amp; Services</span>
            <h3>Everything I bring to the table</h3>
          </div>
          <Honeycomb items={CAROUSEL_ITEMS} />
        </div>
      </section>
    </div>
  );
}
