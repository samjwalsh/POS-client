const { ipcMain } = require("electron");

const Store = require("electron-store");
const settingsStore = new Store();

// add code here to check that all the settings match the newest schema, it will run once on startup

//settingsStore.set('settings', '');

ipcMain.handle("getSettings", () => {
  let settings = settingsStore.get("settings");
  if (Array.isArray(settings) != true) {
    settings = [
      {
        name: "Display",
        settings: [
          {
            name: "Zoom Factor",
            type: "range",
            value: 16,
            min: 14,
            max: 24,
            step: 2,
            default: 16,

          },
        ],
      },
    ];
    settingsStore.set("settings", settings);
  }
  return settings;
});

ipcMain.handle("updateSettings", (e, newSettings) => {
  settingsStore.set("settings", newSettings);
});
