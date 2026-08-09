const fs = require("fs");
const path = require("path");
const { dialog } = require("electron");

const { runMode, addNewApp } = require("./modes/apps");
const { webUtils } = require("electron");

const configPath = path.join(__dirname, "config", "modes.json");
const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const list = document.getElementById("app-list");
const picker = document.getElementById("file-picker");

let pending = null;

function save() {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
}

function createAppRow(mode, app) {
  const li = document.createElement("li");
  const label = document.createElement("span");
  li.className = "app-item";
  label.className = "app-label";
  label.textContent = `${mode.name}: ${app.name || "(New app)"} - ${
    app.path || "(No path)"
  }`;

  const btn = document.createElement("button");
  btn.className = "path-btn";
  btn.textContent = "Set Path";
  btn.addEventListener("click", () => {
    pending = { modeId: mode.id, appId: app.id };
    picker.value = "";
    picker.click();
  });

  li.appendChild(label);
  li.appendChild(btn);
  return li;
}

function render() {
  list.innerHTML = ""; // clear the list before rendering
  list.className = "app-list";

  // loop through the modes
  for (const mode of Object.values(data.modes)) {
    // create a details element for each mode
    const details = document.createElement("details");
    details.className = "mode-block";

    const summary = document.createElement("summary");
    summary.className = "mode-toggle";
    summary.textContent = mode.name;

    // container for buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    // add new app and file path picker
    const addAppBtn = document.createElement("button");
    addAppBtn.className = "add-app-btn";
    addAppBtn.textContent = "Add App";

    // add app button event listener
    addAppBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      addNewApp(mode.id);

      const fresh = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      data.modes = fresh.modes;

      const updatedMode = data.modes[mode.id];
      const newApp = updatedMode.apps[updatedMode.apps.length - 1];

      const appsUl = document.querySelector(
        `.mode-apps[data-mode-id="${mode.id}"]`,
      );

      if (appsUl && newApp) {
        appsUl.appendChild(createAppRow(updatedMode, newApp));
      }
    });

    // create a start and stop button for each mode
    const startBtn = document.createElement("button");
    startBtn.className = "start-btn";
    startBtn.textContent = "Start";

    // stop button for each mode
    const stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.textContent = "Stop";

    // add event listeners for start and stop buttons
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      runMode(mode.id);
    });

    stopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    const appsUl = document.createElement("ul");
    appsUl.className = "mode-apps";
    appsUl.dataset.modeId = mode.id;

    // loop through the apps in each mode
    for (const app of mode.apps) {
      const li = document.createElement("li");
      const label = document.createElement("span");

      li.className = "app-item";
      label.className = "app-label";

      label.textContent = `${mode.name}: ${app.name} - ${app.path || "(No path)"}`;

      const btn = document.createElement("button");

      btn.className = "path-btn";

      btn.textContent = "Set Path";
      btn.addEventListener("click", () => {
        pending = { modeId: mode.id, appId: app.id };
        picker.value = "";
        picker.click();
      });

      buttonContainer.appendChild(startBtn);
      buttonContainer.appendChild(stopBtn);
      buttonContainer.appendChild(addAppBtn);

      li.appendChild(label);
      li.appendChild(btn);
      appsUl.appendChild(li);
    }

    summary.appendChild(buttonContainer);

    details.appendChild(summary);
    details.appendChild(appsUl);
    list.appendChild(details);
  }
}

// handle file picker change
picker.addEventListener("change", (event) => {
  if (!pending || !picker.files.length) return;

  const filePath = webUtils.getPathForFile(picker.files[0]);
  const mode = data.modes[pending.modeId];
  const app = mode.apps.find((a) => a.id === pending.appId);

  if (!app) {
    console.error("No app for", pending);
    return;
  }

  app.path = filePath;
  save();
  render();
});

render();
