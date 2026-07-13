import { useEffect, useRef } from "react";

/*
 * Skills + Services as a glowing hexagon honeycomb. Rows alternate 4/3 so the
 * shorter rows nestle into the longer ones. Tiles fade/pop in with a stagger when
 * the grid scrolls into view, then their icons breathe an ambient accent glow.
 */
export default function Honeycomb({ items }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pattern = [4, 3];
  const rows = [];
  let i = 0, r = 0;
  while (i < items.length) {
    const n = pattern[r % 2];
    rows.push(items.slice(i, i + n));
    i += n;
    r += 1;
  }

  let idx = 0;
  return (
    <div className="honeycomb" ref={ref}>
      {rows.map((row, ri) => (
        <div className="hc-row" key={ri}>
          {row.map((it) => {
            const d = idx++;
            return (
              <div className="hex" style={{ "--cc": it.color, "--i": d }} key={it.key}>
                <div className="hex-in">
                  <span className="hex-ico" style={{ color: it.color }}>
                    {it.Icon && <it.Icon size={26} />}
                  </span>
                  <span className="hex-name">{it.title}</span>
                  <span className="hex-sub">{it.kind === "service" ? "Service" : it.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
