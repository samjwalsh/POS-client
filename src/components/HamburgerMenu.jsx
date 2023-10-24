import * as React from 'react';

import playBeep from '../tools/playBeep';
import { getAllOrders, quit, removeAllOrders } from '../tools/ipc';

import closeSVG from '../assets/appicons/close.svg';

import hamburger from '../assets/appicons/hamburger.svg';

import useConfirm from './Reusables/ConfirmDialog.jsx';
import useKeypad from './Reusables/Keypad.jsx';

export default function HamburgerMenu(props) {
  const { hamburgerOpen, setHamburger, setAppState } = props;

  const [Dialog, confirm] = useConfirm('Exit?');

  const [Keypad, keypad] = useKeypad('passcode');

  async function handleTerminatePOS() {
    playBeep();

    const choice = await confirm();

    if (!choice) return;

    quit();
  }

  async function handleSetAppState(mode) {
    playBeep();
    if (mode !== 'Settings') {
      setAppState(mode);
      setHamburger(false);
    } else {
      const keypadValue = await keypad();
      if (keypadValue === 415326897) {
        setAppState(mode);
        setHamburger(false);
      }
    }
  }

  if (hamburgerOpen === false) {
    return (
      <div
        className='absolute'
        onClick={(event) => handleClickHamburger(event, setHamburger)}>
        <img src={hamburger} id='hamburgerSVG' className='r' />
      </div>
    );
  }

  return (
    <>
      <Keypad />
      <Dialog />
      <div className='absolute grid grid-cols-12 grid-rows-1 w-screen h-screen'>
        <div className='row-span-1 col-span-3 flex flex-col bg-white'>
          <div className='flex flex-row items-stretch  w-100 justify-between p-1 border-b-2'>
            <div className='text-2xl cnter-items'>Menu</div>
            <div
              className='justify-end btn--minus btn shadow'
              onClick={() => handleCloseSideMenu(setHamburger)}>
              <img src={closeSVG} className='' />
            </div>
          </div>
          <div className='p-1 flex flex-col gap-2 '>
            <div
              className='side-menu-option'
              onClick={() => handleSetAppState('Register')}>
              Register
            </div>
            <div
              className='side-menu-option'
              onClick={() => handleSetAppState('Reports')}>
              Reports
            </div>
            <div
              className='side-menu-option'
              onClick={() => handleSetAppState('Settings')}>
              Settings
            </div>
          </div>
          <div className='mt-auto p-1'>
            <div
              className='side-menu-option'
              onClick={() => handleTerminatePOS()}>
              Exit POS
            </div>
          </div>
        </div>
        <div
          className='row-span-1 col-span-9 bg-black opacity-50'
          onClick={() => handleCloseSideMenu(setHamburger)}></div>
      </div>
    </>
  );
}

function handleCloseSideMenu(setHamburger) {
  playBeep();
  setHamburger(false);
}

function handleClickHamburger(event, setHamburger) {
  playBeep();
  setHamburger(true);
}
