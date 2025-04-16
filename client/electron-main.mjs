//@ts-check
import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { spawn } from "cross-spawn";
import http from "http";
import { fileURLToPath, URL } from "url";

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);
const nodePath = process.execPath;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

let mainWindow;
let serverProcess;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true, // Security warning: Consider setting this to false and using preload scripts
      contextIsolation: false, // Security warning: Consider setting this to true
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

async function conditionallyStartMongoDB() {
  if (process.platform !== "darwin") {
    // Check if the OS is not macOS
    await startMongoDB();
  } else {
    console.log(
      "MongoDB is not configured to run on macOS within this application."
    );
  }
}

function startMongoDB() {
  return new Promise((resolve, reject) => {
    console.log("Starting MongoDB server...");
    const mongoDBPath =
      "C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe"; // Adjust this path as necessary
    const dbPath = "C:\\data\\db"; // Ensure this directory exists or adjust as necessary

    const mongoProcess = spawn(mongoDBPath, ["--dbpath", dbPath], {
      shell: true,
    });

    mongoProcess.stdout.on("data", (data) => {
      console.log(`MongoDB stdout: ${data}`);
      if (data.toString().includes("waiting for connections on port")) {
        resolve();
      }
    });

    mongoProcess.stderr.on("data", (data) => {
      console.error(`MongoDB stderr: ${data}`);
    });

    mongoProcess.on("error", (err) => {
      console.error("Failed to start MongoDB process:", err);
      reject(err);
    });

    mongoProcess.on("exit", (code) => {
      console.log(`MongoDB process exited with code ${code}`);
      if (code !== 0) {
        reject(new Error("MongoDB process terminated unexpectedly"));
      }
    });
  });
}

function startBackendServer() {
  return new Promise((resolve, reject) => {
    console.log("Starting backend server...");
    serverProcess = spawn(npmCommand, ["run", "start"], {
      cwd: path.join(__dirname, "./server"),
      shell: true,
    });

    serverProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      if (data.toString().includes("Ready on")) {
        resolve();
      }
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    serverProcess.on("error", (err) => {
      console.error("Failed to start server process:", err);
      reject(err);
    });

    serverProcess.on("exit", (code) => {
      console.log(`Server process exited with code ${code}`);
      if (code !== 0) {
        reject(new Error("Server process terminated unexpectedly"));
      }
    });
  });
}

function startServer() {
  return new Promise((resolve, reject) => {
    console.log("Starting Next.js server...");

    // Use the correct npx command to start the server
    serverProcess = spawn(npxCommand, ["serve@latest", "out"], {
      stdio: "pipe", // Switch to 'pipe' for logging both stdout and stderr
      cwd: path.join(__dirname, "."), // Make sure this path points to the root of your Next.js project
    });

    // Log stdout and stderr for better debugging
    serverProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    serverProcess.on("error", (err) => {
      console.error("Failed to start server process:", err);
      reject(err);
    });

    serverProcess.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(new Error("Server process terminated unexpectedly"));
      }
    });

    resolve();
  });
}

async function waitForServer(url) {
  console.log("Checking server readiness...");
  return new Promise((resolve, reject) => {
    const checkServer = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            console.log("Server is ready.");
            resolve();
          } else {
            console.log("Server not ready, retrying...");
            setTimeout(checkServer, 500);
          }
        })
        .on("error", (err) => {
          console.error("Error checking server status:", err);
          setTimeout(checkServer, 500);
        });
    };
    checkServer();
  });
}

app.on("ready", async () => {
  try {
    // await conditionallyStartMongoDB(); // Start MongoDB first
    await startServer();
    await waitForServer("http://localhost:3000");

    createWindow();
    startBackendServer();
  } catch (error) {
    console.error("Error starting application:", error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (serverProcess) {
      console.log("Killing the server process...");
      serverProcess.kill();
      serverProcess.kill("SIGTERM");
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log("Another instance is running. Quitting this one.");
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
