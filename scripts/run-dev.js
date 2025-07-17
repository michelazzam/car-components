const inquirer = require("inquirer");
const { spawn } = require("child_process");
const path = require("path");

const projects = [
  { name: "Car Components", value: "car-components" },
  { name: "Another Customer", value: "another-customer" },
];

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

async function startDevelopment() {
  try {
    // Select the project
    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to run?",
        choices: projects,
      },
    ]);

    console.log(`\nStarting development for ${project}...`);

    const env = {
      ...process.env,
      CUSTOM_ENV: project,
    };

    // Prepare environment
    console.log("📝 Preparing environment...");
    await runCommand("node", ["scripts/prepare-env.js"], { env });

    // Run server and client concurrently
    console.log("🚀 Starting development servers...");

    // Use concurrently from node_modules directly
    const concurrentlyPath = path.join(
      __dirname,
      "..",
      "node_modules",
      ".bin",
      "concurrently"
    );

    await runCommand(
      concurrentlyPath,
      [
        `"cross-env CUSTOM_ENV=${project} npm run dev:server"`,
        `"npm run dev:client"`,
      ],
      {
        env,
        shell: true,
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

startDevelopment();
