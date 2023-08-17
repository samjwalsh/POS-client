import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../tools/logging";

import hamburger from "../assets/hamburger.svg";

export default function MenuBar(props) {
  let menuState = props.menuState;
  let setHamburger = props.setHamburger;
  let menuTitle = "";
  if (menuState.name === undefined) {
    menuTitle = "Menu";
  }
  log(`Set menu title to ${menuState.name}`);
  return (
    <div id="menuBar">
      <div id="hamburgerIcon">
        <img
          src={hamburger}
          onClick={(event) => handleClickHamburger(event, setHamburger)}
          id="hamburgerSVG"
        />
      </div>
      <div id="menuTitle">{menuTitle}</div>
      <div id="menuFiller"></div>
    </div>
  );
}

function handleClickHamburger(event, setHamburger) {
  setHamburger(true);
}
