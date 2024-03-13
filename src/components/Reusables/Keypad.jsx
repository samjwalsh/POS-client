import { useState } from 'react';
import * as React from 'react';

import closeSVG from '../../assets/appicons/close.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';
import backSVG from '../../assets/appicons/backspace.svg';
import enterSVG from '../../assets/appicons/enter.svg';

import Button from '../Reusables/Button.jsx';

import playBeep from '../../tools/playBeep';
import { cF, fF } from '../../tools/numbers.js';

const currLimit = 7;
const passLimit = 10;

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
        handleClose(false);
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
        if (keypadState.numberFormat === 'currency') {
          let keypadValue = parseInt(keypadState.value) / 100;
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(isNaN(keypadValue) ? 0 : keypadValue);
        } else if (keypadState.numberFormat === 'passcode') {
          let keypadValue = parseInt(keypadState.value);
          if (keypadState.sign === '-') {
            keypadValue *= -1;
          }
          handleClose(isNaN(keypadValue) ? 0 : keypadValue);
        }
        break;
      }
      case '00': {
        if (
          keypadState.value.length >= currLimit - 1 ||
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
          keypadState.value.length >= currLimit ||
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
          keypadState.value.length === currLimit
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
        className='grid grid-cols-3 grid-rows-6 w-full h-full gap-2 text-2xl background p-2'
        onAuxClick={(event) => handleKeypadClick(event)}
        onTouchEnd={(event) => handleKeypadClick(event)}>
        <div className=' rounded-btn p-2 col-span-2 row-span 1 flex flex-row text-3xl justify-between w-full'>
          <div className='text-left cnter'>
            {keypadState.numberFormat === 'currency' ? '€' : ''}
          </div>
          <div className='text-right justify-end cnter'>
            {keypadState.numberFormat === 'currency'
              ? parseFloat(keypadValueString).toFixed(2)
              : keypadValueString}
          </div>
        </div>
        <Button
          type='danger'
          icon={closeSVG}
          className='col-span-1 row-span-1'
          id='exit'></Button>
        <Button
          type='danger'
          icon={minusSVG}
          className='col-span-1 row-span-1'
          id='minus'></Button>
        <Button
          type='success'
          icon={addSVG}
          className='col-span-1 row-span-1'
          id='plus'></Button>
        <Button
          type='warn'
          icon={backSVG}
          className='col-span-1 row-span-1'
          id='delete'></Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='7'>
          7
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='8'>
          8
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='9'>
          9
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='4'>
          4
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='5'>
          5
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='6'>
          6
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='1'>
          1
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='2'>
          2
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='3'>
          3
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='0'>
          0
        </Button>
        <Button
          type='secondary'
          className='col-span-1 row-span-1'
          size='large'
          id='00'>
          00
        </Button>
        <Button
          type='primary'
          size='large'
          className='col-span-1 row-span-1'
          id='enter'
          icon={enterSVG}></Button>
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
