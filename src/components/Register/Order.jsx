import * as React from 'react';
import { useState } from 'react';

import log from '../../tools/logging';
import playBeep from '../../tools/playBeep';

import euro from '../../assets/appicons/euro.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

import { addOrder } from '../../tools/ipc';

import PayCash, { calculateSubtotal } from './PayCash.jsx';
import useKeypad from '../Reusables/Keypad.jsx';

export default function Order(props) {
  const { order, setOrder } = props;

  const [Keypad, keypad] = useKeypad();
  const [payCash, setPayCash] = useState(false);

  async function handlePlusMinus() {
    playBeep();
    const keypadValue = await keypad('currency');
    if (keypadValue === 0) return;
    log(`Update the adjustment in the order`);
    let temp_order = order;
    temp_order.push({
      name: 'Adjustment',
      price: keypadValue,
      quantity: 1,
      addons: [],
    });
    setOrder([...temp_order]);
  }

  function handlePayment(paymentType) {
    playBeep();
    if (paymentType === 'card') {
      log(`Payment type card selected, resetting order`);
      addOrder(props.order, 'Card');
      props.setOrder([]);
      setPayCash(false);
    } else if (payCash === true) {
      setPayCash(false);
    } else {
      log(`Payment type cash selected, turning on keypad`);
      setPayCash(true);
    }
  }

  function handleOrderItemQuantityChange(direction, orderItem) {
    playBeep();

    order.forEach((item, index) => {
      log(`Reducing quantity of item ${item.name} in order by 1`);
      if (orderItem == item) {
        let temp_order = order;

        if (direction === 'up') {
          temp_order[index].quantity++;
        } else if (orderItem.quantity > 1) {
          temp_order[index].quantity--;
        } else {
          temp_order.splice(index, 1);
        }
        setOrder([...temp_order]);
      }
    });
  }

  let subtotal = calculateSubtotal(order);
  log(`Calculating subtotal and generating HTML`);
  let orderItems = order.map((orderItem, index) => {
    log(`Adding ${orderItem.name} to HTML`);
    let itemClasses = 'flex h-min w-full gap-2';
    // if (index + 1 !== order.length) {
    //   itemClasses += ' border border-colour';
    // }
    return (
      <div
        className={itemClasses}
        key={`${orderItem.name} [${orderItem.addons}]`}>
        <div
          className='col-span-1 row-span-2 cnter-items btn--minus w-20 rnd shadow'
          onContextMenu={() => handleOrderItemQuantityChange('down', orderItem)}
          onTouchStart={() => handleOrderItemQuantityChange('down', orderItem)}>
          <img src={minusSVG} className='w-6 invert-icon' />
        </div>
        <div className='w-full grid grid-cols-[1fr_min-content] grid-rows-[min-content, 1fr] p-1 gradient1 rnd shadow'>
          <div className='col-span-1 row-span-1 text-lg'>
            {orderItem.name +
              (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : '')}
          </div>
          <div className='col-span-1 row-span-1 text-lg font-mono text-right'>
            €{(orderItem.price * orderItem.quantity).toFixed(2)}
          </div>

          <div className='col-span-1 row-span-1 mr-1 text-sm '>
            {orderItem.addons === undefined ? '' : orderItem.addons.join(', ')}
          </div>
          <div className='col-span-1 row-span-1 whitespace-nowrap text-sm font-mono text-right'>
            €{orderItem.price.toFixed(2)} EA
          </div>
        </div>
        <div
          className='col-span-1 row-span-2 cnter-items justify-self-end btn--plus w-20 rnd shadow'
          onContextMenu={() => handleOrderItemQuantityChange('up', orderItem)}
          onTouchStart={() => handleOrderItemQuantityChange('up', orderItem)}>
          <img src={addSVG} className='w-6 fill-white invert-icon' />
        </div>
      </div>
    );
  });

  log(`Rendering order container`);
  return (
    <>
      <Keypad />

      <div className='col-span-4 row-span-1 h-auto self-stretch flex flex-col  overflow-hidden border-l border-colour'>
        {payCash === true ? (
          <PayCash
            order={order}
            setOrder={setOrder}
            setPayCash={setPayCash}
            keypad={keypad}
          />
        ) : (
          <div className='flex flex-col gap-2 h-full overflow-scroll no-scrollbar p-2'>
            {orderItems}
          </div>
        )}

        <div className=' grid grid-rows-[min-content, 1fr] grid-cols-1 gap-1 border-t border-colour p-2 pt-1'>
          <div className='row-span-1 col-span-1 flex justify-between w-full text-2xl'>
            <div className='text-left'>Total</div>
            <div className='text-right font-mono justify-end'>
              €{subtotal.toFixed(2)}
            </div>
          </div>
          <div className='row-span-1 col-span-1 flex gap-2 items-stretch h-20 text-lg uppercase font-bold'>
            <div
              className='gradientblack rnd shadow cnter-items w-48'
              onContextMenu={() => handlePlusMinus()}
              onTouchStart={() => handlePlusMinus()}>
              <img src={euro} className='w-6 invert-icon' />
            </div>
            <div
              className='btn--plus  rnd cnter-items w-full text-lg uppercase font-bold'
              onContextMenu={() => handlePayment('card')}
              onTouchStart={() => handlePayment('card')}>
              Card
            </div>
            <div
              className='btn--plus rnd cnter-items w-full'
              onContextMenu={() => handlePayment('cash')}
              onTouchStart={() => handlePayment('cash')}>
              Cash
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
