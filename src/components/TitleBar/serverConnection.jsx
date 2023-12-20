import React, { useState, useEffect } from 'react';
import { getSetting, syncOrders } from '../../tools/ipc';

let syncFrequency;

(async () => {
  syncFrequency = (await getSetting('Sync Frequency')) * 1000;
})();

export default function ServerConnection() {
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
    const connectionCheckInterval = setInterval(
      async () => {

        const beginPing = Date.now();
        const connection = await syncOrders();
        const endPing = Date.now();
        setIsOnline({
          status: connection.success,
          ping: endPing - beginPing,
          ordersToAdd: connection.ordersToAdd,
          ordersToDelete: connection.ordersToDelete,
          ordersToEod: connection.ordersToEod,
          ordersMissingInDb: connection.ordersMissingInDb,
          ordersDeletedInDb: connection.ordersDeletedInDb,
          ordersEodedInDb: connection.ordersEodedInDb,
          shop: await getSetting('Shop Name'),
          till: await getSetting('Till Number')
        });
      },
      typeof syncFrequency === 'number' ? syncFrequency : 5000
    );
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  return (
    <div
      className={`flex flex-row text-sm h-full ${
        isOnline.status ? 'positiveFill' : 'negativeFill'
      }`}>
      <div className='grid grid-rows-2 grid-cols-1'>
        <div className='row-span-1 col-span-1'>
          S-{isOnline.status ? 'OK' : 'NC'}
        </div>
        <div className='row-span-1 col-span-1'>
          {isOnline.status
            ? `[${String(isOnline.ping).padStart(3, '0')}]`
            : '[---]'}
        </div>
      </div>

      <div className='grid grid-rows-2 grid-cols-3 text-sm'>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersToAdd === 0 ? '-' : isOnline.ordersToAdd}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersToDelete === 0 ? '-' : isOnline.ordersToDelete}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersToEod === 0 ? '-' : isOnline.ordersToEod}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersMissingInDb === 0 ? '-' : isOnline.ordersMissingInDb}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersDeletedInDb === 0 ? '-' : isOnline.ordersDeletedInDb}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersEodedInDb === 0 ? '-' : isOnline.ordersEodedInDb}
        </div>
      </div>
      <div className='grid grid-rows-2 grid-cols-1 text-sm'>
        <div className='col-span-1 row-span-1'>{isOnline.shop}</div>
        <div className='col-span-1 row-span-1'>{`${isOnline.till != undefined? '[' + isOnline.till + ']' : '' }`}</div>
      </div>
    </div>
  );
}

// {`[${isOnline.ordersToAdd} ${isOnline.ordersToDelete} ${isOnline.ordersToEod} ${isOnline.ordersMissingInDb} ${isOnline.ordersDeletedInDb} ${isOnline.ordersEodedInDb}]`}
