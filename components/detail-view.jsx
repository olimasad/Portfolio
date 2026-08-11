"use client";

import Link from "next/link";
import DetailGallery from "./detail-gallery";

export default function DetailView({ detail, backHref = "/", backLabel = "Back" }) {
  const items = detail.items ?? [];
  const links = items.filter((item) => item.href);
  // Link rows only belong in the Links card; repeating them under Highlights is noise.
  const notes = items.filter((item) => !item.href);

  return (
    <article className="detail-page">
      <div className="detail-page-nav intro-scope">
        <Link href={backHref} className="btn btn-secondary btn-pill intro-item" data-reveal="left">
          ← {backLabel}
        </Link>
      </div>

      <header className="detail-page-header intro-scope">
        {detail.badge ? (
          <span
            className={`badge intro-item${
              detail.badge === "Winner"
                ? " badge-winner"
                : detail.badge === "Certificate"
                  ? " badge-cert"
                  : ""
            }`}
            data-reveal="top"
          >
            {detail.badge}
          </span>
        ) : null}
        <h1 className="detail-page-title intro-item" data-reveal="scale">
          {detail.title}
        </h1>
        {detail.meta ? (
          <p className="detail-page-meta intro-item" data-reveal="bottom">
            {detail.meta}
          </p>
        ) : null}
      </header>

      <div className="detail-page-layout">
        <section className="detail-page-gallery section" data-reveal="left" aria-label="Gallery">
          <DetailGallery items={detail.gallery} />
        </section>

        <aside className="detail-page-side" data-reveal="right">
          {detail.summary ? (
            <section className="section detail-page-summary-card">
              <h2>Overview</h2>
              <p>{detail.summary}</p>
            </section>
          ) : null}

          {notes.length ? (
            <section className="section detail-page-notes-card">
              <h2>Highlights</h2>
              <ul className="detail-page-notes">
                {notes.map((item) => (
                  <li key={item.label}>{item.label}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {links.length ? (
            <section className="section detail-page-links-card">
              <h2>Links</h2>
              <div className="detail-page-links">
                {links.map((item) => (
                  <a
                    key={`${item.label}-${item.href}`}
                    className="btn btn-secondary btn-pill"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkLabel ?? "Open link"}
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
