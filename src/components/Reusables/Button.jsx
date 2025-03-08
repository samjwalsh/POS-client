import React from 'react';
import Color from 'colorjs.io/dist/color.js';

const Button = ({
  children,
  type,
  className,
  onClick,
  icon,
  size,
  center,
  iconSize,
  id,
  colour,
}) => {
  if (!iconSize) iconSize = 8;
  let classes = ' ';
  if (!center) {
    classes = 'dBtn ';
  } else {
    classes =
      'flex p-2 text-left min-h-[3rem] cnter justify-center items-center ';
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
  if (!colour) {
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
      case 'base': {
        classes += 'bg-base-100 text-base-content';
      }
    }
  } else {
    let colourObj = new Color(colour);
    let colourStr = colourObj.toString();
    let white = new Color('white');
    let black = new Color('black');
    colour = {};
    let whiteContrast = colourObj.contrast(white, 'Lstar');
    let blackContrast = colourObj.contrast(black, 'Lstar');
    if (whiteContrast > blackContrast) {
      colour.color = white.toString();
    } else {
      colour.color = black.toString();
    }
    colour.background = colourStr;
  }
  return (
    <button
      className={classes + ' ' + className}
      style={colour ? colour : undefined}
      onAuxClick={onClick}
      onClick={onClick}
      id={id}>
      {children ? <>{children}</> : ''}
      {icon ? (
        <img src={icon} id={id} className={`w-${iconSize} icon icon-${type}`} />
      ) : (
        ''
      )}
    </button>
  );
};

export default Button;
