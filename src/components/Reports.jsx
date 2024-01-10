import * as React from 'react';
import { useState, useEffect } from 'react';

import useConfirm from './Reusables/ConfirmDialog.jsx';

import useAlert from './Reusables/Alert.jsx';

import closeSVG from '../assets/appicons/close.svg';

import { getSetting } from '../tools/ipc';

import {
  getAllOrders,
  printOrder,
  printEndOfDay,
  removeAllOrders,
  removeOldOrders,
  removeOrder,
  endOfDay,
} from '../tools/ipc';

import playBeep from '../tools/playBeep';

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  const [Dialog, confirm] = useConfirm();

  const [Alert, alert] = useAlert();

  useEffect(() => {
    (async () => {
      setOrders(await getAllOrders());
    })();
  }, []);

  useEffect(() => {
    const syncOrdersInterval = setInterval(
      async () => {
        setOrders(await getAllOrders());
      },
      typeof syncFrequency === 'number' ? syncFrequency : 5000
    );
    return () => {
      clearInterval(syncOrdersInterval);
    };
  }, []);
  // FUNCTIONS

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm([
      'End of day?',
      'Cancel',
      'Continue',
      "This will print an end of day sheet and upload all of today's orders to the cloud.",
    ]);
    if (!choice) return;
    let orders = await getAllOrders();
    await printEndOfDay(orders);
    const printFailed = await confirm([
      'View sheet on screen?',
      'No',
      'Yes',
      `If the end of day sheet didn't print correctly you can view the sheet on the till`,
    ]);
    if (printFailed) {
      let cashTotal = 0;
      let cardTotal = 0;
      let quantityItems = 0;
      let quantityOrders = orders.length;

      for (const order of orders) {
        if (order.paymentMethod === 'Card') {
          cardTotal += order.subtotal;
        } else {
          cashTotal += order.subtotal;
        }

        for (const item of order.items) {
          if (item.quantity === undefined) {
            quantityItems++;
          } else {
            quantityItems += item.quantity;
          }
        }
      }

      let xTotal = cashTotal + cardTotal;

      let averageSale = 0;
      if (quantityOrders !== 0 && quantityOrders !== undefined) {
        averageSale = xTotal / quantityOrders;
      }

      const EodHTML = (
        <div className='text-xl w-full'>
          <div className='flex flex-row justify-between'>
            <div>Shop:</div>
            <div>{await getSetting('Shop Name')}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Date:</div>
            <div>{new Date().toLocaleDateString('en-ie')}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Cash:</div>
            <div>{`€${cashTotal.toFixed(2)}`}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Card:</div>
            <div>{`€${cardTotal.toFixed(2)}`}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Total:</div>
            <div>{`€${xTotal.toFixed(2)}`}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Vat Total:</div>
            <div>{`€${(0.23 * xTotal).toFixed(2)}`}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Total Items:</div>
            <div>{quantityItems}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Total Orders:</div>
            <div>{quantityOrders}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Average Sale:</div>
            <div>{`€${averageSale.toFixed(2)}`}</div>
          </div>
          <div className='flex flex-row justify-between'>
            <div>Time</div>
            <div>{calculateDateString(new Date().getTime())}</div>
          </div>
        </div>
      );
      await alert(EodHTML);
    }
    await endOfDay();
    orders = await getAllOrders();
    setOrders(orders);
  }

  const handleDeleteOrder = async (deletedOrder) => {
    playBeep();

    const choice = await confirm([
      `Delete order?`,
      'Cancel',
      'Delete',
      `Delete this order for €${deletedOrder.subtotal.toFixed(
        2
      )}, this action cannot be undone.`,
    ]);
    if (!choice) return;

    let localOrders = await removeOrder(deletedOrder);

    localOrders = await getAllOrders();

    setOrders(localOrders);
  };

  async function handleDeleteOldOrders() {
    playBeep();

    await removeOldOrders();
    const orders = await getAllOrders();

    setOrders(orders);
  }

  // HTML GENERATORS

  function createOrdersHTML() {
    let ordersHTML = [];

    for (
      let noOrdersRendered = 0;
      noOrdersRendered < 100 && noOrdersRendered < orders.length;
      noOrdersRendered++
    ) {
      const order = orders[noOrdersRendered];
      let itemsHTML = createItemsHTML(order);

      const orderDateString = calculateDateString(order.time);
      ordersHTML.push(
        <div
          key={order.time}
          className='orderbox borderD border-colour flex max-h-96 flex-col'>
          <div className='flex flex-row w-full p-2 justify-between border-b border-colour'>
            <div
              className=' btn btn-primary text-lg'
              onContextMenu={(e) => handlePrintReceipt(order)}
              onTouchEnd={(e) => handlePrintReceipt(order)}>
              Receipt
            </div>
            <div
              className='btn-error btn'
              onContextMenu={(e) => handleDeleteOrder(order)}
              onTouchEnd={(e) => handleDeleteOrder(order)}>
              <img src={closeSVG} className='w-6 invert-icon' />
            </div>
          </div>
          <div className='flex flex-col p-2 border-b border-colour text-lg'>
            <div className='flex flex-row justify-between'>
              <div className=''>Time:</div>
              <div className=''>{orderDateString}</div>
            </div>
            <div className='flex flex-row justify-between'>
              <div className=''>Till:</div>
              <div className=''>{order.shop + '-' + order.till}</div>
            </div>
            <div className='flex flex-row justify-between'>
              <div className=''>Subtotal:</div>
              <div className='num'>€{order.subtotal.toFixed(2)}</div>
            </div>
            <div className='flex flex-row justify-between'>
              <div className=''>Payment:</div>
              <div className=''>{order.paymentMethod}</div>
            </div>
          </div>
          <div className='flex flex-col gap-2 p-2 max-h-full overflow-y-scroll no-scrollbar'>
            {itemsHTML}
          </div>
        </div>
      );
    }

    return ordersHTML;
  }

  function reportsStatsHTML() {
    return (
      <div className='flex flex-col h-full'>
        {createReportsStatsInfo()}
        <div className='mt-auto border-t border-colour pt-2 mx-2 flex flex-col gap-2'>
          <div
            className='btn btn-warning h-auto text-lg cnter-items w-full'
            onContextMenu={(event) => handleDeleteOldOrders()}
            onTouchEnd={(event) => handleDeleteOldOrders()}>
            Delete Old Orders
          </div>
          <div
            className='btn-error btn text-lg h-auto p-2 cnter-items w-full'
            onContextMenu={(event) => handleEndOfDay()}
            onTouchEnd={(event) => handleEndOfDay()}>
            End Of Day
          </div>
        </div>
      </div>
    );
  }

  function createReportsStatsInfo() {
    let cashTotal = 0;
    let cardTotal = 0;

    let quantityItems = 0;
    for (const order of orders) {
      if (order.paymentMethod === 'Card') {
        cardTotal += order.subtotal;
      } else {
        cashTotal += order.subtotal;
      }
      for (const item of order.items) {
        if (item.quantity === undefined) {
          quantityItems++;
        } else {
          quantityItems += item.quantity;
        }
      }
    }

    let xTotal = cashTotal + cardTotal;

    return (
      <div className='flex flex-col w-full text-2xl p-2 pt-0 gap-2'>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
          <div className=''>Cash:</div>
          <div className='num text-right justify-end'>
            €{cashTotal.toFixed(2)}
          </div>
        </div>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
          <div className=''>Card:</div>
          <div className='num text-right justify-end '>
            €{cardTotal.toFixed(2)}
          </div>
        </div>
        <div className='flex flex-row w-full justify-between pb-2'>
          <div className=''>X-Total:</div>
          <div className='num text-right justify-end'>€{xTotal.toFixed(2)}</div>
        </div>
        <div className='flex flex-row w-full justify-between pb-2 text-xl'>
          <div className=''></div>
        </div>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2 text-base'>
          <div className=''>No. Orders:</div>
          <div className='num text-right justify-end'>{orders.length}</div>
        </div>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2 text-base'>
          <div className=''>No. Items:</div>
          <div className='num text-right justify-end'>{quantityItems}</div>
        </div>
        <div className='flex flex-row w-full justify-between pb-2 text-base'>
          <div className=''>Average Sale:</div>
          <div className='num text-right justify-end'>
            €{(xTotal / (orders.length === 0 ? 1 : orders.length)).toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  function createItemsHTML(order) {
    let itemsHTML = order.items.map((item, index) => {
      if (item.value !== undefined || item.price === undefined) {
        removeAllOrders();
      }

      let formattedQuantity = '';
      if (item.quantity === 1 || item.quantity === undefined) {
      } else {
        formattedQuantity = `(${item.quantity})`;
      }

      let formattedAddons = '';
      if (Array.isArray(item.addons)) {
        formattedAddons = item.addons.join(', ');
      }

      return (
        <div
          className='w-full grid grid-cols-[auto_auto] grid-rows-[auto_min-content] text-lg p-2 rounded-btn bg-secondary'
          key={index}>
          <div className='col-span-1 row-span-1'>
            {item.name} {formattedQuantity}
          </div>
          <div className='col-span-1 row-span-1 text-right num'>
            €{(item.price * item.quantity).toFixed(2)}
          </div>
          <div className='col-span-1 row-span-1 pr-4 text-sm'>
            {formattedAddons}
          </div>
          <div className='col-span-1 row-span-1 text-right num text-sm'>
            €{item.price.toFixed(2)} EA
          </div>
        </div>
      );
    });

    return itemsHTML;
  }

  return (
    <>
      <Dialog />
      <Alert />
      <div className='overflow-y-scroll no-scrollbar h-full grid grid-cols-12 grid-rows-1'>
        <div className='overflow-y-scroll no-scrollbar col-span-8 gap-2 p-2 flex flex-row flex-wrap'>
          {createOrdersHTML()}
          <div className='orderbox'></div>
          <div className='orderbox'></div>
        </div>
        <div className='col-span-4 border-l border-colour my-2  w-full'>
          {reportsStatsHTML()}
        </div>
      </div>
    </>
  );
}

async function handlePrintReceipt(order) {
  const response = await printOrder(order);
  return;
}

function calculateDateString(time) {
  const date = new Date(time);

  let dateString = '';
  dateString += date.getHours().toString().padStart(2, '0');
  dateString += ':';
  dateString += date.getMinutes().toString().padStart(2, '0');
  dateString += ':';
  dateString += date.getSeconds().toString().padStart(2, '0');
  dateString += ' ';
  dateString += date.getDate().toString().padStart(2, '0');
  dateString += '/';
  dateString += (date.getMonth() + 1).toString().padStart(2, '0');
  // dateString += "/";
  // dateString += date.getFullYear().toString().padStart(2, "0");

  return dateString;
}
