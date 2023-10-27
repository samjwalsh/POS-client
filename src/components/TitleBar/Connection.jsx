import React, { useState, useEffect } from 'react';
import { checkConnection } from '../../tools/ipc';
import { string } from 'prop-types';

export default function Connection() {
  const [isOnline, setIsOnline] = useState({
    status: true,
    ping: 0
  });

  useEffect(() => {
    const connectionCheckInterval = setInterval(async () => {
      setIsOnline({
        status: false
      })

      const beginPing = Date.now();
      const connection = await checkConnection();
      const endPing = Date.now();

      setIsOnline({
        status: connection,
        ping: endPing - beginPing
      });
    }, 5000);
    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, []);

  return (
    <>
      TCP<div className='font-emoji'>{isOnline.status ? '🟢' : '🔴'}</div>[
      {isOnline.ping}]
    </>
  );
}
