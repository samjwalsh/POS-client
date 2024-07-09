import * as React from 'react';
import { useEffect, useState } from 'react';
import { getRollingRevenue } from '../../tools/ipc';
import { cF } from '../../tools/numbers';
import { useInterval } from '../Reusables/Wait.jsx';

export default function RollingRevenue() {
  const [rollingRevenue, setRollingRevenue] = useState(0);

  useEffect(() => {
    (() => {
      getRollingRevenue().then((rollingRevenue) => {
        setRollingRevenue(rollingRevenue);
      });
    })();
  }, []);

  useInterval(() => {
    getRollingRevenue().then((rollingRevenue) =>
      setRollingRevenue(rollingRevenue)
    );
  }, 1000);

  return <>{cF(rollingRevenue)}</>;
}
