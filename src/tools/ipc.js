const ipcRenderer = window.ipcRenderer;

export function quit() {
  ipcRenderer.send("quit");
}