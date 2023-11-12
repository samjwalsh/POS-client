import * as React from 'react';

import hamburger from '../../assets/appicons/hamburger.svg';

import playBeep from '../../tools/playBeep';
import Connection from './Connection.jsx';
import Clock from './Clock.jsx';
import PrinterConnection from './PrinterConnection.jsx';
import HelpPageButton from './HelpPageButton.jsx';

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
      <div className='flex flex-row items-center justify-end w-full font-mono'>
        {/* <div className='border-l border-colour h-full cnter-items px-1 positiveFill w-10'>
          <HelpPageButton />
        </div> */}
        <div className='border-l border-colour h-full cnter-items px-1 '>
          <PrinterConnection />
        </div>
        <div className='border-l border-colour h-full cnter-items px-1'>
          <Connection />
        </div>
        <div className='border-l border-colour h-full cnter-items px-1 '>
          <Clock />
        </div>
      </div>
    </div>
  );
}

function handleClickHamburger(setHamburger) {
  playBeep();
  setHamburger(true);
}
