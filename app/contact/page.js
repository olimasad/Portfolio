import { cvHref } from "../../lib/data";

export const metadata = {
  title: "Contact - Oliver Massaad",
};

const errorMessages = {
  missing_fields: "Please fill in your name, email, and message before sending.",
  invalid_email: "That email address doesn't look valid. Please double-check it and try again.",
};

const channels = [
  { label: "Email", value: "olimasad@gmail.com", href: "mailto:olimasad@gmail.com" },
  { label: "Phone", value: "+1 418-262-8434", href: "tel:+14182628434" },
  { label: "CV", value: "PDF", href: cvHref, download: true },
  { label: "GitHub", value: "olimasad", href: "https://github.com/olimasad", external: true },
  {
    label: "LinkedIn",
    value: "oliver-massaad",
    href: "https://www.linkedin.com/in/oliver-massaad-9765a0276/",
    external: true,
  },
  {
    label: "Instagram",
    value: "oliver_massaad",
    href: "https://www.instagram.com/oliver_massaad/",
    external: true,
  },
];

export default async function ContactPage({ searchParams }) {
  const params = await searchParams;
  const sent = params?.sent === "1";
  const errorCode = params?.error;
  const errorMessage = errorCode ? errorMessages[errorCode] : null;

  return (
    <>
      <header className="page-header hero-flat">
        <h1 className="intro-item intro-name" data-reveal="scale">
          Contact
        </h1>
        <p className="hero-kicker intro-item" data-reveal="top">
          Montreal, Canada
        </p>
        <p className="intro-item" data-reveal="right">
          Get in touch for opportunities or collaboration.
        </p>
      </header>

      <div className="page-body">
        {sent ? (
          <div className="msg-success" role="alert">
            Thanks! Your message has been sent. I&apos;ll get back to you soon.
          </div>
        ) : null}
        {errorCode ? (
          <div className="msg-error" role="alert">
            {errorMessage ?? (
              <>
                Message could not be sent right now. Please email me directly at{" "}
                <a href="mailto:olimasad@gmail.com">olimasad@gmail.com</a>.
              </>
            )}
          </div>
        ) : null}

        <div className="bento-grid">
          <section className="bento bento-7" data-reveal="left">
            <h2 className="bento-title">Say Hello</h2>
            <p className="bento-lead">
              Internships, freelance builds, hackathon teams, or just a question about something on
              this site. The fastest way to reach me is email.
            </p>
            <a className="contact-mail" href="mailto:olimasad@gmail.com">
              olimasad@gmail.com
            </a>
            <div className="contact-actions">
              <button type="button" className="btn btn-secondary btn-pill" id="emailbutton">
                Copy Email
              </button>
              <a
                href="https://www.linkedin.com/in/oliver-massaad-9765a0276/"
                target="_blank"
                rel="noopener"
                className="btn btn-secondary btn-pill"
              >
                LinkedIn
              </a>
              <a href={cvHref} className="btn btn-secondary btn-pill" download>
                Download CV
              </a>
            </div>
            <div className="bento-pills">
              <span className="pill">Montreal, Canada</span>
              <span className="pill">Open to internships</span>
              <span className="pill">English · French</span>
            </div>
          </section>

          <section className="bento bento-5" data-reveal="right">
            <h2 className="bento-title">Channels</h2>
            <div className="bento-rows">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  className="bento-row bento-row-inline"
                  href={channel.href}
                  data-reveal="right"
                  {...(channel.external ? { target: "_blank", rel: "noopener" } : {})}
                  {...(channel.download ? { download: true } : {})}
                >
                  <span className="bento-row-main">{channel.label}</span>
                  <span className="bento-row-meta">{channel.value}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="bento bento-12" data-reveal="bottom">
            <h2 className="bento-title">Send a Message</h2>
            <form className="contact-form" action="/api/contact" method="POST">
              <div className="contact-fields">
                <div className="contact-field">
                  <label htmlFor="name">Full name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="contact-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="contact-field contact-field-wide">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-pill">
                Send message
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
