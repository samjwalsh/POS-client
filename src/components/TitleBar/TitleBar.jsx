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
import ButtonStack from '../Reusables/ButtonStack.jsx';

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
      voucherCreator();
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
      <div className='flex flex-row justify-between h-16 border-b bc drag relative'>
        <div className='flex flex-row h-full gap-0 w-8/12 justify-between'>
          <div className='flex flex-row gap-2'>
            <Button
              type='primary'
              className='w-20 h-full'
              onClick={(e) => handleClickHamburger(setHamburger)}>
              Menu
            </Button>
            <div className='text-2xl mt-auto mb-1'>{appState}</div>
          </div>
          {appState === 'Register' ? (
            <ButtonStack>
              <Button
                type='primary'
                className='w-32'
                onClick={handlePrintRecentOrder}>
                Print Receipt
              </Button>
              <Button
                type='secondary'
                className='w-32'
                onClick={handleClickVoucherMenu}>
                Vouchers
              </Button>
            </ButtonStack>
          ) : (
            ''
          )}
        </div>

        {/* <HelpPageButton/> */}
        <div className='flex flex-row h-full items-center justify-end absolute right-0 top-0'>
          <div className='flex flex-row gap-[0px] h-full text-center'>
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

  let orderIndex = 0;
  const ordersLength = orders.length;
  while (orderIndex < ordersLength) {
    const order = orders[orderIndex];
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
