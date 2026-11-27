import AchievementsBoard from "../../components/achievements-board";
import PageDock from "../../components/page-dock";

export const metadata = {
  title: "Achievements - Oliver Massaad",
};

export default function AchievementsPage() {
  return (
    <>
      <header className="apple-hero apple-hero-page">
        <p className="apple-eyebrow intro-item" data-reveal="top">
          Hackathons · CTFs · Competitions
        </p>
        <h1 className="apple-hero-title intro-item intro-name" data-reveal="scale">
          Achievements
        </h1>
        <p className="apple-hero-sub intro-item" data-reveal="right">
          Wins, certificates, and milestones — one story at a time.
        </p>
      </header>

      <div className="page-body apple-home apple-home-wide">
        <PageDock currentHref="/achievements" />

        <AchievementsBoard />
      </div>
    </>
  );
}
