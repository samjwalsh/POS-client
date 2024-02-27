import * as React from 'react';
import { useState, useEffect } from 'react';

import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import useReconciller from './Reconciller.jsx';

import infoSVG from '../../assets/appicons/info.svg';

import { getSetting } from '../../tools/ipc.js';

import {
  getAllOrders,
  printEndOfDay,
  removeOldOrders,
  endOfDay,
  getOrdersPerformant,
} from '../../tools/ipc.js';

import playBeep from '../../tools/playBeep.js';
import { OrderBox } from './OrderBox.jsx';
import OrdersStats from './OrdersStats.jsx';

export default function Reports(props) {
  const [orders, setOrders] = useState([]);
  const statsDefault = {
    cashTotal: 0,
    cardTotal: 0,
    quantityItems: 0,
    quantityOrders: 0,
    averageSale: 0,
    xTotal: 0,
  };
  const [stats, setStats] = useState(statsDefault);

  const [Dialog, confirm] = useConfirm();
  const [Reconciller, reconcile] = useReconciller(orders, setOrders);

  const [Alert, alert] = useAlert();

  useEffect(() => {
    (() => {
      getOrdersPerformant().then((obj) => {
        setOrders(obj.orders);
        setStats(obj.stats);
      });
    })();
  }, []);

  async function refreshOrders() {
    const obj = await getOrdersPerformant();
    setOrders(obj.orders);
    setStats(obj.stats);
  }

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm([
      'End of day?',
      'Cancel',
      'Continue',
      "This will print an end of day sheet and upload all of today's orders to the cloud.",
    ]);
    if (!choice) return;
    const hasReconciled = await reconcile();
    if (!hasReconciled) return;
    const obj = await getOrdersPerformant();
    setOrders(obj.orders);
    setStats(obj.stats);
    let orders = await getAllOrders();
    await printEndOfDay(orders);
    let userFinished = false;
    while (!userFinished) {
      userFinished = await confirm([
        'Did the sheet print correctly?',
        'No',
        'Yes',
        `If the end of day sheet didn't print correctly you can view the sheet on the till or try to print it again.`,
      ]);
      if (!userFinished) {
        let tryAgain = await confirm([
          'Try Again?',
          'View On Screen',
          'Print Again',
          `You can choose to attempt to print the end of day sheet again or view it on the screen.`,
        ]);
        if (!tryAgain) {
          await alert(await createEodHTML(orders));
          userFinished = true;
        }
      }
    }
    await endOfDay();
    refreshOrders();
  }

  async function handleDeleteOldOrders() {
    playBeep();

    await removeOldOrders();
    refreshOrders();
  }

  async function handleDeleteOldOrdersHelp() {
    await alert(
      `This will end of day any orders currently saved on the till that are not from today, so if the last person forgot to end of day the till you can press this to remove any orders that weren't made today.`
    );
  }

  function createOrdersHTML() {
    let ordersHTML = [];
    for (
      let noOrdersRendered = 0;
      noOrdersRendered < 50 && noOrdersRendered < orders.length;
      noOrdersRendered++
    ) {
      const order = orders[noOrdersRendered];
      ordersHTML.push(
        <OrderBox
          order={order}
          setOrders={setOrders}
          stats={stats}
          setStats={setStats}
          key={order.time.toString()}
        />
      );
    }

    return ordersHTML;
  }

  return (
    <>
      <Dialog />
      <Alert />
      <Reconciller />
      <div className='overflow-y-scroll no-scrollbar h-full grid grid-cols-12 grid-rows-1'>
        <div className='overflow-y-scroll no-scrollbar col-span-8 gap-2 p-2 flex flex-row flex-wrap'>
          {createOrdersHTML()}
          <div className='orderbox'></div>
          <div className='orderbox'></div>
        </div>
        <div className='col-span-4 border-l border-colour my-2  w-full'>
          <div className='flex flex-col h-full'>
            <OrdersStats stats={stats} />
            <div className='mt-auto mx-2 flex flex-col gap-2'>
              <div
                className='btn btn-neutral text-lg h-auto w-full flex-grow'
                onContextMenu={() => refreshOrders()}
                onTouchEnd={() => refreshOrders()}>
                Refresh Orders
              </div>
              <div className='flex flex-row h-auto w-full gap-2'>
                <div
                  className='btn btn-warning text-lg h-auto flex-grow'
                  onContextMenu={() => handleDeleteOldOrders()}
                  onTouchEnd={() => handleDeleteOldOrders()}>
                  Delete Old Orders
                </div>
                <div
                  className='btn-primary btn'
                  onContextMenu={() => handleDeleteOldOrdersHelp()}
                  onTouchEnd={() => handleDeleteOldOrdersHelp()}>
                  <img src={infoSVG} className='w-6 invert-icon' />
                </div>
              </div>
              <div
                className='btn-error btn text-lg h-auto p-2 w-full'
                onContextMenu={() => handleEndOfDay()}
                onTouchEnd={() => handleEndOfDay()}>
                End Of Day
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function calculateDateString(time) {
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

const createEodHTML = async (orders) => {
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

  return (
    <div className='text-xl w-full'>
      <div className='flex flex-row justify-between'>
        <div>Shop:</div>
        <div>{await getSetting('Shop Name')}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Date:</div>
        <div>{new Date().toLocaleDateString('en-ie')}</div>
      </div>
      <div className='flex flex-row justify-between font-bold'>
        <div>Cash:</div>
        <div>{`€${cashTotal.toFixed(2)}`}</div>
      </div>
      <div className='flex flex-row justify-between font-bold'>
        <div>Card:</div>
        <div>{`€${cardTotal.toFixed(2)}`}</div>
      </div>
      <div className='flex flex-row justify-between font-bold'>
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
};
