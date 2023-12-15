import { ipcMain } from 'electron';
import express from 'express';
const asyncHandler = require('express-async-handler');
const Store = require('electron-store');

const settingsStore = new Store();

const app = express();
const port = 24205;

app.get('/discover', (req, res) => {
  let shopName = '';
  let tillNo = '';
  const settings = settingsStore.get('settings');
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      switch (setting.name) {
        case 'Shop Name': {
          shopName = setting.value;
          break;
        }
        case 'Till Number': {
          tillNo = setting.value;
          break;
        }
      }
    });
  });
  res.send(shopName + '-' + tillNo);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
