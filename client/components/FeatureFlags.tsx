import React from "react";
import { useProjectConfig } from "@/lib/projectConfig";

const FeatureFlags: React.FC = () => {
  const config = useProjectConfig();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Feature Flags & Settings</h2>

      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Manage Car Brands & Models</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isFeatureEnabled("manageCarBrandsModels")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isFeatureEnabled("manageCarBrandsModels")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Services</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isFeatureEnabled("allowServices")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isFeatureEnabled("allowServices")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Show Sort</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isFeatureEnabled("showSort")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isFeatureEnabled("showSort") ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Editing Stock</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isFeatureEnabled("allowEditingStock")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isFeatureEnabled("allowEditingStock")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Settings Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Invoice Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Manage Customer Type</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInvoiceSettingEnabled("manageCustomerType")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInvoiceSettingEnabled("manageCustomerType")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Item Discount Less Than Cost</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInvoiceSettingEnabled("allowItemDiscountLessThanCost")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInvoiceSettingEnabled("allowItemDiscountLessThanCost")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Change Price</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInvoiceSettingEnabled("allowChangePrice")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInvoiceSettingEnabled("allowChangePrice")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Discount Per Item</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInvoiceSettingEnabled("allowDiscountPerItem")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInvoiceSettingEnabled("allowDiscountPerItem")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Settings Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Inventory Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Show Stock Levels</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInventorySettingEnabled("showStockLevels")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInventorySettingEnabled("showStockLevels")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Allow Bulk Operations</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                config.isInventorySettingEnabled("allowBulkOperations")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {config.isInventorySettingEnabled("allowBulkOperations")
                ? "Enabled"
                : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* UI Theme Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">UI Theme</h3>
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-sm text-gray-600">Theme:</span>
            <span className="ml-2 font-medium">{config.settings.ui.theme}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Primary Color:</span>
            <div
              className="ml-2 w-6 h-6 rounded border"
              style={{ backgroundColor: config.getThemeColor("primary") }}
            ></div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Secondary Color:</span>
            <div
              className="ml-2 w-6 h-6 rounded border"
              style={{ backgroundColor: config.getThemeColor("secondary") }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlags;
