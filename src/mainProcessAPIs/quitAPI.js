const { ipcMain, app } = require("electron");

ipcMain.on("quit", () => {
  app.quit();
});
