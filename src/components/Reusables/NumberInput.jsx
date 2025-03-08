import React from 'react';

import euroSVG from '../../assets/appicons/euro.svg';

const NumberInput = ({ value, onClick, dim }) => {
  return (
    <div
      className={`bg-base-100 w-full p-2 border-b bc flex flex-row justify-between text-lg mb-2 ${
        dim ? 'text-black text-opacity-50' : ''
      }`}
      onAuxClick={onClick}
      onClick={onClick}>
      <div className='cnter'>{value}</div>
      <img src={euroSVG} className='h-full aspect-square w-8' />
    </div>
  );
};

export default NumberInput;
