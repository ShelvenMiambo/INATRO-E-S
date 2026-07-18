import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, parse } from "node:path";
import sharp from "sharp";

const SRC_DIR = join(process.cwd(), "data", "images");
const OUT_DIR = join(process.cwd(), "public", "questions");

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".png"));
  let done = 0;
  for (const file of files) {
    const { name } = parse(file);
    const outPath = join(OUT_DIR, `${name}.webp`);
    if (existsSync(outPath)) {
      done++;
      continue;
    }
    await sharp(join(SRC_DIR, file))
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    done++;
  }
  console.log(`Otimizadas ${done}/${files.length} imagens -> ${OUT_DIR}`);
}

main();
