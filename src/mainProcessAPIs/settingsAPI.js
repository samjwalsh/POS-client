const { ipcMain, app } = require('electron');

const Store = require('electron-store');
const { settingsSchema } = require('../assets/settingsSchema');
const store = new Store();

// add code here to check that all the settings match the newest schema, it will run once on startup
(() => {
  let localSettings = store.get('settings');
  let newSettings = settingsSchema;
  settingsSchema.forEach((category, categoryIndex) => {
    if (categoryIndex + 1 <= localSettings.length) {
      if (category.name !== localSettings[categoryIndex].name) {
        store.set('settings', newSettings);
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
  let settings = store.get('settings');
  if (Array.isArray(settings) != true) {
    settings = settingsSchema;
    store.set('settings', settings);
  }
  return settings;
});

ipcMain.handle('getSetting', (e, settingName) => {
  let foundValue;
  const settings = store.get('settings');
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      if (setting.name == settingName) {
        foundValue = setting.value;
      }
    });
  });
  return foundValue;
});

ipcMain.handle('setSetting', (e, settingName, value) => {
  const settings = store.get('settings');

  for (const category of settings) {
    for (const setting of category.settings) {
      if (setting.name === settingName) {
        setting.value = value;
        store.set('settings', settings)
        break;
      }
    }
  }
});

export const getSetting = (setting) => {
  let foundSetting = '';
  const settings = store.get('settings');
  settings.forEach((localCategory) => {
    localCategory.settings.forEach((localSetting) => {
      if (localSetting.name == setting) {
        foundSetting = localSetting.value;
      }
    });
  });
  return foundSetting;
};

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
  store.set('settings', settingsSchema);
  store.set('orders', []);
});
