import React from "react";
import { useCustomEnv } from "@/hooks/useCustomEnv";

const EnvironmentInfo: React.FC = () => {
  const {
    isCarComponents,
    isAnotherCustomer,
    customEnv,
    getBillingToken,
    getAppName,
    getApiUrl,
  } = useCustomEnv();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Environment Information</h3>

      <div className="space-y-2">
        <div>
          <strong>Current Environment:</strong> {customEnv || "Not set"}
        </div>

        <div>
          <strong>App Name:</strong> {getAppName()}
        </div>

        <div>
          <strong>API URL:</strong> {getApiUrl()}
        </div>

        <div>
          <strong>Billing Token:</strong>{" "}
          {getBillingToken() ? "Set" : "Not set"}
        </div>

        <div className="mt-4">
          <strong>Environment Flags:</strong>
          <ul className="list-disc list-inside ml-4">
            <li>Is Car Components: {isCarComponents ? "Yes" : "No"}</li>
            <li>Is Another Customer: {isAnotherCustomer ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>

      {/* Example of environment-specific content */}
      {isCarComponents && (
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <strong>Car Components Specific Content</strong>
          <p>This content only shows for car-components environment</p>
        </div>
      )}

      {isAnotherCustomer && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <strong>Another Customer Specific Content</strong>
          <p>This content only shows for another-customer environment</p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentInfo;
