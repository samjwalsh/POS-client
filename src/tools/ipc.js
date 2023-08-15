const ipcRenderer = window.ipcRenderer;

export function playBeep() {
  ipcRenderer.send("playBeep");
}

export function quit() {
  ipcRenderer.send("quit");
}