import { useState } from "react";
import * as React from "react";

import playBeep from "../../tools/playBeep";

const useKeypad = (numberFormat) => {
  const [promise, setPromise] = useState(null);
  const [keypadState, setkeypadState] = useState({ value: "", sign: "+" });

  // Code for creating the keypad text string to be shown to the user
  if (numberFormat === undefined) {
    numberFormat = "currency";
  }

  const keypad = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = (keypadResult) => {
    playBeep();
    // calculate keypad value TODO
    promise?.resolve(keypadResult);
    setPromise(null);
    setkeypadState({ value: "", sign: "+" });
  };

  function handleKeypadClick(event) {
    const button = event.target.id;

    switch (button) {
      case "exit": {
        handleClose(0);
        break;
      }
      case "minus": {
        setkeypadState({ value: keypadState.value, sign: "-" });
        break;
      }
      case "plus": {
        setkeypadState({ value: keypadState.value, sign: "+" });
        break;
      }
      case "delete": {
        setkeypadState({
          value: keypadState.value.slice(0, -1),
          sign: keypadState.sign,
        });
        break;
      }
      case "enter": {
        if (keypadState.value.length === 0) handleClose(0);
        else {
          let keypadValue = parseInt(keypadState.value) / 100;
          if (keypadState.sign === "-") {
            keypadValue *= -1;
          }
          handleClose(keypadValue);
        }
        break;
      }
      default: {
        if (numberFormat === "currency" && keypadState.value.length < 5) {
          setkeypadState({
            value: keypadState.value + button,
            sign: keypadState.sign,
          });
        }
        break;
      }
    }
  }

  let keypadValueString;
  if (numberFormat === "currency") {
    if (parseInt(keypadState.value) > 0) {
      keypadValueString = (
        (parseInt(keypadState.value) * (keypadState.sign === "-" ? -1 : 1)) /
        100
      ).toFixed(2);
    } else {
      keypadValueString = (keypadState.sign === "-" ? "-" : "") + "0.00";
    }
  }

  const keypadHTML = () => {
    if (promise === null) return;
    return (
      <div className="keypadGrid" onClick={(event) => handleKeypadClick(event)}>
        <div className="keypadDisplay ">
          <div className="keypadDisplayText num ">
            {numberFormat === "currency" ? "€" : ""}
          </div>
          <div className="keypadDisplayTextValue num">{keypadValueString}</div>
        </div>
        <div className="keypadClose keypadBtn r" id="exit">
          X
        </div>
        <div className="keypadMinus keypadBtn b" id="minus">
          -
        </div>
        <div className="keypadPlus keypadBtn b" id="plus">
          +
        </div>
        <div className="keypadBack keypadBtn b" id="delete">
          ←
        </div>
        <div className="keypad7 keypadBtn b" id="7">
          7
        </div>
        <div className="keypad8 keypadBtn b" id="8">
          8
        </div>
        <div className="keypad9 keypadBtn b" id="9">
          9
        </div>
        <div className="keypad4 keypadBtn b" id="4">
          4
        </div>
        <div className="keypad5 keypadBtn b" id="5">
          5
        </div>
        <div className="keypad6 keypadBtn b" id="6">
          6
        </div>
        <div className="keypad1 keypadBtn b" id="1">
          1
        </div>
        <div className="keypad2 keypadBtn b" id="2">
          2
        </div>
        <div className="keypad3 keypadBtn b" id="3">
          3
        </div>
        <div className="keypad0 keypadBtn b" id="0">
          0
        </div>
        <div className="keypadEnter keypadBtn g" id="enter">
          →
        </div>
      </div>
    );
  };

  return [keypadHTML, keypad];
};

export default useKeypad;
