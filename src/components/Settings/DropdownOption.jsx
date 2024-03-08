import * as React from 'react';

import dropdownSVG from '../../assets/appicons/dropdown.svg';

import useListSelect from '../Reusables/ListSelect.jsx';
import playBeep from '../../tools/playBeep';
import { getAllPrinters, setSetting, getSettings } from '../../tools/ipc';
import { executeSettings } from './Settings.jsx';
import Button from '../Reusables/Button.jsx';

export function DropdownOption({ setting, setSettings }) {
  const [ListSelect, chooseOption] = useListSelect();

  async function handleClickDropdownOption(setting) {
    playBeep();
    let options = [];
    switch (setting.name) {
      case 'Printer Name': {
        options = await getAllPrinters();
        options = options.map((printer) => {
          return printer.name;
        });
        break;
      }
      default: {
        options = setting.list;
      }
    }

    const choice = await chooseOption(options);
    if (!choice) {
      return;
    }
    await setSetting(setting.name, choice);
    setSettings(await getSettings());

    if (setting.name === 'Theme') {
      executeSettings(await getSettings());
    }
  }
  return (
    <>
      <ListSelect />
      <div className='flex flex-col w-full px-2'>
        <div className='text-xl'>{setting.name}</div>
          <Button
            type='base'
            className='w-full'
            onClick={(e) => handleClickDropdownOption(setting)}>
            {setting.value == undefined
              ? 'Select'
              : setting.value.length > 0
              ? setting.value
              : 'Select'}
            <img src={dropdownSVG} className='w-6 icon icon-ghost ml-auto' />
          </Button>
      </div>
    </>
  );
}
