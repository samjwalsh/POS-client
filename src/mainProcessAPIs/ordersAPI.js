const { ipcMain, ipcRenderer } = require('electron');

const axios = require('axios');
const Store = require('electron-store');
const store = new Store();
import { getSetting } from './settingsAPI';

(() => {
  const completedOrders = store.get('completedOrders');
  if (Array.isArray(completedOrders) === false) {
    store.set('completedOrders', []);
  }
})();

ipcMain.handle('getAllOrders', () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
  let notDeletedOrders = [];
  orders.forEach((order) => {
    if (!order.deleted) {
      notDeletedOrders.push(order);
    }
  });
  return notDeletedOrders;
});

ipcMain.handle('addOrder', (e, order) => {
  const orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', [order]);
  } else {
    orders.push(order);
    console.log(order.items[0].addons);
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
    orders[deletedOrderIndex].deleted = true;
    store.set('orders', orders);
  }
  return store.get('orders');
});

ipcMain.handle('syncOrders', async () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
  try {
    const syncServer = await getSetting('Sync Server');
    const https = await getSetting('HTTPS');
    const shop = await getSetting('Shop Name');
    const till = await getSetting('Till Number');
    const key = await getSetting('Sync Server Key');
    const data = {
      shop,
      till,
      key,
      orders,
    };

    let res = await axios({
      method: 'get',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/syncOrders`,
      headers: {},
      data,
    });
    console.log(res.data);
    const missingOrders = res.data.missingOrders;
    const deletedOrders = res.data.deletedOrders;

    // delete the relevant orders
    deletedOrders.forEach((deletedOrder) => {
      orders.forEach((order) => {
        if (deletedOrder.time == order.time) {
          order.deleted = true;
        }
      });
    });

    // add the relevant orders
    missingOrders.forEach((missingOrder) => {
      orders.push(missingOrder);
    });

    store.set('orders', orders);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
});
