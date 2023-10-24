import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';

import log from '../../tools/logging';
import playBeep from '../../tools/playBeep';
import { addOrder } from '../../tools/ipc';
import useKeypad from '../Reusables/Keypad.jsx';

export default function PayCash(props) {
  const { order, setOrder, setPayCash, keypad } = props;

  const [change, setChange] = useState(0);

  async function handleButtonPress(value) {
    playBeep();
    log(`Button for paying with cash clicked`);
    if (value === 'exit') {
      log(`Exiting the pay cash section and resetting the order`);
      setOrder([]);
      setPayCash(false);
      setChange(0);
      addOrder(order, 'Cash');
    }

    const subtotal = calculateSubtotal(order);

    log(`Calculating the subtotal`);

    let change = 0;
    if (typeof value === 'number') {
      change = value - subtotal;

      setChange(change);
    }

    log(`Calculating the change`);

    if (value === 'custom') {
      log(`Enabling the keypad`);
      const tendered = await keypad('currency');
      let change = 0;
      if (typeof tendered === 'number') {
        change = tendered - subtotal;
        setChange(change);
      }
    }
  }

  return (
    <div className='flex flex-col gap-2 h-full'>
      <div className='grid grid-cols-2 grid-rows-5 gap-1 p-1 h-full'>
        <div
          className='col-span-2 row-span-1  text-3xl gradientblack text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress('custom')}>
          CUSTOM
        </div>
        <div
          className='col-span-1 row-span-1 font-mono text-3xl gradientblack text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress(50)}>
          €50
        </div>
        <div
          className='col-span-1 row-span-1 font-mono text-3xl gradientblack text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress(20)}>
          €20
        </div>
        <div
          className='col-span-1 row-span-1 font-mono text-3xl gradientblack text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress(10)}>
          €10
        </div>
        <div
          className='col-span-1 row-span-1 font-mono text-3xl gradientblack text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress(5)}>
          €5
        </div>

        <div
          className='col-span-2 row-span-2 text-3xl gradientgreen text-white rounded-lg shadow-lg cnter-items'
          onClick={() => handleButtonPress('exit')}>
          DONE
        </div>
      </div>
      <div className='flex justify-between w-full text-2xl pr-1 pl-1'>
        <div className=''>Change</div>
        <div className='text-right font-mono justify-end'>
          €{change.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export function calculateSubtotal(order) {
  let subtotal = 0;
  order.forEach((orderItem) => {
    subtotal += orderItem.price * orderItem.quantity;
  });
  return subtotal;
}
