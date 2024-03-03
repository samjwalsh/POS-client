import * as React from 'react';

import playBeep from '../../tools/playBeep';
import { getSettings, setSetting } from '../../tools/ipc';
import dropdownSVG from '../../assets/appicons/dropdown.svg';

import useKeypad from '../Reusables/Keypad.jsx';

export function NumberInputOption({ setting, setSettings }) {
  const [Keypad, keypad] = useKeypad();

  async function handleClickNumberInputOption(setting) {
    playBeep();

    let response = await keypad(setting.value, 'passcode');
    if (response < 1 && setting.name === 'Sync Frequency') {
      response = 1;
    }
    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }

  return (
    <>
      <Keypad />
      <div className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'>
        <div className='text-xl self-center'>{setting.name}</div>
        <div className='flex flex-row gap-2'>
          <div
            className='btn text-lg btn-neutral p-2 cnter '
            onAuxClick={(e) => handleClickNumberInputOption(setting)}
            onTouchEnd={(e) => handleClickNumberInputOption(setting)}>
            {setting.value == undefined ? 'Enter' : setting.value}
            <img src={dropdownSVG} className='w-6 icon' />
          </div>
        </div>
      </div>
    </>
  );
}
