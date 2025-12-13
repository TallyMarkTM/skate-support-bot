const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Load known hashes once at startup
const HASH_PATH = path.join(__dirname, "hashes.json");
const KNOWN_HASHES = JSON.parse(fs.readFileSync(HASH_PATH, "utf8"));

// Simple hamming distance
function hamming(a, b) {
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) dist++;
  }
  return dist;
}

// Create a very simple perceptual hash from buffer
function simpleHash(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex");
}

// MAIN FUNCTION THE BOT USES
async function checkImageBuffer(buffer, threshold = 10) {
  const incomingHash = simpleHash(buffer);

  let bestDistance = Infinity;

  for (const entry of KNOWN_HASHES) {
    const d = hamming(incomingHash, entry.hash);
    if (d < bestDistance) bestDistance = d;
    if (bestDistance === 0) break;
  }

  return {
    isScam: bestDistance <= threshold,
    distance: bestDistance,
  };
}

module.exports = { checkImageBuffer };