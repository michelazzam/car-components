import * as fs from 'fs';
import * as path from 'path';

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
  const configPath = path.resolve(__dirname, '../../../config/projects.json');

  if (!fs.existsSync(configPath)) {
    console.warn(
      'Project configuration file not found, using default car-components config',
    );
    // Return default config
    return {
      name: 'Car Components',
      displayName: 'Car Components',
      description: 'Car Components Management System',
      author: 'Car Components',
      keywords: 'system, pos, apos, Car Components, Car Components - APOS',
      productName: 'car-components',
      identifier: 'com.ams.carcomponents',
      version: '0.2.0',
      repository: {
        url: 'git+https://github.com/michelazzam/Car-Components.git',
        issues: 'https://github.com/michelazzam/Car-Components/issues',
        homepage: 'https://github.com/michelazzam/Car-Components#readme',
      },
      updater: {
        endpoints: [
          'https://github.com/michelazzam/car-components/releases/latest/download/latest.json',
        ],
      },
      storage: {
        name: 'Car Components Purchase Storage',
      },
      settings: {
        features: {
          manageCarBrandsModels: true,
          allowServices: true,
          showSort: true,
          allowEditingStock: true,
        },
        invoice: {
          manageCustomerType: true,
          allowItemDiscountLessThanCost: false,
          allowChangePrice: true,
          allowDiscountPerItem: true,
        },
        inventory: {
          showSort: true,
          allowEditingStock: true,
          showStockLevels: true,
          allowBulkOperations: true,
        },
        ui: {
          theme: 'car-theme',
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
        },
      },
    };
  }

  try {
    const projectsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const config = projectsConfig[customEnv];

    if (!config) {
      console.warn(
        `Project config not found for environment: ${customEnv}, falling back to car-components`,
      );
      cachedConfig = projectsConfig['car-components'] as ProjectConfig;
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
