/**
 * Skills shown in the Technical Skills icon cloud.
 *
 * Each entry needs an icon (see lib/tech-icons.js), a one-line explainer, and the pages
 * that prove it. Every `usedIn` entry must point at a real id from lib/home-details.js.
 */

export const skills = [
  {
    id: "java",
    label: "Java",
    icon: { slug: "openjdk" },
    tldr: "Strongly typed, object-oriented language that runs most large-scale enterprise backends.",
    usedIn: [
      { label: "Morgan Stanley internship", detailId: "experience-morgan-stanley" },
      { label: "Dawson College coursework", detailId: "education-dawson" },
    ],
  },
  {
    id: "python",
    label: "Python",
    icon: { slug: "python" },
    tldr: "My default language for backend services, scripting, and anything that touches AI tooling.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Developer profile", detailId: "profile-developer" },
    ],
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: { slug: "javascript" },
    tldr: "The language behind every interface I ship on the web, from small widgets to full apps.",
    usedIn: [
      { label: "Cooked", detailId: "project-cooked" },
      { label: "Nebula Nook", detailId: "project-nook" },
      { label: "Brim AERO", detailId: "project-brim-aero" },
    ],
  },
  {
    id: "react",
    label: "React",
    icon: { slug: "react" },
    tldr: "Component-based UI library I reach for when an interface needs real state and structure.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Nebula Life", detailId: "project-nebula-life" },
      { label: "Nebula Nook", detailId: "project-nook" },
      { label: "Brim AERO", detailId: "project-brim-aero" },
    ],
  },
  {
    id: "html5",
    label: "HTML5",
    icon: { slug: "html5" },
    tldr: "The semantic backbone of a page. Structure first, so accessibility and SEO come free.",
    usedIn: [
      { label: "AstraIPT site at SAJO", detailId: "experience-sajo" },
      { label: "Developer profile", detailId: "profile-developer" },
    ],
  },
  {
    id: "css3",
    label: "CSS3",
    icon: { slug: "css" },
    tldr: "Layout, motion, and theming. Where a functional interface turns into one people enjoy.",
    usedIn: [
      { label: "Cooked", detailId: "project-cooked" },
      { label: "AstraIPT site at SAJO", detailId: "experience-sajo" },
    ],
  },
  {
    id: "git",
    label: "Git",
    icon: { slug: "git" },
    tldr: "Version control for everything I build: branches, history, and safe experiments.",
    usedIn: [
      { label: "Developer profile", detailId: "profile-developer" },
      { label: "Dawson Coding Club", detailId: "achievement-dawson-coding-club-founder" },
    ],
  },
  {
    id: "github",
    label: "GitHub",
    icon: { slug: "github" },
    tldr: "Where my projects live, get reviewed, and get shared with teammates during hackathons.",
    usedIn: [
      { label: "Dawson Coding Club", detailId: "achievement-dawson-coding-club-founder" },
      { label: "LAB_01 dev team", detailId: "achievement-lab-01-dev-team-2024" },
    ],
  },
  {
    id: "copilot",
    label: "GitHub Copilot",
    icon: { slug: "githubcopilot" },
    tldr: "AI pair programmer I use to move faster on boilerplate while keeping the design decisions mine.",
    usedIn: [
      { label: "Cooked", detailId: "project-cooked" },
      { label: "Developer profile", detailId: "profile-developer" },
    ],
  },
  {
    id: "google-ai-studio",
    label: "Google AI Studio",
    icon: { slug: "googlegemini" },
    tldr: "Where I prototype and tune Gemini prompts before wiring them into a product.",
    usedIn: [
      { label: "Cooked", detailId: "project-cooked" },
      { label: "Brim AERO", detailId: "project-brim-aero" },
      { label: "HackDécouverte, Gemini API Award", detailId: "award-hackdecouverte" },
    ],
  },
  {
    id: "unreal",
    label: "Unreal Engine",
    icon: { slug: "unrealengine" },
    tldr: "Real-time 3D engine powering the lighting and rendering behind my architectural walkthroughs.",
    usedIn: [
      { label: "SAJO Miami VR simulation", detailId: "project-sajo-miami-vr" },
      { label: "Maeve Catalog", detailId: "project-maeve-catalog" },
      { label: "LAB_01 dev team", detailId: "achievement-lab-01-dev-team-2024" },
    ],
  },
  {
    id: "unity",
    label: "Unity 3D",
    icon: { slug: "unity" },
    tldr: "Game engine I used to prototype interactive 3D spaces before committing to a final build.",
    usedIn: [{ label: "SAJO Miami office prototype", detailId: "project-sajo-miami-prototype" }],
  },
  {
    id: "twinmotion",
    label: "Twinmotion",
    icon: { slug: "twinmotion" },
    tldr: "Architectural visualization tool for turning building models into photoreal, walkable scenes.",
    usedIn: [
      { label: "SAJO Miami VR simulation", detailId: "project-sajo-miami-vr" },
      { label: "SAJO Montreal VR simulation", detailId: "project-sajo-montreal-vr" },
      { label: "Maeve Catalog", detailId: "project-maeve-catalog" },
      { label: "LAB_01 dev team", detailId: "achievement-lab-01-dev-team-2024" },
    ],
  },
  {
    id: "roblox-studio",
    label: "Roblox Studio",
    icon: { slug: "robloxstudio" },
    tldr: "Modeling, animation, and scene building for content made to run on the Roblox platform.",
    usedIn: [{ label: "Maeve Catalog", detailId: "project-maeve-catalog" }],
  },
  {
    id: "frontend",
    label: "Frontend Development",
    icon: { glyph: "frontend" },
    tldr: "Designing and building the part users actually touch: layout, state, motion, and polish.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Nebula Life", detailId: "project-nebula-life" },
      { label: "Cooked", detailId: "project-cooked" },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    icon: { glyph: "backend" },
    tldr: "The logic, data, and APIs behind the interface, the half users never see but always feel.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Nebula Life", detailId: "project-nebula-life" },
      { label: "AstraIPT architecture at SAJO", detailId: "experience-sajo" },
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms",
    icon: { glyph: "algorithms" },
    tldr: "Choosing the approach that stays fast as the input grows, instead of the first one that works.",
    usedIn: [
      { label: "Dawson College coursework", detailId: "education-dawson" },
      { label: "Concours Castor Informatique", detailId: "achievement-concours-castor-2022" },
    ],
  },
  {
    id: "data-structures",
    label: "Data Structures",
    icon: { glyph: "dataStructures" },
    tldr: "Picking how data is stored (trees, maps, queues), because that choice decides performance.",
    usedIn: [
      { label: "Dawson College coursework", detailId: "education-dawson" },
      { label: "Concours Castor Informatique", detailId: "achievement-concours-castor-2022" },
    ],
  },
  {
    id: "mathematics",
    label: "Applied Mathematics",
    icon: { glyph: "mathematics" },
    tldr: "Linear algebra, calculus, and discrete math: the reasoning underneath graphics and AI work.",
    usedIn: [
      { label: "Dawson College coursework", detailId: "education-dawson" },
      { label: "Student profile", detailId: "profile-student" },
    ],
  },
  {
    id: "prompt-engineering",
    label: "Prompt Engineering",
    icon: { glyph: "prompt" },
    tldr: "Structuring instructions and context so a model returns something reliable enough to ship.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Cooked", detailId: "project-cooked" },
      { label: "AI Accelerator Program", detailId: "achievement-ai-accelerator-certificate" },
    ],
  },
  {
    id: "ai-models",
    label: "Modern AI Models",
    icon: { glyph: "aiModels" },
    tldr: "Working with today's LLMs as product components: picking one, grounding it, handling failure.",
    usedIn: [
      { label: "Nebula AI", detailId: "project-nebula-ai" },
      { label: "Cooked", detailId: "project-cooked" },
      { label: "Brim AERO", detailId: "project-brim-aero" },
      { label: "HackDécouverte, Gemini API Award", detailId: "award-hackdecouverte" },
    ],
  },
  {
    id: "data-analysis",
    label: "Data Analysis",
    icon: { glyph: "dataAnalysis" },
    tldr: "Turning raw numbers into something that answers a question and changes a decision.",
    usedIn: [
      { label: "Cooked", detailId: "project-cooked" },
      { label: "Brim AERO", detailId: "project-brim-aero" },
      { label: "AI Accelerator Program", detailId: "achievement-ai-accelerator-certificate" },
    ],
  },
  {
    id: "vr-prototyping",
    label: "VR Prototyping",
    icon: { glyph: "vr" },
    tldr: "Building headset-ready walkthroughs so stakeholders can review a space before it is built.",
    usedIn: [
      { label: "SAJO internship", detailId: "experience-sajo" },
      { label: "SAJO Miami VR simulation", detailId: "project-sajo-miami-vr" },
      { label: "SAJO Montreal VR simulation", detailId: "project-sajo-montreal-vr" },
    ],
  },
  {
    id: "environment-design",
    label: "3D Environment Design",
    icon: { glyph: "environment" },
    tldr: "Modeling, texturing, lighting, and staging spaces that read as real from any angle.",
    usedIn: [
      { label: "Maeve Catalog", detailId: "project-maeve-catalog" },
      { label: "SAJO Miami VR simulation", detailId: "project-sajo-miami-vr" },
      { label: "LAB_01 dev team", detailId: "achievement-lab-01-dev-team-2024" },
    ],
  },
  {
    id: "matterport",
    label: "Matterport",
    icon: { glyph: "spatialCapture" },
    tldr: "Spatial capture platform that scans a real site into an accurate, navigable 3D twin.",
    usedIn: [{ label: "LiDAR scanning at SAJO", detailId: "experience-sajo" }],
  },
];
