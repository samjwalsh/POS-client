import * as React from 'react';

import playBeep from '../../tools/playBeep';
import { getSettings, setSetting } from '../../tools/ipc';
import dropdownSVG from '../../assets/appicons/dropdown.svg';

import useKeypad from '../Reusables/Keypad.jsx';
import NumberInput from '../Reusables/NumberInput.jsx';

export function NumberInputOption({ setting, setSettings }) {
  const [Keypad, keypad] = useKeypad();

  async function handleClickNumberInputOption(setting) {
    playBeep();

    let response = await keypad(setting.value, 'passcode');
    if (!response) return;
    if (response < 1 && setting.name === 'Sync Frequency') {
      response = 1;
    }
    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }

  return (
    <>
      <Keypad />
      <div className='flex flex-col w-full px-2'>
        <div className='text-xl'>{setting.name}</div>{' '}
        <NumberInput
          value={setting.value}
          onClick={(e) => handleClickNumberInputOption(setting)}>
          <img src={dropdownSVG} className='w-6 icon' />
        </NumberInput>
      </div>
    </>
  );
}
