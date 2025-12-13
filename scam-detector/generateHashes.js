const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DATASET_DIR = path.join(__dirname, "..", "ScamDataSet");
const OUT_FILE = path.join(__dirname, "hashes.json");

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif"]);

// Simple dHash implementation
async function dHash(imagePath) {
  const img = await sharp(imagePath)
    .grayscale()
    .resize(9, 8) // dHash uses 9x8
    .raw()
    .toBuffer();

  let hash = "";
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = img[y * 9 + x];
      const right = img[y * 9 + x + 1];
      hash += left > right ? "1" : "0";
    }
  }
  return hash;
}

(async () => {
  const files = fs
    .readdirSync(DATASET_DIR)
    .filter(f => ALLOWED_EXT.has(path.extname(f).toLowerCase()));

  console.log(`Found ${files.length} images`);

  const results = [];

  for (const file of files) {
    const full = path.join(DATASET_DIR, file);
    try {
      const hash = await dHash(full);
      results.push({ file, hash });
      console.log(`Hashed: ${file}`);
    } catch (e) {
      console.warn(`Failed: ${file}`, e.message);
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(results, null, 2));
  console.log("\nDone. hashes.json created.");
})();