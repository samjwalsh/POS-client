import * as React from "react";

import playBeep from "../tools/playBeep";
import { quit } from "../tools/ipc";

export default function HamburgerMenu(props) {
  let hamburger = props.hamburger;
  let setHamburger = props.setHamburger;

  if (hamburger === false) {
    return;
  }

  const sideMenuOptions = [
    {
      id: 0,
      name: "Orders",
      function: handleClickOrder(),
    },
    {
      id: 1,
      name: "X-Totals",
      function: handleClickX(),
    },
    {
      id: 2,
      name: "Z-Totals",
      function: handleClickZ(),
    },
  ];

  let sideMenuOptionsHTML = sideMenuOptions.map((option) => {
    return (
      <div
        className="sideMenuOption"
        key={option.id}
        onClick={() => {
          option.function;
        }}
      >
        {option.name}
      </div>
    );
  });

  return (
    <div id="sideMenu">
      <div id="sideMenuContent">
        <div id="sideMenuClose">
          <div id="sideMenuCloseText">Options</div>
          <div
            id="sideMenuCloseButton"
            onClick={() => handleCloseSideMenu(setHamburger)}
          >
            X
          </div>
        </div>
        <div id="sideMenuOptions">{sideMenuOptionsHTML}</div>
        <div id="sideMenuTerminate">
          <div id="sideMenuTerminateText" onClick={() => handleTerminatePOS()}>
            Exit POS
          </div>
        </div>
      </div>
      <div
        id="sideMenuBackground"
        onClick={() => handleCloseSideMenu(setHamburger)}
      ></div>
    </div>
  );
}

function handleCloseSideMenu(setHamburger) {
  playBeep();
  setHamburger(false);
}

function handleClickOrder() {
  playBeep();
}

function handleClickX() {
  playBeep();
}

function handleClickZ() {
  playBeep();
}

function handleTerminatePOS() {
  playBeep();
  quit();
}
