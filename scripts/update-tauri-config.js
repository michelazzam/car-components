/**
 * Tauri Configuration Update Script
 *
 * This script updates Tauri-related configuration files with project-specific
 * settings based on the environment target specified in CUSTOM_ENV.
 *
 * The script performs the following tasks:
 * 1. Validates environment setup
 * 2. Loads project-specific configuration
 * 3. Updates Tauri configuration (tauri.conf.json) with project details
 * 4. Updates Cargo.toml version to maintain consistency
 * 5. Configures auto-updater endpoints
 * 6. Sets up filesystem access permissions
 */

const fs = require("fs");
const path = require("path");

// Get the target environment from process.env
const envTarget = process.env.CUSTOM_ENV;

// Validate that CUSTOM_ENV is set
if (!envTarget) {
  console.error("❌ CUSTOM_ENV is not defined.");
  process.exit(1);
}

// Define paths for configuration files
const projectsConfigPath = path.resolve(__dirname, "../config/projects.json");
const tauriConfigPath = path.resolve(__dirname, "../src-tauri/tauri.conf.json");

// Validate that project configuration exists
if (!fs.existsSync(projectsConfigPath)) {
  console.error("❌ Project configuration file not found.");
  process.exit(1);
}

// Load and parse project configuration for the target environment
const projectsConfig = JSON.parse(fs.readFileSync(projectsConfigPath, "utf8"));
const projectConfig = projectsConfig[envTarget];

// Validate that configuration exists for the target environment
if (!projectConfig) {
  console.error(
    `❌ Project configuration not found for environment: ${envTarget}`
  );
  process.exit(1);
}

// Load the current Tauri configuration
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, "utf8"));

// Update core application metadata
tauriConfig.productName = projectConfig.productName;
tauriConfig.identifier = projectConfig.identifier;
tauriConfig.version = projectConfig.version;
tauriConfig.app.windows[0].title = projectConfig.productName;

// Configure auto-updater endpoints if specified in project config
if (projectConfig.updater && projectConfig.updater.endpoints) {
  tauriConfig.plugins.updater.endpoints = projectConfig.updater.endpoints;
}

// Set up filesystem access permissions based on product name
if (projectConfig.productName) {
  tauriConfig.plugins.fs.scope = [
    "$APPDATA/**", // Allow access to app data
    `$HOME/projects/${projectConfig.productName}/**`, // Allow access to project directory
  ];
}

// Update Cargo.toml version
const cargoTomlPath = path.resolve(__dirname, "../src-tauri/Cargo.toml");
if (fs.existsSync(cargoTomlPath)) {
  let cargoContent = fs.readFileSync(cargoTomlPath, "utf8");

  // Use regex to update the version while preserving the file format
  cargoContent = cargoContent.replace(
    /^version\s*=\s*"[^"]*"/m,
    `version = "${projectConfig.version}"`
  );

  fs.writeFileSync(cargoTomlPath, cargoContent);
  console.log(`✅ Updated Cargo.toml version to ${projectConfig.version}`);
} else {
  console.error("⚠️ Cargo.toml not found at:", cargoTomlPath);
}

// Save the updated configuration back to the Tauri config file
fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2));

// Log the successful configuration update
console.log(`✅ Updated Tauri configuration for ${envTarget}`);
console.log(`   Product Name: ${projectConfig.productName}`);
console.log(`   Identifier: ${projectConfig.identifier}`);
console.log(`   Version: ${projectConfig.version}`);
