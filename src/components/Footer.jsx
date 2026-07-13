import { Facebook, Twitter, Github, Instagram } from "lucide-react";
import { FOOTER } from "../data";

const SOCIAL_ICONS = { facebook: Facebook, twitter: Twitter, github: Github, instagram: Instagram };

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo">
              <span className="mark">S</span>SELFOWN
            </div>
            <p>{FOOTER.desc}</p>
            <div className="footer-social">
              {Object.entries(SOCIAL_ICONS).map(([k, Icon]) => (
                <a href="#" key={k} aria-label={k}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER.columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map((l) => (
                <a href="#" key={l}>{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>{FOOTER.copyright}</span>
          <span className="red">- Terms &amp; condition</span>
        </div>
      </div>
    </footer>
  );
}
