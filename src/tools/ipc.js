import { calculateSubtotal } from "../components/Register/PayCash.jsx";

const ipcRenderer = window.ipcRenderer;

export function quit() {
  ipcRenderer.send("quit");
}

export function getAllOrders() {
  return ipcRenderer.invoke("getAllOrders");
}

export function addOrder(order, paymentMethod) {
  if (order.length !== 0) {
    const orderItem = {
      paymentMethod,
      time: Date.now(),
      subtotal: calculateSubtotal(order),
      items: order,
    };
    return ipcRenderer.invoke("addOrder", orderItem);
  }
}

export function overwriteOrders(orders) {
  return ipcRenderer.invoke("overwriteOrders", orders);
}

export function removeAllOrders() {
  return ipcRenderer.invoke("removeAllOrders");
}

export function removeOrder(order) {
  return ipcRenderer.invoke("removeOrder", order);
}

export function getSettings() {
  return ipcRenderer.invoke("getSettings");
}

export function updateSettings(newSettings) {
  return ipcRenderer.invoke("updateSettings", newSettings);
}

export function resetSettings() {
  return ipcRenderer.invoke('resetSettings');
}
