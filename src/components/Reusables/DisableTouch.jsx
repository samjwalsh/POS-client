import { useState } from 'react';
import * as React from 'react';

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
      <div className='fixed h-screen w-screen z-50'>
        <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background rounded-box max-w-[30rem]  border border-colour'>
          <div className='flex flex-col p-4 gap-2'>
            <div className='text-2xl flex items-start'>Cleaning Mode</div>
            <div className='text-lg flex items-start'>
              Touch screen will turn back on in {seconds}{' '}
              {seconds == 1 ? 'second' : 'seconds'}.
            </div>
          </div>
        </div>
      </div>
    );
  };
  return [disableTouchArea, disableTouch];
};

export default useDisableTouch;
