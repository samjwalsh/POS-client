import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import { addOrder, getAllOrders } from '../../tools/ipc.js';
const useReconciller = (orders, setOrders) => {
  const [promise, setPromise] = useState(null);
  const [reconcileAmt, setReconcileAmt] = useState({
    card: 0,
    cash: 0,
  });
  const [Keypad, keypad] = useKeypad('currency');
  const [Confirm, confirm] = useConfirm();
  const [Alert, alert] = useAlert();

  const Reconciller = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setReconcileAmt({
      card: 0,
      cash: 0,
    });
  };

  const handleClickClose = () => {
    playBeep();
    promise?.resolve(false);
    handleClose();
  };

  const handleSetValue = async (type) => {
    playBeep();
    const value = await keypad();
    if (value < 0) return;
    if (type === 'card') {
      setReconcileAmt({
        cash: reconcileAmt.cash,
        card: value,
      });
    } else {
      setReconcileAmt({
        cash: value,
        card: reconcileAmt.card,
      });
    }
  };

  const handleReconcile = async () => {
    let totalCard = 0;
    let totalCash = 0;
    for (const order of orders) {
      if (order.paymentMethod === 'Card') {
        totalCard += order.subtotal;
      } else {
        totalCash += order.subtotal;
      }
    }
    if (reconcileAmt.card != totalCard) {
      addOrder(
        [
          {
            name: 'Reconcilliation Balance Adjustment',
            price: reconcileAmt.card - totalCard,
            quantity: 1,
          },
        ],
        'Card'
      );
    }
    if (reconcileAmt.cash != totalCash) {
      addOrder(
        [
          {
            name: 'Reconcilliation Balance Adjustment',
            price: reconcileAmt.cash - totalCash,
            quantity: 1,
          },
        ],
        'Cash'
      );
    }
    const storedOrders = await getAllOrders();
    setOrders([...storedOrders]);
    promise?.resolve(true);
    handleClose();
  };

  const createHTML = () => {
    return (
      <div className='w-96 flex flex-col gap-2 text-2xl p-4'>
        <div className='flex flex-row justify-between'>
          <div className='text-3xl cnter-items mt-2'>Reconcile Totals</div>
          <div
            className='btn btn-error text-lg'
            onContextMenu={() => handleClickClose()}
            onTouchEnd={() => handleClickClose()}>
            Cancel
          </div>
        </div>
        <div className='text-xl'>
          Enter the total amount of cash and card for the day. This must match
          the totals written on the day sheet.
        </div>
        <div className='w-full border-b border-colour'></div>
        <div className='flex flex-row justify-between'>
          <div className='cnter-items'>Total Cash:</div>
          <div
            className='btn btn-neutral text-lg'
            onContextMenu={() => handleSetValue('cash')}
            onTouchEnd={() => handleSetValue('cash')}>
            €{reconcileAmt.cash.toFixed(2)}
            <img src={dropdownSVG} className='w-6 invert-icon' />
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='cnter-items'>Total Card:</div>
          <div
            className='btn btn-neutral text-lg'
            onContextMenu={() => handleSetValue('card')}
            onTouchEnd={() => handleSetValue('card')}>
            €{reconcileAmt.card.toFixed(2)}
            <img src={dropdownSVG} className='w-6 invert-icon' />
          </div>
        </div>
        <div className='w-full border-b border-colour'></div>

        <div className='flex flex-row justify-between text-3xl'>
          <div className='cnter-items'>Z-Total:</div>
          <div className='cnter-items'>
            €{(reconcileAmt.cash + reconcileAmt.card).toFixed(2)}
          </div>
        </div>
        <div className='w-full border-b border-colour'></div>
        <div
          className='w-full btn h-full btn-primary text-lg'
          onContextMenu={(e) => handleReconcile()}
          onTouchEnd={(e) => handleReconcile()}>{`Record Z-Total as €${(
          reconcileAmt.card + reconcileAmt.cash
        ).toFixed(2)}`}</div>
      </div>
    );
  };

  const ReconcillerDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Alert />
          <Confirm />
          <Keypad />
          <div className='fixed h-screen w-screen z-10'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background rounded-box'>
              {createHTML()}
            </div>
          </div>
        </>
      );
  };
  return [ReconcillerDialog, Reconciller];
};

export default useReconciller;
