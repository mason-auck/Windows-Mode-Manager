const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config", "modes.json");
const data = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const list = document.getElementById("app-list");
const picker = document.getElementById("file-picker");

let pending = null;

function save() {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), "utf-8");
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

    const title = document.createElement("span");
    title.textContent = mode.name;

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
    });

    stopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    const appsUl = document.createElement("ul");
    appsUl.className = "mode-apps";

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

      li.appendChild(label);
      li.appendChild(btn);
      appsUl.appendChild(li);
    }

    summary.appendChild(title);
    summary.appendChild(startBtn);
    summary.appendChild(stopBtn);

    details.appendChild(summary);
    details.appendChild(appsUl);
    list.appendChild(details);
  }
}

picker.addEventListener("change", (event) => {
  if (!pending || !picker.files.length) return;

  const filePath = picker.files[0].path;
  const mode = data.modes[pending.modeId];
  const app = mode.apps.find((a) => a.id === pending.appId);

  app.path = filePath;
  save();
  render();
});

render();
