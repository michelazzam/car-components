import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

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

export const useGetProjectConfig = () => {
  return useReadData<ProjectConfig>({
    endpoint: API.getProjectConfig,
    queryKey: ["project-config"],
  });
};
