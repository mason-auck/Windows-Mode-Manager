const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "modes.json"), "utf-8"),
);

const list = document.getElementById("app-list");

// loop through the modes
for (const mode of Object.values(data.modes)) {
  const li = document.createElement("li");
  li.textContent = mode.name;
  list.appendChild(li);

  // loop through each mode's apps
  for (const app of mode.apps) {
    const appLi = document.createElement("li");
    appLi.textContent = `- ${app.name}`;
    list.appendChild(appLi);
  }
}
