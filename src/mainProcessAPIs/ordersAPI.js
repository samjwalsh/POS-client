const { ipcMain } = require('electron');

const axios = require('axios');
const Store = require('electron-store');
const store = new Store();
import { log } from './loggingAPI';
import { getSetting } from './settingsAPI';

(() => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
})();

ipcMain.handle('getAllOrders', () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }
  const notDeletedOrEodOrders = [];

  let currOrder = orders.length - 1;
  const shop = getSetting('Shop Name');
  while (currOrder >= 0) {
    const order = orders[currOrder];
    currOrder--;
    if (
      order.deleted ||
      order.eod ||
      order.shop !== shop ||
      order.items[0].name == 'Reconcilliation Balance Adjustment'
    )
      continue;

    notDeletedOrEodOrders.push(order);
    if (notDeletedOrEodOrders.length >= 50) break;
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
  // let rollingRevenue = 0;
  let reconcilledCard = 0;
  let reconcilledCash = 0;
  let mostRecentReconcilliation = new Date(0);

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

    if (order.items[0].name == 'Reconcilliation Balance Adjustment') {
      if (order.paymentMethod === 'Card') {
        reconcilledCard += order.subtotal;
      } else {
        reconcilledCash += order.subtotal;
      }
      if (new Date(order.time) > mostRecentReconcilliation)
        mostRecentReconcilliation = new Date(order.time);
      continue;
    }

    quantityOrders++;

    // if (underRRCutoff) {
    //   if (new Date(order.time) > hourCutoff) {
    //     const delay = Date.now() - new Date(order.time);
    //     const weight = (-2 * delay) / (60 * 60 * 1000) + 2;
    //     rollingRevenue += weight * order.subtotal;
    //   } else {
    //     underRRCutoff = false;
    //     // This stops the expensive check of dates once an order outside of the date range is reached
    //   }
    // }

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
  const averageSale =
    (xTotal - reconcilledCard - reconcilledCash) /
    (quantityOrders == 0 ? 1 : quantityOrders);

  return {
    cashTotal,
    cardTotal,
    quantityItems,
    quantityOrders,
    averageSale,
    xTotal,
    // rollingRevenue,
    reconcilledCard,
    reconcilledCash,
    mostRecentReconcilliation,
  };
};

ipcMain.handle('getRollingRevenue', () => {
  let orders = store.get('orders');

  let quantityOrders = 0;
  let rollingRevenue = 0;

  const shop = getSetting('Shop Name');

  const hourCutoff = new Date(new Date() - 60 * 60 * 1000);

  let currOrder = orders.length - 1;

  while (currOrder >= 0) {
    const order = orders[currOrder];
    currOrder--;
    if (
      order.deleted ||
      order.eod ||
      order.shop !== shop ||
      order.items[0].name == 'Reconcilliation Balance Adjustment'
    )
      continue;
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
  const date = Date.now().toString();
  const shop = getSetting('Shop Name');
  const shopAsNum = shop
    .charCodeAt(0)
    .toString()
    .concat(shop.charCodeAt(1).toString());
  const till = getSetting('Till Number').toString();
  const random = Math.random().toString().substring(2, 5);
  const id = date
    .concat('.')
    .concat(shopAsNum)
    .concat('.')
    .concat(till)
    .concat('.')
    .concat(random);
  return id;
};

export const refreshID = (id) => {
  console.log(id);
  const parts = id.split('.');
  parts[3] = Math.random().toString().substring(2, 5);
  const newID = parts.join('.');
  return newID;
};

ipcMain.handle('addOrder', (e, items, paymentMethod) => {
  addOrder(items, paymentMethod);
});

const addOrder = (items, paymentMethod) => {
  try {
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
      paymentMethod,
      shop: getSetting('Shop Name'),
      till: getSetting('Till Number'),
      deleted: false,
      eod: false,
      items,
    };

    const orders = store.get('orders');
    if (Array.isArray(orders)) {
      orders.push(order);
      store.set('orders', orders);
    } else {
      store.set('orders', [order]);
    }
  } catch (e) {
    log(JSON.stringify(e), 'Error while adding order', [args]);
  }
};

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

  let orderIndex = 0;
  const ordersLength = orders.length;
  while (orderIndex < ordersLength) {
    const order = orders[orderIndex];
    orderIndex++;

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
  let orderIndex = 0;
  const ordersLength = orders.length;
  while (orderIndex < ordersLength) {
    orders[orderIndex].eod = true;
    orderIndex++;
  }
  store.set('orders', orders);
});

ipcMain.handle('removeOrder', (e, deletedOrder) => {
  removeOrder(deletedOrder);
});

export const removeOrder = (deletedOrder) => {
  let deletedOrderIndex = findOrderIndex(deletedOrder.id);

  if (deletedOrderIndex > -1) {
    const orders = store.get('orders');
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

ipcMain.handle('reconcile', (e, desiredCard, desiredCash) => {
  // Find the current card and cash totals
  let orders = store.get('orders');
  const shop = getSetting('Shop Name');
  let reconcilledCard = 0;
  let reconcilledCash = 0;
  let cardTotal = 0;
  let cashTotal = 0;
  let oldRecIDs = [];
  let currOrder = 0;
  const ordersLegnth = orders.length;

  while (currOrder < ordersLegnth) {
    const order = orders[currOrder];
    currOrder++;
    if (order.deleted || order.eod || order.shop !== shop) continue;

    if (order.paymentMethod === 'Card') {
      cardTotal += order.subtotal;
    } else {
      cashTotal += order.subtotal;
    }

    if (order.items[0].name == 'Reconcilliation Balance Adjustment') {
      if (order.paymentMethod === 'Card') {
        reconcilledCard += order.subtotal;
      } else {
        reconcilledCash += order.subtotal;
      }
      oldRecIDs.push(order.id);
    }
  }
  // Find what needs to be added removed to each, this is our reconcileAmount
  // Find how much has already been reconilled for cash and card, we want an array of these orders
  // Add up their totals and subtract them from the reconcileAmounts
  let cardRecAmt = desiredCard - cardTotal + reconcilledCard;
  let cashRecAmt = desiredCash - cashTotal + reconcilledCash;
  // Delete the old reconcileOrders
  for (const id of oldRecIDs) {
    removeOrder({ id });
  }
  // Add the new orders

  const cardItem = [
    {
      name: 'Reconcilliation Balance Adjustment',
      price: cardRecAmt,
      quantity: 1,
    },
  ];
  addOrder(cardItem, 'Card');

  const cashItem = [
    {
      name: 'Reconcilliation Balance Adjustment',
      price: cashRecAmt,
      quantity: 1,
    },
  ];
  addOrder(cashItem, 'Cash');
});

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
  order.id = refreshID(order.id);
  // Need to get orders again because the current copy in memory does not have the deleted order in it;
  orders = store.get('orders');
  orders.splice(index, 0, order);
  store.set('orders', orders);
});

let activeReq = false;
ipcMain.handle('syncOrders', async () => {
  let orders = store.get('orders');
  if (Array.isArray(orders) === false) {
    store.set('orders', []);
    orders = [];
  }

  const noResponse = {
    success: false,
    ordersToAdd: 0,
    ordersToDelete: 0,
    ordersToEod: 0,
    ordersMissingInDb: 0,
    ordersDeletedInDb: 0,
    ordersEodedInDb: 0,
  };
  if (activeReq) return { activeReq: true };
  try {
    activeReq = true;
    const syncServer = getSetting('Sync Server');
    const https = getSetting('HTTPS');
    const shop = getSetting('Shop Name');
    const till = getSetting('Till Number');
    const key = getSetting('Sync Server Key');
    const data = {
      shop,
      till,
      allClientOrders:orders,
    };
    let res = await axios({
      method: 'patch',
      url: `${https ? 'https' : 'http'}://${syncServer}/api/syncOrders`,
      headers: {key},
      data,
      timeout: 120000,
    });
    const missingOrders = res.data.missingOrders;
    const deletedOrderIds = res.data.deletedOrderIds;
    const completedEodIds = res.data.completedEodIds;

    log('msg', 'note', {uhh: 'hi'})

    orders = store.get('orders'); 

    // add the relevant orders
    missingOrders.forEach((missingOrder) => {
      orders.push(missingOrder);
    });
    console.log(`Added ${missingOrders.length} missing orders`)

    // delete the relevant orders
    deletedOrderIds.forEach((deletedOrderId) => {
      orders.forEach((order) => {
        if (deletedOrderId == order.id) {
          order.deleted = true;
        }
      });
    });
    console.log(`Marked ${deletedOrderIds.length} orders as deleted`)

    completedEodIds.forEach((completedEodId) => {
      orders.forEach((order, index) => {
        if (order.id === completedEodId) {
          orders.splice(index, 1);
        }
      });
    });
    console.log(`Completed ${completedEodIds.length} EODs`)

    let uniqueOrders = orders.filter(
      (order, index) =>
        orders.findIndex((currentOrder) => currentOrder.id === order.id) ===
        index
    );

    console.log(`Deleted ${orders.length - uniqueOrders.length} duplicate orders`)

    uniqueOrders = insertionSort(uniqueOrders);

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

    activeReq = false;

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
    activeReq = false;
    console.log(e)
    // log(JSON.stringify(e), 'Error while syncing orders', [orders]);
    return noResponse;
  }
});

const insertionSort = (orders) => {
  for (let i = 1; i < orders.length; i++) {
    let key = orders[i];
    let id = key.id;
    let j = i - 1;
    while (j >= 0 && orders[j].id > id) {
      orders[j + 1] = orders[j];
      j = j - 1;
    }
    orders[j + 1] = key;
  }
  return orders;
};
