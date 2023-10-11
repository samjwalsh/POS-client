const { ipcMain } = require("electron");

const Store = require("electron-store");
const store = new Store();

ipcMain.handle("getAllOrders", () => {
  const orders = store.get("orders");
  if (orders === undefined) {
    store.set("orders", []);
  }
  return store.get("orders");
});

ipcMain.handle("addOrder", (e, order) => {
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

ipcMain.handle("removeOrder", (e, deletedOrder) => {
  let orders = store.get("orders");

  let deletedOrderLocalEntry = orders.find(
    (order) => order.time === deletedOrder.time
  );

  let deletedOrderIndex = orders.indexOf(deletedOrderLocalEntry);

  if (deletedOrderIndex > -1) {
    orders.splice(deletedOrderIndex, 1);

    store.set("orders", orders);
  }
  return store.get("orders");
});
