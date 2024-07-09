import * as React from 'react';

import playBeep from '../../tools/playBeep';
import { getSettings, setSetting } from '../../tools/ipc';
import dropdownSVG from '../../assets/appicons/dropdown.svg';

import usekeyboard from '../Reusables/Keyboard.jsx';
import TextInput from '../Reusables/textInput.jsx';

export function TextInputOption({ setting, setSettings }) {
  const [Keyboard, keyboard] = usekeyboard();

  async function handleClickTextInputOption(setting) {
    playBeep();

    const response = await keyboard(setting.value, `${setting.name}`);
    if (!response) {
      return;
    }

    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }
  return (
    <>
      <Keyboard />
      <div className='flex flex-col w-full px-2'>
        <div className='text-xl'>{setting.name}</div>{' '}
        <TextInput
          value={setting.value}
          onClick={(e) => handleClickTextInputOption(setting)}>
          <img src={dropdownSVG} className='w-6 icon' />
        </TextInput>
      </div>
    </>
  );
}
