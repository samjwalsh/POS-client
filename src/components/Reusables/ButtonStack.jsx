import React from 'react';

const ButtonStack = ({ children, className }) => {
  return (
    <div className={`justify-end flex flex-row w-full gap-[1px] whitespace-nowrap ${className} `}>
      {children}
    </div>
  );
};

export default ButtonStack;
