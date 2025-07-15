const fs = require("fs");
const path = require("path");

const envTarget = process.env.CUSTOM_ENV || "car-components";

console.log("🌍 Current Environment Configuration");
console.log("=====================================");
console.log(`Environment: ${envTarget}`);
console.log("");

// Load project configuration
const projectsConfigPath = path.resolve(__dirname, "../config/projects.json");

if (fs.existsSync(projectsConfigPath)) {
  const projectsConfig = JSON.parse(
    fs.readFileSync(projectsConfigPath, "utf8")
  );
  const projectConfig = projectsConfig[envTarget];

  if (projectConfig) {
    console.log("📋 Project Details:");
    console.log(`   Name: ${projectConfig.name}`);
    console.log(`   Display Name: ${projectConfig.displayName}`);
    console.log(`   Version: ${projectConfig.version}`);
    console.log(`   Product Name: ${projectConfig.productName}`);
    console.log(`   Identifier: ${projectConfig.identifier}`);
    console.log("");

    console.log("⚙️  Feature Settings:");
    Object.entries(projectConfig.settings.features).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? "✅ Enabled" : "❌ Disabled"}`);
    });
    console.log("");

    console.log("🧾 Invoice Settings:");
    Object.entries(projectConfig.settings.invoice).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? "✅ Enabled" : "❌ Disabled"}`);
    });
    console.log("");

    console.log("📦 Inventory Settings:");
    Object.entries(projectConfig.settings.inventory).forEach(([key, value]) => {
      console.log(`   ${key}: ${value ? "✅ Enabled" : "❌ Disabled"}`);
    });
    console.log("");

    console.log("🎨 UI Theme:");
    console.log(`   Theme: ${projectConfig.settings.ui.theme}`);
    console.log(`   Primary Color: ${projectConfig.settings.ui.primaryColor}`);
    console.log(
      `   Secondary Color: ${projectConfig.settings.ui.secondaryColor}`
    );
  } else {
    console.log(
      `❌ Project configuration not found for environment: ${envTarget}`
    );
  }
} else {
  console.log("❌ Project configuration file not found");
}

console.log("");
console.log("🚀 Available Commands:");
console.log(
  "   npm run dev:car-components     - Start development for Car Components"
);
console.log(
  "   npm run dev:another-customer   - Start development for Another Customer"
);
console.log(
  "   npm run tauri:dev:car-components     - Start Tauri development for Car Components"
);
console.log(
  "   npm run tauri:dev:another-customer   - Start Tauri development for Another Customer"
);
console.log(
  "   npm run tauri:build:car-components   - Build Tauri app for Car Components"
);
console.log(
  "   npm run tauri:build:another-customer - Build Tauri app for Another Customer"
);
