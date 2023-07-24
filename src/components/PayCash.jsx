import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../tools/logging";

export default function PayCash(props) {
  console.log(props);
  const change = props.change;
  const setChange = props.setChange;

  if (props.payCash.returnedKeypadValue != 0) {
    log(`Rendering pay cash area given keypad value returned is not 0`);

    return (
      <div className="payCash">
        <div className="payCashOptions">
          <div
            className="payCash50 payCashPreset"
            onClick={(event) => handlePayCash(event, props, 50)}
          >
            <div className="payCashCenterText">50</div>
          </div>
          <div
            className="payCash20 payCashPreset"
            onClick={(event) => handlePayCash(event, props, 20)}
          >
            <div className="payCashCenterText">20</div>
          </div>
          <div
            className="payCash10 payCashPreset"
            onClick={(event) => handlePayCash(event, props, 10)}
          >
            <div className="payCashCenterText">10</div>
          </div>
          <div
            className="payCash5 payCashPreset"
            onClick={(event) => handlePayCash(event, props, 5)}
          >
            <div className="payCashCenterText">5</div>
          </div>
          <div
            className="payCashCustom"
            onClick={(event) => handlePayCash(event, props, "custom")}
          >
            <div className="payCashCenterText">Custom</div>
          </div>
          <div
            className="payCashExit"
            onClick={(event) => handlePayCash(event, props, "exit")}
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

  log(`Rendering pay cash area given keypad not used`);
  return (
    <div className="payCash">
      <div className="payCashOptions">
        <div
          className="payCash50 payCashPreset"
          onClick={(event) => handlePayCash(event, props, 50)}
        >
          <div className="payCashCenterText">50</div>
        </div>
        <div
          className="payCash20 payCashPreset"
          onClick={(event) => handlePayCash(event, props, 20)}
        >
          <div className="payCashCenterText">20</div>
        </div>
        <div
          className="payCash10 payCashPreset"
          onClick={(event) => handlePayCash(event, props, 10)}
        >
          <div className="payCashCenterText">10</div>
        </div>
        <div
          className="payCash5 payCashPreset"
          onClick={(event) => handlePayCash(event, props, 5)}
        >
          <div className="payCashCenterText">5</div>
        </div>
        <div
          className="payCashCustom"
          onClick={(event) => handlePayCash(event, props, "custom")}
        >
          <div className="payCashCenterText">Custom</div>
        </div>
        <div
          className="payCashExit"
          onClick={(event) => handlePayCash(event, props, "exit")}
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

function handlePayCash(event, props, value) {
  console.log(props);
  log(`Button for paying with cash clicked`);
  if (value === "exit") {
    log(`Exiting the pay cash section and resetting the order`);
    props.setOrder([]);
    props.setPayCash({ state: false, returnedKeypadValue: 0 });
    props.setChange(0);
  }

  let subtotal = 0;
  props.order.forEach((orderItem, index) => {
    if (!(orderItem.name === "Adjustment")) {
      subtotal += orderItem.price * orderItem.quantity;
    } else {
      //add code for displaying the adjustment
      subtotal += orderItem.value;
    }
  });

  log(`Calculating the subtotal`);

  let change = 0;
  if (typeof value === "number") {
    change = value - subtotal;

    props.setChange(change);
  }

  log(`Calculating the change`);

  if (value === "custom") {
    log(`Enabling the keypad`);
    props.setkeypad({
      enabled: true,
      value: "",
      sign: "+",
    });
  }
}
