import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../tools/logging";

export default function MenuBar({ menuState }) {
    if (menuState.name === undefined) {
      log(`Set menu title to Menu`);
      return <div id="menuBar">Menu</div>;
    }
    log(`Set menu title to ${menuState.name}`);
    return <div id="menuBar">{menuState.name}</div>;
  }