import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

//TODO make addons bigger y-height wise and also make the entire thing a button, instead of having to click on the little box
// TODO make it so that if you click on an item that doesn't have mods, it gets added to the cart but the menu page stays inside the given category so that you can easily add a higher quantity of the item without having to repeatedly select the category

import log from "./tools/logging";

import PayCash from "./components/PayCash.jsx";
import Keypad from "./components/Keypad.jsx";

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

function MenuBar({ menuState }) {
  if (menuState.name === undefined) {
    log(`Set menu title to Menu`);
    return <div id="menuBar">Menu</div>;
  }
  log(`Set menu title to ${menuState.name}`);
  return <div id="menuBar">{menuState.name}</div>;
}

function Menu({
  menuState,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder,
  keypad,
}) {
  let items = [];

  if (menuState === "" || menuState.type === "category") {
    if (menuState === "") {
      log(`Rendering default menu`);
      // Render top-level menu if state is ''
      items = getMenu();
    } else if (menuState.type === "category") {
      log(`Rendering a category`);
      items = menuState.items;
      if (items[0].type !== "backButton") {
        log(`Added a back button`);
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
        log(`Added class "category" to ${item.name}`);
        classes += " category";
      } else if (item.type === "backButton") {
        log(`Added class "category" to the back button`);

        classes += " backButton";
      }

      log(`Added item ${item.name} to HTML`);
      itemsHTML.push(
        <div
          key={item.name}
          className={classes}
          id={item.name}
          onClick={(event) =>
            handleItemClick(
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
        </div>
      </div>
    );
  } else if (menuState.modifiers !== undefined) {
    log(`Rendering an item which has modifiers`);
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

function addToOrder(
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

      setOrder([...temp_order]);

      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    log(`Added item ${item.name} to order, was not a duplicate`);
    setOrder((order) => [...order, parsedOrder]);
  }

  log(`Exiting item page`);
  exitItemPage(event, item, setMenuState, setCurrentOrder, currentOrder);
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

function handleItemClick(
  event,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder
) {
  log(`Item clicked`);
  if (item.type === "backButton") {
    log(`Item was the back button`);
    setMenuState("");
    //Back button pressed
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
    log(`Item had no modifiers, adding to order`);
    addToOrder(
      event,
      item,
      setMenuState,
      currentOrder,
      setCurrentOrder,
      order,
      setOrder
    );
    // setMenuState('');
    return;
    // Item with no mods pressed
  } else if (item.type === undefined) {
    log(`Item had modifiers, opening item page`);
    //Item with mods pressed
    setMenuState(item);
  } else {
    // category pressed
    log(`Item was a category, opening category`);
    setMenuState(item);
  }
}

function OrderBar() {
  log(`Set title for order bar to Order`);
  return <div id="orderTitle">Order</div>;
}

function handleOrderItemRemove(event, orderItem, order, setOrder) {
  if (orderItem.name === "Adjustment") {
    order.order.forEach((item, index) => {
      if (orderItem === item) {
        //TODO figure out how this works, this code runs everytime even if the item selected isn't the adjustment
        //Fucky stuff to allow me to edit an element in the array with only the react State shit

        // 1. Make a shallow copy of the array
        let temp_order = order;

        // 2. Make a shallow copy of the element you want to mutate
        let temp_orderItem = temp_order.order[index];

        // 3. Update the property you're interested in
        temp_orderItem.value = 0;

        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        temp_order.order[index] = temp_orderItem;

        // 5. Set the state to our new copy
        // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

        order.setOrder([...temp_order.order]);
      }
    });
  } else if (orderItem.quantity > 1) {
    order.order.forEach((item, index) => {
      log(`Reducing quantity of item ${item.name} in order by 1`);
      if (orderItem == item) {
        //Fucky stuff to allow me to edit an element in the array with only the react State shit

        // 1. Make a shallow copy of the array
        let temp_order = order;

        // 2. Make a shallow copy of the element you want to mutate
        let temp_orderItem = temp_order.order[index];

        // 3. Update the property you're interested in
        temp_orderItem.quantity--;

        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        temp_order.order[index] = temp_orderItem;

        // 5. Set the state to our new copy
        // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

        order.setOrder([...temp_order.order]);
      }
    });
  } else {
    order.order.forEach((item, index) => {
      if (orderItem == item) {
        log(`Removing item ${item.name} from order`);
        //Fucky stuff to allow me to edit an element in the array with only the react State shit

        // 1. Make a shallow copy of the array
        let temp_order = order;

        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        temp_order.order.splice(index, 1);

        // 5. Set the state to our new copy
        // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

        order.setOrder([...temp_order.order]);
      }
    });
  }
}

function handlePlusMinus(event, keypad, setkeypad) {
  log(`Opening the keypad`);
  let temp_keypad = keypad;
  temp_keypad.enabled = !keypad.enabled;
  setkeypad({ ...temp_keypad });
}

function Order(order, setOrder) {
  log(`Initiating keypad state`);
  const [keypad, setkeypad] = useState({
    enabled: false,
    value: "",
    sign: "+",
  });

  log(`Initiating payCash state`);
  const [payCash, setPayCash] = useState({
    state: false,
    returnedKeypadValue: 0,
  });

  log(`Initiating change state`);
  const [change, setChange] = useState(0);

  if (keypad.enabled == true) {
    log(`Opening the keypad`);
    return (
      <div className="orderContainer" id="order">
        <Keypad
          payCash={payCash}
          setPayCash={setPayCash}
          change={change}
          setChange={setChange}
          order={order}
          setOrder={setOrder}
          keypad={keypad}
          setkeypad={setkeypad}
        />
      </div>
    );
  }

  let orderItems = [];
  let subtotal = 0;
  log(`Calculating subtotal`);
  order.order.forEach((orderItem, index) => {
    if (!(orderItem.name === "Adjustment")) {
      log(`Adding ${orderItem.name} to HTML and subtotal`);
      subtotal += orderItem.price * orderItem.quantity;
      orderItems.push(
        <div
          className="orderItem"
          key={`${orderItem.name} [${orderItem.addons}]`}
        >
          <div className="nameAndAddons">
            <div className="orderItemName">
              {orderItem.name +
                (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : "")}
            </div>
            <div className="orderItemAddons">{orderItem.addons.join(", ")}</div>
          </div>
          <div className="priceAndPriceEach">
            <div className="orderItemPrice">
              €{(orderItem.price * orderItem.quantity).toFixed(2)}
            </div>
            <div className="orderItemPriceEach">
              €{orderItem.price.toFixed(2)} EA
            </div>
          </div>
          <div
            className="orderItemRemove"
            onClick={(event) =>
              handleOrderItemRemove(event, orderItem, order, setOrder)
            }
          >
            <div className="orderItemRemoveText">X</div>
          </div>
        </div>
      );
    } else {
      //add code for displaying the adjustment
      log(`Adding adjustment of ${orderItem.value} to HTML and subtotal`);
      subtotal += orderItem.value;
      if (orderItem.value != 0) {
        orderItems.push(
          <div className="orderItem" key={index}>
            <div className="nameAndAddons">
              <div className="orderItemName">Adjustment</div>
              <div className="orderItemAddons"></div>
            </div>
            <div className="priceAndPriceEach">
              <div className="orderItemPrice">
                €
                {orderItem.value < 0
                  ? `(${Math.abs(orderItem.value).toFixed(2)})`
                  : `${orderItem.value.toFixed(2)}`}
              </div>
              <div className="orderItemPriceEach"></div>
            </div>
            <div
              className="orderItemRemove"
              onClick={(event) =>
                handleOrderItemRemove(event, orderItem, order, setOrder)
              }
            >
              <div className="orderItemRemoveText">X</div>
            </div>
          </div>
        );
      }
    }
  });

  if (payCash.state === true) {
    log(`Rendering interface for paying with cash`);

    return (
      <div className="orderContainer" id="order">
        <PayCash
          order={order}
          setOrder={setOrder}
          payCash={payCash}
          setPayCash={setPayCash}
          keypad={keypad}
          setkeypad={setkeypad}
          change={change}
          setChange={setChange}
        />
        <div className="subTotal">
          <div className="subTotalTop">
            <div className="subTotalTitle">Subtotal</div>
            <div className="subTotalPrice">€{subtotal.toFixed(2)}</div>
          </div>
          <div className="subTotalBottom">
            <div
              className="plusMinus"
              onClick={(event) => handlePlusMinus(event, keypad, setkeypad)}
            >
              <div className="plusMinusContainer">±</div>
            </div>
            <div
              className="card"
              onClick={(event) =>
                handlePayment(order, setOrder, "card", payCash, setPayCash)
              }
            >
              <div className="cardContainer">Card</div>
            </div>
            <div
              className="cash"
              onClick={(event) =>
                handlePayment(order, setOrder, "cash", payCash, setPayCash)
              }
            >
              <div className="cashContainer">Cash</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  log(`Rendering standard order container`);
  return (
    <div className="orderContainer" id="order">
      <div className="orderItems">
        <div className="hiddenOrderItem"></div>
        {orderItems}
      </div>
      <div className="subTotal">
        <div className="subTotalTop">
          <div className="subTotalTitle">Subtotal</div>
          <div className="subTotalPrice">€{subtotal.toFixed(2)}</div>
        </div>
        <div className="subTotalBottom">
          <div
            className="plusMinus"
            onClick={(event) => handlePlusMinus(event, keypad, setkeypad)}
          >
            <div className="plusMinusContainer">±</div>
          </div>
          <div
            className="card"
            onClick={(event) =>
              handlePayment(order, setOrder, "card", payCash, setPayCash)
            }
          >
            <div className="cardContainer">Card</div>
          </div>
          <div
            className="cash"
            onClick={(event) =>
              handlePayment(order, setOrder, "cash", payCash, setPayCash)
            }
          >
            <div className="cashContainer">Cash</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function handlePayment(order, setOrder, paymentType, payCash, setPayCash) {
  //TODO add code to record all orders
  if (paymentType === "card") {
    log(`Payment type card selected, resetting order`);
    order.setOrder([]);
  } else if (payCash.state === true) {
    setPayCash({
      state: false,
      returnedKeypadValue: 0,
    });
  } else {
    log(`Payment type cash selected, turning on keypad`);
    setPayCash({ state: true, returnedKeypadValue: 0 });
  }
}