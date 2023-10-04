import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import Order from "./Order.jsx";
import OrderBar from "./OrderBar.jsx";
import MenuBar from "./MenuBar.jsx";
import Menu from "./Menu.jsx";
import HamburgerMenu from "./HamburgerMenu.jsx";

export default function RegisterState(props) {
  const [menuState, setMenuState] = useState("");
  const [currentOrder, setCurrentOrder] = useState("");
  const [order, setOrder] = useState([]);
  const [hamburger, setHamburger] = useState(false);

  return (
    <div className="container" id="Container">
      <HamburgerMenu hamburger={hamburger} setHamburger={setHamburger} />
      <MenuBar menuState={menuState} setHamburger={setHamburger} />
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

//move hamburger menu into app.jsx, will need to move state things aswell as pass new state into registerState
