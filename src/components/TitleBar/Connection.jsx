import React, { useState, useEffect } from 'react';
import { checkConnection } from '../../tools/ipc';
import { string } from 'prop-types';

export default function Connection() {
  const [isOnline, setIsOnline] = useState({ status: true, ping: 0 });

  // const updateConnection = async () => {
  //   const beginPing = Date.now();
  //   setIsOnline(false)
  //   const connection = await checkConnection();
  //   const endPing = Date.now();

  //   setIsOnline({status: connection, ping: endPing - beginPing});
  // };
  // setInterval(updateConnection, 5000);
  // clearInterval();

  useEffect(() => {
    const interval = setInterval(async () => {
      const beginPing = Date.now();
      setIsOnline(false);
      const connection = await checkConnection();
      const endPing = Date.now();

      setIsOnline({ status: connection, ping: endPing - beginPing });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      TCP<div className='font-emoji'>{isOnline.status ? '🟢' : '🔴'}</div>[
      {isOnline.ping}]
    </>
  );
}
