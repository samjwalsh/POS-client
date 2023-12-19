import React, { useState, useEffect } from 'react';
import { checkPrinterConnection } from '../../tools/ipc';

export default function PrinterConnection() {
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0,
  });

  useEffect(() => {
    const connectionCheckInterval = setInterval(async () => {
      const beginPing = Date.now();
      const connection = await checkPrinterConnection();
      const endPing = Date.now();

      setIsOnline({
        status: connection,
        ping: endPing - beginPing,
      });
    }, 2000);
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  return (
    <div
      className={`grid grid-rows-2 grid-cols-1 text-sm ${
        isOnline.status ? 'positiveFill' : 'negativeFill'
      }`}>
      <div className='row-span-1 col-span-1'>
        P-{isOnline.status ? 'OK' : 'NC'}
      </div>
      <div className='row-span-1 col-span-1'>
        {isOnline.status ? `[${String(isOnline.ping).padStart(3, '0')}] ` : ''}
      </div>
    </div>
  );
}
