import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import getMenu from "./tools/menuAPI";
import { menu } from "./tools/menu";
const menuObj = getMenu();

// import MenuBar from "./components/MenuBar";
// import Order from "./components/Order";
// import OrderTitle from "./components/OrderTitle";
// import Menu from "./components/Menu";
// import ItemDisplay from "./components/ItemDisplay";

const domNode = document.getElementById("App");
const root = ReactDOM.createRoot(domNode);

function App() {
  const [menuState, setMenuState] = useState("");
  return (
    <div className="container" id="Container">
      <MenuBar menuState={menuState} />
      <OrderBar />
      <Menu menuState={menuState} setMenuState={setMenuState} />
      <Order />
    </div>
  );
}

root.render(<App />);

function MenuBar({ menuState }) {
  if (menuState.name === undefined) {
    return <div id="menuBar">Menu</div>;
  }
  return <div id="menuBar">{menuState.name}</div>;
}

function Menu({ menuState, setMenuState }) {
  let items = [];

  if (menuState === "" || menuState.type === "category") {
    if (menuState === "") {
      // Render top-level menu if state is ''
      items = getMenu();
    } else if (menuState.type === "category") {
      items = menuState.items;
      if (items[0].type !== "backButton") {
        items.unshift({
          name: "Back",
          type: "backButton",
        });
      }
    }

    let itemsHTML = [];

    items.forEach((item) => {
      //Code for adding relevent classes to each item
      let classes = "listItem";
      if (item.type === "category") {
        classes += " category";
      } else if (item.type === "backButton") {
        classes += " backButton";
      }

      itemsHTML.push(
        <div
          key={item.name}
          className={classes}
          id={item.name}
          onClick={(event) => handleItemClick(event, item, setMenuState)}
        >
          {item.name}
        </div>
      );
    });

    return (
      <div id="menu">
        <div className="items">
          {itemsHTML}
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
          <div className="emptyDiv"></div>
        </div>
      </div>
    );
  } else if (menuState.modifiers !== undefined) {
    console.log("item clicked that has mods");
    console.log(menuState);
    return (
      <div id="menu">
        {" "}
        <ItemPage menuState={menuState} setMenuState={setMenuState} />
      </div>
    );
  }
}

function ItemPage({ menuState, setMenuState }) {
  // Create addon HTML
  const item = {};
  item.name = menuState.name;
  item.price = menuState.price;

  item.addons = [];
  menuState.modifiers.forEach((addon) => {
    if (addon.name !== undefined) {
      item.addons.push(addon);
    } else {
      item.priceCheck = addon;
    }
  });

  console.log(item.addons);
  const addonsHTML = item.addons.map((addon) => {
    return (
      <div key={addon.name} className="addon" id={addon.name}>
        <div className="addonName">
          <div className="addonText">{addon.name}</div>
        </div>
        <div className="addonPrice">
          <div className="addonText">€{addon.price.toFixed(2)}</div>
        </div>
        <div className="toggleAddon">
          <div className="toggleAddonButton">X</div>
        </div>
      </div>
    );
    //TODO add code for auto-checking default addon
  });
  return (
    <div className="itemPage">
      <div className="itemPageTitleBar">
        <div className="itemPageAddonsTitle">
          <div className="itemPageTitleCenter">Addons</div>
        </div>
        <div
          className="itemPageExitButton"
          onClick={(event) => exitItemPage(event, item, setMenuState)}
        >
          X
        </div>
      </div>
      <div className="itemPageAddonsSection">{addonsHTML}</div>
      <div className="bottomBar"></div>
    </div>
  );
}

function exitItemPage(event, item, setMenuState) {
  console.log(item);
  setMenuState("");
}

function handleItemClick(event, item, setMenuState) {
  if (item.type === "backButton") {
    console.log("Back button pressed");
    setMenuState("");
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
    console.log("Item with no mods. pressed");
    return;
  } else if (item.type === undefined) {
    console.log("Item with mods. pressed");
    setMenuState(item);
  } else {
    console.log("Category pressed");
    setMenuState(item);
  }
}

function OrderBar() {
  return <div id="orderTitle">Order</div>;
}

function Order() {
  return <div id="order">order</div>;
}
