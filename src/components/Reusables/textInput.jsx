import { useState } from 'react';
import * as React from 'react';

import closeSVG from '../../assets/appicons/close.svg';
import addSVG from '../../assets/appicons/add.svg';
import minusSVG from '../../assets/appicons/minus.svg';
import backSVG from '../../assets/appicons/backspace.svg';
import enterSVG from '../../assets/appicons/enter.svg';

import playBeep from '../../tools/playBeep';

const useKeyboard = () => {
  const [promise, setPromise] = useState(null);
  const [keyboardValue, setKeyboardValue] = useState('');
  const [keyboardState, setKeyboardState] = useState('normal');

  // Code for creating the keyboard text string to be shown to the user

  const keyboard = (initialValue) =>
    new Promise((resolve) => {
      setKeyboardValue(initialValue);
      setPromise({ resolve });
    });

  const handleClose = (keyboardResult) => {
    playBeep();
    promise?.resolve(keyboardResult);
    setPromise(null);
    setKeyboardValue('');
  };

  function handleKeyboardClick(event) {
    const button = event.target.id;
    playBeep();

    switch (button) {
      case 'exit': {
        handleClose('');
        break;
      }
      case 'delete': {
        setKeyboardValue(keyboardValue.slice(0, -1));
        break;
      }
      case 'enter': {
        handleClose(keyboardValue);
        break;
      }
      case '&apos;': {
        setKeyboardValue(keyboardValue + "'");
        break;
      }
      case 'clear': {
        setKeyboardValue('');
        break;
      }
      case 'shift': {
        if (keyboardState !== 'shift') {
          setKeyboardState('shift');
        } else {
          setKeyboardState('normal');
        }
        break;
      }
      case 'caps': {
        if (keyboardState !== 'caps') {
          setKeyboardState('caps');
        } else {
          setKeyboardState('normal');
        }
        break;
      }
      default: {
        if (keyboardState === 'shift') {
          setKeyboardValue(keyboardValue + button.toUpperCase());
          setKeyboardState('normal');
        } else if (keyboardState === 'caps') {
          setKeyboardValue(keyboardValue + button.toUpperCase());
        } else {
          setKeyboardValue(keyboardValue + button);
        }
        break;
      }
    }
  }

  // creates the string that is shown in the html to represent the keyboard value

  function createKeyboardHTML() {
    return (
      <div
        className={`grid grid-cols-1 grid-rows-6 w-full h-full  gap-2 p-2 text-2xl rnd background borderD border-colour font-mono ${
          keyboardState !== 'normal' ? 'uppercase' : ''
        }`}
        onContextMenu={(event) => handleKeyboardClick(event)}
        onTouchStart={(event) => handleKeyboardClick(event)}>
        <div className='borderD border-colour rnd p-2 col-span-1 row-span 1 text-3xl justify-between w-full num text-left normal-case'>
          {keyboardValue + "_"}
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey negative' id='exit'>
            <img src={closeSVG} className='w-6 invert-icon' id='exit' />
          </div>
          <div className='keyboardKey grey' id='1'>
            1
          </div>
          <div className='keyboardKey grey' id='2'>
            2
          </div>
          <div className='keyboardKey grey' id='3'>
            3
          </div>
          <div className='keyboardKey grey' id='4'>
            4
          </div>
          <div className='keyboardKey grey' id='5'>
            5
          </div>
          <div className='keyboardKey grey' id='6'>
            6
          </div>
          <div className='keyboardKey grey' id='7'>
            7
          </div>
          <div className='keyboardKey grey' id='9'>
            9
          </div>
          <div className='keyboardKey grey' id='0'>
            0
          </div>
          <div className='keyboardKey grey' id='-'>
            -
          </div>
          <div className='keyboardKey grey' id='+'>
            +
          </div>

          <div className='keyboardKey secondary w-20' id='delete'>
            <img src={backSVG} className='w-6 invert-icon' id='delete' />
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey grey w-12' id='clear'>
            CLEAR
          </div>
          <div className='keyboardKey grey' id='q'>
            q
          </div>
          <div className='keyboardKey grey' id='w'>
            w
          </div>
          <div className='keyboardKey grey' id='e'>
            e
          </div>
          <div className='keyboardKey grey' id='r'>
            r
          </div>
          <div className='keyboardKey grey' id='t'>
            t
          </div>
          <div className='keyboardKey grey' id='y'>
            y
          </div>
          <div className='keyboardKey grey' id='u'>
            u
          </div>
          <div className='keyboardKey grey' id='i'>
            i
          </div>
          <div className='keyboardKey grey' id='o'>
            o
          </div>
          <div className='keyboardKey grey' id='p'>
            p
          </div>
          <div className='keyboardKey grey' id='('>
            (
          </div>
          <div className='keyboardKey grey' id=')'>
            )
          </div>
          <div className='keyboardKey grey' id=':'>
            :
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey grey' id='caps'>
            CAPS
          </div>
          <div className='keyboardKey grey' id='a'>
            a
          </div>
          <div className='keyboardKey grey' id='s'>
            s
          </div>
          <div className='keyboardKey grey' id='d'>
            d
          </div>
          <div className='keyboardKey grey' id='f'>
            f
          </div>
          <div className='keyboardKey grey' id='g'>
            g
          </div>
          <div className='keyboardKey grey' id='h'>
            h
          </div>
          <div className='keyboardKey grey' id='j'>
            j
          </div>
          <div className='keyboardKey grey' id='k'>
            k
          </div>
          <div className='keyboardKey grey' id='l'>
            l
          </div>
          <div className='keyboardKey grey' id=':'>
            :
          </div>
          <div className='keyboardKey grey' id="'">
            '
          </div>

          <div className='keyboardKey positive w-20' id='enter'>
            <img src={enterSVG} className='w-6 invert-icon' id='enter' />
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey grey w-24' id='shift'>
            SHIFT
          </div>
          <div className='keyboardKey grey' id='z'>
            z
          </div>
          <div className='keyboardKey grey' id='x'>
            x
          </div>
          <div className='keyboardKey grey' id='c'>
            c
          </div>
          <div className='keyboardKey grey' id='v'>
            v
          </div>
          <div className='keyboardKey grey' id='b'>
            b
          </div>
          <div className='keyboardKey grey' id='n'>
            n
          </div>
          <div className='keyboardKey grey' id='m'>
            m
          </div>
          <div className='keyboardKey grey' id=','>
            ,
          </div>
          <div className='keyboardKey grey' id='.'>
            .
          </div>
          <div className='keyboardKey grey' id='/'>
            /
          </div>
          <div className='keyboardKey grey w-24' id='shift'>
            SHIFT
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey grey' id=' '>
            SPACE
          </div>
        </div>
      </div>
    );
  }

  const keyboardHTML = () => {
    if (promise === null) return;

    return (
      <div className='absolute top-0 bottom-0 right-0 left-0 h-screen w-screen z-20 grid grid-rows-6 grid-cols-1 fill-slate-300'>
        <div className='transparent row-span-2 col-span-1'></div>
        <div className='row-span-4 col-span-1'>{createKeyboardHTML()}</div>
      </div>
    );
  };

  return [keyboardHTML, keyboard];
};

export default useKeyboard;
