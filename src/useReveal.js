import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * BIG, unmistakable scroll-motion system (Florée-grade energy) applied WITHOUT
 * changing component markup:
 *
 *   1. Hero flies in on load — photo swings in, text words rise, button pops.
 *   2. Headings split into words that launch up out of a clip-mask.
 *   3. Cards FLIP up in 3D (top-hinge rotateX) + fade + scale, big stagger.
 *   4. Hero parallaxes away hard on scroll; photos parallax with depth.
 *
 * Entrance reveals use IntersectionObserver so they ALWAYS fire when visible.
 * Continuous parallax uses ScrollTrigger scrub. Re-runs per route via `dep`.
 */

// grids/rows whose direct children flip in one-after-another
const CARD_GROUPS = [
  ".services-grid > .service-card",
  ".skills-grid > .skill-card",
  ".timeline2 > .tl-card",
  ".blog-grid > .blog-card",
  ".proj-grid > .proj-card",
  ".pshow-grid > .pshow-card",
  ".about-top > *",
  ".about-page-grid > *",
  ".contact-grid > *",
  ".testi-wrap",
];

function splitWords(el) {
  if (el.dataset.rvSplit)
    return Array.from(el.querySelectorAll(":scope > span > span"));
  if (el.children.length) return null; // has <br>, <span> etc. — leave alone
  const text = el.textContent;
  el.dataset.rvSplit = "1";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const inners = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (chunk === "") return;
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(chunk));
      return;
    }
    const mask = document.createElement("span");
    mask.style.cssText =
      "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.14em;margin-bottom:-0.14em";
    const inner = document.createElement("span");
    inner.style.cssText = "display:inline-block;will-change:transform";
    inner.textContent = chunk;
    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  });
  return inners;
}

export function useReveal(dep) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // This hook animates the HOME one-pager only. Each dedicated page has its
    // OWN distinct signature motion in usePageMotion — no effect is reused.
    if (!document.querySelector(".hero")) return;

    // ---- HERO on-load entrance (big, immediate) ------------------------
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    const heroPhoto = document.querySelector(".hero .hero-photo");
    const heroBits = document.querySelectorAll(
      ".hero .greet, .hero h1, .hero .btn"
    );
    // fromTo (not from) so the END state is always explicit opacity:1 — a bare
    // .from() can leave text stuck invisible if the effect re-runs (StrictMode),
    // because its "to" value would be read as the current (already-0) opacity.
    if (heroPhoto)
      heroTl.fromTo(
        heroPhoto,
        { xPercent: -14, opacity: 0, scale: 0.9 },
        { xPercent: 0, opacity: 1, scale: 1, duration: 1.3 }
      );
    if (heroBits.length)
      heroTl.fromTo(
        heroBits,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.14 },
        0.25
      );

    // ---- Heading word-launch (masked) ----------------------------------
    const heads = new Map();
    document
      .querySelectorAll(".section-head h2, .page-band h2, .page-band h1")
      .forEach((h) => {
        const words = splitWords(h);
        if (words && words.length) {
          gsap.set(words, { yPercent: 125 });
          heads.set(h, words);
        }
      });

    // ---- 3D FLIP card reveals ------------------------------------------
    const blocks = new Set();
    CARD_GROUPS.forEach((sel) =>
      document.querySelectorAll(sel).forEach((el) => blocks.add(el))
    );
    // badges + paragraphs get a simpler rise (no 3D)
    const softBlocks = new Set();
    [".section-head .badge", ".section-head p"].forEach((sel) =>
      document.querySelectorAll(sel).forEach((el) => softBlocks.add(el))
    );

    const cardEls = Array.from(blocks);
    const softEls = Array.from(softBlocks);

    // give 3D perspective to each grid parent + a per-parent stagger index
    const perParent = new Map();
    cardEls.forEach((el) => {
      const p = el.parentElement;
      if (p && !p.dataset.rvPersp) {
        p.style.perspective = "1100px";
        p.dataset.rvPersp = "1";
      }
      const n = perParent.get(p) || 0;
      el.dataset.rvIdx = String(n);
      perParent.set(p, n + 1);
    });

    gsap.set(cardEls, {
      opacity: 0,
      y: 90,
      rotateX: -72,
      transformOrigin: "50% 0%",
      transformPerspective: 1100,
    });
    gsap.set(softEls, { opacity: 0, y: 40 });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          io.unobserve(el);

          if (heads.has(el)) {
            gsap.to(heads.get(el), {
              yPercent: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.09,
            });
            return;
          }
          if (el.dataset.rvIdx !== undefined && el.style.transformOrigin) {
            const idx = parseInt(el.dataset.rvIdx || "0", 10);
            gsap.to(el, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.0,
              ease: "back.out(1.6)",
              delay: Math.min(idx, 6) * 0.13,
              onComplete: () => gsap.set(el, { clearProps: "transform" }),
            });
          } else {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    heads.forEach((_, h) => io.observe(h));
    cardEls.forEach((el) => io.observe(el));
    softEls.forEach((el) => io.observe(el));

    // ---- Continuous parallax + cinematic scroll motion -----------------
    const ctx = gsap.context(() => {
      // hero content parallaxes away (slows, fades, shrinks) as you scroll off it
      const heroInner = document.querySelector(".hero .hero-grid");
      if (heroInner) {
        gsap.to(heroInner, {
          yPercent: 24,
          scale: 0.92,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // editorial CLIP-PATH WIPE-IN for rectangular media (blog covers, project
      // logos) — the frame unveils bottom-to-top as it enters (Florée signature)
      gsap.utils
        .toArray(".blog-card .thumb, .pshow-logo")
        .forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: frame, start: "top 88%", once: true },
            }
          );
        });

      // SCROLL-VELOCITY SKEW — media frames shear with scroll speed, then settle.
      // Applied to elements that carry no other transform, so nothing fights.
      const skewTargets = gsap.utils.toArray(".blog-card .thumb, .pshow-logo");
      if (skewTargets.length) {
        const setters = skewTargets.map((el) =>
          gsap.quickTo(el, "skewY", { duration: 0.6, ease: "power3" })
        );
        ScrollTrigger.create({
          onUpdate: (self) => {
            const s = gsap.utils.clamp(-6, 6, self.getVelocity() / -360);
            setters.forEach((set) => set(s));
          },
        });
      }

      gsap.utils.toArray(".about-photo img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest("section") || img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray(".blog-card .thumb img").forEach((img) => {
        gsap.set(img, { scale: 1.28 });
        gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".thumb") || img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      heroTl.kill();
      io.disconnect();
      ctx.revert();
      gsap.set([...cardEls, ...softEls], { clearProps: "opacity,transform" });
    };
  }, [dep]);
}
