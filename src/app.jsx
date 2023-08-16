import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import Order from "./components/Order.jsx";
import OrderBar from "./components/OrderBar.jsx";
import MenuBar from "./components/MenuBar.jsx";
import Menu from "./components/Menu.jsx";
import HamburgerMenu from "./components/HamburgerMenu.jsx";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {
  const [menuState, setMenuState] = useState("");
  const [currentOrder, setCurrentOrder] = useState("");
  const [order, setOrder] = useState([]);
  const [hamburger, sethamburger] = useState(false);

  return (
    <div className="container" id="Container">
      <HamburgerMenu hamburger={hamburger} sethamburger={sethamburger} />
      <MenuBar menuState={menuState} />
      <OrderBar />
      <Menu
        menuState={menuState}
        setMenuState={setMenuState}
        currentOrder={currentOrder}
        setCurrentOrder={setCurrentOrder}
        order={order}
        setOrder={setOrder}
      />
      <Order order={order} setOrder={setOrder} />
    </div>
  );
}

root.render(<App />);
