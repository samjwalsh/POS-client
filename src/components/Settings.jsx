import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
  deleteLocalData,
  getAllPrinters,
  getSettings,
  getVersionNo,
  printTestPage,
  resetSettings,
  updateSettings,
  getSetting,
  setSetting,
} from '../tools/ipc';

import useConfirm from './Reusables/ConfirmDialog.jsx';
import useListSelect from './Reusables/ListSelect.jsx';
import usekeyboard from './Reusables/textInput.jsx';
import useKeypad from './Reusables/Keypad.jsx';

import playBeep from '../tools/playBeep';

import undo from '../assets/appicons/undo.svg';
import addSVG from '../assets/appicons/add.svg';
import minusSVG from '../assets/appicons/minus.svg';
import checkSVG from '../assets/appicons/check.svg';
import dropdownSVG from '../assets/appicons/dropdown.svg';

export default function Settings(props) {
  let settings = props.settings;
  let setSettings = props.setSettings;

  const [version, setVersion] = useState();
  const [ConfirmDialog, confirm] = useConfirm();
  const [ListSelect, chooseOption] = useListSelect();
  const [Keyboard, keyboard] = usekeyboard();
  const [Keypad, keypad] = useKeypad();

  useEffect(() => {
    (async () => {
      setSettings(await getSettings());
      setVersion(await getVersionNo());
    })();
  }, []);

  async function handleClickButtonOption(setting) {
    playBeep();

    const choice = await confirm([setting.name + '?', 'No', 'Yes']);

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

  async function handleClickDropdownOption(setting, settings, setSettings) {
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
  }

  async function handleClickTextInputOption(setting, settings, getSettings) {
    playBeep();

    const response = await keyboard(setting.value);

    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }

  async function handleClickNumberInputOption(setting, settings, getSettings) {
    playBeep();

    let response = await keypad(setting.value, 'passcode');
    if (response < 1 && setting.name === 'Sync Frequency') {
      response = 1;
    }
    await setSetting(setting.name, response);
    setSettings(await getSettings());
  }

  let settingsHTML = [];

  if (Array.isArray(settings)) {
    settingsHTML = settings.map((category) => {
      let categoryHTML = [];
      categoryHTML = category.settings.map((setting) => {
        if (setting.type === 'range') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd  negative  p-2 cnter-items'
                  onContextMenu={(e) =>
                    handleClickRangeOption(
                      setting,
                      'decrease',
                      settings,
                      setSettings
                    )
                  }
                  onTouchStart={(e) =>
                    handleClickRangeOption(
                      setting,
                      'decrease',
                      settings,
                      setSettings
                    )
                  }>
                  <img src={minusSVG} className='w-6 invert-icon' />
                </div>
                <div className='cnter-items text-xl'>{setting.value}</div>
                <div
                  className='btn rnd positive p-2 cnter-items'
                  onContextMenu={(e) =>
                    handleClickRangeOption(
                      setting,
                      'increase',
                      settings,
                      setSettings
                    )
                  }
                  onTouchStart={(e) =>
                    handleClickRangeOption(
                      setting,
                      'increase',
                      settings,
                      setSettings
                    )
                  }>
                  <img src={addSVG} className='w-6 invert-icon' />
                </div>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) =>
                    handleClickRangeOption(
                      setting,
                      'reset',
                      settings,
                      setSettings
                    )
                  }
                  onTouchStart={(e) =>
                    handleClickRangeOption(
                      setting,
                      'reset',
                      settings,
                      setSettings
                    )
                  }>
                  {' '}
                  <img src={undo} className='w-6 invert-icon' />
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'button') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) => handleClickButtonOption(setting)}
                  onTouchStart={(e) => handleClickButtonOption(setting)}>
                  {setting.label}
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'toggle') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) =>
                    handleClickToggleOption(setting, settings, setSettings)
                  }
                  onTouchStart={(e) =>
                    handleClickToggleOption(setting, settings, setSettings)
                  }>
                  {setting.value ? (
                    <img src={checkSVG} className='w-6 invert-icon' />
                  ) : (
                    <div className='w-6 h-6'></div>
                  )}
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'dropdown') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) =>
                    handleClickDropdownOption(setting, settings, setSettings)
                  }
                  onTouchStart={(e) =>
                    handleClickDropdownOption(setting, settings, setSettings)
                  }>
                  {setting.value == undefined
                    ? 'Select'
                    : setting.value.length > 0
                    ? setting.value
                    : 'Select'}
                  <img src={dropdownSVG} className='w-6 invert-icon' />
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'textInput') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) =>
                    handleClickTextInputOption(setting, settings, getSettings)
                  }
                  onTouchStart={(e) =>
                    handleClickTextInputOption(setting, settings, getSettings)
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
          );
        } else if (setting.type === 'numberInput') {
          return (
            <div
              className='w-full flex flex-row p-2 whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rnd primary p-2 cnter-items '
                  onContextMenu={(e) =>
                    handleClickNumberInputOption(setting, settings, getSettings)
                  }
                  onTouchStart={(e) =>
                    handleClickNumberInputOption(setting, settings, getSettings)
                  }>
                  {setting.value == undefined ? 'Enter' : setting.value}
                  <img src={dropdownSVG} className='w-6 invert-icon' />
                </div>
              </div>
            </div>
          );
        }
      });
      return (
        <div
          className='w-full border border-colour rnd p-2 '
          key={category.name}>
          <div className='border-b border-colour text-2xl'>
            {category.name}{' '}
          </div>{' '}
          <div className='flex flex-col justify-between pt-2 gap-2'>
            {' '}
            {categoryHTML}{' '}
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <ConfirmDialog />
      <ListSelect />
      <Keyboard />
      <Keypad />
      <div className='h-full w-full overflow-scroll no-scrollbar'>
        <div className='flex flex-col flex-grow p-2 gap-2'>
          {settingsHTML}
          <div className='h-8'></div>
        </div>
        <div className='fixed bottom-0 right-0 border rnd p-1 border-colour m-1 background'>
          v{version}
        </div>
      </div>
    </>
  );
}

async function handleClickRangeOption(setting, method, settings, setSettings) {
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

async function handleClickToggleOption(setting, settings, setSettings) {
  playBeep();
  let value = !(await getSetting(setting.name));
  await setSetting(setting.name, value);
  setSettings(await getSettings());
  executeSettings(await getSettings());
}

export function executeSettings(settings) {
  for (const category of settings) {
    for (const setting of category.settings) {
      switch (setting.name) {
        case 'Zoom Factor':
          document.querySelector(':root').style.fontSize = `${setting.value}px`;
          break;
        case 'Dark Mode':
          if (setting.value === true) {
            document.documentElement.setAttribute('class', 'dark');
          } else {
            document.documentElement.setAttribute('class', '');
          }
          break;
      }
    }
  }
}
