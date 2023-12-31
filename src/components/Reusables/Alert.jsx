import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
const useAlert = () => {
  const [promise, setPromise] = useState(null);
  const [text, setText] = useState('');

  const alert = (args) =>
    new Promise((resolve, reject) => {
      if (args) setText(args);
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

  // You could replace the Dialog with your library's version
  const alertDialog = () => {
    if (promise === null) return;
    else
      return (
        <div className='fixed h-screen w-screen z-50'>
          <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border border-colour rnd '>
            <div className='flex flex-col p-2 gap-2 w-96'>
              <div className='w-full text-2xl max-h-96 overflow-y-scroll no-scrollbar'>
                {text}
              </div>
              <div
                className='dialogConfirm button g row-span-1 btn primary text-xl p-2 cnter-items w-full h-full'
                onContextMenu={handleConfirm}
                onTouchStart={handleConfirm}>
                OK
              </div>
            </div>
          </div>
        </div>
      );
  };
  return [alertDialog, alert];
};

export default useAlert;
