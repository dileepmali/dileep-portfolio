import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * PER-PAGE SIGNATURE MOTION — mirrors how the Florée site gives every route its
 * OWN dedicated animation hook. Each dedicated page below uses a DIFFERENT
 * technique; nothing is reused between pages:
 *
 *   /about    → skills reveal in a DIAGONAL WAVE + photo scale + info slide-in
 *   /services → cards ASSEMBLE from different edges (left / bottom / right)
 *   /resume   → timeline entries SLIDE in from ALTERNATING sides + badge pop
 *   /projects → cards DOOR-OPEN flip (rotateY) + scroll-velocity skew + clip wipe
 *   /blogs    → covers reveal via a HORIZONTAL CURTAIN clip + image zoom
 *   /contact  → form fields CASCADE up one-by-one
 *
 * The home one-pager is handled separately by useReveal.
 */

const st = (trigger, extra = {}) => ({
  trigger,
  start: "top 85%",
  once: true,
  ...extra,
});

export function usePageMotion(dep) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const path = dep || "/";
    if (path === "/") return; // home → useReveal

    const ctx = gsap.context(() => {
      // shared page-title entrance (the dark band) — content below is unique
      gsap.from(".page-band h1", {
        y: 60,
        opacity: 0,
        scale: 0.92,
        letterSpacing: "0.4em",
        duration: 1.1,
        ease: "power4.out",
      });

      // generic section-head rise (only pages that have one)
      gsap.utils.toArray(".section-head").forEach((h) =>
        gsap.from(h, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: st(h),
        })
      );

      // ---------------- /about — DIAGONAL WAVE ----------------
      if (path.startsWith("/about")) {
        gsap.from(".about-photo img", {
          scale: 1.18,
          opacity: 0,
          duration: 1.4,
          ease: "power3.out",
        });
        gsap.utils.toArray(".about-info, .about-details").forEach((el, i) =>
          gsap.from(el, {
            x: i % 2 ? 70 : -70,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: st(el),
          })
        );
        const cols = 4;
        gsap.utils.toArray(".skills-grid > .skill-card").forEach((c, i) => {
          const wave = (i % cols) + Math.floor(i / cols); // diagonal delay
          gsap.from(c, {
            opacity: 0,
            y: 60,
            rotateZ: -7,
            scale: 0.8,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: wave * 0.09,
            scrollTrigger: st(".skills-grid", { start: "top 82%" }),
          });
        });
      }

      // ---------------- /services — ASSEMBLE FROM EDGES ----------------
      else if (path.startsWith("/services")) {
        const from = [
          { x: -140, y: 0, rotate: -10 },
          { x: 0, y: 130, rotate: 0 },
          { x: 140, y: 0, rotate: 10 },
        ];
        gsap.utils.toArray(".services-grid > .service-card").forEach((c, i) => {
          const f = from[i % 3];
          gsap.from(c, {
            opacity: 0,
            x: f.x,
            y: f.y,
            rotate: f.rotate,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: st(c, { start: "top 88%" }),
          });
        });
      }

      // ---------------- /resume — ALTERNATING SLIDE ----------------
      else if (path.startsWith("/resume")) {
        gsap.utils.toArray(".timeline2 > .tl-card").forEach((c) => {
          const fromRight = c.classList.contains("rev");
          gsap.from(c, {
            opacity: 0,
            x: fromRight ? 130 : -130,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: st(c, { start: "top 82%" }),
          });
          const badge = c.querySelector(".tl-badge");
          if (badge)
            gsap.from(badge, {
              scale: 0,
              rotate: -45,
              duration: 0.7,
              ease: "back.out(2.2)",
              delay: 0.25,
              scrollTrigger: st(c, { start: "top 82%" }),
            });
        });
      }

      // ---------------- /projects — DOOR-OPEN FLIP + SKEW ----------------
      else if (path.startsWith("/projects")) {
        const cards = gsap.utils.toArray(".pshow-grid > .pshow-card");
        cards.forEach((c, i) => {
          gsap.set(c, {
            transformPerspective: 1000,
            transformOrigin: "left center",
          });
          gsap.from(c, {
            opacity: 0,
            rotateY: -85,
            duration: 1.1,
            ease: "power3.out",
            delay: (i % 3) * 0.1,
            scrollTrigger: st(c, { start: "top 86%" }),
          });
        });
        gsap.utils.toArray(".pshow-logo").forEach((f) =>
          gsap.fromTo(
            f,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: st(f, { start: "top 88%" }),
            }
          )
        );
        const skew = gsap.utils.toArray(".pshow-logo");
        if (skew.length) {
          const setters = skew.map((e) =>
            gsap.quickTo(e, "skewY", { duration: 0.6, ease: "power3" })
          );
          ScrollTrigger.create({
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -320);
              setters.forEach((s) => s(v));
            },
          });
        }
      }

      // ---------------- /blogs — HORIZONTAL CURTAIN + ZOOM ----------------
      else if (path.startsWith("/blogs")) {
        gsap.utils.toArray(".blog-grid > .blog-card").forEach((c, i) => {
          const thumb = c.querySelector(".thumb");
          const body = c.querySelector(".blog-body");
          if (thumb)
            gsap.fromTo(
              thumb,
              { clipPath: "inset(0 100% 0 0)" },
              {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.1,
                ease: "power4.out",
                delay: i * 0.1,
                scrollTrigger: st(c, { start: "top 85%" }),
              }
            );
          if (body)
            gsap.from(body, {
              opacity: 0,
              y: 34,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.3 + i * 0.1,
              scrollTrigger: st(c, { start: "top 85%" }),
            });
        });
        gsap.utils.toArray(".blog-card .thumb img").forEach((img) =>
          gsap.fromTo(
            img,
            { scale: 1.35 },
            {
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".thumb"),
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        );
      }

      // ---------------- /contact — SEQUENTIAL CASCADE ----------------
      else if (path.startsWith("/contact")) {
        const items = gsap.utils.toArray(
          ".contact-grid h3, .contact-grid > div > p, .field, .contact-grid .btn, .contact-info .ci-item"
        );
        items.forEach((el, i) =>
          gsap.from(el, {
            opacity: 0,
            y: 46,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: st(".contact-grid", { start: "top 80%" }),
          })
        );
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [dep]);
}
