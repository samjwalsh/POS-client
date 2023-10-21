import { useState } from "react";
import * as React from "react";

import playBeep from "../../tools/playBeep";

const useKeypad = (numberFormat) => {
  const [promise, setPromise] = useState(null);
  const [keypadState, setkeypadState] = useState({ value: 0, sign: "+" });

  // Code for creating the keypad text string to be shown to the user
  if (numberFormat === undefined) {
    numberFormat = "currency";
  }

  const keypad = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    playBeep();
    // calculate keypad value TODO
    promise?.resolve(keypadValue);
    setPromise(null);
  };

  function handleKeypadClick(event) {
    console.log(event.target.id);
  }

  const keypadHTML = () => {
    if (promise === null) return;
    else
      return (
        <div
          className="keypadGrid"
          onClick={(event) => handleKeypadClick(event)}
        >
          <div className="keypadDisplay ">
            <div className="keypadDisplayText num ">€</div>
            <div className="keypadDisplayTextValue num">{keypadText}</div>
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
