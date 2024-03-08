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
      className={`flex flex-col justify-between text-error-content h-full p-1 bg${
        isOnline.status ? '-success' : '-error'
      }`}>
      <div>PTR</div>
      <div className='num'>
        {isOnline.status ? `${String(isOnline.ping).padStart(3, '0')} ` : '---'}
      </div>
    </div>
  );
}
