// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

window.ipcRenderer = require('electron').ipcRenderer;
window.app = require("electron").app;
