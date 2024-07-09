import React from 'react';

const Modal = ({ children, className, title, text, z }) => {
  if (!z) z = 10;
  return (
    <div className={`fixed h-screen w-screen z-${z}`}>
      <div className='fixed top-0 left-0 m-0 p-0 transparent h-screen w-screen'></div>
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-scroll max-h-[90vh] w-7/12 no-scrollbar flex flex-col gap-2 bg-base-200'>
        <div className='title p-2 pt-4'>{title}</div>
        {text ? (
          <div className='text-base flex flex-col items-start font-normal p-2'>
            {text}
          </div>
        ) : (
          ''
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
