import * as React from "react";
import * as ReactDOM from "react-dom/client";

import getMenu from "./tools/menuAPI";
const menuObj = getMenu();

import MenuBar from "./components/MenuBar";
import Order from "./components/Order";
import OrderTitle from "./components/OrderTitle";
import Menu from "./components/Menu";
import ItemDisplay from "./components/ItemDisplay";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

const App = () => {
  return (
    <div className="container" id="Container">
      <MenuBar title={'Menu'} />
      <OrderTitle />
      <Menu menu={menuObj} />
      <Order />
    </div>
  );
};

export function updateItems(newItems) {
  root.render(
    <div className="container" id="Container">
      <MenuBar title={newItems[0].within} />
      <OrderTitle />
      <Menu menu={newItems} />
      <Order />
    </div>
  );
};

export function resetMenu() {
  root.render(
    <div className="container" id="Container">
      <MenuBar title={'Menu'} />
      <OrderTitle />
      <Menu menu={menuObj} />
      <Order />
    </div>
  );
}

root.render(<App />);
