import { projectGroups, projects } from "../lib/data";
import { projectTools } from "../lib/project-tools";
import { ExpandableBlock } from "./home-detail-context";
import IconCloudPanel from "./icon-cloud-panel";

/*
 * Per-group tile shape. Widths are set here rather than derived from item counts so the
 * sections break at different points instead of forming one uniform column. Column counts
 * are picked so that tiles sharing a grid row end up the same number of rows tall.
 */
const LAYOUT = {
  software: { span: "bento-12", columns: 2, reveal: "bottom" },
  immersive: { span: "bento-6", columns: 1, reveal: "left" },
  media: { span: "bento-6", columns: 1, reveal: "right" },
};

export default function ProjectsBoard() {
  const numbered = projects.map((project, index) => ({
    ...project,
    number: String(index + 1).padStart(2, "0"),
  }));

  const grouped = projectGroups.map((group) => ({
    ...group,
    items: numbered.filter((project) => project.group === group.id),
  }));

  return (
    <div className="bento-grid">
      <section className="bento bento-7" data-reveal="left">
        <h2 className="bento-title">Selected Work</h2>
        <p className="bento-lead">
          {numbered.length} builds across three very different disciplines, from AI-backed apps to VR
          walkthroughs delivered for a general contractor. Every one has a write-up with the process
          behind it.
        </p>
        <div className="bento-rows bento-index">
          {grouped.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="bento-row bento-row-inline" data-reveal="left">
              <span className="bento-row-main">{group.label}</span>
              <span className="bento-row-meta">
                {group.items.length} {group.items.length === 1 ? "project" : "projects"}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="bento bento-5" data-reveal="right">
        <div className="bento-head">
          <h2 className="bento-title">Tools & Engines</h2>
          <span className="bento-count">{projectTools.length}</span>
        </div>
        <p className="bento-note">What the work above was actually built in.</p>
        <div className="tool-cloud">
          {/* The tile already explains itself above, so the cloud stays quiet until a pick. */}
          <IconCloudPanel items={projectTools} maxSize={340} emptyTitle={null} emptyHint={null} />
        </div>
      </section>

      {grouped.map((group) => {
        const layout = LAYOUT[group.id] ?? LAYOUT.media;

        return (
          <section
            key={group.id}
            id={group.id}
            className={`bento ${layout.span}`}
            data-reveal={layout.reveal}
          >
            <div className="bento-head">
              <h2 className="bento-title">{group.label}</h2>
              <span className="bento-count">{group.items.length}</span>
            </div>
            <p className="bento-note">{group.blurb}</p>
            <div className={`bento-rows${layout.columns === 2 ? " bento-rows-2" : ""}`}>
              {group.items.map((project) => (
                <ExpandableBlock
                  key={project.name}
                  detailId={project.detailId}
                  className="bento-row bento-row-project"
                  data-reveal={layout.reveal}
                >
                  <div className="bento-row-top">
                    <span className="bento-row-main">{project.name}</span>
                    <span className="bento-row-number">{project.number}</span>
                  </div>
                  <span className="bento-row-dates">{project.stack}</span>
                  <p className="bento-row-blurb">{project.description}</p>
                </ExpandableBlock>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
