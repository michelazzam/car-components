import { useProjectConfig } from "@/lib/projectConfig";

export const useCustomEnv = () => {
  const customEnv = process.env.CUSTOM_ENV;
  const config = useProjectConfig();

  return {
    isCarComponents: customEnv === "car-components",
    isAnotherCustomer: customEnv === "another-customer",
    customEnv,
    // Get the billing token for the current environment
    getBillingToken: () => {
      return process.env.NEXT_PUBLIC_BILLING_TOKEN;
    },
    // Add more environment-specific logic here
    getApiUrl: () => {
      switch (customEnv) {
        case "car-components":
          return (
            process.env.NEXT_PUBLIC_API_URL_CAR_COMPONENTS ||
            "https://api.car-components.com"
          );
        case "another-customer":
          return (
            process.env.NEXT_PUBLIC_API_URL_ANOTHER_CUSTOMER ||
            "https://api.another-customer.com"
          );
        default:
          return process.env.NEXT_PUBLIC_API_URL || "https://api.default.com";
      }
    },
    getAppName: () => config.displayName,
    getProjectConfig: () => config,
  };
};
