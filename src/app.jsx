import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import Register from "./components/Register/Register.jsx";
import Reports from "./components/Register/Reports.jsx";
import Settings from "./components/Settings.jsx";

import HamburgerMenu from "./components/HamburgerMenu.jsx";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {
  const [appState, setAppState] = useState("Register");

  //TODO Change this back to register

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  setSettings();

  return (
    <div className="app">
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
          return <Settings />;
        }
      })()}
    </div>
  );
}

root.render(<App />);

function setSettings() {}
