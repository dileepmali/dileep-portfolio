function FloralDecor() {
  return (
    <svg className="cta-decor" viewBox="0 0 240 200" fill="none" aria-hidden="true">
      <circle cx="62" cy="42" r="14" stroke="#1bb6c1" strokeWidth="3" opacity="0.45" />
      <circle cx="150" cy="156" r="18" stroke="#5b8def" strokeWidth="3" opacity="0.45" />
      <circle cx="120" cy="74" r="9" stroke="#8b7ef0" strokeWidth="3" opacity="0.5" />
      <g opacity="0.65">
        <ellipse cx="100" cy="30" rx="8" ry="18" fill="#19c39c" transform="rotate(30 100 30)" />
        <ellipse cx="182" cy="60" rx="8" ry="18" fill="#5b8def" transform="rotate(-25 182 60)" />
        <ellipse cx="204" cy="112" rx="8" ry="18" fill="#1bb6c1" transform="rotate(40 204 112)" />
        <ellipse cx="88" cy="120" rx="8" ry="18" fill="#8b7ef0" transform="rotate(-15 88 120)" />
        <ellipse cx="162" cy="22" rx="7" ry="15" fill="#1bb6c1" transform="rotate(60 162 22)" />
        <ellipse cx="50" cy="92" rx="7" ry="15" fill="#19c39c" transform="rotate(20 50 92)" />
        <ellipse cx="210" cy="160" rx="7" ry="15" fill="#8b7ef0" transform="rotate(-40 210 160)" />
      </g>
    </svg>
  );
}

export default function CTA() {
  return (
    <section className="cta">
      <FloralDecor />
      <div className="container cta-inner">
        <div className="cta-text">
          <h3>I Am Available For Freelancer.</h3>
          <p>Browse hundreds of job offers and find the best suitable position.</p>
        </div>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email Address" required />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
