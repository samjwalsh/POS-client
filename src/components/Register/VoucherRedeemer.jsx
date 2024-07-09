import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeyboard from '../Reusables/Keyboard.jsx';
import playBeep from '../../tools/playBeep.js';
import { redeemVoucher } from '../../tools/ipc.js';
import useAlert from '../Reusables/Alert.jsx';
import { handleAddToOrder } from './ItemPage.jsx';
import Wait from '../Reusables/Wait.jsx';
import Button from '../Reusables/Button.jsx';
import Modal from '../Reusables/Modal.jsx';
import ButtonStack from '../Reusables/ButtonStack.jsx';
import TextInput from '../Reusables/textInput.jsx';
const useVoucherRedeemer = (order, setOrder) => {
  const [promise, setPromise] = useState(null);
  const [clickable, setClickable] = useState(true);
  const [Keyboard, keyboard] = useKeyboard();
  const [Alert, alert] = useAlert();
  const [code, setCode] = useState();

  const voucherRedeemer = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setCode();
    setClickable(true);
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
    const voucherResult = await redeemVoucher(code);

    if (voucherResult.error) {
      await alert(
        'Error',
        'Something went wrong. Check you typed the code correctly and that the till is connected to the internet.'
      );
      handleClose();
      return;
    }

    if (!voucherResult.success) {
      if (voucherResult.dateRedeemed === undefined) {
        await alert('Error', 'There is no voucher with this code.');
      } else if (!voucherResult.error) {
        await alert(
          'Error',
          `Sorry, this voucher was redeemed on ${voucherResult.dateRedeemed}.`
        );
      }
      handleClose();
      return;
    }

    let temp_order = order;
    temp_order.push({
      addons: [code],
      name: 'Redeem Voucher',
      quantity: 1,
      price: voucherResult.value * -1,
    });

    setOrder([...temp_order]);

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
              Redeem
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

  const VoucherRedeemerDialog = () => {
    if (promise === null) return;
    else
      return (
        <>
          <Keyboard />
          <Alert />
          <Modal title='Voucher Redeemer'>{createHTML()}</Modal>
        </>
      );
  };
  return [VoucherRedeemerDialog, voucherRedeemer];
};

export default useVoucherRedeemer;
