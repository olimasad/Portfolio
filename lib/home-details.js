import { getAchievementBySlug } from "./data";

function fromAchievement(slug) {
  const item = getAchievementBySlug(slug);
  if (!item) return null;

  let badge = item.status;
  if (item.victory === true) badge = "Winner";
  else if (item.status === "Certificate") badge = "Certificate";

  return {
    title: item.title,
    meta: [item.date, item.location].filter(Boolean).join(" · "),
    badge,
    summary: item.description,
    details: item.details ?? [],
    items: buildAchievementItems(item),
    gallery: item.gallery ?? [],
    href: item.external_url || null,
    team: item.team || null,
  };
}

function buildAchievementItems(item) {
  const items = (item.details ?? []).map((label) => ({ label }));

  if (item.external_url) {
    items.push({
      label: "Project submission",
      href: item.external_url,
      linkLabel: linkLabelFor(item.external_url),
    });
  }

  return items;
}

function linkLabelFor(url) {
  if (!url) return "Open link";
  if (url.includes("devpost.com")) return "View on Devpost";
  if (url.includes("github.com")) return "View on GitHub";
  if (url.includes("oliverms.com")) return "Visit live site";
  return "View project";
}

function withTeam(detail) {
  if (!detail?.team) return detail;
  return {
    ...detail,
    details: [`Team: ${detail.team}`, ...(detail.details ?? [])],
    items: [{ label: `Team: ${detail.team}` }, ...(detail.items ?? (detail.details ?? []).map((label) => ({ label })))],
  };
}

export const homeDetails = {
  "profile-student": {
    title: "Student",
    meta: "Dawson College 2024–2026",
    summary: "2nd-year DEC student in Computer Science & Mathematics",
    details: [
      "Pursuing a DEC in Computer Science & Mathematics at Dawson College",
      "Coursework spans algorithms, data structures, applied mathematics, and software engineering",
      "Balances academics with internships, hackathons, and independent technical projects",
    ],
    gallery: [
      { type: "image", src: "/gallery/dawson-college.webp", alt: "Dawson College" },
      { type: "image", src: "/gallery/college-stanislas.webp", alt: "Stanislas College" },
      { type: "image", src: "/gallery/concordia-university.webp", alt: "Concordia University" },
    ],
  },
  "profile-developer": {
    title: "Developer",
    meta: "Full-stack · Python & JavaScript",
    summary: "Full-stack developer and software engineer across web, AI, and interactive 3D projects",
    details: [
      "Builds end-to-end applications with React frontends and Python backends",
      "Ships AI-integrated products from concept through deployment and iteration",
      "Recent work includes productivity tools, hackathon platforms, and internal tooling for enterprise teams",
    ],
    gallery: [
      { type: "image", src: "/gallery/python.webp", alt: "Python" },
      { type: "image", src: "/gallery/html-css-js.webp", alt: "HTML CSS JS" },
      { type: "image", src: "/gallery/java.webp", alt: "Java" },
    ],
  },
  "profile-founder": {
    title: "Founder",
    meta: "Projects & community",
    summary: "Creator and maintainer of multiple independent software projects",
    details: [
      "Founded and maintains several personal and team-driven software products",
      "Co-founded the Dawson Coding Club, a student-led technical organization",
      "Scaled club interest to 70+ members through outreach, events, and project-led sessions",
    ],
    gallery: [
      { type: "image", src: "/gallery/nebula-ai-live-1.webp", alt: "Nebula AI title screen" },
      { type: "image", src: "/gallery/nebula-life-1.webp", alt: "Nebula Life title screen" },
      { type: "image", src: "/gallery/nook-5.webp", alt: "Nebula Nook title screen" },
      { type: "image", src: "/gallery/lazy-dawg-5.webp", alt: "Lazy Dawg title screen" },
      { type: "image", src: "/gallery/cooked-1.webp", alt: "Cooked title screen" },
      { type: "image", src: "/gallery/dcc-2.webp", alt: "Dawson Coding Club logo" },
    ],
  },
  "profile-vr-intern": {
    title: "VR Modeling Intern",
    meta: "SAJO · Technology & Innovation · 2023–2025",
    summary: "Technology and Innovation intern for two years at SAJO",
    details: [
      "Built VR-ready office simulations in Twinmotion for Miami and Montreal spaces",
      "Performed LiDAR and Matterport scanning workflows for on-site capture projects",
      "Contributed to AstraIPT website layout, logic, and backend architecture",
      "Delivered high-realism environments for Oculus Quest 2 walkthroughs and stakeholder reviews",
    ],
    gallery: [
      { type: "image", src: "/gallery/SAJO-1.webp", alt: "SAJO 1" },
      { type: "image", src: "/gallery/miami-office-old-2.webp", alt: "SAJO Miami office VR simulation 2" },
      { type: "image", src: "/gallery/miami-office-old-1.webp", alt: "SAJO Miami office VR simulation 1" },
      { type: "image", src: "/gallery/miami-office-old-3.webp", alt: "SAJO Miami office VR simulation 3" },
      { type: "image", src: "/gallery/miami-office-new-1.webp", alt: "SAJO Miami office new 1" },
      { type: "image", src: "/gallery/montreal-office-1.webp", alt: "SAJO Montreal office 1" },      
      { type: "image", src: "/gallery/montreal-office-2.webp", alt: "SAJO Montreal office 2" },      
      { type: "image", src: "/gallery/montreal-office-3.webp", alt: "SAJO Montreal office 3" },
      { type: "image", src: "/gallery/miami-office-unity-1.webp", alt: "SAJO Miami office prototype 1" },
      { type: "image", src: "/gallery/miami-office-unity-2.webp", alt: "SAJO Miami office prototype 2" },
      { type: "image", src: "/gallery/miami-office-unity-3.webp", alt: "SAJO Miami office prototype 3" },
    ],
  },
  "profile-technologist-intern": {
    title: "Technologist Intern",
    meta: "Morgan Stanley · IST · 2026 · 3 months",
    summary: "3-month IST Technology internship at Morgan Stanley",
    details: [
      "Supported technology and innovation work within Morgan Stanley's IST organization",
      "Applied full-stack development skills in a large-scale financial technology environment",
      "Collaborated with engineering teams on practical tooling, workflows, and delivery",
    ],
    gallery: [
      { type: "image", src: "/gallery/morgan-stanley-1.webp", alt: "Morgan Stanley 1" },
      { type: "image", src: "/gallery/spring-boot.webp", alt: "Spring Boot" },
      { type: "image", src: "/gallery/JUnit5.webp", alt: "JUnit5" },
      { type: "image", src: "/gallery/WireMock.webp", alt: "WireMock" },
    ],
  },
  "profile-musician": {
    title: "Musician",
    meta: "Piano · Guitar · RE:ZONE",
    summary: "Guitarist, Pianist since the age of 5, keyboardist of the band RE:ZONE",
    details: [
      "Pianist and composer for 13 years",
      "Keyboardist for the band RE:ZONE",
      "Former keyboardist of PinkEye; background in performance, arrangement, and composition",
      "Hosts and presents on student radio through RadioStan and related media projects",
    ],
    gallery: [
      { type: "image", src: "/gallery/rezone-1.webp", alt: "RE:ZONE 1" },
      { type: "image", src: "/gallery/rezone-2.webp", alt: "RE:ZONE 2" },
      { type: "image", src: "/gallery/rezone-3.webp", alt: "RE:ZONE 3" },
      { type: "image", src: "/gallery/pinkeye-1.webp", alt: "PinkEye 1" },
      { type: "image", src: "/gallery/pinkeye-2.webp", alt: "PinkEye 2" },
      { type: "image", src: "/gallery/pinkeye-3.webp", alt: "PinkEye 3" },
      { type: "image", src: "/gallery/piano-1.webp", alt: "Piano 1" },
      { type: "image", src: "/gallery/piano-2.webp", alt: "Piano 2" },
      { type: "image", src: "/gallery/stan-band.webp", alt: "Stanislas band" },
  ],
  },
  "education-dawson": {
    title: "DEC Computer Science & Mathematics",
    meta: "Dawson College · 2024–2026",
    summary: "Undergraduate college program combining computer science and mathematics",
    details: [
      "Focused on software development, discrete mathematics, and applied problem solving",
      "Active in hackathons, clubs, and internship work alongside coursework",
      "Building a foundation for full-stack engineering and AI-integrated product development",
    ],
    gallery: [
      { type: "image", src: "/gallery/DEC-1.webp", alt: "Dawson College 1" },
    ],
  },
  "education-stanislas": {
    title: "High School Diploma, Highest Honors",
    meta: "Stanislas College, Outremont · 2013–2024",
    summary: "Completed secondary studies with highest honors",
    details: [
      "Graduated with highest honors from Stanislas College in Outremont",
      "Developed early interests in mathematics, science, and creative technology",
      "Participated in radio, media, and extracurricular leadership activities",
    ],
    gallery: [
      { type: "image", src: "/gallery/stanislas-1.webp", alt: "Stanislas College 1" },
    ],
  },
  "experience-sajo": {
    title: "Innovation & Technology Intern",
    meta: "SAJO (International General Contractor) · 2023–2025",
    summary: "Two-year internship in SAJO's Technology and Innovation department",
    items: [
      {
        label: "Twinmotion VR office simulations for Miami and Montreal",
        href: "https://www.sajo.com",
        linkLabel: "SAJO",
      },
      {
        label: "LiDAR and Matterport scanning workflows for site capture",
      },
      {
        label: "AstraIPT website layout, logic, and backend architecture",
      },
      {
        label: "Oculus Quest 2 walkthroughs with custom textures and 3D assets",
      },
    ],
    gallery: [
      { type: "image", src: "/gallery/SAJO-1.webp", alt: "SAJO 1" },
      { type: "image", src: "/gallery/miami-office-old-2.webp", alt: "SAJO Miami office VR simulation 2" },
      { type: "image", src: "/gallery/miami-office-old-1.webp", alt: "SAJO Miami office VR simulation 1" },
      { type: "image", src: "/gallery/miami-office-old-3.webp", alt: "SAJO Miami office VR simulation 3" },
      { type: "image", src: "/gallery/miami-office-new-1.webp", alt: "SAJO Miami office new 1" },
      { type: "image", src: "/gallery/montreal-office-1.webp", alt: "SAJO Montreal office 1" },      
      { type: "image", src: "/gallery/montreal-office-2.webp", alt: "SAJO Montreal office 2" },      
      { type: "image", src: "/gallery/montreal-office-3.webp", alt: "SAJO Montreal office 3" },
      { type: "image", src: "/gallery/miami-office-unity-1.webp", alt: "SAJO Miami office prototype 1" },
      { type: "image", src: "/gallery/miami-office-unity-2.webp", alt: "SAJO Miami office prototype 2" },
      { type: "image", src: "/gallery/miami-office-unity-3.webp", alt: "SAJO Miami office prototype 3" },
      { type: "image", src: "/gallery/harden-1.webp", alt: "Harden Laval scan 1" },
      { type: "image", src: "/gallery/harden-2.webp", alt: "Harden Laval scan 2" },
      { type: "image", src: "/gallery/harden-3.webp", alt: "Harden Laval scan 3" },
      { type: "image", src: "/gallery/harden-4.webp", alt: "Harden Laval scan 4" },
      { type: "image", src: "/gallery/harden-5.webp", alt: "Harden Laval scan 5" },
      { type: "image", src: "/gallery/harden-6.webp", alt: "Harden Laval scan 6" },
      { type: "image", src: "/gallery/harden-7.webp", alt: "Harden Laval scan 7" },
      { type: "image", src: "/gallery/harden-8.webp", alt: "Harden Laval scan 8" },
      { type: "image", src: "/gallery/lidar-1.webp", alt: "LiDAR capture 1" },
    ],
  },
  "experience-morgan-stanley": {
    title: "Technologist IST Intern",
    meta: "Morgan Stanley · 2026 · 3 months",
    summary: "3-month IST technology internship at Morgan Stanley",
    details: [
      "Worked within Morgan Stanley's IST organization on technology-driven initiatives",
      "Applied software engineering skills in enterprise-scale environments",
      "Contributed to delivery, tooling, and cross-team technical collaboration",
    ],
    gallery: [
      { type: "image", src: "/gallery/morgan-stanley-1.webp", alt: "Morgan Stanley 1" },
      { type: "image", src: "/gallery/spring-boot.webp", alt: "Spring Boot" },
      { type: "image", src: "/gallery/JUnit5.webp", alt: "JUnit5" },
      { type: "image", src: "/gallery/WireMock.webp", alt: "WireMock" },
    ],
  },
  "volunteer-shine-the-light": {
    ...withTeam(fromAchievement("shine-the-light-volunteer")),
    gallery: [
      { type: "image", src: "/gallery/shine-the-light.webp", alt: "Shine the Light" },
    ],
  },
  "volunteer-radiostan": {
    title: "Mission Bon Accueil",
    meta: "Volunteer · Providing food for dog shelters",
    summary:
      "Volunteered with Mission Bon Accueil to help prepare and provide food support for dog shelters",
    details: [
      "Assisted with food-related volunteer work supporting local dog shelters",
      "Helped with packing, organizing, and preparing donations for distribution",
      "Contributed time to community animal-welfare efforts alongside other volunteer activities",
      "Gained experience collaborating in a service-focused team environment",
    ],
    gallery: [
      { type: "image", src: "/gallery/mission-bon-accueil-1.webp", alt: "Mission Bon Accueil 1" },
      { type: "image", src: "/gallery/mission-bon-accueil-2.webp", alt: "Mission Bon Accueil 2" },
      { type: "image", src: "/gallery/mission-bon-accueil-3.webp", alt: "Mission Bon Accueil 3" },
    ],
  },
  "volunteer-podcast": {
    title: "RadioStan Host & Presenter",
    meta: "Student radio broadcast",
    summary: "Host and presenter for student radio programming at RadioStan",
    details: [
      "Hosts and presents segments for student radio broadcasts",
      "Prepares research, scripts, and on-air delivery for educational and interview content",
      "Collaborates on episodes covering science, community, and current topics",
      "Co-hosted exclusive interviews with diplomatic and scientific guests on Radio Web Stanislas",
    ],
    href: "https://www.plusieurscordesasavoix.com/",
    gallery: [
      { type: "image", src: "/gallery/radio-stan-1.webp", alt: "RadioStan 1" },
      { type: "image", src: "/gallery/radio-stan-2.webp", alt: "RadioStan 2" },
      { type: "image", src: "/gallery/radio-stan-3.webp", alt: "RadioStan 3" },
    ],
  },
  "volunteer-sports": {
    title: "Soccer & Karate",
    meta: "Former soccer player and karate competitor",
    summary:
      "Spent years in soccer and karate: one built for teamwork and match pressure, the other for focus, form, and competitive discipline",
    details: [
      "Played soccer through school and extracurricular teams, training technical skills, positioning, and match readiness",
      "Competed in team sessions that demanded quick decisions, clear communication, and accountability to a shared goal",
      "Practiced and competed in karate with emphasis on technique, kata, and controlled sparring",
      "Built resilience and consistency through regular athletic practice across both sports",
      "Carried those habits into academics and creative work: staying calm under pressure, improving one detail at a time, and showing up prepared",
      "Balanced athletics alongside music, academics, and other extracurricular commitments",
    ],
    gallery: [
      { type: "image", src: "/gallery/soccer-1.webp", alt: "Soccer 1" },
      { type: "image", src: "/gallery/karate-1.webp", alt: "Karate 1" },
    ],
  },
  "volunteer-rezone": {
    title: "RE:ZONE",
    meta: "Keyboardist for a J-Rock band",
    summary:
      "Keyboardist for RE:ZONE, a J-Rock band, contributing live performance, arrangement, and collaborative music-making",
    details: [
      "Played keys for RE:ZONE in rehearsals and live settings, supporting arrangements and stage performance",
      "Shaped parts around a J-Rock sound using years of piano and composition experience (pianist since age 5)",
      "Collaborated with bandmates on timing, dynamics, and song structure across practice and performance",
      "Brought prior band experience as former keyboardist of PinkEye into a tighter ensemble role",
      "Balanced music alongside academics, development work, and other creative projects",
    ],
    gallery: [
      { type: "image", src: "/gallery/rezone-1.webp", alt: "RE:ZONE 1" },
      { type: "image", src: "/gallery/rezone-2.webp", alt: "RE:ZONE 2" },
      { type: "image", src: "/gallery/rezone-3.webp", alt: "RE:ZONE 3" },
    ],
  },
  "award-conuhacks-x": {
    ...fromAchievement("conuhacks-x-2026"),
    gallery: [
      { type: "image", src: "/gallery/conuhacks-1.webp", alt: "ConUHacks X 1" },
      { type: "image", src: "/gallery/conuhacks-2.webp", alt: "ConUHacks X 2" },
      { type: "image", src: "/gallery/conuhacks-3.webp", alt: "ConUHacks X 3" },
    ],
  },
  "award-aerohacks": {
    ...fromAchievement("aerohacks-2026"),
    gallery: [
      { type: "image", src: "/gallery/aerohacks-1.webp", alt: "AeroHacks 1" },
      { type: "image", src: "/gallery/aerohacks-2.webp", alt: "AeroHacks 2" },
      { type: "image", src: "/gallery/aerohacks-3.webp", alt: "AeroHacks 3" },
    ],
  },
  "award-athacks": {
    ...fromAchievement("athacks-2026"),
    gallery: [
      { type: "image", src: "/gallery/athacks-3.webp", alt: "AtHacks 3" },
      { type: "image", src: "/gallery/athacks-1.webp", alt: "AtHacks 1" },
      { type: "image", src: "/gallery/athacks-2.webp", alt: "AtHacks 2" },
    ],
  },
  "award-hackdecouverte": {
    ...fromAchievement("hackdecouverte-2025"),
    gallery: [
      { type: "image", src: "/gallery/hackdecouverte-1.webp", alt: "HackDécouverte 1" },
      { type: "image", src: "/gallery/hackdecouverte-2.webp", alt: "HackDécouverte 2" },
      { type: "image", src: "/gallery/hackdecouverte-3.webp", alt: "HackDécouverte 3" },
    ],
  },
  "award-dialogue": {
    ...fromAchievement("dialogue-2026"),
    gallery: [
      { type: "image", src: "/gallery/dialogue-1.webp", alt: "Dialogue 1" },
      { type: "image", src: "/gallery/dialogue-2.webp", alt: "Dialogue 2" },
      { type: "image", src: "/gallery/dialogue-3.webp", alt: "Dialogue 3" },
    ],
  },
  "achievement-mpc-hacks-2026": {
    ...fromAchievement("mpc-hacks-2026"),
    gallery: [
      { type: "image", src: "/gallery/mpc-hacks-4.webp", alt: "MPC Hacks 4" },
      { type: "image", src: "/gallery/mpc-hacks-1.webp", alt: "MPC Hacks 1" },
      { type: "image", src: "/gallery/mpc-hacks-3.webp", alt: "MPC Hacks 3" },
      { type: "image", src: "/gallery/mpc-hacks-2.webp", alt: "MPC Hacks 2" },
    ],
  },
  "achievement-vanierhacks-2026": {
    ...fromAchievement("vanierhacks-2026"),
    gallery: [
      { type: "image", src: "/gallery/vanier-hacks-4.webp", alt: "VanierHacks placeholder 4" },
      { type: "image", src: "/gallery/vanier-hacks-3.webp", alt: "VanierHacks placeholder 3" },
      { type: "image", src: "/gallery/vanier-hacks-1.webp", alt: "VanierHacks placeholder 1" },
      { type: "image", src: "/gallery/vanier-hacks-2.webp", alt: "VanierHacks placeholder 2" },
    ],
  },
  "achievement-science-on-tourne-2025": {
    ...fromAchievement("science-on-tourne-2025"),
    gallery: [
      { type: "image", src: "/gallery/sot-1.webp", alt: "Science On Tourne project 1" },
      { type: "image", src: "/gallery/sot-2.webp", alt: "Science On Tourne project 2" },
      { type: "image", src: "/gallery/sot-3.webp", alt: "Science On Tourne project 3" },
      { type: "image", src: "/gallery/sot-4.webp", alt: "Science On Tourne project 4" },
      { type: "image", src: "/gallery/sot-5.webp", alt: "Science On Tourne project 5" },
    ],
  },
  "achievement-lab-01-dev-team-2024": {
    ...fromAchievement("lab-01-dev-team-2024"),
    gallery: [
      { type: "image", src: "/gallery/lab01-2.webp" },
      { type: "video", src: "/gallery/lab01-1.mp4" },
    ],
  },
  "achievement-ai-accelerator-certificate": {
    ...fromAchievement("ai-accelerator-certificate"),
    gallery: [
      { type: "image", src: "/gallery/aia-1.webp", alt: "AI Accelerator Program" },
    ],
  },
  "achievement-pinkeye-band-member-2025": {
    ...fromAchievement("pinkeye-band-member-2025"),
    gallery: [
      { type: "image", src: "/gallery/pinkeye-1.webp", alt: "PinkEye 1" },
      { type: "image", src: "/gallery/pinkeye-2.webp", alt: "PinkEye 2" },
      { type: "image", src: "/gallery/pinkeye-3.webp", alt: "PinkEye 3" },
    ],
  },
  "achievement-dawson-music-club": {
    ...fromAchievement("dawson-music-club"),
    gallery: [
      { type: "image", src: "/gallery/dawson-music-club-3.webp", alt: "Dawson Music Club 3" },
      { type: "image", src: "/gallery/dawson-music-club-1.webp", alt: "Dawson Music Club 1" },
      { type: "video", src: "/gallery/dawson-music-club-2.mov" },
    ],
  },
  "achievement-dawson-coding-club-founder": {
    ...fromAchievement("dawson-coding-club-founder"),
    gallery: [
      { type: "image", src: "/gallery/dcc-1.webp", alt: "Dawson Coding Club 1" },
      { type: "image", src: "/gallery/dcc-2.webp", alt: "Dawson Coding Club 2" },
      { type: "image", src: "/gallery/dcc-3.webp", alt: "Dawson Coding Club 3" },
      { type: "image", src: "/gallery/dcc-4.webp", alt: "Dawson Coding Club 4" },
    ],
  },
  "achievement-dawson-blue-ring-society": {
    ...fromAchievement("dawson-blue-ring-society"),
    gallery: [
      { type: "image", src: "/gallery/dawson-college.webp", alt: "Dawson Blue Ring Society" },
    ],
  },
  "achievement-interview-sfeir-imbeau-2024": {
    ...fromAchievement("interview-sfeir-imbeau-2024"),
    gallery: [
      { type: "image", src: "/gallery/radio-stan-1.webp", alt: "RadioStan interview recording" },
      { type: "image", src: "/gallery/radio-stan-2.webp", alt: "Radio Web Stanislas studio" },
    ],
  },
  "achievement-interview-graphene-2023": {
    ...fromAchievement("interview-graphene-2023"),
    gallery: [
      { type: "image", src: "/gallery/radio-stan-3.webp", alt: "RadioStan science interview" },
    ],
  },
  "achievement-episode-fusion-nucleaire-2023": {
    ...fromAchievement("episode-fusion-nucleaire-2023"),
    gallery: [
      { type: "image", src: "/gallery/radio-stan-2.webp", alt: "RadioStan fusion episode" },
    ],
  },
  "achievement-concours-castor-2022": {
    ...fromAchievement("concours-castor-2022"),
    gallery: [
      { type: "image", src: "/gallery/concours-castor.webp", alt: "Concours Castor 1" },
    ],
  },
  "project-portfolio": {
    title: "oliverms.com",
    meta: "Personal site · Next.js · React",
    summary:
      "The site you are on: a personal portfolio for projects, achievements, and contact, built as a cardless Next.js app with a warm light/dark theme",
    details: [
      "Projects, achievements, and contact organized as expandable write-ups with galleries",
      "Custom theme engine with circular wipe transitions between light and dark modes",
      "Interactive tools cloud, page dock, and motion tuned for a single cohesive composition",
      "Deployed at oliverms.com as the public home for the Nebula constellation and client work",
    ],
    href: "https://oliverms.com",
    gallery: [
      { type: "image", src: "/gallery/portfolio-1.webp", alt: "Portfolio home" },
      { type: "image", src: "/gallery/portfolio-2.webp", alt: "Portfolio projects page" },
      { type: "image", src: "/gallery/portfolio-3.webp", alt: "Portfolio achievements page" },
      { type: "image", src: "/gallery/portfolio-4.webp", alt: "Portfolio contact page" },
    ],
  },
  "project-nebula-id": {
    title: "Nebula ID",
    meta: "Identity hub · Sibling to oliverms.com",
    summary:
      "The account home for the Nebula constellation: one nid_… passport across AI, Nook, and apps still on the way",
    details: [
      "Central sign-in with Google or email, shared across Nebula apps via secure bridge SSO",
      "Account dashboard for profile, connected apps, security, and personal API tokens",
      "Designed as a quiet sibling to oliverms.com so the portfolio and the constellation feel like one house",
    ],
    href: "https://id.oliverms.com/account",
    gallery: [
      { type: "image", src: "/gallery/nebula-id-1.webp", alt: "Nebula ID landing" },
      { type: "image", src: "/gallery/nebula-id-2.webp", alt: "Nebula ID sign in" },
    ],
  },
  "project-nebula-ai": {
    title: "Nebula AI",
    meta: "AI application · Full-stack",
    summary:
      "Designed and developed an AI-powered application, working across backend logic and frontend interfaces to bring intelligent features to everyday use",
    details: [
      "Built end-to-end with a React frontend and Python backend",
      "Integrated modern AI models to power the app's core features",
      "Owned both backend logic and frontend interface work from concept through iteration",
    ],
    href: "https://ai.oliverms.com",
    gallery: [
      { type: "image", src: "/gallery/nebula-ai-live-1.webp", alt: "Nebula AI dashboard" },
      { type: "image", src: "/gallery/nebula-ai-live-2.webp", alt: "Nebula AI orbits" },
    ],
  },
  "project-nebula-life": {
    title: "Nebula Life",
    meta: "Daily-life productivity app · Full-stack",
    summary:
      "Built a daily-life productivity application focused on a clean user experience, spanning backend logic and frontend interfaces",
    details: [
      "Designed a clean, focused user experience for everyday productivity",
      "Developed across the stack, from backend logic to frontend interfaces",
      "Iterated on features to keep the app simple and practical for daily use",
    ],
    gallery: [
      { type: "image", src: "/gallery/nebula-life-1.webp", alt: "Nebula Life 1" },
      { type: "image", src: "/gallery/nebula-life-2.webp", alt: "Nebula Life 2" },
      { type: "image", src: "/gallery/nebula-life-3.webp", alt: "Nebula Life 3" },
      { type: "image", src: "/gallery/nebula-life-4.webp", alt: "Nebula Life 4" },
      { type: "image", src: "/gallery/nebula-life-5.webp", alt: "Nebula Life 5" },
      { type: "image", src: "/gallery/nebula-life-6.webp", alt: "Nebula Life 6" },
      { type: "image", src: "/gallery/nebula-life-7.webp", alt: "Nebula Life 7" },

    ],
  },
  "project-nook": {
    title: "Nebula Nook",
    meta: "Desktop companion · Tauri 2.0 · React & Rust",
    summary:
      "A lightweight floating desktop companion designed to run quietly in the background while gaming or working",
    details: [
      "Transparent, frameless overlay with dragging, always-on-top controls, and a system tray",
      "Animated companion states including idle, sleeping, wandering, and interacting",
      "Designed for future private, on-device face and gaze tracking with MediaPipe",
    ],
    href: "https://nook.oliverms.com",
    gallery: [
      { type: "image", src: "/gallery/nook-5.webp", alt: "Nebula Nook title screen" },
      { type: "image", src: "/gallery/nook-live-2.webp", alt: "Nebula Nook closet" },
      { type: "image", src: "/gallery/nook-live-3.webp", alt: "Nebula Nook learn" },
      { type: "image", src: "/gallery/nook-live-4.webp", alt: "Nebula Nook shop" },
      { type: "image", src: "/gallery/nook-live-1.webp", alt: "Nebula Nook landing" },
      { type: "image", src: "/gallery/nook-1.webp", alt: "Nook 1" },
      { type: "image", src: "/gallery/nook-2.webp", alt: "Nook 2" },
      { type: "image", src: "/gallery/nook-3.webp", alt: "Nook 3" },
      { type: "image", src: "/gallery/nook-4.webp", alt: "Nook 4" },
      { type: "image", src: "/gallery/nook-6.webp", alt: "Nook 6" },
    ],
  },
  "project-lazy-dawg": {
    title: "Lazy Dawg",
    meta: "24/7 YouTube radio · 2023",
    summary:
      "Built a 24/7 YouTube radio station in 2023 with an animated pixel-art visual style, inspired by the always-on lofi format",
    details: [
      "Ran a continuous 24/7 stream inspired by the always-on lofi radio format",
      "Created an animated pixel-art visual style for the broadcast",
      "Set up the streaming pipeline to keep the station live around the clock",
    ],
    gallery: [
      { type: "image", src: "/gallery/lazy-dawg-5.webp", alt: "Lazy Dawg 5" },
      { type: "video", src: "/gallery/lazy-dawg-3.mp4" },
      { type: "video", src: "/gallery/lazy-dawg-2.mp4" },
      { type: "image", src: "/gallery/lazy-dawg-4.webp", alt: "Lazy Dawg 4" },
      { type: "image", src: "/gallery/lazy-dawg-1.webp", alt: "Lazy Dawg 1" },
    ],
  },
  "project-sajo-miami-vr": {
    title: "SAJO Miami Office VR Simulation",
    meta: "SAJO · Twinmotion · Oculus Quest 2",
    summary:
      "Recreated SAJO's Miami office as a high-realism Twinmotion environment for VR walkthroughs, including custom textures, maps, and exterior reconstruction",
    details: [
      "Built a high-realism Twinmotion environment of the Miami office for VR walkthroughs",
      "Created custom textures and maps to raise visual fidelity",
      "Reconstructed the exterior using Google Maps references and custom 3D models",
      "Delivered the experience for Oculus Quest 2 stakeholder walkthroughs",
    ],
    gallery: [
      { type: "image", src: "/gallery/miami-office-old-2.webp", alt: "SAJO Miami office VR simulation 2" },
      { type: "image", src: "/gallery/miami-office-old-1.webp", alt: "SAJO Miami office VR simulation 1" },
      { type: "image", src: "/gallery/miami-office-old-3.webp", alt: "SAJO Miami office VR simulation 3" },
      { type: "image", src: "/gallery/miami-office-old-4.webp", alt: "SAJO Miami office VR simulation 4" },
      { type: "image", src: "/gallery/miami-office-old-5.webp", alt: "SAJO Miami office VR simulation 5" },
    ],
  },
  "project-sajo-miami-prototype": {
    title: "SAJO Miami Office Prototype",
    meta: "SAJO · Unity 3D",
    summary:
      "Delivered a first-pass Miami office simulation in Unity 3D before migrating the final experience to Twinmotion",
    details: [
      "Built an early Unity 3D prototype of the Miami office simulation",
      "Validated layout and interaction ideas before the final build",
      "Informed the migration of the final experience to Twinmotion",
    ],
    gallery: [
      { type: "image", src: "/gallery/miami-office-unity-1.webp", alt: "SAJO Miami office prototype 1" },
      { type: "image", src: "/gallery/miami-office-unity-2.webp", alt: "SAJO Miami office prototype 2" },
      { type: "image", src: "/gallery/miami-office-unity-3.webp", alt: "SAJO Miami office prototype 3" },
    ],
  },
  "project-sajo-montreal-vr": {
    title: "SAJO Montreal Office VR Simulation",
    meta: "SAJO · Twinmotion",
    summary:
      "Developed a full Twinmotion-based virtual office simulation for SAJO's Montreal office to support immersive stakeholder walkthroughs",
    details: [
      "Built a full Twinmotion virtual simulation of the Montreal office",
      "Supported immersive stakeholder walkthroughs of the space",
      "Focused on realistic environments to aid planning and review",
    ],
    gallery: [
      { type: "image", src: "/gallery/montreal-office-1.webp", alt: "SAJO Montreal office 1" },      
      { type: "image", src: "/gallery/montreal-office-2.webp", alt: "SAJO Montreal office 2" },      
      { type: "image", src: "/gallery/montreal-office-3.webp", alt: "SAJO Montreal office 3" },
    ],
  },
  "project-maeve-catalog": {
    title: "Maeve Catalog",
    meta: "Roblox Studio · Twinmotion · Unreal Engine",
    summary:
      "Created 3D models, environments, and animations for ad-style Roblox content featuring characters wearing Maeve Catalog outfits across cherry blossom, amethyst cave, and beach scenes",
    details: [
      "Modeled and animated characters wearing Maeve Catalog outfits for short-form promotional content on Roblox",
      "Built three complete environments (cherry blossom, amethyst cave, and beach) with modeling, lighting, staging, and animation timed for ad pacing",
      "Built across Roblox Studio, Twinmotion, and Unreal Engine for modeling, lighting, and rendering",
      "Produced campaign assets tailored to the Roblox platform",
    ],
    gallery: [
      { type: "image", src: "/gallery/maeve-catalog-1.webp", alt: "Maeve Catalog promotional scene" },
      { type: "image", src: "/gallery/cherry-blossom-3.webp", alt: "Maeve Catalog Cherry Blossom 3" },
      { type: "video", src: "/gallery/cherry-blossom-2.mp4" },
      { type: "image", src: "/gallery/amethyst-3.webp", alt: "Maeve Catalog Amethyst Cave 3" },
      { type: "video", src: "/gallery/amethyst-2.mp4" },
      { type: "image", src: "/gallery/beach-3.webp", alt: "Maeve Catalog Beach 3" },
      { type: "video", src: "/gallery/beach-2.mp4" },
    ],
  },
  "project-cooked": {
    title: "Cooked",
    meta: "Brutal accountability · Next.js · Gemini · Firebase",
    summary:
      "A dark, brutally honest accountability app for people tired of soft productivity tools. Cooked exposes self-sabotage by turning habits, failures, and wasted time into unavoidable evidence of where the user's current trajectory leads.",
    details: [
      "A seven-day trajectory meter makes repeated failures visibly degrade the interface",
      "Bad-habit logging requires a written explanation instead of a frictionless checkbox",
      "Gemini delivers short, clinical reality checks based on the user's actual behavior",
      "A compound-failure calculator reveals the long-term cost of wasted time",
    ],
    gallery: [
      { type: "image", src: "/gallery/cooked-1.webp", alt: "Cooked 1" },
      { type: "image", src: "/gallery/cooked-2.webp", alt: "Cooked 2" },
      { type: "image", src: "/gallery/cooked-3.webp", alt: "Cooked 3" },
    ],
  },
  "project-dr-bob": {
    title: "Dr. Bob",
    meta: "ConUHacks X · 2nd Place · Flask · Gemini · JavaScript",
    summary:
      "An AI-powered medical consultant that triages symptoms over chat, finds nearby clinics, and keeps a private medical profile. Built in 24 hours and awarded 2nd place in the Dialogue challenge at ConUHacks X",
    details: [
      "Chat-based symptom triage with Gemini for immediate guidance that feels as natural as texting a friend",
      "Location-aware clinic discovery plus a trusted-clinic whitelist for faster prioritization",
      "Private medical profile (conditions, preferences) that can be shared when requesting an appointment",
      "Glassmorphism UI with light/dark theme engine, built on Flask, HTML, CSS, and vanilla JavaScript",
    ],
    href: "https://devpost.com/software/dr-bob",
    gallery: [
      { type: "image", src: "/gallery/conuhacks-1.webp", alt: "Dr. Bob at ConUHacks X 1" },
      { type: "image", src: "/gallery/conuhacks-2.webp", alt: "Dr. Bob at ConUHacks X 2" },
      { type: "image", src: "/gallery/conuhacks-3.webp", alt: "Dr. Bob at ConUHacks X 3" },
    ],
  },
  "project-budgetx": {
    title: "BudgetX",
    meta: "HackDécouverte · Best Use of Gemini API · Next.js · Gemini · Tailwind",
    summary:
      "A student budget simulator with expense tracking, AI-powered what-if scenarios, and visual spending insights. Built at HackDécouverte and awarded Best Use of Gemini API",
    details: [
      "Track monthly income, fixed costs like rent and tuition, and variable expenses in one dashboard",
      "Gemini-powered what-if simulator to explore financial decisions before making them",
      "Stats and charts that surface spending patterns and predictions for students",
      "Built with Next.js, Tailwind, Vercel AI SDK, Gemini, Recharts, and Better Auth in a one-day hackathon",
    ],
    href: "https://github.com/theganders/budgetx",
    gallery: [
      { type: "image", src: "/gallery/hackdecouverte-1.webp", alt: "BudgetX at HackDécouverte 1" },
      { type: "image", src: "/gallery/hackdecouverte-2.webp", alt: "BudgetX at HackDécouverte 2" },
      { type: "image", src: "/gallery/hackdecouverte-3.webp", alt: "BudgetX at HackDécouverte 3" },
    ],
  },
  "project-brim-aero": {
    title: "Brim AERO",
    meta: "MPC Hacks 2026 · Next.js · React · TypeScript · MongoDB · Gemini",
    summary:
      "An AI expense-analysis web app for company credit-card spend: reporting, anomaly detection, manager notifications, and Gemini-powered financial summaries, built in 24 hours at MPC Hacks",
    details: [
      "Expense reporting and tracking for employee spend, with AI summaries and fraud/anomaly flags",
      "Manager-employee notification flow for review and follow-up on flagged activity",
      "Frutiger Aero-inspired UI over a Next.js, React, TypeScript, MongoDB, and Gemini stack",
      "Built overnight at Montreal's inaugural inter-university hackathon at Polytechnique Montréal",
    ],
    href: "https://devpost.com/software/brim-aero",
    gallery: [
      { type: "image", src: "/gallery/mpc-hacks-4.webp", alt: "Brim AERO 4" },
      { type: "image", src: "/gallery/mpc-hacks-1.webp", alt: "Brim AERO 1" },
      { type: "image", src: "/gallery/mpc-hacks-3.webp", alt: "Brim AERO 3" },
      { type: "image", src: "/gallery/mpc-hacks-2.webp", alt: "Brim AERO 2" },
    ],
  },
  "project-lossnfound": {
    title: "LossnFound",
    meta: "Next.js · PostgreSQL · Drizzle · Gemini · Three.js",
    summary:
      "A private, AI-native lost-and-found matcher: claimants file Typeform-style reports while admins log found items, and Gemini scores matches without ever exposing the inventory",
    details: [
      "User flow asks one question at a time (what, where, when, optional photo) while the found inventory stays private",
      "Match scores route work for admins: strong matches for verification, mid scores trigger one Gemini clarification then a rescore, weak tickets stay open",
      "Gemini parses messy natural-language dates so tickets are comparable, and auto-fills tags when admins add found items",
      "Built with Next.js, PostgreSQL and Drizzle, better-auth role-based access, Gemini, GSAP, and Three.js polish",
    ],
    href: "https://devpost.com/software/lossnfound",
    gallery: [
      { type: "image", src: "/gallery/lossnfound-1.webp", alt: "LossnFound 1" },
      { type: "image", src: "/gallery/lossnfound-2.webp", alt: "LossnFound 2" },
      { type: "image", src: "/gallery/lossnfound-3.webp", alt: "LossnFound 3" },
      { type: "image", src: "/gallery/lossnfound-4.webp", alt: "LossnFound 4" },
    ],
  },
};

export function normalizeHomeDetail(detail) {
  if (!detail) return null;

  let items = detail.items;
  if (!items?.length) {
    items = (detail.details ?? []).map((label) => ({ label }));
  }

  if (detail.team && !items.some((item) => item.label?.startsWith("Team:"))) {
    items = [{ label: `Team: ${detail.team}` }, ...items];
  }

  if (detail.href && !items.some((item) => item.href === detail.href)) {
    items = [
      ...items,
      {
        label: "Related link",
        href: detail.href,
        linkLabel: linkLabelFor(detail.href),
      },
    ];
  }

  return {
    ...detail,
    items,
    gallery: detail.gallery ?? [],
  };
}

/** Prefer shared homepage detail IDs when an achievement matches one. */
const achievementDetailAliases = {
  "conuhacks-x-2026": "award-conuhacks-x",
  "athacks-2026": "award-athacks",
  "dialogue-2026": "award-dialogue",
  "aerohacks-2026": "award-aerohacks",
  "hackdecouverte-2025": "award-hackdecouverte",
  "shine-the-light-volunteer": "volunteer-shine-the-light",
};

export function detailIdForAchievement(slug) {
  return achievementDetailAliases[slug] ?? `achievement-${slug}`;
}

export function getHomeDetail(id) {
  if (!id) return null;

  if (homeDetails[id]) {
    return normalizeHomeDetail(homeDetails[id]);
  }

  const mappedId = achievementDetailAliases[id];
  if (mappedId && homeDetails[mappedId]) {
    return normalizeHomeDetail(homeDetails[mappedId]);
  }

  if (id.startsWith("achievement-")) {
    const slug = id.slice("achievement-".length);
    return normalizeHomeDetail(fromAchievement(slug));
  }

  return null;
}

export function listHomeDetailIds() {
  return Object.keys(homeDetails);
}

export function skillDetailId(label) {
  return `skill-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}
