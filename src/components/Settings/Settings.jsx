import * as React from 'react';
import { useState, useEffect } from 'react';
import { getSettings, getVersionNo } from '../../tools/ipc';

import { DropdownOption } from './DropdownOption.jsx';
import { RangeOption } from './RangeOption.jsx';
import { ButtonOption } from './ButtonOption.jsx';
import { ToggleOption } from './ToggleOption.jsx';
import { TextInputOption } from './TextInputOption.jsx';
import { NumberInputOption } from './NumberInputOption.jsx';

export default function Settings({ settings, setSettings }) {
  const [version, setVersion] = useState();

  useEffect(() => {
    (async () => {
      setSettings(await getSettings());
      setVersion(await getVersionNo());
    })();
  }, []);

  let settingsHTML = [];

  if (Array.isArray(settings)) {
    settingsHTML = settings.map((category) => {
      let categoryHTML = [];
      categoryHTML = category.settings.map((setting) => {
        if (setting.type === 'range') {
          return (
            <RangeOption
              key={setting.name}
              setting={setting}
              settings={settings}
              setSettings={setSettings}
            />
          );
        } else if (setting.type === 'button') {
          return (
            <ButtonOption
              key={setting.name}
              setting={setting}
              setSettings={setSettings}
            />
          );
        } else if (setting.type === 'toggle') {
          return (
            <ToggleOption
              key={setting.name}
              setting={setting}
              setSettings={setSettings}
            />
          );
        } else if (setting.type === 'dropdown') {
          return (
            <DropdownOption
              key={setting.name}
              setting={setting}
              setSettings={setSettings}
            />
          );
        } else if (setting.type === 'textInput') {
          return (
            <TextInputOption
              key={setting.name}
              setting={setting}
              setSettings={setSettings}
            />
          );
        } else if (setting.type === 'numberInput') {
          return (
            <NumberInputOption
              key={setting.name}
              setting={setting}
              setSettings={setSettings}
            />
          );
        }
      });
      return (
        <div className='w-full border bc  p-2 rounded-box' key={category.name}>
          <div className='border-b bc text-2xl'>{category.name} </div>{' '}
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
      <div className='h-full w-full overflow-scroll no-scrollbar'>
        <div className='flex flex-col flex-grow p-2 gap-2'>
          {settingsHTML}
          <div className='h-8'></div>
        </div>
      </div>
    </>
  );
}

export function executeSettings(settings) {
  for (const category of settings) {
    for (const setting of category.settings) {
      switch (setting.name) {
        case 'Zoom Factor':
          document.querySelector(':root').style.fontSize = `${setting.value}px`;
          break;
        case 'Theme':
          document.documentElement.setAttribute('data-theme', setting.value);
          break;
      }
    }
  }
}
