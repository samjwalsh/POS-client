import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../../tools/logging";

import { addOrder } from "../../tools/ipc";

import PayCash from "./PayCash.jsx";
import Keypad from "../Reusables/Keypad.jsx";

import { quit } from "../../tools/ipc";

import playBeep from "../../tools/playBeep";

export default function Order(props) {
  const order = props.order;
  const setOrder = props.setOrder;

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

  const passProps = {
    payCash,
    setPayCash,
    order,
    setOrder,
  };

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
  order.forEach((orderItem, index) => {
    let passProps = { order, setOrder, orderItem };
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
            onClick={(event) => handleOrderItemRemove(event, passProps)}
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
              onClick={(event) => handleOrderItemRemove(event, passProps)}
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
              onClick={(event) => handlePayment(passProps, "card")}
            >
              <div className="cardContainer">Card</div>
            </div>
            <div
              className="cash"
              onClick={(event) => handlePayment(passProps, "cash")}
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
            onClick={(event) => handlePayment(passProps, "card")}
          >
            <div className="cardContainer">Card</div>
          </div>
          <div
            className="cash"
            onClick={(event) => handlePayment(passProps, "cash")}
          >
            <div className="cashContainer">Cash</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function handlePayment(props, paymentType) {
  playBeep();
  const payCash = props.payCash;
  const setPayCash = props.setPayCash;
  //TODO add code to record all orders
  if (paymentType === "card") {
    log(`Payment type card selected, resetting order`);
    addOrder(props.order, "Card");
    props.setOrder([]);
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

function handlePlusMinus(event, keypad, setkeypad) {
  playBeep();

  log(`Opening the keypad`);
  let temp_keypad = keypad;
  temp_keypad.enabled = !keypad.enabled;
  setkeypad({ ...temp_keypad });
}

function handleOrderItemRemove(event, props) {
  playBeep();
  const orderItem = props.orderItem;
  const order = props.order;
  const setOrder = props.setOrder;

  if (orderItem.name === "Adjustment") {
    order.forEach((item, index) => {
      if (orderItem === item) {
        log(`Removing adjustment`);
        let temp_order = order;
        let temp_orderItem = temp_order[index];
        temp_orderItem.value = 0;
        temp_order[index] = temp_orderItem;
        setOrder([...temp_order]);
      }
    });
  } else if (orderItem.quantity > 1) {
    order.forEach((item, index) => {
      log(`Reducing quantity of item ${item.name} in order by 1`);
      if (orderItem == item) {
        let temp_order = order;
        let temp_orderItem = temp_order[index];
        temp_orderItem.quantity--;
        temp_order[index] = temp_orderItem;
        setOrder([...temp_order]);
      }
    });
  } else {
    order.forEach((item, index) => {
      if (orderItem == item) {
        log(`Removing item ${item.name} from order`);
        let temp_order = order;
        temp_order.splice(index, 1);
        setOrder([...temp_order]);
      }
    });
  }
}
