import { achievements } from "../lib/data";
import { detailIdForAchievement } from "../lib/home-details";
import { ExpandableBlock } from "./home-detail-context";

function isWin(item) {
  return item.victory === true;
}

function isCertificate(item) {
  return item.status === "Certificate";
}

function isExperience(item) {
  return item.victory === false || (item.victory !== true && item.status !== "Certificate");
}

function metaLine(item) {
  return [item.date, item.location].filter(Boolean).join(" · ");
}

/* Wins lead with the placing, so the card headline is the result rather than the event. */
function WinCard({ achievement }) {
  const detailId = detailIdForAchievement(achievement.slug);
  const context = achievement.details?.[0] ?? achievement.description;

  return (
    <article className="win-card" data-reveal="bottom">
      <ExpandableBlock detailId={detailId} className="win-card-link">
        <span className="win-card-result">{achievement.result ?? "Winner"}</span>
        <h3 className="win-card-title">{achievement.title}</h3>
        <span className="win-card-meta">{metaLine(achievement)}</span>
        <p className="win-card-blurb">{context}</p>
      </ExpandableBlock>
      {achievement.external_url ? (
        <a
          className="win-card-external"
          href={achievement.external_url}
          target="_blank"
          rel="noopener"
        >
          Open link ↗
        </a>
      ) : null}
    </article>
  );
}

function EntryRow({ achievement, reveal }) {
  const detailId = detailIdForAchievement(achievement.slug);
  const meta = metaLine(achievement);
  const externalLabel = achievement.external_url?.includes("devpost.com")
    ? "View on Devpost"
    : achievement.external_url?.includes("github.com")
      ? "View on GitHub"
      : "Open link";

  return (
    <div className="entry-card">
      <ExpandableBlock detailId={detailId} className="bento-row bento-row-entry" data-reveal={reveal}>
        <div className="bento-row-top">
          <span className="bento-row-main">{achievement.title}</span>
          {achievement.status ? <span className="home-tag">{achievement.status}</span> : null}
        </div>
        {meta ? <span className="bento-row-dates">{meta}</span> : null}
        <p className="bento-row-blurb">{achievement.description}</p>
      </ExpandableBlock>
      {achievement.external_url ? (
        <a
          className="entry-card-external"
          href={achievement.external_url}
          target="_blank"
          rel="noopener"
        >
          {externalLabel} ↗
        </a>
      ) : null}
    </div>
  );
}

export default function AchievementsBoard() {
  const wins = achievements.filter(isWin);
  const experiences = achievements.filter(isExperience);
  const certificates = achievements.filter(isCertificate);

  // Activity per year, newest first, so the bars read as a recent-first history.
  const counts = new Map();
  achievements.forEach((item) => {
    if (!item.date) return;
    counts.set(item.date, (counts.get(item.date) ?? 0) + 1);
  });
  const years = [...counts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
  const busiest = years.reduce((max, entry) => Math.max(max, entry.count), 1);

  const index = [
    { href: "#wins", label: "Wins", count: wins.length },
    { href: "#experiences", label: "Competitions & Extracurriculars", count: experiences.length },
    { href: "#certificates", label: "Certificates", count: certificates.length },
  ];

  return (
    <div className="bento-grid">
      <section className="bento bento-7" data-reveal="left">
        <h2 className="bento-title">The Record</h2>
        <p className="bento-lead">
          Hackathons, CTFs, and engineering competitions since 2022, plus the programs and side
          pursuits that came with them. Each entry opens into what was actually built.
        </p>
        <div className="bento-rows bento-index">
          {index.map((entry) => (
            <a key={entry.href} href={entry.href} className="bento-row bento-row-inline" data-reveal="left">
              <span className="bento-row-main">{entry.label}</span>
              <span className="bento-row-meta">{entry.count}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="bento bento-5" data-reveal="right">
        <h2 className="bento-title">By Year</h2>
        <p className="bento-note">Entries logged per year.</p>
        <div className="year-bars">
          {years.map((entry) => (
            <div key={entry.year} className="year-bar" data-reveal="right">
              <span className="year-bar-label">{entry.year}</span>
              <span className="year-bar-track">
                <span
                  className="year-bar-fill"
                  style={{ "--fill": `${Math.round((entry.count / busiest) * 100)}%` }}
                />
              </span>
              <span className="year-bar-value">{entry.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="wins" className="bento bento-12" data-reveal="bottom">
        <div className="bento-head">
          <h2 className="bento-title">Wins</h2>
          <span className="bento-count">{wins.length}</span>
        </div>
        <div className="win-grid">
          {wins.map((achievement) => (
            <WinCard key={achievement.slug} achievement={achievement} />
          ))}
        </div>
      </section>

      <section id="experiences" className="bento bento-12" data-reveal="left">
        <div className="bento-head">
          <h2 className="bento-title">Competitions & Extracurriculars</h2>
          <span className="bento-count">{experiences.length}</span>
        </div>
        <p className="bento-note">
          Everything else entered, from CTFs and engineering challenges to the teams and programs
          around them.
        </p>
        <div className="bento-rows bento-rows-3">
          {experiences.map((achievement) => (
            <EntryRow key={achievement.slug} achievement={achievement} reveal="left" />
          ))}
        </div>
      </section>

      <section id="certificates" className="bento bento-12" data-reveal="right">
        <div className="bento-head">
          <h2 className="bento-title">Certificates</h2>
          <span className="bento-count">{certificates.length}</span>
        </div>
        <p className="bento-note">Programs completed outside of school credit.</p>
        <div className="bento-rows">
          {certificates.map((achievement) => (
            <EntryRow key={achievement.slug} achievement={achievement} reveal="right" />
          ))}
        </div>
      </section>
    </div>
  );
}
