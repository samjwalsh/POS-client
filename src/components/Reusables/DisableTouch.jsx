import { useState } from 'react';
import * as React from 'react';

import Modal from './Modal.jsx';

import playBeep from '../../tools/playBeep.js';
const useDisableTouch = () => {
  const [promise, setPromise] = useState(null);
  const [seconds, setSeconds] = useState(15);

  const disableTouch = () =>
    new Promise((resolve, reject) => {
      setSeconds(15);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const disableTouchArea = () => {
    if (promise === null) return;
    else
      React.useEffect(() => {
        if (seconds > 0) {
          setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
          handleClose();
        }
      });
    return (
      <Modal z={50}
        title='Cleaning Mode'
        text={`Touch screen will turn back on in ${seconds}
      ${seconds == 1 ? 'second' : 'seconds'}.`}></Modal>
    );
  };
  return [disableTouchArea, disableTouch];
};

export default useDisableTouch;
