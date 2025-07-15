import { ProjectsConfig } from 'src/config/projects';
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

let cachedConfig: ProjectConfig | null = null;

export const getProjectConfig = (): ProjectConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const customEnv = process.env.CUSTOM_ENV || 'car-components';
  console.log('CUSTOM ENV', customEnv);
  console.log('PROCESS.ENV', process.env.CUSTOM_ENV);
  try {
    const config = ProjectsConfig[customEnv];

    if (!config) {
      console.warn(
        `Project config not found for environment: ${customEnv}, falling back to car-components`,
      );
      cachedConfig = ProjectsConfig['car-components'] as ProjectConfig;
    } else {
      cachedConfig = config as ProjectConfig;
    }

    return cachedConfig;
  } catch (error) {
    console.error('Error loading project configuration:', error);
    throw new Error('Failed to load project configuration');
  }
};

export const isFeatureEnabled = (
  feature: keyof ProjectConfig['settings']['features'],
): boolean => {
  const config = getProjectConfig();
  return config.settings.features[feature];
};

export const isInvoiceSettingEnabled = (
  setting: keyof ProjectConfig['settings']['invoice'],
): boolean => {
  const config = getProjectConfig();
  return config.settings.invoice[setting];
};

export const isInventorySettingEnabled = (
  setting: keyof ProjectConfig['settings']['inventory'],
): boolean => {
  const config = getProjectConfig();
  return config.settings.inventory[setting];
};
