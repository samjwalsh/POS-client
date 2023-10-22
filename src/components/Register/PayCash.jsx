import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../../tools/logging";
import playBeep from "../../tools/playBeep";
import { addOrder } from "../../tools/ipc";
import useKeypad from "../Reusables/Keypad.jsx";

export default function PayCash(props) {
  const { order, setOrder, setPayCash, keypad } = props;

  const [change, setChange] = useState(0);

  async function handleButtonPress(value) {
    playBeep();
    log(`Button for paying with cash clicked`);
    if (value === "exit") {
      log(`Exiting the pay cash section and resetting the order`);
      setOrder([]);
      setPayCash(false);
      setChange(0);
      addOrder(order, "Cash");
    }

    const subtotal = calculateSubtotal(order);

    log(`Calculating the subtotal`);

    let change = 0;
    if (typeof value === "number") {
      change = value - subtotal;

      setChange(change);
    }

    log(`Calculating the change`);

    if (value === "custom") {
      log(`Enabling the keypad`);
      console.log("here");
      const tendered = await keypad("currency");
      let change = 0;
      if (typeof tendered === "number") {
        change = tendered - subtotal;
        setChange(change);
      }
    }
  }

  return (
    <div className="payCash">
      <div className="payCashOptions">
        <div
          className="payCash50 payCashPreset b button num"
          onClick={() => handleButtonPress(50)}
        >
          €50
        </div>
        <div
          className="payCash20 payCashPreset b button num"
          onClick={() => handleButtonPress(20)}
        >
          €20
        </div>
        <div
          className="payCash10 payCashPreset b button num"
          onClick={() => handleButtonPress(10)}
        >
          €10
        </div>
        <div
          className="payCash5 payCashPreset b button num"
          onClick={() => handleButtonPress(5)}
        >
          €5
        </div>
        <div
          className="payCashCustom b button"
          onClick={() => handleButtonPress("custom")}
        >
          Custom
        </div>
        <div
          className="payCashExit g"
          onClick={() => handleButtonPress("exit")}
        >
          Done
        </div>
      </div>
      <div className="payCashChange">
        <div className="payCashChangeTitle">
          <div className="payCashCenterText">Change</div>
        </div>
        <div className="payCashChangeValue">
          <div className="payCashCenterText num">€{change.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export function calculateSubtotal(order) {
  let subtotal = 0;
  order.forEach((orderItem) => {
    subtotal += orderItem.price * orderItem.quantity;
  });
  return subtotal;
}
