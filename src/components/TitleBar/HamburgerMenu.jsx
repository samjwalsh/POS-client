import * as React from 'react';

import playBeep from '../../tools/playBeep';
import { quit } from '../../tools/ipc';

import closeSVG from '../../assets/appicons/close.svg';

import useConfirm from '../Reusables/ConfirmDialog.jsx';
import useKeypad from '../Reusables/Keypad.jsx';
import TitleBar from './TitleBar.jsx';
import useDisableTouch from '../Reusables/DisableTouch.jsx';

export default function HamburgerMenu(props) {
  const { hamburgerOpen, setHamburger, setAppState, order, setOrder } = props;

  const [Dialog, confirm] = useConfirm('Exit?');

  const [DisableTouch, disableTouch] = useDisableTouch();

  const [Keypad, keypad] = useKeypad();

  async function handleTerminatePOS() {
    playBeep();

    const choice = await confirm(['Exit?', 'Cancel', 'Continue', `This will close the till software.`]);

    if (!choice) return;

    quit();
  }

  async function handleCleanScreen() {
    const choice = await confirm([
      'Enter cleaning mode?',
      'Cancel',
      'Continue',
      `This will diable the touchscreen for 15 seconds so the screen can be cleaned.`
    ]);
    if (!choice) {
      return;
    }
    await disableTouch();
  }

  async function handleSetAppState(mode) {
    playBeep();
    if (mode !== 'Settings') {
      setAppState(mode);
      setHamburger(false);
    } else {
      const keypadValue = await keypad(0, 'passcode');
      if (keypadValue === 415326) {
        setAppState(mode);
        setHamburger(false);
      }
    }
  }

  if (hamburgerOpen === false) {
    return (
      <TitleBar setHamburger={setHamburger} order={order} setOrder={setOrder} />
    );
  }

  return (
    <>
      <TitleBar setHamburger={setHamburger} />
      <Keypad />
      <Dialog />
      <DisableTouch/>
      <div className='fixed top-0 grid grid-cols-12 grid-rows-1 w-screen h-screen z-10'>
        <div className='row-span-1 col-span-3 flex background flex-col border-colour border-r '>
          <div className='flex flex-row w-100 justify-between p-2 items-stretch '>
            <div className='text-2xl self-end'>Menu</div>
            <div
              className='justify-end negative btn w-10 h-10 cnter-items'
              onContextMenu={() => handleCloseSideMenu(setHamburger)}
              onTouchStart={() => handleCloseSideMenu(setHamburger)}>
              <img src={closeSVG} className='w-10 invert-icon' />
            </div>
          </div>
          <div className='border-b border-colour mx-2'></div>

          <div className=' flex flex-col gap-2 p-2 '>
            <div
              className='btnlg primary'
              onContextMenu={() => handleSetAppState('Register')}
              onTouchStart={() => handleSetAppState('Register')}>
              Register
            </div>
            <div
              className='btnlg primary'
              onContextMenu={() => handleSetAppState('Reports')}
              onTouchStart={() => handleSetAppState('Reports')}>
              Reports
            </div>
          </div>
          <div className='mt-auto p-2 flex flex-col gap-2'>
            <div
              className='btnlg primary'
              onContextMenu={() => handleCleanScreen()}
              onTouchStart={() => handleCleanScreen()}>
              Cleaning Mode
            </div>
            <div
              className='btnlg secondary'
              onContextMenu={() => handleSetAppState('Settings')}
              onTouchStart={() => handleSetAppState('Settings')}>
              Settings
            </div>
            <div
              className='btnlg negative'
              onContextMenu={() => handleTerminatePOS()}
              onTouchStart={() => handleTerminatePOS()}>
              Exit POS
            </div>
          </div>
        </div>
        <div
          className='row-span-1 col-span-9 transparent'
          onContextMenu={() => handleCloseSideMenu(setHamburger)}
          onTouchStart={() => handleCloseSideMenu(setHamburger)}></div>
      </div>
    </>
  );
}

function handleCloseSideMenu(setHamburger) {
  playBeep();
  setHamburger(false);
}
