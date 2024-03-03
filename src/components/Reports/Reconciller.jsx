import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import { addOrder, getAllOrders } from '../../tools/ipc.js';
const useReconciller = (orders, setOrders, stats) => {
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
    const totalCard = stats.cardTotal;
    const totalCash = stats.cashTotal;

    if (Math.abs(reconcileAmt.card - totalCard) >= 0.005) {
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
    if (Math.abs(reconcileAmt.cash - totalCash) >= 0.005) {
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
    promise?.resolve(true);
    handleClose();
  };

  const createHTML = () => {
    return (
      <div className='w-96 flex flex-col gap-2 text-2xl p-4 border bc'>
        <div className='flex flex-row justify-between'>
          <div className=' cnter mt-2 title'>Reconcile Totals</div>
          <div
            className='btn btn-error text-lg'
            onAuxClick={() => handleClickClose()}
            onTouchEnd={() => handleClickClose()}>
            Cancel
          </div>
        </div>
        <div className='text-xl font-light'>
          Enter the total amount of cash and card for the day. This must match
          the totals written on the day sheet.
        </div>
        <div className='w-full border-b bc'></div>
        <div className='flex flex-row justify-between'>
          <div className='cnter'>Total Cash:</div>
          <div
            className='btn btn-neutral text-lg'
            onAuxClick={() => handleSetValue('cash')}
            onTouchEnd={() => handleSetValue('cash')}>
            €{reconcileAmt.cash.toFixed(2)}
            <img src={dropdownSVG} className='w-6 icon' />
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='cnter'>Total Card:</div>
          <div
            className='btn btn-neutral text-lg'
            onAuxClick={() => handleSetValue('card')}
            onTouchEnd={() => handleSetValue('card')}>
            €{reconcileAmt.card.toFixed(2)}
            <img src={dropdownSVG} className='w-6 icon' />
          </div>
        </div>
        <div className='w-full border-b bc'></div>

        <div className='flex flex-row justify-between title'>
          <div className='cnter'>Z-Total:</div>
          <div className='cnter'>
            €{(reconcileAmt.cash + reconcileAmt.card).toFixed(2)}
          </div>
        </div>
        <div className='w-full border-b bc'></div>
        <div
          className='w-full btn h-full btn-primary text-lg'
          onAuxClick={(e) => handleReconcile()}
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
