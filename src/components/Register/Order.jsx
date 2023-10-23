import * as React from "react";
import { useState } from "react";

import log from "../../tools/logging";
import playBeep from "../../tools/playBeep";

import { addOrder } from "../../tools/ipc";

import PayCash, { calculateSubtotal } from "./PayCash.jsx";
import useKeypad from "../Reusables/Keypad.jsx";

export default function Order(props) {
  const { order, setOrder } = props;

  const [Keypad, keypad] = useKeypad();
  const [payCash, setPayCash] = useState(false);

  async function handlePlusMinus() {
    playBeep();
    const keypadValue = await keypad("currency");
    if (keypadValue === 0) return;
    log(`Update the adjustment in the order`);
    let temp_order = order;
    temp_order.push({ name: "Adjustment", price: keypadValue, quantity: 1 });
    setOrder([...temp_order]);
  }

  function handlePayment(paymentType) {
    playBeep();
    if (paymentType === "card") {
      log(`Payment type card selected, resetting order`);
      addOrder(props.order, "Card");
      props.setOrder([]);
      setPayCash(false);
    } else if (payCash === true) {
      setPayCash(false);
    } else {
      log(`Payment type cash selected, turning on keypad`);
      setPayCash(true);
    }
  }

  function handleOrderItemQuantityChange(direction, orderItem) {
    playBeep();

    order.forEach((item, index) => {
      log(`Reducing quantity of item ${item.name} in order by 1`);
      if (orderItem == item) {
        let temp_order = order;

        if (direction === "up") {
          temp_order[index].quantity++;
        } else if (orderItem.quantity > 1) {
          temp_order[index].quantity--;
        } else {
          temp_order.splice(index, 1);
        }
        setOrder([...temp_order]);
      }
    });
  }

  let subtotal = calculateSubtotal(order);
  log(`Calculating subtotal and generating HTML`);
  let orderItems = order.map((orderItem) => {
    log(`Adding ${orderItem.name} to HTML`);
    return (
      <div
        className="orderItem"
        key={`${orderItem.name} [${orderItem.addons}]`}
      >
        <div className="nameAndAddons">
          <div className="orderItemName">
            {orderItem.name +
              (orderItem.quantity > 1 ? ` (${orderItem.quantity})` : "")}
          </div>
          <div className="orderItemAddons">
            {orderItem.addons === undefined ? "" : orderItem.addons.join(", ")}
          </div>
        </div>
        <div className="priceAndPriceEach">
          <div className="orderItemPrice num">
            €{(orderItem.price * orderItem.quantity).toFixed(2)}
          </div>
          <div className="orderItemPriceEach num">
            €{orderItem.price.toFixed(2)} EA
          </div>
        </div>
        <div
          className="orderItemDecrease button r"
          onClick={() => handleOrderItemQuantityChange("down", orderItem)}
        >
          -
        </div>
        <div
          className="orderItemIncrease button g"
          onClick={() => handleOrderItemQuantityChange("up", orderItem)}
        >
          +
        </div>
      </div>
    );
  });

  log(`Rendering order container`);
  return (
    <>
      <Keypad />
      <div className="orderContainer" id="order">
        {payCash === true ? (
          <PayCash
            order={order}
            setOrder={setOrder}
            setPayCash={setPayCash}
            keypad={keypad}
          />
        ) : (
          <div className="orderItems">
            <div className="hiddenOrderItem"></div>
            {orderItems}
          </div>
        )}

        <div className="subTotal">
          <div className="subTotalTop">
            <div className="subTotalTitle">Subtotal</div>
            <div className="subTotalPrice num">€{subtotal.toFixed(2)}</div>
          </div>
          <div className="subTotalBottom">
            <div className="plusMinus" onClick={() => handlePlusMinus()}>
              <div className="plusMinusContainer b">±</div>
            </div>
            <div className="card" onClick={() => handlePayment("card")}>
              <div className="cardContainer g">Card</div>
            </div>
            <div className="cash" onClick={() => handlePayment("cash")}>
              <div className="cashContainer g">Cash</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
