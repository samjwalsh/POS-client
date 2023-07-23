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
