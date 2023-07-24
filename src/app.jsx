import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

//TODO make addons bigger y-height wise and also make the entire thing a button, instead of having to click on the little box
// TODO make it so that if you click on an item that doesn't have mods, it gets added to the cart but the menu page stays inside the given category so that you can easily add a higher quantity of the item without having to repeatedly select the category

import log from "./tools/logging";

import Order from "./components/Order.jsx";
import OrderBar from "./components/OrderBar.jsx";
import MenuBar from "./components/MenuBar.jsx";
import Menu from "./components/Menu.jsx";

import getMenu from "./tools/menuAPI";
import { menu } from "./tools/menu";
const menuObj = getMenu();

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {
  const [menuState, setMenuState] = useState("");
  const [currentOrder, setCurrentOrder] = useState("");
  const [order, setOrder] = useState([]);

  return (
    <div className="container" id="Container">
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