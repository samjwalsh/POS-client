import * as React from 'react';
import { useState, useEffect } from 'react';

import useConfirm from './Reusables/ConfirmDialog.jsx';

import closeSVG from '../assets/appicons/close.svg';

import {
  getAllOrders,
  printOrder,
  printEndOfDay,
  removeAllOrders,
  removeOldOrders,
  removeOrder,
} from '../tools/ipc';

import playBeep from '../tools/playBeep';

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  const [Dialog, confirm] = useConfirm();

  useEffect(() => {
    (async () => {
      const localOrders = await getAllOrders();
      setOrders(localOrders.reverse());
    })();
  }, []);

  // FUNCTIONS

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm(['Delete All Orders?', 'No', 'Yes']);
    if (!choice) return;
    let localOrders = await getAllOrders();
    await printEndOfDay(localOrders);
    await removeAllOrders();
    localOrders = await getAllOrders();
    if (Array.isArray(localOrders)) {
      setOrders(localOrders.reverse());
    }
  }

  const handleDeleteOrder = async (deletedOrder) => {
    playBeep();

    const choice = await confirm(['Delete This Order?', 'No', 'Yes']);
    if (!choice) return;

    let localOrders = await removeOrder(deletedOrder);

    setOrders(localOrders.reverse());
  };

  async function handleDeleteOldOrders() {
    playBeep();

    await removeOldOrders();
    const orders = await getAllOrders();

    setOrders(orders.reverse());
  }

  // HTML GENERATORS

  function createOrdersHTML() {
    let ordersHTML;
    if (Array.isArray(orders)) {
      ordersHTML = orders.map((order, index) => {
        let itemsHTML = createItemsHTML(order);

        const orderDateString = calculateDateString(order.time);

        return (
          <div
            key={order.time}
            className='orderbox borderD border-colour rnd flex max-h-96 flex-col'>
            <div className='flex flex-row w-full p-2 justify-between border-b border-colour'>
              <div
                className=' btn cnter-items primary p-2'
                onContextMenu={(e) => handlePrintReceipt(order)}
                onTouchStart={(e) => handlePrintReceipt(order)}>
                Receipt
              </div>
              <div
                className='btn  negative  p-1 cnter-items'
                onContextMenu={(e) => handleDeleteOrder(order)}
                onTouchStart={(e) => handleDeleteOrder(order)}>
                <img src={closeSVG} className='w-8 invert-icon' />
              </div>
            </div>
            <div className='flex flex-col p-2 border-b border-colour text-lg'>
              <div className='flex flex-row justify-between'>
                <div className=''>Time:</div>
                <div className=''>{orderDateString}</div>
              </div>
              <div className='flex flex-row justify-between'>
                <div className=''>Till:</div>
                <div className=''>{order.till ? order.till : 'Unknown'}</div>
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
      });
    }

    return ordersHTML;
  }

  function reportsStatsHTML() {
    return (
      <div className='flex flex-col h-full'>
        {createReportsStatsInfo()}
        <div className='mt-auto border-t border-colour p-2 flex flex-col gap-2'>
          <div
            className='btn primary h-auto p-2 cnter-items w-full'
            onContextMenu={(event) => handleDeleteOldOrders()}
            onTouchStart={(event) => handleDeleteOldOrders()}>
            Delete Old Orders
          </div>
          <div
            className='btn  negative  h-auto p-2 cnter-items w-full'
            onContextMenu={(event) => handleEndOfDay()}
            onTouchStart={(event) => handleEndOfDay()}>
            End Of Day
          </div>
        </div>
      </div>
    );
  }

  function createReportsStatsInfo() {
    let cashTotal = 0;
    let cardTotal = 0;

    orders.forEach((order) => {
      if (order.paymentMethod === 'Card') {
        cardTotal += order.subtotal;
      } else {
        cashTotal += order.subtotal;
      }
    });

    let xTotal = cashTotal + cardTotal;

    return (
      <div className='flex flex-col w-full text-3xl p-2 gap-2'>
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
        <div className='flex flex-row w-full justify-between'>
          <div className=''>X-Total:</div>
          <div className='num text-right justify-end'>€{xTotal.toFixed(2)}</div>
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
          className='w-full grid grid-cols-[auto_auto] grid-rows-[auto_min-content] text-lg p-2 border border-colour rnd grey'
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
      <div className='overflow-y-scroll no-scrollbar h-full grid grid-cols-12 grid-rows-1'>
        <div className='overflow-y-scroll no-scrollbar col-span-8 gap-2 p-2 flex flex-row flex-wrap'>
          {createOrdersHTML()}
          <div className='orderbox'></div>
          <div className='orderbox'></div>
        </div>
        <div className='col-span-4 border-l border-colour  w-full'>
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
