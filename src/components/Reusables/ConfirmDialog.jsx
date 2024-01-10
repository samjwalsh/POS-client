import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
const useConfirm = () => {
  const [promise, setPromise] = useState(null);
  const [text, setText] = useState(['Continue?', 'Cancel', 'Confirm']);

  const confirm = (args) =>
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
        <div className='fixed h-screen w-screen z-50'>
          <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background rounded-box max-w-[25rem]'>
            <div className='flex flex-col p-4 gap-2'>
              <div className='text-2xl flex items-start'>{text[0]}</div>
              <div className='text-lg flex items-start'>{text[3]}</div>
              <div className='justify-end flex flex-row min-w-[18rem] gap-2 whitespace-nowrap'>
                <div
                  className='row-span-1 btn btn-error text-lg w-min h-full'
                  onContextMenu={handleCancel}
                  onTouchStart={handleCancel}>
                  {text[1]}
                </div>
                <div
                  className='row-span-1 btn btn-primary text-lg w-min h-full'
                  onContextMenu={handleConfirm}
                  onTouchStart={handleConfirm}>
                  {text[2]}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  };
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
