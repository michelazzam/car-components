import {
  useGetProjectConfig,
  ProjectConfig,
} from "@/api-hooks/useGetProjectConfig";

export const useProjectConfig = () => {
  const { data: config, isLoading, error } = useGetProjectConfig();

  if (isLoading) {
    return {
      isLoading: true,
      error: null,
      // Return default values while loading
      name: "Loading...",
      displayName: "Loading...",
      description: "",
      author: "",
      keywords: "",
      productName: "",
      identifier: "",
      version: "",
      repository: { url: "", issues: "", homepage: "" },
      updater: { endpoints: [] },
      storage: { name: "" },
      settings: {
        features: {
          manageCarBrandsModels: false,
          allowServices: false,
          showSort: false,
          allowEditingStock: false,
        },
        invoice: {
          manageCustomerType: false,
          allowItemDiscountLessThanCost: false,
          allowChangePrice: false,
          allowDiscountPerItem: false,
        },
        inventory: {
          showSort: false,
          allowEditingStock: false,
          showStockLevels: false,
          allowBulkOperations: false,
        },
        ui: {
          theme: "",
          primaryColor: "",
          secondaryColor: "",
        },
      },
      // Helper methods
      isFeatureEnabled: () => false,
      isInvoiceSettingEnabled: () => false,
      isInventorySettingEnabled: () => false,
      getThemeColor: () => "",
    };
  }

  if (error || !config) {
    return {
      isLoading: false,
      error,
      // Return fallback values on error
      name: "Error Loading Config",
      displayName: "Error Loading Config",
      description: "",
      author: "",
      keywords: "",
      productName: "",
      identifier: "",
      version: "",
      repository: { url: "", issues: "", homepage: "" },
      updater: { endpoints: [] },
      storage: { name: "" },
      settings: {
        features: {
          manageCarBrandsModels: false,
          allowServices: false,
          showSort: false,
          allowEditingStock: false,
        },
        invoice: {
          manageCustomerType: false,
          allowItemDiscountLessThanCost: false,
          allowChangePrice: false,
          allowDiscountPerItem: false,
        },
        inventory: {
          showSort: false,
          allowEditingStock: false,
          showStockLevels: false,
          allowBulkOperations: false,
        },
        ui: {
          theme: "",
          primaryColor: "",
          secondaryColor: "",
        },
      },
      // Helper methods
      isFeatureEnabled: () => false,
      isInvoiceSettingEnabled: () => false,
      isInventorySettingEnabled: () => false,
      getThemeColor: () => "",
    };
  }

  return {
    ...config,
    isLoading: false,
    error: null,
    // Helper methods
    isFeatureEnabled: (
      feature: keyof ProjectConfig["settings"]["features"]
    ) => {
      return config.settings.features[
        feature as keyof typeof config.settings.features
      ];
    },
    isInvoiceSettingEnabled: (
      setting: keyof ProjectConfig["settings"]["invoice"]
    ) => {
      return config.settings.invoice[
        setting as keyof typeof config.settings.invoice
      ];
    },
    isInventorySettingEnabled: (
      setting: keyof ProjectConfig["settings"]["inventory"]
    ) => {
      return config.settings.inventory[
        setting as keyof typeof config.settings.inventory
      ];
    },
    getThemeColor: (type: "primary" | "secondary") => {
      return type === "primary"
        ? config.settings.ui.primaryColor
        : config.settings.ui.secondaryColor;
    },
  };
};
