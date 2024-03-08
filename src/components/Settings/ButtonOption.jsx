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
import Button from '../Reusables/Button.jsx';

export function ButtonOption({ setting, setSettings }) {
  const [ConfirmDialog, confirm] = useConfirm();

  async function handleClickButtonOption(setting) {
    playBeep();

    const choice = await confirm(
      [
        setting.name + '?',
        'Cancel',
        'Continue',
        'This cannot be undone and may have negative side effects.',
      ],
      true
    );

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
      <div className='flex flex-col w-full px-2'>
        <div className='text-xl'>{setting.name}</div>
          <Button
            type='danger-tertiary'
            className='w-full'
            onClick={() => handleClickButtonOption(setting)}>
            {setting.label}
          </Button>
      </div>
    </>
  );
}
