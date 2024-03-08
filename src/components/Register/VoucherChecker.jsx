import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeyboard from '../Reusables/Keyboard.jsx';
import playBeep from '../../tools/playBeep.js';
import Wait from '../Reusables/Wait.jsx';
import { checkVoucher } from '../../tools/ipc.js';
import useAlert from '../Reusables/Alert.jsx';
import { cF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';
import Modal from '../Reusables/Modal.jsx';
import ButtonStack from '../Reusables/ButtonStack.jsx';
import NumberInput from '../Reusables/NumberInput.jsx';
import TextInput from '../Reusables/textInput.jsx';
const useVoucherChecker = (order, setOrder) => {
  const [promise, setPromise] = useState(null);
  const [clickable, setClickable] = useState(true);
  const [Keyboard, keyboard] = useKeyboard();
  const [Alert, alert] = useAlert();
  const [code, setCode] = useState();

  const voucherChecker = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setClickable(true);
    setCode();
  };

  const handleClickClose = () => {
    playBeep();
    handleClose();
  };

  const checkCode = async () => {
    setClickable(false);
    if (typeof code !== 'string') {
      await alert(
        'Error',
        'Something went wrong. Check you typed the code correctly and that the till is connected to the internet.'
      );

      handleClose();
      return;
    }
    const res = await checkVoucher(code);

    if (!res.success) {
      await alert(
        'Error',
        'Something went wrong. Check you typed the code correctly and that the till is connected to the internet.'
      );

      handleClose();
      return;
    }

    if (!res.exists) {
      await alert(
        'Error',
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

    alertHTML.push(addToAlertHTML('Value', cF(res.voucher.value)));
    alertHTML.push(addToAlertHTML('Code', res.voucher.code.toUpperCase()));

    await alert(
      'Voucher Checker',
      <div className='flex flex-col w-full'>{alertHTML}</div>
    );
    handleClose();
  };

  const handleEnterCode = async () => {
    playBeep();
    const code = await keyboard(
      '',
      'Enter voucher code (Letters only, Not case sensitive)'
    );
    if (!code) return;
    if (code.length < 5) {
      await alert('Error', 'Voucher codes are at least 5 characters long.');
      return;
    }
    setCode(code);
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
        <>
          <div className='flex flex-col w-full px-2'>
            <div>Code</div>
            <TextInput
              value={code === undefined ? 'E.g. abcdef' : code}
              dim={code === undefined}
              onClick={handleEnterCode}></TextInput>
          </div>
          <ButtonStack>
            <Button
              type='secondary'
              className='flex-grow basis-1'
              onClick={handleClickClose}>
              Cancel
            </Button>
            <Button
              type='primary'
              className='flex-grow basis-1'
              onClick={checkCode}>
              Check
            </Button>
          </ButtonStack>
        </>
      );
    } else {
      return (
        <div className='cnter p-4'>
          <Wait />
        </div>
      );
    }
  };

  const VoucherCheckerDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Keyboard />
          <Alert />
          <Modal title='Voucher Checker'> {createHTML()}</Modal>
        </>
      );
  };
  return [VoucherCheckerDialog, voucherChecker];
};

export default useVoucherChecker;
