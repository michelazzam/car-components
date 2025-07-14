// scripts/prepare-env.js

const fs = require("fs");
const path = require("path");

const envTarget = process.env.CUSTOM_ENV;

if (!envTarget) {
  console.error("❌ CUSTOM_ENV is not defined.");
  process.exit(1);
}

const src = path.resolve(__dirname, `../src-tauri/.env.${envTarget}`);
const dest = path.resolve(__dirname, `../src-tauri/.env`);

if (!fs.existsSync(src)) {
  console.error(`❌ Environment file ${src} does not exist.`);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log(`✅ Copied ${src} → ${dest}`);
