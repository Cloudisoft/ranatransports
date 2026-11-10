// Renders the three service explainer videos to /public/media.
// Requires: Playwright (Chromium) and ffmpeg on PATH, Python 3 + numpy.
//   node scripts/render-videos.mjs [1|2|3 ...]
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require("playwright");
} catch {
  playwright = require(join(execFileSync("npm", ["root", "-g"]).toString().trim(), "playwright"));
}

const ROOT = resolve(import.meta.dirname, "..");
const FPS = 30;
const SCALE = 1.5; // 1280×720 stage → 1920×1080 output

const VIDEOS = {
  1: { slug: "services-road-freight", music: { bpm: 112, key: 45, cuts: [3.0, 8.2, 15.2, 21.4], cta: 21.4, variant: 0 }, poster: 5.2 },
  2: { slug: "services-vehicles-bulk", music: { bpm: 118, key: 43, cuts: [3.0, 10.8, 16.8, 21.6], cta: 21.6, variant: 1 }, poster: 6.0 },
  3: { slug: "services-corporate-quote", music: { bpm: 108, key: 48, cuts: [3.0, 10.0, 18.4, 22.4], cta: 22.4, variant: 2 }, poster: 15.0 },
};

const trucks = Object.fromEntries(
  readdirSync(join(ROOT, "video/assets/trucks"))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => [f.replace(/\.svg$/, ""), readFileSync(join(ROOT, "video/assets/trucks", f), "utf8")]),
);
const ASSETS = {
  trucks,
  emblem: "../public/brand/rana-emblem.webp",
  indiaMap: "../public/maps/india.svg",
  dinesh: "../public/people/dinesh-rana-portrait.jpg",
  jalpesh: "../public/people/jalpesh-rana-portrait.jpg",
};

const which = process.argv.slice(2).map(Number).filter((n) => VIDEOS[n]);
const list = which.length ? which : [1, 2, 3];

const browser = await playwright.chromium.launch();
for (const n of list) {
  const cfg = VIDEOS[n];
  const work = join(tmpdir(), `rana-video-${n}`);
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: SCALE });
  page.on("pageerror", (e) => console.error("pageerror", e.message));
  await page.goto(pathToFileURL(join(ROOT, "video/composition.html")).href);
  await page.evaluate((a) => (window.ASSETS = a), ASSETS);
  const dur = await page.evaluate((k) => window.build(k), n);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const frames = Math.round(dur * FPS);
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.seek(t), f / FPS);
    await page.screenshot({ path: join(work, `${String(f).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
    if (f % 150 === 0) console.log(`video ${n}: frame ${f}/${frames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  // poster
  await page.evaluate((t) => window.seek(t), cfg.poster);
  await page.screenshot({ path: join(ROOT, `public/media/${cfg.slug}-poster.jpg`), type: "jpeg", quality: 85 });
  await page.close();

  const wav = join(work, "music.wav");
  const m = cfg.music;
  execFileSync("python3", [join(ROOT, "scripts/make-music.py"), wav, String(dur), String(m.bpm), String(m.key), m.cuts.join(","), String(m.cta), String(m.variant)], { stdio: "inherit" });
  const out = join(ROOT, `public/media/${cfg.slug}.mp4`);
  execFileSync(
    "ffmpeg",
    ["-v", "error", "-y", "-framerate", String(FPS), "-i", join(work, "%05d.jpg"), "-i", wav,
      "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p", "-profile:v", "high",
      "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out],
    { stdio: "inherit" },
  );
  if (existsSync(out)) console.log("✓", out);
  rmSync(work, { recursive: true, force: true });
}
await browser.close();
