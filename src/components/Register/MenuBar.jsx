import * as React from "react";

import log from "../../tools/logging";

export default function MenuBar(props) {
  let menuState = props.menuState;
  let setHamburger = props.setHamburger;
  let menuTitle = "";
  if (menuState.name === undefined) {
    menuTitle = "Menu";
  }
  log(`Set menu title to ${menuState.name}`);
  return (
      <div id="menuTitle" className="titleStyle y">{menuTitle}</div>
  );
}

