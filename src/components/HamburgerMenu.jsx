import * as React from 'react';

import playBeep from '../tools/playBeep';
import { getAllOrders, quit, removeAllOrders } from '../tools/ipc';

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
        className='absolute bg-white'
        onClick={(event) => handleClickHamburger(event, setHamburger)}>
        <img src={hamburger} id='hamburgerSVG' className='r' />
      </div>
    );
  }

  return (
    <>
      <Keypad />
      <Dialog />
      <div id='sideMenuContainer'>
        <div id='sideMenu'>
          <div id='sideMenuContent'>
            <div id='sideMenuClose'>
              <div id='sideMenuCloseText' className='y'>
                Options
              </div>
              <div
                id='sideMenuCloseButton'
                className='r'
                onClick={() => handleCloseSideMenu(setHamburger)}>
                X
              </div>
            </div>
            <div id='sideMenuOptions'>
              <div id='sideMenuOption'>
                <div
                  className='sideMenuOption b'
                  onClick={() => handleSetAppState('Register')}>
                  Register
                </div>
              </div>
              <div
                className='sideMenuOption b'
                onClick={() => handleSetAppState('Reports')}>
                Reports
              </div>
              <div
                className='sideMenuOption b'
                onClick={() => handleSetAppState('Settings')}>
                Settings
              </div>
            </div>
            <div id='sideMenuTerminate'>
              <div
                id='sideMenuTerminateText'
                className='r'
                onClick={() => handleTerminatePOS()}>
                Exit POS
              </div>
            </div>
          </div>
          <div
            id='sideMenuBackground'
            onClick={() => handleCloseSideMenu(setHamburger)}></div>
        </div>
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
