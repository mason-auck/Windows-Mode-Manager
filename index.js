const { app, BrowserWindow } = require("electron");
const { loadModes } = require("./modes/apps");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // load JSON data
  const data = loadModes();

  // Load your existing HTML file (e.g., index.html)
  win.loadFile("index.html");

  // Optional: Open DevTools automatically
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
