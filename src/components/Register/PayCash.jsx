import * as React from 'react';
import { useState } from 'react';

import infoSVG from '../../assets/appicons/info.svg';

import useAlert from '../Reusables/Alert.jsx';

import playBeep from '../../tools/playBeep';
import { addOrder, openCashDrawer } from '../../tools/ipc';

export default function PayCash(props) {
  const { order, setOrder, setPayCash, keypad } = props;

  const [change, setChange] = useState(0);

  const [Alert, alert] = useAlert();

  async function handleButtonPress(value) {
    playBeep();
    if (value === 'exit') {
      setOrder([]);
      setPayCash(false);
      setChange(0);
      addOrder(order, 'Cash');
    }

    const subtotal = calculateSubtotal(order);

    let change = 0;
    if (typeof value === 'number') {
      change = value - subtotal;

      setChange(change);
    }

    if (value === 'custom') {
      const tendered = await keypad(0, 'currency');
      let change = 0;
      if (typeof tendered === 'number') {
        change = tendered - subtotal;
        setChange(change);
      }
    }
  }

  async function handlePayCashHelp() {
    await alert(
      `You can use the buttons labelled with 5, 10, 20 and 50 euro to calculate your change, or press custom and key in an amount. You don't have to use these buttons if you already know what the change is. Press done to finish the transaction.`
    );
  }

  return (
<>
      <Alert />
      <div className='flex flex-col h-full p-2 pb-1'>
        <div className='grid grid-cols-2 grid-rows-5 gap-2 h-full flex-grow'>
          <div className='col-span-2 row-span-1 flex h-auto flex-row gap-2'>
            <div
              className=' btn btn-secondary h-auto text-2xl flex-grow '
              onContextMenu={() => handleButtonPress('custom')}
              onClick={() => handleButtonPress('custom')}>
              Custom
            </div>
            <div
              className='btn-primary btn h-auto aspect-square'
              onContextMenu={(e) => handlePayCashHelp()}
              onClick={(e) => handlePayCashHelp()}>
              <img src={infoSVG} className='w-6 invert-icon' />
            </div>
          </div>
          <div
            className='col-span-1 row-span-1 num btn btn-neutral h-auto text-2xl'
            onContextMenu={() => handleButtonPress(50)}
            onClick={() => handleButtonPress(50)}>
            €50
          </div>
          <div
            className='col-span-1 row-span-1 num btn btn-neutral h-auto text-2xl'
            onContextMenu={() => handleButtonPress(20)}
            onClick={() => handleButtonPress(20)}>
            €20
          </div>
          <div
            className='col-span-1 row-span-1 num btn btn-neutral h-auto text-2xl'
            onContextMenu={() => handleButtonPress(10)}
            onClick={() => handleButtonPress(10)}>
            €10
          </div>
          <div
            className='col-span-1 row-span-1 num btn btn-neutral h-auto text-2xl'
            onContextMenu={() => handleButtonPress(5)}
            onClick={() => handleButtonPress(5)}>
            €5
          </div>

          <div
            className='col-span-2 row-span-2 btn btn-primary h-auto text-2xl'
            onContextMenu={() => handleButtonPress('exit')}
            onClick={() => handleButtonPress('exit')}>
            Done
          </div>
        </div>
        <div className='flex justify-between w-full text-2xl pt-1'>
          <div className=''>Change:</div>
          <div className='text-right num justify-end'>€{change.toFixed(2)}</div>
        </div>
      </div>
      </>
  );
}

export function calculateSubtotal(order) {
  let subtotal = 0;
  order.forEach((orderItem) => {
    subtotal += orderItem.price * orderItem.quantity;
  });
  return subtotal;
}
