import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import Register from "./components/Register/Register.jsx";
import Reports from "./components/Reports/Reports.jsx";
import HamburgerMenu from "./components/HamburgerMenu.jsx";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {
  const [appState, setAppState] = useState("Register");

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  console.log(hamburgerOpen);

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
          return (
            <Register
              hamburgerOpen={hamburgerOpen}
              setHamburgerOpen={setHamburgerOpen}
            />
          );
        } else if (appState === "Reports") {
          return (
            <Reports
              hamburgerOpen={hamburgerOpen}
              setHamburgerOpen={setHamburgerOpen}
            />
          );
        }
      })()}
    </div>
  );
}

root.render(<App />);
