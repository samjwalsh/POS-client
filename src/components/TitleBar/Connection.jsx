import React, { useState, useEffect } from 'react';
import { checkConnection } from '../../tools/ipc';

export default function Connection() {
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0,
  });

  useEffect(() => {
    const connectionCheckInterval = setInterval(async () => {
      const beginPing = Date.now();
      const connection = await checkConnection();
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
      TCP<div className='font-emoji'>{isOnline.status ? '🟢' : '🔴'}</div>
      {isOnline.status ? `[${String(isOnline.ping).padStart(3, '0')}] ` : ''}
    </>
  );
}
