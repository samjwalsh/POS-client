import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeyboard from '../Reusables/textInput.jsx';
import playBeep from '../../tools/playBeep.js';
import { checkVoucher } from '../../tools/ipc.js';
import useAlert from '../Reusables/Alert.jsx';
import { handleAddToOrder } from './ItemPage.jsx';
const useVoucherChecker = (order, setOrder) => {
  const [promise, setPromise] = useState(null);
  const [clickable, setClickable] = useState(true);
  const [Keyboard, keyboard] = useKeyboard();
  const [Alert, alert] = useAlert();

  const voucherChecker = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setClickable(true);
  };

  const handleEnterCode = async () => {
    playBeep();
    const code = await keyboard('');
    if (code.length < 5) {
      await alert('Voucher codes are at least 5 characters long.');
      return;
    }
    setClickable(false);
    const res = await checkVoucher(code);

    if (!res.success) {
      await alert(
        'Something went wrong. Check that the till is connected to the internet.'
      );

      handleClose();
      return;
    }

    if (!res.exists) {
      await alert('A voucher with this code does not exist');
      handleClose();
      return;
    }

    let alertHTML = [];
    alertHTML.push(
      addToAlertHTML('Redeemed', res.voucher.redeemed ? 'Yes' : 'No')
    );
    alertHTML.push(addToAlertHTML('Date Created', res.voucher.dateCreated));
    alertHTML.push(addToAlertHTML('Shop Created', res.voucher.shopCreated));

    if (res.voucher.redeemed) {
      alertHTML.push(addToAlertHTML('Date Redeemed', res.voucher.dateRedeemed));
      alertHTML.push(addToAlertHTML('Shop Redeemed', res.voucher.shopRedeemed));
    }
    alertHTML.push(addToAlertHTML('Value', '€' + res.voucher.value.toFixed(2)));
    alertHTML.push(addToAlertHTML('Code', res.voucher.code.toUpperCase()));

    await alert(<div className='flex flex-col'>{alertHTML}</div>);
    handleClose();
  };

  const addToAlertHTML = (title, value) => {
    return (
      <div className='flex flex-row justify-between'>
        <div>{title}:</div>
        <div>{value}</div>
      </div>
    );
  };

  const createHTML = () => {
    if (clickable) {
      return (
        <div className='w-96 flex flex-col gap-2 text-2xl'>
          <div className='flex flex-row justify-between'>
            <div className='text-3xl cnter-items'>Voucher Checker</div>
            <div
              className='negative cnter-items p-2  btn uppercase font-bold'
              onContextMenu={(event) => handleClose()}
              onTouchStart={(event) => handleClose()}>
              Cancel
            </div>
          </div>
          <div className='w-full border-b border-colour'></div>
          <div className='flex flex-row justify-between'>
            <div className='cnter-items'>Code:</div>
            <div
              className='btn rnd primary p-2 cnter-items '
              onContextMenu={(e) => handleEnterCode()}
              onTouchStart={(e) => handleEnterCode()}>
              Enter Code
              <img src={dropdownSVG} className='w-6 invert-icon' />
            </div>
          </div>
        </div>
      );
    } else {
      return <div className='text-2xl cnter-items'>Please wait...</div>;
    }
  };

  const VoucherCheckerDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Keyboard />
          <Alert />
          <div className='fixed h-screen w-screen z-1'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border border-colour rnd  flex flex-col gap-2 p-2'>
              {createHTML()}
            </div>
          </div>
        </>
      );
  };
  return [VoucherCheckerDialog, voucherChecker];
};

export default useVoucherChecker;
