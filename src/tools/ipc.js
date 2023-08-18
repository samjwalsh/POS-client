import { calculateSubtotal } from "../components/PayCash.jsx";

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
    console.log(orderItem);
    return ipcRenderer.invoke("addOrder", orderItem);
  }
}

export function removeAllOrders() {
  return ipcRenderer.invoke("removeAllOrders");
}
