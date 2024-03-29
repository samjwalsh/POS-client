import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import { addOrder } from '../../tools/ipc.js';
import { cF } from '../../tools/numbers.js';
const useReconciller = (props) => {
  const { cashTotal, cardTotal } = props;
  const [promise, setPromise] = useState(null);
  const [reconcileAmt, setReconcileAmt] = useState({
    card: 0,
    cash: 0,
  });
  const [Keypad, keypad] = useKeypad('currency');
  const [Confirm, confirm] = useConfirm();
  const [Alert, alert] = useAlert();

  const [mode, setMode] = useState();

  const Reconciller = (mode, cashTotal, cardTotal) =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
      if (mode === 'X') setReconcileAmt({ cash: cashTotal, card: cardTotal });
      setMode(mode);
    });

  const handleClose = () => {
    setPromise(null);
    setReconcileAmt({
      card: 0,
      cash: 0,
    });
    setMode();
  };

  const handleClickClose = () => {
    playBeep();
    promise?.resolve(false);
    handleClose();
  };

  const handleSetValue = async (type) => {
    playBeep();
    const value = await keypad();
    if (typeof value !== 'number') return;
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
    if (Math.abs(reconcileAmt.card - cardTotal) >= 0.005) {
      addOrder(
        [
          {
            name: 'Reconcilliation Balance Adjustment',
            price: reconcileAmt.card - cardTotal,
            quantity: 1,
          },
        ],
        'Card'
      );
    }
    if (Math.abs(reconcileAmt.cash - cashTotal) >= 0.005) {
      addOrder(
        [
          {
            name: 'Reconcilliation Balance Adjustment',
            price: reconcileAmt.cash - cashTotal,
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
          {mode === 'Z'
            ? `Enter the total amount of cash and card for the day. This must match
          the totals written on the day sheet.`
            : `Enter the total amount of cash and card made so far.`}
        </div>
        <div className='w-full border-b bc'></div>
        <div className='flex flex-row justify-between'>
          <div className='cnter'>Total Cash:</div>
          <div
            className='btn btn-neutral text-lg'
            onAuxClick={() => handleSetValue('cash')}
            onTouchEnd={() => handleSetValue('cash')}>
            {cF(reconcileAmt.cash)}
            <img src={dropdownSVG} className='w-6 icon' />
          </div>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='cnter'>Total Card:</div>
          <div
            className='btn btn-neutral text-lg'
            onAuxClick={() => handleSetValue('card')}
            onTouchEnd={() => handleSetValue('card')}>
            {cF(reconcileAmt.card)}
            <img src={dropdownSVG} className='w-6 icon' />
          </div>
        </div>
        <div className='w-full border-b bc'></div>

        <div className='flex flex-row justify-between title'>
          <div className='cnter'>{mode}-Total:</div>
          <div className='cnter'>
            {cF(reconcileAmt.cash + reconcileAmt.card)}
          </div>
        </div>
        <div className='w-full border-b bc'></div>
        <div
          className='w-full btn h-full btn-primary text-lg'
          onAuxClick={(e) => handleReconcile()}
          onTouchEnd={(e) => handleReconcile()}>{`Record ${mode}-Total as ${cF(reconcileAmt.card + reconcileAmt.cash)}`}</div>
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
