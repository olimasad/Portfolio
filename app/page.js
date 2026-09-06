import Link from "next/link";
import PageDock from "../components/page-dock";
import { ExpandableBlock } from "../components/home-detail-context";
import IconCloudPanel from "../components/icon-cloud-panel";
import StatsBand from "../components/stats-band";
import StaggeredWordRotate from "../components/staggered-word-rotate";
import { achievements, cvHref, projects } from "../lib/data";
import { skills } from "../lib/skills";

const taglineWords = [
  "Full-stack web app developer",
  "Intern @ Morgan Stanley",
  "5x Hackathon Winner",
];

const experience = [
  {
    detailId: "experience-morgan-stanley",
    org: "Morgan Stanley",
    role: "Technologist IST Intern",
    dates: "2026",
    badge: "3 mo",
    blurb: "Technology and innovation work inside the IST organization.",
  },
  {
    detailId: "experience-sajo",
    org: "SAJO",
    role: "Innovation & Technology Intern",
    dates: "2023 – 2025",
    badge: "2 yrs",
    blurb: "VR office simulations, LiDAR capture, and web architecture.",
  },
];

const education = [
  {
    detailId: "education-dawson",
    school: "Dawson College",
    dates: "2024 – 2026",
    badge: "Current",
    program: "DEC Computer Science & Mathematics",
    tags: ["Coding Club Co-founder", "Hackathons"],
  },
  {
    detailId: "education-stanislas",
    school: "Stanislas College",
    dates: "2013 – 2024",
    badge: "Graduated",
    program: "High School Diploma",
    tags: ["Highest Honors", "RadioStan"],
  },
];

const profile = [
  { detailId: "profile-student", label: "Student", meta: "SCSM @ Dawson" },
  { detailId: "profile-developer", label: "Developer", meta: "Full-stack & software" },
  { detailId: "profile-founder", label: "Founder", meta: "Projects & coding club" },
  { detailId: "profile-vr-intern", label: "Modeler", meta: "VR intern @ SAJO" },
  { detailId: "profile-technologist-intern", label: "Technologist", meta: "IST @ Morgan Stanley" },
  { detailId: "profile-musician", label: "Musician", meta: "Piano · Guitar · RE:ZONE" },
];

const competitions = [
  { detailId: "award-aerohacks", title: "McGill AeroHacks", result: "1st Place", size: "150+ participants" },
  { detailId: "award-conuhacks-x", title: "ConUHacks X", result: "2nd Place", size: "1000+ participants" },
  { detailId: "award-athacks", title: "AtHacks", result: "3rd Place", size: "400+ participants" },
  { detailId: "award-hackdecouverte", title: "HackDécouverte", result: "Gemini API Award", size: "150+ participants" },
  { detailId: "award-dialogue", title: "Dialogue 2026", result: "Track Award", size: "200+ participants" },
];

/* Keep the dock light — same density as Projects / Achievements (3 jumps + page routes). */
const dockSections = [
  { id: "about", label: "About Me", icon: "about" },
  { id: "experience", label: "Experience", icon: "experience" },
  { id: "skills", label: "Skills", icon: "skills" },
];

const volunteer = [
  { detailId: "volunteer-shine-the-light", title: "Shine the Light", meta: "Awareness campaign" },
  { detailId: "volunteer-radiostan", title: "Mission Bon Accueil", meta: "Food for dog shelters" },
  { detailId: "volunteer-podcast", title: "RadioStan", meta: "Host & presenter" },
  { detailId: "volunteer-sports", title: "Soccer & Karate", meta: "Former competitor" },
  { detailId: "volunteer-rezone", title: "RE:ZONE", meta: "J-Rock keyboardist" },
];

export default function HomePage() {
  const wins = achievements.filter((item) => item.victory === true).length;

  const stats = [
    { value: wins, label: "Hackathon Wins" },
    { value: projects.length, label: "Projects Shipped" },
    { value: 3, label: "Years of Experience" },
  ];

  return (
    <>
      <header className="hero-flat">
        <h1 className="hero-name intro-item intro-name" data-reveal="scale">
          <span>Oliver</span>
          <br></br>
          <span>Massaad</span>
        </h1>
        <p className="hero-kicker intro-item" data-reveal="top">
          Computer Science Student · Dawson College
        </p>
        <p className="tagline intro-item" data-reveal="right">
          <StaggeredWordRotate words={taglineWords} />
        </p>
        <div className="cta intro-item" data-reveal="bottom">
          <Link href="/projects" className="btn btn-primary btn-pill">
            View Projects
          </Link>
          <Link href="/contact" className="btn btn-secondary btn-pill">
            Get in Touch
          </Link>
          <a href={cvHref} className="btn btn-secondary btn-pill" download>
            Download CV
          </a>
        </div>
        <div className="meta-pills intro-item" data-reveal="left">
          <span className="pill">AI & full-stack apps</span>
          <span className="pill">React frontends · Python backends</span>
          <span className="pill">Musician · Radio speaker</span>
        </div>
      </header>

      <div className="home-page">
        <StatsBand stats={stats} />

        <PageDock sections={dockSections} currentHref="/" />

        {/* Tiles deliberately vary in width row to row so the page never settles into one rhythm. */}
        <div className="home-bento">
          <section id="about" className="bento bento-7 bento-about" data-reveal="left">
            <h2 className="bento-title">About Me</h2>
            <p className="bento-lead">
              Computer science and mathematics student building high-impact software with practical AI
              integration. I plan, prototype, ship, and keep refining with real feedback.
            </p>
            <div className="home-about-tags">
              <span className="pill">Montreal, Canada</span>
              <span className="pill">Full-stack</span>
              <span className="pill">AI integration</span>
              <span className="pill">VR & 3D</span>
            </div>
          </section>

          <section id="profile" className="bento bento-5" data-reveal="right">
            <h2 className="bento-title">Profile</h2>
            <div className="bento-rows">
              {profile.map((item) => (
                <ExpandableBlock
                  key={item.detailId}
                  detailId={item.detailId}
                  className="bento-row bento-row-inline"
                  data-reveal="right"
                >
                  <span className="bento-row-main">{item.label}</span>
                  <span className="bento-row-meta">{item.meta}</span>
                </ExpandableBlock>
              ))}
            </div>
          </section>

          <section id="experience" className="bento bento-5" data-reveal="left">
            <h2 className="bento-title">Experience</h2>
            <div className="bento-rows">
              {experience.map((item) => (
                <ExpandableBlock
                  key={item.detailId}
                  detailId={item.detailId}
                  className="bento-row"
                  data-reveal="left"
                >
                  <div className="bento-row-top">
                    <span className="bento-row-main">{item.org}</span>
                    <span className="home-tag">{item.badge}</span>
                  </div>
                  <span className="bento-row-meta">{item.role}</span>
                  <span className="bento-row-dates">{item.dates}</span>
                  <p className="bento-row-blurb">{item.blurb}</p>
                </ExpandableBlock>
              ))}
            </div>
          </section>

          <section id="education" className="bento bento-7" data-reveal="right">
            <h2 className="bento-title">Education</h2>
            <div className="bento-rows">
              {education.map((item) => (
                <ExpandableBlock
                  key={item.detailId}
                  detailId={item.detailId}
                  className="bento-row"
                  data-reveal="right"
                >
                  <div className="bento-row-top">
                    <span className="bento-row-main">{item.school}</span>
                    <span className="home-tag">{item.badge}</span>
                  </div>
                  <span className="bento-row-dates">{item.dates}</span>
                  <span className="bento-row-meta">{item.program}</span>
                  <div className="home-entry-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </ExpandableBlock>
              ))}
            </div>
          </section>

          <section id="competitions" className="bento bento-8" data-reveal="left">
            <div className="bento-head">
              <h2 className="bento-title">Competitions Won</h2>
              <Link href="/achievements" className="home-head-link">
                View all →
              </Link>
            </div>
            <div className="bento-rows">
              {competitions.map((item) => (
                <ExpandableBlock
                  key={item.detailId}
                  detailId={item.detailId}
                  className="bento-row bento-row-award"
                  data-reveal="left"
                >
                  <span className="bento-row-main">{item.title}</span>
                  <span className="bento-row-result">{item.result}</span>
                  <span className="bento-row-meta">{item.size}</span>
                </ExpandableBlock>
              ))}
            </div>
          </section>

          <section id="volunteer" className="bento bento-4" data-reveal="right">
            <h2 className="bento-title">Volunteer</h2>
            <div className="bento-rows">
              {volunteer.map((item) => (
                <ExpandableBlock
                  key={item.detailId}
                  detailId={item.detailId}
                  className="bento-row"
                  data-reveal="right"
                >
                  <span className="bento-row-main">{item.title}</span>
                  <span className="bento-row-meta">{item.meta}</span>
                </ExpandableBlock>
              ))}
            </div>
          </section>

          <section id="skills" className="bento bento-12" data-reveal="bottom">
            <h2 className="bento-title">Technical Skills</h2>
            <div className="home-skills">
              <IconCloudPanel items={skills} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
