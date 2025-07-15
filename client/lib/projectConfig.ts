import projectsConfig from "../../config/projects.json";

export interface ProjectConfig {
  name: string;
  displayName: string;
  description: string;
  author: string;
  keywords: string;
  productName: string;
  identifier: string;
  version: string;
  repository: {
    url: string;
    issues: string;
    homepage: string;
  };
  updater: {
    endpoints: string[];
  };
  storage: {
    name: string;
  };
  settings: {
    features: {
      manageCarBrandsModels: boolean;
      allowServices: boolean;
      showSort: boolean;
      allowEditingStock: boolean;
    };
    invoice: {
      manageCustomerType: boolean;
      allowItemDiscountLessThanCost: boolean;
      allowChangePrice: boolean;
      allowDiscountPerItem: boolean;
    };
    inventory: {
      showSort: boolean;
      allowEditingStock: boolean;
      showStockLevels: boolean;
      allowBulkOperations: boolean;
    };
    ui: {
      theme: string;
      primaryColor: string;
      secondaryColor: string;
    };
  };
}

export const getProjectConfig = (): ProjectConfig => {
  const customEnv = process.env.CUSTOM_ENV || "car-components";
  const config = projectsConfig[customEnv as keyof typeof projectsConfig];

  if (!config) {
    console.warn(
      `Project config not found for environment: ${customEnv}, falling back to car-components`
    );
    return projectsConfig["car-components"] as ProjectConfig;
  }

  return config as ProjectConfig;
};

export const useProjectConfig = () => {
  const config = getProjectConfig();

  return {
    ...config,
    // Helper methods
    isFeatureEnabled: (
      feature: keyof ProjectConfig["settings"]["features"]
    ) => {
      return config.settings.features[feature];
    },
    isInvoiceSettingEnabled: (
      setting: keyof ProjectConfig["settings"]["invoice"]
    ) => {
      return config.settings.invoice[setting];
    },
    isInventorySettingEnabled: (
      setting: keyof ProjectConfig["settings"]["inventory"]
    ) => {
      return config.settings.inventory[setting];
    },
    getThemeColor: (type: "primary" | "secondary") => {
      return type === "primary"
        ? config.settings.ui.primaryColor
        : config.settings.ui.secondaryColor;
    },
  };
};
