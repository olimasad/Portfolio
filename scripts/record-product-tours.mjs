/**
 * Record short product/Devpost walkthroughs with Playwright, then save into
 * public/media/sources/ for the atmosphere montage.
 *
 *   npm run record:tours
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "media", "sources");
const rawDir = path.join(root, "public", "media", "raw", "tours");

const WIDTH = 1280;
const HEIGHT = 720;

/** Each stop: open URL, wait, scroll a bit, optional click. */
const TOURS = [
  {
    id: "tour-nebula-ai",
    url: "https://ai.oliverms.com",
    dwellMs: 2800,
    scrolls: [420, 380],
  },
  {
    id: "tour-nook",
    url: "https://nook.oliverms.com",
    dwellMs: 2600,
    scrolls: [360, 420],
  },
  {
    id: "tour-nebula-id",
    url: "https://id.oliverms.com",
    dwellMs: 2600,
    scrolls: [300, 360],
  },
  {
    id: "tour-portfolio-projects",
    url: "https://oliverms.com/projects",
    dwellMs: 2400,
    scrolls: [500, 480],
  },
  {
    id: "tour-devpost-ganders",
    url: "https://devpost.com/software/the-ganders",
    dwellMs: 2400,
    scrolls: [500, 520],
  },
  {
    id: "tour-devpost-dr-bob",
    url: "https://devpost.com/software/dr-bob",
    dwellMs: 2400,
    scrolls: [480, 500],
  },
  {
    id: "tour-devpost-brim-aero",
    url: "https://devpost.com/software/brim-aero",
    dwellMs: 2400,
    scrolls: [480, 500],
  },
  {
    id: "tour-devpost-lossnfound",
    url: "https://devpost.com/software/lossnfound",
    dwellMs: 2400,
    scrolls: [480, 500],
  },
  {
    id: "tour-budgetx",
    url: "https://github.com/theganders/budgetx",
    dwellMs: 2200,
    scrolls: [400, 360],
  },
];

function findFfmpeg() {
  if (process.env.FFMPEG && fs.existsSync(process.env.FFMPEG)) return process.env.FFMPEG;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["ffmpeg"], {
    encoding: "utf8",
  });
  if (which.status === 0) {
    const first = which.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
    if (first) return first;
  }
  const wingetGuess = path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Packages");
  if (fs.existsSync(wingetGuess)) {
    const stack = [wingetGuess];
    while (stack.length) {
      const dir = stack.pop();
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.name.toLowerCase() === "ffmpeg.exe") return full;
      }
    }
  }
  throw new Error("ffmpeg not found");
}

function run(ff, args) {
  const result = spawnSync(ff, args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${args.join(" ")}`);
}

async function settle(page, ms) {
  await page.waitForTimeout(ms);
}

async function softScroll(page, distance) {
  await page.evaluate(async (dy) => {
    const step = Math.sign(dy) * 40;
    let left = Math.abs(dy);
    while (left > 0) {
      window.scrollBy(0, Math.sign(dy) * Math.min(40, left));
      left -= 40;
      await new Promise((r) => setTimeout(r, 28));
    }
  }, distance);
  await settle(page, 350);
}

async function recordTour(browser, tour) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    recordVideo: { dir: rawDir, size: { width: WIDTH, height: HEIGHT } },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  console.log(`→ ${tour.id} ${tour.url}`);
  try {
    await page.goto(tour.url, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (err) {
    console.warn(`  warn: ${err.message}`);
  }
  await settle(page, tour.dwellMs);
  for (const dy of tour.scrolls || []) {
    await softScroll(page, dy);
  }
  await settle(page, 800);
  const video = page.video();
  await context.close();
  const webmPath = await video.path();
  return webmPath;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  const ff = findFfmpeg();

  const browser = await chromium.launch({ headless: true });
  const webms = [];
  for (const tour of TOURS) {
    try {
      const webm = await recordTour(browser, tour);
      webms.push({ id: tour.id, webm });
    } catch (err) {
      console.warn(`  skip ${tour.id}: ${err.message}`);
    }
  }
  await browser.close();

  if (!webms.length) throw new Error("No tours recorded");

  const normalized = [];
  for (const [index, item] of webms.entries()) {
    const mp4 = path.join(rawDir, `${item.id}.mp4`);
    console.log(`→ normalize ${item.id}`);
    run(ff, [
      "-y",
      "-i",
      item.webm,
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT},fps=24,format=yuv420p,setsar=1`,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      mp4,
    ]);
    normalized.push(mp4);
  }

  const listPath = path.join(rawDir, "concat.txt");
  fs.writeFileSync(
    listPath,
    normalized.map((file) => `file '${path.basename(file).replace(/'/g, "'\\''")}'`).join("\n"),
  );

  const combined = path.join(outDir, "product-tours.mp4");
  console.log("→ concat product-tours.mp4");
  run(ff, [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    listPath,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    combined,
  ]);

  const sizeMb = (fs.statSync(combined).size / (1024 * 1024)).toFixed(2);
  console.log(`Done. sources/product-tours.mp4 (${sizeMb} MB) from ${normalized.length} stops`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
