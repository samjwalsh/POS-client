import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import {
  deleteLocalData,
  getSettings,
  getVersionNo,
  resetSettings,
  updateSettings,
} from '../tools/ipc';

import useConfirm from './Reusables/ConfirmDialog.jsx';

import playBeep from '../tools/playBeep';

import undo from '../assets/appicons/undo.svg';
import addSVG from '../assets/appicons/add.svg';
import minusSVG from '../assets/appicons/minus.svg';
import checkSVG from '../assets/appicons/check.svg';

export default function Settings(props) {
  let settings = props.settings;
  let setSettings = props.setSettings;
  const [version, setVersion] = useState();
  const [Dialog, confirm] = useConfirm('Continue?', '');

  useEffect(() => {
    (async () => {
      let localSettings = await getSettings();
      setSettings(localSettings);

      let returnedVersion = await getVersionNo();
      setVersion(returnedVersion);
    })();
  }, []);

  async function handleClickButtonOption(setting) {
    playBeep();

    const choice = await confirm();

    if (!choice) return;

    switch (setting.name) {
      case 'Reset All Settings': {
        await resetSettings();
        let localSettings = await getSettings();
        executeSettings(localSettings);
        setSettings(localSettings);
        break;
      }
      case 'Delete All Local Data': {
        await deleteLocalData();
        let localSettings = await getSettings();
        executeSettings(localSettings);
        setSettings(localSettings);
      }
    }
  }

  let settingsHTML = [];

  if (Array.isArray(settings)) {
    settingsHTML = settings.map((category) => {
      let categoryHTML = [];
      categoryHTML = category.settings.map((setting) => {
        if (setting.type === 'range') {
          return (
            <div
              className='w-full flex flex-row p-2 rounded whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rounded btn--minus p-2 cnter-items'
                  onClick={(e) =>
                    handleClickRangeOption(
                      setting,
                      'decrease',
                      settings,
                      setSettings
                    )
                  }
                  onTouchMove={(e) =>
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
                  className='btn rounded btn--plus p-2 cnter-items'
                  onClick={(e) => 
                    handleClickRangeOption(
                      setting,
                      'increase',
                      settings,
                      setSettings
                    )
                  }onTouchMove={(e) => 
                    handleClickRangeOption(
                      setting,
                      'increase',
                      settings,
                      setSettings
                    )}>
                  <img src={addSVG} className='w-6 invert-icon' />
                </div>
                <div
                  className='btn rounded gradient1 p-2 cnter-items '
                  onClick={(e) => 
                    handleClickRangeOption(
                      setting,
                      'reset',
                      settings,
                      setSettings
                    )
                  }onTouchMove={(e) => 
                    handleClickRangeOption(
                      setting,
                      'reset',
                      settings,
                      setSettings
                    )}>
                  {' '}
                  <img src={undo} className='w-6 invert-icon' />
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'button') {
          return (
            <div
              className='w-full flex flex-row p-2 rounded whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rounded gradient1 p-2 cnter-items '
                  onClick={(e) => 
                    handleClickButtonOption(setting)
                  }onTouchMove={(e) => 
                    handleClickButtonOption(setting)}>
                  {setting.label}
                </div>
              </div>
            </div>
          );
        } else if (setting.type === 'toggle') {
          return (
            <div
              className='w-full flex flex-row p-2 rounded whitespace-nowrap gap-2 justify-between'
              key={setting.name}>
              <div className='text-xl self-center'>{setting.name}</div>
              <div className='flex flex-row gap-2'>
                <div
                  className='btn rounded gradient1 p-2 cnter-items '
                  onClick={(e) => 
                    handleClickToggleOption(setting, settings, setSettings)
                  } onTouchMove={(e) => 
                    handleClickToggleOption(setting, settings, setSettings)}>
                  {setting.value ? (
                    <img src={checkSVG} className='w-6 invert-icon' />
                  ) : (
                    <div className='w-6 h-6'></div>
                  )}
                </div>
              </div>
            </div>
          );
        }
      });
      return (
        <div
          className='w-full border border-colour rounded p-2 '
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
      <Dialog />
      <div className='h-full w-full '>
        <div className='flex flex-col flex-grow p-2 gap-2'>{settingsHTML}</div>
        <div className='fixed bottom-0 right-0 border rounded p-1 border-colour m-1'>
          v{version}
        </div>
      </div>
    </>
  );
}

async function handleClickRangeOption(setting, method, settings, setSettings) {
  playBeep();

  let localSettings = settings;

  settings.forEach((localCategory) => {
    localCategory.settings.forEach((localSetting) => {
      if (localSetting === setting) {
        //After finding the correct setting, we update its value according to the button pressed
        switch (method) {
          case 'increase':
            if (localSetting.value + localSetting.step <= localSetting.max) {
              localSetting.value += localSetting.step;
            }
            break;
          case 'decrease':
            if (localSetting.value - localSetting.step >= localSetting.min)
              localSetting.value -= localSetting.step;
            break;
          case 'reset':
            localSetting.value = localSetting.default;
        }
      }
    });
  });

  await updateSettings(localSettings);

  localSettings = await getSettings();

  executeSettings(localSettings);

  setSettings(localSettings);
}

async function handleClickToggleOption(setting, settings, setSettings) {
  playBeep();

  let localSettings = settings;

  settings.forEach((localCategory) => {
    localCategory.settings.forEach((localSetting) => {
      if (localSetting === setting) {
        //After finding the correct setting, we update its value according to the button pressed
        localSetting.value = !localSetting.value;
      }
    });
  });

  await updateSettings(localSettings);

  localSettings = await getSettings();

  executeSettings(localSettings);

  setSettings(localSettings);
}

export function executeSettings(settings) {
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
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
    });
  });
}
