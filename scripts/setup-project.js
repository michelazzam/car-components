const fs = require("fs").promises;
const path = require("path");
const inquirer = require("inquirer");

async function setupNewProject() {
  // Get project details
  const { projectId } = await inquirer.prompt([
    {
      type: "input",
      name: "projectId",
      message: "Enter the project ID (e.g., xyz-customer):",
      validate: (input) => {
        if (!input) return "Project ID is required";
        if (!/^[a-z0-9-]+$/.test(input))
          return "Project ID must contain only lowercase letters, numbers, and hyphens";
        return true;
      },
    },
  ]);

  const {
    displayName,
    description,
    author,
    version,
    repoUrl,
    allowServices,
    manageCarBrandsModels,
    allowEditingStock,
    manageCustomerType,
    allowItemDiscountLessThanCost,
    allowChangePrice,
    allowDiscountPerItem,
    primaryColor,
    secondaryColor,
  } = await inquirer.prompt([
    {
      type: "input",
      name: "displayName",
      message: "Enter the display name:",
      default: projectId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    },
    {
      type: "input",
      name: "description",
      message: "Enter project description:",
      default: (answers) => `${answers.displayName} Management System`,
    },
    {
      type: "input",
      name: "author",
      message: "Enter author name:",
      default: (answers) => answers.displayName,
    },
    {
      type: "input",
      name: "version",
      message: "Enter version:",
      default: "0.1.0",
    },
    {
      type: "input",
      name: "repoUrl",
      message: "Enter repository URL:",
      default: (answers) => `https://github.com/michelazzam/${projectId}`,
    },
    {
      type: "confirm",
      name: "allowServices",
      message: "Allow services feature?",
      default: true,
    },
    {
      type: "confirm",
      name: "manageCarBrandsModels",
      message: "Enable car brands/models management?",
      default: true,
    },
    {
      type: "confirm",
      name: "allowEditingStock",
      message: "Allow editing stock?",
      default: true,
    },
    {
      type: "confirm",
      name: "manageCustomerType",
      message: "Enable customer type management?",
      default: true,
    },
    {
      type: "confirm",
      name: "allowItemDiscountLessThanCost",
      message: "Allow item discount less than cost?",
      default: false,
    },
    {
      type: "confirm",
      name: "allowChangePrice",
      message: "Allow price changes?",
      default: true,
    },
    {
      type: "confirm",
      name: "allowDiscountPerItem",
      message: "Allow discount per item?",
      default: true,
    },
    {
      type: "input",
      name: "primaryColor",
      message: "Enter primary color (hex):",
      default: "#3B82F6",
    },
    {
      type: "input",
      name: "secondaryColor",
      message: "Enter secondary color (hex):",
      default: "#1E40AF",
    },
  ]);

  // Create server project configuration
  const serverProjectConfig = {
    name: displayName,
    logo: "/assets/images/brand-logos/logo.jpg",
    displayName,
    description,
    author,
    keywords: `system, pos, apos, ${displayName}, ${displayName} - APOS`,
    productName: projectId,
    identifier: `com.ams.${projectId.replace(/-/g, "")}`,
    version,
    repository: {
      url: `git+${repoUrl}.git`,
      issues: `${repoUrl}/issues`,
      homepage: `${repoUrl}#readme`,
    },
    updater: {
      endpoints: [`${repoUrl}/releases/latest/download/latest.json`],
    },
    storage: {
      name: `${displayName} Purchase Storage`,
    },
    settings: {
      features: {
        manageCarBrandsModels,
        allowServices,
        showSort: true,
        allowEditingStock,
      },
      invoice: {
        manageCustomerType,
        allowItemDiscountLessThanCost,
        allowChangePrice,
        allowDiscountPerItem,
      },
      inventory: {
        showSort: true,
        allowEditingStock,
        showStockLevels: true,
        allowBulkOperations: true,
      },
      ui: {
        theme: `${projectId}-theme`,
        primaryColor,
        secondaryColor,
      },
    },
    env: {
      client: {
        NEXT_PUBLIC_API_URL: "http://localhost:8000/v1",
        NEXT_PUBLIC_BILLING_URL:
          "https://admin.panel.staging.advanced-meta.com",
      },
      tauri: {
        NODE_ENV: "development",
        PORT: "8000",
        DATABASE_URL: "mongodb://127.0.0.1:27017",
        AMS_SERVER_URL: "https://admin.panel.advanced-meta.com",
        BACKUP_DATABASE_URL:
          "mongodb+srv://husseinhopehassan:dlM1aPjAoPpfFc12@cluster0.t9khsc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        TELEGRAM_API_TOKEN: "8159012563:AAFewyHGGLCAdm8Y-WTNNzxe88j2Pxo43zA",
        CHAT_ID: "-1002683151718",
        CLIENT_CHAT_ID: "-1002669572928",
        TAURI_SIGNING_PRIVATE_KEY:
          "dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5NWRVcWRpWWJ3NjBsaUJaWUlVdnBWV2NhUzdNRXNzTW9PbjlJOUxxN2tFRUFBQkFBQUFBQUFBQUFBQUlBQUFBQUVvbkhrM0RrN0pWVTQ0aEtSQ3BZSDRFRytnSmcydTFDWndoLy9vcHFJdndiZkZHRitJVnhMSE5jUTh6UDZiRVlkR2JQSzVBSWorTFpxSE9HbkZZZVJ2UzcrTkswYmE4UzNUaS9SNStKazdWSXQrYjBTTHQ2MEhQalQvT2hvaWNYbE43aitmdXZLU2c9Cg==",
        CLIENT_NAME: displayName,
        CUSTOM_ENV: projectId,
      },
    },
  };

  // Update server projects.ts
  const serverProjectsPath = path.join(
    __dirname,
    "..",
    "server",
    "src",
    "config",
    "projects.ts"
  );
  const existingServerProjects = require(serverProjectsPath);

  const updatedServerProjects = `export const ProjectsConfig = ${JSON.stringify(
    {
      ...existingServerProjects.ProjectsConfig,
      [projectId]: serverProjectConfig,
    },
    null,
    2
  )};
`;

  // Write the updated server configuration
  await fs.writeFile(serverProjectsPath, updatedServerProjects, "utf8");

  // Generate client environment file
  const clientEnvContent = Object.entries(serverProjectConfig.env.client)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Generate tauri environment file
  const tauriEnvContent = Object.entries(serverProjectConfig.env.tauri)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // Client .env
  await fs.writeFile(
    path.join(__dirname, "..", "client", `.env.${projectId}`),
    clientEnvContent,
    "utf8"
  );

  // Tauri .env
  await fs.writeFile(
    path.join(__dirname, "..", "src-tauri", `.env.${projectId}`),
    tauriEnvContent,
    "utf8"
  );

  console.log(
    `\n✅ Project "${displayName}" (${projectId}) has been set up successfully!`
  );
  console.log("\nFiles created/updated:");
  console.log(`- Updated server/src/config/projects.ts`);
  console.log(`- client/.env.${projectId}`);
  console.log(`- src-tauri/.env.${projectId}`);

  console.log("\n🚀 You can now run the project with:");
  console.log("npm run dev");
  console.log("or build it with:");
  console.log("npm run tauri:build");
}

setupNewProject().catch(console.error);
