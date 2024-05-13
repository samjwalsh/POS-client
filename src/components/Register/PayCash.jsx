import * as React from 'react';
import { useState } from 'react';

import infoSVG from '../../assets/appicons/info.svg';

import useAlert from '../Reusables/Alert.jsx';
import Button from '../Reusables/Button.jsx';

import playBeep from '../../tools/playBeep';
import { addOrder, openCashDrawer } from '../../tools/ipc';
import { cF } from '../../tools/numbers.js';
import { useInterval } from '../Reusables/Wait.jsx';

export default function PayCash(props) {
  const { order, setOrder, setPayCash, keypad } = props;

  const [change, setChange] = useState(0);

  const [pos, setPos] = useState(0);

  const step = 1000;
  const totalTime = 20;
  useInterval(() => {
    if (pos < 100) setPos(pos + (step / (totalTime * 1000)) * 100);
    else {
      setPos(0);
      handleButtonPress('exit');
    }
  }, step);

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
      'Change Calculator',
      `You can use the buttons labelled with 5, 10, 20 and 50 euro to calculate your change, or press custom and key in an amount. You don't have to use these buttons if you already know what the change is. Press done to finish the transaction.`
    );
  }

  return (
    <>
      <Alert />
      <div className='flex flex-col h-full p-2 pb-1'>
        <div className='grid grid-cols-2 grid-rows-5 gap-2 h-full flex-grow'>
          <div className='col-span-2 row-span-1 flex h-auto flex-row gap-[1px]'>
            <Button
              type='secondary'
              className='w-full'
              size='large'
              onClick={() => handleButtonPress('custom')}>
              Custom
            </Button>
            <Button
              type='ghost'
              icon={infoSVG}
              className='aspect-square'
              onClick={handlePayCashHelp}></Button>
          </div>
          <Button
            type='tertiary'
            size='large'
            className='col-span-1 row-span-1'
            onClick={() => handleButtonPress(50)}>
            €50
          </Button>
          <Button
            type='tertiary'
            size='large'
            className='col-span-1 row-span-1'
            onClick={() => handleButtonPress(20)}>
            €20
          </Button>
          <Button
            type='tertiary'
            size='large'
            className='col-span-1 row-span-1'
            onClick={() => handleButtonPress(10)}>
            €10
          </Button>
          <Button
            type='tertiary'
            size='large'
            className='col-span-1 row-span-1'
            onClick={() => handleButtonPress(5)}>
            €5
          </Button>

          <Button
            type='primary'
            size='large'
            className='col-span-2 row-span-2 relative'
            onClick={() => handleButtonPress('exit')}>
            Done
            <div
              className={`absolute top-0 left-0 h-full w-0 opacity-75 bg-white`}
              style={{
                width: pos + '%',
                transition: 'all ' + step / 1000 + 's linear',
              }}></div>
          </Button>
        </div>
        <div className='flex justify-between w-full text-2xl pt-1 px-1'>
          Change:
          <div className='text-right num justify-end'>{cF(change)}</div>
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
