import * as React from 'react';

import checkSVG from '../../assets/appicons/check.svg';

import playBeep from '../../tools/playBeep';
import { getSettings, setSetting, getSetting } from '../../tools/ipc';
import { executeSettings } from './Settings.jsx';

export function ToggleOption({ setting, setSettings }) {
  async function handleClickToggleOption(setting) {
    playBeep();
    let value = !(await getSetting(setting.name));
    await setSetting(setting.name, value);
    setSettings(await getSettings());
    executeSettings(await getSettings());
  }

  return (
    <div className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'>
      <div className='text-xl self-center'>{setting.name}</div>
      <div className='flex flex-row gap-2'>
        <div
          className='btn text-lg btn-neutral p-2 cnter-items '
          onAuxClick={(e) => handleClickToggleOption(setting)}
          onTouchEnd={(e) => handleClickToggleOption(setting)}>
          {setting.value ? (
            <img src={checkSVG} className='w-6 icon' />
          ) : (
            <div className='w-6 h-6'></div>
          )}
        </div>
      </div>
    </div>
  );
}
