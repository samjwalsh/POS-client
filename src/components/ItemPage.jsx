import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../tools/logging";

export default function ItemPage(props) {
  const menuState = props.menuState;
  const setMenuState = props.setMenuState;
  const currentOrder = props.currentOrder;
  const setCurrentOrder = props.setCurrentOrder;
  const order = props.order;
  const setOrder = props.setOrder;

  // Create addon HTML
  const item = {};
  item.name = menuState.name;
  item.price = menuState.price;

  item.addons = [];
  menuState.modifiers.forEach((addon) => {
    if (addon.name !== undefined) {
      item.addons.push(addon);
      log(`Detected an addon`);
    } else {
      log(`Detected a priceCheck function`);
      item.priceCheck = addon.priceCheck;
    }
  });

  const addonsHTML = item.addons.map((addon, index) => {
    let selected;
    if (currentOrder.addons == undefined) {
      log(`Initialised addon selected string`);
      selected = "";
      addon.selected = "";
    } else if (currentOrder.addons[index].selected === "X") {
      selected = "X";
    } else {
      selected = "";
    }

    log(`Created HTML for addon ${addon.name}`);
    return (
      <div
        key={addon.name}
        className="addon"
        id={index}
        onClick={(event) =>
          handleAddonToggle(
            event,
            item,
            item.addons[index],
            currentOrder,
            setCurrentOrder,
            index
          )
        }
      ><div className="addonNameAndPrice">
        <div className="addonName">
          <div className="addonText">{addon.name}</div>
        </div>
        <div className="addonPrice">
          <div className="addonText">€{addon.price.toFixed(2)}</div>
        </div>
        </div>
        <div className="toggleAddon">
          <div className="toggleAddonButton" id={index}>
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

  log(`Computed price for item and addons`);
  const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2);

  log(`Created HTML for item page`);
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
          <div
            className="subtractQuantity"
            onClick={(event) =>
              decreaseQuantity(event, item, currentOrder, setCurrentOrder)
            }
          >
            -
          </div>
          <div className="quantityValue">{quantity}</div>
          <div
            className="addQuantity"
            onClick={(event) =>
              increaseQuantity(event, item, currentOrder, setCurrentOrder)
            }
          >
            +
          </div>
        </div>
        <div className="priceSection">
          <div className="priceContainer">€{price}</div>
        </div>
        <div className="orderAdd">
          <div
            className="orderAddContainer"
            onClick={(event) =>
              addToOrder(
                event,
                item,
                setMenuState,
                currentOrder,
                setCurrentOrder,
                order,
                setOrder
              )
            }
          >
            Add
          </div>
        </div>
      </div>
    </div>
  );
}

function computePrice(item, currentOrder, setCurrentOrder) {
  log(`Compute price of item ${item.name} multiplied by its quantity`);
  if (currentOrder == "") {
    return item.price;
  } else if (currentOrder.priceCheck == "") {
    let addonsCost = 0;
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === "X") {
        addonsCost += addon.price;
      }
    });
    return (currentOrder.price + addonsCost) * currentOrder.quantity;
  } else {
    log(
      `Computing price of ${item.name} multiplied by its quantity using a priceCheck function`
    );
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return (currentOrder.price + addonsCost) * currentOrder.quantity;
  }
}

function handleAddonToggle(
  event,
  item,
  addon,
  currentOrder,
  setCurrentOrder,
  index
) {
  //const index = event.target.id;
  log(`Addon ${item.addons[index].name} toggled`);

  if (item.addons[index].selected === "X") {
    item.addons[index].selected = "";
    log(`Addon was toggled off`);
  } else {
    item.addons[index].selected = "X";
    log(`Addon was toggled on`);
  }

  let quantity;
  if (currentOrder.quantity == undefined) {
    log(`Quantity set to 1`);
    quantity = 1;
  } else {
    log(`Quantity set to ${currentOrder.quantity}`);
    quantity = currentOrder.quantity;
  }

  log(`Current order updated`);
  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck == undefined ? "" : item.priceCheck,
    addons: item.addons,
  });
}

function increaseQuantity(event, item, currentOrder, setCurrentOrder) {
  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 2;
    log(`Increasing quantity of item from undefined to 2`);
  } else {
    quantity = currentOrder.quantity + 1;
    log(`Increasing quantity of item from ${quantity - 1} to ${quantity}`);
  }

  setCurrentOrder({
    name: item.name,
    price: item.price,
    quantity: quantity,
    priceCheck: item.priceCheck === undefined ? "" : item.priceCheck,
    addons: item.addons,
  });
}

function decreaseQuantity(event, item, currentOrder, setCurrentOrder) {
  let quantity;
  if (currentOrder.quantity == undefined) {
    log(`Quantity of item was undefined, setting to 1`);
    quantity = 1;
  } else if (currentOrder.quantity == 1) {
    log(`Quantity of item already 1`);
    quantity = 1;
  } else {
    quantity = currentOrder.quantity - 1;
    log(`Decreasing quantity of item from ${quantity + 1} to ${quantity}`);
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
  log(`Exiting item page to main menu and deleting current order`);
  setMenuState("");
  setCurrentOrder("");
}

export function addToOrder(
  event,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder
) {
  let parsedOrder = {};

  parsedOrder.name = item.name;
  parsedOrder.price = computePriceNoQuantity(item, currentOrder);

  if (currentOrder.quantity == undefined) {
    parsedOrder.quantity = 1;
  } else {
    parsedOrder.quantity = currentOrder.quantity;
  }

  parsedOrder.addons = [];
  if (currentOrder.addons !== undefined) {
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === "X") {
        log(`Addon ${addon.name} put into order`);
        parsedOrder.addons.push(addon.name);
      }
    });
  }

  let itemWasDupe = false;

  for (let index = 0; index < order.length; index++) {
    let orderItem = order[index];

    if (
      parsedOrder.name === orderItem.name &&
      arrayEquals(parsedOrder.addons, orderItem.addons)
    ) {
      log(`Detected duplicate item in order`);
      //Fucky stuff to allow me to edit an element in the array with only the react State shit

      // 1. Make a shallow copy of the array
      let temp_order = order;

      // 2. Make a shallow copy of the element you want to mutate
      let temp_orderItem = temp_order[index];

      // 3. Update the property you're interested in
      temp_orderItem.quantity += parsedOrder.quantity;

      log(`Changing quantity of already existing item in order`);

      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      temp_order[index] = temp_orderItem;

      // 5. Set the state to our new copy
      // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

      console.log([...temp_order])

      setOrder([...temp_order]);

      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    log(`Added item ${item.name} to order, was not a duplicate`);
    setOrder((order) => [...order, parsedOrder]);
    console.log(order)
  }

  log(`Exiting item page`);
  exitItemPage(event, item, setMenuState, setCurrentOrder, currentOrder);
}

function computePriceNoQuantity(item, currentOrder) {
  log(`Computing price of individual item ${item.name}`);
  if (currentOrder == "") {
    return item.price;
  } else if (currentOrder.priceCheck == "") {
    let addonsCost = 0;
    currentOrder.addons.forEach((addon) => {
      if (addon.selected === "X") {
        addonsCost += addon.price;
      }
    });
    return currentOrder.price + addonsCost;
  } else {
    log(`Computing price of addons using priceCheck function`);
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return currentOrder.price + addonsCost;
  }
}

function arrayEquals(a, b) {
  log(`Detecting if two orders are equal`);
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
