const { ipcMain } = require('electron');

const Store = require('electron-store');
const store = new Store();

(() => {
  const completedOrders = store.get('completedOrders');
  if (Array.isArray(completedOrders) === false) {
    store.set('completedOrders', []);
    console.log('ran');
  }
})();

ipcMain.handle('getAllOrders', () => {
  const orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
  }
  return store.get('orders');
});

ipcMain.handle('addOrder', (e, order) => {
  const orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', [order]);
  } else {
    orders.push(order);
    store.set('orders', orders);
  }
});

ipcMain.handle('removeOldOrders', (e, orders) => {
  let localOrders = store.get('orders');
  const currentDate = new Date().getDate();
  let newOrders = [];
  let oldOrders = [];

  if (Array.isArray(localOrders)) {
    localOrders.forEach((order, index) => {
      const orderDate = new Date(order.time).getDate();
      if (orderDate == currentDate) {
        newOrders.push(order);
      } else {
        oldOrders.push(order);
      }
    });
  }

  store.set('orders', newOrders);

  let completedOrders;
  if (store.get('completedOrders') === undefined) {
    completedOrders = [];
  } else {
    completedOrders = store.get('completedOrders');
  }

  completedOrders = completedOrders.concat(oldOrders);
  store.set('completedOrders', completedOrders);
});

ipcMain.handle('removeAllOrders', () => {
  const orders = store.get('orders');
  let completedOrders = store.get('completedOrders');
  completedOrders = completedOrders.concat(orders);
  store.set('completedOrders', completedOrders);
  store.set('orders', []);
});

ipcMain.handle('removeOrder', (e, deletedOrder) => {
  let orders = store.get('orders');

  let deletedOrderLocalEntry = orders.find(
    (order) => order.time === deletedOrder.time
  );

  let deletedOrderIndex = orders.indexOf(deletedOrderLocalEntry);

  if (deletedOrderIndex > -1) {
    orders.splice(deletedOrderIndex, 1);

    store.set('orders', orders);
  }
  return store.get('orders');
w});
