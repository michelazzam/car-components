import PulsingCircle from "@/components/common/animations/PulsingCircle";
import React, { useEffect, useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

async function checkForUpdates() {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  console.log("THE TOKEN IS ", token);
  console.log("CHECKING FOR UPDATES");
  const update = await check({
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (update) {
    console.log("Update found", update);
    const proceed = await ask(
      "A new version is available. Do you want to update?"
    );
    if (proceed) {
      await update.downloadAndInstall();
      window.location.reload();
    }
    return true;
  } else {
    console.log("No update found");
  }
  return false;
}
function UpdatesButton() {
  const isProduction = process.env.NODE_ENV !== "development";

  const [hasUpdates, setHasUpdates] = useState(false);
  useEffect(() => {
    console.log("NODE ENV", process.env.NODE_ENV);
    if (!isProduction) {
      console.log(
        "Development mode, skipping update check",
        process.env.NODE_ENV
      );
      return;
    } else {
      console.log("Checking for updates");
      checkForUpdates().then(setHasUpdates);
    }
  }, []);

  if (!isProduction) return null;
  if (!hasUpdates) return null;

  return (
    <div className="flex items-center relative">
      <button
        onClick={() => {
          if (!hasUpdates) {
            checkForUpdates().then(setHasUpdates);
          }
        }}
        className="ti-btn ti-btn-secondary"
      >
        {hasUpdates ? "A new update is available" : "Check for updates"}
        <i className="bx bx-download"></i>
        <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2">
          <PulsingCircle />
        </div>
      </button>
    </div>
  );
}

export default UpdatesButton;
