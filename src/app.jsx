import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import "./index.css";

import Register from "./components/Register/Register.jsx";
import Reports from "./components/Reports.jsx";
import Settings, { executeSettings } from "./components/Settings.jsx";

import HamburgerMenu from "./components/HamburgerMenu.jsx";
import { getSettings } from "./tools/ipc.js";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

(async () => {
  const settings = await getSettings();
  executeSettings(settings);
})();

function App() {
  const [appState, setAppState] = useState("Register");

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const [settings, setSettings] = useState();

  return (
    <>
      <HamburgerMenu
        hamburgerOpen={hamburgerOpen}
        setHamburger={setHamburgerOpen}
        appState={appState}
        setAppState={setAppState}
      />
      {(() => {
        if (appState === "Register") {
          return <Register />;
        } else if (appState === "Reports") {
          return <Reports />;
        } else if (appState === "Settings") {
          return <Settings settings={settings} setSettings={setSettings} />;
        }
      })()}
    </>
  );
}

root.render(<App />);
