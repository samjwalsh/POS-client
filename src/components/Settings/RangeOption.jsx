import * as React from 'react';

import undo from '../../assets/appicons/undo.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

import playBeep from '../../tools/playBeep';
import { setSetting, getSettings, getSetting } from '../../tools/ipc';
import { executeSettings } from './Settings.jsx';

export function RangeOption({ setting, settings, setSettings }) {
  async function handleClickRangeOption(setting, method, settings) {
    playBeep();

    let settingName = setting.name;
    let value = await getSetting(settingName);

    for (const category of settings) {
      for (const setting of category.settings) {
        if (setting.name === settingName) {
          //After finding the correct setting, we update its value according to the button pressed
          switch (method) {
            case 'increase':
              if (setting.value + setting.step <= setting.max) {
                value += setting.step;
              }
              break;
            case 'decrease':
              if (setting.value - setting.step >= setting.min)
                value -= setting.step;
              break;
            case 'reset':
              value = setting.default;
          }
          break;
        }
      }
    }

    await setSetting(settingName, value);
    setSettings(await getSettings());
    executeSettings(await getSettings());
  }

  return (
    <div className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'>
      <div className='text-xl self-center'>{setting.name}</div>
      <div className='flex flex-row gap-2'>
        <div
          className='btn text-lg   btn-error  p-2 cnter'
          onAuxClick={(e) =>
            handleClickRangeOption(setting, 'decrease', settings)
          }
          onTouchEnd={(e) =>
            handleClickRangeOption(setting, 'decrease', settings)
          }>
          <img src={minusSVG} className='w-6 icon' />
        </div>
        <div className='cnter text-xl'>{setting.value}</div>
        <div
          className='btn text-lg  btn-success p-2 cnter'
          onAuxClick={(e) =>
            handleClickRangeOption(setting, 'increase', settings)
          }
          onTouchEnd={(e) =>
            handleClickRangeOption(setting, 'increase', settings)
          }>
          <img src={addSVG} className='w-6 icon' />
        </div>
        <div
          className=' btn text-lg btn-neutral p-2 cnter '
          onAuxClick={(e) => handleClickRangeOption(setting, 'reset', settings)}
          onTouchEnd={(e) =>
            handleClickRangeOption(setting, 'reset', settings)
          }>
          {' '}
          <img src={undo} className='w-6 icon' />
        </div>
      </div>
    </div>
  );
}
