import { useState } from 'react';
import * as React from 'react';

import playBeep from '../../tools/playBeep.js';
const useListSelect = () => {
  const [promise, setPromise] = useState(null);
  const [options, setOptions] = useState([]);

  const chooseOption = (options) =>
    new Promise((resolve, reject) => {
      setOptions(options);
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleChooseOption = (option) => {
    playBeep();
    promise?.resolve(option);
    handleClose();
  };

  // You could replace the Dialog with your library's version

  const optionsHTML = options.map((option) => {
    return (
      <div
        className='p-4 cnter-items primary uppercase font-bold text-xl w-full'
        onContextMenu={(e) => handleChooseOption(option)}
        onTouchStart={(e) => handleChooseOption(option)}
        key={option}>
        {option}
      </div>
    );
  });

  const ListSelect = () => {
    if (promise === null) return;
    else
      return (
        <div className='fixed h-screen w-screen z-50'>
          <div
            className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen z-50'
            onContextMenu={(e) => handleChooseOption(null)}
            onTouchStart={(e) => handleChooseOption(null)}></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 background border border-colour rnd  flex flex-col gap-2 p-2'>
            {optionsHTML}
          </div>
        </div>
      );
  };
  return [ListSelect, chooseOption];
};

export default useListSelect;
