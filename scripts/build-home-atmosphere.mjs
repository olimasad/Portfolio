/**
 * Rebuild public/media/home-atmosphere.mp4 from atmosphere-clips.json
 *
 * Edit the JSON to reorder, remove, or change startSeconds, then:
 *   npm run build:atmosphere
 *
 * Needs ffmpeg on PATH (or set FFMPEG env var to ffmpeg.exe).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mediaDir = path.join(root, "public", "media");
const rawDir = path.join(mediaDir, "raw");
const configPath = path.join(mediaDir, "atmosphere-clips.json");

function findFfmpeg() {
  if (process.env.FFMPEG && fs.existsSync(process.env.FFMPEG)) return process.env.FFMPEG;
  const which = spawnSync(process.platform === "win32" ? "where" : "which", ["ffmpeg"], {
    encoding: "utf8",
  });
  if (which.status === 0) {
    const first = which.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
    if (first) return first;
  }
  const wingetGuess = path.join(
    process.env.LOCALAPPDATA || "",
    "Microsoft",
    "WinGet",
    "Packages",
  );
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
  throw new Error("ffmpeg not found. Install it or set FFMPEG to ffmpeg.exe");
}

function run(ff, args) {
  const result = spawnSync(ff, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed (${result.status}): ${args.join(" ")}`);
  }
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ff = findFfmpeg();
fs.mkdirSync(rawDir, { recursive: true });

const norm = `scale=${config.width}:${config.height}:force_original_aspect_ratio=increase,crop=${config.width}:${config.height},fps=${config.fps},format=yuv420p,setsar=1`;
const normalized = [];

config.clips.forEach((clip, index) => {
  const input = path.resolve(mediaDir, clip.file);
  if (!fs.existsSync(input)) {
    throw new Error(`Missing clip ${clip.id}: ${input}`);
  }
  const out = path.join(rawDir, `n${String(index + 1).padStart(2, "0")}-${clip.id}.mp4`);
  const start = Number(clip.startSeconds) || 0;
  const duration = Number(clip.durationSeconds ?? config.clipSeconds);
  console.log(`→ ${clip.id} @ ${start}s for ${duration}s`);
  run(ff, [
    "-y",
    "-ss",
    String(start),
    "-t",
    String(duration),
    "-i",
    input,
    "-vf",
    norm,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    String(config.crf ?? 29),
    out,
  ]);
  normalized.push(out);
});

const listPath = path.join(rawDir, "concat.txt");
fs.writeFileSync(
  listPath,
  normalized.map((file) => `file '${path.basename(file).replace(/'/g, "'\\''")}'`).join("\n"),
  "utf8",
);

const output = path.join(mediaDir, config.output);
const poster = path.join(mediaDir, config.poster);
console.log(`→ concat → ${config.output}`);
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
  String(config.crf ?? 29),
  "-profile:v",
  "main",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "-an",
  output,
]);

console.log(`→ poster → ${config.poster}`);
run(ff, ["-y", "-ss", "1.0", "-i", output, "-frames:v", "1", "-update", "1", "-q:v", "5", poster]);

const sizeMb = (fs.statSync(output).size / (1024 * 1024)).toFixed(2);
console.log(`Done. ${config.output} (${sizeMb} MB)`);
