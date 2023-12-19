import React, { useState, useEffect } from 'react';

export default function Clock() {
  // For digital clock
  const [ctime, setCTime] = useState(
    new Date().toLocaleTimeString('en-IE', { hour12: false })
  );

  useEffect(() => {
    const getTimeInterval = setInterval(async () => {
      let time = new Date().toLocaleTimeString('en-IE', { hour12: false });
      setCTime(time);
    }, 1000);
    return () => {
      clearInterval(getTimeInterval);
    };
  }, []);

  return (
    <>
      <div>{ctime}</div>
    </>
  );
}
