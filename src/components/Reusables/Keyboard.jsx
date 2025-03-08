import { useState } from 'react';
import * as React from 'react';

import closeSVG from '../../assets/appicons/close.svg';
import backSVG from '../../assets/appicons/backspace.svg';
import enterSVG from '../../assets/appicons/enter.svg';

import playBeep from '../../tools/playBeep.js';
import Button from './Button.jsx';

const useKeyboard = () => {
  const [promise, setPromise] = useState(null);
  const [keyboardValue, setKeyboardValue] = useState('');
  const [keyboardState, setKeyboardState] = useState('normal');
  const [initialValue, setInitialValue] = useState('');
  const [title, setTitle] = useState();

  // Code for creating the keyboard text string to be shown to the user

  const keyboard = (initialValue, title) =>
    new Promise((resolve) => {
      setKeyboardValue(initialValue);
      setInitialValue(initialValue);
      setTitle(title);
      setPromise({ resolve });
    });

  const handleClose = (keyboardResult) => {
    playBeep();
    promise?.resolve(keyboardResult);
    setPromise(null);
    setKeyboardValue('');
    setTitle();
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
        onClick={(event) => handleKeyboardClick(event)}>
        <div className='border bc rounded-btn p-2 col-span-1 row-span 1 text-3xl justify-between w-full num text-left normal-case'>
          {keyboardValue + '_'}
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <Button
            type='danger'
            id='exit'
            className='keyboardKey w-10'
            icon={closeSVG}></Button>
          <Button type='secondary' size='large' className='keyboardKey' id='1'>
            1
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='2'>
            2
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='3'>
            3
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='4'>
            4
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='5'>
            5
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='6'>
            6
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='7'>
            7
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='8'>
            8
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='9'>
            9
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='0'>
            0
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='-'>
            -
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='+'>
            +
          </Button>

          <Button
            type='warn'
            id='delete'
            className='keyboardKey w-16'
            icon={backSVG}></Button>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <Button type='secondary' id='clear' className='keyboardKey w-12'>
            CLR
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='q'>
            q
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='w'>
            w
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='e'>
            e
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='r'>
            r
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='t'>
            t
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='y'>
            y
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='u'>
            u
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='i'>
            i
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='o'>
            o
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='p'>
            p
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='('>
            (
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id=')'>
            )
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id=';'>
            ;
          </Button>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <Button
            type={keyboardState === 'caps' ? 'success' : 'secondary'}
            id='caps'
            className='keyboardKey w-20'>
            CAPS
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='a'>
            a
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='s'>
            s
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='d'>
            d
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='f'>
            f
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='g'>
            g
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='h'>
            h
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='j'>
            j
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='k'>
            k
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='l'>
            l
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id=':'>
            :
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id="'">
            '
          </Button>
          <Button
            type='primary'
            id='enter'
            className='keyboardKey w-20'
            icon={enterSVG}></Button>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <Button
            type={keyboardState === 'shift' ? 'success' : 'secondary'}
            size='large'
            className='keyboardKey w-24'
            id='shift'>
            SHIFT
          </Button>

          <Button type='secondary' size='large' className='keyboardKey' id='z'>
            z
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='x'>
            x
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='c'>
            c
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='v'>
            v
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='b'>
            b
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='n'>
            n
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='m'>
            m
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id=','>
            ,
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='.'>
            .
          </Button>
          <Button type='secondary' size='large' className='keyboardKey' id='/'>
            /
          </Button>
          <Button
            type={keyboardState === 'shift' ? 'success' : 'secondary'}
            size='large'
            className='keyboardKey  w-24'
            id='shift'>
            SHIFT
          </Button>
        </div>
        <div className='col-span-1 row-span-1 flex justify-between gap-2'>
          <Button type='secondary' size='large' className='keyboardKey' id=' '>
            SPACE
          </Button>
        </div>
      </div>
    );
  }

  const keyboardHTML = () => {
    if (promise === null) return;

    return (
      <div className='absolute top-0 bottom-0 right-0 left-0 h-screen w-screen z-20 grid grid-rows-6 grid-cols-1 fill-slate-300'>
        <div className='transparent row-span-2 col-span-1 cnter pt-8'>
          {!title ? (
            ''
          ) : (
            <div className='title bg-base-100 p-4 border bc'>{title}</div>
          )}
        </div>
        <div className='row-span-4 col-span-1 border-t bc'>
          {createKeyboardHTML()}
        </div>
      </div>
    );
  };

  return [keyboardHTML, keyboard];
};

export default useKeyboard;
