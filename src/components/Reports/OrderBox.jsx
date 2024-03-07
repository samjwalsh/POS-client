import * as React from 'react';

import OrderItem from '../Reusables/OrderItem.jsx';
import closeSVG from '../../assets/appicons/close.svg';
import editSVG from '../../assets/appicons/edit.svg';

import useListSelect from '../Reusables/ListSelect.jsx';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import playBeep from '../../tools/playBeep.js';
import {
  removeOrder,
  getAllOrders,
  printOrder,
  getOrderStats,
  swapPaymentMethod,
} from '../../tools/ipc.js';

import { calculateDateString } from './Reports.jsx';
import { cF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';

export function OrderBox({ order, setOrders, setReady, setStats }) {
  const orderDateString = calculateDateString(order.time);
  const [Dialog, confirm] = useConfirm();
  const [ListSelect, chooseOption] = useListSelect();

  async function handleDeleteOrder(deletedOrder) {
    playBeep();

    const choice = await confirm([
      `Delete order?`,
      'Cancel',
      'Delete',
      `Delete this order for ${cF(
        deletedOrder.subtotal
      )}, this action cannot be undone.`,
    ]);
    if (!choice) return;

    await removeOrder(deletedOrder);

    setReady(false);
    setOrders(await getAllOrders());
    setStats(await getOrderStats());
    setReady(true);
  }

  async function handleEditOrder(order) {
    playBeep();
    const choice = await chooseOption(['Swap Payment Method']);
    if (!choice) return;
    if (choice === 'Swap Payment Method') {
      const choice = await confirm([
        'Swap Payment Method',
        'Cancel',
        'Swap',
        `Swap payment method for this order from ${order.paymentMethod} to ${
          order.paymentMethod === 'Cash' ? 'Card' : 'Cash'
        }?`,
      ]);
      if (!choice) return;
      await swapPaymentMethod(order);

      setReady(false);
      setOrders(await getAllOrders());
      setStats(await getOrderStats());
      setReady(true);
    }
  }
  return (
    <>
      <ListSelect />
      <Dialog />
      <div className='orderbox border bc flex max-h-96 flex-col rounded-box'>
        <div className='flex flex-row w-full p-2 justify-between border-b bc '>
          <Button type='primary' onClick={() => handlePrintReceipt(order)}>
            Receipt
          </Button>
          <div className='flex flex-row gap-2'>
            <Button
              type='secondary'
              className='aspect-square'
              onClick={() => handleEditOrder(order)}
              icon={editSVG}></Button>
            <Button
              type='danger'
              className='aspect-square'
              onClick={(e) => handleDeleteOrder(order)}
              icon={closeSVG}></Button>
          </div>
        </div>
        <div className='flex flex-col p-2 border-b bc text-lg'>
          <div className='flex flex-row justify-between'>
            Time:
            <div className=''>{orderDateString}</div>
          </div>
          <div className='flex flex-row justify-between'>
            Till:
            <div className=''>{order.shop + '-' + order.till}</div>
          </div>
          <div className='flex flex-row justify-between'>
            Subtotal:
            <div className='num'>{cF(order.subtotal)}</div>
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
