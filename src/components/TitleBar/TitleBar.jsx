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

export default function TitleBar(props) {
  const { setHamburger, order, setOrder } = props;
  const [ListSelect, chooseOption] = useListSelect();
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
      <VoucherCreator />
      <VoucherRedeemer />
      <VoucherChecker />
      <ListSelect />
      <div className='flex flex-row justify-between  h-12 shadow-md'>
        <div
          className='h-auto btn m-1 negative'
          onContextMenu={(e) => handleClickHamburger(setHamburger)}
          onTouchStart={(e) => handleClickHamburger(setHamburger)}>
          <img src={hamburger} className=' invert-icon h-full w-auto' />
          <div className='px-1'>Menu</div>
        </div>

        <div className='flex flex-row items-center justify-end w-full num'>
          <div
            className='secondary h-10 btn mx-1 font-sans'
            onContextMenu={(e) => handlePrintRecentOrder()}
            onTouchStart={(e) => handlePrintRecentOrder()}>
            Print Receipt
          </div>
          <div className='cnter-items h-10 mx-5'></div>
          <div
            className='secondary h-10 btn font-sans'
            onContextMenu={(e) => handleClickVoucherMenu()}
            onTouchStart={(e) => handleClickVoucherMenu()}>
            Vouchers
          </div>
          <div className='cnter-items border-r border-colour h-10 mx-5'></div>
          <div className='cnter-items pr-1 my-1'>
            <PrinterConnection/>
          </div>
          <div className='cnter-items pr-1 my-1 '>
            <Connection />
          </div>
          <div className='cnter-items pr-1 my-1'>
            <ServerConnection />
          </div>
          <div className='cnter-items pr-1 my-1'>
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
  console.log(recentOrder);
  if (recentOrder !== undefined) await printOrder(recentOrder);
}

function handleClickHamburger(setHamburger) {
  playBeep();
  setHamburger(true);
}
