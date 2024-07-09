import React, { useState, useEffect } from 'react';

export default function Clock() {
  // For digital clock
  const now = new Date();
  const [clock, setClock] = useState({
    time: now.toLocaleTimeString('en-IE'),
    date: `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear().toString().substring(2, 4)}`,
  });

  useEffect(() => {
    const getTimeInterval = setInterval(async () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-IE');
      const date = `${now.getDate().toString().padStart(2, '0')}/${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${now.getFullYear().toString().substring(2, 4)}`;
      setClock({ time, date });
    }, 1000);
    return () => {
      clearInterval(getTimeInterval);
    };
  }, []);

  return (
    <>
      <div className='flex flex-col justify-between bg-secondary text-secondary-content num p-1'>
        <div>{clock.time}</div>
        <div>{clock.date}</div>
      </div>
    </>
  );
}
