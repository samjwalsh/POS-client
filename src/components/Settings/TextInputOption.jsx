import * as React from 'react';

import playBeep from '../../tools/playBeep';
import { getSettings, setSetting } from '../../tools/ipc';
import dropdownSVG from '../../assets/appicons/dropdown.svg';

import usekeyboard from '../Reusables/textInput.jsx';

export function TextInputOption({ setting, setSettings }) {
  const [Keyboard, keyboard] = usekeyboard();

  async function handleClickTextInputOption(setting) {
    playBeep();

    const response = await keyboard(setting.value);
    if (!response) {
      return;
    }

    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }
  return (
    <>
      <Keyboard />
      <div
        className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'>
        <div className='text-xl self-center'>{setting.name}</div>
        <div className='flex flex-row gap-2'>
          <div
            className='btn text-lg btn-neutral p-2 cnter-items '
            onContextMenu={(e) =>
              handleClickTextInputOption(setting)
            }
            onTouchEnd={(e) =>
              handleClickTextInputOption(setting)
            }>
            {setting.value == undefined
              ? 'Enter'
              : setting.value.length > 0
              ? setting.value
              : 'Enter'}
            <img src={dropdownSVG} className='w-6 invert-icon' />
          </div>
        </div>
      </div>
    </>
  );
}
