import { useState } from "react";
import * as React from "react";

import playBeep from "../../tools/playBeep.js";
const useConfirm = (title, message) => {
  const [promise, setPromise] = useState(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    playBeep();
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    playBeep();
    promise?.resolve(false);
    handleClose();
  };
  // You could replace the Dialog with your library's version
  const ConfirmationDialog = () => {
    if (promise !== null) {
      return (
        <div className="dialogContainer">
          <div className="dialogBackground"></div>
          <div className="dialog">
            <div className="dialogTitle y">{title}</div>
            <div className="dialogCancel button r" onClick={handleCancel}>
              Cancel
            </div>
            <div className="dialogConfirm button g" onClick={handleConfirm}>
              Continue
            </div>
          </div>
        </div>
      );
    } else {
      return;
    }
  };
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
