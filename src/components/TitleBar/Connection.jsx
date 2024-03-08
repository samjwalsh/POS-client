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
      className={`flex flex-col justify-between h-full p-1 text-error-content bg${
        isOnline.status ? '-success' : '-error'
      }`}>
      <div>NET</div>
      <div className='num'>
        {isOnline.status ? `${String(isOnline.ping).padStart(3, '0')} ` : '---'}
      </div>
    </div>
  );
}
