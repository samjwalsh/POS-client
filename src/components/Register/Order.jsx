import * as React from 'react';
import { useState } from 'react';

import playBeep from '../../tools/playBeep';

import euro from '../../assets/appicons/euro.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

import { addOrder, openCashDrawer } from '../../tools/ipc';

import PayCash, { calculateSubtotal } from './PayCash.jsx';
import useKeypad from '../Reusables/Keypad.jsx';
import useAlert from '../Reusables/Alert.jsx';
import OrderItem from '../Reusables/OrderItem.jsx';
import useConfirm from '../Reusables/ConfirmDialog.jsx';

export default function Order(props) {
  const { order, setOrder } = props;

  const [Keypad, keypad] = useKeypad();
  const [Confirm, confirm] = useConfirm();
  const [Alert, alert] = useAlert();
  const [payCash, setPayCash] = useState(false);

  async function handlePlusMinus() {
    playBeep();
    if (
      await confirm([
        'Use keypad?',
        'Continue',
        'Cancel',
        'Only use the keypad if there is no applicable item in the menu.',
      ])
    )
      return;

    const keypadValue = await keypad();
    if (keypadValue === 0) return;

    let temp_order = order;

    let miscWasDupe = false;
    temp_order.forEach((item, index) => {
      if (item.name === 'Misc' && item.price === keypadValue) {
        item.quantity++;
        miscWasDupe = true;
      }
    });
    if (!miscWasDupe) {
      temp_order.push({
        name: 'Misc',
        price: keypadValue,
        quantity: 1,
        addons: [],
      });
    }
    setOrder([...temp_order]);
  }

  async function handlePayment(paymentType) {
    playBeep();
    if (paymentType === 'card') {
      addOrder(props.order, 'Card');
      props.setOrder([]);
      setPayCash(false);
    } else if (payCash === true) {
      setPayCash(false);
    } else {
      openCashDrawer();
      setPayCash(true);
    }
  }

  async function handleOrderItemQuantityChange(direction, orderItem) {
    playBeep();

    order.forEach(async (item, index) => {
      if (orderItem == item) {
        let temp_order = order;

        if (direction === 'up') {
          if (orderItem.name === 'Voucher') {
            await alert('Use the voucher creator to create more vouchers');
            return;
          }
          if (orderItem.name === 'Redeem Voucher') {
            await alert('Use the voucher redeemer to redeem more vouchers');
            return;
          }
          temp_order[index].quantity++;
        } else if (orderItem.quantity > 1) {
          if (orderItem.name === 'Redeem Voucher') {
            await alert(
              'You cannot unredeem a voucher, you can create a new one with the same value in the voucher creator'
            );
            return;
          }
          temp_order[index].quantity--;
        } else {
          if (orderItem.name === 'Redeem Voucher') {
            await alert(
              'You cannot unredeem a voucher, you can create a new one with the same value in the voucher creator'
            );
            return;
          }
          temp_order.splice(index, 1);
        }
        setOrder([...temp_order]);
      }
    });
  }

  let subtotal = calculateSubtotal(order);
  let orderItems = order.map((orderItem, index) => {
    return (
      <div
        className='flex flex-row h-min w-full max-w-full gap-2'
        key={`${orderItem.name} [${orderItem.addons}]`}>
        <div
          className='btn btn-error h-full p-0 w-12'
          onContextMenu={() => handleOrderItemQuantityChange('down', orderItem)}
          onClick={() => handleOrderItemQuantityChange('down', orderItem)}>
          <img src={minusSVG} className='w-6 invert-icon' />
        </div>
        <OrderItem orderItem={orderItem} index={index} key={index.toString()} />
        <div
          className='btn btn-success h-full p-0 w-12'
          onContextMenu={() => handleOrderItemQuantityChange('up', orderItem)}
          onClick={() => handleOrderItemQuantityChange('up', orderItem)}>
          <img src={addSVG} className='w-6 fill-white invert-icon' />
        </div>
      </div>
    );
  });

  return (
    <>
      <Keypad />
      <Alert />
      <Confirm />
      <div className='col-span-4 row-span-1 h-auto self-stretch flex flex-col overflow-hidden border-l border-colour py-2'>
        {payCash === true ? (
          <PayCash
            order={order}
            setOrder={setOrder}
            setPayCash={setPayCash}
            keypad={keypad}
          />
        ) : (
          <div className='flex flex-col gap-2 h-full overflow-scroll no-scrollbar px-2'>
            {orderItems}
          </div>
        )}

        <div className=' grid grid-rows-[min-content, 1fr] grid-cols-1 gap-1 border-t border-colour px-2 pt-1'>
          <div className='row-span-1 col-span-1 flex justify-between w-full text-2xl'>
            <div className='text-left'>Total:</div>
            <div className='text-right num justify-end'>
              €{subtotal.toFixed(2)}
            </div>
          </div>
          <div className='row-span-1 col-span-1 flex gap-2 items-stretch h-20 text-2xl'>
            {payCash === true ? (
              <div
                className='p-2 btn btn-error h-full w-full text-2xl'
                onContextMenu={() => handlePayment('cash')}
                onClick={() => handlePayment('cash')}>
                Cancel
              </div>
            ) : (
              <>
                <div
                  className='btn btn-secondary h-full aspect-square'
                  onContextMenu={() => handlePlusMinus()}
                  onClick={() => handlePlusMinus()}>
                  <img src={euro} className='w-6 invert-icon' />
                </div>
                <div
                  className='btn text-2xl btn-primary h-full flex-grow'
                  onContextMenu={() => handlePayment('card')}
                  onClick={() => handlePayment('card')}>
                  Card
                </div>
                <div
                  className='btn text-2xl btn-primary h-full flex-grow'
                  onContextMenu={() => handlePayment('cash')}
                  onClick={() => handlePayment('cash')}>
                  Cash
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
