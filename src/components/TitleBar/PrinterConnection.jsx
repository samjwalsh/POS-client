import React, { useState, useEffect } from 'react';
import { checkPrinterConnection, getSetting } from '../../tools/ipc';

export default function PrinterConnection() {
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0,
  });

  useEffect(() => {
    (async () => {
      setIsOnline(await checkPrinterInterval());
    })();
  }, []);

  useEffect(() => {
    const connectionCheckInterval = setInterval(async () => {
      setIsOnline(await checkPrinterInterval());
    }, 2000);
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  async function checkPrinterInterval() {
    const beginPing = Date.now();
    const connection = await checkPrinterConnection();
    const endPing = Date.now();
    return {
      status: connection,
      ping: endPing - beginPing,
    };
  }

  return (
    <div
      className={`grid grid-rows-2 grid-cols-1 text-sm h-full rnd px-1 ${
        isOnline.status ? 'positive' : 'negative'
      }`}>
      <div className='row-span-1 col-span-1'>
        PTR
      </div>
      <div className='row-span-1 col-span-1'>
        {isOnline.status
          ? `${String(isOnline.ping).padStart(3, '0')} `
          : '---'}
      </div>
    </div>
  );
}
