// Line-art illustrations for the Resume section.
// stroke = currentColor so they adapt to light/dark theme.

const SOFT = "rgba(27, 182, 193, 0.14)";

export function EducationArt() {
  return (
    <svg
      viewBox="0 0 220 185"
      className="ill-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* mortarboard (graduation cap) */}
      <path d="M110 26 L186 56 L110 86 L34 56 Z" fill={SOFT} />
      {/* cap band */}
      <path d="M72 70 V106 C72 106 88 120 110 120 C132 120 148 106 148 106 V70" />
      {/* tassel */}
      <path d="M186 56 V108" />
      <circle cx="186" cy="114" r="6" fill="currentColor" stroke="none" />
      {/* open book */}
      <path d="M36 138 C64 127 90 127 110 138 C130 127 156 127 184 138 L184 170 C156 159 130 159 110 170 C90 159 64 159 36 170 Z" fill={SOFT} />
      <path d="M110 138 V170" />
    </svg>
  );
}

export function ExperienceArt() {
  return (
    <svg
      viewBox="0 0 220 185"
      className="ill-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* growth bars */}
      <rect x="26" y="120" width="38" height="44" rx="4" fill={SOFT} />
      <rect x="78" y="92" width="38" height="72" rx="4" />
      <rect x="130" y="58" width="38" height="106" rx="4" fill={SOFT} />
      {/* baseline */}
      <path d="M18 164 H196" />
      {/* trophy on the tallest bar */}
      <path d="M137 18 H161 V32 C161 45 155 52 149 52 C143 52 137 45 137 32 Z" fill={SOFT} />
      <path d="M137 22 H129 C124 22 124 34 137 37" />
      <path d="M161 22 H169 C174 22 174 34 161 37" />
      <path d="M149 52 V60" />
      <path d="M140 60 H158" />
      {/* upward arrow */}
      <path d="M182 96 L196 80 M196 80 L196 92 M196 80 L184 80" />
    </svg>
  );
}
