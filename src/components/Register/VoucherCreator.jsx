import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';

import playBeep from '../../tools/playBeep.js';
import { createVouchers, printVouchers } from '../../tools/ipc.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
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
    if (!clickable) return;
    playBeep();
    const quantity = voucherState.quantity;

    const value = voucherState.value;
    if (quantity < 1 || value <= 0) {
      handleClose();
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
    ]);
    if (!printedCorrectly) {
      let tryAgain = true;
      while (tryAgain) {
        tryAgain = await confirm(['Try Again?', 'No', 'Yes']);
        if (tryAgain) {
          await printVouchers(voucherResult.vouchers);
          const printedCorrectly = await confirm([
            'Did the vouchers print?',
            'No',
            'Yes',
          ]);
          if (printedCorrectly) break;
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
              )}.`}</div>
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

    // TODO then figure out how to add the items to the cart
    handleClose();
  };

  const createHTML = () => {
    if (clickable) {
      return (
        <div className='w-96 flex flex-col gap-2 text-2xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-3xl cnter-items'>Voucher Creator</div>
            <div
              className='negative cnter-items p-2 uppercase font-bold btn'
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
              €{voucherState.value == undefined ? 'Enter' : voucherState.value}
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
      );
    } else {
      return <div className='text-2xl cnter-items'>Please wait...</div>;
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
          <div className='fixed h-screen w-screen z-1'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border border-colour rnd  flex flex-col gap-2 p-2'>
              {createHTML()}
            </div>
          </div>
        </>
      );
  };
  return [VoucherCreatorDialog, voucherCreator];
};

export default useVoucherCreator;
