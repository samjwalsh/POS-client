import * as React from 'react';

import OrderItem from '../Reusables/OrderItem.jsx';
import closeSVG from '../../assets/appicons/close.svg';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import playBeep from '../../tools/playBeep.js';
import {
  removeOrder,
  getAllOrders,
  printOrder,
  getOrderStats,
} from '../../tools/ipc.js';

import { calculateDateString } from './Reports.jsx';

export function OrderBox({ order, setOrders, setReady, setStats }) {
  const orderDateString = calculateDateString(order.time);
  const [Dialog, confirm] = useConfirm();

  async function handleDeleteOrder(deletedOrder) {
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

    await removeOrder(deletedOrder);

    setReady(false);
    setOrders(await getAllOrders());
    setStats(await getOrderStats());
    setReady(true);
  }
  return (
    <>
      <Dialog />
      <div className='orderbox border bc flex max-h-96 flex-col rounded-box'>
        <div className='flex flex-row w-full p-2 justify-between border-b bc'>
          <div
            className=' btn btn-primary text-lg'
            onAuxClick={(e) => handlePrintReceipt(order)}
            onTouchEnd={(e) => handlePrintReceipt(order)}>
            Receipt
          </div>
          <div
            className='btn-error btn'
            onAuxClick={(e) => handleDeleteOrder(order)}
            onTouchEnd={(e) => handleDeleteOrder(order)}>
            <img src={closeSVG} className='w-6 icon' />
          </div>
        </div>
        <div className='flex flex-col p-2 border-b bc text-lg'>
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
          {order.items.map((orderItem, index) => {
            return (
              <OrderItem
                orderItem={orderItem}
                index={index}
                key={index.toString()}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

async function handlePrintReceipt(order) {
  const response = await printOrder(order);
  return;
}
