const inquirer = require("inquirer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const projects = [
  { name: "Car Components", value: "car-components" },
  { name: "Another Customer", value: "another-customer" },
];

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

    // Select the project
    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to build?",
        choices: projects,
      },
    ]);

    console.log(`\nStarting Tauri build for ${project}...`);

    // Set both the private key and CUSTOM_ENV as environment variables
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, ["run", `tauri:build:${project}`], {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        TAURI_SIGNING_PRIVATE_KEY: privateKey,
        CUSTOM_ENV: project,
      },
    });

    child.on("error", (error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

buildTauri();
