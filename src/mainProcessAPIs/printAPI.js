const { ipcMain } = require('electron');

ipcMain.handle('printOrder', (e, order) => {
  let receiptHTML = ``;
});
