import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Resume from "./components/Resume";
import ResumeHome from "./components/ResumeHome";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Projects from "./components/Projects";
import ProjectsShowcase from "./components/ProjectsShowcase";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import PageBand from "./components/PageBand";

// Home = single-page scroll (unchanged personal-info section, no photo)
export function HomePage() {
  return (
    <div className="home-cinematic">
      <Hero />
      {/* transparent scroll runway: while scrolling through this the hero stays
          pinned and the flower grows up to the top, THEN About slides over */}
      <div className="hero-grow-spacer" aria-hidden="true" />
      <div className="home-scroll">
        <About />
        <ResumeHome />
        <Testimonials />
        <CTA />
        <Projects />
        <Blogs />
        <Contact />
      </div>
    </div>
  );
}

// Dedicated pages — dark glowing band on top + that section's content
export function AboutPage() {
  return (
    <>
      <PageBand title="ABOUT ME" />
      <About page />
      <Resume />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageBand title="SERVICES" />
      <Services />
    </>
  );
}

export function ResumePage() {
  return (
    <>
      <PageBand title="RESUME" />
      <Resume />
    </>
  );
}

export function ProjectsPage() {
  return (
    <>
      <PageBand title="PROJECTS" />
      <ProjectsShowcase />
    </>
  );
}

export function BlogsPage() {
  return (
    <>
      <PageBand title="BLOGS" />
      <Blogs />
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageBand title="CONTACT" />
      <Contact />
    </>
  );
}
