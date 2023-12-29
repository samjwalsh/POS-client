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
      <div className='flex flex-row justify-between border-b border-colour h-10'>
        <div
          className='p-1 h-full w-10 cnter-items negativeFill border-r border-colour'
          onContextMenu={(e) => handleClickHamburger(setHamburger)}
          onTouchStart={(e) => handleClickHamburger(setHamburger)}>
          <img
            src={hamburger}
            className='w-10 invert-icon cnter-items h-full'
          />
        </div>

        <div className='flex flex-row items-center justify-end w-full num'>
          {/* <div className='border-l border-colour h-full cnter-items px-1 primaryFill w-10'>
          <HelpPageButton />
        </div> */}
          <div
            className='secondaryFill border-l border-colour h-full cnter-items px-1 uppercase font-bold font-sans'
            onContextMenu={(e) => handlePrintRecentOrder()}
            onTouchStart={(e) => handlePrintRecentOrder()}>
            Print Receipt
          </div>
          <div className='border-l border-colour h-full cnter-items font-bold w-8'></div>
          <div
            className='secondaryFill border-l border-colour h-full cnter-items px-1 uppercase font-bold font-sans'
            onContextMenu={(e) => handleClickVoucherMenu()}
            onTouchStart={(e) => handleClickVoucherMenu()}>
            Voucher
          </div>
          <div className='border-l border-colour h-full cnter-items font-bold w-16'></div>
          <div className='border-l border-colour h-full cnter-items font-bold'>
            <PrinterConnection />
          </div>
          <div className='border-l border-colour h-full cnter-items font-bold'>
            <Connection />
          </div>
          <div className='border-l border-colour h-full cnter-items font-bold'>
            <ServerConnection />
          </div>
          <div className='border-l border-colour h-full cnter-items font-bold px-1'>
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
