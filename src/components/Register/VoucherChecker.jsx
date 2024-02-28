import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeyboard from '../Reusables/textInput.jsx';
import playBeep from '../../tools/playBeep.js';
import { checkVoucher } from '../../tools/ipc.js';
import useAlert from '../Reusables/Alert.jsx';
const useVoucherChecker = (order, setOrder) => {
  const [promise, setPromise] = useState(null);
  const [clickable, setClickable] = useState(true);
  const [Keyboard, keyboard] = useKeyboard();
  const [Alert, alert] = useAlert();

  const voucherChecker = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
      handleEnterCode();
    });

  const handleClose = () => {
    setPromise(null);
    setClickable(true);
  };

  const handleClickClose = () => {
    playBeep();
    handleClose();
  };

  const handleEnterCode = async () => {
    playBeep();
    const code = await keyboard('');
    if (!code) return;
    if (code.length < 5) {
      await alert('Voucher codes are at least 5 characters long.');
      return;
    }
    setClickable(false);
    const res = await checkVoucher(code);

    if (!res.success) {
      await alert(
        'Something went wrong. Check you typed the code correctly and that the till is connected to the internet.'
      );

      handleClose();
      return;
    }

    if (!res.exists) {
      await alert(
        'A voucher with this code does not exist. Check you typed the code correctly.'
      );
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

    await alert(<div className='flex flex-col w-full'>{alertHTML}</div>);
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
        <div className='w-96 flex flex-col gap-2 text-2xl p-4 border bc'>
          <div className='flex flex-row justify-between '>
            <div className='title cnter-items'>
              Voucher Checker
            </div>
            <div
              className='btn btn-error text-lg'
              onContextMenu={(event) => handleClickClose()}
              onClick={(event) => handleClickClose()}>
              Cancel
            </div>
          </div>
          <div className='w-full border-b bc'></div>
          <div className='flex flex-row justify-between'>
            <div className='cnter-items'>Code:</div>
            <div
              className='btn btn-primary text-lg'
              onContextMenu={(e) => handleEnterCode()}
              onClick={(e) => handleEnterCode()}>
              Enter Code
              <img src={dropdownSVG} className='w-6 invert-icon' />
            </div>
          </div>
        </div>
      );
    } else {
      return <Wait/>;
    }
  };

  const VoucherCheckerDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Keyboard />
          <Alert />
          <div className='fixed h-screen w-screen z-10'>
            <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen'></div>
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 background rounded-box'>
              {createHTML()}
            </div>
          </div>
        </>
      );
  };
  return [VoucherCheckerDialog, voucherChecker];
};

export default useVoucherChecker;
