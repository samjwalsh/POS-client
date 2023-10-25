import * as React from 'react';

import playBeep from '../tools/playBeep';
import { getAllOrders, quit, removeAllOrders } from '../tools/ipc';

import closeSVG from '../assets/appicons/close.svg';

import hamburger from '../assets/appicons/hamburger.svg';

import useConfirm from './Reusables/ConfirmDialog.jsx';
import useKeypad from './Reusables/Keypad.jsx';
import TitleBar from './TitleBar.jsx';

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
    return <TitleBar setHamburger={setHamburger} />;
  }

  return (
    <>
      <TitleBar setHamburger={setHamburger} />
      <Keypad />
      <Dialog />
      <div className='fixed top-0 grid grid-cols-12 grid-rows-1 w-screen h-screen'>
        <div className='row-span-1 col-span-3 flex backgroundcolour flex-col border-colour border-r-2'>
          <div className='flex flex-row  w-100 justify-between p-2 border-b-2 border-colour text-left items-end'>
            <div className='text-xl '>Menu</div>
            <div
              className='justify-end btn--minus btn shadow w-8 h-8 cnter-items'
              onClick={() => handleCloseSideMenu(setHamburger)}>
              <img src={closeSVG} className='w-6' />
            </div>
          </div>
          <div className=' flex flex-col gap-2 p-2'>
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
          <div className='mt-auto p-2'>
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
