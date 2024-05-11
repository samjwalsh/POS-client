import { useState } from 'react';
import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';
import useKeypad from '../Reusables/Keypad.jsx';
import euroSVG from '../../assets/appicons/euro.svg';
import NumberInput from '../Reusables/NumberInput.jsx';

import playBeep from '../../tools/playBeep.js';
import { createVouchers, printVouchers } from '../../tools/ipc.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useAlert from '../Reusables/Alert.jsx';
import Wait from '../Reusables/Wait.jsx';
import { cF } from '../../tools/numbers.js';
import Button from '../Reusables/Button.jsx';
import Modal from '../Reusables/Modal.jsx';
import ButtonStack from '../Reusables/ButtonStack.jsx';
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
    if (!quantity) return;
    if (quantity > 20) {
      await alert(
        'Error',
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
    if (!value) return;
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
      await alert(
        'Error',
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
        'Error',
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
            'Error',
            <div className='flex flex-col overflow-y-hidden'>
              <div>{`Write the vouchers manually using the codes. Each voucher is for ${cF(
                voucherResult.vouchers[0].value
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
        <>
          <div className='flex flex-col w-full px-2'>
            <div>Quantity</div>
            <NumberInput
              value={
                voucherState.quantity <= 0 ? 'E.g. 12' : voucherState.quantity
              }
              dim={voucherState.quantity <= 0}
              onClick={handleSetQuantity}></NumberInput>
            <div>Value</div>
            <NumberInput
              value={
                voucherState.value <= 0 ? 'E.g. €3.50' : cF(voucherState.value)
              }
              dim={voucherState.value <= 0}
              onClick={handleSetValue}></NumberInput>

            <div className='flex flex-row justify-between title py-2'>
              <div className='cnter'>Total Cost</div>
              <div className='cnter'>
                {cF(voucherState.value * voucherState.quantity)}
              </div>
            </div>
            {`Create ${
              voucherState.quantity
            } voucher${voucherState.quantity !== 1 ? 's' : ''} for ${cF(
              voucherState.value
            )} totalling ${cF(
              voucherState.quantity * voucherState.value
            )}.`}
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
              onClick={handleCreateVouchers}>Create</Button>
          </ButtonStack>
        </>
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
          <Modal title='Voucher Creator'> {createHTML()}</Modal>
        </>
      );
  };
  return [VoucherCreatorDialog, voucherCreator];
};

export default useVoucherCreator;
