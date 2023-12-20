import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import { createVouchers } from '../../tools/ipc.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import { handleAddToOrder } from './ItemPage.jsx';
const useVoucherCreator = (currentOrder, setCurrentOrder) => {
  const [promise, setPromise] = useState(null);
  const [voucherState, setVoucherState] = useState({
    quantity: 0,
    value: 0,
  });
  const [clickable, setClickable] = useState(true);
  const [Keypad, keypad] = useKeypad('currency');
  const [Choice, choice] = useConfirm();
  const [Alert, alert] = useAlert();

  const voucherCreator = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setVoucherState({
      quantity: 0,
      value: 0,
    });
    setClickable(true);
  };

  const handleSetQuantity = async () => {
    playBeep();
    const quantity = await keypad(0, 'passcode');
    if (quantity >= 0) {
      setVoucherState({
        value: voucherState.value,
        quantity,
      });
    }
  };

  const handleSetValue = async () => {
    playBeep();
    const value = await keypad();
    if (value > 0) {
      setVoucherState({
        value,
        quantity: voucherState.quantity,
      });
    }
  };

  const handleCreateVouchers = async () => {
    if (!clickable) return;
    playBeep();
    const quantity = voucherState.quantity;
    const value = voucherState.value;
    if (quantity < 1 || value < 0) {
      handleClose();
      return;
    }
    setClickable(false);
    setVoucherState({
      quantity: 0,
      value: 0,
    });
    const voucherResult = await createVouchers(quantity, value);
    if (voucherResult.success === false) {
      await alert(
        'Something went wrong, check the internet connection or write the vouchers manually.'
      );
      handleClose();
      return;
    }

    //await printVouchers(voucherResult.vouchers);
    //TODO this function doesn't exist
    // TODO then ask the user if they were printed correctly
    // TODO then figure out how to add the items to the cart
    handleClose();
  };

  const VoucherCreatorDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Alert />
          <Choice />
          <Keypad />
          <div className='fixed h-screen w-screen z-1'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border border-colour rnd  flex flex-col gap-2 p-2'>
              <div className='w-96 flex flex-col gap-2 text-2xl'>
                <div className='flex flex-row justify-between'>
                  <div className='text-3xl cnter-items'>Voucher Creator</div>
                  <div
                    className='negative cnter-items p-2 uppercase font-bold'
                    onContextMenu={(event) => handleClose()}
                    onTouchStart={(event) => handleClose()}>
                    Cancel
                  </div>
                </div>
                <div className='w-full border-b border-colour'></div>
                <div className='flex flex-row justify-between'>
                  <div className='cnter-items'>Quantity:</div>
                  <div
                    className='btn rnd primary p-2 cnter-items '
                    onContextMenu={(e) => handleSetQuantity()}
                    onTouchStart={(e) => handleSetQuantity()}>
                    {voucherState.quantity == undefined
                      ? 'Enter'
                      : voucherState.quantity}
                    <img src={dropdownSVG} className='w-6 invert-icon' />
                  </div>
                </div>
                <div className='flex flex-row justify-between'>
                  <div className='cnter-items'>Value:</div>
                  <div
                    className='btn rnd primary p-2 cnter-items '
                    onContextMenu={(e) => handleSetValue()}
                    onTouchStart={(e) => handleSetValue()}>
                    €
                    {voucherState.value == undefined
                      ? 'Enter'
                      : voucherState.value}
                    <img src={dropdownSVG} className='w-6 invert-icon' />
                  </div>
                </div>
                <div className='w-full border-b border-colour'></div>

                <div className='flex flex-row justify-between text-3xl'>
                  <div className='cnter-items'>Total Cost:</div>
                  <div className='cnter-items'>
                    €{(voucherState.value * voucherState.quantity).toFixed(2)}
                  </div>
                </div>
                <div className='w-full border-b border-colour'></div>
                <div
                  className='w-full btn positive p-2 text-center'
                  onContextMenu={(e) => handleCreateVouchers()}
                  onTouchStart={(e) => handleCreateVouchers()}>{`Create ${
                  voucherState.quantity
                } voucher${
                  voucherState.quantity !== 1 ? 's' : ''
                } for €${voucherState.value.toFixed(2)} totalling €${(
                  voucherState.quantity * voucherState.value
                ).toFixed(2)}`}</div>
              </div>
            </div>
          </div>
        </>
      );
  };
  return [VoucherCreatorDialog, voucherCreator];
};

export default useVoucherCreator;
