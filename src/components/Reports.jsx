import * as React from 'react';
import { useState, useEffect } from 'react';

import useConfirm from './Reusables/ConfirmDialog.jsx';

import closeSVG from '../assets/appicons/close.svg';

import {
  getAllOrders,
  overwriteOrders,
  removeAllOrders,
  removeOrder,
} from '../tools/ipc';

import playBeep from '../tools/playBeep';

export default function Reports(props) {
  const [orders, setOrders] = useState([]);

  const [Dialog, confirm] = useConfirm('Continue?', '');

  useEffect(() => {
    (async () => {
      const localOrders = await getAllOrders();
      setOrders(localOrders.reverse());
    })();
  }, []);

  // FUNCTIONS

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm();
    if (!choice) return;
    await removeAllOrders();
    let localOrders = await getAllOrders();
    if (Array.isArray(localOrders)) {
      setOrders(localOrders.reverse());
    }
  }

  const handleDeleteOrder = async (deletedOrder) => {
    playBeep();

    const choice = await confirm();
    if (!choice) return;

    let localOrders = await removeOrder(deletedOrder);

    setOrders(localOrders.reverse());
  };

  async function handleDeleteOldOrders() {
    playBeep();

    let localOrders = await getAllOrders();

    const currentDate = new Date().getDate();

    let newOrders = [];
    if (Array.isArray(localOrders)) {
      localOrders.forEach((order, index) => {
        const orderDate = new Date(order.time).getDate();
        if (orderDate == currentDate) {
          newOrders.push(order);
        }
      });
      overwriteOrders(newOrders);

      setOrders(newOrders.reverse());
    }
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
            className='orderbox border border-colour rounded flex  flex-col '>
            <div className='flex flex-row w-full p-2 justify-between border-b border-colour blue rounded-t-sm'>
              <div className='text-2xl self-end'>
                Order No. {orders.length - index}
              </div>
              <div
                className='btn btn--minus p-1 cnter-items'
                onClick={(e) => handleDeleteOrder(order)}>
                <img src={closeSVG} className='w-6' />
              </div>
            </div>
            <div className='flex flex-col p-2 border-b border-colour text-lg'>
              <div className='flex flex-row justify-between'>
                <div className=''>Time:</div>
                <div className=''>{orderDateString}</div>
              </div>
              <div className='flex flex-row justify-between'>
                <div className=''>Subtotal:</div>
                <div className='font-mono'>€{order.subtotal.toFixed(2)}</div>
              </div>
              <div className='flex flex-row justify-between'>
                <div className=''>Payment:</div>
                <div className=''>{order.paymentMethod}</div>
              </div>
            </div>
            <div className='flex flex-col gap-2 p-2 h-64 overflow-y-scroll no-scrollbar'>
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
            className='btn gradient1 h-auto p-2 cnter-items w-full'
            onClick={(event) => handleDeleteOldOrders()}>
            Delete Old Orders
          </div>
          <div
            className='btn btn--minus h-auto p-2 cnter-items w-full'
            onClick={(event) => handleEndOfDay()}>
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
      <div className='flex flex-col w-full text-xl p-2 gap-2'>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
          <div className=''>Cash:</div>
          <div className='font-mono text-right justify-end'>
            €{cashTotal.toFixed(2)}
          </div>
        </div>
        <div className='flex flex-row w-full justify-between border-b border-colour pb-2'>
          <div className=''>Card:</div>
          <div className='font-mono text-right justify-end '>
            €{cardTotal.toFixed(2)}
          </div>
        </div>
        <div className='flex flex-row w-full justify-between'>
          <div className=''>X-Total:</div>
          <div className='font-mono text-right justify-end'>
            €{xTotal.toFixed(2)}
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
          className='w-full grid grid-cols-[auto_auto] grid-rows-[auto_min-content] text-lg p-2 border border-colour rounded gradient1'
          key={index}>
          <div className='col-span-1 row-span-1'>
            {item.name} {formattedQuantity}
          </div>
          <div className='col-span-1 row-span-1 text-right'>
            €{(item.price * item.quantity).toFixed(2)}
          </div>
          <div className='col-span-1 row-span-1 pr-4'>{formattedAddons}</div>
          <div className='col-span-1 row-span-1 text-right'>
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
