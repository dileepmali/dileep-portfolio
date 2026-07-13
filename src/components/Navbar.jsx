import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronsRight } from "lucide-react";
import { NAV_LINKS } from "../data";

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    // only toggle the navbar background on scroll
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // dedicated pages have a dark band on top -> use light nav text until scrolled
  const onDark = pathname !== "/" && !scrolled;

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""} ${onDark ? "on-dark" : ""}`}>
      <div className="container nav-inner">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="mark">S</span>SELFOWN
        </NavLink>

        <ul className={`nav-links ${open ? "open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <NavLink to="/contact" className="btn hide-mobile">
            Hire Me! <ChevronsRight size={16} />
          </NavLink>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
