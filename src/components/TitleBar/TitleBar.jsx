import * as React from 'react';

import hamburger from '../../assets/appicons/hamburger.svg';

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

export default function TitleBar(props) {
  const { setHamburger, order, setOrder } = props;
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
      <div className='flex flex-row justify-between h-14 px-2 cnter-items'>
        <div
          className='h-10 btn btn-primary text-lg'
          onContextMenu={(e) => handleClickHamburger(setHamburger)}
          onTouchEnd={(e) => handleClickHamburger(setHamburger)}>
          <div className=''>Menu</div>
        </div>
        <div className='flex flex-row items-center justify-end w-full'>
          <div
            className=' h-10 btn btn-secondary text-lg'
            onContextMenu={(e) => handlePrintRecentOrder()}
            onTouchEnd={(e) => handlePrintRecentOrder()}>
            Print Receipt
          </div>
          <div className='cnter-items h-10 mx-5'></div>
          <div
            className=' h-10 btn btn-secondary text-lg'
            onContextMenu={(e) => handleClickVoucherMenu()}
            onTouchEnd={(e) => handleClickVoucherMenu()}>
            Vouchers
          </div>
          <div className='border-r border-colour h-10 mx-5'></div>
          <div className='pr-1 num font-bold'>
            <PrinterConnection />
          </div>
          <div className='pr-1 num font-bold'>
            <Connection />
          </div>
          <div className='pr-1 num font-bold'>
            <ServerConnection />
          </div>
          <div className='num font-bold'>
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
