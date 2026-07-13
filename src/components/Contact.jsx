import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { CONTACT } from "../data";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section id="contact" className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <h3>Get in touch !</h3>
              <p>
                Always available for freelancing if the right project comes
                along, Feel free to contact me.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  e.target.reset();
                  setTimeout(() => setSent(false), 3500);
                }}
              >
                <div className="form-row">
                  <div className="field">
                    <label>Name</label>
                    <input placeholder="Your name" required />
                  </div>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" placeholder="Your email" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Subject</label>
                    <input placeholder="your subject" />
                  </div>
                  <div className="field">
                    <label>Contact</label>
                    <input placeholder="+00 1234 5678 90" />
                  </div>
                </div>
                <div className="field full">
                  <label>Message</label>
                  <textarea rows={5} placeholder="Enter your message..." />
                </div>
                <button className="btn" type="submit">
                  {sent ? "Message sent ✓" : "Send message"}
                </button>
              </form>
            </div>

            <div className="contact-info">
              <div className="ci-item">
                <span className="ci-ico"><Phone size={20} /></span>
                <div>
                  <b>{CONTACT.phone}</b>
                  <span>{CONTACT.phoneNote}</span>
                </div>
              </div>
              <div className="ci-item">
                <span className="ci-ico"><Mail size={20} /></span>
                <div>
                  <b>{CONTACT.email}</b>
                  <span>{CONTACT.emailNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
