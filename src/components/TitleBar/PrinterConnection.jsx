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
    }, 5000);
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  return (
    <>
      PTR<div className='font-emoji'>{isOnline.status ? '🟢' : '🔴'}</div>
      {isOnline.status ? `[${String(isOnline.ping).padStart(2, '0')}] ` : ''}
    </>
  );
}
