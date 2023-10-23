import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";
import {
  deleteLocalData,
  getSettings,
  getVersionNo,
  resetSettings,
  updateSettings,
} from "../tools/ipc";

import useConfirm from "./Reusables/ConfirmDialog.jsx";

import playBeep from "../tools/playBeep";

import undo from "../assets/appicons/undo.svg";
import addSVG from "../assets/appicons/add.svg";
import minusSVG from "../assets/appicons/minus.svg";

export default function Settings(props) {
  let settings = props.settings;
  let setSettings = props.setSettings;
  const [version, setVersion] = useState();
  const [Dialog, confirm] = useConfirm("Continue?", "");

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
      case "Reset All Settings": {
        await resetSettings();
        let localSettings = await getSettings();
        executeSettings(localSettings);
        setSettings(localSettings);
        break;
      }
      case "Delete All Local Data": {
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
        if (setting.type === "range") {
          return (
            <div className="settingsCategoryOptionRange" key={setting.name}>
              <div className="settingsCategoryOptionRangeLabel">
                {setting.name}
              </div>
              <div className="settingsCategoryOptionSpacer"></div>
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
                <img src={minusSVG} className="minusSVG r" />
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
                <img src={addSVG} className="addSVG g" />
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
                <img src={undo} className="b undoSVG" />
              </div>
            </div>
          );
        } else if (setting.type === "button") {
          return (
            <div className="settingsCategoryOptionsButton">
              <div className="settingsCategoryOptionRangeLabel">
                {setting.name}
              </div>
              <div className="settingsCategoryOptionsRangeSpacer"></div>
              <div
                className="settingsCategoryOptionsButtonButton r"
                onClick={(e) => {
                  handleClickButtonOption(setting);
                }}
              >
                {setting.label}
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
    <>
      <Dialog />
      <div className="settingsContainer">
        <div className="settingsTitle titleStyle y">Settings</div>
        <div className="settings">{settingsHTML}</div>
        <div className="settingsVersionNumber">v{version}</div>
      </div>
    </>
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
