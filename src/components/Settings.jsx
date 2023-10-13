import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../tools/ipc";

import playBeep from "../tools/playBeep";

import undo from "../assets/undo.svg";

export default function Settings(props) {
  let settings = props.settings;
  let setSettings = props.setSettings;
  useEffect(() => {
    (async () => {
      let localSettings = await getSettings();
      setSettings(localSettings);
    })();
  }, []);

  let settingsHTML = [];

  if (Array.isArray(settings)) {
    settingsHTML = settings.map((category) => {
      let categoryHTML = [];
      categoryHTML = category.settings.map((setting) => {
        if (setting.type === "range") {
          return (
            <div
              className="settingsCategoryOption settingsCategoryOptionRange"
              key={setting.name}
            >
              <div className="settingsCategoryOptionRangeLabel">
                {setting.name}
              </div>
              <div className="settingsCategoryOptionRangeSpacer"></div>
              <div
                className="settingsCategoryOptionRangeDecrease button r"
                onClick={(e) => {
                  handleClickRangeOption(
                    setting,
                    "decrease",
                    settings,
                    setSettings
                  );
                }}
              >
                -
              </div>
              <div className="settingsCategoryOptionRangeValue button">
                {setting.value}
              </div>
              <div
                className="settingsCategoryOptionRangeIncrease button g"
                onClick={(e) => {
                  handleClickRangeOption(
                    setting,
                    "increase",
                    settings,
                    setSettings
                  );
                }}
              >
                +
              </div>
              <div
                className="settingsCategoryOptionRangeReset button b"
                onClick={(e) => {
                  handleClickRangeOption(
                    setting,
                    "reset",
                    settings,
                    setSettings
                  );
                }}
              >
                {" "}
                <img src={undo} id="undoSVG" className="b"/>
              </div>
            </div>
          );
        }
      });
      return (
        <div className="settingsCategory" key={category.name}>
          <div className="settingsCategoryTitle">{category.name} </div>{" "}
          <div className="settingsCategoryOptions"> {categoryHTML} </div>
        </div>
      );
    });
  }

  return (
    <div className="settingsContainer">
      <div className="settingsTitle titleStyle">Settings</div>
      <div className="settings">{settingsHTML}</div>
    </div>
  );
}

async function handleClickRangeOption(setting, method, settings, setSettings) {
  playBeep();

  let localSettings = settings;

  let foundCategoryIndex;
  let foundSettingIndex;
  settings.forEach((localCategory, categoryIndex) => {
    let localSettingIndex;
    localCategory.settings.forEach((localSetting, settingIndex) => {
      if (localSetting === setting) {
        localSettingIndex = settingIndex;
        //After finding the correct setting, we update its value according to the button pressed
        switch (method) {
          case "increase":
            if (localSetting.value + localSetting.step <= localSetting.max) {
              localSetting.value += localSetting.step;
            }
            break;
          case "decrease":
            if (localSetting.value - localSetting.step >= localSetting.min)
              localSetting.value -= localSetting.step;
            break;
          case "reset":
            localSetting.value = localSetting.default;
        }
      }
    });
    if (typeof localSettingIndex === "number") {
      foundCategoryIndex = categoryIndex;
      foundSettingIndex = localSettingIndex;
    }
  });

  await updateSettings(localSettings);

  localSettings = await getSettings();

  executeSettings(localSettings);

  setSettings(localSettings);

  console.log(settings[0].settings[0].value);
}

export function executeSettings(settings) {
  settings.forEach((category) => {
    category.settings.forEach((setting) => {
      switch (setting.name) {
        case "Zoom Factor":
          document.querySelector(":root").style.fontSize = `${setting.value}px`;
          break;
      }
    });
  });
}
