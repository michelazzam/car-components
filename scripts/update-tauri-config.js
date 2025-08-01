const fs = require("fs");
const path = require("path");

const envTarget = process.env.CUSTOM_ENV;

if (!envTarget) {
  console.error("❌ CUSTOM_ENV is not defined.");
  process.exit(1);
}

// Load project configuration
const projectsConfigPath = path.resolve(__dirname, "../config/projects.json");
const tauriConfigPath = path.resolve(__dirname, "../src-tauri/tauri.conf.json");

if (!fs.existsSync(projectsConfigPath)) {
  console.error("❌ Project configuration file not found.");
  process.exit(1);
}

const projectsConfig = JSON.parse(fs.readFileSync(projectsConfigPath, "utf8"));
const projectConfig = projectsConfig[envTarget];

if (!projectConfig) {
  console.error(
    `❌ Project configuration not found for environment: ${envTarget}`
  );
  process.exit(1);
}

// Load current Tauri configuration
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, "utf8"));

// Update Tauri configuration with project-specific values
tauriConfig.productName = projectConfig.productName;
tauriConfig.identifier = projectConfig.identifier;
tauriConfig.version = projectConfig.version;
tauriConfig.app.windows[0].title = projectConfig.productName;

// Update updater endpoints
if (projectConfig.updater && projectConfig.updater.endpoints) {
  tauriConfig.plugins.updater.endpoints = projectConfig.updater.endpoints;
}

// Update fs scope if needed
if (projectConfig.productName) {
  tauriConfig.plugins.fs.scope = [
    "$APPDATA/**",
    `$HOME/projects/${projectConfig.productName}/**`,
  ];
}

// Write updated configuration back to file
fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2));

console.log(`✅ Updated Tauri configuration for ${envTarget}`);
console.log(`   Product Name: ${projectConfig.productName}`);
console.log(`   Identifier: ${projectConfig.identifier}`);
console.log(`   Version: ${projectConfig.version}`);
