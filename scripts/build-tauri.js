const inquirer = require("inquirer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const projectConfig = require("../config/projects.config");

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function buildTauri() {
  try {
    // Read the private key from the file
    const keyPath = path.join(
      __dirname,
      "..",
      "src-tauri",
      "~",
      ".tauri",
      "myapp.key"
    );
    let privateKey;

    try {
      privateKey = fs.readFileSync(keyPath, "utf8");
      console.log("✅ Successfully read Tauri private key from file");
    } catch (error) {
      console.error("❌ Error reading Tauri private key file:", error.message);
      console.error("Make sure the key file exists at:", keyPath);
      process.exit(1);
    }

    // Select the project using central config
    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to build?",
        choices: projectConfig.getProjectNames(),
      },
    ]);

    const projectDetails = projectConfig.getProject(project);
    console.log(`\nStarting Tauri build for ${projectDetails.displayName}...`);

    const env = {
      ...process.env,
      TAURI_SIGNING_PRIVATE_KEY: privateKey,
      CUSTOM_ENV: project,
      ...projectDetails.env, // Inject project-specific environment variables
    };

    // Execute build steps in sequence
    try {
      console.log("📝 Preparing environment...");
      await runCommand("node", ["scripts/prepare-env.js"], { env });

      console.log("⚙️ Updating Tauri config...");
      await runCommand("node", ["scripts/update-tauri-config.js"], { env });

      console.log("🏗️ Building client...");
      await runCommand("npm", ["run", "build:client"], { env });

      console.log("🚀 Building Tauri application...");
      await runCommand("tauri", ["build"], { env });

      console.log("✅ Build completed successfully!");
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

buildTauri();
