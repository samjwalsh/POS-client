import * as React from 'react';
import { useEffect, useState } from 'react';
import { getRollingRevenue } from '../../tools/ipc';
import { cF } from '../../tools/numbers';

export default function RollingRevenue() {
  const [rollingRevenue, setRollingRevenue] = useState(0);

  useEffect(() => {
    (() => {
      getRollingRevenue().then((rollingRevenue) => {
        setRollingRevenue(rollingRevenue);
      });
    })();
  }, []);

  useEffect(() => {
    const rollingRevenueInterval = setInterval(() => {
      getRollingRevenue().then((rollingRevenue) => {
        setRollingRevenue(rollingRevenue);
      });
    }, 1000);
    return () => {
      clearInterval(rollingRevenueInterval);
    };
  }, []);

  return (
    <div className='flex flex-row w-full justify-between pb-2 text-base'>
      <div className=''>Hourly Rolling Revenue:</div>
      <div className='num text-right justify-end'>
        {cF(rollingRevenue)}
      </div>
    </div>
  );
}
