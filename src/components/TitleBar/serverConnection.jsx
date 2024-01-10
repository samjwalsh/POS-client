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
    (async () => {
      setIsOnline(await syncOrdersInterval());
    })();
  }, []);

  useEffect(() => {
    const connectionCheckInterval = setInterval(
      async () => {
        setIsOnline(await syncOrdersInterval());
      },
      typeof syncFrequency === 'number' ? syncFrequency : 5000
    );
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  async function syncOrdersInterval() {
    const beginPing = Date.now();
    const connection = await syncOrders();
    const endPing = Date.now();
    let shop = await getSetting('Shop Name');
    switch (shop) {
      case 'DEV': {
        shop = 'DV';
        break;
      }
      case 'Main': {
        shop = 'MN';
        break;
      }
      case 'Lighthouse': {
        shop = 'LH';
        break;
      }
      case 'West Pier': {
        shop = 'WP';
        break;
      }
      case 'Bray': {
        shop = 'BR';
        break;
      }
      default: {
        shop = 'XX';
      }
    }

    return {
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
    };
  }

  return (
    <div
      className={`flex flex-row text-sm h-full px-1 rounded-btn
       ${isOnline.status ? 'bg-success' : 'bg-error'}`}>
      <div className='grid grid-rows-2 grid-cols-1'>
        <div className='row-span-1 col-span-1'>SRV</div>
        <div className='row-span-1 col-span-1'>
          {isOnline.status
            ? `${String(isOnline.ping).padStart(3, '0')}`
            : '---'}
        </div>
      </div>

      <div className='grid grid-rows-2 grid-cols-3 text-sm px-1'>
        <div className='col-span-1 row-span-1'>{isOnline.ordersToAdd == 0? '-' : isOnline.ordersToAdd}</div>
        <div className='col-span-1 row-span-1'>{isOnline.ordersToDelete== 0? '-' : isOnline.ordersToDelete}</div>
        <div className='col-span-1 row-span-1'>{isOnline.ordersToEod== 0? '-' : isOnline.ordersToEod}</div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersMissingInDb== 0? '-' : isOnline.ordersMissingInDb}
        </div>
        <div className='col-span-1 row-span-1'>
          {isOnline.ordersDeletedInDb== 0? '-' : isOnline.ordersDeletedInDb}
        </div>
        <div className='col-span-1 row-span-1'>{isOnline.ordersEodedInDb== 0? '-' : isOnline.ordersEodedInDb}</div>
      </div>
      <div className='grid grid-rows-2 grid-cols-1 text-sm'>
        <div className='col-span-1 row-span-1'>{isOnline.shop}</div>
        <div className='col-span-1 row-span-1 text-center'>{`${
          isOnline.till != undefined ? '' + isOnline.till + '' : ''
        }`}</div>
      </div>
    </div>
  );
}

// {`[${isOnline.ordersToAdd} ${isOnline.ordersToDelete} ${isOnline.ordersToEod} ${isOnline.ordersMissingInDb} ${isOnline.ordersDeletedInDb} ${isOnline.ordersEodedInDb}]`}
