const ipcRenderer = window.ipcRenderer;

export function quit() {
  ipcRenderer.send('quit');
}

export function getAllOrders() {
  return ipcRenderer.invoke('getAllOrders');
}

export async function addOrder(order, paymentMethod) {
  return ipcRenderer.invoke('addOrder', { order, paymentMethod });
}

export function removeOldOrders(orders) {
  return ipcRenderer.invoke('removeOldOrders', orders);
}

export function removeAllOrders() {
  return ipcRenderer.invoke('removeAllOrders');
}

export function endOfDay() {
  return ipcRenderer.invoke('endOfDay');
}

export function removeOrder(order) {
  return ipcRenderer.invoke('removeOrder', order);
}

export function getSettings() {
  return ipcRenderer.invoke('getSettings');
}

export function getSetting(settingName) {
  return ipcRenderer.invoke('getSetting', settingName);
}

export function setSetting(settingName, value) {
  return ipcRenderer.invoke('setSetting', settingName, value)
}

export function updateSettings(newSettings) {
  return ipcRenderer.invoke('updateSettings', newSettings);
}

export function resetSettings() {
  return ipcRenderer.invoke('resetSettings');
}

export function getVersionNo() {
  return ipcRenderer.invoke('getVersionNo');
}

export function deleteLocalData() {
  return ipcRenderer.invoke('deleteLocalData');
}

export function checkConnection() {
  return ipcRenderer.invoke('checkConnection');
}

export function printOrder(order) {
  return ipcRenderer.invoke('printOrder', order);
}

export function printEndOfDay(orders) {
  return ipcRenderer.invoke('printEndOfDay', orders);
}

export function printTestPage() {
  return ipcRenderer.invoke('printTestPage');
}

export function getAllPrinters() {
  return ipcRenderer.invoke('getAllPrinters');
}

export function checkPrinterConnection() {
  return ipcRenderer.invoke('checkPrinterConnection');
}

export function syncOrders() {
  return ipcRenderer.invoke('syncOrders');
}

export function createVouchers(quantity, value) {
  return ipcRenderer.invoke('createVouchers', quantity, value)
}
