const { ipcMain, ipcRenderer } = require('electron');

import { getSetting } from './settingsAPI';
import { log } from './loggingAPI';

const axios = require('axios');
const Store = require('electron-store');
const store = new Store();

ipcMain.handle('createVouchers', async (e, quantity, value) => {
  try {
    if (quantity * value === 0) return { success: false };
    const syncServer = getSetting('Sync Server');
    const https = getSetting('HTTPS');
    const shop = getSetting('Shop Name');
    const till = getSetting('Till Number');
    const key = getSetting('Sync Server Key');

    const data = {
      shop,
      till,
      value,
      quantity,
      key,
    };

    let res = await axios({
      method: 'get',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/createVoucher`,
      headers: {},
      data,
      timeout: 30000,
    });
    const vouchers = res.data;
    return { vouchers, success: true };
  } catch (e) {
    log(JSON.stringify(e), 'Error while creating vouchers', [quantity, value]);
    return {
      success: false,
      message: 'Sorry, something went wrong',
      vouchers: [],
    };
  }
});

ipcMain.handle('redeemVoucher', async (e, voucherCode) => {
  try {
    const syncServer = getSetting('Sync Server');
    const https = getSetting('HTTPS');
    const shop = getSetting('Shop Name');
    const till = getSetting('Till Number');
    const key = getSetting('Sync Server Key');

    const data = {
      shop,
      till,
      code: voucherCode,
      key,
    };

    let res = await axios({
      method: 'get',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/redeemVoucher`,
      headers: {},
      data,
      timeout: 30000,
    });

    const voucherResult = res.data;
    return voucherResult;
  } catch (e) {
    log(JSON.stringify(e), 'Error while redeeming vouchers', [voucherCode]);
    return {
      success: false,
      error: true,
    };
  }
});

ipcMain.handle('checkVoucher', async (e, voucherCode) => {
  try {
    const syncServer = getSetting('Sync Server');
    const https = getSetting('HTTPS');
    const shop = getSetting('Shop Name');
    const till = getSetting('Till Number');
    const key = getSetting('Sync Server Key');

    const data = {
      shop,
      till,
      code: voucherCode,
      key,
    };

    let res = await axios({
      method: 'get',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/checkVoucher`,
      headers: {},
      data,
      timeout: 30000,
    });

    const voucherResult = res.data;
    return voucherResult;
  } catch (e) {
    log(JSON.stringify(e), 'Error while checking vouchers', [voucherCode]);
    return {
      success: false,
    };
  }
});
