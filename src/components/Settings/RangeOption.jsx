import * as React from 'react';

import undo from '../../assets/appicons/undo.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';

import playBeep from '../../tools/playBeep';
import { setSetting, getSettings, getSetting } from '../../tools/ipc';
import { executeSettings } from './Settings.jsx';
import Button from '../Reusables/Button.jsx';

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
    <div className='flex flex-col w-full px-2'>
      <div className='text-xl'>{setting.name}</div>
      <div className='flex flex-row gap-2'>
        <Button
          className='aspect-square'
          type='danger'
          onClick={(e) =>
            handleClickRangeOption(setting, 'decrease', settings)
          }>
          <img src={minusSVG} className='w-8 icon icon-secondary' />
        </Button>
        <Button type='base' className='text-xl w-full'>{setting.value}</Button>
        <Button
          className='aspect-square'
          type='success'
          onClick={(e) =>
            handleClickRangeOption(setting, 'increase', settings)
          }>
          <img src={addSVG} className='w-8 icon icon-secondary' />
        </Button>
        <Button
          className='aspect-square'
          type='secondary'
          onClick={(e) => handleClickRangeOption(setting, 'reset', settings)}>
          <img src={undo} className='w-8 icon icon-secondary' />
        </Button>
      </div>
    </div>
  );
}
