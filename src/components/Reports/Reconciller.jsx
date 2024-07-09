import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import Button from '../Reusables/Button.jsx';
import useAlert from '../Reusables/Alert.jsx';
import { addOrder, reconcile } from '../../tools/ipc.js';
import { cF } from '../../tools/numbers.js';
import Modal from '../Reusables/Modal.jsx';
import NumberInput from '../Reusables/NumberInput.jsx';
import ButtonStack from '../Reusables/ButtonStack.jsx';
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
    playBeep();
    reconcile(reconcileAmt.card, reconcileAmt.cash)
    promise?.resolve(true);
    handleClose();
  };

  const createHTML = () => {
    return (
      <>
        <div className='flex flex-col w-full px-2'>
          <div className='pb-2 text-lg'>
            {mode === 'Z'
              ? `Enter the total amount of cash and card for the day. This must match
          the totals written on the day sheet.`
              : `Enter the total amount of cash and card made so far.`}
          </div>
          <div>Total Cash</div>
          <NumberInput
            value={cF(reconcileAmt.cash)}
            onClick={() => handleSetValue('cash')}></NumberInput>

          <div>Total Card</div>
          <NumberInput
            value={cF(reconcileAmt.card)}
            onClick={() => handleSetValue('card')}></NumberInput>

          <div className='flex flex-row justify-between title py-2'>
            <div className='cnter'>{mode}-Total</div>
            <div className='cnter'>
              {cF(reconcileAmt.cash + reconcileAmt.card)}
            </div>
          </div>
        </div>
        <ButtonStack>
          <Button
            type='secondary'
            className='flex-grow basis-1'
            onClick={handleClickClose}>
            Cancel
          </Button>
          <Button
            type={mode === 'Z' ? 'danger' : 'primary'}
            className='flex-grow basis-1'
            onClick={handleReconcile}>
            {mode === 'Z' ? 'Record Z-Totals' : 'Update X-Total'}
          </Button>
        </ButtonStack>
      </>
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
          <Modal title={mode === 'Z' ? 'Record Z-Totals' : 'Update X-Total'}>{createHTML()}</Modal>
        </>
      );
  };
  return [ReconcillerDialog, Reconciller];
};

export default useReconciller;
