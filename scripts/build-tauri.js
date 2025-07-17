const inquirer = require("inquirer");
const { spawn } = require("child_process");

const projects = [
  { name: "Car Components", value: "car-components" },
  { name: "Another Customer", value: "another-customer" },
];

async function buildTauri() {
  try {
    // First ask for the private key
    const { privateKey } = await inquirer.prompt([
      {
        type: "password",
        name: "privateKey",
        message: "Please provide the Tauri updater private key:",
        validate: (input) => {
          if (!input) return "Private key is required";
          return true;
        },
      },
    ]);

    // Then select the project
    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to build?",
        choices: projects,
      },
    ]);

    console.log(`\nStarting Tauri build for ${project}...`);

    // Set the private key as an environment variable and run the build
    process.env.TAURI_SIGNING_PRIVATE_KEY = privateKey;

    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, ["run", `tauri:build:${project}`], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env },
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
