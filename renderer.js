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

  // loop through the modes
  for (const mode of Object.values(data.modes)) {
    // loop through the apps in each mode
    for (const app of mode.apps) {
      const li = document.createElement("li");
      const label = document.createElement("span");

      label.textContent = `${mode.name}: ${app.name} - ${app.path || "(No path)"}`;

      const btn = document.createElement("button");

      btn.textContent = "Set Path";
      btn.addEventListener("click", () => {
        pending = { modeId: mode.id, appId: app.id };
        picker.value = "";
        picker.click();
      });

      li.appendChild(label);
      li.appendChild(btn);
      list.appendChild(li);
    }
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
