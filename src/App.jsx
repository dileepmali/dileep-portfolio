import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CTA from "./components/CTA";
import {
  HomePage,
  AboutPage,
  ServicesPage,
  ResumePage,
  ProjectsPage,
  BlogsPage,
  ContactPage,
} from "./Pages";
import { useSmoothScroll } from "./useSmoothScroll";
import { useReveal } from "./useReveal";
import { useInteractions } from "./useInteractions";
import { usePageTransition } from "./usePremium";
import { usePageMotion } from "./usePageMotion";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useSmoothScroll();
  useReveal(pathname); // HOME one-pager reveals
  usePageMotion(pathname); // distinct signature motion per dedicated page
  useInteractions(pathname); // pointer tilt / spotlight / magnetic buttons
  usePageTransition(pathname); // cinematic panel wipe on every route change

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <>
      {/* cinematic route-transition panels (sweep up to reveal each page) */}
      <div className="page-wipe" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <ScrollToTop />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {pathname !== "/" && <CTA />}
      <Footer />
    </>
  );
}
