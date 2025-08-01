const inquirer = require("inquirer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Read and parse the projects.ts file
const projectsFilePath = path.join(
  __dirname,
  "..",
  "server",
  "src",
  "config",
  "projects.ts"
);
const projectsFileContent = fs.readFileSync(projectsFilePath, "utf8");
const projectsConfigMatch = projectsFileContent.match(
  /export const ProjectsConfig = ({[\s\S]*});/
);
const ProjectsConfig = eval("(" + projectsConfigMatch[1] + ")");

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
    // Get project choices from ProjectsConfig
    const projectChoices = Object.entries(ProjectsConfig).map(
      ([id, config]) => ({
        name: config.displayName,
        value: id,
      })
    );

    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to run?",
        choices: projectChoices,
      },
    ]);

    const projectDetails = ProjectsConfig[project];
    console.log(`\nStarting development for ${projectDetails.displayName}...`);

    const env = {
      ...process.env,
      CUSTOM_ENV: project,
    };

    // Prepare environment
    console.log("📝 Preparing environment...");
    await runCommand("node", ["scripts/prepare-env.js"], { env });

    // Run client only since server should be started separately
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
        `"npm run dev:client "`,
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
