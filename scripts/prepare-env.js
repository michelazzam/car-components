// scripts/prepare-env.js

const fs = require("fs");
const path = require("path");

const envTarget = process.env.CUSTOM_ENV;

if (!envTarget) {
  console.error("❌ CUSTOM_ENV is not defined.");
  process.exit(1);
}

// Handle Tauri environment files
const tauriSrc = path.resolve(__dirname, `../src-tauri/.env.${envTarget}`);
const tauriDest = path.resolve(__dirname, `../src-tauri/.env`);

if (!fs.existsSync(tauriSrc)) {
  console.error(`❌ Tauri environment file ${tauriSrc} does not exist.`);
  process.exit(1);
}

fs.copyFileSync(tauriSrc, tauriDest);
console.log(`✅ Copied Tauri ${tauriSrc} → ${tauriDest}`);

// Handle Client environment files
const clientSrc = path.resolve(__dirname, `../client/.env.${envTarget}`);
const clientDest = path.resolve(__dirname, `../client/.env`);

if (!fs.existsSync(clientSrc)) {
  console.error(`❌ Client environment file ${clientSrc} does not exist.`);
  process.exit(1);
}

fs.copyFileSync(clientSrc, clientDest);
console.log(`✅ Copied Client ${clientSrc} → ${clientDest}`);
