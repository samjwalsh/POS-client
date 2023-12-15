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

  const requests = devices.map((device) => {
    return { url: `http://${device.ip}:24205/discover`, mac: device.mac };
  });

  let responses = requests.map(async (request) => {
    try {
      let response = await axios({
        method: 'get',
        url: request.url,
        json: true,
      });
      return response.data;
    } catch (err) {
      return '';
    }
  });
  const detectedDevices = [];

  await Promise.all(responses)
    .then((values) => {
      // values is an array of the resolved values
      values.forEach((response, index) => {
        if (response !== '') {
          detectedDevices.push(devices[index].mac);
        }
      });
      console.log(detectedDevices);
    })
    .catch((error) => {
      // This catch block will not be executed
    });
  return detectedDevices;
});
