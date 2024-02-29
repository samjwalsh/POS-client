import * as React from 'react';

import playBeep from '../../tools/playBeep';
import {
  getSettings,
  printTestPage,
  resetSettings,
  deleteLocalData,
} from '../../tools/ipc';
import { executeSettings } from './Settings.jsx';
import useConfirm from '../Reusables/ConfirmDialog.jsx';

export function ButtonOption({ setting, setSettings }) {
  const [ConfirmDialog, confirm] = useConfirm();

  async function handleClickButtonOption(setting) {
    playBeep();

    const choice = await confirm([
      setting.name + '?',
      'Cancel',
      'Continue',
      'This cannot be undone and may have negative side effects.',
    ]);

    if (!choice) return;

    switch (setting.name) {
      case 'Reset All Settings': {
        await resetSettings();
        let localSettings = await getSettings();
        executeSettings(localSettings);
        setSettings(localSettings);
        break;
      }
      case 'Delete All Local Orders': {
        await deleteLocalData();
        break;
      }
      case 'Print Test Page': {
        await printTestPage();
        break;
      }
    }
  }

  return (
    <>
      <ConfirmDialog />
      <div className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'>
        <div className='text-xl self-center'>{setting.name}</div>
        <div className='flex flex-row gap-2'>
          <div
            className='btn text-lg btn-neutral p-2 cnter-items '
            onAuxClick={() => handleClickButtonOption(setting)}
            onTouchEnd={() => handleClickButtonOption(setting)}>
            {setting.label}
          </div>
        </div>
      </div>
    </>
  );
}
