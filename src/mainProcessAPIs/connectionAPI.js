const { ipcMain } = require('electron');

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
