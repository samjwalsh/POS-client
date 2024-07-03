import { ipcMain } from 'electron';
import { getSetting } from './settingsAPI';
import axios from 'axios';

ipcMain.handle('log', async (e, errMsg, note, objsOfInterest) => {
  log(errMsg, note, objsOfInterest);
});

export const log = async (errMsg, note, objsOfInterest) => {
  const syncServer = getSetting('Sync Server');
  const https = getSetting('HTTPS');
  const shop = getSetting('Shop Name');
  const till = getSetting('Till Number');

  try {
    const data = {
      shop,
      till,
      note,
      objsOfInterest,
      errMsg,
    };
    if (errMsg.includes('timeout') || errMsg.includes('ETIMEDOUT')) {
      // Stops the huge quantity of timeout errors on dev when testing server functions
      data.objsOfInterest = [];
      data.errMsg = 'Server connection timed out, check pos-server for error?';
    }

    let res = await axios({
      method: 'get',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/sendLog`,
      headers: {key},
      data,
      timeout: 30000,
    });
    console.log(note);
  } catch (e) {
    console.log('Error while sending log for ' + note);
  }
};
