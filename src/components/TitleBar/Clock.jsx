import React, { useState } from 'react';

export default function Clock() {
  // For digital clock
  let time = new Date().toLocaleTimeString();
  const [ctime, setCTime] = useState();
  const updateTime = () => {
    time = new Date().toLocaleTimeString('en-IE', { hour12: false });
    setCTime(time);
  };

  setInterval(updateTime, 1000);
  return (
    <>
      <div>{ctime}</div>
    </>
  );
}
