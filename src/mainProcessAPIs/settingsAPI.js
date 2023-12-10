const { ipcMain, app } = require('electron');

const Store = require('electron-store');
const { settingsSchema } = require('../assets/settingsSchema');
const settingsStore = new Store();

// add code here to check that all the settings match the newest schema, it will run once on startup
(() => {
  let localSettings = settingsStore.get('settings');
  let newSettings = settingsSchema;
  settingsSchema.forEach((category, categoryIndex) => {
    if (categoryIndex + 1 <= localSettings.length) {
      if (category.name !== localSettings[categoryIndex].name) {
        settingsStore.set('settings', newSettings);
        return;
      }
    } else {
      localSettings.push(category);
    }

    category.settings.forEach((setting, settingIndex) => {
      if (settingIndex + 1 <= localSettings[categoryIndex]) {
        // Code to check if individual settings match the schema
      } else {
        localSettings[categoryIndex].settings.push(setting);
      }
    });
  });
})();

ipcMain.handle('getSettings', () => {
  let settings = settingsStore.get('settings');
  if (Array.isArray(settings) != true) {
    settings = settingsSchema;
    settingsStore.set('settings', settings);
  }
  return settings;
});

ipcMain.handle('updateSettings', (e, newSettings) => {
  settingsStore.set('settings', newSettings);
});

ipcMain.handle('resetSettings', () => {
  settingsStore.set('settings', settingsSchema);
});

ipcMain.handle('getVersionNo', () => {
  return app.getVersion();
});

ipcMain.handle('deleteLocalData', () => {
  settingsStore.set('settings', settingsSchema);
  settingsStore.set('orders', []);
});
