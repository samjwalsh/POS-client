import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
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
    if (promise === null) return;
    else
      return (
        <div className='fixed h-screen w-screen z-10'>
          <div className='fixed top-0 left-0 m-0 p-0 bg-black opacity-50 z-20 h-screen w-screen'></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 backgroundcolour border-2 border-colour  rounded-lg shadow grid grid-cols-2 grid-rows-2 p-2 gap-2'>
            <div className='text-2xl row-span-1 col-span-2'>{title}</div>
            <div
              className='dialogConfirm button g row-span-1 btn btn--minus text-xl p-2 cnter-items'
              onClick={handleCancel}>
              Cancel
            </div>
            <div
              className='dialogConfirm button g row-span-1 btn btn--plus text-xl p-2 cnter-items'
              onClick={handleConfirm}>
              Continue
            </div>
          </div>
        </div>
      );
  };
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
