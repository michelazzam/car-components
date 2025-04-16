module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        arch: "x64", // Target architecture for 64-bit systems
        name: "thermobox_ams",
        authors: "Advanced Meta Solutions", // This field is required
        description: "Invoice, inventory and accounting system", // This field is required
        setupIcon: "./public/favicon.ico", // Optional: used for the installer icon
        setupExe: "thermobox_ams_installer.exe", // Optional: the name of the installer file
        setupMsi: "thermobox_ams_installer.msi", // Optional: the name of the MSI file
      },
    },
    {
      name: "@electron-forge/maker-zip", // Optional, but useful for zip builds
      platforms: ["win32"],
    },
  ],
};
