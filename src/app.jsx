import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

//TODO make addons bigger y-height wise and also make the entire thing a button, instead of having to click on the little box
// TODO make it so that if you click on an item that doesn't have mods, it gets added to the cart but the menu page stays inside the given category so that you can easily add a higher quantity of the item without having to repeatedly select the category

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
  keypad,
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

  if (item.addons[index].selected === "X") {
    item.addons[index].selected = "";
  } else {
    item.addons[index].selected = "X";
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
    } else if (currentOrder.addons[index].selected === "X") {
      selected = "X";
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
          <button
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
          </button>
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

  const price = computePrice(item, currentOrder, setCurrentOrder).toFixed(2);

  return (
    <div className="itemPage">
      <div className="itemPageTitleBar">
        <div className="itemPageAddonsTitle">
          <div className="itemPageTitleCenter">Addons</div>
        </div>
        <button
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
        </button>
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
      //Fucky stuff to allow me to edit an element in the array with only the react State shit

      // 1. Make a shallow copy of the array
      let temp_order = order;

      // 2. Make a shallow copy of the element you want to mutate
      let temp_orderItem = temp_order[index];

      // 3. Update the property you're interested in
      temp_orderItem.quantity += parsedOrder.quantity;

      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      temp_order[index] = temp_orderItem;

      // 5. Set the state to our new copy
      // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

      setOrder([...temp_order]);

      itemWasDupe = true;
    }
  }

  if (!itemWasDupe) {
    setOrder((order) => [...order, parsedOrder]);
  }

  exitItemPage(event, item, setMenuState, setCurrentOrder, currentOrder);
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function computePriceNoQuantity(item, currentOrder) {
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
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return currentOrder.price + addonsCost;
  }
}

function computePrice(item, currentOrder, setCurrentOrder) {
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
    const addonsCost = currentOrder.priceCheck(currentOrder.addons);
    return (currentOrder.price + addonsCost) * currentOrder.quantity;
  }
}

function decreaseQuantity(event, item, currentOrder, setCurrentOrder) {
  let quantity;
  if (currentOrder.quantity == undefined) {
    quantity = 1;
  } else if (currentOrder.quantity == 1) {
    quantity = 1;
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

function handleItemClick(
  event,
  item,
  setMenuState,
  currentOrder,
  setCurrentOrder,
  order,
  setOrder
) {
  if (item.type === "backButton") {
    setMenuState("");
    //Back button pressed
    return;
  } else if (item.type === undefined && item.modifiers === undefined) {
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
    //Item with mods pressed
    setMenuState(item);
  } else {
    // category pressed

    setMenuState(item);
  }
}

function OrderBar() {
  return <div id="orderTitle">Order</div>;
}

function handleOrderItemRemove(event, orderItem, order, setOrder) {
  if (orderItem.name === "Adjustment") {
    order.order.forEach((item, index) => {
      if (orderItem === item) {
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
  let temp_keypad = keypad;
  temp_keypad.enabled = !keypad.enabled;
  setkeypad({ ...temp_keypad });
}

function handleKeypadClick(
  event,
  order,
  setOrder,
  keypad,
  setkeypad,
  action,
  payCash,
  change,
  setChange
) {
  console.log(payCash.payCash.state);

  if (action === "X") {
    setkeypad({ enabled: false, value: "", sign: "+" });
  } else if (action === "-") {
    let temp_keypad = keypad;
    temp_keypad.sign = "-";
    setkeypad({ ...temp_keypad });
  } else if (action === "+") {
    let temp_keypad = keypad;
    temp_keypad.sign = "+";
    setkeypad({ ...temp_keypad });
  } else if (action === "Del") {
    if (keypad.value !== "") {
      let temp_keypad = keypad;
      temp_keypad.value = temp_keypad.value.slice(0, -1);
      setkeypad({ ...temp_keypad });
    }
  } else if (action === "Enter") {
    if (!(keypad.value === "")) {
      //Fucky stuff to allow me to edit an element in the array with only the react State shit

      let keypadValueArray = keypad.value.split("");
if(keypadValueArray.length < 2) {
  keypadValueArray.unshift(0);
}
      keypadValueArray.splice(keypadValueArray.length - 2, 0, ".");

      if (keypad.sign === "-") {
        keypadValueArray.unshift("-");
      }

      let keypadValue = parseFloat(keypadValueArray.join(""));

      if (payCash.payCash.state === false) {
        // 1. Make a shallow copy of the array
        let temp_order = order;

        // 2. Make a shallow copy of the element you want to mutate
        temp_order.order.push({ name: "Adjustment", value: keypadValue });

        // 5. Set the state to our new copy
        // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

        order.setOrder([...temp_order.order]);
      } else {

        let subtotal = 0;
        order.order.forEach((orderItem, index) => {
          if (!(orderItem.name === "Adjustment")) {
            subtotal += orderItem.price * orderItem.quantity;
          } else {
            //add code for displaying the adjustment
            subtotal += orderItem.value;
          }
        });

        console.log(keypadValue);
        setChange(keypadValue - subtotal)
      }
    }
    setkeypad({ enabled: false, value: "", sign: "+" });
  } else {
    if (keypad.value.length < 4) {
      if (!(keypad.value === "" && action === "0")) {
        let temp_keypad = keypad;
        temp_keypad.value += action;
        setkeypad({ ...temp_keypad });
      }
    }
  }
}

function parseKeypadValue(keypad) {
  if (keypad.value === "") {
    return (parseFloat("0") / 100).toFixed(2);
  } else {
    return (parseFloat(keypad.value) / 100).toFixed(2);
  }
}

function Order(order, setOrder) {
  const [keypad, setkeypad] = useState({
    enabled: false,
    value: "",
    sign: "+",
  });

  const [payCash, setPayCash] = useState({
    state: false,
    returnedKeypadValue: 0,
  });

  const [change, setChange] = useState(0);

  if (keypad.enabled == true) {
    return (
      <div className="orderContainer" id="order">
        <Keypad payCash={payCash} setPayCash={setPayCash} change={change} setChange={setChange} order={order} setOrder={setOrder}/>
      </div>
    );
  }

  //TODO this shit is actually beyond fucked up, i cannot figure out how to pass variables through to a component, they all end up becoming undefined somehow, hopefully I just need to look at this a different way tomorrow
  function Keypad(payCash) {
    console.log(payCash);
    let keypadText = "";
    if (keypad.sign === "-") {
      keypadText += "(";
      keypadText += parseKeypadValue(keypad);
      keypadText += ")";
    } else {
      keypadText += parseKeypadValue(keypad);
    }
    return (
      <div className="keypadGrid">
        <div className="keypadDisplay ">
          <div className="keypadDisplayText">€</div>
          <div className="keypadDisplayTextValue">{keypadText}</div>
        </div>
        <div
          className="keypadClose keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "X",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">X</div>
        </div>
        <div
          className="keypadMinus keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "-",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">-</div>
        </div>
        <div
          className="keypadPlus keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "+",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">+</div>
        </div>
        <div
          className="keypadBack keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "Del",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">←</div>
        </div>
        <div
          className="keypad7 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "7",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">7</div>
        </div>
        <div
          className="keypad8 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "8",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">8</div>
        </div>
        <div
          className="keypad9 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "9",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">9</div>
        </div>
        <div
          className="keypad4 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "4",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">4</div>
        </div>
        <div
          className="keypad5 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "5",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">5</div>
        </div>
        <div
          className="keypad6 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "6",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">6</div>
        </div>
        <div
          className="keypad1 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "1",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">1</div>
        </div>
        <div
          className="keypad2 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "2",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">2</div>
        </div>
        <div
          className="keypad3 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "3",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">3</div>
        </div>

        <div
          className="keypad0 keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "0",
              payCash
            );
          }}
        >
          <div className="keypadCenter keypadText">0</div>
        </div>
        <div
          className="keypadEnter keypadButton"
          onClick={(event) => {
            handleKeypadClick(
              event,
              order,
              setOrder,
              keypad,
              setkeypad,
              "Enter",
              payCash,
              change,
              setChange
            );
          }}
        >
          <div className="keypadCenter keypadText">{"→"}</div>
        </div>
      </div>
    );
  }

  let orderItems = [];
  let subtotal = 0;

  order.order.forEach((orderItem, index) => {
    if (!(orderItem.name === "Adjustment")) {
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
          <button
            className="orderItemRemove"
            onClick={(event) =>
              handleOrderItemRemove(event, orderItem, order, setOrder)
            }
          >
            <div className="orderItemRemoveText">X</div>
          </button>
        </div>
      );
    } else {
      //add code for displaying the adjustment
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
            <button
              className="orderItemRemove"
              onClick={(event) =>
                handleOrderItemRemove(event, orderItem, order, setOrder)
              }
            >
              <div className="orderItemRemoveText">X</div>
            </button>
          </div>
        );
      }
    }
  });

  if (payCash.state === true) {
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
    order.setOrder([]);
  } else {
    setPayCash({ state: true, returnedKeypadValue: 0 });
  }
}

function PayCash(order, setPayCash, keypad, setkeypad) {

  const change = order.change;
  const setChange = order.setChange

  if (order.payCash.returnedKeypadValue != 0) {
    console.log(order.payCash)

    //order.setPayCash({state: false, returnedKeypadValue: 0})

    return (
      <div className="payCash">
        <div className="payCashOptions">
          <div
            className="payCash50 payCashPreset"
            onClick={(event) => handlePayCash(event, order, 50, setChange)}
          >
            <div className="payCashCenterText">50</div>
          </div>
          <div
            className="payCash20 payCashPreset"
            onClick={(event) => handlePayCash(event, order, 20, setChange)}
          >
            <div className="payCashCenterText">20</div>
          </div>
          <div
            className="payCash10 payCashPreset"
            onClick={(event) => handlePayCash(event, order, 10, setChange)}
          >
            <div className="payCashCenterText">10</div>
          </div>
          <div
            className="payCash5 payCashPreset"
            onClick={(event) => handlePayCash(event, order, 5, setChange)}
          >
            <div className="payCashCenterText">5</div>
          </div>
          <div
            className="payCashCustom"
            onClick={(event) =>
              handlePayCash(event, order, "custom", setChange, setPayCash)
            }
          >
            <div className="payCashCenterText">Custom</div>
          </div>
          <div
            className="payCashExit"
            onClick={(event) =>
              handlePayCash(event, order, "exit", setChange, setPayCash)
            }
          >
            <div className="payCashCenterText">Done</div>
          </div>
        </div>
        <div className="payCashChange">
          <div className="payCashChangeTitle">
            <div className="payCashCenterText">Change</div>
          </div>
          <div className="payCashChangeValue">
            <div className="payCashCenterText">€{change.toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payCash">
      <div className="payCashOptions">
        <div
          className="payCash50 payCashPreset"
          onClick={(event) => handlePayCash(event, order, 50, setChange)}
        >
          <div className="payCashCenterText">50</div>
        </div>
        <div
          className="payCash20 payCashPreset"
          onClick={(event) => handlePayCash(event, order, 20, setChange)}
        >
          <div className="payCashCenterText">20</div>
        </div>
        <div
          className="payCash10 payCashPreset"
          onClick={(event) => handlePayCash(event, order, 10, setChange)}
        >
          <div className="payCashCenterText">10</div>
        </div>
        <div
          className="payCash5 payCashPreset"
          onClick={(event) => handlePayCash(event, order, 5, setChange)}
        >
          <div className="payCashCenterText">5</div>
        </div>
        <div
          className="payCashCustom"
          onClick={(event) =>
            handlePayCash(event, order, "custom", setChange, setPayCash)
          }
        >
          <div className="payCashCenterText">Custom</div>
        </div>
        <div
          className="payCashExit"
          onClick={(event) =>
            handlePayCash(event, order, "exit", setChange, setPayCash)
          }
        >
          <div className="payCashCenterText">Done</div>
        </div>
      </div>
      <div className="payCashChange">
        <div className="payCashChangeTitle">
          <div className="payCashCenterText">Change</div>
        </div>
        <div className="payCashChangeValue">
          <div className="payCashCenterText">€{change.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function handlePayCash(event, order, value, setChange) {
  if (value === "exit") {
    order.order.setOrder([]);
    order.setPayCash({ state: false, returnedKeypadValue: 0 });
    order.setChange(0)
  }

  let subtotal = 0;
  order.order.order.forEach((orderItem, index) => {
    if (!(orderItem.name === "Adjustment")) {
      subtotal += orderItem.price * orderItem.quantity;
    } else {
      //add code for displaying the adjustment
      subtotal += orderItem.value;
    }
  });

  let change = 0;
  if (typeof value === "number") {
    change = value - subtotal;

    setChange(change);
  }

  if (value === "custom") {
    order.setkeypad({
      enabled: true,
      value: "",
      sign: "+",
    });
  }
}
