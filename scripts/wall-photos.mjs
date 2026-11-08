// Makes the ready-made photos for the homepage hero's marquee on phones: each photo in
// `marqueePhotos` (src/components/home/hero-marquee.tsx) at 480 and 800px wide, cropped to 4:3,
// in greys, as WebP. The grey is baked in, so the moving rows need no filter.
// Run from the project root after changing that list:
//   node scripts/wall-photos.mjs
// Pass "--dry" to only check the sources. sharp comes with Next.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const source = fs.readFileSync("src/components/home/hero-marquee.tsx", "utf8");
const list = source.slice(source.indexOf("export const marqueePhotos = ["), source.indexOf("];", source.indexOf("export const marqueePhotos = [")));
const names = [...list.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
const out = "public/images/wall";
const widths = [480, 800];
const dry = process.argv.includes("--dry");

if (!dry) {
  // Start clean, so photos taken off the list don't linger.
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
}
let total = 0;
const small = [];
for (const name of names) {
  const photo = path.join("public/images", `${name}.jpg`);
  const meta = await sharp(photo).metadata();
  if (meta.width < 800) small.push(`${name} ${meta.width}`);
  if (dry) continue;
  for (const width of widths) {
    const file = path.join(out, `${name}-${width}.webp`);
    // 4:3, as the tiles are; cropped from the centre, as object-cover does.
    const info = await sharp(photo).resize({ width, height: Math.round((width * 3) / 4), fit: "cover" }).grayscale().webp({ quality: 74, effort: 6 }).toFile(file);
    total += info.size;
  }
}
console.log(`${names.length} photos`, dry ? "" : `${names.length * widths.length} files, ${(total / 1024 / 1024).toFixed(2)} MB`);
if (small.length) console.log("sources under 800px wide:", small.join(", "));
