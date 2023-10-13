const { ipcMain } = require("electron");

const Store = require("electron-store");
const { settingsSchema } = require("../assets/settingsSchema");
const settingsStore = new Store();

// add code here to check that all the settings match the newest schema, it will run once on startup


ipcMain.handle("getSettings", () => {
  let settings = settingsStore.get("settings");
  if (Array.isArray(settings) != true) {
    settings = settingsSchema;
    settingsStore.set("settings", settings);
  }
  return settings;
});

ipcMain.handle("updateSettings", (e, newSettings) => {
  settingsStore.set("settings", newSettings);
});

ipcMain.handle("resetSettings", () => {
  settingsStore.set('settings', settingsSchema)
})
