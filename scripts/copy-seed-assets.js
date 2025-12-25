// scripts/copy-seed-assets.js
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../seed/assets");
const dest = path.join(__dirname, "../dist/seed/assets");

if (!fs.existsSync(src)) {
  console.log("⚠️ seed/assets not found, skipping");
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}

console.log("✅ seed/assets copied to dist");
