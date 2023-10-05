import * as React from "react";

import playBeep from "../tools/playBeep";
import {
  getAllOrders,
  quit,
  removeAllOrders,
} from "../tools/ipc";

export default function HamburgerMenu(props) {
  let hamburgerOpen = props.hamburgerOpen;
  let setHamburger = props.setHamburger;
  let appState = props.appState;
  let setAppState = props.setAppState;

  if (hamburgerOpen === false) {
    return;
  }

  return (
    <div id="sideMenuContainer">
      <div id="sideMenu">
        <div id="sideMenuContent">
          <div id="sideMenuClose">
            <div id="sideMenuCloseText">Options</div>
            <div
              id="sideMenuCloseButton"
              onClick={() =>
                handleCloseSideMenu(setHamburger)
              }
            >
              X
            </div>
          </div>
          <div id="sideMenuOptions">
            <div id="sideMenuOption">
              <div
                className="sideMenuOption"
                onClick={() =>
                  handleClickRegister(setAppState)
                }
              >
                Register
              </div>
            </div>
            <div
              className="sideMenuOption"
              onClick={() =>
                handleClickReports(setAppState)
              }
            >
              Reports
            </div>
          </div>
          <div id="sideMenuTerminate">
            <div
              id="sideMenuTerminateText"
              onClick={() => handleTerminatePOS()}
            >
              Exit POS
            </div>
          </div>
        </div>
        <div
          id="sideMenuBackground"
          onClick={() => handleCloseSideMenu(setHamburger)}
        ></div>
      </div>
    </div>
  );
}

function handleCloseSideMenu(setHamburger) {
  playBeep();
  setHamburger(false);
}

async function handleClickReports(setAppState) {
  playBeep();

  const orders = await getAllOrders();
  setAppState("Reports");
}

function handleClickRegister(setAppState) {
  playBeep();

  setAppState("Register");
}

function handleTerminatePOS() {
  playBeep();
  quit();
}
