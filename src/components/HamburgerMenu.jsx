import * as React from "react";

import playBeep from "../tools/playBeep";
import { getAllOrders, quit, removeAllOrders } from "../tools/ipc";

import hamburger from "../assets/hamburger.svg";

export default function HamburgerMenu(props) {
  let hamburgerOpen = props.hamburgerOpen;
  let setHamburger = props.setHamburger;
  let appState = props.appState;
  let setAppState = props.setAppState;

  if (hamburgerOpen === false) {
    return (
      <div
        id="hamburgerIcon" className="r"
        onClick={(event) => handleClickHamburger(event, setHamburger)}
      >
        <img src={hamburger} id="hamburgerSVG" className="r" />
      </div>
    );
  }

  //move hamburger to this component, and have it float on top left when hamburger menu not open

  return (
    <div id="sideMenuContainer">
      <div id="sideMenu">
        <div id="sideMenuContent">
          <div id="sideMenuClose">
            <div id="sideMenuCloseText">Options</div>
            <div
              id="sideMenuCloseButton" className="r"
              onClick={() => handleCloseSideMenu(setHamburger)}
            >
              X
            </div>
          </div>
          <div id="sideMenuOptions">
            <div id="sideMenuOption">
              <div
                className="sideMenuOption b" 
                onClick={() =>
                  handleSetAppState(setHamburger, setAppState, "Register")
                }
              >
                Register
              </div>
            </div>
            <div
              className="sideMenuOption b"
              onClick={() =>
                handleSetAppState(setHamburger, setAppState, "Reports")
              }
            >
              Reports
            </div>
            <div
              className="sideMenuOption b"
              onClick={() =>
                handleSetAppState(setHamburger, setAppState, "Settings")
              }
            >Settings</div>
          </div>
          <div id="sideMenuTerminate">
            <div
              id="sideMenuTerminateText" className="r"
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

function handleSetAppState(setHamburger, setAppState, mode) {
  playBeep();
  setAppState(mode);
  setHamburger(false);
}

function handleTerminatePOS() {
  playBeep();
  quit();
}

function handleClickHamburger(event, setHamburger) {
  playBeep();
  setHamburger(true);
}
