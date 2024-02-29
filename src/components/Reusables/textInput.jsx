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
  const [initialValue, setInitialValue] = useState('');

  // Code for creating the keyboard text string to be shown to the user

  const keyboard = (initialValue) =>
    new Promise((resolve) => {
      setKeyboardValue(initialValue);
      setInitialValue(initialValue);
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
        handleClose(false);
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
        if (keyboardValue.length > 47) return;
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
        className={`grid grid-cols-1 grid-rows-6 w-full h-full gap-2 p-2 text-2xl font-mono bg-base-100 ${
          keyboardState !== 'normal' ? 'uppercase' : ''
        }`}
        onAuxClick={(event) => handleKeyboardClick(event)}
        onTouchEnd={(event) => handleKeyboardClick(event)}>
        <div className='border bc rounded-btn p-2 col-span-1 row-span 1 text-3xl justify-between w-full num text-left normal-case'>
          {keyboardValue + '_'}
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div className='keyboardKey btn-error' id='exit'>
            <img src={closeSVG} className='w-6 icon' id='exit' />
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='1'>
            1
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='2'>
            2
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='3'>
            3
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='4'>
            4
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='5'>
            5
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='6'>
            6
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='7'>
            7
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='8'>
            8
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='9'>
            9
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='0'>
            0
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='-'>
            -
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='+'>
            +
          </div>

          <div className='keyboardKey btn-warning w-20' id='delete'>
            <img src={backSVG} className='w-6 icon' id='delete' />
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div
            className='keyboardKey btn-secondary text-neutral-content w-12'
            id='clear'>
            CLEAR
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='q'>
            q
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='w'>
            w
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='e'>
            e
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='r'>
            r
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='t'>
            t
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='y'>
            y
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='u'>
            u
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='i'>
            i
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='o'>
            o
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='p'>
            p
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='('>
            (
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id=')'>
            )
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id=';'>
            ;
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div
            className={`keyboardKey ${
              keyboardState === 'caps'
                ? 'btn-success'
                : 'btn-secondary text-neutral-content'
            }`}
            id='caps'>
            CAPS
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='a'>
            a
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='s'>
            s
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='d'>
            d
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='f'>
            f
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='g'>
            g
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='h'>
            h
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='j'>
            j
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='k'>
            k
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='l'>
            l
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id=':'>
            :
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id="'">
            '
          </div>

          <div className='keyboardKey btn-primary w-20' id='enter'>
            <img src={enterSVG} className='w-6 icon' id='enter' />
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div
            className={`keyboardKey ${
              keyboardState === 'shift'
                ? 'btn-success'
                : 'btn-secondary text-neutral-content'
            } w-24`}
            id='shift'>
            SHIFT
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='z'>
            z
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='x'>
            x
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='c'>
            c
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='v'>
            v
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='b'>
            b
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='n'>
            n
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='m'>
            m
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id=','>
            ,
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='.'>
            .
          </div>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id='/'>
            /
          </div>
          <div
            className={`keyboardKey ${
              keyboardState === 'shift'
                ? 'btn-success'
                : 'btn-secondary text-neutral-content'
            } w-24`}
            id='shift'>
            SHIFT
          </div>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <div
            className='keyboardKey btn-secondary text-neutral-content'
            id=' '>
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
        <div className='row-span-4 col-span-1 border-t bc'>
          {createKeyboardHTML()}
        </div>
      </div>
    );
  };

  return [keyboardHTML, keyboard];
};

export default useKeyboard;
