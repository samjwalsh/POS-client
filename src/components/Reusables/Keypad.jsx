import { useState } from 'react';
import * as React from 'react';

import closeSVG from '../../assets/appicons/close.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';
import backSVG from '../../assets/appicons/backspace.svg';
import enterSVG from '../../assets/appicons/enter.svg';

import playBeep from '../../tools/playBeep';

const useKeypad = () => {
  const [promise, setPromise] = useState(null);
  const [keypadState, setkeypadState] = useState({
    value: '',
    sign: '+',
    numberFormat: 'currency',
  });

  const keypad = (initialValue, numberFormatLocal) =>
    new Promise((resolve) => {
      if (typeof initialValue !== 'number') {
        initialValue = '';
      } else {
        initialValue = initialValue.toString();
      }
      setkeypadState({
        value: initialValue,
        sign: '+',
        numberFormat:
          numberFormatLocal === undefined ? 'currency' : numberFormatLocal,
      });
      setPromise({ resolve });
    });

  const handleClose = (keypadResult) => {
    playBeep();
    promise?.resolve(keypadResult);
    setPromise(null);
    setkeypadState({
      value: '',
      sign: '+',
      numberFormat: 'currency',
    });
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
        setkeypadState({
          value: keypadState.value,
          sign: '-',
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
      case 'plus': {
        setkeypadState({
          value: keypadState.value,
          sign: '+',
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
      case 'delete': {
        setkeypadState({
          value: keypadState.value.slice(0, -1),
          sign: keypadState.sign,
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
      case 'enter': {
        if (keypadState.value.length === 0) handleClose(0);
        else if (keypadState.numberFormat === 'currency') {
          let keypadValue = parseInt(keypadState.value) / 100;
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(keypadValue);
        } else if (keypadState.numberFormat === 'passcode') {
          let keypadValue = parseInt(keypadState.value);
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(keypadValue);
        }
        break;
      }
      case '00': {
        if (
          keypadState.value.length >= 5 ||
          keypadState.value === '' ||
          keypadState.value === '0'
        ) {
          break;
        }
        setkeypadState({
          value: keypadState.value + button,
          sign: keypadState.sign,
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
      case '0': {
        if (
          keypadState.value.length >= 6 ||
          keypadState.value === '' ||
          keypadState.value === '0'
        ) {
          break;
        }
        setkeypadState({
          value: keypadState.value + button,
          sign: keypadState.sign,
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
      default: {
        if (
          keypadState.numberFormat === 'currency' &&
          keypadState.value.length === 6
        ) {
          break;
        }
        setkeypadState({
          value: keypadState.value + button,
          sign: keypadState.sign,
          numberFormat: keypadState.numberFormat,
        });
        break;
      }
    }
  }

  // creates the string that is shown in the html to represent the keypad value
  let keypadValueString;
  if (keypadState.numberFormat === 'currency') {
    if (parseInt(keypadState.value) > 0) {
      keypadValueString = (
        (parseInt(keypadState.value) * (keypadState.sign === '-' ? -1 : 1)) /
        100
      ).toFixed(2);
    } else {
      keypadValueString = (keypadState.sign === '-' ? '-' : '') + '0.00';
    }
  } else if (keypadState.numberFormat === 'passcode') {
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
        className='grid grid-cols-3 grid-rows-6 w-full h-full gap-2 text-2xl rndmd background p-4'
        onContextMenu={(event) => handleKeypadClick(event)}
        onTouchStart={(event) => handleKeypadClick(event)}>
        <div className='borderB rnd p-2 col-span-2 row-span 1 flex flex-row text-3xl justify-between w-full num'>
          <div className='text-left cnter-items'>
            {keypadState.numberFormat === 'currency' ? '€' : ''}
          </div>
          <div className='text-right justify-end cnter-items'>
            {keypadValueString}
          </div>
        </div>
        <div className='col-span-1 row-span-1 keypad negative' id='exit'>
          <img src={closeSVG} className='w-6 invert-icon' id='exit' />
        </div>
        <div className='col-span-1 row-span-1 keypad negative' id='minus'>
          <img src={minusSVG} className='w-6 invert-icon' id='minus' />
        </div>
        <div className='col-span-1 row-span-1 keypad positive' id='plus'>
          <img src={addSVG} className='w-6 invert-icon' id='plus' />
        </div>
        <div className='col-span-1 row-span-1 keypad secondary' id='delete'>
          <img src={backSVG} className='w-6 invert-icon' id='delete' />
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='7'>
          7
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='8'>
          8
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='9'>
          9
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='4'>
          4
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='5'>
          5
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='6'>
          6
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='1'>
          1
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='2'>
          2
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='3'>
          3
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='0'>
          0
        </div>
        <div className='col-span-1 row-span-1 keypad grey' id='00'>
          00
        </div>
        <div className='col-span-1 row-span-1 keypad primary' id='enter'>
          <img src={enterSVG} className='w-6 invert-icon' id='enter' />
        </div>
      </div>
    );
  }

  const keypadHTML = () => {
    if (promise === null) return;

    return (
      <div className='fixed h-screen w-screen z-20'>
        <div className='fixed top-0 left-0 m-0 p-0 transparent z-20 h-screen w-screen'></div>
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-4/12 h-5/6'>
          {createKeypadHTML()}
        </div>
      </div>
    );
  };

  return [keypadHTML, keypad];
};

export default useKeypad;
