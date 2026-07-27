"use client";

import { achievements } from "../lib/data";
import { detailIdForAchievement } from "../lib/home-details";
import DetailModal from "./detail-modal";
import { ExpandableBlock, HomeDetailProvider } from "./home-detail-context";

function isExperience(item) {
  return item.victory === false || (item.victory !== true && item.status !== "Certificate");
}

function AchievementCard({ achievement, variant }) {
  const detailId = detailIdForAchievement(achievement.slug);
  const badgeClass =
    variant === "winner"
      ? "badge badge-winner"
      : variant === "certificate"
        ? "badge badge-cert"
        : "badge badge-participant";
  const badgeLabel =
    variant === "winner" ? "Winner" : variant === "certificate" ? "Certificate" : achievement.status || "Participant";
  const cardClass =
    variant === "winner"
      ? "winner-card"
      : variant === "certificate"
        ? "certificate-card"
        : "participant-card";

  return (
    <ExpandableBlock
      detailId={detailId}
      className={`card achievement-card ${cardClass} ach-fade`}
      data-reveal="bottom"
    >
      <div className="top">
        <span className={badgeClass}>{badgeLabel}</span>
      </div>
      {achievement.date ? (
        <p className="meta achievement-meta-line">
          {achievement.date} · {achievement.location}
        </p>
      ) : null}
      <h2>{achievement.title}</h2>
      <p className="card-description">{achievement.description}</p>
      {achievement.team ? <p className="meta">Team: {achievement.team}</p> : null}
      <div className="achievement-actions">
        <span className="btn btn-secondary btn-pill achievement-btn">View Details</span>
        {achievement.external_url ? (
          <a
            className="btn btn-secondary btn-pill achievement-btn"
            href={achievement.external_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Link
          </a>
        ) : null}
      </div>
    </ExpandableBlock>
  );
}

export default function AchievementsBoard() {
  const winners = achievements.filter((achievement) => achievement.victory === true);
  const experiences = achievements.filter((achievement) => isExperience(achievement));
  const certificates = achievements.filter((achievement) => achievement.status === "Certificate");

  return (
    <HomeDetailProvider>
      <section className="achievement-tracks">
        <section className="achievement-track track-winners">
          <h2>Winner</h2>
          <div className="track-list">
            {winners.map((achievement) => (
              <AchievementCard key={achievement.slug} achievement={achievement} variant="winner" />
            ))}
          </div>
        </section>

        <section className="achievement-track track-participants">
          <h2>Experiences</h2>
          <div className="track-list">
            {experiences.map((achievement) => (
              <AchievementCard key={achievement.slug} achievement={achievement} variant="experience" />
            ))}
          </div>
        </section>

        <section className="achievement-track track-certificates">
          <h2>Certificates</h2>
          <div className="track-list">
            {certificates.map((achievement) => (
              <AchievementCard key={achievement.slug} achievement={achievement} variant="certificate" />
            ))}
          </div>
        </section>
      </section>

      <DetailModal />
    </HomeDetailProvider>
  );
}
