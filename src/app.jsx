import * as React from "react";
import * as ReactDOM from "react-dom/client";

import RegisterState from "./components/RegisterState.jsx";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {


  return (
    <div className="app">
      <RegisterState />
    </div>
  );
}

root.render(<App />);
