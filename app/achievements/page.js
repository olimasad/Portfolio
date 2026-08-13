import AchievementsBoard from "../../components/achievements-board";
import PageDock from "../../components/page-dock";

export const metadata = {
  title: "Achievements - Oliver Massaad",
};

const dockSections = [
  { id: "wins", label: "Wins", icon: "competitions" },
  { id: "experiences", label: "Competitions & Extracurriculars", icon: "list" },
  { id: "certificates", label: "Certificates", icon: "certificate" },
];

export default function AchievementsPage() {
  return (
    <>
      <header className="page-header hero-flat">
        <h1 className="intro-item intro-name" data-reveal="scale">
          Achievements
        </h1>
        <p className="hero-kicker intro-item" data-reveal="top">
          Hackathons · CTFs · Competitions
        </p>
        <p className="intro-item" data-reveal="right">
          Hackathons, competitions, certificates, and milestone recognitions.
        </p>
      </header>

      <div className="page-body">
        <PageDock sections={dockSections} currentHref="/achievements" />

        <AchievementsBoard />
      </div>
    </>
  );
}
