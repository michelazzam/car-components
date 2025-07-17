const inquirer = require("inquirer");
const { spawn } = require("child_process");

const projects = [
  { name: "Car Components", value: "car-components" },
  { name: "Another Customer", value: "another-customer" },
];

async function selectProject() {
  try {
    const { project } = await inquirer.prompt([
      {
        type: "list",
        name: "project",
        message: "Which project would you like to run?",
        choices: projects,
      },
    ]);

    console.log(`\nStarting development for ${project}...`);

    // Run the appropriate dev script based on selection
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, ["run", `dev:${project}`], {
      stdio: "inherit",
      shell: true,
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

selectProject();
