import React, { useEffect, useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { ask } from "@tauri-apps/plugin-dialog";
import PulsingCircle from "@/components/common/animations/PulsingCircle";

export const useCheckHasUpdates = (isProduction: boolean) => {
  // TODO: remove this----------
  // return {
  //   hasUpdates: true,
  //   checking: true,
  // };
  //------------
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
  return { hasUpdates, checking };
};

async function checkForUpdatesAndUpdate(
  setIsDownloading: (value: boolean) => void,
  setDownloadProgress: (value: number) => void
): Promise<boolean> {
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
      setIsDownloading(true);
      setDownloadProgress(0);
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
            const progress = (downloaded / contentLength) * 100;
            setDownloadProgress(Math.round(progress));
            setIsDownloading(true);
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case "Finished":
            setDownloadProgress(100);
            setIsDownloading(false);
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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

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
    <div className="flex flex-col gap-2">
      <div className="flex items-center relative">
        <button
          disabled={checking || isDownloading}
          onClick={() => {
            setChecking(true);
            checkForUpdatesAndUpdate(setIsDownloading, setDownloadProgress)
              .then(setHasUpdates)
              .finally(() => setChecking(false));
          }}
          className="ti-btn ti-btn-secondary flex flex-col "
        >
          <div>
            {" "}
            {checking && !isDownloading
              ? "Checking..."
              : isDownloading
              ? `Downloading... ${downloadProgress}%`
              : hasUpdates
              ? "A new update is available"
              : "Check for updates"}
            <i className="bx bx-download mx-2"></i>
            <div className="absolute top-0 left-0 -translate-x-1/2 translate-y-1/2">
              <PulsingCircle />
            </div>
          </div>
          {isDownloading && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300 ease-in-out"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default UpdatesButton;
