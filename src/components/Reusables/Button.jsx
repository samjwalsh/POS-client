import React from 'react';

const Button = ({ children, type, className, onClick, icon, size, center }) => {
  let classes = '';
  if (!center) {
    classes = 'dBtn ';
  } else {
    classes = 'cnter justify-center items-center ';
  }

  switch (size) {
    case 'large': {
      classes += 'text-2xl ';
      break;
    }
    default: {
      classes += 'text-lg ';
    }
  }

  switch (type) {
    case 'primary': {
      classes += 'bg-primary text-primary-content ';
      break;
    }
    case 'secondary': {
      classes += 'bg-neutral text-neutral-content ';
      break;
    }
    case 'tertiary': {
      classes += 'border border-primary text-primary ';
      break;
    }
    case 'danger': {
      classes += 'bg-error text-error-content ';
      break;
    }
    case 'danger-tertiary': {
      classes += 'border border-error text-error ';
      break;
    }
    case 'success': {
      classes += 'bg-success text-success-content ';
      break;
    }
    case 'ghost': {
      classes += 'bg-base-200 text-base-content ';
      break;
    }
    case 'warn': {
      classes += 'bg-warning text-warning-content ';
      break;
    }
  }
  return (
    <button
      className={classes + ' ' + className}
      onAuxClick={onClick}
      onTouchEnd={onClick}>
      {children ? (
        <>
          {children}
          <div className='pr-2'></div>
        </>
      ) : (
        ''
      )}
      {icon ? <img src={icon} className={`w-8 icon icon-${type}`} /> : ''}
    </button>
  );
};

export default Button;
