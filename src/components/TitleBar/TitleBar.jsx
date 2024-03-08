import * as React from 'react';

import playBeep from '../../tools/playBeep';
import Connection from './Connection.jsx';
import Clock from './Clock.jsx';
import PrinterConnection from './PrinterConnection.jsx';
import ServerConnection from './serverConnection.jsx';
import HelpPageButton from './HelpPageButton.jsx';
import useListSelect from '../Reusables/ListSelect.jsx';
import useVoucherCreator from '../Register/VoucherCreator.jsx';
import useVoucherRedeemer from '../Register/VoucherRedeemer.jsx';
import useVoucherChecker from '../Register/VoucherChecker.jsx';
import { getAllOrders, printOrder, getSetting } from '../../tools/ipc.js';
import useConfirm from '../Reusables/ConfirmDialog.jsx';
import Button from '../Reusables/Button.jsx';

export default function TitleBar(props) {
  const {
    setHamburger,
    order,
    setOrder,
    updateOrders,
    setUpdateOrders,
    appState,
  } = props;
  const [ListSelect, chooseOption] = useListSelect();
  const [Confirm, confirm] = useConfirm();
  const [VoucherCreator, voucherCreator] = useVoucherCreator(order, setOrder);
  const [VoucherRedeemer, voucherRedeemer] = useVoucherRedeemer(
    order,
    setOrder
  );
  const [VoucherChecker, voucherChecker] = useVoucherChecker();

  async function handleClickVoucherMenu() {
    playBeep();
    const choice = await chooseOption([
      'Create Vouchers',
      'Redeem Voucher',
      'Check Voucher',
    ]);
    if (!choice) {
      return;
    }
    if (choice == 'Create Vouchers') {
      await voucherCreator();
    } else if (choice == 'Redeem Voucher') {
      await voucherRedeemer();
    } else if (choice == 'Check Voucher') {
      await voucherChecker();
    } else {
      return;
    }
  }

  return (
    <>
      <Confirm />
      <VoucherCreator />
      <VoucherRedeemer />
      <VoucherChecker />
      <ListSelect />
      <div className='flex flex-row justify-between h-16 border-b bc cnter drag'>
        <div className='flex flex-row h-full w-full justify-start'>
          <Button
            type='primary'
            className='w-20 h-full'
            onClick={(e) => handleClickHamburger(setHamburger)}>
            Menu
          </Button>
          <div className='w-[25rem]'></div>
          <Button
            type='primary'
            className='w-32 h-full'
            onClick={handlePrintRecentOrder}>
            Print Receipt
          </Button>
          <div className='cnter h-10 mr-2'></div>
          <Button
            type='secondary'
            className='w-32 h-full'
            onClick={handleClickVoucherMenu}>
            Vouchers
          </Button>
        </div>
        {/* <HelpPageButton/> */}
        <div className='flex flex-row h-full items-center justify-end'>
          <div className='flex flex-row gap-[0px] h-full'>
            <PrinterConnection />
            <Connection />
            <ServerConnection
              updateOrders={updateOrders}
              setUpdateOrders={setUpdateOrders}
              appState={appState}
            />
            <Clock />
          </div>
        </div>
      </div>
    </>
  );
}

async function handlePrintRecentOrder() {
  let orders = await getAllOrders();
  let till = await getSetting('Till Number');
  let recentOrder;
  for (const order of orders) {
    if (order.till == till) {
      recentOrder = order;
      break;
    }
  }
  if (recentOrder !== undefined) await printOrder(recentOrder);
}

function handleClickHamburger(setHamburger) {
  playBeep();
  setHamburger(true);
}
