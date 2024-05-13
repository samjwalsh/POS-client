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
import { cF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';
import ButtonStack from '../Reusables/ButtonStack.jsx';

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
    if (!keypadValue) return;

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
            await alert(
              'Error',
              'Use the voucher creator to create more vouchers'
            );
            return;
          }
          if (orderItem.name === 'Redeem Voucher') {
            await alert(
              'Error',
              'Use the voucher redeemer to redeem more vouchers'
            );
            return;
          }
          temp_order[index].quantity++;
        } else if (orderItem.quantity > 1) {
          if (orderItem.name === 'Redeem Voucher') {
            await alert(
              'Error',
              'You cannot unredeem a voucher, you can create a new one with the same value in the voucher creator'
            );
            return;
          }
          temp_order[index].quantity--;
        } else {
          if (orderItem.name === 'Redeem Voucher') {
            await alert(
              'Error',
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
        className='flex flex-row h-min w-full max-w-full gap-[1px]'
        key={`${orderItem.name} [${orderItem.addons}]`}>
        <Button
          type='danger'
          icon={minusSVG}
          className='w-20'
          center={true}
          onClick={() =>
            handleOrderItemQuantityChange('down', orderItem)
          }></Button>
        <OrderItem orderItem={orderItem} index={index} key={index.toString()} />
        <Button
          type='success'
          className='w-20'
          icon={addSVG}
          center={true}
          onClick={() =>
            handleOrderItemQuantityChange('up', orderItem)
          }></Button>
      </div>
    );
  });

  return (
    <>
      <Keypad />
      <Alert />
      <Confirm />
      <div className='col-span-4 row-span-1 h-auto self-stretch flex flex-col overflow-hidden border-l bc '>
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

        <div className=' grid grid-rows-[min-content, 1fr] grid-cols-1 gap-1 border-t bc px-2 pt-1 pb-2'>
          <div className='row-span-1 col-span-1 flex justify-between w-full text-2xl px-1'>
            <div className='text-left'>Total:</div>
            <div className='text-right num justify-end'>{cF(subtotal)}</div>
          </div>
          <div className='row-span-1 col-span-1 flex gap-1 items-stretch h-20 text-2xl'>
            {payCash === true ? (
              <Button
                type='danger'
                className='w-full'
                size='large'
                onClick={() => handlePayment('cash')}>
                Cancel
              </Button>
            ) : (
                <ButtonStack className='h-full'>
                  <Button
                    size='large'
                    type='secondary'
                    className='aspect-square'
                    onClick={() => handlePlusMinus()}
                    icon={euro}></Button>
                  <Button
                    size='large'
                    type='primary'
                    className='flex-grow'
                    onClick={() => handlePayment('card')}>
                    Card
                  </Button>
                  <Button
                    size='large'
                    type='primary'
                    className='flex-grow'
                    onClick={() => handlePayment('cash')}>
                    Cash
                  </Button>
                </ButtonStack>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
