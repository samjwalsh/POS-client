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
      <div className='flex flex-row justify-between h-16 px-2 border-b border-colour cnter-items'>
        <div
          className=' btn btn-primary text-lg'
          onContextMenu={(e) => handleClickHamburger(setHamburger)}
          onClick={(e) => handleClickHamburger(setHamburger)}>
          <div className=''>Menu</div>
        </div>
        {/* <div className='text-2xl'>**Be careful! Items have moved!**</div> */}

        <div className='flex flex-row h-full items-center justify-end w-full'>
          <div
            className='  btn btn-secondary  text-lg'
            onContextMenu={(e) => handlePrintRecentOrder()}
            onClick={(e) => handlePrintRecentOrder()}>
            Print Receipt
          </div>
          <div className='cnter-items h-10 mx-5'></div>
          <div
            className=' btn btn-secondary text-lg'
            onContextMenu={(e) => handleClickVoucherMenu()}
            onClick={(e) => handleClickVoucherMenu()}>
            Vouchers
          </div>
          <div className='border-r border-colour h-16 mx-5'></div>

          <div className='flex flex-row gap-1 h-12 font-bold'>
            <PrinterConnection />
            <Connection />
            <ServerConnection />
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
