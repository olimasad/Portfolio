import PageDock from "../../components/page-dock";
import ProjectsBoard from "../../components/projects-board";
import { projectGroups } from "../../lib/data";

export const metadata = {
  title: "Projects - Oliver Massaad",
};

const dockSections = projectGroups.map((group) => ({
  id: group.id,
  label: group.label,
  icon: group.icon,
}));

export default function ProjectsPage() {
  return (
    <>
      <header className="page-header hero-flat">
        <h1 className="intro-item intro-name" data-reveal="scale">
          Projects
        </h1>
        <p className="hero-kicker intro-item" data-reveal="top">
          Software · VR & 3D · Media
        </p>
        <p className="intro-item" data-reveal="right">
          AI-powered and full-stack applications from concept to deployment.
        </p>
      </header>

      <div className="page-body">
        <PageDock sections={dockSections} currentHref="/projects" />

        <ProjectsBoard />
      </div>
    </>
  );
}
