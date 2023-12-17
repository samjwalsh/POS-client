import * as React from 'react';

import hamburger from '../../assets/appicons/hamburger.svg';

import playBeep from '../../tools/playBeep';
import Connection from './Connection.jsx';
import Clock from './Clock.jsx';
import PrinterConnection from './PrinterConnection.jsx';
import ServerConnection from './serverConnection.jsx';
import HelpPageButton from './HelpPageButton.jsx';
import { getAllOrders, printOrder } from '../../tools/ipc.js';

export default function TitleBar(props) {
  const { setHamburger } = props;

  return (
    <div className='flex flex-row justify-between border-b border-colour h-10'>
      <div
        className='p-1 h-full w-10 cnter-items negativeFill border-r border-colour'
        onContextMenu={(e) => handleClickHamburger(setHamburger)}
        onTouchStart={(e) => handleClickHamburger(setHamburger)}>
        <img src={hamburger} className='w-10 invert-icon cnter-items h-full' />
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

        <div className='border-l border-colour h-full cnter-items px-1 '>
          <PrinterConnection />
        </div>
        <div className='border-l border-colour h-full cnter-items px-1'>
          <Connection />
        </div>
        <div className='border-l border-colour h-full cnter-items px-1'>
          <ServerConnection />
        </div>
        <div className='border-l border-colour h-full cnter-items px-1 '>
          <Clock />
        </div>
      </div>
    </div>
  );
}

async function handlePrintRecentOrder() {
  let localOrders = await getAllOrders();
  localOrders = localOrders.reverse();
  await printOrder(localOrders[0]);
}

function handleClickHamburger(setHamburger) {
  playBeep();
  setHamburger(true);
}
