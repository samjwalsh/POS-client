import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

export default function Settings() {
  let settingsHTML = "";

  return (
    <div className="settingsContainer">
      <div className="settingsTitle titleStyle">
        Settings
      </div>
      <div className="settings">{settingsHTML}</div>
    </div>
  );
}
