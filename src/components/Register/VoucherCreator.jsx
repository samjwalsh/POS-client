import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import { createVouchers, printVouchers } from '../../tools/ipc.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import Wait from '../Reusables/Wait.jsx';
const useVoucherCreator = (order, setOrder) => {
  const [promise, setPromise] = useState(null);
  const [voucherState, setVoucherState] = useState({
    quantity: 0,
    value: 0,
  });
  const [clickable, setClickable] = useState(true);
  const [Keypad, keypad] = useKeypad('currency');
  const [Confirm, confirm] = useConfirm();
  const [Alert, alert] = useAlert();

  const voucherCreator = () => {
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
    setVoucherState({
      quantity: 0,
      value: 0,
    });
    setClickable(true);
  };

  const handleClickClose = () => {
    playBeep();
    handleClose();
  };

  const handleSetQuantity = async () => {
    playBeep();
    const quantity = await keypad(0, 'passcode');
    if (quantity > 20) {
      await alert(
        'If you need to create more than 20 vouchers, you have to create them in multiple batches.'
      );
      return;
    }
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
    const discouraged = await confirm([
      'Not enabled',
      'Continue',
      'Cancel',
      `Vouchers from the till are not finished yet, use a printed voucher instead.`,
    ]);
    if (discouraged) {
      handleClose();
      return;
    }
    if (!clickable) return;
    playBeep();

    const quantity = voucherState.quantity;

    const value = voucherState.value;
    if (quantity < 1 || value <= 0) {
      await alert(
        'You must create at least 1 voucher with a value above €0.00'
      );
      // handleClose();
      return;
    }
    setClickable(false);
    setVoucherState({
      quantity: 0,
      value: 0,
    });
    const voucherResult = await createVouchers(quantity, value);
    if (
      voucherResult.success === undefined ||
      voucherResult.success === false
    ) {
      await alert(
        'Something went wrong, check the internet connection or write the vouchers manually.'
      );
      handleClose();
      return;
    }

    await printVouchers(voucherResult.vouchers);
    const printedCorrectly = await confirm([
      'Did the vouchers print?',
      'No',
      'Yes',
      `If the vouchers did not print correctly, you can view the codes or try to print them again.`,
    ]);
    if (!printedCorrectly) {
      let tryAgain = true;
      while (tryAgain) {
        tryAgain = await confirm([
          'Try Again?',
          'View Codes',
          'Print Again',
          `You can choose to attempt to print the vouchers again or view the codes on the screen.`,
        ]);
        if (tryAgain) {
          await printVouchers(voucherResult.vouchers);
          const printedCorrectly = await confirm([
            'Did the vouchers print?',
            'No',
            'Yes',
            `If the vouchers did not print correctly, you can view the codes or try to print them again.`,
          ]);
          if (printedCorrectly) tryAgain = false;
        } else {
          let vouchersHTML = [];
          voucherResult.vouchers.forEach((voucher, index) => {
            vouchersHTML.push(
              <div className='text-left font-mono'>
                {index + 1}. {voucher.code.toUpperCase()}
              </div>
            );
          });
          await alert(
            <div className='flex flex-col overflow-y-hidden'>
              <div>{`Write the vouchers manually using the codes. Each voucher is for €${voucherResult.vouchers[0].value.toFixed(
                2
              )}. Don't forget to sign each one and date it.`}</div>
              {vouchersHTML}
            </div>
          );
        }
      }
    }
    let temp_order = order;

    for (const voucher of voucherResult.vouchers) {
      temp_order.push({
        addons: [voucher.code.toUpperCase()],
        name: 'Voucher',
        quantity: 1,
        price: voucher.value,
      });
    }

    setOrder([...temp_order]);

    handleClose();
  };

  const createHTML = () => {
    if (clickable) {
      return (
        <div className='w-96 flex flex-col gap-2 text-2xl p-4 border bc  background rounded-box'>
          <div className='flex flex-row justify-between'>
            <div className=' cnter mt-2 title'>Voucher Creator</div>
            <div
              className='btn btn-error text-lg'
              onAuxClick={(event) => handleClickClose()}
              onTouchEnd={(event) => handleClickClose()}>
              Cancel
            </div>
          </div>
          <div className='w-full border-b bc'></div>
          <div className='flex flex-row justify-between'>
            <div className='cnter'>Quantity:</div>
            <div
              className='btn btn-neutral text-lg'
              onAuxClick={(e) => handleSetQuantity()}
              onTouchEnd={(e) => handleSetQuantity()}>
              {voucherState.quantity == undefined
                ? 'Enter'
                : voucherState.quantity}
              <img src={dropdownSVG} className='w-6 icon' />
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div className='cnter'>Value:</div>
            <div
              className='btn btn-neutral text-lg'
              onAuxClick={(e) => handleSetValue()}
              onTouchEnd={(e) => handleSetValue()}>
              €
              {voucherState.value == undefined
                ? 'Enter'
                : voucherState.value.toFixed(2)}
              <img src={dropdownSVG} className='w-6 icon' />
            </div>
          </div>
          <div className='w-full border-b bc'></div>

          <div className='flex flex-row justify-between title'>
            <div className='cnter'>Total Cost:</div>
            <div className='cnter'>
              €{(voucherState.value * voucherState.quantity).toFixed(2)}
            </div>
          </div>
          <div className='w-full border-b bc'></div>
          <div
            className='w-full btn h-full btn-primary text-lg'
            onAuxClick={(e) => handleCreateVouchers()}
            onTouchEnd={(e) => handleCreateVouchers()}>{`Create ${
            voucherState.quantity
          } voucher${
            voucherState.quantity !== 1 ? 's' : ''
          } for €${voucherState.value.toFixed(2)} totalling €${(
            voucherState.quantity * voucherState.value
          ).toFixed(2)}`}</div>
        </div>
      );
    } else {
      return <Wait />;
    }
  };

  const VoucherCreatorDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Alert />
          <Confirm />
          <Keypad />
          <div className='fixed h-screen w-screen z-10'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              {createHTML()}
            </div>
          </div>
        </>
      );
  };
  return [VoucherCreatorDialog, voucherCreator];
};

export default useVoucherCreator;
