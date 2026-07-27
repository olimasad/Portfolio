"use client";

import { projects } from "../lib/data";
import DetailModal from "./detail-modal";
import { ExpandableBlock, HomeDetailProvider } from "./home-detail-context";

export default function ProjectsBoard() {
  return (
    <HomeDetailProvider>
      <section className="gallery-grid projects-gallery">
        {projects.map((project, index) => (
          <ExpandableBlock
            key={project.name}
            detailId={project.detailId}
            className="card gallery-item project-item ach-fade"
            data-reveal="bottom"
          >
            <div className="gallery-head">
              <span className="badge">Project {index + 1}</span>
            </div>
            <h2>{project.name}</h2>
            <p className="card-description">{project.description}</p>
          </ExpandableBlock>
        ))}
      </section>

      <DetailModal />
    </HomeDetailProvider>
  );
}
