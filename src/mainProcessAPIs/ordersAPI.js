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
  let notDeletedOrEodOrders = [];
  orders.forEach((order) => {
    if (!order.deleted && !order.eod) {
      notDeletedOrEodOrders.push(order);
    }
  });

  return notDeletedOrEodOrders;
});

ipcMain.handle('addOrder', async (e, args) => {
  let items = args.order;
  if (items.length !== 0) {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const order = {
      id: (Date.now() + Math.random()).toString(),
      time: Date.now(),
      subtotal,
      paymentMethod: args.paymentMethod,
      shop: getSetting('Shop Name'),
      till: getSetting('Till Number'),
      deleted: false,
      eod: false,
      items,
    };

    const orders = store.get('orders');
    if (Array.isArray(orders) === false) {
      store.set('orders', [order]);
    } else {
      orders.push(order);
      store.set('orders', orders);
    }
  }
});

ipcMain.handle('removeOldOrders', () => {
  const orders = store.get('orders');
  if (!Array.isArray(orders)) {
    store.set('orders', []);
    return;
  }
  const currentDate = new Date().toLocaleDateString('en-ie');

  for (const order of orders) {
    if (currentDate !== new Date(order.time).toLocaleDateString('en-ie')) {
      order.eod = true;
    }
  }

  store.set('orders', orders);
});

ipcMain.handle('removeAllOrders', () => {
  const orders = store.get('orders');
  let completedOrders = store.get('completedOrders');
  completedOrders = completedOrders.concat(orders);
  store.set('completedOrders', completedOrders);
  store.set('orders', []);
});

ipcMain.handle('endOfDay', () => {
  const orders = store.get('orders');
  orders.forEach((order) => {
    order.eod = true;
  });
  store.set('orders', orders);
});

ipcMain.handle('removeOrder', (e, deletedOrder) => {
  let orders = store.get('orders');

  let deletedOrderLocalEntry = orders.find(
    (order) => order.id === deletedOrder.id
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
    const syncServer = getSetting('Sync Server');
    const https = getSetting('HTTPS');
    const shop = getSetting('Shop Name');
    const till = getSetting('Till Number');
    const key = getSetting('Sync Server Key');
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
    const missingOrders = res.data.missingOrders;
    const deletedOrderIds = res.data.deletedOrderIds;
    const completedEodIds = res.data.completedEodIds;

    orders = store.get('orders');

    // add the relevant orders
    missingOrders.forEach((missingOrder) => {
      orders.push(missingOrder);
    });

    // delete the relevant orders
    deletedOrderIds.forEach((deletedOrderId) => {
      orders.forEach((order) => {
        if (deletedOrderId == order.id) {
          order.deleted = true;
        }
      });
    });

    completedEodIds.forEach((completedEodId) => {
      orders.forEach((order, index) => {
        if ((order.id = completedEodId)) {
          orders.splice(index, 1);
        }
      });
    });


    orders.sort((a, b) => (a.time > b.time ? -1 : 1));

    store.set('orders', orders);

    // return {
    //   success: true,
    //   ordersToAdd: missingOrders.length,
    //   ordersToDelete: deletedOrderIds.length,
    //   ordersToEod: completedEodIds.length,
    //   ordersMissingInDb: res.data.ordersMissingInDb,
    //   ordersDeletedInDb: res.data.ordersDeletedInDb,
    //   ordersEodedInDb: res.data.eodsCompletedInDb,
    // };

    const ordersToAdd =
      missingOrders.length !== undefined ? missingOrders.length : 0;
    const ordersToDelete =
      deletedOrderIds.length !== undefined ? deletedOrderIds.length : 0;
    const ordersToEod =
      completedEodIds.length !== undefined ? completedEodIds.length : 0;
    const ordersMissingInDb =
      res.data.ordersMissingInDb !== undefined ? res.data.ordersMissingInDb : 0;
    const ordersDeletedInDb =
      res.data.ordersDeletedInDb !== undefined ? res.data.ordersDeletedInDb : 0;
    const ordersEodedInDb =
      res.data.eodsCompletedInDb !== undefined ? res.data.eodsCompletedInDb : 0;

    return {
      success: true,
      ordersToAdd,
      ordersToDelete,
      ordersToEod,
      ordersMissingInDb,
      ordersDeletedInDb,
      ordersEodedInDb,
    };


  } catch (e) {
    console.log(e);
    return {
      success: false,
      ordersToAdd: 0,
      ordersToDelete: 0,
      ordersToEod: 0,
      ordersMissingInDb: 0,
      ordersDeletedInDb: 0,
      ordersEodedInDb: 0,
    };
  }
});
