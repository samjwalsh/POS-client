import { useState } from 'react';
import * as React from 'react';

import closeSVG from '../../assets/appicons/close.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';
import backSVG from '../../assets/appicons/backspace.svg';
import enterSVG from '../../assets/appicons/enter.svg';

import playBeep from '../../tools/playBeep';

const useKeypad = (numberFormat) => {
  const [promise, setPromise] = useState(null);
  const [keypadState, setkeypadState] = useState({ value: '', sign: '+' });

  // Code for creating the keypad text string to be shown to the user
  if (numberFormat === undefined) {
    numberFormat = 'currency';
  }

  const keypad = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = (keypadResult) => {
    playBeep();
    // calculate keypad value TODO
    promise?.resolve(keypadResult);
    setPromise(null);
    setkeypadState({ value: '', sign: '+' });
  };

  function handleKeypadClick(event) {
    const button = event.target.id;
    playBeep();

    switch (button) {
      case 'exit': {
        handleClose(0);
        break;
      }
      case 'minus': {
        setkeypadState({ value: keypadState.value, sign: '-' });
        break;
      }
      case 'plus': {
        setkeypadState({ value: keypadState.value, sign: '+' });
        break;
      }
      case 'delete': {
        setkeypadState({
          value: keypadState.value.slice(0, -1),
          sign: keypadState.sign,
        });
        break;
      }
      case 'enter': {
        if (keypadState.value.length === 0) handleClose(0);
        else if (numberFormat === 'currency') {
          let keypadValue = parseInt(keypadState.value) / 100;
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(keypadValue);
        } else if (numberFormat === 'passcode') {
          let keypadValue = parseInt(keypadState.value);
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(keypadValue);
        }
        break;
      }
      default: {
        if (numberFormat === 'currency' && keypadState.value.length === 6) {
          break;
        }
        setkeypadState({
          value: keypadState.value + button,
          sign: keypadState.sign,
        });
        break;
      }
    }
  }

  // creates the string that is shown in the html to represent the keypad value
  let keypadValueString;
  if (numberFormat === 'currency') {
    if (parseInt(keypadState.value) > 0) {
      keypadValueString = (
        (parseInt(keypadState.value) * (keypadState.sign === '-' ? -1 : 1)) /
        100
      ).toFixed(2);
    } else {
      keypadValueString = (keypadState.sign === '-' ? '-' : '') + '0.00';
    }
  } else if (numberFormat === 'passcode') {
    if (parseInt(keypadState.value) > 0) {
      keypadValueString =
        parseInt(keypadState.value) * (keypadState.sign === '-' ? -1 : 1);
    } else {
      keypadValueString = (keypadState.sign === '-' ? '-' : '') + '0 ';
    }
  }

  function createKeypadHTML() {
    return (
      <div
        className='grid grid-cols-3 grid-rows-6 w-full h-full text-white gap-2 p-2 text-xl '
        onClick={(event) => handleKeypadClick(event)}>
        <div className=' col-span-2 row-span 1 flex flex-row text-2xl font-mono justify-between w-full'>
          <div className='text-left cnter-items'>
            {numberFormat === 'currency' ? '€' : ''}
          </div>
          <div className='text-right justify-end cnter-items'>{keypadValueString}</div>
        </div>
        <div className='col-span-1 row-span-1 keypad gradientred' id='exit'>
          <img src={closeSVG} className='w-6' id='exit' />
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='minus'>
          <img src={minusSVG} className='w-6' id='minus' />
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='plus'>
          <img src={addSVG} className='w-6' id='plus' />
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='delete'>
          <img src={backSVG} className='w-6' id='delete' />
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='7'>
          7
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='8'>
          8
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='9'>
          9
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='4'>
          4
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='5'>
          5
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='6'>
          6
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='1'>
          1
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='2'>
          2
        </div>
        <div className='col-span-1 row-span-1 keypad gradientblack' id='3'>
          3
        </div>
        <div className='col-span-2 row-span-1 keypad gradientblack' id='0'>
          0
        </div>
        <div className='col-span-1 row-span-1 keypad gradientgreen' id='enter'>
          <img src={enterSVG} className='w-6' id='enter' />
        </div>
      </div>
    );
  }

  const keypadHTML = () => {
    if (promise === null) return;

    return (
      <div className='absolute h-screen w-screen '>
        <div className='absolute bg-black opacity-50 z-10 h-screen w-screen'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-stone-900 border-2 border-colour w-4/12 h-5/6 rounded-lg shadow'>
          {createKeypadHTML()}
        </div>
      </div>
    );
  };

  return [keypadHTML, keypad];
};

export default useKeypad;
