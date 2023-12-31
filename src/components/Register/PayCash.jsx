import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState } from 'react';

import log from '../../tools/logging';
import playBeep from '../../tools/playBeep';
import { addOrder, openCashDrawer } from '../../tools/ipc';
import useKeypad from '../Reusables/Keypad.jsx';

export default function PayCash(props) {
  const { order, setOrder, setPayCash, keypad } = props;

  const [change, setChange] = useState(0);

  openCashDrawer();
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
      const tendered = await keypad(0, 'currency');
      let change = 0;
      if (typeof tendered === 'number') {
        change = tendered - subtotal;
        setChange(change);
      }
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='grid grid-cols-2 grid-rows-5 gap-2 h-full p-2 pb-1 text-2xl'>
        <div
          className='col-span-2 row-span-1  primary btn cnter-items'
          onContextMenu={() => handleButtonPress('custom')}
          onTouchStart={() => handleButtonPress('custom')}>
          Custom
        </div>
        <div
          className='col-span-1 row-span-1 num  secondary btn cnter-items'
          onContextMenu={() => handleButtonPress(50)}
          onTouchStart={() => handleButtonPress(50)}>
          €50
        </div>
        <div
          className='col-span-1 row-span-1 num  secondary  btn  cnter-items'
          onContextMenu={() => handleButtonPress(20)}
          onTouchStart={() => handleButtonPress(20)}>
          €20
        </div>
        <div
          className='col-span-1 row-span-1 num  secondary  btn  cnter-items'
          onContextMenu={() => handleButtonPress(10)}
          onTouchStart={() => handleButtonPress(10)}>
          €10
        </div>
        <div
          className='col-span-1 row-span-1 num  secondary  btn  cnter-items'
          onContextMenu={() => handleButtonPress(5)}
          onTouchStart={() => handleButtonPress(5)}>
          €5
        </div>

        <div
          className='col-span-2 row-span-2  positive  btn  cnter-items'
          onContextMenu={() => handleButtonPress('exit')}
          onTouchStart={() => handleButtonPress('exit')}>
          DONE
        </div>
      </div>
      <div className='flex justify-between w-full text-2xl px-2 pb-1'>
        <div className=''>Change:</div>
        <div className='text-right num justify-end'>€{change.toFixed(2)}</div>
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
