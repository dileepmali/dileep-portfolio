import { ME, SOCIALS } from "../data";

export default function Contact() {
  const socials = SOCIALS.filter((s) => s.href);
  const year = new Date().getFullYear();

  return (
    <section className="contact" id="contact" data-nav-dark>
      <div className="wrap">
        <p
          className="eyebrow"
          data-tl-from="{'opacity': 0, 'y': 14}"
          data-tl-duration="0.7"
          data-tl-ease="power2.out"
        >
          Contact
        </p>

        {/*
         * The claim, in two layers.
         *
         * One sentence — "Ship your next product" — set as a solid line with the
         * last word dropped behind it at a fraction of the ink. The reference
         * opens its page this way; here it closes the page instead, which is
         * where a portfolio actually asks for the work.
         *
         * Not two separate headings: the words read in order and make one
         * sentence, so a screen reader gets the sentence and a sighted reader
         * gets the depth.
         */}
        <h2 className="contact-claim">
          <span
            className="contact-claim-front"
            data-tl-split="lines"
            data-tl-from="{'yPercent': 110}"
            data-tl-duration="1"
          >
            Ship Your Next
          </span>
          {/* Its own declaration, because an element carries one — and it is
              deliberately a beat behind the line above it, so the faded word
              settles after the sentence it belongs to has landed. */}
          <span
            className="contact-claim-back"
            data-tl-from="{'opacity': 0, 'y': 26}"
            data-tl-duration="1.1"
            data-tl-delay="0.25"
            data-tl-ease="power3.out"
          >
            Product
          </span>
        </h2>

        {/* What the reader actually gets, in one paragraph. The reference runs
            the same three beats — what works, what is holding it back, where it
            goes next — and they are worth keeping because they are the three
            things a client is trying to find out. */}
        <p
          className="contact-pitch"
          data-tl-from="{'opacity': 0, 'y': 20}"
          data-tl-duration="0.8"
          data-tl-delay="0.1"
          data-tl-ease="power2.out"
        >
          Every product has room to grow. You get a clear view of what is
          slowing the app down, what is worth building next, and how to get
          there — from an empty repository to something running on Android, iOS
          and the browser.
        </p>

        {/*
         * The opening line of the conversation, then the way to start it.
         *
         * A speech bubble rather than a heading: the question is meant to sound
         * like it is being asked by a person, which is the whole reason the
         * reference puts one here. Ours carries no portrait yet — the only
         * photograph on hand is the template's stock model, and a stranger's
         * face beside Dileep's own words would be a lie about who is speaking.
         * Drop a real cut-out in and this is where it goes.
         */}
        <div
          className="contact-cta"
          /* No `data-tl-children`: a bare stagger already means the direct
             children, which is exactly the bubble and the button. */
          data-tl-stagger="0.12"
          data-tl-from="{'opacity': 0, 'y': 18, 'scale': 0.96}"
          data-tl-duration="0.7"
          data-tl-ease="back.out(1.4)"
        >
          <p className="contact-bubble">Have something in mind?</p>
          <a className="btn" href={`mailto:${ME.email}`}>
            Let&rsquo;s talk
          </a>
        </div>

        {/* The address in full, under the button that opens the same mail
            client. Both are here because they are not the same act: the button
            is for the reader who wants to write now, and the address is for the
            one who wants to copy it somewhere else. Still the largest type on
            the page after the hero, which is the point of ending here. */}
        <a
          className="contact-mail"
          href={`mailto:${ME.email}`}
          data-tl-split="lines"
          data-tl-from="{'yPercent': 110}"
          data-tl-delay="0.1"
        >
          {ME.email}
        </a>

        {/*
         * `top bottom` rather than the default `top 82%`. This sits at the end
         * of the document, and 82% of the viewport is a point it can never
         * reach — the page runs out of scroll first. Firing as it enters the
         * viewport is both reachable and the right moment for a sign-off.
         */}
        <div
          className="contact-foot"
          data-tl-start="top bottom"
          data-tl-from="{'opacity': 0, 'y': 14}"
          data-tl-duration="0.8"
          data-tl-ease="power2.out"
        >
          <span>
            {ME.name} — {ME.role}
          </span>
          {socials.length > 0 && (
            <span className="contact-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </span>
          )}
          <span>© {year}</span>
        </div>
      </div>
    </section>
  );
}
