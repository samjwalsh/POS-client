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

  const optionsHTML = options.map((option) => {
    return (
      <div
        className='btn btn-neutral text-2xl p-4 h-auto'
        onAuxClick={(e) => handleChooseOption(option)}
        onClick={(e) => handleChooseOption(option)}
        key={option}>
        {option}
      </div>
    );
  });

  const ListSelect = () => {
    if (promise === null) return;
    else
      return (
        <div className='fixed h-screen w-screen z-10'>
          <div
            className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen  '
            onAuxClick={(e) => handleChooseOption(null)}
            onClick={(e) => handleChooseOption(null)}></div>
          <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  background flex flex-col gap-2 rounded-box min-w-[15rem] p-4 overflow-hidden overflow-y-scroll max-h-[100vh] no-scrollbar'>
            {optionsHTML}
          </div>
        </div>
      );
  };
  return [ListSelect, chooseOption];
};

export default useListSelect;
