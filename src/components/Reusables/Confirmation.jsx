import * as React from "react";

import log from "../../tools/logging";
import playBeep from "../../tools/playBeep";

export default function Confirmation(props) {
  let enabled = props.confirmation.enabled;
  let message = props.confirmation.message ? props.confirmation.message : "Continue?";
  let response = props.confirmation.response;

  if (enabled) {
    return (
      <div className="confirmationContainer">
        <div className="confirmationBox">
          <div className="confirmationBoxTitle">{message}</div>
          <div className="confirmationBoxNo" onClick={(e) => handleClickConfirmation(false)}>No</div>
          <div className="confirmationBoxYes" onClick={(e) => handleClickConfirmation(true)}>Yes</div>
        </div>
      </div>
    );
  }
}

function handleClickConfirmation(userResponse) {
    playBeep();
    props.setConfirmation({enabled: false, response: userResponse});
}
