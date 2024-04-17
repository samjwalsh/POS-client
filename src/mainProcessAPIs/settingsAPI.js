const { ipcMain, app } = require('electron');

const Store = require('electron-store');
const { settingsSchema } = require('../assets/settingsSchema');
const store = new Store();

(() => {
  let settings = store.get('settings');
  if (!settings) store.set('settings', settingsSchema);
  let newSettings = settingsSchema;
  newSettings.forEach((category) => {
    category.settings.forEach((setting) => {
      const localValue = getSetting(setting.name);
      if (localValue !== '') setting.value = localValue;
    });
  });
  store.set('settings', newSettings);
})();

ipcMain.handle('getSettings', () => {
  let settings = store.get('settings');
  if (Array.isArray(settings) != true) {
    settings = settingsSchema;
    store.set('settings', settings);
  }
  return settings;
});

ipcMain.handle('getSetting', (e, settingName) => {
  return getSetting(settingName);
});

ipcMain.handle('setSetting', (e, settingName, value) => {
  const settings = store.get('settings');

  for (const category of settings) {
    for (const setting of category.settings) {
      if (setting.name === settingName) {
        setting.value = value;
        store.set('settings', settings);
        break;
      }
    }
  }
});

export function getSetting(settingName) {
  let foundSetting = '';
  const settings = store.get('settings');
  settings.forEach((localCategory) => {
    localCategory.settings.forEach((localSetting) => {
      if (localSetting.name == settingName) {
        foundSetting = localSetting.value;
      }
    });
  });
  return foundSetting;
}

ipcMain.handle('updateSettings', (e, newSettings) => {
  store.set('settings', newSettings);
});

ipcMain.handle('resetSettings', () => {
  store.set('settings', settingsSchema);
});

ipcMain.handle('getVersionNo', () => {
  return app.getVersion();
});

ipcMain.handle('deleteLocalData', () => {
  store.set('orders', []);
});
