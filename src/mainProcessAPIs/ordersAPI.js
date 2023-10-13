const { ipcMain } = require("electron");

const Store = require("electron-store");
const ordersStore = new Store();

ipcMain.handle("getAllOrders", () => {
  const orders = ordersStore.get("orders");
  if (Array.isArray(orders) === false) {
    ordersStore.set("orders", []);
  }
  return ordersStore.get("orders");
});

ipcMain.handle("addOrder", (e, order) => {
  const orders = ordersStore.get("orders");
  if (Array.isArray(orders) === false) {
    ordersStore.set("orders", [order]);
  } else {
    orders.push(order);
    ordersStore.set("orders", orders);
  }
});

ipcMain.handle("overwriteOrders", (e, orders) => {
  ordersStore.set("orders", orders);
});

ipcMain.handle("removeAllOrders", () => {
  ordersStore.set("orders", []);
});

ipcMain.handle("removeOrder", (e, deletedOrder) => {
  let orders = ordersStore.get("orders");

  let deletedOrderLocalEntry = orders.find(
    (order) => order.time === deletedOrder.time
  );

  let deletedOrderIndex = orders.indexOf(deletedOrderLocalEntry);

  if (deletedOrderIndex > -1) {
    orders.splice(deletedOrderIndex, 1);

    ordersStore.set("orders", orders);
  }
  return ordersStore.get("orders");
});
