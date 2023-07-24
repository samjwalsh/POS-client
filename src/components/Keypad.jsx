import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { useState } from "react";

import log from "../tools/logging";

export default function Keypad(props) {
  const keypad = props.keypad;

  let keypadText = "";
  if (keypad.sign === "-") {
    log(`Keypad value is negative, parsing string`);
    keypadText += "(";
    keypadText += parseKeypadValue(keypad);
    keypadText += ")";
  } else {
    log(`Keypad value is positive, parsing string`);
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
          handleKeypadClick(event, props, "X");
        }}
      >
        <div className="keypadCenter keypadText">X</div>
      </div>
      <div
        className="keypadMinus keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "-");
        }}
      >
        <div className="keypadCenter keypadText">-</div>
      </div>
      <div
        className="keypadPlus keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "+");
        }}
      >
        <div className="keypadCenter keypadText">+</div>
      </div>
      <div
        className="keypadBack keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "Del");
        }}
      >
        <div className="keypadCenter keypadText">←</div>
      </div>
      <div
        className="keypad7 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "7");
        }}
      >
        <div className="keypadCenter keypadText">7</div>
      </div>
      <div
        className="keypad8 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "8");
        }}
      >
        <div className="keypadCenter keypadText">8</div>
      </div>
      <div
        className="keypad9 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "9");
        }}
      >
        <div className="keypadCenter keypadText">9</div>
      </div>
      <div
        className="keypad4 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "4");
        }}
      >
        <div className="keypadCenter keypadText">4</div>
      </div>
      <div
        className="keypad5 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "5");
        }}
      >
        <div className="keypadCenter keypadText">5</div>
      </div>
      <div
        className="keypad6 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "6");
        }}
      >
        <div className="keypadCenter keypadText">6</div>
      </div>
      <div
        className="keypad1 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "1");
        }}
      >
        <div className="keypadCenter keypadText">1</div>
      </div>
      <div
        className="keypad2 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "2");
        }}
      >
        <div className="keypadCenter keypadText">2</div>
      </div>
      <div
        className="keypad3 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "3");
        }}
      >
        <div className="keypadCenter keypadText">3</div>
      </div>

      <div
        className="keypad0 keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "0");
        }}
      >
        <div className="keypadCenter keypadText">0</div>
      </div>
      <div
        className="keypadEnter keypadButton"
        onClick={(event) => {
          handleKeypadClick(event, props, "Enter");
        }}
      >
        <div className="keypadCenter keypadText">{"→"}</div>
      </div>
    </div>
  );
}

function parseKeypadValue(keypad) {
  log(`Turning the keypad value into a number`);
  if (keypad.value === "") {
    return (parseFloat("0") / 100).toFixed(2);
  } else {
    return (parseFloat(keypad.value) / 100).toFixed(2);
  }
}

function handleKeypadClick(event, props, action) {
  const order = props.order;
  const setOrder = props.setOrder;
  const keypad = props.keypad;
  const setkeypad = props.setkeypad;
  const payCash = props.payCash;
  const change = props.change;
  const setChange = props.setChange;

  if (action === "X") {
    log(`X clicked on keypad`);
    setkeypad({ enabled: false, value: "", sign: "+" });
  } else if (action === "-") {
    log(`- clicked on keypad`);
    let temp_keypad = keypad;
    temp_keypad.sign = "-";
    setkeypad({ ...temp_keypad });
  } else if (action === "+") {
    log(`+ clicked on keypad`);
    let temp_keypad = keypad;
    temp_keypad.sign = "+";
    setkeypad({ ...temp_keypad });
  } else if (action === "Del") {
    log(`Del clicked on keypad`);
    if (keypad.value !== "") {
      log(`Removing last char from keypad value, given value isn't empty`);
      let temp_keypad = keypad;
      temp_keypad.value = temp_keypad.value.slice(0, -1);
      setkeypad({ ...temp_keypad });
    }
  } else if (action === "Enter") {
    log(`Enter clicked on keypad`);
    if (!(keypad.value === "")) {
      //Fucky stuff to allow me to edit an element in the array with only the react State shit

      let keypadValueArray = keypad.value.split("");
      if (keypadValueArray.length < 2) {
        keypadValueArray.unshift(0);
      }
      keypadValueArray.splice(keypadValueArray.length - 2, 0, ".");

      if (keypad.sign === "-") {
        keypadValueArray.unshift("-");
      }
      log(`Calculating keypad value`);
      let keypadValue = parseFloat(keypadValueArray.join(""));

      if (payCash.state === false) {
        log(`Update the adjustment in the order`);
        // 1. Make a shallow copy of the array
        let temp_order = props.order;

        // 2. Make a shallow copy of the element you want to mutate
        temp_order.push({ name: "Adjustment", value: keypadValue });

        // 5. Set the state to our new copy
        // More fuckery because react doesnt see changing quantity as a change to state, so we have to manually trigger a rerender with this method (destructuring?)

        props.setOrder([...temp_order]);
      } else {
        log(`Calculating the subtotal`);
        let subtotal = 0;
        props.order.forEach((orderItem, index) => {
          if (!(orderItem.name === "Adjustment")) {
            subtotal += orderItem.price * orderItem.quantity;
          } else {
            //add code for displaying the adjustment
            subtotal += orderItem.value;
          }
        });
        log(`Calculating the change given the keypad value and the subtotal`);
        setChange(keypadValue - subtotal);
      }
    }
    log(`Disabling the keypad`);
    setkeypad({ enabled: false, value: "", sign: "+" });
  } else {
    if (keypad.value.length < 4) {
      log(`Keypad value length is less than 4`);
      if (!(keypad.value === "" && action === "0")) {
        log(`Adding action ${action} to keypad`);
        let temp_keypad = keypad;
        temp_keypad.value += action;
        setkeypad({ ...temp_keypad });
      }
    }
  }
}
