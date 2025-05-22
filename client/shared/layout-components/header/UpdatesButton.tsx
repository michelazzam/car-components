import React, { useEffect, useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";
import PulsingCircle from "@/components/common/animations/PulsingCircle";

async function checkForUpdatesAndUpdate(): Promise<boolean> {
  console.log("CHECKING FOR UPDATES");
  const update = await check();
  let downloaded = 0;
  let contentLength = 0;

  if (update) {
    console.log("Update found", update);
    const proceed = await ask(
      "A new version is available. Do you want to update?"
    );

    if (proceed) {
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength || 0;
            console.log(
              `started downloading ${event.data.contentLength} bytes`
            );
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case "Finished":
            console.log("download finished");
            break;
        }
      });
      window.location.reload();
      return true;
    }
    return true; // Update available but user declined
  } else {
    console.log("No update found");
    return false;
  }
}

async function checkForUpdates(): Promise<boolean> {
  const update = await check();
  if (update) return true;
  return false;
}

function UpdatesButton() {
  const isProduction = process.env.NODE_ENV !== "development";

  const [hasUpdates, setHasUpdates] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isProduction) return;

    setChecking(true);
    checkForUpdates().then((hasUpdates) => {
      if (hasUpdates) {
        setHasUpdates(true);
      } else {
        setHasUpdates(false);
      }
      setChecking(false);
    });
  }, []);

  if (!isProduction) return null;
  if (!hasUpdates) return null;

  return (
    <div className="flex items-center relative">
      <button
        disabled={checking}
        onClick={() => {
          setChecking(true);
          checkForUpdatesAndUpdate()
            .then(setHasUpdates)
            .finally(() => setChecking(false));
        }}
        className="ti-btn ti-btn-secondary"
      >
        {checking
          ? "Checking..."
          : hasUpdates
          ? "A new update is available"
          : "Check for updates"}
        <i className="bx bx-download"></i>
        <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2">
          <PulsingCircle />
        </div>
      </button>
    </div>
  );
}

export default UpdatesButton;
