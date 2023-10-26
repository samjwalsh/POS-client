import * as React from 'react';

import hamburger from '../../assets/appicons/hamburger.svg';

import playBeep from '../../tools/playBeep';
import Connection from './Connection.jsx';
import Clock from './Clock.jsx';

export default function TitleBar(props) {
  const { setHamburger } = props;

  return (
    <div className='flex flex-row justify-between border-b border-colour'>
      <div
        className='p-1 border-r border-colour black'
        onClick={(e) => handleClickHamburger(setHamburger)}>
        <img src={hamburger} className='w-6 invert-icon' />
      </div>
      <div className='flex flex-row items-center justify-end w-full font-mono'>
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
