import PulsingCircle from "@/components/common/animations/PulsingCircle";
import React, { useEffect, useState } from "react";

import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";

async function checkForUpdates() {
  const update = await check();
  if (update) {
    const proceed = await ask(
      "A new version is available. Do you want to update?"
    );
    if (proceed) {
      await update.downloadAndInstall();
      window.location.reload();
    }
    return true;
  }
  return false;
}

function UpdatesButton() {
  const [hasUpdates, setHasUpdates] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    } else {
      checkForUpdates().then(setHasUpdates);
    }
  }, []);

  if (!hasUpdates) return null;
  return (
    <div className="flex items-center relative">
      <button className="ti-btn ti-btn-secondary">
        A new update is available
        <i className="bx bx-download"></i>
        <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2">
          <PulsingCircle />
        </div>
      </button>
    </div>
  );
}

export default UpdatesButton;
