import React, { useState, useEffect } from 'react';
import { checkConnection } from '../../tools/ipc';

export default function Connection() {
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0,
  });

  useEffect(() => {
    (async () => {
      setIsOnline(await checkConnectionInterval());
    })();
  }, []);

  useEffect(() => {
    const connectionCheckInterval = setInterval(async () => {
      setIsOnline(await checkConnectionInterval());
    }, 5000);
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  async function checkConnectionInterval() {
    const beginPing = Date.now();
    const connection = await checkConnection();
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
        NET
      </div>
      <div className='row-span-1 col-span-1'>
        {isOnline.status
          ? `${String(isOnline.ping).padStart(3, '0')} `
          : '---'}
      </div>
    </div>
  );
}
