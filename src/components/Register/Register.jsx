import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import Order from "./Order.jsx";
import OrderBar from "./OrderBar.jsx";
import MenuBar from "./MenuBar.jsx";
import Menu from "./Menu.jsx";

export default function RegisterState(props) {
  const [menuState, setMenuState] = useState("");
  const [currentOrder, setCurrentOrder] = useState("");
  const [order, setOrder] = useState([]);

  const hamburgerOpen = props.hamburgerOpen;
  const setHamburgerOpen = props.setHamburgerOpen;

  return (
    <div className="grid grid-cols-12 grid-rows-layout h-screen">
      <MenuBar menuState={menuState} setHamburger={setHamburgerOpen} />
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
