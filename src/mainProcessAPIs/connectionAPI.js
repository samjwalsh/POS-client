const { ipcMain } = require('electron');
import axios from 'axios';
const find = require('local-devices');
const checkInternetConnected = require('check-internet-connected');

const config = {
  timeout: 5000, //timeout connecting to each server, each try
  retries: 0, //number of retries to do before failing
  domain: 'https://ipv4.icanhazip.com/', //the domain to check DNS record of
};
checkInternetConnected(config);

ipcMain.handle('checkConnection', async () => {
  const connected = await checkInternetConnected()
    .then((result) => {
      return true;
    })
    .catch((ex) => {
      return false;
    });
  return connected;
});

ipcMain.handle('checkForPeers', async () => {
  let devices = await find({ skipNameResolution: true });

  devices.forEach(async (device) => {
    const options = {
      url: `http://${device.ip}:24205/discover`,
      method: 'GET',
    };

    axios(options)
      .then((response) => {
        console.log(response);
        console.log(response.status);
      })
      .catch((e) => {});
  });
});
