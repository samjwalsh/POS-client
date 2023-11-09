const { ipcMain } = require('electron');

const Store = require('electron-store');
const ordersStore = new Store();
const finalOrders = new Store();

(() => {
  const oldOrders = finalOrders.get('finalOrders');
  if (Array.isArray(oldOrders) === false) {
    finalOrders.set('finalOrders', []);
  }
})();

ipcMain.handle('getAllOrders', () => {
  const orders = ordersStore.get('orders');
  if (Array.isArray(orders) === false) {
    ordersStore.set('orders', []);
  }
  return ordersStore.get('orders');
});

ipcMain.handle('addOrder', (e, order) => {
  const orders = ordersStore.get('orders');
  if (Array.isArray(orders) === false) {
    ordersStore.set('orders', [order]);
  } else {
    orders.push(order);
    ordersStore.set('orders', orders);
  }
});

ipcMain.handle('removeOldOrders', (e, orders) => {
  let localOrders = ordersStore.get('orders');
  const currentDate = new Date().getDate();
  let newOrders = [];
  let oldOrders = [];

  if (Array.isArray(localOrders)) {
    localOrders.forEach((order, index) => {
      const orderDate = new Date(order.times).getDate();
      if (orderDate == currentDate) {
        newOrders.push(order);
      } else {
        oldOrders.push(order);
      }
    });
  }

  ordersStore.set('orders', orders);
//TODO save final orders, figure out desired format for saving
});

ipcMain.handle('removeAllOrders', () => {
  ordersStore.set('orders', []);
});

ipcMain.handle('removeOrder', (e, deletedOrder) => {
  let orders = ordersStore.get('orders');

  let deletedOrderLocalEntry = orders.find(
    (order) => order.time === deletedOrder.time
  );

  let deletedOrderIndex = orders.indexOf(deletedOrderLocalEntry);

  if (deletedOrderIndex > -1) {
    orders.splice(deletedOrderIndex, 1);

    ordersStore.set('orders', orders);
  }
  return ordersStore.get('orders');
});
