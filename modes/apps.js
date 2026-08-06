const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "config", "modes.json");

// function to read JSON
function loadModes() {
  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw);
}

// run the mode
function runMode(modeId) {
  for (const app of getModeApps(modeId)) {
    spawn(app.path, app.args || [], {
      detached: true,
      stdio: "ignore",
    }).unref();
  }
}

// get the mode apps
function getModeApps(modeId) {
  const data = loadModes();
  const mode = data.modes[modeId];

  if (!mode) {
    throw new Error(`Mode with ID ${modeId} not found.`);
  }

  return mode.apps;
}

module.exports = { loadModes, runMode, getModeApps };
