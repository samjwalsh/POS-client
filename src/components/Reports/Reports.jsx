import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';

import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import useReconciller from './Reconciller.jsx';
import { useInterval } from '../Reusables/Wait.jsx';

import infoSVG from '../../assets/appicons/info.svg';

import { getSetting, getOrderStats } from '../../tools/ipc.js';

import {
  getAllOrders,
  printEndOfDay,
  removeOldOrders,
  endOfDay,
} from '../../tools/ipc.js';

import playBeep from '../../tools/playBeep.js';
import { OrderBox } from './OrderBox.jsx';
import OrdersStats from './OrdersStats.jsx';
import Wait from '../Reusables/Wait.jsx';
import { cF, nF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';

export default function Reports(props) {
  const { updateOrders, setUpdateOrders } = props;
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    cashTotal: 0,
    cardTotal: 0,
    quantityItems: 0,
    quantityOrders: 0,
    averageSale: 0,
    xTotal: 0,
  });
  const [ready, setReady] = useState(false);

  const [Dialog, confirm] = useConfirm();
  const [Reconciller, reconcile] = useReconciller(stats);

  const [Alert, alert] = useAlert();

  useEffect(() => {
    (() => {
      refreshOrders();
    })();
  }, []);

  // This checks if the orders need to be refreshed based on what the server sent back
  useInterval(async () => {
    if (updateOrders) {
      setUpdateOrders(false);
      await refreshOrders();
    }
  }, 1000);

  async function refreshOrders() {
    setReady(false);
    getAllOrders().then((orders) => {
      setOrders(orders);
    });
    getOrderStats().then((stats) => {
      setStats(stats);
    });
    setReady(true);
  }

  async function handleEndOfDay() {
    playBeep();
    const choice = await confirm(
      [
        'End of day?',
        'Cancel',
        'Continue',
        "This will print an end of day sheet and upload all of today's orders to the cloud.",
      ],
      true
    );
    if (!choice) return;
    const hasReconciled = await reconcile('Z');
    if (!hasReconciled) return;

    await refreshOrders();

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
          await alert('End Of Day', await createEodHTML());
          userFinished = true;
        } else {
          await printEndOfDay(orders);
        }
      }
    }
    await endOfDay();
    await refreshOrders();
  }

  async function handleDeleteOldOrders() {
    playBeep();

    await removeOldOrders();
    await refreshOrders();
  }

  async function handleDeleteOldOrdersHelp() {
    playBeep();
    await alert(
      'End of Day',
      `This will end of day any orders currently saved on the till that are not from today, so if the last person forgot to end of day the till you can press this to remove any orders that weren't made today.`
    );
  }

  async function reconcileTotals() {
    playBeep();
    await reconcile('X', stats.cashTotal, stats.cardTotal);
    await refreshOrders();
  }

  return (
    <>
      <Dialog />
      <Alert />
      <Reconciller />
      <div className='overflow-y-scroll no-scrollbar h-full grid grid-cols-12 grid-rows-1'>
        <div className='overflow-y-scroll no-scrollbar col-span-8 gap-2 p-2 flex flex-row flex-wrap'>
          {ready ? (
            orders.map((order) => {
              return (
                <OrderBox
                  order={order}
                  setOrders={setOrders}
                  key={order.id}
                  setReady={setReady}
                  setStats={setStats}
                />
              );
            })
          ) : (
            <div className='cnter p-4 w-full'>
              <Wait />
            </div>
          )}
          <div className='orderbox'></div>
          <div className='orderbox'></div>
        </div>
        <div className='col-span-4 border-l bc py-2  w-full'>
          <div className='flex flex-col h-full'>
            <OrdersStats stats={stats} />
            <div className='mt-auto px-2 flex flex-col gap-2'>
              <Button onClick={reconcileTotals} type='primary'>
                Update Totals
              </Button>

              <div className='flex flex-row w-full gap-[1px] h-12'>
                <Button
                  type='danger-tertiary'
                  className='flex-grow'
                  onClick={handleDeleteOldOrders}>
                  Delete Old Orders
                </Button>
                <Button
                  type='ghost'
                  className='aspect-square'
                  onClick={handleDeleteOldOrdersHelp}
                  icon={infoSVG}></Button>
              </div>
              <Button type='danger' onClick={handleEndOfDay}>
                End Of Day
              </Button>
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

const createEodHTML = async () => {
  const {
    cashTotal,
    cardTotal,
    quantityItems,
    quantityOrders,
    averageSale,
    xTotal,
  } = await getOrderStats();

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
        <div>{cF(cashTotal)}</div>
      </div>
      <div className='flex flex-row justify-between font-bold'>
        <div>Card:</div>
        <div>{cF(cardTotal)}</div>
      </div>
      <div className='flex flex-row justify-between font-bold'>
        <div>Total:</div>
        <div>{cF(xTotal)}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Vat Total:</div>
        <div>{cF(0.23 * xTotal)}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Total Items:</div>
        <div>{nF(quantityItems)}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Total Orders:</div>
        <div>{nF(quantityOrders)}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Average Sale:</div>
        <div>{cF(averageSale)}</div>
      </div>
      <div className='flex flex-row justify-between'>
        <div>Time</div>
        <div>{calculateDateString(new Date().getTime())}</div>
      </div>
    </div>
  );
};
