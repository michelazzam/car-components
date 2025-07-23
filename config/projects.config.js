const projects = {
  "car-components": {
    name: "car-components",
    displayName: "Car Components",
    identifier: "com.car-components.app",
    version: "1.0.0",
    env: {
      NEXT_PUBLIC_APP_NAME: "Car Components",
      NEXT_PUBLIC_API_URL: "http://localhost:3000",
    },
    features: {
      inventory: true,
      billing: true,
      reports: true,
      users: true,
    },
    ui: {
      theme: "light",
      primaryColor: "#1976d2",
      secondaryColor: "#424242",
    },
  },
  "another-customer": {
    name: "another-customer",
    displayName: "Another Customer",
    identifier: "com.another-customer.app",
    version: "1.0.0",
    env: {
      NEXT_PUBLIC_APP_NAME: "Another Customer",
      NEXT_PUBLIC_API_URL: "http://localhost:3000",
    },
    features: {
      inventory: true,
      billing: true,
      reports: true,
      users: true,
    },
    ui: {
      theme: "light",
      primaryColor: "#2196f3",
      secondaryColor: "#757575",
    },
  },
  "the-third-customer": {
    name: "the-third-customer",
    displayName: "The Third Customer",
    identifier: "com.the-third-customer.app",
    version: "1.0.0",
    env: {
      NEXT_PUBLIC_APP_NAME: "The Third Customer",
      NEXT_PUBLIC_API_URL: "http://localhost:3000",
    },
    features: {
      inventory: true,
      billing: true,
      reports: true,
      users: true,
    },
    ui: {
      theme: "light",
      primaryColor: "#1976d2",
      secondaryColor: "#424242",
    },
  },
  "xyz-customer": {
    name: "xyz-customer",
    displayName: "XYZ CUSTOMER",
    identifier: "com.xyz-customer.app",
    version: "0.1.0",
    env: {
      NEXT_PUBLIC_APP_NAME: "XYZ CUSTOMER",
      NEXT_PUBLIC_API_URL: "http://localhost:8000/v1",
      NEXT_PUBLIC_ALLOW_SERVICES: "true",
    },
    features: {
      inventory: true,
      billing: true,
      reports: true,
      users: true,
    },
    ui: {
      theme: "light",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
    },
  },
};

// Helper functions to generate project files
function generateEnvContent(project) {
  return Object.entries(project.env)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

function generateTauriConfig(project) {
  return {
    productName: project.displayName,
    version: project.version,
    identifier: project.identifier,
    // Add other Tauri-specific config here
  };
}

module.exports = {
  projects,
  getProjectIds: () => Object.keys(projects),
  getProjectNames: () =>
    Object.entries(projects).map(([id, p]) => ({
      value: id,
      name: p.displayName,
    })),
  getProject: (id) => projects[id],
  generateEnvContent,
  generateTauriConfig,
};
