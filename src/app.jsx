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
  const [currentOrder, setCurrentOrder] = useState("");
  const [order, setOrder] = useState("");
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

function Menu({
  menuState,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
}) {
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
    return (
      <div id="menu">
        {" "}
        <ItemPage
          menuState={menuState}
          setMenuState={setMenuState}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
          order={order}
          setOrder={setOrder}
        />
      </div>
    );
  }
}

function handleAddonToggle(event, item, addon, currentOrder, setCurrentOrder) {
  const index = event.target.id;

  if (item.addons[index].selected === "x") {
    item.addons[index].selected = "";
  } else {
    item.addons[index].selected = "x";
  }

  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck == undefined ? "" : item.priceCheck,
    addons: item.addons,
  });
}

function ItemPage({
  menuState,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
}) {
  // Create addon HTML
  const item = {};
  item.name = menuState.name;
  item.price = menuState.price;

  item.addons = [];
  menuState.modifiers.forEach((addon) => {
    if (addon.name !== undefined) {
      item.addons.push(addon);
    } else {
      item.priceCheck = addon.priceCheck;
    }
  });

  const addonsHTML = item.addons.map((addon, index) => {
    let selected;
    if (currentOrder.addons == undefined) {
      selected = "";
      addon.selected = "";
    } else if (currentOrder.addons[index].selected === "x") {
      selected = "x";
    } else {
      selected = "";
    }

    return (
      <div key={addon.name} className="addon" id={addon.name}>
        <div className="addonName">
          <div className="addonText">{addon.name}</div>
        </div>
        <div className="addonPrice">
          <div className="addonText">€{addon.price.toFixed(2)}</div>
        </div>
        <div className="toggleAddon">
          <div
            className="toggleAddonButton"
            id={index}
            onClick={(event) =>
              handleAddonToggle(
                event,
                item,
                item.addons[index],
                currentOrder,
                setCurrentOrder
              )
            }
          >
            {selected}
          </div>
        </div>
      </div>
    );
    //TODO add code for auto-checking default addon
  });

  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 1;
  } else {
    quantity = currentOrder.quantity;
  }

const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2)
//add .toFixed(2)

  return (
    <div className="itemPage">
      <div className="itemPageTitleBar">
        <div className="itemPageAddonsTitle">
          <div className="itemPageTitleCenter">Addons</div>
        </div>
        <div
          className="itemPageExitButton"
          onClick={(event) =>
            exitItemPage(
              event,
              item,
              setMenuState,
              setCurrentOrder,
              currentOrder
            )
          }
        >
          Cancel
        </div>
      </div>
      <div className="itemPageAddonsSection">{addonsHTML}</div>
      <div className="bottomBar">
        <div className="quantitySection">
          <div className="subtractQuantity" onClick={(event) => decreaseQuantity(event, item, currentOrder, setCurrentOrder)}>-</div>
          <div className="quantityValue">{quantity}</div>
          <div className="addQuantity" onClick={(event) => increaseQuantity(event, item, currentOrder, setCurrentOrder)}>+</div>
        </div>
        <div className="priceSection">
          <div className="priceContainer">€{price}</div>
        </div>
        <div className="orderAdd">
          <div className="orderAddContainer" onClick={(event => addToOrder(event, item, setMenuState, currentOrder, setCurrentOrder, order, setOrder))}>Add</div>
        </div>
      </div>
    </div>
  );
}

function addToOrder(event, item, setMenuState, currentOrder, setCurrentOrder, order, setOrder) {
 //TODO create order shit
}

function computePrice (item, currentOrder, setCurrentOrder) {
  console.log(currentOrder)
if (currentOrder == '') {
  console.log(item.price)
  return item.price
} else if(currentOrder.priceCheck == '') {
  let addonsCost = 0;
currentOrder.addons.forEach(addon => {
 if (addon.selected === 'x') {
  addonsCost+= addon.price;
 }
})
return (currentOrder.price + addonsCost) * currentOrder.quantity
} else {
  console.log(currentOrder)
  const addonsCost = currentOrder.priceCheck(currentOrder.addons)
  return (currentOrder.price + addonsCost) * currentOrder.quantity
}
}

function decreaseQuantity(event, item, currentOrder, setCurrentOrder) {
let quantity;
if (currentOrder.quantity == undefined) {
  quantity = 1;
} else if (currentOrder.quantity == 1) {
quantity = 1
} else {
  quantity = currentOrder.quantity - 1;
}

setCurrentOrder({
  name: item.name,
  price: item.price,
  quantity: quantity,
  priceCheck: item.priceCheck === undefined ? "" : item.priceCheck,
  addons: item.addons,
});
}

function increaseQuantity(event, item, currentOrder, setCurrentOrder) {
  let quantity;
if (currentOrder.quantity == undefined) {
  quantity = 2;
} else {
  quantity = currentOrder.quantity + 1;
}

setCurrentOrder({
  name: item.name,
  price: item.price,
  quantity: quantity,
  priceCheck: item.priceCheck === undefined ? "" : item.priceCheck,
  addons: item.addons,
});
}

function exitItemPage(
  event,
  item,
  setMenuState,
  setCurrentOrder,
  currentOrder
) {
  setMenuState("");
  setCurrentOrder("");
}

function handleItemClick(event, item, setMenuState) {
  if (item.type === "backButton") {
    setMenuState("");
    //Back button pressed
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
    return;
    // Item with no mods pressed
  } else if (item.type === undefined) {
    //Item with mods pressed
    setMenuState(item);
  } else {
    // Item pressed
    setMenuState(item);
  }
}

function OrderBar() {
  return <div id="orderTitle">Order</div>;
}

function Order() {
  return <div id="order">order</div>;
}
