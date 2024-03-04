const { ipcMain } = require('electron');

const axios = require('axios');
const Store = require('electron-store');
const store = new Store();
import { log } from './loggingAPI';
import { getSetting } from './settingsAPI';

ipcMain.handle('getAllOrders', () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
  const notDeletedOrEodOrders = [];

  let currOrder = 0,
    ordersLength = orders.length;
  const shop = getSetting('Shop Name');
  let loop = 0;
  while (currOrder < ordersLength) {
    const order = orders[currOrder];
    currOrder++;
    loop++;
    if (notDeletedOrEodOrders.length >= 50) currOrder = ordersLength;
    if (order.deleted || order.eod || order.shop !== shop) continue;
    notDeletedOrEodOrders.push(order);
  }
  return notDeletedOrEodOrders;
});

export const getOrderStats = () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }

  let cashTotal = 0;
  let cardTotal = 0;
  let quantityOrders = 0;
  let quantityItems = 0;
  let rollingRevenue = 0;

  const shop = getSetting('Shop Name');

  const hourCutoff = new Date(Date.now() - 60 * 60 * 1000);

  let currOrder = 0,
    ordersLength = orders.length;

  let underRRCutoff = true;

  while (currOrder < ordersLength) {
    const order = orders[currOrder];
    currOrder++;
    if (order.deleted || order.eod || order.shop !== shop) continue;

    if (order.paymentMethod === 'Card') {
      cardTotal += order.subtotal;
    } else {
      cashTotal += order.subtotal;
    }

    quantityOrders++;

    if (underRRCutoff) {
      if (new Date(order.time) > hourCutoff) {
        const delay = Date.now() - new Date(order.time);
        const weight = (-2 * delay) / (60 * 60 * 1000) + 2;
        rollingRevenue += weight * order.subtotal;
      }
    } else {
      underRRCutoff = false;
      // This stops the expensive check of dates once an order outside of the date range is reached
    }


    var currItem = 0,
      itemsLength = order.items.length;
    while (currItem < itemsLength) {
      const item = order.items[currItem];
      currItem++;
      if (item.quantity !== undefined) {
        quantityItems += item.quantity;
      } else {
        quantityItems++;
        log(
          'Item with no quantity detected',
          'Error while getting order stats',
          order
        );
      }
    }
  }

  const xTotal = cashTotal + cardTotal;
  const averageSale = xTotal / (quantityOrders == 0 ? 1 : quantityOrders);

  return {
    cashTotal,
    cardTotal,
    quantityItems,
    quantityOrders,
    averageSale,
    xTotal,
    rollingRevenue,
  };
};

ipcMain.handle('getRollingRevenue', () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
  let quantityOrders = 0;
  let rollingRevenue = 0;

  const shop = getSetting('Shop Name');

  const hourCutoff = new Date(Date.now() - 60 * 60 * 1000);

  let currOrder = 0,
    ordersLength = orders.length;

  while (currOrder < ordersLength) {
    const order = orders[currOrder];
    currOrder++;
    if (order.deleted || order.eod || order.shop !== shop) continue;
    quantityOrders++;

    if (new Date(order.time) > hourCutoff) {
      const delay = Date.now() - new Date(order.time);
      const weight = (-2 * delay) / (60 * 60 * 1000) + 2;
      rollingRevenue += weight * order.subtotal;
    } else break;
  }

  return rollingRevenue;
});

ipcMain.handle('getOrderStats', () => {
  return getOrderStats();
});

export const generateID = () => {
  return (Date.now() + Math.random()).toString();
};

ipcMain.handle('addOrder', async (e, args) => {
  try {
    let items = args.order;
    if (!Array.isArray(items)) {
      items = [];
    }
    if (items.length === 0) return;
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    subtotal = parseFloat(subtotal.toFixed(2));

    const order = {
      id: generateID(),
      time: new Date(),
      subtotal,
      paymentMethod: args.paymentMethod,
      shop: getSetting('Shop Name'),
      till: getSetting('Till Number'),
      deleted: false,
      eod: false,
      items,
    };

    const orders = store.get('orders');
    if (Array.isArray(orders)) {
      orders.unshift(order);
      store.set('orders', orders);
    } else {
      store.set('orders', [order]);
    }
  } catch (e) {
    log(JSON.stringify(e), 'Error while adding order', [args]);
  }
});

ipcMain.handle('removeOldOrders', () => {
  const orders = store.get('orders');
  if (!Array.isArray(orders)) {
    store.set('orders', []);
    return;
  }

  // get current time for UTC timezone
  const d = new Date();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  // set time to begin day UTC
  const currentDate = Date.UTC(year, month, day, 0, 0, 0, 0);

  for (const order of orders) {
    let orderDate = order.time;
    if (!(order.time instanceof Date)) {
      // Just to make sure the order.time is a date object
      orderDate = new Date(order.time);
    }

    if (currentDate > orderDate) {
      order.eod = true;
    }
  }

  store.set('orders', orders);
});

ipcMain.handle('removeAllOrders', () => {
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
  removeOrder(deletedOrder);
});

export const removeOrder = (deletedOrder) => {
  const orders = store.get('orders');

  let deletedOrderIndex = findOrderIndex(deletedOrder.id);

  if (deletedOrderIndex > -1) {
    orders[deletedOrderIndex].deleted = true;
    store.set('orders', orders);
  }
  return;
};

export const findOrderIndex = (id) => {
  const orders = store.get('orders');

  const deletedOrderLocalEntry = orders.find((order) => order.id === id);

  const deletedOrderIndex = orders.indexOf(deletedOrderLocalEntry);

  return deletedOrderIndex;
};

ipcMain.handle('swapPaymentMethod', (e, order) => {
  let orders = store.get('orders');
  const index = findOrderIndex(order.id);
  removeOrder(orders[index]);
  if (order.paymentMethod === 'Cash') {
    order.paymentMethod = 'Card';
  } else {
    order.paymentMethod = 'Cash';
  }
  if (order._id) delete order._id;
  order.id = generateID();
  // Need to get orders again because the current copy in memory does not have the deleted order in it;
  orders = store.get('orders');
  orders.splice(index, 0, order);
  store.set('orders', orders);
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
      timeout: 30000,
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
        if (order.id === completedEodId) {
          orders.splice(index, 1);
        }
      });
    });

    const uniqueOrders = orders.filter(
      (order, index) =>
        orders.findIndex((currentOrder) => currentOrder.id === order.id) ===
        index
    );
    uniqueOrders.sort((a, b) => (a.time > b.time ? -1 : 1));

    store.set('orders', uniqueOrders);

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
    log(JSON.stringify(e), 'Error while syncing orders', [orders]);
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
