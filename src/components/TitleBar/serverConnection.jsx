import React, { useState, useEffect } from 'react';
import { getSetting, syncOrders } from '../../tools/ipc';
import { useInterval } from '../Reusables/Wait.jsx';

let syncFrequency;

(async () => {
  syncFrequency = (await getSetting('Sync Frequency')) * 1000;
})();

export default function ServerConnection(props) {
  const { updateOrders, setUpdateOrders, appState } = props;
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0,
    ordersToAdd: 0,
    ordersToDelete: 0,
    ordersToEod: 0,
    ordersMissingInDb: 0,
    ordersDeletedInDb: 0,
    ordersEodedInDb: 0,
  });

  useEffect(() => {
    (async () => {
      await syncOrdersInterval();
    })();
  }, []);

  useInterval(
    async () => {
      await syncOrdersInterval();
    },
    typeof syncFrequency === 'number' ? syncFrequency : 5000
  );

  async function syncOrdersInterval() {
    const beginPing = Date.now();
    const connection = await syncOrders();
    const endPing = Date.now();
    let shop = (await getSetting('Shop Name')).slice(0, 2).toUpperCase();
    console.log('sent')
    const totalLocalUpdates =
      connection.ordersToAdd +
      connection.ordersToDelete +
      connection.ordersToEod;
    if (totalLocalUpdates > 0 && appState === 'Reports') {
      setUpdateOrders(true);
    }

    setIsOnline({
      status: connection.success,
      ping: endPing - beginPing,
      ordersToAdd: connection.ordersToAdd,
      ordersToDelete: connection.ordersToDelete,
      ordersToEod: connection.ordersToEod,
      ordersMissingInDb: connection.ordersMissingInDb,
      ordersDeletedInDb: connection.ordersDeletedInDb,
      ordersEodedInDb: connection.ordersEodedInDb,
      shop,
      till: await getSetting('Till Number'),
    });
    return;
  }

  return (
    <div
      className={`flex flex-row justify-between h-full p-1 gap-1 text-error-content
       ${isOnline.status ? 'bg-success' : 'bg-error'}`}>
      <div className='flex flex-col justify-between'>
        <div className='row-span-1 col-span-1 text-center'>SRV</div>
        <div className='row-span-1 col-span-1 text-center num'>
          {isOnline.status
            ? `${String(isOnline.ping).padStart(3, '0')}`
            : '---'}
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <div className='flex flex-row justify-between'>
          <div>{isOnline.ordersToAdd == 0 ? '-' : isOnline.ordersToAdd}</div>
          <div>
            {isOnline.ordersToDelete == 0 ? '-' : isOnline.ordersToDelete}
          </div>
          <div>{isOnline.ordersToEod == 0 ? '-' : isOnline.ordersToEod}</div>
        </div>
        <div className='flex flex-row justify-between'>
          <div>
            {isOnline.ordersMissingInDb == 0 ? '-' : isOnline.ordersMissingInDb}
          </div>
          <div>
            {isOnline.ordersDeletedInDb == 0 ? '-' : isOnline.ordersDeletedInDb}
          </div>
          <div>
            {isOnline.ordersEodedInDb == 0 ? '-' : isOnline.ordersEodedInDb}
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-between'>
        <div>{isOnline.shop}</div>
        <div>{`${
          isOnline.till != undefined ? '' + isOnline.till + '' : ''
        }`}</div>
      </div>
    </div>
  );
}
