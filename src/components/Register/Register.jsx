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
    <div className="grid grid-cols-10 grid-rows-12 ">
      <MenuBar menuState={menuState} setHamburger={setHamburgerOpen} />
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
