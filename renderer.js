const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config", "modes.json"), "utf-8"),
);

const list = document.getElementById("app-list");

// loop through the apps
for (const app of data.modes.programming.apps) {
  const li = document.createElement("li");
  li.textContent = app.name;
  list.appendChild(li);
}
