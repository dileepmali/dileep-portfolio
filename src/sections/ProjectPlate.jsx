/*
 * The artwork on a project card.
 *
 * What was here first was a stock photograph — somebody else's phone, running
 * somebody else's app. Five of those in a row read as a mood board, and none of
 * them were pictures of anything built here.
 *
 * The reference does the thing that actually sells work: a device sitting in a
 * lit field, with the product's own screen on it. That is what this draws. Each
 * plate is a ground, a soft cast shadow, one device — a phone or a browser
 * window — and a screen laid out the way that project's screen would be.
 *
 * Drawn, not photographed, and deliberately without a single word on any
 * screen: the blocks say list, dashboard, calendar, map, but nothing on them is
 * dressed up as a real reading of real data. They are covers.
 *
 * Only the page's palette: ink, cream, and the yellow, used once per screen
 * where the eye should land. That is what makes five different drawings read as
 * one set as the row goes past.
 *
 * These stay until there are real screenshots of AnantSpace and Aukra. When
 * there are, `image` on a PROJECTS entry takes an import and the card renders
 * that photograph instead — see the fallback in Projects.jsx.
 */

/* The card is a tall portrait box. Drawing at this size puts every stroke width
   below into hairline range at the widths the card actually renders at. */
const W = 900;
const H = 1400;

const CREAM = "#f4f3ec";
const ACCENT = "#ffff23";

/*
 * The grounds.
 *
 * `from`/`to` are the field and `glow` the bloom behind the device — the light
 * it is standing in, which is most of what separates a render from a flat
 * drawing.
 *
 * All five are pale. The dark ones that were here first put a dark device on a
 * dark field and the screen had to fight to be seen; a lit field with a black
 * device on it is the one that read, so it is now the whole row.
 *
 * They are then pulled as far apart as the palette allows — not five shades of
 * the same cream, which is what the first pass at this was and what made the
 * row look like one card printed five times. Warm gold, cold white, a mid-tone
 * taupe well down the value scale, the page's own bone, and a ground washed
 * with the yellow itself. Temperature and value both move, so no two cards are
 * next to each other in either.
 *
 * `light` is what the rest of the file reads: it flips the device to its dark
 * screen and pulls the vignette and the grain back, both of which were built
 * for a dark plate and are heavy-handed on a pale one.
 */
const GROUNDS = {
  sand: { from: "#f7ead0", to: "#dcc493", glow: "#fff7e0", bloom: 0.6, light: true },
  pearl: { from: "#f8f8f5", to: "#d0d1cd", glow: "#ffffff", bloom: 0.45, light: true },
  taupe: { from: "#cfcabb", to: "#9b9685", glow: "#f2efe4", bloom: 0.55, light: true },
  bone: { from: "#efebd8", to: "#d3cfb6", glow: "#fffdec", bloom: 0.5, light: true },
  citrus: { from: "#f6f3cb", to: "#dcd68e", glow: "#fffee8", bloom: 0.55, light: true },
};

/* Two screen palettes. Every screen below is drawn against one of these, so a
   light screen and a dark one are the same drawing in different ink. */
const THEMES = {
  light: {
    bg: "#f7f6ef",
    surface: "#ffffff",
    ink: "#0d0d0d",
    frame: "#101012",
  },
  dark: {
    bg: "#131519",
    surface: "#1d2025",
    ink: CREAM,
    frame: "#141416",
  },
};

/* Shorthands, so the screens below read as layout rather than as fill rules. */
const bar = (x, y, w, h, o, fill) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} fillOpacity={o} />
);
const tile = (x, y, w, h, r, o, fill) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} fillOpacity={o} />
);

/*
 * The screens.
 *
 * `device` decides the frame the screen is drawn into, and with it the shape of
 * the layout: `phone` gets a 384×820 portrait, `browser` a 720×428 landscape.
 * The mix is on purpose — five phones in a row is a phone shop.
 */
const SCREENS = {
  /* Ledger — money in, money out. A balance held at the top and the entries
     under it, which is the whole app in one screen. */
  ledger: {
    device: "phone",
    theme: "dark",
    draw: (t) => (
      <g>
        {/* The balance, held above the entries: the one thing the app is opened
            to look at. */}
        <rect
          x={24}
          y={128}
          width={336}
          height={140}
          rx={22}
          fill={t.surface}
          stroke={t.ink}
          strokeOpacity={0.1}
        />
        {bar(52, 158, 84, 9, 0.35, t.ink)}
        {bar(52, 184, 176, 24, 0.92, t.ink)}
        {tile(52, 224, 70, 22, 11, 1, ACCENT)}
        {bar(140, 230, 46, 10, 0.25, t.ink)}

        {bar(24, 296, 76, 10, 0.3, t.ink)}

        {[0, 1, 2, 3, 4].map((i) => {
          const y = 326 + i * 74;
          const lead = i === 1;
          return (
            <g key={i}>
              <circle cx={48} cy={y + 24} r={19} fill={t.ink} fillOpacity={0.07} />
              {/* The in/out mark, the only glyph on the screen. */}
              <path
                d={
                  i % 2
                    ? `M 41 ${y + 19} l 7 8 l 7 -8`
                    : `M 41 ${y + 28} l 7 -8 l 7 8`
                }
                fill="none"
                stroke={t.ink}
                strokeOpacity={0.45}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {bar(84, y + 12, 128, 12, 0.72, t.ink)}
              {bar(84, y + 34, 78, 9, 0.22, t.ink)}
              {lead
                ? tile(268, y + 14, 92, 22, 11, 1, ACCENT)
                : bar(284, y + 17, 76, 15, 0.55, t.ink)}
            </g>
          );
        })}
      </g>
    ),
  },

  /* Vault — everything in one place, seen wide. A browser, because this is the
     screen somebody keeps open on a desktop rather than reaches for. */
  vault: {
    device: "browser",
    theme: "dark",
    draw: (t) => (
      <g>
        {bar(32, 34, 176, 18, 0.85, t.ink)}
        {bar(32, 64, 112, 10, 0.28, t.ink)}
        {tile(560, 32, 128, 30, 15, 0.9, ACCENT)}

        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x={32 + i * 168}
              y={112}
              width={150}
              height={178}
              rx={20}
              fill={t.surface}
              stroke={t.ink}
              strokeOpacity={i === 1 ? 0.16 : 0.07}
            />
            {tile(56 + i * 168, 136, 44, 44, 14, i === 1 ? 1 : 0.18, i === 1 ? ACCENT : t.ink)}
            {bar(56 + i * 168, 202, 96, 11, 0.6, t.ink)}
            {bar(56 + i * 168, 224, 62, 9, 0.24, t.ink)}
            {bar(56 + i * 168, 254, 102, 6, 0.14, t.ink)}
          </g>
        ))}

        {[0, 1].map((i) => (
          <g key={i}>
            {tile(32, 318 + i * 56, 656, 44, 14, 1, t.surface)}
            <circle cx={58} cy={340 + i * 56} r={11} fill={t.ink} fillOpacity={0.18} />
            {bar(84, 334 + i * 56, 132, 11, 0.5, t.ink)}
            {bar(560, 334 + i * 56, 104, 11, 0.2, t.ink)}
          </g>
        ))}
      </g>
    ),
  },

  /* Signal — a dashboard that reads at a glance. Rail, three figures, one
     chart: the arrangement every dashboard lands on eventually. */
  signal: {
    device: "browser",
    theme: "dark",
    draw: (t) => {
      const line =
        "M 216 348 L 288 322 L 360 332 L 432 286 L 504 300 L 576 250 L 648 226";

      return (
        <g>
          {/* Rail. */}
          {tile(0, 0, 158, 428, 0, 0.04, t.ink)}
          {tile(24, 26, 26, 26, 9, 1, ACCENT)}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              {i === 0 && tile(14, 80, 130, 30, 10, 0.06, t.ink)}
              {bar(28, 90 + i * 40, 96, 10, i === 0 ? 0.7 : 0.2, t.ink)}
            </g>
          ))}

          {bar(190, 30, 168, 16, 0.82, t.ink)}
          {bar(190, 56, 104, 9, 0.25, t.ink)}

          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={190 + i * 172}
                y={86}
                width={156}
                height={88}
                rx={14}
                fill={t.surface}
                stroke={t.ink}
                strokeOpacity={0.07}
              />
              {bar(210 + i * 172, 104, 58, 8, 0.25, t.ink)}
              {bar(210 + i * 172, 124, 84, 17, 0.85, t.ink)}
              {i === 0
                ? tile(210, 152, 44, 12, 6, 1, ACCENT)
                : bar(210 + i * 172, 154, 44, 9, 0.15, t.ink)}
            </g>
          ))}

          {/* The chart. */}
          <rect
            x={190}
            y={190}
            width={500}
            height={208}
            rx={14}
            fill={t.surface}
            stroke={t.ink}
            strokeOpacity={0.07}
          />
          {[248, 296, 344].map((y) => (
            <line
              key={y}
              x1={216}
              y1={y}
              x2={664}
              y2={y}
              stroke={t.ink}
              strokeOpacity={0.06}
              strokeWidth={1.5}
            />
          ))}
          <path
            d={`${line} L 648 372 L 216 372 Z`}
            fill={t.ink}
            fillOpacity={0.06}
          />
          <path
            d={line}
            fill="none"
            stroke={t.ink}
            strokeOpacity={0.85}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={648} cy={226} r={14} fill={ACCENT} fillOpacity={0.25} />
          <circle cx={648} cy={226} r={7} fill={ACCENT} stroke={t.ink} strokeWidth={2} />
          {bar(216, 212, 74, 10, 0.3, t.ink)}
        </g>
      );
    },
  },

  /* Orbit — a week, and what is on it. The strip across the top is the three
     timezones question: one column is today, everywhere. */
  orbit: {
    device: "phone",
    theme: "dark",
    draw: (t) => (
      <g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 24 + i * 48;
          const today = i === 3;
          return (
            <g key={i}>
              {tile(x, 132, 40, 60, 16, today ? 1 : 0.06, today ? ACCENT : t.ink)}
              {/* Day letter over date. Today drops the letter and carries the
                  date alone — two marks inside a filled cell this small stop
                  reading as type and start reading as a glyph. */}
              {!today && tile(x + 12, 146, 16, 5, 2, 0.22, t.ink)}
              {today
                ? tile(x + 9, 152, 22, 12, 3, 0.9, "#0d0d0d")
                : tile(x + 9, 160, 22, 11, 3, 0.45, t.ink)}
            </g>
          );
        })}

        {[0, 1, 2].map((i) => {
          const y = 224 + i * 116;
          const lead = i === 0;
          return (
            <g key={i}>
              {tile(24, y, 336, 96, 18, 0.05, t.ink)}
              <rect
                x={24}
                y={y}
                width={6}
                height={96}
                rx={3}
                fill={lead ? ACCENT : t.ink}
                fillOpacity={lead ? 1 : 0.25}
              />
              {bar(48, y + 22, 148, 12, 0.6, t.ink)}
              {bar(48, y + 48, 92, 9, 0.22, t.ink)}
              {/* Who is on it. Overlapping heads, the way every scheduler
                  stacks its attendees. */}
              {[0, 1, 2].map((k) => (
                <circle
                  key={k}
                  cx={288 + k * 22}
                  cy={y + 62}
                  r={13}
                  fill={t.ink}
                  fillOpacity={0.14}
                  stroke={t.bg}
                  strokeWidth={3}
                />
              ))}
            </g>
          );
        })}

        {/* The one button that makes a new one. */}
        <circle cx={312} cy={694} r={32} fill={ACCENT} />
        <path
          d="M 312 680 L 312 708 M 298 694 L 326 694"
          stroke="#0d0d0d"
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      </g>
    ),
  },

  /* Relay — a courier's phone. The map is the screen; the sheet over it is the
     drop, which is the only thing being asked about. */
  relay: {
    device: "phone",
    theme: "dark",
    draw: (t) => {
      const route = "M 74 566 C 150 520 120 424 208 372 C 292 322 268 232 330 190";

      return (
        <g>
          {/* Ground plan under it — blocks and roads, kept faint enough to stay
              a texture rather than a picture. */}
          <g stroke={t.ink} strokeOpacity={0.07} strokeWidth={12}>
            <line x1={-20} y1={250} x2={404} y2={224} />
            <line x1={-20} y1={470} x2={404} y2={444} />
            <line x1={120} y1={-20} x2={158} y2={620} />
            <line x1={300} y1={-20} x2={330} y2={620} />
          </g>
          {[
            [20, 120, 84, 92],
            [186, 96, 96, 108],
            [24, 300, 78, 118],
            [200, 280, 108, 132],
          ].map(([x, y, w, h]) => tile(x, y, w, h, 10, 0.03, t.ink))}

          {/* The route. */}
          <path
            d={route}
            fill="none"
            stroke={ACCENT}
            strokeOpacity={0.16}
            strokeWidth={20}
            strokeLinecap="round"
          />
          <path
            d={route}
            fill="none"
            stroke={ACCENT}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx={74} cy={566} r={11} fill={CREAM} stroke={t.bg} strokeWidth={4} />
          <circle cx={330} cy={190} r={26} fill={ACCENT} fillOpacity={0.18} />
          <circle cx={330} cy={190} r={13} fill={ACCENT} stroke={t.bg} strokeWidth={4} />

          {/* The sheet. */}
          <rect x={0} y={556} width={384} height={288} rx={30} fill={t.surface} />
          {bar(168, 576, 48, 5, 0.25, t.ink)}
          {bar(28, 604, 156, 14, 0.75, t.ink)}
          {bar(28, 632, 96, 10, 0.25, t.ink)}
          {tile(268, 600, 88, 26, 13, 0.1, t.ink)}
          <circle cx={48} cy={686} r={18} fill={t.ink} fillOpacity={0.1} />
          {bar(80, 674, 120, 11, 0.5, t.ink)}
          {bar(80, 694, 76, 9, 0.2, t.ink)}
          {tile(24, 736, 336, 50, 25, 1, ACCENT)}
          {bar(160, 756, 64, 11, 0.65, "#0d0d0d")}
        </g>
      );
    },
  },
};

/* The phone. Body, bezel, the screen the drawing goes in, and the two edges of
   light that stop the whole thing reading as a flat rounded rectangle. */
function Phone({ id, theme, children }) {
  return (
    <g>
      {/* Side buttons, behind the body so only their ends show. */}
      {tile(-224, -230, 12, 52, 6, 0.5, "#3a3a3e")}
      {tile(-224, -156, 12, 88, 6, 0.5, "#3a3a3e")}
      {tile(212, -180, 12, 120, 6, 0.5, "#3a3a3e")}

      <rect
        x={-214}
        y={-434}
        width={428}
        height={868}
        rx={62}
        fill={`url(#edge-${id})`}
      />
      <rect x={-204} y={-424} width={408} height={848} rx={54} fill={theme.frame} />
      <rect x={-192} y={-412} width={384} height={824} rx={44} fill={theme.bg} />

      <g clipPath={`url(#screen-${id})`}>
        <g transform="translate(-192 -412)">
          {children}
          {/* Status bar and home indicator: the two marks that make a rectangle
              read as a phone screen rather than a card. */}
          {bar(24, 26, 42, 11, 0.55, theme.ink)}
          {bar(300, 26, 60, 11, 0.4, theme.ink)}
          {bar(132, 792, 120, 6, 0.28, theme.ink)}
        </g>
        {/* The light across the glass. */}
        <path
          d="M -192 -412 L 40 -412 L -192 140 Z"
          fill={CREAM}
          fillOpacity={0.05}
        />
      </g>

      <rect x={-46} y={-402} width={92} height={26} rx={13} fill="#000" />
      <rect
        x={-192}
        y={-412}
        width={384}
        height={824}
        rx={44}
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.1}
        strokeWidth={1.5}
      />
    </g>
  );
}

/* The browser window. Same idea, landscape, and the chrome is three dots and an
   address pill — any more and it starts claiming to be a particular browser. */
function Browser({ id, theme, children }) {
  return (
    <g>
      <rect
        x={-368}
        y={-243}
        width={736}
        height={486}
        rx={22}
        fill={`url(#edge-${id})`}
      />
      <rect x={-360} y={-235} width={720} height={470} rx={16} fill={theme.frame} />

      <g clipPath={`url(#screen-${id})`}>
        <rect x={-360} y={-235} width={720} height={470} fill={theme.bg} />
        <g transform="translate(-360 -193)">{children}</g>
      </g>

      {/* Chrome, drawn over the clip so the top bar is never part of the page. */}
      <rect x={-360} y={-235} width={720} height={42} rx={0} fill={theme.frame} />
      {[-336, -318, -300].map((cx) => (
        <circle key={cx} cx={cx} cy={-214} r={5} fill={CREAM} fillOpacity={0.22} />
      ))}
      <rect
        x={-268}
        y={-224}
        width={300}
        height={20}
        rx={10}
        fill={CREAM}
        fillOpacity={0.08}
      />
      <rect
        x={-360}
        y={-235}
        width={720}
        height={470}
        rx={16}
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.12}
        strokeWidth={1.5}
      />
    </g>
  );
}

/*
 * `plate` names the screen and the ground it stands in; an unrecognised one
 * still renders the field, so a project added to the data gets a respectable
 * dark card rather than a hole.
 */
export default function ProjectPlate({ plate = {}, className }) {
  const { screen, ground = "graphite", tilt = -5 } = plate;
  const id = screen || ground;
  const g = GROUNDS[ground] || GROUNDS.graphite;
  const spec = SCREENS[screen];
  const theme = THEMES[spec?.theme || (g.light ? "dark" : "light")];
  const isPhone = !spec || spec.device === "phone";

  /* Where the device sits, and how big. The phone is drawn at 428 wide against
     900, the window at 736 — both leave the top and bottom of the card quiet,
     which is where the pills and the name land. */
  const clip = isPhone
    ? { x: -192, y: -412, w: 384, h: 824, r: 44 }
    : { x: -360, y: -235, w: 720, h: 470, r: 16 };

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      /* `slice`, so the drawing crops the way a photograph would when the card
         is a different shape to this box — which it is at every breakpoint. */
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`ground-${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={g.from} />
          <stop offset="1" stopColor={g.to} />
        </linearGradient>

        {/* The light the device stands in. */}
        <radialGradient id={`bloom-${id}`}>
          <stop offset="0" stopColor={g.glow} stopOpacity={g.bloom} />
          <stop offset="1" stopColor={g.glow} stopOpacity="0" />
        </radialGradient>

        {/* The body's edge — light down one side, dark down the other, which is
            the whole of what makes a drawn device look machined. */}
        <linearGradient id={`edge-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a5a60" />
          <stop offset="0.32" stopColor="#232326" />
          <stop offset="0.68" stopColor="#3a3a3f" />
          <stop offset="1" stopColor="#121214" />
        </linearGradient>

        <clipPath id={`screen-${id}`}>
          <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} rx={clip.r} />
        </clipPath>

        {/* What the device casts. Long and soft, offset down — one shadow does
            more for depth here than any amount of detail on the body. */}
        <filter id={`cast-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="34"
            stdDeviation="42"
            floodColor="#000"
            floodOpacity={g.light ? 0.38 : 0.55}
          />
        </filter>

        {/* The floor's own blur — the contact shadow is a hard ellipse without
            it, and a hard shadow is the tell that nothing here is real. */}
        <filter id={`soft-${id}`} x="-50%" y="-150%" width="200%" height="400%">
          <feGaussianBlur stdDeviation="30" />
        </filter>

        {/*
         * Grain.
         *
         * The one thing that stops a flat vector field looking like a slide.
         * Coarse enough to survive the card being scaled down — finer and it
         * disappears on a phone, heavier and the plate looks dirty.
         */}
        <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        {/* Corners down, so the pills and the name always have something darker
            than the middle of the plate behind them. */}
        <radialGradient id={`vignette-${id}`}>
          <stop offset="0.62" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={g.light ? 0.22 : 0.5} />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#ground-${id})`} />
      <ellipse cx={W * 0.5} cy={H * 0.5} rx={W * 0.62} ry={H * 0.36} fill={`url(#bloom-${id})`} />

      {/* The floor, for the one device that stands on it. The phone runs off
          the bottom of the card — the way the reference lets it — so there is
          no contact to draw; the window sits in the frame and needs one. */}
      {!isPhone && (
        <ellipse
          cx={W * 0.5}
          cy={1090}
          rx={380}
          ry={38}
          fill="#000"
          fillOpacity={g.light ? 0.16 : 0.4}
          filter={`url(#soft-${id})`}
        />
      )}

      {/*
       * Where the device sits.
       *
       * The phone is scaled past the bottom edge on purpose: a device fully
       * inside the frame reads as a product shot on a website, and one running
       * out of the card reads as a crop of something bigger. The name at the
       * bottom of the card then sits over the lower third of it, which is the
       * reference's arrangement exactly.
       */}
      <g
        transform={`translate(${W / 2} ${isPhone ? 800 : 710}) rotate(${tilt}) scale(${
          isPhone ? 1.16 : 1.05
        })`}
        filter={`url(#cast-${id})`}
      >
        {spec &&
          (isPhone ? (
            <Phone id={id} theme={theme}>
              {spec.draw(theme)}
            </Phone>
          ) : (
            <Browser id={id} theme={theme}>
              {spec.draw(theme)}
            </Browser>
          ))}
      </g>

      <rect
        width={W}
        height={H}
        filter={`url(#grain-${id})`}
        /* Overlay grain darkens as much as it lifts, and on a bone plate the
           darkening is the half you see. */
        opacity={g.light ? 0.09 : 0.14}
        style={{ mixBlendMode: "overlay" }}
      />
      <rect width={W} height={H} fill={`url(#vignette-${id})`} />
    </svg>
  );
}
