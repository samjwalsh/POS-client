const { ipcMain } = require("electron");

const Store = require("electron-store");
const store = new Store();

ipcMain.handle("getAllOrders", () => {
  return store.get("orders");
});

ipcMain.handle("addOrder", (e, order) => {
  console.log(order);
  const orders = store.get("orders");
  if (orders === undefined) {
    store.set("orders", [order]);
  } else {
    orders.push(order);
    store.set("orders", orders);
  }
});

ipcMain.handle("removeAllOrders", () => {
  store.set("orders", []);
});
