const ipcRenderer = window.ipcRenderer;

export function quit() {
  ipcRenderer.send('quit');
}

export function getAllOrders() {
  return ipcRenderer.invoke('getAllOrders');
}

export function getOrderStats() {
  return ipcRenderer.invoke('getOrderStats');
}

export function getRollingRevenue() {
  return ipcRenderer.invoke('getRollingRevenue');
}

export async function addOrder(order, paymentMethod) {
  return ipcRenderer.invoke('addOrder', order, paymentMethod);
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

export function swapPaymentMethod(order) {
  return ipcRenderer.invoke('swapPaymentMethod', order);
}

export function getSettings() {
  return ipcRenderer.invoke('getSettings');
}

export function getSetting(settingName) {
  return ipcRenderer.invoke('getSetting', settingName);
}

export function setSetting(settingName, value) {
  return ipcRenderer.invoke('setSetting', settingName, value);
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

export function openCashDrawer() {
  return ipcRenderer.invoke('openCashDrawer');
}

export function getAllPrinters() {
  return ipcRenderer.invoke('getAllPrinters');
}

export function printVouchers(vouchers) {
  return ipcRenderer.invoke('printVouchers', vouchers);
}

export function checkPrinterConnection() {
  return ipcRenderer.invoke('checkPrinterConnection');
}

export function syncOrders() {
  return ipcRenderer.invoke('syncOrders');
}

export function createVouchers(quantity, value) {
  return ipcRenderer.invoke('createVouchers', quantity, value);
}

export function redeemVoucher(voucherCode) {
  return ipcRenderer.invoke('redeemVoucher', voucherCode);
}

export function checkVoucher(voucherCode) {
  return ipcRenderer.invoke('checkVoucher', voucherCode);
}

export async function log(errMsg, note, objsOfInterest) {
  return ipcRenderer.invoke('log', errMsg, note, objsOfInterest);
}

export async function reconcile(trueCard, trueCash) {
  return ipcRenderer.invoke('reconcile', trueCard, trueCash);
}
