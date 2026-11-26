import Link from "next/link";
import HomeAtmosphere from "../components/home-atmosphere";
import { ExpandableBlock } from "../components/home-detail-context";
import IconCloudPanel from "../components/icon-cloud-panel";
import PageDock from "../components/page-dock";
import SlidingCta from "../components/sliding-cta";
import StatsBand from "../components/stats-band";
import StaggeredWordRotate from "../components/staggered-word-rotate";
import { achievements, projects } from "../lib/data";
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
      <HomeAtmosphere />
      {/* AirPods-style product hero: brand, one line, one CTA group */}
      <header className="apple-hero">
        <p className="apple-eyebrow intro-item" data-reveal="top">
          Computer Science · Dawson College
        </p>
        <h1 className="apple-hero-title intro-item intro-name" data-reveal="scale">
          <span className="apple-hero-line">Oliver</span>
          <span className="apple-hero-line">Massaad</span>
        </h1>
        <p className="apple-hero-sub intro-item" data-reveal="right">
          <StaggeredWordRotate words={taglineWords} />
        </p>
        <SlidingCta />
      </header>

      <div className="home-page apple-home">
        {/* Quiet feature strip — like AirPods callouts, not a dashboard */}
        <section className="apple-strip" aria-label="Highlights">
          <StatsBand stats={stats} />
        </section>

        <PageDock sections={dockSections} currentHref="/" />

        {/* Story beat: one headline, one paragraph */}
        <section id="about" className="apple-story" data-reveal="bottom">
          <h2 className="apple-story-title">About me</h2>
          <p className="apple-story-lede">
            Computer science and mathematics student building high-impact software with practical AI
            integration. I plan, prototype, ship, and keep refining with real feedback.
          </p>
          <div className="apple-chip-row">
            <span className="pill">Montreal</span>
            <span className="pill">Full-stack</span>
            <span className="pill">AI</span>
            <span className="pill">VR & 3D</span>
          </div>
        </section>

        {/* Profile as a calm compare row */}
        <section id="profile" className="apple-section" data-reveal="bottom">
          <div className="apple-section-head">
            <h2 className="apple-section-title">Profile</h2>
          </div>
          <div className="apple-compare">
            {profile.map((item) => (
              <ExpandableBlock
                key={item.detailId}
                detailId={item.detailId}
                className="apple-tile"
                data-reveal="bottom"
              >
                <span className="apple-tile-label">{item.label}</span>
                <span className="apple-tile-meta">{item.meta}</span>
              </ExpandableBlock>
            ))}
          </div>
        </section>

        {/* Experience + Education side by side like product compare */}
        <section id="experience" className="apple-section" data-reveal="bottom">
          <div className="apple-section-head">
            <h2 className="apple-section-title">Experience & education</h2>
          </div>
          <div className="apple-duo">
            <div className="apple-panel">
              <h3 className="apple-panel-title">Experience</h3>
              <div className="apple-stack">
                {experience.map((item) => (
                  <ExpandableBlock
                    key={item.detailId}
                    detailId={item.detailId}
                    className="apple-entry"
                    data-reveal="left"
                  >
                    <div className="apple-entry-top">
                      <span className="apple-entry-name">{item.org}</span>
                      <span className="home-tag">{item.badge}</span>
                    </div>
                    <span className="apple-entry-role">{item.role}</span>
                    <span className="apple-entry-dates">{item.dates}</span>
                    <p className="apple-entry-blurb">{item.blurb}</p>
                  </ExpandableBlock>
                ))}
              </div>
            </div>
            <div className="apple-panel">
              <h3 className="apple-panel-title">Education</h3>
              <div className="apple-stack">
                {education.map((item) => (
                  <ExpandableBlock
                    key={item.detailId}
                    detailId={item.detailId}
                    className="apple-entry"
                    data-reveal="right"
                  >
                    <div className="apple-entry-top">
                      <span className="apple-entry-name">{item.school}</span>
                      <span className="home-tag">{item.badge}</span>
                    </div>
                    <span className="apple-entry-dates">{item.dates}</span>
                    <span className="apple-entry-role">{item.program}</span>
                    <div className="apple-chip-row apple-chip-row-tight">
                      {item.tags.map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ExpandableBlock>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Wins as a single feature gallery */}
        <section id="competitions" className="apple-section" data-reveal="bottom">
          <div className="apple-section-head">
            <h2 className="apple-section-title">Competitions won</h2>
            <Link href="/achievements" className="apple-text-link">
              View all
            </Link>
          </div>
          <div className="apple-win-list">
            {competitions.map((item) => (
              <ExpandableBlock
                key={item.detailId}
                detailId={item.detailId}
                className="apple-win"
                data-reveal="bottom"
              >
                <span className="apple-win-result">{item.result}</span>
                <span className="apple-win-title">{item.title}</span>
                <span className="apple-win-meta">{item.size}</span>
              </ExpandableBlock>
            ))}
          </div>
        </section>

        <section id="volunteer" className="apple-section" data-reveal="bottom">
          <div className="apple-section-head">
            <h2 className="apple-section-title">Beyond the keyboard</h2>
          </div>
          <div className="apple-compare apple-compare-5">
            {volunteer.map((item) => (
              <ExpandableBlock
                key={item.detailId}
                detailId={item.detailId}
                className="apple-tile"
                data-reveal="bottom"
              >
                <span className="apple-tile-label">{item.title}</span>
                <span className="apple-tile-meta">{item.meta}</span>
              </ExpandableBlock>
            ))}
          </div>
        </section>

        <section id="skills" className="apple-section apple-section-skills" data-reveal="bottom">
          <div className="apple-section-head apple-section-head-center">
            <h2 className="apple-section-title">Technical skills</h2>
            <p className="apple-section-note">Spin the cloud. Pick a skill.</p>
          </div>
          <div className="apple-skills-shell">
            <IconCloudPanel items={skills} />
          </div>
        </section>
      </div>
    </>
  );
}
