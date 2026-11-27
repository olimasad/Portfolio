import PageDock from "../../components/page-dock";
import ProjectsBoard from "../../components/projects-board";

export const metadata = {
  title: "Projects - Oliver Massaad",
};

export default function ProjectsPage() {
  return (
    <>
      <header className="apple-hero apple-hero-page">
        <p className="apple-eyebrow intro-item" data-reveal="top">
          Software · VR & 3D · Media
        </p>
        <h1 className="apple-hero-title intro-item intro-name" data-reveal="scale">
          Projects
        </h1>
        <p className="apple-hero-sub intro-item" data-reveal="right">
          AI-powered and full-stack applications from concept to deployment.
        </p>
      </header>

      <div className="page-body apple-home apple-home-wide">
        <PageDock currentHref="/projects" />

        <ProjectsBoard />
      </div>
    </>
  );
}
